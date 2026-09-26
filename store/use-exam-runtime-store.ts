import { create } from "zustand";
import { ExamSessionDraft } from "@/types/exam.types";
import { ExamSession, QuestionResponse } from "@/types/exam-runtime.types";
import { SessionManager } from "@/lib/exam/session-manager";

interface RuntimeState {
  activeSession: ExamSession | null;
  isHydrated: boolean;

  initializeStore: () => Promise<void>;
  startSession: (draft: ExamSessionDraft) => Promise<void>;
  pauseSession: () => Promise<void>;
  resumeSession: () => Promise<void>;
  submitSession: () => Promise<string | null>;
  goToQuestion: (index: number) => Promise<void>;
  nextQuestion: () => Promise<void>;
  previousQuestion: () => Promise<void>;
  saveResponse: (
    questionId: string,
    payload: Partial<QuestionResponse>,
  ) => Promise<void>;
  toggleMarkForReview: (questionId: string) => Promise<void>;
  clearResponse: (questionId: string) => Promise<void>;
  tickTimer: () => void;
  clearSession: () => Promise<void>;
  resumeArchivedSession: (session: ExamSession) => Promise<void>;
}

export const useExamRuntimeStore = create<RuntimeState>((set, get) => ({
  activeSession: null,
  isHydrated: false,

  initializeStore: async () => {
    // Guards against a real race: if startSession() runs (and marks isHydrated true)
    // while this restore is still in flight, this must not clobber the freshly
    // started session with whatever restoreSession() read before that happened.
    if (get().isHydrated) return;
    const session = await SessionManager.restoreSession();
    if (get().isHydrated) return;
    set({ activeSession: session, isHydrated: true });
  },

  startSession: async (draft: ExamSessionDraft) => {
    // Don't silently lose whatever test was already in progress — archive it under its
    // own id (findable later on the Dashboard as an incomplete/pending test) before this
    // new session claims the single "active_session" slot.
    const outgoing = get().activeSession;
    if (outgoing && outgoing.status !== "SUBMITTED") {
      await SessionManager.archiveIncomplete(outgoing);
    }

    const session = SessionManager.createSessionFromDraft(draft);
    set({ activeSession: session, isHydrated: true });
    await SessionManager.serializeSession(session);
  },

  pauseSession: async () => {
    const { activeSession } = get();
    if (!activeSession) return;
    const updated = { ...activeSession, status: "PAUSED" as const };
    set({ activeSession: updated });
    await SessionManager.serializeSession(updated);
  },

  resumeSession: async () => {
    const { activeSession } = get();
    if (!activeSession) return;
    const updated = { ...activeSession, status: "IN_PROGRESS" as const };
    set({ activeSession: updated });
    await SessionManager.serializeSession(updated);
  },

  submitSession: async () => {
    const { activeSession } = get();
    if (!activeSession) return null;
    const updated: ExamSession = { ...activeSession, status: "SUBMITTED" as const, updatedAt: new Date().toISOString() };

    // Save and show "Test submitted" straight away — the confirmation must never wait on
    // the network. Server grading, answer unlock, mistakes and analytics follow in the
    // background; the results screen shows "checking…" until the keys arrive, and the
    // grader is idempotent, so the results page retrying at the same time is harmless.
    await SessionManager.saveToHistory(updated);
    await SessionManager.clearSession();
    set({ activeSession: updated });

    try {
      const useExamStore = (await import("@/store/use-exam-store")).useExamStore;
      useExamStore.getState().clearDraft();
    } catch (e) {
      console.error("Failed to clear draft", e);
    }

    void (async () => {
      let final = updated;
      try {
        const { submitForGrading } = await import("@/lib/repository/answer-keys");
        const graded = await submitForGrading(updated);
        if (graded) {
          final = { ...updated, serverScore: graded.score, serverMaxScore: graded.maxScore, serverStored: graded.stored };
          await SessionManager.saveToHistory(final);
        }
      } catch (e) {
        console.warn("Server grading unavailable; answers will unlock when online", e);
      }
      // Mistakes need the unlocked keys (answers still locked are skipped, never counted wrong).
      try {
        const MistakeEngine = (await import("@/lib/analytics/mistake-engine")).MistakeEngine;
        await MistakeEngine.processSession(final);
      } catch (e) {
        console.warn("Failed to process mistakes", e);
      }
      // A completed exam changes what Dashboard/Analytics show — recompute on next visit.
      try {
        const useAnalyticsStore = (await import("@/store/use-analytics-store")).useAnalyticsStore;
        useAnalyticsStore.getState().invalidate();
      } catch (e) {
        console.error("Failed to invalidate analytics cache", e);
      }
    })();

    return updated.id;
  },

  goToQuestion: async (index: number) => {
    const { activeSession } = get();
    if (!activeSession) return;
    if (index >= 0 && index < activeSession.totalQuestions) {
      // Find the question ID for the destination index
      const questionId = Object.keys(activeSession.responses)[index];
      const existing = activeSession.responses[questionId];
      
      let updatedResponses = activeSession.responses;
      if (existing && existing.status === "NOT_VISITED") {
         updatedResponses = {
            ...activeSession.responses,
            [questionId]: { ...existing, status: "VISITED" },
         };
      }

      const updated = { ...activeSession, currentQuestionIndex: index, responses: updatedResponses };
      set({ activeSession: updated });
      await SessionManager.serializeSession(updated);
    }
  },

  nextQuestion: async () => {
    const { activeSession, goToQuestion } = get();
    if (
      activeSession &&
      activeSession.currentQuestionIndex < activeSession.totalQuestions - 1
    ) {
      await goToQuestion(activeSession.currentQuestionIndex + 1);
    }
  },

  previousQuestion: async () => {
    const { activeSession, goToQuestion } = get();
    if (activeSession && activeSession.currentQuestionIndex > 0) {
      await goToQuestion(activeSession.currentQuestionIndex - 1);
    }
  },

  saveResponse: async (
    questionId: string,
    payload: Partial<QuestionResponse>,
  ) => {
    const { activeSession } = get();
    if (!activeSession) return;

    const existing = activeSession.responses[questionId];
    const updatedResponses = {
      ...activeSession.responses,
      [questionId]: { ...existing, ...payload },
    };

    const updated = { ...activeSession, responses: updatedResponses };
    set({ activeSession: updated });
    await SessionManager.serializeSession(updated);
  },

  toggleMarkForReview: async (questionId: string) => {
    const { activeSession } = get();
    if (!activeSession) return;
    
    const existing = activeSession.responses[questionId];
    let newStatus = existing.status;
    
    if (existing.status === "MARKED") {
      newStatus = "VISITED"; // Revert to visited if it was marked
    } else if (existing.status === "MARKED_AND_ANSWERED") {
      newStatus = "ANSWERED"; // Revert to answered
    } else if (existing.status === "ANSWERED") {
      newStatus = "MARKED_AND_ANSWERED";
    } else {
      newStatus = "MARKED";
    }

    const updatedResponses = {
      ...activeSession.responses,
      [questionId]: { ...existing, status: newStatus },
    };

    const updated = { ...activeSession, responses: updatedResponses };
    set({ activeSession: updated });
    await SessionManager.serializeSession(updated);
  },

  clearResponse: async (questionId: string) => {
    const { activeSession } = get();
    if (!activeSession) return;
    
    const existing = activeSession.responses[questionId];
    
    // Status reverts to VISITED
    const updatedResponses = {
      ...activeSession.responses,
      [questionId]: { 
         ...existing, 
         status: "VISITED" as const, 
         selectedOptions: [], 
         natValue: "" 
      },
    };

    const updated = { ...activeSession, responses: updatedResponses };
    set({ activeSession: updated });
    await SessionManager.serializeSession(updated);
  },

  tickTimer: () => {
     const { activeSession } = get();
     if (activeSession && activeSession.status === "IN_PROGRESS") {
        set({ activeSession: { ...activeSession, elapsedSeconds: activeSession.elapsedSeconds + 1 } });
     }
  },

  clearSession: async () => {
    set({ activeSession: null });
    await SessionManager.clearSession();
  },

  // Restores an archived incomplete test as the active session. If a different test is
  // currently active, that one is archived first (same as startSession) rather than lost.
  resumeArchivedSession: async (session: ExamSession) => {
    const outgoing = get().activeSession;
    if (outgoing && outgoing.status !== "SUBMITTED" && outgoing.id !== session.id) {
      await SessionManager.archiveIncomplete(outgoing);
    }
    const resumed = { ...session, status: "PAUSED" as const };
    set({ activeSession: resumed, isHydrated: true });
    await SessionManager.serializeSession(resumed);
    await SessionManager.discardIncomplete(session.id);
  },
}));
