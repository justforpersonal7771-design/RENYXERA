"use client";

/** Theory of Computation labs (chapter 1: finite automata). All logic lives in lib/study/toc.ts and is checked by script. */
import { useMemo, useState, type ReactNode } from "react";
import * as T from "@/lib/study/toc";

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
const Field = ({ label, value, set, hint }: { label: string; value: string; set: (v: string) => void; hint?: string }) => (
  <label className="block min-w-0 text-sm font-semibold text-[var(--text-secondary)]">{label}
    <input value={value} onChange={(e) => set(e.target.value)} spellCheck={false} autoComplete="off" className="mt-1 h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" />
    {hint && <span className="mt-1 block text-xs font-normal">{hint}</span>}
  </label>
);
const Verdict = ({ ok }: { ok: boolean }) => <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${ok ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/15 text-rose-700 dark:text-rose-300"}`}>{ok ? "Accepted" : "Rejected"}</span>;
const clean = (s: string, alpha: string[]) => [...s].filter((c) => alpha.includes(c)).join("");

/** Pick a DFA, type a string, watch the path and the verdict; the transition table sits beside it. */
export function DfaLab() {
  const [k, setK] = useState<keyof typeof T.DFAS>("mod3"); const [w, setW] = useState("1001");
  const d = T.DFAS[k].dfa; const input = clean(w, d.alpha); const r = T.runDFA(d, input);
  return (
    <Shell title="DFA lab" note="Choose a machine, type a binary string and follow the state after each symbol." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{(Object.keys(T.DFAS) as (keyof typeof T.DFAS)[]).map((x) => <Pill key={x} on={k === x} onClick={() => setK(x)}>{T.DFAS[x].label}</Pill>)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Input string" value={w} set={setW} hint="Only 0 and 1 are read; leave it empty to test ε." /><Verdict ok={r.ok} /></div>
      <ol className="mt-3 flex flex-wrap items-center gap-1.5" aria-label="Path">{r.path.map((q, i) => <li key={i} className="flex items-center gap-1.5">{i > 0 && <span className="font-num text-xs text-[var(--text-secondary)]">{input[i - 1]} →</span>}<span className={`rounded-lg px-2 py-1 font-num text-sm font-bold ${d.accept.includes(q) ? "bg-[var(--surface)] ring-2 ring-emerald-500/60" : "bg-[var(--surface)]"}`}>{q}</span></li>)}</ol>
      <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[16rem] text-left text-sm"><thead><tr className="text-[var(--text-secondary)]"><th className="py-1 pr-3">State</th>{d.alpha.map((a) => <th key={a} className="py-1 pr-3">on {a}</th>)}</tr></thead>
        <tbody>{d.states.map((q) => <tr key={q} className={q === r.path[r.path.length - 1] ? "font-bold text-[var(--text-primary)]" : ""}><td className="py-1 pr-3 font-num">{q === d.start ? "→ " : ""}{q}{d.accept.includes(q) ? " *" : ""}</td>{d.alpha.map((a) => <td key={a} className="py-1 pr-3 font-num">{d.delta[q][a]}</td>)}</tr>)}</tbody></table></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">→ start state, * accepting. The bold row is where the string ends.</p>
    </Shell>
  );
}

/** Track the set of live NFA states, and see the DFA the subset construction builds. */
export function NfaLab() {
  const n = T.NFAS.third1.nfa; const [w, setW] = useState("0110"); const input = clean(w, n.alpha);
  const sets = useMemo(() => { const out: string[] = []; for (let i = 0; i <= input.length; i++) { const pre = input.slice(0, i); const live = n.states.filter((q) => T.nfaAccepts({ ...n, accept: [q] }, pre)); out.push(`{${live.join(", ")}}`); } return out; }, [input, n]);
  const ok = T.nfaAccepts(n, input); const sc = useMemo(() => T.subset(n), [n]);
  return (
    <Shell title="NFA and subset construction lab" note="NFA for “the third symbol from the end is 1”; start p, accepting s." tint="lilac">
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Input string" value={w} set={setW} /><Verdict ok={ok} /></div>
      <ol className="mt-3 flex flex-wrap gap-1.5" aria-label="Live states">{sets.map((s, i) => <li key={i} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num text-sm">{i === 0 ? "start " : `${input[i - 1]} → `}<b>{s}</b></li>)}</ol>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="NFA states" value={n.states.length} /><Stat label="DFA states built" value={sc.states.length} /><Stat label="Accepting DFA states" value={sc.accept.length} /></div>
      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="DFA states">{sc.states.map((s) => <span key={s} className={`rounded-lg px-2 py-1 font-num text-xs font-bold ${sc.accept.includes(s) ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200" : "bg-[var(--surface)]"}`}>{`{${s}}`}</span>)}</div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Green sets contain s and are accepting. 8 = 2³ states: no DFA for this language can do with fewer.</p>
    </Shell>
  );
}

/** Type an expression: see its strings up to a length, and its Thompson state count. */
export function RegexLab() {
  const [src, setSrc] = useState("(0|1)*01"); const [len, setLen] = useState(3);
  const alpha = useMemo(() => { const a = [...new Set(src.replace(/[^a-z0-9]/gi, "").split(""))].sort(); return a.length ? a : ["0", "1"]; }, [src]);
  const r = useMemo(() => T.rxLang(src, alpha, len), [src, alpha, len]);
  return (
    <Shell title="Regular expression lab" note="Operators: | (union), juxtaposition (concatenation), * + ? and brackets; ε for the empty string." tint="mint">
      <div className="mt-3 flex flex-wrap gap-2">{["(0|1)*01", "0*1", "1(0|1)*0", "(01)*", "(a|b)*abb", "0*(10*10*)*"].map((x) => <Pill key={x} on={src === x} onClick={() => setSrc(x)}>{x}</Pill>)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"><Field label="Expression" value={src} set={setSrc} />
        <div className="text-sm font-semibold text-[var(--text-secondary)]">Max length<div className="mt-1 flex gap-1.5" role="group" aria-label="Maximum length">{[2, 3, 4, 5].map((x) => <Pill key={x} on={len === x} onClick={() => setLen(x)}>{x}</Pill>)}</div></div>
      </div>
      {!r ? <p className="mt-3 rounded-xl bg-[var(--surface)] p-3 text-sm font-semibold text-rose-700 dark:text-rose-300">That expression does not parse. Check brackets and operators.</p> : <>
        <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label={`Strings of length ≤ ${len}`} value={r.words.length} /><Stat label="Thompson ε-NFA states" value={r.states} /></div>
        <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Strings in the language">{r.words.slice(0, 60).map((x) => <span key={x} className="rounded-lg bg-[var(--surface)] px-2 py-1 font-num text-sm">{x}</span>)}{r.words.length === 0 && <span className="text-sm text-[var(--text-secondary)]">No string of this length or shorter.</span>}</div>
      </>}
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Alphabet: the symbols in your expression ({alpha.join(", ")}). Thompson count uses a fresh start and accept state for every operator.</p>
    </Shell>
  );
}

/** Watch partition refinement minimise the 7-state DFA from the lesson. */
export function MinLab() {
  const d = T.BIG_DFA; const m = useMemo(() => T.minimize(d), [d]); const [round, setRound] = useState(0);
  const blocks = m.rounds[Math.min(round, m.rounds.length - 1)];
  const tints = ["sky", "mint", "peach", "lilac", "butter", "rose"];
  return (
    <Shell title="Minimisation lab" note="7-state DFA, start A, accepting C and D. Step through the partition refinement." tint="peach">
      <div className="mt-3 flex flex-wrap items-center gap-2">{m.rounds.map((_, i) => <Pill key={i} on={round === i} onClick={() => setRound(i)}>{i === 0 ? "Split by acceptance" : `Refine round ${i}`}</Pill>)}</div>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">Removed as unreachable: <b className="font-num text-[var(--text-primary)]">{m.unreachable.join(", ") || "none"}</b></p>
      <div className="mt-2 flex flex-wrap gap-2" aria-label="Blocks">{blocks.map((b, i) => <span key={b.join("")} data-tint={tints[i % tints.length]} className="card-pastel px-3 py-2 font-num text-sm font-bold">{`{${b.join(", ")}}`}</span>)}</div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Original states" value={d.states.length} /><Stat label="Blocks now" value={blocks.length} /><Stat label="Minimal DFA" value={`${m.blocks.length} states`} /></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Two states stay in one block only if, on every symbol, they move into the same block. When a round splits nothing, the blocks are the states of the minimal DFA.</p>
    </Shell>
  );
}
