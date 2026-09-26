// Integrity check for the question bank in Postgres (run after seeding):
//   node --env-file=.env.local scripts/check-answer-keys.mjs
// Every question has a key; MCQ exactly 1 correct, MSQ >= 1, NAT has valid ranges;
// every correct option exists; no ranges on non-NAT; options are unique A–D.
import { createClient } from "@supabase/supabase-js";

const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function all(table, cols) {
  const out = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await s.from(table).select(cols).range(from, from + 999);
    if (error) throw new Error(`${table}: ${error.message}`);
    out.push(...data);
    if (data.length < 1000) return out;
  }
}

const [questions, answers, options] = await Promise.all([
  all("questions", "id,question_type,question_text"),
  all("question_answers", "*"),
  all("question_options", "question_id,option_id,text"),
]);
const keyOf = new Map(answers.map((a) => [a.question_id, a]));
const optsOf = {};
for (const o of options) (optsOf[o.question_id] ??= []).push(o);

const issues = [], notes = [];
const bad = (id, msg) => issues.push(`${id}: ${msg}`);
for (const q of questions) {
  const k = keyOf.get(q.id), opts = optsOf[q.id] ?? [], ids = opts.map((o) => o.option_id);
  if (!q.question_text?.trim()) bad(q.id, "empty question text");
  if (!k) { bad(q.id, "no answer key"); continue; }
  const n = k.correct_option_ids.length;
  if (q.question_type === "NAT") {
    if (!k.nat_ranges?.length) bad(q.id, "NAT without a range");
    for (const [lo, hi] of k.nat_ranges ?? []) {
      if (typeof lo !== "number" || typeof hi !== "number" || lo > hi) bad(q.id, `bad NAT range [${lo}, ${hi}]`);
    }
    if (n) bad(q.id, "NAT has correct options");
  } else {
    if (k.nat_ranges) bad(q.id, "range on a non-NAT question");
    if (ids.length < 2) bad(q.id, `only ${ids.length} options`);
    if (new Set(ids).size !== ids.length) bad(q.id, "duplicate option ids");
    // Official keys sometimes accept 2 answers, or all 4 ("marks to all"): graded as "any of these".
    if (q.question_type === "MCQ" && n === 0) bad(q.id, "MCQ with no correct option");
    if (q.question_type === "MCQ" && n > 1) notes.push(`${q.id}: MCQ accepts ${n === ids.length ? "any option (marks to all)" : k.correct_option_ids.join(" or ")}`);
    if (q.question_type === "MSQ" && n < 1) bad(q.id, "MSQ with no correct option");
    for (const c of k.correct_option_ids) if (!ids.includes(c)) bad(q.id, `key ${c} is not an option`);
    for (const o of opts) if (!o.text?.trim()) bad(q.id, `option ${o.option_id} is empty`);
  }
}
const orphans = answers.filter((a) => !questions.some((q) => q.id === a.question_id)).length;
if (orphans) issues.push(`${orphans} answer rows without a question`);

console.log(`${questions.length} questions · ${options.length} options · ${answers.length} keys`);
if (notes.length) console.log("NOTE  official multi-answer keys:\n  " + notes.join("\n  "));
console.log(issues.length ? `FAIL  ${issues.length} issue(s):\n  ` + issues.join("\n  ") : "PASS  every answer key is consistent");
process.exitCode = issues.length ? 1 : 0;
