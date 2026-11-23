"use client";

/** Computer Organisation labs for input/output. All maths lives in lib/study/io-hw.ts, checked by scripts/io-hw-check.ts. */
import { useState, type ReactNode } from "react";
import * as H from "@/lib/study/io-hw";

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
const NumField = ({ label, value, set, min = 0, max = 1e12, step = 1 }: { label: string; value: number; set: (n: number) => void; min?: number; max?: number; step?: number }) => (
  <label className="block min-w-0 text-sm font-semibold text-[var(--text-secondary)]">{label}
    <input type="number" inputMode="decimal" value={value} min={min} max={max} step={step} onChange={(e) => set(Math.min(max, Math.max(min, Number(e.target.value) || 0)))} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" />
  </label>
);
const PRESETS = [{ id: "mouse", label: "Mouse", rate: 60, chunk: 2 }, { id: "floppy", label: "Floppy", rate: 50_000, chunk: 2 }, { id: "disk", label: "Disk", rate: 4_000_000, chunk: 16 }];
const fmt = (x: number) => (x * 100 < 0.001 ? "< 0.001%" : `${(x * 100).toFixed(x * 100 < 1 ? 4 : 2)}%`);

/** The same device handled by polling, by interrupts and by DMA: how much of the CPU each takes. */
export function IoCompareLab() {
  const [rate, setRate] = useState(4_000_000); const [chunk, setChunk] = useState(16); const [clock, setClock] = useState(500); const [poll, setPoll] = useState(400); const [irq, setIrq] = useState(500); const [block, setBlock] = useState(8192); const [setup, setSetup] = useState(1000); const [busy, setBusy] = useState(100);
  const clk = clock * 1e6; const b = busy / 100;
  const rows = [{ l: "Polling", v: H.pollFraction(rate, chunk, poll, clk), n: "polls all the time, busy or not" }, { l: "Interrupts", v: H.interruptFraction(rate, chunk, irq, clk, b), n: "one interrupt per chunk, only while busy" }, { l: "DMA", v: H.dmaFraction(rate, block, setup, irq, clk, b), n: "one set-up and one interrupt per block" }];
  return (
    <Shell title="Polling, interrupts and DMA lab" note="CPU time = (events per second) × (cycles per event) / clock." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{PRESETS.map((p) => <Pill key={p.id} on={rate === p.rate} onClick={() => { setRate(p.rate); setChunk(p.chunk); }}>{p.label}</Pill>)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4 lg:grid-cols-8"><NumField label="Rate (bytes/s)" value={rate} set={setRate} min={1} /><NumField label="Chunk (bytes)" value={chunk} set={setChunk} min={1} /><NumField label="CPU clock (MHz)" value={clock} set={setClock} min={1} /><NumField label="Poll (cycles)" value={poll} set={setPoll} /><NumField label="Interrupt (cycles)" value={irq} set={setIrq} /><NumField label="DMA block (bytes)" value={block} set={setBlock} min={1} /><NumField label="DMA set-up (cycles)" value={setup} set={setSetup} /><NumField label="Device busy (%)" value={busy} set={setBusy} max={100} /></div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3" aria-label="CPU share">{rows.map((r) => <li key={r.l} className="rounded-2xl bg-[var(--surface)] p-3 text-sm">{r.l}<b className="mt-0.5 block font-num text-xl text-[var(--text-primary)]">{fmt(r.v)}</b><span className="text-xs text-[var(--text-secondary)]">{r.n}</span><span className="mt-2 block h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><span className="block h-full rounded-full" style={{ width: `${Math.min(100, Math.max(1.5, r.v * 100))}%`, background: "var(--tint-rose-ink)" }} /></span></li>)}</ul>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Polls a second: {Math.round(rate / chunk).toLocaleString("en-IN")}. A handler of {irq} cycles caps the interrupt rate at {Math.round(H.interruptCeiling(clk, irq)).toLocaleString("en-IN")} a second.</p>
    </Shell>
  );
}

/** Toggle which devices request the bus and see who wins on a daisy chain, and with rotating polling. */
export function DaisyLab() {
  const [req, setReq] = useState([false, true, false, true]); const [last, setLast] = useState(0);
  const d = H.daisyChain(req); const r = H.rotatingPoll(req, last);
  return (
    <Shell title="Bus arbitration lab" note="Devices sit in a chain. The grant enters at device 0 and the first requester keeps it." tint="butter">
      <p className="mt-3 text-sm text-[var(--text-secondary)]">Click a device to make it request.</p>
      <ol className="mt-2 flex flex-wrap items-center gap-2" aria-label="Devices in the chain">
        <li className="rounded-xl bg-[var(--surface)] px-3 py-2 text-sm font-bold text-[var(--text-primary)]">Controller</li>
        {req.map((on, i) => <li key={i} className="flex items-center gap-2"><span aria-hidden className="font-num text-[var(--text-secondary)]">{d.path.includes(i) ? "→" : "·"}</span><button type="button" aria-pressed={on} onClick={() => setReq(req.map((x, j) => (j === i ? !x : x)))} className="cursor-pointer rounded-xl border-2 px-4 py-2 text-sm font-bold" style={{ borderColor: d.granted === i ? "var(--tint-mint-ink)" : on ? "var(--tint-butter-ink)" : "var(--border)", background: d.granted === i ? "var(--tint-mint)" : on ? "var(--tint-butter)" : "var(--surface)", color: d.granted === i ? "var(--tint-mint-ink)" : on ? "var(--tint-butter-ink)" : "var(--text-primary)" }}>Device {i}{d.granted === i ? " · granted" : on ? " · waiting" : ""}</button></li>)}
      </ol>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Daisy chain grants" value={d.granted < 0 ? "nobody" : `Device ${d.granted}`} /><Stat label="Grant signal passed through" value={d.granted < 0 ? "the whole chain" : `${d.path.length} device${d.path.length === 1 ? "" : "s"}`} /><Stat label="Rotating poll grants" value={r < 0 ? "nobody" : `Device ${r}`} /></div>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">Last winner in the rotating poll: {req.map((_, i) => <Pill key={i} on={last === i} onClick={() => setLast(i)}>Device {i}</Pill>)}</div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">On a daisy chain device 0 always beats the others (fixed priority, so a busy device 0 can starve the rest). Rotating polling hands the bus to the next requester after the last winner.</p>
    </Shell>
  );
}

/** Cycle stealing against burst mode for a DMA device. */
export function DmaLab() {
  const [rate, setRate] = useState(1_000_000); const [word, setWord] = useState(2); const [mem, setMem] = useState(500); const [blockWords, setBlockWords] = useState(1024);
  const steal = H.cycleStealFraction(rate, word, mem); const burst = H.burstBlockMicros(blockWords, mem);
  return (
    <Shell title="DMA modes lab" note="Cycle stealing takes one memory cycle at a time; burst mode takes the memory for a whole block." tint="sky">
      <div className="mt-3 grid gap-3 sm:grid-cols-4"><NumField label="Device rate (bytes/s)" value={rate} set={setRate} min={1} /><NumField label="Word size (bytes)" value={word} set={setWord} min={1} max={64} /><NumField label="Memory cycle (ns)" value={mem} set={setMem} min={1} max={5000} /><NumField label="Burst block (words)" value={blockWords} set={setBlockWords} min={1} max={65536} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Words per second" value={Math.round(rate / word).toLocaleString("en-IN")} /><Stat label="Memory cycles stolen (cycle stealing)" value={`${(steal * 100).toFixed(2)}%`} /><Stat label="CPU locked out in one burst" value={`${burst.toFixed(1)} µs`} /><Stat label="Memory left for the CPU" value={`${Math.max(0, 100 - steal * 100).toFixed(2)}%`} /></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Both modes move the same data and take the same total memory time; cycle stealing spreads the delay in single cycles, burst mode puts it in one long pause (faster for the device, worse for a CPU that needs memory at once). Above 100% the device cannot be kept up with at all.</p>
    </Shell>
  );
}

/** Bus bandwidth for a width, a clock and a transaction size. */
export function BusLab() {
  const [w, setW] = useState(32); const [mhz, setMhz] = useState(100); const [words, setWords] = useState(8); const [oh, setOh] = useState(1);
  const bw = H.busBandwidth(w, mhz, words, oh); const peak = H.busBandwidth(w, mhz);
  return (
    <Shell title="Bus bandwidth lab" note="Bandwidth = bytes moved / time taken, address and arbitration cycles included." tint="mint">
      <div className="mt-3 grid gap-3 sm:grid-cols-4"><NumField label="Bus width (bits)" value={w} set={setW} min={1} max={512} /><NumField label="Clock (MHz)" value={mhz} set={setMhz} min={1} max={10000} /><NumField label="Words per transaction" value={words} set={(v) => setWords(Math.round(v))} min={1} max={256} /><NumField label="Overhead cycles (address…)" value={oh} set={setOh} max={20} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Peak (a word every cycle)" value={`${(peak / 1e6).toFixed(1)} MB/s`} /><Stat label="Delivered" value={`${(bw / 1e6).toFixed(1)} MB/s`} /><Stat label="Efficiency" value={`${((bw / peak) * 100).toFixed(1)}%`} /><Stat label="Cycles per transaction" value={words + oh} /></div>
    </Shell>
  );
}
