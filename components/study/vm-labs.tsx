"use client";

/** Virtual memory lab: page replacement (FIFO, LRU, Optimal) on any reference string, with Belady's anomaly. */
import { useMemo, useState } from "react";

export type Policy = "FIFO" | "LRU" | "OPT";
/** Simulate page replacement. Returns the frame contents after each reference and whether it faulted. */
export function replace(refs: number[], frames: number, policy: Policy) {
  const mem: number[] = []; const order: number[] = []; const last = new Map<number, number>();
  const steps: { frames: (number | null)[]; fault: boolean; victim: number | null }[] = [];
  refs.forEach((r, i) => {
    let fault = false, victim: number | null = null;
    if (!mem.includes(r)) {
      fault = true;
      if (mem.length < frames) { mem.push(r); order.push(r); }
      else {
        if (policy === "FIFO") victim = order.shift()!;
        else if (policy === "LRU") victim = [...mem].sort((a, b) => (last.get(a) ?? -1) - (last.get(b) ?? -1))[0];
        else {
          // optimal: the page used furthest in the future (or never); ties by lowest frame position
          let best = mem[0], far = -1;
          for (const p of mem) { const nx = refs.indexOf(p, i + 1); const d = nx < 0 ? Infinity : nx; if (d > far) { far = d; best = p; } }
          victim = best;
        }
        mem[mem.indexOf(victim)] = r;
        if (policy === "FIFO") order.push(r);
      }
    }
    last.set(r, i);
    steps.push({ frames: Array.from({ length: frames }, (_, k) => mem[k] ?? null), fault, victim });
  });
  return { steps, faults: steps.filter((s) => s.fault).length };
}

const PRESETS = [
  { name: "Lesson string", refs: [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2] },
  { name: "Belady's anomaly", refs: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5] },
];
export function ReplaceLab() {
  const [preset, setPreset] = useState(0);
  const [text, setText] = useState(PRESETS[0].refs.join(" "));
  const [frames, setFrames] = useState(3);
  const [policy, setPolicy] = useState<Policy>("FIFO");
  const refs = useMemo(() => text.split(/[\s,]+/).map(Number).filter((n) => Number.isInteger(n) && n >= 0).slice(0, 24), [text]);
  const r = useMemo(() => replace(refs, frames, policy), [refs, frames, policy]);
  const compare = (["FIFO", "LRU", "OPT"] as Policy[]).map((p) => ({ p, f: replace(refs, frames, p).faults }));
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint="mint" aria-label="Page replacement lab">
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">Page replacement lab</p><span className="text-sm text-[var(--text-secondary)]">Edit the reference string, the number of frames and the policy.</span></div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {PRESETS.map((p, i) => <button key={p.name} type="button" aria-pressed={preset === i} onClick={() => { setPreset(i); setText(p.refs.join(" ")); }} className={preset === i ? "pill-ink" : "pill-soft"}>{p.name}</button>)}
        {(["FIFO", "LRU", "OPT"] as Policy[]).map((p) => <button key={p} type="button" aria-pressed={policy === p} onClick={() => setPolicy(p)} className={policy === p ? "pill-ink" : "pill-soft"}>{p === "OPT" ? "Optimal" : p}</button>)}
        <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>Frames</b>{[2, 3, 4, 5].map((n) => <button key={n} type="button" aria-pressed={frames === n} onClick={() => setFrames(n)} className={`h-7 w-7 rounded-lg font-bold ${frames === n ? "bg-[var(--ink)] text-[var(--background)]" : "border border-[var(--border)]"}`}>{n}</button>)}</span>
      </div>
      <label className="mt-3 block text-sm font-bold">Reference string
        <input value={text} onChange={(e) => setText(e.target.value)} aria-label="Reference string" className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" />
      </label>
      <div className="mt-3 overflow-x-auto">
        <table className="border-separate border-spacing-1 font-num text-sm">
          <thead><tr>{refs.map((x, i) => <th key={i} className="w-9 rounded-lg bg-[var(--surface)] py-1">{x}</th>)}</tr></thead>
          <tbody>
            {Array.from({ length: frames }, (_, f) => <tr key={f}>{r.steps.map((s, i) => <td key={i} className={`h-8 w-9 rounded-lg text-center ${s.fault && s.frames[f] === refs[i] ? "bg-[var(--tint-ink)] font-bold text-[var(--surface)]" : "bg-[var(--surface)]/60"}`}>{s.frames[f] ?? ""}</td>)}</tr>)}
            <tr>{r.steps.map((s, i) => <td key={i} className={`text-center text-[11px] font-bold ${s.fault ? "text-rose-700 dark:text-rose-300" : "text-emerald-700 dark:text-emerald-300"}`}>{s.fault ? "F" : "hit"}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-4">
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Page faults <b className="block font-num text-2xl">{r.faults}</b></p>
        {compare.map((c) => <p key={c.p} className="rounded-2xl bg-[var(--surface)] p-3 text-sm">{c.p === "OPT" ? "Optimal" : c.p} <b className="block font-num text-2xl">{c.f}</b></p>)}
      </div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Frames start empty, so the first references always fault. Optimal replaces the page used furthest in the future; ties go to the page in the lowest frame.</p>
    </section>
  );
}
