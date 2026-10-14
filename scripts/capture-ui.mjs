// Captures every real screen state the promo film animates, as sharp 2x stills of the live product UI.
//   npm run build && npx next start -p 3000
//   BASE=http://localhost:3000 PLANS_BASE=https://gate.renyxera.workers.dev node scripts/capture-ui.mjs
// Output: video/public/ui/<state>.png (3200x1800) plus video/public/ui/boxes.json (element boxes in 1600x900 CSS pixels,
// used by the film to aim the cursor and the camera at the real controls). The film crops, frames and animates these
// stills; it never invents a screen.
import { chromium } from "playwright";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PLANS_BASE = process.env.PLANS_BASE ?? "https://gate.renyxera.workers.dev";
const OUT = "video/public/ui";
mkdirSync(OUT, { recursive: true });
const boxes = {};

const norm = (t) => String(t).toLowerCase().replace(/\s+/g, " ").replace(/[^a-z0-9 ]/g, "").trim();
const KEYS = new Map();
for (const f of ["data/Aggregated_Output.json", ...["DA", "EC", "EE", "ME"].map((c) => `data/pyq/${c}/gate_${c.toLowerCase()}_pyqs.json`)]) {
  if (!existsSync(f)) continue;
  for (const paper of JSON.parse(readFileSync(f, "utf8"))) for (const q of paper.questions) {
    const ok = (q.options ?? []).filter((o) => o.is_correct).map((o) => o.option_id);
    if (q.question_type === "MCQ" && ok.length === 1) KEYS.set(norm(q.question_text).slice(0, 70), ok[0]);
  }
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 });
await ctx.addInitScript(() => { try { sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} });
const p = await ctx.newPage();
const shot = async (name) => { await p.waitForTimeout(700); await p.screenshot({ path: `${OUT}/${name}.png` }); console.log("captured", name); };
const box = async (name, locator) => { const b = await locator.boundingBox().catch(() => null); if (b) boxes[name] = { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
const visible = async (loc) => { for (const el of await loc.all()) if (await el.isVisible()) return el; return null; };

// Home
await p.goto(BASE + "/", { waitUntil: "load" }); await p.waitForTimeout(2500); await shot("home");

// Exam setup: every state of the picker
await p.goto(BASE + "/setup", { waitUntil: "load" });
await p.waitForSelector("text=Deployment Type", { timeout: 30000 }); await p.waitForTimeout(1500);
await shot("setup_0");
const deploy = p.getByText("Official Year Paper", { exact: true }).first();
await box("deploy", deploy); await deploy.click(); await shot("setup_deploy_open");
const topic = p.getByText("Topic Spotlight", { exact: true }).last(); await box("deploy_topic", topic); await topic.click(); await shot("setup_topic");
const sec = p.getByText("CORE CS", { exact: true }).first(); await box("section", sec); await sec.click(); await shot("setup_section_open");
const ga = p.getByText("GENERAL APTITUDE (GA)", { exact: true }).first(); await box("section_ga", ga); await ga.click(); await shot("setup_section_ga");
const subj = p.getByText("Analytical Aptitude", { exact: true }).first(); await box("subject", subj); await subj.click(); await shot("setup_subject_open");
await p.keyboard.press("Escape"); await p.waitForTimeout(300); await p.mouse.click(1400, 860); await shot("setup_ready");
const gen = p.getByRole("button", { name: /generate blueprint/i }).first(); await box("generate", gen); await gen.click(); await p.waitForTimeout(1500);
const asGuest = async () => { const g = p.getByRole("button", { name: /continue as guest/i }); if (await g.count()) { await g.first().click(); await p.waitForTimeout(800); } };
await asGuest(); await shot("setup_blueprint");
const dep = p.getByRole("button", { name: /deploy session/i }).first(); await box("deploy_session", dep);

// Exam
await dep.click(); await p.waitForTimeout(1200); await asGuest();
if (!/exam\/session/.test(p.url())) { const d = p.getByRole("button", { name: /deploy session/i }); if (await d.count()) await d.first().click(); }
await p.waitForURL(/exam\/session/, { timeout: 60000 });
await p.waitForFunction(() => !document.body.innerText.includes("Loading Exam Engine"), null, { timeout: 60000 });
await p.waitForTimeout(1500); await shot("exam_q1");
const answer = async (tag) => {
  const text = norm(await p.evaluate(() => document.body.innerText));
  for (const [k, letter] of KEYS) {
    if (k.length < 20 || !text.includes(k)) continue;
    const el = await visible(p.getByText(new RegExp(`^${letter}$`)));
    if (el) { await box(`${tag}_answer`, el); await el.click(); return letter; }
  }
  return null;
};
console.log("q1 answer", await answer("q1")); await shot("exam_q1_selected");
const calcBtn = p.getByRole("button", { name: "Calculator", exact: true }); await box("calc_button", calcBtn); await calcBtn.click();
const calc = p.getByRole("dialog", { name: "Calculator" });
await box("calc", calc);
for (const k of ["3", "0", "cos"]) { const key = calc.getByRole("button", { name: k, exact: true }); await box(`key_${k}`, key); await key.click(); await p.waitForTimeout(150); }
await shot("exam_calc");
await p.mouse.click(300, 600); await p.waitForTimeout(400);
const next = p.getByRole("button", { name: /save & next/i }).first(); await box("save_next", next); await next.click(); await shot("exam_q2");
for (const q of ["q2", "q3", "q4", "q5"]) { await answer(q); await p.getByRole("button", { name: /save & next/i }).first().click(); await p.waitForTimeout(500); }
const submit = p.getByRole("button", { name: /^submit/i }).first(); await box("submit", submit); await submit.click(); await shot("exam_submit");
await p.getByRole("button", { name: /submit (test|exam|now)|yes, submit|confirm/i }).first().click();
await p.getByRole("button", { name: /see my results/i }).click({ timeout: 30000 });
await p.waitForURL(/exam\/results/, { timeout: 60000 }); await p.waitForTimeout(3500); await shot("results");

// Free tools
await p.goto(BASE + "/tools/gate-branch-cutoffs", { waitUntil: "load" }); await p.waitForSelector("table"); await p.waitForTimeout(1500);
await shot("tools_table");
const marks = p.getByLabel("Marks", { exact: true });
await marks.scrollIntoViewIfNeeded(); await p.waitForTimeout(400);
for (const v of ["45", "60", "76.56"]) { await marks.fill(v); await p.waitForTimeout(300); await shot(`tools_calc_${v.replace(".", "_")}`); }
await box("slider", p.getByLabel("Marks slider"));

// Plans, from the live site so the prices are the real ones
await p.goto(PLANS_BASE + "/pro", { waitUntil: "load" }); await p.waitForTimeout(2500);
const monthly = p.getByText("Monthly", { exact: true }); if (await monthly.count()) await monthly.first().click();
await p.waitForTimeout(800); await p.mouse.wheel(0, 260); await shot("plans_monthly");
await box("get_plus", p.getByRole("button", { name: /get plus/i }).first());

writeFileSync(`${OUT}/boxes.json`, JSON.stringify(boxes, null, 1));
await browser.close();
console.log("boxes", Object.keys(boxes).length);
