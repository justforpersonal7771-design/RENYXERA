"use client";

/** Computer Organisation labs for main memory and secondary storage. All maths lives in lib/study/memory-hw.ts, checked by scripts/memory-hw-check.ts. */
import { useMemo, useState, type ReactNode } from "react";
import * as M from "@/lib/study/memory-hw";

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

/** Build a memory from chips: chips needed, address bits, the chip-select decoder, and where an address goes. */
export function MemDesignLab() {
  const [kw, setKw] = useState(64); const [wb, setWb] = useState(16); const [ckw, setCkw] = useState(16); const [cb, setCb] = useState(8); const [addr, setAddr] = useState(49443);
  const ok = M.isPow2(kw) && M.isPow2(ckw) && M.isPow2(wb) && M.isPow2(cb) && ckw <= kw && cb <= wb;
  const d = ok ? M.memoryDesign(kw * 1024, wb, ckw * 1024, cb) : null; const t = d && M.decodeAddress(Math.min(addr, kw * 1024 - 1), ckw * 1024);
  return (
    <Shell title="Memory design lab" note="Chips go in rows (more words) and columns (wider words). The high address bits pick a row through a decoder." tint="butter">
      <div className="mt-3 grid gap-3 sm:grid-cols-5"><NumField label="Memory words (K)" value={kw} set={setKw} min={1} max={65536} /><NumField label="Word width (bits)" value={wb} set={setWb} min={1} max={512} /><NumField label="Chip words (K)" value={ckw} set={setCkw} min={1} max={65536} /><NumField label="Chip width (bits)" value={cb} set={setCb} min={1} max={512} /><NumField label="An address to decode" value={addr} set={(v) => setAddr(Math.round(v))} max={67108863} /></div>
      {!d ? <p className="mt-3 text-sm font-semibold text-rose-700 dark:text-rose-300">Use powers of two, and chips no bigger than the memory.</p> : (
        <>
          <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Chips (rows × columns)" value={`${d.chips} (${d.rows} × ${d.cols})`} /><Stat label="Address bits" value={d.addrBits} /><Stat label="Chip address bits" value={d.chipAddrBits} /><Stat label="Decoder" value={d.selectBits ? `${d.selectBits} to ${d.rows}` : "none needed"} /></div>
          <p className="mt-2 text-sm text-[var(--text-primary)]">Address {addr} goes to chip row <b className="font-num">{t?.row}</b>, word <b className="font-num">{t?.offset}</b> in each chip of that row.</p>
        </>
      )}
    </Shell>
  );
}

/** Read consecutive words from one bank and from several, and see when each bank starts. */
export function InterleaveLab() {
  const [n, setN] = useState(8); const [m, setM] = useState(4); const [ta, setTa] = useState(40); const [tb, setTb] = useState(10);
  const r = useMemo(() => M.interleavedTime(Math.max(1, n), Math.max(1, m), ta, tb), [n, m, ta, tb]);
  const single = M.singleBankTime(n, ta); const scale = 100 / Math.max(r.total, 1);
  return (
    <Shell title="Interleaving lab" note="Consecutive words live in consecutive banks, so their accesses overlap." tint="sky">
      <div className="mt-3 grid gap-3 sm:grid-cols-4"><NumField label="Words to read" value={n} set={(v) => setN(Math.round(v))} min={1} max={16} /><NumField label="Banks" value={m} set={(v) => setM(Math.round(v))} min={1} max={16} /><NumField label="Bank access time (ns)" value={ta} set={setTa} min={1} max={1000} /><NumField label="Bus time per word (ns)" value={tb} set={setTb} min={1} max={1000} /></div>
      <div className="mt-3 space-y-1" aria-label="Bank timeline">{r.starts.map((s, k) => <div key={k} className="flex items-center gap-2 text-xs"><span className="w-20 shrink-0 font-num text-[var(--text-secondary)]">word {k} · bank {M.bankOf(k, m)}</span><div className="relative h-5 min-w-0 flex-1 rounded bg-[var(--surface)]"><span className="absolute top-0 h-5 rounded font-num text-[10px] leading-5 text-center" style={{ left: `${s * scale}%`, width: `${Math.max(2, ta * scale)}%`, background: "var(--tint-sky-ink)", color: "var(--background)" }}>{s}</span></div></div>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="One bank" value={`${single} ns`} /><Stat label={`${m} banks`} value={`${r.total} ns`} /><Stat label="Speed-up" value={`${(single / r.total).toFixed(2)}×`} /></div>
    </Shell>
  );
}

/** One disk request: seek, rotation and transfer, and how fast the disk streams. Then the capacity of RAID sets. */
export function DiskLab() {
  const [seek, setSeek] = useState(6); const [rpm, setRpm] = useState(7200); const [spt, setSpt] = useState(200); const [kb, setKb] = useState(4); const [ctl, setCtl] = useState(0.2);
  const [level, setLevel] = useState<M.Raid>("5"); const [n, setN] = useState(8); const [size, setSize] = useState(2);
  const a = M.diskAccess({ seekMs: seek, rpm, sectorsPerTrack: spt, sectorBytes: 512, controllerMs: ctl }, kb * 1024); const rd = M.raid(level, n, size);
  const parts = [{ l: "Seek", v: seek, c: "rose" }, { l: "Rotation (half a turn)", v: a.latencyMs, c: "butter" }, { l: "Transfer", v: a.transferMs, c: "mint" }, { l: "Controller", v: ctl, c: "sky" }];
  return (
    <Shell title="Disk and RAID lab" note="Access time = seek + half a rotation + transfer + controller. RAID trades capacity for speed or safety." tint="mint">
      <div className="mt-3 grid gap-3 sm:grid-cols-5"><NumField label="Seek (ms)" value={seek} set={setSeek} step={0.5} max={100} /><NumField label="Speed (rpm)" value={rpm} set={setRpm} min={1000} max={20000} /><NumField label="Sectors per track" value={spt} set={setSpt} min={1} max={2000} /><NumField label="Request (KB)" value={kb} set={setKb} min={0.5} max={4096} step={0.5} /><NumField label="Controller (ms)" value={ctl} set={setCtl} step={0.1} max={10} /></div>
      <div className="mt-3 flex h-6 overflow-hidden rounded-full" aria-label="Where the time goes">{parts.map((p) => <span key={p.l} title={`${p.l}: ${p.v.toFixed(2)} ms`} style={{ width: `${(p.v / a.total) * 100}%`, background: `var(--tint-${p.c}-ink)`, minWidth: 2 }} />)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-5">{parts.map((p) => <Stat key={p.l} label={p.l} value={`${p.v.toFixed(2)} ms`} />)}<Stat label="Total access" value={`${a.total.toFixed(2)} ms`} /></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">One rotation takes {a.rotationMs.toFixed(2)} ms; streaming rate {(a.rateBytesPerSec / 1e6).toFixed(2)} MB/s.</p>
      <div className="mt-5 flex flex-wrap items-center gap-2" role="group" aria-label="RAID level">{(["0", "1", "5", "6", "10"] as M.Raid[]).map((l) => <Pill key={l} on={level === l} onClick={() => setLevel(l)}>RAID {l}</Pill>)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><NumField label="Disks" value={n} set={(v) => setN(Math.round(v))} min={2} max={64} /><NumField label="Size of each disk (TB)" value={size} set={setSize} min={0.5} max={100} step={0.5} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Usable capacity" value={`${rd.usable} TB of ${n * size} TB`} /><Stat label="Disk failures survived" value={rd.survives} /><Stat label="Disk accesses per small write" value={rd.writePenalty} /></div>
    </Shell>
  );
}

/** Hamming (even parity): choose data bits, flip any bit, and see the syndrome point at it. */
export function HammingLab() {
  const [bits, setBits] = useState("1011"); const [flip, setFlip] = useState(0);
  const data = bits.replace(/[^01]/g, "").slice(0, 11).split("").map(Number);
  const code = useMemo(() => (data.length ? M.hammingEncode(data) : []), [bits]); // eslint-disable-line react-hooks/exhaustive-deps
  const rx = code.map((b, i) => (i + 1 === flip ? b ^ 1 : b)); const dec = code.length ? M.hammingDecode(rx) : null;
  return (
    <Shell title="Hamming code lab" note="Check bits sit at positions 1, 2, 4, 8…; each covers the positions that have its bit set. The syndrome is the position of the error." tint="lilac">
      <label className="mt-3 block max-w-xs text-sm font-semibold text-[var(--text-secondary)]">Data bits (0 and 1, up to 11)<input value={bits} onChange={(e) => setBits(e.target.value.replace(/[^01]/g, "").slice(0, 11))} spellCheck={false} className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" /></label>
      {code.length > 0 && dec && (
        <>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Click a bit of the stored word to flip it (as if the memory made an error).</p>
          <ol className="mt-2 flex flex-wrap gap-1.5" aria-label="Stored word">{rx.map((b, i) => { const pos = i + 1; const chk = (pos & (pos - 1)) === 0; return <li key={pos}><button type="button" onClick={() => setFlip(flip === pos ? 0 : pos)} aria-pressed={flip === pos} aria-label={`Position ${pos}, ${chk ? "check" : "data"} bit ${b}`} className="grid h-14 w-11 cursor-pointer place-items-center rounded-xl border-2 text-center font-num" style={{ borderColor: flip === pos ? "var(--tint-rose-ink)" : chk ? "var(--tint-lilac-ink)" : "var(--border)", background: flip === pos ? "var(--tint-rose)" : chk ? "var(--tint-lilac)" : "var(--surface)", color: flip === pos ? "var(--tint-rose-ink)" : chk ? "var(--tint-lilac-ink)" : "var(--text-primary)" }}><b className="text-lg">{b}</b><span className="text-[10px] font-sans">{chk ? `p${pos}` : `${pos}`}</span></button></li>; })}</ol>
          <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Check bits for this length" value={code.length - data.length} /><Stat label="Syndrome" value={dec.syndrome === 0 ? "0 (no error)" : `${dec.syndrome} (position)`} /><Stat label="Corrected word" value={dec.corrected.join("")} /><Stat label="Data recovered" value={dec.data.join("") === data.join("") ? `${dec.data.join("")} ✓` : dec.data.join("")} /></div>
        </>
      )}
    </Shell>
  );
}
