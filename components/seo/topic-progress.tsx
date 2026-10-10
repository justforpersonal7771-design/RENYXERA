"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { useAnalyticsStore } from "@/store/use-analytics-store";
import { useDataStore } from "@/store/use-data-store";

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Loads the signed-in learner's own topic stats once; returns null while signed out or not ready. */
function useTopicStats() {
  const user = useAuthStore((s) => s.user);
  const isInitialized = useDataStore((s) => s.isInitialized);
  const metrics = useAnalyticsStore((s) => s.dashboardMetrics);
  useEffect(() => {
    if (!user) return;
    useDataStore.getState().loadRepository();
  }, [user]);
  useEffect(() => {
    if (user && isInitialized) void useAnalyticsStore.getState().loadAnalytics();
  }, [user, isInitialized]);
  if (!user || !metrics) return null;
  const map = new Map<string, { attempted: number; correct: number }>();
  for (const t of metrics.topicPerformance) map.set(norm(t.topic), { attempted: t.attempted, correct: t.correct });
  return map;
}

/** Not started / Started / Solid (≥3 tries, ≥40%) / Cleared (≥5 tries, ≥75%) — from your own attempts. */
export function TopicProgressBadge({ topic }: { topic: string }) {
  const stats = useTopicStats();
  if (!stats) return null;
  const s = stats.get(norm(topic));
  const cp = <Link href={`/checkpoint?topic=${encodeURIComponent(topic)}`} className="ml-2 text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline">Checkpoint →</Link>;
  const pct = s && s.attempted ? (s.correct / s.attempted) * 100 : 0;
  const [label, tone] = !s || s.attempted === 0 ? ["Not started", "text-[var(--text-muted)] bg-[var(--surface-secondary)]"]
    : s.attempted >= 5 && pct >= 75 ? ["Cleared", "text-emerald-700 dark:text-emerald-300 bg-emerald-500/15"]
    : s.attempted >= 3 && pct >= 40 ? ["Solid", "text-sky-700 dark:text-sky-300 bg-sky-500/15"]
    : ["Started", "text-amber-700 dark:text-amber-300 bg-amber-500/15"];
  return <><span className={`ml-2 inline-block rounded-full px-2 py-px align-middle text-[10px] font-bold ${tone}`} title={s ? `${s.correct}/${s.attempted} correct` : undefined}>{label}</span>{cp}</>;
}

/** Progress for a unit made of several bank topics (the CS syllabus groups topics into units). */
export function UnitProgressBadge({ topics }: { topics: string[] }) {
  const stats = useTopicStats();
  if (!stats) return null;
  let attempted = 0, correct = 0;
  for (const t of topics) { const s = stats.get(norm(t)); if (s) { attempted += s.attempted; correct += s.correct; } }
  const pct = attempted ? (correct / attempted) * 100 : 0;
  const [label, tone] = attempted === 0 ? ["Not started", "text-[var(--text-muted)] bg-[var(--surface-secondary)]"]
    : attempted >= 5 && pct >= 75 ? ["Cleared", "text-emerald-700 dark:text-emerald-300 bg-emerald-500/15"]
    : attempted >= 3 && pct >= 40 ? ["Solid", "text-sky-700 dark:text-sky-300 bg-sky-500/15"]
    : ["Started", "text-amber-700 dark:text-amber-300 bg-amber-500/15"];
  const first = topics[0];
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-block rounded-full px-2 py-px text-[10px] font-bold ${tone}`} title={attempted ? `${correct}/${attempted} correct` : undefined}>{label}</span>
      {first && <Link href={`/checkpoint?topic=${encodeURIComponent(first)}`} className="text-[10px] font-bold text-violet-600 dark:text-violet-400 hover:underline">Checkpoint →</Link>}
    </span>
  );
}

/** Banner above the topic lists: shows what signing in adds, or a practice link once signed in. */
export function TopicProgressNote({ practiseHref }: { practiseHref: string }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const openAuth = useAuthModalStore((s) => s.open);
  if (loading) return null;
  return (
    <p className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-2.5 text-sm text-[var(--text-secondary)]">
      {user ? (
        <>Your own progress shows beside each topic. <Link href={practiseHref} className="font-bold text-violet-600 dark:text-violet-400 hover:underline">Practise the topics you haven&apos;t started →</Link></>
      ) : (
        <><button type="button" onClick={() => openAuth("login")} className="font-bold text-violet-600 dark:text-violet-400 hover:underline cursor-pointer">Sign in</button> to see each topic marked Not started, Solid or Cleared from your own attempts.</>
      )}
    </p>
  );
}
