"use client";

/** Computer Organisation labs for pipelining. All maths lives in lib/study/pipeline.ts, checked by scripts/pipeline-check.ts. */
import { useMemo, useState, type ReactNode } from "react";
import * as P from "@/lib/study/pipeline";

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
const NumField = ({ label, value, set, min = 0, max = 1e9, step = 1 }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number; step?: number }) => (
  <label className="block min-w-0 text-sm font-semibold text-[var(--text-secondary)]">{label}
    <input type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(e) => set(Math.min(max, Math.max(min, Number(e.target.value) || 0)))} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" />
  </label>
);
const STAGE_TINT: Record<string, string> = { IF: "sky", ID: "mint", EX: "butter", MEM: "peach", WB: "lilac" };

/** Stage delays and the number of instructions: the real clock, the real speed-up and the ideal one. */
export function PipeLab() {
  const [d, setD] = useState([250, 400, 350, 500, 200]); const [latch, setLatch] = useState(20); const [n, setN] = useState(1000);
  const t = P.pipeTimes(d, latch, Math.max(1, n));
  const names = ["IF", "ID", "EX", "MEM", "WB"];
  return (
    <Shell title="Pipeline timing lab" note="The clock must fit the slowest stage plus the latch; the speed-up is the time without a pipeline over the time with one." tint="sky">
      <div className="mt-3 grid gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {names.map((s, i) => <NumField key={s} label={`${s} (ps)`} value={d[i]} set={(v) => setD(d.map((x, j) => (j === i ? v : x)))} min={1} max={5000} />)}
        <NumField label="Latch (ps)" value={latch} set={setLatch} max={500} /><NumField label="Instructions" value={n} set={(v) => setN(Math.round(v))} min={1} max={1e7} />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Clock (max stage + latch)" value={`${t.clock} ps`} /><Stat label="Without pipeline" value={`${t.nonPipe.toLocaleString("en-IN")} ps`} /><Stat label="With pipeline" value={`${t.pipe.toLocaleString("en-IN")} ps`} />
        <Stat label="Speed-up" value={`${t.speedup.toFixed(2)}×`} /><Stat label="Limit as n grows" value={`${t.ideal.toFixed(2)}×`} /><Stat label="One instruction takes" value={`${t.latency} ps`} />
      </div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Cycles = k + n − 1 = {P.pipelineCycles(Math.max(1, n), 5).toLocaleString("en-IN")}. The speed-up can never reach the number of stages: unequal stages and the latch waste time, and the first instruction still takes k cycles.</p>
    </Shell>
  );
}

const PRESETS: { id: string; label: string; lines: string }[] = [
  { id: "raw", label: "Four readers of R1", lines: "ADD R1,R2,R3\nSUB R4,R1,R5\nAND R6,R1,R7\nOR R8,R1,R9" },
  { id: "lu", label: "Load then use", lines: "LW R1,0(R2)\nADD R3,R1,R4\nSUB R5,R3,R6" },
  { id: "br", label: "Taken branch", lines: "BEQ R1,R2 taken\nADD R3,R4,R5\nSUB R6,R7,R8" },
  { id: "ind", label: "No dependences", lines: "ADD R1,R2,R3\nADD R4,R5,R6\nADD R7,R8,R9" },
];
/** Type a short program and see every instruction's stage in every cycle, with the stalls, with and without forwarding. */
export function HazardLab() {
  const [text, setText] = useState(PRESETS[0].lines); const [fwd, setFwd] = useState(false); const [pen, setPen] = useState(2);
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 10);
  const parsed = lines.map((l) => P.parseInstr(l)); const bad = parsed.findIndex((x) => !x);
  const sch = useMemo(() => (bad === -1 && parsed.length ? P.schedule(parsed as P.Instr[], { forwarding: fwd, branchPenalty: pen }) : null), [text, fwd, pen]); // eslint-disable-line react-hooks/exhaustive-deps
  const cols = sch ? Math.min(sch.cycles, 26) : 0;
  return (
    <Shell title="Hazard lab" note="Write instructions, one a line: ADD R1,R2,R3 · LW R1,0(R2) · SW R1,0(R2) · BEQ R1,R2 taken." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{PRESETS.map((p) => <Pill key={p.id} on={text === p.lines} onClick={() => setText(p.lines)}>{p.label}</Pill>)}</div>
      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <div>
          <label className="block text-sm font-semibold text-[var(--text-secondary)]">Program (up to 10 lines)<textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} spellCheck={false} className="mt-1 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 font-num text-sm text-[var(--text-primary)]" /></label>
          <div className="mt-2 flex flex-wrap items-center gap-2"><Pill on={!fwd} onClick={() => setFwd(false)}>No forwarding</Pill><Pill on={fwd} onClick={() => setFwd(true)}>Forwarding</Pill></div>
          <label className="mt-2 flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">Taken-branch penalty<input type="number" min={0} max={5} value={pen} onChange={(e) => setPen(Math.min(5, Math.max(0, Number(e.target.value) || 0)))} className="h-9 w-16 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 font-num text-[var(--text-primary)]" /> cycles</label>
        </div>
        <div className="min-w-0 overflow-x-auto">
          {bad !== -1 ? <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Line {bad + 1} is not understood. Use ADD, SUB, AND, OR, LW, SW or BEQ with registers R0 to R31.</p> : sch && (
            <table className="w-full border-separate border-spacing-1 text-center text-xs" aria-label="Pipeline diagram">
              <thead><tr><th className="pr-2 text-left font-semibold text-[var(--text-secondary)]">Instruction</th>{Array.from({ length: cols }, (_, c) => <th key={c} className="font-num font-semibold text-[var(--text-secondary)]">{c + 1}</th>)}</tr></thead>
              <tbody>{sch.rows.map((r, i) => (
                <tr key={i}><td className="whitespace-nowrap pr-2 text-left font-num text-[var(--text-primary)]">{r.text}</td>
                  {Array.from({ length: cols }, (_, c) => { const cy = c + 1; const st = cy === r.IF ? "IF" : cy === r.ID ? "ID" : cy === r.EX ? "EX" : cy === r.MEM ? "MEM" : cy === r.WB ? "WB" : null; const stall = !st && cy > r.IF && cy < r.ID;
                    return <td key={c} className="h-7 min-w-[2rem] rounded-md font-bold" style={st ? { background: `var(--tint-${STAGE_TINT[st]})`, color: `var(--tint-${STAGE_TINT[st]}-ink)` } : stall ? { background: "var(--tint-rose)", color: "var(--tint-rose-ink)" } : undefined}>{st ?? (stall ? "stall" : "")}</td>; })}</tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
      {sch && <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Total cycles" value={sch.cycles} /><Stat label="Data stall cycles" value={sch.stalls} /><Stat label="Branch flush cycles" value={sch.flush} /><Stat label="Cycles per instruction (includes filling)" value={(sch.cycles / parsed.length).toFixed(2)} /></div>}
      <p className="mt-2 text-xs text-[var(--text-secondary)]">With no stalls n instructions take n + 4 cycles. The register file writes in the first half of a cycle and reads in the second, so a reader may be in ID in the same cycle as the writer&apos;s WB.</p>
    </Shell>
  );
}

/** CPI of a pipeline from its hazards, and what that does to the speed-up. */
export function CpiLab() {
  const [k, setK] = useState(5); const [bf, setBf] = useState(20); const [bc, setBc] = useState(50); const [bp, setBp] = useState(3); const [lf, setLf] = useState(25); const [ld, setLd] = useState(40);
  const sb = P.branchStalls(bf / 100, bc / 100, bp), sl = P.loadUseStalls(lf / 100, ld / 100), cpi = P.cpiWith(sb, sl);
  return (
    <Shell title="Pipeline CPI lab" note="Stall cycles per instruction add to the ideal CPI of 1." tint="mint">
      <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <NumField label="Stages (k)" value={k} set={setK} min={2} max={30} /><NumField label="Branches (%)" value={bf} set={setBf} max={100} /><NumField label="Branches that cost the penalty (%)" value={bc} set={setBc} max={100} />
        <NumField label="Branch penalty (cycles)" value={bp} set={setBp} max={20} /><NumField label="Loads (%)" value={lf} set={setLf} max={100} /><NumField label="Loads used at once (%)" value={ld} set={setLd} max={100} />
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Branch stalls / instruction" value={sb.toFixed(2)} /><Stat label="Load-use stalls / instruction" value={sl.toFixed(2)} /><Stat label="CPI" value={cpi.toFixed(2)} /><Stat label={`Speed-up over ${k} cycles each`} value={`${P.pipelineSpeedup(k, cpi).toFixed(2)}×`} /></div>
    </Shell>
  );
}
