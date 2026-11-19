"use client";

/** Algorithms labs (batch 1: asymptotics, sorting, hashing, divide and conquer). Logic in lib/study/algo.ts. */
import { useState, type ReactNode } from "react";
import * as E from "@/lib/study/algo";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => <button type="button" aria-pressed={on} onClick={onClick} className={on ? "pill-ink" : "pill-soft"}>{children}</button>;
const Stat = ({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) => <p className="min-w-0 break-words rounded-2xl bg-[var(--surface)] p-3 text-sm">{label}<b className="block font-num text-xl">{value}</b>{sub && <span className="text-xs text-[var(--text-secondary)]">{sub}</span>}</p>;
const Field = ({ label, value, set }: { label: string; value: string; set: (v: string) => void }) => <label className="block min-w-0 text-sm font-bold">{label}<input value={value} onChange={(e) => set(e.target.value)} aria-label={label} spellCheck={false} className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>;
const Step = ({ label, v, set, min, max, step = 1 }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step?: number }) => (
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>{label}</b><button type="button" aria-label={`${label} down`} onClick={() => set(Math.max(min, +(v - step).toFixed(3)))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-12 text-center font-num">{v}</span><button type="button" aria-label={`${label} up`} onClick={() => set(Math.min(max, +(v + step).toFixed(3)))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">+</button></span>
);
const Log = ({ lines }: { lines: string[] }) => <ol className="mt-3 space-y-1 text-sm">{lines.map((l, i) => <li key={i} className="overflow-x-auto rounded-xl bg-[var(--surface)] px-3 py-1.5 font-num">{l}</li>)}</ol>;
const nums = (s: string) => s.split(/[,\s]+/).map(Number).filter((x) => Number.isFinite(x));
const fmt = (v: number) => (v >= 1e9 ? v.toExponential(2) : Number.isInteger(v) ? v.toLocaleString("en-IN") : v.toFixed(2));

/* ------------------------------------------------------------ asymptotics */
export function GrowthLab() {
  const [n, setN] = useState(16); const rows = E.growthAt(n);
  return (
    <Shell title="Growth rate lab" note="Each function at the same n. Watch the ordering hold, and the gaps explode." tint="peri">
      <div className="mt-3"><Step label="n" v={n} set={setN} min={2} max={64} step={2} /></div>
      <ol className="mt-3 space-y-1 text-sm">{rows.map((r) => <li key={r.name} className="flex items-center gap-3 rounded-xl bg-[var(--surface)] px-3 py-1.5"><b className="w-20 shrink-0 font-num">{r.name}</b><span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><span className="block h-full rounded-full bg-[var(--st-accent)]" style={{ width: `${Math.min(100, (Math.log10(r.v + 1) / Math.log10(rows[rows.length - 1].v + 1)) * 100)}%` }} /></span><span className="w-28 shrink-0 text-right font-num">{fmt(r.v)}</span></li>)}</ol>
      <p className="mt-3 text-sm">2ⁿ overtakes n³ for good at n = <b className="font-num">{E.crossover((x) => 2 ** x, (x) => x ** 3)}</b>; n² overtakes 100·n log₂ n at n = <b className="font-num">{E.crossover((x) => x * x, (x) => 100 * x * Math.log2(x))}</b>. Bars use a log scale.</p>
    </Shell>
  );
}
export function RecTreeLab() {
  const [a, setA] = useState(2), [b, setB] = useState(2), [k, setK] = useState(1); const r = E.recTree(a, b, k, 64);
  return (
    <Shell title="Recursion tree lab" note="T(n) = a·T(n/b) + n^k with n = 64. Work per level = nodes × (size)^k." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="a" v={a} set={setA} min={1} max={8} /><Step label="b" v={b} set={setB} min={2} max={4} /><Step label="k" v={k} set={setK} min={0} max={3} /></div>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[280px] border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>Level</th><th>Nodes</th><th>Size</th><th>Work</th></tr></thead><tbody>{r.levels.map((l) => <tr key={l.i}>{[l.i, l.nodes, +l.size.toFixed(3), fmt(l.work)].map((v, c) => <td key={c} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num">{v}</td>)}</tr>)}</tbody></table></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Total work" value={fmt(r.total)} /><Stat label="Ratio a / b^k" value={+r.ratio.toFixed(3)} sub={r.ratio < 1 ? "shrinks: root dominates" : r.ratio === 1 ? "equal levels: × log n" : "grows: leaves dominate"} /></div>
    </Shell>
  );
}
export function MasterLab2() {
  const [a, setA] = useState(2), [b, setB] = useState(2), [k, setK] = useState(1), [p, setP] = useState(0); const r = E.master(a, b, k, p);
  return (
    <Shell title="Master theorem lab" note="T(n) = a·T(n/b) + Θ(n^k · log^p n). Compare k with log_b a." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="a" v={a} set={setA} min={1} max={16} /><Step label="b" v={b} set={setB} min={2} max={8} /><Step label="k" v={k} set={setK} min={0} max={4} step={0.5} /><Step label="p" v={p} set={setP} min={-2} max={3} /></div>
      <div className="mt-2 flex flex-wrap gap-2">{[["Merge sort", 2, 2, 1, 0], ["Binary search", 1, 2, 0, 0], ["Strassen", 7, 2, 2, 0], ["8T(n/2)+n²", 8, 2, 2, 0], ["3T(n/4)+n", 3, 4, 1, 0]].map(([n, A, B, K, P]) => <Pill key={n as string} on={a === A && b === B && k === K && p === P} onClick={() => { setA(A as number); setB(B as number); setK(K as number); setP(P as number); }}>{n}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="log_b a" value={+r.c.toFixed(3)} /><Stat label="Case" value={r.kase} /><Stat label="T(n)" value={r.result} /></div>
      <p className="mt-2 text-sm">{r.why}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ sorting */
export function ElemSortLab() {
  const [src, setSrc] = useState("5 2 4 6 1 3"), [alg, setAlg] = useState<E.Elem>("insertion"); const r = E.elemSort(nums(src), alg);
  return (
    <Shell title="Elementary sorts lab" note="Bubble (with early exit), selection and insertion on the same input." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{(["bubble", "selection", "insertion"] as const).map((x) => <Pill key={x} on={alg === x} onClick={() => setAlg(x)}>{x}</Pill>)}</div>
      <div className="mt-3"><Field label="Array" value={src} set={setSrc} /></div>
      <Log lines={r.passes.map((p, i) => `pass ${i + 1}: ${p}`)} />
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Comparisons" value={r.comps} /><Stat label={alg === "insertion" ? "Shifts" : "Swaps"} value={r.swaps} /><Stat label="Inversions in input" value={r.inv} /></div>
    </Shell>
  );
}
export function MergeLab() {
  const [src, setSrc] = useState("38 27 43 3 9 82 10"); const r = E.mergeSort(nums(src));
  return (
    <Shell title="Merge sort lab" note="Bottom-up view of the merges, with comparisons and inversions counted while merging." tint="sky">
      <div className="mt-3"><Field label="Array" value={src} set={setSrc} /></div>
      <Log lines={r.levels} />
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Comparisons" value={r.comps} /><Stat label="Inversions" value={r.inv} /><Stat label="Sorted" value={r.sorted.join(" ")} /></div>
    </Shell>
  );
}
export function QuickLab() {
  const [src, setSrc] = useState("2 8 7 1 3 5 6 4"); const r = E.quickSort(nums(src));
  return (
    <Shell title="Quicksort lab" note="Lomuto partition with the last element as pivot." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{[["CLRS example", "2 8 7 1 3 5 6 4"], ["Sorted (worst)", "1 2 3 4 5 6"], ["All equal", "5 5 5 5 5"]].map(([n, v]) => <Pill key={n} on={src === v} onClick={() => setSrc(v)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Array" value={src} set={setSrc} /></div>
      <Log lines={r.log} />
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Comparisons" value={r.comps} sub={`n(n−1)/2 = ${(nums(src).length * (nums(src).length - 1)) / 2}`} /><Stat label="Swaps" value={r.swaps} /><Stat label="Recursion depth" value={r.depth} /></div>
    </Shell>
  );
}
export function SortCmpLab() {
  const [n, setN] = useState(12);
  const rows: [string, string, string, string, string][] = [["Insertion", "n", "n²", "O(1)", "yes"], ["Selection", "n²", "n²", "O(1)", "no"], ["Bubble", "n", "n²", "O(1)", "yes"], ["Merge", "n log n", "n log n", "O(n)", "yes"], ["Quick", "n log n", "n²", "O(log n)", "no"], ["Heap", "n log n", "n log n", "O(1)", "no"], ["Counting", "n + k", "n + k", "O(n + k)", "yes"]];
  return (
    <Shell title="Sorting comparison lab" note="Best and worst comparisons, extra space, stability, and the decision-tree lower bound." tint="butter">
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[320px] border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>Sort</th><th>Best</th><th>Worst</th><th>Space</th><th>Stable</th></tr></thead><tbody>{rows.map((r) => <tr key={r[0]}>{r.map((v, c) => <td key={c} className="rounded-lg bg-[var(--surface)] px-2 py-1">{v}</td>)}</tr>)}</tbody></table></div>
      <div className="mt-3 flex flex-wrap items-center gap-2"><Step label="n" v={n} set={setN} min={2} max={20} /><span className="text-sm">Any comparison sort needs at least ⌈log₂ n!⌉ = <b className="font-num">{E.minCompares(n)}</b> comparisons in the worst case.</span></div>
    </Shell>
  );
}
export function RadixLab() {
  const [src, setSrc] = useState("170 45 75 90 802 24 2 66"); const r = E.radix(nums(src).filter((x) => x >= 0).map(Math.floor));
  const c = E.countingSort([2, 5, 3, 0, 2, 3, 0, 3], 5);
  return (
    <Shell title="Radix and counting sort lab" note="LSD radix sort: one stable bucket pass per digit, least significant first." tint="mint">
      <div className="mt-3"><Field label="Non-negative integers" value={src} set={setSrc} /></div>
      <Log lines={r.passes.map((p, i) => `digit ${i + 1}: ${p}`)} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Passes (digits)" value={r.digits} /><Stat label="Counting sort of 2 5 3 0 2 3 0 3" value={c.sorted.join(" ")} sub={`counts of 0…5: ${c.counts.join(" ")}`} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ hashing */
export function ChainLab() {
  const [src, setSrc] = useState("15 11 27 8 12 33 19 25 4"), [m, setM] = useState(7); const r = E.chaining(nums(src).map(Math.floor), m);
  return (
    <Shell title="Separate chaining lab" note="h(k) = k mod m; colliding keys share a list (appended at the end)." tint="sky">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Keys" value={src} set={setSrc} /><Step label="m" v={m} set={setM} min={2} max={13} /></div>
      <ol className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{r.table.map((c, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1 font-num">{i}: {c.join(" → ") || "—"}</li>)}</ol>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Load factor α" value={r.alpha.toFixed(2)} /><Stat label="Longest chain" value={r.longest} /><Stat label="Avg probes, successful" value={r.avgSuccess.toFixed(2)} sub={`theory 1 + α/2 = ${(1 + r.alpha / 2).toFixed(2)}`} /></div>
    </Shell>
  );
}
export function OpenAddrLab() {
  const [src, setSrc] = useState("76 93 40 47 10 55"), [m, setM] = useState(7), [p, setP] = useState<E.Probe>("linear"); const r = E.openAddr(nums(src).map(Math.floor), m, p);
  return (
    <Shell title="Open addressing lab" note="Linear (h + i), quadratic (h + i²), double hashing (h + i·h₂), h = k mod m, h₂ = 7 − (k mod 7)." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{(["linear", "quadratic", "double"] as const).map((x) => <Pill key={x} on={p === x} onClick={() => setP(x)}>{x}</Pill>)}<Pill on={src === "12 18 13 2 3 23 5 15" && m === 10} onClick={() => { setSrc("12 18 13 2 3 23 5 15"); setM(10); }}>GATE 2010 keys</Pill></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Keys in order" value={src} set={setSrc} /><Step label="m" v={m} set={setM} min={3} max={13} /></div>
      <div className="mt-3 flex flex-wrap gap-1">{r.table.map((x, i) => <span key={i} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num text-sm">{i}: {x ?? "·"}</span>)}</div>
      <Log lines={r.log.map((l) => `${l.k}: ${l.probes} probe${l.probes > 1 ? "s" : ""} → ${l.slot ?? "no free slot"}`)} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Total probes" value={r.total} /><Stat label="Keys not placed" value={r.failed} /></div>
    </Shell>
  );
}
export function ProbesLab() {
  const [a, setA] = useState(0.5), [n, setN] = useState(23), [m, setM] = useState(365); const r = E.expected(a);
  return (
    <Shell title="Expected probes lab" note="Average probes for successful (S) and unsuccessful (U) search at load factor α." tint="peach">
      <div className="mt-3"><Step label="α" v={a} set={setA} min={0.1} max={0.95} step={0.05} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Chaining" value={`${r.chainS.toFixed(2)} / ${r.chainU.toFixed(2)}`} sub="1 + α/2 · 1 + α" /><Stat label="Linear probing" value={`${r.linS.toFixed(2)} / ${r.linU.toFixed(2)}`} sub="½(1 + 1/(1−α)) · ½(1 + 1/(1−α)²)" /><Stat label="Uniform hashing" value={`${r.uniS.toFixed(2)} / ${r.uniU.toFixed(2)}`} sub="(1/α)ln(1/(1−α)) · 1/(1−α)" /></div>
      <div className="mt-4 flex flex-wrap gap-2"><Step label="keys" v={n} set={setN} min={2} max={100} /><Step label="slots" v={m} set={setM} min={10} max={1000} step={5} /></div>
      <p className="mt-2 text-sm">Chance of at least one collision: <b className="font-num">{(E.birthday(n, m) * 100).toFixed(1)}%</b> (birthday problem).</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ divide and conquer */
export function MaxMinLab() {
  const [src, setSrc] = useState("3 9 1 7 5 8 2 6"); const a = nums(src); const r = a.length ? E.maxMin(a) : null; const s = a.length > 1 ? E.secondLargest(a) : null;
  return (
    <Shell title="Max, min and second largest lab" note="Compare in pairs; run a knock-out tournament for the runner-up." tint="rose">
      <div className="mt-3"><Field label="Array" value={src} set={setSrc} /></div>
      {r && <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Max, min" value={`${r.max}, ${r.min}`} /><Stat label="Pairwise comparisons" value={r.comps} sub={`⌈3n/2⌉ − 2 = ${r.formula}`} /><Stat label="Naive" value={r.naive} sub="2(n − 1)" /></div>}
      {s && <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Second largest" value={s.second} sub={`beat by the champion: ${s.beaten.join(", ")}`} /><Stat label="Tournament comparisons" value={s.comps} sub={`n + ⌈log₂ n⌉ − 2 = ${s.formula}`} /></div>}
    </Shell>
  );
}
export function MultLab() {
  const [p, setP] = useState(3); const n = 2 ** p; const r = E.mult(n);
  return (
    <Shell title="Fast multiplication lab" note="Strassen: 7 half-size products instead of 8. Karatsuba: 3 half-size products instead of 4." tint="butter">
      <div className="mt-3"><Step label="n = 2^p, p" v={p} set={setP} min={1} max={10} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label={`Matrix ${n}×${n}: naive scalar mults`} value={fmt(r.naiveMat)} sub="n³" /><Stat label="Strassen scalar mults" value={fmt(r.strassen)} sub="7^log₂ n = n^2.807" /><Stat label={`${n}-digit numbers: schoolbook`} value={fmt(r.naiveDigits)} sub="n² digit products" /><Stat label="Karatsuba" value={fmt(r.karatsuba)} sub="3^log₂ n = n^1.585" /></div>
    </Shell>
  );
}
export function SelectLab() {
  const [src, setSrc] = useState("7 10 4 3 20 15"), [k, setK] = useState(3); const a = nums(src); const r = E.quickselect(a, Math.min(k, a.length)); const mm = E.medianOfMedians([12, 3, 5, 7, 4, 19, 26, 23, 1, 8, 15, 2, 14, 9, 30]);
  return (
    <Shell title="Selection lab" note="Quickselect partitions like quicksort but recurses into one side only." tint="peri">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Array" value={src} set={setSrc} /><Step label="k" v={k} set={setK} min={1} max={Math.max(1, a.length)} /></div>
      <Log lines={r.log} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label={`${k}-th smallest`} value={r.value ?? "—"} /><Stat label="Comparisons" value={r.comps} /></div>
      <p className="mt-3 text-sm">Median of medians on 15 keys: group medians {mm.meds.join(", ")} → pivot <b className="font-num">{mm.pivot}</b>, guaranteed to beat at least {mm.guaranteed} keys on each side, so the recursion shrinks by a constant fraction.</p>
    </Shell>
  );
}
