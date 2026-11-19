"use client";

/** Computer Networks depth labs, one per added topic. Logic in lib/study/cn2.ts (checked by script). */
import { useState, type ReactNode } from "react";
import * as E from "@/lib/study/cn2";

function Shell({ title, note, tint, children }: { title: string; note: string; tint: string; children: ReactNode }) {
  return (
    <section className="card-pastel min-w-0 p-5 sm:p-6" data-tint={tint} aria-label={title}>
      <div className="flex flex-wrap items-baseline gap-2"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</p><span className="text-sm text-[var(--text-secondary)]">{note}</span></div>
      {children}
    </section>
  );
}
const Pill = ({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) => <button type="button" aria-pressed={on} onClick={onClick} className={on ? "pill-ink" : "pill-soft"}>{children}</button>;
const Stat = ({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) => <p className="min-w-0 break-words rounded-2xl bg-[var(--surface)] p-3 text-sm">{label}<b className="block font-num text-xl">{value}</b>{sub && <span className="text-xs text-[var(--text-secondary)]">{sub}</span>}</p>;
const Field = ({ label, value, set }: { label: string; value: string; set: (v: string) => void }) => <label className="block min-w-0 text-sm font-bold">{label}<input value={value} onChange={(e) => set(e.target.value)} aria-label={label} spellCheck={false} className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>;
const Banner = ({ good, children }: { good: boolean; children: ReactNode }) => <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${good ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}>{children}</p>;
const Step = ({ label, v, set, min, max, step = 1 }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step?: number }) => (
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>{label}</b><button type="button" aria-label={`${label} down`} onClick={() => set(Math.max(min, +(v - step).toFixed(4)))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-14 text-center font-num">{v}</span><button type="button" aria-label={`${label} up`} onClick={() => set(Math.min(max, +(v + step).toFixed(4)))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">+</button></span>
);
const f2 = (x: number) => (Number.isFinite(x) ? (Math.round(x * 1000) / 1000).toString() : "∞");

export function PerfLab() {
  const [r, setR] = useState(100), [d, setD] = useState(2000), [b, setB] = useState(1500), [pps, setPps] = useState(5000); const p = E.perf(r, d, 200, b, pps);
  return (
    <Shell title="Network performance lab" note="Signal speed 2 × 10⁵ km/s (200 km per ms)." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="Mbps" v={r} set={setR} min={1} max={10000} step={10} /><Step label="km" v={d} set={setD} min={100} max={20000} step={100} /><Step label="Packet B" v={b} set={setB} min={64} max={9000} step={100} /><Step label="Packets/s" v={pps} set={setPps} min={100} max={100000} step={500} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Propagation" value={`${f2(p.prop)} ms`} /><Stat label="Transmission" value={`${f2(p.trans)} ms`} /><Stat label="RTT" value={`${f2(p.rtt)} ms`} /><Stat label="Bandwidth-delay product" value={`${p.bdpBytes.toLocaleString("en-IN")} B`} sub={`${p.bdpBits.toLocaleString("en-IN")} bits in flight one way`} /><Stat label="Traffic intensity La/R" value={f2(p.intensity)} sub={p.intensity >= 1 ? "queue grows without bound" : "queue stays finite"} /></div>
    </Shell>
  );
}

export function HammingLab() {
  const [data, setData] = useState("1011"), [flip, setFlip] = useState(0); const enc = E.hammingEncode(data);
  const bits = enc.code.split(""); if (flip > 0 && flip <= bits.length) bits[flip - 1] = bits[flip - 1] === "1" ? "0" : "1"; const rx = bits.join(""); const chk = E.hammingCheck(rx);
  return (
    <Shell title="Hamming code lab" note="Even parity; parity bits at positions 1, 2, 4, 8 … Flip one bit and let the syndrome find it." tint="lilac">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Data bits" value={data} set={setData} /><Step label="Flip bit" v={flip} set={setFlip} min={0} max={enc.n} /></div>
      <div className="mt-3 flex flex-wrap gap-1">{rx.split("").map((c, i) => <span key={i} className={`grid h-10 w-9 place-items-center rounded-lg text-sm font-bold ${i + 1 === flip ? "bg-rose-700 text-white" : ((i + 1) & i) === 0 ? "bg-[var(--surface-secondary)]" : "bg-[var(--surface)]"}`}><span className="text-[10px] font-normal opacity-70">{i + 1}</span>{c}</span>)}</div>
      <ul className="mt-3 space-y-1 text-sm">{enc.parity.map((p) => <li key={p.p} className="rounded-xl bg-[var(--surface)] px-3 py-1.5">p{p.p} covers {p.covers.join(", ")} → {p.value}</li>)}</ul>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Parity bits" value={enc.r} sub={`codeword ${enc.n} bits`} /><Stat label="Sent" value={enc.code} /><Stat label="Syndrome" value={chk.syndrome} sub={chk.syndrome ? `bit ${chk.syndrome} corrected` : "no error"} /></div>
    </Shell>
  );
}

const FRAMES = [{ src: "A", dst: "B", port: 1 }, { src: "B", dst: "A", port: 2 }, { src: "C", dst: "A", port: 3 }, { src: "A", dst: "C", port: 1 }, { src: "D", dst: "A", port: 1 }];
export function BridgeLab() {
  const [n, setN] = useState(FRAMES.length); const r = E.learnSwitch(FRAMES.slice(0, n), 4);
  return (
    <Shell title="Learning switch lab" note="4 ports; A and D share port 1 through a hub. The switch learns source addresses and floods unknown destinations." tint="mint">
      <div className="mt-3 flex flex-wrap items-center gap-2"><Step label="Frames" v={n} set={setN} min={1} max={FRAMES.length} /></div>
      <ol className="mt-3 space-y-1 text-sm">{r.log.map((l, i) => <li key={i} className="flex flex-wrap justify-between gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5"><b className="font-num">{l.f}</b><span>{l.action}{l.out.length ? ` → port ${l.out.join(", ")}` : ""}</span></li>)}</ol>
      <p className="mt-3 text-sm font-bold">Forwarding table</p>
      <div className="mt-1 flex flex-wrap gap-2 text-sm">{r.table.map((t) => <span key={t.mac} className="rounded-xl bg-[var(--surface-secondary)] px-3 py-1 font-num">{t.mac} → {t.port}</span>)}</div>
    </Shell>
  );
}

export function CsmaCaLab() {
  const [rate, setRate] = useState(54), [pay, setPay] = useState(1500), [k, setK] = useState(7), [rts, setRts] = useState(false); const r = E.csmaca(rate, pay, 34, 16, 9, k, 14, rts);
  return (
    <Shell title="CSMA/CA lab" note="802.11: DIFS 34 µs, slot 9 µs, SIFS 16 µs, ACK 14 B. Optional RTS (20 B) / CTS (14 B)." tint="peach">
      <div className="mt-3 flex flex-wrap items-center gap-2"><Step label="Mbps" v={rate} set={setRate} min={6} max={600} step={6} /><Step label="Payload B" v={pay} set={setPay} min={100} max={2300} step={100} /><Step label="Backoff slots" v={k} set={setK} min={0} max={31} /><Pill on={rts} onClick={() => setRts((x) => !x)}>RTS/CTS {rts ? "on" : "off"}</Pill></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Data frame" value={`${f2(r.data)} µs`} /><Stat label="Whole exchange" value={`${f2(r.total)} µs`} /><Stat label="Efficiency" value={`${(r.efficiency * 100).toFixed(1)}%`} /><Stat label="Throughput" value={`${f2(r.throughputMbps)} Mbps`} /></div>
    </Shell>
  );
}

const FLOWS = [{ ip: "10.0.0.2", port: 3345, dst: "93.184.216.34:80" }, { ip: "10.0.0.3", port: 3345, dst: "93.184.216.34:80" }, { ip: "10.0.0.2", port: 3345, dst: "93.184.216.34:80" }, { ip: "10.0.0.2", port: 4000, dst: "8.8.8.8:53" }];
export function NatLab() {
  const [n, setN] = useState(4); const r = E.nat("203.0.113.5", FLOWS.slice(0, n));
  return (
    <Shell title="NAT lab" note="Private hosts share the public address 203.0.113.5; the router rewrites source ports." tint="butter">
      <div className="mt-3"><Step label="Outgoing packets" v={n} set={setN} min={1} max={FLOWS.length} /></div>
      <ol className="mt-3 space-y-1 text-sm">{r.rows.map((x, i) => <li key={i} className="flex flex-wrap justify-between gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5 font-num"><span>{x.inside} → {x.dst}</span><b>sent as {x.outside}</b></li>)}</ol>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">{r.entries} translation entries. Replies to 203.0.113.5:500x are rewritten back to the inside host.</p>
    </Shell>
  );
}

export function Ipv6Lab() {
  const [a, setA] = useState("2001:0db8:0000:0000:0000:ff00:0042:8329"); const full = E.v6Expand(a);
  return (
    <Shell title="IPv6 address lab" note="Drop leading zeros in each group; replace one longest run of zero groups with ::." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{["2001:0db8:0000:0000:0000:ff00:0042:8329", "2001:db8::1", "::1", "fe80::"].map((x) => <Pill key={x} on={a === x} onClick={() => setA(x)}>{x.length > 20 ? "long form" : x}</Pill>)}</div>
      <div className="mt-3"><Field label="Address" value={a} set={setA} /></div>
      {full ? <div className="mt-3 grid gap-2"><Stat label="Full form" value={<span className="break-all">{full}</span>} /><Stat label="Shortest form" value={E.v6Compress(full)} sub="128 bits = 8 groups of 16" /></div> : <Banner good={false}>Not a valid IPv6 address (:: may appear only once, groups are up to 4 hex digits).</Banner>}
    </Shell>
  );
}

export function ClassfulLab() {
  const [ip, setIp] = useState("172.16.5.4"), [nets, setNets] = useState("200.1.0.0, 200.1.1.0, 200.1.2.0, 200.1.3.0"); const c = E.classOf(ip); const s = E.supernet(nets.split(/[,\s]+/).filter(Boolean));
  return (
    <Shell title="Classful and supernet lab" note="Class from the first octet; aggregate class C networks into one prefix." tint="sky">
      <div className="mt-3"><Field label="IP address" value={ip} set={setIp} /></div>
      {c ? <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Class" value={c.cls} /><Stat label="Default prefix" value={c.prefix ? `/${c.prefix}` : "none"} /><Stat label="Network" value={c.network} /><Stat label="Hosts" value={c.hosts.toLocaleString("en-IN")} /></div> : <Banner good={false}>Not a valid IPv4 address.</Banner>}
      <div className="mt-4"><Field label="Class C networks to aggregate" value={nets} set={setNets} /></div>
      <div className="mt-2 flex flex-wrap gap-2">{[["Four contiguous", "200.1.0.0, 200.1.1.0, 200.1.2.0, 200.1.3.0"], ["Misaligned pair", "200.1.1.0, 200.1.2.0"]].map(([n, v]) => <Pill key={n} on={nets === v} onClick={() => setNets(v)}>{n}</Pill>)}</div>
      {s && <Banner good={s.exact}>{s.exact ? `Exactly ${s.base}/${s.prefix} (covers ${s.covers} class C networks).` : `Smallest covering block is ${s.base}/${s.prefix}, which covers ${s.covers} networks, more than the ${nets.split(/[,\s]+/).filter(Boolean).length} given: not an exact supernet.`}</Banner>}
    </Shell>
  );
}

export function RwndLab() {
  const [buf, setBuf] = useState(65536), [rcvd, setRcvd] = useState(40000), [read, setRead] = useState(20000), [rtt, setRtt] = useState(20); const r = E.rwnd(buf, rcvd, read, rtt);
  return (
    <Shell title="Flow control lab" note="rwnd = RcvBuffer − (LastByteRcvd − LastByteRead). At most rwnd bytes per RTT." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="Buffer B" v={buf} set={setBuf} min={4096} max={1048576} step={4096} /><Step label="Last rcvd" v={rcvd} set={setRcvd} min={0} max={1048576} step={1000} /><Step label="Last read" v={read} set={setRead} min={0} max={1048576} step={1000} /><Step label="RTT ms" v={rtt} set={setRtt} min={1} max={500} /></div>
      {read > rcvd || rcvd - read > buf ? <Banner good={false}>Impossible state: the application cannot read beyond what arrived, and unread data cannot exceed the buffer.</Banner> : <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Advertised window" value={`${r.win.toLocaleString("en-IN")} B`} /><Stat label="Max throughput" value={`${f2(r.maxMbps)} Mbps`} /><Stat label="Window needed for 100 Mbps" value={`${E.windowNeeded(100, rtt).toLocaleString("en-IN")} B`} sub={`scale shift ${E.scaleShift(E.windowNeeded(100, rtt))}`} /></div>}
    </Shell>
  );
}

export function RtoLab() {
  const [src, setSrc] = useState("110 90 140"), [est, setEst] = useState(100), [dev, setDev] = useState(10); const rows = E.rto(src.split(/[,\s]+/).map(Number).filter((x) => x > 0), est, dev);
  return (
    <Shell title="RTO estimation lab" note="DevRTT ← 0.75·DevRTT + 0.25·|S − Est|; Est ← 0.875·Est + 0.125·S; RTO = Est + 4·DevRTT." tint="mint">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-end"><Field label="RTT samples (ms)" value={src} set={setSrc} /><Step label="Est₀" v={est} set={setEst} min={1} max={1000} /><Step label="Dev₀" v={dev} set={setDev} min={0} max={500} /></div>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[280px] border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>Sample</th><th>EstimatedRTT</th><th>DevRTT</th><th>RTO</th></tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{[r.sample, r.est, r.dev, r.rto].map((v, k) => <td key={k} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num">{f2(v)}</td>)}</tr>)}</tbody></table></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Karn: ignore samples from retransmitted segments, and double the RTO after each timeout.</p>
    </Shell>
  );
}

export function ChecksumLab() {
  const [src, setSrc] = useState("4500 0073 0000 4000 4011 0000 C0A8 0001 C0A8 00C7"); const r = E.checksum(src.split(/[,\s]+/).filter(Boolean));
  return (
    <Shell title="Internet checksum lab" note="Add 16-bit words with end-around carry, then take the one's complement." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{[["IPv4 header", "4500 0073 0000 4000 4011 0000 C0A8 0001 C0A8 00C7"], ["Carry case", "8000 8000"]].map(([n, v]) => <Pill key={n} on={src === v} onClick={() => setSrc(v)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="16-bit words (hex)" value={src} set={setSrc} /></div>
      <ol className="mt-3 grid gap-1 font-num text-sm sm:grid-cols-2">{r.steps.map((s, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1">{s}</li>)}</ol>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Sum" value={r.sum} /><Stat label="Checksum (complement)" value={r.checksum} /></div>
    </Shell>
  );
}

export function DnsLab() {
  const [mode, setMode] = useState<"iterative" | "recursive">("iterative"), [cached, setCached] = useState(false); const r = E.dnsMessages(mode, cached);
  return (
    <Shell title="DNS resolution lab" note="Host asks its local resolver for www.example.com." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={mode === "iterative"} onClick={() => setMode("iterative")}>Iterative</Pill><Pill on={mode === "recursive"} onClick={() => setMode("recursive")}>Recursive</Pill><Pill on={cached} onClick={() => setCached((x) => !x)}>.com server cached {cached ? "yes" : "no"}</Pill></div>
      <ol className="mt-3 space-y-1 text-sm">{r.path.map((p, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1.5"><b className="font-num">{i + 1}.</b> {p}</li>)}</ol>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">{r.msgs} messages in total.</p>
    </Shell>
  );
}

export function Base64Lab() {
  const [t, setT] = useState("Man"); const r = E.base64Info(t);
  return (
    <Shell title="MIME base64 lab" note="Every 3 bytes become 4 ASCII characters; '=' pads the last group." tint="rose">
      <div className="mt-3"><Field label="Text" value={t} set={setT} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Bytes" value={r.bytes} /><Stat label="Encoded length" value={r.encLen} sub={`4 × ⌈${r.bytes}/3⌉`} /><Stat label="Padding" value={r.pad} /></div>
      <p className="mt-3 break-all rounded-xl bg-[var(--surface)] px-3 py-2 font-num text-sm">{r.encoded || "—"}</p>
    </Shell>
  );
}

export function WebCacheLab() {
  const [hit, setHit] = useState(0.4), [objs, setObjs] = useState(10), [rtt, setRtt] = useState(10); const c = E.webCache(hit, 15, 1000, 15, 2, 0.01);
  return (
    <Shell title="HTTP timing and caching lab" note="Top: page with N small objects (transmission ignored). Bottom: 15 requests/s of 1 Mb objects over a 15 Mbps access link." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="Objects" v={objs} set={setObjs} min={1} max={50} /><Step label="RTT ms" v={rtt} set={setRtt} min={1} max={200} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Non-persistent" value={`${E.httpTime(objs, rtt, "nonpersistent")} ms`} /><Stat label="Non-persistent, 5 parallel" value={`${E.httpTime(objs, rtt, "nonpersistent", 5)} ms`} /><Stat label="Persistent" value={`${E.httpTime(objs, rtt, "persistent")} ms`} /><Stat label="Pipelined" value={`${E.httpTime(objs, rtt, "pipelined")} ms`} /></div>
      <div className="mt-4 flex flex-wrap gap-2"><Step label="Cache hit rate" v={hit} set={setHit} min={0} max={0.9} step={0.1} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Access link utilisation" value={f2(c.util)} /><Stat label="Average response" value={Number.isFinite(c.avg) ? `${f2(c.avg)} s` : "unbounded"} sub="hit 0.01 s; miss 2 s + access-link delay" /></div>
    </Shell>
  );
}
