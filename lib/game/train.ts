"use client";

/**
 * In-game rounds (GAME-DESIGN-MERGED.md section 3). A round is saved exactly like a normal finished test:
 * local history (so analytics and the citadel levels see it) and the server grader (/api/exam/grade), which stores
 * the attempt for signed-in players. A round tied to a friend challenge carries config.battle, so the grader also
 * tells the battle it finished; the battle reads the score from the stored attempt, never from the browser.
 */
import { QuestionRepository } from "@/lib/repository/question-repository";
import { SessionManager } from "@/lib/exam/session-manager";
import type { ExamSession, QuestionResponse } from "@/types/exam-runtime.types";
import type { RenderableQuestion } from "@/types/question.types";

/** Official questions (GATE_ ids) of these subjects, shuffled. Forge and AI items are left out: their keys differ. */
export function poolFor(subjects: string[]): RenderableQuestion[] {
  const out: RenderableQuestion[] = [];
  for (const s of subjects) for (const q of QuestionRepository.getQuestionsBySubject(s)) if (q.question_id.startsWith("GATE_") && q.options) out.push(q);
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}

export const byIds = (ids: string[]) => ids.map((id) => QuestionRepository.getQuestion(id)).filter((q): q is RenderableQuestion => !!q);

export type RoundAnswer = { id: string; selected?: string[]; nat?: string; seconds: number };

/** Save and grade a finished round. Returns the server score when the grader answered. */
export async function saveRound(opts: { title: string; answers: RoundAnswer[]; startedAt: string; elapsed: number; battleId?: string }) {
  const id = crypto.randomUUID();
  const responses: Record<string, QuestionResponse> = {};
  for (const a of opts.answers) {
    const answered = !!(a.selected?.length || (a.nat ?? "").trim());
    responses[a.id] = { questionId: a.id, status: answered ? "ANSWERED" : "VISITED", selectedOptions: a.selected, natValue: a.nat, timeSpentSeconds: Math.round(a.seconds) };
  }
  const draftId = crypto.randomUUID();
  const session: ExamSession = {
    id, draftId,
    draftConfig: {
      id: draftId, createdAt: opts.startedAt,
      config: { examType: "CUSTOM_TEST", title: opts.title, questionCount: opts.answers.length, ...(opts.battleId ? { battle: { id: opts.battleId } } : {}) },
      questions: opts.answers.map((a, i) => ({ questionId: a.id, sequence: i + 1 })),
    },
    status: "SUBMITTED", startedAt: opts.startedAt, currentQuestionIndex: 0, totalQuestions: opts.answers.length,
    responses, elapsedSeconds: Math.round(opts.elapsed), updatedAt: new Date().toISOString(),
  };
  await SessionManager.saveToHistory(session);
  let final = session;
  let score: { score: number; max: number; stored: boolean } | null = null;
  try {
    const { submitForGrading } = await import("@/lib/repository/answer-keys");
    const g = await submitForGrading(session);
    if (g && !g.withheld) {
      final = { ...session, serverScore: g.score, serverMaxScore: g.maxScore, serverStored: g.stored };
      await SessionManager.saveToHistory(final);
      score = { score: g.score, max: g.maxScore, stored: g.stored };
    }
  } catch { /* offline: answers unlock later, like any test */ }
  try { const { MistakeEngine } = await import("@/lib/analytics/mistake-engine"); await MistakeEngine.processSession(final); } catch { /* skip */ }
  try {
    const { useAnalyticsStore } = await import("@/store/use-analytics-store");
    useAnalyticsStore.getState().invalidate();
    await useAnalyticsStore.getState().refreshAnalytics();
  } catch { /* recomputed on next visit */ }
  return { sessionId: id, score };
}
