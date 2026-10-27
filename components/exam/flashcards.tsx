"use client";

/**
 * Flashcards for every question source (GATE PYQs, Forge, Spark, Blend).
 * - Spaced repetition (Leitner boxes 1-5, saved per device): "Again" sends a card to box 1, "Got it" moves it up;
 *   each box comes back after 0/1/3/7/14 days. "Due first" decks show what needs revising now.
 * - Filters: subject, difficulty, deck size; modes: due first, new only, all.
 * - Answer each card like a question (options / NAT), check it (green / red), then see the answer and Forge steps.
 * - Keyboard: Space/Enter flip, 1 = Again, 2 = Got it, arrows move. Progress bar, end-of-deck summary,
 *   "revise the missed cards" and a new shuffled deck.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Check, X, ChevronLeft, ChevronRight, Keyboard, Loader2, RotateCcw, Shuffle, Trophy } from "lucide-react";
import type { RenderableQuestion } from "@/types/question.types";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import { ensureAnswers } from "@/lib/repository/answer-keys";
import { FORGE_ITEMS } from "@/lib/preview/sample-data";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { Segmented } from "@/components/ui/folder-tabs";

export type FlashSource = "pyq" | "forge" | "ai" | "mix";
type Opt = { option_id: string; is_correct?: boolean; contentAst?: RenderableQuestion["contentAst"] };
type Card = { id: string; subject: string; topic: string; diff: "E" | "M" | "H"; kind: "bank" | "forge"; q?: RenderableQuestion; forge?: (typeof FORGE_ITEMS)[number] };

// ---- spaced repetition store (per device) ----
const SR_KEY = "renyxera_flash_sr";
const GAP_DAYS = [0, 0, 1, 3, 7, 14]; // index = box (1..5)
type SR = Record<string, { box: number; due: number }>;
const readSR = (): SR => { try { return JSON.parse(localStorage.getItem(SR_KEY) ?? "{}"); } catch { return {}; } };
const writeSR = (s: SR) => { try { localStorage.setItem(SR_KEY, JSON.stringify(s)); } catch { /* private mode */ } };

const diffOf = (d?: string): "E" | "M" | "H" => (/easy/i.test(d ?? "") ? "E" : /hard/i.test(d ?? "") ? "H" : "M");
const shuffle = <T,>(a: T[], seed: number) => { const r = [...a]; let s = seed; for (let i = r.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };

export function Flashcards({ source, pyq, ai }: { source: FlashSource; pyq: RenderableQuestion[]; ai: RenderableQuestion[] }) {
  const reduce = useReducedMotion();
  const [subject, setSubject] = useState("all");
  const [diff, setDiff] = useState<"all" | "E" | "M" | "H">("all");
  const [size, setSize] = useState<"10" | "20" | "40">("20");
  const [mode, setMode] = useState<"due" | "new" | "all">("due");
  const [seed, setSeed] = useState(7);
  const [sr, setSr] = useState<SR>(() => (typeof window === "undefined" ? {} : readSR()));
  const [onlyIds, setOnlyIds] = useState<string[] | null>(null); // "revise missed" deck

  const all: Card[] = useMemo(() => {
    const bank = (qs: RenderableQuestion[]): Card[] => qs.filter((q) => q.contentAst?.length).map((q) => ({ id: q.question_id, subject: q.subject, topic: q.topic, diff: diffOf(q.difficulty), kind: "bank", q }));
    const forge: Card[] = FORGE_ITEMS.map((f) => ({ id: f.id, subject: f.subject, topic: f.topic, diff: f.difficulty, kind: "forge", forge: f }));
    return source === "pyq" ? bank(pyq) : source === "ai" ? bank(ai) : source === "forge" ? forge : [...bank(pyq).slice(0, 400), ...bank(ai), ...forge];
  }, [source, pyq, ai]);
  const subjects = useMemo(() => [...new Set(all.map((c) => c.subject).filter(Boolean))].sort(), [all]);
  const now = Date.now();
  const deck = useMemo(() => {
    if (onlyIds) return all.filter((c) => onlyIds.includes(c.id));
    let pool = all.filter((c) => (subject === "all" || c.subject === subject) && (diff === "all" || c.diff === diff));
    if (mode === "new") pool = pool.filter((c) => !sr[c.id]);
    const ordered = shuffle(pool, seed);
    if (mode === "due") ordered.sort((a, b) => (sr[a.id] ? (sr[a.id].due <= now ? 0 : 2) : 1) - (sr[b.id] ? (sr[b.id].due <= now ? 0 : 2) : 1));
    return ordered.slice(0, Number(size));
    // sr deliberately read only when the deck is (re)built, so cards don't jump while you answer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, subject, diff, size, mode, seed, onlyIds]);
  const dueCount = useMemo(() => all.filter((c) => sr[c.id] && sr[c.id].due <= now).length, [all, sr, now]);

  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [nat, setNat] = useState("");
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const done = Object.keys(results).length >= deck.length && deck.length > 0;
  const card = deck[Math.min(i, deck.length - 1)];
  const resetCard = () => { setPicked([]); setNat(""); setChecked(false); setRevealed(false); };

  // Options and type for the current card (bank questions render their own AST; Forge has plain text).
  const qType = card?.kind === "forge" ? card.forge!.type : (card?.q?.question_type ?? "MCQ");
  const opts: { id: string; correct: boolean; node: React.ReactNode }[] = !card ? [] : card.kind === "forge"
    ? (card.forge!.options ?? []).map((o, k) => ({ id: "ABCD"[k], correct: card.forge!.answer === "ABCD"[k], node: o }))
    : ((card.q!.options ?? []) as Opt[]).map((o) => ({ id: o.option_id, correct: !!o.is_correct, node: o.contentAst ? <AstNodeRenderer nodes={o.contentAst} /> : null }));
  const natOk = (() => {
    const v = Number(nat); if (!nat.trim() || Number.isNaN(v)) return false;
    if (card?.kind === "forge") { const k = Number(card.forge!.answer); return Math.abs(v - k) <= Math.abs(k) * 0.005 + 1e-9; }
    const r = card?.q?.nat_answer_range as { min: number; max: number; ranges?: { min: number; max: number }[] } | undefined;
    return !!r && (r.ranges ?? [r]).some((x) => v >= x.min && v <= x.max);
  })();
  const isRight = !revealed && (qType === "NAT" ? natOk : opts.length > 0 && opts.every((o) => o.correct === picked.includes(o.id)));

  const unlock = useCallback(async () => {
    // AI questions carry their own answers; official ones are unlocked per card from the server.
    if (card?.kind === "bank" && !card.id.startsWith("ai_")) { setLoading(true); await ensureAnswers([card.id]).catch(() => false); setLoading(false); }
  }, [card]);
  const check = useCallback(async () => { await unlock(); setChecked(true); }, [unlock]);
  const reveal = useCallback(async () => { await unlock(); setRevealed(true); setChecked(true); }, [unlock]);
  const restart = (ids: string[] | null = null) => { setOnlyIds(ids); setI(0); resetCard(); setResults({}); if (!ids) setSeed((s) => s + 1); };
  const go = useCallback((d: number) => { resetCard(); setI((x) => Math.max(0, Math.min(deck.length - 1, x + d))); }, [deck.length]);
  const mark = useCallback((ok: boolean) => {
    if (!card) return;
    const cur = sr[card.id]?.box ?? 1;
    const box = ok ? Math.min(5, cur + 1) : 1;
    const next = { ...sr, [card.id]: { box, due: Date.now() + GAP_DAYS[box] * 86_400_000 } };
    setSr(next); writeSR(next);
    setResults((r) => ({ ...r, [card.id]: ok }));
    go(1);
  }, [card, sr, go]);

  // Keyboard: Space/Enter flip, 1 again, 2 got it, arrows move.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [role='listbox']")) return;
      if (e.key === "Enter") { e.preventDefault(); if (!checked) check(); }
      else if (e.key === "1") mark(false);
      else if (e.key === "2") mark(true);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [check, checked, mark, go]);

  const filters = (
    <div className="flex flex-wrap items-center gap-3">
      <CustomDropdown value={subject} onChange={(v) => { setSubject(v); restart(); }} options={[{ label: "All subjects", value: "all" }, ...subjects.map((s) => ({ label: s, value: s }))]} className="w-60 text-sm" />
      <Segmented label="Difficulty" value={diff} onChange={(v) => { setDiff(v); restart(); }} options={[{ id: "all", label: "All" }, { id: "E", label: "Easy" }, { id: "M", label: "Medium" }, { id: "H", label: "Hard" }]} />
      <Segmented label="Cards" value={size} onChange={(v) => { setSize(v); restart(); }} options={[{ id: "10", label: "10" }, { id: "20", label: "20" }, { id: "40", label: "40" }]} />
      <Segmented label="Which cards" value={mode} onChange={(v) => { setMode(v); restart(); }} options={[{ id: "due", label: `Due first${dueCount ? ` (${dueCount})` : ""}` }, { id: "new", label: "New only" }, { id: "all", label: "All" }]} />
      <button type="button" onClick={() => restart()} className="pill-soft"><Shuffle className="h-4 w-4" /> Shuffle</button>
    </div>
  );

  if (!deck.length) return (
    <div className="space-y-4">{filters}
      <div className="card-pastel p-8 text-center" data-tint="lilac">
        <p className="font-bold text-[var(--text-primary)]">No cards here yet</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{source === "ai" ? "Make a Spark set first, then revise it as flashcards." : mode === "new" ? "You have seen every card in this filter. Try Due first or All." : "Pick another subject or difficulty."}</p>
      </div>
    </div>
  );

  const got = Object.values(results).filter(Boolean).length, missed = deck.filter((c) => results[c.id] === false).map((c) => c.id);
  if (done) return (
    <div className="space-y-4">{filters}
      <div className="card-pastel mx-auto max-w-xl p-8 text-center" data-tint="mint">
        <Trophy className="mx-auto h-8 w-8 text-[var(--tint-mint-ink)]" />
        <p className="mt-2 font-display text-3xl font-extrabold text-[var(--text-primary)]">{got} of {deck.length} remembered</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Cards you missed come back tomorrow; the ones you knew come back later and later.</p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          {missed.length > 0 && <button type="button" onClick={() => restart(missed)} className="btn-main"><RotateCcw className="h-4 w-4" /> Revise the {missed.length} missed</button>}
          <button type="button" onClick={() => restart()} className="pill-soft"><Shuffle className="h-4 w-4" /> New deck</button>
        </div>
      </div>
    </div>
  );

  const box = sr[card.id]?.box;
  return (
    <div className="space-y-4">
      {filters}
      <div>
        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
          <span>Card <b className="font-num text-[var(--text-primary)]">{i + 1}</b> of {deck.length}{box ? ` · box ${box} of 5` : " · new card"}</span>
          <span><b className="text-[var(--tint-mint-ink)]">{got} got it</b> · <b className="text-[var(--tint-rose-ink)]">{Object.values(results).filter((x) => !x).length} again</b></span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface)]" role="progressbar" aria-valuenow={Object.keys(results).length} aria-valuemin={0} aria-valuemax={deck.length} aria-label="Deck progress">
          <div className="h-full rounded-full bg-[var(--tint-mint-ink)] transition-[width]" style={{ width: `${(Object.keys(results).length / deck.length) * 100}%` }} />
        </div>
      </div>

      {/* Full-width card: answer it like a question (pick options / type the value), check, then see the answer. */}
      <motion.article key={card.id} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="card-pastel w-full p-5 sm:p-7" data-tint={checked ? (isRight ? "mint" : "rose") : "sky"}>
        <p className="text-xs font-semibold text-[var(--text-secondary)]">{card.subject} · {card.topic} · {{ E: "Easy", M: "Medium", H: "Hard" }[card.diff]} · {qType}</p>
        <div className="mt-3 text-[var(--text-primary)] leading-relaxed">
          {card.kind === "forge" ? <p>{card.forge!.text}</p> : <AstNodeRenderer nodes={card.q!.contentAst} />}
        </div>
        {opts.length > 0 && (
          <div className="mt-4 grid gap-2.5 md:grid-cols-2" role={qType === "MSQ" ? "group" : "radiogroup"} aria-label="Options">
            {opts.map((o) => {
              const sel = picked.includes(o.id);
              const state = checked ? (o.correct ? "right" : sel ? "wrong" : "idle") : sel ? "picked" : "idle";
              const look = { right: "border-emerald-500 bg-[var(--tint-mint)]", wrong: "border-rose-500 bg-[var(--tint-rose)]", picked: "border-[var(--tint-lilac-ink)] bg-[var(--tint-lilac)]", idle: "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--text-secondary)]" }[state];
              return (
                <button key={o.id} type="button" disabled={checked} role={qType === "MSQ" ? "checkbox" : "radio"} aria-checked={sel}
                  onClick={() => setPicked((p) => qType === "MSQ" ? (p.includes(o.id) ? p.filter((x) => x !== o.id) : [...p, o.id]) : [o.id])}
                  className={`flex items-start gap-3 rounded-2xl border-2 p-3 text-left text-sm text-[var(--text-primary)] transition-colors disabled:cursor-default ${look}`}>
                  <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg font-num text-xs font-bold ${state === "right" ? "bg-emerald-500 text-white" : state === "wrong" ? "bg-rose-500 text-white" : state === "picked" ? "bg-[var(--tint-lilac-ink)] text-white" : "border border-[var(--border)]"}`}>
                    {state === "right" ? <Check className="h-3.5 w-3.5" /> : state === "wrong" ? <X className="h-3.5 w-3.5" /> : o.id}</span>
                  <span className="min-w-0 flex-1">{o.node}</span>
                </button>
              );
            })}
          </div>
        )}
        {qType === "NAT" && (
          <input inputMode="decimal" value={nat} disabled={checked} onChange={(e) => setNat(e.target.value.replace(/[^0-9.eE+-]/g, ""))} placeholder="Type your answer"
            aria-label="Your answer" className={`mt-4 h-12 w-full max-w-sm rounded-2xl border-2 bg-[var(--surface)] px-4 font-num text-[var(--text-primary)] outline-none ${checked ? (isRight ? "border-emerald-500" : "border-rose-500") : "border-[var(--border)] focus:border-[var(--tint-lilac-ink)]"}`} />
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!checked ? (
            <>
              <button type="button" onClick={check} disabled={loading || (qType === "NAT" ? !nat.trim() : !picked.length)} className="btn-main disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Check answer</button>
              <button type="button" onClick={reveal} className="pill-soft">Just show the answer</button>
            </>
          ) : (
            <p role="status" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ${isRight ? "bg-[var(--surface)] text-[var(--tint-mint-ink)]" : "bg-[var(--surface)] text-[var(--tint-rose-ink)]"}`}>
              {revealed ? "Answer shown" : isRight ? <><Check className="h-4 w-4" /> Correct</> : <><X className="h-4 w-4" /> Not quite</>}</p>
          )}
        </div>
        {checked && (
          <div className="mt-4 rounded-2xl bg-[var(--surface)] p-4 text-sm text-[var(--text-primary)]">
            <p className="font-bold">Answer</p>
            {card.kind === "forge" ? (
              <>
                <p className="mt-1 font-display text-2xl font-extrabold">{card.forge!.answer}</p>
                <ol className="mt-2 space-y-1 text-[var(--text-secondary)]">{card.forge!.solution.steps.map((st, k) => <li key={k}><b className="text-[var(--text-primary)]">{k + 1}.</b> {st}</li>)}</ol>
                <p className="mt-2"><b>Shortcut:</b> {card.forge!.solution.shortcut}</p>
                <p className="mt-1"><b>Trap:</b> {card.forge!.solution.trap}</p>
              </>
            ) : <div className="mt-1"><BankAnswer q={card.q!} /></div>}
          </div>
        )}
      </motion.article>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={() => go(-1)} disabled={i === 0} className="pill-soft disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Back</button>
        <button type="button" onClick={() => mark(false)} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tint-rose)] px-4 py-2 text-sm font-bold text-[var(--tint-rose-ink)]"><RotateCcw className="h-4 w-4" /> Again <kbd className="rounded bg-[var(--surface)] px-1.5 text-xs">1</kbd></button>
        <button type="button" onClick={() => mark(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tint-mint)] px-4 py-2 text-sm font-bold text-[var(--tint-mint-ink)]"><Check className="h-4 w-4" /> Got it <kbd className="rounded bg-[var(--surface)] px-1.5 text-xs">2</kbd></button>
        <button type="button" onClick={() => go(1)} disabled={i >= deck.length - 1} className="pill-soft disabled:opacity-40">Skip <ChevronRight className="h-4 w-4" /></button>
      </div>
      <p className="flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-secondary)]"><Keyboard className="h-3.5 w-3.5" /> Enter check · 1 Again · 2 Got it · ← → move
        {card.kind === "bank" && card.topic && <> · <Link href={`/setup?topic=${encodeURIComponent(card.topic)}&subject=${encodeURIComponent(card.subject)}`} className="font-semibold underline underline-offset-4">Practise {card.topic} as a test</Link></>}</p>
    </div>
  );
}

function BankAnswer({ q }: { q: RenderableQuestion }) {
  if (q.question_type === "NAT") {
    const r = q.nat_answer_range;
    return r ? <p className="font-display text-3xl font-extrabold">{r.min === r.max ? r.min : `${r.min} to ${r.max}`}</p> : <NoKey />;
  }
  const right = ((q.options ?? []) as Opt[]).filter((o) => o.is_correct);
  if (!right.length) return <NoKey />;
  return (
    <ul className="space-y-2">{right.map((o) => (
      <li key={o.option_id} className="flex gap-2 rounded-xl bg-[var(--surface)] p-3"><b className="text-[var(--tint-mint-ink)]">{o.option_id}</b><div className="min-w-0">{o.contentAst ? <AstNodeRenderer nodes={o.contentAst} /> : null}</div></li>
    ))}</ul>
  );
}

function NoKey() {
  return <p className="text-sm text-[var(--text-secondary)]">Connect to the internet to see this answer.</p>;
}
