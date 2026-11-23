/**
 * Computer Organisation engines for the ALU, data path and control-unit labs. Checked by scripts/datapath-check.ts.
 */

/* ------------------------------------------------------------ integer addition and flags */
/** n-bit two's complement addition with the carry-out and signed-overflow flags. Inputs are unsigned bit patterns 0 … 2ⁿ−1. */
export function addFlags(a: number, b: number, n: number, sub = false) {
  const mod = 2 ** n, bb = sub ? (mod - b) % mod : b; // a − b = a + (2ⁿ − b)
  const raw = a + bb, r = raw % mod, carry = raw >= mod;
  const sa = a >= mod / 2, sb = bb >= mod / 2, sr = r >= mod / 2;
  const overflow = sa === sb && sr !== sa;
  return { result: r, signed: r >= mod / 2 ? r - mod : r, carry, overflow, zero: r === 0, negative: sr };
}
/** Signed value of an n-bit pattern. */
export const toSigned = (x: number, n: number) => (x >= 2 ** (n - 1) ? x - 2 ** n : x);
export const bin = (x: number, n: number) => (x >>> 0).toString(2).padStart(n, "0").slice(-n);

/* ------------------------------------------------------------ Booth multiplication */
export type BoothRow = { step: number; op: string; A: string; Q: string; q1: number };
/** Radix-2 Booth: multiplicand m times multiplier q, both n-bit signed. One row per step; the product is the 2n-bit signed value of A:Q at the end. */
export function booth(m: number, q: number, n: number) {
  const mod = 2 ** n, ms = toSigned(((m % mod) + mod) % mod, n); let A = 0, Q = ((q % mod) + mod) % mod, q1 = 0; // A is kept as a signed integer so −2ⁿ⁻¹ × … cannot overflow the register
  const view = (x: number) => bin(((x % mod) + mod) % mod, n);
  const rows: BoothRow[] = [{ step: 0, op: "start", A: view(A), Q: bin(Q, n), q1 }];
  for (let i = 1; i <= n; i++) {
    const pair = `${Q & 1}${q1}`; let op = "shift";
    if (pair === "10") { A -= ms; op = "A − M, shift"; } else if (pair === "01") { A += ms; op = "A + M, shift"; }
    q1 = Q & 1; const low = ((A % 2) + 2) % 2; Q = (Q >> 1) | (low << (n - 1)); A = Math.floor(A / 2); // arithmetic shift right of A:Q:q1
    rows.push({ step: i, op, A: view(A), Q: bin(Q, n), q1 });
  }
  return { rows, product: A * mod + Q };
}

/* ------------------------------------------------------------ IEEE 754 single precision */
/** Fields of the 32-bit IEEE 754 encoding of x. */
export function ieeeEncode(x: number) {
  const dv = new DataView(new ArrayBuffer(4)); dv.setFloat32(0, x);
  const u = dv.getUint32(0), s = u >>> 31, e = (u >>> 23) & 0xff, f = u & 0x7fffff;
  return { sign: s, exp: e, expBits: bin(e, 8), frac: bin(f, 23), hex: "0x" + u.toString(16).toUpperCase().padStart(8, "0"), kind: e === 255 ? (f ? "NaN" : "infinity") : e === 0 ? (f ? "denormal" : "zero") : "normal" };
}
/** Value of a 32-bit pattern given as unsigned integer. */
export function ieeeDecode(u: number) { const dv = new DataView(new ArrayBuffer(4)); dv.setUint32(0, u >>> 0); return dv.getFloat32(0); }

/** Ripple-carry adder: the carry passes through every stage, so the delay grows with n. */
export const rippleDelay = (n: number, perStage: number) => n * perStage;

/* ------------------------------------------------------------ single-cycle and multi-cycle data path */
export type InstrClass = { name: string; freq: number; stages: number[]; cycles: number };
/** The single-cycle clock must fit the slowest instruction; the multi-cycle clock must fit the slowest stage. */
export function cycleTimes(classes: InstrClass[], stageDelay: number[]) {
  const path = (c: InstrClass) => c.stages.reduce((s, i) => s + stageDelay[i], 0);
  const single = Math.max(...classes.map(path));
  const multi = Math.max(...stageDelay);
  const cpi = classes.reduce((s, c) => s + c.freq * c.cycles, 0);
  return { single, multi, cpi, multiPerInstr: cpi * multi, paths: classes.map(path) };
}

/* ------------------------------------------------------------ microprogrammed control */
/** Bits of a vertical (encoded) field that selects one of n mutually exclusive signals (the "none" choice counts among the n). */
export const fieldBits = (n: number) => Math.ceil(Math.log2(Math.max(2, n)));
/** Horizontal word: one bit per signal. Vertical word: one encoded field per group. Both plus the next-address field. */
export function controlStore(words: number, groups: number[], nextAddrBits = 0) {
  const total = groups.reduce((s, g) => s + g, 0), vertical = groups.reduce((s, g) => s + fieldBits(g), 0);
  const addr = fieldBits(words);
  return { horizontalWidth: total + nextAddrBits, verticalWidth: vertical + nextAddrBits, addrBits: addr, horizontalBits: words * (total + nextAddrBits), verticalBits: words * (vertical + nextAddrBits) };
}
