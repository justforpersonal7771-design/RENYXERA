// Builds one contact sheet per variant (4 modes) and one overview sheet, from the rendered PNGs.
import { chromium } from "file:///D:/0-UI/r2ma-stable/node_modules/playwright/index.mjs";
import fs from "node:fs";
const DIR = process.argv[2];
const files = fs.readdirSync(DIR).filter((f) => /^v\d\d-.*-(desktop|mobile)-(light|dark)\.png$/.test(f));
const ids = [...new Set(files.map((f) => f.slice(0, 3)))].sort();
const uri = (f) => "data:image/png;base64," + fs.readFileSync(DIR + f).toString("base64");
const b = await chromium.launch();
for (const id of ids) {
  const fs_ = files.filter((f) => f.startsWith(id));
  const pick = (dev, th) => fs_.find((f) => f.includes(`-${dev}-${th}.png`));
  const slug = fs_[0].replace(/^v\d\d-/, "").replace(/-(desktop|mobile)-(light|dark)\.png$/, "");
  const html = `<body style="margin:0;background:#cfd2e6;font-family:sans-serif"><div style="display:grid;grid-template-columns:720px 720px 195px 195px;gap:10px;padding:10px;width:1860px;align-items:start">
  <div><img src="${uri(pick("desktop", "light"))}" style="width:720px;border-radius:8px"></div><div><img src="${uri(pick("desktop", "dark"))}" style="width:720px;border-radius:8px"></div>
  <img src="${uri(pick("mobile", "light"))}" style="width:195px;border-radius:12px"><img src="${uri(pick("mobile", "dark"))}" style="width:195px;border-radius:12px"></div></body>`;
  const p = await b.newPage({ viewport: { width: 1880, height: 460 } });
  await p.setContent(html, { waitUntil: "load" });
  await p.waitForTimeout(300);
  fs.mkdirSync(DIR + "sheets/", { recursive: true }); await p.screenshot({ path: `${DIR}sheets/sheet-${id}-${slug}.png`, fullPage: true });
  await p.close();
}
await b.close();
console.log("sheets", ids.join(","));
