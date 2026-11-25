/**
 * Study time kept on this device: one record shared by the dashboard Study timer and by Focus mode, and read by Analytics.
 * Per day (IST, from the server clock) the seconds studied, and the same split by subject. Stored in localStorage under one key.
 * Rule: time is counted once. While the Study timer is running it already counts every second, so Focus mode adds nothing on top.
 */
import { serverDate } from "@/lib/time/server-time";

export const STUDY_TIME_KEY = "renyxera.study-timer";
export const STUDY_TIME_EVENT = "renyxera:study-time";
export type StudyTime = { days: Record<string, number>; since: number | null; label: string | null; bySubject: Record<string, Record<string, number>> };
export const EMPTY_STUDY_TIME: StudyTime = { days: {}, since: null, label: null, bySubject: {} };

export const dayKey = (d = serverDate()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
export const loadStudyTime = (): StudyTime => { try { return { ...EMPTY_STUDY_TIME, ...(JSON.parse(localStorage.getItem(STUDY_TIME_KEY) || "") as Partial<StudyTime>) }; } catch { return EMPTY_STUDY_TIME; } };
export const saveStudyTime = (s: StudyTime) => {
  try { localStorage.setItem(STUDY_TIME_KEY, JSON.stringify(s)); } catch { /* storage unavailable */ }
  try { window.dispatchEvent(new Event(STUDY_TIME_EVENT)); } catch { /* no window */ }
};

/** Folds the running timer session into today's total (and into its subject, if it has one) and stops it. */
export function stopStudyTimer(s: StudyTime, at: number): StudyTime {
  if (s.since == null) return s;
  const secs = Math.max(0, Math.floor((at - s.since) / 1000)), k = dayKey();
  const subj = s.label ? { ...s.bySubject, [k]: { ...(s.bySubject[k] ?? {}), [s.label]: (s.bySubject[k]?.[s.label] ?? 0) + secs } } : s.bySubject;
  return { days: { ...s.days, [k]: (s.days[k] ?? 0) + secs }, since: null, label: null, bySubject: subj };
}

/** Focus mode adds studied seconds to today (and to its subject), unless the Study timer is running and already counting them. Returns the seconds added. */
export function addFocusSeconds(secs: number, label: string | null): number {
  if (!(secs > 0)) return 0;
  const s = loadStudyTime();
  if (s.since != null) return 0;
  const k = dayKey();
  const subj = label ? { ...s.bySubject, [k]: { ...(s.bySubject[k] ?? {}), [label]: (s.bySubject[k]?.[label] ?? 0) + secs } } : s.bySubject;
  saveStudyTime({ ...s, days: { ...s.days, [k]: (s.days[k] ?? 0) + secs }, bySubject: subj });
  return secs;
}

/** The last `n` days, oldest first: the day's label, the seconds studied and whether it is today. */
export function lastDays(s: StudyTime, n = 7): { key: string; label: string; secs: number; today: boolean }[] {
  const out: { key: string; label: string; secs: number; today: boolean }[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = serverDate(); d.setDate(d.getDate() - i); const k = dayKey(d);
    out.push({ key: k, label: d.toLocaleDateString("en-IN", { weekday: "short" }), secs: s.days[k] ?? 0, today: i === 0 });
  }
  return out;
}
export const fmtHM = (sec: number) => `${Math.floor(sec / 3600)}h ${String(Math.floor((sec % 3600) / 60)).padStart(2, "0")}m`;
