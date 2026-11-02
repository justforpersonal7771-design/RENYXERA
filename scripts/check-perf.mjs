// Performance toolkit audit (docs/roadmap/R28-PERFORMANCE-TOOLKIT.md). Loads real pages in a real browser and measures what the 33-point checklist
// can be measured by: compression, caching, image formats and lazy loading, fonts, JavaScript weight, third-party scripts, duplicate API calls, slow requests.
//   BASE=https://gate.renyxera.workers.dev node scripts/check-perf.mjs        (use the live site for compression and CDN results)
//   npm run check:perf
import { chromium, devices } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3123";
const ROUTES = (process.env.ROUTES ?? "/,/pyq,/tools,/gate-cs-syllabus,/login,/pro").split(",");
const PHONE = devices["Moto G4"] ?? devices["Pixel 5"];
const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const b = await chromium.launch();
const out = [];
const totals = { noCompress: 0, noCache: 0, bigImg: 0, dupApi: 0, slow: 0, thirdParty: new Set(), fontFiles: new Set(), lazyOff: 0, lazyOn: 0 };

for (const route of ROUTES) {
  const ctx = await b.newContext({ ...PHONE, serviceWorkers: "block" });
  await ctx.addInitScript(() => { try { sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} });
  const p = await ctx.newPage();
  const reqs = []; const apiCalls = new Map();
  p.on("response", async (r) => {
    const u = new URL(r.url()); const h = r.headers(); const type = r.request().resourceType();
    let size = Number(h["content-length"] ?? 0);
    if (!size) { try { size = (await r.body()).length; } catch { /* streamed */ } }
    reqs.push({ url: r.url(), path: u.pathname, host: u.host, type, size, enc: h["content-encoding"] ?? "", cache: h["cache-control"] ?? "", ct: h["content-type"] ?? "", ms: r.request().timing().responseEnd });
    if (u.pathname.startsWith("/api/")) apiCalls.set(u.pathname + u.search, (apiCalls.get(u.pathname + u.search) ?? 0) + 1);
  });
  const t0 = Date.now();
  await p.goto(BASE + route, { waitUntil: "load", timeout: 90_000 }).catch(() => {});
  await p.waitForTimeout(3000);
  const dom = await p.evaluate(() => ({
    imgs: [...document.images].map((i) => ({ src: i.currentSrc || i.src, lazy: i.loading === "lazy", below: i.getBoundingClientRect().top > innerHeight, w: i.naturalWidth })),
    fonts: [...document.fonts].filter((f) => f.status === "loaded").map((f) => `${f.family} ${f.weight}`),
    lcp: performance.getEntriesByType("largest-contentful-paint").at(-1)?.startTime ?? null,
  })).catch(() => ({ imgs: [], fonts: [], lcp: null }));
  const own = reqs.filter((r) => r.host === new URL(BASE).host);
  const js = own.filter((r) => r.type === "script"), css = own.filter((r) => r.type === "stylesheet");
  const text = own.filter((r) => /(javascript|css|html|json|svg)/.test(r.ct));
  const notCompressed = text.filter((r) => r.size > 2000 && !r.enc).map((r) => r.path);
  const statics = own.filter((r) => r.path.startsWith("/_next/static/"));
  const noCache = statics.filter((r) => !/immutable|max-age=\d{6,}/.test(r.cache)).map((r) => r.path);
  const images = own.filter((r) => r.type === "image");
  const bigImages = images.filter((r) => r.size > 150_000).map((r) => `${r.path} ${kb(r.size)}`);
  const nonModern = images.filter((r) => /(png|jpe?g)/.test(r.ct) && r.size > 20_000).map((r) => `${r.path} ${kb(r.size)}`);
  const third = [...new Set(reqs.filter((r) => r.host !== new URL(BASE).host).map((r) => r.host))];
  const dup = [...apiCalls].filter(([, n]) => n > 1).map(([u, n]) => `${u} x${n}`);
  const slow = own.filter((r) => r.path.startsWith("/api/") && r.ms > 1500).map((r) => `${r.path} ${Math.round(r.ms)} ms`);
  const lazyBelow = dom.imgs.filter((i) => i.below); const lazyMissing = lazyBelow.filter((i) => !i.lazy).length;

  totals.noCompress += notCompressed.length; totals.noCache += noCache.length; totals.bigImg += bigImages.length; totals.dupApi += dup.length; totals.slow += slow.length; totals.lazyOff += lazyMissing; totals.lazyOn += lazyBelow.length - lazyMissing;
  third.forEach((h) => totals.thirdParty.add(h)); dom.fonts.forEach((f) => totals.fontFiles.add(f));
  out.push({
    route, "JS": kb(js.reduce((a, r) => a + r.size, 0)), "CSS": kb(css.reduce((a, r) => a + r.size, 0)), "requests": reqs.length, "LCP ms": dom.lcp ? Math.round(dom.lcp) : "n/a", "load s": ((Date.now() - t0) / 1000).toFixed(1),
    "not compressed": notCompressed.length, "static w/o long cache": noCache.length, "images >150KB": bigImages.length, "png/jpg >20KB": nonModern.length, "below-fold images not lazy": lazyMissing, "duplicate API calls": dup.length, "3rd-party hosts": third.length,
  });
  if (process.env.VERBOSE) console.log(route, { notCompressed: notCompressed.slice(0, 4), noCache: noCache.slice(0, 3), bigImages, nonModern: nonModern.slice(0, 4), dup, slow, third });
  await ctx.close();
}
await b.close();
console.log(`Base: ${BASE}  (emulated phone, slow-ish device profile)`); console.table(out);
console.log(`Totals: ${totals.noCompress} uncompressed text files, ${totals.noCache} static files without long cache, ${totals.bigImg} images over 150 KB, ${totals.dupApi} duplicate API calls, ${totals.slow} slow API calls (>1.5 s), ${totals.lazyOn} lazy and ${totals.lazyOff} not-lazy below-the-fold images.`);
console.log(`Third-party hosts seen: ${[...totals.thirdParty].join(", ") || "none"}`);
console.log(`Font faces in use: ${totals.fontFiles.size} (${[...totals.fontFiles].slice(0, 8).join("; ")})`);
