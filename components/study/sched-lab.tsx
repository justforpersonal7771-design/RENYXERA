"use client";

/**
 * CPU scheduling lab: edit the processes, pick an algorithm (and the time quantum for round robin), and see the Gantt
 * chart, the per-process table and the averages. Uses lib/study/scheduling.ts, the same simulator the lessons were
 * checked with.
 */
import { useMemo, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { schedule, type Algo, type Job } from "@/lib/study/scheduling";

const START: Job[] = [{ id: "P1", arrival: 0, burst: 5, priority: 3 }, { id: "P2", arrival: 1, burst: 3, priority: 1 }, { id: "P3", arrival: 2, burst: 1, priority: 4 }, { id: "P4", arrival: 4, burst: 2, priority: 2 }];
const FULL = { FCFS: "First come, first served", SJF: "Shortest job first", SRTF: "Shortest remaining time first", HRRN: "Highest response ratio next", LJF: "Longest job first", LRTF: "Longest remaining time first", SSTF: "Shortest seek time first", SCAN: "Elevator: sweep to the disk end and back", CSCAN: "Circular SCAN", LOOK: "SCAN that turns at the last request", CLOOK: "Circular LOOK", FIFO: "First in, first out", LRU: "Least recently used" } as Record<string, string>;
const ALGOS: { k: Algo; label: string }[] = [{ k: "FCFS", label: "FCFS" }, { k: "SJF", label: "SJF" }, { k: "SRTF", label: "SRTF" }, { k: "RR", label: "Round robin" }, { k: "PRIO", label: "Priority" }, { k: "HRRN", label: "HRRN" }, { k: "LJF", label: "LJF" }, { k: "LRTF", label: "LRTF" }];
const COLORS = ["var(--tint-rose-ink)", "var(--tint-sky-ink)", "var(--tint-mint-ink)", "var(--tint-butter-ink)", "var(--tint-lilac-ink)"];

function Step({ v, set, min, max, label }: { v: number; set: (n: number) => void; min: number; max: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <button type="button" aria-label={`Less ${label}`} disabled={v <= min} onClick={() => set(v - 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] disabled:opacity-30"><Minus className="h-3.5 w-3.5" /></button>
      <span className="w-6 text-center font-num font-bold">{v}</span>
      <button type="button" aria-label={`More ${label}`} disabled={v >= max} onClick={() => set(v + 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button>
    </span>
  );
}

export function SchedLab({ initial = "FCFS" as Algo }: { initial?: Algo }) {
  const [jobs, setJobs] = useState<Job[]>(START);
  const [algo, setAlgo] = useState<Algo>(initial);
  const [q, setQ] = useState(2);
  const r = useMemo(() => schedule(jobs, algo, q), [jobs, algo, q]);
  const end = r.gantt.at(-1)?.end ?? 1;
  const color = (id: string | null) => (id ? COLORS[jobs.findIndex((j) => j.id === id) % COLORS.length] : "transparent");
  const set = (i: number, k: "arrival" | "burst" | "priority", v: number) => setJobs((js) => js.map((j, n) => (n === i ? { ...j, [k]: v } : j)));
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint="sky" aria-label="Scheduling lab">
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">Scheduling lab</p><span className="text-sm text-[var(--text-secondary)]">Change the processes or the algorithm; the Gantt chart and the averages update.</span></div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {ALGOS.map((a) => <button key={a.k} type="button" title={FULL[a.k]} aria-pressed={algo === a.k} onClick={() => setAlgo(a.k)} className={algo === a.k ? "pill-ink" : "pill-soft"}>{a.label}</button>)}
        {algo === "RR" && <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>Quantum</b><Step v={q} set={setQ} min={1} max={6} label="quantum" /></span>}
        <button type="button" onClick={() => { setJobs(START); setQ(2); }} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>
      </div>

      <div className="mt-4 rounded-2xl bg-[var(--surface)] p-3" aria-label={`Gantt chart: ${r.gantt.map((s) => `${s.id ?? "idle"} from ${s.start} to ${s.end}`).join(", ")}`}>
        <div className="flex h-12 overflow-hidden rounded-xl border border-[var(--border)]">
          {r.gantt.map((s, i) => (
            <div key={i} className="grid place-items-center border-r border-[var(--surface)] text-sm font-extrabold last:border-r-0" style={{ width: `${((s.end - s.start) / end) * 100}%`, background: s.id ? color(s.id) : "repeating-linear-gradient(45deg, transparent 0 6px, var(--border) 6px 8px)", color: "var(--surface)" }}>
              {s.id ?? <span className="text-xs text-[var(--text-secondary)]">idle</span>}
            </div>
          ))}
        </div>
        <div className="relative mt-1 h-4 text-[11px] font-num text-[var(--text-secondary)]">
          {[0, ...r.gantt.map((s) => s.end)].map((t, i) => <span key={i} className="absolute -translate-x-1/2" style={{ left: `${(t / end) * 100}%` }}>{t}</span>)}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-y-1 text-sm">
          <thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th className="px-2">Process</th><th className="px-2">Arrival</th><th className="px-2">Burst</th>{algo === "PRIO" && <th className="px-2">Priority (1 = highest)</th>}<th className="px-2">Completion</th><th className="px-2">Turnaround</th><th className="px-2">Waiting</th><th className="px-2">Response</th></tr></thead>
          <tbody>
            {jobs.map((j, i) => { const row = r.rows[i]; return (
              <tr key={j.id}>
                <td className="rounded-l-xl bg-[var(--surface)] px-2 py-1.5"><span className="mr-2 inline-block h-3 w-3 rounded-full align-middle" style={{ background: color(j.id) }} /><b>{j.id}</b></td>
                <td className="bg-[var(--surface)] px-2"><Step v={j.arrival} set={(v) => set(i, "arrival", v)} min={0} max={9} label={`${j.id} arrival`} /></td>
                <td className="bg-[var(--surface)] px-2"><Step v={j.burst} set={(v) => set(i, "burst", v)} min={1} max={9} label={`${j.id} burst`} /></td>
                {algo === "PRIO" && <td className="bg-[var(--surface)] px-2"><Step v={j.priority ?? 1} set={(v) => set(i, "priority", v)} min={1} max={5} label={`${j.id} priority`} /></td>}
                <td className="bg-[var(--surface)] px-2 font-num">{row.completion}</td>
                <td className="bg-[var(--surface)] px-2 font-num">{row.turnaround}</td>
                <td className="bg-[var(--surface)] px-2 font-num">{row.waiting}</td>
                <td className="rounded-r-xl bg-[var(--surface)] px-2 font-num">{row.response}</td>
              </tr>
            ); })}
          </tbody>
        </table>
      </div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Average waiting time <b className="block font-num text-xl">{r.avgWt.toFixed(2)}</b></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Average turnaround time <b className="block font-num text-xl">{r.avgTat.toFixed(2)}</b></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Context switches between processes <b className="block font-num text-xl">{r.switches}</b></p>
      </div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Turnaround = completion − arrival. Waiting = turnaround − burst. Response = first time on the CPU − arrival. Ties go to the earlier arrival, then the lower number. In round robin a newly arrived process joins the queue before the one whose slice just ended.</p>
    </section>
  );
}
