"use client";

/** Programming and Data Structures labs, one per topic. Logic in lib/study/pds.ts (checked by script). */
import { useState, type ReactNode } from "react";
import * as E from "@/lib/study/pds";

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
  <span className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--surface)] px-3 py-1 text-sm"><b>{label}</b><button type="button" aria-label={`${label} down`} onClick={() => set(Math.max(min, v - step))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">−</button><span className="w-12 text-center font-num">{v}</span><button type="button" aria-label={`${label} up`} onClick={() => set(Math.min(max, v + step))} className="h-7 w-7 rounded-lg border border-[var(--border)] font-bold">+</button></span>
);
const Log = ({ lines }: { lines: string[] }) => <ol className="mt-3 space-y-1 text-sm">{lines.map((l, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1.5">{l}</li>)}</ol>;
const Chips = ({ items, hl }: { items: (string | number)[]; hl?: (i: number) => boolean }) => <div className="mt-3 flex flex-wrap gap-1">{items.map((x, i) => <span key={i} className={`grid min-w-9 place-items-center rounded-lg px-2 py-1.5 font-num text-sm font-bold ${hl?.(i) ? "bg-[var(--surface-secondary)] ring-2 ring-[var(--st-accent)]" : "bg-[var(--surface)]"}`}>{x}</span>)}</div>;
const nums = (s: string) => s.split(/[,\s]+/).map(Number).filter((x) => Number.isFinite(x));
const toks = (s: string) => s.split(/[,\s]+/).filter(Boolean);

/* ------------------------------------------------------------ C */
export function CTypesLab() {
  const [t, setT] = useState<E.CType>("signed char"), [v, setV] = useState("200"); const r = E.stored(t, Number(v) || 0);
  return (
    <Shell title="Integer storage lab" note="Assigning a value that does not fit keeps only the low bits (two's complement)." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2">{(["signed char", "unsigned char", "short", "unsigned short", "int", "unsigned int"] as const).map((x) => <Pill key={x} on={t === x} onClick={() => setT(x)}>{x}</Pill>)}</div>
      <div className="mt-3"><Field label="Value assigned" value={v} set={setV} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Stored value" value={r.value} sub={r.wrapped ? "wrapped around" : "fits"} /><Stat label="Range" value={`${r.min} … ${r.max}`} sub={`${r.bits} bits`} /><Stat label="Bit pattern" value={<span className="break-all text-base">{r.binary}</span>} /></div>
    </Shell>
  );
}
export function LoopLab() {
  const [p, setP] = useState<E.LoopPat>("i<n,j<i"), [n, setN] = useState(16);
  const code: Record<E.LoopPat, string> = { "i<n,j<n": "for(i=0;i<n;i++) for(j=0;j<n;j++) c++;", "i<n,j<i": "for(i=0;i<n;i++) for(j=0;j<i;j++) c++;", "i*=2": "for(i=1;i<n;i*=2) c++;", "i<n,j*=2": "for(i=0;i<n;i++) for(j=1;j<n;j*=2) c++;", "i<n,j+=i": "for(i=1;i<=n;i++) for(j=1;j<=n;j+=i) c++;", "i*i<n": "for(i=0;i*i<n;i++) c++;" };
  const big: Record<E.LoopPat, string> = { "i<n,j<n": "n²", "i<n,j<i": "n(n−1)/2", "i*=2": "⌈log₂ n⌉", "i<n,j*=2": "n⌈log₂ n⌉", "i<n,j+=i": "≈ n ln n (harmonic)", "i*i<n": "⌈√n⌉" };
  return (
    <Shell title="Loop counting lab" note="How many times does c++ run?" tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{(Object.keys(code) as E.LoopPat[]).map((x) => <Pill key={x} on={p === x} onClick={() => setP(x)}>{big[x]}</Pill>)}</div>
      <p className="mt-3 overflow-x-auto rounded-xl bg-[var(--surface)] px-3 py-2 font-num text-sm">{code[p]}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2"><Step label="n" v={n} set={setN} min={1} max={200} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Exact count" value={E.loopCount(p, n)} /><Stat label="Formula" value={big[p]} /></div>
    </Shell>
  );
}
export function PtrLab() {
  const [e, setE] = useState("*(a + i) + j"), [i, setI] = useState(2), [j, setJ] = useState(3); const r = E.ptrExpr(1000, 4, 3, 4, e)(i, j);
  return (
    <Shell title="Pointer arithmetic lab" note="int a[3][4] at address 1000, sizeof(int) = 4." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{["a + i", "*(a + i)", "*(a + i) + j", "&a + 1", "a[0] + i*C + j"].map((x) => <Pill key={x} on={e === x} onClick={() => setE(x)}>{x}</Pill>)}</div>
      <div className="mt-3 flex flex-wrap gap-2"><Step label="i" v={i} set={setI} min={0} max={2} /><Step label="j" v={j} set={setJ} min={0} max={3} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Address" value={r.addr} /><Stat label="Meaning" value={<span className="text-base">{r.kind}</span>} /></div>
      <div className="mt-3 grid grid-cols-4 gap-1">{Array.from({ length: 12 }, (_, k) => <span key={k} className={`rounded-lg px-1 py-1 text-center font-num text-xs ${e.includes("j") && k === i * 4 + j ? "bg-[var(--surface-secondary)] ring-2 ring-[var(--st-accent)]" : "bg-[var(--surface)]"}`}>[{Math.floor(k / 4)}][{k % 4}] {1000 + 4 * k}</span>)}</div>
    </Shell>
  );
}
export function ParamLab() {
  const [m, setM] = useState<E.PMode>("reference"), [a, setA] = useState(5); const r = E.paramPass(m, a);
  return (
    <Shell title="Parameter passing lab" note="void f(int x, int y) { x = x + 1; y = y + x; } … f(a, a); print a." tint="mint">
      <div className="mt-3 flex flex-wrap items-center gap-2">{(["value", "reference", "value-result"] as const).map((x) => <Pill key={x} on={m === x} onClick={() => setM(x)}>call by {x}</Pill>)}<Step label="a" v={a} set={setA} min={-5} max={20} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Printed a" value={r.a} /><Stat label="Why" value={<span className="text-base">{r.note}</span>} /></div>
      <p className="mt-3 text-sm">A static local keeps its value between calls: three calls to <span className="font-num">int g() {"{"} static int s = 0; return ++s; {"}"}</span> return {E.staticCounter(3).join(", ")}.</p>
    </Shell>
  );
}
export function StructLab() {
  const [src, setSrc] = useState("char int char"); const r = E.structLayout(toks(src));
  return (
    <Shell title="Struct padding lab" note="Each member aligns to its own size; the struct rounds up to its largest member. char 1, short 2, int 4, double 8, char* 8." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2">{["char int char", "char char int", "char double int", "double int char"].map((x) => <Pill key={x} on={src === x} onClick={() => setSrc(x)}>{x}</Pill>)}</div>
      <div className="mt-3"><Field label="Members in order" value={src} set={setSrc} /></div>
      <ol className="mt-3 space-y-1 text-sm">{r.rows.map((x, i) => <li key={i} className="flex justify-between rounded-xl bg-[var(--surface)] px-3 py-1.5 font-num"><span>{x.f}</span><span>offset {x.off}{x.pad ? ` (after ${x.pad} padding)` : ""}</span></li>)}</ol>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="sizeof(struct)" value={r.size} sub={`${r.tail} tail padding`} /><Stat label="Members alone" value={r.packed} /><Stat label="sizeof(union)" value={r.unionSize} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ recursion */
export function RecTraceLab() {
  const [p, setP] = useState<E.RecProg>("print-around"), [n, setN] = useState(3); const arg = p === "sum-digits" ? n * 1111 + 9 : n; const r = E.recTrace(p, arg);
  const code: Record<E.RecProg, string> = { "print-around": "void f(int n){ if(n>0){ printf(\"%d \",n); f(n-1); printf(\"%d \",n); } }", "sum-digits": "int s(int n){ return n<10 ? n : n%10 + s(n/10); }", power: "int p(int k){ if(k==0) return 1; int h=p(k/2); return k%2 ? 2*h*h : h*h; }" };
  return (
    <Shell title="Recursion trace lab" note="Follow the calls, the output and the deepest stack." tint="rose">
      <div className="mt-3 flex flex-wrap items-center gap-2">{(["print-around", "sum-digits", "power"] as const).map((x) => <Pill key={x} on={p === x} onClick={() => setP(x)}>{x === "print-around" ? "print before and after" : x === "sum-digits" ? "sum of digits" : "fast power 2^k"}</Pill>)}<Step label="n" v={n} set={setN} min={0} max={8} /></div>
      <p className="mt-3 overflow-x-auto rounded-xl bg-[var(--surface)] px-3 py-2 font-num text-sm">{code[p]}{"  "}<span className="text-[var(--text-secondary)]">— called with {arg}</span></p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label={r.result === null ? "Output" : "Returns"} value={r.result === null ? r.out || "(nothing)" : r.result} /><Stat label="Calls" value={r.calls} /><Stat label="Max stack depth" value={r.maxDepth} /></div>
    </Shell>
  );
}
export function FibCallsLab() {
  const [n, setN] = useState(5); const r = E.fibCalls(n);
  return (
    <Shell title="Call counting lab" note="int fib(int n){ return n<2 ? n : fib(n−1) + fib(n−2); }" tint="sky">
      <div className="mt-3"><Step label="n" v={n} set={setN} min={0} max={25} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4"><Stat label="fib(n)" value={r.value} /><Stat label="Calls" value={r.calls} sub="C(n) = C(n−1) + C(n−2) + 1" /><Stat label="Additions" value={r.adds} /><Stat label="Calls with memo" value={r.memoCalls} /></div>
    </Shell>
  );
}
export function HanoiLab() {
  const [n, setN] = useState(3), [m, setM] = useState(2), [k, setK] = useState(2); const h = E.hanoi(n); const a = E.ackermann(m, k);
  return (
    <Shell title="Hanoi and Ackermann lab" note="Moves double plus one with each disc; Ackermann grows faster than any loop nest." tint="lilac">
      <div className="mt-3"><Step label="discs" v={n} set={setN} min={1} max={6} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Moves" value={h.count} sub="2ⁿ − 1" /><Stat label="First moves" value={<span className="text-base">{h.moves.slice(0, 3).join(", ")}</span>} /></div>
      <div className="mt-4 flex flex-wrap gap-2"><Step label="m" v={m} set={setM} min={0} max={3} /><Step label="n" v={k} set={setK} min={0} max={4} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label={`A(${m}, ${k})`} value={a.value ?? "too large"} /><Stat label="Calls" value={a.calls} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ arrays */
export function AddrLab() {
  const [rm, setRm] = useState(true), [i, setI] = useState(5), [j, setJ] = useState(8); const r = E.addr2(1000, 4, 1, 10, 1, 15, i, j, rm);
  return (
    <Shell title="Array address lab" note="A[1..10][1..15] of 4-byte elements at base 1000." tint="peach">
      <div className="mt-3 flex flex-wrap items-center gap-2"><Pill on={rm} onClick={() => setRm(true)}>Row major</Pill><Pill on={!rm} onClick={() => setRm(false)}>Column major</Pill><Step label="i" v={i} set={setI} min={1} max={10} /><Step label="j" v={j} set={setJ} min={1} max={15} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Elements before" value={r.k} sub={rm ? `(i − 1)·15 + (j − 1)` : `(j − 1)·10 + (i − 1)`} /><Stat label="Address" value={r.addr} /><Stat label="Size" value={`${r.R} × ${r.C}`} /></div>
    </Shell>
  );
}
export function TriLab() {
  const [kind, setKind] = useState<"lower-row" | "lower-col" | "upper-row" | "tridiag">("lower-row"), [n, setN] = useState(5), [i, setI] = useState(4), [j, setJ] = useState(2); const r = E.triIndex(n, i, j, kind);
  return (
    <Shell title="Special matrix lab" note="Store only the non-zero part in a 1-D array (0-based index k)." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2">{([["lower-row", "Lower, row-wise"], ["lower-col", "Lower, column-wise"], ["upper-row", "Upper, row-wise"], ["tridiag", "Tridiagonal"]] as const).map(([k, l]) => <Pill key={k} on={kind === k} onClick={() => setKind(k)}>{l}</Pill>)}</div>
      <div className="mt-3 flex flex-wrap gap-2"><Step label="n" v={n} set={setN} min={2} max={8} /><Step label="i" v={i} set={setI} min={1} max={n} /><Step label="j" v={j} set={setJ} min={1} max={n} /></div>
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>{Array.from({ length: n * n }, (_, c) => { const a = Math.floor(c / n) + 1, b = (c % n) + 1; const t = E.triIndex(n, a, b, kind); return <span key={c} className={`rounded py-1 text-center font-num text-xs ${a === i && b === j ? "ring-2 ring-[var(--st-accent)]" : ""} ${t ? "bg-[var(--surface)]" : "text-[var(--text-secondary)] opacity-50"}`}>{t ? t.k : 0}</span>; })}</div>
      {r ? <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label={`k for (${i}, ${j})`} value={r.k} /><Stat label="Elements stored" value={r.stored} /></div> : <Banner good={false}>({i}, {j}) is a structural zero: nothing is stored for it.</Banner>}
    </Shell>
  );
}
export function BsearchLab() {
  const [src, setSrc] = useState("3 8 15 23 42 57 61 77 89 94"), [key, setKey] = useState(61); const a = nums(src).sort((x, y) => x - y); const r = E.bsearch(a, key);
  return (
    <Shell title="Binary search lab" note="mid = ⌊(lo + hi)/2⌋; each probe halves the range." tint="butter">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Sorted array" value={src} set={setSrc} /><Step label="key" v={key} set={setKey} min={0} max={100} /></div>
      <ol className="mt-3 space-y-1 text-sm">{r.probes.map((p, i) => <li key={i} className="rounded-xl bg-[var(--surface)] px-3 py-1.5 font-num">lo {p.lo}, hi {p.hi} → mid {p.mid} (value {p.v})</li>)}</ol>
      <p aria-live="polite" className="mt-2 text-sm font-semibold">{r.found >= 0 ? `Found at index ${r.found}` : "Not found"} after {r.probes.length} probes (worst case ⌊log₂ {a.length}⌋ + 1 = {Math.floor(Math.log2(Math.max(1, a.length))) + 1}).</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ stacks and queues */
export function StackPermLab() {
  const [src, setSrc] = useState("3 2 1 4"); const seq = nums(src); const r = E.stackPerm(seq);
  return (
    <Shell title="Stack permutation lab" note="Push 1, 2, …, n in order, popping whenever you like. Which output orders are possible?" tint="rose">
      <div className="mt-3 flex flex-wrap gap-2">{["3 2 1 4", "3 1 2", "2 4 3 1", "4 1 2 3"].map((x) => <Pill key={x} on={src === x} onClick={() => setSrc(x)}>{x}</Pill>)}</div>
      <div className="mt-3"><Field label="Output sequence" value={src} set={setSrc} /></div>
      <Chips items={r.ops} />
      <Banner good={r.ok}>{r.ok ? `Possible. ${seq.length} elements allow ${E.catalan(seq.length)} stack permutations (Catalan number).` : `Impossible: ${r.stuck} is buried under a larger element.`}</Banner>
    </Shell>
  );
}
export function PostfixLab() {
  const [src, setSrc] = useState("A+B*C-D/E"), [ev, setEv] = useState("5 6 2 + * 12 4 / -"); const r = E.toPostfix(src); const e = E.evalPostfix(ev);
  return (
    <Shell title="Infix and postfix lab" note="Operators wait on a stack until something of lower precedence arrives. ^ is right-associative." tint="sky">
      <div className="mt-3"><Field label="Infix" value={src} set={setSrc} /></div>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[280px] border-separate border-spacing-1 text-sm"><thead><tr className="text-left text-xs text-[var(--text-secondary)]"><th>Token</th><th>Stack</th><th>Output</th></tr></thead><tbody>{r.log.map((l, i) => <tr key={i}>{[l.tok, l.stack || "—", l.out].map((v, k) => <td key={k} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num">{v}</td>)}</tr>)}</tbody></table></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Postfix" value={r.postfix} /><Stat label="Most operators on the stack" value={r.maxStack} /></div>
      <div className="mt-4"><Field label="Evaluate postfix (numbers)" value={ev} set={setEv} /></div>
      <Log lines={e.log} />
      <p aria-live="polite" className="mt-2 text-sm font-semibold">Result: {e.value ?? "malformed expression"}</p>
    </Shell>
  );
}
export function CQueueLab() {
  const [n, setN] = useState(5), [src, setSrc] = useState("E1 E2 E3 E4 E5 D D E6 E7"); const r = E.cqueue(n, toks(src));
  return (
    <Shell title="Circular queue lab" note="Array of n slots; one slot stays empty so that full ((rear+1) mod n = front) differs from empty (front = rear)." tint="lilac">
      <div className="mt-3 grid gap-2 sm:grid-cols-[auto_1fr] sm:items-end"><Step label="n" v={n} set={setN} min={2} max={8} /><Field label="Operations (E5 = enqueue 5, D = dequeue)" value={src} set={setSrc} /></div>
      <Chips items={r.q.map((x, i) => `${i}: ${x ?? "·"}`)} hl={(i) => i === r.front} />
      <Log lines={r.log} />
      <p aria-live="polite" className="mt-2 text-sm font-semibold">front {r.front}, rear {r.rear}, {r.count} items (capacity {n - 1}).</p>
    </Shell>
  );
}
export function TwoStackLab() {
  const [src, setSrc] = useState("E1 E2 E3 D E4 D D D"); const r = E.twoStackQueue(toks(src));
  return (
    <Shell title="Queue from two stacks lab" note="Enqueue pushes on IN. Dequeue pops OUT, refilling it from IN only when empty." tint="mint">
      <div className="mt-3"><Field label="Operations" value={src} set={setSrc} /></div>
      <Log lines={r.log} />
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Total stack operations" value={r.cost} /><Stat label="Elements moved" value={r.moves} /><Stat label="Average per operation" value={r.perOp.toFixed(2)} sub="amortised O(1)" /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ linked lists */
export function LListLab() {
  const [src, setSrc] = useState("front 5, end 40, del 20, reverse"); const r = E.listOps([10, 20, 30], src.split(",").map((x) => x.trim()).filter(Boolean));
  return (
    <Shell title="Singly linked list lab" note="Start: 10 → 20 → 30. Commands: front v, end v, del v, reverse." tint="peach">
      <div className="mt-3"><Field label="Commands" value={src} set={setSrc} /></div>
      <Log lines={r.log} />
      <p aria-live="polite" className="mt-3 overflow-x-auto rounded-xl bg-[var(--surface)] px-3 py-2 font-num text-sm">head → {r.list.join(" → ")} → NULL</p>
    </Shell>
  );
}
export function JosephusLab() {
  const [n, setN] = useState(7), [k, setK] = useState(3); const r = E.josephus(n, k);
  return (
    <Shell title="Circular list lab (Josephus)" note="n people in a circular list; every k-th is removed until one remains." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="n" v={n} set={setN} min={1} max={20} /><Step label="k" v={k} set={setK} min={1} max={10} /></div>
      <Chips items={r.order} />
      <p aria-live="polite" className="mt-2 text-sm font-semibold">Removal order above; survivor {r.survivor}.</p>
    </Shell>
  );
}
export function FloydLab() {
  const [mu, setMu] = useState(3), [lam, setLam] = useState(4); const r = E.floyd(mu, lam);
  return (
    <Shell title="Cycle detection lab" note="Tail of μ nodes, then a cycle of λ nodes. Slow moves 1, fast moves 2." tint="rose">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="μ (tail)" v={mu} set={setMu} min={0} max={10} /><Step label="λ (cycle)" v={lam} set={setLam} min={1} max={10} /></div>
      <Chips items={Array.from({ length: mu + lam }, (_, i) => i)} hl={(i) => i === r.meetNode} />
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Pointers meet after" value={`${r.meetStep} steps`} sub={`at node ${r.meetNode}`} /><Stat label="Cycle starts at" value={`node ${r.start}`} /><Stat label="Found by restarting one pointer" value={`${r.findSteps} steps`} /></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ trees */
export function TreePropsLab() {
  const [h, setH] = useState(3), [n, setN] = useState(10); const r = E.treeProps(h, n);
  return (
    <Shell title="Binary tree counting lab" note="Height counts edges on the longest root-to-leaf path (a single node has height 0)." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="height h" v={h} set={setH} min={0} max={10} /><Step label="nodes n" v={n} set={setN} min={1} max={12} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Max nodes, height h" value={r.maxNodes} sub="2^(h+1) − 1" /><Stat label="Min nodes, height h" value={r.minNodes} sub="a chain" /><Stat label="Leaves of a perfect tree" value={r.leavesFull} /><Stat label="Min height, n nodes" value={r.minHeight} sub="⌊log₂ n⌋" /><Stat label="Max height, n nodes" value={r.maxHeight} /><Stat label="Tree shapes, n nodes" value={r.shapes.toLocaleString("en-IN")} sub="Catalan(n)" /></div>
    </Shell>
  );
}
export function TraverseLab() {
  const [pre, setPre] = useState("A B D E C F G"), [ino, setIno] = useState("D B E A F C G"); const t = E.buildPreIn(toks(pre), toks(ino)); const o = E.orders(t);
  return (
    <Shell title="Tree reconstruction lab" note="Preorder gives the root; inorder splits left from right. Repeat." tint="lilac">
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Field label="Preorder" value={pre} set={setPre} /><Field label="Inorder" value={ino} set={setIno} /></div>
      {t ? <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Postorder" value={o.post.join(" ")} /><Stat label="Level order" value={o.lvl.join(" ")} /><Stat label="Height" value={o.height} /></div> : <Banner good={false}>These two sequences do not describe one binary tree (different keys or inconsistent order).</Banner>}
    </Shell>
  );
}
export function BstLab() {
  const [src, setSrc] = useState("50 30 70 20 40 60 80 35"), [del, setDel] = useState(30); const b = E.bstBuild(nums(src)); const info = E.bstInfo(b.root); const after = E.bstInfo(E.bstDelete(E.bstBuild(nums(src)).root, del));
  return (
    <Shell title="Binary search tree lab" note="Insert in order; delete a node with two children by copying its inorder successor." tint="mint">
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Insert keys" value={src} set={setSrc} /><Step label="delete" v={del} set={setDel} min={0} max={100} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Preorder" value={info.pre.join(" ")} /><Stat label="Height" value={info.height} sub={`${info.leaves} leaves`} /><Stat label="Comparisons to build" value={b.comps} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label={`Preorder after deleting ${del}`} value={after.pre.join(" ")} /><Stat label="Inorder (always sorted)" value={after.ino.join(" ")} /></div>
    </Shell>
  );
}
export function AvlLab() {
  const [src, setSrc] = useState("10 20 30 40 50 25"), [h, setH] = useState(3); const r = E.avlBuild(nums(src));
  return (
    <Shell title="AVL tree lab" note="After each insertion the lowest unbalanced node is fixed by one or two rotations." tint="butter">
      <div className="mt-3"><Field label="Insert keys" value={src} set={setSrc} /></div>
      <Log lines={r.rots.length ? r.rots : ["No rotations needed."]} />
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Root" value={r.root ?? "—"} /><Stat label="Height" value={r.height} /><Stat label="Preorder" value={r.pre.join(" ")} /></div>
      <div className="mt-4 flex flex-wrap items-center gap-2"><Step label="height" v={h} set={setH} min={0} max={12} /><span className="text-sm">Fewest nodes in an AVL tree of this height: <b className="font-num">{E.avlMinNodes(h)}</b> (N(h) = N(h−1) + N(h−2) + 1).</span></div>
    </Shell>
  );
}

/* ------------------------------------------------------------ heaps */
export function HeapLab() {
  const [src, setSrc] = useState("10 20 15 30 40"); const a = nums(src); const ins = E.heapInsertAll(a), bh = E.buildHeap(a), del = E.deleteMax(bh.a);
  return (
    <Shell title="Max-heap lab" note="Insert one by one (sift up) versus build-heap (sift down from the last parent)." tint="rose">
      <div className="mt-3"><Field label="Keys" value={src} set={setSrc} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Inserted one by one" value={ins.a.join(" ")} sub={`${ins.swaps} swaps`} /><Stat label="Build-heap" value={bh.a.join(" ")} sub={`${bh.swaps} swaps`} /></div>
      {a.length > 0 && <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Delete max" value={del.top} /><Stat label="Heap after" value={del.a.join(" ") || "empty"} sub={`${del.swaps} swaps`} /></div>}
    </Shell>
  );
}
export function HeapsortLab() {
  const [src, setSrc] = useState("4 10 3 5 1"); const r = E.heapsortTrace(nums(src));
  return (
    <Shell title="Heapsort lab" note="Build a max-heap, then repeatedly swap the root to the end and sift down. '|' separates the sorted tail." tint="sky">
      <div className="mt-3"><Field label="Keys" value={src} set={setSrc} /></div>
      <Log lines={r.passes} />
      <p aria-live="polite" className="mt-2 text-sm font-semibold">Sorted: {r.sorted.join(" ")}</p>
    </Shell>
  );
}
export function DaryLab() {
  const [d, setD] = useState(3), [i, setI] = useState(4), [n, setN] = useState(7); const r = E.dary(d, i);
  return (
    <Shell title="d-ary heap lab" note="0-based array: parent ⌊(i − 1)/d⌋, children d·i + 1 … d·i + d." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2"><Step label="d" v={d} set={setD} min={2} max={6} /><Step label="i" v={i} set={setI} min={0} max={40} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Parent" value={r.parent ?? "root"} /><Stat label="Children" value={r.children.join(", ")} /><Stat label={`Height with 40 keys`} value={E.daryHeight(d, 40)} /></div>
      <div className="mt-4"><Step label="distinct keys" v={n} set={setN} min={1} max={12} /></div>
      <p className="mt-2 text-sm">Different max-heaps on {n} distinct keys: <b className="font-num">{E.heapCount(n).toLocaleString("en-IN")}</b> (choose which keys go left, recurse on both subtrees).</p>
    </Shell>
  );
}

/* ------------------------------------------------------------ graphs */
export function GraphRepLab() {
  const [src, setSrc] = useState("A-B, A-C, B-D, C-D, D-E"), [dir, setDir] = useState(false); const g = E.graphRep(E.parseEdges(src), dir);
  return (
    <Shell title="Graph representation lab" note="Edges like A-B (or A>B for directed)." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={!dir} onClick={() => setDir(false)}>Undirected</Pill><Pill on={dir} onClick={() => setDir(true)}>Directed</Pill></div>
      <div className="mt-3"><Field label="Edges" value={src} set={setSrc} /></div>
      <div className="mt-3 overflow-x-auto"><table className="border-separate border-spacing-1 text-sm"><thead><tr><th />{g.V.map((v) => <th key={v} className="px-2 font-num">{v}</th>)}</tr></thead><tbody>{g.V.map((a, r) => <tr key={a}><th className="px-2 font-num">{a}</th>{g.matrix[r].map((x, c) => <td key={c} className={`rounded px-2 text-center font-num ${x ? "bg-[var(--surface-secondary)] font-bold" : "bg-[var(--surface)]"}`}>{x}</td>)}</tr>)}</tbody></table></div>
      <ul className="mt-3 grid gap-1 text-sm sm:grid-cols-2">{g.V.map((v) => <li key={v} className="rounded-xl bg-[var(--surface)] px-3 py-1 font-num">{v}: {g.adj.get(v)!.join(", ") || "—"}</li>)}</ul>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Matrix cells" value={g.matrixCells} /><Stat label="List entries" value={g.listEntries} sub={dir ? "= E" : "= 2E"} /><Stat label="Degree sum" value={g.outDeg.reduce((a, b) => a + b, 0) + (dir ? g.inDeg.reduce((a, b) => a + b, 0) : 0)} sub={dir ? "in + out = 2E" : "= 2E"} /></div>
    </Shell>
  );
}
export function BfsDfsLab() {
  const [src, setSrc] = useState("A-B, A-C, B-D, C-D, D-E"), [dir, setDir] = useState(false), [s, setS] = useState("A"); const r = E.bfsDfs(E.parseEdges(src), dir, s);
  return (
    <Shell title="BFS and DFS lab" note="Neighbours are taken in alphabetical order." tint="peach">
      <div className="mt-3 flex flex-wrap gap-2"><Pill on={!dir} onClick={() => setDir(false)}>Undirected</Pill><Pill on={dir} onClick={() => { setDir(true); setSrc("A>B, B>C, C>A, A>D, D>C"); }}>Directed</Pill></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Edges" value={src} set={setSrc} /><Field label="Start" value={s} set={setS} /></div>
      {r ? <>
        <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="BFS order" value={r.bfs.join(" ")} sub={`levels: ${Object.entries(r.dist).map(([k, v]) => `${k}${v}`).join(" ")}`} /><Stat label="DFS order" value={r.dfs.join(" ")} sub={Object.keys(r.d).map((k) => `${k} ${r.d[k]}/${r.f[k]}`).join(" · ")} /></div>
        <div className="mt-3 flex flex-wrap gap-1">{r.kinds.map((k, i) => <span key={i} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num text-xs">{k.e} {k.k}</span>)}</div>
      </> : <Banner good={false}>The start vertex is not in the graph.</Banner>}
    </Shell>
  );
}
export function GraphOpsLab() {
  const [op, setOp] = useState<"edge?" | "neighbours" | "all-edges" | "add-vertex" | "transpose">("all-edges"), [V, setV] = useState(1000), [Ed, setEd] = useState(5000); const r = E.opCost(op, V, Ed);
  return (
    <Shell title="Representation cost lab" note="Which structure wins depends on the operation and on how dense the graph is." tint="butter">
      <div className="mt-3 flex flex-wrap gap-2">{([["edge?", "Is (u, v) an edge?"], ["neighbours", "List u's neighbours"], ["all-edges", "Visit all edges"], ["add-vertex", "Add a vertex"], ["transpose", "Transpose"]] as const).map(([k, l]) => <Pill key={k} on={op === k} onClick={() => setOp(k)}>{l}</Pill>)}</div>
      <div className="mt-3 flex flex-wrap gap-2"><Step label="V" v={V} set={setV} min={10} max={100000} step={10} /><Step label="E" v={Ed} set={setEd} min={0} max={1000000} step={100} /></div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Adjacency matrix" value={r.matrix} sub={`≈ ${r.matrixOps.toLocaleString("en-IN")} steps · space ${r.spaceMatrix.toLocaleString("en-IN")}`} /><Stat label="Adjacency list" value={r.list} sub={`≈ ${r.listOps.toLocaleString("en-IN")} steps · space ${r.spaceList.toLocaleString("en-IN")}`} /></div>
    </Shell>
  );
}
