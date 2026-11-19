"use client";

/** Algorithms labs, batch 2: greedy, dynamic programming, graph traversals, MST, shortest paths. Logic in lib/study/algo2.ts. */
import { useState, type ReactNode } from "react";
import * as E from "@/lib/study/algo2";

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
const Step = ({ label, v, set, min, max }: { label: string; v: number; set: (n: number) => void; min: number; max: number }) => (
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>{label}</b><button type="button" aria-label={`${label} down`} onClick={() => set(Math.max(min, v - 1))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-10 text-center font-num">{v}</span><button type="button" aria-label={`${label} up`} onClick={() => set(Math.min(max, v + 1))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">+</button></span>
);
const Banner = ({ good, children }: { good: boolean; children: ReactNode }) => <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${good ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}>{children}</p>;
const Log = ({ lines }: { lines: string[] }) => <ol className="mt-3 space-y-1 text-sm">{lines.map((l, i) => <li key={i} className="overflow-x-auto rounded-xl bg-[var(--surface)] px-3 py-1.5 font-num">{l}</li>)}</ol>;
const nums = (s: string) => s.split(/[,\s]+/).map(Number).filter((x) => Number.isFinite(x));
const triples = (s: string) => s.split(/[;,]+/).map((t) => t.trim().split(/\s+/)).filter((p) => p.length >= 3);
function Grid({ rows, head, side }: { rows: (string | number)[][]; head?: (string | number)[]; side?: (string | number)[] }) {
  return <div className="mt-3 overflow-x-auto"><table className="border-separate border-spacing-1 text-xs">{head && <thead><tr>{side && <th />}{head.map((h, i) => <th key={i} className="px-1.5 font-num text-[var(--text-secondary)]">{h}</th>)}</tr></thead>}<tbody>{rows.map((r, i) => <tr key={i}>{side && <th className="px-1.5 font-num text-[var(--text-secondary)]">{side[i]}</th>}{r.map((v, j) => <td key={j} className="rounded bg-[var(--surface)] px-1.5 py-0.5 text-center font-num">{v}</td>)}</tr>)}</tbody></table></div>;
}
const inf = (x: number) => (x === Infinity ? "∞" : x === -Infinity ? "−∞" : String(x));

/* ------------------------------------------------------------ greedy */
export function ActivityLab() {
  const [src, setSrc] = useState("a1 1 4; a2 3 5; a3 0 6; a4 5 7; a5 3 9; a6 5 9; a7 6 10; a8 8 11; a9 8 12; a10 2 14; a11 12 16"); const ivs = triples(src).map(([n, s, f]) => ({ name: n, s: +s, f: +f })); const r = E.activity(ivs);
  return (
    <Shell title="Activity selection lab" note="Repeatedly pick the compatible activity that finishes first. Format: name start finish; …" tint="peach">
      <div className="mt-3"><Field label="Activities" value={src} set={setSrc} /></div>
      <div className="mt-3 flex flex-wrap gap-1">{ivs.sort((a, b) => a.f - b.f).map((x) => <span key={x.name} className={`rounded-lg px-2 py-1 font-num text-xs ${r.pick.includes(x.name) ? "bg-emerald-700 text-white" : "bg-[var(--surface)]"}`}>{x.name} [{x.s}, {x.f})</span>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Chosen" value={r.pick.join(", ")} /><Stat label="Count" value={r.pick.length} /></div>
    </Shell>
  );
}
export function FracKnapLab() {
  const [src, setSrc] = useState("A 10 60; B 20 100; C 30 120"), [W, setW] = useState(50); const items = triples(src).map(([n, w, v]) => ({ name: n, w: +w, v: +v })).filter((i) => i.w > 0); const f = E.fracKnap(items, W);
  return (
    <Shell title="Fractional knapsack lab" note="Take items in decreasing value per weight, splitting the last one. Format: name weight value; …" tint="mint">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Items" value={src} set={setSrc} /><Step label="W" v={W} set={setW} min={1} max={200} /></div>
      <Log lines={f.take.map((t) => `${t.name}: take ${t.frac === 1 ? "all" : `${(t.frac * 100).toFixed(1)}%`}`)} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Fractional value" value={+f.value.toFixed(2)} /><Stat label="Ratio order" value={f.order.join(" > ")} /></div>
    </Shell>
  );
}
export function HuffmanLab() {
  const [src, setSrc] = useState("a 45, b 13, c 12, d 16, e 9, f 5"); const fr = src.split(/[,;]+/).map((t) => t.trim().split(/\s+/)).filter((p) => p.length === 2 && +p[1] > 0).map(([s, f]) => ({ s, f: +f })); const r = E.huffman(fr);
  return (
    <Shell title="Huffman coding lab" note="Merge the two lightest trees until one remains; left = 0, right = 1." tint="sky">
      <div className="mt-3"><Field label="Symbol frequency, …" value={src} set={setSrc} /></div>
      <Log lines={r.merges} />
      <div className="mt-3 flex flex-wrap gap-1">{Object.entries(r.codes).map(([s, c]) => <span key={s} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num text-sm">{s}: {c}</span>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Total bits" value={r.total} sub="= sum of merge weights" /><Stat label="Average bits/symbol" value={r.avg.toFixed(2)} /><Stat label="Fixed-length bits" value={r.fixed} /></div>
    </Shell>
  );
}
export function JobSeqLab() {
  const [src, setSrc] = useState("J1 2 100; J2 1 19; J3 2 27; J4 1 25; J5 3 15"); const jobs = triples(src).map(([n, d, p]) => ({ name: n, d: Math.max(1, Math.floor(+d)), p: +p })); const r = E.jobSeq(jobs);
  return (
    <Shell title="Job sequencing lab" note="Unit-time jobs with deadlines: take jobs by profit, each in the latest free slot before its deadline. Format: name deadline profit; …" tint="lilac">
      <div className="mt-3"><Field label="Jobs" value={src} set={setSrc} /></div>
      <div className="mt-3 flex flex-wrap gap-1">{r.slot.map((s, i) => <span key={i} className="rounded-lg bg-[var(--surface)] px-3 py-1.5 font-num text-sm">slot {i + 1}: {s ?? "—"}</span>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Profit" value={r.profit} /><Stat label="Jobs done" value={r.done} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ dynamic programming */
export function LcsLab() {
  const [a, setA] = useState("ABCBDAB"), [b, setB] = useState("BDCABA"); const r = E.lcs(a.slice(0, 12), b.slice(0, 12));
  return (
    <Shell title="LCS lab" note="L[i][j] = L[i−1][j−1] + 1 on a match, else max(L[i−1][j], L[i][j−1])." tint="rose">
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Field label="X" value={a} set={setA} /><Field label="Y" value={b} set={setB} /></div>
      <Grid rows={r.table.map((row) => row)} head={["", ...b.slice(0, 12).split("")]} side={["", ...a.slice(0, 12).split("")]} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="LCS length" value={r.len} /><Stat label="One LCS" value={r.one || "—"} /></div>
    </Shell>
  );
}
export function Knap01Lab() {
  const [src, setSrc] = useState("1 1 1; 2 3 4; 3 4 5; 4 5 7"), [W, setW] = useState(7); const items = triples(src).map(([n, w, v]) => ({ name: n, w: Math.max(1, Math.floor(+w)), v: +v })).slice(0, 8); const r = E.knap01(items, Math.min(W, 30));
  return (
    <Shell title="0/1 knapsack lab" note="K[i][w] = max(K[i−1][w], K[i−1][w − wᵢ] + vᵢ). Format: name weight value; …" tint="butter">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Items" value={src} set={setSrc} /><Step label="W" v={W} set={setW} min={1} max={30} /></div>
      <Grid rows={r.table} head={Array.from({ length: Math.min(W, 30) + 1 }, (_, i) => i)} side={["—", ...items.map((i) => i.name)]} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Best value" value={r.value} /><Stat label="Items taken" value={r.pick.join(", ") || "none"} /></div>
    </Shell>
  );
}
export function McmLab() {
  const [src, setSrc] = useState("30 35 15 5 10 20 25"); const p = nums(src).slice(0, 9); const r = E.mcm(p);
  return (
    <Shell title="Matrix chain lab" note="Dimensions p₀ p₁ … pₙ for A₁ (p₀×p₁) … Aₙ. m[i][j] = min over k of m[i][k] + m[k+1][j] + p₍ᵢ₋₁₎pₖpⱼ." tint="peri">
      <div className="mt-3 flex flex-wrap gap-2">{[["CLRS 6 matrices", "30 35 15 5 10 20 25"], ["3 matrices", "10 100 5 50"], ["4 matrices", "10 20 30 40 30"]].map(([n, v]) => <Pill key={n} on={src === v} onClick={() => setSrc(v)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Dimensions" value={src} set={setSrc} /></div>
      {p.length >= 2 && <Grid rows={r.m.slice(1).map((row) => row.slice(1).map((v, j) => (v === 0 && j > 0 ? "" : v)))} head={p.slice(1).map((_, i) => `A${i + 1}`)} side={p.slice(1).map((_, i) => `A${i + 1}`)} />}
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Minimum multiplications" value={r.cost.toLocaleString("en-IN")} /><Stat label="Best order" value={r.paren} /><Stat label="Worst order" value={r.worst.toLocaleString("en-IN")} /></div>
    </Shell>
  );
}
export function CoinsLab() {
  const [src, setSrc] = useState("1 3 4"), [amt, setAmt] = useState(6), [set, setSet] = useState("3 34 4 12 5 2"), [T, setT] = useState(9); const cs = nums(src).filter((x) => x > 0 && Number.isInteger(x)); const r = E.coins(cs, amt);
  return (
    <Shell title="Coin change and subset sum lab" note="Counting ways, fewest coins, and whether greedy works; then subset sum." tint="mint">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Coin values" value={src} set={setSrc} /><Step label="amount" v={amt} set={setAmt} min={1} max={60} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Ways (order ignored)" value={r.ways} /><Stat label="Fewest coins" value={r.min ?? "impossible"} /><Stat label="Greedy (largest first)" value={r.greedy ?? "fails"} sub={r.greedy !== null && r.min !== null && r.greedy > r.min ? "not optimal here" : undefined} /></div>
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Set" value={set} set={setSet} /><Step label="target" v={T} set={setT} min={0} max={100} /></div>
      <Banner good={E.subsetSum(nums(set).filter((x) => x >= 0).map(Math.floor), T)}>{E.subsetSum(nums(set).filter((x) => x >= 0).map(Math.floor), T) ? `Some subset sums to ${T}.` : `No subset sums to ${T}.`}</Banner>
    </Shell>
  );
}

/* ------------------------------------------------------------ graph traversals */
export function BipartiteLab() {
  const [src, setSrc] = useState("A-B, B-C, C-D, D-A"); const r = E.bipartite(E.parseD(src));
  return (
    <Shell title="Bipartite test lab" note="BFS colours each level alternately; an edge inside one colour means an odd cycle." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{[["Square", "A-B, B-C, C-D, D-A"], ["Triangle", "A-B, B-C, C-A"], ["Tree", "A-B, A-C, B-D, B-E"]].map(([n, v]) => <Pill key={n} on={src === v} onClick={() => setSrc(v)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Undirected edges" value={src} set={setSrc} /></div>
      <Banner good={r.ok}>{r.ok ? `Bipartite: {${r.A.join(", ")}} and {${r.B.join(", ")}}.` : `Not bipartite: edge ${r.conflict} joins two vertices of the same colour (odd cycle).`}</Banner>
    </Shell>
  );
}
export function TopoLab() {
  const [src, setSrc] = useState("A>B, A>C, B>D, C>D, D>E"); const r = E.topo(E.parseD(src));
  return (
    <Shell title="Topological sort lab" note="Kahn's algorithm: repeatedly output a vertex with in-degree 0 (alphabetical ties)." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{[["Diamond", "A>B, A>C, B>D, C>D, D>E"], ["Two sources", "A>C, B>C, C>D, C>E"], ["Cycle", "A>B, B>C, C>A"]].map(([n, v]) => <Pill key={n} on={src === v} onClick={() => setSrc(v)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Directed edges" value={src} set={setSrc} /></div>
      {r.dag ? <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Kahn order" value={r.order.join(" ")} /><Stat label="All topological orders" value={r.count ?? "too many to list"} /></div> : <Banner good={false}>The graph has a cycle: no topological order exists.</Banner>}
    </Shell>
  );
}
export function SccLab() {
  const [src, setSrc] = useState("A>B, B>C, C>A, B>D, D>E, E>F, F>D, G>F, G>H"), [u, setU] = useState("A-B, B-C, C-A, C-D, D-E, E-F, F-D, D-G"); const r = E.scc(E.parseD(src)); const a = E.articulation(E.parseD(u));
  return (
    <Shell title="Components lab" note="Kosaraju: DFS for finish order, then DFS on the reversed graph in decreasing finish time." tint="lilac">
      <div className="mt-3"><Field label="Directed edges" value={src} set={setSrc} /></div>
      <div className="mt-3 flex flex-wrap gap-1">{r.comps.map((c, i) => <span key={i} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num text-sm">{`{${c.join(", ")}}`}</span>)}</div>
      <p className="mt-2 text-sm font-semibold">{r.comps.length} strongly connected components.</p>
      <div className="mt-4"><Field label="Undirected edges (for cut vertices)" value={u} set={setU} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Articulation points" value={a.ap.join(", ") || "none"} /><Stat label="Bridges" value={a.bridges.join(", ") || "none"} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ MST */
const CLRS_MST = "A-B 4, A-H 8, B-C 8, B-H 11, C-D 7, C-F 4, C-I 2, D-E 9, D-F 14, E-F 10, F-G 2, G-H 1, G-I 6, H-I 7";
export function KruskalLab() {
  const [src, setSrc] = useState(CLRS_MST); const r = E.kruskal(E.parseW(src));
  return (
    <Shell title="Kruskal lab" note="Edges in increasing weight; keep an edge unless it closes a cycle (union-find). Format: A-B 4, …" tint="rose">
      <div className="mt-3"><Field label="Weighted edges" value={src} set={setSrc} /></div>
      <div className="mt-3 flex flex-wrap gap-1">{r.log.map((l, i) => <span key={i} className={`rounded-lg px-2 py-1 font-num text-xs ${l.take ? "bg-emerald-700 text-white" : "bg-[var(--surface)] line-through opacity-70"}`}>{l.e} {l.w}</span>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="MST weight" value={r.total} /><Stat label="Edges kept" value={r.tree.length} sub={r.connected ? "spanning tree" : "graph is disconnected: forest"} /></div>
    </Shell>
  );
}
export function PrimLab() {
  const [src, setSrc] = useState(CLRS_MST), [s, setS] = useState("A"); const r = E.prim(E.parseW(src), s);
  return (
    <Shell title="Prim lab" note="Grow one tree from the start vertex, always adding the cheapest edge leaving it." tint="butter">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Weighted edges" value={src} set={setSrc} /><Field label="Start" value={s} set={setS} /></div>
      {r ? <><Log lines={r.add} /><div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Vertex order" value={r.order.join(" ")} /><Stat label="MST weight" value={r.total} /></div></> : <Banner good={false}>The start vertex is not in the graph.</Banner>}
    </Shell>
  );
}
export function MstCountLab() {
  const [src, setSrc] = useState("A-B 1, B-C 2, C-D 1, D-A 2, A-C 3"); const r = E.countSpanning(E.parseW(src));
  return (
    <Shell title="Spanning tree counting lab" note="Every subset of V − 1 edges that forms a tree is a spanning tree; the lightest ones are the MSTs (up to 16 edges)." tint="peri">
      <div className="mt-3 flex flex-wrap gap-2">{[["Ties", "A-B 1, B-C 2, C-D 1, D-A 2, A-C 3"], ["4-cycle, equal", "A-B 1, B-C 1, C-D 1, D-A 1"], ["Distinct weights", "A-B 1, B-C 2, C-D 3, D-A 4, A-C 5"]].map(([n, v]) => <Pill key={n} on={src === v} onClick={() => setSrc(v)}>{n}</Pill>)}</div>
      <div className="mt-3"><Field label="Weighted edges" value={src} set={setSrc} /></div>
      {r ? <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Spanning trees" value={r.spanning} /><Stat label="MST weight" value={r.minW === Infinity ? "—" : r.minW} /><Stat label="Distinct MSTs" value={r.msts} sub={r.msts === 1 ? "unique" : "ties allow several"} /></div> : <Banner good={false}>Use at most 16 edges for exhaustive counting.</Banner>}
    </Shell>
  );
}

/* ------------------------------------------------------------ shortest paths */
const CLRS_DIJ = "s>t 10, s>y 5, t>x 1, t>y 2, y>t 3, y>x 9, y>z 2, x>z 4, z>x 6, z>s 7";
export function DijkstraLab() {
  const [src, setSrc] = useState(CLRS_DIJ), [s, setS] = useState("s"), [dir, setDir] = useState(true); const r = E.dijkstra(E.parseW(src), s, dir);
  return (
    <Shell title="Dijkstra lab" note="Extract the closest unfinished vertex and relax its edges. Non-negative weights only." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={dir} onClick={() => setDir(true)}>Directed</Pill><Pill on={!dir} onClick={() => setDir(false)}>Undirected</Pill></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Weighted edges (a>b w)" value={src} set={setSrc} /><Field label="Source" value={s} set={setS} /></div>
      {r ? <><Log lines={r.rows.map((row, i) => `extract ${r.order[i]} → ${row}`)} /><div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Extraction order" value={r.order.join(" ")} /><Stat label="Distances" value={Object.entries(r.dist).map(([k, v]) => `${k} ${inf(v)}`).join(" · ")} /></div></> : <Banner good={false}>The source is not in the graph.</Banner>}
    </Shell>
  );
}
export function BellmanLab() {
  const [src, setSrc] = useState("s>t 6, s>y 7, t>x 5, t>y 8, t>z -4, x>t -2, y>x -3, y>z 9, z>s 2, z>x 7"), [s, setS] = useState("s"); const r = E.bellman(E.parseW(src), s);
  return (
    <Shell title="Bellman–Ford lab" note="Relax every edge V − 1 times; one more improving edge means a negative cycle." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={src.startsWith("s>t 6")} onClick={() => setSrc("s>t 6, s>y 7, t>x 5, t>y 8, t>z -4, x>t -2, y>x -3, y>z 9, z>s 2, z>x 7")}>CLRS example</Pill><Pill on={src === "A>B 1, B>C -2, C>A -1"} onClick={() => { setSrc("A>B 1, B>C -2, C>A -1"); setS("A"); }}>Negative cycle</Pill></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Directed weighted edges" value={src} set={setSrc} /><Field label="Source" value={s} set={setS} /></div>
      {r ? <><Log lines={r.passes.map((p, i) => `pass ${i + 1}: ${p}`)} /><Banner good={!r.neg}>{r.neg ? "A negative cycle is reachable: shortest paths are undefined." : `Final distances: ${Object.entries(r.dist).map(([k, v]) => `${k} ${inf(v)}`).join(", ")}.`}</Banner></> : <Banner good={false}>The source is not in the graph.</Banner>}
    </Shell>
  );
}
export function FwLab() {
  const [src, setSrc] = useState("1>2 3, 1>3 8, 1>5 -4, 2>4 1, 2>5 7, 3>2 4, 4>1 2, 4>3 -5, 5>4 6"), [k, setK] = useState(5); const r = E.floydW(E.parseW(src), true); const kk = Math.min(k, r.V.length);
  return (
    <Shell title="Floyd–Warshall lab" note="D⁽ᵏ⁾[i][j] = min(D⁽ᵏ⁻¹⁾[i][j], D⁽ᵏ⁻¹⁾[i][k] + D⁽ᵏ⁻¹⁾[k][j])." tint="peach">
      <div className="mt-3"><Field label="Directed weighted edges" value={src} set={setSrc} /></div>
      <div className="mt-3"><Step label="after k =" v={kk} set={setK} min={0} max={r.V.length} /></div>
      <Grid rows={(r.steps[kk] ?? []).map((row) => row.map(inf))} head={r.V} side={r.V} />
      {r.negCycle && <Banner good={false}>A negative entry on the diagonal reveals a negative cycle.</Banner>}
    </Shell>
  );
}
