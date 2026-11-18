"use client";

/** Labs for Synchronisation: a race you can interleave by hand, a counting semaphore, and a bounded buffer. */
import { useState, type ReactNode } from "react";
import { RotateCcw } from "lucide-react";

function Lab({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ race condition */
const STEPS = ["load count into register", "add 1 to register", "store register into count"] as const;
type T = { pc: number; reg: number };
export function RaceLab() {
  const [count, setCount] = useState(0);
  const [t, setT] = useState<[T, T]>([{ pc: 0, reg: 0 }, { pc: 0, reg: 0 }]);
  const [lock, setLock] = useState(false);
  const [holder, setHolder] = useState<number | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const done = t.every((x) => x.pc === 3);
  const step = (i: 0 | 1) => {
    const me = t[i];
    if (me.pc === 3) return;
    if (lock && holder !== null && holder !== i) { setLog((l) => [`T${i + 1} must wait: T${holder + 1} holds the lock.`, ...l]); return; }
    let reg = me.reg, c = count, h = holder;
    if (lock && me.pc === 0) h = i;
    if (me.pc === 0) reg = c; else if (me.pc === 1) reg = reg + 1; else c = reg;
    const pc = me.pc + 1;
    if (lock && pc === 3) h = null;
    setCount(c); setHolder(h);
    setT((all) => all.map((x, k) => (k === i ? { pc, reg } : x)) as [T, T]);
    setLog((l) => [`T${i + 1}: ${STEPS[me.pc]} (register ${reg}${me.pc === 2 ? `, count = ${c}` : ""})`, ...l]);
  };
  const reset = () => { setCount(0); setT([{ pc: 0, reg: 0 }, { pc: 0, reg: 0 }]); setHolder(null); setLog([]); };
  return (
    <Lab title="Race lab" note="Both threads run count++ as three steps. You decide who goes next." tint="rose">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => step(0)} disabled={t[0].pc === 3} className="pill-ink disabled:opacity-40">Step thread 1</button>
            <button type="button" onClick={() => step(1)} disabled={t[1].pc === 3} className="pill-ink disabled:opacity-40">Step thread 2</button>
            <button type="button" aria-pressed={lock} onClick={() => { setLock((x) => !x); reset(); }} className={lock ? "pill-ink" : "pill-soft"}>Lock {lock ? "on" : "off"}</button>
            <button type="button" onClick={reset} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-[var(--surface)] p-3"><p className="text-xs text-[var(--text-secondary)]">Shared count</p><p className="font-num text-3xl font-black">{count}</p></div>
            {t.map((x, i) => <div key={i} className="rounded-2xl bg-[var(--surface)] p-3"><p className="text-xs text-[var(--text-secondary)]">T{i + 1} register · next step</p><p className="font-num text-2xl font-black">{x.reg}</p><p className="text-[11px]">{x.pc === 3 ? "done" : STEPS[x.pc]}</p></div>)}
          </div>
          <div aria-live="polite" className="rounded-2xl bg-[var(--surface)] p-3 text-sm">
            {!done ? <p>Try: step T1 once, then T2 three times, then T1 twice. {lock && "With the lock on, T2 cannot start until T1 finishes."}</p>
              : count === 2 ? <p className="font-bold text-emerald-700 dark:text-emerald-300">count = 2: both increments counted.</p>
              : <p className="font-bold text-rose-700 dark:text-rose-300">count = {count}: an increment was lost. Both threads loaded the same old value.</p>}
          </div>
        </div>
        <ol className="max-h-64 space-y-1 overflow-y-auto text-sm">{log.length === 0 ? <li className="rounded-xl bg-[var(--surface)] px-3 py-2">Steps you take appear here, newest first.</li> : log.map((l, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1.5">{l}</li>)}</ol>
      </div>
    </Lab>
  );
}

/* ------------------------------------------------------------ counting semaphore */
export function SemaphoreLab() {
  const [init, setInit] = useState(2);
  const [s, setS] = useState(2);
  const [inside, setInside] = useState<string[]>([]);
  const [queue, setQueue] = useState<string[]>([]);
  const [next, setNext] = useState(1);
  const [log, setLog] = useState<string[]>([]);
  const P = () => {
    const name = `P${next}`; setNext((n) => n + 1);
    const v = s - 1; setS(v);
    if (v < 0) { setQueue((q) => [...q, name]); setLog((l) => [`${name} calls wait: S = ${v} < 0, so ${name} blocks.`, ...l]); }
    else { setInside((x) => [...x, name]); setLog((l) => [`${name} calls wait: S = ${v}, ${name} enters.`, ...l]); }
  };
  const V = () => {
    if (!inside.length) return;
    const [out, ...rest] = inside; const v = s + 1; setS(v);
    if (queue.length) { const [w, ...q] = queue; setQueue(q); setInside([...rest, w]); setLog((l) => [`${out} calls signal: S = ${v} ≤ 0, so it wakes ${w}, who enters.`, ...l]); }
    else { setInside(rest); setLog((l) => [`${out} calls signal: S = ${v}.`, ...l]); }
  };
  const reset = (n = init) => { setS(n); setInside([]); setQueue([]); setNext(1); setLog([]); };
  return (
    <Lab title="Semaphore lab" note="A counting semaphore guards a resource with a few identical slots." tint="lilac">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5 text-sm"><b>Initial value</b>
          {[1, 2, 3].map((n) => <button key={n} type="button" aria-pressed={init === n} onClick={() => { setInit(n); reset(n); }} className={`h-7 w-7 rounded-lg font-bold ${init === n ? "bg-[var(--ink)] text-[var(--background)]" : "border border-[var(--border)]"}`}>{n}</button>)}</span>
        <button type="button" onClick={P} className="pill-ink">New process calls wait (P)</button>
        <button type="button" onClick={V} disabled={!inside.length} className="pill-soft disabled:opacity-40">First one inside calls signal (V)</button>
        <button type="button" onClick={() => reset()} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl bg-[var(--surface)] p-3 text-center"><p className="text-xs text-[var(--text-secondary)]">Semaphore S</p><p className={`font-num text-3xl font-black ${s < 0 ? "text-rose-600" : ""}`}>{s}</p><p className="text-[11px] text-[var(--text-secondary)]">{s < 0 ? `${-s} waiting` : `${s} free slot${s === 1 ? "" : "s"}`}</p></div>
        <div className="rounded-2xl bg-[var(--surface)] p-3"><p className="text-xs text-[var(--text-secondary)]">Using the resource</p><p className="mt-1 font-bold">{inside.join(", ") || "nobody"}</p></div>
        <div className="rounded-2xl bg-[var(--surface)] p-3"><p className="text-xs text-[var(--text-secondary)]">Blocked queue</p><p className="mt-1 font-bold">{queue.join(", ") || "empty"}</p></div>
      </div>
      <ol aria-live="polite" className="mt-3 max-h-40 space-y-1 overflow-y-auto text-sm">{log.map((l, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1.5">{l}</li>)}</ol>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">With this kind of semaphore, a negative value tells you how many processes are waiting.</p>
    </Lab>
  );
}

/* ------------------------------------------------------------ bounded buffer */
export function BufferLab() {
  const N = 3;
  const [buf, setBuf] = useState<number[]>([]);
  const [item, setItem] = useState(1);
  const [msg, setMsg] = useState("Produce and consume. The buffer holds 3 items.");
  const empty = N - buf.length, full = buf.length;
  const produce = () => { if (empty === 0) { setMsg("Producer: wait(empty) blocks: empty = 0, the buffer is full. It sleeps until a consumer signals empty."); return; } setBuf((b) => [...b, item]); setItem((n) => n + 1); setMsg(`Producer: wait(empty) → empty ${empty - 1}, wait(mutex), put item ${item}, signal(mutex), signal(full) → full ${full + 1}.`); };
  const consume = () => { if (full === 0) { setMsg("Consumer: wait(full) blocks: full = 0, nothing to take. It sleeps until a producer signals full."); return; } const [x, ...rest] = buf; setBuf(rest); setMsg(`Consumer: wait(full) → full ${full - 1}, wait(mutex), take item ${x}, signal(mutex), signal(empty) → empty ${empty + 1}.`); };
  return (
    <Lab title="Bounded buffer lab" note="Producer–consumer with semaphores empty, full and mutex." tint="mint">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={produce} className="pill-ink">Produce</button>
        <button type="button" onClick={consume} className="pill-ink">Consume</button>
        <button type="button" onClick={() => { setBuf([]); setItem(1); setMsg("Produce and consume. The buffer holds 3 items."); }} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>
      </div>
      <div className="mt-4 flex gap-2">{Array.from({ length: N }, (_, i) => <div key={i} className={`grid h-16 flex-1 place-items-center rounded-2xl border-2 font-num text-xl font-black ${buf[i] !== undefined ? "border-[var(--tint-ink)] bg-[var(--surface)]" : "border-dashed border-[var(--border)] text-[var(--text-secondary)]"}`}>{buf[i] !== undefined ? `#${buf[i]}` : "empty"}</div>)}</div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
        <p className="rounded-2xl bg-[var(--surface)] p-2">empty <b className="block font-num text-2xl">{empty}</b></p>
        <p className="rounded-2xl bg-[var(--surface)] p-2">full <b className="block font-num text-2xl">{full}</b></p>
        <p className="rounded-2xl bg-[var(--surface)] p-2">mutex <b className="block font-num text-2xl">1</b></p>
      </div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">{msg}</p>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">empty + full always equals the buffer size (3). mutex returns to 1 after every step.</p>
    </Lab>
  );
}
