"use client";

/** Labs for Memory management: placement (first/best/worst fit), address translation, and effective access time. */
import { useMemo, useState, type ReactNode } from "react";

function Lab({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------ placement */
export type Fit = "first" | "best" | "worst";
export const HOLES = [150, 400, 250, 300, 500];
export const REQUESTS = [220, 410, 110, 280];
/** Place requests into holes (sizes in KB). Returns the hole index used by each request (or -1) and the holes left. */
export function place(fit: Fit, holes = HOLES, reqs = REQUESTS) {
  const h = [...holes];
  const used = reqs.map((r) => {
    const ok = h.map((size, i) => ({ size, i })).filter((x) => x.size >= r);
    if (!ok.length) return -1;
    const pick = fit === "first" ? ok[0] : fit === "best" ? ok.reduce((a, b) => (b.size < a.size ? b : a)) : ok.reduce((a, b) => (b.size > a.size ? b : a));
    h[pick.i] -= r; return pick.i;
  });
  return { used, left: h };
}
export function FitLab() {
  const [fit, setFit] = useState<Fit>("first");
  const r = useMemo(() => place(fit), [fit]);
  const failed = REQUESTS.filter((_, i) => r.used[i] < 0);
  const free = r.left.reduce((t, x) => t + x, 0);
  return (
    <Lab title="Placement lab" note={`Holes ${HOLES.join(", ")} KB. Requests in order: ${REQUESTS.join(", ")} KB.`} tint="peach">
      <div className="flex flex-wrap gap-2">{(["first", "best", "worst"] as Fit[]).map((f) => <button key={f} type="button" aria-pressed={fit === f} onClick={() => setFit(f)} className={fit === f ? "pill-ink" : "pill-soft"}>{f[0].toUpperCase() + f.slice(1)} fit</button>)}</div>
      <div className="mt-4 space-y-2">
        {HOLES.map((size, i) => {
          const inHole = REQUESTS.map((req, k) => ({ req, k })).filter((x) => r.used[x.k] === i);
          return (
            <div key={i} className="flex items-center gap-3">
              <span className="w-24 shrink-0 text-sm font-bold">Hole {i + 1} · {size}</span>
              <div className="flex h-9 flex-1 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                {inHole.map((x) => <div key={x.k} className="grid place-items-center border-r border-[var(--surface)] text-xs font-extrabold text-[var(--surface)]" style={{ width: `${(x.req / 500) * 100}%`, background: `var(--tint-${["rose", "sky", "mint", "lilac"][x.k]}-ink)` }}>R{x.k + 1} {x.req}</div>)}
                <div className="grid place-items-center text-[11px] text-[var(--text-secondary)]" style={{ width: `${(r.left[i] / 500) * 100}%` }}>{r.left[i] ? `${r.left[i]} free` : ""}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">
        {failed.length ? <p className="font-bold text-rose-700 dark:text-rose-300">{failed.map((x) => `${x} KB`).join(", ")} could not be placed, although {free} KB is free in total: external fragmentation.</p>
          : <p className="font-bold text-emerald-700 dark:text-emerald-300">Every request placed. {free} KB is left, split into holes of {r.left.filter((x) => x).join(", ")} KB.</p>}
      </div>
    </Lab>
  );
}

/* ------------------------------------------------------------ address translation */
const TABLE = [3, 7, 5, 0, 2, 6, 1, 4]; // page → frame, for an 8-page process
export function PagingLab() {
  const [size, setSize] = useState(1024);
  const [addr, setAddr] = useState(2500);
  const max = size * TABLE.length - 1;
  const a = Math.min(addr, max);
  const page = Math.floor(a / size), offset = a % size, frame = TABLE[page], phys = frame * size + offset;
  const offBits = Math.log2(size), pageBits = Math.log2(TABLE.length);
  const bin = a.toString(2).padStart(offBits + pageBits, "0");
  return (
    <Lab title="Address translation lab" note="Pick a page size and a logical address; follow it to a physical address." tint="sky">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-bold">Page size</span>
        {[512, 1024, 2048].map((s) => <button key={s} type="button" aria-pressed={size === s} onClick={() => setSize(s)} className={size === s ? "pill-ink" : "pill-soft"}>{s} bytes</button>)}
      </div>
      <label className="mt-3 block text-sm font-bold">Logical address: <span className="font-num">{a}</span>
        <input type="range" min={0} max={max} value={a} onChange={(e) => setAddr(Number(e.target.value))} className="mt-2 w-full accent-[var(--tint-ink)]" aria-label="Logical address" />
      </label>
      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Page number <b className="block font-num text-2xl">{page}</b><span className="text-xs text-[var(--text-secondary)]">⌊{a} / {size}⌋</span></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Offset <b className="block font-num text-2xl">{offset}</b><span className="text-xs text-[var(--text-secondary)]">{a} mod {size}</span></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Frame (from table) <b className="block font-num text-2xl">{frame}</b></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Physical address <b className="block font-num text-2xl">{phys}</b><span className="text-xs text-[var(--text-secondary)]">{frame} × {size} + {offset}</span></p>
      </div>
      <p className="mt-3 rounded-2xl bg-[var(--surface)] p-3 font-num text-sm">Binary: <b className="text-[var(--tint-ink)]">{bin.slice(0, pageBits)}</b> <span>{bin.slice(pageBits)}</span> <span className="ml-2 font-sans text-xs text-[var(--text-secondary)]">{pageBits} page bits, {offBits} offset bits</span></p>
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs">{TABLE.map((f, p) => <span key={p} className={`rounded-lg px-2 py-1 font-num ${p === page ? "bg-[var(--tint-ink)] font-bold text-[var(--surface)]" : "bg-[var(--surface)]"}`}>page {p} → frame {f}</span>)}</div>
    </Lab>
  );
}

/* ------------------------------------------------------------ effective access time */
export const eat = (hit: number, tlb: number, mem: number, levels = 1) => hit * (tlb + mem) + (1 - hit) * (tlb + (levels + 1) * mem);
export function TlbLab() {
  const [hit, setHit] = useState(80);
  const [tlb, setTlb] = useState(20);
  const [mem, setMem] = useState(100);
  const [levels, setLevels] = useState(1);
  const e = eat(hit / 100, tlb, mem, levels);
  const none = (levels + 1) * mem;
  return (
    <Lab title="Access time lab" note="How much does the TLB save? Change the hit ratio and the times." tint="lilac">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm font-bold">TLB hit ratio: <span className="font-num">{hit}%</span><input type="range" min={0} max={100} value={hit} onChange={(x) => setHit(Number(x.target.value))} className="mt-1 w-full accent-[var(--tint-ink)]" aria-label="TLB hit ratio" /></label>
        <label className="text-sm font-bold">Memory access: <span className="font-num">{mem} ns</span><input type="range" min={20} max={200} step={10} value={mem} onChange={(x) => setMem(Number(x.target.value))} className="mt-1 w-full accent-[var(--tint-ink)]" aria-label="Memory access time" /></label>
        <label className="text-sm font-bold">TLB lookup: <span className="font-num">{tlb} ns</span><input type="range" min={0} max={50} step={5} value={tlb} onChange={(x) => setTlb(Number(x.target.value))} className="mt-1 w-full accent-[var(--tint-ink)]" aria-label="TLB lookup time" /></label>
        <div className="text-sm font-bold">Page table levels
          <div className="mt-1 flex gap-2">{[1, 2, 3].map((n) => <button key={n} type="button" aria-pressed={levels === n} onClick={() => setLevels(n)} className={levels === n ? "pill-ink !h-8" : "pill-soft !h-8"}>{n}</button>)}</div></div>
      </div>
      <div aria-live="polite" className="mt-4 grid gap-2 sm:grid-cols-2">
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Effective access time <b className="block font-num text-3xl">{e.toFixed(1)} ns</b></p>
        <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">Without a TLB <b className="block font-num text-3xl">{none} ns</b><span className="text-xs text-[var(--text-secondary)]">{levels} table read{levels > 1 ? "s" : ""} + the data</span></p>
      </div>
      <p className="mt-3 rounded-2xl bg-[var(--surface)] p-3 font-num text-sm">EAT = {hit / 100} × ({tlb} + {mem}) + {(1 - hit / 100).toFixed(2)} × ({tlb} + {levels + 1} × {mem})</p>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Assumes the TLB is searched first on every access; on a miss the page table ({levels} level{levels > 1 ? "s" : ""}) is read from memory, then the data.</p>
    </Lab>
  );
}
