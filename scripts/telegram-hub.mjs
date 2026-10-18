// Hub channel (TELEGRAM_CHANNEL): updates and brand news only, never questions.
//   1. GATE 2027 updates: when KEY_DATES / WHATS_CHANGED / CHECKED_ON in lib/seo/gate2027.ts change, post the
//      new facts (official-site facts only) with the source link. State is kept in content/hub-state.json.
//   2. Monday countdown to the first GATE 2027 exam day with the study-plan link.
//   3. Saturday reminder for the Sunday All-India mock.
// Brand news, offers and feature posts come from content/calendar.json (scripts/social-publish.mjs).
// Usage: node scripts/telegram-hub.mjs [--dry]   Needs TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const SITE = (process.env.SITE_URL || "https://gate.renyxera.workers.dev").replace(/\/$/, "");
const DRY = process.argv.includes("--dry");
const STATE = "content/hub-state.json";
const src = readFileSync("lib/seo/gate2027.ts", "utf8");
const facts = (name) => {
  const start = src.indexOf(`export const ${name}: Fact[] = [`);
  const m = start < 0 ? null : [0, src.slice(start, src.indexOf("\n];", start))];
  if (!m) return [];
  return [...m[1].matchAll(/\{\s*label:\s*"((?:[^"\\]|\\.)*)",\s*value:\s*"((?:[^"\\]|\\.)*)"/g)].map((x) => ({ label: x[1], value: x[2] }));
};
const checked = src.match(/CHECKED_ON = "([^"]+)"/)?.[1] ?? "";
const dates = facts("KEY_DATES"), changes = facts("WHATS_CHANGED");
const hash = createHash("sha256").update(JSON.stringify([checked, dates, changes])).digest("hex").slice(0, 16);
const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, "utf8")) : {};
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const utm = (path, c) => `${SITE}${path}?utm_source=telegram&utm_medium=hub&utm_campaign=${c}`;

const ist = new Date(Date.now() + 5.5 * 3600e3);
const today = ist.toISOString().slice(0, 10), dow = ist.getUTCDay(); // 0 Sun .. 6 Sat
const posts = [];
if (state.hash !== hash) {
  posts.push({ key: "updates", text: [
    `📣 <b>GATE 2027 update</b> (official site, checked ${esc(checked)})`, "",
    ...dates.map((d) => `📅 <b>${esc(d.label)}:</b> ${esc(d.value)}`), "",
    ...changes.map((c) => `• <b>${esc(c.label)}.</b> ${esc(c.value)}`), "",
    `Dates can change: confirm on gate2027.iitm.ac.in.`,
    `👉 <a href="${utm("/gate-updates", "gate2027_update")}">Everything that changed, by branch</a>`,
  ].join("\n") });
}
if (dow === 1 && state.countdown !== today) {
  const days = Math.ceil((Date.UTC(2027, 1, 6) - Date.UTC(ist.getUTCFullYear(), ist.getUTCMonth(), ist.getUTCDate())) / 86400e3);
  if (days > 0) posts.push({ key: "countdown", text: `⏳ <b>${days} days</b> to GATE 2027 (first exam day: 6 Feb 2027).\nMake this week count: <a href="${utm("/tools/gate-study-plan", "countdown")}">build your plan</a>. Your branch channel has today's question.` });
}
if (dow === 6 && state.mock !== today) {
  posts.push({ key: "mock", text: `🏆 <b>Tomorrow: the free All-India mock.</b> Same paper for everyone, live rank after you submit.\n👉 <a href="${utm("/mocks", "mock_reminder")}">Open the mock</a>` });
}
if (!posts.length) { console.log("hub: nothing new"); process.exit(0); }
const token = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHANNEL;
for (const p of posts) {
  if (DRY || !token || !chat) { console.log(`[${p.key}]\n${p.text}\n`); continue; }
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ chat_id: chat, text: p.text, parse_mode: "HTML", link_preview_options: { is_disabled: true } }) });
  const j = await r.json();
  if (!j.ok) { console.error("Telegram error:", j.description); process.exit(1); }
  if (p.key === "updates") state.hash = hash; else state[p.key] = today;
  console.log(`hub: posted ${p.key}`);
}
if (!DRY && token && chat) writeFileSync(STATE, JSON.stringify(state, null, 2) + "\n");
