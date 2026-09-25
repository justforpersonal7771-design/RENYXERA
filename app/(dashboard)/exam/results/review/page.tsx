"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { ExamSession } from "@/types/exam-runtime.types";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import { MathJaxContext } from "better-react-mathjax";
import { useStudyStore } from "@/store/use-study-store";
import { Bookmark, BookmarkCheck, Sun, Moon, ArrowLeft, ArrowRight, Home, StickyNote, Activity, RefreshCw, CheckCircle2, XCircle, MinusCircle, Sparkles } from "lucide-react";
import { FullscreenToggle } from "@/components/ui/fullscreen-toggle";
import { FullscreenNavigation } from "@/components/ui/fullscreen-navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams?.get("id");
  const initialQParam = searchParams?.get("q");
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [session, setSession] = useState<ExamSession | null>(null);
  const [loading, setLoading] = useState(true);
  const { bookmarks, mistakes, addBookmark, removeBookmark, updateBookmarkNotes, updateMistakeNotes, loadStudyData } = useStudyStore();
  const [currentIndex, setCurrentIndex] = useState(() => {
    const parsed = initialQParam ? parseInt(initialQParam, 10) : 0;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  });

  useEffect(() => {
    loadStudyData();
  }, [loadStudyData]);

  // Clamp the deep-linked ?q= index once the session's real question count is known.
  useEffect(() => {
    if (!session) return;
    const maxIndex = Math.max(session.draftConfig.questions.length - 1, 0);
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [session, currentIndex]);

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

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center bg-[var(--background)]">
      <div className="font-bold tracking-widest uppercase animate-pulse text-indigo-600 dark:text-indigo-400">Loading Review Engine...</div>
    </div>
  );
  if (!session) return <div className="p-8 text-center text-rose-500 font-bold bg-[var(--background)] h-screen">Result not found.</div>;

  const draftQuestions = session.draftConfig.questions;
  const currentQRef = draftQuestions[currentIndex] || draftQuestions[0];
  const qId = currentQRef.questionId;
  const q = QuestionRepository.getQuestionById(qId);
  const currentResponse = session.responses[qId];

  const handleBookmarkToggle = async () => {
    if (!q) return;
    const isBookmarked = bookmarks.some(b => b.questionId === q.question_id);
    if (isBookmarked) {
      await removeBookmark(q.question_id);
    } else {
      await addBookmark(q.question_id, "", q.subject, q.topic, undefined, undefined, { folders: ["Review"] });
    }
  };

  const isCurrentBookmarked = bookmarks.some(b => b.questionId === q?.question_id);

  // Helper to determine correctness of any response node
  const checkCorrectness = (qIdLocal: string) => {
    let c = false;
    let a = false;
    const qLocal = QuestionRepository.getQuestionById(qIdLocal);
    const resLocal = session.responses[qIdLocal];
    if (resLocal && (resLocal.status === "ANSWERED" || resLocal.status === "MARKED_AND_ANSWERED")) {
      a = true;
      if (qLocal?.question_type === "MCQ" || qLocal?.question_type === "MSQ") {
        const correctOpts = qLocal.options.filter(o => o.is_correct).map(o => o.option_id).sort();
        const selectedOpts = [...(resLocal.selectedOptions || [])].sort();
        c = JSON.stringify(correctOpts) === JSON.stringify(selectedOpts);
      } else if (qLocal?.question_type === "NAT") {
        const val = parseFloat(resLocal.natValue || "");
        if (!isNaN(val) && qLocal.nat_answer_range) {
          c = val >= qLocal.nat_answer_range.min && val <= qLocal.nat_answer_range.max;
        }
      }
    }
    return { isAttempted: a, isCorrect: c };
  };

  const { isAttempted, isCorrect } = checkCorrectness(qId);

  const currentBookmark = bookmarks.find(b => b.questionId === qId);
  const currentMistake = mistakes.find(m => m.questionId === qId);
  const notesValue = currentBookmark?.notes || currentMistake?.notes || "";

  const handleNotesChange = async (newNotes: string) => {
    if (currentBookmark) {
      await updateBookmarkNotes(qId, newNotes);
    } else if (currentMistake) {
      await updateMistakeNotes(qId, newNotes);
    } else {
      await addBookmark(qId, newNotes, q?.subject || "", q?.topic || "", undefined, undefined, { folders: ["Review"] });
    }
  };

  const mathJaxConfig = {
    loader: { load: ["[tex]/html"] },
    tex: { packages: { "[+]": ["html"] }, inlineMath: [["\\(", "\\)"]], displayMath: [["\\[", "\\]"]] },
  };

  // Summary + "next wrong" shortcut, from the same correctness check the navigator uses.
  const reviewResults = draftQuestions.map((qr) => checkCorrectness(qr.questionId));
  const reviewSummary = {
    correct: reviewResults.filter((r) => r.isAttempted && r.isCorrect).length,
    wrong: reviewResults.filter((r) => r.isAttempted && !r.isCorrect).length,
    skipped: reviewResults.filter((r) => !r.isAttempted).length,
  };
  const nextWrongOffset = reviewResults.slice(currentIndex + 1).findIndex((r) => r.isAttempted && !r.isCorrect);
  const nextWrongIndex = nextWrongOffset === -1 ? null : currentIndex + 1 + nextWrongOffset;

  return (
    <MathJaxContext config={mathJaxConfig}>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-[var(--background)] font-sans">

        {/* COMMAND BAR — matches the exam session Topbar's structure: a compact
            always-visible essentials row, plus a details row for type/marks/difficulty
            and section/subject/topic. Logo replaces the old "GATE OS" text and, like the
            exam session's, navigates home when clicked. */}
        <header className="flex-none bg-[var(--surface)] border-b border-[var(--border)] shadow-sm shrink-0 z-30">
          <div className="flex items-center justify-between px-4 py-2 sm:px-5 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => router.push("/")}
                className="w-7 h-7 rounded-lg overflow-hidden shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                title="Back to Dashboard"
              >
                <img
                  src={resolvedTheme === "light" ? "/brand/mark-light.png" : "/brand/mark-dark.png"}
                  alt="RENYXERA"
                  className="w-full h-full object-contain"
                />
              </button>
              <span className="hidden sm:inline-block text-[10px] bg-violet-500/10 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-md font-semibold shrink-0">Review mode</span>
              {q && (
                <span className="text-[var(--text-primary)] bg-[var(--surface-secondary)] px-2 py-1 rounded-md border border-[var(--border)] font-num text-[11px] shrink-0">
                  Q<span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentIndex + 1}</span><span className="text-[var(--text-muted)] font-normal">/{draftQuestions.length}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <AnimatePresence mode="wait">
                <motion.span
                  key={qId + String(isAttempted) + String(isCorrect)}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white shadow-md ${
                    !isAttempted ? "bg-gradient-to-r from-slate-400 to-slate-500 shadow-slate-500/20"
                    : isCorrect ? "bg-gradient-to-r from-emerald-500 to-green-600 shadow-emerald-500/30"
                    : "bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/30"
                  }`}
                >
                  {!isAttempted ? <MinusCircle className="w-3.5 h-3.5" /> : isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {!isAttempted ? "Skipped" : isCorrect ? "Correct" : "Wrong"}
                </motion.span>
              </AnimatePresence>

              <div className="flex items-center gap-1 border-l border-[var(--border)] pl-2 sm:pl-3 h-8 shrink-0">
                <button
                  onClick={handleBookmarkToggle}
                  className="p-1.5 rounded-md text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  title="Bookmark Question"
                >
                  {isCurrentBookmarked ? <BookmarkCheck className="w-4 h-4 text-indigo-500" /> : <Bookmark className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="hidden sm:inline-flex p-1.5 rounded-md text-[var(--text-muted)] hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  title="Toggle Dark Mode"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => router.push(`/ai-tutor?qid=${qId}`)}
                  className="group relative overflow-hidden flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white rounded-lg shadow-md shadow-violet-500/30 cursor-pointer"
                  title="Explain this question with the AI Tutor"
                >
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
                  <Sparkles className="relative w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
                  <span className="relative hidden sm:inline">Explain with AI</span>
                </button>

                <button
                  onClick={() => router.push(`/exam/results?id=${id}`)}
                  className="px-3 sm:px-4 py-1.5 text-xs font-semibold bg-[var(--surface-secondary)] hover:border-[var(--border-strong)] text-[var(--text-primary)] rounded-lg transition border border-[var(--border)] cursor-pointer"
                >
                  Exit review
                </button>
              </div>
            </div>
          </div>

          {q && (
            <div className="flex flex-col gap-1.5 px-4 pb-2.5 sm:px-5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center rounded-md border border-[var(--border)] overflow-hidden shrink-0 divide-x divide-[var(--border)] shadow-sm text-[10px] font-black uppercase tracking-wider">
                  <span className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 px-2 py-1">
                    {q.question_type}
                  </span>
                  <span className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-1 font-num normal-case">
                    +{q.marks}/{q.question_type === "MCQ" ? `-${(q.marks / 3).toFixed(2)}` : "0"}
                  </span>
                  <span className="bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-2 py-1">
                    {q.difficulty}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                <span className="bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-400 px-2 py-1 rounded inline-block" title={q.section}>
                  {q.section || "General"}
                </span>
                <span className="bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-400 px-2 py-1 rounded inline-block" title={q.subject}>
                  {q.subject || "General"}
                </span>
                <span className="bg-slate-100 text-slate-800 dark:bg-slate-800/40 dark:text-slate-400 px-2 py-1 rounded inline-block" title={q.topic}>
                  {q.topic || "General"}
                </span>
              </div>
            </div>
          )}
        </header>

        {/* MAIN WORKSPACE */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">

          {/* Question Workspace Component */}
          <div id="review-workspace-container" className="flex-1 flex flex-col min-w-0 bg-[var(--surface)] h-full relative z-10 w-full lg:w-auto">
            {q ? (
              <>
                {/* GPU-accelerated motion page transitions */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={qId}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    style={{ willChange: "transform, opacity" }}
                    id="review-question-container"
                    className="flex-1 flex flex-col min-h-0 bg-[var(--surface)] relative"
                  >
                    <div className="absolute top-4 right-4 z-50">
                      <FullscreenToggle targetId="review-workspace-container" />
                    </div>

                    <FullscreenNavigation
                      onPrev={currentIndex > 0 ? () => setCurrentIndex(i => i - 1) : undefined}
                      onNext={currentIndex < draftQuestions.length - 1 ? () => setCurrentIndex(i => i + 1) : undefined}
                      isPrevDisabled={currentIndex === 0}
                      isNextDisabled={currentIndex === draftQuestions.length - 1}
                    />

                    {/* Question Content (Scrollable) */}
                    <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-12 custom-scrollbar pt-12 sm:pt-14">
                      <div className="text-lg md:text-xl font-medium leading-relaxed text-[var(--text-primary)] mb-8">
                        <AstNodeRenderer nodes={q.contentAst} />
                      </div>
                    </div>

                    {/* Options highlights (Sticky to bottom) */}
                    <div className="flex-none p-6 border-t border-[var(--border-subtle)] bg-[var(--surface-secondary)] shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.02)] z-10 w-full">
                      <div className="w-full">
                        {(q.question_type === "MCQ" || q.question_type === "MSQ") && (
                          <div className={`grid gap-3 ${q.options?.some(opt => opt.contentAst.some(n => n.type === 'image')) ? 'grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2'}`}>
                            {q.options?.map((o, oi) => {
                              const isActuallyCorrect = o.is_correct;
                              const isUserSelected = (currentResponse?.selectedOptions || []).includes(o.option_id);
                              let borderClass = "border-[var(--border)] bg-[var(--surface)]";
                              let badge: { text: string; cls: string; icon: typeof CheckCircle2 } | null = null;

                              if (isActuallyCorrect && isUserSelected) {
                                borderClass = "border-emerald-500 bg-emerald-500/10 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.6)]";
                                badge = { text: "Your answer · correct", cls: "bg-emerald-500 text-white", icon: CheckCircle2 };
                              } else if (isActuallyCorrect && !isUserSelected) {
                                borderClass = "border-emerald-500 border-dashed bg-emerald-500/5";
                                badge = { text: "Correct answer", cls: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", icon: CheckCircle2 };
                              } else if (!isActuallyCorrect && isUserSelected) {
                                borderClass = "border-rose-500 bg-rose-500/10 shadow-[0_8px_24px_-12px_rgba(244,63,94,0.55)]";
                                badge = { text: "Your answer", cls: "bg-rose-500 text-white", icon: XCircle };
                              }

                              return (
                                <motion.div
                                  key={o.option_id}
                                  initial={{ opacity: 0, y: 8 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.05 + oi * 0.06 }}
                                  className={`relative p-4 border-[2px] rounded-2xl ${borderClass} overflow-hidden`}
                                >
                                  <div className="flex items-start gap-3 w-full">
                                    <div className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                      isActuallyCorrect ? "bg-gradient-to-br from-emerald-400 to-green-600 text-white" : isUserSelected ? "bg-gradient-to-br from-rose-400 to-red-600 text-white" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"
                                    }`}>{o.option_id}</div>
                                    <div className="flex-1 min-w-0 text-[var(--text-primary)] max-w-full overflow-hidden break-words"><AstNodeRenderer nodes={o.contentAst} /></div>
                                  </div>
                                  {badge && (
                                    <motion.span
                                      initial={{ scale: 0.7, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{ delay: 0.25 + oi * 0.06, type: "spring", stiffness: 500, damping: 22 }}
                                      className={`mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${badge.cls}`}
                                    >
                                      <badge.icon className="w-3 h-3" /> {badge.text}
                                    </motion.span>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        )}

                        {q.question_type === "NAT" && (
                          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full">
                            <div className="flex-1 flex justify-between items-center bg-[var(--surface-secondary)] p-3 border border-[var(--border-subtle)] rounded-xl">
                              <span className="text-[10px] font-black text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest">Correct Answer Range</span>
                              <span className="font-num font-bold text-green-600 dark:text-green-400">
                                {q.nat_answer_range ? `${q.nat_answer_range.min} to ${q.nat_answer_range.max}` : "N/A"}
                              </span>
                            </div>
                            <div className={`flex-1 flex justify-between items-center bg-[var(--surface-secondary)] p-3 border rounded-xl ${isAttempted
                                ? (isCorrect
                                  ? 'border-green-500 text-green-700 dark:text-green-500'
                                  : 'border-red-500 text-red-700 dark:text-red-500')
                                : 'border-[var(--border-subtle)] text-[var(--text-secondary)]'
                              }`}>
                              <span className="text-[10px] font-black text-[var(--text-muted)] dark:text-[var(--text-muted)] uppercase tracking-widest">Your Answer</span>
                              <span className="font-num font-bold">{currentResponse?.natValue || "None"}</span>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* BOTTOM ACTION BAR */}
                <div className="flex-none px-4 py-3 sm:px-6 flex justify-between items-center gap-2 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur z-20">
                  <button
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(i => i - 1)}
                    className="group inline-flex items-center gap-1.5 px-5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--text-primary)] font-semibold rounded-xl transition disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.97] cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> <span className="hidden sm:inline">Previous</span>
                  </button>
                  {nextWrongIndex !== null && (
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setCurrentIndex(nextWrongIndex)}
                      className="group inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/25 hover:bg-rose-500/20 text-sm font-semibold transition cursor-pointer"
                      title="Jump to the next question you got wrong"
                    >
                      <XCircle className="w-4 h-4 transition-transform group-hover:rotate-90" /> Next wrong
                    </motion.button>
                  )}
                  <button
                    disabled={currentIndex === draftQuestions.length - 1}
                    onClick={() => setCurrentIndex(i => i + 1)}
                    className="group relative overflow-hidden inline-flex items-center gap-1.5 px-7 py-2.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white font-semibold text-sm rounded-xl shadow-md shadow-violet-500/30 transition active:scale-[0.97] disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
                    <span className="relative">Next</span>
                    <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-red-500 font-bold">
                Question data missing or corrupted.
              </div>
            )}
          </div>

          {/* Right Palette (Top: Navigator, Bottom: Personal Notes) */}
          <div className="w-full lg:w-[340px] flex-none border-t lg:border-t-0 lg:border-l border-[var(--border)] bg-[var(--surface)] z-20 flex flex-col h-[50vh] lg:h-full overflow-hidden divide-y divide-[var(--border)]">
            {/* Top Half: Review Navigator */}
            <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5 overflow-hidden">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-bold text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">Review navigator</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Correct", v: reviewSummary.correct, cls: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
                  { label: "Wrong", v: reviewSummary.wrong, cls: "text-rose-600 dark:text-rose-400 bg-rose-500/10" },
                  { label: "Skipped", v: reviewSummary.skipped, cls: "text-[var(--text-secondary)] bg-[var(--surface-secondary)]" },
                ].map((c) => (
                  <div key={c.label} className={`rounded-xl px-2.5 py-2 text-center ${c.cls}`}>
                    <div className="text-lg font-bold font-num leading-tight">{c.v}</div>
                    <div className="text-[10px] font-semibold">{c.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto px-1 -mx-1 py-1.5 -my-1.5 custom-scrollbar content-start">
                <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2">
                  {draftQuestions.map((qRef, idx) => {
                    const resInfo = checkCorrectness(qRef.questionId);
                    let colorClass = "bg-[var(--surface-elevated)] text-[var(--text-secondary)] border border-[var(--border)]";

                    if (resInfo.isAttempted) {
                      if (resInfo.isCorrect) {
                        colorClass = "bg-gradient-to-br from-emerald-400 to-green-600 text-white border-transparent shadow-md shadow-emerald-500/25";
                      } else {
                        colorClass = "bg-gradient-to-br from-rose-400 to-red-600 text-white border-transparent shadow-md shadow-rose-500/25";
                      }
                    }

                    const isCurrent = currentIndex === idx;

                    return (
                      <motion.button
                        key={qRef.questionId + idx}
                        onClick={() => setCurrentIndex(idx)}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: isCurrent ? 1.06 : 1 }}
                        transition={{ delay: Math.min(idx * 0.012, 0.35), type: "spring", stiffness: 400, damping: 24 }}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.93 }}
                        aria-current={isCurrent ? "step" : undefined}
                        className={`relative aspect-square w-full rounded-xl flex items-center justify-center font-num font-bold text-sm transition-colors border focus:outline-none cursor-pointer ${colorClass}`}
                      >
                        {isCurrent && (
                          <motion.span
                            layoutId="review-current"
                            aria-hidden="true"
                            className="absolute -inset-[4px] rounded-[14px] border-2 border-indigo-500 shadow-[0_0_14px_rgba(99,102,241,0.55)]"
                            transition={{ type: "spring", stiffness: 500, damping: 34 }}
                          />
                        )}
                        {idx + 1}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Half: Personal Notes */}
            <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-5">
              <div className="font-extrabold text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3 px-1 flex items-center gap-1.5 text-amber-500">
                <StickyNote className="w-3.5 h-3.5" />
                <span>Personal Notes</span>
              </div>
              <textarea
                value={notesValue}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Add personal hints, formulas, or reminders for this question... (Auto-saves on change)"
                className="w-full flex-1 p-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] resize-none text-xs leading-relaxed"
              />
            </div>
          </div>

        </div>
      </div>
    </MathJaxContext>
  );
}
