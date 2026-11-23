/**
 * Focus Target maths for the study shelf (pure, so scripts/focus-check.ts can test it with the real bank).
 * A chapter's weight comes from the past-paper questions TAGGED to it (lib/study/pyq-chapter-map.json) when its book has tags,
 * so one question counts in exactly one chapter. Books without tags fall back to the old title-word match.
 * Rule for the Focus Target: a chapter is inside the target when any of its marks sit in topics the target keeps (the bank's topic labels are coarse, so a chapter often spreads over several).
 * A chapter with no tagged question is a FOUNDATION: it is never dimmed or called "outside", because later chapters depend on it.
 */
import tagFile from "./pyq-chapter-map.json";

export type FocusQ = { question_id: string; subject: string; topic?: string; marks: number };
export type FocusChapter = { id: string; title: string; match?: string };
export type ChapterFocus = { qs: number; marks: number; share: number; inMarks: number; inTarget: boolean; foundation: boolean };

const TAGS = tagFile as unknown as { book: string; map: Record<string, string> };
/** Words that tie a chapter to the bank's topic names ("Synchronisation" ~ "Synchronization"). */
export const stems = (t: string) => t.toLowerCase().replace(/is(e|ing|ation)/g, "iz$1").split(/[^a-z]+/).filter((w) => w.length > 3 && !["and", "with", "from"].includes(w)).map((w) => w.slice(0, 6));

export function chapterQuestions(bookId: string, chapter: FocusChapter, bookQs: FocusQ[]): FocusQ[] {
  if (bookId === TAGS.book) return bookQs.filter((q) => TAGS.map[q.question_id] === chapter.id);
  const st = stems(chapter.title);
  return bookQs.filter((q) => (chapter.match ? new RegExp(chapter.match, "i").test(q.topic ?? "") : stems(q.topic ?? "").some((w) => st.includes(w))));
}

/** `includedKeys` = "subject::topic" keys the target keeps, or null when no target is set. `totalMarks` = marks of the whole bank. */
export function chapterFocus(bookId: string, chapter: FocusChapter, bookQs: FocusQ[], totalMarks: number, includedKeys: Set<string> | null): ChapterFocus {
  const hit = chapterQuestions(bookId, chapter, bookQs);
  const marks = hit.reduce((s, q) => s + (q.marks || 0), 0);
  const inMarks = includedKeys ? hit.filter((q) => includedKeys.has(`${q.subject}::${q.topic}`)).reduce((s, q) => s + (q.marks || 0), 0) : marks;
  const foundation = hit.length === 0;
  return { qs: hit.length, marks, share: totalMarks > 0 ? (marks / totalMarks) * 100 : 0, inMarks, foundation, inTarget: !includedKeys || foundation || inMarks > 0 };
}

/** High / Medium / Low by thirds of the chapters that have marks (relative inside one book). */
export function chapterTiers(shares: number[]): ("high" | "mid" | "low" | "none")[] {
  const sorted = shares.filter((x) => x > 0).sort((a, b) => b - a);
  const hi = sorted[Math.max(0, Math.ceil(sorted.length / 3) - 1)] ?? Infinity, mid = sorted[Math.max(0, Math.ceil((sorted.length * 2) / 3) - 1)] ?? Infinity;
  return shares.map((s) => (s <= 0 ? "none" : s >= hi ? "high" : s >= mid ? "mid" : "low"));
}
