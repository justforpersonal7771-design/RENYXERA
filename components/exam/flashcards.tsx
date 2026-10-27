"use client";

/**
 * Flashcards for every question source (GATE PYQs, Forge, Spark, Blend).
 * - Spaced repetition (Leitner boxes 1-5, saved per device): "Again" sends a card to box 1, "Got it" moves it up;
 *   each box comes back after 0/1/3/7/14 days. "Due first" decks show what needs revising now.
 * - Filters: subject, difficulty, deck size; modes: due first, new only, all.
 * - Flip to see the answer (official keys unlocked per card through ensureAnswers), Forge worked steps.
 * - Keyboard: Space/Enter flip, 1 = Again, 2 = Got it, arrows move. Progress bar, end-of-deck summary,
 *   "revise the missed cards" and a new shuffled deck.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Keyboard, Loader2, RotateCcw, Shuffle, Trophy } from "lucide-react";
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
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const done = Object.keys(results).length >= deck.length && deck.length > 0;
  const card = deck[Math.min(i, deck.length - 1)];

  const restart = (ids: string[] | null = null) => { setOnlyIds(ids); setI(0); setFlipped(false); setResults({}); if (!ids) setSeed((s) => s + 1); };
  const flip = useCallback(async () => {
    if (!card) return;
    // AI questions carry their own answers; official ones are unlocked per card from the server.
    if (!flipped && card.kind === "bank" && card.q && !card.id.startsWith("ai_")) {
      setLoading(true); await ensureAnswers([card.id]).catch(() => false); setLoading(false);
    }
    setFlipped((f) => !f);
  }, [card, flipped]);
  const go = useCallback((d: number) => { setFlipped(false); setI((x) => Math.max(0, Math.min(deck.length - 1, x + d))); }, [deck.length]);
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
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
      else if (e.key === "1") mark(false);
      else if (e.key === "2") mark(true);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flip, mark, go]);

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

      <div className="mx-auto max-w-3xl [perspective:1600px]">
        <motion.div key={card.id} initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="relative min-h-[360px] transition-transform duration-500 motion-reduce:transition-none [transform-style:preserve-3d]" style={{ transform: flipped ? "rotateY(180deg)" : "none" }}>
          <button type="button" onClick={flip} aria-label="Show the answer" aria-hidden={flipped} tabIndex={flipped ? -1 : 0} className="card-pastel absolute inset-0 flex flex-col p-6 text-left [backface-visibility:hidden]" data-tint="sky">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">{card.subject} · {card.topic} · {{ E: "Easy", M: "Medium", H: "Hard" }[card.diff]}</span>
            <div className="mt-3 flex-1 overflow-auto text-[var(--text-primary)]">
              {card.kind === "forge" ? <p className="leading-relaxed">{card.forge!.text}</p> : <AstNodeRenderer nodes={card.q!.contentAst} />}
              {card.kind === "bank" && card.q!.options?.length ? (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">{(card.q!.options as Opt[]).map((o) => <li key={o.option_id} className="flex gap-2 rounded-xl bg-[var(--surface)] p-2.5 text-sm"><b>{o.option_id}</b><div className="min-w-0">{o.contentAst ? <AstNodeRenderer nodes={o.contentAst} /> : null}</div></li>)}</ul>
              ) : null}
              {card.kind === "forge" && card.forge!.options ? <ul className="mt-3 grid gap-2 sm:grid-cols-2">{card.forge!.options.map((o, k) => <li key={k} className="rounded-xl bg-[var(--surface)] p-2.5 text-sm"><b>{"ABCD"[k]}</b> {o}</li>)}</ul> : null}
            </div>
            <span className="mt-3 inline-flex items-center gap-2 self-center rounded-full bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)]">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />} Tap or press Space to flip</span>
          </button>
          <button type="button" onClick={flip} aria-label="Show the question" aria-hidden={!flipped} tabIndex={flipped ? 0 : -1} className="card-pastel absolute inset-0 flex flex-col p-6 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]" data-tint="mint">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Answer</span>
            <div className="mt-3 flex-1 overflow-auto text-[var(--text-primary)]">
              {card.kind === "forge" ? (
                <>
                  <p className="font-display text-3xl font-extrabold">{card.forge!.answer}</p>
                  <ol className="mt-3 space-y-1.5 text-sm text-[var(--text-secondary)]">{card.forge!.solution.steps.map((s, k) => <li key={k}><b className="text-[var(--text-primary)]">{k + 1}.</b> {s}</li>)}</ol>
                  <p className="mt-3 text-sm"><b>Shortcut:</b> {card.forge!.solution.shortcut}</p>
                  <p className="mt-1 text-sm"><b>Trap:</b> {card.forge!.solution.trap}</p>
                </>
              ) : <BankAnswer q={card.q!} />}
            </div>
            <span className="mt-3 text-center text-sm text-[var(--text-secondary)]">Did you know it? Press 1 for Again, 2 for Got it</span>
          </button>
        </motion.div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={() => go(-1)} disabled={i === 0} className="pill-soft disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Back</button>
        <button type="button" onClick={() => mark(false)} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tint-rose)] px-4 py-2 text-sm font-bold text-[var(--tint-rose-ink)]"><RotateCcw className="h-4 w-4" /> Again <kbd className="rounded bg-[var(--surface)] px-1.5 text-xs">1</kbd></button>
        <button type="button" onClick={() => mark(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tint-mint)] px-4 py-2 text-sm font-bold text-[var(--tint-mint-ink)]"><Check className="h-4 w-4" /> Got it <kbd className="rounded bg-[var(--surface)] px-1.5 text-xs">2</kbd></button>
        <button type="button" onClick={() => go(1)} disabled={i >= deck.length - 1} className="pill-soft disabled:opacity-40">Skip <ChevronRight className="h-4 w-4" /></button>
      </div>
      <p className="flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-secondary)]"><Keyboard className="h-3.5 w-3.5" /> Space flip · 1 Again · 2 Got it · ← → move
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
