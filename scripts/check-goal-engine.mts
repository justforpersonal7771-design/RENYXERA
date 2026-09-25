// Acceptance check for the Dynamic Exam Goals Engine (master plan 4E-3):
// "Changing Target Rank measurably changes the next recommended question set —
//  demonstrated in a test, not asserted."
//
// Runs the real engine against the real question bank. No test framework needed:
//   npm run check:goals
// Exits non-zero if any check fails.
import { readFileSync } from "node:fs";
import { computeTopicFrequencies, filterOfficialQuestions } from "../lib/analytics/goal-slider-engine.ts";
import { computeGoalPlan, marksForRank, rankForMarks, defaultExamDate } from "../lib/goals/goal-engine.ts";

const papers = JSON.parse(readFileSync(new URL("../data/Aggregated_Output.json", import.meta.url), "utf8"));
const questions = papers.flatMap((p: any) =>
  p.questions.map((q: any) => ({ ...q, year: String(p.exam_metadata?.year ?? "") })),
);
const ranked = computeTopicFrequencies(filterOfficialQuestions(questions as any));

let failed = 0;
const check = (label: string, ok: boolean, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
  if (!ok) failed++;
};

const base = { examDate: "2027-02-13", today: "2026-09-26", dailyHours: 4, measuredAccuracy: null, questionsAttempted: 0 };
const plan = (targetRank: number | null, extra: Partial<typeof base> = {}) => computeGoalPlan(ranked, { ...base, ...extra, targetRank });

console.log(`Question bank: ${questions.length} questions, ${ranked.length} ranked topics\n`);

// 1. The acceptance criterion itself.
const air100 = plan(100);
const air5000 = plan(5000);
const set100 = new Set(air100.includedTopics.map((t) => `${t.subject}::${t.topic}`));
const set5000 = new Set(air5000.includedTopics.map((t) => `${t.subject}::${t.topic}`));
const onlyIn100 = [...set100].filter((k) => !set5000.has(k));
check("AIR 100 vs AIR 5000 recommend different topic sets", onlyIn100.length > 0,
  `AIR 100: ${set100.size} topics / ${air100.recommendedPercent}% · AIR 5000: ${set5000.size} topics / ${air5000.recommendedPercent}% · ${onlyIn100.length} extra topics for AIR 100`);
check("a harder target never recommends less", air100.recommendedPercent >= air5000.recommendedPercent);
check("the easier target's set is a subset of the harder one's", [...set5000].every((k) => set100.has(k)));

// 2. Monotonic across the whole range.
const ranks = [10, 100, 500, 1000, 2000, 5000, 10000];
const pcts = ranks.map((r) => plan(r).recommendedPercent);
check("recommended % never rises as the target rank gets easier", pcts.every((p, i) => i === 0 || p <= pcts[i - 1]), ranks.map((r, i) => `AIR ${r}: ${pcts[i]}%`).join(", "));

// 3. Closed loop: measured accuracy changes the plan.
const lowAcc = plan(1000, { measuredAccuracy: 55, questionsAttempted: 200 });
const highAcc = plan(1000, { measuredAccuracy: 85, questionsAttempted: 200 });
check("lower measured accuracy needs more coverage", lowAcc.recommendedPercent > highAcc.recommendedPercent, `55% acc → ${lowAcc.recommendedPercent}%, 85% acc → ${highAcc.recommendedPercent}%`);
check("measured accuracy is ignored below the minimum sample", plan(1000, { measuredAccuracy: 20, questionsAttempted: 5 }).accuracyIsMeasured === false);

// 4. Honest feasibility.
const rushed = plan(2000, { dailyHours: 0.5 });
check("too few hours is flagged, with a nearer achievable rank", rushed.status === "time" && (rushed.achievableRank ?? 0) > 2000, `status ${rushed.status}, achievable ≈ AIR ${rushed.achievableRank}`);
const weak = plan(1, { measuredAccuracy: 45, questionsAttempted: 300 });
check("an accuracy-bound target says so", weak.status === "accuracy" && weak.accuracyNeeded !== null, `needs ≈ ${weak.accuracyNeeded}% accuracy`);
check("no target keeps the full syllabus", plan(null).recommendedPercent === 100 && plan(null).status === "no-target");

// 5. Helpers.
check("rank→marks→rank round-trips within 5%", [100, 500, 2000, 8000].every((r) => Math.abs(rankForMarks(marksForRank(r)) - r) / r < 0.05));
check("default exam date is the second Saturday of February", defaultExamDate(2027) === "2027-02-13" && new Date("2027-02-13T00:00:00Z").getUTCDay() === 6, defaultExamDate(2027));

console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
