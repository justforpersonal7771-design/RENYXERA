/**
 * Mentor tokens: the unit for the daily allowance and the top-up packs.
 * A token is a small piece of text (about four characters). Every request uses the tokens it actually needs: what the student
 * writes, the recent conversation (the "context") the Mentor has to read again, the summary of their progress, and the expected answer.
 * So a short question costs little, a long plan or a long chat costs more, and nobody can cost us more than they have paid for.
 * Pure function: the server charges with it, and the chat uses it to show "this will use about N tokens" before sending.
 */
export type CreditMode = "Ask" | "Socratic" | "Quiz" | "Plan" | "Review" | "Weekly";
export interface CreditInput { mode: CreditMode; messageChars: number; historyChars: number; briefChars: number; attachments?: { images?: number; pdfPages?: number } }

/** Expected answer size by mode (tokens). The route caps the real answer at 2,048. */
const OUTPUT_TOKENS: Record<CreditMode, number> = { Ask: 800, Socratic: 600, Quiz: 1200, Plan: 2000, Review: 2000, Weekly: 2000 };
/** What a picture or a PDF page weighs in tokens, beyond its text. */
const IMAGE_TOKENS = 1500, PDF_PAGE_TOKENS = 500;
/** Smallest charge for one request, so very tiny messages still pay for the overhead. */
export const MIN_TOKENS = 1000;
/** Hard ceiling for one request: input limits make anything above this impossible; kept as a safety net. */
export const MAX_TOKENS = 16000;

export function estimateTokens(i: CreditInput): number {
  const input = (i.messageChars + i.historyChars + i.briefChars) / 4;
  const files = (i.attachments?.images ?? 0) * IMAGE_TOKENS + (i.attachments?.pdfPages ?? 0) * PDF_PAGE_TOKENS;
  const total = Math.round((input + OUTPUT_TOKENS[i.mode] + files) / 50) * 50;
  return Math.min(MAX_TOKENS, Math.max(MIN_TOKENS, total));
}

/** "2.4K" style text for the screen. */
export const formatTokens = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n));
