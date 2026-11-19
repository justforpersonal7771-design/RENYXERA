"use client";

/** Operating Systems depth labs, one per added topic. Logic in lib/study/os2.ts (checked by script). */
import { useState, type ReactNode } from "react";
import * as E from "@/lib/study/os2";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => <button type="button" aria-pressed={on} onClick={onClick} className={on ? "pill-ink" : "pill-soft"}>{children}</button>;
const Stat = ({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) => <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">{label}<b className="block font-num text-xl">{value}</b>{sub && <span className="text-xs text-[var(--text-secondary)]">{sub}</span>}</p>;
const Field = ({ label, value, set }: { label: string; value: string; set: (v: string) => void }) => <label className="block min-w-0 text-sm font-bold">{label}<input value={value} onChange={(e) => set(e.target.value)} aria-label={label} spellCheck={false} className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>;
const Banner = ({ good, children }: { good: boolean; children: ReactNode }) => <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${good ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}>{children}</p>;
const Step = ({ label, v, set, min, max, step = 1 }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step?: number }) => (
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>{label}</b><button type="button" aria-label={`${label} down`} onClick={() => set(Math.max(min, +(v - step).toFixed(4)))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-12 text-center font-num">{v}</span><button type="button" aria-label={`${label} up`} onClick={() => set(Math.min(max, +(v + step).toFixed(4)))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">+</button></span>
);
const Log = ({ lines }: { lines: string[] }) => <ol className="mt-3 space-y-1 text-sm">{lines.map((l, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1.5">{l}</li>)}</ol>;
const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const ops = (s: string) => s.split(/[,\s]+/).filter(Boolean);

export function CtxLab() {
  const [n, setN] = useState(4), [p, setP] = useState(0.8), [q, setQ] = useState(4), [s, setS] = useState(1);
  return (
    <Shell title="Multiprogramming lab" note="n processes each wait for I/O a fraction p of the time; round robin pays s per switch." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="n" v={n} set={setN} min={1} max={12} /><Step label="p" v={p} set={setP} min={0.1} max={0.95} step={0.05} /><Step label="quantum" v={q} set={setQ} min={1} max={20} /><Step label="switch" v={s} set={setS} min={0} max={5} step={0.5} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="CPU utilisation 1 − pⁿ" value={pct(E.cpuUtil(n, p))} /><Stat label="RR useful time q/(q+s)" value={pct(E.rrEfficiency(q, s))} /><Stat label="Switch overhead" value={pct(1 - E.rrEfficiency(q, s))} /></div>
    </Shell>
  );
}

const TREES: [string, E.PEv[]][] = [
  ["Parent exits first", [{ kind: "fork", parent: "P", child: "C1" }, { kind: "fork", parent: "P", child: "C2" }, { kind: "exit", who: "C1" }, { kind: "exit", who: "P" }]],
  ["Parent waits", [{ kind: "fork", parent: "P", child: "C1" }, { kind: "exit", who: "C1" }, { kind: "wait", who: "P" }]],
  ["Never waits", [{ kind: "fork", parent: "P", child: "C1" }, { kind: "fork", parent: "P", child: "C2" }, { kind: "exit", who: "C1" }, { kind: "exit", who: "C2" }]],
];
export function ZombieLab() {
  const [i, setI] = useState(0); const r = E.procTree(TREES[i][1]);
  return (
    <Shell title="Zombie and orphan lab" note="A child that exits stays a zombie until its parent calls wait; a child whose parent exits is adopted by init." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{TREES.map(([n], k) => <Pill key={n} on={i === k} onClick={() => setI(k)}>{n}</Pill>)}</div>
      <Log lines={r.log} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Zombies now" value={r.zombies.join(", ") || "none"} /><Stat label="Orphans (parent = init)" value={r.orphans.join(", ") || "none"} /></div>
    </Shell>
  );
}

const RT: [string, E.RTask[]][] = [["U 0.83, RM fine", [{ c: 1, t: 4 }, { c: 2, t: 6 }, { c: 3, t: 12 }]], ["U 0.97, RM misses", [{ c: 2, t: 5 }, { c: 4, t: 7 }]], ["U 1.0", [{ c: 1, t: 2 }, { c: 2, t: 4 }]]];
export function RtLab() {
  const [i, setI] = useState(1), [alg, setAlg] = useState<"RM" | "EDF">("RM"); const r = E.rtSim(RT[i][1], alg);
  return (
    <Shell title="Real-time scheduling lab" note="Periodic tasks (C, T), deadline = period. RM: shorter period first. EDF: earliest deadline first." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{RT.map(([n], k) => <Pill key={n} on={i === k} onClick={() => setI(k)}>{n}</Pill>)}<Pill on={alg === "RM"} onClick={() => setAlg("RM")}>RM</Pill><Pill on={alg === "EDF"} onClick={() => setAlg("EDF")}>EDF</Pill></div>
      <p className="mt-3 text-sm">Tasks: {RT[i][1].map((t, k) => `T${k + 1}(${t.c}, ${t.t})`).join(", ")}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3"><Stat label="Utilisation U" value={r.U.toFixed(3)} /><Stat label="RM bound n(2^(1/n) − 1)" value={r.bound.toFixed(3)} /><Stat label="Hyperperiod" value={r.hyper} /></div>
      <div className="mt-3 flex flex-wrap gap-0.5">{r.timeline.slice(0, 36).map((t, k) => <span key={k} className={`grid h-7 w-6 place-items-center rounded text-xs font-bold ${t < 0 ? "bg-[var(--surface)] text-[var(--text-secondary)]" : "bg-[var(--surface-secondary)]"}`}>{t < 0 ? "·" : t + 1}</span>)}</div>
      <Banner good={!r.miss}>{r.miss ? `T${r.miss.task + 1} misses its deadline at t = ${r.miss.at}.` : `Every deadline met over the hyperperiod${alg === "RM" && r.U > r.bound ? " (above the RM bound, so the bound alone could not promise this)" : ""}.`}</Banner>
    </Shell>
  );
}

export function PvLab() {
  const [init, setInit] = useState(1), [src, setSrc] = useState("P(A) P(B) P(C) V(A) V(B)"); const r = E.pvTrace(init, ops(src));
  return (
    <Shell title="Semaphore trace lab" note="P decrements and blocks if the value goes negative; V increments and wakes one waiter. A negative value counts the waiters." tint="butter">
      <div className="mt-3 flex flex-wrap items-end gap-2"><Step label="Initial S" v={init} set={setInit} min={0} max={5} />{[["Mutex", 1, "P(A) P(B) P(C) V(A) V(B)"], ["Counting 3", 3, "P(A) P(B) P(C) P(D) P(E) V(A)"]].map(([n, v, s]) => <Pill key={n as string} on={src === s && init === v} onClick={() => { setInit(v as number); setSrc(s as string); }}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Operations" value={src} set={setSrc} /></div>
      <ol className="mt-3 space-y-1 text-sm">{r.log.map((l, k) => <li key={k} className="flex flex-wrap gap-3 rounded-xl bg-[var(--surface)] px-3 py-1.5"><b className="font-num">{l.op}</b><span className="font-num">S = {l.s}</span><span>{l.note}</span></li>)}</ol>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">Final S = {r.final}; waiting: {r.waiting.join(", ") || "none"}.</p>
    </Shell>
  );
}

export function MonitorLab() {
  const [n, setN] = useState(2), [src, setSrc] = useState("P P P C C C C P"); const r = E.monitorBuffer(n, ops(src).filter((x) => x === "P" || x === "C") as ("P" | "C")[]);
  return (
    <Shell title="Monitor lab" note="Bounded buffer as a monitor: wait(notFull) when full, wait(notEmpty) when empty, signal the other side." tint="mint">
      <div className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr] sm:items-end"><Step label="Buffer" v={n} set={setN} min={1} max={5} /><Field label="Calls (P produce, C consume)" value={src} set={setSrc} /></div>
      <Log lines={r.log} />
      <p aria-live="polite" className="mt-2 text-sm font-semibold">Items in buffer: {r.count}. Waiting producers: {r.waitP.length}, consumers: {r.waitC.length}.</p>
    </Shell>
  );
}

export function RwLab() {
  const [src, setSrc] = useState("+R1 +W1 +R2 -R1 -R2"), [pref, setPref] = useState<"reader" | "writer">("reader"); const r = E.readersWriters(ops(src), pref);
  return (
    <Shell title="Readers–writers lab" note="+X arrives, −X leaves. Readers share; a writer needs the room alone." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={pref === "reader"} onClick={() => setPref("reader")}>Reader preference</Pill><Pill on={pref === "writer"} onClick={() => setPref("writer")}>Writer preference</Pill>{[["Writer stuck", "+R1 +W1 +R2 -R1 -R2"], ["Writer first", "+R1 +W1 +R2 -R1 -W1"]].map(([n, s]) => <Pill key={n} on={src === s} onClick={() => setSrc(s)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Events" value={src} set={setSrc} /></div>
      <Log lines={r.log} />
      <p aria-live="polite" className="mt-2 text-sm font-semibold">Inside: {r.writer ?? (r.readers.join(", ") || "nobody")}. Waiting: {r.waiting.join(", ") || "none"}.</p>
    </Shell>
  );
}

export function DineLab() {
  const [n, setN] = useState(5), [s, setS] = useState<E.DineStrat>("naive"); const r = E.dine(n, s);
  return (
    <Shell title="Dining philosophers lab" note="All become hungry at the same moment. Which rule avoids deadlock?" tint="sky">
      <div className="mt-3 flex flex-wrap items-center gap-2"><Step label="Philosophers" v={n} set={setN} min={3} max={8} />{([["naive", "All take left first"], ["asym", "Odd take right first"], ["limit", "At most n − 1 sit"], ["both", "Take both or none"]] as const).map(([k, l]) => <Pill key={k} on={s === k} onClick={() => setS(k)}>{l}</Pill>)}</div>
      <div className="mt-3 flex flex-wrap gap-2">{Array.from({ length: n }, (_, p) => <span key={p} className={`grid h-12 w-12 place-items-center rounded-full font-bold ${r.eating.includes(p) ? "bg-emerald-700 text-white" : "bg-[var(--surface)]"}`}>P{p}</span>)}</div>
      <Banner good={!r.deadlock}>{r.deadlock ? "Deadlock: everyone holds one chopstick and waits for the next forever." : `Eating first: ${r.eating.map((p) => `P${p}`).join(", ")}. At most ⌊n/2⌋ = ${r.maxTogether} can ever eat together.`}</Banner>
    </Shell>
  );
}

export function PtSizeLab() {
  const [va, setVa] = useState(32), [pg, setPg] = useState(12), [pte, setPte] = useState(4), [pa, setPa] = useState(30); const r = E.pageTable(va, 2 ** pg, pte, pa);
  const fmt = (b: number) => (b >= 2 ** 30 ? `${b / 2 ** 30} GB` : b >= 2 ** 20 ? `${b / 2 ** 20} MB` : `${b / 2 ** 10} KB`);
  return (
    <Shell title="Page table size lab" note="Single-level, multilevel and inverted tables for the same machine." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="VA bits" v={va} set={setVa} min={16} max={64} /><Step label="log₂ page" v={pg} set={setPg} min={9} max={16} /><Step label="PTE bytes" v={pte} set={setPte} min={2} max={8} step={2} /><Step label="PA bits" v={pa} set={setPa} min={16} max={52} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Page-number bits" value={r.vpnBits} sub={`offset ${r.off} bits`} /><Stat label="Single-level table" value={fmt(r.single)} sub={`2^${r.vpnBits} entries`} /><Stat label="Levels to fit a page each" value={r.levels} sub={`${r.bitsPerLevel} bits per level`} /><Stat label="Frames" value={`2^${Math.log2(r.frames)}`} /><Stat label="Inverted table" value={fmt(r.inverted)} sub="one entry per frame" /></div>
    </Shell>
  );
}

export function BuddyLab() {
  const [src, setSrc] = useState("A70 B35 C80 -A D60"); const r = E.buddy(1024, ops(src));
  return (
    <Shell title="Buddy allocator lab" note="1024 KB. Requests round up to a power of two; freed buddies merge. Type A70 to allocate, −A to free." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{[["Three requests", "A70 B35 C80"], ["With frees", "A70 B35 C80 -A D60"], ["Free all", "A70 B35 C80 -A D60 -B -D -C"]].map(([n, s]) => <Pill key={n} on={src === s} onClick={() => setSrc(s)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Requests" value={src} set={setSrc} /></div>
      <div className="mt-3 flex min-w-0 overflow-hidden rounded-xl border border-[var(--border)]">{r.blocks.map((b) => <span key={b.off} style={{ flexGrow: b.size }} className={`min-w-0 truncate border-r border-[var(--border)] px-1 py-2 text-center text-xs font-bold last:border-r-0 ${b.owner ? "bg-[var(--surface-secondary)]" : "bg-[var(--surface)] text-[var(--text-secondary)]"}`}>{b.owner ? `${b.owner} ${b.size}` : b.size}</span>)}</div>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">Internal fragmentation: {r.internal} KB.</p>
      <ol className="mt-2 space-y-0.5 text-xs text-[var(--text-secondary)]">{r.log.map((l, i) => <li key={i}>{l}</li>)}</ol>
    </Shell>
  );
}

export function ClockLab() {
  const [src, setSrc] = useState("1 2 3 2 4 1 5 2"), [f, setF] = useState(3); const refs = ops(src).map(Number).filter((x) => !Number.isNaN(x)); const r = E.clockAlg(refs, f);
  return (
    <Shell title="Clock algorithm lab" note="Each frame has a reference bit (*). The hand clears bits until it finds a 0, and replaces that page." tint="butter">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Reference string" value={src} set={setSrc} /><Step label="Frames" v={f} set={setF} min={1} max={6} /></div>
      <ol className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{r.log.map((l, i) => <li key={i} className={`flex justify-between rounded-xl px-3 py-1.5 font-num ${l.hit ? "bg-[var(--surface)]" : "bg-[var(--surface-secondary)]"}`}><b>{l.ref}{l.hit ? " hit" : " fault"}</b><span>{l.frames}</span></li>)}</ol>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Clock" value={r.faults} /><Stat label="FIFO" value={E.fifoFaults(refs, f)} /><Stat label="LRU" value={E.lruFaults(refs, f)} /></div>
    </Shell>
  );
}

export function CowLab() {
  const [src, setSrc] = useState("C3 P3 C7 C7 P1"); const r = E.cow(10, ops(src));
  return (
    <Shell title="Copy-on-write lab" note="fork() shares all 10 pages read-only. The first write to a shared page copies it. P parent, C child." tint="mint">
      <div className="mt-3"><Field label="Writes" value={src} set={setSrc} /></div>
      <Log lines={r.log} />
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Pages copied" value={r.copies} /><Stat label="Frames used" value={r.frames} sub="10 shared + copies" /><Stat label="Eager fork would use" value={r.eagerFrames} /></div>
    </Shell>
  );
}

export function FsLinksLab() {
  const [src, setSrc] = useState("create a, ln a b, ln-s a s, rm a"); const r = E.links(src.split(",").map((x) => x.trim()).filter(Boolean));
  return (
    <Shell title="Links lab" note="create f · ln f g (hard) · ln-s f s (symbolic) · rm f, separated by commas." tint="rose">
      <div className="mt-3"><Field label="Commands" value={src} set={setSrc} /></div>
      <Log lines={r.log} />
      <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{r.rows.map((x) => <li key={x.name} className="rounded-xl bg-[var(--surface)] px-3 py-1.5"><b>{x.name}</b> · {x.kind} · {x.detail}</li>)}</ul>
    </Shell>
  );
}

export function FreeSpaceLab() {
  const [disk, setDisk] = useState(30), [blk, setBlk] = useState(12), [free, setFree] = useState(1000); const r = E.freeSpace(2 ** disk, 2 ** blk, 4, free);
  return (
    <Shell title="Free-space lab" note="Bit vector, linked list and grouping for the same disk (4-byte block pointers)." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="log₂ disk" v={disk} set={setDisk} min={20} max={40} /><Step label="log₂ block" v={blk} set={setBlk} min={9} max={16} /><Step label="Free blocks" v={free} set={setFree} min={100} max={100000} step={100} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Blocks on disk" value={r.blocks.toLocaleString("en-IN")} /><Stat label="Bit vector" value={`${r.bitmapBytes.toLocaleString("en-IN")} B`} sub={`${r.bitmapBlocks} blocks`} /><Stat label="Grouping" value={`${r.groupingBlocks} blocks`} sub={`${r.perBlock - 1} free addresses per block`} /></div>
    </Shell>
  );
}

export function DiskTimeLab() {
  const [rpm, setRpm] = useState(7200), [seek, setSeek] = useState(4), [spt, setSpt] = useState(500), [kb, setKb] = useState(4); const r = E.diskTime(rpm, seek, spt, 512, kb * 1024);
  return (
    <Shell title="Disk access time lab" note="Access = seek + average rotational latency (half a turn) + transfer. 512-byte sectors." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="RPM" v={rpm} set={setRpm} min={3600} max={15000} step={600} /><Step label="Seek ms" v={seek} set={setSeek} min={0} max={15} /><Step label="Sectors/track" v={spt} set={setSpt} min={50} max={1000} step={50} /><Step label="KB read" v={kb} set={setKb} min={1} max={1024} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="One revolution" value={`${r.rev.toFixed(2)} ms`} /><Stat label="Avg rotation" value={`${r.rot.toFixed(2)} ms`} /><Stat label="Transfer" value={`${r.transfer.toFixed(3)} ms`} sub={`${r.rateMBs.toFixed(2)} MB/s`} /><Stat label="Total" value={`${r.total.toFixed(2)} ms`} /></div>
    </Shell>
  );
}

export function RaidLab() {
  const [lvl, setLvl] = useState<E.Raid>(5), [n, setN] = useState(4); const r = E.raid(lvl, n, 2);
  return (
    <Shell title="RAID lab" note="n disks of 2 TB each." tint="peach">
      <div className="mt-3 flex flex-wrap items-center gap-2">{([0, 1, 5, 6, 10] as const).map((l) => <Pill key={l} on={lvl === l} onClick={() => setLvl(l)}>RAID {l}</Pill>)}<Step label="Disks" v={n} set={setN} min={2} max={12} /></div>
      {r.ok ? <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Usable" value={`${r.usable} TB`} /><Stat label="Efficiency" value={pct(r.efficiency)} /><Stat label="Disk failures survived" value={r.tolerates} sub={lvl === 10 ? "guaranteed; more if in different pairs" : undefined} /><Stat label="Small write cost" value={r.smallWrite} /></div> : <Banner good={false}>RAID {lvl} needs {lvl === 5 ? "at least 3" : lvl === 6 ? "at least 4" : lvl === 10 ? "an even number ≥ 4 of" : "at least 2"} disks.</Banner>}
    </Shell>
  );
}

export function DmaLab() {
  const [mhz, setMhz] = useState(500), [rate, setRate] = useState(2000); const r = E.ioCost(mhz, rate, 4, 400, 500, 4, 1500);
  return (
    <Shell title="Polling, interrupts and DMA lab" note="Device moves 4 bytes per request. Polling 400 cycles, interrupt 500 cycles, DMA 1500 cycles per 4 KB block." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="CPU MHz" v={mhz} set={setMhz} min={100} max={4000} step={100} /><Step label="Device KB/s" v={rate} set={setRate} min={100} max={10000} step={100} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Polling" value={pct(r.poll)} sub="of CPU time" /><Stat label="Interrupts" value={pct(r.irq)} sub="of CPU time" /><Stat label="DMA" value={`${(r.dma * 100).toFixed(3)}%`} sub="of CPU time" /></div>
      {r.poll > 1 && <Banner good={false}>The CPU cannot keep up: polling would need more than 100% of its cycles.</Banner>}
    </Shell>
  );
}
