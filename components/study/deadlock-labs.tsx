"use client";

/**
 * Interactive labs for Deadlock topics 2 to 6 (owner, 18 Nov: "a lab in every topic"). Each lab runs the same algorithm the
 * lesson teaches, on the same numbers, so the lab and the text always agree. Numbers checked by script (see the content file).
 */
import { useMemo, useState, type ReactNode } from "react";
import { Minus, Play, Plus, RotateCcw, StepForward } from "lucide-react";

const add = (a: number[], b: number[]) => a.map((x, i) => x + b[i]);
const sub = (a: number[], b: number[]) => a.map((x, i) => x - b[i]);
const le = (a: number[], b: number[]) => a.every((x, i) => x <= b[i]);
const v = (a: number[]) => `(${a.join(", ")})`;
const RES = ["A", "B", "C"];

function Lab({ title, note, tint = "peri", children }: { title: string; note: string; tint?: string; children: ReactNode }) {
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (n: number) => void; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <button type="button" aria-label={`Less ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] disabled:opacity-30"><Minus className="h-3.5 w-3.5" /></button>
      <span className="w-6 text-center font-num font-bold">{value}</span>
      <button type="button" aria-label={`More ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="grid h-7 w-7 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] disabled:opacity-30"><Plus className="h-3.5 w-3.5" /></button>
    </span>
  );
}
const Out = ({ children }: { children: ReactNode }) => <div aria-live="polite" className="rounded-2xl bg-[var(--surface)] p-3 text-sm text-[var(--text-primary)]">{children}</div>;
const Good = ({ children }: { children: ReactNode }) => <p className="font-bold text-emerald-700 dark:text-emerald-300">{children}</p>;
const Bad = ({ children }: { children: ReactNode }) => <p className="font-bold text-rose-700 dark:text-rose-300">{children}</p>;

/** First-fit safety / reduction run: returns each finishing step with the work vector after it. */
function finishRun(avail: number[], alloc: number[][], ask: number[][], skip: number[] = []) {
  let w = [...avail];
  skip.forEach((g) => { w = add(w, alloc[g]); });
  const done = alloc.map((_, i) => skip.includes(i));
  const steps: { p: number; work: number[] }[] = [];
  let moved = true;
  while (moved) {
    moved = false;
    for (let i = 0; i < alloc.length; i++) if (!done[i] && le(ask[i], w)) { w = add(w, alloc[i]); done[i] = true; steps.push({ p: i, work: w }); moved = true; }
  }
  return { steps, stuck: done.map((d, i) => (d ? -1 : i)).filter((i) => i >= 0) };
}

/* ------------------------------------------------------------ 2. Prevention */
const CONDS = [
  { k: "me", name: "Mutual exclusion", off: "Make the resource shareable (read-only files, spooling a printer).", cost: "Impossible for most resources: two writers cannot share one lock." },
  { k: "hw", name: "Hold and wait", off: "Ask for everything at once, or release all before asking again.", cost: "Poor use of resources; a process holds things it does not need yet, and may starve." },
  { k: "np", name: "No pre-emption", off: "Take a resource away from a waiting process (save and restore its state).", cost: "Works only for resources whose state can be saved, like CPU registers or memory." },
  { k: "cw", name: "Circular wait", off: "Number every resource and always ask in increasing order.", cost: "Cheap and the most used in practice; programmers must follow the order." },
] as const;
export function PreventLab() {
  const [on, setOn] = useState<Record<string, boolean>>({ me: true, hw: true, np: true, cw: true });
  const [order, setOrder] = useState<"same" | "opposite">("opposite");
  const [t, setT] = useState(0);
  const all = Object.values(on).every(Boolean);
  // two threads: T1 locks A then B; T2 locks B then A (opposite) or A then B (same). Worst-case interleaving.
  const plan = order === "opposite"
    ? ["T1 locks A", "T2 locks B", "T1 asks for B: held by T2, T1 waits", "T2 asks for A: held by T1, T2 waits", "Both wait for ever: deadlock"]
    : ["T1 locks A", "T2 asks for A: held by T1, T2 waits (holding nothing)", "T1 locks B, finishes, unlocks A and B", "T2 locks A, then B, and finishes", "No deadlock: nobody waits while holding"];
  return (
    <Lab title="Prevention lab" note="Switch a condition off, or change the order the threads take locks.">
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">The four conditions (all must hold for a deadlock)</p>
          <ul className="mt-2 space-y-2">
            {CONDS.map((c) => (
              <li key={c.k}><button type="button" aria-pressed={on[c.k]} onClick={() => setOn((x) => ({ ...x, [c.k]: !x[c.k] }))}
                className={`w-full rounded-2xl border-2 p-3 text-left ${on[c.k] ? "border-[var(--text-primary)] bg-[var(--surface)]" : "border-dashed border-[var(--border)] bg-transparent"}`}>
                <span className="flex items-center justify-between gap-2"><b className="text-sm text-[var(--text-primary)]">{c.name}</b><span className={`rounded-full px-2 py-0.5 text-xs font-bold ${on[c.k] ? "bg-rose-600 text-white" : "bg-emerald-700 text-white"}`}>{on[c.k] ? "holds" : "broken"}</span></span>
                {!on[c.k] && <span className="mt-1 block text-xs text-[var(--text-secondary)]"><b>How:</b> {c.off} <b>Cost:</b> {c.cost}</span>}
              </button></li>
            ))}
          </ul>
          <div className="mt-3"><Out>{all ? <Bad>All four hold: a deadlock is possible.</Bad> : <Good>Deadlock is impossible: {CONDS.filter((c) => !on[c.k]).map((c) => c.name.toLowerCase()).join(" and ")} {CONDS.filter((c) => !on[c.k]).length > 1 ? "are" : "is"} broken.</Good>}</Out></div>
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">Lock ordering: T1 takes A then B. T2 takes…</p>
          <div className="mt-2 flex gap-2">
            <button type="button" aria-pressed={order === "opposite"} onClick={() => { setOrder("opposite"); setT(0); }} className={order === "opposite" ? "pill-ink" : "pill-soft"}>B then A</button>
            <button type="button" aria-pressed={order === "same"} onClick={() => { setOrder("same"); setT(0); }} className={order === "same" ? "pill-ink" : "pill-soft"}>A then B (same order)</button>
          </div>
          <ol className="mt-3 space-y-1.5">
            {plan.slice(0, t).map((s, i) => <li key={i} className={`rounded-xl px-3 py-2 text-sm ${i === plan.length - 1 ? (order === "opposite" ? "bg-rose-600 font-bold text-white" : "bg-emerald-700 font-bold text-white") : "bg-[var(--surface)] text-[var(--text-primary)]"}`}>{i + 1}. {s}</li>)}
          </ol>
          <div className="mt-3 flex gap-2">
            {t < plan.length ? <button type="button" onClick={() => setT((x) => x + 1)} className="pill-ink"><StepForward className="h-4 w-4" aria-hidden /> {t ? "Next step" : "Run the worst timing"}</button> : null}
            {t > 0 && <button type="button" onClick={() => setT(0)} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>}
          </div>
        </div>
      </div>
    </Lab>
  );
}

/* ------------------------------------------------------------ 3. Banker's algorithm */
export const BANKER = {
  alloc: [[2, 2, 1], [0, 2, 1], [1, 1, 2], [2, 2, 0]],
  max: [[3, 4, 2], [1, 4, 3], [1, 2, 3], [2, 2, 2]],
  avail: [0, 2, 1],
};
export function BankerLab() {
  const { alloc, max, avail } = BANKER;
  const need = max.map((m, i) => sub(m, alloc[i]));
  const [p, setP] = useState(2);
  const [req, setReq] = useState([0, 1, 1]);
  const [shown, setShown] = useState(-1); // -1 not run
  const verdict = useMemo(() => {
    if (!le(req, need[p])) return { kind: "error" as const };
    if (!le(req, avail)) return { kind: "wait" as const };
    const a2 = alloc.map((r, i) => (i === p ? add(r, req) : r)), n2 = need.map((r, i) => (i === p ? sub(r, req) : r));
    const r = finishRun(sub(avail, req), a2, n2);
    return { kind: r.stuck.length ? ("unsafe" as const) : ("safe" as const), run: r, start: sub(avail, req) };
  }, [p, req, alloc, avail, need]);
  const reset = () => setShown(-1);
  return (
    <Lab title="Banker's lab" note="Pick a process and a request. The bank lends only if a safe order still exists afterwards." tint="sky">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-separate border-spacing-y-1 text-sm">
          <thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th className="px-2">Process</th><th className="px-2">Allocation</th><th className="px-2">Max</th><th className="px-2">Need = Max − Allocation</th></tr></thead>
          <tbody>
            {alloc.map((a, i) => (
              <tr key={i} className={i === p ? "font-bold" : ""}><td className="rounded-l-xl bg-[var(--surface)] px-2 py-1.5">P{i}</td><td className="bg-[var(--surface)] px-2 font-num">{v(a)}</td><td className="bg-[var(--surface)] px-2 font-num">{v(max[i])}</td><td className="rounded-r-xl bg-[var(--surface)] px-2 font-num">{v(need[i])}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-[var(--text-primary)]">Available now: <b className="font-num">{v(avail)}</b></p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold">Request from</span>
        {alloc.map((_, i) => <button key={i} type="button" aria-pressed={p === i} onClick={() => { setP(i); reset(); }} className={p === i ? "pill-ink !px-3 !py-1" : "pill-soft !px-3 !py-1"}>P{i}</button>)}
        {RES.map((r, k) => <span key={r} className="inline-flex items-center gap-1 rounded-xl bg-[var(--surface)] px-2 py-1 text-sm"><b>{r}</b><Stepper label={r} value={req[k]} min={0} max={3} onChange={(n) => { setReq((x) => x.map((y, j) => (j === k ? n : y))); reset(); }} /></span>)}
      </div>
      <div className="mt-3 flex gap-2">
        {shown < 0 ? <button type="button" onClick={() => setShown(0)} className="pill-ink"><Play className="h-4 w-4" aria-hidden /> Ask the bank</button>
          : verdict.kind === "safe" || verdict.kind === "unsafe" ? (shown < (verdict.run?.steps.length ?? 0) ? <button type="button" onClick={() => setShown((s) => s + 1)} className="pill-ink"><StepForward className="h-4 w-4" aria-hidden /> Next step</button> : null) : null}
        {shown >= 0 && <button type="button" onClick={reset} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>}
      </div>
      {shown >= 0 && (
        <div className="mt-3"><Out>
          <p>1. Is the request within P{p}&apos;s remaining need {v(need[p])}? <b>{le(req, need[p]) ? "Yes" : "No"}</b></p>
          {verdict.kind === "error" ? <Bad>Refused as an error: P{p} asked for more than it declared it would ever need.</Bad> : <>
            <p>2. Is it within Available {v(avail)}? <b>{le(req, avail) ? "Yes" : "No"}</b></p>
            {verdict.kind === "wait" ? <Bad>P{p} must wait: the bank does not have that much free right now.</Bad> : <>
              <p>3. Pretend to lend it. Available becomes <b className="font-num">{v(verdict.start!)}</b>. Can everyone still finish?</p>
              <ol className="mt-1 list-decimal pl-5">{verdict.run!.steps.slice(0, shown).map((s) => <li key={s.p}>P{s.p} can finish with what is free; it returns its allocation. Work = <span className="font-num">{v(s.work)}</span></li>)}</ol>
              {shown >= verdict.run!.steps.length && (verdict.kind === "safe"
                ? <Good>Safe order: {verdict.run!.steps.map((s) => `P${s.p}`).join(" → ")}. The request is granted.</Good>
                : <Bad>{verdict.run!.steps.length ? "After that, " : ""}{verdict.run!.stuck.map((i) => `P${i}`).join(", ")} cannot finish: the state would be unsafe. The request is refused and P{p} waits.</Bad>)}
            </>}
          </>}
        </Out></div>
      )}
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Try it: (0, 1, 1) from P2 is granted, the same (0, 1, 1) from P0 is refused.</p>
    </Lab>
  );
}

/* ------------------------------------------------------------ 4. Detection and recovery */
export const DETECT = { total: [3, 2, 2], alloc: [[1, 0, 0], [1, 1, 0], [0, 1, 1], [1, 0, 1]], request: [[0, 0, 1], [1, 0, 1], [1, 0, 0], [0, 1, 0]] };
export function DetectLab() {
  const [reqs, setReqs] = useState(DETECT.request);
  const [ran, setRan] = useState(false);
  const [aborted, setAborted] = useState<number[]>([]);
  const avail = sub(DETECT.total, DETECT.alloc.reduce(add, [0, 0, 0]));
  const r = finishRun(avail, DETECT.alloc, reqs, aborted);
  const set = (i: number, k: number, n: number) => { setReqs((x) => x.map((row, j) => (j === i ? row.map((y, m) => (m === k ? n : y)) : row))); setRan(false); setAborted([]); };
  return (
    <Lab title="Detection lab" note="Edit what each process is asking for now, run detection, then recover by aborting." tint="mint">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] border-separate border-spacing-y-1 text-sm">
          <thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th className="px-2">Process</th><th className="px-2">Allocation</th><th className="px-2">Request (now)</th><th className="px-2">Status</th></tr></thead>
          <tbody>
            {DETECT.alloc.map((a, i) => {
              const gone = aborted.includes(i), stuck = ran && r.stuck.includes(i);
              return (
                <tr key={i}><td className="rounded-l-xl bg-[var(--surface)] px-2 py-1.5 font-bold">P{i}</td><td className="bg-[var(--surface)] px-2 font-num">{v(a)}</td>
                  <td className="bg-[var(--surface)] px-2">{RES.map((x, k) => <span key={x} className="mr-2 inline-flex items-center gap-1"><b className="text-xs">{x}</b><Stepper label={`P${i} ${x}`} value={reqs[i][k]} min={0} max={2} onChange={(n) => set(i, k, n)} /></span>)}</td>
                  <td className="rounded-r-xl bg-[var(--surface)] px-2">{gone ? <span className="text-xs font-bold text-[var(--text-secondary)]">aborted</span> : !ran ? "–" : stuck ? <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">deadlocked</span> : <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-bold text-white">finishes</span>}</td></tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm">Total {v(DETECT.total)}, all allocated, so Available = <b className="font-num">{v(avail)}</b>.</p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => setRan(true)} className="pill-ink"><Play className="h-4 w-4" aria-hidden /> Run detection</button>
        {(ran || aborted.length > 0) && <button type="button" onClick={() => { setRan(false); setAborted([]); setReqs(DETECT.request); }} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>}
      </div>
      {ran && <div className="mt-3"><Out>
        {r.steps.length > 0 && <ol className="list-decimal pl-5">{r.steps.map((s) => <li key={s.p}>P{s.p}&apos;s request fits; it finishes and returns its allocation. Work = <span className="font-num">{v(s.work)}</span></li>)}</ol>}
        {r.stuck.length ? <>
          <Bad>Deadlocked: {r.stuck.map((i) => `P${i}`).join(", ")}. No request among them can be met, now or later.</Bad>
          <p className="mt-2">Recover: abort one process and give its resources back.</p>
          <div className="mt-2 flex flex-wrap gap-2">{r.stuck.map((i) => <button key={i} type="button" onClick={() => setAborted((x) => [...x, i])} className="pill-soft">Abort P{i} (frees {v(DETECT.alloc[i])})</button>)}</div>
        </> : <Good>{aborted.length ? `After aborting ${aborted.map((i) => `P${i}`).join(", ")}, everyone else finishes.` : "No deadlock: every process finishes."}</Good>}
      </Out></div>}
    </Lab>
  );
}

/* ------------------------------------------------------------ 5. How many resources? */
export function CountLab() {
  const [n, setN] = useState(3);
  const [k, setK] = useState(3);
  const [r, setR] = useState(6);
  const need = n * (k - 1) + 1;
  const safeNow = r >= need;
  const maxProcs = k > 1 ? Math.floor((r - 1) / (k - 1)) : Infinity;
  // worst case: hand out instances one by one, round robin, until everyone holds k-1 or we run out
  const holds = Array.from({ length: n }, (_, i) => Math.min(k - 1, Math.floor(r / n) + (i < r % n ? 1 : 0)));
  const used = holds.reduce((t, x) => t + x, 0);
  return (
    <Lab title="Counting lab" note="n processes each need k instances at most. How many instances make deadlock impossible?" tint="butter">
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5"><b>Processes n</b><Stepper label="processes" value={n} min={2} max={6} onChange={setN} /></span>
        <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5"><b>Each needs k</b><Stepper label="need" value={k} min={2} max={5} onChange={setK} /></span>
        <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5"><b>Instances R</b><Stepper label="instances" value={r} min={1} max={24} onChange={setR} /></span>
      </div>
      <div className="mt-4 grid gap-2">
        {holds.map((h, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-8 text-sm font-bold">P{i + 1}</span>
            <span className="flex gap-1">{Array.from({ length: k }, (_, j) => <span key={j} className={`h-5 w-5 rounded-md border-2 ${j < h ? "border-[var(--tint-ink)] bg-[var(--tint-ink)]" : "border-dashed border-[var(--border)]"}`} />)}</span>
            <span className="text-xs text-[var(--text-secondary)]">holds {h} of {k}</span>
          </div>
        ))}
      </div>
      <div className="mt-3"><Out>
        <p>Worst case: hand out instances so everyone is one short. That uses n(k − 1) = {n}×{k - 1} = <b>{n * (k - 1)}</b>. {r > used ? `${r - used} instance${r - used > 1 ? "s are" : " is"} left over, so someone completes and frees everything.` : "Nothing is left over."}</p>
        {safeNow ? <Good>R = {r} ≥ n(k − 1) + 1 = {need}: deadlock is impossible.</Good> : <Bad>R = {r} &lt; {need}: everyone can end up one short and waiting. Deadlock is possible.</Bad>}
        <p className="mt-1 text-[var(--text-secondary)]">With R = {r}, at most <b className="text-[var(--text-primary)]">{maxProcs}</b> processes (each needing {k}) are guaranteed deadlock-free: ⌊(R − 1)/(k − 1)⌋.</p>
      </Out></div>
    </Lab>
  );
}

/* ------------------------------------------------------------ 6. Starvation, ageing, livelock */
const CASES = [
  { s: "P1 holds the scanner and waits for the printer; P2 holds the printer and waits for the scanner.", a: "Deadlock" },
  { s: "Two people in a corridor both step aside the same way, again and again; both keep moving, nobody passes.", a: "Livelock" },
  { s: "A low-priority job waits for hours because new high-priority jobs keep arriving; the system is busy finishing them.", a: "Starvation" },
  { s: "Two threads detect a conflict, release their locks, wait the same fixed time and retry together, for ever.", a: "Livelock" },
] as const;
export function StarveLab() {
  const [ageing, setAgeing] = useState(false);
  const [tick, setTick] = useState(0);
  const [picked, setPicked] = useState<Record<number, string>>({});
  // L has priority 1; a new job of priority 5 arrives every tick. With ageing L gains +1 priority per tick it waits.
  const lPrio = 1 + (ageing ? tick : 0);
  const lRuns = ageing && lPrio > 5;
  const runAt = ageing ? 5 : null; // first tick where 1 + t > 5 is t = 5
  return (
    <Lab title="Starvation lab" note="Run the scheduler with and without ageing, then sort the cases." tint="rose">
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" aria-pressed={ageing} onClick={() => { setAgeing((x) => !x); setTick(0); }} className={ageing ? "pill-ink" : "pill-soft"}>Ageing {ageing ? "on" : "off"}</button>
            <button type="button" onClick={() => setTick((t) => Math.min(t + 1, 8))} disabled={tick >= 8} className="pill-ink disabled:opacity-40"><StepForward className="h-4 w-4" aria-hidden /> Next tick</button>
            <button type="button" onClick={() => setTick(0)} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>
          </div>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Job L has priority 1. Every tick a new job of priority 5 arrives. Higher priority runs first.</p>
          <ol className="mt-2 space-y-1">
            {Array.from({ length: tick }, (_, t) => {
              const p = 1 + (ageing ? t + 1 : 0);
              const runsL = ageing && p > 5;
              return <li key={t} className={`rounded-xl px-3 py-1.5 text-sm ${runsL ? "bg-emerald-700 font-bold text-white" : "bg-[var(--surface)] text-[var(--text-primary)]"}`}>Tick {t + 1}: L priority {p}. {runsL ? "L finally runs." : "A new priority-5 job runs; L waits."}</li>;
            })}
          </ol>
          <div className="mt-2"><Out>{tick === 0 ? <p>Press <b>Next tick</b>.</p> : lRuns || (ageing && tick >= (runAt ?? 99)) ? <Good>With ageing, L&apos;s priority climbs past 5 and it runs. Starvation is gone.</Good> : ageing ? <p>L&apos;s priority is rising: {lPrio}.</p> : <Bad>Without ageing, L waits for ever while the system stays busy. That is starvation, not deadlock.</Bad>}</Out></div>
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">Deadlock, livelock or starvation?</p>
          <ul className="mt-2 space-y-2">
            {CASES.map((c, i) => (
              <li key={i} className="rounded-2xl bg-[var(--surface)] p-3 text-sm">
                <p className="text-[var(--text-primary)]">{c.s}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(["Deadlock", "Livelock", "Starvation"] as const).map((o) => {
                    const chose = picked[i] === o, right = o === c.a;
                    return <button key={o} type="button" onClick={() => setPicked((x) => ({ ...x, [i]: o }))} aria-pressed={chose}
                      className={`rounded-full border-2 px-2.5 py-1 text-xs font-bold ${picked[i] ? (right ? "border-emerald-700 bg-emerald-700 text-white" : chose ? "border-rose-600 bg-rose-600 text-white" : "border-[var(--border)] text-[var(--text-secondary)]") : "border-[var(--border)] text-[var(--text-primary)]"}`}>{o}</button>;
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Lab>
  );
}
