"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import { QuestionRepository } from "@/lib/repository/question-repository";

/** Topic browser: every subject and topic in your paper with how many questions there are, searchable. Tap a topic to practise it. */
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

  const needle = q.trim().toLowerCase();
  const shown = subjects.map((s) => ({ ...s, topics: needle && !s.subject.toLowerCase().includes(needle) ? s.topics.filter(([t]) => t.toLowerCase().includes(needle)) : s.topics })).filter((s) => s.topics.length > 0);
  const count = shown.reduce((n, s) => n + s.topics.length, 0);

  return (
    <div className="w-full space-y-6">
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
          <p className="text-xs text-[var(--text-muted)]">{count} topic{count === 1 ? "" : "s"}</p>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {shown.map((s) => (
              <section key={s.subject} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <h2 className="flex items-baseline justify-between gap-3 text-sm font-extrabold text-[var(--text-primary)]"><span className="min-w-0 truncate">{s.subject}</span><span className="shrink-0 text-xs font-bold font-num text-[var(--text-muted)]">{s.total} Qs</span></h2>
                <ul className="mt-2 divide-y divide-[var(--border-subtle)]">
                  {s.topics.map(([topic, n]) => (
                    <li key={topic}><Link href={`/setup?subject=${encodeURIComponent(s.subject)}&topic=${encodeURIComponent(topic)}`} className="flex items-center justify-between gap-3 py-2 text-sm text-[var(--text-secondary)] hover:text-violet-600 dark:hover:text-violet-400"><span className="min-w-0 flex-1 truncate" title={topic}>{topic}</span><span className="shrink-0 text-xs font-num text-[var(--text-muted)]">{n}</span></Link></li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
