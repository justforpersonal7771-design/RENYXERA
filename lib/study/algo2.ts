/** Algorithms engines, batch 2: greedy, dynamic programming, graph traversals, MST, shortest paths. Checked by script. */

/* ------------------------------------------------------------ greedy */
export type Iv = { name: string; s: number; f: number };
export function activity(ivs: Iv[]) { const o = [...ivs].sort((a, b) => a.f - b.f || a.s - b.s); const pick: Iv[] = []; let end = -Infinity; for (const x of o) if (x.s >= end) { pick.push(x); end = x.f; } return { order: o.map((x) => x.name), pick: pick.map((x) => x.name) }; }
export type Item = { name: string; w: number; v: number };
export function fracKnap(items: Item[], W: number) {
  const o = [...items].sort((a, b) => b.v / b.w - a.v / a.w); let cap = W, val = 0; const take: { name: string; frac: number }[] = [];
  for (const it of o) { if (cap <= 0) break; const t = Math.min(1, cap / it.w); take.push({ name: it.name, frac: t }); val += t * it.v; cap -= t * it.w; }
  return { order: o.map((x) => x.name), take, value: val };
}
export function huffman(freq: { s: string; f: number }[]) {
  type N = { f: number; s?: string; l?: N; r?: N; id: number }; let id = 0;
  let q: N[] = freq.map((x) => ({ f: x.f, s: x.s, id: id++ })); const merges: string[] = []; let cost = 0;
  const label = (n: N): string => n.s ?? `(${label(n.l!)}${label(n.r!)})`;
  while (q.length > 1) { q.sort((a, b) => a.f - b.f || a.id - b.id); const a = q.shift()!, b = q.shift()!; const m: N = { f: a.f + b.f, l: a, r: b, id: id++ }; cost += m.f; merges.push(`${label(a)}:${a.f} + ${label(b)}:${b.f} = ${m.f}`); q.push(m); }
  const codes: Record<string, string> = {}; const walk = (n: N, c: string) => { if (n.s !== undefined) { codes[n.s] = c || "0"; return; } walk(n.l!, c + "0"); walk(n.r!, c + "1"); }; if (q[0]) walk(q[0], "");
  const total = freq.reduce((t, x) => t + x.f * (codes[x.s]?.length ?? 0), 0); const sum = freq.reduce((t, x) => t + x.f, 0);
  return { codes, total, avg: sum ? total / sum : 0, merges, cost, fixed: Math.ceil(Math.log2(Math.max(2, freq.length))) * sum };
}
export type Job = { name: string; d: number; p: number };
export function jobSeq(jobs: Job[]) {
  const o = [...jobs].sort((a, b) => b.p - a.p); const maxD = Math.max(0, ...jobs.map((j) => j.d)); const slot: (string | null)[] = Array(maxD).fill(null); let profit = 0;
  for (const j of o) for (let t = Math.min(j.d, maxD) - 1; t >= 0; t--) if (!slot[t]) { slot[t] = j.name; profit += j.p; break; }
  return { slot, profit, done: slot.filter(Boolean).length };
}

/* ------------------------------------------------------------ dynamic programming */
export function lcs(a: string, b: string) {
  const m = a.length, n = b.length; const L = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) L[i][j] = a[i - 1] === b[j - 1] ? L[i - 1][j - 1] + 1 : Math.max(L[i - 1][j], L[i][j - 1]);
  let i = m, j = n, s = ""; while (i && j) { if (a[i - 1] === b[j - 1]) { s = a[i - 1] + s; i--; j--; } else if (L[i - 1][j] >= L[i][j - 1]) i--; else j--; }
  return { len: L[m][n], one: s, table: L };
}
export function knap01(items: Item[], W: number) {
  const n = items.length; const K = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));
  for (let i = 1; i <= n; i++) for (let w = 0; w <= W; w++) { K[i][w] = K[i - 1][w]; if (items[i - 1].w <= w) K[i][w] = Math.max(K[i][w], K[i - 1][w - items[i - 1].w] + items[i - 1].v); }
  const pick: string[] = []; let w = W; for (let i = n; i > 0; i--) if (K[i][w] !== K[i - 1][w]) { pick.unshift(items[i - 1].name); w -= items[i - 1].w; }
  return { value: K[n][W], pick, table: K };
}
export function mcm(p: number[]) {
  const n = p.length - 1; const m = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0)); const s = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
  for (let len = 2; len <= n; len++) for (let i = 1; i + len - 1 <= n; i++) { const j = i + len - 1; m[i][j] = Infinity; for (let k = i; k < j; k++) { const c = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j]; if (c < m[i][j]) { m[i][j] = c; s[i][j] = k; } } }
  const paren = (i: number, j: number): string => (i === j ? `A${i}` : `(${paren(i, s[i][j])}${paren(s[i][j] + 1, j)})`);
  const worst = (() => { const M = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0)); for (let len = 2; len <= n; len++) for (let i = 1; i + len - 1 <= n; i++) { const j = i + len - 1; for (let k = i; k < j; k++) M[i][j] = Math.max(M[i][j], M[i][k] + M[k + 1][j] + p[i - 1] * p[k] * p[j]); } return M[1][n]; })();
  return { cost: n ? m[1][n] : 0, paren: n ? paren(1, n) : "", worst, m };
}
export function coins(cs: number[], amt: number) {
  const ways = Array(amt + 1).fill(0); ways[0] = 1; for (const c of cs) for (let a = c; a <= amt; a++) ways[a] += ways[a - c];
  const mn = Array(amt + 1).fill(Infinity); mn[0] = 0; for (let a = 1; a <= amt; a++) for (const c of cs) if (c <= a && mn[a - c] + 1 < mn[a]) mn[a] = mn[a - c] + 1;
  let g = 0, left = amt; for (const c of [...cs].sort((x, y) => y - x)) { g += Math.floor(left / c); left %= c; }
  return { ways: ways[amt], min: Number.isFinite(mn[amt]) ? mn[amt] : null, greedy: left === 0 ? g : null };
}
export function subsetSum(xs: number[], T: number) { const can = Array(T + 1).fill(false); can[0] = true; for (const x of xs) for (let t = T; t >= x; t--) if (can[t - x]) can[t] = true; return can[T]; }
export function lis(xs: number[]) { const L = xs.map(() => 1), prev = xs.map(() => -1); for (let i = 0; i < xs.length; i++) for (let j = 0; j < i; j++) if (xs[j] < xs[i] && L[j] + 1 > L[i]) { L[i] = L[j] + 1; prev[i] = j; } let best = 0; L.forEach((v, i) => { if (v > L[best]) best = i; }); const seq: number[] = []; for (let i = xs.length ? best : -1; i >= 0; i = prev[i]) seq.unshift(xs[i]); return { len: xs.length ? L[best] : 0, seq }; }

/* ------------------------------------------------------------ graphs (shared parsing) */
export type WEdge = { a: string; b: string; w: number };
export function parseW(src: string): WEdge[] { return src.split(/[,;\n]+/).map((e) => e.trim()).filter(Boolean).map((e) => { const m = /^(\w+)\s*[-> ]\s*(\w+)\s*[: ]\s*(-?\d+(?:\.\d+)?)$/.exec(e); return m ? { a: m[1], b: m[2], w: Number(m[3]) } : null; }).filter((x): x is WEdge => !!x); }
export function parseD(src: string): [string, string][] { return src.split(/[,;\n]+/).map((e) => e.trim()).filter(Boolean).map((e) => e.split(/\s*(?:->|>|-)\s*/)).filter((p) => p.length === 2 && p[0] && p[1]) as [string, string][]; }
const verts = (es: { a: string; b: string }[] | [string, string][]) => [...new Set((es as (WEdge | [string, string])[]).flatMap((e) => (Array.isArray(e) ? e : [e.a, e.b])))].sort();

export function bipartite(edges: [string, string][]) {
  const V = verts(edges); const adj = new Map(V.map((v) => [v, [] as string[]])); for (const [a, b] of edges) { adj.get(a)!.push(b); adj.get(b)!.push(a); }
  const col: Record<string, number> = {}; let ok = true; let conflict: string | null = null;
  for (const s of V) { if (col[s] !== undefined) continue; col[s] = 0; const q = [s]; while (q.length) { const u = q.shift()!; for (const w of adj.get(u)!.sort()) { if (col[w] === undefined) { col[w] = 1 - col[u]; q.push(w); } else if (col[w] === col[u] && ok) { ok = false; conflict = `${u}–${w}`; } } } }
  return { ok, conflict, A: V.filter((v) => col[v] === 0), B: V.filter((v) => col[v] === 1) };
}
export function topo(edges: [string, string][]) {
  const V = verts(edges); const indeg: Record<string, number> = Object.fromEntries(V.map((v) => [v, 0])); const adj = new Map(V.map((v) => [v, [] as string[]]));
  for (const [a, b] of edges) { adj.get(a)!.push(b); indeg[b]++; }
  const d = { ...indeg }; const order: string[] = []; const ready = V.filter((v) => !d[v]);
  while (ready.length) { ready.sort(); const u = ready.shift()!; order.push(u); for (const w of adj.get(u)!) if (--d[w] === 0) ready.push(w); }
  // count all topological orders (small graphs)
  let count = 0; const cur = { ...indeg }; const used = new Set<string>();
  const rec = (k: number) => { if (count > 100000) return; if (k === V.length) { count++; return; } for (const v of V) if (!used.has(v) && cur[v] === 0) { used.add(v); for (const w of adj.get(v)!) cur[w]--; rec(k + 1); for (const w of adj.get(v)!) cur[w]++; used.delete(v); } };
  if (V.length <= 12) rec(0);
  return { order, dag: order.length === V.length, count: V.length <= 12 ? count : null };
}
export function scc(edges: [string, string][]) {
  const V = verts(edges); const adj = new Map(V.map((v) => [v, [] as string[]])), radj = new Map(V.map((v) => [v, [] as string[]]));
  for (const [a, b] of edges) { adj.get(a)!.push(b); radj.get(b)!.push(a); } adj.forEach((l) => l.sort()); radj.forEach((l) => l.sort());
  const seen = new Set<string>(), fin: string[] = []; const d1 = (u: string) => { seen.add(u); for (const w of adj.get(u)!) if (!seen.has(w)) d1(w); fin.push(u); };
  for (const v of V) if (!seen.has(v)) d1(v);
  const comp: string[][] = []; const seen2 = new Set<string>(); const d2 = (u: string, c: string[]) => { seen2.add(u); c.push(u); for (const w of radj.get(u)!) if (!seen2.has(w)) d2(w, c); };
  for (const v of [...fin].reverse()) if (!seen2.has(v)) { const c: string[] = []; d2(v, c); comp.push(c.sort()); }
  return { comps: comp, finishOrder: fin };
}
export function articulation(edges: [string, string][]) {
  const V = verts(edges); const adj = new Map(V.map((v) => [v, [] as string[]])); for (const [a, b] of edges) { adj.get(a)!.push(b); adj.get(b)!.push(a); }
  const disc: Record<string, number> = {}, low: Record<string, number> = {}; let t = 0; const ap = new Set<string>(); const bridges: string[] = [];
  const dfs = (u: string, p: string | null) => { disc[u] = low[u] = ++t; let kids = 0; for (const w of adj.get(u)!.sort()) { if (disc[w] === undefined) { kids++; dfs(w, u); low[u] = Math.min(low[u], low[w]); if (p !== null && low[w] >= disc[u]) ap.add(u); if (low[w] > disc[u]) bridges.push(`${u}–${w}`); } else if (w !== p) low[u] = Math.min(low[u], disc[w]); } if (p === null && kids > 1) ap.add(u); };
  for (const v of V) if (disc[v] === undefined) dfs(v, null);
  return { ap: [...ap].sort(), bridges };
}

/* ------------------------------------------------------------ MST */
export function kruskal(edges: WEdge[]) {
  const V = verts(edges); const par: Record<string, string> = Object.fromEntries(V.map((v) => [v, v])); const find = (x: string): string => (par[x] === x ? x : (par[x] = find(par[x])));
  const log: { e: string; w: number; take: boolean }[] = []; let total = 0; const tree: WEdge[] = [];
  for (const e of [...edges].sort((x, y) => x.w - y.w || (x.a + x.b).localeCompare(y.a + y.b))) { const ra = find(e.a), rb = find(e.b); const take = ra !== rb; if (take) { par[ra] = rb; total += e.w; tree.push(e); } log.push({ e: `${e.a}–${e.b}`, w: e.w, take }); }
  return { log, total, tree, connected: tree.length === V.length - 1 };
}
export function prim(edges: WEdge[], start: string) {
  const V = verts(edges); if (!V.includes(start)) return null; const inT = new Set([start]); const order: string[] = [start]; const add: string[] = []; let total = 0;
  while (inT.size < V.length) { let best: WEdge | null = null; for (const e of edges) { const cross = inT.has(e.a) !== inT.has(e.b); if (cross && (!best || e.w < best.w)) best = e; } if (!best) break; const nv = inT.has(best.a) ? best.b : best.a; inT.add(nv); order.push(nv); add.push(`${best.a}–${best.b} (${best.w})`); total += best.w; }
  return { order, add, total };
}
export function countSpanning(edges: WEdge[]) {
  const V = verts(edges); const n = V.length; if (edges.length > 16 || n < 2) return null; let all = 0, minW = Infinity, mins = 0;
  for (let m = 0; m < 1 << edges.length; m++) { const pick = edges.filter((_, i) => (m >> i) & 1); if (pick.length !== n - 1) continue; const par: Record<string, string> = Object.fromEntries(V.map((v) => [v, v])); const f = (x: string): string => (par[x] === x ? x : (par[x] = f(par[x]))); let ok = true; for (const e of pick) { const a = f(e.a), b = f(e.b); if (a === b) { ok = false; break; } par[a] = b; } if (!ok) continue; all++; const w = pick.reduce((s, e) => s + e.w, 0); if (w < minW) { minW = w; mins = 1; } else if (w === minW) mins++; }
  return { spanning: all, minW, msts: mins };
}

/* ------------------------------------------------------------ shortest paths */
export function dijkstra(edges: WEdge[], src: string, directed: boolean) {
  const V = verts(edges); if (!V.includes(src)) return null; const adj = new Map(V.map((v) => [v, [] as { to: string; w: number }[]])); for (const e of edges) { adj.get(e.a)!.push({ to: e.b, w: e.w }); if (!directed) adj.get(e.b)!.push({ to: e.a, w: e.w }); }
  const dist: Record<string, number> = Object.fromEntries(V.map((v) => [v, Infinity])), prev: Record<string, string | null> = {}; dist[src] = 0; const done = new Set<string>(); const order: string[] = []; const rows: string[] = [];
  while (done.size < V.length) { let u: string | null = null; for (const v of V) if (!done.has(v) && (u === null || dist[v] < dist[u])) u = v; if (u === null || dist[u] === Infinity) break; done.add(u); order.push(u); for (const { to, w } of adj.get(u)!) if (dist[u] + w < dist[to]) { dist[to] = dist[u] + w; prev[to] = u; } rows.push(V.map((v) => `${v}:${dist[v] === Infinity ? "∞" : dist[v]}`).join(" ")); }
  return { dist, order, rows, prev };
}
export function bellman(edges: WEdge[], src: string) {
  const V = verts(edges); if (!V.includes(src)) return null; const dist: Record<string, number> = Object.fromEntries(V.map((v) => [v, Infinity])); dist[src] = 0; const passes: string[] = [];
  for (let i = 1; i < V.length; i++) { let ch = false; for (const e of edges) if (dist[e.a] + e.w < dist[e.b]) { dist[e.b] = dist[e.a] + e.w; ch = true; } passes.push(V.map((v) => `${v}:${dist[v] === Infinity ? "∞" : dist[v]}`).join(" ")); if (!ch) break; }
  const neg = edges.some((e) => dist[e.a] + e.w < dist[e.b]);
  return { dist, passes, neg };
}
export function floydW(edges: WEdge[], directed: boolean) {
  const V = verts(edges); const n = V.length; const ix = (v: string) => V.indexOf(v); const D = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 0 : Infinity)));
  for (const e of edges) { D[ix(e.a)][ix(e.b)] = Math.min(D[ix(e.a)][ix(e.b)], e.w); if (!directed) D[ix(e.b)][ix(e.a)] = Math.min(D[ix(e.b)][ix(e.a)], e.w); }
  const steps: number[][][] = [D.map((r) => [...r])];
  for (let k = 0; k < n; k++) { for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (D[i][k] + D[k][j] < D[i][j]) D[i][j] = D[i][k] + D[k][j]; steps.push(D.map((r) => [...r])); }
  return { V, D, steps, negCycle: D.some((r, i) => r[i] < 0) };
}
