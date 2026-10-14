// Compares the answers in the source bank file with the keys stored in Postgres (what students are graded against).
//   node --env-file=.env.local scripts/compare-keys-to-bank.mjs
// Any difference means a student could be graded against a different answer than the one transcribed from the paper.
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const file = process.argv[2] ?? "data/Aggregated_Output.json";
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const qs = data.flatMap((p) => p.questions);

const keys = new Map();
for (let from = 0; ; from += 1000) {
  const { data: rows, error } = await s.from("question_answers").select("*").range(from, from + 999);
  if (error) throw new Error(error.message);
  for (const r of rows) keys.set(r.question_id, r);
  if (rows.length < 1000) break;
}

let checked = 0;
let skippedNat = 0;
const diffs = [];
for (const q of qs) {
  const k = keys.get(q.question_id);
  if (!k) { diffs.push(`${q.question_id}: no key in the database`); continue; }
  checked++;
  if (q.question_type === "NAT") {
    const r = q.nat_answer_range;
    if (!r || r.min == null) { skippedNat++; continue; } // the source file carries no NAT answer, the database is the only copy
    const dbRanges = k.nat_ranges?.length ? k.nat_ranges : k.nat_min != null ? [[k.nat_min, k.nat_max]] : [];
    const mine = r?.ranges?.length ? r.ranges.map((x) => [x.min, x.max]) : r ? [[r.min, r.max]] : [];
    if (JSON.stringify(mine) !== JSON.stringify(dbRanges)) diffs.push(`${q.question_id}: NAT ${JSON.stringify(mine)} in the file, ${JSON.stringify(dbRanges)} in the database`);
  } else {
    const mine = q.options.filter((o) => o.is_correct).map((o) => o.option_id).sort().join(",");
    const db = [...(k.correct_option_ids ?? [])].sort().join(",");
    if (mine !== db) diffs.push(`${q.question_id}: ${mine} in the file, ${db} in the database`);
  }
}
console.log(`${qs.length} questions in the file, ${checked} compared (${skippedNat} NAT answers exist only in the database)`);
console.log(`${diffs.length} difference(s)`);
for (const d of diffs) console.log("  " + d);
process.exit(diffs.length ? 1 : 0);
