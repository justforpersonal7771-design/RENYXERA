"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { WifiOff, RefreshCw, Loader2 } from "lucide-react";
import type { ExamSession } from "@/types/exam-runtime.types";
import { ensureAnswers, hasAnswer, submitForGrading, useAnswerKeysVersion } from "@/lib/repository/answer-keys";
import { useToastStore } from "@/store/use-toast-store";
import { IDBManager } from "@/lib/repository/storage/idb-manager";

/** Questions in this test whose key hasn't been unlocked yet (all, and answered ones). */
export function usePendingAnswers(session: ExamSession | null) {
  const version = useAnswerKeysVersion((s) => s.version);
  return useMemo(() => {
    let all = 0, answered = 0;
    for (const r of Object.values(session?.responses ?? {})) {
      if (!/^GATE_/.test(r.questionId) || hasAnswer(r.questionId)) continue;
      all++;
      if (r.status === "ANSWERED" || r.status === "MARKED_AND_ANSWERED") answered++;
    }
    return { all, answered };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, version]);
}

/**
 * Shown on results/review when a test was submitted offline (or grading failed): the
 * score can't include questions whose answers are still locked. Retries automatically
 * when the browser comes back online, and on demand.
 */
export function AnswersPendingBanner({ session, onGraded, className = "mb-4" }: { session: ExamSession | null; onGraded?: (s: ExamSession) => void; className?: string }) {
  const { all: pending, answered: pendingAnswered } = usePendingAnswers(session);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const retry = useCallback(async () => {
    if (!session || busy) return;
    setBusy(true);
    const graded = await submitForGrading(session).catch(() => null);
    setBusy(false);
    setFailed(!graded);
    if (graded) {
      const updated = { ...session, serverScore: graded.score, serverMaxScore: graded.maxScore, serverStored: graded.stored };
      await IDBManager.saveExamSession({ id: session.id, sessionData: updated, updatedAt: new Date().toISOString() }).catch(() => {});
      onGraded?.(updated);
    }
  }, [session, busy, onGraded]);

  useEffect(() => {
    if (!pending) return;
    void retry();
    const onOnline = () => void retry();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending > 0]);

  if (!pending) return null;
  return (
    <div role="status" className={`${className} flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200`}>
      <WifiOff className="w-4 h-4 shrink-0" />
      <p className="flex-1 min-w-0">
        <span className="font-semibold">
          {pendingAnswered
            ? `${pendingAnswered} of your answers can't be scored yet.`
            : "The correct answers for this test are still locked."}
        </span>{" "}
        {failed ? "We couldn't reach the server — they'll unlock when you're back online." : "Checking with the server…"}
      </p>
      <button
        onClick={retry}
        disabled={busy}
        className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-bold hover:bg-amber-500/30 disabled:opacity-60 cursor-pointer"
      >
        {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
        Retry
      </button>
    </div>
  );
}

/**
 * For practice screens (revision, bookmarks, mistakes): unlocks the shown question's
 * answer if it isn't cached yet. Re-renders when it arrives; tells the user once if
 * they're offline instead of silently showing no correct option.
 */
export function useEnsureAnswer(questionId: string | null | undefined) {
  const version = useAnswerKeysVersion((s) => s.version);
  useEffect(() => {
    if (!questionId || hasAnswer(questionId)) return;
    let cancelled = false;
    ensureAnswers([questionId]).then((ok) => {
      if (!ok && !cancelled) useToastStore.getState().show("This answer couldn't load — check your connection.", "error");
    });
    return () => { cancelled = true; };
  }, [questionId]);
  return { ready: !questionId || hasAnswer(questionId), version };
}
