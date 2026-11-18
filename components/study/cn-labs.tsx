"use client";

/** Computer Networks labs. Every number a lesson quotes comes from the pure functions here (checked by scripts). */
import { useMemo, useState, type ReactNode } from "react";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => <button type="button" aria-pressed={on} onClick={onClick} className={on ? "pill-ink" : "pill-soft"}>{children}</button>;
const Stat = ({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) => <p className="rounded-2xl bg-[var(--surface)] p-3 text-sm">{label}<b className="block font-num text-xl">{value}</b>{sub && <span className="text-xs text-[var(--text-secondary)]">{sub}</span>}</p>;
const Range = ({ label, min, max, step = 1, value, set, unit }: { label: string; min: number; max: number; step?: number; value: number; set: (n: number) => void; unit?: string }) => (
  <label className="flex flex-wrap items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5 text-sm"><b>{label}</b><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} aria-label={label} className="min-w-0 flex-1 accent-[var(--tint-ink)]" /><span className="font-num">{value}{unit ? ` ${unit}` : ""}</span></label>
);
const fx = (n: number, d = 2) => Number(n.toFixed(d)).toString();

/* ------------------------------------------------------------ layering and encapsulation */
export const HEADERS = [
  { layer: "Application", pdu: "Message", add: 0, device: "Host", note: "HTTP, DNS, SMTP: the data itself." },
  { layer: "Transport", pdu: "Segment", add: 20, device: "Host", note: "TCP header (20 bytes minimum): ports, sequence numbers." },
  { layer: "Network", pdu: "Packet", add: 20, device: "Router", note: "IP header (20 bytes minimum): source and destination IP." },
  { layer: "Data link", pdu: "Frame", add: 18, device: "Switch, bridge", note: "Ethernet header 14 + trailer (CRC) 4: MAC addresses." },
  { layer: "Physical", pdu: "Bits", add: 0, device: "Hub, repeater", note: "Signals on the wire. Nothing is added." },
];
export function encapsulate(data: number, upto: number) { let size = data; for (let i = 1; i <= upto; i++) size += HEADERS[i].add; return { size, eff: data / size }; }
export function EncapLab() {
  const [down, setDown] = useState(3);
  const [data, setData] = useState(1000);
  const r = encapsulate(data, Math.min(down, 3));
  return (
    <Shell title="Encapsulation lab" note="Send data down the stack and watch each layer wrap it." tint="butter">
      <div className="mt-3 flex flex-wrap items-center gap-2">{HEADERS.map((h, i) => <Pill key={h.layer} on={down === i} onClick={() => setDown(i)}>{h.layer}</Pill>)}</div>
      <div className="mt-3"><Range label="Application data" min={100} max={1460} step={20} value={data} set={setData} unit="bytes" /></div>
      <div className="mt-4 space-y-1.5">
        {HEADERS.slice(0, down + 1).map((h, i) => (
          <div key={h.layer} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="w-24 shrink-0 font-bold">{h.layer}</span>
            <span className="flex min-w-0 flex-1 overflow-hidden rounded-xl font-num text-xs">
              {HEADERS.slice(1, i + 1).reverse().filter((x) => x.add).map((x) => <span key={x.layer} className="bg-[var(--tint-ink)] px-2 py-1.5 text-[var(--surface)]">{x.layer === "Data link" ? "Eth 14" : `${x.layer === "Transport" ? "TCP" : "IP"} ${x.add}`}</span>)}
              <span className="flex-1 bg-[var(--surface)] px-2 py-1.5">data {data}</span>
              {i >= 3 && <span className="bg-[var(--tint-ink)] px-2 py-1.5 text-[var(--surface)]">CRC 4</span>}
            </span>
            <span className="text-xs text-[var(--text-secondary)]">{h.pdu}</span>
          </div>
        ))}
      </div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">
        <Stat label="Size on this layer" value={`${r.size} bytes`} />
        <Stat label="Useful share" value={`${fx(r.eff * 100, 1)}%`} sub={`${data} / ${r.size}`} />
        <Stat label="Works here" value={HEADERS[down].device} />
      </div>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{HEADERS[down].note}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ delays and switching */
/** Times in ms. Packet of L bytes over R Mbps: L*8/(R*1000) ms. Distance km at speed (km/ms): d/v. */
export function delays(L: number, R: number, km: number, hops: number, packets: number, v = 200) {
  const tt = (L * 8) / (R * 1000), tp = km / v;
  return { tt, tp, total: (hops + packets - 1) * tt + hops * tp };
}
export function DelayLab() {
  const [L, setL] = useState(1000), [R, setR] = useState(1), [km, setKm] = useState(2000), [hops, setHops] = useState(3), [n, setN] = useState(1);
  const r = delays(L, R, km, hops, n);
  return (
    <Shell title="Delay lab" note="Store-and-forward: every router receives the whole packet before sending it on." tint="peach">
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Range label="Packet" min={100} max={2000} step={100} value={L} set={setL} unit="bytes" />
        <Range label="Link rate" min={1} max={10} value={R} set={setR} unit="Mbps" />
        <Range label="Each link" min={200} max={4000} step={200} value={km} set={setKm} unit="km" />
        <Range label="Links (hops)" min={1} max={5} value={hops} set={setHops} />
        <Range label="Packets" min={1} max={6} value={n} set={setN} />
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3">
        <div className="min-w-[420px] space-y-1">
          {Array.from({ length: hops }, (_, h) => (
            <div key={h} className="flex items-center gap-2 text-xs"><span className="w-12 shrink-0 font-bold">Link {h + 1}</span>
              <div className="relative h-5 flex-1 rounded bg-[var(--surface-secondary)]">
                {Array.from({ length: n }, (_, p) => { const start = (h + p) * r.tt + h * r.tp; return <span key={p} className="absolute top-0 h-5 rounded bg-[var(--tint-ink)] text-center text-[10px] leading-5 text-[var(--surface)]" style={{ left: `${(start / r.total) * 100}%`, width: `${(r.tt / r.total) * 100}%` }}>{p + 1}</span>; })}
              </div></div>
          ))}
        </div>
      </div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">
        <Stat label="Transmission per link" value={`${fx(r.tt, 3)} ms`} sub="L / R" />
        <Stat label="Propagation per link" value={`${fx(r.tp, 3)} ms`} sub="distance / 2×10⁸ m/s" />
        <Stat label="Last bit arrives" value={`${fx(r.total, 3)} ms`} sub={`(${hops} + ${n} − 1) × Tt + ${hops} × Tp`} />
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ CRC */
/** Remainder of (data followed by deg zeros) divided by gen, in modulo-2 arithmetic. */
export function crc(data: string, gen: string) {
  const deg = gen.length - 1; const bits = (data + "0".repeat(deg)).split("").map(Number); const g = gen.split("").map(Number);
  const steps: string[] = [];
  for (let i = 0; i + deg < bits.length; i++) if (bits[i]) { for (let j = 0; j < g.length; j++) bits[i + j] ^= g[j]; steps.push(bits.join("")); }
  const rem = bits.slice(-deg).join("");
  return { rem, sent: data + rem, steps };
}
export function CrcLab() {
  const [data, setData] = useState("110101");
  const [gen, setGen] = useState("1011");
  const [flip, setFlip] = useState<number | null>(null);
  const ok = /^[01]{1,16}$/.test(data) && /^1[01]{1,6}$/.test(gen);
  const r = ok ? crc(data, gen) : null;
  const recv = r ? (flip === null ? r.sent : r.sent.split("").map((b, i) => (i === flip ? (b === "1" ? "0" : "1") : b)).join("")) : "";
  const deg = gen.length - 1;
  const recvRem = r ? crc(recv.slice(0, -deg) , gen).rem : "";
  const good = r ? recvRem === recv.slice(-deg) : false;
  return (
    <Shell title="CRC lab" note="Divide by the generator in modulo-2 arithmetic; the remainder is the check bits." tint="mint">
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="text-sm font-bold">Data bits<input value={data} onChange={(e) => { setData(e.target.value.trim()); setFlip(null); }} aria-label="Data bits" className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>
        <label className="text-sm font-bold">Generator<input value={gen} onChange={(e) => { setGen(e.target.value.trim()); setFlip(null); }} aria-label="Generator" className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>
      </div>
      {!r ? <p className="mt-3 text-sm">Use 0s and 1s; the generator starts with 1.</p> : <>
        <div className="mt-3 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3 font-num text-sm">
          <p>{data}<span className="text-[var(--text-secondary)]">{"0".repeat(deg)}</span> ÷ {gen}</p>
          {r.steps.map((s, i) => <p key={i} className="text-[var(--text-secondary)]">{s}</p>)}
          <p className="mt-1 font-bold">Remainder {r.rem}</p>
        </div>
        <p className="mt-3 text-sm font-bold">Frame sent (tap a bit to flip it in transit)</p>
        <div className="mt-1 flex flex-wrap gap-1">{recv.split("").map((b, i) => <button key={i} type="button" onClick={() => setFlip(flip === i ? null : i)} aria-label={`Bit ${i + 1}`} className={`h-8 w-8 rounded-lg font-num font-bold ${flip === i ? "bg-rose-600 text-white" : i >= data.length ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>{b}</button>)}</div>
        <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${good ? "bg-[var(--surface)]" : "bg-rose-600 text-white"}`}>{good ? `Receiver divides and gets remainder ${"0".repeat(deg)}: accepted.` : `Receiver gets a non-zero remainder: error detected.`}</p>
      </>}
    </Shell>
  );
}

/* ------------------------------------------------------------ sliding window */
export function windowEff(tt: number, tp: number, w: number) { const a = tp / tt; return { a, cycle: 1 + 2 * a, eff: Math.min(1, w / (1 + 2 * a)) }; }
export function seqBits(w: number, proto: "GBN" | "SR") { let n = 1; while ((proto === "GBN" ? 2 ** n - 1 : 2 ** (n - 1)) < w) n++; return n; }
export function WindowLab() {
  const [tt, setTt] = useState(1), [tp, setTp] = useState(4.5), [w, setW] = useState(7);
  const [proto, setProto] = useState<"SW" | "GBN" | "SR">("GBN");
  const W = proto === "SW" ? 1 : w;
  const r = windowEff(tt, tp, W);
  return (
    <Shell title="Sliding window lab" note="How much of the round trip does the sender spend actually sending?" tint="peri">
      <div className="mt-3 flex flex-wrap gap-2">{(["SW", "GBN", "SR"] as const).map((p) => <Pill key={p} on={proto === p} onClick={() => setProto(p)}>{p === "SW" ? "Stop-and-wait" : p === "GBN" ? "Go-Back-N" : "Selective Repeat"}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Range label="Tt" min={0.5} max={5} step={0.5} value={tt} set={setTt} unit="ms" />
        <Range label="Tp" min={0.5} max={20} step={0.5} value={tp} set={setTp} unit="ms" />
        {proto !== "SW" && <Range label="Window" min={1} max={31} value={w} set={setW} />}
      </div>
      <div className="mt-4 rounded-2xl bg-[var(--surface)] p-3">
        <div className="flex h-7 overflow-hidden rounded-lg">{Array.from({ length: Math.min(W, Math.ceil(r.cycle)) }, (_, i) => <span key={i} className="border-r border-[var(--surface)] bg-[var(--tint-ink)]" style={{ width: `${(1 / Math.max(r.cycle, W)) * 100}%` }} />)}<span className="flex-1 bg-[var(--surface-secondary)]" /></div>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">One cycle = Tt + 2Tp = {fx(r.cycle * tt)} ms. Dark = time spent sending frames.</p>
      </div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-4">
        <Stat label="a = Tp / Tt" value={fx(r.a)} />
        <Stat label="Efficiency" value={`${fx(r.eff * 100, 1)}%`} sub={`min(1, ${W} / (1 + 2a))`} />
        <Stat label="Window for 100%" value={Math.ceil(r.cycle)} />
        <Stat label="Sequence bits" value={proto === "SW" ? 1 : seqBits(W, proto)} sub={proto === "GBN" ? "W ≤ 2ⁿ − 1" : proto === "SR" ? "W ≤ 2ⁿ⁻¹" : "0 and 1"} />
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ MAC: CSMA/CD and ALOHA */
export function minFrame(mbps: number, km: number, v = 200) { const tp = km / v; return { tp, bits: 2 * tp * mbps * 1000 }; } // tp in ms; bits = 2·tp·R
export const aloha = (G: number, slotted: boolean) => (slotted ? G * Math.exp(-G) : G * Math.exp(-2 * G));
export function MacLab() {
  const [R, setR] = useState(10), [km, setKm] = useState(2), [G, setG] = useState(0.5);
  const m = minFrame(R, km);
  const pts = (s: boolean) => Array.from({ length: 61 }, (_, i) => { const g = i / 20; return `${10 + g * 100},${110 - aloha(g, s) * 260}`; }).join(" ");
  return (
    <Shell title="Medium access lab" note="CSMA/CD's minimum frame, and ALOHA throughput against offered load." tint="rose">
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Range label="Rate" min={1} max={100} value={R} set={setR} unit="Mbps" />
        <Range label="Cable" min={0.5} max={5} step={0.5} value={km} set={setKm} unit="km" />
      </div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">
        <Stat label="Propagation Tp" value={`${fx(m.tp * 1000, 2)} µs`} />
        <Stat label="Minimum frame" value={`${fx(m.bits, 1)} bits`} sub="2 × Tp × R" />
        <Stat label="In bytes" value={fx(m.bits / 8, 2)} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="overflow-x-auto rounded-2xl bg-[var(--surface)] p-3">
          <svg viewBox="0 0 330 120" className="h-auto w-full min-w-[300px]" role="img" aria-label="ALOHA throughput curves">
            <line x1="10" y1="110" x2="320" y2="110" stroke="var(--border)" /><polyline fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeDasharray="4 3" points={pts(false)} /><polyline fill="none" stroke="var(--tint-ink)" strokeWidth="2.4" points={pts(true)} />
            <line x1={10 + G * 100} y1="10" x2={10 + G * 100} y2="110" stroke="var(--tint-ink)" strokeDasharray="2 3" />
            {[0, 1, 2, 3].map((g) => <text key={g} x={10 + g * 100} y="119" fontSize="8" fill="var(--text-secondary)">G={g}</text>)}
          </svg>
          <p className="text-xs text-[var(--text-secondary)]">Solid: slotted ALOHA (peak 36.8% at G = 1). Dashed: pure ALOHA (peak 18.4% at G = 0.5).</p>
        </div>
        <div className="space-y-2 sm:w-56"><Range label="Load G" min={0} max={3} step={0.1} value={G} set={setG} /><Stat label="Pure ALOHA S" value={`${fx(aloha(G, false) * 100, 1)}%`} /><Stat label="Slotted S" value={`${fx(aloha(G, true) * 100, 1)}%`} /></div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ subnetting */
export const ipToInt = (ip: string) => ip.split(".").reduce((a, o) => a * 256 + Number(o), 0);
export const intToIp = (n: number) => [24, 16, 8, 0].map((s) => Math.floor(n / 2 ** s) % 256).join(".");
export function subnet(ip: string, prefix: number) {
  const n = ipToInt(ip), size = 2 ** (32 - prefix), net = Math.floor(n / size) * size;
  return { network: intToIp(net), broadcast: intToIp(net + size - 1), first: intToIp(net + 1), last: intToIp(net + size - 2), hosts: Math.max(0, size - 2), mask: intToIp(2 ** 32 - size) };
}
export function SubnetLab() {
  const [ip, setIp] = useState("172.20.77.130"), [p, setP] = useState(26);
  const valid = /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split(".").every((o) => Number(o) < 256);
  const r = valid ? subnet(ip, p) : null;
  const bits = valid ? ip.split(".").map((o) => Number(o).toString(2).padStart(8, "0")).join("") : "";
  return (
    <Shell title="Subnet lab" note="The prefix splits 32 bits into network and host parts." tint="sky">
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="text-sm font-bold">IP address<input value={ip} onChange={(e) => setIp(e.target.value.trim())} aria-label="IP address" className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>
        <div className="self-end"><Range label="Prefix /" min={8} max={30} value={p} set={setP} /></div>
      </div>
      {r && <>
        <div className="mt-3 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3"><p className="min-w-[340px] font-num text-xs tracking-wider">{bits.split("").map((b, i) => <span key={i} className={`${i < p ? "font-bold text-[var(--tint-ink)]" : "text-[var(--text-secondary)]"} ${i % 8 === 7 && i < 31 ? "mr-2" : ""}`}>{b}</span>)}</p><p className="mt-1 text-xs text-[var(--text-secondary)]">Bold: {p} network bits. Grey: {32 - p} host bits.</p></div>
        <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3">
          <Stat label="Mask" value={r.mask} /><Stat label="Network" value={r.network} /><Stat label="Broadcast" value={r.broadcast} />
          <Stat label="First host" value={r.first} /><Stat label="Last host" value={r.last} /><Stat label="Usable hosts" value={r.hosts.toLocaleString("en-IN")} sub={`2^${32 - p} − 2`} />
        </div>
      </>}
    </Shell>
  );
}

/* ------------------------------------------------------------ fragmentation */
export function fragment(total: number, mtu: number, hdr = 20) {
  const data = total - hdr, per = Math.floor((mtu - hdr) / 8) * 8; const out: { len: number; offset: number; mf: number }[] = [];
  for (let at = 0; at < data; at += per) { const d = Math.min(per, data - at); out.push({ len: d + hdr, offset: at / 8, mf: at + d < data ? 1 : 0 }); }
  return out;
}
export function FragLab() {
  const [total, setTotal] = useState(4020), [mtu, setMtu] = useState(1500);
  const f = fragment(total, mtu);
  return (
    <Shell title="Fragmentation lab" note="A datagram larger than the next link's MTU is split; offsets count in 8-byte units." tint="lilac">
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Range label="Datagram (incl. 20-byte header)" min={600} max={6020} step={100} value={total} set={setTotal} unit="bytes" />
        <Range label="MTU" min={296} max={1500} step={4} value={mtu} set={setMtu} unit="bytes" />
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[360px] border-separate border-spacing-1 text-sm">
          <thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>#</th><th>Total length</th><th>Data</th><th>Offset</th><th>MF</th></tr></thead>
          <tbody>{f.map((x, i) => <tr key={i} className="font-num"><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{i + 1}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{x.len}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{x.len - 20}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{x.offset}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{x.mf}</td></tr>)}</tbody>
        </table>
      </div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">{f.length} fragments. Data per full fragment = ⌊({mtu} − 20) / 8⌋ × 8 = {Math.floor((mtu - 20) / 8) * 8} bytes. Bytes on the wire: {f.reduce((a, x) => a + x.len, 0)}.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ routing: Dijkstra */
export const GRAPH: [string, string, number][] = [["A", "B", 4], ["A", "C", 2], ["B", "C", 1], ["B", "D", 5], ["C", "D", 8], ["C", "E", 10], ["D", "E", 2], ["D", "F", 6], ["E", "F", 3]];
const NODES = ["A", "B", "C", "D", "E", "F"];
const POS: Record<string, [number, number]> = { A: [40, 80], B: [130, 25], C: [130, 135], D: [240, 25], E: [240, 135], F: [320, 80] };
export function dijkstra(src: string, edges = GRAPH) {
  const dist: Record<string, number> = {}, prev: Record<string, string | null> = {}; NODES.forEach((n) => { dist[n] = Infinity; prev[n] = null; }); dist[src] = 0;
  const done: string[] = []; const snaps: { pick: string; dist: Record<string, number> }[] = [];
  while (done.length < NODES.length) {
    const u = NODES.filter((n) => !done.includes(n)).sort((a, b) => dist[a] - dist[b] || a.localeCompare(b))[0]; done.push(u);
    for (const [x, y, w] of edges) { const v = x === u ? y : y === u ? x : null; if (v && !done.includes(v) && dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; } }
    snaps.push({ pick: u, dist: { ...dist } });
  }
  return { dist, prev, order: done, snaps };
}
export function RouteLab() {
  const [src, setSrc] = useState("A"), [k, setK] = useState(0);
  const r = useMemo(() => dijkstra(src), [src]);
  const shown = r.snaps[Math.min(k, r.snaps.length - 1)];
  const settled = r.order.slice(0, k + 1);
  const tree = (a: string, b: string) => settled.includes(a) && settled.includes(b) && (r.prev[a] === b || r.prev[b] === a);
  return (
    <Shell title="Link-state routing lab" note="Dijkstra settles the nearest unsettled router each step." tint="butter">
      <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-sm font-bold">Source</span>{NODES.map((n) => <Pill key={n} on={src === n} onClick={() => { setSrc(n); setK(0); }}>{n}</Pill>)}
        <button type="button" onClick={() => setK((x) => Math.min(x + 1, NODES.length - 1))} className="pill-ink" disabled={k >= NODES.length - 1}>Next step</button>
        <button type="button" onClick={() => setK(0)} className="pill-soft">Restart</button></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="overflow-x-auto rounded-2xl bg-[var(--surface)] p-2">
          <svg viewBox="0 0 360 160" className="h-auto w-full min-w-[300px]" role="img" aria-label="Network graph">
            {GRAPH.map(([a, b, w]) => { const [x1, y1] = POS[a], [x2, y2] = POS[b]; return <g key={a + b}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={tree(a, b) ? "var(--tint-ink)" : "var(--border)"} strokeWidth={tree(a, b) ? 3 : 1.5} /><text x={(x1 + x2) / 2 + 4} y={(y1 + y2) / 2 - 3} fontSize="11" fontWeight="700" fill="var(--text-secondary)">{w}</text></g>; })}
            {NODES.map((n) => { const [x, y] = POS[n], on = settled.includes(n); return <g key={n}><circle cx={x} cy={y} r="15" fill={on ? "var(--tint-ink)" : "var(--surface-secondary)"} stroke="var(--text-primary)" strokeWidth={n === shown.pick ? 2.5 : 1} /><text x={x} y={y + 4} fontSize="12" fontWeight="800" textAnchor="middle" fill={on ? "var(--surface)" : "var(--text-primary)"}>{n}</text></g>; })}
          </svg>
        </div>
        <table className="border-separate border-spacing-1 text-sm sm:w-48"><tbody>{NODES.map((n) => <tr key={n}><td className="font-bold">{n}</td><td className={`rounded-lg px-2 py-0.5 font-num ${settled.includes(n) ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>{shown.dist[n] === Infinity ? "∞" : shown.dist[n]}</td><td className="text-xs text-[var(--text-secondary)]">{settled.includes(n) && r.prev[n] ? `via ${r.prev[n]}` : ""}</td></tr>)}</tbody></table>
      </div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">Step {k + 1}: settle <b>{shown.pick}</b> at distance {shown.dist[shown.pick]}. Settled so far: {settled.join(", ")}.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ TCP sequence numbers */
export function handshake(cisn: number, sisn: number, bytes: number[]) {
  const rows = [{ who: "C→S", flags: "SYN", seq: cisn, ack: null as number | null, len: 0 }, { who: "S→C", flags: "SYN, ACK", seq: sisn, ack: cisn + 1, len: 0 }, { who: "C→S", flags: "ACK", seq: cisn + 1, ack: sisn + 1, len: 0 }];
  let s = cisn + 1; for (const b of bytes) { rows.push({ who: "C→S", flags: "data", seq: s, ack: sisn + 1, len: b }); s += b; rows.push({ who: "S→C", flags: "ACK", seq: sisn + 1, ack: s, len: 0 }); }
  return rows;
}
export const wrapSeconds = (gbps: number) => 2 ** 32 / ((gbps * 1e9) / 8);
export function SeqLab() {
  const [cisn, setC] = useState(4000), [n, setN] = useState(2), [gb, setGb] = useState(1);
  const rows = handshake(cisn, 9000, Array.from({ length: n }, (_, i) => [300, 500, 200][i % 3]));
  return (
    <Shell title="TCP sequence lab" note="SYN and FIN use one sequence number each; data uses one per byte." tint="mint">
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Range label="Client ISN" min={0} max={10000} step={500} value={cisn} set={setC} />
        <Range label="Data segments" min={0} max={4} value={n} set={setN} />
        <Range label="Link" min={0.1} max={10} step={0.1} value={gb} set={setGb} unit="Gbps" />
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[380px] border-separate border-spacing-1 text-sm">
          <thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>Dir</th><th>Flags</th><th>Seq</th><th>Ack</th><th>Bytes</th></tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i} className="font-num"><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{r.who}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1 font-sans font-bold">{r.flags}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{r.seq}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{r.ack ?? "–"}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{r.len}</td></tr>)}</tbody>
        </table>
      </div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">The 32-bit sequence space (2³² bytes) wraps around after <b>{fx(wrapSeconds(gb), 2)} s</b> at {gb} Gbps.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ congestion window */
/** cwnd per round (in MSS). Losses happen at the given round numbers (1-based): timeout → Tahoe reset, dupack → Reno halve. */
export function cwndTrace(rounds: number, ssthresh0: number, losses: Record<number, "timeout" | "dupack">) {
  let cw = 1, th = ssthresh0; const out: { r: number; cw: number; th: number; ev?: string }[] = [];
  for (let r = 1; r <= rounds; r++) {
    const ev = losses[r]; out.push({ r, cw, th, ev });
    if (ev === "timeout") { th = Math.max(2, Math.floor(cw / 2)); cw = 1; }
    else if (ev === "dupack") { th = Math.max(2, Math.floor(cw / 2)); cw = th; }
    else cw = cw < th ? Math.min(cw * 2, th) : cw + 1;
  }
  return out;
}
export function CwndLab() {
  const [th, setTh] = useState(16), [lossAt, setLossAt] = useState(9), [kind, setKind] = useState<"timeout" | "dupack">("timeout");
  const t = cwndTrace(16, th, { [lossAt]: kind });
  const max = Math.max(...t.map((x) => x.cw), th) + 2;
  return (
    <Shell title="Congestion window lab" note="Slow start doubles each round up to the threshold, then grows by 1 MSS." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={kind === "timeout"} onClick={() => setKind("timeout")}>Timeout (Tahoe)</Pill><Pill on={kind === "dupack"} onClick={() => setKind("dupack")}>3 duplicate ACKs (Reno)</Pill></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Range label="Initial ssthresh" min={4} max={32} value={th} set={setTh} unit="MSS" /><Range label="Loss in round" min={2} max={15} value={lossAt} set={setLossAt} /></div>
      <div className="mt-4 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3">
        <div className="flex h-40 min-w-[420px] items-end gap-1">{t.map((x) => <div key={x.r} className="flex flex-1 flex-col items-center justify-end gap-0.5"><span className="font-num text-[10px] font-bold">{x.cw}</span><span className={`w-full rounded-t ${x.ev ? "bg-rose-600" : "bg-[var(--tint-ink)]"}`} style={{ height: `${(x.cw / max) * 120}px` }} /><span className="text-[10px] text-[var(--text-secondary)]">{x.r}</span></div>)}</div>
      </div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">Round {lossAt}: loss at cwnd {t[lossAt - 1].cw}. New ssthresh = {Math.max(2, Math.floor(t[lossAt - 1].cw / 2))}; cwnd restarts at {kind === "timeout" ? "1" : "the new ssthresh"}. Window per round: {t.map((x) => x.cw).join(", ")}.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ HTTP timing */
export function httpTime(rtt: number, objects: number, mode: "np" | "p" | "pp", dns = 0) {
  const r = mode === "np" ? 2 * (1 + objects) : mode === "p" ? 2 + objects : 3;
  return { rtts: r, ms: r * rtt + dns };
}
export function HttpLab() {
  const [rtt, setRtt] = useState(20), [n, setN] = useState(8), [dns, setDns] = useState(0);
  const modes = [["np", "Non-persistent, serial"], ["p", "Persistent, no pipelining"], ["pp", "Persistent, pipelined"]] as const;
  return (
    <Shell title="Page load lab" note="One base HTML page plus N small embedded objects; transmission time ignored." tint="sky">
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Range label="RTT" min={5} max={100} step={5} value={rtt} set={setRtt} unit="ms" /><Range label="Objects" min={0} max={12} value={n} set={setN} /><Range label="DNS lookup" min={0} max={100} step={10} value={dns} set={setDns} unit="ms" /></div>
      <div aria-live="polite" className="mt-4 space-y-2">
        {modes.map(([m, name]) => { const r = httpTime(rtt, n, m, dns), worst = httpTime(rtt, n, "np", dns).ms || 1; return (
          <div key={m} className="rounded-2xl bg-[var(--surface)] p-3 text-sm"><div className="flex flex-wrap justify-between gap-2"><b>{name}</b><span className="font-num">{r.rtts} RTT{dns ? ` + DNS` : ""} = <b>{r.ms} ms</b></span></div>
            <div className="mt-1.5 h-2.5 rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full bg-[var(--tint-ink)]" style={{ width: `${(r.ms / worst) * 100}%` }} /></div></div>); })}
      </div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Each TCP connection costs 1 RTT to set up and 1 RTT per request. Pipelining sends all object requests at once.</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ ports and protocols */
export const PORTS = [
  { p: "DNS", port: "53", tr: "UDP" }, { p: "HTTP", port: "80", tr: "TCP" }, { p: "HTTPS", port: "443", tr: "TCP" }, { p: "SMTP", port: "25", tr: "TCP" },
  { p: "POP3", port: "110", tr: "TCP" }, { p: "IMAP", port: "143", tr: "TCP" }, { p: "FTP", port: "20, 21", tr: "TCP" }, { p: "SSH", port: "22", tr: "TCP" },
  { p: "Telnet", port: "23", tr: "TCP" }, { p: "DHCP", port: "67, 68", tr: "UDP" }, { p: "SNMP", port: "161", tr: "UDP" }, { p: "TFTP", port: "69", tr: "UDP" },
];
export function PortsLab() {
  const [picks, setPicks] = useState<Record<number, string>>({});
  const right = PORTS.filter((x, i) => picks[i] === x.tr).length;
  return (
    <Shell title="Ports lab" note="Does each protocol ride on TCP or UDP? Pick, and the port is revealed." tint="lilac">
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {PORTS.map((x, i) => { const chose = picks[i]; return (
          <div key={x.p} className="flex flex-wrap items-center gap-2 rounded-2xl bg-[var(--surface)] px-3 py-2 text-sm">
            <span className="min-w-0 flex-1 font-bold">{x.p}{chose && <span className="ml-2 font-num font-normal text-[var(--text-secondary)]">port {x.port}</span>}</span>
            {["TCP", "UDP"].map((t) => <button key={t} type="button" onClick={() => setPicks((p) => ({ ...p, [i]: t }))} className={`rounded-full border-2 px-2.5 py-1 text-xs font-bold ${chose ? (t === x.tr ? "border-emerald-700 bg-emerald-700 text-white" : chose === t ? "border-rose-600 bg-rose-600 text-white" : "border-[var(--border)] text-[var(--text-secondary)]") : "border-[var(--border)]"}`}>{t}</button>)}
          </div>); })}
      </div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 text-sm">{right} of {PORTS.length} right{Object.keys(picks).length === PORTS.length ? "." : ` so far (${Object.keys(picks).length} answered).`} DNS also uses TCP for zone transfers and large replies.</p>
    </Shell>
  );
}
