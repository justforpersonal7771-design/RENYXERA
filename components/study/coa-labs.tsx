"use client";

/** Computer Organisation labs (cache memory, pipelining). All maths lives in lib/study/coa.ts and is checked by scripts/coa-check.ts. */
import { useMemo, useState, type ReactNode } from "react";
import * as C from "@/lib/study/coa";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => <button type="button" aria-pressed={on} onClick={onClick} className={on ? "pill-ink" : "pill-soft"}>{children}</button>;
const Stat = ({ label, value }: { label: string; value: ReactNode }) => <p className="min-w-0 break-words rounded-2xl bg-[var(--surface)] p-3 text-sm">{label}<b className="mt-0.5 block font-num text-lg text-[var(--text-primary)]">{value}</b></p>;
const NumField = ({ label, value, set, min = 0, max = 1e9, step = 1 }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number; step?: number }) => (
  <label className="block min-w-0 text-sm font-semibold text-[var(--text-secondary)]">{label}
    <input type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(e) => set(Math.min(max, Math.max(min, Number(e.target.value) || 0)))} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" />
  </label>
);
const pow2 = (n: number) => n > 0 && Math.log2(n) % 1 === 0;

const Seg = ({ n, label, tone }: { n: number; label: string; tone: string })=> (n > 0 ? <div className={`grid h-12 place-items-center rounded-lg border-2 text-center font-num text-sm font-bold ${tone}`} style={{ flex: n }}><span>{label}<span className="block text-xs font-normal">{n} bits</span></span></div> : null);

/** Choose a cache and see how an address is cut into tag, index and offset, and how big the directory is. */
export function CacheGeoLab() {
  const [addr, setAddr] = useState(34); const [kb, setKb] = useState(128); const [blk, setBlk] = useState(32); const [ways, setWays] = useState(8); const [extra, setExtra] = useState(2);
  const ok = pow2(kb) && pow2(blk) && kb * 1024 >= blk && (ways === 0 || pow2(ways)) && (ways === 0 || (kb * 1024) / blk >= ways);
  const cfg = { addrBits: addr, cacheBytes: kb * 1024, blockBytes: blk, ways };
  const g = useMemo(() => (ok ? C.cacheGeometry(cfg) : null), [ok, addr, kb, blk, ways]); // eslint-disable-line react-hooks/exhaustive-deps
  const bits = g ? C.directoryBits(cfg, extra) : 0;
  return (
    <Shell title="Cache geometry lab" note="Set the machine and the cache: the address splits into tag, index and offset." tint="butter">
      <div className="mt-3 grid gap-3 sm:grid-cols-5">
        <NumField label="Address bits" value={addr} set={setAddr} min={8} max={64} />
        <NumField label="Cache size (KB)" value={kb} set={setKb} min={1} max={65536} />
        <NumField label="Block size (B)" value={blk} set={setBlk} min={1} max={4096} />
        <div className="min-w-0 text-sm font-semibold text-[var(--text-secondary)]">Ways<div className="mt-1 flex flex-wrap gap-1">{[1, 2, 4, 8, 0].map((w) => <Pill key={w} on={ways === w} onClick={() => setWays(w)}>{w === 1 ? "Direct" : w === 0 ? "Fully" : `${w}-way`}</Pill>)}</div></div>
        <NumField label="Extra bits per line (dirty, ...)" value={extra} set={setExtra} min={0} max={8} />
      </div>
      {!g ? <p className="mt-3 text-sm font-semibold text-rose-700 dark:text-rose-300">Sizes must be powers of two, and the cache must hold at least one set.</p> : (
        <>
          <div className="mt-4 flex gap-1" aria-label="Address fields"><Seg n={g.tag} label="Tag" tone="border-[var(--tint-butter-ink)] bg-[var(--surface)]" /><Seg n={g.index} label="Index" tone="border-[var(--border)] bg-[var(--surface)]" /><Seg n={g.offset} label="Offset" tone="border-[var(--border)] bg-[var(--surface-secondary)]" /></div>
          <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Lines" value={g.lines} /><Stat label="Sets" value={g.sets} /><Stat label="Tag bits" value={g.tag} /><Stat label="Directory" value={`${bits.toLocaleString("en-IN")} bits`} /></div>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">Directory = lines × (tag + valid{extra ? ` + ${extra} extra` : ""}). Offset = log₂ block, index = log₂ sets, tag = the rest.</p>
        </>
      )}
    </Shell>
  );
}

const SIMS: { id: string; label: string; sets: number; ways: number; policy: C.Policy; seq: string }[] = [
  { id: "dm", label: "Direct mapped, 4 lines", sets: 4, ways: 1, policy: "LRU", seq: "0 8 0 8 0 8" },
  { id: "tw", label: "2-way, 4 lines", sets: 2, ways: 2, policy: "LRU", seq: "0 8 0 8 0 8" },
  { id: "lru", label: "Fully associative 3, LRU", sets: 1, ways: 3, policy: "LRU", seq: "1 2 3 1 4 1 2" },
  { id: "fifo", label: "Fully associative 3, FIFO", sets: 1, ways: 3, policy: "FIFO", seq: "1 2 3 1 4 1 2" },
];
/** Run a block-number sequence through a cache and see every hit, miss and eviction. */
export function CacheSimLab() {
  const [id, setId] = useState("dm"); const [seq, setSeq] = useState(SIMS[0].seq);
  const cfg = SIMS.find((s) => s.id === id)!;
  const addrs = seq.split(/[\s,]+/).map(Number).filter((n) => Number.isFinite(n) && n >= 0).slice(0, 24);
  const r = useMemo(() => C.simulateCache(cfg.sets, cfg.ways, 1, cfg.policy, addrs), [cfg, seq]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Shell title="Cache simulation lab" note="Block numbers go in one at a time; the set is block mod sets." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{SIMS.map((s) => <Pill key={s.id} on={id === s.id} onClick={() => { setId(s.id); setSeq(s.seq); }}>{s.label}</Pill>)}</div>
      <label className="mt-3 block max-w-md text-sm font-semibold text-[var(--text-secondary)]">Block sequence (numbers, up to 24)<input value={seq} onChange={(e) => setSeq(e.target.value)} spellCheck={false} autoComplete="off" className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" /></label>
      <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Accesses">{r.events.map((e, i) => <li key={i} className={`rounded-xl px-2.5 py-1.5 text-center font-num text-sm ${e.hit ? "bg-emerald-500/15" : "bg-rose-500/15"}`} title={e.hit ? "hit" : e.evicted !== null ? `miss, evicts ${e.evicted}` : "miss"}><b>{e.block}</b><span className="block text-[10px] font-sans font-bold">{e.hit ? "hit" : e.evicted !== null ? `miss ✕${e.evicted}` : "miss"}</span></li>)}</ol>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Hits" value={r.hits} /><Stat label="Misses" value={r.misses} /><Stat label="Hit ratio" value={addrs.length ? `${((r.hits / addrs.length) * 100).toFixed(1)}%` : "—"} /><Stat label="Contents (set: blocks)" value={r.state.map((l, i) => `${i}: ${l.join(",") || "–"}`).join(" · ")} /></div>
    </Shell>
  );
}

/** Average memory access time with one or two cache levels, against having no cache at all. */
export function AmatLab() {
  const [h1, setH1] = useState(1); const [m1, setM1] = useState(5); const [pen, setPen] = useState(100); const [two, setTwo] = useState(false); const [h2, setH2] = useState(10); const [m2, setM2] = useState(20);
  const a = two ? C.amat2(h1, m1 / 100, h2, m2 / 100, pen) : C.amat(h1, m1 / 100, pen);
  return (
    <Shell title="AMAT lab" note="Average memory access time = hit time + miss rate × miss penalty." tint="mint">
      <div className="mt-3 grid gap-3 sm:grid-cols-3"><NumField label="L1 hit time (cycles)" value={h1} set={setH1} min={0} max={50} step={0.5} /><NumField label="L1 miss rate (%)" value={m1} set={setM1} min={0} max={100} step={0.5} /><NumField label="Memory penalty (cycles)" value={pen} set={setPen} min={1} max={1000} /></div>
      <div className="mt-3 flex flex-wrap items-center gap-2"><Pill on={two} onClick={() => setTwo((v) => !v)}>Add an L2 cache</Pill></div>
      {two && <div className="mt-3 grid gap-3 sm:grid-cols-2"><NumField label="L2 hit time (cycles)" value={h2} set={setH2} min={0} max={200} /><NumField label="L2 local miss rate (%)" value={m2} set={setM2} min={0} max={100} step={0.5} /></div>}
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="AMAT" value={`${a.toFixed(2)} cycles`} /><Stat label="Without any cache" value={`${pen} cycles`} /><Stat label="Speed-up" value={`${(pen / a).toFixed(1)}×`} /></div>
    </Shell>
  );
}
