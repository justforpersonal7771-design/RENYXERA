/** Algorithms engines (CLRS-level). Every number in content/study/CS/algo-*.ts comes from here, checked by script. */

/* ------------------------------------------------------------ growth rates */
export const GROWTH: { name: string; f: (n: number) => number }[] = [
  { name: "log₂ n", f: (n) => Math.log2(n) }, { name: "√n", f: (n) => Math.sqrt(n) }, { name: "n", f: (n) => n },
  { name: "n log₂ n", f: (n) => n * Math.log2(n) }, { name: "n²", f: (n) => n * n }, { name: "n³", f: (n) => n ** 3 },
  { name: "2ⁿ", f: (n) => 2 ** n }, { name: "n!", f: (n) => { let r = 1; for (let k = 2; k <= n; k++) r *= k; return r; } },
];
export const growthAt = (n: number) => GROWTH.map((g) => ({ name: g.name, v: g.f(n) }));
/** First integer n ≥ 2 from which f(n) ≥ g(n) stays true up to 10 000 (searched). */
export function crossover(f: (n: number) => number, g: (n: number) => number) { let last = -1; for (let n = 2; n <= 10000; n++) { if (f(n) < g(n)) last = n; } return last + 1; }

/* ------------------------------------------------------------ recursion tree for T(n) = aT(n/b) + n^k */
export function recTree(a: number, b: number, k: number, n: number) {
  const levels: { i: number; nodes: number; size: number; work: number }[] = []; let size = n, nodes = 1, i = 0;
  while (size >= 1 && i < 40) { levels.push({ i, nodes, size, work: nodes * size ** k }); nodes *= a; size /= b; i++; }
  const total = levels.reduce((s, l) => s + l.work, 0); const ratio = a / b ** k;
  return { levels, total, ratio, depth: Math.log(n) / Math.log(b), leaves: n ** (Math.log(a) / Math.log(b)) };
}
/* ------------------------------------------------------------ master theorem with f(n) = n^k log^p n */
export function master(a: number, b: number, k: number, p: number) {
  const c = Math.log(a) / Math.log(b); const e = 1e-9; const cs = c.toFixed(3).replace(/\.?0+$/, "");
  const nk = (x: number) => (x === 0 ? "1" : x === 1 ? "n" : `n^${+x.toFixed(3)}`); const lg = (q: number) => (q === 0 ? "" : q === 1 ? " log n" : ` log^${q} n`);
  if (k < c - e) return { c, kase: 1, result: `Θ(${c === 1 ? "n" : `n^${cs}`})`, why: `f grows slower than n^log_b a = n^${cs}: the leaves dominate.` };
  if (Math.abs(k - c) < e) { if (p > -1) return { c, kase: 2, result: `Θ(${nk(k).replace(/^1$/, "")}${lg(p + 1)})`.replace("Θ( ", "Θ("), why: `f matches n^${cs} (times log^${p}): every level costs about the same; multiply by log n.` }; if (p === -1) return { c, kase: 2, result: `Θ(${nk(k)} log log n)`, why: "Extended case p = −1." }; return { c, kase: 2, result: `Θ(${nk(k)})`, why: "Extended case p < −1." }; }
  if (p >= 0) return { c, kase: 3, result: `Θ(${nk(k)}${lg(p)})`, why: `f grows faster than n^${cs}: the root dominates (regularity holds for polynomials).` };
  return { c, kase: 3, result: `Θ(${nk(k)})`, why: "Case 3 with p < 0." };
}

/* ------------------------------------------------------------ elementary sorts */
export type Elem = "bubble" | "selection" | "insertion";
export function elemSort(arr: number[], alg: Elem) {
  const a = [...arr]; let comps = 0, swaps = 0; const passes: string[] = []; const n = a.length;
  const inv = (() => { let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (arr[i] > arr[j]) c++; return c; })();
  if (alg === "bubble") { for (let i = 0; i < n - 1; i++) { let sw = false; for (let j = 0; j < n - 1 - i; j++) { comps++; if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; sw = true; } } passes.push(a.join(" ")); if (!sw) break; } }
  else if (alg === "selection") { for (let i = 0; i < n - 1; i++) { let m = i; for (let j = i + 1; j < n; j++) { comps++; if (a[j] < a[m]) m = j; } if (m !== i) { [a[i], a[m]] = [a[m], a[i]]; swaps++; } passes.push(a.join(" ")); } }
  else { for (let i = 1; i < n; i++) { const x = a[i]; let j = i - 1; while (j >= 0) { comps++; if (a[j] > x) { a[j + 1] = a[j]; swaps++; j--; } else break; } a[j + 1] = x; passes.push(a.join(" ")); } }
  return { sorted: a, comps, swaps, passes, inv };
}
/* ------------------------------------------------------------ merge sort */
export function mergeSort(arr: number[]) {
  let comps = 0, inv = 0; const levels: string[][] = [];
  const go = (a: number[], d: number): number[] => {
    if (a.length <= 1) return a; const m = Math.ceil(a.length / 2); const L = go(a.slice(0, m), d + 1), R = go(a.slice(m), d + 1); const out: number[] = []; let i = 0, j = 0;
    while (i < L.length && j < R.length) { comps++; if (L[i] <= R[j]) out.push(L[i++]); else { inv += L.length - i; out.push(R[j++]); } }
    const res = [...out, ...L.slice(i), ...R.slice(j)]; (levels[d] ??= []).push(res.join(" ")); return res;
  };
  const sorted = go(arr, 0); return { sorted, comps, inv, levels: levels.map((l) => l.join(" | ")).reverse() };
}
/* ------------------------------------------------------------ quicksort (Lomuto, last element pivot) */
export function quickSort(arr: number[]) {
  const a = [...arr]; let comps = 0, swaps = 0, depth = 0; const log: string[] = [];
  const qs = (lo: number, hi: number, d: number) => { if (lo >= hi) return; depth = Math.max(depth, d + 1); const p = a[hi]; let i = lo - 1; for (let j = lo; j < hi; j++) { comps++; if (a[j] <= p) { i++; if (i !== j) { [a[i], a[j]] = [a[j], a[i]]; swaps++; } } } if (i + 1 !== hi) { [a[i + 1], a[hi]] = [a[hi], a[i + 1]]; swaps++; } log.push(`pivot ${p}: ${a.slice(lo, hi + 1).join(" ")}`); qs(lo, i, d + 1); qs(i + 2, hi, d + 1); };
  qs(0, a.length - 1, 0); return { sorted: a, comps, swaps, depth, log };
}
export const minCompares = (n: number) => { let s = 0; for (let k = 2; k <= n; k++) s += Math.log2(k); return Math.ceil(s - 1e-9); };
/* ------------------------------------------------------------ counting and radix sort */
export function radix(arr: number[], base = 10) {
  let a = [...arr]; const passes: string[] = []; const max = Math.max(0, ...a); let exp = 1;
  while (Math.floor(max / exp) > 0) { const b: number[][] = Array.from({ length: base }, () => []); for (const x of a) b[Math.floor(x / exp) % base].push(x); a = b.flat(); passes.push(a.join(" ")); exp *= base; }
  return { sorted: a, passes, digits: passes.length };
}
export function countingSort(arr: number[], k: number) { const c = Array(k + 1).fill(0); for (const x of arr) c[x]++; const cum = [...c]; for (let i = 1; i <= k; i++) cum[i] += cum[i - 1]; const out = Array(arr.length); for (let i = arr.length - 1; i >= 0; i--) out[--cum[arr[i]]] = arr[i]; return { counts: c, sorted: out as number[] }; }

/* ------------------------------------------------------------ hashing */
export function chaining(keys: number[], m: number) {
  const t: number[][] = Array.from({ length: m }, () => []); for (const k of keys) t[((k % m) + m) % m].push(k);
  const longest = Math.max(...t.map((c) => c.length)); const n = keys.length; const succ = n ? t.reduce((s, c) => s + (c.length * (c.length + 1)) / 2, 0) / n : 0;
  return { table: t, longest, alpha: n / m, avgSuccess: succ, empty: t.filter((c) => !c.length).length };
}
export type Probe = "linear" | "quadratic" | "double";
export function openAddr(keys: number[], m: number, probe: Probe, h2mod = 7) {
  const t: (number | null)[] = Array(m).fill(null); const log: { k: number; probes: number; slot: number | null }[] = [];
  for (const k of keys) { const h = ((k % m) + m) % m; const s2 = h2mod - (k % h2mod); let placed: number | null = null, p = 0;
    for (let i = 0; i < m; i++) { const slot = probe === "linear" ? (h + i) % m : probe === "quadratic" ? (h + i * i) % m : (h + i * s2) % m; p++; if (t[slot] === null) { t[slot] = k; placed = slot; break; } }
    log.push({ k, probes: p, slot: placed }); }
  return { table: t, log, total: log.reduce((s, l) => s + l.probes, 0), failed: log.filter((l) => l.slot === null).length };
}
export function expected(alpha: number) {
  const a = Math.min(alpha, 0.999);
  return { chainS: 1 + a / 2, chainU: 1 + a, linS: 0.5 * (1 + 1 / (1 - a)), linU: 0.5 * (1 + 1 / (1 - a) ** 2), uniS: a > 0 ? (1 / a) * Math.log(1 / (1 - a)) : 1, uniU: 1 / (1 - a) };
}
export function birthday(n: number, m: number) { let p = 1; for (let i = 0; i < n; i++) p *= (m - i) / m; return 1 - p; }

/* ------------------------------------------------------------ divide and conquer counts */
export function maxMin(arr: number[]) {
  const n = arr.length; let comps = 0; let mx: number, mn: number, i: number;
  if (n % 2) { mx = mn = arr[0]; i = 1; } else { comps++; [mx, mn] = arr[0] > arr[1] ? [arr[0], arr[1]] : [arr[1], arr[0]]; i = 2; }
  for (; i + 1 < n; i += 2) { comps++; const [big, small] = arr[i] > arr[i + 1] ? [arr[i], arr[i + 1]] : [arr[i + 1], arr[i]]; comps++; if (big > mx) mx = big; comps++; if (small < mn) mn = small; }
  return { max: mx, min: mn, comps, naive: 2 * (n - 1), formula: Math.ceil((3 * n) / 2) - 2 };
}
export function secondLargest(arr: number[]) {
  let round = arr.map((v) => ({ v, beat: [] as number[] })); let comps = 0;
  while (round.length > 1) { const nx: typeof round = []; for (let i = 0; i < round.length; i += 2) { if (i + 1 === round.length) { nx.push(round[i]); continue; } comps++; const [w, l] = round[i].v > round[i + 1].v ? [round[i], round[i + 1]] : [round[i + 1], round[i]]; w.beat.push(l.v); nx.push(w); } round = nx; }
  const champ = round[0]; const second = Math.max(...champ.beat); comps += champ.beat.length - 1;
  return { max: champ.v, second, comps, beaten: champ.beat, formula: arr.length + Math.ceil(Math.log2(arr.length)) - 2 };
}
export function mult(n: number) { const lg = Math.log2(n); return { naiveMat: n ** 3, strassen: Math.round(7 ** lg), naiveDigits: n * n, karatsuba: Math.round(3 ** lg) }; }
export function quickselect(arr: number[], k: number) {
  const a = [...arr]; let comps = 0; const log: string[] = []; let lo = 0, hi = a.length - 1;
  while (lo <= hi) { const p = a[hi]; let i = lo - 1; for (let j = lo; j < hi; j++) { comps++; if (a[j] <= p) { i++; [a[i], a[j]] = [a[j], a[i]]; } } [a[i + 1], a[hi]] = [a[hi], a[i + 1]]; const q = i + 1; log.push(`pivot ${p} lands at index ${q}`); if (q === k - 1) return { value: a[q], comps, log }; if (q < k - 1) lo = q + 1; else hi = q - 1; }
  return { value: null as number | null, comps, log };
}
export function medianOfMedians(arr: number[]) { const groups: number[][] = []; for (let i = 0; i < arr.length; i += 5) groups.push(arr.slice(i, i + 5).sort((x, y) => x - y)); const meds = groups.map((g) => g[Math.floor((g.length - 1) / 2)]); const mm = [...meds].sort((x, y) => x - y)[Math.floor((meds.length - 1) / 2)]; return { groups, meds, pivot: mm, guaranteed: Math.floor(3 * arr.length / 10) }; }
