"use client";

import Link from "next/link";
import { ArrowRight, Check, Flame, RefreshCw, Target } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

const MIN_PER_QUESTION = 2;

/**
 * "Today" — one clear next step. Built only from data the dashboard already has:
 * unmastered mistakes (revision queue) and the current streak.
 */
export function TodayCard({ pendingMistakes, streak, sessions = [] }: { pendingMistakes: number; streak: number; sessions?: { updatedAt: string; attempted: number; accuracy: number }[] }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  const n = Math.min(pendingMistakes, 10);
  const today = new Date().toDateString();
  const todays = sessions.filter((s) => new Date(s.updatedAt).toDateString() === today);
  const solvedToday = todays.reduce((a, s) => a + s.attempted, 0);
  const missions = [
    { label: "Solve 10 questions", done: solvedToday >= 10, note: `${Math.min(solvedToday, 10)}/10` },
    { label: "Finish a test at 60%+ accuracy", done: todays.some((s) => s.attempted >= 5 && s.accuracy >= 60), note: "" },
    { label: "Keep your streak going", done: todays.length > 0, note: "" },
  ];
  return (
    <section aria-label="Today" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Today</p>
          <p className="mt-1 text-lg font-extrabold text-[var(--text-primary)]">
            {n > 0 ? `Revise ${n} question${n === 1 ? "" : "s"} you got wrong · about ${n * MIN_PER_QUESTION} min` : "Your revision queue is clear — take a fresh practice set"}
          </p>
        </div>
        {streak > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Flame className="h-3.5 w-3.5" aria-hidden /> {streak}-day streak
          </span>
        )}
      </div>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Daily missions">
        {missions.map((m) => (
          <li key={m.label} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${m.done ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded border ${m.done ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--border)]"}`} aria-hidden>{m.done && <Check className="h-3 w-3" />}</span>
            {m.label}{!m.done && m.note ? ` · ${m.note}` : ""}
          </li>
        ))}
      </ul>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {n > 0 && (
          <Link href="/revision" className="group flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-violet-500/25">
            <span className="inline-flex items-center gap-2"><RefreshCw className="h-4 w-4" aria-hidden /> Start revision</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
        <Link href="/fresh-mock" className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-sm font-bold text-[var(--text-primary)]">
          <span>Fresh full-length mock (65 Q)</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href="/setup" className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-sm font-bold text-[var(--text-primary)]">
          <span className="inline-flex items-center gap-2"><Target className="h-4 w-4 text-violet-500" aria-hidden /> 10-question practice</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <Link href="/mistakes" className="group flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-sm font-bold text-[var(--text-primary)]">
          <span>Review mistakes</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
