/**
 * How ready a student is in each book, from two things the app already keeps: what they have read (this device) and how they
 * score in the matching question-bank subject (their test sessions). Study joins the loop: read, test, review, improve.
 */
import { CS_SHELF, type ShelfBook } from "@/lib/study/catalog";
import { BANK_SUBJECTS, FREE_TOPICS, bookOfSubject } from "@/lib/study/packs";
import type { SubjectAnalytics } from "@/types/analytics.types";

export type Verdict = "unread-low" | "read-low" | "strong" | "read-untested" | "unread";
export type BookRow = { id: string; title: string; open: number; read: number; attempted: number; accuracy: number | null; verdict: Verdict; href: string | null; practiceHref: string };
export type Seen = Record<string, { ch: string; at?: number }>;

/** Enough answered questions for an accuracy figure to mean something. */
export const MIN_ATTEMPTS = 5;
export const WEAK_BELOW = 60;

const slug = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const topicsIn = (b: ShelfBook) => b.chapters.reduce((s, c) => s + (c.href ? Number(/(\d+)\s+topics?/.exec(c.ready ?? "")?.[1] ?? 0) : 0), 0);
export const firstChapterHref = (b: ShelfBook) => b.chapters.find((c) => c.href)?.href ?? null;

export function readinessRows(subjects: SubjectAnalytics[], seen: Seen, canAll: (bookId: string) => boolean): BookRow[] {
  const attempted: Record<string, number> = {}, correct: Record<string, number> = {};
  for (const s of subjects) { const id = bookOfSubject(s.subject); if (!id) continue; attempted[id] = (attempted[id] ?? 0) + s.attempted; correct[id] = (correct[id] ?? 0) + s.correct; }
  const readBy: Record<string, number> = {};
  for (const v of Object.values(seen)) { const b = CS_SHELF.find((x) => x.chapters.some((c) => c.href === v.ch)); if (b) readBy[b.id] = (readBy[b.id] ?? 0) + 1; }
  return CS_SHELF.filter((b) => b.chapters.some((c) => c.href)).map((b) => {
    const total = topicsIn(b); const open = canAll(b.id) ? total : Math.min(FREE_TOPICS, total);
    const read = Math.min(readBy[b.id] ?? 0, open); const att = attempted[b.id] ?? 0;
    const accuracy = att >= MIN_ATTEMPTS ? Math.round((correct[b.id] / att) * 100) : null;
    const halfRead = read >= Math.max(1, Math.ceil(open / 2));
    const verdict: Verdict = accuracy != null && accuracy < WEAK_BELOW ? (halfRead ? "read-low" : "unread-low") : accuracy != null ? "strong" : read > 0 ? "read-untested" : "unread";
    return { id: b.id, title: b.title, open, read, attempted: att, accuracy, verdict, href: firstChapterHref(b), practiceHref: `/topics/${slug((BANK_SUBJECTS[b.id] ?? [b.title])[0])}` };
  });
}

export type NextStep = { title: string; body: string; href: string; cta: string };
/** The single best next study move (study only: mistakes and tests have their own screens). */
export function nextStep(rows: BookRow[]): NextStep {
  const weak = rows.filter((r) => r.verdict === "unread-low").sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))[0];
  if (weak && weak.href) return { title: `Read ${weak.title} next`, body: `You score ${weak.accuracy}% here and have read ${weak.read} of ${weak.open} open topics. Learn it, then test it again.`, href: weak.href, cta: `Read ${weak.title}` };
  const untested = rows.find((r) => r.verdict === "read-untested");
  if (untested) return { title: `Test what you read in ${untested.title}`, body: `You have read ${untested.read} topic${untested.read === 1 ? "" : "s"}. A few past questions show what stuck.`, href: untested.practiceHref, cta: "Practise questions" };
  const stuck = rows.find((r) => r.verdict === "read-low");
  if (stuck) return { title: `${stuck.title}: you read it, now drill it`, body: `You still score ${stuck.accuracy}% after reading. Past questions on the topics you miss will close the gap.`, href: stuck.practiceHref, cta: "Practise questions" };
  const fresh = rows.find((r) => r.verdict === "unread");
  if (fresh && fresh.href) return { title: "Start with a free sample topic", body: `Every book opens with ${FREE_TOPICS} free topics. Read one, then test yourself.`, href: fresh.href, cta: `Open ${fresh.title}` };
  return { title: "Pick your next chapter", body: "You are on top of what you have opened. The next chapter is one tap away.", href: "/study", cta: "Open Study" };
}
