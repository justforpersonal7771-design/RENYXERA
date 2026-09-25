"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { useGoalPlan } from "@/lib/goals/use-goal-plan";
import { effectiveTargetYear } from "@/lib/goals/exam-year";
import { NumberStepper } from "@/components/ui/number-stepper";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Target, X, RotateCcw, Clock3, FileQuestion, TrendingUp, Sparkles, Check, Play, ListChecks, Search, ArrowRight } from "lucide-react";
import { CountUp, TiltCard } from "@/components/ui/interactive";
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, ReferenceLine, ReferenceDot,
} from "recharts";
import { useGoalSliderStore, GOAL_SLIDER_DEFAULT_PERCENT } from "@/store/use-goal-slider-store";
import { useDataStore } from "@/store/use-data-store";
import { useExamStore } from "@/store/use-exam-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import {
  computeTopicFrequencies, computeGoalSliderCurve, computeGoalSliderResult, filterOfficialQuestions,
  type TopicFrequency,
} from "@/lib/analytics/goal-slider-engine";

const topicKey = (t: { subject: string; topic: string }) => `${t.subject}::${t.topic}`;

function formatStudyTime(seconds: number): string {
  const hours = seconds / 3600;
  if (hours < 1) return `${Math.round(seconds / 60)}m`;
  return `${hours.toFixed(1)}h`;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 shadow-xl text-xs pointer-events-none">
      <p className="font-bold text-[var(--text-primary)] mb-1">{label} topics selected</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.stroke }} className="font-semibold">
          {p.name}: {p.value.toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

export function GoalSliderPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { isInitialized } = useDataStore();
  const { targetPercent, loaded, load, setTargetPercent, reset } = useGoalSliderStore();
  const [draftPercent, setDraftPercent] = useState(targetPercent);
  const [isDragging, setIsDragging] = useState(false);
  const draftPercentRef = useRef(draftPercent);
  const [manualOverrides, setManualOverrides] = useState<Record<string, boolean>>({});
  const [launchCount, setLaunchCount] = useState(65);
  const [isLaunching, setIsLaunching] = useState(false);
  const [topicQuery, setTopicQuery] = useState("");

  // Goals engine (4E-2): when the profile has a target rank, recommend a focus % from it.
  // The slider stays a manual override; "Apply" just moves it to the recommendation.
  const profile = useAuthStore((s) => s.profile);
  const goalRank = profile?.target_rank && profile.target_rank > 0 ? profile.target_rank : null;
  const { plan: goalPlan } = useGoalPlan({
    targetRank: goalRank,
    targetYear: effectiveTargetYear(profile?.target_year),
    dailyHours: profile?.daily_study_hours ?? 2,
  });

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (loaded) {
      setDraftPercent(targetPercent);
      draftPercentRef.current = targetPercent;
    }
  }, [loaded, targetPercent]);

  const officialQuestions = useMemo(() => {
    if (!isInitialized) return [];
    return filterOfficialQuestions(QuestionRepository.getAllQuestions());
  }, [isInitialized]);

  const ranked = useMemo(() => computeTopicFrequencies(officialQuestions), [officialQuestions]);
  const curve = useMemo(() => computeGoalSliderCurve(ranked), [ranked]);
  const result = useMemo(
    () => computeGoalSliderResult(officialQuestions, draftPercent),
    [officialQuestions, draftPercent]
  );

  const applyPercentFromLabel = (activeLabel: any) => {
    if (activeLabel == null || ranked.length === 0) return;
    const topicsSelected = Number(activeLabel);
    if (Number.isNaN(topicsSelected)) return;
    const percent = Math.min(100, Math.max(5, Math.round((topicsSelected / ranked.length) * 100)));
    setDraftPercent(percent);
    draftPercentRef.current = percent;
  };

  const handleChartMouseDown = (state: any) => {
    setIsDragging(true);
    applyPercentFromLabel(state?.activeLabel);
  };
  const handleChartMouseMove = (state: any) => {
    if (isDragging) applyPercentFromLabel(state?.activeLabel);
  };
  // Dragging/clicking the curve only previews a target; nothing is saved until the
  // learner presses "Set Focus Target" (explicit commit, easy to explore freely).
  const commitDrag = () => {
    setIsDragging(false);
  };
  const handleChartClick = (state: any) => {
    applyPercentFromLabel(state?.activeLabel);
  };

  // Catch a mouse/touch release outside the chart's own bounds so a drag never gets "stuck".
  useEffect(() => {
    if (!isDragging) return;
    window.addEventListener("mouseup", commitDrag);
    window.addEventListener("touchend", commitDrag);
    return () => {
      window.removeEventListener("mouseup", commitDrag);
      window.removeEventListener("touchend", commitDrag);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleReset = () => {
    setDraftPercent(GOAL_SLIDER_DEFAULT_PERCENT);
    draftPercentRef.current = GOAL_SLIDER_DEFAULT_PERCENT;
    setManualOverrides({});
    reset();
  };

  const handlePoint = curve[result.includedCount] ?? curve[curve.length - 1];

  // Algorithmic picks (from the current slider position) plus any manual check/uncheck the
  // student has made on top of it — this is what actually gets launched as a test.
  const includedKeySet = useMemo(
    () => new Set(result.includedTopics.map(topicKey)),
    [result.includedTopics]
  );
  const effectiveTopics = useMemo(
    () => ranked.filter((t) => manualOverrides[topicKey(t)] ?? includedKeySet.has(topicKey(t))),
    [ranked, manualOverrides, includedKeySet]
  );
  const effectiveKeySet = useMemo(() => new Set(effectiveTopics.map(topicKey)), [effectiveTopics]);

  const launchPool = useMemo(
    () => officialQuestions.filter((q) => effectiveKeySet.has(`${q.subject}::${q.topic}`)),
    [officialQuestions, effectiveKeySet]
  );

  // Stat tiles mirror whatever is actually checked (algorithmic pick + manual overrides),
  // not just the raw slider result, so they never disagree with the topic checklist below.
  const effectiveMarksCaptured = useMemo(() => {
    const totalMarks = ranked.reduce((sum, t) => sum + t.weightedMarks, 0);
    const capturedMarks = effectiveTopics.reduce((sum, t) => sum + t.weightedMarks, 0);
    return totalMarks > 0 ? (capturedMarks / totalMarks) * 100 : 0;
  }, [ranked, effectiveTopics]);

  const effectiveStudySeconds = useMemo(
    () => launchPool.reduce((sum, q) => sum + (q.marks || 1) * 108, 0),
    [launchPool]
  );

  const toggleTopic = (t: TopicFrequency) => {
    const key = topicKey(t);
    const currentlyChecked = manualOverrides[key] ?? includedKeySet.has(key);
    setManualOverrides((prev) => ({ ...prev, [key]: !currentlyChecked }));
  };

  const handleSelectAll = () => {
    const next: Record<string, boolean> = {};
    ranked.forEach((t) => { next[topicKey(t)] = true; });
    setManualOverrides(next);
  };
  const handleClearAll = () => {
    const next: Record<string, boolean> = {};
    ranked.forEach((t) => { next[topicKey(t)] = false; });
    setManualOverrides(next);
  };

  const handleLaunchTest = async () => {
    if (launchPool.length === 0 || isLaunching) return;
    setIsLaunching(true);
    try {
      const topicNames = Array.from(new Set(effectiveTopics.map((t) => t.topic)));
      useExamStore.getState().createDraft({
        examType: "CUSTOM_TEST",
        topics: topicNames,
        questionCount: Math.max(1, Math.min(launchCount, launchPool.length)),
        isAiGenerated: false,
        goalTag: {
          targetPercent: draftPercent,
          topicsCount: effectiveTopics.length,
          totalTopics: ranked.length,
          marksCaptured: effectiveMarksCaptured,
        },
      });
      const draft = useExamStore.getState().currentDraft;
      if (draft) {
        await useExamRuntimeStore.getState().startSession(draft);
        onClose();
        router.push("/exam/session");
      }
    } finally {
      setIsLaunching(false);
    }
  };

  const presets = [25, 50, 75, 100];
  const applyPercent = (p: number) => {
    setDraftPercent(p);
    draftPercentRef.current = p;
  };
  const isSaved = draftPercent === targetPercent;
  const saveTarget = async () => {
    await setTargetPercent(draftPercentRef.current);
    useToastStore.getState().show(`Focus Target set to ${draftPercentRef.current}% of the syllabus`);
  };
  const q = topicQuery.trim().toLowerCase();
  const syllabusShown = result.totalTopics > 0 ? (effectiveTopics.length / result.totalTopics) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-950/55 backdrop-blur-md"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Focus Target"
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="nav-cluster relative w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden rounded-3xl shadow-[0_40px_120px_-30px_rgba(76,29,149,0.55)]"
      >
        {/* Header: drifting glows, animated icon, big live readout */}
        <div className="relative shrink-0 overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 px-5 py-4 text-white">
          <motion.div aria-hidden="true" className="absolute -top-20 -left-16 w-64 h-64 rounded-full bg-cyan-400/25 blur-3xl" animate={{ x: [0, 40, 0], y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
          <motion.div aria-hidden="true" className="absolute -bottom-24 right-10 w-72 h-72 rounded-full bg-pink-400/25 blur-3xl" animate={{ x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <motion.div
                className="hidden sm:flex w-11 h-11 rounded-2xl bg-white/15 border border-white/20 items-center justify-center shrink-0 backdrop-blur"
                animate={{ rotate: [0, 8, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Target className="w-5 h-5" />
              </motion.div>
              <div className="min-w-0">
                <h2 className="font-bold text-lg sm:text-xl leading-tight">Focus Target</h2>
                <p className="hidden sm:block text-[11px] font-medium text-white/75">Past-paper weighted · highest-yield topics first</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Save lives in the header so it's always in reach — previewing (drag,
                  presets, "My goal") never saves by itself. */}
              {isInitialized && ranked.length > 0 && (
                <AnimatePresence mode="wait" initial={false}>
                  {isSaved ? (
                    <motion.span
                      key="saved"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-400/20 border border-emerald-300/30 text-[11px] font-semibold text-emerald-50"
                      title="This is your saved Focus Target"
                    >
                      <Check className="w-3.5 h-3.5" /> <span className="font-num">{targetPercent}%</span><span className="hidden sm:inline">&nbsp;saved</span>
                    </motion.span>
                  ) : (
                    <motion.button
                      key="set"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveTarget}
                      className="group relative overflow-hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-indigo-700 text-[11px] font-bold shadow-lg shadow-black/20 cursor-pointer"
                    >
                      <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-violet-300/60 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
                      <Target className="relative w-3.5 h-3.5" />
                      <span className="relative">Set <span className="font-num">{draftPercent}%</span><span className="hidden sm:inline"> as Focus Target</span></span>
                    </motion.button>
                  )}
                </AnimatePresence>
              )}
              <button
                onClick={onClose}
                className="group p-2 rounded-xl hover:bg-white/15 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
              </button>
            </div>
          </div>

          {isInitialized && ranked.length > 0 && (
            <div className="relative mt-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
              <div className="flex items-end gap-3 flex-wrap">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">Study</span>
                  <CountUp value={Math.round(syllabusShown)} suffix="%" duration={0.5} className="text-3xl sm:text-5xl font-bold leading-none" />
                  <span className="ml-1.5 text-sm font-medium text-white/80">of the syllabus</span>
                </div>
                <ArrowRight className="hidden sm:block w-5 h-5 text-white/60 mb-2" />
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-white/70">Covers</span>
                  <CountUp value={effectiveMarksCaptured} decimals={1} suffix="%" duration={0.5} className="text-3xl sm:text-5xl font-bold leading-none text-amber-200" />
                  <span className="ml-1.5 text-sm font-medium text-white/80">of past-paper marks</span>
                </div>
              </div>
              {/* Reset + presets, side by side */}
              <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={handleReset}
                title="Reset to the full syllabus"
                className="group flex items-center gap-1.5 h-[38px] px-3 rounded-xl text-[11px] font-semibold bg-black/15 hover:bg-white/15 border border-white/15 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:-rotate-[360deg]" /> Reset
              </button>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-black/15 border border-white/15">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => applyPercent(p)}
                    className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${draftPercent === p ? "text-indigo-700" : "text-white/85 hover:text-white"}`}
                  >
                    {draftPercent === p && (
                      <motion.span layoutId="focus-preset" className="absolute inset-0 rounded-lg bg-white shadow" transition={{ type: "spring", stiffness: 450, damping: 32 }} />
                    )}
                    <span className="relative font-num">{p}%</span>
                  </button>
                ))}
                {goalPlan?.hasTarget && goalRank && (
                  <button
                    onClick={() => applyPercent(goalPlan.recommendedPercent)}
                    title={`Recommended for AIR ${goalRank.toLocaleString()}`}
                    className={`relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${draftPercent === goalPlan.recommendedPercent ? "text-indigo-700" : "text-white/85 hover:text-white"}`}
                  >
                    {draftPercent === goalPlan.recommendedPercent && (
                      <motion.span layoutId="focus-preset" className="absolute inset-0 rounded-lg bg-white shadow" transition={{ type: "spring", stiffness: 450, damping: 32 }} />
                    )}
                    <Sparkles className="relative w-3 h-3" />
                    <span className="relative">My goal</span>
                  </button>
                )}
              </div>
              </div>
            </div>
          )}
        </div>

        {!isInitialized || ranked.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-[var(--surface)]">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}>
              <Target className="w-8 h-8 text-violet-500" />
            </motion.div>
            <p className="text-sm font-medium text-[var(--text-muted)]">Ranking topics from past papers…</p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 p-3 sm:p-4 flex flex-col lg:grid lg:grid-cols-5 gap-4 bg-[var(--surface)] overflow-y-auto lg:overflow-hidden custom-scrollbar">
            {/* Left: goal strip + chart + stats */}
            <div className="lg:col-span-3 shrink-0 lg:shrink lg:min-h-0 flex flex-col gap-3">
              {goalPlan?.hasTarget && goalRank && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="shrink-0 flex items-center gap-3 rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/5 to-transparent px-3.5 py-2.5"
                >
                  <span className="relative flex w-2.5 h-2.5 shrink-0">
                    <span className="absolute inset-0 rounded-full bg-violet-500 animate-ping opacity-60" />
                    <span className="relative w-2.5 h-2.5 rounded-full bg-violet-500" />
                  </span>
                  <p className="flex-1 min-w-0 text-xs text-[var(--text-secondary)] leading-snug">
                    Your goal <span className="font-semibold text-[var(--text-primary)]">AIR {goalRank.toLocaleString()}</span> needs about{" "}
                    <span className="font-num font-semibold text-[var(--text-primary)]">{Math.round(goalPlan.requiredMarks)}</span> marks →{" "}
                    <span className="font-num font-bold text-violet-600 dark:text-violet-300">{goalPlan.recommendedPercent}%</span> of the syllabus recommended.
                  </p>
                  {draftPercent === goalPlan.recommendedPercent ? (
                    <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"><Check className="w-3.5 h-3.5" /> Matches goal</span>
                  ) : (
                    <button
                      onClick={() => applyPercent(goalPlan.recommendedPercent)}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[11px] font-semibold shadow-md shadow-violet-500/25 cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </motion.div>
              )}

              <div className="spotlight relative rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)]/40 p-3.5 h-[330px] lg:h-auto lg:flex-1 lg:min-h-[260px] shrink-0 lg:shrink flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">Drag the curve or pick a preset, then press Set</span>
                  <span className="text-xs font-num font-bold text-violet-600 dark:text-violet-300">{result.includedCount} topics</span>
                </div>

                <div className="flex-1 min-h-[170px] select-none" style={{ cursor: isDragging ? "grabbing" : "grab" }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={curve}
                      margin={{ top: 10, right: 12, bottom: 4, left: -12 }}
                      onMouseDown={handleChartMouseDown}
                      onMouseMove={handleChartMouseMove}
                      onMouseUp={commitDrag}
                      onTouchStart={handleChartMouseDown}
                      onTouchMove={handleChartMouseMove}
                      onTouchEnd={commitDrag}
                      onClick={handleChartClick}
                    >
                      <defs>
                        <linearGradient id="focusMarksFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="focusSyllabusFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                      <XAxis dataKey="topicsSelected" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                      <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                      <ReferenceLine x={result.includedCount} stroke="#8b5cf6" strokeOpacity={0.6} strokeDasharray="4 4" />
                      <Area type="linear" dataKey="syllabusPercent" name="Syllabus Covered" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#focusSyllabusFill)" dot={false} isAnimationActive={false} />
                      <Area type="monotone" dataKey="marksPercent" name="Marks Covered" stroke="#f59e0b" strokeWidth={2.5} fill="url(#focusMarksFill)" dot={false} isAnimationActive={false} />
                      <ReferenceDot x={handlePoint.topicsSelected} y={handlePoint.syllabusPercent} r={5} fill="#8b5cf6" stroke="var(--surface)" strokeWidth={2} />
                      <ReferenceDot
                        x={handlePoint.topicsSelected}
                        y={handlePoint.marksPercent}
                        r={7}
                        shape={(props: any) => (
                          <g>
                            <circle cx={props.cx} cy={props.cy} r={14} fill="#f59e0b" className="focus-handle-pulse" />
                            <circle cx={props.cx} cy={props.cy} r={7} fill="#f59e0b" stroke="var(--surface)" strokeWidth={2.5} style={{ filter: "drop-shadow(0 0 6px rgba(245,158,11,0.8))" }} />
                          </g>
                        )}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-2.5">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Marks covered
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-violet-600 dark:text-violet-300">
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Syllabus covered
                    </span>
                  </div>
                </div>
              </div>

              {/* Stat tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0">
                <StatTile icon={Target} label="Topics selected" value={effectiveTopics.length} suffix={`/${result.totalTopics}`} color="violet" />
                <StatTile icon={TrendingUp} label="Marks covered" value={effectiveMarksCaptured} decimals={1} suffix="%" color="amber" />
                <StatTile icon={FileQuestion} label="PYQ questions" value={launchPool.length} suffix={`/${result.totalPyqQuestions}`} color="sky" />
                <StatTile icon={Clock3} label="Est. study time" value={Math.round(effectiveStudySeconds / 3600)} suffix="h" color="emerald" />
              </div>
            </div>

            {/* Right: topic checklist + launch */}
            <div className="lg:col-span-2 shrink-0 lg:shrink h-[560px] lg:h-auto lg:min-h-0 flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)]/30 overflow-hidden">
              <div className="shrink-0 px-4 pt-3 pb-2.5 border-b border-[var(--border-subtle)] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">
                    Topics <span className="font-num text-[var(--text-muted)] font-semibold">{effectiveTopics.length}/{ranked.length}</span>
                  </h3>
                  <div className="flex items-center gap-1">
                    <button onClick={handleSelectAll} className="px-2 py-1 rounded-lg text-[11px] font-semibold text-violet-600 dark:text-violet-300 hover:bg-violet-500/10 cursor-pointer transition-colors">All</button>
                    <button onClick={handleClearAll} className="px-2 py-1 rounded-lg text-[11px] font-semibold text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] cursor-pointer transition-colors">None</button>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <input
                    value={topicQuery}
                    onChange={(e) => setTopicQuery(e.target.value)}
                    placeholder="Search topics or subjects…"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                  />
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-2.5 space-y-1">
                {ranked.map((t, i) => {
                  const key = topicKey(t);
                  if (q && !t.topic.toLowerCase().includes(q) && !t.subject.toLowerCase().includes(q)) return null;
                  const checked = manualOverrides[key] ?? includedKeySet.has(key);
                  const medal = i === 0 ? "from-amber-300 to-amber-500 text-amber-950" : i === 1 ? "from-slate-200 to-slate-400 text-slate-800" : i === 2 ? "from-orange-300 to-orange-600 text-orange-950" : "";
                  const maxShare = ranked[0]?.marksShare || 1;
                  return (
                    <div key={key}>
                      {!q && i === result.includedCount && i > 0 && (
                        <div className="flex items-center gap-2 py-1.5 px-1" aria-hidden="true">
                          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
                          <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-violet-500">Focus cutoff</span>
                          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />
                        </div>
                      )}
                      <motion.button
                        layout="position"
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleTopic(t)}
                        aria-pressed={checked}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left cursor-pointer transition-colors ${
                          checked
                            ? "bg-[var(--surface)] border-[var(--border)] hover:border-violet-400/50"
                            : "bg-transparent border-transparent opacity-55 hover:opacity-90"
                        }`}
                      >
                        <span className={`w-[18px] h-[18px] rounded-md shrink-0 flex items-center justify-center border transition-colors ${checked ? "bg-gradient-to-br from-violet-500 to-fuchsia-600 border-transparent" : "border-[var(--border-strong)]"}`}>
                          <AnimatePresence>
                            {checked && (
                              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", stiffness: 600, damping: 22 }}>
                                <Check className="w-3 h-3 text-white" strokeWidth={3} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        <span className={`w-6 h-6 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-num font-bold ${medal ? `bg-gradient-to-br ${medal} shadow-sm` : "bg-[var(--surface-secondary)] text-[var(--text-muted)]"}`}>
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{t.topic}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] text-[var(--text-muted)] font-medium truncate">{t.subject}</p>
                            <span className="ml-auto h-1 w-12 shrink-0 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
                              <span className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${(t.marksShare / maxShare) * 100}%` }} />
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-num font-bold text-amber-600 dark:text-amber-400 shrink-0 w-10 text-right">
                          {t.marksShare.toFixed(1)}%
                        </span>
                      </motion.button>
                    </div>
                  );
                })}
              </div>

              {/* Launch */}
              <div className="shrink-0 p-3 border-t border-[var(--border-subtle)] bg-[var(--surface)]/70 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                    <ListChecks className="w-3.5 h-3.5" /> Questions
                  </label>
                  <NumberStepper
                    size="sm"
                    className="w-32"
                    ariaLabel="Questions to launch"
                    min={1}
                    max={Math.max(1, launchPool.length)}
                    value={Math.min(launchCount, Math.max(1, launchPool.length))}
                    onChange={(v) => setLaunchCount(Math.max(1, v))}
                  />
                  <span className="text-[10px] text-[var(--text-muted)] font-medium whitespace-nowrap">of {launchPool.length}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLaunchTest}
                  disabled={launchPool.length === 0 || isLaunching}
                  className="group relative overflow-hidden w-full flex items-center justify-center gap-2 h-11 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/30 cursor-pointer"
                >
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
                  {isLaunching ? (
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} className="relative">
                      <RotateCcw className="w-4 h-4" />
                    </motion.span>
                  ) : (
                    <Play className="relative w-4 h-4 fill-white" />
                  )}
                  <span className="relative">{isLaunching ? "Building your test…" : "Launch test from selection"}</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function StatTile({ icon: Icon, label, value, suffix = "", decimals = 0, color }: {
  icon: any; label: string; value: number; suffix?: string; decimals?: number; color: "violet" | "amber" | "sky" | "emerald";
}) {
  const colorMap = {
    violet: { badge: "text-violet-500 bg-violet-500/10", glow: "bg-violet-500" },
    amber: { badge: "text-amber-600 dark:text-amber-400 bg-amber-500/10", glow: "bg-amber-500" },
    sky: { badge: "text-sky-500 bg-sky-500/10", glow: "bg-sky-500" },
    emerald: { badge: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10", glow: "bg-emerald-500" },
  }[color];
  return (
    <TiltCard max={6} className="relative overflow-hidden p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)]/40 group">
      <span className={`absolute -top-8 -right-8 w-20 h-20 rounded-full blur-2xl opacity-10 group-hover:opacity-30 transition-opacity ${colorMap.glow}`} />
      <div className={`relative w-7 h-7 rounded-lg flex items-center justify-center mb-2 transition-transform group-hover:scale-110 group-hover:-rotate-6 ${colorMap.badge}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <p className="relative flex items-baseline gap-0.5 text-lg font-bold text-[var(--text-primary)] leading-tight whitespace-nowrap">
        <CountUp value={value} decimals={decimals} duration={0.5} />
        <span className="font-num text-sm font-semibold text-[var(--text-secondary)]">{suffix}</span>
      </p>
      <p className="relative text-[10px] font-semibold text-[var(--text-muted)]">{label}</p>
    </TiltCard>
  );
}
