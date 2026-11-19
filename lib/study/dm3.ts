/** Discrete Mathematics engines, depth expansion batch B (19 Nov). Every number the new lessons quote comes from here. */
import type { G } from "@/lib/study/dm";
import { nCr } from "@/lib/study/dm";

/* ------------------------------------------------------------ spanning trees (Kirchhoff's matrix-tree theorem) */
/** Exact integer determinant by Bareiss elimination. */
export function det(M: number[][]): number {
  const n = M.length; if (n === 0) return 1;
  const A = M.map((r) => r.slice()); let sign = 1, prev = 1;
  for (let k = 0; k < n - 1; k++) {
    if (A[k][k] === 0) { const s = A.findIndex((r, i) => i > k && r[k] !== 0); if (s < 0) return 0; [A[k], A[s]] = [A[s], A[k]]; sign = -sign; }
    for (let i = k + 1; i < n; i++) for (let j = k + 1; j < n; j++) A[i][j] = (A[i][j] * A[k][k] - A[i][k] * A[k][j]) / prev;
    prev = A[k][k];
  }
  return sign * A[n - 1][n - 1];
}
export function laplacian(g: G) {
  const L = Array.from({ length: g.n }, () => new Array(g.n).fill(0));
  for (const [a, b] of g.edges) { L[a][a]++; L[b][b]++; L[a][b]--; L[b][a]--; }
  return L;
}
export function spanningTrees(g: G) { if (g.n <= 1) return 1; const L = laplacian(g); return Math.round(det(L.slice(1).map((r) => r.slice(1)))); }
export const cayley = (n: number) => (n <= 2 ? 1 : n ** (n - 2));

/* ------------------------------------------------------------ planarity */
export function planarBounds(n: number, m: number, triangleFree: boolean) {
  const limit = n < 3 ? Infinity : triangleFree ? 2 * n - 4 : 3 * n - 6;
  return { limit, exceeds: m > limit, faces: 2 - n + m };
}
export const PLANAR_SET: { name: string; n: number; m: number; triangleFree: boolean; planar: boolean; why: string }[] = [
  { name: "K4", n: 4, m: 6, triangleFree: false, planar: true, why: "Draw one vertex inside the triangle of the other three." },
  { name: "K5", n: 5, m: 10, triangleFree: false, planar: false, why: "10 > 3·5 − 6 = 9." },
  { name: "K3,3", n: 6, m: 9, triangleFree: true, planar: false, why: "Triangle-free and 9 > 2·6 − 4 = 8." },
  { name: "Cube Q3", n: 8, m: 12, triangleFree: true, planar: true, why: "Draw a square inside a square; 6 faces." },
  { name: "Petersen", n: 10, m: 15, triangleFree: true, planar: false, why: "Passes the edge bound (15 ≤ 16) but contains a subdivision of K3,3." },
  { name: "Wheel W6", n: 6, m: 10, triangleFree: false, planar: true, why: "A hub inside a 5-cycle; 6 faces." },
];

/* ------------------------------------------------------------ bipartite matching and Hall's condition */
export type Bip = { L: number; R: number; adj: boolean[][] }; // adj[i][j]: left i — right j
export function maxBipMatching(b: Bip) {
  const matchR = new Array(b.R).fill(-1);
  const tryK = (u: number, seen: boolean[]): boolean => { for (let v = 0; v < b.R; v++) if (b.adj[u][v] && !seen[v]) { seen[v] = true; if (matchR[v] < 0 || tryK(matchR[v], seen)) { matchR[v] = u; return true; } } return false; };
  let size = 0; for (let u = 0; u < b.L; u++) if (tryK(u, new Array(b.R).fill(false))) size++;
  return { size, pairs: matchR.map((u, v) => [u, v] as [number, number]).filter(([u]) => u >= 0) };
}
/** Smallest set S of left vertices with |N(S)| < |S|, or null if Hall's condition holds. */
export function hallViolation(b: Bip) {
  let best: number[] | null = null;
  for (let m = 1; m < 2 ** b.L; m++) {
    const S = [...Array(b.L).keys()].filter((i) => (m >> i) & 1);
    const N = new Set<number>(); S.forEach((i) => b.adj[i].forEach((on, j) => { if (on) N.add(j); }));
    if (N.size < S.length && (!best || S.length < best.length)) best = S;
  }
  return best;
}

/* ------------------------------------------------------------ isomorphism */
const has = (g: G, a: number, b: number) => g.edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
export function invariants(g: G) {
  const deg = Array.from({ length: g.n }, (_, i) => g.edges.filter(([a, b]) => a === i || b === i).length);
  let tri = 0; for (let a = 0; a < g.n; a++) for (let b = a + 1; b < g.n; b++) for (let c = b + 1; c < g.n; c++) if (has(g, a, b) && has(g, b, c) && has(g, a, c)) tri++;
  return { n: g.n, m: g.edges.length, degSeq: [...deg].sort((x, y) => y - x), triangles: tri };
}
export function isomorphism(g1: G, g2: G): number[] | null {
  if (g1.n !== g2.n || g1.edges.length !== g2.edges.length) return null;
  const n = g1.n; const perm = [...Array(n).keys()]; const used = new Array(n).fill(false); const map = new Array(n).fill(-1);
  const rec = (i: number): boolean => {
    if (i === n) return g1.edges.every(([a, b]) => has(g2, map[a], map[b]));
    for (const v of perm) if (!used[v]) { map[i] = v; used[v] = true; if (rec(i + 1)) return true; used[v] = false; }
    return false;
  };
  return rec(0) ? [...map] : null;
}
export const ISO_PAIRS: { name: string; a: G; b: G; note: string }[] = [
  { name: "Two drawings of C5", a: { n: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] }, b: { n: 5, edges: [[0, 2], [2, 4], [4, 1], [1, 3], [3, 0]] }, note: "The pentagram is a 5-cycle drawn differently." },
  { name: "C6 vs two triangles", a: { n: 6, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]] }, b: { n: 6, edges: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]] }, note: "Same degrees (all 2) but one is connected." },
  { name: "Path vs star (4 edges)", a: { n: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4]] }, b: { n: 5, edges: [[0, 1], [0, 2], [0, 3], [0, 4]] }, note: "Both trees with 5 vertices; degree sequences differ." },
  { name: "K3,3 vs prism", a: { n: 6, edges: [[0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]] }, b: { n: 6, edges: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3], [0, 3], [1, 4], [2, 5]] }, note: "Both 3-regular on 6 vertices; the prism has triangles." },
];

/* ------------------------------------------------------------ pigeonhole on residues */
export function residues(nums: number[], k: number) { const boxes: number[][] = Array.from({ length: k }, () => []); nums.forEach((x) => boxes[((x % k) + k) % k].push(x)); return boxes; }

/* ------------------------------------------------------------ binomial identities */
export const row = (n: number) => Array.from({ length: n + 1 }, (_, k) => nCr(n, k));
export const hockey = (r: number, n: number) => { let s = 0; for (let i = r; i <= n; i++) s += nCr(i, r); return { sum: s, closed: nCr(n + 1, r + 1) }; };
export const vandermonde = (m: number, n: number, k: number) => { let s = 0; for (let i = 0; i <= k; i++) s += nCr(m, i) * nCr(n, k - i); return { sum: s, closed: nCr(m + n, k) }; };

/* ------------------------------------------------------------ master theorem: T(n) = a T(n/b) + Θ(n^k log^p n) */
export function master(a: number, b: number, k: number, p = 0) {
  const c = Math.log(a) / Math.log(b); const eps = 1e-9;
  const fmt = (x: number) => (Math.abs(x - Math.round(x)) < 1e-9 ? String(Math.round(x)) : String(+x.toFixed(3)));
  const nPow = (e: string) => (e === "0" ? "1" : e === "1" ? "n" : `n^${e}`);
  const logs = (q: number) => (q === 0 ? "" : q === 1 ? " log n" : ` log^${q} n`);
  const th = (e: string, q: number) => `Θ(${e === "0" && q > 0 ? logs(q).trim() : nPow(e) + logs(q)})`;
  if (c > k + eps) return { case: 1, c, answer: th(fmt(c), 0), why: `log_${b} ${a} = ${fmt(c)} > ${k}: the leaves dominate.` };
  if (Math.abs(c - k) <= eps) return { case: 2, c, answer: th(fmt(k), p + 1), why: `log_${b} ${a} = ${fmt(c)} = k: every level costs the same, times log n levels.` };
  return { case: 3, c, answer: th(fmt(k), p), why: `log_${b} ${a} = ${fmt(c)} < ${k}: the root's work dominates (regularity holds for polynomial f).` };
}
