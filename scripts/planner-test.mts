import { buildSchedule, phaseShares, studyDays } from "../lib/planner/generate";

let failed = 0;
const check = (name: string, ok: boolean, extra = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? ` — ${extra}` : ""}`); if (!ok) failed++; };

const sections = [{ title: "Algorithms", share: 0.3 }, { title: "OS", share: 0.2 }, { title: "Maths", share: 0.15 }, { title: "DBMS", share: 0.1 }];
const base = { start: "2026-10-12", examDate: "2027-02-06", weekdays: [1, 2, 3, 4, 5, 6], hoursPerDay: 4, startTime: "06:00", sections, marks: {}, includeRevision: true, includeMocks: true, includeMistakes: true };

const days = studyDays("2026-10-12", "2026-10-19", [1, 3]);
check("study days respect weekdays", days.join() === "2026-10-12,2026-10-14", days.join());
check("exam day is not scheduled", !studyDays("2026-02-01", "2026-02-06", [0, 1, 2, 3, 4, 5, 6]).includes("2026-02-06"));
const p = phaseShares(20, true, true);
check("phase shares sum to 1", Math.abs(p.learn + p.revise + p.mock - 1) < 1e-9);
check("no mocks folds into revision", phaseShares(20, true, false).mock === 0);

const r = buildSchedule(base);
check("events are produced for every phase", ["learn", "revise", "mock"].every((ph) => r.events.some((e) => e.phase === ph)));
check("every event is before the exam and on a study weekday", r.events.every((e) => e.date < base.examDate && base.weekdays.includes(new Date(`${e.date}T00:00:00Z`).getUTCDay())));
const learnByDay: Record<string, number> = {};
for (const e of r.events.filter((x) => x.phase === "learn")) learnByDay[e.date] = (learnByDay[e.date] ?? 0) + e.durationMin;
check("the learning phase never exceeds the daily budget", Object.values(learnByDay).every((m) => m <= base.hoursPerDay * 60 + 1));
const byDate: Record<string, typeof r.events> = {};
for (const e of r.events) (byDate[e.date] ??= []).push(e);
check("blocks on one day never overlap", Object.values(byDate).every((l) => l.every((e, i) => i === 0 || e.startTime >= l[i - 1].endTime)));

const mins = (res: typeof r) => res.events.filter((e) => e.phase === "learn" && e.subject === "DBMS").reduce((n, e) => n + e.durationMin, 0);
const heavy = buildSchedule({ ...base, marks: { DBMS: "weak" } }), light = buildSchedule({ ...base, marks: { DBMS: "strong" } });
check("a weak section gets more time than a strong one", mins(heavy) > mins(light), `${mins(heavy)} vs ${mins(light)}`);

const learnTotal = r.events.filter((e) => e.phase === "learn").reduce((n, e) => n + e.durationMin, 0) / 60;
check("learning hours add up to the budget", Math.abs(learnTotal - r.phases.learn * 4) < 3, `${learnTotal} vs ${r.phases.learn * 4}`);

const short = buildSchedule({ ...base, start: "2027-01-28" });
check("a short runway still produces a plan", short.events.length > 0 && short.events.every((e) => e.date < base.examDate));
check("nothing is scheduled when the start is past the exam", buildSchedule({ ...base, start: "2027-03-01" }).events.length === 0);
console.log(failed ? `\n${failed} check(s) failed` : "\nAll planner checks passed");
process.exit(failed ? 1 : 0);
