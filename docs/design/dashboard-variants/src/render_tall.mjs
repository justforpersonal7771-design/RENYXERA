// Renders full-height (scrolling) pages: node render_tall.mjs <outdir>
import { chromium } from "file:///D:/0-UI/r2ma-stable/node_modules/playwright/index.mjs";
import fs from "node:fs";
import { shell } from "./common.mjs";
import { V21 } from "./v21.mjs";
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const t of ["light", "dark"]) {
  for (const dev of ["desktop", "mobile"]) {
    const { css, html } = dev === "desktop" ? V21.d(t) : V21.m(t);
    const vp = dev === "desktop" ? { width: 1440, height: 900 } : { width: 390, height: 844 };
    const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: dev === "desktop" ? 1 : 2 });
    const p = await ctx.newPage();
    await p.setContent(shell(t, css, html), { waitUntil: "load" });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${OUT}v21-dashboard-${dev}-${t}.png`, fullPage: true });
    await ctx.close();
  }
}
await b.close();
console.log("done");
