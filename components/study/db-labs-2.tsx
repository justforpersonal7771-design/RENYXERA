"use client";

/** Databases depth labs, one per added topic. Logic in lib/study/db2.ts (checked by script). */
import { useState, type ReactNode } from "react";
import * as E from "@/lib/study/db2";
import { parseFDs, fdText, type Row } from "@/lib/study/db";

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
const Field = ({ label, value, set }: { label: string; value: string; set: (v: string) => void }) => <label className="block min-w-0 text-sm font-bold">{label}<input value={value} onChange={(e) => set(e.target.value)} aria-label={label} spellCheck={false} className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>;
const Banner = ({ good, children }: { good: boolean; children: ReactNode }) => <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${good ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}>{children}</p>;
const Step = ({ label, v, set, min, max }: { label: string; v: number; set: (n: number) => void; min: number; max: number }) => (
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>{label}</b><button type="button" aria-label={`${label} down`} onClick={() => set(Math.max(min, v - 1))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-8 text-center font-num">{v}</span><button type="button" aria-label={`${label} up`} onClick={() => set(Math.min(max, v + 1))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">+</button></span>
);
function Table({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm text-[var(--text-secondary)]">Empty result (0 rows).</p>;
  const cols = Object.keys(rows[0]);
  return <div className="overflow-x-auto"><table className="w-full min-w-[240px] border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]">{cols.map((c) => <th key={c} className="px-2">{c}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{cols.map((c) => <td key={c} className={`rounded-lg px-2 py-1 font-num ${r[c] === null ? "bg-[var(--surface-secondary)] italic text-[var(--text-secondary)]" : "bg-[var(--surface)]"}`}>{r[c] === null ? "NULL" : String(r[c])}</td>)}</tr>)}</tbody></table></div>;
}
const parts = (s: string) => s.split(/[,\s]+/).filter(Boolean).flatMap((x) => x.split(""));

/* ------------------------------------------------------------ EER */
export function EerLab() {
  const [n, setN] = useState(3), [total, setTotal] = useState(true), [disj, setDisj] = useState(true), [opt, setOpt] = useState<E.EerOpt>("A");
  const r = E.eerTables(n, total, disj, opt);
  return (
    <Shell title="Specialisation mapping lab" note="A superclass Employee with subclasses. Pick the constraints, then a mapping." tint="mint">
      <div className="mt-3 flex flex-wrap items-center gap-2"><Step label="Subclasses" v={n} set={setN} min={2} max={5} /><Pill on={total} onClick={() => setTotal((x) => !x)}>{total ? "Total" : "Partial"}</Pill><Pill on={disj} onClick={() => setDisj((x) => !x)}>{disj ? "Disjoint" : "Overlapping"}</Pill></div>
      <div className="mt-2 flex flex-wrap gap-2">{([["A", "Superclass + subclass tables"], ["B", "Subclass tables only"], ["C", "One table + type"]] as const).map(([k, l]) => <Pill key={k} on={opt === k} onClick={() => setOpt(k)}>{l}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Tables" value={r.ok ? r.tables : "—"} /><Stat label="Constraint" value={`${total ? "total" : "partial"}, ${disj ? "disjoint" : "overlapping"}`} /></div>
      <Banner good={r.ok}>{r.note}</Banner>
    </Shell>
  );
}

/* ------------------------------------------------------------ outer joins */
export function OuterLab() {
  const [k, setK] = useState<E.JoinKind>("left"); const rows = E.outerJoin(E.EMP2, E.DEPT2, "did", k);
  return (
    <Shell title="Outer join lab" note="Emp(eid, ename, did) ⋈ Dept(did, dname) on did. Kim has no department; ME has no employees." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{(["inner", "left", "right", "full"] as const).map((x) => <Pill key={x} on={k === x} onClick={() => setK(x)}>{x === "inner" ? "Inner ⋈" : x === "left" ? "Left ⟕" : x === "right" ? "Right ⟖" : "Full ⟗"}</Pill>)}</div>
      <div className="mt-3"><Table rows={rows} /></div>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">{rows.length} rows. {k === "inner" ? "Unmatched rows on both sides vanish." : k === "left" ? "Every employee survives; Kim is padded with NULLs." : k === "right" ? "Every department survives; ME is padded with NULLs." : "Both unmatched rows survive: inner rows + left extras + right extras."}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ GROUP BY */
export function GroupLab() {
  const [a, setA] = useState<E.Agg>("COUNT(*)"), [h, setH] = useState<number | null>(null); const rows = E.groupBy(a, h);
  return (
    <Shell title="GROUP BY lab" note="Emp: Ira CS 70, Jai CS 50, Kim EC 60, Lea EC NULL, Max NULL-dept 40." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{(["COUNT(*)", "COUNT(salary)", "SUM(salary)", "AVG(salary)", "MAX(salary)"] as const).map((x) => <Pill key={x} on={a === x} onClick={() => setA(x)}>{x}</Pill>)}</div>
      <div className="mt-2 flex flex-wrap gap-2"><Pill on={h === null} onClick={() => setH(null)}>No HAVING</Pill><Pill on={h === 55} onClick={() => setH(55)}>HAVING value &gt; 55</Pill></div>
      <p className="mt-3 rounded-xl bg-[var(--surface)] px-3 py-2 font-num text-sm">SELECT dept, {a} FROM Emp GROUP BY dept{h !== null ? ` HAVING ${a} > ${h}` : ""};</p>
      <div className="mt-3"><Table rows={rows.map((r) => ({ dept: r.dept === "NULL" ? null : r.dept, [a]: r.value === null ? null : Math.round(r.value * 100) / 100 }))} /></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">NULL departments form one group of their own. Aggregates other than COUNT(*) skip NULL values.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ NULL and 3VL */
export function NullLab() {
  const [op, setOp] = useState<">" | "=" | "<>">(">"), [neg, setNeg] = useState(false); const rows = E.whereNull(op, 55, neg);
  const kept = rows.filter((r) => r.kept).length;
  return (
    <Shell title="NULL logic lab" note="SQL compares with NULL to UNKNOWN, and WHERE keeps only TRUE rows." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{([">", "=", "<>"] as const).map((x) => <Pill key={x} on={op === x} onClick={() => setOp(x)}>salary {x} 55</Pill>)}<Pill on={neg} onClick={() => setNeg((x) => !x)}>NOT {neg ? "on" : "off"}</Pill></div>
      <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{rows.map((r) => <li key={r.name} className={`flex justify-between rounded-xl px-3 py-1.5 ${r.kept ? "bg-emerald-700 text-white" : "bg-[var(--surface)]"}`}><span>{r.name} · {r.salary ?? "NULL"}</span><b>{r.v === "T" ? "TRUE" : r.v === "F" ? "FALSE" : "UNKNOWN"}</b></li>)}</ul>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">{kept} of 5 rows kept. Lea (NULL) is dropped by the condition and by its negation alike.</p>
      <div className="mt-3 overflow-x-auto"><table className="min-w-[260px] border-separate border-spacing-1 text-sm"><thead><tr className="text-xs text-[var(--text-secondary)]"><th>p</th><th>q</th><th>p AND q</th><th>p OR q</th></tr></thead><tbody>{(["T", "U", "F"] as const).flatMap((p) => (["T", "U", "F"] as const).map((q) => <tr key={p + q}>{[p, q, E.and3(p, q), E.or3(p, q)].map((v, i) => <td key={i} className="rounded-lg bg-[var(--surface)] px-2 py-0.5 text-center font-num">{v}</td>)}</tr>))}</tbody></table></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ 3NF / BCNF algorithms */
export function DecompLab() {
  const [R, setR] = useState("ABCDE"), [F, setF] = useState("A->B, B->C, C->A, D->E"), [alg, setAlg] = useState<"3nf" | "bcnf">("3nf");
  const all = [...new Set(parts(R))], fds = parseFDs(F);
  const s = E.synth3NF(all, fds), b = E.bcnfDecompose(all, fds);
  return (
    <Shell title="Decomposition algorithm lab" note="3NF synthesis from a minimal cover, or repeated BCNF splitting." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{[["Cycle + D→E", "ABCDE", "A->B, B->C, C->A, D->E"], ["Transitive", "ABCD", "AB->C, C->D"], ["3NF not BCNF", "ABC", "AB->C, C->B"]].map(([n, r, f]) => <Pill key={n} on={R === r && F === f} onClick={() => { setR(r); setF(f); }}>{n}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Field label="Relation" value={R} set={setR} /><Field label="Functional dependencies" value={F} set={setF} /></div>
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={alg === "3nf"} onClick={() => setAlg("3nf")}>3NF synthesis</Pill><Pill on={alg === "bcnf"} onClick={() => setAlg("bcnf")}>BCNF decomposition</Pill></div>
      {alg === "3nf" ? (
        <div className="mt-3 space-y-2 text-sm"><p className="rounded-xl bg-[var(--surface)] px-3 py-2">Minimal cover: <b className="font-num">{s.cover.map(fdText).join(", ") || "none"}</b></p>
          <p className="rounded-xl bg-[var(--surface)] px-3 py-2">Relations: <b className="font-num">{s.parts.map((p) => `(${p.join("")})`).join(" ")}</b></p>
          <p aria-live="polite" className="font-semibold">{s.addedKey ? `No relation held a candidate key, so (${s.addedKey.join("")}) was added for losslessness.` : "A relation already contains a candidate key: lossless and dependency preserving."}</p></div>
      ) : (
        <div className="mt-3 space-y-2 text-sm">{b.steps.length ? b.steps.map((st, i) => <p key={i} className="rounded-xl bg-[var(--surface)] px-3 py-2 font-num">Split ({st.split.join("")}) on {st.on} → ({st.into[0].join("")}) + ({st.into[1].join("")})</p>) : <p className="rounded-xl bg-[var(--surface)] px-3 py-2">Already in BCNF.</p>}
          <p aria-live="polite" className="font-semibold">Result: {b.parts.map((p) => `(${p.join("")})`).join(" ")}. Every split is lossless; check whether any FD is now spread over two tables.</p></div>
      )}
    </Shell>
  );
}

/* ------------------------------------------------------------ MVD */
export function MvdLab() {
  const [rows, setRows] = useState<Row[]>(E.COURSE_TEACH_BOOK); const r = E.mvdHolds(rows, ["course"], ["teacher"]);
  const toggle = (i: number) => setRows((rs) => rs.filter((_, j) => j !== i));
  return (
    <Shell title="Multivalued dependency lab" note="course →→ teacher: teachers and books of a course are independent. Remove rows and watch it break." tint="butter">
      <ul className="mt-3 space-y-1 text-sm">{rows.map((row, i) => <li key={`${row.teacher}${row.book}`} className="flex items-center justify-between gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5 font-num"><span>{row.course} · {row.teacher} · {row.book}</span><button type="button" onClick={() => toggle(i)} className="pill-soft">Remove</button></li>)}</ul>
      <div className="mt-2 flex gap-2"><Pill on={rows.length === 4} onClick={() => setRows(E.COURSE_TEACH_BOOK)}>Reset all 4 rows</Pill></div>
      <Banner good={r.holds}>{r.holds ? "course →→ teacher holds (and so does course →→ book). Not in 4NF: split into (course, teacher) and (course, book)." : `Fails: the row ${r.missing?.course} · ${r.missing?.teacher} · ${r.missing?.book} would have to be present.`}</Banner>
    </Shell>
  );
}

/* ------------------------------------------------------------ extendible hashing */
export function HashLab() {
  const [src, setSrc] = useState("4, 8, 12, 16, 3, 5"), [cap, setCap] = useState(2);
  const keys = src.split(/[,\s]+/).map(Number).filter((x) => Number.isInteger(x) && x >= 0).slice(0, 16); const r = E.extendible(keys, cap);
  return (
    <Shell title="Extendible hashing lab" note="h(k) = k in binary; the directory uses the last g bits. Buckets split when full." tint="sky">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Keys in insertion order" value={src} set={setSrc} /><Step label="Bucket size" v={cap} set={setCap} min={1} max={4} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Global depth" value={r.global} /><Stat label="Directory entries" value={r.dirSize} /><Stat label="Buckets" value={r.buckets} /><Stat label="Splits" value={r.splits} sub={`${r.doublings} doublings`} /></div>
      <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{r.dir.map((d) => <li key={d.slot} className="flex justify-between rounded-xl bg-[var(--surface)] px-3 py-1.5 font-num"><span>{d.slot} → bucket {d.id + 1} (d = {d.d})</span><b>{d.keys.join(", ") || "empty"}</b></li>)}</ul>
      <ol className="mt-3 space-y-0.5 text-xs text-[var(--text-secondary)]">{r.log.map((l, i) => <li key={i}>{l}</li>)}</ol>
    </Shell>
  );
}

/* ------------------------------------------------------------ log recovery */
export function LogLab() {
  const [src, setSrc] = useState("S1, W1, S2, W2, C1, ckpt(2), S3, W3, S4, W4, C3, W2"); const r = E.recover(E.parseLog(src));
  return (
    <Shell title="Crash recovery lab" note="S start, W write, C commit, A abort, ckpt(active list). The log ends at the crash." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{[["With checkpoint", "S1, W1, S2, W2, C1, ckpt(2), S3, W3, S4, W4, C3, W2"], ["Commit after checkpoint", "S1, W1, C1, S2, W2, ckpt(2), S3, W3, C2"], ["No checkpoint", "S1, W1, S2, W2, C2"]].map(([n, s]) => <Pill key={n} on={src === s} onClick={() => setSrc(s)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Log" value={src} set={setSrc} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Redo" value={r.redo.map((t) => `T${t}`).join(", ") || "none"} sub="committed, not safely on disk" /><Stat label="Undo" value={r.undo.map((t) => `T${t}`).join(", ") || "none"} sub="no commit record" /><Stat label="Ignored" value={r.ignored.map((t) => `T${t}`).join(", ") || "none"} sub="finished before the checkpoint" /></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Immediate update: undo runs backwards through the log first, then redo forwards.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ multiple granularity */
export function MglLab() {
  const [op, setOp] = useState<Parameters<typeof E.mglPath>[0]>("write-row"), [held, setHeld] = useState<E.Mode>("IS"), [req, setReq] = useState<E.Mode>("IX");
  const path = E.mglPath(op); const ok = E.compatible(held, req);
  return (
    <Shell title="Granularity locking lab" note="Lock from the root down: intention locks on ancestors, the real lock on the node." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2">{(["read-row", "write-row", "read-table", "write-table", "scan-update-few"] as const).map((x) => <Pill key={x} on={op === x} onClick={() => setOp(x)}>{x.replace(/-/g, " ")}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">{["Database", "Table", "Row"].map((n, i) => <Stat key={n} label={n} value={path[i]} />)}</div>
      <p className="mt-4 text-sm font-bold">Compatibility check</p>
      <div className="mt-2 flex flex-wrap gap-2 text-sm"><span className="self-center">Held:</span>{E.MGL.map((m) => <Pill key={m} on={held === m} onClick={() => setHeld(m)}>{m}</Pill>)}</div>
      <div className="mt-2 flex flex-wrap gap-2 text-sm"><span className="self-center">Requested:</span>{E.MGL.map((m) => <Pill key={m} on={req === m} onClick={() => setReq(m)}>{m}</Pill>)}</div>
      <Banner good={ok}>{ok ? `${req} can be granted while another transaction holds ${held}.` : `${req} must wait: it conflicts with ${held}.`}</Banner>
    </Shell>
  );
}

/* ------------------------------------------------------------ validation */
const PRESETS: { name: string; txs: E.VTx[] }[] = [
  { name: "Overlap on B", txs: [{ id: 1, start: 1, validate: 3, finish: 4, read: ["A"], write: ["B"] }, { id: 2, start: 2, validate: 5, finish: 6, read: ["B"], write: ["C"] }, { id: 3, start: 5, validate: 7, finish: 8, read: ["A", "B"], write: ["A"] }] },
  { name: "Disjoint sets", txs: [{ id: 1, start: 1, validate: 3, finish: 4, read: ["A"], write: ["A"] }, { id: 2, start: 2, validate: 5, finish: 6, read: ["B"], write: ["B"] }] },
  { name: "Still writing", txs: [{ id: 1, start: 1, validate: 3, finish: 6, read: ["A"], write: ["A"] }, { id: 2, start: 2, validate: 5, finish: 7, read: ["C"], write: ["C"] }] },
];
export function ValidateLab() {
  const [p, setP] = useState(0); const res = E.validate(PRESETS[p].txs);
  return (
    <Shell title="Validation lab" note="Optimistic control: read, then validate against earlier validators, then write." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{PRESETS.map((x, i) => <Pill key={x.name} on={p === i} onClick={() => setP(i)}>{x.name}</Pill>)}</div>
      <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{PRESETS[p].txs.map((t) => <li key={t.id} className="rounded-xl bg-[var(--surface)] px-3 py-1.5 font-num">T{t.id}: start {t.start}, validate {t.validate}, finish {t.finish} · reads {t.read.join("")} · writes {t.write.join("")}</li>)}</ul>
      <ol className="mt-3 space-y-1 text-sm">{res.map((r) => <li key={r.id} className={`rounded-xl px-3 py-1.5 ${r.ok ? "bg-[var(--surface)]" : "bg-rose-700 text-white"}`}><b>T{r.id} {r.ok ? "commits" : "rolls back"}</b>{r.checks.length ? `: ${r.checks.map((c) => c.why).join("; ")}` : ": first to validate"}</li>)}</ol>
    </Shell>
  );
}
