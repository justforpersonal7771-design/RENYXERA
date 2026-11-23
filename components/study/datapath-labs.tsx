"use client";

/** Computer Organisation labs for arithmetic, the data path and control. Maths lives in lib/study/datapath.ts, checked by scripts/datapath-check.ts. */
import { useMemo, useState, type ReactNode } from "react";
import * as D from "@/lib/study/datapath";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => <button type="button" aria-pressed={on} onClick={onClick} className={on ? "pill-ink" : "pill-soft"}>{children}</button>;
const Stat = ({ label, value }: { label: string; value: ReactNode }) => <p className="min-w-0 break-words rounded-2xl bg-[var(--surface)] p-3 text-sm">{label}<b className="mt-0.5 block font-num text-lg text-[var(--text-primary)]">{value}</b></p>;
const NumField = ({ label, value, set, min = -1e9, max = 1e9, step = 1 }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number; step?: number }) => (
  <label className="block min-w-0 text-sm font-semibold text-[var(--text-secondary)]">{label}
    <input type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(e) => set(Math.min(max, Math.max(min, Number(e.target.value) || 0)))} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" />
  </label>
);

/** Add or subtract two 8-bit numbers and read the carry and overflow flags; then multiply with Booth; then see an IEEE 754 encoding. */
export function AluLab() {
  const [mode, setMode] = useState<"add" | "booth" | "ieee">("add");
  const [a, setA] = useState(100); const [b, setB] = useState(50); const [sub, setSub] = useState(false);
  const [m, setM] = useState(-3); const [q, setQ] = useState(5); const [x, setX] = useState(5.75);
  const n = 8; const fl = D.addFlags(((a % 256) + 256) % 256, ((b % 256) + 256) % 256, n, sub);
  const bt = useMemo(() => D.booth(m, q, 4), [m, q]);
  const ie = D.ieeeEncode(x);
  return (
    <Shell title="ALU lab" note="Flags of an 8-bit adder, Booth multiplication, and the IEEE 754 single-precision fields." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={mode === "add"} onClick={() => setMode("add")}>Add / subtract</Pill><Pill on={mode === "booth"} onClick={() => setMode("booth")}>Booth multiply</Pill><Pill on={mode === "ieee"} onClick={() => setMode("ieee")}>IEEE 754</Pill></div>
      {mode === "add" && (
        <>
          <div className="mt-3 grid gap-3 sm:grid-cols-3"><NumField label="A (−128 … 255)" value={a} set={setA} min={-128} max={255} /><NumField label="B (−128 … 255)" value={b} set={setB} min={-128} max={255} /><div className="text-sm font-semibold text-[var(--text-secondary)]">Operation<div className="mt-1 flex gap-1"><Pill on={!sub} onClick={() => setSub(false)}>A + B</Pill><Pill on={sub} onClick={() => setSub(true)}>A − B</Pill></div></div></div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Result bits" value={D.bin(fl.result, n)} /><Stat label="Signed value" value={fl.signed} /><Stat label="Carry out (C)" value={fl.carry ? 1 : 0} /><Stat label="Signed overflow (V)" value={fl.overflow ? 1 : 0} /></div>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">V = 1 when two numbers of the same sign give a result of the other sign; C = 1 when the unsigned sum does not fit in 8 bits. Subtraction adds the two&apos;s complement of B.</p>
        </>
      )}
      {mode === "booth" && (
        <>
          <div className="mt-3 grid gap-3 sm:grid-cols-2"><NumField label="Multiplicand M (−8 … 7)" value={m} set={(v) => setM(Math.round(v))} min={-8} max={7} /><NumField label="Multiplier Q (−8 … 7)" value={q} set={(v) => setQ(Math.round(v))} min={-8} max={7} /></div>
          <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[22rem] text-left text-sm"><thead><tr className="text-[var(--text-secondary)]"><th className="pr-3 font-semibold">Step</th><th className="pr-3 font-semibold">Action</th><th className="pr-3 font-semibold">A</th><th className="pr-3 font-semibold">Q</th><th className="font-semibold">Q₋₁</th></tr></thead>
            <tbody className="font-num text-[var(--text-primary)]">{bt.rows.map((r) => <tr key={r.step}><td className="pr-3">{r.step}</td><td className="pr-3 font-sans">{r.op}</td><td className="pr-3">{r.A}</td><td className="pr-3">{r.Q}</td><td>{r.q1}</td></tr>)}</tbody></table></div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Product (A:Q, signed)" value={bt.product} /><Stat label="Check" value={`${m} × ${q} = ${m * q}`} /></div>
        </>
      )}
      {mode === "ieee" && (
        <>
          <div className="mt-3 max-w-xs"><NumField label="Decimal number" value={x} set={setX} step={0.25} /></div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Sign" value={ie.sign} /><Stat label="Exponent (biased 127)" value={`${ie.expBits} = ${ie.exp}`} /><Stat label="Hex" value={ie.hex} /><Stat label="Kind" value={ie.kind} /></div>
          <p className="mt-2 break-all font-num text-sm text-[var(--text-primary)]">Fraction: {ie.frac}</p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Value = (−1)^sign × 1.fraction × 2^(exponent − 127) for a normal number.</p>
        </>
      )}
    </Shell>
  );
}

const ST = [200, 100, 200, 200, 100];
const NAMES = ["Fetch", "Register read", "ALU", "Memory", "Register write"];
const CLASSES = [{ name: "R-type", stages: [0, 1, 2, 4], cycles: 4 }, { name: "Load", stages: [0, 1, 2, 3, 4], cycles: 5 }, { name: "Store", stages: [0, 1, 2, 3], cycles: 4 }, { name: "Branch", stages: [0, 1, 2], cycles: 3 }];
/** Set the instruction mix and the stage delays; compare the single-cycle clock with the multi-cycle one. */
export function CycleLab() {
  const [mix, setMix] = useState([40, 30, 10, 20]); const [d, setD] = useState(ST);
  const sum = mix.reduce((s, v) => s + v, 0) || 1;
  const r = D.cycleTimes(CLASSES.map((c, i) => ({ ...c, freq: mix[i] / sum })), d);
  return (
    <Shell title="Single-cycle against multi-cycle lab" note="One long clock for every instruction, or a short clock and a different number of cycles each." tint="sky">
      <div className="mt-3 grid gap-3 sm:grid-cols-5">{NAMES.map((nm, i) => <NumField key={nm} label={`${nm} (ps)`} value={d[i]} set={(v) => setD(d.map((x, j) => (j === i ? v : x)))} min={10} max={2000} />)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">{CLASSES.map((c, i) => <NumField key={c.name} label={`${c.name} share (%)`} value={mix[i]} set={(v) => setMix(mix.map((x, j) => (j === i ? v : x)))} min={0} max={100} />)}</div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-4" aria-label="Path delay of each class">{CLASSES.map((c, i) => <li key={c.name} className="rounded-2xl bg-[var(--surface)] p-3 text-sm">{c.name}<b className="mt-0.5 block font-num text-lg text-[var(--text-primary)]">{r.paths[i]} ps</b><span className="text-xs text-[var(--text-secondary)]">{c.cycles} cycles</span></li>)}</ul>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Single-cycle clock" value={`${r.single} ps`} /><Stat label="Multi-cycle clock" value={`${r.multi} ps`} /><Stat label="Multi-cycle CPI" value={r.cpi.toFixed(2)} /><Stat label="Multi-cycle time / instruction" value={`${Math.round(r.multiPerInstr)} ps`} /></div>
      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{r.single <= r.multiPerInstr ? "The single-cycle machine is faster for this mix: its one clock is shorter than the multi-cycle average." : "The multi-cycle machine is faster for this mix."} Single-cycle time per instruction is the clock, {r.single} ps.</p>
    </Shell>
  );
}

/** Size a control store: horizontal (one bit per signal) against vertical (encoded groups). */
export function MicroLab() {
  const [words, setWords] = useState(256); const [next, setNext] = useState(8); const [g, setG] = useState([8, 4, 16, 3]);
  const c = D.controlStore(words, g, next);
  return (
    <Shell title="Control store lab" note="Each group is a set of mutually exclusive control signals (including 'none'). Encoding a group saves bits but needs a decoder." tint="mint">
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><NumField label="Microinstructions (control store words)" value={words} set={(v) => setWords(Math.round(v))} min={2} max={65536} /><NumField label="Next-address field (bits)" value={next} set={(v) => setNext(Math.round(v))} min={0} max={32} /></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">{g.map((n, i) => <NumField key={i} label={`Group ${i + 1}: signals`} value={n} set={(v) => setG(g.map((x, j) => (j === i ? Math.round(v) : x)))} min={1} max={256} />)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Horizontal word" value={`${c.horizontalWidth} bits`} /><Stat label="Vertical word" value={`${c.verticalWidth} bits`} /><Stat label="Micro-address bits" value={c.addrBits} /><Stat label="Horizontal store" value={`${c.horizontalBits.toLocaleString("en-IN")} bits`} /><Stat label="Vertical store" value={`${c.verticalBits.toLocaleString("en-IN")} bits`} /><Stat label="Saving" value={`${Math.round((1 - c.verticalBits / c.horizontalBits) * 100)}%`} /></div>
    </Shell>
  );
}
