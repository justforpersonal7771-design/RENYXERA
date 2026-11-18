/**
 * CPU scheduling simulator, used by the CPU scheduling lessons and their lab so text and lab always agree.
 * Ties: by arrival time, then by process order. Round robin: a newly arrived process joins the queue before the
 * process whose time slice just ended (the usual GATE convention).
 */
export type Job = { id: string; arrival: number; burst: number; priority?: number };
export type Slice = { id: string | null; start: number; end: number }; // id null = CPU idle
export type Algo = "FCFS" | "SJF" | "SRTF" | "RR" | "PRIO";
export type Result = { gantt: Slice[]; rows: { id: string; arrival: number; burst: number; completion: number; turnaround: number; waiting: number; response: number }[]; avgTat: number; avgWt: number; switches: number };

export function schedule(jobs: Job[], algo: Algo, quantum = 2): Result {
  const js = jobs.map((j, i) => ({ ...j, i, left: j.burst, first: -1 }));
  const gantt: Slice[] = [];
  const push = (id: string | null, start: number, end: number) => {
    if (end <= start) return;
    const last = gantt[gantt.length - 1];
    if (last && last.id === id && last.end === start) last.end = end; else gantt.push({ id, start, end });
  };
  let t = 0;
  const done = () => js.every((j) => j.left === 0);
  const arrived = () => js.filter((j) => j.arrival <= t && j.left > 0);
  const byArr = (a: typeof js[number], b: typeof js[number]) => a.arrival - b.arrival || a.i - b.i;
  if (algo === "RR") {
    const queue: typeof js = [];
    const added = new Set<number>();
    const admit = (upTo: number) => { js.filter((j) => j.arrival <= upTo && !added.has(j.i)).sort(byArr).forEach((j) => { queue.push(j); added.add(j.i); }); };
    admit(t);
    while (!done()) {
      if (!queue.length) { const nxt = js.filter((j) => !added.has(j.i)).sort(byArr)[0]; push(null, t, nxt.arrival); t = nxt.arrival; admit(t); continue; }
      const j = queue.shift()!;
      if (j.first < 0) j.first = t;
      const run = Math.min(quantum, j.left);
      push(j.id, t, t + run); t += run; j.left -= run;
      admit(t);
      if (j.left > 0) queue.push(j);
    }
  } else if (algo === "SRTF") {
    while (!done()) {
      const ready = arrived();
      if (!ready.length) { const nxt = js.filter((j) => j.left > 0).sort(byArr)[0]; push(null, t, nxt.arrival); t = nxt.arrival; continue; }
      const j = ready.sort((a, b) => a.left - b.left || byArr(a, b))[0];
      if (j.first < 0) j.first = t;
      push(j.id, t, t + 1); t += 1; j.left -= 1;
    }
  } else {
    while (!done()) {
      const ready = arrived();
      if (!ready.length) { const nxt = js.filter((j) => j.left > 0).sort(byArr)[0]; push(null, t, nxt.arrival); t = nxt.arrival; continue; }
      const j = algo === "FCFS" ? ready.sort(byArr)[0] : algo === "SJF" ? ready.sort((a, b) => a.burst - b.burst || byArr(a, b))[0] : ready.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0) || byArr(a, b))[0];
      j.first = t; push(j.id, t, t + j.left); t += j.left; j.left = 0;
    }
  }
  const completion = new Map<string, number>();
  for (const s of gantt) if (s.id) completion.set(s.id, s.end);
  const rows = js.map((j) => { const c = completion.get(j.id)!; return { id: j.id, arrival: j.arrival, burst: j.burst, completion: c, turnaround: c - j.arrival, waiting: c - j.arrival - j.burst, response: j.first - j.arrival }; });
  const n = rows.length;
  const busy = gantt.filter((s) => s.id);
  let switches = 0; for (let k = 1; k < busy.length; k++) if (busy[k].id !== busy[k - 1].id) switches++;
  return { gantt, rows, avgTat: rows.reduce((x, r) => x + r.turnaround, 0) / n, avgWt: rows.reduce((x, r) => x + r.waiting, 0) / n, switches };
}
