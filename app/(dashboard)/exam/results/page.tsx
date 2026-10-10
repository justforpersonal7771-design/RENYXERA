"use client";

import { TelegramJoinCard, TelegramJoinLink } from "@/components/growth/telegram-join";
import { InviteNudge } from "@/components/growth/invite-nudge";
import { ShareResultButton } from "@/components/share/share-result-button";
import { SmartUpgrade } from "@/components/growth/smart-upgrade";
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
  XCircle, ArrowRight, Home, RefreshCw, BarChart2, ListFilter, HelpCircle, Sparkles, TrendingUp, LayoutGrid, Flag, FlipHorizontal2,
  Swords,
} from "lucide-react";
import { GoalTagBadge } from "@/components/ui/goal-tag-badge";

import { isResponseCorrect } from "@/lib/grading";
import { hasAnswer, useAnswerKeysVersion } from "@/lib/repository/answer-keys";
import { useDataStore } from "@/store/use-data-store";
import { AnswersPendingBanner } from "@/components/exam/answers-pending-banner";
import { paperLabel } from "@/lib/branch/current";
import { useMockResultsGate, MockResultsLocked } from "@/components/exam/mock-results-gate";
import { challengeUrl } from "@/lib/growth/challenge";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { track } from "@/lib/growth/track";
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
  const [flipped, setFlipped] = useState(false);
  const answersVersion = useAnswerKeysVersion((s) => s.version);
  // Direct loads / refreshes: the question bank loads asynchronously — never read it early.
  const repoReady = useDataStore((s) => s.isInitialized);
  const repoError = useDataStore((s) => s.error);

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

  // All-India mock: hidden until the results time, then unlocks itself.
  const gate = useMockResultsGate(session);
  useEffect(() => { if (gate.released) setSession(gate.released); }, [gate.released]);

  const statsCalculations = useMemo(() => {
    if (!session || !repoReady) return null;

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

        // Answer still locked (submitted offline): neither right nor wrong yet — it
        // mustn't be scored as a mistake or penalised. The banner explains the gap.
        if (!hasAnswer(q.question_id, q)) return;

        let isCorrect = false;
        isCorrect = isResponseCorrect(q, res!.selectedOptions, res!.natValue);

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
  }, [session, answersVersion, repoReady]);

  const questionGrid = useMemo(() => {
    if (!session || !repoReady) return [];
    return session.draftConfig.questions.map((qRef, idx) => {
      const q = QuestionRepository.getQuestionById(qRef.questionId);
      const res = session.responses[qRef.questionId];
      const isMarked = res?.status === "MARKED" || res?.status === "MARKED_AND_ANSWERED";
      const isAttempted = !!res && (res.status === "ANSWERED" || res.status === "MARKED_AND_ANSWERED");

      let isCorrect = false;
      const isPending = isAttempted && !!q && !hasAnswer(q.question_id, q);
      if (isAttempted && q && !isPending) {
        isCorrect = isResponseCorrect(q, res!.selectedOptions, res!.natValue);
      }

      return {
        index: idx,
        questionId: qRef.questionId,
        isAttempted,
        isCorrect,
        isPending,
        isMarked,
      };
    });
  }, [session, answersVersion, repoReady]);

  const handleRetry = async () => {
    if (!session) return;
    const { startSession } = useExamRuntimeStore.getState();
    await startSession({
      ...session.draftConfig,
      id: crypto.randomUUID()
    });
    router.push("/exam/session");
  };

  if (session && !repoReady && repoError) return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-[var(--background)] p-6 text-center">
      <p className="font-bold text-[var(--text-primary)]">Couldn't load the question bank.</p>
      <p className="text-sm text-[var(--text-secondary)]">Your test is saved. Check your connection and try again.</p>
      <button onClick={() => window.location.reload()} className="mt-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white cursor-pointer">Try again</button>
    </div>
  );
  if (loading || (session && !repoReady)) return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--background)]">
       <div className="font-bold tracking-widest uppercase animate-pulse text-indigo-600 dark:text-indigo-400">Loading Result Summary...</div>
    </div>
  );
  
  if (session && (gate.locked || gate.delayed)) return <MockResultsLocked resultsAt={gate.resultsAt} now={gate.now} mockId={gate.mockId} delayed={gate.delayed} />;
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

  // The headline and message follow what actually happened in this attempt, not just the accuracy band.
  const totalQs = session.totalQuestions;
  const skipped = Math.max(0, totalQs - totalAttempted);
  const attemptShare = totalQs ? totalAttempted / totalQs : 0;
  const verdict = ((): { label: string; message: string } => {
    if (totalAttempted === 0) return { label: "Nothing attempted", message: `All ${totalQs} questions were left blank. Even a guess on the ones you half-know is better practice than a skip.` };
    if (attemptShare < 0.4) return { label: "Only a start", message: `You attempted ${totalAttempted} of ${totalQs} (${skipped} skipped). Finish more of each paper to see where you really stand.` };
    if (accuracy >= 80) return { label: "Outstanding Performance!", message: `${correct} of ${totalAttempted} attempted were right${skipped ? `, with ${skipped} left blank` : ""}. Keep this momentum going.` };
    if (accuracy >= 60) return { label: "Solid Effort", message: `${correct} correct and ${wrong} wrong. Review those ${wrong} to close the gap to excellent.` };
    if (accuracy >= 40) return { label: "Room to Grow", message: `${wrong} wrong answers cost ${Math.round(totalNegativeMarks * 100) / 100} marks in penalties. Revise the weakest topics in the breakdown.` };
    return { label: "Keep Practicing", message: wrong > correct * 2 ? `${wrong} of ${totalAttempted} attempts were wrong. Slow down on questions you aren't sure about and revisit the fundamentals.` : "Every attempt builds understanding. Review the breakdown and revisit the fundamentals." };
  })();

  // "Beat my score": if this attempt came from a friend's challenge, say how it compares; otherwise offer to challenge a friend.
  const ch = (session.draftConfig.config as { challenge?: { score: number; max: number; by: string } }).challenge;
  const myMarks = Math.round(marks * 100) / 100;
  const challengeLine = ch ? (myMarks > ch.score ? `You beat ${ch.by}'s ${ch.score}/${ch.max} with ${myMarks}.` : myMarks === ch.score ? `You matched ${ch.by}'s ${ch.score}/${ch.max}.` : `${ch.by} scored ${ch.score}/${ch.max}. You got ${myMarks}. Try again?`) : null;
  const shareChallenge = async () => {
    const url = challengeUrl(window.location.origin, { ids: session.draftConfig.questions.map((q) => q.questionId), score: marks, max: maxPossibleMarks, by: useAuthStore.getState().profile?.display_name || "A friend", title: String((session.draftConfig.config as { title?: string }).title ?? "Practice set") });
    const text = `I scored ${myMarks}/${maxPossibleMarks} on this set. Can you beat it?`;
    try {
      if (navigator.share) await navigator.share({ title: "Beat my score", text, url });
      else { await navigator.clipboard.writeText(`${text} ${url}`); useToastStore.getState().show("Challenge link copied. Paste it to your friend.", "success"); }
      track("invite_shared", null, "challenge");
    } catch { /* cancelled */ }
  };
  const renderActions = (cls: string) => (
            <div className={cls}>
              <ShareResultButton className="h-auto py-3 [@media(max-height:860px)]:py-2.5"
                title={String((session.draftConfig.config as { title?: string }).title ?? ((session.draftConfig.config as { yearShift?: string }).yearShift ? `GATE ${paperLabel()} ${(session.draftConfig.config as { yearShift?: string }).yearShift} paper` : "Practice test"))}
                subtitle="Practice test"
                stats={[{ label: "Marks", value: `${Math.round(marks * 100) / 100} / ${maxPossibleMarks}` }, { label: "Accuracy", value: `${Math.round(accuracy)}%` }, { label: "Correct", value: String(correct) }, { label: "Attempted", value: `${totalAttempted}` }]} />
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/")}
                className="group flex-1 px-4 py-3 [@media(max-height:860px)]:py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--border-strong)] font-semibold rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                <span>Dashboard</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleRetry}
                className="group flex-1 px-4 py-3 [@media(max-height:860px)]:py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl shadow-md shadow-amber-500/30 hover:brightness-110 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <RefreshCw className="w-4 h-4 transition-transform duration-500 group-hover:rotate-180" />
                <span className="whitespace-nowrap">Retry test</span>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/exam/results/review?id=${id}`)}
                className="group relative overflow-hidden flex-[1.5] px-3 sm:px-6 py-3 [@media(max-height:860px)]:py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/30 transition flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
                <span className="relative whitespace-nowrap">Review answers</span>
                <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </div>
  );

  const gridView = (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="grid-snap flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <div className="grid grid-cols-[repeat(auto-fill,minmax(52px,1fr))] gap-2.5 p-1.5">
                  {questionGrid.map((item, idx) => {
                    let cellClass = "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)]";
                    if (item.isPending) {
                      cellClass = "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-dashed border-amber-500/50";
                    } else if (item.isAttempted) {
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
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => router.push(`/exam/results/review?id=${id}&q=${idx}`)}
                        className={`relative h-12 rounded-xl flex items-center justify-center font-num font-bold text-sm cursor-pointer ${cellClass}`}
                        title={`Question ${idx + 1}${item.isMarked ? " (Marked for review)" : ""}`}
                      >
                        {idx + 1}
                        {item.isMarked && (
                          <Flag className="absolute top-1 right-1 w-3 h-3 text-amber-300 fill-amber-300" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex-none pt-4 mt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Correct</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Wrong</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[var(--surface-secondary)] border border-[var(--border)]" /> Skipped</span>
                <span className="flex items-center gap-1.5"><Flag className="w-2.5 h-2.5 text-amber-500 fill-amber-500" /> Marked</span>
                {questionGrid.some((g) => g.isPending) && (
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-dashed border-amber-500" /> Pending</span>
                )}
              </div>
            </div>
  );

  return (
    <div className="w-full mx-auto font-sans flex flex-col h-full min-h-0 pb-4" data-fill-height="always">
      <AnswersPendingBanner session={session} onGraded={setSession} />

      {/* One card, one surface. Front: ring + score summary. Back: question grid + breakdown.
          The faces stay mounted and the card turns in CSS 3D, so flipping is smooth both ways. */}
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex-1 min-h-0 mt-7"
      >
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-label={flipped ? "Show scoreboard" : "Show question grid and breakdown"}
          className="group absolute -top-[18px] right-6 sm:right-10 z-30 flex items-center gap-2 h-9 rounded-full pl-2.5 pr-2.5 sm:pr-4 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-[length:200%_100%] bg-left hover:bg-right ring-4 ring-[var(--background)] shadow-lg shadow-violet-500/40 transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-500/50 active:scale-95 cursor-pointer [perspective:200px]"
        >
          <span className="grid place-items-center w-6 h-6 rounded-full bg-white/20">
            <FlipHorizontal2 className={`w-3.5 h-3.5 transition-transform duration-700 ${flipped ? "[transform:rotateY(180deg)]" : ""} group-hover:scale-110`} />
          </span>
          <span className="hidden sm:inline">{flipped ? "Scoreboard" : "Question grid & breakdown"}</span>
        </button>

        <div className="relative h-full flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] shadow-[0_20px_60px_-30px_rgba(91,33,182,0.45)] bg-gradient-to-br from-indigo-50 via-[var(--surface)] to-fuchsia-50 dark:from-indigo-950/50 dark:via-[var(--surface)] dark:to-fuchsia-950/40">
          {/* living background shared by both faces */}
          <motion.div aria-hidden="true" animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-[radial-gradient(circle,rgb(99_102_241/0.16),transparent_65%)] pointer-events-none" />
          <motion.div aria-hidden="true" animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-48 -right-24 w-[38rem] h-[38rem] rounded-full bg-[radial-gradient(circle,rgb(217_70_239/0.13),transparent_65%)] pointer-events-none" />
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12] pointer-events-none [background-image:radial-gradient(rgb(139_92_246/0.25)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

          <div className="relative flex-1 min-h-0 [perspective:2200px]">
            <div
              className="relative h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] will-change-transform"
              style={{ transform: `rotateY(${flipped ? 180 : 0}deg)` }}
            >
              {/* FRONT — scoreboard */}
              <div aria-hidden={flipped} className={`absolute inset-0 overflow-hidden [backface-visibility:hidden] ${flipped ? "pointer-events-none" : ""}`}>
                <div className="h-full grid grid-rows-[auto_1fr] lg:grid-rows-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-3 lg:gap-12 px-5 sm:px-8 lg:px-16 pt-7 pb-2 lg:py-8">
                  {/* ring side */}
                  <div className="flex flex-col items-center text-center gap-2.5 lg:gap-4">
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                      <motion.span initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="relative overflow-hidden inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-violet-700 dark:text-violet-300 bg-violet-500/10 ring-1 ring-violet-500/20 px-3 py-1 rounded-full">
                        <Sparkles className="w-3 h-3" /> Evaluation complete
                        <span aria-hidden="true" className="absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />
                      </motion.span>
                      {session.draftConfig.config.goalTag && <GoalTagBadge tag={session.draftConfig.config.goalTag} />}
                    </div>
              <motion.div
                className="relative w-36 h-36 sm:w-48 sm:h-48 lg:w-[min(46vh,24rem)] lg:h-[min(46vh,24rem)] [@media(max-height:760px)]:w-32 [@media(max-height:760px)]:h-32 shrink-0 cursor-default"
                initial={{ scale: 0.86, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.04 }}
              >
                {/* breathing glow */}
                <motion.div
                  className="absolute inset-2 rounded-full bg-[radial-gradient(circle,rgb(139_92_246/0.28),transparent_70%)] pointer-events-none"
                  animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.92, 1.06, 0.92] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                {/* counter-rotating dashed halo */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-dashed border-violet-400/40 pointer-events-none"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                />

                <svg className="w-full h-full -rotate-90 relative" viewBox="0 0 128 128">
                  <defs>
                    <linearGradient id="accArc" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d946ef" />
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

                  <circle cx="64" cy="64" r={radius} strokeWidth="9" className="stroke-violet-500/15 fill-none" />
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
                      className="fill-violet-600 dark:fill-violet-300"
                      animate={{ opacity: [1, 0.45, 1], r: [5, 6.5, 5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.g>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl sm:text-5xl lg:text-7xl [@media(max-height:760px)]:text-3xl font-black font-num leading-none bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-indigo-300 dark:via-violet-300 dark:to-fuchsia-300 bg-clip-text text-transparent">
                    <CountUp value={accuracy} decimals={0} />%
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600 dark:text-violet-300 mt-1.5 lg:mt-3 lg:text-xs">Accuracy</span>
                </div>
              </motion.div>
                    <div>
                      <motion.h1 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="inline-flex items-center gap-2 text-lg sm:text-xl lg:text-3xl font-black tracking-tight text-[var(--text-primary)]">
                        <Award className="w-5 h-5 lg:w-7 lg:h-7 text-amber-500" />{verdict.label}
                      </motion.h1>
                      <p className="hidden sm:block text-[var(--text-secondary)] text-xs lg:text-sm font-medium max-w-sm mx-auto mt-1">{challengeLine ?? verdict.message}</p>
                    </div>
                  </div>

                  {/* summary side */}
                  <div className="w-full max-w-2xl mx-auto self-stretch lg:self-center flex flex-col justify-evenly lg:justify-center gap-3 lg:gap-7 min-h-0">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: Target, label: `of ${maxPossibleMarks} marks`, node: <CountUp value={marks} decimals={2} />, tint: "from-indigo-500 to-violet-600" },
                        { icon: Clock, label: "time taken", node: <>{m}m {s}s</>, tint: "from-fuchsia-500 to-pink-600" },
                      ].map((t, i) => (
                        <motion.div key={t.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                          className="group flex items-center gap-3 rounded-2xl bg-[var(--surface)]/70 ring-1 ring-[var(--border)] px-3 py-2.5 lg:px-5 lg:py-4 transition-all duration-300 hover:ring-violet-500/40 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5">
                          <span className={`grid place-items-center w-9 h-9 lg:w-11 lg:h-11 shrink-0 rounded-xl bg-gradient-to-br ${t.tint} text-white shadow-md transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`}><t.icon className="w-4 h-4 lg:w-5 lg:h-5" /></span>
                          <span className="min-w-0">
                            <span className="block text-xl lg:text-3xl font-black font-num leading-none text-[var(--text-primary)]">{t.node}</span>
                            <span className="block mt-1 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{t.label}</span>
                          </span>
                        </motion.div>
                      ))}
                    </div>
            <div className="hidden sm:block [@media(min-height:800px)]:block">
              <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest block mb-1">Attempted vs Skipped</span>
              <div className="grid grid-cols-2 gap-4 [@media(max-height:760px)]:hidden">
                <div>
                  <span className="text-2xl lg:text-3xl font-black text-[var(--text-primary)] font-num">{totalAttempted}</span>
                  <span className="text-sm font-bold text-[var(--text-muted)] font-num"> / {session.totalQuestions}</span>
                  <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Attempted</p>
                </div>
                <div>
                  <span className="text-2xl lg:text-3xl font-black text-[var(--text-primary)] font-num">{session.totalQuestions - totalAttempted}</span>
                  <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Skipped</p>
                </div>
              </div>
              {/* correct / wrong / skipped as one split bar */}
              <div className="mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-violet-500/10">
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
              <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px] shadow-emerald-500/60" />{correct} correct</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px] shadow-rose-500/60" />{wrong} wrong</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" />{session.totalQuestions - totalAttempted} skipped</span>
              </div>
            </div>

            {/* Metric Cards — colorful, semantic per stat instead of a flat gray tile */}
            <div className="grid grid-cols-4 gap-2.5">
              {[
                { icon: CheckCircle, label: "Correct", value: correct, decimals: 0, prefix: "", color: "text-emerald-500", bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20" },
                { icon: XCircle, label: "Wrong", value: wrong, decimals: 0, prefix: "", color: "text-rose-500", bg: "bg-gradient-to-br from-rose-500/10 to-rose-500/5 border-rose-500/20" },
                { icon: TrendingUp, label: "Marks", value: totalPositiveMarks, decimals: 1, prefix: "+", color: "text-emerald-600 dark:text-emerald-500", bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20" },
                { icon: AlertCircle, label: "Penalty", value: totalNegativeMarks, decimals: 1, prefix: "-", color: "text-red-500 dark:text-red-400", bg: "bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20" },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                >
                  <TiltCard max={8} className={`group border p-2.5 lg:p-4 rounded-xl lg:rounded-2xl transition-shadow duration-300 hover:shadow-lg flex flex-col items-center justify-center text-center ${stat.bg}`}>
                    <span className="hidden [@media(min-height:761px)]:grid sm:grid mb-1.5 lg:mb-2 place-items-center w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-[var(--surface)] shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"><stat.icon className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:-rotate-12 ${stat.color}`} /></span>
                    <span className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${stat.color}`}>{stat.label}</span>
                    <CountUpFx value={stat.value} decimals={stat.decimals} prefix={stat.prefix} className="text-base lg:text-2xl font-black text-[var(--text-primary)]" />
                  </TiltCard>
                </motion.div>
              ))}
            </div>
            {!ch && (
              <button type="button" onClick={shareChallenge} className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-violet-500/30 px-3 py-1 text-[11px] font-bold text-violet-700 dark:text-violet-300 hover:bg-violet-500/10 cursor-pointer"><Swords className="h-3 w-3" aria-hidden /> Challenge a friend to beat {myMarks}/{maxPossibleMarks}</button>
            )}

                  </div>
                </div>
              </div>

              {/* BACK — question grid + breakdown */}
              <div aria-hidden={!flipped} className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col px-4 sm:px-8 pt-8 pb-2 ${flipped ? "" : "pointer-events-none"}`}>
          {/* Header */}
          <div className="flex-none border-b border-[var(--border-subtle)] pb-4 mb-4 flex items-center justify-between gap-4 flex-wrap">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              {rightPanelView === "grid" ? <LayoutGrid className="w-4 h-4 text-indigo-500" /> : <BarChart2 className="w-4 h-4 text-indigo-500" />}
              <span>{rightPanelView === "grid" ? "Question Grid" : "Diagnostics Breakdown"}</span>
            </h3>

            <div className="flex bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl p-1 text-xs font-semibold">
              {(["grid", "breakdown"] as const).map(view => (
                <button
                  key={view}
                  onClick={() => setRightPanelView(view)}
                  className={`relative px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${rightPanelView === view ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  {rightPanelView === view && (
                    <motion.div
                      layoutId="results-view-pill"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-violet-500/30 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{view === "grid" ? "Question grid" : "Breakdown"}</span>
                </button>
              ))}
            </div>
          </div>

          {rightPanelView === "breakdown" && (
            <div className="flex-none mb-4 flex bg-[var(--surface-secondary)] border border-[var(--border)] rounded-xl p-1 text-xs font-semibold capitalize w-fit max-w-full overflow-x-auto">
              {(["subject", "section", "difficulty", "type"] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${activeTab === tab ? 'text-white' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="results-tab-pill"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-violet-500/30 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{tab[0].toUpperCase() + tab.slice(1)}</span>
                </button>
              ))}
            </div>
          )}

          {rightPanelView === "grid" ? (
            gridView
          ) : (
          /* Matrix items list */
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 -mr-1 custom-scrollbar space-y-4">
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
                        <div className="font-bold text-sm text-[var(--text-primary)] truncate flex-1">{item.label}</div>
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
                          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Score</div>
                          <div className="font-num text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {item.marks.toFixed(1)} <span className="text-[9px] text-[var(--text-muted)] font-normal">/ {item.max}</span>
                          </div>
                        </div>
                        <div className="bg-[var(--surface)] p-2 rounded-xl border border-[var(--border-subtle)]">
                          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Accuracy</div>
                          <div className="font-num text-sm font-bold text-[var(--text-secondary)]">
                            {itemAccuracy.toFixed(0)}%
                          </div>
                        </div>
                        <div className="bg-[var(--surface)] p-2 rounded-xl border border-[var(--border-subtle)]">
                          <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-0.5">Attempts</div>
                          <div className="font-num text-sm font-bold text-[var(--text-secondary)] flex justify-center gap-1">
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
              </div>
            </div>
          </div>

          {/* Actions — same place on both faces */}
          <div className="relative shrink-0 px-4 pb-4 pt-2 sm:px-8 [@media(max-height:760px)]:pb-3">
            {renderActions("grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:max-w-4xl sm:mx-auto")}
            <SmartUpgrade context="results" fallback={<InviteNudge accuracy={accuracy} fallback={<TelegramJoinLink where="results" compact className="mt-2" />} />} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
