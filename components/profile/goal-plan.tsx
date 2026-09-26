"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Compass, CheckCircle2, AlertTriangle, Target, Clock, ListChecks, Crosshair, Sparkles } from "lucide-react";
import { useGoalPlan } from "@/lib/goals/use-goal-plan";
import { useGoalSliderStore } from "@/store/use-goal-slider-store";
import { CountUp, RadialGauge, InfoTip } from "@/components/ui/interactive";
import { useToastStore } from "@/store/use-toast-store";
import { CALIBRATION_LABEL, gateScore, marksBandForRank, qualifyingMarks } from "@/lib/calibration";

/**
 * Profile "Goal plan" (master plan 4E-2): what the learner's target rank, year and daily
 * hours actually mean, recomputed live as they edit those fields. The recommended
 * Focus Target % is a recommendation with a manual override — applying it is one click,
 * and the Focus Target panel still lets them change it.
 */
export function GoalPlan({ targetRank, targetYear, dailyHours }: { targetRank: number | null; targetYear: number; dailyHours: number }) {
  const { plan } = useGoalPlan({ targetRank, targetYear, dailyHours });
  const { targetPercent, setTargetPercent, load } = useGoalSliderStore();
  useEffect(() => { load(); }, [load]);

  const applied = plan?.hasTarget && plan.recommendedPercent === targetPercent;
  const hoursPct = plan ? Math.min(100, (plan.hoursAvailable / Math.max(1, plan.hoursNeeded)) * 100) : 0;

  return (
    <div className="card-glass rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-violet-500/10 text-violet-500">
          <Compass className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-[var(--text-primary)] leading-tight">Your goal plan</h2>
          <p className="text-xs text-[var(--text-secondary)]">Updates live as you change your exam goals.</p>
        </div>
      </div>

      {!plan ? (
        <div className="space-y-3" aria-busy="true">
          <div className="skeleton-shimmer h-24 rounded-2xl" />
          <div className="skeleton-shimmer h-16 rounded-2xl" />
        </div>
      ) : !plan.hasTarget ? (
        <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] p-5 text-center">
          <Target className="w-8 h-8 mx-auto text-violet-500/70 mb-2" />
          <p className="text-sm font-semibold text-[var(--text-primary)]">Set a target rank to get your plan</p>
          <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
            We&apos;ll work out the marks you need, which topics to focus on, and whether your daily hours are enough.
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-3">
            <span className="font-num font-semibold text-[var(--text-primary)]">{plan.daysLeft}</span> days to GATE {targetYear} ·{" "}
            <span className="font-num font-semibold text-[var(--text-primary)]">{plan.dailyQuestions}</span> questions a day at your pace
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {/* Headline: marks needed + recommended focus */}
          <div className="flex items-center gap-4 rounded-2xl bg-[var(--surface-secondary)]/60 p-4">
            <RadialGauge value={plan.recommendedPercent} size={78} stroke={7} from="#8b5cf6" to="#ec4899" className="text-[var(--text-primary)] shrink-0">
              <div className="text-center leading-none">
                <CountUp value={plan.recommendedPercent} suffix="%" className="text-base font-bold text-[var(--text-primary)]" />
                <span className="block text-[8px] font-semibold uppercase tracking-wider text-[var(--text-muted)] mt-0.5">focus</span>
              </div>
            </RadialGauge>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)] flex items-center gap-1">
                AIR <span className="font-num">{targetRank?.toLocaleString()}</span> needs about
                <InfoTip align="right">
                  Median of published results ({CALIBRATION_LABEL}, general category). The range shows how much sources and years disagree — real cut-offs move with paper difficulty.
                </InfoTip>
              </p>
              <p className="text-2xl font-bold text-[var(--text-primary)] leading-tight">
                <CountUp value={plan.requiredMarks} decimals={0} /> <span className="text-sm font-semibold text-[var(--text-secondary)]">/ 100 marks</span>
              </p>
              {targetRank && (() => {
                const band = marksBandForRank(targetRank);
                return (
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    Range <span className="font-num font-semibold text-[var(--text-secondary)]">{Math.round(band.low)}–{Math.round(band.high)}</span> marks · GATE score ≈ <span className="font-num font-semibold text-[var(--text-secondary)]">{gateScore(plan.requiredMarks)}</span> · qualifying {qualifyingMarks()}
                  </p>
                );
              })()}
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Cover the top <span className="font-num font-semibold text-[var(--text-secondary)]">{plan.includedTopics.length}</span> of {plan.totalTopics} topics by past-paper weight
              </p>
            </div>
          </div>

          {/* Numbers that drive it */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl bg-[var(--surface-secondary)]/60 p-3">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]"><Crosshair className="w-3 h-3" /> Accuracy used</span>
              <span className="block mt-1 text-lg font-bold font-num text-[var(--text-primary)]">{Math.round(plan.accuracyUsed * 100)}%</span>
              <span className="text-[10px] text-[var(--text-muted)]">{plan.accuracyIsMeasured ? "Your measured accuracy" : "Typical, until you've done 40+ questions"}</span>
            </div>
            <div className="rounded-xl bg-[var(--surface-secondary)]/60 p-3">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]"><ListChecks className="w-3 h-3" /> Daily target</span>
              <span className="block mt-1 text-lg font-bold font-num text-[var(--text-primary)]">{plan.dailyQuestions} Qs</span>
              <span className="text-[10px] text-[var(--text-muted)]">About 8 per study hour</span>
            </div>
          </div>

          {/* Time check */}
          <div className="rounded-xl bg-[var(--surface-secondary)]/60 p-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-muted)]">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Time check</span>
              <span className="font-num normal-case tracking-normal text-[11px] text-[var(--text-secondary)]">
                {plan.hoursAvailable.toLocaleString()}h available / {plan.hoursNeeded.toLocaleString()}h needed
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-[var(--border)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${hoursPct}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${hoursPct >= 100 ? "from-emerald-400 to-teal-500" : "from-amber-400 to-rose-500"}`}
              />
            </div>
            <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
              {plan.daysLeft} days × your daily hours, keeping 15% back for revision and full mocks.
            </p>
          </div>

          {/* Honest verdict */}
          <AnimatePresence mode="wait">
            <motion.div
              key={plan.status + plan.recommendedPercent}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2.5 rounded-xl p-3 text-xs leading-relaxed ${
                plan.status === "on-track"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
              }`}
            >
              {plan.status === "on-track" ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span>
                {plan.status === "on-track" && <>On track. Your hours cover this plan, with room to spare for revision.</>}
                {plan.status === "time" && (
                  <>
                    This target needs more hours than you have. {plan.achievableRank
                      ? <>At your current pace, around <b>AIR ~{plan.achievableRank.toLocaleString()}</b> is realistic, or add study hours to keep AIR {targetRank?.toLocaleString()}.</>
                      : <>Add study hours to make it reachable.</>}
                  </>
                )}
                {plan.status === "accuracy" && (
                  <>
                    Even the full syllabus won&apos;t get there at {Math.round(plan.accuracyUsed * 100)}% accuracy. AIR {targetRank?.toLocaleString()} needs roughly{" "}
                    <b>{plan.accuracyNeeded}% accuracy</b> across the paper, so accuracy is your lever: review mistakes and practise under time.
                  </>
                )}
              </span>
            </motion.div>
          </AnimatePresence>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            disabled={applied}
            onClick={async () => {
              await setTargetPercent(plan.recommendedPercent);
              useToastStore.getState().show(`Focus Target set to ${plan.recommendedPercent}% of the syllabus`);
            }}
            className={`mt-auto w-full inline-flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              applied
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default"
                : "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/45"
            }`}
          >
            {applied ? <><CheckCircle2 className="w-4 h-4" /> Focus Target matches this plan</> : <><Sparkles className="w-4 h-4" /> Apply {plan.recommendedPercent}% to Focus Target</>}
          </motion.button>
        </div>
      )}
    </div>
  );
}
