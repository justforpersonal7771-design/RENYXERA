"use client";

/** Discrete Mathematics labs, depth expansion batch B. Logic in lib/study/dm3.ts (checked by scripts). */
import { useState, type ReactNode } from "react";
import * as D from "@/lib/study/dm3";
import { GRAPHS, type G } from "@/lib/study/dm";
import { GraphEditor } from "@/components/study/dm-labs";

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
const Step = ({ label, v, set, min, max, step = 1 }: { label: string; v: number; set: (n: number) => void; min: number; max: number; step?: number }) => (
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>{label}</b><button type="button" aria-label={`${label} down`} onClick={() => set(Math.max(min, +(v - step).toFixed(2)))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-9 text-center font-num">{v}</span><button type="button" aria-label={`${label} up`} onClick={() => set(Math.min(max, +(v + step).toFixed(2)))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">+</button></span>
);
const Banner = ({ good, children }: { good: boolean; children: ReactNode }) => <p aria-live="polite" className={`mt-3 rounded-2xl p-3 text-sm font-semibold ${good ? "bg-emerald-700 text-white" : "bg-rose-700 text-white"}`}>{children}</p>;

/* ------------------------------------------------------------ spanning trees */
export function SpanningLab() {
  const [k, setK] = useState(0); const [g, setG] = useState<G>(GRAPHS[0].g);
  const t = D.spanningTrees(g); const complete = g.edges.length === (g.n * (g.n - 1)) / 2;
  return (
    <Shell title="Spanning tree lab" note="Kirchhoff's theorem: delete a row and column of the Laplacian and take the determinant." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2">{GRAPHS.map((x, j) => <Pill key={x.name} on={k === j} onClick={() => { setK(j); setG(x.g); }}>{x.name}</Pill>)}</div>
      <div className="mt-3 grid min-w-0 gap-4 sm:grid-cols-[auto_minmax(0,1fr)]">
        <div className="rounded-2xl bg-[var(--surface)] p-2"><GraphEditor g={g} setG={(x) => { setG(x); setK(-1); }} /></div>
        <div aria-live="polite" className="grid min-w-0 content-start gap-2 sm:grid-cols-2">
          <Stat label="Spanning trees" value={t} sub="det of the reduced Laplacian" />
          <Stat label="Edges in each spanning tree" value={g.n - 1} sub="n − 1" />
          <Stat label={`Cayley: labelled trees on ${g.n} vertices`} value={D.cayley(g.n)} sub={`nⁿ⁻² ${complete ? "= the count for Kₙ" : "(the count for Kₙ)"}`} />
          <Stat label="Edges / vertices" value={`${g.edges.length} / ${g.n}`} sub={t === 0 ? "disconnected: no spanning tree" : "connected"} />
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------ planarity */
export function PlanarLab() {
  const [k, setK] = useState(1), [n, setN] = useState(8), [m, setM] = useState(12), [tf, setTf] = useState(true);
  const p = D.PLANAR_SET[k]; const b = D.planarBounds(n, m, tf); const pb = D.planarBounds(p.n, p.m, p.triangleFree);
  return (
    <Shell title="Planarity lab" note="A planar graph has m ≤ 3n − 6 (≤ 2n − 4 without triangles) and n − m + f = 2." tint="peri">
      <div className="mt-3 flex flex-wrap gap-2">{D.PLANAR_SET.map((x, j) => <Pill key={x.name} on={k === j} onClick={() => setK(j)}>{x.name}</Pill>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="Vertices, edges" value={`${p.n}, ${p.m}`} /><Stat label="Edge bound" value={pb.limit} sub={p.triangleFree ? "2n − 4 (no triangles)" : "3n − 6"} /><Stat label="Faces if planar" value={pb.faces} sub="f = 2 − n + m" /><Stat label="Planar?" value={p.planar ? "yes" : "no"} /></div>
      <p className="mt-2 text-sm">{p.why}</p>
      <p className="mt-4 text-sm font-bold">Try your own numbers</p>
      <div className="mt-2 flex flex-wrap gap-2"><Step label="n" v={n} set={setN} min={3} max={20} /><Step label="m" v={m} set={setM} min={0} max={60} /><Pill on={tf} onClick={() => setTf((x) => !x)}>{tf ? "No triangles" : "Has triangles"}</Pill></div>
      <Banner good={!b.exceeds}>{b.exceeds ? `${m} > ${b.limit}: such a graph cannot be planar.` : `${m} ≤ ${b.limit}: the bound allows it (it may or may not be planar). If planar and connected, it has ${b.faces} faces.`}</Banner>
    </Shell>
  );
}

/* ------------------------------------------------------------ Hall's theorem */
const BIPS: { name: string; b: D.Bip }[] = [
  { name: "Hall fails", b: { L: 4, R: 4, adj: [[true, true, false, false], [true, false, false, false], [true, false, false, false], [false, false, true, true]] } },
  { name: "Perfect matching", b: { L: 4, R: 4, adj: [[true, true, false, false], [false, true, true, false], [false, false, true, true], [true, false, false, true]] } },
];
export function HallLab() {
  const [b, setB] = useState<D.Bip>(BIPS[0].b);
  const m = D.maxBipMatching(b), v = D.hallViolation(b);
  const toggle = (i: number, j: number) => setB((x) => ({ ...x, adj: x.adj.map((r, a) => r.map((on, c) => (a === i && c === j ? !on : on))) }));
  const L = ["Asha", "Bala", "Chen", "Dev"], R = ["OS", "CN", "DB", "TOC"];
  const inM = (i: number, j: number) => m.pairs.some(([u, w]) => u === i && w === j);
  return (
    <Shell title="Hall's theorem lab" note="Students (left) and topics they can teach (right). Tap a cell to add or remove an edge." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{BIPS.map((x) => <Pill key={x.name} on={JSON.stringify(x.b) === JSON.stringify(b)} onClick={() => setB(x.b)}>{x.name}</Pill>)}</div>
      <div className="mt-3 overflow-x-auto"><table className="border-separate border-spacing-1 text-sm"><thead><tr><th />{R.map((r) => <th key={r} className="px-2 text-xs">{r}</th>)}</tr></thead>
        <tbody>{L.map((l, i) => <tr key={l}><th className={`pr-2 text-left text-xs ${v?.includes(i) ? "text-rose-700 dark:text-rose-300" : ""}`}>{l}</th>{R.map((r, j) => <td key={r}><button type="button" aria-label={`${l} – ${r} ${b.adj[i][j] ? "edge" : "no edge"}`} onClick={() => toggle(i, j)} className={`h-9 w-12 rounded-lg text-xs font-bold ${inM(i, j) ? "bg-emerald-700 text-white" : b.adj[i][j] ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}>{inM(i, j) ? "match" : b.adj[i][j] ? "can" : ""}</button></td>)}</tr>)}</tbody></table></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Maximum matching" value={`${m.size} of 4`} sub={m.pairs.map(([u, w]) => `${L[u]}–${R[w]}`).join(", ")} /><Stat label="Hall's condition" value={v ? "fails" : "holds"} sub={v ? `S = {${v.map((i) => L[i]).join(", ")}} can only reach ${new Set(v.flatMap((i) => b.adj[i].map((on, j) => (on ? j : -1)).filter((j) => j >= 0))).size} topic(s)` : "every group of students can reach at least as many topics"} /></div>
      <Banner good={!v}>{v ? "No matching covers every student: Hall's condition fails, so it cannot exist." : "Every student gets a distinct topic: a matching that saturates the left side."}</Banner>
    </Shell>
  );
}

/* ------------------------------------------------------------ isomorphism */
function Mini({ g }: { g: G }) {
  const X = (i: number) => 60 + 48 * Math.sin((2 * Math.PI * i) / g.n), Y = (i: number) => 60 - 48 * Math.cos((2 * Math.PI * i) / g.n);
  return <svg viewBox="0 0 120 120" className="h-auto w-full max-w-[170px]" role="img" aria-label={`Graph with ${g.n} vertices and ${g.edges.length} edges`}>{g.edges.map(([a, b], k) => <line key={k} x1={X(a)} y1={Y(a)} x2={X(b)} y2={Y(b)} stroke="var(--text-primary)" strokeWidth="1.6" />)}{[...Array(g.n).keys()].map((v) => <g key={v}><circle cx={X(v)} cy={Y(v)} r="8" fill="var(--surface)" stroke="var(--text-primary)" /><text x={X(v)} y={Y(v) + 3} fontSize="8" fontWeight="800" textAnchor="middle" fill="var(--text-primary)">{v + 1}</text></g>)}</svg>;
}
export function IsoLab() {
  const [k, setK] = useState(0); const p = D.ISO_PAIRS[k];
  const ia = D.invariants(p.a), ib = D.invariants(p.b); const map = D.isomorphism(p.a, p.b);
  const rowsI: [string, string, string][] = [["Vertices", String(ia.n), String(ib.n)], ["Edges", String(ia.m), String(ib.m)], ["Degree sequence", ia.degSeq.join(" "), ib.degSeq.join(" ")], ["Triangles", String(ia.triangles), String(ib.triangles)]];
  return (
    <Shell title="Isomorphism lab" note="Compare invariants first; if all match, search for a vertex mapping that keeps every edge." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{D.ISO_PAIRS.map((x, j) => <Pill key={x.name} on={k === j} onClick={() => setK(j)}>{x.name}</Pill>)}</div>
      <div className="mt-3 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-[var(--surface)] p-2"><Mini g={p.a} /></div><div className="rounded-2xl bg-[var(--surface)] p-2"><Mini g={p.b} /></div></div>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[300px] border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>Invariant</th><th>Left</th><th>Right</th></tr></thead><tbody>{rowsI.map(([n, a, b]) => <tr key={n}><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{n}</td><td className={`rounded-lg px-2 py-1 font-num ${a === b ? "bg-[var(--surface)]" : "bg-rose-700 text-white"}`}>{a}</td><td className={`rounded-lg px-2 py-1 font-num ${a === b ? "bg-[var(--surface)]" : "bg-rose-700 text-white"}`}>{b}</td></tr>)}</tbody></table></div>
      <Banner good={!!map}>{map ? `Isomorphic: left vertex i goes to right vertex ${map.map((v, i) => `${i + 1}→${v + 1}`).join(", ")}.` : "Not isomorphic: an invariant differs (red), or no mapping preserves every edge."}</Banner>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">{p.note}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ pigeonhole */
export function PigeonLab() {
  const [text, setText] = useState("3 11 25 40 58 71 89"), [k, setK] = useState(6);
  const nums = text.split(/[\s,]+/).map(Number).filter((x) => Number.isInteger(x)).slice(0, 20);
  const boxes = D.residues(nums, k); const pair = boxes.find((b) => b.length >= 2);
  return (
    <Shell title="Pigeonhole lab" note="Sort numbers by remainder mod k. With more numbers than boxes, two share a box, and their difference is divisible by k." tint="butter">
      <label className="mt-3 block text-sm font-bold">Numbers<input value={text} onChange={(e) => setText(e.target.value)} aria-label="Numbers" className="field-bare mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 font-num" /></label>
      <div className="mt-3"><Step label="k (boxes)" v={k} set={setK} min={2} max={10} /></div>
      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">{boxes.map((b, r) => <div key={r} className={`rounded-2xl p-2 text-center text-sm ${b.length >= 2 ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)]"}`}><span className="block text-[10px] opacity-80">remainder {r}</span><b className="font-num">{b.join(", ") || "–"}</b></div>)}</div>
      <Banner good={!!pair}>{pair ? `${pair[0]} and ${pair[1]} share remainder ${((pair[0] % k) + k) % k}: their difference ${Math.abs(pair[1] - pair[0])} is divisible by ${k}.` : nums.length > k ? "Impossible: with more numbers than boxes two must share." : `Only ${nums.length} numbers for ${k} boxes: no guarantee. Add numbers until there are more than ${k}.`}</Banner>
    </Shell>
  );
}

/* ------------------------------------------------------------ binomial identities */
export function PascalLab() {
  const [mode, setMode] = useState<"row" | "hockey" | "vander">("hockey"), [n, setN] = useState(6), [r, setR] = useState(2);
  const h = D.hockey(r, n); const V = D.vandermonde(3, 4, Math.min(r, 7));
  const hl = (i: number, j: number) => (mode === "row" ? i === n : mode === "hockey" ? (j === r && i >= r && i <= n) || (i === n + 1 && j === r + 1) : false);
  return (
    <Shell title="Pascal's triangle lab" note="C(n, k) = C(n − 1, k − 1) + C(n − 1, k). Highlight an identity." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={mode === "row"} onClick={() => setMode("row")}>Row sum = 2ⁿ</Pill><Pill on={mode === "hockey"} onClick={() => setMode("hockey")}>Hockey stick</Pill><Pill on={mode === "vander"} onClick={() => setMode("vander")}>Vandermonde</Pill><Step label="n" v={n} set={setN} min={1} max={10} /><Step label="r" v={r} set={setR} min={0} max={n} /></div>
      <div className="mt-3 overflow-x-auto rounded-2xl bg-[var(--surface)] p-3"><div className="min-w-[460px] space-y-1">{[...Array(Math.min(n + 2, 12)).keys()].map((i) => <div key={i} className="flex justify-center gap-1">{D.row(i).map((c, j) => <span key={j} className={`grid h-7 min-w-9 place-items-center rounded-md px-1 font-num text-xs ${hl(i, j) ? "bg-[var(--tint-ink)] font-bold text-[var(--surface)]" : "bg-[var(--surface-secondary)]"}`}>{c}</span>)}</div>)}</div></div>
      <p aria-live="polite" className="mt-3 rounded-2xl bg-[var(--surface)] p-3 font-num text-sm">{mode === "row" ? `Σ C(${n}, k) = ${D.row(n).reduce((a, b) => a + b, 0)} = 2^${n}` : mode === "hockey" ? `C(${r},${r}) + … + C(${n},${r}) = ${h.sum} = C(${n + 1},${r + 1}) = ${h.closed}` : `Σ C(3, i)·C(4, ${Math.min(r, 7)} − i) = ${V.sum} = C(7, ${Math.min(r, 7)}) = ${V.closed}`}</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ master theorem */
export function MasterLab() {
  const [a, setA] = useState(2), [b, setB] = useState(2), [k, setK] = useState(1), [p, setP] = useState(0);
  const r = D.master(a, b, k, p);
  const levels = [0, 1, 2, 3].map((i) => ({ i, nodes: a ** i, each: `(n/${b ** i})^${k}`, ratio: a / b ** k }));
  return (
    <Shell title="Master theorem lab" note="T(n) = a·T(n/b) + Θ(nᵏ logᵖ n). Compare log_b a with k." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{[["Merge sort", 2, 2, 1, 0], ["Binary search", 1, 2, 0, 0], ["Strassen", 7, 2, 2, 0], ["Naive matrix D&C", 8, 2, 2, 0], ["3T(n/4) + n", 3, 4, 1, 0]].map(([nm, x, y, z, w]) => <Pill key={nm as string} on={a === x && b === y && k === z && p === w} onClick={() => { setA(x as number); setB(y as number); setK(z as number); setP(w as number); }}>{nm}</Pill>)}</div>
      <div className="mt-3 flex flex-wrap gap-2"><Step label="a" v={a} set={setA} min={1} max={16} /><Step label="b" v={b} set={setB} min={2} max={8} /><Step label="k" v={k} set={setK} min={0} max={4} step={0.5} /><Step label="p" v={p} set={setP} min={0} max={3} /></div>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[340px] border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>Level</th><th>Subproblems</th><th>Work each</th><th>Level total vs level above</th></tr></thead><tbody>{levels.map((l) => <tr key={l.i} className="font-num"><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{l.i}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{l.nodes}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">{l.each}</td><td className="rounded-lg bg-[var(--surface)] px-2 py-1">× {+(l.ratio).toFixed(3)} {l.ratio > 1 ? "(growing)" : l.ratio < 1 ? "(shrinking)" : "(equal)"}</td></tr>)}</tbody></table></div>
      <div aria-live="polite" className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="log_b a" value={+r.c.toFixed(3)} /><Stat label="Case" value={r.case} /><Stat label="T(n)" value={r.answer} /></div>
      <p className="mt-2 text-sm">{r.why}</p>
    </Shell>
  );
}
