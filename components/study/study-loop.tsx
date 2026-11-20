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

/** One slim line inside an existing screen: the best next move across study, tests and review. No numbers repeated from the screen it sits on. */
export function StudyLoopCard({ subjects, pendingMistakes, className = "" }: { subjects: SubjectAnalytics[]; pendingMistakes: number; className?: string }) {
  const rows = useReadiness(subjects);
  const step = nextStep(rows, pendingMistakes);
  return (
    <section aria-label="Study loop" className={`card-pastel flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-5 ${className}`} data-tint="lilac">
      <BookOpen className="h-5 w-5 shrink-0 text-[var(--text-primary)]" aria-hidden />
      <p className="min-w-0 flex-1 text-sm text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">{step.title}.</b> {step.body}</p>
      <Link href={step.href} className="pill-ink shrink-0">{step.cta} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
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
