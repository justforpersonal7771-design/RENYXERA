"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { useGoalSliderStore, GOAL_SLIDER_DEFAULT_PERCENT } from "@/store/use-goal-slider-store";
import { computeGoalSliderResult, filterOfficialQuestions } from "@/lib/analytics/goal-slider-engine";

/** Topic browser: every subject and topic in your paper with how many questions there are, searchable. Tap a topic to practise it. */
const TINTS = ["peri", "mint", "peach", "lilac", "sky", "rose", "butter"] as const;

export default function BrowseTopicsPage() {
  const isInitialized = useDataStore((s) => s.isInitialized);
  const [q, setQ] = useState("");
  useEffect(() => { useDataStore.getState().loadRepository(); }, []);

  const subjects = useMemo(() => {
    if (!isInitialized) return [];
    const by = new Map<string, Map<string, number>>();
    for (const x of QuestionRepository.getAllQuestions()) {
      if ((x as { isAiGenerated?: boolean }).isAiGenerated || !x.subject) continue;
      const t = by.get(x.subject) ?? new Map<string, number>();
      t.set(x.topic || "General", (t.get(x.topic || "General") ?? 0) + 1);
      by.set(x.subject, t);
    }
    return [...by.entries()].map(([subject, topics]) => ({ subject, total: [...topics.values()].reduce((a, b) => a + b, 0), topics: [...topics.entries()].sort((a, b) => b[1] - a[1]) })).sort((a, b) => b.total - a.total);
  }, [isInitialized]);

  // Focus Target (goal slider): topics inside it are starred, the rest dimmed and labelled.
  const { targetPercent, load } = useGoalSliderStore();
  useEffect(() => { void load(); }, [load]);
  const focusOn = targetPercent < GOAL_SLIDER_DEFAULT_PERCENT;
  const inFocus = useMemo(() => {
    if (!isInitialized || !focusOn) return null;
    return new Set(computeGoalSliderResult(filterOfficialQuestions(QuestionRepository.getAllQuestions()), targetPercent).includedTopics.map((t) => t.topic));
  }, [isInitialized, focusOn, targetPercent]);
  const needle = q.trim().toLowerCase();
  const shown = subjects.map((s) => ({ ...s, topics: needle && !s.subject.toLowerCase().includes(needle) ? s.topics.filter(([t]) => t.toLowerCase().includes(needle)) : s.topics })).filter((s) => s.topics.length > 0);
  const count = shown.reduce((n, s) => n + s.topics.length, 0);
  const grand = Math.max(1, subjects.reduce((n, s) => n + s.total, 0));

  return (
    <div className="w-full min-w-0 space-y-6 overflow-x-hidden">
      <header>
        <h1 className="text-xl font-black tracking-tight text-[var(--text-primary)]">Browse topics</h1>
        <p className="text-xs font-semibold text-[var(--text-secondary)]">Every subject and topic in your paper, with the number of questions. Tap a topic to practise it.</p>
      </header>
      <label className="relative block max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a topic, for example “deadlock”" aria-label="Search topics" className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-10 pr-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] focus:border-violet-500" />
      </label>
      {!isInitialized ? <div className="skeleton-shimmer h-64 rounded-3xl" /> : shown.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">No topic matches “{q}”.</p> : (
        <>
          <p className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)]">{count} topic{count === 1 ? "" : "s"}
            {inFocus && <span className="rounded-full bg-amber-500/10 px-2.5 py-1 font-semibold text-amber-800 dark:text-amber-200">Focus Target {targetPercent}%: ★ priority topics · dimmed ones are outside it</span>}</p>
          {/* Bento of pastel subject cards: share of the paper, then topics as tappable chips sized by question count. */}
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {shown.map((s, i) => {
              const tint = TINTS[i % TINTS.length];
              const max = Math.max(1, ...s.topics.map(([, n]) => n));
              const share = Math.round((s.total / grand) * 100);
              return (
                <section key={s.subject} className="card-pastel min-w-0 overflow-hidden p-4 sm:p-5" data-tint={tint}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="section-label">{share}% of questions</span>
                      <h2 className="mt-2 text-base font-extrabold leading-snug text-[var(--text-primary)] break-words">{s.subject}</h2>
                    </div>
                    <Link href={`/setup?subject=${encodeURIComponent(s.subject)}`} className="pill-soft shrink-0 !h-8 !px-3 !text-xs">Subject test</Link>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-[color-mix(in_srgb,var(--tint-ink)_14%,transparent)]"><div className="h-full rounded-full bg-[var(--tint-ink)]" style={{ width: `${Math.max(4, share * 3)}%` }} /></div>
                  <p className="mt-1.5 text-[11px] font-semibold text-[var(--text-muted)]">{s.total} questions · {s.topics.length} topics</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {s.topics.map(([topic, n]) => (
                      <li key={topic} className="max-w-full">
                        <Link href={`/setup?subject=${encodeURIComponent(s.subject)}&topic=${encodeURIComponent(topic)}`} title={`${n} questions — practise this topic${inFocus && !inFocus.has(topic) ? " (outside your Focus Target)" : ""}`}
                          className="card-inset group relative inline-flex max-w-full items-center gap-2 overflow-hidden !rounded-full py-1.5 pl-3 pr-1.5 text-[12.5px] font-medium text-[var(--text-primary)] transition hover:-translate-y-px">
                          <span aria-hidden className="absolute inset-y-0 left-0 bg-[color-mix(in_srgb,var(--tint-ink)_12%,transparent)]" style={{ width: `${(n / max) * 100}%` }} />
                          <span className={`relative min-w-0 truncate ${inFocus && !inFocus.has(topic) ? "opacity-50" : ""}`}>{inFocus?.has(topic) ? "★ " : ""}{topic}</span>
                          <span className="relative shrink-0 rounded-full bg-[var(--tint-ink)] px-1.5 font-num text-[10px] font-bold text-white">{n}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
