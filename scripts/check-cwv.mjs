// Core Web Vitals budget (6A technical SEO): loads the key public pages on a phone viewport
// against a running production build (npm run build && npx next start) and fails if LCP or
// CLS break the budget. Usage: node scripts/check-cwv.mjs [baseUrl]
import { chromium } from "playwright";

const BASE = process.argv[2] || "http://localhost:3000";
const PAGES = ["/about", "/gate-cs-syllabus", "/pyq", "/pyq/gate-cs-2024-fn/q30", "/topics/algorithms", "/tools/gate-score-calculator", "/tools/gate-cs-cutoff", "/articles/most-repeated-gate-cs-topics", "/articles/gate-cs-preparation-150-days", "/gate-cse"];
const BUDGET = { lcp: 2500, cls: 0.1 }; // Google's "good" thresholds

const browser = await chromium.launch();
let failed = 0;
for (const path of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(() => {
    window.__cwv = { lcp: 0, cls: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__cwv.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cwv.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const { lcp, cls } = await page.evaluate(() => window.__cwv);
  const ok = lcp <= BUDGET.lcp && cls <= BUDGET.cls;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${path.padEnd(44)} LCP ${Math.round(lcp)} ms  CLS ${cls.toFixed(3)}`);
  await ctx.close();
}
await browser.close();
console.log(failed ? `\n${failed} page(s) over budget (LCP ≤ ${BUDGET.lcp} ms, CLS ≤ ${BUDGET.cls})` : "\nAll pages within the Core Web Vitals budget");
process.exit(failed ? 1 : 0);
