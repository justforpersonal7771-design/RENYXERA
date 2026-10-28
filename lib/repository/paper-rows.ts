import type { Question } from "@/types/question.types";

/**
 * Flattens papers into questions tagged with their year and shift. Shared-pool papers are keyed
 * "2026-FN-CS"; their full key is kept as image_key so their images resolve to the other branch's
 * folder (missing this key broke every shared question's images, 28 Oct). Used by the repository and
 * by scripts/check-images.mts, so the check tests the real code.
 */
export function paperRows(papers: { exam_metadata?: Record<string, string>; questions: Question[] }[]): Question[] {
  const rows: Question[] = [];
  for (const paper of papers) {
    const yearShiftStr = paper.exam_metadata?.["year-shift"] || "";
    const [year, shift] = yearShiftStr.split("-");
    const imageKey = yearShiftStr.split("-").length > 2 ? yearShiftStr : undefined;
    for (const q of paper.questions) rows.push({ ...q, year, shift, ...(imageKey ? { image_key: imageKey } : {}) } as Question);
  }
  return rows;
}
