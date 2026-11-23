"use client";

/** Computer Organisation labs for the instruction set (opcode budget, addressing modes, stack code). Maths lives in lib/study/isa.ts, checked by scripts/isa-check.ts. */
import { useMemo, useState, type ReactNode } from "react";
import * as I from "@/lib/study/isa";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Stat = ({ label, value }: { label: string; value: ReactNode }) => <p className="min-w-0 break-words rounded-2xl bg-[var(--surface)] p-3 text-sm">{label}<b className="mt-0.5 block font-num text-lg text-[var(--text-primary)]">{value}</b></p>;
const NumField = ({ label, value, set, min = 0, max = 1e9 }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number }) => (
  <label className="block min-w-0 text-sm font-semibold text-[var(--text-secondary)]">{label}
    <input type="number" inputMode="numeric" value={value} min={min} max={max} onChange={(e) => set(Math.min(max, Math.max(min, Math.round(Number(e.target.value)) || 0)))} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" />
  </label>
);

/** Plan an expanding-opcode instruction set and see how many codes are left at each level. */
export function OpcodeLab() {
  const [op, setOp] = useState(4); const [ab, setAb] = useState(4); const [c3, setC3] = useState(14); const [c2, setC2] = useState(30); const [c1, setC1] = useState(31);
  const r = useMemo(() => I.expandOpcode(op, ab, [c3, c2, c1]), [op, ab, c3, c2, c1]);
  const rows = [{ name: "3 operand fields", total: 2 ** op, used: c3 }, { name: "2 operand fields", total: r.left[0], used: c2 }, { name: "1 operand field", total: r.left[1], used: c1 }, { name: "no operand field", total: r.left[2], used: 0 }];
  return (
    <Shell title="Expanding opcode lab" note={`A ${op + 3 * ab}-bit instruction: ${op}-bit opcode, three ${ab}-bit operand fields. Spare codes of one level become the prefix of the next.`} tint="butter">
      <div className="mt-3 grid gap-3 sm:grid-cols-5">
        <NumField label="Opcode bits" value={op} set={setOp} min={1} max={8} /><NumField label="Operand field bits" value={ab} set={setAb} min={1} max={8} />
        <NumField label="3-field instructions" value={c3} set={setC3} max={256} /><NumField label="2-field instructions" value={c2} set={setC2} max={4096} /><NumField label="1-field instructions" value={c1} set={setC1} max={65536} />
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-4" aria-label="Codes at each level">
        {rows.map((x, i) => <li key={i} className="rounded-2xl bg-[var(--surface)] p-3 text-sm">{x.name}<b className="mt-0.5 block font-num text-lg text-[var(--text-primary)]">{x.used} of {x.total}</b><span className="text-xs text-[var(--text-secondary)]">{i < 3 ? `${Math.max(0, x.total - x.used)} spare` : "left for zero-operand"}</span></li>)}
      </ul>
      <p className={`mt-3 text-sm font-semibold ${r.ok ? "text-[var(--text-primary)]" : "text-rose-700 dark:text-rose-300"}`}>{r.ok ? "This plan fits in the instruction word." : "This plan does not fit: a level asks for more codes than the previous level left."}</p>
    </Shell>
  );
}

const MODES = Object.keys(I.MODE_NAMES) as I.AMode[];
const MEM: I.Mem = { 100: 500, 500: 700, 600: 900, 4100: 33, 499: 55 };
/** Pick an addressing mode and see the effective address, the operand and the memory references. */
export function ModeLab() {
  const [mode, setMode] = useState<I.AMode>("indirect"); const [a, setA] = useState(100); const [r, setR] = useState(500); const [pc, setPc] = useState(4000);
  const e = I.effective(mode, a, r, pc, MEM);
  return (
    <Shell title="Addressing mode lab" note="The instruction holds a field A; register R and the PC are set below. Memory holds a few values." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{MODES.map((m) => <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={mode === m ? "pill-ink" : "pill-soft"}>{I.MODE_NAMES[m]}</button>)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3"><NumField label="Field A in the instruction" value={a} set={setA} max={100000} /><NumField label="Register R" value={r} set={setR} max={100000} /><NumField label="PC (next instruction)" value={pc} set={setPc} max={100000} /></div>
      <p className="mt-3 text-xs text-[var(--text-secondary)]">Memory: {Object.entries(MEM).map(([k, v]) => `M[${k}] = ${v}`).join(", ")}; every other cell is 0.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Effective address" value={e.ea === null ? "none" : e.ea} /><Stat label="Operand" value={e.operand} /><Stat label="Operand memory references" value={e.refs} /><Stat label="R afterwards" value={e.newR} /></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Add 1 for the instruction fetch to get the total memory references of the instruction.</p>
    </Shell>
  );
}

/** Type an expression, see its postfix form and watch the stack machine run it. */
export function StackLab() {
  const [src, setSrc] = useState("(A+B)*(C+D)"); const [vals, setVals] = useState({ A: 2, B: 3, C: 4, D: 5 });
  const clean = src.replace(/\s+/g, "");
  const pf = I.toPostfix(clean);
  const names = Array.from(new Set((clean.match(/[A-Za-z]\w*/g) ?? []).slice(0, 6)));
  const run = pf ? I.runPostfix(pf, vals as Record<string, number>) : null;
  const cnt = pf ? I.codeCounts(pf) : null;
  return (
    <Shell title="Stack machine lab" note="Infix to postfix, then run on a stack: operands are pushed, an operator pops two and pushes one." tint="mint">
      <label className="mt-3 block max-w-md text-sm font-semibold text-[var(--text-secondary)]">Expression (letters, numbers, + - * / and brackets)
        <input value={src} onChange={(e) => setSrc(e.target.value.slice(0, 40))} spellCheck={false} autoComplete="off" className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" /></label>
      {!pf || !run ? <p className="mt-3 text-sm font-semibold text-rose-700 dark:text-rose-300">That is not a complete expression. Check the brackets and that every operator has two operands.</p> : (
        <>
          <div className="mt-3 flex flex-wrap gap-3">{names.map((n) => <label key={n} className="text-sm font-semibold text-[var(--text-secondary)]">{n} = <input type="number" value={(vals as Record<string, number>)[n] ?? 0} onChange={(e) => setVals({ ...vals, [n]: Number(e.target.value) || 0 })} className="h-9 w-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 font-num text-[var(--text-primary)]" /></label>)}</div>
          <p className="mt-3 font-num text-sm text-[var(--text-primary)]">Postfix: {pf.join(" ")}</p>
          <ol className="mt-2 flex flex-wrap gap-1.5" aria-label="Stack steps">{run.steps.map((s, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-2.5 py-1.5 text-center font-num text-sm"><b>{s.action}</b><span className="block text-[11px] font-sans">[{s.stack.join(", ")}]</span></li>)}</ol>
          <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Result" value={Number.isInteger(run.result) ? run.result : run.result.toFixed(3)} /><Stat label="Deepest stack" value={run.maxDepth} /><Stat label="3-address instructions" value={cnt?.threeAddress ?? 0} /><Stat label="Stack instructions (with POP)" value={cnt?.stack ?? 0} /></div>
        </>
      )}
    </Shell>
  );
}
