// Adds the senior, scenario-based interview packs (content/interview/senior-pack-*.json) to interview_cards (owner-run).
// Usage: node --env-file=.env.local scripts/seed-interview-senior.mjs        (upserts by id; safe to re-run)
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const dir = "content/interview";
const files = readdirSync(dir).filter((f) => /^senior-pack-\d+\.json$/.test(f)).sort();
const { data: books } = await db.from("interview_cards").select("book,book_title").limit(5000);
const titleOf = new Map((books ?? []).map((b) => [b.book, b.book_title]));
let n = 0;
for (const f of files) {
  const rows = JSON.parse(readFileSync(join(dir, f), "utf8")).map((c) => ({
    id: c.id, book: c.book, book_title: titleOf.get(c.book) ?? c.book, type: c.type, ch: "Senior interview", star: true, front: c.front, back: c.back, more: c.more ?? "",
  }));
  const missing = rows.filter((r) => !titleOf.has(r.book)).map((r) => r.id);
  if (missing.length) console.log(`${f}: unknown book for ${missing.join(", ")}`);
  const { error } = await db.from("interview_cards").upsert(rows, { onConflict: "id" });
  console.log(error ? `FAILED ${f}: ${error.message}` : `${f}: ${rows.length} cards`);
  if (!error) n += rows.length;
}
console.log(`done: ${n} senior cards`);
