/**
 * Revision scheduling. A spaced-repetition scheduler in the SM-2 family with four ratings (Again, Hard, Good, Easy) and an exam-date compressor:
 * intervals never run past half the days left to the exam, so every item is seen at least twice more before the paper.
 * All dates are YYYY-MM-DD in IST (see lib/time/ist.ts); this file is pure and is checked by scripts/revision-check.ts.
 */
import type { RevItem } from "@/lib/desk/types";

export type Rating = 1 | 2 | 3 | 4;
export const RATING_LABEL: Record<Rating, string> = { 1: "Again", 2: "Hard", 3: "Good", 4: "Easy" };
const DAY = 86_400_000;

export const addDays = (d: string, n: number) => new Date(Date.parse(d + "T00:00:00Z") + n * DAY).toISOString().slice(0, 10);
export const daysBetween = (a: string, b: string) => Math.round((Date.parse(b + "T00:00:00Z") - Date.parse(a + "T00:00:00Z")) / DAY);

/** The schedule after one rating. `exam` is the exam day (or null). Returns only the changed schedule fields. */
export function rate(it: Pick<RevItem, "interval" | "ease" | "reps" | "lapses">, rating: Rating, today: string, exam: string | null) {
  let { interval, ease, reps, lapses } = it;
  if (rating === 1) { lapses += 1; reps = 0; interval = 1; ease = Math.max(1.3, ease - 0.2); }
  else if (reps === 0) { interval = rating === 2 ? 1 : rating === 3 ? 2 : 4; reps = 1; if (rating === 4) ease += 0.1; }
  else {
    const base = Math.max(1, interval);
    if (rating === 2) { interval = Math.max(base + 1, Math.round(base * 1.2)); ease = Math.max(1.3, ease - 0.15); }
    else if (rating === 3) { interval = Math.max(base + 1, Math.round(base * ease)); }
    else { interval = Math.max(base + 2, Math.round(base * ease * 1.3)); ease += 0.15; }
    reps += 1;
  }
  if (exam) { const left = daysBetween(today, exam); if (left > 0) interval = Math.max(1, Math.min(interval, Math.floor(left / 2))); }
  return { interval, ease: Math.round(ease * 100) / 100, reps, lapses, due: addDays(today, interval) };
}

/** What each button would schedule, for the labels on the buttons ("Good · 5d"). */
export const previewDays = (it: Pick<RevItem, "interval" | "ease" | "reps" | "lapses">, today: string, exam: string | null) =>
  ([1, 2, 3, 4] as Rating[]).map((r) => rate(it, r, today, exam).interval);
export const dayLabel = (n: number) => (n <= 1 ? "1 day" : n < 30 ? `${n} days` : n < 365 ? `${Math.round(n / 30)} mo` : `${Math.round(n / 365)} y`);

export const isDue = (it: RevItem, today: string) => !it.suspended && it.due <= today;

/** The day's queue: overdue first, then due today; subjects interleaved (round robin) unless `focus` names one; capped at `limit`. */
export function buildQueue(items: RevItem[], today: string, opts: { limit?: number; focus?: string | null; interleave?: boolean } = {}) {
  const due = items.filter((i) => isDue(i, today) && (!opts.focus || i.subject === opts.focus)).sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : a.lapses > b.lapses ? -1 : 1));
  const limit = opts.limit ?? 40;
  if (opts.interleave === false || opts.focus) return due.slice(0, limit);
  const lanes = new Map<string, RevItem[]>(); due.forEach((i) => { const k = i.subject ?? "-"; (lanes.get(k) ?? lanes.set(k, []).get(k)!).push(i); });
  const out: RevItem[] = []; const ls = [...lanes.values()];
  for (let r = 0; out.length < Math.min(limit, due.length); r++) { let took = false; for (const l of ls) { if (l[r]) { out.push(l[r]); took = true; if (out.length >= limit) break; } } if (!took) break; }
  return out;
}

/** Estimated minutes: about 40 seconds an item. */
export const estimateMinutes = (n: number) => Math.max(1, Math.round((n * 40) / 60));

/** Items due on each of the next `days` days (index 0 = today, which includes everything overdue). */
export function forecast(items: RevItem[], today: string, days: number) {
  const out = Array.from({ length: days }, () => 0);
  items.forEach((i) => { if (i.suspended) return; const d = Math.max(0, daysBetween(today, i.due)); if (d < days) out[d] += 1; });
  return out;
}

/** Leeches: items failed four or more times. They need teaching, not more repetition. */
export const isLeech = (i: RevItem) => i.lapses >= 4;

/** Memory strength per subject, 0 to 100: among the items that have been revised, the share whose last rating was Good or Easy and that are not overdue. */
export function strengthBySubject(items: RevItem[], today: string) {
  const m = new Map<string, { n: number; ok: number }>();
  items.forEach((i) => { if (!i.lastRating) return; /* only what has been revised says anything about memory */ const k = i.subject ?? "General"; const e = m.get(k) ?? { n: 0, ok: 0 }; e.n += 1; if ((i.lastRating ?? 0) >= 3 && i.due >= today) e.ok += 1; m.set(k, e); });
  return [...m.entries()].map(([subject, e]) => ({ subject, items: e.n, strength: Math.round((e.ok / e.n) * 100) })).sort((a, b) => a.strength - b.strength);
}

/** New items are introduced gradually: the first `perDay` are due today, the next `perDay` tomorrow, and so on, so adding 80 mistakes does not bury the first day. */
export function stagger(index: number, perDay: number, today: string) { return addDays(today, Math.floor(index / Math.max(1, perDay))); }
