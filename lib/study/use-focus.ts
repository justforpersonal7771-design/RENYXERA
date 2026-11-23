"use client";

/** The student's Focus Target (top-bar goal slider) as the study screens see it: the shelf, the Contents sheet and every chapter page. */
import { useEffect, useMemo, useState } from "react";
import { fromBank } from "@/lib/study/bank";
import { BANK_SUBJECTS } from "@/lib/study/packs";
import type { ShelfBook, ShelfChapter } from "@/lib/study/catalog";
import { GOAL_SLIDER_DEFAULT_PERCENT, useGoalSliderStore } from "@/store/use-goal-slider-store";
import { computeGoalSliderResult, computeTopicFrequencies, type TopicFrequency } from "@/lib/analytics/goal-slider-engine";
import type { RenderableQuestion } from "@/types/question.types";
import { chapterFocus, type ChapterFocus } from "@/lib/study/focus";

/* Topic frequencies are computed once per session for the shared bank array (speed pass, 19 Nov). */
const freqCache = new WeakMap<object, TopicFrequency[]>();
function freqOf(qs: RenderableQuestion[]) { let f = freqCache.get(qs); if (!f) { f = computeTopicFrequencies(qs); freqCache.set(qs, f); } return f; }

export function useLibraryFocus() {
  const target = useGoalSliderStore((x) => x.targetPercent);
  const loaded = useGoalSliderStore((x) => x.loaded);
  const loadGoal = useGoalSliderStore((x) => x.load);
  const [qs, setQs] = useState<RenderableQuestion[] | null>(null);
  useEffect(() => { void loadGoal(); }, [loadGoal]);
  useEffect(() => {
    void fromBank("all-questions", (papers) => papers.flatMap((p) => p.questions) as unknown as RenderableQuestion[]).then(setQs).catch(() => setQs([]));
  }, []);
  return useMemo(() => {
    const active = target < GOAL_SLIDER_DEFAULT_PERCENT && !!qs?.length;
    const freq: TopicFrequency[] = qs ? freqOf(qs) : [];
    const keys = active ? new Set(computeGoalSliderResult(qs!, target).includedTopics.map((t) => `${t.subject}::${t.topic}`)) : null;
    const totalMarks = (qs ?? []).reduce((s, q) => s + (typeof q.marks === "number" ? q.marks : 0), 0);
    const topicIn = (t: TopicFrequency) => !keys || keys.has(`${t.subject}::${t.topic}`);
    const bookIn = (b: ShelfBook) => !keys || freq.some((t) => (BANK_SUBJECTS[b.id] ?? []).includes(t.subject) && topicIn(t));
    const topicsOf = (b: ShelfBook) => freq.filter((t) => (BANK_SUBJECTS[b.id] ?? []).includes(t.subject));
    /** Weight and target membership of one chapter, from the questions tagged to it. */
    const chapter = (b: ShelfBook, c: ShelfChapter): ChapterFocus => {
      const bookQs = (qs ?? []).filter((q) => (BANK_SUBJECTS[b.id] ?? []).includes(q.subject)) as unknown as { question_id: string; subject: string; topic?: string; marks: number }[];
      return chapterFocus(b.id, c, bookQs, totalMarks, keys);
    };
    return { active, target, loaded, ready: !!qs, topicIn, bookIn, topicsOf, chapter };
  }, [qs, target, loaded]);
}
export type Focus = ReturnType<typeof useLibraryFocus>;
