// Loads the interview library into the private Interview tables (owner-run; needs migration 0056 applied).
// Usage: node --env-file=.env.local scripts/seed-interview.mjs "D:/Projects/interview-books"
// Reads each book folder (book.md + chapters, revision sheet, back matter, labs) and the flashcard CSVs. Safe to re-run (upsert).
import { createClient } from "@supabase/supabase-js";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const root = process.argv[2];
if (!root || !existsSync(root)) { console.error("Give the interview-books folder."); process.exit(1); }
const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const fm = (t) => { const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/); return { head: m ? m[1] : "", body: m ? t.slice(m[0].length) : t }; };
const val = (head, k) => { const m = head.match(new RegExp("^" + k + ":\\s*\"?(.*?)\"?\\s*$", "m")); return m ? m[1] : ""; };
const LANG = { ".py": "python", ".sql": "sql", ".mjs": "javascript", ".js": "javascript", ".cs": "csharp", ".cpp": "cpp", ".ts": "typescript" };

const docs = [], cards = [];
for (const d of readdirSync(root).sort()) {
  const dir = join(root, d);
  if (!statSync(dir).isDirectory() || !existsSync(join(dir, "book.md"))) continue;
  const bookTitle = val(fm(readFileSync(join(dir, "book.md"), "utf8")).head, "title") || d;
  const add = (id, kind, ord, title, body, meta = {}) => docs.push({ id: `${d}:${id}`, book: d, book_title: bookTitle, kind, ord, title, body, meta });
  add("overview", "chapter", 0, "About this book", fm(readFileSync(join(dir, "book.md"), "utf8")).body, { star: false });
  const ch = join(dir, "chapters");
  if (existsSync(ch)) for (const f of readdirSync(ch).filter((x) => x.endsWith(".md")).sort()) {
    const { head, body } = fm(readFileSync(join(ch, f), "utf8"));
    add(f.replace(/\.md$/, ""), "chapter", Number(val(head, "chapter")) || Number(f.slice(0, 2)) || 1, val(head, "title") || f, body, { star: val(head, "star") === "true", level: Number(val(head, "level")) || 1, minutes: Number(val(head, "minutes")) || 0, likelihood: val(head, "likelihood") });
  }
  const one = (rel, id, kind, title, ord) => { const p = join(dir, rel); if (existsSync(p)) add(id, kind, ord, title, fm(readFileSync(p, "utf8")).body); };
  one("final-revision-sheet.md", "revision", "revision", "Final revision sheet", 900);
  one("backmatter/traps.md", "traps", "traps", "Traps", 910);
  one("backmatter/glossary.md", "glossary", "glossary", "Glossary", 920);
  one("backmatter/snippets.md", "snippets", "snippets", "Key snippets", 930);
  const lab = join(dir, "labs");
  if (existsSync(lab)) {
    const files = readdirSync(lab);
    for (const f of files.sort()) {
      const ext = f.slice(f.lastIndexOf("."));
      if (!LANG[ext] || statSync(join(lab, f)).isDirectory()) continue;
      const out = [f + ".out", f.replace(/\.[^.]+$/, ".out")].find((o) => files.includes(o));
      add("lab-" + f, "lab", 1000, f, readFileSync(join(lab, f), "utf8"), { lang: LANG[ext], expected: out ? readFileSync(join(lab, out), "utf8").slice(0, 8000) : "" });
    }
  }
  const csv = join(dir, "build", `${d}-flashcards.csv`);
  if (existsSync(csv)) {
    const text = readFileSync(csv, "utf8").replace(/^\uFEFF/, "");
    const rows = []; let row = [], cur = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) { if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
      else if (c === '"') q = true; else if (c === ";") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur.replace(/\r$/, "")); rows.push(row); row = []; cur = ""; } else cur += c;
    }
    if (cur || row.length) { row.push(cur); rows.push(row); }
    const seen = new Set();
    for (const [front, back0, tags] of rows) {
      if (!front || !tags) continue;
      const parts = tags.trim().split(/\s+/); const type = parts[0]; const star = parts[parts.length - 1] === "star";
      const chn = (star ? parts.slice(1, -1) : parts.slice(1)).join(" ").replace(/_/g, " ");
      let back = back0, more = ""; const k = back0.indexOf("\n\nMore: "); if (k >= 0) { back = back0.slice(0, k); more = back0.slice(k + 8); }
      const id = d + ":" + createHash("sha1").update(type + front).digest("hex").slice(0, 10);
      if (seen.has(id)) continue; seen.add(id);
      cards.push({ id, book: d, book_title: bookTitle, type, ch: chn, star, front, back, more });
    }
  }
}
async function put(table, rows) { for (let i = 0; i < rows.length; i += 100) { const { error } = await db.from(table).upsert(rows.slice(i, i + 100)); if (error) { console.error(table, error.message); process.exit(1); } } console.log(table, rows.length); }
await put("interview_docs", docs);
await put("interview_cards", cards);
