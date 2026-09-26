"use client";

import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { useExamStore } from "@/store/use-exam-store";
import { useCallback, useMemo, useRef } from "react";
import { useKeepCurrentCellVisible } from "./question-meta";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { motion } from "motion/react";
import { SmartTruncate } from "@/components/ui/smart-truncate";

export function QuestionPalette() {
  // The running test carries its own copy of the question list; the setup draft can be
  // cleared (store reset on sign-in, resumed or archived tests) and left this empty.
  const setupDraft = useExamStore((st) => st.currentDraft);
  const sessionDraft = useExamRuntimeStore((st) => st.activeSession?.draftConfig);
  const currentDraft = sessionDraft ?? setupDraft;
  const responses = useExamRuntimeStore((state) => state.activeSession?.responses);
  const totalQuestions = useExamRuntimeStore((state) => state.activeSession?.totalQuestions || 0);
  const currentQuestionIndex = useExamRuntimeStore((state) => state.activeSession?.currentQuestionIndex || 0);
  const goToQuestion = useExamRuntimeStore((state) => state.goToQuestion);

  const currentQData = (currentDraft && currentDraft.questions[currentQuestionIndex])
    ? QuestionRepository.getQuestionById(currentDraft.questions[currentQuestionIndex].questionId)
    : null;
  const currentSection = currentQData?.section || "Unknown";

  const sectionQuestions = useMemo(() => {
    if (!currentDraft) return [];
    return currentDraft.questions
      .map((q, idx) => ({
        q,
        idx,
        qData: QuestionRepository.getQuestionById(q.questionId),
      }))
      .filter((item) => (item.qData?.section || "Unknown") === currentSection);
  }, [currentDraft, currentSection]);

  const responsesList = useMemo(() => {
    if (!responses) return [];
    return sectionQuestions.map((sq) => responses[sq.q.questionId]);
  }, [sectionQuestions, responses]);

  const stats = useMemo(() => {
    return {
      answered: responsesList.filter((r) => r?.status === "ANSWERED").length,
      notAnswered: responsesList.filter((r) => r?.status === "VISITED").length,
      notVisited: responsesList.filter((r) => r?.status === "NOT_VISITED").length,
      marked: responsesList.filter((r) => r?.status === "MARKED").length,
      markedAndAnswered: responsesList.filter((r) => r?.status === "MARKED_AND_ANSWERED").length,
    };
  }, [responsesList]);

  const gridRef = useRef<HTMLDivElement>(null);
  useKeepCurrentCellVisible(gridRef, currentQuestionIndex);

  const handleJump = useCallback(
    (index: number) => {
      goToQuestion(index);
    },
    [goToQuestion],
  );

  if (!responses || !currentDraft) return null;

  return (
    <div className="h-full flex flex-col pt-0 bg-[var(--surface)] overflow-hidden divide-y divide-[var(--border)]">
      
      {/* 1. Header Metadata Section (Section, Subject, Topic) */}
      <div className="flex-none bg-[var(--surface-secondary)] border-b border-[var(--border)] p-4 sm:p-5">
        {currentQData ? (
          <div className="space-y-3">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block mb-0.5">Current Section</span>
              <SmartTruncate className="text-xs font-bold text-[var(--text-primary)]" text={currentQData.section || "N/A"} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block mb-0.5">Current Subject</span>
              <SmartTruncate className="text-xs font-bold text-[var(--text-primary)]" text={currentQData.subject || "N/A"} />
            </div>
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] block mb-0.5">Current Topic</span>
              <SmartTruncate className="text-xs font-bold text-[var(--text-primary)]" text={currentQData.topic || "N/A"} />
            </div>
          </div>
        ) : null}
      </div>

      {/* 2. Legend Status Counters */}
      <div className="flex-none p-4 sm:p-5 bg-[var(--surface-secondary)]">
        <div className="grid grid-cols-2 gap-3 text-xs font-bold uppercase text-[var(--text-secondary)]">
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-green-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">{stats.answered}</span>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-red-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">{stats.notAnswered}</span>
            <span>Not Answered</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-[var(--surface-elevated)] border border-[var(--border)] text-[var(--text-secondary)] flex items-center justify-center text-[10px] font-bold shadow-sm">{stats.notVisited}</span>
            <span>Not Visited</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded bg-purple-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">{stats.marked}</span>
            <span>Marked</span>
          </div>
          <div className="flex items-center gap-2.5 col-span-2">
            <div className="w-5 h-5 bg-purple-500 rounded flex items-center justify-center text-white relative shadow-sm shrink-0">
               <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-[1.5px] border-[var(--surface)]" />
            </div>
            <span>Marked & Answered ({stats.markedAndAnswered})</span>
          </div>
        </div>
      </div>

      {/* 3. Center Aligned Questions Palette Grid */}
      <div ref={gridRef} className="grid-snap flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 custom-scrollbar">
        <div className="grid grid-cols-5 gap-2.5 max-w-[300px] mx-auto justify-items-center">
          {sectionQuestions.map(({ q, idx }) => {
            const localQId = q.questionId;
            const st = responses[localQId]?.status;
            const isCurrent = currentQuestionIndex === idx;

            let colorClass = "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border-[var(--border)] hover:border-indigo-400/60";

            if (st === "ANSWERED") {
              colorClass = "bg-gradient-to-br from-emerald-400 to-green-600 text-white border-transparent shadow-md shadow-emerald-500/30";
            } else if (st === "VISITED") {
              colorClass = "bg-gradient-to-br from-rose-400 to-red-600 text-white border-transparent shadow-md shadow-rose-500/30";
            } else if (st === "MARKED") {
              colorClass = "bg-gradient-to-br from-violet-400 to-purple-600 text-white border-transparent shadow-md shadow-violet-500/30";
            } else if (st === "MARKED_AND_ANSWERED") {
              colorClass = "bg-gradient-to-br from-violet-400 to-purple-600 text-white border-transparent shadow-md shadow-violet-500/30";
            }

            return (
              <motion.button
                key={localQId || idx}
                onClick={() => handleJump(idx)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(idx * 0.015, 0.4), type: "spring", stiffness: 400, damping: 24 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.92 }}
                aria-current={isCurrent ? "step" : undefined}
                className={`relative aspect-square w-12 rounded-xl flex items-center justify-center font-num font-bold text-sm transition-colors border cursor-pointer ${colorClass}`}
              >
                {isCurrent && (
                  <motion.span
                    layoutId="palette-current"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl ring-[3px] ring-inset ring-indigo-500 dark:ring-indigo-400 shadow-[0_0_14px_rgba(99,102,241,0.5)]"
                    transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  />
                )}
                {idx + 1}
                {st === "MARKED_AND_ANSWERED" && (
                  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-[var(--surface)]" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
