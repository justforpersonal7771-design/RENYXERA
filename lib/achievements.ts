import type { DashboardMetrics } from "@/types/analytics.types";
import type { ExamSession } from "@/types/exam-runtime.types";
import type { MistakeEntry } from "@/types/study.types";

/**
 * Profile Stats + Achievements (master plan 4E-3 / 9B).
 *
 * Everything here is derived from data the app already stores locally — exam sessions,
 * the mistakes bank and bookmarks — so badges need no extra storage, can't drift out of
 * sync with the real numbers, and unlock retroactively for existing progress. Pure
 * functions: same input, same output, easy to test.
 */

export interface ProfileStats {
  questionsAttempted: number;
  accuracy: number; // 0-100
  currentStreak: number;
  longestStreak: number;
  hoursStudied: number; // one decimal
  testsCompleted: number;
  fullPapersCompleted: number;
  mistakesMastered: number;
  bookmarks: number;
  subjectsTouched: number;
  strongTopics: number; // >= 75% accuracy with at least 3 attempts
}

export type AchievementTier = "bronze" | "silver" | "gold";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: "footprints" | "target" | "flame" | "trophy" | "scroll" | "book" | "brain" | "compass" | "clock" | "crown" | "bookmark" | "sparkles";
  tier: AchievementTier;
  current: number;
  goal: number;
  unlocked: boolean;
  progress: number; // 0-1
}

export function computeProfileStats(
  metrics: DashboardMetrics | null,
  sessions: ExamSession[],
  mistakes: MistakeEntry[],
  bookmarkCount: number,
): ProfileStats {
  const o = metrics?.overview;
  const submitted = sessions.filter((s) => s.status === "SUBMITTED");
  const strongTopics = (metrics?.topicPerformance ?? []).filter(
    (t) => t.attempted >= 3 && t.correct / t.attempted >= 0.75,
  ).length;
  return {
    questionsAttempted: o?.totalQuestionsSolved ?? 0,
    accuracy: Math.round(o?.overallAccuracy ?? 0),
    currentStreak: o?.currentStreak ?? 0,
    longestStreak: o?.longestStreak ?? 0,
    hoursStudied: Math.round(((o?.totalTimeSpentMs ?? 0) / 3_600_000) * 10) / 10,
    testsCompleted: submitted.length,
    fullPapersCompleted: submitted.filter((s) => s.draftConfig?.config?.examType === "YEAR_PAPER").length,
    mistakesMastered: mistakes.filter((m) => m.mastered).length,
    bookmarks: bookmarkCount,
    subjectsTouched: (metrics?.subjectPerformance ?? []).filter((s) => s.attempted > 0).length,
    strongTopics,
  };
}

type Def = Omit<Achievement, "current" | "unlocked" | "progress"> & { value: (s: ProfileStats) => number };

const DEFS: Def[] = [
  { id: "first-steps", name: "First Steps", description: "Attempt your first question.", icon: "footprints", tier: "bronze", goal: 1, value: (s) => s.questionsAttempted },
  { id: "century", name: "Century", description: "Attempt 100 questions.", icon: "target", tier: "silver", goal: 100, value: (s) => s.questionsAttempted },
  { id: "half-thousand", name: "Relentless", description: "Attempt 500 questions.", icon: "crown", tier: "gold", goal: 500, value: (s) => s.questionsAttempted },
  { id: "first-test", name: "Test Taker", description: "Submit your first test.", icon: "scroll", tier: "bronze", goal: 1, value: (s) => s.testsCompleted },
  { id: "mock-regular", name: "Mock Regular", description: "Submit 10 tests.", icon: "trophy", tier: "silver", goal: 10, value: (s) => s.testsCompleted },
  { id: "full-dress", name: "Full Dress Rehearsal", description: "Complete a full official GATE paper.", icon: "sparkles", tier: "gold", goal: 1, value: (s) => s.fullPapersCompleted },
  { id: "consistent", name: "Consistent", description: "Study three days in a row.", icon: "flame", tier: "bronze", goal: 3, value: (s) => s.longestStreak },
  { id: "on-fire", name: "On Fire", description: "Reach a 7-day study streak.", icon: "flame", tier: "silver", goal: 7, value: (s) => s.longestStreak },
  { id: "unstoppable", name: "Unstoppable", description: "Reach a 30-day study streak.", icon: "flame", tier: "gold", goal: 30, value: (s) => s.longestStreak },
  // Accuracy only counts once there's a meaningful sample (50+ questions).
  { id: "sharpshooter", name: "Sharpshooter", description: "Hold 80%+ accuracy across at least 50 questions.", icon: "target", tier: "gold", goal: 80, value: (s) => (s.questionsAttempted >= 50 ? s.accuracy : 0) },
  { id: "comeback", name: "Comeback", description: "Master 10 mistakes from your mistakes bank.", icon: "brain", tier: "silver", goal: 10, value: (s) => s.mistakesMastered },
  { id: "explorer", name: "Explorer", description: "Practise questions from 10 different subjects.", icon: "compass", tier: "silver", goal: 10, value: (s) => s.subjectsTouched },
  { id: "topic-tamer", name: "Topic Tamer", description: "Get 20 topics to 75%+ accuracy.", icon: "book", tier: "gold", goal: 20, value: (s) => s.strongTopics },
  { id: "marathon", name: "Marathon", description: "Study for 25 hours in total.", icon: "clock", tier: "gold", goal: 25, value: (s) => s.hoursStudied },
  { id: "collector", name: "Collector", description: "Bookmark 25 questions to revisit.", icon: "bookmark", tier: "bronze", goal: 25, value: (s) => s.bookmarks },
];

/** Every achievement with live progress. Unlocked first (gold → bronze), then the
 *  locked ones closest to unlocking, so the next goal is always near the top. */
export function computeAchievements(stats: ProfileStats): Achievement[] {
  const tierRank: Record<AchievementTier, number> = { gold: 0, silver: 1, bronze: 2 };
  return DEFS.map(({ value, ...d }) => {
    const current = value(stats);
    const progress = Math.max(0, Math.min(1, current / d.goal));
    return { ...d, current, unlocked: current >= d.goal, progress };
  }).sort((a, b) => {
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    if (a.unlocked) return tierRank[a.tier] - tierRank[b.tier];
    return b.progress - a.progress;
  });
}
