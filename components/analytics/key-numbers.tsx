"use client";

/**
 * Key numbers for Analytics: plain facts computed from the student's own attempts (nothing estimated or invented).
 * Questions solved, accuracy, pace against GATE's ~108 s per 1-mark question, skip rate, streak, time studied,
 * and the strongest and weakest subject (with at least 5 attempts).
 */
import type { DashboardMetrics } from "@/types/analytics.types";

const PACE = 108; // GATE: 180 min for 65 questions with mixed marks; ~108 s per 1-mark question

export function KeyNumbers({ m }: { m: DashboardMetrics }) {
  const o = m.overview;
  const att = m.subjectPerformance.reduce((a, s) => a + s.attempted, 0);
  const skipped = m.subjectPerformance.reduce((a, s) => a + s.skipped, 0);
  const wrong = m.subjectPerformance.reduce((a, s) => a + s.incorrect, 0);
  const pace = Math.round((o.avgTimePerQuestionMs || 0) / 1000);
  const hours = Math.round(((o.totalTimeSpentMs || 0) / 3_600_000) * 10) / 10;
  const ranked = m.subjectPerformance.filter((s) => s.attempted >= 5).map((s) => ({ n: s.subject.replace(/\s*\(.*\)/, ""), a: Math.round((s.correct / s.attempted) * 100) })).sort((a, b) => b.a - a.a);
  const best = ranked[0], worst = ranked.length > 1 ? ranked[ranked.length - 1] : undefined;
  const items: { v: string; l: string; note?: string; tint: string; tone?: string }[] = [
    { v: o.totalQuestionsSolved.toLocaleString("en-IN"), l: "questions solved", tint: "lilac" },
    { v: `${Math.round(o.overallAccuracy || 0)}%`, l: "overall accuracy", tint: "sky" },
    { v: pace ? `${pace}s` : "-", l: "per question", note: pace ? (pace <= PACE ? "within GATE pace" : `${pace - PACE}s slower than GATE pace`) : undefined, tint: "mint", tone: pace && pace > PACE ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400" },
    { v: att + skipped ? `${Math.round((skipped / (att + skipped)) * 100)}%` : "-", l: "skipped", note: wrong ? `${wrong} wrong answers to review` : undefined, tint: "peach" },
    { v: `${o.currentStreak}d`, l: "current streak", note: `best ${o.longestStreak}d`, tint: "butter" },
    { v: `${hours}h`, l: "time practising", tint: "rose" },
    ...(best ? [{ v: `${best.a}%`, l: `best: ${best.n}`, tint: "mint" }] : []),
    ...(worst ? [{ v: `${worst.a}%`, l: `weakest: ${worst.n}`, tint: "rose", tone: "text-rose-600 dark:text-rose-400" }] : []),
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="Key numbers">
      {items.map((x) => (
        <li key={x.l} className="card-pastel wm-sm min-w-0 px-4 py-3" data-tint={x.tint}>
          <p className="font-display text-2xl font-extrabold leading-none tabular-nums text-[var(--text-primary)]">{x.v}</p>
          <p className="mt-1 truncate text-xs font-bold text-[var(--text-secondary)]">{x.l}</p>
          {x.note && <p className={`mt-0.5 truncate text-[11px] font-semibold ${x.tone ?? "text-[var(--text-muted)]"}`}>{x.note}</p>}
        </li>
      ))}
    </ul>
  );
}

export function SectionHead({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--border-subtle)] pb-2">
      <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">{title}</h2>
      {hint && <p className="text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}
