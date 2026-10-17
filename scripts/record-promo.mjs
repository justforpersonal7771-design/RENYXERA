// Records real, moving footage of the live product for the promo film (no static screenshots).
//   1. npm run build && npx next start -p 3000     (or point BASE at the deployed site)
//   2. BASE=http://localhost:3000 node scripts/record-promo.mjs
// Output: video/captures/<scene>.webm and <scene>.marks.json (the second each beat happens).
// Guest session only: the sign-in only parts (planner, analytics, Telegram) are listed in archive/docs/PROMO_VIDEO_MASTER_PROMPT.md
// as "capture required" and are not faked here.
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "video/captures";
const W = 1600, H = 900; // 16:9 desktop layout; the film scales it up to 1080p
mkdirSync(OUT, { recursive: true });

// A visible cursor and tap ripple, drawn in the page so it ends up in the recording.
const CURSOR = () => {
  const mk = () => {
    if (document.getElementById("__cur")) return;
    const s = document.createElement("style");
    s.textContent = `#__cur{position:fixed;left:0;top:0;width:40px;height:40px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px);transition:transform 60ms linear;filter:drop-shadow(0 3px 6px rgba(76,29,149,.45))}
#__cur svg{width:40px;height:40px}
.__rip{position:fixed;z-index:2147483646;pointer-events:none;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;border:3px solid rgba(124,58,237,.9);animation:__rip .55s ease-out forwards}
@keyframes __rip{to{transform:scale(4.2);opacity:0}}`;
    document.head.appendChild(s);
    const c = document.createElement("div");
    c.id = "__cur";
    c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3 2l7.6 18.2 2.4-7.6 7.6-2.4z" fill="#fff" stroke="#4c1d95" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.body.appendChild(c);
    addEventListener("mousemove", (e) => { c.style.transform = `translate(${e.clientX - 3}px,${e.clientY - 2}px)`; }, true);
    addEventListener("mousedown", (e) => { const r = document.createElement("div"); r.className = "__rip"; r.style.left = e.clientX + "px"; r.style.top = e.clientY + "px"; document.body.appendChild(r); setTimeout(() => r.remove(), 650); }, true);
  };
  if (document.body) mk(); else addEventListener("DOMContentLoaded", mk);
};

let pos = { x: W / 2, y: H / 2 };
// Moves are animated inside the page (requestAnimationFrame) instead of one CDP call per step: while a video is being recorded
// the per-step calls were so slow that a 1.6 s scroll took half a minute and looked like a slideshow.
async function glide(page, x, y, ms = 650) {
  await page.evaluate(({ from, to, ms }) => new Promise((res) => {
    const c = document.getElementById("__cur"); const t0 = performance.now();
    const e = (k) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
    const step = (t) => { const k = Math.min(1, (t - t0) / ms), q = e(k); if (c) c.style.transform = `translate(${from.x + (to.x - from.x) * q - 3}px,${from.y + (to.y - from.y) * q - 2}px)`; k < 1 ? requestAnimationFrame(step) : res(); };
    requestAnimationFrame(step);
  }), { from: { ...pos }, to: { x, y }, ms });
  await page.mouse.move(x, y);
  pos = { x, y };
}
async function tap(page, locator, { ms = 650, hold = 350 } = {}) {
  await locator.scrollIntoViewIfNeeded({ timeout: 15000 }).catch(() => {});
  const b = await locator.boundingBox();
  if (!b) throw new Error("no box for tap target");
  await glide(page, b.x + b.width / 2, b.y + b.height / 2, ms);
  await page.waitForTimeout(120);
  await page.mouse.down(); await page.waitForTimeout(70); await page.mouse.up();
  await page.waitForTimeout(hold);
}
// Smooth, eased scroll of the app's main scrolling area.
async function smoothScroll(page, dy, ms = 1200) {
  await page.evaluate(({ dy, ms }) => new Promise((res) => {
    const els = [...document.querySelectorAll("*")].filter((e) => /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.scrollHeight > e.clientHeight + 20);
    const el = els.sort((a, b) => b.clientHeight - a.clientHeight)[0] || document.scrollingElement;
    const start = el.scrollTop, t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms); const q = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; el.scrollTop = start + dy * q; k < 1 ? requestAnimationFrame(step) : res(); };
    requestAnimationFrame(step);
  }), { dy, ms });
}

// Playwright's recordVideo captures the page at its CSS size: a 1600x900 viewport gives native 1600x900 footage at a steady
// frame rate (the DevTools screencast was tried first but dropped to about 10 fps at this size). Each scene is a .webm plus
// <scene>.marks.json with the second each beat happens, used to cut the edit.
async function scene(browser, name, fn) {
  const RAW = `video/.raw-${name}`;
  rmSync(RAW, { recursive: true, force: true });
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, recordVideo: { dir: RAW, size: { width: W, height: H } } });
  await ctx.addInitScript(() => { try { sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} });
  await ctx.addInitScript(CURSOR);
  const t0 = Date.now();
  const page = await ctx.newPage();
  pos = { x: W * 0.5, y: H * 0.6 };
  const marks = {};
  const mark = (k) => { marks[k] = Math.round((Date.now() - t0) / 100) / 10; };
  try { await fn(page, mark); } catch (e) { console.log(`  ${name}: stopped early (${String(e.message).slice(0, 120)})`); }
  mark("end");
  await page.waitForTimeout(500);
  await ctx.close();
  const f = readdirSync(RAW).find((x) => x.endsWith(".webm"));
  renameSync(`${RAW}/${f}`, `${OUT}/${name}.webm`);
  rmSync(RAW, { recursive: true, force: true });
  writeFileSync(`${OUT}/${name}.marks.json`, JSON.stringify(marks, null, 1));
  console.log(`recorded ${name} (${marks.end}s)`, marks);
}

// Correct options come from the local question files, so the film shows a real, correct answer instead of a guess.
const norm = (t) => String(t).toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").trim();
const KEYS = new Map();
for (const f of ["data/Aggregated_Output.json", ...["DA", "EC", "EE", "ME"].map((c) => `data/pyq/${c}/gate_${c.toLowerCase()}_pyqs.json`)]) {
  if (!existsSync(f)) continue;
  for (const paper of JSON.parse(readFileSync(f, "utf8"))) for (const q of paper.questions) {
    const ok = (q.options ?? []).filter((o) => o.is_correct).map((o) => o.option_id);
    if (q.question_type === "MCQ" && ok.length === 1) KEYS.set(norm(q.question_text).slice(0, 70), ok[0]);
  }
}
async function answerCorrectly(p) {
  const text = norm(await p.evaluate(() => document.body.innerText));
  for (const [k, letter] of KEYS) {
    if (k.length < 20 || !text.includes(k)) continue;
    for (const el of await p.getByText(new RegExp(`^${letter}$`)).all()) if (await el.isVisible()) { await tap(p, el, { ms: 700 }); return letter; }
  }
  return null; // not an MCQ we have a key for; the caller moves on
}

const browser = await chromium.launch();
const only = process.argv[2];
const run = (n) => !only || only === n;

if (run("home")) await scene(browser, "home", async (p, mark) => {
  await p.goto(BASE + "/", { waitUntil: "load" });
  await p.waitForTimeout(2200); mark("hero");
  await smoothScroll(p, 640, 1600); mark("scrolled");
  await p.waitForTimeout(900);
  await smoothScroll(p, -640, 1000);
  await p.waitForTimeout(700);
});

if (run("practice")) await scene(browser, "practice", async (p, mark) => {
  await p.goto(BASE + "/setup", { waitUntil: "load" });
  await p.waitForSelector("text=Deployment Type", { timeout: 30000 });
  await p.waitForTimeout(1500); mark("setup");
  await tap(p, p.getByText("Official Year Paper", { exact: true }).first());
  await tap(p, p.getByText("Topic Spotlight", { exact: true }).last()); mark("topicMode");
  await p.waitForTimeout(500);
  await tap(p, p.getByText("CORE CS", { exact: true }).first());
  await tap(p, p.getByText("GENERAL APTITUDE (GA)", { exact: true }).first()); mark("section");
  await p.waitForTimeout(600);
  await tap(p, p.getByText("Analytical Aptitude", { exact: true }).first());
  await p.waitForTimeout(500);
  await p.waitForTimeout(700); mark("subject");
  await tap(p, p.getByRole("button", { name: /generate blueprint/i }).first()); mark("generate");
  await p.waitForTimeout(1800); mark("blueprint");
  const asGuest = async () => { const g = p.getByRole("button", { name: /continue as guest/i }); if (await g.count()) { await g.first().click(); await p.waitForTimeout(800); } };
  await asGuest();
  await tap(p, p.getByRole("button", { name: /deploy session/i }).first(), { ms: 800 }); mark("deploy");
  await p.waitForTimeout(1200); await asGuest();
  if (!/exam\/session/.test(p.url())) { const d = p.getByRole("button", { name: /deploy session/i }); if (await d.count()) await d.first().click(); }
  await p.waitForURL(/exam\/session/, { timeout: 60000 });
  await p.waitForFunction(() => !document.body.innerText.includes("Loading Exam Engine"), null, { timeout: 60000 });
  await p.waitForTimeout(1800); mark("question");
  await p.waitForTimeout(900);
  await answerCorrectly(p); mark("answer");
  await p.waitForTimeout(500);
  await tap(p, p.getByRole("button", { name: "Calculator", exact: true })); mark("calc");
  const calc = p.getByRole("dialog", { name: "Calculator" });
  for (const k of ["3", "0", "cos"]) await tap(p, calc.getByRole("button", { name: k, exact: true }), { ms: 420, hold: 220 });
  await p.waitForTimeout(900); mark("calcDone");
  await p.mouse.click(300, 900); await p.waitForTimeout(500);
  await tap(p, p.getByRole("button", { name: /save & next/i }).first()); mark("next");
  await p.waitForTimeout(700);
  for (const q of ["q2", "q3", "q4", "q5"]) { await answerCorrectly(p); mark(q); await tap(p, p.getByRole("button", { name: /save & next/i }).first()); await p.waitForTimeout(500); }
  await tap(p, p.getByRole("button", { name: /^submit/i }).first()); await p.waitForTimeout(700);
  await tap(p, p.getByRole("button", { name: /submit (test|exam|now)|yes, submit|confirm/i }).first()); mark("submit");
  await tap(p, p.getByRole("button", { name: /see my results/i }), { ms: 700 });
  await p.waitForURL(/exam\/results/, { timeout: 60000 });
  await p.waitForTimeout(2600); mark("results");
  await smoothScroll(p, 520, 1600); await p.waitForTimeout(1200); mark("analysis");
});

if (run("tools")) await scene(browser, "tools", async (p, mark) => {
  await p.goto(BASE + "/tools/gate-branch-cutoffs", { waitUntil: "load" });
  await p.waitForSelector("table", { timeout: 30000 }); await p.waitForTimeout(1800); mark("table");
  await smoothScroll(p, 620, 1500); await p.waitForTimeout(500); mark("calculator");
  const slider = p.getByLabel("Marks slider");
  const b = await slider.boundingBox();
  if (b) {
    await glide(p, b.x + b.width * 0.25, b.y + b.height / 2, 700);
    await p.mouse.down();
    for (let i = 1; i <= 24; i++) { await p.mouse.move(b.x + b.width * (0.25 + 0.53 * i / 24), b.y + b.height / 2); await p.waitForTimeout(40); }
    await p.mouse.up();
  }
  await p.waitForTimeout(1200); mark("slider");
  await p.goto(BASE + "/ga-lessons", { waitUntil: "load" });
  await p.waitForTimeout(1600); mark("lessons");
  await smoothScroll(p, 700, 1800); await p.waitForTimeout(900);
});

if (run("plans")) await scene(browser, "plans", async (p, mark) => {
  await p.goto(BASE + "/pro", { waitUntil: "load" });
  await p.waitForTimeout(2200);
  const monthly = p.getByText("Monthly", { exact: true });
  if (await monthly.count()) await tap(p, monthly.first());
  await p.waitForTimeout(900); mark("plans");
  await smoothScroll(p, 640, 1800); await p.waitForTimeout(1200); mark("compare");
  await smoothScroll(p, 700, 1800); await p.waitForTimeout(900);
});

await browser.close();
