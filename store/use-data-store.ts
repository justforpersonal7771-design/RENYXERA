import { create } from "zustand";
import {
  QuestionRepository,
  RepositoryDiagnostics,
} from "@/lib/repository/question-repository";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { branchDataUrl } from "@/lib/branches";
import { getCurrentBranch } from "@/lib/branch/current";

// The question bank of the branch this page is in (a branch change reloads the page).
const bankUrl = () => branchDataUrl(getCurrentBranch());

interface DataState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  totalQuestions: number;
  totalSubjects: number;
  totalTopics: number;
  diagnostics: RepositoryDiagnostics | null;

  initializeData: (url?: string) => Promise<void>;
  loadRepository: (url?: string) => Promise<void>;
  refreshRepository: (url?: string) => Promise<void>;
  refreshAIGeneratedQuestions: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  isInitialized: false,
  isLoading: false,
  error: null,
  totalQuestions: 0,
  totalSubjects: 0,
  totalTopics: 0,
  diagnostics: null,

  initializeData: async (url?: string) => {
    return get().loadRepository(url);
  },

  loadRepository: async (url?: string) => {
    // Avoid re-initialization if already loaded
    if (get().isInitialized || get().isLoading) return;

    set({ isLoading: true, error: null });

    try {
      // Wait until auth has resolved: a signed-in account's branch (and so its bank) is only
      // known then. Without this a page load would fetch the guest/default bank first.
      await IDBManager.whenResolved();
      await QuestionRepository.initialize(url ?? bankUrl());

      // Load AI Generated Questions from IndexedDB and register them
      try {
        const aiQuestions = await IDBManager.getAIGeneratedQuestions();
        for (const q of aiQuestions) {
          QuestionRepository.registerDynamicQuestion(q);
        }
      } catch (e) {
        console.warn("Failed to load AI questions on initialization:", e);
      }

      const diagnostics = QuestionRepository.generateDiagnostics();

      // Background: unlock answers for older history, then refresh analytics if needed.
      void import("@/lib/repository/answer-keys").then(async ({ syncHistoryAnswers }) => {
        if (await syncHistoryAnswers()) {
          const { useAnalyticsStore } = await import("@/store/use-analytics-store");
          useAnalyticsStore.getState().invalidate();
        }
      }).catch(() => {});

      set({
        isInitialized: true,
        isLoading: false,
        totalQuestions: diagnostics.totalQuestions,
        totalSubjects: diagnostics.totalSubjects,
        totalTopics: diagnostics.totalTopics,
        diagnostics: diagnostics,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to initialize question repository.",
      });
    }
  },

  refreshRepository: async (url?: string) => {
    set({ isLoading: true, error: null });
    try {
      if (!QuestionRepository.isReady()) {
        await IDBManager.whenResolved();
        await QuestionRepository.initialize(url ?? bankUrl());
      }

      const diagnostics = QuestionRepository.generateDiagnostics();
      set({
        isInitialized: true,
        isLoading: false,
        totalQuestions: diagnostics.totalQuestions,
        totalSubjects: diagnostics.totalSubjects,
        totalTopics: diagnostics.totalTopics,
        diagnostics: diagnostics,
      });
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.message || "Failed to refresh question repository.",
      });
    }
  },

  refreshAIGeneratedQuestions: async () => {
    try {
      const aiQuestions = await IDBManager.getAIGeneratedQuestions();
      for (const q of aiQuestions) {
        QuestionRepository.registerDynamicQuestion(q);
      }
      const diagnostics = QuestionRepository.generateDiagnostics();
      set({
        totalQuestions: diagnostics.totalQuestions,
        totalSubjects: diagnostics.totalSubjects,
        totalTopics: diagnostics.totalTopics,
        diagnostics: diagnostics,
      });
    } catch (e) {
      console.warn("Failed to refresh AI questions:", e);
    }
  },
}));
