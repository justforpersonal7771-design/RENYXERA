/** Discrete Mathematics engines. Every number the DM lessons quote is produced here and checked by scripts. */

/* ------------------------------------------------------------ propositional logic */
type Node = { op: "var"; v: string } | { op: "const"; val: boolean } | { op: "not"; a: Node } | { op: "and" | "or" | "imp" | "iff" | "xor"; a: Node; b: Node };
export function parseFormula(src: string): { ok: true; node: Node; vars: string[] } | { ok: false; error: string } {
  const s = src.replace(/<->|<=>|↔/g, "≡").replace(/->|=>|→/g, ">").replace(/[∧&]/g, "&").replace(/[∨|]/g, "|").replace(/[¬~!]/g, "!").replace(/[⊕^]/g, "^").replace(/\s+/g, "");
  let i = 0; const vars = new Set<string>();
  const peek = () => s[i];
  function prim(): Node {
    const c = peek();
    if (c === "!") { i++; return { op: "not", a: prim() }; }
    if (c === "(") { i++; const n = iff(); if (peek() !== ")") throw new Error("missing )"); i++; return n; }
    if (c === "T" || c === "1") { i++; return { op: "const", val: true }; }
    if (c === "F" || c === "0") { i++; return { op: "const", val: false }; }
    if (c && /[a-z]/.test(c)) { i++; vars.add(c); return { op: "var", v: c }; }
    throw new Error(c ? `unexpected "${c}"` : "formula ends too early");
  }
  function and(): Node { let n = prim(); while (peek() === "&") { i++; n = { op: "and", a: n, b: prim() }; } return n; }
  function or(): Node { let n = and(); while (peek() === "|" || peek() === "^") { const o = peek() === "|" ? "or" : "xor"; i++; n = { op: o, a: n, b: and() }; } return n; }
  function imp(): Node { const n = or(); if (peek() === ">") { i++; return { op: "imp", a: n, b: imp() }; } return n; } // right-associative
  function iff(): Node { let n = imp(); while (peek() === "≡") { i++; n = { op: "iff", a: n, b: imp() }; } return n; }
  try { const node = iff(); if (i < s.length) throw new Error(`unexpected "${s[i]}"`); return { ok: true, node, vars: [...vars].sort() }; } catch (e) { return { ok: false, error: (e as Error).message }; }
}
export function evalNode(n: Node, env: Record<string, boolean>): boolean {
  switch (n.op) {
    case "var": return env[n.v]; case "const": return n.val; case "not": return !evalNode(n.a, env);
    case "and": return evalNode(n.a, env) && evalNode(n.b, env); case "or": return evalNode(n.a, env) || evalNode(n.b, env);
    case "imp": return !evalNode(n.a, env) || evalNode(n.b, env); case "iff": return evalNode(n.a, env) === evalNode(n.b, env);
    case "xor": return evalNode(n.a, env) !== evalNode(n.b, env);
  }
}
/** Rows in standard order (all false first … all true last, first variable most significant). */
export function truthTable(src: string, extraVars: string[] = []) {
  const p = parseFormula(src); if (!p.ok) return p;
  const vars = [...new Set([...p.vars, ...extraVars])].sort();
  const rows = Array.from({ length: 2 ** vars.length }, (_, k) => { const env: Record<string, boolean> = {}; vars.forEach((v, j) => { env[v] = Boolean((k >> (vars.length - 1 - j)) & 1); }); return { env, k, out: evalNode(p.node, env) }; });
  const trues = rows.filter((r) => r.out).length;
  return { ok: true as const, vars, rows, kind: trues === rows.length ? "tautology" : trues === 0 ? "contradiction" : "contingency", minterms: rows.filter((r) => r.out).map((r) => r.k), maxterms: rows.filter((r) => !r.out).map((r) => r.k) };
}
export function equivalent(f: string, g: string) {
  const a = parseFormula(f), b = parseFormula(g); if (!a.ok) return { ok: false as const, error: `left: ${a.error}` }; if (!b.ok) return { ok: false as const, error: `right: ${b.error}` };
  const vars = [...new Set([...a.vars, ...b.vars])].sort();
  const ta = truthTable(f, vars), tb = truthTable(g, vars);
  if (!ta.ok || !tb.ok) return { ok: false as const, error: "parse" };
  const diff = ta.rows.find((r, k) => r.out !== tb.rows[k].out);
  return { ok: true as const, vars, same: !diff, counter: diff?.env ?? null, left: ta, right: tb };
}

/* ------------------------------------------------------------ first-order logic on small domains */
export type Rel = boolean[][]; // R[x][y]
export function quantifiers(R: Rel) {
  const D = R.map((_, i) => i);
  return {
    AxEy: D.every((x) => D.some((y) => R[x][y])), EyAx: D.some((y) => D.every((x) => R[x][y])),
    AyEx: D.every((y) => D.some((x) => R[x][y])), ExAy: D.some((x) => D.every((y) => R[x][y])),
    AxAy: D.every((x) => D.every((y) => R[x][y])), ExEy: D.some((x) => D.some((y) => R[x][y])),
  };
}
/** Statement forms over unary predicates P, Q. Each returns true/false for a model (P, Q as boolean arrays). */
export const FOL_FORMS: { id: string; text: string; f: (P: boolean[], Q: boolean[]) => boolean }[] = [
  { id: "a", text: "∀x (P(x) ∧ Q(x)) ↔ (∀x P(x) ∧ ∀x Q(x))", f: (P, Q) => P.every((p, i) => p && Q[i]) === (P.every(Boolean) && Q.every(Boolean)) },
  { id: "b", text: "∃x (P(x) ∨ Q(x)) ↔ (∃x P(x) ∨ ∃x Q(x))", f: (P, Q) => P.some((p, i) => p || Q[i]) === (P.some(Boolean) || Q.some(Boolean)) },
  { id: "c", text: "(∀x P(x) ∨ ∀x Q(x)) → ∀x (P(x) ∨ Q(x))", f: (P, Q) => !(P.every(Boolean) || Q.every(Boolean)) || P.every((p, i) => p || Q[i]) },
  { id: "d", text: "∀x (P(x) ∨ Q(x)) → (∀x P(x) ∨ ∀x Q(x))", f: (P, Q) => !P.every((p, i) => p || Q[i]) || P.every(Boolean) || Q.every(Boolean) },
  { id: "e", text: "∃x (P(x) ∧ Q(x)) → (∃x P(x) ∧ ∃x Q(x))", f: (P, Q) => !P.some((p, i) => p && Q[i]) || (P.some(Boolean) && Q.some(Boolean)) },
  { id: "f", text: "(∃x P(x) ∧ ∃x Q(x)) → ∃x (P(x) ∧ Q(x))", f: (P, Q) => !(P.some(Boolean) && Q.some(Boolean)) || P.some((p, i) => p && Q[i]) },
  { id: "g", text: "¬∀x P(x) ↔ ∃x ¬P(x)", f: (P) => !P.every(Boolean) === P.some((p) => !p) },
  { id: "h", text: "∀x (P(x) → Q(x)) → (∀x P(x) → ∀x Q(x))", f: (P, Q) => !P.every((p, i) => !p || Q[i]) || !P.every(Boolean) || Q.every(Boolean) },
  { id: "i", text: "(∀x P(x) → ∀x Q(x)) → ∀x (P(x) → Q(x))", f: (P, Q) => !(!P.every(Boolean) || Q.every(Boolean)) || P.every((p, i) => !p || Q[i]) },
];
/** Search every model on domains of size 1..3 for a counterexample. */
export function folCounter(f: (P: boolean[], Q: boolean[]) => boolean) {
  for (let n = 1; n <= 3; n++) for (let m = 0; m < 2 ** (2 * n); m++) {
    const P = Array.from({ length: n }, (_, i) => Boolean((m >> i) & 1)), Q = Array.from({ length: n }, (_, i) => Boolean((m >> (n + i)) & 1));
    if (!f(P, Q)) return { P, Q };
  }
  return null;
}

/* ------------------------------------------------------------ relations and functions */
export function relProps(R: Rel) {
  const n = R.length, I = [...Array(n).keys()];
  const reflexive = I.every((i) => R[i][i]), irreflexive = I.every((i) => !R[i][i]);
  const symmetric = I.every((i) => I.every((j) => R[i][j] === R[j][i]));
  const antisymmetric = I.every((i) => I.every((j) => i === j || !(R[i][j] && R[j][i])));
  const asymmetric = antisymmetric && irreflexive;
  const transitive = I.every((i) => I.every((j) => !R[i][j] || I.every((k) => !R[j][k] || R[i][k])));
  return { reflexive, irreflexive, symmetric, antisymmetric, asymmetric, transitive, equivalence: reflexive && symmetric && transitive, partialOrder: reflexive && antisymmetric && transitive, pairs: I.reduce((s, i) => s + I.filter((j) => R[i][j]).length, 0) };
}
export function transitiveClosure(R: Rel) { const n = R.length; const T = R.map((r) => [...r]); for (let k = 0; k < n; k++) for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (T[i][k] && T[k][j]) T[i][j] = true; return T; }
export const fact = (n: number): number => (n <= 1 ? 1 : n * fact(n - 1));
export const nPr = (n: number, r: number) => (r > n || r < 0 ? 0 : fact(n) / fact(n - r));
export const nCr = (n: number, r: number) => (r > n || r < 0 ? 0 : Math.round(fact(n) / (fact(r) * fact(n - r))));
export function stirling2(n: number, k: number): number { if (n === 0 && k === 0) return 1; if (n === 0 || k === 0) return 0; return k * stirling2(n - 1, k) + stirling2(n - 1, k - 1); }
export const bell = (n: number) => { let s = 0; for (let k = 0; k <= n; k++) s += stirling2(n, k); return s; };
export function countFunctions(m: number, n: number) { return { all: n ** m, injective: nPr(n, m), surjective: fact(n) * stirling2(m, n), bijective: m === n ? fact(n) : 0 }; }
export function countRelations(n: number) {
  const off = n * (n - 1);
  return { all: 2 ** (n * n), reflexive: 2 ** off, symmetric: 2 ** ((n * (n + 1)) / 2), reflSym: 2 ** (off / 2), antisymmetric: 2 ** n * 3 ** (off / 2), asymmetric: 3 ** (off / 2), equivalence: bell(n) };
}

/* ------------------------------------------------------------ posets and lattices */
export type Poset = { name: string; els: string[]; covers: [string, string][]; pos?: Record<string, [number, number]> }; // [a, b]: a is covered by b
export function leq(P: Poset) {
  const idx = new Map(P.els.map((e, i) => [e, i])); const n = P.els.length;
  const L: Rel = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => i === j));
  for (const [a, b] of P.covers) L[idx.get(a)!][idx.get(b)!] = true;
  return { L: transitiveClosure(L), idx };
}
export function latticeInfo(P: Poset) {
  const { L, idx } = leq(P); const E = P.els, n = E.length;
  const ubs = (a: number, b: number) => E.map((_, k) => k).filter((k) => L[a][k] && L[b][k]);
  const lbs = (a: number, b: number) => E.map((_, k) => k).filter((k) => L[k][a] && L[k][b]);
  const least = (S: number[]) => S.find((x) => S.every((y) => L[x][y]));
  const most = (S: number[]) => S.find((x) => S.every((y) => L[y][x]));
  const J: (number | undefined)[][] = [], M: (number | undefined)[][] = [];
  let isLattice = true;
  for (let a = 0; a < n; a++) { J[a] = []; M[a] = []; for (let b = 0; b < n; b++) { J[a][b] = least(ubs(a, b)); M[a][b] = most(lbs(a, b)); if (J[a][b] === undefined || M[a][b] === undefined) isLattice = false; } }
  const minimal = E.filter((_, i) => E.every((_, j) => j === i || !L[j][i])), maximal = E.filter((_, i) => E.every((_, j) => j === i || !L[i][j]));
  if (!isLattice) return { isLattice, minimal, maximal, join: null, meet: null, complements: null, distributive: false, complemented: false, idx };
  const bot = minimal.length === 1 ? idx.get(minimal[0])! : -1, top = maximal.length === 1 ? idx.get(maximal[0])! : -1;
  const complements: Record<string, string[]> = {};
  E.forEach((e, a) => { complements[e] = E.filter((_, b) => J[a][b] === top && M[a][b] === bot); });
  let distributive = true;
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) for (let c = 0; c < n; c++) if (M[a][J[b][c]!] !== J[M[a][b]!][M[a][c]!]) distributive = false;
  return { isLattice, minimal, maximal, join: (x: string, y: string) => E[J[idx.get(x)!][idx.get(y)!]!], meet: (x: string, y: string) => E[M[idx.get(x)!][idx.get(y)!]!], complements, distributive, complemented: Object.values(complements).every((c) => c.length > 0), idx };
}
export function divisorPoset(n: number): Poset {
  const els = [...Array(n).keys()].map((i) => i + 1).filter((d) => n % d === 0);
  const covers: [string, string][] = [];
  for (const a of els) for (const b of els) if (b !== a && b % a === 0 && !els.some((c) => c !== a && c !== b && c % a === 0 && b % c === 0)) covers.push([String(a), String(b)]);
  return { name: `D${n}`, els: els.map(String), covers };
}
export const LATTICES: Poset[] = [
  { name: "Chain of 4", els: ["0", "a", "b", "1"], covers: [["0", "a"], ["a", "b"], ["b", "1"]], pos: { "0": [80, 170], a: [80, 120], b: [80, 70], "1": [80, 20] } },
  { name: "Boolean B2 (diamond)", els: ["0", "a", "b", "1"], covers: [["0", "a"], ["0", "b"], ["a", "1"], ["b", "1"]], pos: { "0": [80, 170], a: [30, 95], b: [130, 95], "1": [80, 20] } },
  { name: "M3", els: ["0", "a", "b", "c", "1"], covers: [["0", "a"], ["0", "b"], ["0", "c"], ["a", "1"], ["b", "1"], ["c", "1"]], pos: { "0": [80, 170], a: [25, 95], b: [80, 95], c: [135, 95], "1": [80, 20] } },
  { name: "N5 (pentagon)", els: ["0", "a", "b", "c", "1"], covers: [["0", "a"], ["a", "b"], ["b", "1"], ["0", "c"], ["c", "1"]], pos: { "0": [80, 170], a: [35, 125], b: [35, 65], c: [130, 95], "1": [80, 20] } },
  { name: "Not a lattice (two tops)", els: ["0", "a", "b", "c", "d"], covers: [["0", "a"], ["0", "b"], ["a", "c"], ["b", "c"], ["a", "d"], ["b", "d"]], pos: { "0": [80, 170], a: [35, 95], b: [125, 95], c: [35, 20], d: [125, 20] } },
];

/* ------------------------------------------------------------ algebraic structures */
export type Struct = "Zn+" | "Znx" | "Znx0" | "Un";
export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));
export function structure(kind: Struct, n: number) {
  const els = kind === "Znx0" ? [...Array(n - 1).keys()].map((i) => i + 1) : kind === "Un" ? [...Array(n).keys()].filter((k) => k > 0 && gcd(k, n) === 1) : [...Array(n).keys()];
  const op = (a: number, b: number) => (kind === "Zn+" ? (a + b) % n : (a * b) % n);
  const table = els.map((a) => els.map((b) => op(a, b)));
  const closed = table.every((r) => r.every((v) => els.includes(v)));
  const assoc = els.every((a) => els.every((b) => els.every((c) => op(op(a, b), c) === op(a, op(b, c)))));
  const identity = els.find((e) => els.every((a) => op(e, a) === a && op(a, e) === a));
  const inverses = identity !== undefined && els.every((a) => els.some((b) => op(a, b) === identity && op(b, a) === identity));
  const commutative = els.every((a) => els.every((b) => op(a, b) === op(b, a)));
  const kindName = !closed ? "not closed" : !assoc ? "magma" : identity === undefined ? "semigroup" : !inverses ? "monoid" : commutative ? "abelian group" : "group";
  return { els, table, closed, assoc, identity, inverses, commutative, kindName };
}
export const phi = (n: number) => [...Array(n).keys()].filter((k) => k > 0 && gcd(k, n) === 1).length || (n === 1 ? 1 : 0);
export function cyclicInfo(n: number) {
  const order = (k: number) => n / gcd(k, n);
  const divs = [...Array(n).keys()].map((i) => i + 1).filter((d) => n % d === 0);
  return { orders: [...Array(n).keys()].map((k) => ({ k, ord: order(k) })), generators: [...Array(n).keys()].filter((k) => gcd(k, n) === 1 && (n > 1 || k === 0)), subgroups: divs.map((d) => ({ d, els: [...Array(d).keys()].map((i) => (i * n) / d) })), elementsOfOrder: divs.map((d) => ({ d, count: phi(d) })) };
}

/* ------------------------------------------------------------ graphs on up to 8 vertices */
export type G = { n: number; edges: [number, number][] };
const adj = (g: G) => { const A: number[][] = Array.from({ length: g.n }, () => []); for (const [a, b] of g.edges) { A[a].push(b); A[b].push(a); } return A; };
export function components(g: G, skipV = -1, skipE = -1) {
  const A: number[][] = Array.from({ length: g.n }, () => []); g.edges.forEach(([a, b], i) => { if (i !== skipE && a !== skipV && b !== skipV) { A[a].push(b); A[b].push(a); } });
  const seen = new Array(g.n).fill(false); let c = 0;
  for (let s = 0; s < g.n; s++) if (s !== skipV && !seen[s]) { c++; const st = [s]; seen[s] = true; while (st.length) { const u = st.pop()!; for (const v of A[u]) if (!seen[v]) { seen[v] = true; st.push(v); } } }
  return c;
}
export function graphInfo(g: G) {
  const A = adj(g), deg = A.map((x) => x.length), comps = components(g);
  const odd = deg.filter((d) => d % 2).length;
  const nonIso = deg.map((d, i) => (d > 0 ? i : -1)).filter((i) => i >= 0);
  const edgeConnected = g.edges.length > 0 && components({ n: g.n, edges: g.edges }) - deg.filter((d) => d === 0).length === 1;
  const cutVertices = [...Array(g.n).keys()].filter((v) => deg[v] > 0 && components(g, v) > comps);
  const bridges = g.edges.filter((_, i) => components(g, -1, i) > comps);
  return { deg, edges: g.edges.length, comps, odd, eulerCircuit: edgeConnected && odd === 0, eulerPath: edgeConnected && (odd === 0 || odd === 2), cutVertices, bridges, nonIso, sumDeg: deg.reduce((a, b) => a + b, 0) };
}
export function chromatic(g: G) {
  const A = adj(g); const col = new Array(g.n).fill(-1);
  for (let k = 1; k <= g.n; k++) { const ok = (v: number): boolean => { if (v === g.n) return true; for (let c = 0; c < k; c++) if (A[v].every((u) => col[u] !== c)) { col[v] = c; if (ok(v + 1)) return true; col[v] = -1; } return false; }; col.fill(-1); if (g.n === 0 || ok(0)) return { k: g.n === 0 ? 0 : k, colours: [...col] }; }
  return { k: g.n, colours: [...col] };
}
export function maxMatching(g: G) { let best: [number, number][] = []; const rec = (i: number, used: Set<number>, cur: [number, number][]) => { if (cur.length > best.length) best = [...cur]; for (let j = i; j < g.edges.length; j++) { const [a, b] = g.edges[j]; if (!used.has(a) && !used.has(b)) { used.add(a); used.add(b); cur.push([a, b]); rec(j + 1, used, cur); cur.pop(); used.delete(a); used.delete(b); } } }; rec(0, new Set(), []); return best; }
export function cliqueIndep(g: G) {
  const has = (a: number, b: number) => g.edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  let clique = 0, indep = 0;
  for (let m = 1; m < 2 ** g.n; m++) { const S = [...Array(g.n).keys()].filter((i) => (m >> i) & 1); const allE = S.every((a, i) => S.slice(i + 1).every((b) => has(a, b))), noE = S.every((a, i) => S.slice(i + 1).every((b) => !has(a, b))); if (allE) clique = Math.max(clique, S.length); if (noE) indep = Math.max(indep, S.length); }
  return { clique, indep };
}
export const GRAPHS: { name: string; g: G }[] = [
  { name: "K4", g: { n: 4, edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]] } },
  { name: "Cycle C5", g: { n: 5, edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] } },
  { name: "Bow tie", g: { n: 5, edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 2]] } },
  { name: "Two triangles + bridge", g: { n: 6, edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 3]] } },
  { name: "K3,3", g: { n: 6, edges: [[0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]] } },
  { name: "Wheel W6", g: { n: 6, edges: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [2, 3], [3, 4], [4, 5], [5, 1]] } },
];

/* ------------------------------------------------------------ counting */
export function derangements(n: number) { const D = [1, 0]; for (let k = 2; k <= n; k++) D[k] = (k - 1) * (D[k - 1] + D[k - 2]); return D[n]; }
export const surjections = (m: number, n: number) => { let s = 0; for (let k = 0; k <= n; k++) s += (-1) ** k * nCr(n, k) * (n - k) ** m; return s; };
export const catalan = (n: number) => nCr(2 * n, n) / (n + 1);

/* ------------------------------------------------------------ recurrences and generating functions */
export function recurrence(c1: number, c2: number, a0: number, a1: number, k = 10, d = 0) { const a = [a0, a1]; for (let n = 2; n < k; n++) a[n] = c1 * a[n - 1] + c2 * a[n - 2] + d; return a; }
export function charRoots(c1: number, c2: number) { const disc = c1 * c1 + 4 * c2; if (disc < 0) return { real: false as const, disc }; const s = Math.sqrt(disc); return { real: true as const, r1: (c1 + s) / 2, r2: (c1 - s) / 2, repeated: disc === 0, disc }; }
/** Multiply polynomials given as coefficient arrays. */
export const polyMul = (a: number[], b: number[]) => { const out = new Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { out[i + j] += x * y; })); return out; };
/** Number of integer solutions to x1 + … + xk = n with lo[i] ≤ xi ≤ hi[i]: the coefficient of x^n in Π (x^lo + … + x^hi). */
export function boundedSolutions(lo: number[], hi: number[], n: number) { let p = [1]; lo.forEach((l, i) => { const f = new Array(hi[i] + 1).fill(0); for (let t = l; t <= hi[i]; t++) f[t] = 1; p = polyMul(p, f); }); return { coeff: p[n] ?? 0, poly: p }; }
