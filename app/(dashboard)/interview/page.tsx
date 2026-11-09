"use client";

/** Interview home: what to do today (practise, test, fix, ask), where you stopped, and how each track is going. All numbers are yours. */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Brain, ClipboardCheck, Code2, Database, NotebookPen, Sparkles, Target, Wrench } from "lucide-react";
import { useIvLibrary } from "@/components/interview/use-iv-library";
import { TRACKS, bookIdOf } from "@/lib/interview/tracks";

type Att = { item_kind: string; item_id: string; ok: boolean; created_at: string };
const SR_KEY = "renyxera_interview_sr";
const dueCards = () => { try { const sr = JSON.parse(localStorage.getItem(SR_KEY) ?? "{}") as Record<string, { due: number }>; const now = Date.now(); return Object.values(sr).filter((x) => x.due <= now).length; } catch { return 0; } };

export default function InterviewHome() {
  const { ready, docs, done, progress } = useIvLibrary();
  const [att, setAtt] = useState<Att[]>([]);
  const [due, setDue] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the due-card count from this device after mount
    setDue(dueCards());
    void fetch("/api/interview/progress", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { attempts: Att[] } | null) => setAtt(d?.attempts ?? []));
  }, []);

  const last = useMemo(() => [...progress].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0], [progress]);
  const lastDoc = docs.find((d) => d.id === last?.doc_id);
  const nextDoc = lastDoc && !done.has(lastDoc.id) ? lastDoc : docs.find((d) => !done.has(d.id) && d.kind === "chapter");
  const open = useMemo(() => { const m = new Map<string, { fails: number; last: string; ok: boolean }>(); for (const a of [...att].reverse()) { const k = a.item_kind + ":" + a.item_id; const e = m.get(k) ?? { fails: 0, last: a.created_at, ok: true }; if (!a.ok) e.fails++; e.ok = a.ok; m.set(k, e); } return [...m.values()].filter((e) => e.fails > 0 && !e.ok).length; }, [att]);
  const weak = useMemo(() => {
    const m = new Map<string, { n: number; f: number }>();
    for (const a of att) { if (a.item_kind !== "card" && a.item_kind !== "mock" && a.item_kind !== "lab") continue; const b = bookIdOf(a.item_id); const e = m.get(b) ?? { n: 0, f: 0 }; e.n++; if (!a.ok) e.f++; m.set(b, e); }
    return [...m.entries()].filter(([, e]) => e.f > 0).sort((a, b) => b[1].f / b[1].n - a[1].f / a[1].n).slice(0, 3).map(([b, e]) => ({ book: b, title: docs.find((d) => d.book === b)?.book_title ?? b, pct: Math.round((e.f / e.n) * 100) }));
  }, [att, docs]);
  const total = docs.length, read = docs.filter((d) => done.has(d.id)).length;

  const tiles = [
    { href: "/interview-cards", icon: Brain, tint: "lilac", title: "Practise now", text: due ? `${due} flashcards are due.` : "Spaced-repetition flashcards.", cta: due ? "Review due cards" : "Start a deck" },
    { href: "/interview/tutor?mode=mock", icon: ClipboardCheck, tint: "mint", title: "Test now", text: "A mock interviewer asks a real question and scores your answer.", cta: "Start a mock" },
    { href: "/interview/progress", icon: Wrench, tint: "peach", title: "Fix mistakes", text: open ? `${open} items still failing.` : "Nothing failing yet.", cta: "Open the fix list" },
    { href: "/interview/tutor", icon: Sparkles, tint: "sky", title: "Ask the tutor", text: "Explain, simplify, quiz or review your code.", cta: "Open the tutor" },
  ] as const;

  return (
    <div className="space-y-8">
      <section className="card-pastel p-6 sm:p-8" data-tint="butter" aria-label="Interview plan">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <span className="section-label"><Target className="h-3.5 w-3.5" /> Interview preparation</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] text-[var(--text-primary)] sm:text-5xl">Read it, run it,<br />get tested on it.</h1>
            <p className="mt-3 max-w-xl text-[var(--text-secondary)]">One loop for every topic: read the lesson, practise with cards and code, sit a mock, then fix what you missed. Your highlights, notes and mistakes follow you everywhere.</p>
          </div>
          <div className="card-inset space-y-3 p-5">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{ready ? `${read} of ${total} lessons read` : "Loading your library…"}</p>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full bg-[var(--ink)]" style={{ width: `${total ? (read / total) * 100 : 0}%` }} /></div>
            {nextDoc ? <Link href={`/interview/read?doc=${encodeURIComponent(nextDoc.id)}`} className="btn-main w-full justify-center">{read ? "Continue" : "Start"}: {nextDoc.title.slice(0, 26)}{nextDoc.title.length > 26 ? "…" : ""}</Link> : <Link href="/interview/read" className="btn-main w-full justify-center">Open the library</Link>}
            {nextDoc && <p className="truncate text-xs text-[var(--text-muted)]">{nextDoc.book_title}</p>}
          </div>
        </div>
      </section>

      <section aria-label="Today">
        <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">Today</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {tiles.map((t) => (
            <li key={t.title}>
              <Link href={t.href} className="card-pastel flex h-full min-h-[170px] flex-col gap-2 p-5" data-tint={t.tint}>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--surface)]"><t.icon className="h-5 w-5" aria-hidden /></span>
                <span className="font-display text-lg font-extrabold text-[var(--text-primary)]">{t.title}</span>
                <span className="text-sm text-[var(--text-secondary)]">{t.text}</span>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-[var(--text-primary)]">{t.cta}<ArrowRight className="h-4 w-4" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {weak.length > 0 && (
        <section className="card-pastel p-5" data-tint="rose" aria-label="Weak spots">
          <p className="font-bold text-[var(--text-primary)]">Where you slip most</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">{weak.map((w) => <li key={w.book}><Link href={`/interview/read?book=${encodeURIComponent(w.book)}`} className="flex items-center justify-between gap-2 rounded-xl bg-[var(--surface)] px-3 py-2 text-sm"><span className="truncate font-semibold">{w.title}</span><span className="font-num shrink-0 text-xs text-[var(--text-secondary)]">{w.pct}% missed</span></Link></li>)}</ul>
        </section>
      )}

      <section aria-label="Tracks">
        <div className="flex items-baseline justify-between"><h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">Tracks</h2><Link href="/interview/read" className="text-sm font-bold text-[var(--text-secondary)]">Whole library</Link></div>
        <ul className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {TRACKS.map((t) => {
            const ds = docs.filter((d) => t.books.includes(d.book)), n = ds.filter((d) => done.has(d.id)).length;
            return (
              <li key={t.id}>
                <Link href={`/interview/read?book=${encodeURIComponent(t.books.find((b) => ds.some((d) => d.book === b)) ?? t.books[0])}`} className="card-pastel flex h-full flex-col gap-1 p-5" data-tint={t.tint}>
                  <span className="font-display text-lg font-extrabold text-[var(--text-primary)]">{t.title}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{t.blurb}</span>
                  <span className="mt-3 flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]"><span>{t.books.length} books</span><span className="font-num">{n}/{ds.length}</span></span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[var(--surface)]"><span className="block h-full rounded-full bg-[var(--ink)]" style={{ width: `${ds.length ? (n / ds.length) * 100 : 0}%` }} /></span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-label="Tools" className="flex flex-wrap gap-2">
        <Link href="/interview/lab" className="pill-soft"><Code2 className="h-4 w-4" />Code lab</Link>
        <Link href="/interview/sql" className="pill-soft"><Database className="h-4 w-4" />SQL practice</Link>
        <Link href="/interview/notes" className="pill-soft"><NotebookPen className="h-4 w-4" />Notebook</Link>
      </section>
    </div>
  );
}
