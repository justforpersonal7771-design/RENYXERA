/** Databases engines. Every number the DBMS lessons quote is produced here and checked by scripts. */

/* ------------------------------------------------------------ ER to tables */
export type Card = "1:1" | "1:N" | "M:N";
export function erTables(card: Card, totalLeft: boolean, totalRight: boolean, multivalued = 0, weak = 0) {
  let base: number, note: string;
  if (card === "M:N") { base = 3; note = "M:N needs its own table holding both keys."; }
  else if (card === "1:N") { base = 2; note = "Put the 1-side key as a foreign key in the N-side table."; }
  else if (totalLeft && totalRight) { base = 1; note = "1:1 with total participation on both sides: merge into one table."; }
  else { base = 2; note = "1:1: put a foreign key on the side with total participation (or either side)."; }
  return { tables: base + multivalued + weak, base, note, extra: multivalued + weak };
}

/* ------------------------------------------------------------ functional dependencies */
export type FD = { lhs: string[]; rhs: string[] };
export function parseFDs(src: string): FD[] {
  return src.split(/[,;\n]+/).map((x) => x.trim()).filter(Boolean).map((f) => { const [l, r] = f.split(/->|→/); return { lhs: (l ?? "").replace(/\s/g, "").split(""), rhs: (r ?? "").replace(/\s/g, "").split("") }; }).filter((f) => f.lhs.length && f.rhs.length);
}
export function closure(attrs: string[], fds: FD[]) {
  const c = new Set(attrs); let grew = true;
  while (grew) { grew = false; for (const f of fds) if (f.lhs.every((a) => c.has(a)) && f.rhs.some((a) => !c.has(a))) { f.rhs.forEach((a) => c.add(a)); grew = true; } }
  return [...c].sort();
}
export function candidateKeys(all: string[], fds: FD[]) {
  const keys: string[][] = []; const n = all.length; let supers = 0;
  for (let m = 1; m < 2 ** n; m++) {
    const S = all.filter((_, i) => (m >> i) & 1);
    if (closure(S, fds).length === n) { supers++; if (!keys.some((k) => k.every((a) => S.includes(a)))) keys.push(S); }
  }
  const minimal = keys.filter((k) => !keys.some((o) => o !== k && o.length < k.length && o.every((a) => k.includes(a))));
  return { keys: minimal.sort((a, b) => a.length - b.length || a.join().localeCompare(b.join())), superkeys: supers, prime: [...new Set(minimal.flat())].sort() };
}
export function minimalCover(fds: FD[]) {
  let F: FD[] = fds.flatMap((f) => f.rhs.map((a) => ({ lhs: [...f.lhs], rhs: [a] })));
  F = F.map((f) => { let l = [...f.lhs]; for (const a of [...l]) { const t = l.filter((x) => x !== a); if (t.length && closure(t, F).includes(f.rhs[0])) l = t; } return { lhs: l, rhs: f.rhs }; });
  const key = (f: FD) => f.lhs.join("") + ">" + f.rhs.join("");
  F = F.filter((f, i) => F.findIndex((g) => key(g) === key(f)) === i);
  for (let i = 0; i < F.length; i++) { const rest = F.filter((_, j) => j !== i); if (closure(F[i].lhs, rest).includes(F[i].rhs[0])) { F = rest; i--; } }
  return F;
}
export const fdText = (f: FD) => `${f.lhs.join("")} → ${f.rhs.join("")}`;
export function normalForm(all: string[], fds: FD[]) {
  const { keys, prime } = candidateKeys(all, fds);
  const nontrivial = fds.flatMap((f) => f.rhs.filter((a) => !f.lhs.includes(a)).map((a) => ({ lhs: f.lhs, rhs: [a] })));
  const isSuper = (X: string[]) => closure(X, fds).length === all.length;
  const partial = nontrivial.find((f) => !prime.includes(f.rhs[0]) && keys.some((k) => f.lhs.length < k.length && f.lhs.every((a) => k.includes(a))));
  const not3 = nontrivial.find((f) => !isSuper(f.lhs) && !prime.includes(f.rhs[0]));
  const notB = nontrivial.find((f) => !isSuper(f.lhs));
  const nf = partial ? "1NF" : not3 ? "2NF" : notB ? "3NF" : "BCNF";
  return { nf, keys, prime, culprit: partial ?? not3 ?? notB ?? null };
}
/** Binary decomposition lossless iff R1 ∩ R2 → R1 or R1 ∩ R2 → R2. */
export function losslessBinary(r1: string[], r2: string[], fds: FD[]) {
  const common = r1.filter((a) => r2.includes(a)); const c = closure(common, fds);
  return { common, lossless: common.length > 0 && (r1.every((a) => c.includes(a)) || r2.every((a) => c.includes(a))) };
}
/** Dependency preservation: every FD follows from the FDs projected onto the parts. */
export function preserves(parts: string[][], fds: FD[]) {
  const proj = parts.flatMap((R) => { const out: FD[] = []; for (let m = 1; m < 2 ** R.length; m++) { const X = R.filter((_, i) => (m >> i) & 1); const rhs = closure(X, fds).filter((a) => R.includes(a) && !X.includes(a)); if (rhs.length) out.push({ lhs: X, rhs }); } return out; });
  const lost = fds.filter((f) => !f.rhs.every((a) => closure(f.lhs, proj).includes(a)));
  return { preserved: lost.length === 0, lost };
}

/* ------------------------------------------------------------ relational algebra over sample tables */
export type Row = Record<string, string | number | null>;
export const STUDENT: Row[] = [{ sid: 1, name: "Asha", dept: "CS" }, { sid: 2, name: "Bala", dept: "EC" }, { sid: 3, name: "Chen", dept: "CS" }, { sid: 4, name: "Dev", dept: "ME" }];
export const COURSE: Row[] = [{ cid: "DB", dept: "CS" }, { cid: "OS", dept: "CS" }, { cid: "VLSI", dept: "EC" }];
export const ENROLLED: Row[] = [{ sid: 1, cid: "DB" }, { sid: 1, cid: "OS" }, { sid: 2, cid: "VLSI" }, { sid: 3, cid: "DB" }, { sid: 3, cid: "OS" }, { sid: 4, cid: "DB" }];
export const sel = (R: Row[], p: (r: Row) => boolean) => R.filter(p);
export const proj = (R: Row[], cols: string[]) => { const seen = new Set<string>(); return R.map((r) => Object.fromEntries(cols.map((c) => [c, r[c]]))).filter((r) => { const k = JSON.stringify(r); if (seen.has(k)) return false; seen.add(k); return true; }); };
export const natJoin = (A: Row[], B: Row[]) => { const common = Object.keys(A[0] ?? {}).filter((k) => k in (B[0] ?? {})); return A.flatMap((a) => B.filter((b) => common.every((c) => a[c] === b[c])).map((b) => ({ ...a, ...b }))); };
export const cross = (A: Row[], B: Row[]) => A.flatMap((a) => B.map((b) => ({ ...Object.fromEntries(Object.entries(a).map(([k, v]) => [`L.${k}`, v])), ...Object.fromEntries(Object.entries(b).map(([k, v]) => [`R.${k}`, v])) })));
export const minus = (A: Row[], B: Row[]) => A.filter((a) => !B.some((b) => JSON.stringify(a) === JSON.stringify(b)));
export const union = (A: Row[], B: Row[]) => proj([...A, ...B], Object.keys(A[0] ?? B[0] ?? {}));
/** R ÷ S: values of R's other columns paired with every row of S. */
export function divide(R: Row[], S: Row[], keep: string[]) { const xs = proj(R, keep); return xs.filter((x) => S.every((s) => R.some((r) => keep.every((k) => r[k] === x[k]) && Object.keys(s).every((k) => r[k] === s[k])))); }
export const RA_QUERIES: { name: string; expr: string; run: () => Row[] }[] = [
  { name: "CS students", expr: "σ dept='CS' (Student)", run: () => sel(STUDENT, (r) => r.dept === "CS") },
  { name: "Names", expr: "π name (Student)", run: () => proj(STUDENT, ["name"]) },
  { name: "Who takes DB", expr: "π name (σ cid='DB' (Student ⋈ Enrolled))", run: () => proj(sel(natJoin(STUDENT, ENROLLED), (r) => r.cid === "DB"), ["name"]) },
  { name: "Student × Course size", expr: "Student × Course", run: () => cross(STUDENT, COURSE) },
  { name: "Takes no course in OS", expr: "π sid (Student) − π sid (σ cid='OS' (Enrolled))", run: () => minus(proj(STUDENT, ["sid"]), proj(sel(ENROLLED, (r) => r.cid === "OS"), ["sid"])) },
  { name: "Takes every CS course", expr: "Enrolled ÷ π cid (σ dept='CS' (Course))", run: () => divide(ENROLLED, proj(sel(COURSE, (r) => r.dept === "CS"), ["cid"]), ["sid"]) },
];

/* ------------------------------------------------------------ SQL over the same tables, plus NULLs */
export const EMP: Row[] = [{ id: 1, name: "Ira", dept: "CS", salary: 70 }, { id: 2, name: "Jai", dept: "CS", salary: 50 }, { id: 3, name: "Kim", dept: "EC", salary: 60 }, { id: 4, name: "Lea", dept: "EC", salary: null }, { id: 5, name: "Max", dept: null, salary: 40 }];
const nums = (xs: (string | number | null)[]) => xs.filter((x): x is number => typeof x === "number");
export const SQL_QUERIES: { name: string; sql: string; run: () => Row[]; note: string }[] = [
  { name: "COUNT(*) vs COUNT(col)", sql: "SELECT COUNT(*), COUNT(salary), COUNT(dept) FROM Emp;", run: () => [{ "COUNT(*)": EMP.length, "COUNT(salary)": EMP.filter((e) => e.salary !== null).length, "COUNT(dept)": EMP.filter((e) => e.dept !== null).length }], note: "COUNT(col) skips NULLs; COUNT(*) counts rows." },
  { name: "AVG ignores NULL", sql: "SELECT AVG(salary) FROM Emp;", run: () => { const s = nums(EMP.map((e) => e.salary)); return [{ "AVG(salary)": s.reduce((a, b) => a + b, 0) / s.length }]; }, note: "Average over the 4 non-NULL salaries: (70+50+60+40)/4 = 55, not /5." },
  { name: "GROUP BY with HAVING", sql: "SELECT dept, SUM(salary) FROM Emp GROUP BY dept HAVING COUNT(*) >= 2;", run: () => { const g = new Map<string | null, Row[]>(); EMP.forEach((e) => { const k = e.dept as string | null; g.set(k, [...(g.get(k) ?? []), e]); }); return [...g.entries()].filter(([, rs]) => rs.length >= 2).map(([d, rs]) => ({ dept: d, "SUM(salary)": nums(rs.map((r) => r.salary)).reduce((a, b) => a + b, 0) })); }, note: "NULL dept forms its own group (with 1 row, removed by HAVING)." },
  { name: "WHERE salary > NULL", sql: "SELECT name FROM Emp WHERE salary > 55 OR dept = NULL;", run: () => EMP.filter((e) => typeof e.salary === "number" && e.salary > 55).map((e) => ({ name: e.name })), note: "dept = NULL is UNKNOWN, never true; use IS NULL." },
  { name: "IS NULL", sql: "SELECT name FROM Emp WHERE salary IS NULL OR dept IS NULL;", run: () => EMP.filter((e) => e.salary === null || e.dept === null).map((e) => ({ name: e.name })), note: "IS NULL is the only test that finds NULLs." },
  { name: "Highest paid per dept", sql: "SELECT dept, MAX(salary) FROM Emp WHERE dept IS NOT NULL GROUP BY dept;", run: () => ["CS", "EC"].map((d) => ({ dept: d, "MAX(salary)": Math.max(...nums(EMP.filter((e) => e.dept === d).map((e) => e.salary))) })), note: "MAX ignores the NULL salary in EC." },
];
export const SQL_NESTED: { name: string; sql: string; run: () => Row[]; note: string }[] = [
  { name: "Above the average", sql: "SELECT name FROM Emp WHERE salary > (SELECT AVG(salary) FROM Emp);", run: () => EMP.filter((e) => typeof e.salary === "number" && e.salary > 55).map((e) => ({ name: e.name })), note: "The subquery returns 55." },
  { name: "> ALL", sql: "SELECT name FROM Emp WHERE salary > ALL (SELECT salary FROM Emp WHERE dept = 'EC' AND salary IS NOT NULL);", run: () => EMP.filter((e) => typeof e.salary === "number" && e.salary > 60).map((e) => ({ name: e.name })), note: "Greater than every EC salary (60)." },
  { name: "> ANY", sql: "SELECT name FROM Emp WHERE salary > ANY (SELECT salary FROM Emp WHERE dept = 'CS');", run: () => EMP.filter((e) => typeof e.salary === "number" && e.salary > 50).map((e) => ({ name: e.name })), note: "Greater than at least one CS salary (smallest 50)." },
  { name: "NOT IN with a NULL", sql: "SELECT name FROM Emp WHERE salary NOT IN (SELECT salary FROM Emp WHERE dept = 'EC');", run: () => [], note: "The subquery contains NULL, so every NOT IN test is UNKNOWN: no rows." },
  { name: "EXISTS (correlated)", sql: "SELECT S.name FROM Student S WHERE EXISTS (SELECT * FROM Enrolled E WHERE E.sid = S.sid AND E.cid = 'OS');", run: () => STUDENT.filter((s) => ENROLLED.some((e) => e.sid === s.sid && e.cid === "OS")).map((s) => ({ name: s.name })), note: "Re-evaluated for each student." },
  { name: "LEFT OUTER JOIN count", sql: "SELECT COUNT(*) FROM Course C LEFT JOIN Enrolled E ON C.cid = E.cid;", run: () => [{ "COUNT(*)": COURSE.reduce((s, c) => s + Math.max(1, ENROLLED.filter((e) => e.cid === c.cid).length), 0) }], note: "DB 3 rows + OS 2 + VLSI 1 = 6; unmatched courses would still count once." },
];

/* ------------------------------------------------------------ file organisation and indexes */
export function indexCalc(n: number, recordB: number, blockB: number, keyB: number, ptrB: number) {
  const bfr = Math.floor(blockB / recordB), blocks = Math.ceil(n / bfr);
  const ibfr = Math.floor(blockB / (keyB + ptrB));
  const sparseEntries = blocks, sparseBlocks = Math.ceil(sparseEntries / ibfr);
  const denseBlocks = Math.ceil(n / ibfr);
  const log2c = (x: number) => Math.ceil(Math.log2(Math.max(1, x)));
  return { bfr, blocks, ibfr, sparseBlocks, denseBlocks, noIndex: log2c(blocks), withSparse: log2c(sparseBlocks) + 1, withDense: log2c(denseBlocks) + 1, linear: blocks };
}
export function bplusOrder(blockB: number, keyB: number, ptrB: number, recPtrB = ptrB) {
  const p = Math.floor((blockB + keyB) / (keyB + ptrB)); // p·P + (p−1)·K ≤ B
  const pLeaf = Math.floor((blockB - ptrB) / (keyB + recPtrB)); // pl·(K + Pr) + P ≤ B
  return { p, pLeaf };
}
/** Fewest and most levels of a B+ tree of order p (max p children) holding n keys in leaves of at most q keys. */
export function bplusHeight(n: number, p: number, q: number) {
  let lv = 1, cap = q; while (cap < n) { cap *= p; lv++; }
  const minFill = Math.ceil(p / 2), minLeaf = Math.ceil(q / 2);
  let lvMax = 1, leaves = Math.floor(n / minLeaf); let nodes = leaves; while (nodes > 1) { nodes = Math.floor(nodes / minFill); lvMax++; }
  return { minLevels: lv, maxLevels: Math.max(lv, lvMax) };
}
/** B+ tree insertion (max m − 1 keys per node). Returns snapshots of levels after each insert. */
export function bplusInsert(keys: number[], m: number) {
  type Node = { keys: number[]; kids: Node[] | null };
  let root: Node = { keys: [], kids: null };
  const snap: { key: number; levels: number[][][]; split: boolean }[] = [];
  const insert = (node: Node, k: number): { up: number; right: Node } | null => {
    if (!node.kids) { node.keys.push(k); node.keys.sort((a, b) => a - b); if (node.keys.length <= m - 1) return null; const mid = Math.ceil(node.keys.length / 2); const right: Node = { keys: node.keys.slice(mid), kids: null }; node.keys = node.keys.slice(0, mid); return { up: right.keys[0], right }; }
    let i = node.keys.findIndex((x) => k < x); if (i < 0) i = node.keys.length;
    const r = insert(node.kids[i], k); if (!r) return null;
    node.keys.splice(i, 0, r.up); node.kids.splice(i + 1, 0, r.right);
    if (node.keys.length <= m - 1) return null;
    const mid = Math.floor(node.keys.length / 2); const up = node.keys[mid];
    const right: Node = { keys: node.keys.slice(mid + 1), kids: node.kids.slice(mid + 1) }; node.keys = node.keys.slice(0, mid); node.kids = node.kids.slice(0, mid + 1);
    return { up, right };
  };
  const levels = (n: Node) => { const out: number[][][] = []; let lvl = [n]; while (lvl.length) { out.push(lvl.map((x) => [...x.keys])); lvl = lvl.flatMap((x) => x.kids ?? []); } return out; };
  for (const k of keys) { const r = insert(root, k); let split = false; if (r) { root = { keys: [r.up], kids: [root, r.right] }; split = true; } snap.push({ key: k, levels: levels(root), split }); }
  return snap;
}

/* ------------------------------------------------------------ schedules */
export type Op = { t: number; a: "R" | "W" | "C" | "A"; x?: string };
export function parseSchedule(src: string): Op[] {
  return src.split(/[\s,;]+/).map((tok) => tok.trim()).filter(Boolean).map((tok) => { const m = /^([RWCA])(\d+)(?:\((\w)\))?$/i.exec(tok); if (!m) return null; return { a: m[1].toUpperCase() as Op["a"], t: Number(m[2]), x: m[3] } as Op; }).filter((o): o is Op => !!o);
}
export function precedence(ops: Op[]) {
  const txs = [...new Set(ops.map((o) => o.t))].sort((a, b) => a - b);
  const edges: [number, number, string][] = [];
  ops.forEach((o, i) => { if (o.a !== "R" && o.a !== "W") return; ops.slice(i + 1).forEach((p) => { if ((p.a === "R" || p.a === "W") && p.t !== o.t && p.x === o.x && (o.a === "W" || p.a === "W") && !edges.some(([a, b]) => a === o.t && b === p.t)) edges.push([o.t, p.t, `${o.a}${o.t}(${o.x}) before ${p.a}${p.t}(${p.x})`]); }); });
  const indeg = new Map(txs.map((t) => [t, 0])); edges.forEach(([, b]) => indeg.set(b, (indeg.get(b) ?? 0) + 1));
  const order: number[] = []; const q = txs.filter((t) => indeg.get(t) === 0); const d = new Map(indeg);
  while (q.length) { const t = q.shift()!; order.push(t); edges.filter(([a]) => a === t).forEach(([, b]) => { d.set(b, d.get(b)! - 1); if (d.get(b) === 0) q.push(b); }); }
  return { txs, edges, serializable: order.length === txs.length, order: order.length === txs.length ? order : null };
}
export function recoverability(ops: Op[]) {
  const commitAt = new Map<number, number>(); ops.forEach((o, i) => { if (o.a === "C") commitAt.set(o.t, i); });
  const reads: { reader: number; writer: number; at: number; x: string }[] = [];
  let strict = true;
  ops.forEach((o, i) => {
    if ((o.a === "R" || o.a === "W") && o.x) {
      const lastW = [...ops.slice(0, i)].reverse().find((p) => p.a === "W" && p.x === o.x);
      if (lastW && lastW.t !== o.t) {
        const ci = commitAt.get(lastW.t) ?? Infinity; const wIndex = ops.lastIndexOf(lastW, i);
        const abortedOrCommittedBefore = ci < i;
        if (!abortedOrCommittedBefore) strict = false;
        if (o.a === "R") reads.push({ reader: o.t, writer: lastW.t, at: i, x: o.x });
        void wIndex;
      }
    }
  });
  const recoverable = reads.every((r) => (commitAt.get(r.writer) ?? Infinity) <= (commitAt.get(r.reader) ?? Infinity) || !commitAt.has(r.reader));
  const cascadeless = reads.every((r) => (commitAt.get(r.writer) ?? Infinity) < r.at);
  return { reads, recoverable, cascadeless, strict: strict && cascadeless };
}

/* ------------------------------------------------------------ two-phase locking */
export type LOp = { t: number; a: "S" | "X" | "U" | "R" | "W" | "C"; x?: string };
export function parseLocks(src: string): LOp[] {
  return src.split(/[\s,;]+/).filter(Boolean).map((tok) => { const m = /^([SXURWC])(\d+)(?:\((\w)\))?$/i.exec(tok); return m ? { a: m[1].toUpperCase() as LOp["a"], t: Number(m[2]), x: m[3] } as LOp : null; }).filter((o): o is LOp => !!o);
}
export function checkTwoPL(ops: LOp[]) {
  const txs = [...new Set(ops.map((o) => o.t))].sort((a, b) => a - b);
  const res = txs.map((t) => {
    const mine = ops.map((o, i) => ({ ...o, i })).filter((o) => o.t === t);
    const firstU = mine.find((o) => o.a === "U")?.i ?? Infinity;
    const lockAfter = mine.find((o) => (o.a === "S" || o.a === "X") && o.i > firstU);
    const commit = mine.find((o) => o.a === "C")?.i ?? Infinity;
    const xUnlockBeforeCommit = mine.some((o) => o.a === "U" && o.i < commit && mine.some((l) => l.a === "X" && l.x === o.x && l.i < o.i));
    const anyUnlockBeforeCommit = mine.some((o) => o.a === "U" && o.i < commit);
    return { t, twoPL: !lockAfter, strict: !lockAfter && !xUnlockBeforeCommit, rigorous: !lockAfter && !anyUnlockBeforeCommit, lockPoint: mine.filter((o) => (o.a === "S" || o.a === "X") && o.i < firstU).at(-1)?.i ?? null };
  });
  return { txs: res, all2PL: res.every((r) => r.twoPL), allStrict: res.every((r) => r.strict), allRigorous: res.every((r) => r.rigorous) };
}

/* ------------------------------------------------------------ timestamp ordering */
export function timestampOrdering(ops: Op[], thomas: boolean) {
  const rts = new Map<string, number>(), wts = new Map<string, number>(); const aborted = new Set<number>();
  const log: { op: string; result: "ok" | "abort" | "ignored"; why: string }[] = [];
  for (const o of ops) {
    if (!o.x || (o.a !== "R" && o.a !== "W")) continue; const name = `${o.a}${o.t}(${o.x})`;
    if (aborted.has(o.t)) { log.push({ op: name, result: "ignored", why: `T${o.t} was rolled back` }); continue; }
    const R = rts.get(o.x) ?? 0, W = wts.get(o.x) ?? 0;
    if (o.a === "R") { if (o.t < W) { aborted.add(o.t); log.push({ op: name, result: "abort", why: `TS ${o.t} < WTS(${o.x}) = ${W}` }); } else { rts.set(o.x, Math.max(R, o.t)); log.push({ op: name, result: "ok", why: `RTS(${o.x}) = ${Math.max(R, o.t)}` }); } }
    else if (o.t < R) { aborted.add(o.t); log.push({ op: name, result: "abort", why: `TS ${o.t} < RTS(${o.x}) = ${R}` }); }
    else if (o.t < W) { if (thomas) log.push({ op: name, result: "ignored", why: `obsolete write (TS ${o.t} < WTS ${W}): Thomas write rule skips it` }); else { aborted.add(o.t); log.push({ op: name, result: "abort", why: `TS ${o.t} < WTS(${o.x}) = ${W}` }); } }
    else { wts.set(o.x, o.t); log.push({ op: name, result: "ok", why: `WTS(${o.x}) = ${o.t}` }); }
  }
  return { log, aborted: [...aborted] };
}
