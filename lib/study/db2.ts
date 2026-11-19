/** Databases, depth topics: EER mapping, outer joins, grouping, NULL logic, 3NF/BCNF algorithms, MVDs, extendible hashing,
 * log recovery, multiple-granularity locking, optimistic validation. Checked by scripts/_db2.ts style one-offs. */
import { closure, candidateKeys, minimalCover, type FD, type Row, EMP } from "./db";

/* ------------------------------------------------------------ EER specialisation → tables */
export type EerOpt = "A" | "B" | "C";
/** A: superclass + one table per subclass. B: subclass tables only (needs total). C: one table with a type attribute. */
export function eerTables(nSub: number, total: boolean, disjoint: boolean, opt: EerOpt) {
  if (opt === "A") return { tables: nSub + 1, ok: true, note: "Works for every constraint; queries on a subclass need a join with the superclass." };
  if (opt === "B") return { tables: nSub, ok: total, note: total ? (disjoint ? "Fine: every entity sits in exactly one subclass table." : "Overlapping entities are stored in several tables, so their superclass attributes repeat.") : "Not allowed: an entity in no subclass would have nowhere to live." };
  return { tables: 1, ok: true, note: disjoint ? "One type attribute says which subclass; other subclasses' columns are NULL." : "Overlapping needs one Boolean flag per subclass instead of a single type attribute." };
}

/* ------------------------------------------------------------ outer joins */
export const EMP2: Row[] = [{ eid: 1, ename: "Ira", did: 10 }, { eid: 2, ename: "Jai", did: 20 }, { eid: 3, ename: "Kim", did: null }];
export const DEPT2: Row[] = [{ did: 10, dname: "CS" }, { did: 20, dname: "EC" }, { did: 30, dname: "ME" }];
export type JoinKind = "inner" | "left" | "right" | "full";
export function outerJoin(A: Row[], B: Row[], on: string, kind: JoinKind) {
  const colsA = Object.keys(A[0]), colsB = Object.keys(B[0]).filter((c) => c !== on);
  const nullB = Object.fromEntries(colsB.map((c) => [c, null])), out: Row[] = [], usedB = new Set<number>();
  for (const a of A) {
    const ms = B.map((b, i) => [b, i] as const).filter(([b]) => a[on] !== null && a[on] === b[on]);
    ms.forEach(([b, i]) => { usedB.add(i); out.push({ ...a, ...Object.fromEntries(colsB.map((c) => [c, b[c]])) }); });
    if (!ms.length && (kind === "left" || kind === "full")) out.push({ ...a, ...nullB });
  }
  if (kind === "right" || kind === "full") B.forEach((b, i) => { if (!usedB.has(i)) out.push({ ...Object.fromEntries(colsA.map((c) => [c, c === on ? b[on] : null])), ...Object.fromEntries(colsB.map((c) => [c, b[c]])) }); });
  return out;
}

/* ------------------------------------------------------------ GROUP BY / HAVING over EMP */
export type Agg = "COUNT(*)" | "COUNT(salary)" | "SUM(salary)" | "AVG(salary)" | "MAX(salary)";
export function groupBy(agg: Agg, having: number | null) {
  const groups = new Map<string, Row[]>();
  for (const r of EMP) { const k = r.dept === null ? "NULL" : String(r.dept); groups.set(k, [...(groups.get(k) ?? []), r]); }
  const val = (rs: Row[]) => { const s = rs.map((r) => r.salary).filter((x): x is number => typeof x === "number");
    if (agg === "COUNT(*)") return rs.length; if (agg === "COUNT(salary)") return s.length; if (!s.length) return null;
    if (agg === "SUM(salary)") return s.reduce((a, b) => a + b, 0); if (agg === "AVG(salary)") return s.reduce((a, b) => a + b, 0) / s.length; return Math.max(...s); };
  const rows = [...groups].map(([dept, rs]) => ({ dept, value: val(rs) }));
  return rows.filter((r) => having === null || (r.value !== null && r.value > having));
}

/* ------------------------------------------------------------ three-valued logic */
export type TV = "T" | "F" | "U";
export const and3 = (a: TV, b: TV): TV => (a === "F" || b === "F" ? "F" : a === "U" || b === "U" ? "U" : "T");
export const or3 = (a: TV, b: TV): TV => (a === "T" || b === "T" ? "T" : a === "U" || b === "U" ? "U" : "F");
export const not3 = (a: TV): TV => (a === "U" ? "U" : a === "T" ? "F" : "T");
export const cmp = (x: number | null, op: ">" | "=" | "<>", y: number): TV => (x === null ? "U" : (op === ">" ? x > y : op === "=" ? x === y : x !== y) ? "T" : "F");
/** WHERE keeps a row only when the condition is TRUE. */
export function whereNull(op: ">" | "=" | "<>", y: number, negate: boolean) {
  return EMP.map((r) => { let v = cmp(r.salary as number | null, op, y); if (negate) v = not3(v); return { name: String(r.name), salary: r.salary, v, kept: v === "T" }; });
}

/* ------------------------------------------------------------ 3NF synthesis and BCNF decomposition */
const key = (xs: string[]) => [...xs].sort().join("");
export function synth3NF(all: string[], fds: FD[]) {
  const cover = minimalCover(fds); const byL = new Map<string, Set<string>>();
  for (const f of cover) { const k = key(f.lhs); const s = byL.get(k) ?? new Set(f.lhs); f.rhs.forEach((a) => s.add(a)); byL.set(k, s); }
  let parts = [...byL.values()].map((s) => [...s].sort());
  parts = parts.filter((p, i) => !parts.some((q, j) => j !== i && q.length > p.length && p.every((a) => q.includes(a))));
  const { keys } = candidateKeys(all, fds); let addedKey: string[] | null = null;
  if (!parts.some((p) => keys.some((k) => k.every((a) => p.includes(a))))) { addedKey = keys[0]; parts.push(keys[0]); }
  return { cover, parts, addedKey };
}
export function bcnfDecompose(all: string[], fds: FD[]) {
  const steps: { split: string[]; on: string; into: [string[], string[]] }[] = [];
  const go = (R: string[]): string[][] => {
    for (let m = 1; m < 2 ** R.length - 1; m++) {
      const X = R.filter((_, i) => (m >> i) & 1); const c = closure(X, fds).filter((a) => R.includes(a));
      if (c.length > X.length && c.length < R.length) { const R1 = c.sort(), R2 = R.filter((a) => !c.includes(a) || X.includes(a)).sort();
        steps.push({ split: R, on: `${X.join("")} → ${c.filter((a) => !X.includes(a)).join("")}`, into: [R1, R2] }); return [...go(R1), ...go(R2)]; }
    }
    return [R];
  };
  return { parts: go([...all].sort()), steps };
}

/* ------------------------------------------------------------ multivalued dependencies */
/** X →→ Y holds iff for every two rows t1, t2 agreeing on X, the row (X, Y from t1, rest from t2) is present. */
export function mvdHolds(rows: Row[], X: string[], Y: string[]) {
  const cols = Object.keys(rows[0] ?? {}); const Z = cols.filter((c) => !X.includes(c) && !Y.includes(c));
  const has = (r: Row) => rows.some((s) => cols.every((c) => s[c] === r[c]));
  for (const t1 of rows) for (const t2 of rows) {
    if (!X.every((c) => t1[c] === t2[c])) continue;
    const t3: Row = {}; X.forEach((c) => (t3[c] = t1[c])); Y.forEach((c) => (t3[c] = t1[c])); Z.forEach((c) => (t3[c] = t2[c]));
    if (!has(t3)) return { holds: false, missing: t3 };
  }
  return { holds: true, missing: null as Row | null };
}
export const COURSE_TEACH_BOOK: Row[] = [
  { course: "DB", teacher: "Rao", book: "Korth" }, { course: "DB", teacher: "Rao", book: "Navathe" },
  { course: "DB", teacher: "Sen", book: "Korth" }, { course: "DB", teacher: "Sen", book: "Navathe" },
];

/* ------------------------------------------------------------ extendible hashing */
export function extendible(keys: number[], cap: number, maxDepth = 6) {
  type B = { d: number; keys: number[] };
  let g = 1; let dir: B[] = [{ d: 1, keys: [] }, { d: 1, keys: [] }]; let splits = 0, doublings = 0; const log: string[] = [];
  const idx = (k: number) => k & ((1 << g) - 1);
  for (const k of keys) {
    for (let guard = 0; guard < 20; guard++) {
      const b = dir[idx(k)];
      if (b.keys.length < cap) { b.keys.push(k); log.push(`${k} → bucket ${idx(k).toString(2).padStart(g, "0")}`); break; }
      if (b.d === g) { if (g >= maxDepth) { b.keys.push(k); log.push(`${k} overflows (depth limit)`); break; } dir = [...dir, ...dir]; g++; doublings++; log.push(`directory doubles to ${1 << g}`); }
      const nb: B = { d: b.d + 1, keys: [] }, ob: B = { d: b.d + 1, keys: [] }; const bit = 1 << b.d;
      for (const x of b.keys) (x & bit ? nb : ob).keys.push(x);
      dir = dir.map((e, i) => (e === b ? (i & bit ? nb : ob) : e)); splits++; log.push(`bucket splits (local depth ${b.d + 1})`);
    }
  }
  const buckets = [...new Set(dir)];
  return { global: g, dirSize: dir.length, buckets: buckets.length, splits, doublings, dir: dir.map((b, i) => ({ slot: i.toString(2).padStart(g, "0"), d: b.d, keys: b.keys, id: buckets.indexOf(b) })), log };
}

/* ------------------------------------------------------------ log-based recovery */
export type LogRec = { t?: number; kind: "start" | "write" | "commit" | "abort" | "checkpoint"; active?: number[] };
export function parseLog(src: string): LogRec[] {
  return src.split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean).map((tok) => {
    const ck = /^ckpt(?:\(([\d\s]*)\))?$/i.exec(tok); if (ck) return { kind: "checkpoint" as const, active: (ck[1] ?? "").split(/\s+/).filter(Boolean).map(Number) };
    const m = /^([SWCA])(\d+)/i.exec(tok); if (!m) return null; const k = { S: "start", W: "write", C: "commit", A: "abort" }[m[1].toUpperCase() as "S"] as LogRec["kind"];
    return { t: Number(m[2]), kind: k } as LogRec;
  }).filter((x): x is LogRec => !!x);
}
/** Immediate update with checkpoints: redo transactions that committed after the last checkpoint, undo those not committed. */
export function recover(log: LogRec[]) {
  const ci = log.map((r) => r.kind).lastIndexOf("checkpoint"); const tail = ci >= 0 ? log.slice(ci + 1) : log;
  const seen = new Set<number>(ci >= 0 ? log[ci].active ?? [] : []); tail.forEach((r) => r.t !== undefined && seen.add(r.t));
  const done = new Set(log.filter((r) => r.kind === "commit" || r.kind === "abort").map((r) => r.t!));
  const committed = new Set(log.filter((r) => r.kind === "commit").map((r) => r.t!));
  const redo = [...seen].filter((t) => committed.has(t)).sort((a, b) => a - b);
  const undo = [...seen].filter((t) => !done.has(t)).sort((a, b) => a - b);
  const ignored = [...new Set(log.filter((r) => r.t !== undefined).map((r) => r.t!))].filter((t) => !seen.has(t)).sort((a, b) => a - b);
  return { redo, undo, ignored, checkpointAt: ci };
}

/* ------------------------------------------------------------ multiple-granularity locking */
export const MGL = ["IS", "IX", "S", "SIX", "X"] as const;
export type Mode = (typeof MGL)[number];
const COMPAT: Record<Mode, Mode[]> = { IS: ["IS", "IX", "S", "SIX"], IX: ["IS", "IX"], S: ["IS", "S"], SIX: ["IS"], X: [] };
export const compatible = (a: Mode, b: Mode) => COMPAT[a].includes(b);
/** Locks needed on database → table → row for an operation. */
export function mglPath(op: "read-row" | "write-row" | "read-table" | "write-table" | "scan-update-few") {
  return { "read-row": ["IS", "IS", "S"], "write-row": ["IX", "IX", "X"], "read-table": ["IS", "S", "—"], "write-table": ["IX", "X", "—"], "scan-update-few": ["IX", "SIX", "X"] }[op] as string[];
}

/* ------------------------------------------------------------ optimistic (validation) concurrency control */
export type VTx = { id: number; start: number; validate: number; finish: number; read: string[]; write: string[] };
/** Tj validates against every Ti with TS(Ti) < TS(Tj) (validation order). */
export function validate(txs: VTx[]) {
  const order = [...txs].sort((a, b) => a.validate - b.validate);
  return order.map((tj, j) => {
    const checks = order.slice(0, j).map((ti) => {
      if (ti.finish < tj.start) return { ti: ti.id, ok: true, why: `T${ti.id} finished before T${tj.id} started` };
      const clash = ti.write.filter((x) => tj.read.includes(x));
      if (ti.finish < tj.validate && !clash.length) return { ti: ti.id, ok: true, why: `T${ti.id} finished before T${tj.id} validated and wrote nothing T${tj.id} read` };
      return { ti: ti.id, ok: false, why: clash.length ? `T${ti.id} wrote ${clash.join(", ")} which T${tj.id} read` : `T${ti.id} had not finished when T${tj.id} validated` };
    });
    return { id: tj.id, ok: checks.every((c) => c.ok), checks };
  });
}
