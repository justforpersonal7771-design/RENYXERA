// Bundle size budget (R15-A5). Reads the finished build in .next/static/chunks, prints the largest chunks by gzip size
// and fails if the total or any single chunk is over budget. Raise a budget on purpose (and say why) when a feature needs it.
// Usage: npm run build && node scripts/check-bundle.mjs
import { readdirSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";

const DIR = ".next/static/chunks";
const TOTAL_BUDGET_KB = Number(process.env.BUNDLE_TOTAL_KB ?? 2000); // (measured 1756 on 6 Nov 2026) all JS chunks, gzip
const CHUNK_BUDGET_KB = Number(process.env.BUNDLE_CHUNK_KB ?? 140); // (largest 112) any one JS chunk, gzip

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
let files;
try { files = walk(DIR).filter((f) => f.endsWith(".js")); } catch { console.error(`No build found in ${DIR}. Run "npm run build" first.`); process.exit(2); }

const rows = files.map((f) => ({ f: f.replace(DIR + "/", "").replace(DIR + "\\", ""), kb: gzipSync(readFileSync(f)).length / 1024 })).sort((a, b) => b.kb - a.kb);
const total = rows.reduce((s, r) => s + r.kb, 0);
console.log(`JS chunks: ${rows.length}, total ${total.toFixed(0)} KB gzip (budget ${TOTAL_BUDGET_KB} KB)`);
console.log("Largest chunks (gzip KB):");
for (const r of rows.slice(0, 10)) console.log(`  ${r.kb.toFixed(1).padStart(7)}  ${r.f}${r.kb > CHUNK_BUDGET_KB ? "   <-- over " + CHUNK_BUDGET_KB : ""}`);

const over = rows.filter((r) => r.kb > CHUNK_BUDGET_KB);
if (total > TOTAL_BUDGET_KB || over.length) {
  console.error(`\nBundle budget exceeded${total > TOTAL_BUDGET_KB ? `: total ${total.toFixed(0)} > ${TOTAL_BUDGET_KB} KB` : ""}${over.length ? `; ${over.length} chunk(s) over ${CHUNK_BUDGET_KB} KB` : ""}.`);
  process.exit(1);
}
console.log("\nBundle within budget.");
