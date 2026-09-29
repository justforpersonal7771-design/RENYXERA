// 7E: "Daily GATE CS question" for a Telegram channel (free Bot API), run by a scheduled
// GitHub Action. Picks one official PYQ per IST day (deterministic, no repeats until the bank
// is exhausted), posts its paper/subject/topic, the question text when it's plain text, and a
// link to solve it on the site. Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL (e.g. @renyxera).
// Usage: node scripts/telegram-daily.mjs [--dry-run]
import { readFileSync } from "node:fs";

const SITE = (process.env.SITE_URL || "https://gate.renyxera.workers.dev").replace(/\/$/, "");
const DRY = process.argv.includes("--dry-run");
const SHIFT = { FN: "Forenoon", AN: "Afternoon" };

const papers = JSON.parse(readFileSync(new URL("../public/data/questions.json", import.meta.url), "utf8"));
const pool = [];
for (const p of papers) {
  const ys = p.exam_metadata?.["year-shift"] ?? "";
  const [year, shift = ""] = ys.split("-");
  if (!year) continue;
  for (const q of p.questions) pool.push({ ...q, year, shift, slug: `gate-cs-${ys.toLowerCase()}` });
}
// Stable order (paper, question), shuffled once with a fixed seed so days don't walk one paper.
pool.sort((a, b) => a.question_id.localeCompare(b.question_id));
let seed = 20270206;
const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }

const istDay = Math.floor((Date.now() + 5.5 * 3600_000) / 86400_000);
const q = pool[istDay % pool.length];

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const plain = String(q.question_text ?? "");
const readable = !q.has_image && !/\\\(|\\\[|\$|\\begin|\[IMAGE/i.test(plain) && plain.length <= 700;
const date = new Date(istDay * 86400_000).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const link = `${SITE}/pyq/${q.slug}/q${q.question_no}?utm_source=telegram&utm_medium=social&utm_campaign=daily_question`;

const text = [
  `<b>🧠 GATE CS question of the day</b> · ${esc(date)}`,
  ``,
  `<b>GATE CS ${esc(q.year)}${q.shift ? ` (${esc(SHIFT[q.shift] ?? q.shift)})` : ""} · Q${esc(q.question_no)}</b>`,
  `${esc(q.subject)} → ${esc(q.topic)}`,
  `${esc(q.question_type)} · ${esc(q.marks)} mark${Number(q.marks) > 1 ? "s" : ""}${q.question_type === "MCQ" ? ` · −${Number(q.marks) === 2 ? "2/3" : "1/3"} if wrong` : ""}`,
  ``,
  readable ? esc(plain) : `<i>This one has a figure or maths — open it to read it properly.</i>`,
  ``,
  `👉 <a href="${link}">Solve it and check the official answer</a>`,
].join("\n");

if (DRY) { console.log(text); process.exit(0); }
const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHANNEL;
if (!token || !chat) { console.log("TELEGRAM_BOT_TOKEN / TELEGRAM_CHANNEL not set — skipping (dry run below)\n\n" + text); process.exit(0); }
const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: "POST", headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ chat_id: chat, text, parse_mode: "HTML", link_preview_options: { is_disabled: false } }),
});
const j = await r.json();
if (!j.ok) { console.error("Telegram error:", j.description); process.exit(1); }
console.log(`Posted ${q.question_id} to ${chat}`);
