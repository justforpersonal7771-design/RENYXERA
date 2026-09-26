import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { create } from "zustand";
import { ExamSessionDraft, TestConfig } from "@/types/exam.types";
import { ExamBuilder } from "@/lib/exam/exam-builder";

interface ExamState {
  currentDraft: ExamSessionDraft | null;
  createDraft: (config: TestConfig) => void;
  clearDraft: () => void;
  loadDraft: (id: string, draft: ExamSessionDraft) => void;
}

export const GUEST_MAX_QUESTIONS = 15;

export const useExamStore = create<ExamState>((set) => ({
  currentDraft: null,

  createDraft: (config: TestConfig) => {
    const draft = ExamBuilder.generateDraft(config);
    // Module 4D teaser: guests practise with a capped sample; the full bank needs an
    // account. (Full official papers are already locked for guests on the Setup page.)
    const { user, loading } = useAuthStore.getState();
    if (!user && !loading && draft.questions.length > GUEST_MAX_QUESTIONS) {
      draft.questions = draft.questions.slice(0, GUEST_MAX_QUESTIONS);
      useToastStore.getState().show(`Guests can practise up to ${GUEST_MAX_QUESTIONS} questions per test. Sign in for the full question bank.`);
    }
    set({ currentDraft: draft });
  },

  clearDraft: () => {
    set({ currentDraft: null });
  },

  loadDraft: (id: string, draft: ExamSessionDraft) => {
    // In a future phase, we might load from IndexedDB by 'id'
    set({ currentDraft: draft });
  },
}));
