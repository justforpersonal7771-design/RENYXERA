"use client";

import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { useExamStore } from "@/store/use-exam-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { useMemo } from "react";
import { motion } from "motion/react";

/** "GENERAL APTITUDE (GA)" → "General Aptitude"; keeps short codes like "CS" upper. */
function shortName(name: string) {
  return name.replace(/\s*\(.*?\)\s*/g, " ").trim().toLowerCase()
    .replace(/\b([a-z])/g, (m) => m.toUpperCase()).replace(/\bCs\b/g, "CS").replace(/\bGa\b/g, "GA")
    .replace("Mathematical Foundations", "Maths");
}

/**
 * Section switcher. `row` (default): full-width tabs under the top bar (phones).
 * `bar`: a compact pill control that lives inside the exam top bar on wider screens —
 * a gradient pill slides between sections, each with an answered/total count.
 */
export function SectionTabs({ variant = "row" }: { variant?: "row" | "bar" }) {
  // The running test carries its own copy of the question list; the setup draft can be
  // cleared (store reset on sign-in, resumed or archived tests) and left this empty.
  const setupDraft = useExamStore((st) => st.currentDraft);
  const sessionDraft = useExamRuntimeStore((st) => st.activeSession?.draftConfig);
  const currentDraft = sessionDraft ?? setupDraft;
  const currentQuestionIndex = useExamRuntimeStore(
    (state) => state.activeSession?.currentQuestionIndex || 0,
  );
  const goToQuestion = useExamRuntimeStore((state) => state.goToQuestion);
  const responses = useExamRuntimeStore((state) => state.activeSession?.responses);

  const sections = useMemo(() => {
    if (!currentDraft) return [];

    const secMap = new Map<string, { startIdx: number; count: number }>();

    currentDraft.questions.forEach((q, idx) => {
      const qData = QuestionRepository.getQuestionById(q.questionId);
      const sectionName = qData?.section || "Unknown";
      if (!secMap.has(sectionName)) {
        secMap.set(sectionName, { startIdx: idx, count: 1 });
      } else {
        const entry = secMap.get(sectionName)!;
        entry.count++;
        secMap.set(sectionName, entry);
      }
    });

    return Array.from(secMap.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [currentDraft]);

  const currentQData = useMemo(() => {
    if (!currentDraft || !currentDraft.questions[currentQuestionIndex]) return null;
    return QuestionRepository.getQuestionById(currentDraft.questions[currentQuestionIndex].questionId);
  }, [currentDraft, currentQuestionIndex]);

  const activeSectionName = currentQData?.section || "Unknown";

  if (sections.length <= 1) return null;

  if (variant === "bar") {
    return (
      <div role="tablist" aria-label="Sections" className="relative flex items-center gap-0.5 p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] min-w-0">
        {sections.map((sec) => {
          const isActive = activeSectionName === sec.name;
          const ids = currentDraft!.questions.slice(sec.startIdx, sec.startIdx + sec.count).map((q) => q.questionId);
          const answered = ids.filter((id) => { const st = responses?.[id]?.status; return st === "ANSWERED" || st === "MARKED_AND_ANSWERED"; }).length;
          return (
            <button key={sec.name} role="tab" aria-selected={isActive} title={sec.name} onClick={() => goToQuestion(sec.startIdx)}
              className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${isActive ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {isActive && <motion.span layoutId="sectionBarPill" transition={{ type: "spring", stiffness: 420, damping: 32 }} className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/30" />}
              <span className="relative transition-transform duration-200 group-hover:scale-[1.04]">{shortName(sec.name)}</span>
              <span className={`relative font-num text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? "bg-white/20" : "bg-[var(--surface)] text-[var(--text-muted)]"}`}>{answered}/{sec.count}</span>
            </button>
          );
        })}
      </div>
    );
  }


  return (
    <div 
      className="flex w-full bg-[var(--surface)] border-b border-[var(--border)] px-0 pt-0 gap-0 overflow-x-auto shrink-0"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {sections.map((sec) => {
        const isActive = activeSectionName === sec.name;
        return (
          <button
            key={sec.name}
            onClick={() => goToQuestion(sec.startIdx)}
            className={`relative flex-1 px-4 py-4 text-xs font-black uppercase tracking-wider transition-colors whitespace-nowrap focus:outline-none ${
              isActive
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-gray-50/50 dark:hover:bg-gray-800/30"
            }`}
          >
            <span className="relative z-10">{sec.name}</span>
            {isActive && (
              <motion.div
                layoutId="activeSectionTab"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {isActive && (
              <motion.div
                layoutId="activeSectionBg"
                className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-indigo-50/5 dark:from-indigo-900/10 dark:to-transparent"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
