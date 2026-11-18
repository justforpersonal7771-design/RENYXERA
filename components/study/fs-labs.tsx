"use client";

/** Labs for File systems and disk: disk scheduling (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK) and file allocation. */
import { useMemo, useState } from "react";

export type DiskAlgo = "FCFS" | "SSTF" | "SCAN" | "CSCAN" | "LOOK" | "CLOOK";
/** Head path and total head movement. Direction "up" = towards higher cylinders. SCAN/C-SCAN go to the disk end (0 or max). */
export function seek(reqs: number[], head: number, algo: DiskAlgo, max = 199, dir: "up" | "down" = "up") {
  let path = [head];
  const up = reqs.filter((r) => r >= head).sort((a, b) => a - b), down = reqs.filter((r) => r < head).sort((a, b) => b - a);
  if (algo === "FCFS") path = [head, ...reqs];
  else if (algo === "SSTF") { const left = [...reqs]; let at = head; while (left.length) { left.sort((a, b) => Math.abs(a - at) - Math.abs(b - at) || a - b); at = left.shift()!; path.push(at); } }
  else {
    const first = dir === "up" ? up : down, second = dir === "up" ? down : up;
    if (algo === "SCAN") path = [head, ...first, ...(second.length ? [dir === "up" ? max : 0] : []), ...second];
    else if (algo === "LOOK") path = [head, ...first, ...second];
    else if (algo === "CSCAN") path = [head, ...first, ...(second.length ? [dir === "up" ? max : 0, dir === "up" ? 0 : max] : []), ...[...second].reverse()];
    else path = [head, ...first, ...[...second].reverse()];
  }
  let total = 0; for (let i = 1; i < path.length; i++) total += Math.abs(path[i] - path[i - 1]);
  return { path, total };
}

export const DISK_REQ = [82, 170, 43, 140, 24, 16, 190];
export function DiskLab() {
  const [algo, setAlgo] = useState<DiskAlgo>("FCFS");
  const [head, setHead] = useState(50);
  const r = useMemo(() => seek(DISK_REQ, head, algo), [head, algo]);
  const all = (["FCFS", "SSTF", "SCAN", "CSCAN", "LOOK", "CLOOK"] as DiskAlgo[]).map((a) => ({ a, t: seek(DISK_REQ, head, a).total }));
  const W = 560, H = 18 * r.path.length + 20;
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint="butter" aria-label="Disk scheduling lab">
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">Disk scheduling lab</p><span className="text-sm text-[var(--text-secondary)]">Cylinders 0 to 199. Requests {DISK_REQ.join(", ")}. The head moves towards higher cylinders first.</span></div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {(["FCFS", "SSTF", "SCAN", "CSCAN", "LOOK", "CLOOK"] as DiskAlgo[]).map((a) => <button key={a} type="button" aria-pressed={algo === a} onClick={() => setAlgo(a)} className={algo === a ? "pill-ink" : "pill-soft"}>{a === "CSCAN" ? "C-SCAN" : a === "CLOOK" ? "C-LOOK" : a}</button>)}
        <label className="inline-flex items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>Head at</b><input type="range" min={0} max={199} value={head} onChange={(e) => setHead(Number(e.target.value))} aria-label="Head position" className="accent-[var(--tint-ink)]" /><span className="font-num w-8">{head}</span></label>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[480px]" role="img" aria-label={`Head path: ${r.path.join(" → ")}`}>
          {[0, 50, 100, 150, 199].map((c) => <g key={c}><line x1={(c / 199) * (W - 20) + 10} y1={6} x2={(c / 199) * (W - 20) + 10} y2={H - 4} stroke="var(--border)" strokeDasharray="3 3" /><text x={(c / 199) * (W - 20) + 10} y={H} fontSize="9" textAnchor="middle" fill="var(--text-secondary)">{c}</text></g>)}
          <polyline fill="none" stroke="var(--tint-ink)" strokeWidth="2" points={r.path.map((c, i) => `${(c / 199) * (W - 20) + 10},${10 + i * 18}`).join(" ")} />
          {r.path.map((c, i) => <g key={i}><circle cx={(c / 199) * (W - 20) + 10} cy={10 + i * 18} r="4" fill={DISK_REQ.includes(c) || i === 0 ? "var(--tint-ink)" : "var(--surface)"} stroke="var(--tint-ink)" /><text x={(c / 199) * (W - 20) + 16} y={13 + i * 18} fontSize="9" fill="var(--text-primary)">{c}</text></g>)}
        </svg>
      </div>
      <p className="mt-2 font-num text-sm">{r.path.join(" → ")}</p>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-6">
        {all.map((x) => <p key={x.a} className={`rounded-2xl p-2 text-center text-xs ${x.a === algo ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>{x.a === "CSCAN" ? "C-SCAN" : x.a === "CLOOK" ? "C-LOOK" : x.a}<b className="block font-num text-lg">{x.t}</b></p>)}
      </div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Total head movement in cylinders. SCAN and C-SCAN travel to the end of the disk; LOOK and C-LOOK turn at the last request. C-SCAN&apos;s return sweep counts as movement here (some books leave it out: read the question).</p>
    </section>
  );
}

/* ------------------------------------------------------------ file allocation and inode size */
export function maxFileSize(block: number, ptr: number, direct: number, single: number, double: number, triple: number) {
  const per = block / ptr;
  return (direct + single * per + double * per * per + triple * per * per * per) * block;
}
export function AllocLab() {
  const [block, setBlock] = useState(4096);
  const [ptr, setPtr] = useState(4);
  const [direct, setDirect] = useState(12);
  const per = block / ptr;
  const size = maxFileSize(block, ptr, direct, 1, 1, 1);
  const fmt = (b: number) => (b >= 2 ** 40 ? `${(b / 2 ** 40).toFixed(2)} TB` : b >= 2 ** 30 ? `${(b / 2 ** 30).toFixed(2)} GB` : b >= 2 ** 20 ? `${(b / 2 ** 20).toFixed(2)} MB` : `${(b / 1024).toFixed(0)} KB`);
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint="peach" aria-label="Inode lab">
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">Inode lab</p><span className="text-sm text-[var(--text-secondary)]">Direct pointers plus one single, one double and one triple indirect block.</span></div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold">Block size</span>{[1024, 2048, 4096].map((b) => <button key={b} type="button" aria-pressed={block === b} onClick={() => setBlock(b)} className={block === b ? "pill-ink" : "pill-soft"}>{b / 1024} KB</button>)}
        <span className="ml-2 font-bold">Pointer</span>{[4, 8].map((x) => <button key={x} type="button" aria-pressed={ptr === x} onClick={() => setPtr(x)} className={ptr === x ? "pill-ink" : "pill-soft"}>{x} bytes</button>)}
        <span className="ml-2 font-bold">Direct</span>{[10, 12].map((x) => <button key={x} type="button" aria-pressed={direct === x} onClick={() => setDirect(x)} className={direct === x ? "pill-ink" : "pill-soft"}>{x}</button>)}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-4 text-sm">
        <p className="rounded-2xl bg-[var(--surface)] p-3">Pointers per block <b className="block font-num text-xl">{per}</b><span className="text-xs text-[var(--text-secondary)]">{block} / {ptr}</span></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3">Direct <b className="block font-num text-xl">{fmt(direct * block)}</b></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3">+ single + double <b className="block font-num text-xl">{fmt((per + per * per) * block)}</b></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3">+ triple <b className="block font-num text-xl">{fmt(per ** 3 * block)}</b></p>
      </div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">Largest file = ({direct} + {per} + {per}² + {per}³) × {block} bytes ≈ <b>{fmt(size)}</b></p>
    </section>
  );
}
