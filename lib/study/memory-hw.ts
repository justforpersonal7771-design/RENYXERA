/**
 * Computer Organisation engines for main memory and secondary storage: chip arrays and address decoding, interleaving, DRAM refresh, disk timing and capacity,
 * RAID, and Hamming codes. Checked by scripts/memory-hw-check.ts.
 */

/* ------------------------------------------------------------ memory chips and address decoding */
const lg = (n: number) => Math.round(Math.log2(n));
export const isPow2 = (n: number) => Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;
/** Build `totalWords × wordBits` from chips of `chipWords × chipBits`: chips in rows (more words) and columns (wider words). */
export function memoryDesign(totalWords: number, wordBits: number, chipWords: number, chipBits: number) {
  const rows = totalWords / chipWords, cols = wordBits / chipBits;
  return { addrBits: lg(totalWords), chipAddrBits: lg(chipWords), selectBits: rows > 1 ? lg(rows) : 0, rows, cols, chips: rows * cols, ok: rows >= 1 && cols >= 1 && Number.isInteger(rows) && Number.isInteger(cols) };
}
/** Which chip row an address selects, and the address inside the chip (high bits decode to a chip select). */
export function decodeAddress(addr: number, chipWords: number) { return { row: Math.floor(addr / chipWords), offset: addr % chipWords }; }
/** Low-order interleaving: consecutive words sit in consecutive banks. */
export const bankOf = (addr: number, banks: number) => addr % banks;
/** Time to read n consecutive words from m banks that each need tA to access and share a bus that moves one word in tB. A word is requested every tB. */
export function interleavedTime(n: number, m: number, tA: number, tB: number) {
  const free = Array.from({ length: m }, () => 0); let last = 0; const starts: number[] = [];
  for (let k = 0; k < n; k++) { const b = k % m; const s = Math.max(k * tB, free[b]); starts.push(s); free[b] = s + tA; last = Math.max(last, s + tA); }
  return { total: last, starts };
}
/** One word per access, one bank: n × tA. */
export const singleBankTime = (n: number, tA: number) => n * tA;
/** Share of time a DRAM spends refreshing: `rows` rows, `rowNs` to refresh one, every `intervalMs`. */
export const refreshOverhead = (rows: number, rowNs: number, intervalMs: number) => (rows * rowNs) / (intervalMs * 1e6);

/* ------------------------------------------------------------ disks */
export type DiskCfg = { seekMs: number; rpm: number; sectorsPerTrack: number; sectorBytes: number; controllerMs?: number };
/** Average access time of a transfer of `bytes` (rounded up to whole sectors worth of rotation): seek + half a turn + transfer + controller. */
export function diskAccess(d: DiskCfg, bytes: number) {
  const rot = 60000 / d.rpm, latency = rot / 2, trackBytes = d.sectorsPerTrack * d.sectorBytes;
  const transfer = (bytes / trackBytes) * rot;
  return { rotationMs: rot, latencyMs: latency, transferMs: transfer, total: d.seekMs + latency + transfer + (d.controllerMs ?? 0), rateBytesPerSec: trackBytes * (d.rpm / 60) };
}
export const diskCapacity = (surfaces: number, tracks: number, sectors: number, sectorBytes: number) => surfaces * tracks * sectors * sectorBytes;
export type Raid = "0" | "1" | "5" | "6" | "10";
/** Usable capacity (in the same unit as `diskSize`) and how many disk failures the array always survives. */
export function raid(level: Raid, n: number, diskSize: number) {
  switch (level) {
    case "0": return { usable: n * diskSize, survives: 0, writePenalty: 1 };
    case "1": return { usable: (n / 2) * diskSize, survives: 1, writePenalty: 2 };
    case "10": return { usable: (n / 2) * diskSize, survives: 1, writePenalty: 2 };
    case "5": return { usable: (n - 1) * diskSize, survives: 1, writePenalty: 4 };
    case "6": return { usable: (n - 2) * diskSize, survives: 2, writePenalty: 6 };
  }
}

/* ------------------------------------------------------------ Hamming codes */
/** Smallest number r of check bits so that m data bits can be protected against any single error: 2^r ≥ m + r + 1. */
export function hammingCheckBits(m: number) { let r = 1; while (2 ** r < m + r + 1) r++; return r; }
/** Even-parity Hamming code. Positions are 1-based; positions that are powers of two hold check bits, the rest hold data in order. */
export function hammingEncode(data: number[]) {
  const r = hammingCheckBits(data.length), n = data.length + r; const code: number[] = Array(n + 1).fill(0); let di = 0;
  for (let i = 1; i <= n; i++) if (!isPow2(i)) code[i] = data[di++];
  for (let p = 1; p <= n; p <<= 1) { let x = 0; for (let i = 1; i <= n; i++) if (i & p && i !== p) x ^= code[i]; code[p] = x; }
  return code.slice(1);
}
/** Syndrome = the position of a single wrong bit (0 if none). Returns the corrected code and the data bits. */
export function hammingDecode(code: number[]) {
  const n = code.length, c = [0, ...code]; let syndrome = 0;
  for (let p = 1; p <= n; p <<= 1) { let x = 0; for (let i = 1; i <= n; i++) if (i & p) x ^= c[i]; if (x) syndrome |= p; }
  if (syndrome >= 1 && syndrome <= n) c[syndrome] ^= 1;
  const data: number[] = []; for (let i = 1; i <= n; i++) if (!isPow2(i)) data.push(c[i]);
  return { syndrome, corrected: c.slice(1), data };
}
/** SECDED adds one overall parity bit: it corrects one error and detects two. */
export const secdedBits = (m: number) => hammingCheckBits(m) + 1;
/** The minimum distance of a code decides what it can do: detect d−1 errors, correct ⌊(d−1)/2⌋. */
export const codeAbility = (d: number) => ({ detect: d - 1, correct: Math.floor((d - 1) / 2) });
