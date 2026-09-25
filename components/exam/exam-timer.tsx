"use client";

import { useEffect, useState, useMemo } from "react";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { Clock } from "lucide-react";
import { motion } from "motion/react";

export function ExamTimer({ compact = false }: { compact?: boolean }) {
  const status = useExamRuntimeStore((state) => state.activeSession?.status);
  const elapsed = useExamRuntimeStore((state) => state.activeSession?.elapsedSeconds || 0);
  const tickTimer = useExamRuntimeStore((state) => state.tickTimer);
  const submitSession = useExamRuntimeStore((state) => state.submitSession);
  // Read straight from the active session's own draft rather than the separate useExamStore
  // draft — that store is only populated by the standard ExamBuilder flow, so any session
  // started from a hand-built draft (e.g. the AI Generated "Start Test" flow) left this
  // timer with no draft to read and silently fell back to a hardcoded 3-hour duration.
  const draftQuestions = useExamRuntimeStore((state) => state.activeSession?.draftConfig?.questions);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (status === "IN_PROGRESS") {
      intervalId = setInterval(() => {
        tickTimer(); // updates the store
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [status, tickTimer]);

  const TOTAL_TIME = useMemo(() => {
    if (!draftQuestions || draftQuestions.length === 0) return 10800; // default to 3 hours
    return draftQuestions.reduce((acc, q) => {
      const questionData = QuestionRepository.getQuestionById(q.questionId);
      if (questionData) {
        if (questionData.marks === 2) return acc + 216;
        if (questionData.marks === 1) return acc + 108;
        return acc + (questionData.marks * 108);
      }
      return acc + 108;
    }, 0);
  }, [draftQuestions]);

  const remaining = Math.max(0, TOTAL_TIME - elapsed);

  useEffect(() => {
    if (remaining === 0 && status === "IN_PROGRESS") {
      submitSession();
    }
  }, [remaining, status, submitSession]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const estFinishTime = useMemo(() => {
    const end = new Date(Date.now() + remaining * 1000);
    return end.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
  }, [remaining]);

  const remainingRatio = TOTAL_TIME > 0 ? remaining / TOTAL_TIME : 0;
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - remainingRatio);

  const ringSize = compact ? "w-8 h-8" : "w-10 h-10";
  const iconSize = compact ? "w-3.5 h-3.5" : "w-4 h-4";

  // In-exam header: remaining time is the only thing that matters at a glance, so it's
  // shown on its own, large, in a glass pill matching the topbar's icon cluster — no
  // progress ring, clock glyph, "rem" label or projected end time competing with it.
  if (compact) {
    const tone =
      remainingRatio <= 0.15
        ? {
            box: "bg-rose-500/10 border-rose-500/30 ring-rose-500/10",
            text: "text-rose-600 dark:text-rose-400",
            dot: "bg-rose-500",
          }
        : remainingRatio <= 0.3
          ? {
              box: "bg-amber-500/10 border-amber-500/30 ring-amber-500/10",
              text: "text-amber-600 dark:text-amber-400",
              dot: "bg-amber-500",
            }
          : {
              box: "bg-[var(--surface-secondary)]/70 border-[var(--border)] ring-black/[0.03] dark:ring-white/[0.04]",
              text: "text-[var(--text-primary)]",
              dot: "bg-emerald-500",
            };

    return (
      <div
        className={`h-9 flex items-center gap-2 pl-2.5 pr-3 rounded-xl border ring-1 backdrop-blur-md shadow-sm select-none shrink-0 transition-colors ${tone.box}`}
        title="Time remaining"
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${tone.dot} ${remainingRatio <= 0.15 ? "animate-pulse" : ""}`} />
        <span className={`font-num font-bold tabular-nums text-[15px] sm:text-base leading-none tracking-tight ${tone.text}`}>
          {formatTime(remaining)}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center text-xs font-bold text-[var(--text-secondary)] select-none ${compact ? "gap-2" : "gap-4"}`}>
      {/* SVG Timer Progress Ring */}
      <div className={`relative ${ringSize} flex items-center justify-center shrink-0`}>
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 40 40">
          <circle
            cx="20"
            cy="20"
            r={radius}
            className="stroke-gray-200 dark:stroke-gray-800 fill-none"
            strokeWidth="3"
          />
          <motion.circle
            cx="20"
            cy="20"
            r={radius}
            className={`fill-none ${
              remainingRatio <= 0.15
                ? 'stroke-rose-500'
                : remainingRatio <= 0.3
                  ? 'stroke-amber-500'
                  : 'stroke-indigo-500'
            }`}
            strokeWidth="3"
            strokeDasharray={circumference}
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ ease: "linear" }}
            strokeLinecap="round"
          />
        </svg>
        <Clock className={`${iconSize} absolute ${remainingRatio <= 0.15 ? 'text-rose-500 animate-pulse' : 'text-[var(--text-muted)]'}`} />
      </div>

      {/* Time Stats Columns */}
      <div className="flex flex-col font-num">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-black text-[var(--text-primary)] leading-none ${compact ? "text-xs" : "text-sm"}`}>{formatTime(remaining)}</span>
          <span className="text-[8px] text-[var(--text-muted)] font-black uppercase tracking-wider leading-none">rem</span>
        </div>
        {!compact && (
          <div className="flex gap-2 text-[9px] text-[var(--text-muted)] uppercase tracking-wider mt-1 font-semibold whitespace-nowrap">
            <span>Elapsed: {formatTime(elapsed)}</span>
            <span>•</span>
            <span>Est. End: {estFinishTime}</span>
          </div>
        )}
        {compact && (
          <span className="hidden sm:inline text-[8px] text-[var(--text-muted)] font-semibold uppercase tracking-wider mt-0.5 whitespace-nowrap">
            End {estFinishTime}
          </span>
        )}
      </div>
    </div>
  );
}
