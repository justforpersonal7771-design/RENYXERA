/**
 * The one place that decides whether a response is correct. Every engine, results page
 * and the server grader use this so they can never disagree.
 *
 * Edge cases from official GATE keys:
 * - NAT keys like "3.7 to 3.8 OR 0.37 to 0.38" accept any of several ranges.
 * - An MCQ key can accept two options ("C or D"): picking either one is correct.
 * - "Marks to all": every option is keyed correct, so any attempt earns the marks.
 * - A NAT answer of 0 is a real answer (not "empty"), and "1e3" / "abc" are rejected.
 */
import type { NatAnswerRange } from "@/types/question.types";

type Range = { min: number; max: number };

/** Parses "a to b", "a to b OR c to d", or a single number. Returns [] if unusable. */
export function parseNatRanges(raw: string | null | undefined): Range[] {
  if (!raw) return [];
  const out: Range[] = [];
  for (const part of raw.split(/\s+or\s+/i)) {
    const m = part.match(/^\s*(-?\d+(?:\.\d+)?)\s*(?:to\s*(-?\d+(?:\.\d+)?))?\s*$/i);
    if (!m) continue;
    const a = Number(m[1]);
    const b = m[2] !== undefined ? Number(m[2]) : a;
    out.push({ min: Math.min(a, b), max: Math.max(a, b) });
  }
  return out;
}

/** All accepted ranges of a normalized question's NAT key. */
export function natRangesOf(r: NatAnswerRange | undefined | null): Range[] {
  if (!r) return [];
  return r.ranges?.length ? r.ranges : [{ min: r.min, max: r.max }];
}

/** "3.7 to 3.8 or 0.37 to 0.38" — for answer displays. */
export function formatNatAnswer(r: NatAnswerRange | undefined | null): string {
  const ranges = natRangesOf(r);
  if (!ranges.length) return "N/A";
  return ranges.map(({ min, max }) => (min === max ? `${min}` : `${min} to ${max}`)).join(" or ");
}

/** Strict numeric parse of a typed NAT answer: "-0.5", "3.", ".5" ok; "", "1e3", "abc" not. */
export function parseNatValue(v: string | number | null | undefined): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (v == null) return null;
  const s = v.trim();
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return null;
  return Number(s);
}

const EPS = 1e-9; // guards float noise like 0.1 + 0.2 at a range edge

export function isNatCorrect(value: string | number | null | undefined, ranges: Range[]): boolean {
  const n = parseNatValue(value);
  if (n === null) return false;
  return ranges.some(({ min, max }) => n >= min - EPS && n <= max + EPS);
}

export function isOptionsCorrect(type: string, selected: readonly string[] | undefined, correct: readonly string[]): boolean {
  const sel = new Set(selected ?? []);
  if (!sel.size || !correct.length) return false;
  if (type === "MCQ") {
    // One pick; the key may accept several (multi-answer or marks-to-all).
    return sel.size === 1 && correct.includes([...sel][0]);
  }
  // MSQ: exactly the keyed set — no partial marks in GATE.
  return sel.size === correct.length && correct.every((id) => sel.has(id));
}

interface GradableQuestion {
  question_type: string;
  options?: { option_id: string; is_correct?: boolean }[];
  nat_answer_range?: NatAnswerRange | null;
}

export function isResponseCorrect(
  q: GradableQuestion,
  selectedOptions: readonly string[] | undefined,
  natValue: string | number | null | undefined
): boolean {
  if (q.question_type === "NAT") return isNatCorrect(natValue, natRangesOf(q.nat_answer_range));
  const correct = (q.options ?? []).filter((o) => o.is_correct).map((o) => o.option_id);
  return isOptionsCorrect(q.question_type, selectedOptions, correct);
}

/** GATE marking: +marks if correct; a wrong MCQ loses marks/3; MSQ/NAT have no negative. */
export function marksFor(questionType: string, marks: number, attempted: boolean, correct: boolean): number {
  if (!attempted) return 0;
  if (correct) return marks;
  return questionType === "MCQ" ? -marks / 3 : 0;
}
