/**
 * Server-only utilities for splitting the question bank into a public half (safe to
 * serve to any client) and a private answer key (never served directly — only used to
 * grade a submitted attempt server-side).
 *
 * This is the delivery-layer piece of the FINDING-3 fix (see the master plan): today's
 * `/api/dataset` route ships every question's `is_correct` flags and `nat_answer_range`
 * to whoever calls it, which is fine for an honour-system practice tool but fatal the
 * moment a graded/ranked mode exists — a CS student reading the Network tab has the
 * entire answer key before the timer starts.
 *
 * Scope note: this module and the `/api/exam/grade` route it backs are new,
 * self-contained infrastructure. They do NOT yet replace the existing client-side
 * self-grading path that the live exam engine (exam-runtime store, results pages,
 * analytics, AI Mentor context — 18 call sites at last count) depends on today. Cutting
 * the live exam flow over to fetch-public + submit-for-grading is Release 5 (Modules 5A
 * "Answer Key Withholding" + 5B "Server-Authoritative Evaluation") and touches those 18
 * files; doing that rewire is out of scope for this pass and isn't done here so the
 * currently-working, recently-stabilized exam UI isn't put at risk. What's built here is
 * the real split + a real, working grading endpoint, ready for that cutover.
 */

export type QuestionType = "MCQ" | "MSQ" | "NAT";

export interface RawOption {
  option_id: string;
  text: string;
  is_correct: boolean;
  has_image: boolean;
}

export interface RawQuestion {
  question_id: string;
  question_no: number;
  question_type: QuestionType;
  marks: number;
  section: string;
  subject: string;
  topic: string;
  difficulty: string;
  question_text: string;
  has_image: boolean;
  images_required: unknown[];
  options: RawOption[];
  nat_answer_range: string | null;
}

export interface RawPaper {
  exam_metadata: unknown;
  questions: RawQuestion[];
}

export interface AnswerKeyEntry {
  question_type: QuestionType;
  correct_option_ids: string[]; // MCQ (len 1) / MSQ (len >=1)
  nat_min: number | null;
  nat_max: number | null;
}

/** Parses the dataset's "X to Y" NAT range string into numeric bounds. Falls back to
 *  treating a single value ("5") as an exact-match range. Returns nulls if unparseable —
 *  callers should treat that as "no NAT answer available" rather than crash. */
function parseNatRange(raw: string | null): { min: number | null; max: number | null } {
  if (!raw) return { min: null, max: null };
  const rangeMatch = raw.match(/^\s*(-?\d+(?:\.\d+)?)\s*to\s*(-?\d+(?:\.\d+)?)\s*$/i);
  if (rangeMatch) {
    return { min: Number(rangeMatch[1]), max: Number(rangeMatch[2]) };
  }
  const single = Number(raw.trim());
  if (Number.isFinite(single)) return { min: single, max: single };
  return { min: null, max: null };
}

/** Strips every answer-bearing field from a question, leaving only what's safe to hand
 *  to an unauthenticated or not-yet-graded client. */
export function toPublicQuestion(q: RawQuestion) {
  return {
    question_id: q.question_id,
    question_no: q.question_no,
    question_type: q.question_type,
    marks: q.marks,
    section: q.section,
    subject: q.subject,
    topic: q.topic,
    difficulty: q.difficulty,
    question_text: q.question_text,
    has_image: q.has_image,
    images_required: q.images_required,
    options: (q.options || []).map((o) => ({
      option_id: o.option_id,
      text: o.text,
      has_image: o.has_image,
      // is_correct deliberately omitted
    })),
    // nat_answer_range deliberately omitted
  };
}

/** Builds the server-only answer key, keyed by question_id. Never return this map (or
 *  anything derived from it that reveals a specific question's answer) from a route that
 *  hasn't verified the caller is entitled to see it. */
export function buildAnswerKey(papers: RawPaper[]): Map<string, AnswerKeyEntry> {
  const key = new Map<string, AnswerKeyEntry>();
  for (const paper of papers) {
    for (const q of paper.questions) {
      const { min, max } = parseNatRange(q.nat_answer_range);
      key.set(q.question_id, {
        question_type: q.question_type,
        correct_option_ids: (q.options || []).filter((o) => o.is_correct).map((o) => o.option_id),
        nat_min: min,
        nat_max: max,
      });
    }
  }
  return key;
}

/** Splits a full dataset (the shape of data/Aggregated_Output.json) into the public
 *  payload and the private answer key in one pass. */
export function splitDataset(papers: RawPaper[]): {
  publicPapers: { exam_metadata: unknown; questions: ReturnType<typeof toPublicQuestion>[] }[];
  answerKey: Map<string, AnswerKeyEntry>;
} {
  const answerKey = buildAnswerKey(papers);
  const publicPapers = papers.map((paper) => ({
    exam_metadata: paper.exam_metadata,
    questions: paper.questions.map(toPublicQuestion),
  }));
  return { publicPapers, answerKey };
}

/** Grades one submitted response against the answer key. Never throws on a malformed
 *  submission or unknown question_id — grades as incorrect instead, since the caller
 *  (the grade route) is responsible for having already validated request shape. Returns
 *  correctness only; the route scales this by the question's actual `marks` (which
 *  lives on the question record, not the answer key) to compute a score. */
export function gradeResponse(
  answerKey: Map<string, AnswerKeyEntry>,
  response: { question_id: string; selected_option_ids?: string[]; nat_value?: number }
): boolean {
  const entry = answerKey.get(response.question_id);
  if (!entry) return false;

  if (entry.question_type === "NAT") {
    if (
      typeof response.nat_value === "number" &&
      entry.nat_min !== null &&
      entry.nat_max !== null
    ) {
      return response.nat_value >= entry.nat_min && response.nat_value <= entry.nat_max;
    }
    return false;
  }

  const selected = new Set(response.selected_option_ids || []);
  const correct = new Set(entry.correct_option_ids);
  return selected.size === correct.size && [...selected].every((id) => correct.has(id));
}
