"use client";

import { TelegramJoinCard, TelegramJoinLink } from "@/components/growth/telegram-join";
import { useEffect, useState } from "react";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { useRouter } from "next/navigation";
import { useDataStore } from "@/store/use-data-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { useAnalyticsStore } from "@/store/use-analytics-store";
import { useStudyStore } from "@/store/use-study-store";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { useDaysToGate } from "@/lib/goals/use-days-to-gate";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { Footer } from "@/components/layout/footer";

// The hero is a normal (server-rendered) import: it's the first thing on screen, and it
// stays mounted from the very first paint through data loading (it shows placeholder
// values while loading), so there's no separate loading page that gets swapped out.
import { SignedOutWelcome } from "@/components/dashboard/signed-out-welcome";
import { DiagnosticCard } from "@/components/dashboard/diagnostic-card";
import { WeakTopicsSync } from "@/components/planner/weak-topics-sync";
import { WeeklyBenchmarkCard } from "@/components/dashboard/weekly-benchmark-card";
import { TodayBlocksCard } from "@/components/planner/today-blocks-card";
import { MissedBlocksCard } from "@/components/planner/missed-blocks-card";
import { StudyTimer } from "@/components/dashboard/study-timer";
import { InstallPrompt } from "@/components/growth/install-prompt";
import { TodayCard } from "@/components/dashboard/today-card";
import { MockStatusCard } from "@/components/dashboard/mock-status-card";
import { FeatureDeck } from "@/components/dashboard/feature-deck";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { usePaperLabel } from "@/lib/branch/use-paper-label";
import { NextActionHero, MarksLeakCard, RevisionDueCard, SubjectTilesCard, YearDotsCard, useSolvedIds } from "@/components/dashboard/bento";

// Everything below the hero is client-only and code-split.



const GithubHeatmap = dynamic(() => import("@/components/dashboard/github-heatmap").then(m => m.GithubHeatmap), {
  ssr: false,
  loading: () => <div className="skeleton-shimmer h-32 rounded-2xl" />
});

const ActivityTimeline = dynamic(() => import("@/components/dashboard/activity-timeline").then(m => m.ActivityTimeline), {
  ssr: false,
  loading: () => <div className="skeleton-shimmer h-[400px] rounded-2xl" />
});

const RecentExams = dynamic(() => import("@/components/dashboard/recent-exams").then(m => m.RecentExams), {
  ssr: false,
  loading: () => <div className="skeleton-shimmer h-[380px] rounded-2xl" />
});


const IncompleteTests = dynamic(() => import("@/components/dashboard/incomplete-tests").then(m => m.IncompleteTests), {
  ssr: false,
});

const ExamCountdownCard = dynamic(() => import("@/components/dashboard/exam-countdown-card").then(m => m.ExamCountdownCard), {
  ssr: false,
  loading: () => <div className="skeleton-shimmer h-[220px] rounded-2xl" />
});

export default function Home() {
  const router = useRouter();
  const { loadRepository, isInitialized } = useDataStore();
  const { activeSession, isHydrated, initializeStore, clearSession } = useExamRuntimeStore();
  const { dashboardMetrics, loadAnalytics, loading } = useAnalyticsStore();
  const { bookmarks, mistakes, loadStudyData } = useStudyStore();
  
  const [bookmarksCount, setBookmarksCount] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  useEffect(() => {
    loadRepository();
    loadStudyData();
    if (!isHydrated) {
      initializeStore();
    }
    
    // Fetch count details for stats cards
    IDBManager.getAllBookmarks().then(b => setBookmarksCount(b.filter((x) => !x.isShortcutOnly).length)).catch(()=>null);
    IDBManager.getAllMistakes().then(m => setMistakesCount(m.length)).catch(()=>null);
  }, [loadRepository, initializeStore, isHydrated, loadStudyData]);

  useEffect(() => {
    if (isInitialized) {
      // Cached — recomputes only when missing (first visit) or explicitly invalidated
      // (e.g. after submitting an exam), instead of on every single navigation here.
      const { loadAnalytics } = useAnalyticsStore.getState();
      loadAnalytics();
    }
  }, [isInitialized]);

  const overview = dashboardMetrics?.overview;
  const snapshots = useAnalyticsStore(state => state.snapshots);

  // Resume or start exam handlers
  const handleResume = () => {
    router.push("/exam/session");
  };

  const handleNewExam = () => {
    router.push("/setup");
  };

  const isLoading = !isInitialized || (loading && !dashboardMetrics);

  // Premium metrics definition (Part 7)
  const accuracyValue = overview?.overallAccuracy || 0;
  const solvedCount = overview?.totalQuestionsSolved || 0;
  const studyHours = overview?.totalTimeSpentMs ? Math.round(overview.totalTimeSpentMs / 1000 / 3600) : 0;
  const streakDays = overview?.currentStreak || 0;

  // Deliberately NOT a repeat of the hero's Streak/Solved/Accuracy/Mastery/
  // Readiness cards above — every tile below surfaces something the hero
  // doesn't, so the two rows stay non-redundant. All values are real and
  // uncapped (recentSessions is capped to 10 server-side, so it's excluded
  // here rather than shown as a misleading "total").
  const pendingMistakesCount = mistakes.filter(m => !m.mastered).length;
  const masteredMistakesCount = mistakes.filter(m => m.mastered).length;
  const weakTopicsCount = (dashboardMetrics?.topicPerformance || [])
    .filter(t => t.attempted >= 1 && (t.correct / t.attempted) * 100 < 50).length;
  const strongTopicsCount = (dashboardMetrics?.topicPerformance || [])
    .filter(t => t.attempted >= 1 && (t.correct / t.attempted) * 100 >= 75).length;
  const bestStreak = overview?.longestStreak || 0;
  const weakest = (dashboardMetrics?.topicPerformance || [])
    .filter((t) => t.attempted >= 2)
    .sort((a, b) => a.correct / a.attempted - b.correct / b.attempted)[0] ?? null;
  const solvedIds = useSolvedIds(isInitialized);
  const paper = usePaperLabel();
  const totalBank = isInitialized ? QuestionRepository.getAllQuestions().filter((q) => !(q as { isAiGenerated?: boolean }).isAiGenerated && !q.origin_branch).length : 0;
  const daysToGate = useDaysToGate();
  void bookmarksCount; void bestStreak; void weakTopicsCount; void strongTopicsCount;

  return (
    <div className="w-full space-y-8">
      
      <SignedOutWelcome />

      {/* R18: compact "next step" hero with the student's own rings (replaces the large banner). */}
      <NextActionHero
        solved={solvedCount} accuracy={accuracyValue} streak={streakDays} pendingMistakes={pendingMistakesCount}
        weakest={weakest} hasActiveSession={!!activeSession && activeSession.status !== "SUBMITTED"} onResume={handleResume}
        loading={isLoading}
      />

      {isLoading ? (
        // Same shape as the real content below, so the swap is a fill-in, not a jump.
        <div className="space-y-8" aria-busy="true" aria-label="Loading your dashboard">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="skeleton-shimmer h-[150px] rounded-2xl" />
            <div className="skeleton-shimmer h-[150px] rounded-2xl" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="skeleton-shimmer h-[300px] rounded-2xl" />
              <div className="skeleton-shimmer h-[220px] rounded-2xl" />
            </div>
            <div className="lg:col-span-4 space-y-8">
              <div className="skeleton-shimmer h-[220px] rounded-2xl" />
              <div className="skeleton-shimmer h-[180px] rounded-2xl" />
            </div>
          </div>
        </div>
      ) : (
      <>

      {/* 2. Active Session Banner Alert */}
      <AnimatePresence>
      {isHydrated && activeSession && activeSession.status !== "SUBMITTED" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-5 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex gap-4 items-center relative z-10">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-indigo-950 dark:text-indigo-300 mb-0.5">Mock session is paused in background</h2>
              <p className="text-[var(--text-muted)] text-xs font-semibold">You paused an active exam. You can resume your test now.</p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0 w-full sm:w-auto relative z-10">
            <button
              onClick={handleResume}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow transition-colors flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              Resume Exam
            </button>
            <button
              onClick={async () => {
                if (await confirmDialog({ title: "Discard this exam?", message: "All progress in this paused session will be lost.", confirmLabel: "Discard", tone: "danger" })) {
                  await clearSession();
                }
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)] rounded-xl font-bold transition cursor-pointer text-xs"
            >
              Discard
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <MissedBlocksCard />
      <TodayBlocksCard />
      <WeakTopicsSync topics={dashboardMetrics?.topicPerformance ?? []} />
      <div id="diagnostic" className="scroll-mt-24"><DiagnosticCard solved={solvedCount} /></div>

      {/* Today strip: missions + study timer side by side. */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><TodayCard pendingMistakes={pendingMistakesCount} streak={streakDays} sessions={dashboardMetrics?.recentSessions ?? []} /></div>
        <div className="flex flex-col gap-4"><StudyTimer /><InstallPrompt /></div>
      </div>

      <IncompleteTests />

      {/* Bento: one pastel card per question a student asks themselves. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MarksLeakCard topics={dashboardMetrics?.topicPerformance ?? []} />
        <RevisionDueCard pending={pendingMistakesCount} mastered={masteredMistakesCount} />
        {weakest ? <YearDotsCard topic={weakest} solvedIds={solvedIds} /> : <Reveal className="h-full"><MockStatusCard /></Reveal>}
        <div className="md:col-span-2"><SubjectTilesCard subjects={dashboardMetrics?.subjectPerformance ?? []} /></div>
        {weakest ? <Reveal className="h-full"><MockStatusCard /></Reveal> : <Reveal className="h-full"><ExamCountdownCard /></Reveal>}
      </div>

      <WeeklyBenchmarkCard />

      {/* R18 B1: Swaseekh-style sticky stacking deck, with the student's own numbers. */}
      <FeatureDeck solved={solvedCount} totalBank={totalBank} paper={paper} accuracy={accuracyValue} pendingMistakes={pendingMistakesCount}
        subjects={dashboardMetrics?.subjectPerformance ?? []} topics={dashboardMetrics?.topicPerformance ?? []}
        studyHours={studyHours} streak={streakDays} daysToGate={daysToGate} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-8 flex flex-col gap-4">
          <Reveal><RecentExams recentSessions={dashboardMetrics?.recentSessions || []} /></Reveal>
          <Reveal><ActivityTimeline recentSessions={dashboardMetrics?.recentSessions || []} bookmarks={bookmarks} mistakes={mistakes} /></Reveal>
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          {weakest && <Reveal><ExamCountdownCard /></Reveal>}
          <Reveal><GithubHeatmap snapshots={snapshots} /></Reveal>
          <Reveal><TelegramJoinCard /></Reveal>
        </div>
      </div>

      <Footer />
      </>
      )}
    </div>
  );
}
