import { defaultExamDate } from "@/lib/goals/goal-engine";
import { toLocalDateStr } from "@/lib/utils";

/**
 * Which GATE the learner is preparing for, and when it is.
 *
 * GATE runs over two weekends in February. A year stays "upcoming" (selectable, shown in
 * the dashboard, used for the countdown) until its whole exam window is over; the day
 * after, the next year's exam becomes the earliest possible target. So in January 2027
 * you can still aim for GATE 2027, and once the February 2027 papers are done every
 * screen moves on to GATE 2028 automatically — a saved 2027 target rolls forward.
 */

const EXAM_WINDOW_DAYS = 8; // second Saturday + the following weekend

function addDays(date: string, days: number): string {
  const d = new Date(date + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** The earliest GATE year whose exam window hasn't finished yet. */
export function upcomingExamYear(today: string = toLocalDateStr()): number {
  const year = Number(today.slice(0, 4));
  return today <= addDays(defaultExamDate(year), EXAM_WINDOW_DAYS) ? year : year + 1;
}

/** The saved target year, rolled forward if that exam has already happened. */
export function effectiveTargetYear(saved: number | null | undefined, today: string = toLocalDateStr()): number {
  const upcoming = upcomingExamYear(today);
  return saved && saved >= upcoming ? saved : upcoming;
}

/** True when a saved target year has passed and was rolled forward. */
export function targetYearRolledForward(saved: number | null | undefined, today: string = toLocalDateStr()): boolean {
  return !!saved && saved < upcomingExamYear(today);
}

/** Exam date for a target year: an exact date the learner set (in that year, still
 *  ahead) wins; otherwise GATE's usual slot, the second Saturday of February. */
export function examDateFor(year: number, savedExamDate: string | null | undefined, today: string = toLocalDateStr()): string {
  if (savedExamDate && savedExamDate.startsWith(String(year)) && savedExamDate >= today) return savedExamDate;
  return defaultExamDate(year);
}
