/**
 * Computer Organisation engines for the study labs (cache memory, pipelining). All maths lives here and is checked by scripts/coa-check.ts.
 */

/* ------------------------------------------------------------ cache geometry */
export type CacheCfg = { addrBits: number; cacheBytes: number; blockBytes: number; /** 1 = direct mapped, 0 = fully associative, n = n-way set associative */ ways: number };
const lg = (n: number) => Math.round(Math.log2(n));
/** Address split of a cache: offset (block), index (set), tag, and the number of lines and sets. */
export function cacheGeometry(c: CacheCfg) {
  const lines = c.cacheBytes / c.blockBytes;
  const w = c.ways === 0 ? lines : c.ways;
  const sets = lines / w;
  const offset = lg(c.blockBytes), index = lg(sets), tag = c.addrBits - index - offset;
  return { lines, sets, ways: w, offset, index, tag };
}
/** Tag directory size in bits: one entry per line holding the tag, a valid bit and `extra` more bits per line (dirty, LRU, ...). */
export const directoryBits = (c: CacheCfg, extra = 1) => { const g = cacheGeometry(c); return g.lines * (g.tag + extra); };

/* ------------------------------------------------------------ cache simulation */
export type Policy = "LRU" | "FIFO";
export type SimEvent = { addr: number; block: number; set: number; hit: boolean; evicted: number | null };
/** Runs a sequence of byte addresses through a set-associative cache (sets × ways lines, `blockBytes` per block) with LRU or FIFO replacement. */
export function simulateCache(sets: number, ways: number, blockBytes: number, policy: Policy, addrs: number[]) {
  const state: number[][] = Array.from({ length: sets }, () => []); // each set: blocks in order, oldest first (LRU: least recently used first)
  const events: SimEvent[] = []; let hits = 0;
  for (const addr of addrs) {
    const block = Math.floor(addr / blockBytes), set = block % sets, line = state[set];
    const at = line.indexOf(block); let evicted: number | null = null; const hit = at >= 0;
    if (hit) { hits++; if (policy === "LRU") { line.splice(at, 1); line.push(block); } }
    else { if (line.length >= ways) evicted = line.shift() as number; line.push(block); }
    events.push({ addr, block, set, hit, evicted });
  }
  return { events, hits, misses: addrs.length - hits, state: state.map((l) => [...l]) };
}

/* ------------------------------------------------------------ performance */
/** Average memory access time = hit time + miss rate × miss penalty. */
export const amat = (hit: number, missRate: number, penalty: number) => hit + missRate * penalty;
/** Two levels: AMAT = L1 hit + L1 miss rate × (L2 hit + L2 local miss rate × memory penalty). */
export const amat2 = (h1: number, m1: number, h2: number, m2: number, mem: number) => h1 + m1 * (h2 + m2 * mem);
