"use client";

import { useEffect, useMemo, useState } from "react";
import { computeTopicFrequencies, filterOfficialQuestions, type TopicFrequency } from "@/lib/analytics/goal-slider-engine";
import { computeGoalPlan, defaultExamDate, type GoalPlan } from "@/lib/goals/goal-engine";
import { useAnalyticsStore } from "@/store/use-analytics-store";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { toLocalDateStr } from "@/lib/utils";

let rankedCache: TopicFrequency[] | null = null;

/**
 * Live goal plan for the given goal values (which may be unsaved form state, so the
 * plan updates as the learner types). Loads the question bank's topic ranking once per
 * session and the learner's measured accuracy from analytics.
 */
export function useGoalPlan(goals: { targetRank: number | null; targetYear: number; dailyHours: number }): {
  plan: GoalPlan | null;
  examDate: string | null;
} {
  const [ranked, setRanked] = useState<TopicFrequency[] | null>(rankedCache);
  const [savedExamDate, setSavedExamDate] = useState<string | null | undefined>(undefined);
  const { dashboardMetrics, loadAnalytics } = useAnalyticsStore();

  useEffect(() => {
    loadAnalytics();
    IDBManager.getMetadata("target_exam_date")
      .then((r) => setSavedExamDate(r?.value ? String(r.value) : null))
      .catch(() => setSavedExamDate(null));
    if (rankedCache) return;
    (async () => {
      const { QuestionRepository } = await import("@/lib/repository/question-repository");
      await QuestionRepository.initialize();
      rankedCache = computeTopicFrequencies(filterOfficialQuestions(QuestionRepository.getAllQuestions()));
      setRanked(rankedCache);
    })().catch(() => setRanked([]));
  }, [loadAnalytics]);

  // An exact date set in the Calendar wins when it's in the target year; otherwise GATE's
  // usual slot (second Saturday of February) of the target year.
  const examDate = savedExamDate === undefined
    ? null
    : savedExamDate && savedExamDate.startsWith(String(goals.targetYear))
      ? savedExamDate
      : defaultExamDate(goals.targetYear);

  const plan = useMemo(() => {
    if (!ranked || !examDate) return null;
    const o = dashboardMetrics?.overview;
    return computeGoalPlan(ranked, {
      targetRank: goals.targetRank,
      examDate,
      today: toLocalDateStr(),
      dailyHours: goals.dailyHours,
      measuredAccuracy: o ? o.overallAccuracy : null,
      questionsAttempted: o?.totalQuestionsSolved ?? 0,
    });
  }, [ranked, examDate, dashboardMetrics, goals.targetRank, goals.dailyHours]);

  return { plan, examDate };
}
