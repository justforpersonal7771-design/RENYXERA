"use client";
import { useEffect, useMemo, useState } from "react";
import { useStudyStore } from "@/store/use-study-store";
import { useAnalyticsStore } from "@/store/use-analytics-store";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useDisplayName, useTargetYear } from "@/store/use-auth-store";
import { examDateFor } from "@/lib/goals/exam-year";
import { MemoryEngine, ReadinessScorecard } from "@/lib/ai/memory/MemoryEngine";
import { StudyPlanEngine, StudyPlanSuggestion } from "@/lib/ai/memory/StudyPlanEngine";
import { MasteryEngine, TopicMastery } from "@/lib/learning/MasteryEngine";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { toLocalDateStr } from "@/lib/utils";
import { buildBrief } from "@/lib/mentor/brief";

export interface MentorNote { id: string; text: string; at: string }
const NOTES_KEY = "mentor_notes";

/** Loads everything the Mentor knows (all computed from real data) and builds the learner brief. */
export function useMentorData() {
  const { first: firstName } = useDisplayName();
  const targetYear = useTargetYear();
  const { mistakes, bookmarks, loadStudyData } = useStudyStore();
  const { dashboardMetrics, loadAnalytics } = useAnalyticsStore();
  const { events, loadEvents } = useCalendarStore();
  const [ready, setReady] = useState(false);
  const [savedDate, setSavedDate] = useState<string | null>(null);
  const [mastery, setMastery] = useState<Record<string, TopicMastery>>({});
  const [sessions, setSessions] = useState<any[]>([]);
  const [notes, setNotes] = useState<MentorNote[]>([]);

  useEffect(() => {
    let alive = true;
    (async () => {
      await Promise.all([loadStudyData(), loadAnalytics(), loadEvents()]);
      await MemoryEngine.initialize();
      const rec = await IDBManager.getMetadata("target_exam_date");
      const n = await IDBManager.getAIMemory(NOTES_KEY);
      if (alive) { setSavedDate(rec?.value ? String(rec.value) : null); setNotes(Array.isArray(n) ? n : []); setReady(true); }
    })();
    return () => { alive = false; };
  }, [loadStudyData, loadAnalytics, loadEvents]);

  useEffect(() => {
    if (!ready) return;
    (async () => {
      const { QuestionRepository } = await import("@/lib/repository/question-repository");
      await QuestionRepository.initialize();
      const recs = await IDBManager.getAllExamSessions();
      const ss = recs.map((r) => r.sessionData as any);
      setSessions(ss);
      setMastery(MasteryEngine.calculateTopicMastery(QuestionRepository.getAllQuestions(), ss, mistakes));
    })();
  }, [ready, mistakes]);

  const subjects = useMemo(() => (dashboardMetrics?.subjectPerformance ?? []).map((s) => ({ subject: s.subject, attempted: s.attempted, accuracy: s.attempted ? Math.round((s.correct / s.attempted) * 100) : 0 })), [dashboardMetrics]);
  const plannerDone = events.length ? Math.round((events.filter((e) => e.completed).length / events.length) * 100) : null;

  const readiness: ReadinessScorecard | null = useMemo(() => {
    if (!ready) return null;
    const acc = dashboardMetrics?.overview.overallAccuracy ?? 0;
    return MemoryEngine.predictExamReadiness(subjects.map((s) => ({ subject: s.subject, masteryIndex: s.accuracy, averageConfidence: s.accuracy })), mistakes.length + bookmarks.length, acc, plannerDone ?? 50);
  }, [ready, subjects, mistakes, bookmarks, dashboardMetrics, plannerDone]);

  const suggestions: StudyPlanSuggestion[] = useMemo(() => {
    if (!readiness || !Object.keys(mastery).length) return [];
    return StudyPlanEngine.generateSuggestions({ mistakes, topicMasteryMap: mastery, burnoutRisk: readiness.burnoutRisk, existingEvents: events });
  }, [readiness, mastery, mistakes, events]);

  const examDate = examDateFor(targetYear, savedDate);
  const today = toLocalDateStr();
  const daysToExam = examDate ? Math.round((new Date(examDate + "T00:00:00").getTime() - new Date(today + "T00:00:00").getTime()) / 86400000) : null;
  const weakTopics = useMemo(() => Object.entries(mastery as Record<string, any>).map(([topic, m]) => ({ topic, subject: String(m.subject ?? ""), score: Math.round(Number(m.score ?? 0)), attempts: Number(m.totalAttempts ?? 0) }))
    .filter((t) => t.attempts > 0).sort((a, b) => a.score - b.score).slice(0, 5), [mastery]);
  const open = useMemo(() => mistakes.filter((m) => !m.mastered), [mistakes]);

  const brief = useMemo(() => {
    const done = sessions.filter((s) => s?.serverScore != null || s?.status === "SUBMITTED" || s?.status === "COMPLETED")
      .sort((a, b) => String(b.updatedAt ?? b.startedAt).localeCompare(String(a.updatedAt ?? a.startedAt)));
    const last = done[0];
    const weekEnd = toLocalDateStr(new Date(Date.now() + 7 * 86400000));
    return buildBrief({
      firstName: firstName ?? "", targetYear, daysToExam,
      accuracy: dashboardMetrics ? Math.round(dashboardMetrics.overview.overallAccuracy) : null,
      attempted: subjects.reduce((a, s) => a + s.attempted, 0),
      subjects: [...subjects].sort((a, b) => a.accuracy - b.accuracy).slice(0, 6),
      weakTopics: weakTopics.map((t) => ({ subject: t.subject, topic: t.topic, score: t.score })),
      openMistakes: open.length,
      mistakeSamples: [...open].sort((a, b) => (b.occurrences ?? 1) - (a.occurrences ?? 1)).slice(0, 5).map((m) => ({ id: m.questionId, subject: m.subject, topic: m.topic, times: m.occurrences ?? 1 })),
      testsTaken: done.length,
      lastTest: last ? { when: String(last.startedAt ?? "").slice(0, 10), marks: last.serverScore, max: last.serverMaxScore, answered: Object.keys(last.responses ?? {}).length, total: last.totalQuestions ?? 0 } : null,
      plannerDone, eventsNext7: events.filter((e) => e.date >= today && e.date <= weekEnd).length, burnout: readiness?.burnoutRisk ?? null,
      readiness: readiness ? { marks: Math.round(readiness.expectedMarks), rank: Math.round(readiness.expectedRank), rating: readiness.readinessRating } : null,
      notes: notes.map((n) => n.text).slice(-8),
    });
  }, [firstName, targetYear, daysToExam, dashboardMetrics, subjects, weakTopics, open, sessions, events, today, plannerDone, readiness, notes]);

  const saveNotes = async (next: MentorNote[]) => { setNotes(next); await IDBManager.saveAIMemory(NOTES_KEY, next); };
  return { ready, firstName, targetYear, daysToExam, examDate, subjects, weakTopics, open, suggestions, readiness, sessions, plannerDone, notes, saveNotes, brief, events, today };
}
