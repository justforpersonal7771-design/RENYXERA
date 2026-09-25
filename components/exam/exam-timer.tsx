"use client";

import { useEffect, useState, useMemo } from "react";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { Clock, Pause } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

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

  // In-exam header timer: a draining ring round a heartbeat dot, rolling digits, and a
  // calm → amber → red progression with a breathing glow when time is short. Hover (or
  // focus) shows elapsed time and the projected finish.
  if (compact) {
    const paused = status !== "IN_PROGRESS";
    const critical = remainingRatio <= 0.15;
    const warning = !critical && remainingRatio <= 0.3;
    const lastMinute = remaining <= 60 && !paused;
    const tone = paused
      ? { box: "bg-[var(--surface-secondary)] border-[var(--border)]", text: "text-[var(--text-muted)]", ring: "#94a3b8", dot: "bg-slate-400", glow: "" }
      : critical
        ? { box: "bg-rose-500/10 border-rose-500/40", text: "text-rose-600 dark:text-rose-400", ring: "#f43f5e", dot: "bg-rose-500", glow: "timer-glow-critical" }
        : warning
          ? { box: "bg-amber-500/10 border-amber-500/40", text: "text-amber-600 dark:text-amber-400", ring: "#f59e0b", dot: "bg-amber-500", glow: "" }
          : { box: "bg-[var(--surface-secondary)]/70 border-[var(--border)]", text: "text-[var(--text-primary)]", ring: "#10b981", dot: "bg-emerald-500", glow: "" };
    const R = 9;
    const C = 2 * Math.PI * R;

    return (
      <div
        tabIndex={0}
        aria-label={`Time remaining ${formatTime(remaining)}${paused ? ", paused" : ""}`}
        className={`group relative h-9 flex items-center gap-2 pl-1.5 pr-3 rounded-xl border backdrop-blur-md shadow-sm select-none shrink-0 transition-colors duration-500 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/60 ${tone.box} ${tone.glow}`}
      >
        {/* Ring + heartbeat dot */}
        <span className="relative w-6 h-6 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="absolute inset-0 -rotate-90">
            <circle cx="12" cy="12" r={R} fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--border)]" />
            <motion.circle
              cx="12" cy="12" r={R} fill="none" stroke={tone.ring} strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray={C}
              initial={false}
              animate={{ strokeDashoffset: C * (1 - remainingRatio) }}
              transition={{ duration: 0.9, ease: "linear" }}
            />
          </svg>
          {paused ? (
            <Pause className="relative w-2.5 h-2.5 text-[var(--text-muted)]" />
          ) : (
            <span className="relative flex w-2 h-2">
              <span className={`absolute inset-0 rounded-full ${tone.dot} opacity-60 animate-ping`} style={{ animationDuration: critical ? "1s" : "2s" }} />
              <span className={`relative w-2 h-2 rounded-full ${tone.dot}`} />
            </span>
          )}
        </span>

        <motion.span
          key={lastMinute ? remaining : "steady"}
          initial={lastMinute ? { scale: 1.12 } : false}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={`flex font-num font-bold tabular-nums text-[15px] sm:text-base leading-none tracking-tight ${tone.text}`}
        >
          <RollingTime value={formatTime(remaining)} />
        </motion.span>

        {/* Hover/focus detail */}
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-2 text-[11px] font-medium text-[var(--text-secondary)] shadow-xl opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-200 z-50">
          <span className="block"><span className="text-[var(--text-muted)]">Elapsed</span> <span className="font-num font-semibold text-[var(--text-primary)]">{formatTime(elapsed)}</span></span>
          <span className="block"><span className="text-[var(--text-muted)]">{paused ? "Paused" : "Ends at"}</span> {!paused && <span className="font-num font-semibold text-[var(--text-primary)]">{estFinishTime}</span>}</span>
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

/** Clock digits that roll up as they change (only the digits that actually changed). */
function RollingTime({ value }: { value: string }) {
  return (
    <>
      {value.split("").map((ch, i) =>
        ch === ":" ? (
          <span key={`c${i}`} className="px-[1px] opacity-60">:</span>
        ) : (
          <span key={`d${i}`} className="relative inline-block w-[0.62em] h-[1.1em] overflow-hidden text-center">
            <AnimatePresence initial={false}>
              <motion.span
                key={ch}
                initial={{ y: "-100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {ch}
              </motion.span>
            </AnimatePresence>
          </span>
        )
      )}
    </>
  );
}
