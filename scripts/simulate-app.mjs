// Frame-accurate 4K simulation of the real RENYXERA app for the promo film.
//
// The page clock is frozen (Playwright clock) and advanced exactly one video frame at a time. Between frames the script
// moves the real mouse, presses, types and scrolls, so the app's own hover states, menus and animations play out naturally
// and every action lands on a known frame. Each frame is a 3840x2160 JPEG (1600x900 layout at 2.4x device pixels).
//
//   npm run build && npx next start -p 3000
//   BASE=http://localhost:3000 PLANS_BASE=https://gate.renyxera.workers.dev node --env-file=.env.local scripts/simulate-app.mjs [take ...]
// Signed in as the demo account (DEMO_EMAIL); GUEST=1 films as a guest.
//
// Output per take: video/public/takes/<take>/NNNNN.jpg and video/public/takes/<take>.json
//   { frames, cursor: [[x, y], ...] (CSS px per frame), clicks: [frame, ...], marks: { name: frame } }
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PLANS_BASE = process.env.PLANS_BASE ?? "https://gate.renyxera.workers.dev";
const OUT = "video/public/takes";
const FPS = 30;
const DPR = 2.4;
const only = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });

// Answer keys from the local data, so the film always picks the right option.
const norm = (t) => String(t).toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").trim();
const KEYS = new Map();
for (const f of ["data/Aggregated_Output.json", ...["DA", "EC", "EE", "ME"].map((c) => `data/pyq/${c}/gate_${c.toLowerCase()}_pyqs.json`)]) {
  if (!existsSync(f)) continue;
  for (const paper of JSON.parse(readFileSync(f, "utf8"))) for (const q of paper.questions) {
    const ok = (q.options ?? []).filter((o) => o.is_correct).map((o) => o.option_id);
    if (q.question_type === "MCQ" && ok.length === 1) KEYS.set(norm(q.question_text).slice(0, 70), ok[0]);
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

class Take {
  constructor(page, name) {
    this.page = page; this.name = name; this.n = 0; this.cursor = []; this.clicks = []; this.marks = {};
    this.pos = { x: 1200, y: 650 };
    this.dir = `${OUT}/${name}`;
    rmSync(this.dir, { recursive: true, force: true });
    mkdirSync(this.dir, { recursive: true });
  }
  async tick() { const ms = Math.round(((this.n + 1) * 1000) / FPS) - Math.round((this.n * 1000) / FPS); await this.page.clock.runFor(ms); }
  async frame(k = 1) {
    for (let i = 0; i < k; i++) {
      await this.tick();
      await this.page.screenshot({ path: `${this.dir}/${String(this.n).padStart(5, "0")}.jpg`, type: "jpeg", quality: 90 });
      this.cursor.push([Math.round(this.pos.x), Math.round(this.pos.y)]);
      this.n++;
    }
  }
  mark(k) { this.marks[k] = this.n; }
  async at(target) {
    if (typeof target.x === "number") return target;
    await target.scrollIntoViewIfNeeded({ timeout: 5000 }).catch(() => {});
    const b = await target.boundingBox();
    if (!b) throw new Error(`${this.name}: no box for a target`);
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }
  async move(target, frames = 14) {
    const to = await this.at(target), from = { ...this.pos };
    for (let i = 1; i <= frames; i++) {
      const t = easeInOut(i / frames);
      this.pos = { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
      await this.page.mouse.move(this.pos.x, this.pos.y);
      await this.frame();
    }
  }
  async click(target, frames = 14, after = 8) {
    if (target) await this.move(target, frames);
    await this.page.mouse.down(); this.clicks.push(this.n); await this.frame(2);
    await this.page.mouse.up(); await this.frame(after);
  }
  async drag(from, to, frames = 40, after = 12) {
    await this.move(from, 12);
    await this.page.mouse.down(); this.clicks.push(this.n);
    const a = await this.at(from), b = await this.at(to);
    for (let i = 1; i <= frames; i++) {
      const t = easeInOut(i / frames);
      this.pos = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      await this.page.mouse.move(this.pos.x, this.pos.y);
      await this.frame();
    }
    await this.page.mouse.up(); await this.frame(after);
  }
  async scroll(dy, frames = 30) {
    let done = 0;
    for (let i = 1; i <= frames; i++) {
      const target = Math.round(dy * easeInOut(i / frames));
      await this.page.mouse.wheel(0, target - done); done = target;
      await this.frame();
    }
  }
  save() {
    writeFileSync(`${OUT}/${this.name}.json`, JSON.stringify({ frames: this.n, w: 1600, h: 900, dpr: DPR, cursor: this.cursor, clicks: this.clicks, marks: this.marks }));
    console.log(`take ${this.name}: ${this.n} frames, clicks at ${this.clicks.join(", ")}`);
  }
}

// Let the frozen clock run (without capturing) until a condition holds: page loads, network, timers.
async function settle(page, until, maxMs = 30000) {
  const end = Date.now() + maxMs;
  while (Date.now() < end) {
    await page.clock.runFor(100); await sleep(40);
    if (!until || (await until())) { for (let i = 0; i < 12; i++) { await page.clock.runFor(100); await sleep(25); } return; }
  }
  throw new Error("settle timed out");
}

// Signed-in demo account (password sign-in is captcha-protected, so: admin magic link -> session cookies).
const DEMO_EMAIL = process.env.DEMO_EMAIL ?? "justforpersonal7774@gmail.com";
let jar = null;
async function sessionCookies() {
  if (jar) return jar;
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email: DEMO_EMAIL });
  if (error) throw error;
  const out = [];
  const ssr = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, {
    cookies: { getAll: () => out.map(({ name, value }) => ({ name, value })), setAll: (list) => { for (const c of list) { const i = out.findIndex((x) => x.name === c.name); if (i >= 0) out.splice(i, 1); out.push(c); } } },
  });
  const v = await ssr.auth.verifyOtp({ token_hash: data.properties.hashed_token, type: "magiclink" });
  if (v.error) throw v.error;
  jar = out;
  return jar;
}

async function newPage(browser, signedIn = process.env.GUEST !== "1", host = "localhost") {
  const ctx = signedIn && host === "localhost"
    ? await persistent({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: DPR })
    : await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: DPR });
  if (signedIn) {
    const cookies = await sessionCookies();
    await ctx.addCookies(cookies.map((c) => ({ name: c.name, value: c.value, domain: host, path: "/", secure: host !== "localhost", sameSite: "Lax" })));
  }
  await ctx.addInitScript(() => { try { sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} });
  const page = ctx.pages()[0] ?? (await ctx.newPage());
  // CLOCK_AT (ISO time) sets the app's clock, e.g. 2026-10-15T01:12:00+05:30 for the midnight dashboard greeting
  await page.clock.install(process.env.CLOCK_AT ? { time: new Date(process.env.CLOCK_AT) } : undefined);
  return page;
}
async function go(page, url, ready) { page.goto(url).catch(() => {}); await settle(page, ready, 60000); }
const has = (page, text) => async () => (await page.getByText(text).count()) > 0;
const visible = async (loc) => { for (const el of await loc.all()) if (await el.isVisible()) return el; return null; };
async function correctOption(page) {
  const text = norm(await page.evaluate(() => document.body.innerText));
  for (const [k, letter] of KEYS) {
    if (k.length < 20 || !text.includes(k)) continue;
    const el = await visible(page.getByText(new RegExp(`^${letter}$`)));
    if (el) return el;
  }
  return null;
}

// Real GPU rasterising (Direct3D through ANGLE): about 9x faster than the default software renderer at 4K.
const GPU_ARGS = ["--use-angle=d3d11", "--enable-gpu-rasterization", "--ignore-gpu-blocklist", "--enable-gpu"];
const browser = await chromium.launch({ args: GPU_ARGS });
// One persistent browser profile for seeding, peeking and filming, so the demo account's local history (IndexedDB) is
// the same in every run.
const PROFILE = "video/.profile";
async function persistent(opts) { return chromium.launchPersistentContext(PROFILE, { headless: true, args: GPU_ARGS, ...opts }); }
// PEEK=/route: a plain signed-in screenshot (no frozen clock) to check what a page shows before filming it.
if (process.env.PEEK) {
  const ctx = await persistent({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  const cookies = await sessionCookies();
  await ctx.addCookies(cookies.map((c) => ({ name: c.name, value: c.value, domain: "localhost", path: "/", sameSite: "Lax" })));
  await ctx.addInitScript(() => { try { sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} });
  const pg = ctx.pages()[0] ?? (await ctx.newPage());
  await pg.goto(BASE + process.env.PEEK, { waitUntil: "load" }); await sleep(Number(process.env.PEEK_WAIT ?? 7000));
  await pg.screenshot({ path: "D:/tmp/peek.png" });
  console.log((await pg.evaluate(() => document.body.innerText)).slice(0, 600));
  await ctx.close(); await browser.close(); process.exit(0);
}
// SEED=1: give the demo account real history by taking a few topic tests in real time (about 70% right, like a
// student mid-preparation), so the dashboard, analytics and revision scenes have genuine data to show.
if (process.env.SEED) {
  const ctx = await persistent({ viewport: { width: 1600, height: 900 } });
  const cookies = await sessionCookies();
  await ctx.addCookies(cookies.map((c) => ({ name: c.name, value: c.value, domain: "localhost", path: "/", sameSite: "Lax" })));
  await ctx.addInitScript(() => { try { sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} });
  const pg = ctx.pages()[0] ?? (await ctx.newPage());
  const plan = JSON.parse(process.env.SEED_PLAN ?? '[["CORE CS", 0], ["CORE CS", 3], ["GENERAL APTITUDE (GA)", 1], ["MATHEMATICAL FOUNDATIONS", 0], ["CORE CS", 6], ["GENERAL APTITUDE (GA)", 3]]');
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  for (const [section, subjectIdx] of plan) {
    await pg.goto(BASE + "/setup", { waitUntil: "load" });
    await pg.getByText("Deployment Type").waitFor({ timeout: 60000 }); await sleep(1500);
    await pg.getByText("Official Year Paper", { exact: true }).first().click(); await sleep(400);
    await pg.getByText("Topic Spotlight", { exact: true }).last().click(); await sleep(600);
    await pg.getByText("CORE CS", { exact: true }).first().click(); await sleep(400);
    await pg.getByText(section, { exact: true }).last().click(); await sleep(600);
    // open the subject list and pick by position
    const subjField = pg.locator("text=Target Subject").locator("xpath=following::button[1]");
    await subjField.click(); await sleep(400);
    const opts = pg.getByRole("option");
    const count = await opts.count();
    if (count) await opts.nth(Math.min(subjectIdx, count - 1)).click(); else await pg.keyboard.press("Escape");
    await sleep(600);
    await pg.getByRole("button", { name: /generate blueprint/i }).first().click(); await sleep(1500);
    await pg.getByRole("button", { name: /deploy session/i }).first().click();
    await pg.waitForURL(/exam\/session/, { timeout: 60000 });
    await pg.waitForFunction(() => !document.body.innerText.includes("Loading Exam Engine"), null, { timeout: 60000 }); await sleep(1200);
    const total = Number((await pg.evaluate(() => document.body.innerText)).match(/1\/(\d+)/)?.[1] ?? 10);
    for (let i = 0; i < total; i++) {
      const text = norm(await pg.evaluate(() => document.body.innerText));
      let letter = null;
      for (const [k, l] of KEYS) if (k.length >= 20 && text.includes(k)) { letter = l; break; }
      {
        // known key: right about 70% of the time; unknown key: a plain guess, as a student would
        const pick = letter ? (rnd() < 0.7 ? letter : "ABCD".replace(letter, "")[Math.floor(rnd() * 3)]) : "ABCD"[Math.floor(rnd() * 4)];
        const el = await visible(pg.getByText(new RegExp(`^${pick}$`)));
        if (el) { await el.click(); await sleep(250); }
      }
      await pg.getByRole("button", { name: /save & next/i }).first().click(); await sleep(450);
    }
    await pg.getByRole("button", { name: /^submit/i }).first().click(); await sleep(600);
    await pg.getByRole("button", { name: /submit (test|exam|now)|yes, submit|confirm/i }).first().click();
    await pg.getByRole("button", { name: /see my results/i }).click({ timeout: 60000 });
    await pg.waitForURL(/exam\/results/, { timeout: 60000 }); await sleep(4000);
    console.log("seeded", section, subjectIdx, "questions", total);
  }
  await sleep(3000);
  await ctx.close(); await browser.close(); process.exit(0);
}
const want = (n) => !only.length || only.includes(n);

// ---------- home: a slow glide down the dashboard ----------
if (want("home")) {
  const page = await newPage(browser);
  await go(page, BASE + "/", has(page, "Conquer your"));
  for (let i = 0; i < 40; i++) { await page.clock.runFor(100); await sleep(50); }
  const t = new Take(page, "home");
  t.pos = { x: 1250, y: 700 };
  await t.frame(10);
  await t.move(page.getByText("Start practice session").first(), 22); t.mark("cta");
  await t.frame(18);
  await t.move({ x: 1300, y: 250 }, 20); t.mark("stats");
  await t.frame(16);
  t.save();
  await page.context().close();
}

// ---------- setup -> exam -> results (one session, three takes) ----------
if (want("setup") || want("exam") || want("results")) {
  const page = await newPage(browser);
  await go(page, BASE + "/setup", has(page, "Deployment Type"));
  const s = new Take(page, "setup");
  s.pos = { x: 1250, y: 640 };
  await s.frame(8);
  await s.click(page.getByText("Official Year Paper", { exact: true }).first(), 16, 10); s.mark("deployOpen");
  await s.click(page.getByText("Topic Spotlight", { exact: true }).last(), 12, 10); s.mark("topic");
  await s.click(page.getByText("CORE CS", { exact: true }).first(), 12, 9); s.mark("sectionOpen");
  await s.click(page.getByText("GENERAL APTITUDE (GA)", { exact: true }).first(), 12, 9); s.mark("section");
  await s.click(page.getByText("Analytical Aptitude", { exact: true }).first(), 14, 9); s.mark("subjectOpen");
  await s.click(page.getByText("Analytical Aptitude", { exact: true }).last(), 10, 9); s.mark("subject");
  await s.click(page.getByRole("button", { name: /generate blueprint/i }).first(), 16, 36); s.mark("blueprint");
  s.save();

  // guests may be asked to continue as a guest (not filmed)
  const guest = async () => { const g = page.getByRole("button", { name: /continue as guest/i }); if (await g.count()) { await g.first().click(); await settle(page); } };
  await guest();
  const e = new Take(page, "exam");
  e.pos = { ...s.pos };
  await page.getByRole("button", { name: /deploy session/i }).first().click();
  await settle(page, async () => /exam\/session/.test(page.url()) || (await page.getByRole("button", { name: /continue as guest/i }).count()) > 0, 30000);
  await guest();
  if (!/exam\/session/.test(page.url())) { await page.getByRole("button", { name: /deploy session/i }).first().click(); }
  await settle(page, async () => /exam\/session/.test(page.url()) && !(await page.getByText("Loading Exam Engine").count()), 60000);
  // start the filmed part on a question whose answer key we have (skipping, off camera, any we don't)
  {
    const pre = new Take(page, "_pre");
    pre.pos = { ...e.pos };
    for (let i = 0; i < 6 && !(await correctOption(page)); i++) await pre.click(page.getByRole("button", { name: /save & next/i }).first(), 6, 8);
    e.pos = { ...pre.pos };
    rmSync(pre.dir, { recursive: true, force: true });
  }
  await e.frame(10);
  const opt = await correctOption(page);
  if (opt) { await e.click(opt, 18, 10); e.mark("answer"); }
  await e.click(page.getByRole("button", { name: "Calculator", exact: true }), 16, 12); e.mark("calc");
  const calc = page.getByRole("dialog", { name: "Calculator" });
  for (const k of ["3", "0", "cos"]) await e.click(calc.getByRole("button", { name: k, exact: true }), 9, 4);
  e.mark("calcDone");
  await e.frame(16);
  await e.click({ x: 420, y: 520 }, 14, 8);
  await e.click(page.getByRole("button", { name: /save & next/i }).first(), 16, 14); e.mark("next");
  e.save();

  // the rest of the answers, not filmed, so the result reflects a real attempt
  // Answer a few more questions with the same click routine as the filmed ones (frames go to a scratch take).
  const scratch = new Take(page, "_scratch");
  scratch.pos = { ...e.pos };
  for (let i = 0; i < 5; i++) {
    const o = (await correctOption(page)) ?? (await visible(page.getByText(/^A$/)));
    if (o) await scratch.click(o, 8, 6);
    await scratch.click(page.getByRole("button", { name: /save & next/i }).first(), 8, 8);
  }
  rmSync(scratch.dir, { recursive: true, force: true });
  const r = new Take(page, "results");
  r.pos = { x: 1100, y: 500 };
  await r.frame(4);
  await r.click(page.getByRole("button", { name: /^submit/i }).first(), 16, 14); r.mark("dialog");
  await r.click(page.getByRole("button", { name: /submit (test|exam|now)|yes, submit|confirm/i }).first(), 14, 6);
  await settle(page, async () => (await page.getByRole("button", { name: /see my results/i }).count()) > 0, 30000);
  await r.click(page.getByRole("button", { name: /see my results/i }), 14, 2); r.mark("toResults");
  await settle(page, async () => /exam\/results/.test(page.url()) && (await page.getByText(/accuracy/i).count()) > 0, 60000);
  r.mark("results");
  r.pos = { x: 1250, y: 760 };
  await r.frame(70);
  await r.move(page.getByRole("button", { name: /review answers/i }).first(), 24); r.mark("review");
  await r.frame(40);
  r.save();
  await page.context().close();
}

// ---------- dashboard: hover over the live stats ----------
if (want("dash")) {
  const page = await newPage(browser);
  await go(page, BASE + "/", has(page, "Conquer your"));
  for (let i = 0; i < 40; i++) { await page.clock.runFor(100); await sleep(50); }
  const t = new Take(page, "dash");
  t.pos = { x: 700, y: 760 };
  await t.frame(10);
  await t.move({ x: 1050, y: 210 }, 22); t.mark("streak");
  await t.frame(8);
  await t.move({ x: 1250, y: 210 }, 14); t.mark("solved");
  await t.frame(8);
  await t.move({ x: 1440, y: 430 }, 18); t.mark("readiness");
  await t.frame(14);
  await t.move(page.getByText("Ask AI Mentor").first(), 20); t.mark("ask");
  await t.frame(16);
  t.save();
  await page.context().close();
}

// ---------- AI Tutor: the explanation, the coach list, then a typed follow-up ----------
if (want("tutor")) {
  const page = await newPage(browser);
  await go(page, BASE + "/ai-tutor?qid=" + (process.env.TUTOR_QID ?? "GATE_CS_2017_AN_Q20"), has(page, "STEP-BY-STEP"), 120000);
  for (let i = 0; i < 20; i++) { await page.clock.runFor(100); await sleep(50); }
  const t = new Take(page, "tutor");
  t.pos = { x: 1000, y: 700 };
  await t.frame(12); t.mark("answer");
  await t.move({ x: 860, y: 470 }, 26);
  await t.frame(14);
  await t.click(page.getByText(/^Coach:/).first(), 18, 30); t.mark("coaches");
  await page.keyboard.press("Escape"); await t.frame(6);
  const input = page.getByPlaceholder(/Ask follow-up/);
  await t.click(input, 18, 6); t.mark("typing");
  for (const ch of "Why is option A wrong?") { await page.keyboard.type(ch); await t.frame(2); }
  await t.frame(6);
  await t.click(page.locator("button:has(svg.lucide-send), button[aria-label*='Send' i]").last(), 12, 4); t.mark("sent");
  // keep filming while the real answer arrives (network time is real; frames are captured as it comes in)
  const before = (await page.evaluate(() => document.body.innerText)).length;
  for (let i = 0; i < 260; i++) {
    await t.frame();
    const now = (await page.evaluate(() => document.body.innerText)).length;
    if (i > 40 && now > before + 400 && !(await page.getByText(/compiling|thinking/i).count())) break;
  }
  t.mark("followup");
  await t.scroll(500, 40);
  await t.frame(30);
  t.save();
  await page.context().close();
}

// ---------- AI Mentor ----------
if (want("mentor")) {
  const page = await newPage(browser);
  await go(page, BASE + "/ai-mentor", has(page, "READINESS PREDICTOR"), 60000);
  for (let i = 0; i < 30; i++) { await page.clock.runFor(100); await sleep(50); }
  const t = new Take(page, "mentor");
  t.pos = { x: 700, y: 700 };
  await t.frame(10);
  await t.move({ x: 380, y: 240 }, 24); t.mark("message");
  await t.frame(16);
  await t.move({ x: 1260, y: 215 }, 22); t.mark("readiness");
  await t.frame(10);
  await t.move({ x: 1360, y: 215 }, 12); t.mark("rank");
  await t.frame(14);
  await t.move(page.getByText("Review mistakes").first(), 18); t.mark("fix");
  await t.frame(12);
  await t.scroll(380, 36); t.mark("plan");
  await t.move({ x: 300, y: 300 }, 18);
  await t.frame(14);
  t.save();
  await page.context().close();
}

// ---------- mistakes bank, then the revision queue ----------
if (want("mistakes")) {
  const page = await newPage(browser);
  await go(page, BASE + "/mistakes", has(page, "Mistakes Bank"), 60000);
  for (let i = 0; i < 20; i++) { await page.clock.runFor(100); await sleep(50); }
  const t = new Take(page, "mistakes");
  t.pos = { x: 900, y: 750 };
  await t.frame(10);
  await t.move({ x: 700, y: 655 }, 22); t.mark("prevWrong");
  await t.frame(12);
  await t.click(page.getByText("Revision", { exact: true }).last(), 22, 6); t.mark("revision");
  await settle(page, has(page, "REVISION DUE TODAY"), 30000);
  await t.frame(16);
  t.save();
  await page.context().close();
}

// ---------- weekly challenge (the All-India mock has no live event yet) ----------
if (want("challenge")) {
  const page = await newPage(browser);
  await go(page, BASE + "/mocks", has(page, "WEEKLY CHALLENGE"), 60000);
  const t = new Take(page, "challenge");
  t.pos = { x: 1200, y: 700 };
  await t.frame(10);
  await t.scroll(420, 36);
  await t.move(page.getByText("Take the challenge").first(), 22); t.mark("challenge");
  await t.frame(20);
  t.save();
  await page.context().close();
}

// ---------- profile: stats and achievements ----------
if (want("profile")) {
  const page = await newPage(browser);
  await go(page, BASE + "/profile", has(page, "Achievements"), 60000);
  for (let i = 0; i < 20; i++) { await page.clock.runFor(100); await sleep(50); }
  const t = new Take(page, "profile");
  t.pos = { x: 1200, y: 760 };
  await t.frame(10);
  await t.move({ x: 380, y: 480 }, 20); t.mark("stats");
  await t.frame(8);
  await t.scroll(330, 34); t.mark("achievements");
  await t.move({ x: 500, y: 390 }, 18);
  await t.frame(16);
  t.save();
  await page.context().close();
}

// ---------- analytics (Pro, signed in) ----------
if (want("analytics")) {
  const page = await newPage(browser);
  await go(page, BASE + "/analytics", has(page, "Smart insights"));
  for (let i = 0; i < 30; i++) { await page.clock.runFor(100); await sleep(40); }
  const t = new Take(page, "analytics");
  t.pos = { x: 1300, y: 760 };
  await t.frame(10);
  await t.move({ x: 320, y: 437 }, 18); t.mark("insight1");
  await t.move({ x: 320, y: 603 }, 22); t.mark("insight4");
  await t.frame(10);
  await t.move(page.getByRole("button", { name: /practise this topic/i }).first(), 20); t.mark("adaptive");
  await t.frame(14);
  await t.scroll(560, 36); t.mark("trend");
  await t.frame(20);
  t.save();
  await page.context().close();
}

// ---------- study planner tool: hours and weak sections update the plan live ----------
if (want("planner")) {
  const page = await newPage(browser);
  await go(page, BASE + "/tools/gate-study-plan", has(page, "Hours a day"));
  const t = new Take(page, "planner");
  t.pos = { x: 1250, y: 700 };
  await t.frame(8);
  const sliders = page.locator('input[type="range"]');
  const hb = await sliders.nth(0).boundingBox();
  const val = Number(await sliders.nth(0).inputValue()), min = Number(await sliders.nth(0).getAttribute("min") ?? 1), max = Number(await sliders.nth(0).getAttribute("max") ?? 12);
  const xOf = (v) => hb.x + ((v - min) / (max - min)) * hb.width;
  await t.drag({ x: xOf(val), y: hb.y + hb.height / 2 }, { x: xOf(Math.min(max, val + 2)), y: hb.y + hb.height / 2 }, 30, 10); t.mark("hours");
  await t.click(page.getByText("Discrete Mathematics", { exact: true }).first(), 18, 10); t.mark("weak1");
  await t.click(page.getByText("Algorithms", { exact: true }).first(), 14, 10); t.mark("weak2");
  await t.move({ x: 1000, y: 760 }, 16); t.mark("stats");
  await t.frame(12);
  await t.scroll(420, 34); t.mark("phases");
  await t.frame(18);
  t.save();
  await page.context().close();
}

// ---------- free tools: drag the marks slider ----------
if (want("tools")) {
  const page = await newPage(browser);
  await go(page, BASE + "/tools/gate-branch-cutoffs", async () => (await page.locator("table").count()) > 0);
  const t = new Take(page, "tools");
  t.pos = { x: 1300, y: 500 };
  await t.frame(10);
  await t.scroll(420, 32); t.mark("scrolled");
  await t.frame(6);
  const slider = page.getByLabel("Marks slider");
  const b = await slider.boundingBox();
  await t.drag({ x: b.x + b.width * 0.45, y: b.y + b.height / 2 }, { x: b.x + b.width * 0.7656, y: b.y + b.height / 2 }, 45, 20); t.mark("dragged");
  t.save();
  await page.context().close();
}

// ---------- plans: the live site, so the prices are the real ones ----------
if (want("plans")) {
  const page = await newPage(browser, true, new URL(PLANS_BASE).hostname);
  await go(page, PLANS_BASE + "/pro", has(page, "Plus"));
  await page.mouse.wheel(0, 250); await settle(page);
  const t = new Take(page, "plans");
  t.pos = { x: 1000, y: 120 };
  await t.frame(6);
  const monthly = page.getByText("Monthly", { exact: true });
  if (await monthly.count()) { await t.click(monthly.first(), 12, 10); t.mark("monthly"); }
  await t.move(page.getByRole("button", { name: /get plus/i }).first(), 18); t.mark("plus");
  await t.frame(16);
  await t.move(page.getByRole("button", { name: /get pro/i }).first(), 18); t.mark("pro");
  await t.frame(20);
  t.save();
  await page.context().close();
}

await browser.close();
