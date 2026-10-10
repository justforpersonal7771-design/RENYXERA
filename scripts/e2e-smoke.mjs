// CI end-to-end smoke test (guest; needs no secrets beyond the public Supabase values baked
// into the build). Every main page on phone + desktop × light + dark must render with no
// page errors and no sideways scroll; then a guest takes a short test end to end.
//   BASE=http://localhost:3000 node scripts/e2e-smoke.mjs
import { chromium, devices } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PAGES = ["/", "/about", "/gate-cse", "/pyq", "/pyq/gate-cs-2024-fn", "/pyq/gate-cs-2024-fn/q30", "/topics/algorithms", "/tools", "/tools/gate-score-calculator", "/tools/gate-cs-cutoff", "/gate-cs-syllabus", "/gate-ec-syllabus", "/gate-ee-syllabus", "/gate-me-syllabus", "/gate-da-syllabus", "/tools/gate-study-plan", "/articles/most-repeated-gate-cs-topics", "/mocks", "/setup", "/mistakes", "/bookmarks", "/revision", "/analytics", "/pro", "/privacy", "/terms"];
let fails = 0;
const failed = [];
const ok = (c, m) => { console.log(`${c ? "PASS" : "FAIL"}  ${m}`); if (!c) { fails++; failed.push(m); } };

const b = await chromium.launch();
try {
  for (const [dev, scheme] of [["phone", "light"], ["phone", "dark"], ["desktop", "light"], ["desktop", "dark"]]) {
    const ctx = await b.newContext({ ...(dev === "phone" ? devices["iPhone 13"] : { viewport: { width: 1440, height: 900 } }), colorScheme: scheme });
    await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} }, scheme);
    const p = await ctx.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
    for (const path of PAGES) {
      errors.length = 0;
      const res = await p.goto(BASE + path, { waitUntil: "load", timeout: 60_000 });
      await p.waitForTimeout(1500);
      const hscroll = await p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      ok(res && res.status() < 400 && !errors.length && !hscroll, `${dev}/${scheme} ${path}${res && res.status() >= 400 ? ` (HTTP ${res.status()})` : ""}${errors.length ? ` errors: ${errors.join(" | ")}` : ""}${hscroll ? " (sideways scroll)" : ""}`);
    }
    await ctx.close();
  }

  // Guest exam flow on a phone: setup → deploy → answer → submit → results.
  const ctx = await b.newContext({ ...devices["iPhone 13"] });
  await ctx.addInitScript(() => { try { sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
  await p.goto(BASE + "/setup", { waitUntil: "load" });
  // Guests can't take a full year paper (15-question cap) — pick Subject Mastery.
  await p.getByText("Official Year Paper", { exact: true }).first().click({ timeout: 60_000 });
  await p.getByText("Subject Mastery", { exact: true }).last().click();
  await p.waitForTimeout(800);
  await p.getByRole("button", { name: /generate blueprint/i }).first().click({ timeout: 60_000 });
  // A guest asked to sign in for a full paper continues as a guest (capped sample test).
  const asGuest = async () => { const g = p.getByRole("button", { name: /continue as guest/i }); if (await g.count()) { await g.first().click(); await p.waitForTimeout(800); } };
  await p.waitForTimeout(1200);
  await asGuest();
  await p.getByRole("button", { name: /deploy session/i }).first().click({ timeout: 30_000 });
  await p.waitForTimeout(1200);
  await asGuest();
  if (!/exam\/session/.test(p.url())) { const d = p.getByRole("button", { name: /deploy session/i }); if (await d.count()) await d.first().click(); }
  await p.waitForURL(/exam\/session/, { timeout: 60_000 });
  await p.waitForFunction(() => !document.body.innerText.includes("Loading Exam Engine"), null, { timeout: 60_000 });
  if (process.env.SHOTS) { await p.waitForTimeout(2500); await p.screenshot({ path: `${process.env.SHOTS}/exam-timer.png`, clip: { x: 0, y: 0, width: 390, height: 120 } }); }
  // Calculator: opens from the header, 30 then cos = 0.866 in degrees, closes again.
  await p.getByRole("button", { name: "Calculator", exact: true }).click();
  const calc = p.getByRole("dialog", { name: "Calculator" });
  for (const k of ["3", "0", "cos"]) await calc.getByRole("button", { name: k, exact: true }).click();
  ok((await calc.getByRole("status").innerText()).includes("0.866025"), "calculator: 30 cos = 0.866025 (deg)");
  if (process.env.SHOTS) await p.screenshot({ path: `${process.env.SHOTS}/calc-phone.png` });
  // Hold outside = hidden while held, back on release; a quick tap outside closes it.
  const opacity = () => calc.evaluate((e) => getComputedStyle(e).opacity);
  await p.mouse.move(195, 150); await p.mouse.down(); await p.waitForTimeout(500);
  ok((await opacity()) === "0", "calculator hides while holding outside it");
  await p.mouse.up(); await p.waitForTimeout(300);
  ok((await opacity()) === "1", "calculator returns when released");
  await p.mouse.click(195, 150); await p.waitForTimeout(300);
  ok(await calc.isHidden(), "calculator closes on a quick tap outside");
  const firstOption = p.getByText(/^A$/).first();
  if (await firstOption.count()) await firstOption.click();
  await p.getByRole("button", { name: /save & next/i }).first().click();
  await p.getByRole("button", { name: /^submit/i }).first().click();
  await p.getByRole("button", { name: /submit (test|exam|now)|yes, submit|confirm/i }).first().click();
  await p.getByRole("button", { name: /see my results/i }).click({ timeout: 30_000 });
  await p.waitForURL(/exam\/results/, { timeout: 60_000 });
  await p.waitForTimeout(3000);
  const body = await p.evaluate(() => document.body.innerText);
  ok(/accuracy|marks/i.test(body) && !errors.length, `guest exam flow reaches results${errors.length ? ` errors: ${errors.join(" | ")}` : ""}`);
  // Results fit one screen (no page scroll) and the scoreboard flips to the question grid.
  for (const [w, h, scheme] of [[390, 664, "light"], [390, 664, "dark"], [1440, 900, "light"], [1440, 900, "dark"]]) {
    await p.setViewportSize({ width: w, height: h });
    await p.emulateMedia({ colorScheme: scheme });
    await p.evaluate((t) => { localStorage.setItem("theme", t); document.documentElement.classList.toggle("dark", t === "dark"); }, scheme);
    await p.waitForTimeout(500);
    const pageScroll = await p.evaluate(() => [...document.querySelectorAll("html")].some((el) => el.scrollHeight > el.clientHeight + 2));
    ok(!pageScroll, `results ${w}px/${scheme} fits one screen`);
    if (process.env.SHOTS) await p.screenshot({ path: `${process.env.SHOTS}/results-${w}-${scheme}.png` });
    await p.getByRole("button", { name: /show question grid/i }).click();
    await p.waitForTimeout(600);
    ok(await p.getByRole("button", { name: /show scoreboard/i }).isVisible(), `results ${w}px/${scheme} flips to the grid`);
    if (process.env.SHOTS) await p.screenshot({ path: `${process.env.SHOTS}/results-${w}-${scheme}-grid.png` });
    await p.getByRole("button", { name: /show scoreboard/i }).click();
    await p.waitForTimeout(800);
  }
  // Desktop: "Share result" downloads the result card.
  const dl = p.waitForEvent("download", { timeout: 15_000 }).catch(() => null);
  await p.getByRole("button", { name: /^share/i }).click();
  await p.getByRole("menuitem", { name: /download card/i }).click();
  ok(!!(await dl), "download result saves the card on desktop");
  await ctx.close();
} catch (e) {
  ok(false, `smoke run crashed: ${e.message.split("\n")[0]}`);
} finally {
  await b.close();
}
console.log(fails ? `\n${fails} check(s) failed:\n${failed.map((m) => `  - ${m}`).join("\n")}` : "\nAll smoke checks passed");
process.exit(fails ? 1 : 0);
