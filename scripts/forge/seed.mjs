// Forge B5: load a validated batch into Supabase (needs migration 0040).
//   node --env-file=.env.local scripts/forge/seed.mjs data/forge/CS/batches/b000-pilot.json            (as draft)
//   node --env-file=.env.local scripts/forge/seed.mjs <batch> --approve --release=2026-11-01T06:00:00+05:30
// Run scripts/forge/validate.py first; this refuses a batch whose report is not "OK".
import { readFileSync, existsSync } from "node:fs";
import { basename } from "node:path";
import { createClient } from "@supabase/supabase-js";

const file = process.argv[2];
if (!file) throw new Error("usage: seed.mjs <batch.json> [--approve] [--release=ISO]");
const batch = JSON.parse(readFileSync(file, "utf8"));
const report = `data/forge/${batch.branch}/reports/${basename(file, ".json")}.txt`;
if (!existsSync(report) || readFileSync(report, "utf8").trim() !== "OK") throw new Error(`Validate first: ${report} is not OK`);
const approve = process.argv.includes("--approve");
const release = (process.argv.find((a) => a.startsWith("--release=")) ?? "").slice(10) || new Date().toISOString();
const BRANCH = { CS: "CSE", EC: "ECE", EE: "EE", ME: "ME", CE: "CE", DA: "DA" }[batch.branch];

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const items = batch.items.map((it) => ({
  id: it.id, branch: BRANCH, subject: it.subject, topic: it.topic, syllabus_code: it.syllabus_code ?? null, kind: it.kind,
  difficulty: it.difficulty, question_type: it.question_type, marks: it.marks, question_text: it.question_text,
  options: (it.options ?? []).map((o) => ({ option_id: o.option_id, text: o.text })), images: it.images ?? [],
  release_at: release, status: approve ? "approved" : "draft", mock_only: !!it.mock_only, updated_at: new Date().toISOString(),
}));
const answers = batch.items.map((it) => ({
  item_id: it.id,
  correct_option_ids: it.answer.options ?? [],
  nat_min: it.answer.range?.[0] ?? null, nat_max: it.answer.range?.[1] ?? null,
  solution: it.solution, verify: it.verify, updated_at: new Date().toISOString(),
}));
let r = await db.from("forge_items").upsert(items);
if (r.error) throw r.error;
r = await db.from("forge_answers").upsert(answers);
if (r.error) throw r.error;
console.log(`seeded ${items.length} ${batch.branch} items as ${approve ? "approved" : "draft"}, release ${release}`);
