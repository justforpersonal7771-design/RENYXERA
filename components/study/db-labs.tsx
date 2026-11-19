"use client";

/** Databases labs, one per topic. Logic in lib/study/db.ts (checked by scripts). */
import { useMemo, useState, type ReactNode } from "react";
import * as D from "@/lib/study/db";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => <button type="button" aria-pressed={on} onClick={onClick} className={on ? "pill-ink" : "pill-soft"}>{children}</button>;
const Stat = ({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) => <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">{label}<b className="block font-num text-xl">{value}</b>{sub && <span className="text-xs text-[var(--text-secondary)]">{sub}</span>}</p>;
const Yes = ({ label, on }: { label: string; on: boolean }) => <span className={`rounded-full px-3 py-1 text-xs font-bold ${on ? "bg-emerald-700 text-white" : "border border-[var(--border)] text-[var(--text-secondary)]"}`}>{on ? "✓" : "✗"} {label}</span>;
const Field = ({ label, value, set }: { label: string; value: string; set: (v: string) => void }) => <label className="block min-w-0 text-sm font-bold">{label}<input value={value} onChange={(e) => set(e.target.value)} aria-label={label} spellCheck={false} className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>;
const Step = ({ label, v, set, min, max, step = 1 }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step?: number }) => (
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>{label}</b><button type="button" aria-label={`${label} down`} onClick={() => set(Math.max(min, v - step))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-14 text-center font-num">{v}</span><button type="button" aria-label={`${label} up`} onClick={() => set(Math.min(max, v + step))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">+</button></span>
);
const Banner = ({ good, children }: { good: boolean; children: ReactNode }) => <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${good ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}>{children}</p>;
function Table({ rows }: { rows: D.Row[] }) {
  if (!rows.length) return <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm text-[var(--text-secondary)]">Empty result (0 rows).</p>;
  const cols = Object.keys(rows[0]);
  return <div className="overflow-x-auto"><table className="w-full min-w-[260px] border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]">{cols.map((c) => <th key={c} className="px-2">{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num">{r[c] === null ? <i className="text-[var(--text-muted)]">NULL</i> : String(r[c])}</td>)}</tr>)}</tbody></table></div>;
}

/* ------------------------------------------------------------ ER mapping */
export function ErLab() {
  const [card, setCard] = useState<D.Card>("1:N"), [tl, setTl] = useState(false), [tr, setTr] = useState(true);
  const r = D.erTables(card, tl, tr);
  return (
    <Shell title="ER to tables lab" note="Two entity sets joined by one relationship. How few tables can hold it?" tint="mint">
      <div className="mt-3 flex flex-wrap gap-2">{(["1:1", "1:N", "M:N"] as D.Card[]).map((c) => <Pill key={c} on={card === c} onClick={() => setCard(c)}>{c}</Pill>)}<Pill on={tl} onClick={() => setTl((x) => !x)}>Left side {tl ? "total" : "partial"}</Pill><Pill on={tr} onClick={() => setTr((x) => !x)}>Right side {tr ? "total" : "partial"}</Pill></div>
      <div className="mt-3 flex flex-wrap items-center gap-2 font-num text-sm"><span className="rounded-xl bg-[var(--surface)] px-3 py-2 font-bold">Employee</span><span className={`h-0.5 w-8 ${tl ? "bg-[var(--tint-ink)]" : "border-t-2 border-dashed border-[var(--border)]"}`} /><span className="rotate-45 border-2 border-[var(--tint-ink)] p-2"><span className="block -rotate-45 text-xs font-bold">{card}</span></span><span className={`h-0.5 w-8 ${tr ? "bg-[var(--tint-ink)]" : "border-t-2 border-dashed border-[var(--border)]"}`} /><span className="rounded-xl bg-[var(--surface)] px-3 py-2 font-bold">Department</span></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Fewest tables" value={r.tables} /><Stat label="Why" value={<span className="text-sm font-semibold">{r.note}</span>} /></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Solid line = total participation (every entity takes part). Each multivalued attribute and each weak entity adds one more table.</p>
    </Shell>
  );
}
export function ErExtraLab() {
  const [card, setCard] = useState<D.Card>("M:N"), [mv, setMv] = useState(1), [weak, setWeak] = useState(1);
  const r = D.erTables(card, false, false, mv, weak);
  return (
    <Shell title="Weak entities and multivalued attributes lab" note="Count the tables a full ER diagram needs." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{(["1:1", "1:N", "M:N"] as D.Card[]).map((c) => <Pill key={c} on={card === c} onClick={() => setCard(c)}>{c} relationship</Pill>)}<Step label="Multivalued attributes" v={mv} set={setMv} min={0} max={3} /><Step label="Weak entity sets" v={weak} set={setWeak} min={0} max={3} /></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="For the relationship" value={r.base} sub={r.note} /><Stat label="Extra tables" value={r.extra} sub="one per multivalued attribute or weak entity" /><Stat label="Total" value={r.tables} /></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">A weak entity&rsquo;s table holds its partial key plus the owner&rsquo;s key; a multivalued attribute&rsquo;s table holds the entity key plus the value.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ keys */
export function KeysLab() {
  const [rel, setRel] = useState("ABCDE"), [fds, setFds] = useState("A->B, BC->D, D->E, E->A");
  const all = [...new Set(rel.replace(/[^A-Z]/g, "").split(""))]; const F = D.parseFDs(fds); const k = D.candidateKeys(all, F);
  const [x, setX] = useState("A"); const cl = D.closure(x.replace(/[^A-Z]/g, "").split(""), F);
  return (
    <Shell title="Keys lab" note="Candidate keys are the minimal sets whose closure is every attribute." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{[["Classic ring", "ABCDE", "A->B, BC->D, D->E, E->A"], ["All prime", "ABCD", "AB->C, C->D, D->A"], ["Single key", "ABCD", "A->B, B->C, C->D"]].map(([n, r, f]) => <Pill key={n} on={rel === r && fds === f} onClick={() => { setRel(r); setFds(f); }}>{n}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Field label="Attributes" value={rel} set={setRel} /><Field label="Functional dependencies" value={fds} set={setFds} /></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Candidate keys" value={k.keys.map((x) => x.join("")).join(", ") || "–"} /><Stat label="Superkeys" value={k.superkeys} /><Stat label="Prime attributes" value={k.prime.join(", ") || "none"} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Field label="Closure of" value={x} set={setX} /><Stat label={`{${x}}⁺`} value={`{${cl.join(", ")}}`} sub={cl.length === all.length ? "a superkey" : "not a superkey"} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ referential integrity */
export function FkLab() {
  const [action, setAction] = useState<"restrict" | "cascade" | "setnull">("cascade"), [del, setDel] = useState<string | null>(null);
  const depts = ["CS", "EC", "ME"]; const emps = [{ id: 1, d: "CS" }, { id: 2, d: "CS" }, { id: 3, d: "EC" }];
  const blocked = action === "restrict" && del !== null && emps.some((e) => e.d === del);
  const deptLeft = del && !blocked ? depts.filter((d) => d !== del) : depts;
  const empLeft = !del || blocked ? emps : action === "cascade" ? emps.filter((e) => e.d !== del) : emps.map((e) => (e.d === del ? { ...e, d: null as unknown as string } : e));
  return (
    <Shell title="Referential integrity lab" note="Emp.dept references Dept. Delete a department and choose what happens to employees." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{([["restrict", "ON DELETE RESTRICT"], ["cascade", "ON DELETE CASCADE"], ["setnull", "ON DELETE SET NULL"]] as const).map(([k, l]) => <Pill key={k} on={action === k} onClick={() => setAction(k)}>{l}</Pill>)}</div>
      <div className="mt-2 flex flex-wrap gap-2"><span className="text-sm font-bold">Delete department:</span>{depts.map((d) => <Pill key={d} on={del === d} onClick={() => setDel(del === d ? null : d)}>{d}</Pill>)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><div><p className="mb-1 text-xs font-bold">Dept</p><Table rows={deptLeft.map((d) => ({ dept: d }))} /></div><div><p className="mb-1 text-xs font-bold">Emp</p><Table rows={empLeft.map((e) => ({ id: e.id, dept: e.d ?? null }))} /></div></div>
      {del && <Banner good={!blocked}>{blocked ? `Rejected: employees still reference ${del}.` : action === "cascade" ? `${del} deleted, and its employees were deleted with it.` : action === "setnull" ? `${del} deleted; its employees now have dept NULL.` : `${del} deleted (no employee referenced it).`}</Banner>}
    </Shell>
  );
}

/* ------------------------------------------------------------ relational algebra */
export function RaLab() {
  const [k, setK] = useState(2); const q = D.RA_QUERIES[k]; const rows = useMemo(() => q.run(), [q]);
  return (
    <Shell title="Relational algebra lab" note="Student(sid, name, dept) · Course(cid, dept) · Enrolled(sid, cid)." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{D.RA_QUERIES.map((x, i) => <Pill key={x.name} on={k === i} onClick={() => setK(i)}>{x.name}</Pill>)}</div>
      <p className="mt-3 rounded-2xl bg-[var(--surface)] p-3 font-num text-sm">{q.expr}</p>
      <div className="mt-3"><Table rows={rows.slice(0, 12)} /></div>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">{rows.length} row{rows.length === 1 ? "" : "s"}.</p>
    </Shell>
  );
}
export function TrcLab() {
  const PAIRS = [
    { name: "CS students", trc: "{ t | t ∈ Student ∧ t.dept = 'CS' }", ra: "σ dept='CS' (Student)", rows: () => D.RA_QUERIES[0].run() },
    { name: "Takes DB", trc: "{ t.name | t ∈ Student ∧ ∃e (e ∈ Enrolled ∧ e.sid = t.sid ∧ e.cid = 'DB') }", ra: "π name (σ cid='DB' (Student ⋈ Enrolled))", rows: () => D.RA_QUERIES[2].run() },
    { name: "Takes every CS course", trc: "{ s.sid | s ∈ Student ∧ ∀c (c ∈ Course ∧ c.dept = 'CS' → ∃e (e ∈ Enrolled ∧ e.sid = s.sid ∧ e.cid = c.cid)) }", ra: "Enrolled ÷ π cid (σ dept='CS' (Course))", rows: () => D.RA_QUERIES[5].run() },
    { name: "Unsafe", trc: "{ t | ¬(t ∈ Student) }", ra: "(no algebra equivalent)", rows: () => [] as D.Row[] },
  ];
  const [k, setK] = useState(2); const p = PAIRS[k];
  return (
    <Shell title="Tuple calculus lab" note="Each calculus query beside its algebra twin; they return the same rows." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2">{PAIRS.map((x, i) => <Pill key={x.name} on={k === i} onClick={() => setK(i)}>{x.name}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><p className="rounded-2xl bg-[var(--surface)] p-3 font-num text-sm"><span className="block font-sans text-xs text-[var(--text-secondary)]">Tuple calculus</span>{p.trc}</p><p className="rounded-2xl bg-[var(--surface)] p-3 font-num text-sm"><span className="block font-sans text-xs text-[var(--text-secondary)]">Relational algebra</span>{p.ra}</p></div>
      {k === 3 ? <Banner good={false}>Unsafe: the answer is every tuple that is not a student, an infinite set. Safe queries only produce values from the database.</Banner> : <div className="mt-3"><Table rows={p.rows()} /></div>}
    </Shell>
  );
}

/* ------------------------------------------------------------ SQL */
export function SqlLab() {
  const [k, setK] = useState(0); const q = D.SQL_QUERIES[k];
  return (
    <Shell title="SQL lab" note="Emp(id, name, dept, salary) with two NULLs: Lea's salary and Max's dept." tint="peri">
      <div className="mt-3"><Table rows={D.EMP} /></div>
      <div className="mt-3 flex flex-wrap gap-2">{D.SQL_QUERIES.map((x, i) => <Pill key={x.name} on={k === i} onClick={() => setK(i)}>{x.name}</Pill>)}</div>
      <p className="mt-3 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3 font-num text-sm">{q.sql}</p>
      <div className="mt-2"><Table rows={q.run()} /></div>
      <p className="mt-2 text-sm">{q.note}</p>
    </Shell>
  );
}
export function SqlNestedLab() {
  const [k, setK] = useState(3); const q = D.SQL_NESTED[k];
  return (
    <Shell title="Nested queries lab" note="Subqueries, ALL / ANY, NOT IN with a NULL, EXISTS and outer joins." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2">{D.SQL_NESTED.map((x, i) => <Pill key={x.name} on={k === i} onClick={() => setK(i)}>{x.name}</Pill>)}</div>
      <p className="mt-3 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3 font-num text-sm">{q.sql}</p>
      <div className="mt-2"><Table rows={q.run()} /></div>
      <p className="mt-2 text-sm">{q.note}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ functional dependencies */
export function FdLab() {
  const [fds, setFds] = useState("A->BC, B->C, A->B, AB->C"); const F = D.parseFDs(fds); const mc = D.minimalCover(F);
  const all = [...new Set(F.flatMap((f) => [...f.lhs, ...f.rhs]))].sort();
  return (
    <Shell title="Minimal cover lab" note="Split right sides, drop extra left attributes, then drop redundant dependencies." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{[["Textbook", "A->BC, B->C, A->B, AB->C"], ["Extraneous left", "AB->C, A->C, B->D"], ["Chain", "A->B, B->C, A->C, C->D"]].map(([n, f]) => <Pill key={n} on={fds === f} onClick={() => setFds(f)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Functional dependencies" value={fds} set={setFds} /></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Minimal cover" value={mc.map(D.fdText).join(", ") || "–"} /><Stat label="Attribute closures" value={<span className="text-sm">{all.map((a) => `${a}⁺ = {${D.closure([a], F).join("")}}`).join(" · ")}</span>} /></div>
    </Shell>
  );
}
export function NfLab() {
  const [rel, setRel] = useState("ABCD"), [fds, setFds] = useState("AB->C, C->D");
  const all = [...new Set(rel.replace(/[^A-Z]/g, "").split(""))]; const F = D.parseFDs(fds); const r = D.normalForm(all, F);
  const [r1, setR1] = useState("ABC"), [r2, setR2] = useState("CD");
  const L = D.losslessBinary(r1.split(""), r2.split(""), F), P = D.preserves([r1.split(""), r2.split("")], F);
  return (
    <Shell title="Normal form lab" note="Find the highest normal form, then test a two-way decomposition." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{[["Transitive", "ABCD", "AB->C, C->D", "ABC", "CD"], ["Partial", "ABCD", "AB->C, B->D", "ABC", "BD"], ["3NF not BCNF", "ABC", "AB->C, C->B", "AC", "BC"], ["BCNF", "ABC", "A->B, B->C, C->A", "AB", "BC"]].map(([n, r0, f, a, b]) => <Pill key={n} on={rel === r0 && fds === f} onClick={() => { setRel(r0); setFds(f); setR1(a); setR2(b); }}>{n}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Field label="Relation" value={rel} set={setRel} /><Field label="Functional dependencies" value={fds} set={setFds} /></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Highest normal form" value={r.nf} /><Stat label="Candidate keys" value={r.keys.map((k) => k.join("")).join(", ")} /><Stat label="Stops it going higher" value={r.culprit ? D.fdText(r.culprit) : "nothing"} /></div>
      <p className="mt-4 text-sm font-bold">Decompose into R1 and R2</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2"><Field label="R1" value={r1} set={setR1} /><Field label="R2" value={r2} set={setR2} /></div>
      <div className="mt-3 flex flex-wrap gap-2"><Yes label={`lossless (common ${L.common.join("") || "∅"})`} on={L.lossless} /><Yes label={`dependency preserving${P.lost.length ? ` (loses ${P.lost.map(D.fdText).join(", ")})` : ""}`} on={P.preserved} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ indexing */
export function IndexLab() {
  const [n, setN] = useState(30000), [rec, setRec] = useState(100), [blk, setBlk] = useState(1024), [key, setKey] = useState(9), [ptr, setPtr] = useState(6);
  const r = D.indexCalc(n, rec, blk, key, ptr);
  return (
    <Shell title="Index cost lab" note="Records in blocks; an index of (key, block pointer) entries; count block reads." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="records" v={n} set={setN} min={1000} max={1000000} step={1000} /><Step label="record bytes" v={rec} set={setRec} min={20} max={500} step={10} /><Step label="block bytes" v={blk} set={setBlk} min={512} max={8192} step={512} /><Step label="key bytes" v={key} set={setKey} min={4} max={30} /><Step label="pointer bytes" v={ptr} set={setPtr} min={4} max={10} /></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Blocking factor" value={r.bfr} sub="⌊block / record⌋" /><Stat label="Data blocks" value={r.blocks.toLocaleString("en-IN")} /><Stat label="Index entries per block" value={r.ibfr} sub="⌊block / (key + pointer)⌋" />
        <Stat label="Binary search, no index" value={`${r.noIndex} reads`} sub="⌈log₂ blocks⌉ (file sorted)" /><Stat label="Sparse primary index" value={`${r.withSparse} reads`} sub={`${r.sparseBlocks} index blocks, + 1 data read`} /><Stat label="Dense secondary index" value={`${r.withDense} reads`} sub={`${r.denseBlocks} index blocks, + 1 data read`} /></div>
    </Shell>
  );
}
export function BtreeLab() {
  const [blk, setBlk] = useState(512), [key, setKey] = useState(9), [ptr, setPtr] = useState(6), [m, setM] = useState(3), [keys, setKeys] = useState("10 20 30 40 50 60 70");
  const o = D.bplusOrder(blk, key, ptr, ptr + 1); const list = keys.split(/[\s,]+/).map(Number).filter((x) => Number.isFinite(x)).slice(0, 15);
  const snaps = D.bplusInsert(list, m); const last = snaps[snaps.length - 1];
  return (
    <Shell title="B+ tree lab" note="Order from the block size, then watch insertions split leaves and grow the tree upward." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="block" v={blk} set={setBlk} min={256} max={4096} step={256} /><Step label="key" v={key} set={setKey} min={4} max={20} /><Step label="pointer" v={ptr} set={setPtr} min={4} max={10} /></div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2"><Stat label="Internal order p" value={o.p} sub="p·P + (p − 1)·K ≤ block" /><Stat label="Leaf capacity" value={o.pLeaf} sub="keys with record pointers + next-leaf pointer" /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)]"><Step label="max children m" v={m} set={setM} min={3} max={5} /><Field label="Insert keys in order" value={keys} set={setKeys} /></div>
      {last && <div className="mt-3 space-y-1.5 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3">{last.levels.map((lv, i) => <div key={i} className="flex min-w-max justify-center gap-2">{lv.map((node, j) => <span key={j} className={`rounded-lg border-2 px-2 py-1 font-num text-sm ${i === last.levels.length - 1 ? "border-[var(--tint-ink)]" : "border-[var(--border)] bg-[var(--surface-secondary)]"}`}>{node.join(" | ")}</span>)}</div>)}</div>}
      <p className="mt-2 text-sm">{snaps.length} keys, {last?.levels.length ?? 0} level(s), {snaps.filter((s) => s.split).length} root split(s). Leaves (outlined) hold every key; internal nodes only guide the search.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ transactions */
export function SerialLab() {
  const [src, setSrc] = useState("R1(A) W2(A) R2(B) W1(B) C1 C2"); const ops = D.parseSchedule(src); const p = D.precedence(ops);
  return (
    <Shell title="Conflict serializability lab" note="Write a schedule like R1(A) W2(A) C1. Conflicts become edges; no cycle means serializable." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{[["Cycle", "R1(A) W2(A) R2(B) W1(B) C1 C2"], ["Three transactions", "R1(A) R2(A) W1(A) W2(B) R3(B) C1 C2 C3"], ["Already serial", "R1(A) W1(A) C1 R2(A) W2(A) C2"]].map(([n, s]) => <Pill key={n} on={src === s} onClick={() => setSrc(s)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Schedule" value={src} set={setSrc} /></div>
      <div className="mt-3 flex flex-wrap gap-1">{ops.map((o, i) => <span key={i} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num text-xs">{o.a}{o.t}{o.x ? `(${o.x})` : ""}</span>)}</div>
      <ul className="mt-3 space-y-1 text-sm">{p.edges.map(([a, b, why], i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1.5"><b className="font-num">T{a} → T{b}</b> <span className="text-[var(--text-secondary)]">because {why}</span></li>)}{!p.edges.length && <li className="text-[var(--text-secondary)]">No conflicting pairs.</li>}</ul>
      <Banner good={p.serializable}>{p.serializable ? `Conflict serializable: equivalent to ${p.order!.map((t) => `T${t}`).join(" → ")}.` : "Not conflict serializable: the precedence graph has a cycle."}</Banner>
    </Shell>
  );
}
export function RecoverLab() {
  const [src, setSrc] = useState("W1(A) R2(A) C2 C1"); const r = D.recoverability(D.parseSchedule(src));
  return (
    <Shell title="Recoverability lab" note="Who read uncommitted data, and did they commit too early?" tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{[["Not recoverable", "W1(A) R2(A) C2 C1"], ["Recoverable, cascades", "W1(A) R2(A) C1 C2"], ["Cascadeless", "W1(A) C1 R2(A) C2"], ["Blind overwrite", "W1(A) W2(A) C1 C2"]].map(([n, s]) => <Pill key={n} on={src === s} onClick={() => setSrc(s)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Schedule" value={src} set={setSrc} /></div>
      <ul className="mt-3 space-y-1 text-sm">{r.reads.map((x, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1.5">T{x.reader} reads {x.x} written by T{x.writer}</li>)}{!r.reads.length && <li className="text-[var(--text-secondary)]">No transaction reads another&rsquo;s write.</li>}</ul>
      <div className="mt-3 flex flex-wrap gap-2"><Yes label="recoverable" on={r.recoverable} /><Yes label="cascadeless (no dirty reads)" on={r.cascadeless} /><Yes label="strict" on={r.strict} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ concurrency control */
export function TwoPlLab() {
  const [src, setSrc] = useState("X1(A) X1(B) R1(A) W1(B) U1(A) U1(B) C1"); const r = D.checkTwoPL(D.parseLocks(src));
  return (
    <Shell title="Two-phase locking lab" note="S = shared lock, X = exclusive lock, U = unlock, C = commit. No lock may follow an unlock." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{[["Basic 2PL", "X1(A) X1(B) R1(A) W1(B) U1(A) U1(B) C1"], ["Breaks 2PL", "X1(A) R1(A) U1(A) X1(B) W1(B) U1(B) C1"], ["Strict 2PL", "X1(A) S1(B) R1(A) R1(B) U1(B) C1 U1(A)"], ["Rigorous 2PL", "X1(A) X1(B) W1(A) W1(B) C1 U1(A) U1(B)"]].map(([n, s]) => <Pill key={n} on={src === s} onClick={() => setSrc(s)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Operations" value={src} set={setSrc} /></div>
      {r.txs.map((t) => <div key={t.t} className="mt-3 flex flex-wrap gap-2"><span className="text-sm font-bold">T{t.t}</span><Yes label="two-phase" on={t.twoPL} /><Yes label="strict (X locks held to commit)" on={t.strict} /><Yes label="rigorous (all locks held to commit)" on={t.rigorous} /></div>)}
      <p className="mt-3 text-xs text-[var(--text-secondary)]">Basic 2PL guarantees conflict serializability; strict 2PL also avoids cascading aborts; rigorous orders transactions by commit time. None of them prevents deadlock.</p>
    </Shell>
  );
}
export function TsLab() {
  const [src, setSrc] = useState("R1(A) W2(A) W1(A) R2(A)"), [thomas, setThomas] = useState(false); const r = D.timestampOrdering(D.parseSchedule(src), thomas);
  return (
    <Shell title="Timestamp ordering lab" note="Ti has timestamp i. An operation that arrives too late rolls its transaction back." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2">{[["Late write", "R1(A) W2(A) W1(A) R2(A)"], ["Late write after read", "R2(A) W1(A) R1(B) W2(B)"]].map(([n, s]) => <Pill key={n} on={src === s} onClick={() => setSrc(s)}>{n}</Pill>)}<Pill on={thomas} onClick={() => setThomas((x) => !x)}>Thomas write rule {thomas ? "on" : "off"}</Pill></div>
      <div className="mt-3"><Field label="Schedule" value={src} set={setSrc} /></div>
      <ol className="mt-3 space-y-1 text-sm">{r.log.map((l, i) => <li key={i} className={`flex flex-wrap gap-2 rounded-xl px-3 py-1.5 ${l.result === "abort" ? "bg-rose-700 text-white" : l.result === "ignored" ? "bg-[var(--surface-secondary)]" : "bg-[var(--surface)]"}`}><b className="font-num">{l.op}</b><span>{l.result}</span><span className="opacity-80">{l.why}</span></li>)}</ol>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">{r.aborted.length ? `Rolled back: ${r.aborted.map((t) => `T${t}`).join(", ")}.` : "No rollbacks."}</p>
    </Shell>
  );
}
