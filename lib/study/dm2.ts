/** Discrete Mathematics engines, depth expansion batch A (19 Nov). Every number the new lessons quote comes from here. */
import { truthTable, parseFormula, evalNode } from "@/lib/study/dm";

/* ------------------------------------------------------------ arguments */
export function checkArgument(premises: string[], conclusion: string) {
  const ps = premises.map((f) => f.trim()).filter(Boolean);
  for (const f of [...ps, conclusion]) { const r = parseFormula(f); if (!r.ok) return { ok: false as const, error: `"${f}": ${r.error}` }; }
  const vars = [...new Set([...ps, conclusion].flatMap((f) => { const r = parseFormula(f); return r.ok ? r.vars : []; }))].sort();
  const pn = ps.map((f) => (parseFormula(f) as { ok: true; node: Parameters<typeof evalNode>[0] }).node);
  const cn = (parseFormula(conclusion) as { ok: true; node: Parameters<typeof evalNode>[0] }).node;
  let counter: Record<string, boolean> | null = null, rowsAllTrue = 0;
  for (let k = 0; k < 2 ** vars.length; k++) {
    const env: Record<string, boolean> = {}; vars.forEach((v, j) => { env[v] = Boolean((k >> (vars.length - 1 - j)) & 1); });
    if (pn.every((n) => evalNode(n, env))) { rowsAllTrue++; if (!evalNode(cn, env) && !counter) counter = env; }
  }
  return { ok: true as const, vars, valid: !counter, counter, rowsAllTrue };
}

/* ------------------------------------------------------------ functional completeness (2-variable closure + Post's classes) */
export type Op = "NOT" | "AND" | "OR" | "IMP" | "XOR" | "IFF" | "NAND" | "NOR" | "T" | "F";
const P = 0b1100, Q = 0b1010; // rows (p,q) = 11, 10, 01, 00 as bits 3..0
const bin: Record<string, (a: number, b: number) => number> = { AND: (a, b) => a & b, OR: (a, b) => a | b, IMP: (a, b) => (~a | b) & 15, XOR: (a, b) => a ^ b, IFF: (a, b) => ~(a ^ b) & 15, NAND: (a, b) => ~(a & b) & 15, NOR: (a, b) => ~(a | b) & 15 };
export function closure(ops: Op[]) {
  const S = new Set<number>([P, Q]);
  if (ops.includes("T")) S.add(15); if (ops.includes("F")) S.add(0);
  let grew = true;
  while (grew) {
    grew = false; const cur = [...S];
    for (const a of cur) {
      if (ops.includes("NOT")) { const v = ~a & 15; if (!S.has(v)) { S.add(v); grew = true; } }
      for (const b of cur) for (const o of ops) if (bin[o]) { const v = bin[o](a, b); if (!S.has(v)) { S.add(v); grew = true; } }
    }
  }
  return S;
}
/** Post's five classes for each operation: preserves 0, preserves 1, self-dual, monotone, affine. */
export function postClasses(op: Op) {
  if (op === "T") return { p0: false, p1: true, selfDual: false, monotone: true, affine: true };
  if (op === "F") return { p0: true, p1: false, selfDual: false, monotone: true, affine: true };
  if (op === "NOT") return { p0: false, p1: false, selfDual: true, monotone: false, affine: true };
  const v = (a: number, b: number) => bin[op](a ? 15 : 0, b ? 15 : 0) & 1;
  const p0 = v(0, 0) === 0, p1 = v(1, 1) === 1;
  const selfDual = [0, 1].every((a) => [0, 1].every((b) => v(1 - a, 1 - b) === 1 - v(a, b)));
  const monotone = [0, 1].every((a) => [0, 1].every((b) => [0, 1].every((c) => [0, 1].every((d) => !(a <= c && b <= d) || v(a, b) <= v(c, d)))));
  const affine = ["AND", "OR", "IMP", "NAND", "NOR"].includes(op) ? false : true; // XOR, IFF are affine; the others are not
  return { p0, p1, selfDual, monotone, affine };
}
export function isComplete(ops: Op[]) {
  const cls = ops.map(postClasses);
  const blocks = (["p0", "p1", "selfDual", "monotone", "affine"] as const).filter((k) => cls.length > 0 && cls.every((c) => c[k]));
  return { complete: ops.length > 0 && blocks.length === 0, blocks, closureSize: closure(ops).size };
}

/* ------------------------------------------------------------ sets as bitmasks over {1..8} */
export const U = 8;
export const toList = (m: number) => [...Array(U).keys()].filter((i) => (m >> i) & 1).map((i) => i + 1);
export const size = (m: number) => toList(m).length;
export function setOps(A: number, B: number) {
  const all = (1 << U) - 1;
  return { union: A | B, inter: A & B, diffAB: A & ~B & all, diffBA: B & ~A & all, sym: A ^ B, compA: ~A & all, powerA: 2 ** size(A), productAB: size(A) * size(B) };
}

/* ------------------------------------------------------------ functions on {1..4} */
export type Fn = number[]; // f[i] = image of i+1, values 1..4
export const compose = (g: Fn, f: Fn): Fn => f.map((y) => g[y - 1]); // (g ∘ f)(x) = g(f(x))
export function fnProps(f: Fn) {
  const img = new Set(f); const injective = img.size === f.length; const surjective = img.size === f.length;
  const inverse = injective ? f.map((_, i) => f.indexOf(i + 1) + 1) : null;
  return { injective, surjective, bijective: injective && surjective, image: [...img].sort(), inverse };
}

/* ------------------------------------------------------------ groups: cosets in Zn and S3 */
export function zCosets(n: number, d: number) { // H = <d> in Zn
  const H = [...new Set([...Array(n).keys()].map((k) => (k * d) % n))].sort((a, b) => a - b);
  const seen = new Set<number>(); const cosets: number[][] = [];
  for (let a = 0; a < n; a++) if (!seen.has(a)) { const c = H.map((h) => (a + h) % n).sort((x, y) => x - y); c.forEach((x) => seen.add(x)); cosets.push(c); }
  return { H, cosets, index: cosets.length };
}
export const S3 = ["e", "(12)", "(13)", "(23)", "(123)", "(132)"] as const;
const PERM: Record<string, number[]> = { e: [0, 1, 2], "(12)": [1, 0, 2], "(13)": [2, 1, 0], "(23)": [0, 2, 1], "(123)": [1, 2, 0], "(132)": [2, 0, 1] };
const nameOf = (p: number[]) => Object.entries(PERM).find(([, q]) => q.every((v, i) => v === p[i]))![0];
/** a·b = apply b first, then a (right-to-left composition). */
export const s3mul = (a: string, b: string) => nameOf(PERM[b].map((x) => PERM[a][x]));
export function s3Cosets(H: string[]) {
  const left: string[][] = [], right: string[][] = []; const sl = new Set<string>(), sr = new Set<string>();
  for (const g of S3) {
    if (!sl.has(g)) { const c = H.map((h) => s3mul(g, h)).sort(); c.forEach((x) => sl.add(x)); left.push(c); }
    if (!sr.has(g)) { const c = H.map((h) => s3mul(h, g)).sort(); c.forEach((x) => sr.add(x)); right.push(c); }
  }
  const key = (cs: string[][]) => cs.map((c) => c.join(",")).sort().join("|");
  return { left, right, normal: key(left) === key(right) };
}

/* ------------------------------------------------------------ Boolean algebra: atoms of Dn */
export function atomsOfDn(n: number) {
  const divs = [...Array(n).keys()].map((i) => i + 1).filter((d) => n % d === 0);
  const atoms = divs.filter((d) => d > 1 && divs.every((e) => e === 1 || e === d || d % e !== 0)); // primes dividing n
  const squareFree = atoms.every((p) => n % (p * p) !== 0);
  return { divs, atoms, squareFree, boolean: squareFree, expectedSize: 2 ** atoms.length };
}

export { truthTable };
