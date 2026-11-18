"use client";

/** Labs for Processes and threads: the process state machine, and a fork() simulator that draws the process tree. */
import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

function Lab({ title, note, tint, children }: { title: string; note: string; tint: string; children: React.ReactNode }) {
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ process states */
type St = "New" | "Ready" | "Running" | "Waiting" | "Terminated";
const EVENTS: { k: string; label: string; from: St; to: St; why: string }[] = [
  { k: "admit", label: "Admit", from: "New", to: "Ready", why: "The OS has set up its PCB and memory; it can now compete for the CPU." },
  { k: "dispatch", label: "Dispatch (scheduler picks it)", from: "Ready", to: "Running", why: "The scheduler chose it; a context switch loads its registers." },
  { k: "timeout", label: "Time slice ends / pre-empted", from: "Running", to: "Ready", why: "It could keep running, but the CPU is taken back and it rejoins the ready queue." },
  { k: "io", label: "Asks for I/O or waits for an event", from: "Running", to: "Waiting", why: "It cannot continue until the disk read or event completes." },
  { k: "done", label: "I/O finishes", from: "Waiting", to: "Ready", why: "It can run again, but must wait for the scheduler; it does not jump straight to Running." },
  { k: "exit", label: "Exit", from: "Running", to: "Terminated", why: "Only a running process executes the exit call." },
];
const POS: Record<St, [number, number]> = { New: [60, 50], Ready: [210, 50], Running: [360, 50], Waiting: [285, 170], Terminated: [510, 50] };
export function ProcessStateLab() {
  const [st, setSt] = useState<St>("New");
  const [log, setLog] = useState<{ ok: boolean; text: string }[]>([]);
  const [switches, setSwitches] = useState(0);
  const fire = (e: (typeof EVENTS)[number]) => {
    if (e.from !== st) { setLog((l) => [{ ok: false, text: `${e.label}: not possible from ${st}. It only happens from ${e.from}.` }, ...l].slice(0, 6)); return; }
    setSt(e.to); if (e.k === "dispatch") setSwitches((n) => n + 1);
    setLog((l) => [{ ok: true, text: `${e.from} → ${e.to}. ${e.why}` }, ...l].slice(0, 6));
  };
  return (
    <Lab title="Process state lab" note="Fire events and watch one process move. Wrong moves are explained." tint="sky">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl bg-[var(--surface)] p-3">
          <svg viewBox="0 0 580 220" className="h-auto w-full" role="img" aria-label={`The process is in the ${st} state`}>
            <defs><marker id="ps-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--text-secondary)" /></marker></defs>
            {EVENTS.map((e) => { const [x1, y1] = POS[e.from], [x2, y2] = POS[e.to]; const back = e.k === "timeout"; return <path key={e.k} d={back ? `M${x1 - 30},${y1 + 18} Q${(x1 + x2) / 2},${y1 + 60} ${x2 + 30},${y2 + 18}` : `M${x1 + (x2 > x1 ? 46 : x2 < x1 ? -46 : 0)},${y1 + (y2 > y1 ? 20 : y2 < y1 ? -20 : 0)} L${x2 - (x2 > x1 ? 46 : x2 < x1 ? -46 : 0)},${y2 - (y2 > y1 ? 20 : y2 < y1 ? -20 : 0)}`} fill="none" stroke="var(--text-secondary)" strokeWidth="1.6" markerEnd="url(#ps-arr)" />; })}
            {(Object.keys(POS) as St[]).map((s) => { const [x, y] = POS[s]; const on = s === st; return (
              <g key={s}><rect x={x - 46} y={y - 20} width="92" height="40" rx="20" fill={on ? "var(--st-accent, #c2410c)" : "var(--surface-secondary)"} stroke="var(--text-primary)" strokeWidth={on ? 0 : 1.2} />
                <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? "#fff" : "var(--text-primary)"}>{s}</text></g>
            ); })}
          </svg>
          <p className="text-xs text-[var(--text-secondary)]">Times dispatched (each one is a context switch in): <b className="font-num">{switches}</b></p>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {EVENTS.map((e) => <button key={e.k} type="button" onClick={() => fire(e)} className={`rounded-xl border-2 px-3 py-1.5 text-sm font-semibold ${e.from === st ? "border-[var(--text-primary)] bg-[var(--surface)] text-[var(--text-primary)]" : "border-dashed border-[var(--border)] text-[var(--text-secondary)]"}`}>{e.label}</button>)}
            <button type="button" onClick={() => { setSt("New"); setLog([]); setSwitches(0); }} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>
          </div>
          <ul aria-live="polite" className="space-y-1.5">
            {log.length === 0 ? <li className="rounded-xl bg-[var(--surface)] px-3 py-2 text-sm">Start with <b>Admit</b>. Try something impossible too, like I/O finishing while the process is New.</li>
              : log.map((l, i) => <li key={i} className={`rounded-xl px-3 py-2 text-sm ${l.ok ? "bg-[var(--surface)] text-[var(--text-primary)]" : "bg-rose-600 font-semibold text-white"}`}>{l.text}</li>)}
          </ul>
        </div>
      </div>
    </Lab>
  );
}

/* ------------------------------------------------------------ fork() */
type Op = "fork" | "print" | { and: true } | { or: true } | { ifChild: Op[] } | { loop: number; body: Op[] };
type Proc = { id: number; parent: number | null; prints: number };
export function simulateFork(ops: Op[]) {
  const procs: Proc[] = [{ id: 0, parent: null, prints: 0 }];
  const exec = (p: Proc, list: Op[]): void => {
    for (let k = 0; k < list.length; k++) {
      const o = list[k], rest = list.slice(k + 1);
      if (o === "print") p.prints++;
      else if (o === "fork") { const c = { id: procs.length, parent: p.id, prints: 0 }; procs.push(c); exec(c, rest); }
      else if ("and" in o) { const c = { id: procs.length, parent: p.id, prints: 0 }; procs.push(c); exec(c, rest); const c2 = { id: procs.length, parent: p.id, prints: 0 }; procs.push(c2); exec(c2, rest); }
      else if ("or" in o) { const c = { id: procs.length, parent: p.id, prints: 0 }; procs.push(c); const c2 = { id: procs.length, parent: c.id, prints: 0 }; procs.push(c2); exec(c2, rest); exec(c, rest); }
      else if ("ifChild" in o) { const c = { id: procs.length, parent: p.id, prints: 0 }; procs.push(c); exec(c, [...o.ifChild, ...rest]); }
      else { const body: Op[] = []; for (let i = 0; i < o.loop; i++) body.push(...o.body); exec(p, [...body, ...rest]); return; }
    }
  };
  exec(procs[0], ops);
  return { procs, prints: procs.reduce((t, x) => t + x.prints, 0) };
}
const PROGRAMS: { name: string; code: string; ops: Op[] }[] = [
  { name: "Three forks", code: 'fork();\nfork();\nfork();\nprintf("x");', ops: ["fork", "fork", "fork", "print"] },
  { name: "Fork in a loop", code: 'for (i = 0; i < 3; i++) {\n  fork();\n  printf("x");\n}', ops: [{ loop: 3, body: ["fork", "print"] }] },
  { name: "Only the child forks", code: 'if (fork() == 0)\n  fork();\nprintf("x");', ops: [{ ifChild: ["fork"] }, "print"] },
  { name: "fork() && fork()", code: 'fork() && fork();\nprintf("x");', ops: [{ and: true }, "print"] },
  { name: "fork() || fork()", code: 'fork() || fork();\nprintf("x");', ops: [{ or: true }, "print"] },
];
export function ForkLab() {
  const [k, setK] = useState(0);
  const [n, setN] = useState(3);
  const prog = k === 1 ? { ...PROGRAMS[1], code: PROGRAMS[1].code.replace("< 3", `< ${n}`), ops: [{ loop: n, body: ["fork", "print"] }] as Op[] } : PROGRAMS[k];
  const r = useMemo(() => simulateFork(prog.ops), [prog.ops]);
  const depth = (p: Proc): number => (p.parent === null ? 0 : 1 + depth(r.procs[p.parent]));
  const levels = Math.max(...r.procs.map(depth)) + 1;
  return (
    <Lab title="fork() lab" note="Pick a program. Every process is drawn, with how many times it prints." tint="mint">
      <div className="flex flex-wrap gap-2">{PROGRAMS.map((p, i) => <button key={p.name} type="button" aria-pressed={k === i} onClick={() => setK(i)} className={k === i ? "pill-ink" : "pill-soft"}>{p.name}</button>)}</div>
      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="space-y-3">
          <pre className="rounded-2xl bg-[var(--surface)] p-4 font-mono text-sm text-[var(--text-primary)]">{prog.code}</pre>
          {k === 1 && <p className="flex items-center gap-2 text-sm">Loop runs <button type="button" disabled={n <= 1} onClick={() => setN(n - 1)} className="pill-soft !h-8 !px-3">−</button><b className="font-num">{n}</b><button type="button" disabled={n >= 4} onClick={() => setN(n + 1)} className="pill-soft !h-8 !px-3">+</button> times</p>}
          <div aria-live="polite" className="rounded-2xl bg-[var(--surface)] p-3 text-sm">
            <p><b>{r.procs.length}</b> processes in total (<b>{r.procs.length - 1}</b> created by fork), <b>{r.prints}</b> lines printed.</p>
            {k === 0 && <p className="mt-1 text-[var(--text-secondary)]">Each fork doubles the processes: 2³ = 8.</p>}
            {k === 1 && <p className="mt-1 text-[var(--text-secondary)]">Prints = 2 + 4 + … + 2^{n} = 2^{n + 1} − 2 = {2 ** (n + 1) - 2}.</p>}
            {k >= 2 && <p className="mt-1 text-[var(--text-secondary)]">fork() returns 0 in the child and the child&apos;s id (non-zero) in the parent; that decides who runs the next fork.</p>}
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl bg-[var(--surface)] p-3">
          {Array.from({ length: levels }, (_, d) => (
            <div key={d} className="mb-2 flex flex-wrap items-center gap-1.5">
              <span className="w-16 shrink-0 text-xs font-bold text-[var(--text-secondary)]">{d === 0 ? "Original" : `Gen ${d}`}</span>
              {r.procs.filter((p) => depth(p) === d).map((p) => (
                <span key={p.id} title={p.parent === null ? "The original process" : `Child of P${p.parent}`} className="rounded-lg border-2 border-[var(--tint-ink)] px-2 py-1 font-num text-xs font-bold text-[var(--text-primary)]">P{p.id}{p.parent !== null && <span className="font-normal text-[var(--text-secondary)]"> ←P{p.parent}</span>} · {p.prints}×</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Lab>
  );
}

/* ------------------------------------------------------------ threads: many-to-one vs one-to-one */
const SHARED: { item: string; shared: boolean; why: string }[] = [
  { item: "Code (text section)", shared: true, why: "All threads run the same program." },
  { item: "Global variables", shared: true, why: "They live in the process's data section." },
  { item: "Heap", shared: true, why: "One address space, so malloc'd memory is visible to every thread." },
  { item: "Open files", shared: true, why: "The file table belongs to the process." },
  { item: "Stack", shared: false, why: "Each thread calls its own functions, so each needs its own stack." },
  { item: "Registers and program counter", shared: false, why: "Each thread is at its own place in the code." },
];
export function ThreadLab() {
  const [model, setModel] = useState<"m1" | "11">("m1");
  const [blocked, setBlocked] = useState<number | null>(null);
  const [picks, setPicks] = useState<Record<number, boolean>>({});
  const threads = [1, 2, 3];
  const runs = (t: number) => blocked === null || (model === "11" && t !== blocked);
  return (
    <Lab title="Threads lab" note="Block one thread on I/O and see who keeps running. Then sort what threads share." tint="peach">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={model === "m1"} onClick={() => { setModel("m1"); setBlocked(null); }} className={model === "m1" ? "pill-ink" : "pill-soft"}>User threads (many-to-one)</button>
            <button type="button" aria-pressed={model === "11"} onClick={() => { setModel("11"); setBlocked(null); }} className={model === "11" ? "pill-ink" : "pill-soft"}>Kernel threads (one-to-one)</button>
          </div>
          <div className="rounded-2xl bg-[var(--surface)] p-3">
            <p className="text-xs font-bold text-[var(--text-secondary)]">One process, three threads. The kernel sees {model === "m1" ? "one schedulable entity" : "three schedulable entities"}.</p>
            <ul className="mt-2 space-y-2">
              {threads.map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="w-20 text-sm font-bold">Thread {t}</span>
                  <span className={`flex-1 rounded-full px-3 py-1 text-center text-xs font-bold ${blocked === t ? "bg-amber-500 text-white" : runs(t) ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>{blocked === t ? "waiting for disk" : runs(t) ? "can run" : "stuck: whole process blocked"}</span>
                  <button type="button" onClick={() => setBlocked(blocked === t ? null : t)} className="pill-soft !h-8 !px-3 text-xs">{blocked === t ? "I/O done" : "Read file"}</button>
                </li>
              ))}
            </ul>
          </div>
          <div aria-live="polite" className="rounded-2xl bg-[var(--surface)] p-3 text-sm">{blocked === null ? "Press Read file on any thread." : model === "m1" ? "With many-to-one, the kernel only knows the process. One blocking call blocks every thread." : "With one-to-one, the kernel schedules each thread, so the other two keep running."}</div>
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">Shared by all threads, or one per thread?</p>
          <ul className="mt-2 space-y-2">
            {SHARED.map((x, i) => (
              <li key={x.item} className="rounded-2xl bg-[var(--surface)] p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="min-w-0 flex-1 font-semibold text-[var(--text-primary)]">{x.item}</span>
                  {[true, false].map((v) => { const chose = picks[i] === v, right = x.shared === v, done = i in picks; return (
                    <button key={String(v)} type="button" onClick={() => setPicks((p) => ({ ...p, [i]: v }))} className={`rounded-full border-2 px-2.5 py-1 text-xs font-bold ${done ? (right ? "border-emerald-600 bg-emerald-600 text-white" : chose ? "border-rose-600 bg-rose-600 text-white" : "border-[var(--border)] text-[var(--text-secondary)]") : "border-[var(--border)]"}`}>{v ? "Shared" : "Per thread"}</button>
                  ); })}
                </div>
                {i in picks && <p className="mt-1 text-xs text-[var(--text-secondary)]">{x.why}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Lab>
  );
}

/* ------------------------------------------------------------ system calls: the trip into the kernel */
const TRIP = [
  { who: "user", text: "The program calls read(fd, buf, n) from the C library." },
  { who: "user", text: "The library puts the system-call number and arguments in registers." },
  { who: "trap", text: "It executes a trap instruction. The CPU switches the mode bit to kernel mode and jumps to the kernel's handler." },
  { who: "kernel", text: "The kernel checks the arguments (is buf really this process's memory?) and runs the read." },
  { who: "kernel", text: "It copies the data into buf and puts the return value (bytes read) in a register." },
  { who: "trap", text: "It returns from the trap: the mode bit goes back to user mode." },
  { who: "user", text: "The program continues after the call with the result." },
];
const OPS: { op: string; priv: boolean }[] = [
  { op: "Add two numbers in registers", priv: false },
  { op: "Turn interrupts off", priv: true },
  { op: "Read the time of day", priv: false },
  { op: "Change the page table base register", priv: true },
  { op: "Start a disk I/O operation directly", priv: true },
  { op: "Call a function in your own program", priv: false },
];
export function SyscallLab() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Record<number, boolean>>({});
  // kernel mode from the trap (step 3) until the return from trap (step 6)
  const mode = step >= 3 && step <= 5 ? "kernel" : "user";
  return (
    <Lab title="System call lab" note="Step through one read() call, then sort which instructions need kernel mode." tint="lilac">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3">
            <span className="text-sm font-bold">Mode bit:</span>
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold text-white ${mode === "kernel" ? "bg-rose-600" : "bg-emerald-600"}`}>{mode === "kernel" ? "0 · kernel mode" : "1 · user mode"}</span>
          </div>
          <ol className="space-y-1.5">
            {TRIP.slice(0, step).map((t, i) => <li key={i} className={`rounded-xl px-3 py-2 text-sm ${t.who === "kernel" ? "bg-rose-600/10" : t.who === "trap" ? "bg-amber-500/15 font-semibold" : "bg-[var(--surface)]"}`}>{i + 1}. {t.text}</li>)}
          </ol>
          <div className="flex gap-2">
            {step < TRIP.length && <button type="button" onClick={() => setStep((s) => s + 1)} className="pill-ink">{step ? "Next step" : "Call read()"}</button>}
            {step > 0 && <button type="button" onClick={() => setStep(0)} className="pill-soft"><RotateCcw className="h-4 w-4" aria-hidden /> Reset</button>}
          </div>
          {step === TRIP.length && <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Two mode switches (user → kernel → user) for one call. That is why system calls cost more than ordinary function calls.</p>}
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--text-primary)]">Needs kernel mode (privileged) or not?</p>
          <ul className="mt-2 space-y-2">
            {OPS.map((x, i) => (
              <li key={x.op} className="flex flex-wrap items-center gap-2 rounded-2xl bg-[var(--surface)] p-3 text-sm">
                <span className="min-w-0 flex-1 font-semibold text-[var(--text-primary)]">{x.op}</span>
                {[true, false].map((v) => { const chose = picks[i] === v, right = x.priv === v, done = i in picks; return (
                  <button key={String(v)} type="button" onClick={() => setPicks((p) => ({ ...p, [i]: v }))} className={`rounded-full border-2 px-2.5 py-1 text-xs font-bold ${done ? (right ? "border-emerald-600 bg-emerald-600 text-white" : chose ? "border-rose-600 bg-rose-600 text-white" : "border-[var(--border)] text-[var(--text-secondary)]") : "border-[var(--border)]"}`}>{v ? "Privileged" : "Ordinary"}</button>
                ); })}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Lab>
  );
}
