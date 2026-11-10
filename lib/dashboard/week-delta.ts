import type { AnalyticsSnapshot } from "@/types/analytics.types";
import { toLocalDateStr } from "@/lib/utils";

/** This week (the last 7 days including today) against the 7 days before it, from the daily analytics snapshots. Nothing here is estimated. */
export type WeekTotals = { attempted: number; correct: number; timeMs: number; days: number };
export function weekTotals(snaps: AnalyticsSnapshot[], now: Date = new Date()): { thisWeek: WeekTotals; lastWeek: WeekTotals } {
  const key = (back: number) => { const d = new Date(now); d.setDate(d.getDate() - back); return toLocalDateStr(d); };
  const thisKeys = new Set(Array.from({ length: 7 }, (_, i) => key(i)));
  const lastKeys = new Set(Array.from({ length: 7 }, (_, i) => key(i + 7)));
  const zero = (): WeekTotals => ({ attempted: 0, correct: 0, timeMs: 0, days: 0 });
  const a = zero(), b = zero();
  for (const s of snaps) {
    const t = thisKeys.has(s.id) ? a : lastKeys.has(s.id) ? b : null;
    if (!t) continue;
    t.attempted += s.totalQuestionsAttempted; t.correct += s.totalCorrect; t.timeMs += s.totalTimeSpentMs;
    if (s.totalQuestionsAttempted > 0) t.days++;
  }
  return { thisWeek: a, lastWeek: b };
}
export const accPct = (w: WeekTotals) => (w.attempted > 0 ? Math.round((w.correct / w.attempted) * 100) : null);
