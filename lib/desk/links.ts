import { CS_SHELF } from "@/lib/study/catalog";

/** Where each screen of the AI Desk and its neighbours can be reached from any other. Every question, note and card uses these, so a link is written once. */
export const tutorHref = (qid: string) => `/ai-tutor?qid=${encodeURIComponent(qid)}`;
export const mentorAskHref = (text: string) => `/ai-mentor/chat?new=1&q=${encodeURIComponent(text.slice(0, 600))}`;
export const NOTES_HREF = "/notes";
export const REVISION_HREF = "/revision";

/** The study chapter that covers a topic, found by the same patterns the shelf uses; the Study shelf when none is ready for it yet. */
export function studyHrefFor(topic?: string, subject?: string): string {
  const hay = `${topic ?? ""} ${subject ?? ""}`.toLowerCase();
  if (!hay.trim()) return "/study";
  for (const book of CS_SHELF) for (const ch of book.chapters) {
    if (!ch.href) continue;
    let re: RegExp | null = null;
    try { re = new RegExp(ch.match ?? ch.title.replace(/[^\w ]/g, " ").trim().split(/\s+/).join("|"), "i"); } catch { /* skip a bad pattern */ }
    if (re && re.test(hay)) return ch.href;
  }
  return "/study";
}

/** A topic name is only meaningful as a study link when a ready chapter matches it. */
export const hasStudyChapter = (topic?: string, subject?: string) => studyHrefFor(topic, subject) !== "/study";
