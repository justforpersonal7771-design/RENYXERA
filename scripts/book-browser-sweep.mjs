// Opens every topic of the Programming in C book in a real browser, at desktop (light) and phone (dark), and checks: no page error, no sideways scroll,
// every figure inside the page width, and every step-by-step figure keeps one size from step to step. Needs the dev server on :3111.
// Run: node scripts/book-browser-sweep.mjs [first] [last]     (topic numbers, default all)
import { chromium } from "playwright";
const b = await chromium.launch();
const first = Number(process.argv[2] ?? 0), last = Number(process.argv[3] ?? 99);
const report = [];
for (const [vw, vh, theme, tag] of [[1440, 900, "light", "desktop"], [390, 844, "dark", "mobile"]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} }, theme);
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 100)));
  for (let i = 0; i < 40; i++) { try { await p.goto("http://localhost:3111/study/c-programming", { waitUntil: "networkidle", timeout: 120000 }); break; } catch { await p.waitForTimeout(5000); } }
  await p.waitForTimeout(4500);
  const titles = await p.evaluate(() => [...document.querySelector("ol.no-scrollbar").children].map((li) => li.querySelector("span.block")?.textContent?.trim() ?? ""));
  for (let k = 0; k < titles.length; k++) {
    if (k < first || k > last) continue;
    const before = errs.length;
    if (k > 0) { await p.locator("ol.no-scrollbar span.block", { hasText: titles[k] }).first().evaluate((e) => e.closest("button").click()); await p.waitForTimeout(2500); }
    const figs = p.locator("[data-book] figure"); const n = await figs.count(); let wide = 0, frames = 0, unstable = 0;
    for (let i = 0; i < n; i++) {
      const f = figs.nth(i); if (!(await f.isVisible())) continue;
      const r = await f.evaluate((el) => { const bb = el.getBoundingClientRect(); return el.scrollWidth > el.clientWidth + 1 || bb.right > innerWidth + 1; }); if (r) wide++;
      const grp = f.locator("[role=group]");
      if (await grp.count()) { frames++; const stage = grp.first().locator("div.grid").first(); const next = grp.first().getByRole("button", { name: "Next step" }); const sizes = new Set(); for (let s = 0; s < 8; s++) { const bb = await stage.boundingBox(); if (bb) sizes.add(Math.round(bb.width) + "x" + Math.round(bb.height)); if (await next.isDisabled()) break; await next.click(); await p.waitForTimeout(60); } if (sizes.size > 1) unstable++; }
    }
    const side = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    report.push({ tag, k, title: titles[k].slice(0, 34), figures: n, stepFigs: frames, widerThanPage: wide, unstableSteps: unstable, pageSideScroll: side, newErrors: errs.length - before });
  }
  await ctx.close();
}
await b.close();
const bad = report.filter((r) => r.widerThanPage || r.unstableSteps || r.pageSideScroll || r.newErrors);
console.log(report.map((r) => `${r.tag} #${r.k} ${r.title.padEnd(34)} figs ${String(r.figures).padStart(2)} steps ${String(r.stepFigs).padStart(2)}${r.widerThanPage ? " WIDE:" + r.widerThanPage : ""}${r.unstableSteps ? " UNSTABLE:" + r.unstableSteps : ""}${r.pageSideScroll ? " SIDESCROLL" : ""}${r.newErrors ? " ERRORS:" + r.newErrors : ""}`).join("\n"));
console.log(bad.length ? `\n${bad.length} topic(s) with a problem` : "\nall topics clean");
