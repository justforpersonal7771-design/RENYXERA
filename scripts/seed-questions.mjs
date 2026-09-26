// Module 4B: load data/Aggregated_Output.json into Postgres with the public/private split.
// questions + question_options are public; correct answers go only to question_answers
// (RLS on, zero policies). Needs SUPABASE_SERVICE_ROLE_KEY in .env.local. Idempotent (upsert).
//   node scripts/seed-questions.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing");
const db = createClient(url, key, { auth: { persistSession: false } });

const papers = JSON.parse(readFileSync("data/Aggregated_Output.json", "utf8"));
const questions = [], options = [], answers = [];
let multiRange = 0;

for (const paper of papers) {
  const [yearStr, session] = (paper.exam_metadata?.["year-shift"] ?? "").split("-");
  for (const q of paper.questions) {
    questions.push({
      id: q.question_id, branch_code: "CSE", year: Number(yearStr) || null, session: session || null,
      question_no: q.question_no, question_type: q.question_type, marks: q.marks,
      section: q.section, subject: q.subject, topic: q.topic, difficulty: q.difficulty,
      question_text: q.question_text, has_image: !!q.has_image,
      image_paths: q.images_required ?? [],
    });
    for (const o of q.options ?? []) {
      options.push({ question_id: q.question_id, option_id: o.option_id, text: o.text ?? "" });
    }
    let natRanges = null;
    if (q.nat_answer_range) {
      natRanges = String(q.nat_answer_range).split(/\s+OR\s+/i).map((r) => {
        const nums = r.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
        return [nums[0] ?? null, nums[1] ?? nums[0] ?? null];
      });
      if (natRanges.length > 1) multiRange++;
    }
    answers.push({
      question_id: q.question_id,
      correct_option_ids: (q.options ?? []).filter((o) => o.is_correct).map((o) => o.option_id),
      nat_min: natRanges?.[0][0] ?? null, nat_max: natRanges?.[0][1] ?? null,
      nat_ranges: natRanges,
    });
  }
}

async function upsert(table, rows, onConflict) {
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await db.from(table).upsert(rows.slice(i, i + 500), { onConflict });
    if (error) throw new Error(`${table}: ${error.message}`);
  }
  console.log(`${table}: ${rows.length}`);
}

await upsert("questions", questions, "id");
await upsert("question_options", options, "question_id,option_id");
await upsert("question_answers", answers, "question_id");
await db.from("branches").update({ question_count: questions.length }).eq("code", "CSE");
console.log(`NAT questions with an "A OR B" answer (all ranges in nat_ranges): ${multiRange}`);
