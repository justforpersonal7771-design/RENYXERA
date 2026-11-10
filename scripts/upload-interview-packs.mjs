// Uploads the three quick-pack PDFs to the PRIVATE storage bucket the Interview "Last moments" page downloads from (owner-run).
// Usage: node --env-file=.env.local scripts/upload-interview-packs.mjs "D:/Projects/interview-books"
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2];
if (!root || !existsSync(root)) { console.error("Give the interview-books folder."); process.exit(1); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const BUCKET = "interview-private";
const PACKS = [
  ["_pack-revision/build/last-moments-pack.pdf", "packs/last-moments-pack.pdf"],
  ["_pack-snippets/build/snippet-book-all-books.pdf", "packs/snippet-book-all-books.pdf"],
  ["_pack-traps/build/traps-list-all-books.pdf", "packs/traps-list-all-books.pdf"],
];

const { data: buckets } = await db.storage.listBuckets();
if (!buckets?.some((b) => b.name === BUCKET)) {
  const { error } = await db.storage.createBucket(BUCKET, { public: false });
  if (error) { console.error("create bucket:", error.message); process.exit(1); }
  console.log("created private bucket", BUCKET);
}
for (const [src, dest] of PACKS) {
  const file = join(root, src);
  if (!existsSync(file)) { console.log("missing, skipped:", src); continue; }
  const { error } = await db.storage.from(BUCKET).upload(dest, readFileSync(file), { contentType: "application/pdf", upsert: true });
  console.log(error ? `FAILED ${dest}: ${error.message}` : `uploaded ${dest}`);
}
