// Browser test of every figure of one topic of the C book at desktop and mobile, light and dark. Needs the dev server on :3111. Run: TOPIC="Your first program" node scripts/chapter-figures-browser.mjs (default: the first topic). Screenshots go to .tmp-shots/ (create it first).
import { chromium } from "playwright";
const b = await chromium.launch(); const res = {};
for (const theme of ["light", "dark"]) for (const [vw, vh, tag] of [[1440, 900, "d"], [390, 844, "m"]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} }, theme);
  const p = await ctx.newPage(); const errs = []; p.on("pageerror", (e) => errs.push(String(e).slice(0, 120)));
  await p.goto("http://localhost:3111/study/c-programming", { waitUntil: "networkidle", timeout: 300000 }); await p.waitForTimeout(4500);
  if (process.env.TOPIC) { await p.locator("ol.no-scrollbar span.block", { hasText: process.env.TOPIC }).first().evaluate((e) => e.closest("button").click()); await p.waitForTimeout(2500); }
  const figs = p.locator("[data-book] figure"); const n = await figs.count(); const rows = [];
  for (let i = 0; i < n; i++) {
    const f = figs.nth(i); if (!(await f.isVisible())) { rows.push({ i: i + 1, hidden: true }); continue; } await f.scrollIntoViewIfNeeded(); await p.waitForTimeout(150);
    const info = await f.evaluate((el) => { const r = el.getBoundingClientRect(); const svg = el.querySelector("svg"); const sr = svg?.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), sw: sr ? Math.round(sr.width) : 0, overflowX: el.scrollWidth > el.clientWidth + 1, cap: (el.querySelector("figcaption")?.textContent || "").slice(0, 28) }; });
    const grp = f.locator("[role=group]"); let sizes = null;
    if (await grp.count()) { sizes = []; const stage = grp.first().locator("div.grid").first(); const next = grp.first().getByRole("button", { name: "Next step" }); for (let k = 0; k < 6; k++) { const bb = await stage.boundingBox(); sizes.push(Math.round(bb.width) + "x" + Math.round(bb.height)); if (await next.isDisabled()) break; await next.click(); await p.waitForTimeout(120); } }
    if (theme === "light" || i % 3 === 0) await f.screenshot({ path: `.tmp-shots/${theme}-${tag}-fig${i + 1}.png` });
    rows.push({ i: i + 1, ...info, sizes: sizes && [...new Set(sizes)].join(" ") });
  }
  res[theme + "-" + tag] = { figures: n, pageSideScroll: await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), errs, rows };
  if (theme === "light") await p.screenshot({ path: `.tmp-shots/${theme}-${tag}-top.png` });
  await ctx.close();
}
console.log(JSON.stringify(res, null, 0).replace(/\},\{/g, "},\n{")); await b.close();
