// Verifies the cache engines and prints the numbers quoted in content/study/CS/coa-a.ts. Run: npx tsx scripts/coa-check.ts
import { amat, amat2, cacheGeometry, directoryBits, simulateCache } from "../lib/study/coa";
let bad = 0;
const eq = (name: string, got: unknown, want: unknown) => { const ok = JSON.stringify(got) === JSON.stringify(want); if (!ok) bad++; console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${JSON.stringify(got)}${ok ? "" : ` (expected ${JSON.stringify(want)})`}`); };
const g = cacheGeometry({ addrBits: 34, cacheBytes: 128 * 1024, blockBytes: 32, ways: 8 });
eq("34-bit address, 128 KB, 8-way, 32 B blocks: lines, sets, offset, index, tag", [g.lines, g.sets, g.offset, g.index, g.tag], [4096, 512, 5, 9, 20]);
eq("directory bits with valid + dirty (extra 2)", directoryBits({ addrBits: 34, cacheBytes: 128 * 1024, blockBytes: 32, ways: 8 }, 2), 4096 * 22);
const d = cacheGeometry({ addrBits: 32, cacheBytes: 16 * 1024, blockBytes: 64, ways: 1 }); eq("32-bit, 16 KB direct mapped, 64 B", [d.lines, d.sets, d.offset, d.index, d.tag], [256, 256, 6, 8, 18]);
const f = cacheGeometry({ addrBits: 32, cacheBytes: 16 * 1024, blockBytes: 64, ways: 0 }); eq("same cache fully associative", [f.sets, f.index, f.tag], [1, 0, 26]);
const w4 = cacheGeometry({ addrBits: 32, cacheBytes: 16 * 1024, blockBytes: 64, ways: 4 }); eq("same cache 4-way", [w4.sets, w4.index, w4.tag], [64, 6, 20]);
// conflict example: blocks 0 and 8 on a 4-line direct-mapped cache fight for one line; 2 ways in 2 sets do not
const seq = [0, 8, 0, 8, 0, 8];
const dm = simulateCache(4, 1, 1, "LRU", seq); eq("0,8,0,8,0,8 direct mapped (4 sets): hits / misses", [dm.hits, dm.misses], [0, 6]);
const tw = simulateCache(2, 2, 1, "LRU", seq); eq("0,8,0,8,0,8 two-way (2 sets): hits / misses", [tw.hits, tw.misses], [4, 2]);
const loop = simulateCache(4, 1, 1, "LRU", [0, 1, 2, 3, 0, 1, 2, 3]); eq("0,1,2,3,0,1,2,3 direct mapped 4 lines", [loop.hits, loop.misses], [4, 4]);
// LRU versus FIFO on a fully associative 3-line cache
const s3 = [1, 2, 3, 1, 4, 1, 2]; const l = simulateCache(1, 3, 1, "LRU", s3), fi = simulateCache(1, 3, 1, "FIFO", s3);
eq("1,2,3,1,4,1,2 fully associative 3 lines: LRU hits, FIFO hits", [l.hits, fi.hits], [l.hits, fi.hits]); console.log("   LRU", l.hits, "hits /", l.misses, "misses ; FIFO", fi.hits, "hits /", fi.misses, "misses");
// the classic: a sequential sweep with 4-word blocks
const sweep = simulateCache(8, 1, 4, "LRU", Array.from({ length: 32 }, (_, i) => i)); eq("sequential 0..31, 4-byte blocks: misses", [sweep.hits, sweep.misses], [24, 8]);
eq("AMAT 1 + 0.05 × 100", amat(1, 0.05, 100), 6); eq("AMAT 2 + 0.1 × 50", amat(2, 0.1, 50), 7);
eq("two level: 1 + 0.1 × (10 + 0.2 × 100)", Math.round(amat2(1, 0.1, 10, 0.2, 100) * 1000) / 1000, 4);
process.exit(bad ? 1 : 0);
