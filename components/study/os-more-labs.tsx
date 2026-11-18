"use client";

/** OS labs so every topic has its own: round-robin quantum sweep, page-fault access time, working set. Numbers checked by script. */
import { useState, type ReactNode } from "react";
import { schedule, type Job } from "@/lib/study/scheduling";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
function R({ label, v, set, min, max, step = 1, unit }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step?: number; unit: string }) {
  return <label className="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5 text-sm"><b>{label}</b><input type="range" min={min} max={max} step={step} value={v} onChange={(e) => set(Number(e.target.value))} aria-label={label} className="min-w-0 flex-1 accent-[var(--tint-ink)]" /><span className="font-num">{v.toLocaleString("en-IN")} {unit}</span></label>;
}

/* ------------------------------------------------------------ round-robin quantum sweep */
export const RR_JOBS: Job[] = [{ id: "P1", arrival: 0, burst: 5 }, { id: "P2", arrival: 1, burst: 3 }, { id: "P3", arrival: 2, burst: 1 }, { id: "P4", arrival: 4, burst: 2 }];
export function rrSweep(jobs: Job[], qs: number[]) { return qs.map((q) => { const r = schedule(jobs, "RR", q); return { q, wt: r.avgWt, tat: r.avgTat, sw: r.switches }; }); }
export function RrLab() {
  const [q, setQ] = useState(2);
  const rows = rrSweep(RR_JOBS, [1, 2, 3, 4, 5]); const srtf = schedule(RR_JOBS, "SRTF"), fcfs = schedule(RR_JOBS, "FCFS");
  const cur = schedule(RR_JOBS, "RR", q); const end = cur.gantt[cur.gantt.length - 1].end;
  const cell = "rounded-lg bg-[var(--surface)] px-2 py-1";
  return (
    <Shell title="Round-robin quantum lab" note="Same four jobs; change the time slice and watch waiting time and context switches trade off." tint="mint">
      <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-sm font-bold">Quantum</span>{[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" aria-pressed={q === n} onClick={() => setQ(n)} className={q === n ? "pill-ink" : "pill-soft"}>{n}</button>)}</div>
      <div className="mt-3 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3"><div className="relative h-9 min-w-[420px] rounded bg-[var(--surface-secondary)]">{cur.gantt.map((g, i) => <span key={i} className="absolute top-0 grid h-9 place-items-center border-r border-[var(--surface)] bg-[var(--tint-ink)] text-xs font-bold text-[var(--surface)]" style={{ left: `${(g.start / end) * 100}%`, width: `${((g.end - g.start) / end) * 100}%` }}>{g.id ?? "–"}</span>)}</div><p className="mt-1 font-num text-xs text-[var(--text-secondary)]">{cur.gantt.map((g) => `${g.id ?? "idle"} ${g.start}–${g.end}`).join(" · ")}</p></div>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[360px] border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>Policy</th><th>Avg waiting</th><th>Avg turnaround</th><th>Switches</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.q} className={`font-num ${r.q === q ? "font-bold" : ""}`}><td className={`rounded-lg px-2 py-1 font-sans ${r.q === q ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>RR, q = {r.q}</td><td className={cell}>{r.wt}</td><td className={cell}>{r.tat}</td><td className={cell}>{r.sw}</td></tr>)}
          <tr className="font-num"><td className={`${cell} font-sans`}>SRTF</td><td className={cell}>{srtf.avgWt}</td><td className={cell}>{srtf.avgTat}</td><td className={cell}>{srtf.switches}</td></tr>
          <tr className="font-num"><td className={`${cell} font-sans`}>FCFS</td><td className={cell}>{fcfs.avgWt}</td><td className={cell}>{fcfs.avgTat}</td><td className={cell}>{fcfs.switches}</td></tr></tbody></table></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Jobs: P1 (0, 5), P2 (1, 3), P3 (2, 1), P4 (4, 2). A tiny quantum means many switches; a huge one turns round robin into FCFS.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ page-fault effective access time */
export function eatPf(memNs: number, faultMs: number, oneIn: number, dirtyPct = 0) { const p = 1 / oneIn; const service = faultMs * 1e6 * (1 + dirtyPct / 100); return { p, service, eat: (1 - p) * memNs + p * service }; }
export function maxFaultRate(memNs: number, faultMs: number, slowPct: number) { const limit = memNs * (1 + slowPct / 100); return (limit - memNs) / (faultMs * 1e6 - memNs); }
export function PageFaultLab() {
  const [mem, setMem] = useState(100), [fault, setFault] = useState(8), [oneIn, setOneIn] = useState(1000), [dirty, setDirty] = useState(0), [slow, setSlow] = useState(10);
  const r = eatPf(mem, fault, oneIn, dirty); const pmax = maxFaultRate(mem, fault * (1 + dirty / 100), slow);
  return (
    <Shell title="Page-fault access time lab" note="EAT = (1 − p) × memory time + p × fault service time." tint="peach">
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <R label="Memory access" v={mem} set={setMem} min={50} max={300} step={10} unit="ns" /><R label="Fault service" v={fault} set={setFault} min={1} max={20} unit="ms" />
        <R label="One fault every" v={oneIn} set={setOneIn} min={100} max={1000000} step={100} unit="accesses" /><R label="Dirty victims" v={dirty} set={setDirty} min={0} max={100} step={10} unit="%" />
      </div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Effective access time<b className="block font-num text-xl">{r.eat.toLocaleString("en-IN", { maximumFractionDigits: 1 })} ns</b><span className="text-xs text-[var(--text-secondary)]">{(r.eat / mem).toFixed(1)}× slower than memory</span></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Fault service with dirty pages<b className="block font-num text-xl">{(r.service / 1e6).toFixed(1)} ms</b><span className="text-xs text-[var(--text-secondary)]">a dirty victim is written back first</span></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">To stay within <span className="font-num">{slow}%</span> of memory speed<b className="block font-num text-xl">1 in {Math.round(1 / pmax).toLocaleString("en-IN")}</b><span className="text-xs text-[var(--text-secondary)]">largest allowed fault rate</span></p>
      </div>
      <div className="mt-2"><R label="Allowed slowdown" v={slow} set={setSlow} min={1} max={100} unit="%" /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ working set */
export function workingSets(refs: number[], delta: number) { return refs.map((_, t) => [...new Set(refs.slice(Math.max(0, t - delta + 1), t + 1))].sort((a, b) => a - b)); }
export function WorkingSetLab() {
  const [text, setText] = useState("1 2 1 3 4 4 3 5 3 4"), [delta, setDelta] = useState(5), [t, setT] = useState(9), [frames, setFrames] = useState(3);
  const refs = text.split(/[\s,]+/).map(Number).filter((n) => Number.isInteger(n) && n >= 0).slice(0, 20);
  const ws = workingSets(refs, delta); const at = Math.min(t, refs.length - 1);
  return (
    <Shell title="Working-set lab" note="The working set at time t = distinct pages among the last Δ references." tint="lilac">
      <label className="mt-3 block text-sm font-bold">Reference string<input value={text} onChange={(e) => setText(e.target.value)} aria-label="Reference string" className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm"><b>Window Δ</b>{[2, 3, 4, 5, 6].map((n) => <button key={n} type="button" aria-pressed={delta === n} onClick={() => setDelta(n)} className={delta === n ? "pill-ink" : "pill-soft"}>{n}</button>)}<b className="ml-2">Frames given</b>{[2, 3, 4].map((n) => <button key={n} type="button" aria-pressed={frames === n} onClick={() => setFrames(n)} className={frames === n ? "pill-ink" : "pill-soft"}>{n}</button>)}</div>
      <div className="mt-3 overflow-x-auto"><div className="flex min-w-max gap-1">{refs.map((r, i) => { const inWin = i <= at && i > at - delta; return <button key={i} type="button" onClick={() => setT(i)} aria-label={`Time ${i + 1}, page ${r}`} className={`w-10 rounded-xl py-1.5 text-center font-num text-sm ${i === at ? "bg-[var(--tint-ink)] font-bold text-[var(--surface)]" : inWin ? "border-2 border-[var(--tint-ink)] bg-[var(--surface)]" : "bg-[var(--surface)]/60"}`}><span className="block text-[9px] opacity-70">t{i + 1}</span>{r}</button>; })}</div></div>
      <div className="mt-3 overflow-x-auto"><div className="flex min-w-max items-end gap-1">{ws.map((w, i) => <div key={i} className="flex w-10 flex-col items-center gap-0.5"><span className="font-num text-[10px] font-bold">{w.length}</span><span className={`w-full rounded-t ${w.length > frames ? "bg-rose-700" : "bg-[var(--tint-ink)]"}`} style={{ height: `${w.length * 12}px` }} /></div>)}</div></div>
      {refs.length > 0 && <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm ${ws[at].length > frames ? "bg-rose-700 font-semibold text-white" : "bg-[var(--surface)]"}`}>At t{at + 1}: WS = {"{"}{ws[at].join(", ")}{"}"}, size {ws[at].length}. {ws[at].length > frames ? `It needs more than the ${frames} frames given: the process would fault constantly (thrash).` : `It fits in ${frames} frames.`}</p>}
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Tap any time step. Bars show the working-set size over time; red bars exceed the frames given.</p>
    </Shell>
  );
}
