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

/** Product construction of two mod counters: states and accepting pairs for and / or / xor. */
export function ProductLab() {
  const [m, setM] = useState(2), [n, setN] = useState(3), [op, setOp] = useState<"and" | "or" | "xor">("and");
  const r = T.productStates(m, n, op);
  const pairs = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => `(${i},${j})`));
  return (
    <Shell title="Product construction lab" note="Machine A counts mod m, machine B counts mod n; each accepts in remainder 0." tint="sky">
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-[var(--text-secondary)]">m</span>{[2, 3, 4, 5].map((x) => <Pill key={`m${x}`} on={m === x} onClick={() => setM(x)}>{x}</Pill>)}
        <span className="ml-2 text-sm font-semibold text-[var(--text-secondary)]">n</span>{[2, 3, 4, 5].map((x) => <Pill key={`n${x}`} on={n === x} onClick={() => setN(x)}>{x}</Pill>)}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">{(["and", "or", "xor"] as const).map((x) => <Pill key={x} on={op === x} onClick={() => setOp(x)}>{x === "and" ? "A ∩ B" : x === "or" ? "A ∪ B" : "A △ B"}</Pill>)}</div>
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }} aria-label="Product states">
        {pairs.flat().map((q) => <span key={q} className={`rounded-lg px-2 py-1 text-center font-num text-sm font-bold ${r.accepting.includes(q) ? "bg-emerald-500/20 text-emerald-800 dark:text-emerald-200" : "bg-[var(--surface)]"}`}>{q}</span>)}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Product states" value={r.states} /><Stat label="Accepting pairs" value={r.accepting.length} /></div>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Green pairs accept. The product may shrink after minimisation; the count here is before it.</p>
    </Shell>
  );
}

const PUMP_LANGS: { id: T.PumpLang; label: string; w: string }[] = [
  { id: "anbn", label: "aⁿbⁿ", w: "aaabbb" }, { id: "ww", label: "ww over {a, b}", w: "abab" }, { id: "prime", label: "aⁿ, n prime", w: "aaaaa" },
  { id: "square", label: "aⁿ, n a square", w: "aaaa" }, { id: "evenA", label: "even number of a's (regular)", w: "aab" },
];
/** Split a string into x y z and pump y: see which repetitions leave the language. */
export function PumpLab() {
  const [L, setL] = useState<T.PumpLang>("anbn"); const [w, setW] = useState("aaabbb"); const [x, setX] = useState(1); const [y, setY] = useState(1);
  const pick = (id: T.PumpLang) => { const d = PUMP_LANGS.find((q) => q.id === id)!; setL(id); setW(d.w); setX(id === "evenA" ? 0 : 1); setY(id === "prime" || id === "evenA" ? 2 : 1); };
  const safeX = Math.min(x, Math.max(0, w.length - 1)); const safeY = Math.max(1, Math.min(y, w.length - safeX));
  const r = T.pump(L, w, safeX, safeY);
  return (
    <Shell title="Pumping lemma lab" note="You choose the split (in a real proof the adversary does). Pump y zero to three times." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{PUMP_LANGS.map((q) => <Pill key={q.id} on={L === q.id} onClick={() => pick(q.id)}>{q.label}</Pill>)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end"><Field label="String w (should be in the language)" value={w} set={setW} />
        <div className="text-sm font-semibold text-[var(--text-secondary)]">|x|<div className="mt-1 flex gap-1">{[0, 1, 2].map((v) => <Pill key={v} on={safeX === v} onClick={() => setX(v)}>{v}</Pill>)}</div></div>
        <div className="text-sm font-semibold text-[var(--text-secondary)]">|y|<div className="mt-1 flex gap-1">{[1, 2, 3].map((v) => <Pill key={v} on={safeY === v} onClick={() => setY(v)}>{v}</Pill>)}</div></div>
      </div>
      <p className="mt-3 font-num text-sm">x = <b>{r.X || "ε"}</b> · y = <b>{r.Y}</b> · z = <b>{r.Z || "ε"}</b> {T.inLang(L, w) ? "" : <span className="ml-2 font-sans font-semibold text-rose-700 dark:text-rose-300">w itself is not in the language</span>}</p>
      <ol className="mt-2 grid gap-1.5 sm:grid-cols-4" aria-label="Pumped strings">{r.tries.map((t) => <li key={t.i} className={`rounded-xl px-3 py-2 text-sm ${t.ok ? "bg-[var(--surface)]" : "bg-rose-500/15"}`}><b className="font-num">i = {t.i}</b><span className="block font-num text-xs">length {t.len}: {t.ok ? "in L" : "out of L"}</span></li>)}</ol>
      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{r.broken ? "This split is broken: some i leaves the language." : "This split survives every pump shown."}</p>
    </Shell>
  );
}

const CLASSIFY: { lang: string; regular: boolean; why: string }[] = [
  { lang: "aⁿbᵐ (n, m ≥ 0)", regular: true, why: "Independent counts: a*b*." },
  { lang: "aⁿbⁿ", regular: false, why: "Pump aᵖbᵖ with i = 0." },
  { lang: "aⁿbⁿ with n ≤ 1000", regular: true, why: "Finite language." },
  { lang: "aⁿbᵐ with n ≠ m", regular: false, why: "Complement ∩ a*b* is aⁿbⁿ." },
  { lang: "aⁿbᵐ with n + m even", regular: true, why: "Track two parities: 4 states." },
  { lang: "#a = #b over {a, b}", regular: false, why: "∩ a*b* gives aⁿbⁿ." },
  { lang: "#a − #b ≡ 0 (mod 3)", regular: true, why: "A counter mod 3." },
  { lang: "#ab = #ba", regular: true, why: "Equal iff first and last symbols agree." },
  { lang: "ww over {a, b}", regular: false, why: "Pump aᵖbaᵖb." },
  { lang: "ww over {a}", regular: true, why: "It is (aa)*." },
  { lang: "aⁿ, n prime", regular: false, why: "Lengths not periodic; pump i = q − k." },
  { lang: "a^(3n+1)", regular: true, why: "Periodic lengths: a(aaa)*." },
];
/** Guess first, then reveal: regular or not, and the one-line reason. */
export function ClassifyLab() {
  const [guess, setGuess] = useState<Record<number, boolean>>({});
  const right = Object.entries(guess).filter(([k, v]) => CLASSIFY[Number(k)].regular === v).length;
  return (
    <Shell title="Is it regular? lab" note="Decide for each language, then read the one-line reason." tint="mint">
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">{CLASSIFY.map((c, k) => { const g = guess[k]; const done = g !== undefined; return (
        <li key={c.lang} className="rounded-2xl bg-[var(--surface)] p-3 text-sm">
          <p className="font-num font-bold text-[var(--text-primary)]">{c.lang}</p>
          {!done ? <div className="mt-2 flex gap-2"><Pill on={false} onClick={() => setGuess((x) => ({ ...x, [k]: true }))}>Regular</Pill><Pill on={false} onClick={() => setGuess((x) => ({ ...x, [k]: false }))}>Not regular</Pill></div>
            : <p className={`mt-1 ${g === c.regular ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}><b>{c.regular ? "Regular" : "Not regular"}</b> ({g === c.regular ? "you were right" : "you said the opposite"}). {c.why}</p>}
        </li>
      ); })}</ul>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Answered" value={`${Object.keys(guess).length} of ${CLASSIFY.length}`} /><Stat label="Correct" value={right} /></div>
    </Shell>
  );
}

/* ---------------------------------------------------------------- chapter 3: context-free grammars and PDAs */
const GRAMMARS: { id: string; label: string; src: string; w: string }[] = [
  { id: "amb", label: "E → E+E | E*E | a", src: "E -> E+E | E*E | a", w: "a+a*a" },
  { id: "fix", label: "Layered E, T, F", src: "E -> E+T | T; T -> T*F | F; F -> a", w: "a+a*a" },
  { id: "else", label: "Dangling else", src: "S -> iS | iSeS | a", w: "iiaea" },
  { id: "par", label: "Parentheses SS | (S) | ()", src: "S -> SS | (S) | ()", w: "()()()" },
  { id: "pal", label: "Palindromes", src: "S -> aSa | bSb | a | b | ε", w: "abba" },
];
/** Type a grammar and a string: count its parse trees. Zero = not generated, one = unambiguous for this string, two or more = ambiguous. */
export function CfgLab() {
  const [src, setSrc] = useState(GRAMMARS[0].src); const [w, setW] = useState(GRAMMARS[0].w);
  const parsed = useMemo(() => T.parseGrammar(src), [src]);
  const trees = useMemo(() => (parsed ? T.countTrees(parsed.g, parsed.start, w) : 0), [parsed, w]);
  return (
    <Shell title="Parse-tree lab" note="Count the distinct parse trees a grammar gives a string. Two or more means the grammar is ambiguous." tint="sky">
      <div className="mt-3 flex flex-wrap gap-2">{GRAMMARS.map((g) => <Pill key={g.id} on={src === g.src} onClick={() => { setSrc(g.src); setW(g.w); }}>{g.label}</Pill>)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[2fr_1fr]"><Field label="Grammar (rules separated by ; , alternatives by |, ε for empty)" value={src} set={setSrc} /><Field label="String" value={w} set={setW} hint="Terminals are lowercase letters and ( ) + *" /></div>
      {!parsed ? <p className="mt-3 text-sm font-semibold text-rose-700 dark:text-rose-300">Write rules like S -&gt; aSb | ε</p> : (
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Stat label="Parse trees" value={trees} />
          <Stat label="Generated?" value={trees > 0 ? "Yes" : "No"} />
          <Stat label="For this string" value={trees > 1 ? "Ambiguous" : trees === 1 ? "Unambiguous" : "n/a"} />
        </div>
      )}
    </Shell>
  );
}

const CNF_SRC = "S -> AB | BC; A -> BA | a; B -> CC | b; C -> AB | a";
/** CYK on a fixed Chomsky-normal-form grammar: the triangular table, cell by cell. */
export function CykLab() {
  const [w, setW] = useState("baaba");
  const s = clean(w, ["a", "b"]).slice(0, 8);
  const g = useMemo(() => T.parseGrammar(CNF_SRC)!, []);
  const r = useMemo(() => T.cyk(g.g, g.start, s), [g, s]);
  return (
    <Shell title="CYK table lab" note="Grammar: S → AB | BC, A → BA | a, B → CC | b, C → AB | a. Each cell lists the variables that derive that substring." tint="butter">
      <div className="mt-3 max-w-xs"><Field label="String over {a, b} (up to 8)" value={w} set={setW} /></div>
      {s.length > 0 && (
        <div className="mt-3 overflow-x-auto"><table className="border-separate border-spacing-1 text-sm" aria-label="CYK table"><tbody>
          {Array.from({ length: s.length }, (_, k) => s.length - 1 - k).map((len) => (
            <tr key={len}>{Array.from({ length: s.length - len }, (_, i) => <td key={i} className="min-w-[3.5rem] rounded-lg bg-[var(--surface)] px-2 py-1.5 text-center font-num"><span className="block text-[10px] text-[var(--text-muted)]">{s.slice(i, i + len + 1)}</span>{r.table[i][i + len].join(",") || "·"}</td>)}</tr>
          ))}
        </tbody></table></div>
      )}
      <p className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-[var(--text-primary)]">{s ? <>Top cell {r.table[0]?.[s.length - 1]?.length ? r.table[0][s.length - 1].join(", ") : "empty"} · {s.length ? <Verdict ok={r.accepted} /> : null}</> : "Type a string."}</p>
    </Shell>
  );
}

const PDAS: { id: T.PdaKind; label: string; w: string }[] = [
  { id: "anbn", label: "aⁿbⁿ", w: "aaabbb" },
  { id: "wcwr", label: "w c wᴿ", w: "abcba" },
  { id: "balanced", label: "Balanced ( )", w: "(()())" },
];
/** Step through a pushdown automaton: remaining input, stack (top on the left) and the move made. */
export function PdaLab() {
  const [k, setK] = useState<T.PdaKind>("anbn"); const [w, setW] = useState("aaabbb");
  const alpha = k === "balanced" ? ["(", ")"] : k === "wcwr" ? ["a", "b", "c"] : ["a", "b"];
  const s = clean(w, alpha).slice(0, 12);
  const r = useMemo(() => T.runPDA(k, s), [k, s]);
  return (
    <Shell title="Pushdown automaton lab" note="Watch the stack. The top of the stack is the left end of each stack string." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{PDAS.map((p) => <Pill key={p.id} on={k === p.id} onClick={() => { setK(p.id); setW(p.w); }}>{p.label}</Pill>)}</div>
      <div className="mt-3 max-w-xs"><Field label="Input string" value={w} set={setW} /></div>
      <ol className="mt-3 grid gap-1.5" aria-label="PDA trace">{r.log.map((l, i) => <li key={i} className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.4fr)] gap-2 rounded-xl bg-[var(--surface)] px-3 py-1.5 text-sm"><span className="text-[var(--text-muted)]">{i}</span><span className="font-num">{l.rest}</span><span className="font-num">{l.stack}</span><span>{l.note}</span></li>)}</ol>
      <p className="mt-3 flex flex-wrap items-center gap-3 text-sm font-semibold text-[var(--text-primary)]">Tallest stack {r.maxStack} <Verdict ok={r.accepted} /></p>
    </Shell>
  );
}


/* ---------------------------------------------------------------- chapter 4: context-free closure and the pumping lemma */
const CF_LANGS: { id: T.CfPumpLang; label: string; w: string; lu: number; lv: number; lm: number; lx: number }[] = [
  { id: "anbn", label: "aⁿbⁿ (context-free)", w: "aaabbb", lu: 2, lv: 1, lm: 0, lx: 1 },
  { id: "anbncn", label: "aⁿbⁿcⁿ", w: "aaabbbccc", lu: 2, lv: 1, lm: 0, lx: 1 },
  { id: "ww", label: "ww", w: "aaabbbaaabbb", lu: 2, lv: 1, lm: 3, lx: 1 },
  { id: "square", label: "a^(n²)", w: "aaaaaaaaa", lu: 0, lv: 1, lm: 0, lx: 1 },
  { id: "ijk", label: "aⁱbʲcᵏ, i < j < k", w: "abbccc", lu: 0, lv: 1, lm: 0, lx: 0 },
];
/** You cut a string into u v w x y (v and x are pumped together), see the four pumped strings, and count how many allowed cuts survive. */
export function CfPumpLab() {
  const [L, setL] = useState<T.CfPumpLang>("anbncn"); const d0 = CF_LANGS.find((q) => q.id === "anbncn")!;
  const [w, setW] = useState(d0.w); const [lu, setLu] = useState(d0.lu); const [lv, setLv] = useState(d0.lv); const [lm, setLm] = useState(d0.lm); const [lx, setLx] = useState(d0.lx); const [p, setP] = useState(3);
  const pick = (id: T.CfPumpLang) => { const d = CF_LANGS.find((q) => q.id === id)!; setL(id); setW(d.w); setLu(d.lu); setLv(d.lv); setLm(d.lm); setLx(d.lx); };
  const n = w.length;
  const a = Math.min(lu, n), b = Math.min(lv, n - a), c = Math.min(lm, n - a - b), e = Math.min(lx, n - a - b - c);
  const r = T.pumpCf(L, w, a, b, c, e);
  const legal = b + e >= 1 && b + c + e <= p;
  const all = useMemo(() => (n <= 14 ? T.cfSplits(L, w, p) : null), [L, w, p, n]);
  const Num = ({ v, set, label, max }: { v: number; set: (x: number) => void; label: string; max: number }) => (
    <label className="block text-xs font-semibold text-[var(--text-secondary)]">{label}<input type="number" min={0} max={max} value={v} onChange={(ev) => set(Math.max(0, Math.min(max, Number(ev.target.value) || 0)))} className="mt-1 h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 font-num text-[var(--text-primary)]" /></label>
  );
  return (
    <Shell title="Pumping lemma lab (context-free)" note="Cut w into u v w x y, then pump v and x together. In a real proof the adversary picks the cut." tint="lilac">
      <div className="mt-3 flex flex-wrap gap-2">{CF_LANGS.map((q) => <Pill key={q.id} on={L === q.id} onClick={() => pick(q.id)}>{q.label}</Pill>)}</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-[2fr_1fr]"><Field label="String (it should be in the language)" value={w} set={(v) => setW(clean(v, ["a", "b", "c"]).slice(0, 14))} /><Num v={p} set={setP} label="Pumping length p" max={6} /></div>
      <div className="mt-2 grid grid-cols-4 gap-2"><Num v={lu} set={setLu} label="|u|" max={n} /><Num v={lv} set={setLv} label="|v|" max={n} /><Num v={lm} set={setLm} label="|w|" max={n} /><Num v={lx} set={setLx} label="|x|" max={n} /></div>
      <p className="mt-3 font-num text-sm">u = <b>{r.u || "ε"}</b> · v = <b>{r.v || "ε"}</b> · w = <b>{r.m || "ε"}</b> · x = <b>{r.x || "ε"}</b> · y = <b>{r.y || "ε"}</b></p>
      <p className={`mt-1 text-xs font-semibold ${legal ? "text-[var(--text-secondary)]" : "text-rose-700 dark:text-rose-300"}`}>{legal ? `A legal cut: |vwx| = ${b + c + e} ≤ p and |vx| = ${b + e} ≥ 1.` : `Not a legal cut: the lemma needs |vwx| ≤ ${p} and |vx| ≥ 1 (here |vwx| = ${b + c + e}, |vx| = ${b + e}).`}</p>
      <ol className="mt-2 grid gap-1.5 sm:grid-cols-4" aria-label="Pumped strings">{r.tries.map((t) => <li key={t.i} className={`rounded-xl px-3 py-2 text-sm ${t.ok ? "bg-[var(--surface)]" : "bg-rose-500/15"}`}><b className="font-num">i = {t.i}</b><span className="block text-xs">length {t.s.length}</span><span className="block break-all font-num text-xs">{t.s.length > 22 ? t.s.slice(0, 20) + "…" : t.s || "ε"}</span><span className="text-xs font-bold">{t.ok ? "in the language" : "out"}</span></li>)}</ol>
      <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{r.broken ? "This cut is broken: some i leaves the language." : "This cut survives every pump shown."}</p>
      {all ? <div className="mt-3 grid gap-2 sm:grid-cols-3"><Stat label="Legal cuts (|vwx| ≤ p, |vx| ≥ 1)" value={all.total} /><Stat label="Cuts that survive every pump" value={all.survive} /><Stat label="Verdict" value={all.survive === 0 ? "Every cut fails: not context-free" : "Some cut survives"} /></div> : <p className="mt-3 text-xs text-[var(--text-muted)]">Use a string of 14 symbols or fewer to count every legal cut.</p>}
    </Shell>
  );
}

const CF_CLASSIFY: { lang: string; kind: 0 | 1 | 2; why: string }[] = [
  { lang: "aⁿbⁿ", kind: 1, why: "Context-free (S → aSb | ε) and not regular." },
  { lang: "aⁿbⁿcⁿ", kind: 2, why: "Needs two comparisons at once: pump aᵖbᵖcᵖ." },
  { lang: "(ab)*", kind: 0, why: "Regular." },
  { lang: "ww", kind: 2, why: "Copying needs a queue, not a stack: pump aᵖbᵖaᵖbᵖ." },
  { lang: "w wᴿ", kind: 1, why: "A stack matches the second half to the first (non-deterministic)." },
  { lang: "aⁱbʲcᵏ with i = j or j = k", kind: 1, why: "A union of two context-free languages." },
  { lang: "aⁿ, n a perfect square", kind: 2, why: "Gaps between squares grow: not even context-free." },
  { lang: "#a = #b over {a, b}", kind: 1, why: "S → aSbS | bSaS | ε; ∩ a*b* gives aⁿbⁿ, so not regular." },
  { lang: "aⁱbʲcᵏ with i < j < k", kind: 2, why: "Two strict comparisons: pump aᵖbᵖ⁺¹cᵖ⁺²." },
  { lang: "{ aⁿbⁿ : n ≤ 100 }", kind: 0, why: "Finite, so regular." },
  { lang: "complement of ww", kind: 1, why: "Surprisingly context-free: a mismatch at one position can be guessed." },
  { lang: "aⁿbᵐcⁿ⁺ᵐ", kind: 1, why: "Context-free: a stack counts n then m and matches n + m c's." },
];
/** Guess the class of each language, then read why: regular, context-free but not regular, or not context-free. */
export function CfClassifyLab() {
  const [guess, setGuess] = useState<Record<number, number>>({});
  const names = ["Regular", "Context-free, not regular", "Not context-free"];
  const right = Object.entries(guess).filter(([k, v]) => CF_CLASSIFY[Number(k)].kind === v).length;
  return (
    <Shell title="Which class? lab" note="Decide for each language, then read the one-line reason." tint="butter">
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">{CF_CLASSIFY.map((c, k) => { const g = guess[k]; const done = g !== undefined; return (
        <li key={c.lang} className="rounded-2xl bg-[var(--surface)] p-3 text-sm">
          <p className="font-num font-bold text-[var(--text-primary)]">{c.lang}</p>
          {!done ? <div className="mt-2 flex flex-wrap gap-2">{names.map((nm, v) => <Pill key={nm} on={false} onClick={() => setGuess((x) => ({ ...x, [k]: v }))}>{nm}</Pill>)}</div>
            : <p className={`mt-1 ${g === c.kind ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}><b>{names[c.kind]}</b> ({g === c.kind ? "you were right" : "you said " + names[g].toLowerCase()}). {c.why}</p>}
        </li>
      ); })}</ul>
      <div className="mt-3 grid gap-2 sm:grid-cols-2"><Stat label="Answered" value={`${Object.keys(guess).length} of ${CF_CLASSIFY.length}`} /><Stat label="Correct" value={right} /></div>
    </Shell>
  );
}
