/** Programming and Data Structures engines. Every number in content/study/CS/pds-*.ts comes from here, checked by script. */

/* ------------------------------------------------------------ C types: two's-complement storage */
export type CType = "signed char" | "unsigned char" | "short" | "unsigned short" | "int" | "unsigned int";
const BITS: Record<CType, number> = { "signed char": 8, "unsigned char": 8, short: 16, "unsigned short": 16, int: 32, "unsigned int": 32 };
export function stored(t: CType, v: number) {
  const b = BITS[t]; const m = 2 ** b; let x = ((Math.trunc(v) % m) + m) % m; const signed = !t.startsWith("unsigned");
  if (signed && x >= m / 2) x -= m;
  return { bits: b, value: x, min: signed ? -(m / 2) : 0, max: signed ? m / 2 - 1 : m - 1, wrapped: x !== Math.trunc(v), binary: (((Math.trunc(v) % m) + m) % m).toString(2).padStart(b, "0") };
}

/* ------------------------------------------------------------ loop counting */
export type LoopPat = "i<n,j<n" | "i<n,j<i" | "i*=2" | "i<n,j*=2" | "i<n,j+=i" | "i*i<n";
export function loopCount(p: LoopPat, n: number) {
  let c = 0;
  if (p === "i<n,j<n") for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) c++;
  else if (p === "i<n,j<i") for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) c++;
  else if (p === "i*=2") for (let i = 1; i < n; i *= 2) c++;
  else if (p === "i<n,j*=2") for (let i = 0; i < n; i++) for (let j = 1; j < n; j *= 2) c++;
  else if (p === "i<n,j+=i") for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j += i) c++;
  else for (let i = 0; i * i < n; i++) c++;
  return c;
}

/* ------------------------------------------------------------ pointer arithmetic on int a[R][C] */
export function ptrExpr(base: number, size: number, rows: number, cols: number, expr: string) {
  const table: Record<string, (i: number, j: number) => { addr: number; kind: string }> = {
    "a + i": (i) => ({ addr: base + i * cols * size, kind: "pointer to row i (int (*)[C])" }),
    "*(a + i)": (i) => ({ addr: base + i * cols * size, kind: "row i decays to int*: same address" }),
    "*(a + i) + j": (i, j) => ({ addr: base + (i * cols + j) * size, kind: "address of a[i][j]" }),
    "&a + 1": () => ({ addr: base + rows * cols * size, kind: "pointer past the whole array (int (*)[R][C])" }),
    "a[0] + i*C + j": (i, j) => ({ addr: base + (i * cols + j) * size, kind: "flat index: same as &a[i][j]" }),
  };
  return table[expr];
}

/* ------------------------------------------------------------ parameter passing */
export type PMode = "value" | "reference" | "value-result";
/** void f(int x, int y) { x = x + 1; y = y + x; }  int a = A; f(a, a); print a. Value-result copies back x then y. */
export function paramPass(mode: PMode, a: number) {
  if (mode === "value") return { a, note: "copies change; a unchanged" };
  if (mode === "reference") { let v = a; v = v + 1; v = v + v; return { a: v, note: "x and y both alias a: a = a + 1, then a = a + a" }; }
  const x = a + 1, y = a + x; return { a: y, note: `x = ${x}, y = ${y}; copy back x then y, so the last copy (y) wins` };
}
export function staticCounter(calls: number) { let s = 0; const out: number[] = []; for (let k = 0; k < calls; k++) { s++; out.push(s); } return out; }

/* ------------------------------------------------------------ struct layout */
const SZ: Record<string, number> = { char: 1, short: 2, int: 4, float: 4, double: 8, "char*": 8, long: 8 };
export function structLayout(fields: string[]) {
  let off = 0, maxA = 1; const rows: { f: string; off: number; size: number; pad: number }[] = [];
  for (const f of fields) { const s = SZ[f] ?? 0; if (!s) continue; const pad = (s - (off % s)) % s; off += pad; rows.push({ f, off, size: s, pad }); off += s; maxA = Math.max(maxA, s); }
  const tail = (maxA - (off % maxA)) % maxA; const unionSize = Math.ceil(Math.max(0, ...fields.map((f) => SZ[f] ?? 0)) / maxA) * maxA;
  return { rows, size: off + tail, tail, packed: rows.reduce((a, r) => a + r.size, 0), unionSize };
}

/* ------------------------------------------------------------ recursion traces */
export type RecProg = "print-around" | "sum-digits" | "power";
export function recTrace(p: RecProg, n: number) {
  const out: string[] = []; let calls = 0, depth = 0, maxDepth = 0;
  const enter = () => { calls++; depth++; maxDepth = Math.max(maxDepth, depth); };
  const f1 = (k: number) => { enter(); if (k > 0) { out.push(String(k)); f1(k - 1); out.push(String(k)); } depth--; };
  const f2 = (k: number): number => { enter(); const r = k < 10 ? k : (k % 10) + f2(Math.floor(k / 10)); depth--; return r; };
  const f3 = (k: number): number => { enter(); let r: number; if (k === 0) r = 1; else { const h = f3(Math.floor(k / 2)); r = h * h * (k % 2 ? 2 : 1); } depth--; return r; };
  let result: number | null = null;
  if (p === "print-around") f1(n); else if (p === "sum-digits") result = f2(n); else result = f3(n);
  return { out: out.join(" "), calls, maxDepth, result };
}
export function fibCalls(n: number) { const c: number[] = [1, 1]; for (let k = 2; k <= n; k++) c[k] = c[k - 1] + c[k - 2] + 1; const f: number[] = [0, 1]; for (let k = 2; k <= n; k++) f[k] = f[k - 1] + f[k - 2]; return { calls: c[n], adds: (c[n] - 1) / 2, value: f[n], memoCalls: n === 0 ? 1 : 2 * n - 1 }; }
export function hanoi(n: number) { const moves: string[] = []; const go = (k: number, a: string, b: string, c: string) => { if (!k) return; go(k - 1, a, c, b); moves.push(`disc ${k}: ${a}→${c}`); go(k - 1, b, a, c); }; go(n, "A", "B", "C"); return { count: 2 ** n - 1, moves }; }
export function ackermann(m: number, n: number) { let calls = 0; const A = (x: number, y: number): number => { calls++; if (calls > 200000) throw new Error("too big"); return x === 0 ? y + 1 : y === 0 ? A(x - 1, 1) : A(x - 1, A(x, y - 1)); }; try { return { value: A(m, n), calls }; } catch { return { value: null as number | null, calls }; } }

/* ------------------------------------------------------------ array address calculation */
export function addr2(base: number, size: number, lr: number, ur: number, lc: number, uc: number, i: number, j: number, rowMajor: boolean) {
  const R = ur - lr + 1, C = uc - lc + 1; const k = rowMajor ? (i - lr) * C + (j - lc) : (j - lc) * R + (i - lr);
  return { R, C, k, addr: base + k * size, valid: i >= lr && i <= ur && j >= lc && j <= uc };
}
/* ------------------------------------------------------------ special matrices (1-based i, j) */
export function triIndex(n: number, i: number, j: number, kind: "lower-row" | "lower-col" | "upper-row" | "tridiag") {
  if (kind === "lower-row") return i >= j ? { k: (i * (i - 1)) / 2 + (j - 1), stored: (n * (n + 1)) / 2 } : null;
  if (kind === "lower-col") return i >= j ? { k: (j - 1) * n - ((j - 1) * (j - 2)) / 2 + (i - j), stored: (n * (n + 1)) / 2 } : null;
  if (kind === "upper-row") return i <= j ? { k: (i - 1) * n - ((i - 1) * (i - 2)) / 2 + (j - i), stored: (n * (n + 1)) / 2 } : null;
  return Math.abs(i - j) <= 1 ? { k: 2 * i + j - 3, stored: 3 * n - 2 } : null;
}
/* ------------------------------------------------------------ binary search */
export function bsearch(a: number[], key: number) {
  let lo = 0, hi = a.length - 1; const probes: { lo: number; hi: number; mid: number; v: number }[] = [];
  while (lo <= hi) { const mid = Math.floor((lo + hi) / 2); probes.push({ lo, hi, mid, v: a[mid] }); if (a[mid] === key) return { found: mid, probes }; if (a[mid] < key) lo = mid + 1; else hi = mid - 1; }
  return { found: -1, probes };
}

/* ------------------------------------------------------------ stack permutations */
export function stackPerm(seq: number[]) {
  const n = seq.length; const st: number[] = []; let next = 1; const ops: string[] = [];
  for (const x of seq) { while (next <= n && (st.length === 0 || st[st.length - 1] !== x)) { st.push(next); ops.push(`push ${next}`); next++; } if (st[st.length - 1] !== x) return { ok: false, ops, stuck: x }; st.pop(); ops.push(`pop ${x}`); }
  return { ok: true, ops, stuck: null as number | null };
}
export const catalan = (n: number) => { let c = 1; for (let k = 0; k < n; k++) c = (c * 2 * (2 * k + 1)) / (k + 2); return Math.round(c); };

/* ------------------------------------------------------------ infix → postfix, evaluation */
const PREC: Record<string, number> = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3 };
export function toPostfix(src: string) {
  const out: string[] = [], st: string[] = [], log: { tok: string; stack: string; out: string }[] = [];
  const toks = src.replace(/\s+/g, "").match(/[A-Za-z0-9]+|[-+*/^()]/g) ?? [];
  for (const t of toks) {
    if (/^[A-Za-z0-9]+$/.test(t)) out.push(t);
    else if (t === "(") st.push(t);
    else if (t === ")") { while (st.length && st[st.length - 1] !== "(") out.push(st.pop()!); st.pop(); }
    else { while (st.length && st[st.length - 1] !== "(" && (PREC[st[st.length - 1]] > PREC[t] || (PREC[st[st.length - 1]] === PREC[t] && t !== "^"))) out.push(st.pop()!); st.push(t); }
    log.push({ tok: t, stack: st.join(" "), out: out.join(" ") });
  }
  while (st.length) out.push(st.pop()!);
  const maxStack = log.reduce((m, l) => Math.max(m, l.stack ? l.stack.split(" ").length : 0), 0);
  return { postfix: out.join(" "), log, maxStack };
}
export function evalPostfix(src: string) {
  const st: number[] = [], log: string[] = [];
  for (const t of src.trim().split(/\s+/)) {
    if (/^-?\d+$/.test(t)) st.push(Number(t));
    else { const b = st.pop(), a = st.pop(); if (a === undefined || b === undefined) return { value: null as number | null, log }; const r = t === "+" ? a + b : t === "-" ? a - b : t === "*" ? a * b : t === "/" ? Math.trunc(a / b) : a ** b; st.push(r); log.push(`${a} ${t} ${b} = ${r}`); }
  }
  return { value: st.length === 1 ? st[0] : null, log };
}

/* ------------------------------------------------------------ circular queue (one slot left empty) */
export function cqueue(n: number, ops: string[]) {
  const q: (number | null)[] = Array(n).fill(null); let front = 0, rear = 0; const log: string[] = [];
  for (const o of ops) {
    const m = /^E(\d+)$/i.exec(o);
    if (m) { if ((rear + 1) % n === front) { log.push(`enqueue ${m[1]}: full`); continue; } q[rear] = Number(m[1]); rear = (rear + 1) % n; log.push(`enqueue ${m[1]} (rear → ${rear})`); }
    else if (/^D$/i.test(o)) { if (front === rear) { log.push("dequeue: empty"); continue; } const v = q[front]; q[front] = null; front = (front + 1) % n; log.push(`dequeue ${v} (front → ${front})`); }
  }
  return { q, front, rear, count: (rear - front + n) % n, log };
}
/* ------------------------------------------------------------ queue from two stacks */
export function twoStackQueue(ops: string[]) {
  const inS: number[] = [], outS: number[] = []; let cost = 0, moves = 0; const log: string[] = [];
  for (const o of ops) { const m = /^E(\d+)$/i.exec(o);
    if (m) { inS.push(Number(m[1])); cost++; log.push(`enqueue ${m[1]}: push in (1)`); }
    else if (/^D$/i.test(o)) { let c = 0; if (!outS.length) while (inS.length) { outS.push(inS.pop()!); c += 2; moves++; } if (!outS.length) { log.push("dequeue: empty"); continue; } const v = outS.pop(); c++; cost += c; log.push(`dequeue ${v}: ${c} stack operations`); } }
  const n = ops.filter((o) => /^E/i.test(o)).length;
  return { cost, moves, log, perOp: ops.length ? cost / ops.length : 0, n };
}

/* ------------------------------------------------------------ singly linked list */
export function listOps(init: number[], ops: string[]) {
  let L = [...init]; const log: string[] = [];
  for (const o of ops) { const [c, a] = o.trim().split(/\s+/); const v = Number(a);
    if (c === "front") { L = [v, ...L]; log.push(`insert ${v} at front: 2 pointer writes`); }
    else if (c === "end") { L = [...L, v]; log.push(`insert ${v} at end: walk ${Math.max(0, L.length - 2)} links without a tail pointer`); }
    else if (c === "del") { const i = L.indexOf(v); if (i < 0) log.push(`delete ${v}: not found after ${L.length} comparisons`); else { L.splice(i, 1); log.push(`delete ${v}: found after ${i + 1} comparisons`); } }
    else if (c === "reverse") { L = [...L].reverse(); log.push(`reverse: ${L.length} pointer flips with prev/cur/next`); } }
  return { list: L, log };
}
export function josephus(n: number, k: number) { const a = Array.from({ length: n }, (_, i) => i + 1); const order: number[] = []; let i = 0; while (a.length > 1) { i = (i + k - 1) % a.length; order.push(a.splice(i, 1)[0]); } return { order, survivor: a[0] }; }
export function floyd(mu: number, lam: number) {
  // nodes 0..mu+lam-1; next(x) = x+1, except last → mu
  const nx = (x: number) => (x + 1 < mu + lam ? x + 1 : mu); let s = nx(0), f = nx(nx(0)), steps = 1;
  while (s !== f) { s = nx(s); f = nx(nx(f)); steps++; }
  let p = 0, q = s, t = 0; while (p !== q) { p = nx(p); q = nx(q); t++; }
  return { meetStep: steps, meetNode: s, start: p, findSteps: t };
}

/* ------------------------------------------------------------ binary tree properties */
export function treeProps(h: number, n: number) { return { maxNodes: 2 ** (h + 1) - 1, minNodes: h + 1, minHeight: Math.floor(Math.log2(n)), maxHeight: n - 1, leavesFull: 2 ** h, shapes: catalan(n) }; }

/* ------------------------------------------------------------ traversals */
type TNode = { v: string; l: TNode | null; r: TNode | null };
export function buildPreIn(pre: string[], ino: string[]): TNode | null {
  if (!pre.length || pre.length !== ino.length) return null; const root = pre[0]; const k = ino.indexOf(root); if (k < 0) return null;
  const l = buildPreIn(pre.slice(1, k + 1), ino.slice(0, k)); const r = buildPreIn(pre.slice(k + 1), ino.slice(k + 1));
  if ((k > 0 && !l) || (k < ino.length - 1 && !r)) return null; return { v: root, l, r };
}
export function orders(t: TNode | null) {
  const pre: string[] = [], ino: string[] = [], post: string[] = [], lvl: string[] = []; let h = -1;
  const go = (x: TNode | null, d: number) => { if (!x) return; h = Math.max(h, d); pre.push(x.v); go(x.l, d + 1); ino.push(x.v); go(x.r, d + 1); post.push(x.v); };
  go(t, 0); const q = t ? [t] : []; while (q.length) { const x = q.shift()!; lvl.push(x.v); if (x.l) q.push(x.l); if (x.r) q.push(x.r); }
  return { pre, ino, post, lvl, height: h };
}

/* ------------------------------------------------------------ BST */
type BNode = { v: number; l: BNode | null; r: BNode | null };
export function bstBuild(keys: number[]) { let root: BNode | null = null; let comps = 0; const ins = (x: BNode | null, v: number): BNode => { if (!x) return { v, l: null, r: null }; comps++; if (v < x.v) x.l = ins(x.l, v); else if (v > x.v) x.r = ins(x.r, v); return x; }; for (const k of keys) root = ins(root, k); return { root, comps }; }
export function bstDelete(root: BNode | null, v: number): BNode | null { if (!root) return null; if (v < root.v) root.l = bstDelete(root.l, v); else if (v > root.v) root.r = bstDelete(root.r, v); else { if (!root.l) return root.r; if (!root.r) return root.l; let s = root.r; while (s.l) s = s.l; root.v = s.v; root.r = bstDelete(root.r, s.v); } return root; }
export function bstInfo(root: BNode | null) { const pre: number[] = [], ino: number[] = []; let h = -1, leaves = 0; const go = (x: BNode | null, d: number) => { if (!x) return; h = Math.max(h, d); pre.push(x.v); go(x.l, d + 1); ino.push(x.v); go(x.r, d + 1); if (!x.l && !x.r) leaves++; }; go(root, 0); return { pre, ino, height: h, leaves }; }

/* ------------------------------------------------------------ AVL */
type ANode = { v: number; l: ANode | null; r: ANode | null; h: number };
export function avlBuild(keys: number[]) {
  const H = (x: ANode | null) => (x ? x.h : -1); const up = (x: ANode) => { x.h = 1 + Math.max(H(x.l), H(x.r)); return x; };
  const rotR = (y: ANode) => { const x = y.l!; y.l = x.r; x.r = y; up(y); return up(x); }, rotL = (x: ANode) => { const y = x.r!; x.r = y.l; y.l = x; up(x); return up(y); };
  const rots: string[] = [];
  const ins = (x: ANode | null, v: number): ANode => {
    if (!x) return { v, l: null, r: null, h: 0 }; if (v < x.v) x.l = ins(x.l, v); else if (v > x.v) x.r = ins(x.r, v); else return x; up(x);
    const b = H(x.l) - H(x.r);
    if (b > 1 && v < x.l!.v) { rots.push(`LL at ${x.v}: right rotation`); return rotR(x); }
    if (b < -1 && v > x.r!.v) { rots.push(`RR at ${x.v}: left rotation`); return rotL(x); }
    if (b > 1) { rots.push(`LR at ${x.v}: double rotation`); x.l = rotL(x.l!); return rotR(x); }
    if (b < -1) { rots.push(`RL at ${x.v}: double rotation`); x.r = rotR(x.r!); return rotL(x); }
    return x;
  };
  let root: ANode | null = null; for (const k of keys) root = ins(root, k);
  const pre: number[] = []; const go = (x: ANode | null) => { if (!x) return; pre.push(x.v); go(x.l); go(x.r); }; go(root);
  return { rots, height: H(root), root: root?.v ?? null, pre };
}
export const avlMinNodes = (h: number) => { const N = [1, 2]; for (let k = 2; k <= h; k++) N[k] = N[k - 1] + N[k - 2] + 1; return N[h]; };

/* ------------------------------------------------------------ heaps (max-heap, 0-based array) */
export function heapInsertAll(keys: number[]) { const a: number[] = []; let swaps = 0; for (const k of keys) { a.push(k); let i = a.length - 1; while (i > 0 && a[(i - 1) >> 1] < a[i]) { [a[i], a[(i - 1) >> 1]] = [a[(i - 1) >> 1], a[i]]; i = (i - 1) >> 1; swaps++; } } return { a, swaps }; }
function sift(a: number[], i: number, n: number) { let s = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < n && a[l] > a[m]) m = l; if (r < n && a[r] > a[m]) m = r; if (m === i) return s; [a[i], a[m]] = [a[m], a[i]]; i = m; s++; } }
export function buildHeap(keys: number[]) { const a = [...keys]; let swaps = 0; for (let i = (a.length >> 1) - 1; i >= 0; i--) swaps += sift(a, i, a.length); return { a, swaps }; }
export function deleteMax(heap: number[]) { const a = [...heap]; const top = a[0]; a[0] = a[a.length - 1]; a.pop(); const swaps = sift(a, 0, a.length); return { top, a, swaps }; }
export function heapsortTrace(keys: number[]) { const a = buildHeap(keys).a; const passes: string[] = [a.join(" ")]; for (let end = a.length - 1; end > 0; end--) { [a[0], a[end]] = [a[end], a[0]]; sift(a, 0, end); passes.push(`${a.slice(0, end).join(" ")} | ${a.slice(end).join(" ")}`); } return { sorted: a, passes }; }
export function heapCount(n: number): number { if (n <= 1) return 1; const h = Math.floor(Math.log2(n)); const lastFull = 2 ** h; const bottom = n - (lastFull - 1); const L = (lastFull / 2 - 1) + Math.min(bottom, lastFull / 2); const R = n - 1 - L; return binom(n - 1, L) * heapCount(L) * heapCount(R); }
const binom = (n: number, k: number) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
export const dary = (d: number, i: number) => ({ parent: i === 0 ? null : Math.floor((i - 1) / d), children: Array.from({ length: d }, (_, k) => d * i + k + 1) });
export const daryHeight = (d: number, n: number) => { let h = 0, cap = 1, tot = 1; while (tot < n) { cap *= d; tot += cap; h++; } return h; };

/* ------------------------------------------------------------ graphs */
export function parseEdges(src: string) { return src.split(/[,;\n]+/).map((e) => e.trim()).filter(Boolean).map((e) => e.split(/[-\s>]+/).filter(Boolean)).filter((p) => p.length === 2) as [string, string][]; }
export function graphRep(edges: [string, string][], directed: boolean) {
  const V = [...new Set(edges.flat())].sort(); const adj = new Map(V.map((v) => [v, [] as string[]]));
  for (const [a, b] of edges) { adj.get(a)!.push(b); if (!directed) adj.get(b)!.push(a); }
  adj.forEach((l) => l.sort());
  const matrix = V.map((a) => V.map((b) => (adj.get(a)!.includes(b) ? 1 : 0)));
  const outDeg = V.map((v) => adj.get(v)!.length); const inDeg = V.map((v) => V.filter((u) => adj.get(u)!.includes(v)).length);
  const listEntries = outDeg.reduce((a, b) => a + b, 0);
  return { V, adj, matrix, outDeg, inDeg, listEntries, E: edges.length, matrixCells: V.length ** 2 };
}
export function bfsDfs(edges: [string, string][], directed: boolean, start: string) {
  const { V, adj } = graphRep(edges, directed); if (!adj.has(start)) return null;
  const bfs: string[] = [], dist: Record<string, number> = { [start]: 0 }; const q = [start];
  while (q.length) { const u = q.shift()!; bfs.push(u); for (const w of adj.get(u)!) if (dist[w] === undefined) { dist[w] = dist[u] + 1; q.push(w); } }
  const d: Record<string, number> = {}, f: Record<string, number> = {}; let t = 0; const dfs: string[] = []; const kinds: { e: string; k: string }[] = []; const color: Record<string, number> = {};
  const visit = (u: string, parent: string | null) => { color[u] = 1; d[u] = ++t; dfs.push(u); for (const w of adj.get(u)!) { if (!directed && w === parent) continue; if (!color[w]) { kinds.push({ e: `${u}→${w}`, k: "tree" }); visit(w, u); } else if (color[w] === 1) kinds.push({ e: `${u}→${w}`, k: "back" }); else if (directed) kinds.push({ e: `${u}→${w}`, k: d[w] > d[u] ? "forward" : "cross" }); } color[u] = 2; f[u] = ++t; };
  visit(start, null); for (const v of V) if (!color[v]) visit(v, null);
  const seen = new Set<string>(); const uniq = directed ? kinds : kinds.filter((x) => { const [a, b] = x.e.split("→"); const k = [a, b].sort().join(); if (seen.has(k)) return false; seen.add(k); return true; });
  return { bfs, dist, dfs, d, f, kinds: uniq };
}
export function opCost(op: "edge?" | "neighbours" | "all-edges" | "add-vertex" | "transpose", V: number, E: number) {
  const t: Record<string, [string, number, string, number]> = {
    "edge?": ["O(1)", 1, "O(deg u)", Math.ceil(E / V)],
    neighbours: ["O(V)", V, "O(deg u)", Math.ceil(E / V)],
    "all-edges": ["O(V²)", V * V, "O(V + E)", V + E],
    "add-vertex": ["O(V²) copy", V * V, "O(1)", 1],
    transpose: ["O(V²)", V * V, "O(V + E)", V + E],
  };
  const [mb, mn, lb, ln] = t[op]; return { matrix: mb, matrixOps: mn, list: lb, listOps: ln, spaceMatrix: V * V, spaceList: V + E };
}
