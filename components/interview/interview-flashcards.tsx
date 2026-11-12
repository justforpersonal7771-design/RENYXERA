"use client";

/**
 * Interview flashcards: same look and behaviour as the GATE flashcards (filters, progress bar, Again / Got it,
 * Leitner boxes 1-5 saved on this device) but a separate deck with its own progress and its own filters.
 * Cards come from /api/interview/cards (private) (terms, interview questions and self-check questions).
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, ChevronLeft, ChevronRight, Eye, Keyboard, Loader2, RotateCcw, Shuffle, Trophy } from "lucide-react";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { Segmented } from "@/components/ui/folder-tabs";
import { IvMarkdown } from "@/components/interview/iv-markdown";

type Card = { id: string; book: string; bookTitle: string; type: "Term" | "Question" | "Check"; ch: string; star: boolean; front: string; back: string; more: string };

const SR_KEY = "renyxera_interview_sr";
const GAP_DAYS = [0, 0, 1, 3, 7, 14]; // index = box (1..5)
type SR = Record<string, { box: number; due: number }>;
const readSR = (): SR => { try { return JSON.parse(localStorage.getItem(SR_KEY) ?? "{}"); } catch { return {}; } };
const writeSR = (s: SR) => { try { localStorage.setItem(SR_KEY, JSON.stringify(s)); } catch { /* private mode */ } };
const shuffle = <T,>(a: T[], seed: number) => { const r = [...a]; let s = seed; for (let i = r.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const TYPE_LABEL = { Term: "Key term", Question: "Interview question", Check: "Self-check" } as const;

export function InterviewFlashcards() {
  const reduce = useReducedMotion();
  const [cards, setCards] = useState<Card[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [book, setBook] = useState(() => (typeof window === "undefined" ? "all" : new URLSearchParams(window.location.search).get("book") ?? "all"));
  const [type, setType] = useState<"all" | Card["type"]>("all");
  const cram = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("cram") === "1";   // "10-minute cram" from Last moments
  const [star, setStar] = useState<"all" | "star">(cram ? "star" : "all");
  const [size, setSize] = useState<"10" | "20" | "40">(cram ? "40" : "20");
  const [mode, setMode] = useState<"due" | "new" | "all">("due");
  const [seed, setSeed] = useState(11);
  const [sr, setSr] = useState<SR>(() => (typeof window === "undefined" ? {} : readSR()));
  const [onlyIds, setOnlyIds] = useState<string[] | null>(null);

  useEffect(() => {
    let off = false;
    fetch("/api/interview/cards", { cache: "no-store" }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: Card[]) => { if (!off) setCards(d); }).catch(() => { if (!off) setFailed(true); });
    return () => { off = true; };
  }, []);

  const all = useMemo(() => cards ?? [], [cards]);
  const books = useMemo(() => [...new Map(all.map((c) => [c.book, c.bookTitle])).entries()].sort((a, b) => a[1].localeCompare(b[1])), [all]);
  const [now] = useState(() => Date.now());
  const deck = useMemo(() => {
    if (onlyIds) return all.filter((c) => onlyIds.includes(c.id));
    let pool = all.filter((c) => (book === "all" || c.book === book) && (type === "all" || c.type === type) && (star === "all" || c.star));
    if (mode === "new") pool = pool.filter((c) => !sr[c.id]);
    const ordered = shuffle(pool, seed);
    if (mode === "due") ordered.sort((a, b) => (sr[a.id] ? (sr[a.id].due <= now ? 0 : 2) : 1) - (sr[b.id] ? (sr[b.id].due <= now ? 0 : 2) : 1));
    return ordered.slice(0, Number(size));
    // sr is read only when the deck is (re)built, so cards do not jump while you answer
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, book, type, star, size, mode, seed, onlyIds]);
  const dueCount = useMemo(() => all.filter((c) => sr[c.id] && sr[c.id].due <= now).length, [all, sr, now]);

  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const done = Object.keys(results).length >= deck.length && deck.length > 0;
  const card = deck[Math.min(i, deck.length - 1)];
  const restart = (ids: string[] | null = null) => { setOnlyIds(ids); setI(0); setShown(false); setResults({}); if (!ids) setSeed((s) => s + 1); };
  const go = useCallback((d: number) => { setShown(false); setI((x) => Math.max(0, Math.min(deck.length - 1, x + d))); }, [deck.length]);
  const mark = useCallback((ok: boolean) => {
    if (!card) return;
    const cur = sr[card.id]?.box ?? 1;
    const box = ok ? Math.min(5, cur + 1) : 1;
    const next = { ...sr, [card.id]: { box, due: Date.now() + GAP_DAYS[box] * 86_400_000 } };
    setSr(next); writeSR(next);
    setResults((r) => ({ ...r, [card.id]: ok }));
    void fetch("/api/interview/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attempt: { kind: "card", id: card.id, ok, detail: { q: card.front.slice(0, 160), note: card.ch } } }) }).catch(() => undefined);
    go(1);
  }, [card, sr, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [role='listbox']")) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setShown(true); }
      else if (e.key === "1") mark(false);
      else if (e.key === "2") mark(true);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mark, go]);

  const filters = (
    <div className="flex flex-wrap items-center gap-3">
      <CustomDropdown value={book} onChange={(v) => { setBook(v); restart(); }} options={[{ label: "All books", value: "all" }, ...books.map(([id, title]) => ({ label: title, value: id }))]} className="w-72 text-sm" />
      <Segmented label="Kind" value={type} onChange={(v) => { setType(v); restart(); }} options={[{ id: "all", label: "All" }, { id: "Question", label: "Questions" }, { id: "Term", label: "Terms" }, { id: "Check", label: "Checks" }]} />
      <Segmented label="Chapters" value={star} onChange={(v) => { setStar(v); restart(); }} options={[{ id: "all", label: "All" }, { id: "star", label: "Star path" }]} />
      <Segmented label="Cards" value={size} onChange={(v) => { setSize(v); restart(); }} options={[{ id: "10", label: "10" }, { id: "20", label: "20" }, { id: "40", label: "40" }]} />
      <Segmented label="Which cards" value={mode} onChange={(v) => { setMode(v); restart(); }} options={[{ id: "due", label: `Due first${dueCount ? ` (${dueCount})` : ""}` }, { id: "new", label: "New only" }, { id: "all", label: "All" }]} />
      <button type="button" onClick={() => restart()} className="pill-soft"><Shuffle className="h-4 w-4" /> Shuffle</button>
    </div>
  );

  if (failed) return <div className="card-pastel p-8 text-center" data-tint="rose"><p className="font-bold text-[var(--text-primary)]">The interview cards could not load</p><p className="mt-1 text-sm text-[var(--text-secondary)]">Check your connection and reload the page.</p></div>;
  if (!cards) return <div className="flex items-center justify-center gap-2 p-10 text-[var(--text-secondary)]" role="status"><Loader2 className="h-5 w-5 animate-spin" /> Loading cards</div>;

  if (!deck.length) return (
    <div className="space-y-4">{filters}
      <div className="card-pastel p-8 text-center" data-tint="lilac">
        <p className="font-bold text-[var(--text-primary)]">No cards here yet</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{mode === "new" ? "You have seen every card in this filter. Try Due first or All." : "Pick another book or kind."}</p>
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

      <motion.article key={card.id} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="card-pastel w-full p-5 sm:p-7" data-tint={shown ? "mint" : "sky"}>
        <p className="text-xs font-semibold text-[var(--text-secondary)]">{card.bookTitle} · {card.ch} · {TYPE_LABEL[card.type]}</p>
        <p className="mt-3 font-display text-2xl font-extrabold leading-snug text-[var(--text-primary)]">{card.front}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          {!shown && <button type="button" onClick={() => setShown(true)} className="btn-main"><Eye className="h-4 w-4" /> Show answer</button>}
        </div>
        {shown && (
          <div className="mt-4 rounded-2xl bg-[var(--surface)] p-4 text-sm text-[var(--text-primary)]">
            <p className="font-bold">Answer</p>
            <div className="mt-1 text-base leading-relaxed"><IvMarkdown body={card.back} /></div>
            {card.more && <p className="mt-3 border-t border-dashed border-[var(--border)] pt-3 text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">In more detail:</b> {card.more}</p>}
          </div>
        )}
      </motion.article>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={() => go(-1)} disabled={i === 0} className="pill-soft disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Back</button>
        <button type="button" onClick={() => mark(false)} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tint-rose)] px-4 py-2 text-sm font-bold text-[var(--tint-rose-ink)]"><RotateCcw className="h-4 w-4" /> Again <kbd className="rounded bg-[var(--surface)] px-1.5 text-xs">1</kbd></button>
        <button type="button" onClick={() => mark(true)} className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tint-mint)] px-4 py-2 text-sm font-bold text-[var(--tint-mint-ink)]"><Check className="h-4 w-4" /> Got it <kbd className="rounded bg-[var(--surface)] px-1.5 text-xs">2</kbd></button>
        <button type="button" onClick={() => go(1)} disabled={i >= deck.length - 1} className="pill-soft disabled:opacity-40">Skip <ChevronRight className="h-4 w-4" /></button>
      </div>
      <p className="flex flex-wrap items-center justify-center gap-2 text-xs text-[var(--text-secondary)]"><Keyboard className="h-3.5 w-3.5" /> Space show answer · 1 Again · 2 Got it · ← → move</p>
    </div>
  );
}
