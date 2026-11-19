"use client";

/** Discrete Mathematics labs, depth expansion batch A. Logic in lib/study/dm2.ts (checked by scripts). */
import { useState, type ReactNode } from "react";
import * as D from "@/lib/study/dm2";
import { latticeInfo, divisorPoset } from "@/lib/study/dm";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Pill = ({ on, onClick, children, title }: { on: boolean; onClick: () => void; children: ReactNode; title?: string }) => <button type="button" title={title} aria-pressed={on} onClick={onClick} className={on ? "pill-ink" : "pill-soft"}>{children}</button>;
const Yes = ({ label, on }: { label: string; on: boolean }) => <span className={`rounded-full px-3 py-1 text-xs font-bold ${on ? "bg-emerald-700 text-white" : "border border-[var(--border)] text-[var(--text-secondary)]"}`}>{on ? "✓" : "✗"} {label}</span>;
const Field = ({ label, value, set }: { label: string; value: string; set: (v: string) => void }) => <label className="block min-w-0 text-sm font-bold">{label}<input value={value} onChange={(e) => set(e.target.value)} aria-label={label} spellCheck={false} className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>;
const Banner = ({ good, children }: { good: boolean; children: ReactNode }) => <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${good ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}>{children}</p>;

/* ------------------------------------------------------------ arguments */
const ARGS: { name: string; ps: string[]; c: string }[] = [
  { name: "Modus tollens", ps: ["p -> q", "!q"], c: "!p" },
  { name: "Affirming the consequent", ps: ["p -> q", "q"], c: "p" },
  { name: "Chain + tollens", ps: ["p -> q", "q -> r", "!r"], c: "!p" },
  { name: "Resolution", ps: ["p | q", "!p | r"], c: "q | r" },
  { name: "Denying the antecedent", ps: ["p -> q", "!p"], c: "!q" },
];
export function ArgumentLab() {
  const [ps, setPs] = useState(["p -> q", "q -> r", "!r"]); const [c, setC] = useState("!p");
  const r = D.checkArgument(ps, c);
  return (
    <Shell title="Argument checker" note="Valid when every row that makes all premises true also makes the conclusion true." tint="peri">
      <div className="mt-3 flex flex-wrap gap-2">{ARGS.map((a) => <Pill key={a.name} on={a.c === c && a.ps.join() === ps.join()} onClick={() => { setPs(a.ps); setC(a.c); }}>{a.name}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">{ps.map((p, i) => <Field key={i} label={`Premise ${i + 1}`} value={p} set={(v) => setPs((x) => x.map((y, j) => (j === i ? v : y)))} />)}<Field label="Conclusion" value={c} set={setC} /></div>
      <div className="mt-2 flex gap-2"><button type="button" className="pill-soft" onClick={() => setPs((x) => [...x, ""])} disabled={ps.length >= 4}>Add premise</button><button type="button" className="pill-soft" onClick={() => setPs((x) => x.slice(0, -1))} disabled={ps.length <= 1}>Remove premise</button></div>
      {!r.ok ? <Banner good={false}>Cannot read {r.error}.</Banner> : <Banner good={r.valid}>{r.valid ? `Valid: in all ${r.rowsAllTrue} row(s) where the premises hold, the conclusion holds too.` : `Invalid. Counterexample: ${Object.entries(r.counter!).map(([k, v]) => `${k} = ${v ? "T" : "F"}`).join(", ")} makes every premise true and the conclusion false.`}</Banner>}
    </Shell>
  );
}

/* ------------------------------------------------------------ functional completeness */
const OPS: { k: D.Op; s: string; full: string }[] = [{ k: "NOT", s: "¬", full: "negation" }, { k: "AND", s: "∧", full: "and" }, { k: "OR", s: "∨", full: "or" }, { k: "IMP", s: "→", full: "implies" }, { k: "XOR", s: "⊕", full: "exclusive or" }, { k: "IFF", s: "↔", full: "if and only if" }, { k: "NAND", s: "↑", full: "NAND (not and)" }, { k: "NOR", s: "↓", full: "NOR (not or)" }, { k: "T", s: "T", full: "constant true" }, { k: "F", s: "F", full: "constant false" }];
export function CompleteLab() {
  const [ops, setOps] = useState<D.Op[]>(["IMP"]);
  const r = D.isComplete(ops); const tog = (k: D.Op) => setOps((x) => (x.includes(k) ? x.filter((y) => y !== k) : [...x, k]));
  const names: Record<string, string> = { p0: "all keep 0 (f(F,F) = F)", p1: "all keep 1 (f(T,T) = T)", selfDual: "all self-dual", monotone: "all monotone", affine: "all affine (XOR-like)" };
  return (
    <Shell title="Functional completeness lab" note="Pick connectives. Complete means every truth table can be built from them." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2">{OPS.map((o) => <Pill key={o.k} on={ops.includes(o.k)} title={o.full} onClick={() => tog(o.k)}>{o.s}{o.k === "NAND" ? " NAND" : o.k === "NOR" ? " NOR" : ""}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Two-variable functions you can build<b className="block font-num text-2xl">{r.closureSize} / 16</b></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Post&apos;s test<b className="block text-base">{ops.length === 0 ? "pick something" : r.blocks.length ? `stuck: ${r.blocks.map((b) => names[b]).join("; ")}` : "escapes all five classes"}</b></p>
      </div>
      <Banner good={r.complete}>{ops.length === 0 ? "Choose at least one connective." : r.complete ? "Functionally complete: every Boolean function can be written with these." : "Not complete: every formula built from these shares a property that some functions lack."}</Banner>
    </Shell>
  );
}

/* ------------------------------------------------------------ translation */
const TR = [
  { en: "Every student has a friend who is a student.", opts: ["∀x (S(x) → ∃y (S(y) ∧ F(x, y)))", "∃y ∀x (S(x) → F(x, y))", "∀x ∃y (S(x) ∧ S(y) ∧ F(x, y))", "∃x ∀y (S(y) → F(x, y))"], a: 0, why: "For each student x there exists (perhaps a different) student y: ∀ then ∃, with → under ∀ and ∧ under ∃." },
  { en: "Some student is a friend of every student.", opts: ["∀x ∃y (S(y) ∧ F(y, x))", "∃y (S(y) ∧ ∀x (S(x) → F(y, x)))", "∃y ∀x (S(y) ∧ S(x) ∧ F(y, x))", "∀y (S(y) → ∃x F(y, x))"], a: 1, why: "One particular y works for all x: ∃ comes first. Option 3 also claims everything in the domain is a student." },
  { en: "No student is friends with everyone.", opts: ["∀x (S(x) → ∃y ¬F(x, y))", "∃x (S(x) ∧ ∀y ¬F(x, y))", "¬∀x (S(x) → ∀y F(x, y))", "∀x ∀y ¬F(x, y)"], a: 0, why: "¬∃x (S(x) ∧ ∀y F(x, y)) pushes to ∀x (S(x) → ∃y ¬F(x, y)). Option 3 says only 'not every student is friends with everyone'." },
  { en: "There is exactly one tallest student.", opts: ["∃x (S(x) ∧ ∀y (S(y) ∧ y ≠ x → T(x, y)))", "∃x (S(x) ∧ ∀y (S(y) ∧ y ≠ x → T(x, y)) ∧ ∀z (S(z) ∧ ∀y (S(y) ∧ y ≠ z → T(z, y)) → z = x))", "∀x ∃y T(x, y)", "∃x ∃y (T(x, y) ∧ T(y, x))"], a: 1, why: "Exactly one = existence (some x is taller than all others) plus uniqueness (any such z equals x)." },
];
export function TranslateLab() {
  const [picks, setPicks] = useState<Record<number, number>>({});
  return (
    <Shell title="Translation lab" note="Pick the formula that says exactly what the sentence says. S: student, F: friend of, T: taller than." tint="sky">
      <div className="mt-3 space-y-3">{TR.map((t, i) => (
        <div key={i} className="rounded-2xl bg-[var(--surface)] p-3">
          <p className="text-sm font-bold">{i + 1}. {t.en}</p>
          <div className="mt-2 grid gap-1.5">{t.opts.map((o, j) => { const chose = picks[i] === j, done = i in picks; return <button key={j} type="button" onClick={() => setPicks((p) => ({ ...p, [i]: j }))} className={`rounded-xl border-2 px-3 py-1.5 text-left font-num text-xs ${done ? (j === t.a ? "border-emerald-700 bg-emerald-700 text-white" : chose ? "border-rose-700 bg-rose-700 text-white" : "border-[var(--border)]") : "border-[var(--border)] hover:bg-[var(--surface-secondary)]"}`}>{o}</button>; })}</div>
          {i in picks && <p className="mt-2 text-xs text-[var(--text-secondary)]">{t.why}</p>}
        </div>))}</div>
      <p aria-live="polite" className="mt-3 text-sm font-semibold">{Object.keys(picks).length ? `${Object.entries(picks).filter(([i, j]) => TR[+i].a === j).length} of ${Object.keys(picks).length} right` : "Pick an option for each sentence."}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ sets */
export function SetLab() {
  const [A, setA] = useState(0b00001111), [B, setB] = useState(0b00111100);
  const o = D.setOps(A, B); const L = (m: number) => `{${D.toList(m).join(", ")}}`;
  const row = (name: string, m: number, set: (f: (x: number) => number) => void) => (
    <div className="flex flex-wrap items-center gap-1.5"><b className="w-6 text-sm">{name}</b>{[...Array(D.U).keys()].map((i) => <button key={i} type="button" aria-label={`${i + 1} in ${name}`} aria-pressed={Boolean((m >> i) & 1)} onClick={() => set((x) => x ^ (1 << i))} className={`h-9 w-9 rounded-full font-num text-sm font-bold ${(m >> i) & 1 ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "border border-[var(--border)] bg-[var(--surface)]"}`}>{i + 1}</button>)}</div>
  );
  return (
    <Shell title="Set algebra lab" note="Universe {1, …, 8}. Tap numbers to put them in A or B." tint="butter">
      <div className="mt-3 space-y-2">{row("A", A, setA)}{row("B", B, setB)}</div>
      <div aria-live="polite" className="mt-3 grid gap-2 font-num text-sm sm:grid-cols-2 lg:grid-cols-4">
        {[["A ∪ B", L(o.union)], ["A ∩ B", L(o.inter)], ["A − B", L(o.diffAB)], ["B − A", L(o.diffBA)], ["A ⊕ B", L(o.sym)], ["Aᶜ", L(o.compA)], ["|P(A)|", `2^${D.size(A)} = ${o.powerA}`], ["|A × B|", `${D.size(A)} × ${D.size(B)} = ${o.productAB}`]].map(([k, v]) => <p key={k} className="rounded-2xl bg-[var(--surface)] p-3"><span className="text-xs text-[var(--text-secondary)]">{k}</span><b className="block break-words">{v}</b></p>)}
      </div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Check: |A ∪ B| = |A| + |B| − |A ∩ B| = {D.size(A)} + {D.size(B)} − {D.size(o.inter)} = {D.size(o.union)}.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ composition */
export function ComposeLab() {
  const [f, setF] = useState<D.Fn>([2, 3, 4, 1]), [g, setG] = useState<D.Fn>([1, 1, 2, 3]);
  const gf = D.compose(g, f), fg = D.compose(f, g); const pf = D.fnProps(f), pg = D.fnProps(g), pgf = D.fnProps(gf);
  const edit = (name: string, h: D.Fn, set: (x: D.Fn) => void) => (
    <div className="rounded-2xl bg-[var(--surface)] p-3"><p className="text-sm font-bold">{name}: {"{1,2,3,4}"} → {"{1,2,3,4}"}</p>
      <div className="mt-2 space-y-1">{h.map((y, i) => <div key={i} className="flex items-center gap-1.5 font-num text-sm"><span className="w-12">{name}({i + 1}) =</span>{[1, 2, 3, 4].map((v) => <button key={v} type="button" aria-pressed={y === v} onClick={() => set(h.map((z, j) => (j === i ? v : z)))} className={`h-7 w-7 rounded-lg font-bold ${y === v ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "border border-[var(--border)]"}`}>{v}</button>)}</div>)}</div></div>
  );
  return (
    <Shell title="Composition lab" note="(g ∘ f)(x) = g(f(x)): apply f first. Edit both functions." tint="peach">
      <div className="mt-3 grid gap-3 sm:grid-cols-2">{edit("f", f, setF)}{edit("g", g, setG)}</div>
      <div aria-live="polite" className="mt-3 grid gap-2 font-num text-sm sm:grid-cols-2">
        <p className="rounded-2xl bg-[var(--surface)] p-3">g ∘ f = [{gf.join(", ")}]<span className="block font-sans text-xs text-[var(--text-secondary)]">{pgf.bijective ? "a bijection" : `image {${pgf.image.join(", ")}}`}</span></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3">f ∘ g = [{fg.join(", ")}]<span className="block font-sans text-xs text-[var(--text-secondary)]">{fg.join() === gf.join() ? "equal to g ∘ f here" : "different from g ∘ f: composition is not commutative"}</span></p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2"><Yes label="f one-to-one" on={pf.injective} /><Yes label="f onto" on={pf.surjective} /><Yes label="g one-to-one" on={pg.injective} /><Yes label="g onto" on={pg.surjective} /></div>
      <p className="mt-2 text-sm">{pf.inverse ? `f⁻¹ = [${pf.inverse.join(", ")}]: f⁻¹(f(x)) = x for every x.` : "f has no inverse: it is not a bijection."}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ Boolean algebra: atoms */
export function AtomLab() {
  const [n, setN] = useState(30);
  const a = D.atomsOfDn(n); const info = latticeInfo(divisorPoset(n));
  return (
    <Shell title="Boolean algebra lab" note="Dₙ is Boolean exactly when n is square-free. Its atoms are the primes dividing n." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{[6, 12, 30, 36, 42, 60, 210].map((x) => <Pill key={x} on={n === x} onClick={() => setN(x)}>D{x}</Pill>)}</div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Divisors<b className="block font-num text-lg">{a.divs.length}</b><span className="text-xs text-[var(--text-secondary)]">{a.divs.join(", ")}</span></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Atoms (cover 1)<b className="block font-num text-lg">{a.atoms.join(", ")}</b><span className="text-xs text-[var(--text-secondary)]">2^{a.atoms.length} = {a.expectedSize}</span></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Each divisor ↔ a set of atoms<b className="block font-num text-lg">{a.boolean ? "yes" : "no"}</b><span className="text-xs text-[var(--text-secondary)]">{a.boolean ? `${a.divs.length} = ${a.expectedSize} subsets` : `${a.divs.length} ≠ ${a.expectedSize}: a prime repeats`}</span></p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2"><Yes label="distributive" on={info.distributive} /><Yes label="complemented" on={info.complemented} /><Yes label="Boolean algebra" on={info.distributive && info.complemented} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ cosets */
export function CosetLab() {
  const [n, setN] = useState(12), [d, setD] = useState(4), [h, setH] = useState(0);
  const z = D.zCosets(n, d);
  const HS = [["e", "(12)"], ["e", "(123)", "(132)"], ["e", "(13)"]]; const s = D.s3Cosets(HS[h]);
  return (
    <Shell title="Cosets lab" note="Cosets split a group into equal blocks; there are |G| / |H| of them." tint="rose">
      <p className="mt-3 text-sm font-bold">Zₙ under addition, H = ⟨d⟩</p>
      <div className="mt-2 flex flex-wrap gap-2">{[6, 8, 12].map((x) => <Pill key={x} on={n === x} onClick={() => { setN(x); setD(Math.min(d, x - 1)); }}>Z{x}</Pill>)}<span className="mx-1" />{[...Array(n).keys()].filter((x) => x > 0 && n % x === 0).map((x) => <Pill key={x} on={d === x} onClick={() => setD(x)}>d = {x}</Pill>)}</div>
      <div className="mt-2 flex flex-wrap gap-2">{z.cosets.map((c, i) => <span key={i} className={`rounded-2xl px-3 py-2 font-num text-sm ${i === 0 ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>{i === 0 ? "H" : `${c[0]} + H`} = {"{"}{c.join(", ")}{"}"}</span>)}</div>
      <p className="mt-1 text-xs text-[var(--text-secondary)]">|H| = {z.H.length}, index = {z.index}, and {z.H.length} × {z.index} = {n} (Lagrange).</p>
      <p className="mt-4 text-sm font-bold">S₃ (permutations of 3 objects): left versus right cosets</p>
      <div className="mt-2 flex flex-wrap gap-2">{HS.map((x, i) => <Pill key={i} on={h === i} onClick={() => setH(i)}>H = {"{"}{x.join(", ")}{"}"}</Pill>)}</div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2 font-num text-sm">
        <p className="rounded-2xl bg-[var(--surface)] p-3">Left gH: {s.left.map((c) => `{${c.join(", ")}}`).join("  ")}</p>
        <p className="rounded-2xl bg-[var(--surface)] p-3">Right Hg: {s.right.map((c) => `{${c.join(", ")}}`).join("  ")}</p>
      </div>
      <Banner good={s.normal}>{s.normal ? "Left and right cosets agree: H is a normal subgroup." : "Left and right cosets differ: H is not normal in S₃."}</Banner>
    </Shell>
  );
}
