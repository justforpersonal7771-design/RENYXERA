// Contrast audit of every topic of the Programming in C book: every visible text node vs its effective background, at phone-dark and desktop-light and the other two.
// Needs the dev server on :3111. Run: node scripts/book-contrast-audit.mjs [first] [last]
import { chromium } from "playwright";
const b = await chromium.launch();
const first = Number(process.argv[2] ?? 0), last = Number(process.argv[3] ?? 99);
const out = [];
const probe = () => {
  const cv = document.createElement("canvas").getContext("2d");
  const parse = (c) => { if (/^(lab|lch|oklab|oklch|color)\(/.test(c)) { cv.clearRect(0,0,1,1); cv.fillStyle = "#000"; cv.fillStyle = c; cv.fillRect(0,0,1,1); const d = cv.getImageData(0,0,1,1).data; return { r: d[0], g: d[1], b: d[2], a: d[3]/255 }; } const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const over = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
  const bgOf = (el) => { const stack = []; for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { stack.push(c); if (c.a >= 1) break; } } let base = { r: 255, g: 255, b: 255, a: 1 }; if (!stack.length || stack[stack.length - 1].a < 1) base = parse(getComputedStyle(document.body).backgroundColor) ?? base; for (let i = stack.length - 1; i >= 0; i--) base = over(stack[i], base.a < 1 ? { r: 255, g: 255, b: 255, a: 1 } : base); return base; };
  const bad = []; const root = document.querySelector("[data-book]") ?? document.body;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const seen = new Set();
  while (w.nextNode()) {
    const t = w.currentNode; if (!t.textContent.trim()) continue; const el = t.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    const cs = getComputedStyle(el); if (cs.visibility === "hidden" || cs.display === "none") continue; const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    let fg = parse(cs.color); if (!fg) continue; const bg = bgOf(el); if (fg.a < 1) fg = over(fg, bg); if (parseFloat(cs.opacity) < 1) continue;
    const L1 = lum(fg), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    const px = parseFloat(cs.fontSize), large = px >= 24 || (px >= 18.66 && Number(cs.fontWeight) >= 700); const need = large ? 3 : 4.5;
    if (ratio < need) bad.push({ text: t.textContent.trim().slice(0, 40), ratio: Math.round(ratio * 100) / 100, need, cls: String(el.className).slice(0, 50) });
  }
  return bad;
};
for (const [vw, vh, theme, tag] of [[390, 844, "dark", "mobile-dark"], [390, 844, "light", "mobile-light"], [1440, 900, "light", "desktop-light"], [1440, 900, "dark", "desktop-dark"]]) {
  const ctx = await b.newContext({ viewport: { width: vw, height: vh }, colorScheme: theme });
  await ctx.addInitScript((t) => { try { localStorage.setItem("theme", t); sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} }, theme);
  const p = await ctx.newPage();
  for (let i = 0; i < 40; i++) { try { await p.goto(`http://localhost:3111/study/${process.env.BOOK ?? "c-programming"}`, { waitUntil: "networkidle", timeout: 120000 }); break; } catch { await p.waitForTimeout(5000); } }
  await p.waitForTimeout(4000);
  const titles = await p.evaluate(() => [...document.querySelector("ol.no-scrollbar").children].map((li) => li.querySelector("span.block")?.textContent?.trim() ?? ""));
  for (let k = 0; k < titles.length; k++) {
    if (k < first || k > last) continue;
    if (k > 0) { await p.locator("ol.no-scrollbar span.block", { hasText: titles[k] }).first().evaluate((e) => e.closest("button").click()); await p.waitForTimeout(2200); }
    const bad = await p.evaluate(probe); out.push({ tag, k, bad });
  }
  await ctx.close();
}
await b.close();
const agg = {};
for (const r of out) for (const x of r.bad) { const key = `${r.tag} | ${x.cls} | ${x.ratio}/${x.need}`; (agg[key] ??= { n: 0, ex: x.text, topics: new Set() }); agg[key].n++; agg[key].topics.add(r.k); }
for (const [k, v] of Object.entries(agg).sort((a, b) => b[1].n - a[1].n).slice(0, 40)) console.log(String(v.n).padStart(4), k, `"${v.ex}" topics:${[...v.topics].length}`);
console.log(Object.keys(agg).length ? `\n${Object.keys(agg).length} distinct low-contrast groups` : "\ncontrast clean");
