"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  BarChart3, Target, Flame, Clock, ClipboardCheck, Brain, Award, Lock,
  Footprints, Trophy, ScrollText, BookOpen, Compass, Crown, Bookmark, Sparkles,
} from "lucide-react";
import { useAnalyticsStore } from "@/store/use-analytics-store";
import { useStudyStore } from "@/store/use-study-store";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import type { ExamSession } from "@/types/exam-runtime.types";
import { computeAchievements, computeProfileStats, type Achievement, type AchievementTier } from "@/lib/achievements";
import { CountUp, RadialGauge } from "@/components/ui/interactive";

const ICONS: Record<Achievement["icon"], typeof Target> = {
  footprints: Footprints, target: Target, flame: Flame, trophy: Trophy, scroll: ScrollText, book: BookOpen,
  brain: Brain, compass: Compass, clock: Clock, crown: Crown, bookmark: Bookmark, sparkles: Sparkles,
};

const TIER: Record<AchievementTier, { medal: string; ring: string; icon: string; label: string; text: string }> = {
  gold: { medal: "from-amber-300 via-yellow-400 to-amber-600", ring: "shadow-amber-500/40", icon: "text-white", label: "Gold", text: "text-amber-600 dark:text-amber-400" },
  silver: { medal: "from-slate-100 via-sky-200 to-slate-400", ring: "shadow-sky-400/40", icon: "text-slate-700", label: "Silver", text: "text-sky-600 dark:text-sky-300" },
  bronze: { medal: "from-orange-300 via-amber-500 to-orange-700", ring: "shadow-orange-500/40", icon: "text-white", label: "Bronze", text: "text-orange-600 dark:text-orange-400" },
};

// Badges the viewer has already seen unlocked, so newly earned ones can say "New".
// Per-browser convenience only; everything still works if storage is unavailable.
const SEEN_KEY = "renyxera_seen_achievements";
function readSeen(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || "[]")); } catch { return new Set(); }
}
function writeSeen(ids: string[]) {
  try { localStorage.setItem(SEEN_KEY, JSON.stringify(ids)); } catch { /* ignore */ }
}

/**
 * Profile "Stats" and "Achievements" sections (master plan 4E-3 / 9B). All numbers come
 * from the signed-in user's own locally stored progress — see lib/achievements.ts.
 */
export function StatsAchievements() {
  const { dashboardMetrics, loadAnalytics } = useAnalyticsStore();
  const { mistakes, bookmarks, loadStudyData } = useStudyStore();
  const [sessions, setSessions] = useState<ExamSession[] | null>(null);
  const [seen, setSeen] = useState<Set<string> | null>(null);

  useEffect(() => {
    loadAnalytics();
    loadStudyData();
    IDBManager.getAllExamSessions()
      .then((rows) => setSessions(rows.map((r) => r.sessionData as ExamSession)))
      .catch(() => setSessions([]));
    setSeen(readSeen());
  }, [loadAnalytics, loadStudyData]);

  const stats = useMemo(
    () => computeProfileStats(dashboardMetrics, sessions ?? [], mistakes, bookmarks.length),
    [dashboardMetrics, sessions, mistakes, bookmarks.length],
  );
  const achievements = useMemo(() => computeAchievements(stats), [stats]);
  const unlocked = achievements.filter((a) => a.unlocked);

  // Remember what's been seen, after this render has had the chance to show "New".
  useEffect(() => {
    if (!seen || sessions === null || !dashboardMetrics) return;
    const ids = unlocked.map((a) => a.id);
    if (ids.some((id) => !seen.has(id))) {
      const t = setTimeout(() => writeSeen(ids), 1500);
      return () => clearTimeout(t);
    }
  }, [unlocked, seen, sessions, dashboardMetrics]);

  const loading = sessions === null || !dashboardMetrics;

  const tiles: { label: string; value: number; icon?: typeof Target; tint: string; suffix?: string; decimals?: number; sub?: string; gauge?: boolean }[] = [
    { label: "Accuracy", value: stats.accuracy, suffix: "%", tint: "", gauge: true, sub: "Correct answers overall" },
    { label: "Questions attempted", value: stats.questionsAttempted, icon: BarChart3, tint: "text-indigo-500 bg-indigo-500/10" },
    { label: "Current streak", value: stats.currentStreak, suffix: stats.currentStreak === 1 ? " day" : " days", icon: Flame, tint: "text-rose-500 bg-rose-500/10", sub: `Best: ${stats.longestStreak} ${stats.longestStreak === 1 ? "day" : "days"}` },
    { label: "Hours studied", value: stats.hoursStudied, decimals: 1, suffix: "h", icon: Clock, tint: "text-amber-500 bg-amber-500/10" },
    { label: "Tests completed", value: stats.testsCompleted, icon: ClipboardCheck, tint: "text-sky-500 bg-sky-500/10", sub: stats.fullPapersCompleted ? `${stats.fullPapersCompleted} full ${stats.fullPapersCompleted === 1 ? "paper" : "papers"}` : undefined },
    { label: "Mistakes mastered", value: stats.mistakesMastered, icon: Brain, tint: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="card-glass rounded-3xl p-6"
        aria-label="Your stats"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-indigo-500/10 text-indigo-500">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)] leading-tight">Your stats</h2>
            <p className="text-xs text-[var(--text-secondary)]">Everything you&apos;ve put in so far, across every test and practice set.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-2xl bg-[var(--surface-secondary)]/60 p-4 flex flex-col gap-2">
              {t.gauge ? (
                <RadialGauge value={loading ? 0 : t.value} size={32} stroke={4} from="#10b981" to="#06b6d4" className="text-[var(--text-primary)]" />
              ) : t.icon ? (
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.tint}`}>
                  <t.icon className="w-4 h-4" />
                </span>
              ) : null}
              {/* Two lines reserved so every tile's number sits on the same baseline. */}
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] leading-snug min-h-[2.6em]">{t.label}</span>
              {loading ? (
                <span className="h-7 w-16 rounded-md bg-[var(--border)] animate-pulse" />
              ) : (
                <CountUp value={t.value} decimals={t.decimals ?? 0} suffix={t.suffix ?? ""} className="text-2xl font-bold text-[var(--text-primary)]" />
              )}
              {t.sub && !loading && <span className="text-[11px] font-medium text-[var(--text-muted)]">{t.sub}</span>}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Achievements */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="card-glass rounded-3xl p-6"
        aria-label="Achievements"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-500">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] leading-tight">Achievements</h2>
              <p className="text-xs text-[var(--text-secondary)]">
                {loading ? "Counting your progress…" : <><span className="font-num font-semibold text-[var(--text-primary)]">{unlocked.length}</span> of {achievements.length} unlocked</>}
              </p>
            </div>
          </div>
          <div className="sm:w-56 h-2 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: loading ? 0 : `${(unlocked.length / achievements.length) * 100}%` }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((a, i) => {
            const Icon = ICONS[a.icon];
            const tier = TIER[a.tier];
            const isNew = a.unlocked && seen !== null && !loading && !seen.has(a.id);
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.03 }}
                className={`group relative flex items-center gap-3.5 rounded-2xl p-3.5 border transition-colors ${
                  a.unlocked
                    ? "border-[var(--border)] bg-[var(--surface)]/70 hover:border-amber-400/50"
                    : "border-dashed border-[var(--border)] bg-[var(--surface-secondary)]/30"
                }`}
              >
                {/* Medal */}
                <div className="relative shrink-0">
                  <div
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ${
                      a.unlocked
                        ? `bg-gradient-to-br ${tier.medal} shadow-lg ${tier.ring} ${tier.icon}`
                        : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${a.unlocked ? "drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]" : "opacity-60"}`} />
                    {a.unlocked && <span aria-hidden="true" className="badge-sheen" />}
                  </div>
                  {!a.unlocked && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
                      <Lock className="w-2.5 h-2.5 text-[var(--text-muted)]" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold truncate ${a.unlocked ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{a.name}</span>
                    {isNew && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 18, delay: 0.5 }}
                        className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[9px] font-bold uppercase tracking-wider"
                      >
                        New
                      </motion.span>
                    )}
                    <span className={`ml-auto text-[9px] font-bold uppercase tracking-wider ${a.unlocked ? tier.text : "text-[var(--text-muted)]"}`}>{tier.label}</span>
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] font-medium leading-snug mt-0.5">{a.description}</p>
                  {!a.unlocked && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: loading ? 0 : `${a.progress * 100}%` }}
                          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                        />
                      </div>
                      <span className="text-[10px] font-num font-semibold text-[var(--text-secondary)] whitespace-nowrap">
                        {Math.min(a.current, a.goal).toLocaleString(undefined, { maximumFractionDigits: 1 })} / {a.goal}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
