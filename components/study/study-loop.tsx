"use client";

/**
 * Study as part of the whole app: a "study loop" card (read, practise, review, improve, with the one best next move) and a
 * "reading vs score" table for Analytics. Both are built from what the app already knows: topics read on this device and the
 * student's scores per subject (lib/study/readiness.ts).
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { readSeen } from "@/lib/study/progress";
import { bookOfSubject, packOfBook } from "@/lib/study/packs";
import { CS_SHELF } from "@/lib/study/catalog";
import { MIN_ATTEMPTS, firstChapterHref, nextStep, readinessRows, type BookRow, type Verdict } from "@/lib/study/readiness";
import { useStudyAccess } from "@/lib/study/use-study-access";
import { useAnalyticsStore } from "@/store/use-analytics-store";
import { openStudyShop } from "@/store/use-study-shop-store";
import type { SubjectAnalytics } from "@/types/analytics.types";

export function useReadiness(subjects: SubjectAnalytics[]): BookRow[] {
  const access = useStudyAccess();
  const [seen, setSeen] = useState<ReturnType<typeof readSeen>>({});
  // eslint-disable-next-line react-hooks/set-state-in-effect -- device-only reading progress, read once after mount
  useEffect(() => setSeen(readSeen()), []);
  return useMemo(() => readinessRows(subjects, seen, (id) => { const p = packOfBook(id); return access.all || (!!p && access.packs.includes(p.id)); }), [subjects, seen, access.all, access.packs]);
}

const CHIP: Record<Verdict, { text: string; cls: string }> = {
  "unread-low": { text: "Weak, not read yet", cls: "bg-rose-500/15 text-rose-700 dark:text-rose-300" },
  "read-low": { text: "Read, still weak", cls: "bg-amber-500/15 text-amber-700 dark:text-amber-300" },
  strong: { text: "Looking strong", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" },
  "read-untested": { text: "Read, not tested", cls: "bg-sky-500/15 text-sky-700 dark:text-sky-300" },
  unread: { text: "Not started", cls: "bg-[var(--surface-secondary)] text-[var(--text-secondary)]" },
};

/** Study on the screens you already use: where you stopped, how much you have read, and the one best next study move. */
export function StudyLoopCard({ subjects, stack = false, className = "" }: { subjects: SubjectAnalytics[]; pendingMistakes?: number; stack?: boolean; className?: string }) {
  const rows = useReadiness(subjects);
  const access = useStudyAccess();
  const step = nextStep(rows);
  const [last, setLast] = useState<{ href: string; title: string } | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- device-only value, read once after mount
  useEffect(() => { try { const v = localStorage.getItem("renyxera.study.last"); if (v) setLast(JSON.parse(v)); } catch { /* storage off */ } }, []);
  const read = rows.reduce((s, r) => s + r.read, 0), open = rows.reduce((s, r) => s + r.open, 0);
  const pct = open ? Math.min(100, Math.round((read / open) * 100)) : 0;
  const first = rows.find((r) => r.href);
  const resume = last ?? (first?.href ? { href: first.href, title: first.title } : null);
  const shown = [...rows].filter((r) => r.read > 0 || r.accuracy != null).sort((a, b) => ["unread-low", "read-low", "read-untested", "unread", "strong"].indexOf(a.verdict) - ["unread-low", "read-low", "read-untested", "unread", "strong"].indexOf(b.verdict)).slice(0, 3);
  return (
    <section aria-label="Study" className={`card-pastel grid gap-3 p-4 ${stack ? "" : "gap-4 sm:p-5 lg:grid-cols-3"} ${className}`} data-tint="lilac">
      <div className="flex min-w-0 flex-col">
        <p className="flex items-center gap-1.5 text-xs font-extrabold text-[var(--text-secondary)]"><BookOpen className="h-4 w-4" aria-hidden /> Study · {last ? "where you stopped" : "start here"}</p>
        <p className="mt-1 line-clamp-2 font-display text-xl font-extrabold leading-tight text-[var(--text-primary)]">{resume ? resume.title : "Open the GATE CS library"}</p>
        <span className="flex-1" />
        <div className="mt-3 flex flex-wrap items-center gap-2"><Link href={resume?.href ?? "/study"} className="btn-main inline-flex !h-10 !text-sm">{last ? "Resume reading" : "Read now"} <ArrowRight className="h-4 w-4" aria-hidden /></Link></div>
      </div>
      <div className="min-w-0">
        <p className="text-xs font-extrabold text-[var(--text-secondary)]">Your reading</p>
        <p className="mt-1 font-display text-2xl font-extrabold text-[var(--text-primary)]"><span className="font-num">{read}</span><span className="text-base text-[var(--text-secondary)]"> of {open} open topics read</span></p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface)]"><div className="h-full rounded-full bg-[var(--tint-lilac-ink)]" style={{ width: `${pct}%` }} /></div>
        {!stack && shown.length > 0 && <ul className="mt-2 space-y-1">{shown.map((r) => <li key={r.id} className="flex items-center justify-between gap-2 text-xs"><span className="min-w-0 truncate font-bold text-[var(--text-primary)]">{r.title}</span><span className={`shrink-0 rounded-full px-2 py-0.5 font-extrabold ${CHIP[r.verdict].cls}`}>{CHIP[r.verdict].text}</span></li>)}</ul>}
      </div>
      <div className="flex min-w-0 flex-col rounded-2xl bg-[var(--surface)] p-3">
        <p className="text-xs font-extrabold text-[var(--text-secondary)]">Your next study move</p>
        <p className="mt-1 font-display text-lg font-extrabold leading-tight text-[var(--text-primary)]">{step.title}</p>
        <p className="mt-1 line-clamp-2 text-xs text-[var(--text-secondary)]">{step.body}</p>
        <span className="flex-1" />
        <Link href={step.href} className="pill-ink mt-2 self-start">{step.cta} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
      </div>
    </section>
  );
}

/** One line of study inside another screen (Mentor, Mistakes, Revision): the best next study move for this student, the book link and,
 *  for students without every pack, the way to buy. Loads the student's scores itself so any page can drop it in. */
export function StudyStripMini({ className = "" }: { className?: string }) {
  const { dashboardMetrics, loadAnalytics } = useAnalyticsStore();
  useEffect(() => { void loadAnalytics(); }, [loadAnalytics]);
  const rows = useReadiness(dashboardMetrics?.subjectPerformance ?? []);
  const access = useStudyAccess();
  const step = nextStep(rows);
  return (
    <section aria-label="Study" className={`card-pastel flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5 ${className}`} data-tint="lilac">
      <BookOpen className="h-5 w-5 shrink-0 text-[var(--text-primary)]" aria-hidden />
      <p className="min-w-0 flex-1 text-sm text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">Study: {step.title}.</b> {step.body}</p>
      <div className="flex shrink-0 flex-wrap gap-2"><Link href={step.href} className="pill-ink">{step.cta} <ArrowRight className="h-4 w-4" aria-hidden /></Link>{!access.all && <button type="button" onClick={() => openStudyShop("Study packs and bundles")} className="btn-champagne inline-flex h-9 items-center rounded-full px-4 text-sm">Unlock books</button>}</div>
    </section>
  );
}

/** "Learn the idea first": from a question you just reviewed to the book for its subject. Renders nothing when the subject has no written book yet. */
export function LearnLink({ subject, className = "" }: { subject?: string; className?: string }) {
  const id = subject ? bookOfSubject(subject) : null;
  const book = id ? CS_SHELF.find((b) => b.id === id) : null; const href = book ? firstChapterHref(book) : null;
  if (!book || !href) return null;
  return <Link href={href} className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] ${className}`}><BookOpen className="h-3.5 w-3.5" aria-hidden /> Learn the idea in {book.title}</Link>;
}

/** Analytics: for every book you have touched, what you read next to what you score, and what to do about the gap. */
export function StudyVsScoreCard({ subjects }: { subjects: SubjectAnalytics[] }) {
  const rows = useReadiness(subjects).filter((r) => r.read > 0 || r.attempted > 0).sort((a, b) => ["unread-low", "read-low", "read-untested", "unread", "strong"].indexOf(a.verdict) - ["unread-low", "read-low", "read-untested", "unread", "strong"].indexOf(b.verdict)).slice(0, 8);
  return (
    <section aria-label="Study against score" className="card-pastel p-4 sm:p-5" data-tint="mint">
      <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">What you read, and what you score</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Reading counts topics opened on this device. Score counts your answers in the same subject (at least {MIN_ATTEMPTS} to show).</p>
      {rows.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">Read a topic in <Link href="/study" className="font-bold underline underline-offset-4">Study</Link> and answer some questions in the same subject. They line up here.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {rows.map((r) => {
            const readPct = r.open ? Math.round((r.read / r.open) * 100) : 0; const chip = CHIP[r.verdict];
            const go = r.verdict === "unread-low" || r.verdict === "unread" ? { href: r.href ?? "/study", label: r.verdict === "unread" ? "Start reading" : "Read it" } : r.verdict === "strong" ? { href: r.href ?? "/study", label: "Keep reading" } : { href: r.practiceHref, label: r.verdict === "read-untested" ? "Test it" : "Drill it" };
            return (
              <li key={r.id} className="grid gap-2 rounded-2xl bg-[var(--surface)] p-3 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center">
                <div className="min-w-0"><p className="truncate font-bold text-[var(--text-primary)]">{r.title}</p><span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-extrabold ${chip.cls}`}>{chip.text}</span></div>
                <Bar label={`Read ${r.read}/${r.open}`} pct={readPct} tint="var(--tint-mint-ink)" />
                <Bar label={r.accuracy == null ? `Score: ${r.attempted} answered` : `Score ${r.accuracy}%`} pct={r.accuracy ?? 0} tint={r.accuracy != null && r.accuracy < 60 ? "var(--tint-rose-ink)" : "var(--tint-sky-ink)"} />
                <Link href={go.href} className="pill-ink justify-self-start sm:justify-self-end">{go.label}</Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
const Bar = ({ label, pct, tint }: { label: string; pct: number; tint: string }) => (
  <div><p className="text-xs font-semibold text-[var(--text-secondary)]">{label}</p><div className="mt-1 h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full" style={{ width: `${Math.min(100, pct)}%`, background: tint }} /></div></div>
);
