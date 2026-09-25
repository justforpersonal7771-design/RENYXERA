"use client";

import { useEffect, useState, useMemo } from "react";
import { TiltCard, CountUp as CountUpFx } from "@/components/ui/interactive";
import { useSearchParams, useRouter } from "next/navigation";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { ExamSession } from "@/types/exam-runtime.types";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import {
  Award, Clock, Target, AlertCircle, CheckCircle,
  XCircle, ArrowRight, Home, RefreshCw, BarChart2, ListFilter, HelpCircle, Sparkles, TrendingUp, LayoutGrid, Flag
} from "lucide-react";
import { GoalTagBadge } from "@/components/ui/goal-tag-badge";

/** Animated count-up for a numeric value, e.g. marks or accuracy percentage. */
function CountUp({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (v) => v.toFixed(decimals));
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 1, ease: "easeOut" });
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display}</>;
}

export default function ResultSummaryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams?.get("id");
  const [session, setSession] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"subject" | "section" | "difficulty" | "type">("subject");
  const [rightPanelView, setRightPanelView] = useState<"grid" | "breakdown">("grid");

  useEffect(() => {
    async function load() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const record = await IDBManager.loadExamSession(id);
        if (record && record.sessionData) {
          setSession(record.sessionData as ExamSession);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const statsCalculations = useMemo(() => {
    if (!session) return null;

    let marks = 0;
    let correct = 0;
    let wrong = 0;
    let totalAttempted = 0;
    let maxPossibleMarks = 0;
    let totalPositiveMarks = 0;
    let totalNegativeMarks = 0;

    const subjectSplits: Record<string, { attempted: number; correct: number; wrong: number; marks: number, max: number }> = {};
    const sectionSplits: Record<string, { attempted: number; correct: number; wrong: number; marks: number, max: number }> = {};
    const difficultySplits: Record<string, { attempted: number; correct: number; wrong: number; marks: number, max: number }> = {};
    const typeSplits: Record<string, { attempted: number; correct: number; wrong: number; marks: number, max: number }> = {};

    session.draftConfig.questions.forEach(qRef => {
      const q = QuestionRepository.getQuestionById(qRef.questionId);
      if (!q) return;

      maxPossibleMarks += q.marks;
      
      const subj = q.subject || "General";
      const sect = q.section || "General";
      const diff = q.difficulty || "Medium";
      const qtype = q.question_type || "MCQ";

      if (!subjectSplits[subj]) subjectSplits[subj] = { attempted: 0, correct: 0, wrong: 0, marks: 0, max: 0 };
      if (!sectionSplits[sect]) sectionSplits[sect] = { attempted: 0, correct: 0, wrong: 0, marks: 0, max: 0 };
      if (!difficultySplits[diff]) difficultySplits[diff] = { attempted: 0, correct: 0, wrong: 0, marks: 0, max: 0 };
      if (!typeSplits[qtype]) typeSplits[qtype] = { attempted: 0, correct: 0, wrong: 0, marks: 0, max: 0 };

      subjectSplits[subj].max += q.marks;
      sectionSplits[sect].max += q.marks;
      difficultySplits[diff].max += q.marks;
      typeSplits[qtype].max += q.marks;

      const res = Object.values(session.responses).find(r => r.questionId === q.question_id);
      if (res && (res.status === "ANSWERED" || res.status === "MARKED_AND_ANSWERED")) {
        totalAttempted++;
        subjectSplits[subj].attempted++;
        sectionSplits[sect].attempted++;
        difficultySplits[diff].attempted++;
        typeSplits[qtype].attempted++;

        let isCorrect = false;
        if (q.question_type === "MCQ" || q.question_type === "MSQ") {
          const correctOpts = q.options.filter(o => o.is_correct).map(o => o.option_id).sort();
          const selectedOpts = [...(res.selectedOptions || [])].sort();
          isCorrect = JSON.stringify(correctOpts) === JSON.stringify(selectedOpts);
        } else if (q.question_type === "NAT") {
          const val = parseFloat(res.natValue || "");
          if (!isNaN(val) && q.nat_answer_range) {
             isCorrect = val >= q.nat_answer_range.min && val <= q.nat_answer_range.max;
          }
        }
        
        if (isCorrect) {
          correct++;
          subjectSplits[subj].correct++;
          sectionSplits[sect].correct++;
          difficultySplits[diff].correct++;
          typeSplits[qtype].correct++;

          marks += q.marks;
          subjectSplits[subj].marks += q.marks;
          sectionSplits[sect].marks += q.marks;
          difficultySplits[diff].marks += q.marks;
          typeSplits[qtype].marks += q.marks;

          totalPositiveMarks += q.marks;
        } else {
          wrong++;
          subjectSplits[subj].wrong++;
          sectionSplits[sect].wrong++;
          difficultySplits[diff].wrong++;
          typeSplits[qtype].wrong++;

          if (q.question_type === "MCQ") {
             const penalty = (q.marks / 3);
             marks -= penalty;
             subjectSplits[subj].marks -= penalty;
             sectionSplits[sect].marks -= penalty;
             difficultySplits[diff].marks -= penalty;
             typeSplits[qtype].marks -= penalty;
             totalNegativeMarks += penalty;
          }
        }
      }
    });

    const accuracy = totalAttempted > 0 ? (correct / totalAttempted) * 100 : 0;
    const m = Math.floor(session.elapsedSeconds / 60);
    const s = session.elapsedSeconds % 60;

    return {
      marks,
      correct,
      wrong,
      totalAttempted,
      maxPossibleMarks,
      totalPositiveMarks,
      totalNegativeMarks,
      accuracy,
      m,
      s,
      subjectSplits,
      sectionSplits,
      difficultySplits,
      typeSplits
    };
  }, [session]);

  const questionGrid = useMemo(() => {
    if (!session) return [];
    return session.draftConfig.questions.map((qRef, idx) => {
      const q = QuestionRepository.getQuestionById(qRef.questionId);
      const res = session.responses[qRef.questionId];
      const isMarked = res?.status === "MARKED" || res?.status === "MARKED_AND_ANSWERED";
      const isAttempted = !!res && (res.status === "ANSWERED" || res.status === "MARKED_AND_ANSWERED");

      let isCorrect = false;
      if (isAttempted && q) {
        if (q.question_type === "MCQ" || q.question_type === "MSQ") {
          const correctOpts = q.options.filter(o => o.is_correct).map(o => o.option_id).sort();
          const selectedOpts = [...(res!.selectedOptions || [])].sort();
          isCorrect = JSON.stringify(correctOpts) === JSON.stringify(selectedOpts);
        } else if (q.question_type === "NAT") {
          const val = parseFloat(res!.natValue || "");
          if (!isNaN(val) && q.nat_answer_range) {
            isCorrect = val >= q.nat_answer_range.min && val <= q.nat_answer_range.max;
          }
        }
      }

      return {
        index: idx,
        questionId: qRef.questionId,
        isAttempted,
        isCorrect,
        isMarked,
      };
    });
  }, [session]);

  const handleRetry = async () => {
    if (!session) return;
    const { startSession } = useExamRuntimeStore.getState();
    await startSession({
      ...session.draftConfig,
      id: crypto.randomUUID()
    });
    router.push("/exam/session");
  };

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--background)]">
       <div className="font-bold tracking-widest uppercase animate-pulse text-indigo-600 dark:text-indigo-400">Loading Result Summary...</div>
    </div>
  );
  
  if (!session || !statsCalculations) return <div className="p-8 text-center text-rose-500 font-bold bg-[var(--background)] h-screen">Result not found.</div>;

  const {
    marks,
    correct,
    wrong,
    totalAttempted,
    maxPossibleMarks,
    totalPositiveMarks,
    totalNegativeMarks,
    accuracy,
    m,
    s,
    subjectSplits,
    sectionSplits,
    difficultySplits,
    typeSplits
  } = statsCalculations;

  // Active split selection based on tab state
  const activeBreakdown = () => {
    switch (activeTab) {
      case "subject": return Object.keys(subjectSplits).map(key => ({ label: key, ...subjectSplits[key] }));
      case "section": return Object.keys(sectionSplits).map(key => ({ label: key, ...sectionSplits[key] }));
      case "difficulty": return Object.keys(difficultySplits).map(key => ({ label: key, ...difficultySplits[key] }));
      case "type": return Object.keys(typeSplits).map(key => ({ label: key, ...typeSplits[key] }));
    }
  };

  const accuracyRatio = accuracy / 100;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - circumference * accuracyRatio;

  const verdict =
    accuracy >= 80
      ? { label: "Outstanding Performance!", message: "You're demonstrating strong command over this material. Keep this momentum going." }
      : accuracy >= 60
      ? { label: "Solid Effort", message: "A good foundation is showing. Review your mistakes to close the gap to excellent." }
      : accuracy >= 40
      ? { label: "Room to Grow", message: "You're making progress. Focus revision time on the weakest topics below." }
      : { label: "Keep Practicing", message: "Every attempt builds understanding. Review the breakdown and revisit the fundamentals." };

  return (
    <div className="w-full mx-auto font-sans flex flex-col lg:h-full lg:min-h-0 lg:overflow-hidden pb-2" data-fill-height>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:flex-1 lg:min-h-0 lg:overflow-hidden">

        {/* Left Side: single non-scrolling card — verdict + score breakdown + actions
            all live together instead of two stacked cards inside a scrolling column. */}
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col relative overflow-hidden rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm lg:h-full lg:min-h-0"
        >
          {/* Verdict hero band */}
          <div className="shrink-0 relative overflow-hidden bg-gradient-to-br from-blue-600 via-violet-600 to-fuchsia-600 text-white p-5">
            <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-300/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-fuchsia-400/20 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center gap-3">
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-white/15 px-3 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  Evaluation Complete
                </span>
                {session.draftConfig.config.goalTag && (
                  <GoalTagBadge tag={session.draftConfig.config.goalTag} className="bg-white/15 !text-white !border-white/20" />
                )}
              </div>

              {/* Accuracy ring — the focal point of the card, so it carries the motion:
                  a slow flowing gradient around the arc, a counter-rotating halo, a
                  breathing glow and a tracer dot riding the arc's leading edge. */}
              <motion.div
                className="relative w-44 h-44 sm:w-48 sm:h-48 shrink-0 cursor-default"
                initial={{ scale: 0.86, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04 }}
              >
                {/* breathing glow */}
                <motion.div
                  className="absolute inset-2 rounded-full bg-white/25 blur-2xl pointer-events-none"
                  animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.06, 0.92] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* counter-rotating dashed halo */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-dashed border-white/25 pointer-events-none"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                />

                <svg className="w-full h-full -rotate-90 relative" viewBox="0 0 128 128">
                  <defs>
                    <linearGradient id="accArc" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#c7d2fe" />
                      <stop offset="100%" stopColor="#f5d0fe" />
                      <animateTransform
                        attributeName="gradientTransform"
                        type="rotate"
                        from="0 0.5 0.5"
                        to="360 0.5 0.5"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                    <filter id="accGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="2.5" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  <circle cx="64" cy="64" r={radius} strokeWidth="9" className="stroke-white/20 fill-none" />
                  <motion.circle
                    cx="64"
                    cy="64"
                    r={radius}
                    strokeWidth="9"
                    stroke="url(#accArc)"
                    filter="url(#accGlow)"
                    className="fill-none"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                  />

                  {/* tracer dot parked at the arc's leading edge */}
                  <motion.g
                    initial={{ rotate: 0 }}
                    animate={{ rotate: accuracyRatio * 360 }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                    style={{ originX: "64px", originY: "64px" }}
                  >
                    <motion.circle
                      cx={64 + radius}
                      cy="64"
                      r="5"
                      className="fill-white"
                      animate={{ opacity: [1, 0.45, 1], r: [5, 6.5, 5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.g>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl sm:text-[3.25rem] font-black font-num leading-none drop-shadow-sm">
                    <CountUp value={accuracy} decimals={0} />%
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100 mt-1.5">Accuracy</span>
                </div>
              </motion.div>

              <div>
                <h1 className="text-lg md:text-xl font-black tracking-tight">{verdict.label}</h1>
                <p className="text-indigo-100 text-xs font-semibold max-w-sm mt-1">{verdict.message}</p>
              </div>

              <div className="flex gap-8 pt-2 border-t border-white/15 w-full justify-center">
                <div className="text-center">
                  <div className="text-xl font-black font-num"><CountUp value={marks} decimals={2} /></div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-indigo-200">/ {maxPossibleMarks} Marks</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-black font-num">{m}m {s}s</div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-indigo-200 flex items-center gap-1 justify-center">
                    <Clock className="w-3 h-3" /> Time
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scoreboard content — same card, continues below the hero band. Deliberately
              not scrollable: this card now sizes to its content rather than clipping it. */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-5 py-4 flex flex-col justify-evenly gap-4">
            <div>
              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Attempted vs Skipped</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-2xl font-black text-[var(--text-primary)] font-num">{totalAttempted}</span>
                  <span className="text-sm font-bold text-[var(--text-muted)] font-num"> / {session.totalQuestions}</span>
                  <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Attempted</p>
                </div>
                <div>
                  <span className="text-2xl font-black text-[var(--text-primary)] font-num">{session.totalQuestions - totalAttempted}</span>
                  <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Skipped</p>
                </div>
              </div>
              {/* correct / wrong / skipped as one split bar */}
              <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-secondary)]">
                {[
                  { v: correct, c: "from-emerald-400 to-green-500" },
                  { v: wrong, c: "from-rose-400 to-red-500" },
                  { v: session.totalQuestions - totalAttempted, c: "from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-500" },
                ].map((seg, i) => (
                  <motion.div
                    key={i}
                    initial={{ width: 0 }}
                    animate={{ width: `${session.totalQuestions ? (seg.v / session.totalQuestions) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full bg-gradient-to-r ${seg.c}`}
                  />
                ))}
              </div>
            </div>

            {/* Metric Cards — colorful, semantic per stat instead of a flat gray tile */}
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { icon: CheckCircle, label: "Correct", value: correct, decimals: 0, prefix: "", color: "text-emerald-500", bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20" },
                { icon: XCircle, label: "Wrong", value: wrong, decimals: 0, prefix: "", color: "text-rose-500", bg: "bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20" },
                { icon: TrendingUp, label: "+ Marks", value: totalPositiveMarks, decimals: 1, prefix: "+", color: "text-emerald-600 dark:text-emerald-500", bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20" },
                { icon: AlertCircle, label: "- Penalty", value: totalNegativeMarks, decimals: 1, prefix: "-", color: "text-red-500 dark:text-red-400", bg: "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                >
                  <TiltCard max={8} className={`group border p-2.5 rounded-xl flex flex-col items-center justify-center text-center ${stat.bg}`}>
                    <stat.icon className={`w-4 h-4 mb-1 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6 ${stat.color}`} />
                    <span className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${stat.color}`}>{stat.label}</span>
                    <CountUpFx value={stat.value} decimals={stat.decimals} prefix={stat.prefix} className="text-base font-black text-[var(--text-primary)]" />
                  </TiltCard>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Actions Desk — outside the scrolling body so Dashboard / Retry / Review are
              always reachable no matter how tall the scoreboard content gets. */}
          <div className="shrink-0 border-t border-[var(--border-subtle)] p-4">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/")}
                className="group flex-1 px-4 py-3 bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--border-strong)] font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Dashboard</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleRetry}
                className="group flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-md shadow-amber-500/30 hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
                <span>Retry test</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/exam/results/review?id=${id}`)}
                className="group relative overflow-hidden flex-[1.5] px-6 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/30 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
                <span className="relative">Review answers</span>
                <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Question Grid / Diagnostics Breakdown (Spans 7) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="lg:col-span-7 card-glass rounded-3xl shadow-sm p-6 flex flex-col min-h-[420px] lg:h-full lg:min-h-0"
        >
          {/* Header */}
          <div className="flex-none border-b border-[var(--border-subtle)] pb-4 mb-4 flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-xs font-extrabold text-[var(--text-primary)] uppercase tracking-widest flex items-center gap-1.5">
              {rightPanelView === "grid" ? <LayoutGrid className="w-4 h-4 text-indigo-500" /> : <BarChart2 className="w-4 h-4 text-indigo-500" />}
              <span>{rightPanelView === "grid" ? "Question Grid" : "Diagnostics Breakdown"}</span>
            </h3>

            <div className="flex bg-[var(--surface-secondary)] border border-[var(--border-subtle)] rounded-xl p-0.5 text-[9px] font-black uppercase tracking-wider">
              {(["grid", "breakdown"] as const).map(view => (
                <button
                  key={view}
                  onClick={() => setRightPanelView(view)}
                  className={`relative px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${rightPanelView === view ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                >
                  {rightPanelView === view && (
                    <motion.div
                      layoutId="results-view-pill"
                      className="absolute inset-0 bg-[var(--surface)] shadow rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {view === "grid" ? "Question Grid" : "Breakdown"}
                </button>
              ))}
            </div>
          </div>

          {rightPanelView === "breakdown" && (
            <div className="flex-none mb-4 flex bg-[var(--surface-secondary)] border border-[var(--border-subtle)] rounded-xl p-0.5 text-[9px] font-black uppercase tracking-wider w-fit">
              {(["subject", "section", "difficulty", "type"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === tab ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="results-tab-pill"
                      className="absolute inset-0 bg-[var(--surface)] shadow rounded-lg -z-10"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tab}
                </button>
              ))}
            </div>
          )}

          {rightPanelView === "grid" ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar">
                <div className="grid grid-cols-8 sm:grid-cols-10 lg:grid-cols-12 gap-1.5">
                  {questionGrid.map((item, idx) => {
                    let cellClass = "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]";
                    if (item.isAttempted) {
                      cellClass = item.isCorrect
                        ? "bg-gradient-to-br from-emerald-400 to-green-600 text-white border border-transparent shadow-md shadow-emerald-500/25"
                        : "bg-gradient-to-br from-rose-400 to-red-600 text-white border border-transparent shadow-md shadow-rose-500/25";
                    }
                    return (
                      <motion.button
                        key={item.questionId + idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: Math.min(idx * 0.008, 0.3) }}
                        whileHover={{ scale: 1.12, y: -2 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => router.push(`/exam/results/review?id=${id}&q=${idx}`)}
                        className={`relative h-9 rounded-lg flex items-center justify-center font-num font-bold text-xs cursor-pointer ${cellClass}`}
                        title={`Question ${idx + 1}${item.isMarked ? " (Marked for review)" : ""}`}
                      >
                        {idx + 1}
                        {item.isMarked && (
                          <Flag className="absolute -top-1 -right-1 w-3 h-3 text-amber-500 fill-amber-500" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-none pt-4 mt-4 border-t border-[var(--border-subtle)] flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Correct</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Wrong</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)]" /> Skipped</span>
                <span className="flex items-center gap-1.5"><Flag className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> Marked</span>
              </div>
            </div>
          ) : (
          /* Matrix items list */
          <div className="flex-1 overflow-y-auto pr-1 -mr-1 custom-scrollbar space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {activeBreakdown().map((item, idx) => {
                  const itemAccuracy = item.attempted > 0 ? ((item.correct / item.attempted) * 100) : 0;
                  return (
                    <motion.div
                      key={item.label + idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(idx * 0.04, 0.3) }}
                      className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-subtle)] rounded-2xl shadow-sm hover-lift"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="font-bold text-xs text-[var(--text-primary)] truncate flex-1">{item.label}</div>
                        <div className="w-24 h-1.5 shrink-0 rounded-full bg-[var(--surface)] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${itemAccuracy}%` }}
                            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 + Math.min(idx * 0.04, 0.3) }}
                            className={`h-full rounded-full bg-gradient-to-r ${itemAccuracy >= 75 ? "from-emerald-400 to-teal-500" : itemAccuracy >= 50 ? "from-amber-400 to-orange-500" : "from-rose-400 to-red-500"}`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold">
                        <div className="bg-[var(--surface)] p-2 rounded-xl border border-[var(--border-subtle)]">
                          <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Score</div>
                          <div className="font-num text-xs text-indigo-600 dark:text-indigo-400">
                            {item.marks.toFixed(1)} <span className="text-[9px] text-[var(--text-muted)] font-normal">/ {item.max}</span>
                          </div>
                        </div>
                        <div className="bg-[var(--surface)] p-2 rounded-xl border border-[var(--border-subtle)]">
                          <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Accuracy</div>
                          <div className="font-num text-xs text-[var(--text-secondary)]">
                            {itemAccuracy.toFixed(0)}%
                          </div>
                        </div>
                        <div className="bg-[var(--surface)] p-2 rounded-xl border border-[var(--border-subtle)]">
                          <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Attempts</div>
                          <div className="font-num text-xs text-[var(--text-secondary)] flex justify-center gap-1">
                            <span className="text-emerald-500">{item.correct}</span>
                            <span className="text-[var(--text-muted)]">/</span>
                            <span className="text-rose-500">{item.wrong}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
