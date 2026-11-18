"use client";

/** OS labs added after the syllabus audit: MLFQ, pipes (IPC) and segmentation. Numbers checked by scripts. */
import { useMemo, useState, type ReactNode } from "react";
import { mlfq, type Job } from "@/lib/study/scheduling";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------ MLFQ */
export const MLFQ_JOBS: Job[] = [{ id: "A", arrival: 0, burst: 7 }, { id: "B", arrival: 1, burst: 3 }, { id: "C", arrival: 2, burst: 10 }];
export function MlfqLab() {
  const [q0, setQ0] = useState(2), [q1, setQ1] = useState(4);
  const [jobs, setJobs] = useState(MLFQ_JOBS);
  const r = useMemo(() => mlfq(jobs, q0, q1), [jobs, q0, q1]);
  const end = r.gantt[r.gantt.length - 1]?.end ?? 1;
  const step = (i: number, k: "arrival" | "burst", d: number) => setJobs((js) => js.map((j, x) => (x === i ? { ...j, [k]: Math.max(k === "burst" ? 1 : 0, Math.min(k === "burst" ? 16 : 10, j[k] + d)) } : j)));
  return (
    <Shell title="Multilevel feedback queue lab" note="Q0 and Q1 are round robin; Q2 is FCFS. Use a whole quantum and you drop a level." tint="lilac">
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold">Q0 quantum</span>{[1, 2, 3, 4].map((n) => <button key={n} type="button" aria-pressed={q0 === n} onClick={() => setQ0(n)} className={q0 === n ? "pill-ink" : "pill-soft"}>{n}</button>)}
        <span className="ml-2 font-bold">Q1 quantum</span>{[2, 4, 6, 8].map((n) => <button key={n} type="button" aria-pressed={q1 === n} onClick={() => setQ1(n)} className={q1 === n ? "pill-ink" : "pill-soft"}>{n}</button>)}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {jobs.map((j, i) => (
          <div key={j.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-[var(--surface)] px-3 py-2 text-sm"><b>{j.id}</b>
            {(["arrival", "burst"] as const).map((k) => <span key={k} className="inline-flex items-center gap-1 text-xs">{k}<button type="button" aria-label={`${j.id} ${k} down`} onClick={() => step(i, k, -1)} className="h-6 w-6 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-5 text-center font-num">{j[k]}</span><button type="button" aria-label={`${j.id} ${k} up`} onClick={() => step(i, k, 1)} className="h-6 w-6 rounded-lg border border-[var(--border)] font-bold">+</button></span>)}
          </div>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3">
        <div className="min-w-[440px] space-y-1">
          {[0, 1, 2].map((lv) => (
            <div key={lv} className="flex items-center gap-2 text-xs"><span className="w-8 shrink-0 font-bold">Q{lv}</span>
              <div className="relative h-7 flex-1 rounded bg-[var(--surface-secondary)]">
                {r.gantt.filter((g) => g.level === lv).map((g, k) => <span key={k} className="absolute top-0 grid h-7 place-items-center rounded border border-[var(--surface)] bg-[var(--tint-ink)] font-bold text-[var(--surface)]" style={{ left: `${(g.start / end) * 100}%`, width: `${((g.end - g.start) / end) * 100}%` }}>{g.id}</span>)}
              </div></div>
          ))}
          <div className="flex justify-between pl-10 font-num text-[10px] text-[var(--text-secondary)]"><span>0</span><span>{end}</span></div>
        </div>
      </div>
      <p className="mt-2 font-num text-sm">{r.gantt.map((g) => `${g.id ?? "idle"}(Q${g.level < 0 ? "-" : g.level}) ${g.start}–${g.end}`).join(" · ")}</p>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">{r.rows.map((x) => <p key={x.id} className="rounded-2xl bg-[var(--surface)] p-3 text-sm"><b>{x.id}</b> finishes at <b className="font-num">{x.completion}</b><span className="block text-xs text-[var(--text-secondary)]">turnaround {x.turnaround}, waiting {x.waiting}, ends in Q{x.level}</span></p>)}</div>
    </Shell>
  );
}

/* ------------------------------------------------------------ pipes */
export type PipeState = { buf: number; cap: number; writerOpen: boolean; log: string[]; blocked: "reader" | "writer" | null };
/** One step on a pipe. Writes block when the buffer is full; reads block when it is empty and a writer exists; read returns 0 (EOF) once the write end is closed and the pipe is empty. */
export function pipeStep(s: PipeState, act: { kind: "write" | "read"; n: number } | { kind: "close" }): PipeState {
  const log = [...s.log];
  if (act.kind === "close") return { ...s, writerOpen: false, blocked: s.blocked === "reader" && s.buf === 0 ? null : s.blocked, log: [...log, "Writer closes its end." + (s.buf === 0 ? " A waiting reader now gets 0 (end of file)." : "")] };
  if (act.kind === "write") {
    if (!s.writerOpen) return { ...s, log: [...log, "The write end is closed: write is not possible."] };
    const room = s.cap - s.buf, put = Math.min(room, act.n);
    if (put < act.n) return { ...s, buf: s.cap, blocked: "writer", log: [...log, `write(${act.n}): ${put} bytes fit, then the writer blocks: the pipe is full.`] };
    return { ...s, buf: s.buf + put, blocked: s.blocked === "reader" ? null : s.blocked, log: [...log, `write(${act.n}): buffer now ${s.buf + put} of ${s.cap}.${s.blocked === "reader" ? " The waiting reader wakes." : ""}`] };
  }
  if (s.buf === 0) return s.writerOpen ? { ...s, blocked: "reader", log: [...log, `read(${act.n}): the pipe is empty, so the reader blocks.`] } : { ...s, log: [...log, `read(${act.n}) returns 0: end of file.`] };
  const got = Math.min(s.buf, act.n);
  return { ...s, buf: s.buf - got, blocked: s.blocked === "writer" ? null : s.blocked, log: [...log, `read(${act.n}) returns ${got} bytes; buffer now ${s.buf - got}.${s.blocked === "writer" ? " The blocked writer can continue." : ""}`] };
}
export function PipeLab() {
  const init: PipeState = { buf: 0, cap: 8, writerOpen: true, log: [], blocked: null };
  const [s, setS] = useState(init);
  const act = (a: Parameters<typeof pipeStep>[1]) => setS((x) => pipeStep(x, a));
  return (
    <Shell title="Pipe lab" note="A pipe is a fixed-size kernel buffer: writers block when full, readers when empty." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">
        {[3, 6].map((n) => <button key={`w${n}`} type="button" onClick={() => act({ kind: "write", n })} className="pill-soft">Writer: write {n} bytes</button>)}
        {[2, 5].map((n) => <button key={`r${n}`} type="button" onClick={() => act({ kind: "read", n })} className="pill-soft">Reader: read {n} bytes</button>)}
        <button type="button" onClick={() => act({ kind: "close" })} className="pill-soft">Writer closes</button>
        <button type="button" onClick={() => setS(init)} className="pill-ink">Reset</button>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.blocked === "writer" ? "bg-rose-600 text-white" : "bg-[var(--surface)]"}`}>Writer {s.writerOpen ? (s.blocked === "writer" ? "blocked" : "ready") : "closed"}</span>
        <div className="flex gap-1" aria-label={`Pipe holds ${s.buf} of ${s.cap} bytes`}>{Array.from({ length: s.cap }, (_, i) => <span key={i} className={`h-8 w-6 rounded ${i < s.buf ? "bg-[var(--tint-ink)]" : "bg-[var(--surface)]"}`} />)}</div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.blocked === "reader" ? "bg-rose-600 text-white" : "bg-[var(--surface)]"}`}>Reader {s.blocked === "reader" ? "blocked" : "ready"}</span>
      </div>
      <ol aria-live="polite" className="mt-3 space-y-1.5">{s.log.length ? s.log.slice(-6).map((l, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-2 text-sm">{l}</li>) : <li className="rounded-xl bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-secondary)]">Capacity 8 bytes. Try reading from an empty pipe, overfilling it, and closing the writer.</li>}</ol>
    </Shell>
  );
}

/* ------------------------------------------------------------ segmentation */
export const SEGS = [{ base: 1200, limit: 600 }, { base: 4300, limit: 250 }, { base: 2700, limit: 1000 }, { base: 900, limit: 200 }];
export function segAddr(seg: number, off: number, table = SEGS) { const s = table[seg]; if (!s) return { ok: false as const, why: "no such segment" }; return off < s.limit ? { ok: true as const, phys: s.base + off } : { ok: false as const, why: `offset ${off} ≥ limit ${s.limit}` }; }
export function SegmentLab() {
  const [seg, setSeg] = useState(2), [off, setOff] = useState(750);
  const r = segAddr(seg, off);
  return (
    <Shell title="Segmentation lab" note="Logical address = (segment, offset). Check offset < limit, then add the base." tint="peach">
      <div className="mt-3 grid min-w-0 gap-3 sm:grid-cols-[auto_minmax(0,1fr)]">
        <table className="border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>Seg</th><th>Base</th><th>Limit</th></tr></thead>
          <tbody>{SEGS.map((s, i) => <tr key={i} className="font-num"><td><button type="button" aria-pressed={seg === i} onClick={() => setSeg(i)} className={seg === i ? "pill-ink" : "pill-soft"}>{i}</button></td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{s.base}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{s.limit}</td></tr>)}</tbody></table>
        <div className="min-w-0 space-y-3">
          <label className="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5 text-sm"><b>Offset</b><input type="range" min={0} max={1100} step={1} value={off} onChange={(e) => setOff(Number(e.target.value))} aria-label="Offset" className="min-w-0 flex-1 accent-[var(--tint-ink)]" /><span className="w-12 font-num">{off}</span></label>
          <div className="overflow-x-auto rounded-2xl bg-[var(--surface)] p-3">
            <div className="relative h-8 min-w-[360px] rounded bg-[var(--surface-secondary)]">
              {SEGS.map((s, i) => <span key={i} className={`absolute top-0 grid h-8 place-items-center rounded text-[10px] font-bold ${i === seg ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "border border-[var(--border)]"}`} style={{ left: `${(s.base / 5000) * 100}%`, width: `${(s.limit / 5000) * 100}%` }}>S{i}</span>)}
              {r.ok && <span className="absolute -top-1 h-10 w-0.5 bg-rose-600" style={{ left: `${(r.phys / 5000) * 100}%` }} />}
            </div>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">Physical memory 0 to 5000. Segments sit anywhere and have different sizes.</p>
          </div>
          <p aria-live="polite" className={`rounded-2xl p-3 text-sm font-semibold ${r.ok ? "bg-[var(--surface)]" : "bg-rose-600 text-white"}`}>{r.ok ? `(${seg}, ${off}) → ${SEGS[seg].base} + ${off} = ${r.phys}` : `(${seg}, ${off}): trap to the OS, ${r.why}.`}</p>
        </div>
      </div>
    </Shell>
  );
}
