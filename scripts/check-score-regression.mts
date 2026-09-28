// 5B acceptance: 100 random attempts graded on the server vs the client's grading of the
// same answers must agree exactly. Uses the source bank (data/Aggregated_Output.json) as the
// client-side key and the live grader (Postgres keys) as the server.
//   node --experimental-strip-types --no-warnings scripts/check-score-regression.mts [baseUrl] [attempts]
// Not in CI (network + the grader's 20/min rate limit) â€” run after changing grading or keys.
import { readFileSync } from "node:fs";
import { isResponseCorrect, marksFor, natRangesOf, parseNatRanges } from "../lib/grading.ts";

const BASE = process.argv[2] ?? "https://gate.renyxera.workers.dev";
const N = Number(process.argv[3] ?? 100);
// Normalise NAT keys the way the app's repository does ("a to b OR c to d" â†’ ranges).
const bank: any[] = JSON.parse(readFileSync("data/Aggregated_Output.json", "utf8")).flatMap((p: any) => p.questions)
  .map((q: any) => (typeof q.nat_answer_range === "string" ? { ...q, nat_answer_range: { ranges: parseNatRanges(q.nat_answer_range) } } : q));
let seed = 20260928;
const rnd = () => ((seed = (seed * 1103515245 + 12345) >>> 0) / 2 ** 32);
const pick = <T,>(a: T[]) => a[Math.floor(rnd() * a.length)];

function answerFor(q: any): { sel?: string[]; nat?: number } | null {
  const r = rnd();
  if (r < 0.2) return null; // skipped
  const correct = (q.options ?? []).filter((o: any) => o.is_correct).map((o: any) => o.option_id);
  if (q.question_type === "NAT") {
    const ranges = natRangesOf(q.nat_answer_range);
    if (!ranges.length) return { nat: 0 };
    const { min: lo, max: hi } = pick(ranges);
    const v = r < 0.45 ? lo : r < 0.6 ? hi : r < 0.75 ? (lo + hi) / 2 : hi + 1 + rnd() * 5; // edges, middle, wrong
    // Open-ended ranges (Â±Infinity) aren't answers anyone can type â€” use the finite edge.
    const finite = Number.isFinite(v) ? v : Number.isFinite(lo) ? lo : Number.isFinite(hi) ? hi : 0;
    return { nat: Math.round(finite * 1000) / 1000 };
  }
  const ids = (q.options ?? []).map((o: any) => o.option_id);
  if (r < 0.55) return { sel: correct.length ? correct : [ids[0]] };
  if (q.question_type === "MSQ" && r < 0.7) return { sel: correct.slice(0, Math.max(1, correct.length - 1)) }; // partial = wrong
  return { sel: [pick(ids.filter((i: string) => !correct.includes(i))) ?? ids[0]] };
}

let mismatches = 0;
const diff = new Set<string>();
for (let t = 0; t < N; t++) {
  const size = 5 + Math.floor(rnd() * 30);
  const qs = Array.from({ length: size }, () => pick(bank)).filter((q, i, a) => a.findIndex((x) => x.question_id === q.question_id) === i);
  const responses: any[] = [];
  const mine = new Map<string, boolean>();
  let client = 0;
  for (const q of qs) {
    const a = answerFor(q);
    responses.push({ question_id: q.question_id, ...(a?.sel ? { selected_option_ids: a.sel } : {}), ...(a?.nat !== undefined ? { nat_value: a.nat } : {}) });
    const correct = !!a && isResponseCorrect(q, a.sel, a.nat ?? null);
    client += marksFor(q.question_type, Number(q.marks), !!a, correct);
    if (a) mine.set(q.question_id, correct);
  }
  client = Math.round(client * 100) / 100;
  let res: Response;
  for (;;) {
    res = await fetch(`${BASE}/api/exam/grade`, { method: "POST", headers: { "content-type": "application/json", origin: BASE }, body: JSON.stringify({ responses }) });
    if (res.status !== 429) break;
    await new Promise((r) => setTimeout(r, 15_000));
  }
  const j = await res.json();
  const ok = res.ok && Math.abs(j.score - client) < 1e-9;
  if (res.ok && !ok) for (const r of j.results ?? []) if (mine.has(r.question_id) && mine.get(r.question_id) !== r.is_correct) diff.add(`${r.question_id} (client ${mine.get(r.question_id)}, server ${r.is_correct})`);
  if (!ok) { mismatches++; console.log(`FAIL attempt ${t + 1}: client ${client} vs server ${j.score ?? res.status}`, res.ok ? "" : JSON.stringify(j.issues ?? j).slice(0, 300)); if (!res.ok && t < 1) process.exit(1); }
  else if ((t + 1) % 10 === 0) console.log(`â€¦ ${t + 1}/${N} agree`);
}
if (diff.size) console.log("\nQuestions graded differently:\n  " + [...diff].join("\n  "));
console.log(mismatches ? `\n${mismatches} of ${N} attempts disagree` : `\nAll ${N} attempts: server and client scores agree exactly`);
process.exit(mismatches ? 1 : 0);
