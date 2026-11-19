"use client";

/** Discrete Mathematics labs: one per topic. All logic lives in lib/study/dm.ts (checked by scripts). */
import { useMemo, useState, type ReactNode } from "react";
import * as D from "@/lib/study/dm";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => <button type="button" aria-pressed={on} onClick={onClick} className={on ? "pill-ink" : "pill-soft"}>{children}</button>;
const Stat = ({ label, value, sub, good }: { label: string; value: ReactNode; sub?: ReactNode; good?: boolean }) => <p className={`rounded-2xl p-3 text-sm ${good === undefined ? "bg-[var(--surface)]" : good ? "bg-emerald-700 text-white" : "bg-[var(--surface)] text-[var(--text-secondary)]"}`}>{label}<b className="block font-num text-xl">{value}</b>{sub && <span className="text-xs opacity-80">{sub}</span>}</p>;
const Yes = ({ label, on }: { label: string; on: boolean }) => <span className={`rounded-full px-3 py-1 text-xs font-bold ${on ? "bg-emerald-700 text-white" : "border border-[var(--border)] text-[var(--text-secondary)]"}`}>{on ? "✓" : "✗"} {label}</span>;
const Field = ({ label, value, set }: { label: string; value: string; set: (v: string) => void }) => <label className="block min-w-0 text-sm font-bold">{label}<input value={value} onChange={(e) => set(e.target.value)} aria-label={label} spellCheck={false} className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>;
const Step = ({ label, v, set, min, max }: { label: string; v: number; set: (n: number) => void; min: number; max: number }) => (
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>{label}</b><button type="button" aria-label={`${label} down`} onClick={() => set(Math.max(min, v - 1))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-7 text-center font-num">{v}</span><button type="button" aria-label={`${label} up`} onClick={() => set(Math.min(max, v + 1))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">+</button></span>
);
const OPS = "Use letters p q r s, ! (not), & (and), | (or), -> (implies), <-> (iff), ^ (xor), brackets.";

/* ------------------------------------------------------------ truth tables */
export function TruthLab() {
  const [f, setF] = useState("((p -> q) & (q -> r)) -> (p -> r)");
  const t = D.truthTable(f);
  return (
    <Shell title="Truth table lab" note={OPS} tint="peri">
      <div className="mt-3 flex flex-wrap gap-2">{["p -> q", "(p -> q) -> p", "((p -> q) & (q -> r)) -> (p -> r)", "p & !p", "(p | q) & (!p | r) -> (q | r)"].map((x) => <Pill key={x} on={f === x} onClick={() => setF(x)}>{x}</Pill>)}</div>
      <div className="mt-3"><Field label="Formula" value={f} set={setF} /></div>
      {!t.ok ? <p className="mt-3 rounded-2xl bg-rose-700 p-3 text-sm font-semibold text-white">Cannot read the formula: {t.error}.</p> : <>
        <div className="mt-3 overflow-x-auto"><table className="border-separate border-spacing-1 font-num text-sm"><thead><tr>{t.vars.map((v) => <th key={v} className="w-9 rounded-lg bg-[var(--surface)] py-1">{v}</th>)}<th className="rounded-lg bg-[var(--tint-ink)] px-3 py-1 text-[var(--surface)]">value</th></tr></thead>
          <tbody>{t.rows.map((r) => <tr key={r.k}>{t.vars.map((v) => <td key={v} className="rounded-lg bg-[var(--surface)]/70 text-center">{r.env[v] ? "T" : "F"}</td>)}<td className={`rounded-lg text-center font-bold ${r.out ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}>{r.out ? "T" : "F"}</td></tr>)}</tbody></table></div>
        <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="This formula is a" value={t.kind} /><Stat label="True rows (minterms)" value={t.minterms.length ? `Σm(${t.minterms.join(", ")})` : "none"} /><Stat label="False rows (maxterms)" value={t.maxterms.length ? `ΠM(${t.maxterms.join(", ")})` : "none"} /></div>
      </>}
    </Shell>
  );
}

/* ------------------------------------------------------------ equivalence */
export function EquivLab() {
  const [a, setA] = useState("p -> (q & r)"), [b, setB] = useState("(p -> q) & (p -> r)");
  const e = D.equivalent(a, b);
  const pairs = [["p -> q", "!q -> !p"], ["p -> q", "q -> p"], ["(p -> q) -> r", "p -> (q -> r)"], ["(p | q) -> r", "(p -> r) & (q -> r)"], ["!(p & q)", "!p | !q"]];
  return (
    <Shell title="Equivalence lab" note="Two formulas are equivalent when they agree on every row." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2">{pairs.map(([x, y]) => <Pill key={x + y} on={a === x && b === y} onClick={() => { setA(x); setB(y); }}>{x} vs {y}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Field label="Left" value={a} set={setA} /><Field label="Right" value={b} set={setB} /></div>
      {!e.ok ? <p className="mt-3 rounded-2xl bg-rose-700 p-3 text-sm font-semibold text-white">Cannot read: {e.error}.</p> : <>
        <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${e.same ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}>{e.same ? "Equivalent: they agree on all " + 2 ** e.vars.length + " rows." : `Not equivalent. Counterexample: ${Object.entries(e.counter!).map(([k, v]) => `${k} = ${v ? "T" : "F"}`).join(", ")}.`}</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Left as sum of minterms" value={`Σm(${e.left.minterms.join(", ") || "–"})`} /><Stat label="Right as sum of minterms" value={`Σm(${e.right.minterms.join(", ") || "–"})`} /></div>
      </>}
    </Shell>
  );
}

/* ------------------------------------------------------------ quantifiers on a grid */
export function QuantLab() {
  const [R, setR] = useState<D.Rel>(() => [[false, true, false, false], [false, false, true, false], [false, false, false, true], [true, false, false, false]]);
  const q = D.quantifiers(R);
  const flip = (x: number, y: number) => setR((r) => r.map((row, i) => row.map((v, j) => (i === x && j === y ? !v : v))));
  const rows: [string, boolean][] = [["∀x ∃y R(x, y): every row has a tick", q.AxEy], ["∃y ∀x R(x, y): some column is all ticks", q.EyAx], ["∀y ∃x R(x, y): every column has a tick", q.AyEx], ["∃x ∀y R(x, y): some row is all ticks", q.ExAy], ["∀x ∀y R(x, y): every cell", q.AxAy], ["∃x ∃y R(x, y): any cell", q.ExEy]];
  return (
    <Shell title="Quantifier lab" note="Domain {1, 2, 3, 4}. Tap cells to decide where R(x, y) holds." tint="sky">
      <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <table className="border-separate border-spacing-1 font-num text-sm"><thead><tr><th className="text-xs">x \ y</th>{[1, 2, 3, 4].map((y) => <th key={y}>{y}</th>)}</tr></thead>
          <tbody>{R.map((row, x) => <tr key={x}><th>{x + 1}</th>{row.map((v, y) => <td key={y}><button type="button" aria-label={`R(${x + 1}, ${y + 1}) ${v ? "true" : "false"}`} onClick={() => flip(x, y)} className={`h-9 w-9 rounded-lg font-bold ${v ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>{v ? "✓" : ""}</button></td>)}</tr>)}</tbody></table>
        <ul aria-live="polite" className="space-y-1.5">{rows.map(([t, v]) => <li key={t} className="flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-2 text-sm"><span className={`w-6 shrink-0 text-center font-bold ${v ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>{v ? "T" : "F"}</span><span className="min-w-0">{t}</span></li>)}</ul>
      </div>
      <p className="mt-3 text-xs text-[var(--text-secondary)]">∃y ∀x always implies ∀x ∃y, never the other way. Make one column full to see both become true.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ validity */
export function FolLab() {
  const [k, setK] = useState(5);
  const form = D.FOL_FORMS[k]; const c = D.folCounter(form.f);
  return (
    <Shell title="Validity lab" note="Checks every model with up to 3 objects for a counterexample." tint="lilac">
      <div className="mt-3 space-y-1.5">{D.FOL_FORMS.map((f, i) => <button key={f.id} type="button" aria-pressed={k === i} onClick={() => setK(i)} className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${k === i ? "bg-[var(--tint-ink)] font-bold text-[var(--surface)]" : "bg-[var(--surface)]"}`}>{f.text}</button>)}</div>
      <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${c ? "bg-rose-700 text-white" : "bg-emerald-700 text-white"}`}>{c ? `Not valid. Counterexample with ${c.P.length} object${c.P.length > 1 ? "s" : ""}: ${c.P.map((p, i) => `object ${i + 1} has P = ${p ? "T" : "F"}, Q = ${c.Q[i] ? "T" : "F"}`).join("; ")}.` : "Valid: no model with up to 3 objects breaks it (for these one-place forms, small models are enough)."}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ relations */
export function RelationLab() {
  const [n, setN] = useState(3);
  const [R, setR] = useState<D.Rel>(() => [[true, true, false], [true, true, false], [false, false, true]]);
  const resize = (m: number) => { setN(m); setR((r) => Array.from({ length: m }, (_, i) => Array.from({ length: m }, (_, j) => r[i]?.[j] ?? false))); };
  const p = D.relProps(R); const T = D.transitiveClosure(R);
  const flip = (x: number, y: number) => setR((r) => r.map((row, i) => row.map((v, j) => (i === x && j === y ? !v : v))));
  const added = R.reduce((s, row, i) => s + row.filter((v, j) => !v && T[i][j]).length, 0);
  return (
    <Shell title="Relation lab" note="Tap cells: a tick in row a, column b means (a, b) is in R." tint="peach">
      <div className="mt-3 flex flex-wrap items-center gap-2"><Step label="Set size" v={n} set={resize} min={2} max={5} />
        <button type="button" className="pill-soft" onClick={() => setR((r) => r.map((row, i) => row.map((v, j) => v || i === j)))}>Reflexive closure</button>
        <button type="button" className="pill-soft" onClick={() => setR((r) => r.map((row, i) => row.map((v, j) => v || r[j][i])))}>Symmetric closure</button>
        <button type="button" className="pill-soft" onClick={() => setR(T)}>Transitive closure (+{added})</button></div>
      <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <table className="border-separate border-spacing-1 font-num text-sm"><thead><tr><th />{R.map((_, j) => <th key={j}>{j + 1}</th>)}</tr></thead>
          <tbody>{R.map((row, i) => <tr key={i}><th>{i + 1}</th>{row.map((v, j) => <td key={j}><button type="button" aria-label={`pair (${i + 1}, ${j + 1}) ${v ? "in" : "not in"} R`} onClick={() => flip(i, j)} className={`h-9 w-9 rounded-lg font-bold ${v ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>{v ? "✓" : ""}</button></td>)}</tr>)}</tbody></table>
        <div aria-live="polite" className="flex min-w-0 flex-wrap content-start gap-2">
          <Yes label="reflexive" on={p.reflexive} /><Yes label="irreflexive" on={p.irreflexive} /><Yes label="symmetric" on={p.symmetric} /><Yes label="antisymmetric" on={p.antisymmetric} /><Yes label="asymmetric" on={p.asymmetric} /><Yes label="transitive" on={p.transitive} />
          <Yes label="equivalence relation" on={p.equivalence} /><Yes label="partial order" on={p.partialOrder} />
          <p className="w-full text-sm text-[var(--text-secondary)]">{p.pairs} ordered pairs.</p>
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ counting functions and relations */
export function FuncLab() {
  const [m, setM] = useState(4), [n, setN] = useState(3);
  const f = D.countFunctions(m, n), r = D.countRelations(n);
  return (
    <Shell title="Counting functions and relations" note="Functions from an m-element set A to an n-element set B; relations on B." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="m = |A|" v={m} set={setM} min={1} max={7} /><Step label="n = |B|" v={n} set={setN} min={1} max={6} /></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-4">
        <Stat label="All functions" value={f.all.toLocaleString("en-IN")} sub={`nᵐ = ${n}^${m}`} />
        <Stat label="One-to-one" value={f.injective.toLocaleString("en-IN")} sub={m > n ? "m > n: none" : `n!/(n−m)!`} />
        <Stat label="Onto" value={f.surjective.toLocaleString("en-IN")} sub={`n! · S(${m}, ${n})`} />
        <Stat label="Bijections" value={f.bijective.toLocaleString("en-IN")} sub={m === n ? "n!" : "needs m = n"} />
      </div>
      <p className="mt-4 text-sm font-bold">Relations on a set of {n}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-4">
        <Stat label="All" value={r.all.toLocaleString("en-IN")} sub="2^(n²)" /><Stat label="Reflexive" value={r.reflexive.toLocaleString("en-IN")} sub="2^(n² − n)" />
        <Stat label="Symmetric" value={r.symmetric.toLocaleString("en-IN")} sub="2^(n(n+1)/2)" /><Stat label="Reflexive and symmetric" value={r.reflSym.toLocaleString("en-IN")} sub="2^(n(n−1)/2)" />
        <Stat label="Antisymmetric" value={r.antisymmetric.toLocaleString("en-IN")} sub="2ⁿ · 3^(n(n−1)/2)" /><Stat label="Asymmetric" value={r.asymmetric.toLocaleString("en-IN")} sub="3^(n(n−1)/2)" />
        <Stat label="Equivalence relations" value={r.equivalence.toLocaleString("en-IN")} sub="Bell number" />
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ Hasse diagrams */
function layout(P: D.Poset) {
  if (P.pos) return P.pos;
  const { L, idx } = D.leq(P); const rank: Record<string, number> = {};
  const r = (e: string): number => rank[e] ?? (rank[e] = Math.max(0, ...P.els.filter((x) => x !== e && L[idx.get(x)!][idx.get(e)!]).map((x) => r(x) + 1)));
  P.els.forEach(r); const levels: Record<number, string[]> = {}; P.els.forEach((e) => { (levels[rank[e]] ??= []).push(e); });
  const top = Math.max(...Object.keys(levels).map(Number)); const pos: Record<string, [number, number]> = {};
  Object.entries(levels).forEach(([k, es]) => es.forEach((e, i) => { pos[e] = [((i + 1) * 300) / (es.length + 1), 190 - (Number(k) * 170) / Math.max(1, top)]; }));
  return pos;
}
function HasseSvg({ P, hl = [] }: { P: D.Poset; hl?: string[] }) {
  const pos = layout(P); const W = P.pos ? 160 : 300;
  return (
    <svg viewBox={`0 0 ${W} 200`} className="h-auto w-full max-w-[340px]" role="img" aria-label={`Hasse diagram of ${P.name}`}>
      {P.covers.map(([a, b]) => <line key={a + b} x1={pos[a][0]} y1={pos[a][1]} x2={pos[b][0]} y2={pos[b][1]} stroke="var(--text-secondary)" strokeWidth="1.6" />)}
      {P.els.map((e) => <g key={e}><circle cx={pos[e][0]} cy={pos[e][1]} r="14" fill={hl.includes(e) ? "var(--tint-ink)" : "var(--surface)"} stroke="var(--text-primary)" /><text x={pos[e][0]} y={pos[e][1] + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill={hl.includes(e) ? "var(--surface)" : "var(--text-primary)"}>{e}</text></g>)}
    </svg>
  );
}
export function HasseLab() {
  const [n, setN] = useState(12), [a, setA] = useState("4"), [b, setB] = useState("6");
  const P = useMemo(() => D.divisorPoset(n), [n]); const info = D.latticeInfo(P);
  const A = P.els.includes(a) ? a : P.els[1], B = P.els.includes(b) ? b : P.els[P.els.length - 2];
  return (
    <Shell title="Hasse diagram lab" note="Divisors of n ordered by 'divides'. Pick two elements to see their join (lcm) and meet (gcd)." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{[12, 18, 24, 30, 36, 60].map((x) => <Pill key={x} on={n === x} onClick={() => setN(x)}>D{x}</Pill>)}</div>
      <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="rounded-2xl bg-[var(--surface)] p-2"><HasseSvg P={P} hl={[A, B]} /></div>
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-1.5 text-sm"><b>a</b>{P.els.map((e) => <button key={e} type="button" aria-pressed={A === e} onClick={() => setA(e)} className={`h-8 min-w-8 rounded-lg px-1 font-num font-bold ${A === e ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "border border-[var(--border)]"}`}>{e}</button>)}</div>
          <div className="flex flex-wrap items-center gap-1.5 text-sm"><b>b</b>{P.els.map((e) => <button key={e} type="button" aria-pressed={B === e} onClick={() => setB(e)} className={`h-8 min-w-8 rounded-lg px-1 font-num font-bold ${B === e ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "border border-[var(--border)]"}`}>{e}</button>)}</div>
          <div aria-live="polite" className="grid gap-2 sm:grid-cols-2"><Stat label="a ∨ b (lcm)" value={info.join!(A, B)} /><Stat label="a ∧ b (gcd)" value={info.meet!(A, B)} /><Stat label="Complement of a" value={info.complements![A].join(", ") || "none"} /><Stat label="Elements / cover edges" value={`${P.els.length} / ${P.covers.length}`} /></div>
          <div className="flex flex-wrap gap-2"><Yes label="lattice" on={info.isLattice} /><Yes label="distributive" on={info.distributive} /><Yes label="complemented (Boolean)" on={info.complemented} /></div>
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ lattice properties */
export function LatticeLab() {
  const [k, setK] = useState(2);
  const P = D.LATTICES[k]; const info = D.latticeInfo(P);
  return (
    <Shell title="Lattice lab" note="Five small posets. Which are lattices, distributive, complemented?" tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{D.LATTICES.map((l, i) => <Pill key={l.name} on={k === i} onClick={() => setK(i)}>{l.name}</Pill>)}</div>
      <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div className="w-40 rounded-2xl bg-[var(--surface)] p-2"><HasseSvg P={P} /></div>
        <div aria-live="polite" className="min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2"><Yes label="lattice" on={info.isLattice} /><Yes label="distributive" on={info.distributive} /><Yes label="complemented" on={info.complemented} /></div>
          <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Minimal: {info.minimal.join(", ")}. Maximal: {info.maximal.join(", ")}.{!info.isLattice && " Two maximal elements with no single least upper bound for a and b, so this is not a lattice."}</p>
          {info.complements && <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Complements: {Object.entries(info.complements).map(([e, c]) => `${e} → ${c.join(" or ") || "none"}`).join("; ")}.{Object.values(info.complements).some((c) => c.length > 1) && " An element with two complements means the lattice is not distributive."}</p>}
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ algebraic structures */
export function AlgebraLab() {
  const [kind, setKind] = useState<D.Struct>("Znx0"), [n, setN] = useState(5);
  const s = D.structure(kind, n);
  const names: Record<D.Struct, string> = { "Zn+": "{0..n−1}, + mod n", "Znx": "{0..n−1}, × mod n", "Znx0": "{1..n−1}, × mod n", Un: "units U(n), × mod n" };
  return (
    <Shell title="Algebraic structure lab" note="Check closure, associativity, identity and inverses on the Cayley table." tint="sky">
      <div className="mt-3 flex flex-wrap items-center gap-2">{(Object.keys(names) as D.Struct[]).map((k) => <Pill key={k} on={kind === k} onClick={() => setKind(k)}>{names[k]}</Pill>)}<Step label="n" v={n} set={setN} min={2} max={9} /></div>
      <div className="mt-3 overflow-x-auto"><table className="border-separate border-spacing-1 font-num text-xs"><thead><tr><th className="px-1">{kind === "Zn+" ? "+" : "×"}</th>{s.els.map((e) => <th key={e} className="w-8 rounded bg-[var(--surface)]">{e}</th>)}</tr></thead>
        <tbody>{s.table.map((row, i) => <tr key={i}><th className="rounded bg-[var(--surface)]">{s.els[i]}</th>{row.map((v, j) => <td key={j} className={`h-7 w-8 rounded text-center ${!s.els.includes(v) ? "bg-rose-700 font-bold text-white" : v === s.identity ? "bg-[var(--tint-ink)] font-bold text-[var(--surface)]" : "bg-[var(--surface)]/70"}`}>{v}</td>)}</tr>)}</tbody></table></div>
      <div aria-live="polite" className="mt-3 flex flex-wrap gap-2"><Yes label="closed" on={s.closed} /><Yes label="associative" on={s.assoc} /><Yes label={`identity${s.identity !== undefined ? ` (${s.identity})` : ""}`} on={s.identity !== undefined} /><Yes label="every element has an inverse" on={s.inverses} /><Yes label="commutative" on={s.commutative} /></div>
      <p className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm font-semibold">This is: {s.kindName}. {s.closed ? "" : "Red cells fall outside the set."}{s.identity !== undefined ? " Dark cells show the identity." : ""}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ cyclic groups */
export function CyclicLab() {
  const [n, setN] = useState(12), [g, setG] = useState(8);
  const c = D.cyclicInfo(n); const k = g % n;
  const powers: number[] = []; for (let x = 0, i = 0; i < n; i++) { powers.push(x); x = (x + k) % n; if (x === 0) break; }
  return (
    <Shell title="Cyclic group lab" note="Zₙ under addition mod n. Pick an element to see the subgroup it generates." tint="mint">
      <div className="mt-3 flex flex-wrap items-center gap-2"><Step label="n" v={n} set={(v) => { setN(v); setG(Math.min(g, v - 1)); }} min={2} max={20} /><Step label="element" v={k} set={setG} min={0} max={n - 1} /></div>
      <div className="mt-3 flex flex-wrap gap-1">{[...Array(n).keys()].map((x) => <span key={x} className={`grid h-9 w-9 place-items-center rounded-full font-num text-sm font-bold ${powers.includes(x) ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>{x}</span>)}</div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-4">
        <Stat label={`Order of ${k}`} value={c.orders[k].ord} sub={`n / gcd(${k}, ${n})`} />
        <Stat label="Generators" value={c.generators.length} sub={`φ(${n}): ${c.generators.join(", ")}`} />
        <Stat label="Subgroups" value={c.subgroups.length} sub="one per divisor of n" />
        <Stat label={`⟨${k}⟩`} value={`{${powers.join(", ")}}`} />
      </div>
      <p className="mt-3 text-xs text-[var(--text-secondary)]">Elements of each order: {c.elementsOfOrder.map((e) => `order ${e.d}: ${e.count}`).join(" · ")}.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ graph editor shared by two labs */
const CX = (i: number, n: number) => 110 + 85 * Math.sin((2 * Math.PI * i) / n), CY = (i: number, n: number) => 105 - 85 * Math.cos((2 * Math.PI * i) / n);
export function GraphEditor({ g, setG, colours, hlEdges = [], hlVerts = [] }: { g: D.G; setG: (g: D.G) => void; colours?: number[]; hlEdges?: [number, number][]; hlVerts?: number[] }) {
  const has = (a: number, b: number) => g.edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  const toggle = (a: number, b: number) => setG({ n: g.n, edges: has(a, b) ? g.edges.filter(([x, y]) => !((x === a && y === b) || (x === b && y === a))) : [...g.edges, [a, b]] });
  const PAL = ["#be123c", "#1d4ed8", "#047857", "#b45309", "#6d28d9", "#0e7490"];
  const isHl = (a: number, b: number) => hlEdges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
  const pairs: [number, number][] = []; for (let a = 0; a < g.n; a++) for (let b = a + 1; b < g.n; b++) pairs.push([a, b]);
  return (
    <svg viewBox="0 0 220 210" className="h-auto w-full max-w-[300px]" role="img" aria-label={`Graph with ${g.n} vertices and ${g.edges.length} edges. Tap a faint line to add an edge, a solid line to remove it.`}>
      {pairs.map(([a, b]) => { const on = has(a, b); return <line key={`${a}-${b}`} x1={CX(a, g.n)} y1={CY(a, g.n)} x2={CX(b, g.n)} y2={CY(b, g.n)} stroke={on ? (isHl(a, b) ? "var(--tint-ink)" : "var(--text-primary)") : "var(--border)"} strokeWidth={on ? (isHl(a, b) ? 4 : 2.2) : 1} strokeDasharray={on ? undefined : "3 4"} className="cursor-pointer" onClick={() => toggle(a, b)} />; })}
      {pairs.map(([a, b]) => <line key={`hit-${a}-${b}`} x1={CX(a, g.n)} y1={CY(a, g.n)} x2={CX(b, g.n)} y2={CY(b, g.n)} stroke="transparent" strokeWidth="12" className="cursor-pointer" onClick={() => toggle(a, b)} />)}
      {[...Array(g.n).keys()].map((v) => <g key={v}><circle cx={CX(v, g.n)} cy={CY(v, g.n)} r="13" fill={colours ? PAL[colours[v] % PAL.length] : hlVerts.includes(v) ? "var(--tint-ink)" : "var(--surface)"} stroke="var(--text-primary)" strokeWidth="1.5" /><text x={CX(v, g.n)} y={CY(v, g.n) + 4} fontSize="11" fontWeight="800" textAnchor="middle" fill={colours || hlVerts.includes(v) ? "#fff" : "var(--text-primary)"}>{v + 1}</text></g>)}
    </svg>
  );
}
export function GraphLab() {
  const [k, setK] = useState(3); const [g, setG] = useState<D.G>(D.GRAPHS[3].g);
  const i = D.graphInfo(g);
  return (
    <Shell title="Graph properties lab" note="Pick a graph, or tap lines to add and remove edges." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2">{D.GRAPHS.map((x, j) => <Pill key={x.name} on={k === j} onClick={() => { setK(j); setG(x.g); }}>{x.name}</Pill>)}</div>
      <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div className="rounded-2xl bg-[var(--surface)] p-2"><GraphEditor g={g} setG={(x) => { setG(x); setK(-1); }} hlEdges={i.bridges} hlVerts={i.cutVertices} /></div>
        <div aria-live="polite" className="min-w-0 space-y-2">
          <div className="grid gap-2 sm:grid-cols-3"><Stat label="Degrees" value={i.deg.join(", ")} sub={`sum ${i.sumDeg} = 2 × ${i.edges} edges`} /><Stat label="Components" value={i.comps} /><Stat label="Odd-degree vertices" value={i.odd} sub="always even" /></div>
          <div className="flex flex-wrap gap-2"><Yes label="Euler circuit" on={i.eulerCircuit} /><Yes label="Euler path" on={i.eulerPath} /></div>
          <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Cut vertices: {i.cutVertices.map((v) => v + 1).join(", ") || "none"}. Bridges: {i.bridges.map(([a, b]) => `${a + 1}–${b + 1}`).join(", ") || "none"} (highlighted).</p>
        </div>
      </div>
    </Shell>
  );
}
export function ColourLab() {
  const [k, setK] = useState(5); const [g, setG] = useState<D.G>(D.GRAPHS[5].g);
  const c = D.chromatic(g), m = D.maxMatching(g), ci = D.cliqueIndep(g);
  return (
    <Shell title="Colouring and matching lab" note="Fewest colours so neighbours differ; most edges with no shared vertex." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{D.GRAPHS.map((x, j) => <Pill key={x.name} on={k === j} onClick={() => { setK(j); setG(x.g); }}>{x.name}</Pill>)}</div>
      <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div className="rounded-2xl bg-[var(--surface)] p-2"><GraphEditor g={g} setG={(x) => { setG(x); setK(-1); }} colours={c.colours} hlEdges={m} /></div>
        <div aria-live="polite" className="grid min-w-0 content-start gap-2 sm:grid-cols-2">
          <Stat label="Chromatic number χ" value={c.k} sub="vertex colours shown" /><Stat label="Maximum matching" value={m.length} sub={`edges ${m.map(([a, b]) => `${a + 1}–${b + 1}`).join(", ")} (thick)`} />
          <Stat label="Largest clique ω" value={ci.clique} sub="χ ≥ ω" /><Stat label="Independence number α" value={ci.indep} sub={`χ ≥ n/α = ${(g.n / Math.max(1, ci.indep)).toFixed(2)}`} />
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ counting */
export function CountLab() {
  const [n, setN] = useState(7), [r, setR] = useState(3), [N, setNN] = useState(25), [kk, setKK] = useState(6);
  return (
    <Shell title="Counting lab" note="Order matters or not; repetition allowed or not." tint="peri">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="n" v={n} set={setN} min={1} max={12} /><Step label="r" v={r} set={setR} min={0} max={12} /></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-4">
        <Stat label="Ordered, no repeats" value={D.nPr(n, r).toLocaleString("en-IN")} sub="P(n, r) = n!/(n−r)!" />
        <Stat label="Unordered, no repeats" value={D.nCr(n, r).toLocaleString("en-IN")} sub="C(n, r)" />
        <Stat label="Ordered, repeats" value={(n ** r).toLocaleString("en-IN")} sub="nʳ" />
        <Stat label="Unordered, repeats" value={D.nCr(n + r - 1, r).toLocaleString("en-IN")} sub="C(n + r − 1, r): stars and bars" />
      </div>
      <p className="mt-4 text-sm font-bold">Pigeonhole</p>
      <div className="mt-2 flex flex-wrap items-center gap-2"><Step label="objects" v={N} set={setNN} min={1} max={100} /><Step label="boxes" v={kk} set={setKK} min={1} max={30} /><span className="rounded-xl bg-[var(--surface)] px-3 py-2 text-sm">Some box holds at least <b className="font-num">⌈{N}/{kk}⌉ = {Math.ceil(N / kk)}</b>.</span></div>
    </Shell>
  );
}
export function DerangeLab() {
  const [n, setN] = useState(5);
  const [s, setS] = useState({ a: 60, b: 45, c: 30, ab: 20, ac: 15, bc: 10, abc: 5 });
  const union = s.a + s.b + s.c - s.ab - s.ac - s.bc + s.abc;
  const set = (k: keyof typeof s) => (v: number) => setS((x) => ({ ...x, [k]: v }));
  return (
    <Shell title="Inclusion–exclusion lab" note="Derangements, onto functions and the three-set formula." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="n" v={n} set={setN} min={1} max={10} /></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">
        <Stat label={`Derangements D(${n})`} value={D.derangements(n).toLocaleString("en-IN")} sub={`n! Σ (−1)ᵏ/k! ≈ n!/e = ${(D.fact(n) / Math.E).toFixed(1)}`} />
        <Stat label="Probability nobody gets their own" value={(D.derangements(n) / D.fact(n)).toFixed(4)} sub="→ 1/e ≈ 0.3679" />
        <Stat label={`Onto functions ${n + 2} → 3`} value={D.surjections(n + 2, 3).toLocaleString("en-IN")} sub="3ᵐ − 3·2ᵐ + 3·1ᵐ" />
      </div>
      <p className="mt-4 text-sm font-bold">|A ∪ B ∪ C|</p>
      <div className="mt-2 flex flex-wrap gap-2">{(Object.keys(s) as (keyof typeof s)[]).map((k) => <Step key={k} label={k === "abc" ? "|A∩B∩C|" : k.length === 2 ? `|${k[0].toUpperCase()}∩${k[1].toUpperCase()}|` : `|${k.toUpperCase()}|`} v={s[k]} set={set(k)} min={0} max={100} />)}</div>
      <p className="mt-2 rounded-2xl bg-[var(--surface)] p-3 text-sm">{s.a} + {s.b} + {s.c} − {s.ab} − {s.ac} − {s.bc} + {s.abc} = <b className="font-num">{union}</b></p>
    </Shell>
  );
}

/* ------------------------------------------------------------ recurrences */
export function RecurLab() {
  const [c1, setC1] = useState(5), [c2, setC2] = useState(-6), [a0, setA0] = useState(1), [a1, setA1] = useState(4), [d, setD] = useState(0);
  const seq = D.recurrence(c1, c2, a0, a1, 10, d); const r = D.charRoots(c1, c2);
  return (
    <Shell title="Recurrence lab" note="aₙ = c₁ aₙ₋₁ + c₂ aₙ₋₂ + d. The characteristic equation is x² = c₁x + c₂." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{[["Fibonacci", 1, 1, 0, 1, 0], ["Roots 3 and 2", 5, -6, 1, 4, 0], ["Repeated root 2", 4, -4, 1, 6, 0], ["Hanoi 2aₙ₋₁ + 1", 2, 0, 0, 1, 1]].map(([name, x, y, z, w, dd]) => <Pill key={name as string} on={c1 === x && c2 === y && a0 === z && a1 === w && d === dd} onClick={() => { setC1(x as number); setC2(y as number); setA0(z as number); setA1(w as number); setD(dd as number); }}>{name}</Pill>)}</div>
      <div className="mt-3 flex flex-wrap gap-2"><Step label="c₁" v={c1} set={setC1} min={-6} max={6} /><Step label="c₂" v={c2} set={setC2} min={-9} max={9} /><Step label="d" v={d} set={setD} min={-5} max={5} /><Step label="a₀" v={a0} set={setA0} min={-5} max={9} /><Step label="a₁" v={a1} set={setA1} min={-5} max={9} /></div>
      <div className="mt-3 overflow-x-auto"><div className="flex min-w-max gap-1">{seq.map((v, i) => <span key={i} className="rounded-xl bg-[var(--surface)] px-2.5 py-1.5 text-center font-num text-sm"><span className="block text-[10px] text-[var(--text-secondary)]">a{i}</span>{v}</span>)}</div></div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">{d !== 0 ? "Non-homogeneous (d ≠ 0): add a particular solution to the homogeneous one. " : ""}{!r.real ? `Complex roots (discriminant ${r.disc}).` : r.repeated ? `Repeated root ${r.r1}: aₙ = (A + Bn)·${r.r1}ⁿ.` : c2 === 0 ? `One root ${c1}: aₙ = A·${c1}ⁿ${d ? " + particular" : ""}.` : `Roots ${+r.r1.toFixed(3)} and ${+r.r2.toFixed(3)}: aₙ = A·${+r.r1.toFixed(3)}ⁿ + B·${+r.r2.toFixed(3)}ⁿ.`}</p>
    </Shell>
  );
}
export function GenFunLab() {
  const [k, setK] = useState(3), [n, setN] = useState(8);
  const [lo, setLo] = useState([0, 0, 0, 0]), [hi, setHi] = useState([3, 4, 5, 9]);
  const r = D.boundedSolutions(lo.slice(0, k), hi.slice(0, k), n);
  const setAt = (arr: number[], f: (a: number[]) => void, i: number) => (v: number) => f(arr.map((x, j) => (j === i ? v : x)));
  return (
    <Shell title="Generating function lab" note="Solutions of x₁ + … + xₖ = n with bounds = coefficient of xⁿ in the product." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="k variables" v={k} set={setK} min={2} max={4} /><Step label="n" v={n} set={setN} min={0} max={20} /></div>
      <div className="mt-2 flex flex-wrap gap-2">{[...Array(k).keys()].map((i) => <span key={i} className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[var(--border)] p-1"><Step label={`min x${i + 1}`} v={lo[i]} set={setAt(lo, setLo, i)} min={0} max={hi[i]} /><Step label="max" v={hi[i]} set={setAt(hi, setHi, i)} min={lo[i]} max={12} /></span>)}</div>
      <p className="mt-3 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3 font-num text-sm">{[...Array(k).keys()].map((i) => `(x^${lo[i]} + … + x^${hi[i]})`).join(" · ")}</p>
      <div className="mt-2 overflow-x-auto"><div className="flex min-w-max gap-1">{r.poly.map((c, i) => <span key={i} className={`rounded-lg px-2 py-1 text-center font-num text-xs ${i === n ? "bg-[var(--tint-ink)] font-bold text-[var(--surface)]" : "bg-[var(--surface)]"}`}><span className="block text-[9px] opacity-70">x{i}</span>{c}</span>)}</div></div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">Number of solutions: <b className="font-num">{r.coeff}</b>. Without upper bounds it would be C(n − Σmin + k − 1, k − 1) = {D.nCr(n - lo.slice(0, k).reduce((a, b) => a + b, 0) + k - 1, k - 1)}.</p>
    </Shell>
  );
}
