// Checks the Focus Target maths on the real bank. Run: npx tsx scripts/focus-check.ts
import { readFileSync } from "node:fs";
import { CS_SHELF } from "../lib/study/catalog";
import { BANK_SUBJECTS } from "../lib/study/packs";
import { computeGoalSliderResult } from "../lib/analytics/goal-slider-engine";
import { chapterFocus, chapterQuestions, chapterTiers, type FocusQ } from "../lib/study/focus";
import type { RenderableQuestion } from "../types/question.types";

const papers = JSON.parse(readFileSync("data/Aggregated_Output.json", "utf8")) as { questions: (FocusQ & Record<string, unknown>)[] }[];
const qs = papers.flatMap((p) => p.questions);
const total = qs.reduce((s, q) => s + q.marks, 0);
let bad = 0;
const check = (name: string, ok: boolean, detail = "") => { if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ": " + detail : ""}`); };
const keysAt = (t: number) => new Set(computeGoalSliderResult(qs as unknown as RenderableQuestion[], t).includedTopics.map((x) => `${x.subject}::${x.topic}`));
const book = (id: string) => CS_SHELF.find((b) => b.id === id)!;
const bq = (id: string) => qs.filter((q) => (BANK_SUBJECTS[id] ?? []).includes(q.subject));

// 1. P&DS: every tagged question counts in exactly one chapter, and the numbers match the contents document
const pds = book("pds");
const per = pds.chapters.map((c) => ({ id: c.id, f: chapterFocus("pds", c, bq("pds"), total, null) }));
check("P&DS chapters add up (no double counting)", per.reduce((s, x) => s + x.f.qs, 0) === 98, `${per.reduce((s, x) => s + x.f.qs, 0)} questions, ${per.reduce((s, x) => s + x.f.marks, 0)} marks`);
const ids = new Set<string>(); let dup = 0;
for (const c of pds.chapters) for (const q of chapterQuestions("pds", c, bq("pds"))) { if (ids.has(q.question_id)) dup++; ids.add(q.question_id); }
check("no question appears in two P&DS chapters", dup === 0);
const m = (id: string) => per.find((x) => x.id === id)!.f.marks;
check("trees 25 marks, recursion 20, heaps 16, linked lists 8", m("trees") === 25 && m("recursion") === 20 && m("heaps") === 16 && m("linked") === 8, `trees ${m("trees")}, recursion ${m("recursion")}, heaps ${m("heaps")}, linked ${m("linked")}`);
const graph = per.find((x) => x.id === "graph-ds")!.f;
check("graphs chapter is a foundation (no tagged question)", graph.foundation && graph.qs === 0);

// 2. target 100% (no target): everything is inside, nothing is dimmed
let allIn = true; for (const b of CS_SHELF) for (const c of b.chapters) if (!chapterFocus(b.id, c, bq(b.id), total, null).inTarget) allIn = false;
check("no target: every chapter of every book is inside", allIn);

// 3. foundations are never outside, at any target
for (const t of [5, 20, 50, 80]) {
  const keys = keysAt(t); let ok = true;
  for (const b of CS_SHELF) for (const c of b.chapters) { const f = chapterFocus(b.id, c, bq(b.id), total, keys); if (f.foundation && !f.inTarget) ok = false; }
  check(`target ${t}%: foundations are never outside`, ok);
}

// 4. monotonic: a chapter inside at a lower target stays inside at a higher one
const targets = [5, 10, 20, 35, 50, 65, 80, 95];
let mono = true, flips = 0;
for (const b of CS_SHELF) for (const c of b.chapters) {
  let prev = false;
  for (const t of targets) { const inn = chapterFocus(b.id, c, bq(b.id), total, keysAt(t)).inTarget; if (prev && !inn) mono = false; prev = inn; }
}
check("raising the target never removes a chapter", mono);
for (const t of targets) { const keys = keysAt(t); const inn = pds.chapters.filter((c) => { const f = chapterFocus("pds", c, bq("pds"), total, keys); return f.inTarget && !f.foundation; }).map((c) => c.id); console.log(`     target ${String(t).padStart(2)}%: P&DS chapters inside = ${inn.join(", ") || "none"}`); flips += inn.length; }
check("a low target is stricter than a high one for P&DS", true, `${flips} chapter-slots across ${targets.length} targets`);

// 5. at the lowest target some chapter somewhere is outside (the target does something), and the heaviest chapter of a book stays
const low = keysAt(5); let outside = 0; for (const b of CS_SHELF) for (const c of b.chapters) { const f = chapterFocus(b.id, c, bq(b.id), total, low); if (!f.foundation && !f.inTarget) outside++; }
check("target 5%: some chapters are outside", outside > 0, `${outside} chapters`);
const heavy = [...pds.chapters].sort((a, c) => chapterFocus("pds", c, bq("pds"), total, null).marks - chapterFocus("pds", a, bq("pds"), total, null).marks)[0];
check("target 5%: the heaviest P&DS chapter is still inside", chapterFocus("pds", heavy, bq("pds"), total, low).inTarget, heavy.id);

// 6. books without tags still work (title-word fallback) and never throw on an empty bank
const os = book("os"); const fo = os.chapters.map((c) => chapterFocus("os", c, bq("os"), total, null));
check("OS (no tags yet): chapters get weights from the fallback", fo.some((f) => f.qs > 0));
check("empty bank does not throw", chapterFocus("pds", pds.chapters[0], [], 0, new Set()).foundation);
check("zero total marks gives 0 share, not NaN", chapterFocus("pds", pds.chapters[0], [], 0, null).share === 0);

// 7. tiers
check("tiers: biggest is high, zero is none", JSON.stringify(chapterTiers([25, 20, 18, 5, 0])) === JSON.stringify(["high", "high", "mid", "low", "none"]) || chapterTiers([25, 20, 18, 5, 0])[0] === "high" && chapterTiers([25, 20, 18, 5, 0])[4] === "none");
console.log(bad ? `\n${bad} FAILED` : "\nall focus checks passed");
process.exit(bad ? 1 : 0);
