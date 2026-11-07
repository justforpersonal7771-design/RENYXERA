import { chromium } from "file:///D:/0-UI/r2ma-stable/node_modules/playwright/index.mjs";
import fs from "node:fs";
import { shell } from "./common.mjs";
import { SET_A } from "./v1to5.mjs";
let SET_B = [], SET_C = [];
try { ({ SET_B } = await import("./v6to10.mjs")); } catch (e) { if (!String(e).includes("Cannot find")) throw e; }
({ SET_C } = await import("./v11to20.mjs"));

const OUT = process.argv[3] || "D:/0-UI/r2ma-stable/docs/design/dashboard-variants/";
const only = (process.argv[2] || "").split(",").filter(Boolean);
fs.mkdirSync(OUT, { recursive: true });
const all = [...SET_A, ...SET_B, ...SET_C].filter((v) => !only.length || only.includes(v.id));
const b = await chromium.launch();
for (const v of all) {
  for (const t of ["light", "dark"]) {
    for (const dev of ["desktop", "mobile"]) {
      const { css, html } = dev === "desktop" ? v.d(t) : v.m(t);
      const vp = dev === "desktop" ? { width: 1440, height: 900 } : { width: 390, height: 844 };
      const ctx = await b.newContext({ viewport: vp, deviceScaleFactor: dev === "desktop" ? 1 : 2 });
      const p = await ctx.newPage();
      await p.setContent(shell(t, css, html), { waitUntil: "load" });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(500);
      await p.screenshot({ path: `${OUT}v${v.id}-${v.slug}-${dev}-${t}.png` });
      await ctx.close();
    }
  }
  console.log("rendered", v.id, v.name);
}
await b.close();
