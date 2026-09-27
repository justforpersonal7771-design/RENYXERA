// Checks the per-person mock question order (Step 11b). Runs in CI:
//   npm run check:mock-order
// Same paper for everyone, GA first, Maths + Core CS mixed, stable per person — and the
// score is identical whatever the order (grading is keyed by question id).
import { readFileSync } from "node:fs";
import { mockOrder } from "../lib/exam/mock-order.ts";
import { isResponseCorrect, marksFor } from "../lib/grading.ts";

let failed = 0;
const ok = (name: string, cond: boolean, detail = "") => {
  if (!cond) failed++;
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? "  (" + detail + ")" : ""}`);
};

// A paper in the scheduler's official split: 10 GA, 9 Maths, 46 Core.
const bank = JSON.parse(readFileSync("data/Aggregated_Output.json", "utf8"));
const all: any[] = bank.flatMap((p: any) => p.questions).map((q: any) => ({ ...q, id: q.question_id }));
const pick = (re: RegExp, n: number) => all.filter((q) => re.test(q.section ?? "")).slice(0, n);
const paper = [...pick(/APTITUDE/i, 10), ...pick(/MATHEMATICAL/i, 9), ...pick(/CORE/i, 46)];
ok("sample paper has 65 questions", paper.length === 65, String(paper.length));
const byId = new Map<string, any>(paper.map((q) => [q.id, q]));
const ids = paper.map((q) => q.id);
const isGA = (id: string) => /APTITUDE/i.test(byId.get(id)?.section ?? "");

const mock = "7c1f4b1e-0000-4000-8000-000000000001";
const a = mockOrder(ids, "user-a", mock, isGA);
const b = mockOrder(ids, "user-b", mock, isGA);
ok("same questions for everyone", a.length === ids.length && new Set(a).size === ids.length && a.every((x) => byId.has(x)));
ok("GA always first", a.slice(0, 10).every(isGA) && b.slice(0, 10).every(isGA));
ok("then Maths + Core, mixed", a.slice(10).every((x) => !isGA(x)) && a.slice(10, 19).some((x) => /CORE/i.test(byId.get(x).section)));
ok("different people get different orders", a.join() !== b.join());
ok("same person gets the same order (reload / other device)", a.join() === mockOrder(ids, "user-a", mock, isGA).join());
ok("next mock reshuffles", a.join() !== mockOrder(ids, "user-a", "7c1f4b1e-0000-4000-8000-000000000002", isGA).join());
ok("input not mutated", ids.join() === paper.map((q) => q.id).join());

// Score is order-independent: answer a fixed pattern keyed by id, grade in each order.
const correctOpts = (q: any) => (q.options ?? []).filter((o: any) => o.is_correct).map((o: any) => o.option_id);
const natOf = (q: any) => { const r = q.nat_answer_range; const m = String(r ?? "").match(/-?\d+(\.\d+)?/); return m ? Number(m[0]) : null; };
// Pattern keyed by position in the ORIGINAL paper (i.e. by id): right / wrong / skipped.
const respond = (q: any, i: number) => {
  if (i % 3 === 2) return null;
  if (q.question_type === "NAT") return { sel: undefined, nat: i % 3 === 0 ? natOf(q) : -99999 };
  return { sel: i % 3 === 0 ? correctOpts(q) : ["Z"], nat: null };
};
// Rounded to 2 decimals exactly like /api/exam/grade (float sums of −⅓ differ in the 15th
// digit by order; rounding makes stored scores — and therefore ranks — order-independent).
const score = (order: string[]) => Math.round(100 * order.reduce((s, id) => {
  const q = byId.get(id); const r = respond(q, ids.indexOf(id));
  const correct = !!r && isResponseCorrect(q, r.sel, r.nat);
  return s + marksFor(q.question_type, Number(q.marks), !!r, correct);
}, 0)) / 100;
const s0 = score(ids), sa = score(a), sb = score(b);
ok("score identical in every order", s0 === sa && sa === sb && s0 > 0, `${s0} / ${sa} / ${sb}`);

if (failed) { console.error(`\n${failed} check(s) failed`); process.exit(1); }
console.log("\nAll mock-order checks passed");
