// CI end-to-end smoke test (guest; needs no secrets beyond the public Supabase values baked
// into the build). Every main page on phone + desktop × light + dark must render with no
// page errors and no sideways scroll; then a guest takes a short test end to end.
//   BASE=http://localhost:3000 node scripts/e2e-smoke.mjs
import { chromium, devices } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const PAGES = ["/", "/about", "/gate-cse", "/pyq", "/pyq/gate-cs-2024-fn", "/pyq/gate-cs-2024-fn/q30", "/topics/algorithms", "/tools/gate-score-calculator", "/tools/gate-cs-cutoff", "/gate-cs-syllabus", "/mocks", "/setup", "/mistakes", "/bookmarks", "/revision", "/analytics", "/privacy", "/terms"];
let fails = 0;
const ok = (c, m) => { console.log(`${c ? "PASS" : "FAIL"}  ${m}`); if (!c) fails++; };

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
  await ctx.close();
} catch (e) {
  ok(false, `smoke run crashed: ${e.message.split("\n")[0]}`);
} finally {
  await b.close();
}
console.log(fails ? `\n${fails} check(s) failed` : "\nAll smoke checks passed");
process.exit(fails ? 1 : 0);
