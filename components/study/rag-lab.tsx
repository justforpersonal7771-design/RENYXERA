"use client";

/**
 * Deadlock Lab (interactive study block). The student edits a resource-allocation state (turn any request on or off,
 * change how many instances a resource has) and the graph redraws live. "Step" runs graph reduction one process at a
 * time: a process whose requests can all be met finishes and returns what it held. The run ends with a safe finishing
 * order or the exact deadlocked set. Same algorithm as the lesson's Example 2, so the lab and the text always agree.
 */
import { useMemo, useState } from "react";
import { Minus, Play, Plus, RotateCcw, StepForward } from "lucide-react";
import { Diagram } from "@/components/study/diagram";
import type { Fig, GraphEdge, GraphNode } from "@/lib/study/schema";

type State = { procs: { id: string; x: number; y: number }[]; res: { id: string; x: number; y: number; n: number }[]; holds: [string, string][]; asks: [string, string, boolean][] };

const SCENARIOS: Record<string, { name: string; s: State }> = {
  ring2: { name: "Two-process deadlock", s: { procs: [{ id: "P1", x: 70, y: 120 }, { id: "P2", x: 300, y: 120 }], res: [{ id: "R1", x: 185, y: 40, n: 1 }, { id: "R2", x: 185, y: 205, n: 1 }], holds: [["P1", "R1"], ["P2", "R2"]], asks: [["P1", "R2", true], ["P2", "R1", true]] } },
  ex2: { name: "Example 2: cycle, no deadlock", s: { procs: [{ id: "P1", x: 60, y: 130 }, { id: "P2", x: 300, y: 130 }, { id: "P3", x: 330, y: 40 }], res: [{ id: "R1", x: 180, y: 40, n: 2 }, { id: "R2", x: 180, y: 215, n: 1 }], holds: [["P1", "R1"], ["P3", "R1"], ["P2", "R2"]], asks: [["P1", "R2", true], ["P2", "R1", true], ["P3", "R2", false]] } },
  ring3: { name: "Example 1: three-process ring", s: { procs: [{ id: "P1", x: 190, y: 40 }, { id: "P2", x: 300, y: 250 }, { id: "P3", x: 80, y: 250 }], res: [{ id: "R1", x: 60, y: 110, n: 1 }, { id: "R2", x: 320, y: 110, n: 1 }, { id: "R3", x: 190, y: 268, n: 1 }], holds: [["P1", "R1"], ["P2", "R2"], ["P3", "R3"]], asks: [["P1", "R2", true], ["P2", "R3", true], ["P3", "R1", true]] } },
};

function reduce(s: State) {
  const avail = new Map(s.res.map((r) => [r.id, r.n - s.holds.filter(([, rr]) => rr === r.id).length]));
  const left = new Set(s.procs.map((p) => p.id));
  const order: { p: string; frees: string[] }[] = [];
  let moved = true;
  while (moved) {
    moved = false;
    for (const p of s.procs) {
      if (!left.has(p.id)) continue;
      const need = s.asks.filter(([pp, , on]) => on && pp === p.id).map(([, r]) => r);
      if (need.every((r) => (avail.get(r) ?? 0) >= need.filter((x) => x === r).length)) {
        const frees = s.holds.filter(([pp]) => pp === p.id).map(([, r]) => r);
        frees.forEach((r) => avail.set(r, (avail.get(r) ?? 0) + 1));
        left.delete(p.id); order.push({ p: p.id, frees }); moved = true;
      }
    }
  }
  return { order, stuck: [...left] };
}

export function RagLab() {
  const [key, setKey] = useState<keyof typeof SCENARIOS>("ex2");
  const [s, setS] = useState<State>(SCENARIOS.ex2.s);
  const [step, setStep] = useState(-1); // -1 = editing, k = k processes finished so far
  const result = useMemo(() => reduce(s), [s]);
  const done = new Set(result.order.slice(0, Math.max(0, step)).map((o) => o.p));
  const running = step >= 0;
  const finished = running && step >= result.order.length;

  const load = (k: keyof typeof SCENARIOS) => { setKey(k); setS(SCENARIOS[k].s); setStep(-1); };
  const edit = (f: (x: State) => State) => { setS((x) => f(structuredClone(x))); setStep(-1); };

  const fig: Fig = useMemo(() => {
    const nodes: GraphNode[] = [...s.res.map((r) => ({ id: r.id, label: r.id, kind: "resource" as const, x: r.x, y: r.y, instances: r.n })), ...s.procs.filter((p) => !done.has(p.id)).map((p) => ({ id: p.id, label: p.id, kind: "process" as const, x: p.x, y: p.y }))];
    const live = (p: string) => !done.has(p);
    const stuck = new Set(finished ? result.stuck : []);
    const edges: GraphEdge[] = [
      ...s.holds.filter(([p]) => live(p)).map(([p, r]) => ({ from: r, to: p, kind: "assign" as const, hl: stuck.has(p) })),
      ...s.asks.filter(([p, , on]) => on && live(p)).map(([p, r]) => ({ from: p, to: r, kind: "request" as const, hl: stuck.has(p) })),
    ];
    return { kind: "graph", w: 380, h: 300, nodes, edges };
  }, [s, done, finished, result.stuck]);

  return (
    <section className="card-pastel p-5 sm:p-6" data-tint="peri" aria-label="Deadlock lab">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-display text-xl font-extrabold text-[var(--text-primary)]">Deadlock lab</p>
        <span className="text-sm text-[var(--text-secondary)]">Change the state, then step through it.</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Scenarios">
        {(Object.keys(SCENARIOS) as (keyof typeof SCENARIOS)[]).map((k) => (
          <button key={k} type="button" role="tab" aria-selected={key === k} onClick={() => load(k)} className={key === k ? "pill-ink" : "pill-soft"}>{SCENARIOS[k].name}</button>
        ))}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <div className="grid justify-items-center rounded-2xl bg-[var(--surface)] p-3">
          <Diagram fig={fig} />
          <p className="mt-1 text-xs text-[var(--text-secondary)]">Solid arrow: resource given to process. Dashed: process asks for a resource.</p>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">Requests (tap to turn on or off)</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {s.asks.map(([p, r, on], i) => (
                <li key={i}><button type="button" aria-pressed={on} onClick={() => edit((x) => { x.asks[i][2] = !x.asks[i][2]; return x; })}
                  className={`rounded-xl border-2 px-3 py-1.5 text-sm font-semibold ${on ? "border-[var(--text-primary)] bg-[var(--surface)] text-[var(--text-primary)]" : "border-dashed border-[var(--border)] text-[var(--text-secondary)]"}`}>{p} asks for {r}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">Instances of each resource</p>
            <ul className="mt-2 flex flex-wrap gap-3">
              {s.res.map((r, i) => {
                const held = s.holds.filter(([, rr]) => rr === r.id).length;
                return (
                  <li key={r.id} className="flex items-center gap-2 rounded-xl bg-[var(--surface)] px-2 py-1">
                    <b className="text-sm">{r.id}</b>
                    <button type="button" aria-label={`Fewer ${r.id}`} disabled={r.n <= Math.max(1, held)} onClick={() => edit((x) => { x.res[i].n--; return x; })} className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border)] disabled:opacity-30"><Minus className="h-4 w-4" /></button>
                    <span className="w-5 text-center font-num font-bold">{r.n}</span>
                    <button type="button" aria-label={`More ${r.id}`} disabled={r.n >= 4} onClick={() => edit((x) => { x.res[i].n++; return x; })} className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--border)] disabled:opacity-30"><Plus className="h-4 w-4" /></button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {!running && <button type="button" onClick={() => setStep(0)} className="pill-ink"><Play className="h-4 w-4" aria-hidden /> Run it</button>}
            {running && !finished && <button type="button" onClick={() => setStep((k) => k + 1)} className="pill-ink"><StepForward className="h-4 w-4" aria-hidden /> Step</button>}
            {running && <button type="button" onClick={() => setStep(-1)} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>}
          </div>

          <div aria-live="polite" className="rounded-2xl bg-[var(--surface)] p-3 text-sm text-[var(--text-primary)]">
            {!running && <p>Press <b>Run it</b>. At each step, a process whose requests can all be met right now finishes and gives back what it held.</p>}
            {running && step > 0 && <ol className="list-decimal space-y-1 pl-5">{result.order.slice(0, step).map((o) => <li key={o.p}><b>{o.p}</b> finishes{o.frees.length ? ` and frees ${o.frees.join(", ")}` : ""}.</li>)}</ol>}
            {running && step === 0 && !finished && <p>Looking for a process that can finish…</p>}
            {finished && (result.stuck.length
              ? <p className="mt-2 font-bold text-rose-700 dark:text-rose-300">Deadlock: {result.stuck.join(", ")} can never finish. Each waits for something only another stuck process holds.</p>
              : <p className="mt-2 font-bold text-emerald-700 dark:text-emerald-300">No deadlock. Safe order: {result.order.map((o) => o.p).join(" → ")}.</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}
