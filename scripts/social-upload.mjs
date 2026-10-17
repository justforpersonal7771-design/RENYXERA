// Upload a video/image to a public Supabase Storage bucket ("social") so Instagram can fetch it.
// Run locally:  node scripts/social-upload.mjs video/out/renyxera-film-v6-vertical.mp4
// Prints the public URL to paste into content/calendar.json as "media_url".
import { readFileSync, statSync } from "node:fs";
import { basename } from "node:path";
import { createClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const file = process.argv[2];
if (!file) throw new Error("usage: node scripts/social-upload.mjs <file>");
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const BUCKET = "social";
const { data: buckets } = await db.storage.listBuckets();
if (!buckets?.some((b) => b.name === BUCKET)) {
  const { error } = await db.storage.createBucket(BUCKET, { public: true, fileSizeLimit: "50MB" });
  if (error) throw error;
}
const mb = statSync(file).size / 1e6;
if (mb > 50) throw new Error(`${file} is ${mb.toFixed(1)} MB; the free tier allows 50 MB per file. Export a smaller cut (crf 23, 1080x1920).`);
const key = `${Date.now()}-${basename(file)}`;
const type = file.endsWith(".mp4") ? "video/mp4" : file.endsWith(".png") ? "image/png" : "image/jpeg";
const { error } = await db.storage.from(BUCKET).upload(key, readFileSync(file), { contentType: type, upsert: false });
if (error) throw error;
console.log(db.storage.from(BUCKET).getPublicUrl(key).data.publicUrl);
