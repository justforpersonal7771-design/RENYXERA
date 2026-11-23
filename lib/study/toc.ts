/** Theory of Computation engines (batch 1: automata, regular languages, grammars, PDAs). Checked by script. */

/* ------------------------------------------------------------ DFA */
export type DFA = { states: string[]; alpha: string[]; start: string; accept: string[]; delta: Record<string, Record<string, string>> };
export function runDFA(d: DFA, w: string) {
  let q = d.start; const path = [q];
  for (const c of w) { const n = d.delta[q]?.[c]; if (n === undefined) return { ok: false, path, dead: true }; q = n; path.push(q); }
  return { ok: d.accept.includes(q), path, dead: false };
}
const mk = (states: string[], alpha: string[], start: string, accept: string[], rows: string[][]): DFA => ({ states, alpha, start, accept, delta: Object.fromEntries(states.map((s, i) => [s, Object.fromEntries(alpha.map((a, j) => [a, rows[i][j]]))])) });
export const DFAS: Record<string, { label: string; dfa: DFA }> = {
  even0: { label: "Even number of 0s", dfa: mk(["E", "O"], ["0", "1"], "E", ["E"], [["O", "E"], ["E", "O"]]) },
  ends01: { label: "Ends with 01", dfa: mk(["q0", "q1", "q2"], ["0", "1"], "q0", ["q2"], [["q1", "q0"], ["q1", "q2"], ["q1", "q0"]]) },
  mod3: { label: "Binary number divisible by 3", dfa: mk(["r0", "r1", "r2"], ["0", "1"], "r0", ["r0"], [["r0", "r1"], ["r2", "r0"], ["r1", "r2"]]) },
  sub101: { label: "Contains 101", dfa: mk(["a", "b", "c", "d"], ["0", "1"], "a", ["d"], [["a", "b"], ["c", "b"], ["a", "d"], ["d", "d"]]) },
};

/* ------------------------------------------------------------ NFA and subset construction */
export type NFA = { states: string[]; alpha: string[]; start: string; accept: string[]; delta: Record<string, Record<string, string[]>> }; // "" = ε
function eclose(n: NFA, set: Set<string>) { const st = [...set]; const out = new Set(set); while (st.length) { const q = st.pop()!; for (const r of n.delta[q]?.[""] ?? []) if (!out.has(r)) { out.add(r); st.push(r); } } return out; }
export function subset(n: NFA) {
  const key = (s: Set<string>) => [...s].sort().join(",") || "∅";
  const start = eclose(n, new Set([n.start])); const seen = new Map<string, Set<string>>([[key(start), start]]); const queue = [start]; const rows: { from: string; on: string; to: string }[] = [];
  while (queue.length) { const S = queue.shift()!; for (const a of n.alpha) { const T = new Set<string>(); for (const q of S) for (const r of n.delta[q]?.[a] ?? []) T.add(r); const E = eclose(n, T); const k = key(E); rows.push({ from: key(S), on: a, to: k }); if (!seen.has(k)) { seen.set(k, E); queue.push(E); } } }
  const states = [...seen.keys()]; const accept = states.filter((k) => [...seen.get(k)!].some((q) => n.accept.includes(q)));
  return { states, accept, rows, start: key(start) };
}
export function nfaAccepts(n: NFA, w: string) { let S = eclose(n, new Set([n.start])); for (const c of w) { const T = new Set<string>(); for (const q of S) for (const r of n.delta[q]?.[c] ?? []) T.add(r); S = eclose(n, T); } return [...S].some((q) => n.accept.includes(q)); }
export const NFAS: Record<string, { label: string; nfa: NFA }> = {
  third1: { label: "3rd symbol from the end is 1", nfa: { states: ["p", "q", "r", "s"], alpha: ["0", "1"], start: "p", accept: ["s"], delta: { p: { "0": ["p"], "1": ["p", "q"] }, q: { "0": ["r"], "1": ["r"] }, r: { "0": ["s"], "1": ["s"] }, s: {} } } },
  ends01: { label: "Ends with 01", nfa: { states: ["A", "B", "C"], alpha: ["0", "1"], start: "A", accept: ["C"], delta: { A: { "0": ["A", "B"], "1": ["A"] }, B: { "1": ["C"] }, C: {} } } },
  eps: { label: "a* followed by b* (with ε-move)", nfa: { states: ["X", "Y"], alpha: ["a", "b"], start: "X", accept: ["Y"], delta: { X: { a: ["X"], "": ["Y"] }, Y: { b: ["Y"] } } } },
};

/* ------------------------------------------------------------ regular expressions (| concatenation * + ? ( ) ε) */
type RX = { t: "e" } | { t: "c"; c: string } | { t: "or"; a: RX; b: RX } | { t: "cat"; a: RX; b: RX } | { t: "star"; a: RX };
export function parseRx(src: string): RX | null {
  const s = src.replace(/\s+/g, ""); let i = 0;
  const atom = (): RX | null => { if (s[i] === "(") { i++; const e = alt(); if (s[i] !== ")") return null; i++; return e; } if (s[i] === "ε") { i++; return { t: "e" }; } if (i < s.length && /[a-z0-9]/i.test(s[i])) return { t: "c", c: s[i++] }; return null; };
  const post = (): RX | null => { let a = atom(); if (!a) return null; while (s[i] === "*" || s[i] === "+" || s[i] === "?") { const op = s[i++]; a = op === "*" ? { t: "star", a } : op === "+" ? { t: "cat", a, b: { t: "star", a } } : { t: "or", a, b: { t: "e" } }; } return a; };
  const cat = (): RX | null => { let a = post(); if (!a) return null; while (i < s.length && s[i] !== "|" && s[i] !== ")") { const b = post(); if (!b) return null; a = { t: "cat", a, b }; } return a; };
  const alt = (): RX | null => { let a = cat(); if (!a) return null; while (s[i] === "|") { i++; const b = cat(); if (!b) return null; a = { t: "or", a, b }; } return a; };
  const r = alt(); return r && i === s.length ? r : null;
}
/** Thompson NFA (counts states, ε-moves included) and membership. */
export function thompson(r: RX) {
  let id = 0; const delta: Record<string, Record<string, string[]>> = {}; const add = (p: string, c: string, q: string) => { (delta[p] ??= {}); (delta[p][c] ??= []).push(q); };
  const build = (x: RX): [string, string] => { const s = `s${id++}`, f = `s${id++}`;
    if (x.t === "e") add(s, "", f); else if (x.t === "c") add(s, x.c, f);
    else if (x.t === "or") { const [a1, a2] = build(x.a), [b1, b2] = build(x.b); add(s, "", a1); add(s, "", b1); add(a2, "", f); add(b2, "", f); }
    else if (x.t === "cat") { const [a1, a2] = build(x.a), [b1, b2] = build(x.b); add(s, "", a1); add(a2, "", b1); add(b2, "", f); }
    else { const [a1, a2] = build(x.a); add(s, "", a1); add(s, "", f); add(a2, "", a1); add(a2, "", f); }
    return [s, f]; };
  const [s, f] = build(r); const states = Array.from({ length: id }, (_, k) => `s${k}`);
  const alpha = [...new Set(Object.values(delta).flatMap((m) => Object.keys(m)).filter((c) => c))].sort();
  return { nfa: { states, alpha, start: s, accept: [f], delta } as NFA, count: id };
}
export function rxLang(src: string, alphabet: string[], maxLen: number) {
  const r = parseRx(src); if (!r) return null; const { nfa, count } = thompson(r); const out: string[] = [];
  let level = [""]; for (let L = 0; L <= maxLen; L++) { for (const w of level) if (nfaAccepts(nfa, w)) out.push(w || "ε"); level = level.flatMap((w) => alphabet.map((a) => w + a)); }
  return { words: out, states: count };
}

/* ------------------------------------------------------------ DFA minimisation (partition refinement) */
export function minimize(d: DFA) {
  const reach = new Set([d.start]); const st = [d.start]; while (st.length) { const q = st.pop()!; for (const a of d.alpha) { const r = d.delta[q][a]; if (!reach.has(r)) { reach.add(r); st.push(r); } } }
  const S = d.states.filter((q) => reach.has(q)); let part = [S.filter((q) => d.accept.includes(q)), S.filter((q) => !d.accept.includes(q))].filter((b) => b.length); const rounds: string[][][] = [part];
  for (;;) { const blockOf = (q: string) => part.findIndex((b) => b.includes(q)); const next: string[][] = [];
    for (const b of part) { const g = new Map<string, string[]>(); for (const q of b) { const sig = d.alpha.map((a) => blockOf(d.delta[q][a])).join(","); g.set(sig, [...(g.get(sig) ?? []), q]); } next.push(...g.values()); }
    if (next.length === part.length) break; part = next; rounds.push(part); }
  return { blocks: part, unreachable: d.states.filter((q) => !reach.has(q)), rounds };
}
export const BIG_DFA: DFA = mk(["A", "B", "C", "D", "E", "F", "G"], ["0", "1"], "A", ["C", "D"], [["B", "C"], ["A", "D"], ["E", "F"], ["E", "F"], ["E", "F"], ["F", "F"], ["G", "A"]]);

/* ------------------------------------------------------------ product construction of two mod counters */
export function productStates(m: number, n: number, op: "and" | "or" | "xor") { const acc: string[] = []; for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) { const a = i === 0, b = j === 0; if (op === "and" ? a && b : op === "or" ? a || b : a !== b) acc.push(`(${i},${j})`); } return { states: m * n, accepting: acc }; }

/* ------------------------------------------------------------ pumping lemma (regular) */
export type PumpLang = "anbn" | "ww" | "prime" | "evenA" | "square";
const isPrime = (n: number) => { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };
export function inLang(L: PumpLang, w: string): boolean {
  if (L === "anbn") { const m = /^(a*)(b*)$/.exec(w); return !!m && m[1].length === m[2].length; }
  if (L === "ww") { const h = w.length / 2; return Number.isInteger(h) && w.slice(0, h) === w.slice(h); }
  if (L === "prime") return /^a*$/.test(w) && isPrime(w.length);
  if (L === "square") return /^a*$/.test(w) && Number.isInteger(Math.sqrt(w.length));
  return /^[ab]*$/.test(w) && (w.match(/a/g) ?? []).length % 2 === 0;
}
export function pump(L: PumpLang, w: string, x: number, y: number) {
  const X = w.slice(0, x), Y = w.slice(x, x + y), Z = w.slice(x + y);
  const tries = [0, 1, 2, 3].map((i) => { const s = X + Y.repeat(i) + Z; return { i, len: s.length, ok: inLang(L, s) }; });
  return { X, Y, Z, tries, broken: tries.some((t) => !t.ok) };
}

/* ------------------------------------------------------------ minimal DFA sizes */
export const minStates = {
  countMod: (m: number, n: number) => m * n,              // #a ≡ r (mod m) and #b ≡ s (mod n)
  lenMod: (k: number) => k,                                // |w| divisible by k
  kthFromEnd: (k: number) => 2 ** k,                       // k-th symbol from the end is 1
  substring: (p: string) => p.length + 1,                  // contains a fixed string p (unary alphabet-free pattern)
  binaryMod: (k: number) => k,                             // binary numbers divisible by k (k odd or any k: at most k)
};

/* ------------------------------------------------------------ CFG: parse-tree counting (no ε-cycles) */
export type CFG = Record<string, string[][]>; // A -> list of right-hand sides (symbols); terminals are lowercase single chars
export function parseGrammar(src: string): { g: CFG; start: string } | null {
  const g: CFG = {}; let start = "";
  for (const line of src.split(/[;\n]+/).map((l) => l.trim()).filter(Boolean)) { const [l, r] = line.split(/->|→/); if (!l || r === undefined) return null; const A = l.trim(); if (!start) start = A; g[A] = [...(g[A] ?? []), ...r.split("|").map((alt) => (alt.trim() === "ε" || alt.trim() === "" ? [] : alt.trim().split(/\s+|(?=[A-Za-z()+*])/).filter(Boolean)))]; }
  return start ? { g, start } : null;
}
export function countTrees(g: CFG, start: string, w: string) {
  const memo = new Map<string, number>(); const isNT = (x: string) => x in g;
  const seq = (rhs: string[], i: number, j: number, k: number, depth: number): number => {
    if (k === rhs.length) return i === j ? 1 : 0;
    const x = rhs[k]; if (!isNT(x)) return w.slice(i, i + x.length) === x ? seq(rhs, i + x.length, j, k + 1, depth) : 0;
    let t = 0; for (let m = i; m <= j; m++) { const c = cnt(x, i, m, depth + 1); if (c) t += c * seq(rhs, m, j, k + 1, depth); } return t;
  };
  const cnt = (A: string, i: number, j: number, depth: number): number => { if (depth > 40) return 0; const key = `${A}|${i}|${j}`; if (memo.has(key)) return memo.get(key)!; memo.set(key, 0); let t = 0; for (const rhs of g[A]) t += seq(rhs, i, j, 0, depth); memo.set(key, t); return t; };
  return cnt(start, 0, w.length, 0);
}

/* ------------------------------------------------------------ CYK (grammar in CNF) */
export function cyk(g: CFG, start: string, w: string) {
  const n = w.length; const T: string[][][] = Array.from({ length: n }, () => Array.from({ length: n }, () => []));
  for (let i = 0; i < n; i++) for (const A in g) if (g[A].some((r) => r.length === 1 && r[0] === w[i])) T[i][i].push(A);
  for (let len = 2; len <= n; len++) for (let i = 0; i + len - 1 < n; i++) { const j = i + len - 1; const set = new Set<string>(); for (let k = i; k < j; k++) for (const A in g) for (const r of g[A]) if (r.length === 2 && T[i][k].includes(r[0]) && T[k + 1][j].includes(r[1])) set.add(A); T[i][j] = [...set].sort(); }
  return { table: T, accepted: n > 0 && T[0][n - 1].includes(start) };
}

/* ------------------------------------------------------------ PDA traces (deterministic presets) */
export type PdaKind = "anbn" | "wcwr" | "balanced";
export function runPDA(kind: PdaKind, w: string) {
  const stack: string[] = ["Z"]; const log: { rest: string; stack: string; note: string }[] = []; let state = "q0"; let ok = true;
  const snap = (i: number, note: string) => log.push({ rest: w.slice(i) || "ε", stack: [...stack].reverse().join(""), note });
  snap(0, "start");
  for (let i = 0; i < w.length && ok; i++) { const c = w[i];
    if (kind === "anbn") { if (c === "a" && state === "q0") { stack.push("A"); snap(i + 1, "push A"); } else if (c === "b" && stack.at(-1) === "A") { state = "q1"; stack.pop(); snap(i + 1, "pop A"); } else { ok = false; snap(i + 1, "no move: reject"); } }
    else if (kind === "wcwr") { if (state === "q0" && (c === "a" || c === "b")) { stack.push(c.toUpperCase()); snap(i + 1, `push ${c.toUpperCase()}`); } else if (state === "q0" && c === "c") { state = "q1"; snap(i + 1, "middle marker"); } else if (state === "q1" && stack.at(-1) === c.toUpperCase()) { stack.pop(); snap(i + 1, `pop ${c.toUpperCase()}`); } else { ok = false; snap(i + 1, "no move: reject"); } }
    else { if (c === "(") { stack.push("("); snap(i + 1, "push ("); } else if (c === ")" && stack.at(-1) === "(") { stack.pop(); snap(i + 1, "pop ("); } else { ok = false; snap(i + 1, "no move: reject"); } }
  }
  const accepted = ok && stack.length === 1 && (kind !== "wcwr" || state === "q1");
  return { log, accepted, maxStack: Math.max(...log.map((l) => l.stack.length)) };
}

/* ------------------------------------------------------------ chapter 4: pumping lemma for context-free languages */
export type CfPumpLang = "anbn" | "anbncn" | "ww" | "square" | "ijk";
/** Membership for the languages used in the pumping lab. anbn: aⁿbⁿ. anbncn: aⁿbⁿcⁿ. ww: a string repeated. square: a^(n²). ijk: aⁱbʲcᵏ with i < j < k. */
export function inCfLang(L: CfPumpLang, w: string): boolean {
  if (L === "anbn") { const n = w.length / 2; return Number.isInteger(n) && w === "a".repeat(n) + "b".repeat(n); }
  if (L === "anbncn") { const n = w.length / 3; return Number.isInteger(n) && w === "a".repeat(n) + "b".repeat(n) + "c".repeat(n); }
  if (L === "ww") { const h = w.length / 2; return Number.isInteger(h) && w.slice(0, h) === w.slice(h) && /^[ab]*$/.test(w); }
  if (L === "square") { const r = Math.round(Math.sqrt(w.length)); return /^a*$/.test(w) && r * r === w.length; }
  const m = /^(a*)(b*)(c*)$/.exec(w); return !!m && m[1].length < m[2].length && m[2].length < m[3].length;
}
/** Cut w = u v x' y' ... as five pieces by the lengths of u, v, the middle w, and x (y is the rest), then pump v and x together i times. */
export function pumpCf(L: CfPumpLang, w: string, lu: number, lv: number, lm: number, lx: number) {
  const u = w.slice(0, lu), v = w.slice(lu, lu + lv), m = w.slice(lu + lv, lu + lv + lm), x = w.slice(lu + lv + lm, lu + lv + lm + lx), y = w.slice(lu + lv + lm + lx);
  const tries = [0, 1, 2, 3].map((i) => { const s = u + v.repeat(i) + m + x.repeat(i) + y; return { i, s, ok: inCfLang(L, s) }; });
  return { u, v, m, x, y, tries, broken: tries.some((t) => !t.ok) };
}
/** Every way to cut w as u v m x y with |v m x| ≤ p and |v x| ≥ 1, and how many of them survive every pump i = 0..3 (the lemma says: some always do, for a context-free language). */
export function cfSplits(L: CfPumpLang, w: string, p: number) {
  let total = 0, survive = 0; const n = w.length;
  for (let a = 0; a <= n; a++) for (let b = a; b <= n && b - a <= p; b++) for (let c = b; c <= n && c - a <= p; c++) for (let d = c; d <= n && d - a <= p; d++) {
    if ((b - a) + (d - c) < 1) continue; total++;
    const r = pumpCf(L, w, a, b - a, c - b, d - c); if (!r.broken) survive++;
  }
  return { total, survive };
}

/* ------------------------------------------------------------ chapter 5: Turing machine simulator */
export type TM = { name: string; blurb: string; start: string; accept: string; alpha: string; /** "state,symbol" → [write, move, next state]; a missing entry rejects. "_" is the blank. */ delta: Record<string, [string, "L" | "R", string]> };
export const TMS: Record<string, TM> = {
  inc: { name: "Binary increment", blurb: "Adds 1 to a binary number written most significant bit first.", start: "q0", accept: "qa", alpha: "01",
    delta: { "q0,0": ["0", "R", "q0"], "q0,1": ["1", "R", "q0"], "q0,_": ["_", "L", "q1"], "q1,1": ["0", "L", "q1"], "q1,0": ["1", "L", "q2"], "q1,_": ["1", "L", "q2"], "q2,0": ["0", "L", "q2"], "q2,1": ["1", "L", "q2"], "q2,_": ["_", "R", "qa"] } },
  anbn: { name: "aⁿbⁿ", blurb: "Marks one a (X) and one b (Y) per round, until nothing is left unmatched.", start: "q0", accept: "qa", alpha: "ab",
    delta: { "q0,a": ["X", "R", "q1"], "q0,Y": ["Y", "R", "q3"], "q0,_": ["_", "R", "qa"], "q1,a": ["a", "R", "q1"], "q1,Y": ["Y", "R", "q1"], "q1,b": ["Y", "L", "q2"], "q2,a": ["a", "L", "q2"], "q2,Y": ["Y", "L", "q2"], "q2,X": ["X", "R", "q0"], "q3,Y": ["Y", "R", "q3"], "q3,_": ["_", "R", "qa"] } },
  anbncn: { name: "aⁿbⁿcⁿ", blurb: "A language that is not context-free: mark one a, one b and one c per round.", start: "q0", accept: "qa", alpha: "abc",
    delta: { "q0,a": ["X", "R", "q1"], "q0,Y": ["Y", "R", "q4"], "q0,_": ["_", "R", "qa"], "q1,a": ["a", "R", "q1"], "q1,Y": ["Y", "R", "q1"], "q1,b": ["Y", "R", "q2"], "q2,b": ["b", "R", "q2"], "q2,Z": ["Z", "R", "q2"], "q2,c": ["Z", "L", "q3"],
      "q3,a": ["a", "L", "q3"], "q3,b": ["b", "L", "q3"], "q3,Y": ["Y", "L", "q3"], "q3,Z": ["Z", "L", "q3"], "q3,X": ["X", "R", "q0"], "q4,Y": ["Y", "R", "q4"], "q4,Z": ["Z", "R", "q4"], "q4,_": ["_", "R", "qa"] } },
};
export function runTM(tm: TM, input: string, max = 4000) {
  const tape = new Map<number, string>(); [...input].forEach((c, i) => tape.set(i, c));
  let state = tm.start, head = 0, count = 0; const trace: { state: string; head: number; tape: string }[] = [];
  const snap = () => { const keys = [...tape.keys()]; const lo = Math.min(0, head, ...keys), hi = Math.max(input.length - 1, head, ...keys); let s = ""; for (let i = lo; i <= hi; i++) s += tape.get(i) ?? "_"; return { state, head: head - lo, tape: s }; };
  trace.push(snap());
  while (state !== tm.accept && count < max) {
    const sym = tape.get(head) ?? "_"; const rule = tm.delta[`${state},${sym}`];
    if (!rule) return { result: "reject" as const, count, trace: trace.slice(0, 300), tape: snap().tape };
    tape.set(head, rule[0]); head += rule[1] === "R" ? 1 : -1; state = rule[2]; count++; if (trace.length < 300) trace.push(snap());
  }
  return { result: state === tm.accept ? ("accept" as const) : ("limit" as const), count, trace: trace.slice(0, 300), tape: snap().tape.replace(/_+$/, "").replace(/^_+/, "") };
}
