"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { useExamStore } from "@/store/use-exam-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { RenderableQuestion } from "@/types/question.types";
import { QuestionRenderer } from "@/components/exam/question-renderer";
import { MathJaxContext } from "better-react-mathjax";
import { useStudyStore } from "@/store/use-study-store";
import { Bookmark, BookmarkCheck, Sun, Moon, Play, Pause, AlertTriangle, ClipboardList, HelpCircle, CheckSquare, BookOpen, LayoutGrid, X, ArrowRight, ArrowLeft, Send, Flag, Eraser } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import { ExamTimer } from "@/components/exam/exam-timer";
import { QuestionPalette } from "@/components/exam/question-palette";
import { ExamSubmitDialog } from "@/components/exam/exam-submit-dialog";
import { ImagePrefetcher } from "@/lib/exam/image-prefetcher";
import { useTheme } from "next-themes";
import { SectionTabs } from "@/components/exam/section-tabs";
import { motion, AnimatePresence } from "motion/react";
import { QuestionMetaChips } from "@/components/exam/question-meta";
import { LogoMarkFx } from "@/components/brand/wordmark";

export default function ExamSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { isInitialized, error: storeError } = useDataStore();

  const startSession = useExamRuntimeStore((state) => state.startSession);

  // Selectors to avoid re-rendering on tickTimer
  const isHydrated = useExamRuntimeStore((state) => state.isHydrated);
  const initializeStore = useExamRuntimeStore((state) => state.initializeStore);

  const activeSessionExists = useExamRuntimeStore((state) => !!state.activeSession);
  const sessionStatus = useExamRuntimeStore((state) => state.activeSession?.status);
  const sessionId = useExamRuntimeStore((state) => state.activeSession?.id);
  const currentQuestionIndex = useExamRuntimeStore((state) => state.activeSession?.currentQuestionIndex || 0);
  const totalQuestions = useExamRuntimeStore((state) => state.activeSession?.totalQuestions || 0);
  const responsesFromStore = useExamRuntimeStore((state) => state.activeSession?.responses);
  const responses = useMemo(() => responsesFromStore || {}, [responsesFromStore]);
  const sessionGoalTag = useExamRuntimeStore((state) => state.activeSession?.draftConfig?.config?.goalTag);

  const pauseSession = useExamRuntimeStore((state) => state.pauseSession);
  const resumeSession = useExamRuntimeStore((state) => state.resumeSession);
  const submitSession = useExamRuntimeStore((state) => state.submitSession);
  const nextQuestion = useExamRuntimeStore((state) => state.nextQuestion);
  const previousQuestion = useExamRuntimeStore((state) => state.previousQuestion);
  const saveResponse = useExamRuntimeStore((state) => state.saveResponse);
  const toggleMarkForReview = useExamRuntimeStore((state) => state.toggleMarkForReview);
  const clearResponseAction = useExamRuntimeStore((state) => state.clearResponse);
  const clearSession = useExamRuntimeStore((state) => state.clearSession);
  
  const { bookmarks, addBookmark, removeBookmark, loadStudyData } = useStudyStore();

  useEffect(() => {
    loadStudyData();
  }, [loadStudyData]);

  // The running test carries its own copy of the question list; the setup draft can be
  // cleared (store reset on sign-in, resumed or archived tests) and left this empty.
  const setupDraft = useExamStore((st) => st.currentDraft);
  const sessionDraft = useExamRuntimeStore((st) => st.activeSession?.draftConfig);
  const currentDraft = sessionDraft ?? setupDraft;
  const [mounted, setMounted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<RenderableQuestion | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showMobilePalette, setShowMobilePalette] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isHydrated) {
      initializeStore();
    }
  }, [isHydrated, initializeStore]);

  // Derived Question ID and loading logic
  const currentQId = useMemo(() => {
    if (currentDraft && currentDraft.questions[currentQuestionIndex]) {
      return currentDraft.questions[currentQuestionIndex].questionId;
    } else if (Object.keys(responses).length > 0) {
      return Object.keys(responses)[currentQuestionIndex];
    }
    return "";
  }, [currentDraft, currentQuestionIndex, responses]);

  useEffect(() => {
    if (isInitialized && activeSessionExists && currentQId) {
      const q = QuestionRepository.getQuestionById(currentQId);
      setCurrentQuestion(q || null);

      // Prefetch next 2 questions
      const nextQId1 = currentDraft?.questions[currentQuestionIndex + 1]?.questionId || Object.keys(responses)[currentQuestionIndex + 1];
      const nextQId2 = currentDraft?.questions[currentQuestionIndex + 2]?.questionId || Object.keys(responses)[currentQuestionIndex + 2];

      const q1 = nextQId1 ? QuestionRepository.getQuestionById(nextQId1) : null;
      const q2 = nextQId2 ? QuestionRepository.getQuestionById(nextQId2) : null;

      ImagePrefetcher.prefetch([q1 || null, q2 || null]);
    }
  }, [isInitialized, activeSessionExists, currentQId, currentQuestionIndex, currentDraft, responses]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sessionStatus !== "IN_PROGRESS") return;
      
      const isInputFocused = ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "");
      if (isInputFocused) return;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextQuestion();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        previousQuestion();
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        if (currentQId) {
          saveResponse(currentQId, { status: "MARKED" });
        }
      } else if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        if (currentQId) clearResponseAction(currentQId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sessionStatus, currentQId, nextQuestion, previousQuestion, saveResponse, clearResponseAction]);

  if (!isInitialized || storeError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-red-500 font-bold text-lg">
          {storeError ? `Database Error: ${storeError}` : "Loading Workspace Repository..."}
        </div>
      </div>
    );
  }

  if (isHydrated && !activeSessionExists) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-8 bg-[var(--background)]">
        <div className="p-8 text-center space-y-4 max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">No Active Session</h2>
          <p className="text-[var(--text-secondary)] text-sm">
             You don't have an active exam session. Start one from the dashboard workspace.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition shadow-sm text-sm"
          >
             Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (sessionStatus === "SUBMITTED" && sessionId) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[var(--background)] ambient-gradient px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="relative overflow-hidden p-8 sm:p-10 text-center space-y-5 max-w-lg w-full mx-auto card-glass rounded-3xl"
        >
          {/* Confetti burst */}
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
              animate={{ opacity: [0, 1, 0], x: Math.cos((i / 14) * Math.PI * 2) * 150, y: Math.sin((i / 14) * Math.PI * 2) * 110 - 40, scale: 1, rotate: i * 40 }}
              transition={{ duration: 1.4, delay: 0.25, ease: "easeOut" }}
              className="absolute left-1/2 top-24 w-2 h-3 rounded-sm"
              style={{ background: ["#06c2fb", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"][i % 5] }}
            />
          ))}
          <div className="relative w-24 h-24 mx-auto">
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full bg-emerald-400/30"
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
              <svg className="w-11 h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[var(--text-primary)]">
            Test submitted
          </h2>
          <p className="text-[var(--text-secondary)] font-medium">
            Nicely done. Your answers are saved and ready to be scored.
          </p>
          <button
            onClick={() => {
               // submitSession() already deleted the persisted "active_session"
               // record and deliberately kept activeSession in memory to avoid
               // this exact page flashing into its "no active session" guard
               // clause. Do NOT null it out here before navigating away - that
               // was causing this page to re-render into the empty state and
               // get stuck there instead of reaching /exam/results. Just
               // navigate; the in-memory state naturally resets on next
               // initializeStore() call since IDB has nothing to restore.
               router.push(`/exam/results?id=${sessionId}`);
            }}
            className="group relative overflow-hidden mt-4 h-13 py-3.5 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold text-base shadow-lg shadow-violet-500/30 cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
            <span className="relative">See my results</span>
            <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    );
  }

  const currentResponse = responses[currentQId];

  const handleClearResponse = () => {
    if (currentQId) clearResponseAction(currentQId);
  };

  const mathJaxConfig = {
    loader: { load: ["[tex]/html"] },
    tex: {
      packages: { "[+]": ["html"] },
      inlineMath: [["\\(", "\\)"]],
      displayMath: [["\\[", "\\]"]],
    },
  };

  const responsesList = Object.values(responses);
  const stats = {
    total: totalQuestions,
    answered: responsesList.filter((r) => r.status === "ANSWERED").length,
    notAnswered: responsesList.filter((r) => r.status === "VISITED").length,
    notVisited: responsesList.filter((r) => r.status === "NOT_VISITED").length,
    marked: responsesList.filter((r) => r.status === "MARKED").length,
    markedAndAnswered: responsesList.filter((r) => r.status === "MARKED_AND_ANSWERED").length,
  };

  const isCurrentBookmarked = bookmarks.some(b => b.questionId === currentQId);
  const handleBookmarkToggle = async () => {
    if (!currentQId || !currentQuestion) return;
    if (isCurrentBookmarked) {
      await removeBookmark(currentQId);
    } else {
      await addBookmark(
        currentQId,
        "",
        currentQuestion.subject || "General",
        currentQuestion.topic || "General",
        undefined,
        undefined,
        { folders: ["Test"], ...(sessionGoalTag ? { sourceGoalTag: sessionGoalTag } : {}) }
      );
    }
  };

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-[var(--background)] font-sans">
        
        {/* REDESIGNED COMMAND BAR — a compact always-visible row (logo, Q counter, timer,
            actions) that never wraps, plus a details row (type/marks/difficulty and
            section/subject/topic) that's always shown on sm:+ but collapses behind a
            toggle on mobile instead of forcing three stacked rows. */}
        <header className="flex-none bg-[var(--surface)] border-b border-[var(--border)] shadow-sm shrink-0 z-30">
           {/* Row 1: essentials — always visible, never wraps. Both sides are shrink-0 so
               they can never squash/overlap each other on narrow screens; if content still
               can't fit, the row scrolls horizontally instead of breaking (graceful
               degradation, not silent corruption). */}
           <div className="flex items-center justify-between px-2 sm:px-5 gap-2 sm:gap-3 h-14">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                 <button
                   onClick={async () => {
                     if (await confirmDialog({ title: "Leave this exam?", message: "It will be paused and saved, so you can resume it later from the dashboard.", confirmLabel: "Pause & leave", cancelLabel: "Keep going", tone: "warning", icon: "leave" })) {
                       await pauseSession();
                       router.push("/");
                     }
                   }}
                   className="logo-fx w-7 h-7 shrink-0 inline-flex items-center justify-center cursor-pointer"
                   title="Leave exam (pauses and saves progress)"
                   aria-label="Leave exam"
                 >
                   <LogoMarkFx className="h-7 w-7" />
                 </button>
                 {currentQuestion && (
                    <span className="text-[var(--text-primary)] bg-[var(--surface-secondary)] px-2 py-1 rounded-md border border-[var(--border)] font-num text-[13px] font-bold shrink-0">
                      {currentQuestionIndex + 1}<span className="text-[var(--text-muted)]">/{totalQuestions}</span>
                    </span>
                 )}
                 {/* Meta trail shares row 1 rather than claiming a second row. Each label
                     is capped and truncates with an ellipsis; the full value is always
                     available via its tooltip on hover. */}
                 {currentQuestion && (
                    <div className="hidden md:flex items-center gap-1.5 min-w-0 text-[10px] font-black uppercase tracking-wider">
                      <div className="flex items-center rounded-md border border-[var(--border)] overflow-hidden shrink-0 divide-x divide-[var(--border)] shadow-sm">
                        <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-1">
                          {currentQuestion.question_type}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-1 font-num normal-case">
                          +{currentQuestion.marks}/{currentQuestion.question_type === "MCQ" ? `-${(currentQuestion.marks / 3).toFixed(2)}` : "0"}
                        </span>
                        <span className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-1">
                          {currentQuestion.difficulty}
                        </span>
                      </div>
                    </div>
                 )}
              </div>

              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                 <ExamTimer compact />

                 <div className="flex items-center gap-1 border-l border-[var(--border)] pl-2 sm:pl-3 h-9 shrink-0">
                   <button
                     onClick={() => setShowMobilePalette(true)}
                     className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
                     title="Question Grid"
                   >
                     <LayoutGrid className="w-4 h-4" />
                     {stats.notAnswered > 0 && (
                       <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 border border-[var(--surface)]" />
                     )}
                   </button>

                   <button
                     onClick={handleBookmarkToggle}
                     className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                     title="Bookmark Question"
                   >
                     {isCurrentBookmarked ? <BookmarkCheck className="w-4 h-4 text-indigo-500" /> : <Bookmark className="w-4 h-4" />}
                   </button>

                   <button
                     onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                     className="hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-lg text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                     title="Toggle Dark Mode"
                   >
                     {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                   </button>

                   {sessionStatus === "IN_PROGRESS" ? (
                     <button
                       onClick={() => pauseSession()}
                       className="inline-flex items-center justify-center w-9 h-9 text-amber-700 bg-amber-100 hover:bg-amber-200 dark:text-amber-400 dark:bg-amber-900/30 rounded-lg transition-colors cursor-pointer shrink-0"
                       title="Pause Exam"
                     >
                       <Pause className="w-4 h-4" />
                     </button>
                   ) : (
                     <button
                       onClick={() => resumeSession()}
                       className="inline-flex items-center justify-center w-9 h-9 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/40 rounded-lg transition-colors cursor-pointer shrink-0"
                       title="Resume Exam"
                     >
                       <Play className="w-4 h-4" />
                     </button>
                   )}
                   <motion.button
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setShowSubmitModal(true)}
                     className="group relative overflow-hidden h-9 px-4 sm:px-5 inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white rounded-lg shadow-md shadow-violet-500/30 cursor-pointer shrink-0"
                   >
                     <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
                     <Send className="relative w-3.5 h-3.5" />
                     <span className="relative">Submit</span>
                   </motion.button>
                 </div>
              </div>
           </div>

          {/* Progress: answered share of the whole test, animated */}
          <div className="relative h-[3px] w-full bg-[var(--border)]/60 overflow-hidden" role="progressbar" aria-label="Questions answered" aria-valuenow={stats.answered + stats.markedAndAnswered} aria-valuemax={stats.total}>
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500"
              animate={{ width: `${stats.total ? ((stats.answered + stats.markedAndAnswered) / stats.total) * 100 : 0}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
        </header>

        {/* SECTION TABS ROW */}
        <div className="flex-none bg-[var(--surface)] border-b border-[var(--border)] z-20 w-full overflow-x-auto shadow-sm">
           <SectionTabs />
        </div>

        {/* MAIN EXAM WORKSPACE */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Question Workspace Component */}
          <div id="exam-workspace-container" className="flex-1 flex flex-col min-w-0 bg-[var(--surface)] h-full relative z-10 w-full lg:w-auto">
             {sessionStatus === "PAUSED" ? (
                <div className="h-full flex flex-col items-center justify-center p-8 bg-[var(--surface-secondary)]/55 backdrop-blur-sm relative z-50">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative w-20 h-20 mb-6"
                  >
                    <motion.span aria-hidden="true" className="absolute inset-0 rounded-full bg-amber-400/30" animate={{ scale: [1, 1.45], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/40 text-white">
                      <Pause className="w-8 h-8" />
                    </div>
                  </motion.div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 tracking-tight">
                    Test paused
                  </h3>
                  <p className="text-[var(--text-secondary)] font-medium w-full text-center max-w-md">
                    Your timer is stopped and your answers are saved. Resume whenever you&apos;re ready.
                  </p>
                  <div className="flex items-center gap-3 mt-6">
                    <button
                      onClick={() => resumeSession()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl shadow-md shadow-emerald-500/30 transition hover:brightness-110 cursor-pointer"
                    >
                      <Play className="w-4 h-4" /> Resume test
                    </button>
                    <button
                      onClick={async () => {
                        if (await confirmDialog({ title: "Cancel this exam?", message: "Your answers so far will be discarded. This can't be undone.", confirmLabel: "Cancel exam", cancelLabel: "Keep it", tone: "danger" })) {
                          await clearSession();
                          router.push("/");
                        }
                      }}
                      className="px-6 py-2.5 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-elevated)] text-[var(--text-secondary)] font-bold rounded-xl transition cursor-pointer"
                    >
                      Cancel Exam
                    </button>
                  </div>
                </div>
             ) : (
                <>
                  {/* GPU Accelerated Smooth Transitions - Part 5 */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQId}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      style={{ willChange: "transform, opacity" }}
                      className="flex-1 overflow-hidden relative flex flex-col w-full h-full bg-[var(--surface)]"
                    >
                      {currentQuestion && currentResponse ? (
                          <QuestionRenderer
                            question={currentQuestion}
                            response={currentResponse}
                            onResponseUpdate={(payload) => {
                              if (currentQId) saveResponse(currentQId, payload);
                            }}
                            onPrev={previousQuestion}
                            onNext={nextQuestion}
                            isPrevDisabled={currentQuestionIndex === 0}
                            isNextDisabled={currentQuestionIndex === totalQuestions - 1}
                            topSlot={<div className="md:hidden"><QuestionMetaChips q={currentQuestion as any} /></div>}
                          />
                      ) : (
                        <div className="flex h-full items-center justify-center text-red-500 font-bold">
                          Question data error (ID: {currentQId})
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* BOTTOM ACTION BAR (Sticky to bottom) */}
                  <div className="flex-none px-4 py-2 sm:px-6 flex flex-col sm:flex-row justify-between items-center border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur z-20 gap-2">
                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          if (!currentQId) return;
                          saveResponse(currentQId, { status: (currentResponse?.selectedOptions?.length || currentResponse?.natValue) ? "MARKED_AND_ANSWERED" : "MARKED" }).then(() => {
                            if (currentQuestionIndex < totalQuestions - 1) nextQuestion();
                          });
                        }}
                        title={(currentResponse?.selectedOptions?.length || currentResponse?.natValue) ? "Mark for review — your answer will be counted" : "Mark for review"}
                        className="relative group flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20 border border-violet-500/25 rounded-xl text-sm font-semibold transition active:scale-[0.97] cursor-pointer"
                      >
                        <Flag className="w-3.5 h-3.5 transition-transform group-hover:-rotate-12" /> Mark &amp; next
                        {/* Green dot = this question has an answer, so "Mark & next" saves it as Marked & Answered (same dot as the palette). */}
                        <AnimatePresence>
                          {!!(currentResponse?.selectedOptions?.length || currentResponse?.natValue) && (
                            <motion.span key="ans-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 500, damping: 22 }}
                              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[var(--surface)] shadow" aria-label="Answered" />
                          )}
                        </AnimatePresence>
                      </button>
                      <button
                        onClick={handleClearResponse}
                        className="group flex-none inline-flex items-center gap-1.5 px-4 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-rose-400/50 hover:text-rose-600 dark:hover:text-rose-400 text-[var(--text-secondary)] font-semibold rounded-xl text-sm transition active:scale-[0.97] cursor-pointer"
                      >
                        <Eraser className="w-3.5 h-3.5 transition-transform group-hover:-rotate-12" /> Clear
                      </button>
                    </div>

                    {/* Center: fills the gap between the two button groups with a quick glance summary */}
                    <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="font-num">{stats.answered + stats.markedAndAnswered}/{stats.total}</span> answered
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300">
                        <Flag className="w-3 h-3" />
                        <span className="font-num">{stats.marked + stats.markedAndAnswered}</span> marked
                      </span>
                    </div>

                    <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
                      <button
                        disabled={currentQuestionIndex === 0}
                        onClick={previousQuestion}
                        className="group flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--text-primary)] font-semibold rounded-xl transition disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Previous
                      </button>
                      <button
                        onClick={() => {
                          if (!currentQId) {
                            nextQuestion();
                            return;
                          }
                          saveResponse(currentQId, { status: (currentResponse?.selectedOptions?.length || currentResponse?.natValue) ? "ANSWERED" : "VISITED" }).then(() => {
                            if (currentQuestionIndex < totalQuestions - 1) {
                              nextQuestion();
                            }
                          });
                        }}
                        className="group relative overflow-hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-7 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-emerald-500/30 transition hover:brightness-110 active:scale-[0.97] cursor-pointer"
                      >
                        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
                        <span className="relative">Save &amp; next</span>
                        <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </>
             )}
          </div>

          {/* Right Palette — always visible as a sidebar on lg:+. On mobile it used to be
              permanently squeezed into 45vh below the question (cramped, forced scrolling,
              broke question rendering); now it's hidden by default and opened on demand via
              the grid button in the command bar, as a full bottom-sheet overlay instead. */}
          <div className="hidden lg:flex w-full lg:w-[340px] flex-none lg:border-l border-[var(--border)] bg-[var(--surface)] z-20 flex-col h-full overflow-hidden">
            <QuestionPalette />
          </div>

          <AnimatePresence>
            {showMobilePalette && (
              <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMobilePalette(false)}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="relative bg-[var(--surface)] border-t border-[var(--border)] rounded-t-2xl shadow-2xl z-10 flex flex-col max-h-[75vh] overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)] shrink-0">
                    <span className="text-xs font-black uppercase tracking-wider text-[var(--text-secondary)]">Question Grid</span>
                    <div className="flex items-center gap-1">
                      {/* Bookmark is hidden from the cramped row 1 on mobile — reachable here instead. */}
                      <button
                        onClick={handleBookmarkToggle}
                        className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
                        title="Bookmark Question"
                      >
                        {isCurrentBookmarked ? <BookmarkCheck className="w-4 h-4 text-indigo-500" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setShowMobilePalette(false)}
                        className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="overflow-y-auto custom-scrollbar">
                    <QuestionPalette />
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <ExamSubmitDialog
        isOpen={showSubmitModal}
        stats={stats}
        onCancel={() => setShowSubmitModal(false)}
        onConfirm={async () => {
          setShowSubmitModal(false);
          await submitSession();
        }}
      />
    </MathJaxContext>
  );
}
