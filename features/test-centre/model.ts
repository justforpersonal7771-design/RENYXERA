/**
 * Test Centre model: one attempt shape for every kind of test (custom, mock, ...), built from the stored exam session.
 * Screens read attempts through summarizeSession so a new kind needs no change to the history list.
 */
import type { ExamSession } from "@/types/exam-runtime.types";

export type TestKind = "custom" | "mock";

export interface Attempt {
  id: string;
  kind: TestKind;
  startedAt: string;
  submitted: boolean;
  marks: number | null;
  maxMarks: number | null;
  answered: number;
  total: number;
  minutes: number;
}

export const KIND_LABEL: Record<TestKind, string> = { custom: "Custom test", mock: "Mock" };

export function summarizeSession(s: ExamSession): Attempt {
  return {
    id: s.id,
    kind: s.resultsAt ? "mock" : "custom",
    startedAt: s.startedAt,
    submitted: s.status === "SUBMITTED",
    marks: s.serverScore ?? null,
    maxMarks: s.serverMaxScore ?? null,
    answered: Object.keys(s.responses ?? {}).length,
    total: s.totalQuestions ?? 0,
    minutes: Math.round((s.elapsedSeconds ?? 0) / 60),
  };
}
