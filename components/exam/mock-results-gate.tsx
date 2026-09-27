"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Lock, Trophy } from "lucide-react";
import type { ExamSession } from "@/types/exam-runtime.types";

/**
 * All-India mock results are released together at the mock's results time (like GATE):
 * until then the score, answers and review stay hidden — also enforced on the server,
 * which withholds the keys. Returns whether this session is still locked.
 */
export function useMockResultsGate(session: ExamSession | null) {
  const mockId = session?.draftConfig?.config?.mockId;
  const [resultsAt, setResultsAt] = useState<string | null>(session?.resultsAt ?? null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!mockId) return;
    let cancelled = false;
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const { data } = await createClient().from("mock_events").select("results_at").eq("id", mockId).maybeSingle();
        if (!cancelled && data?.results_at) setResultsAt(data.results_at);
      } catch { /* offline: keep the time saved with the session */ }
    })();
    return () => { cancelled = true; };
  }, [mockId]);

  const locked = !!mockId && (!resultsAt || now < Date.parse(resultsAt));
  useEffect(() => {
    if (!locked) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [locked]);

  // Unlocks on its own at the results time: fetch the now-released score + keys, then
  // record mistakes (deferred at submit so nothing leaked early).
  const [released, setReleased] = useState<ExamSession | null>(null);
  useEffect(() => {
    if (!mockId || locked || !session || released) return;
    let cancelled = false;
    (async () => {
      const { submitForGrading } = await import("@/lib/repository/answer-keys");
      const graded = await submitForGrading(session).catch(() => null);
      if (!graded || graded.withheld || cancelled) return;
      const updated: ExamSession = { ...session, serverScore: graded.score, serverMaxScore: graded.maxScore, serverStored: graded.stored, resultsAt: undefined };
      const { SessionManager } = await import("@/lib/exam/session-manager");
      await SessionManager.saveToHistory(updated).catch(() => {});
      if (session.resultsAt) {
        const { MistakeEngine } = await import("@/lib/analytics/mistake-engine");
        await MistakeEngine.processSession(updated).catch(() => {});
        const { useAnalyticsStore } = await import("@/store/use-analytics-store");
        useAnalyticsStore.getState().invalidate();
      }
      if (!cancelled) setReleased(updated);
    })();
    return () => { cancelled = true; };
  }, [mockId, locked, session, released]);

  return { isMock: !!mockId, locked, resultsAt, now, mockId, released };
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return h ? `${h}h ${m}m ${sec}s` : `${m}m ${sec}s`;
};

export function MockResultsLocked({ resultsAt, now, mockId }: { resultsAt: string | null; now: number; mockId?: string }) {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/30">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Your mock is submitted</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Like GATE, everyone&apos;s results — score, answers, rank and percentile — are released together
          {resultsAt ? <> at <span className="font-semibold text-[var(--text-primary)]">{new Date(resultsAt).toLocaleString(undefined, { weekday: "short", hour: "2-digit", minute: "2-digit" })}</span></> : " after the paper closes"}.
        </p>
        {resultsAt && (
          <p className="text-3xl font-extrabold font-num text-[var(--text-primary)]" aria-live="polite">{fmt(Date.parse(resultsAt) - now)}</p>
        )}
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <Link href={mockId ? `/mocks/results?id=${mockId}` : "/mocks"} className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold">
            <Trophy className="w-4 h-4" /> Leaderboard
          </Link>
          <Link href="/" className="inline-flex items-center justify-center h-11 px-5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] font-semibold">Dashboard</Link>
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">This page opens your results automatically when they&apos;re released.</p>
      </motion.div>
    </div>
  );
}
