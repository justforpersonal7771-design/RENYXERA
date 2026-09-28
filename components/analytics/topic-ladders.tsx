"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Layers } from "lucide-react";
import type { TopicAnalytics } from "@/types/analytics.types";

/**
 * Topic ladders (5E): every topic climbs Bronze → Silver → Gold → Platinum → Diamond on
 * accuracy, once there are enough attempts to mean something. Shows how far the next tier
 * is, so there is always one concrete step to aim for.
 */
const TIERS = [
  { name: "Bronze", min: 0, cls: "from-amber-700 to-orange-500" },
  { name: "Silver", min: 40, cls: "from-slate-400 to-slate-300" },
  { name: "Gold", min: 60, cls: "from-amber-500 to-yellow-300" },
  { name: "Platinum", min: 75, cls: "from-cyan-500 to-sky-300" },
  { name: "Diamond", min: 90, cls: "from-violet-500 to-fuchsia-400" },
] as const;
const MIN_ATTEMPTS = 3;

export function TopicLadders({ topics }: { topics: TopicAnalytics[] }) {
  const [showAll, setShowAll] = useState(false);
  const rows = useMemo(() => topics
    .filter((t) => t.attempted >= MIN_ATTEMPTS)
    .map((t) => {
      const acc = Math.round((t.correct / Math.max(1, t.attempted)) * 100);
      const idx = TIERS.reduce((i, tier, k) => (acc >= tier.min ? k : i), 0);
      const next = TIERS[idx + 1];
      const span = next ? next.min - TIERS[idx].min : 1;
      const progress = next ? Math.max(0, Math.min(100, ((acc - TIERS[idx].min) / span) * 100)) : 100;
      return { ...t, acc, tier: TIERS[idx], next, progress };
    })
    .sort((a, b) => b.acc - a.acc || b.attempted - a.attempted), [topics]);

  const counts = TIERS.map((tier) => rows.filter((r) => r.tier.name === tier.name).length);
  const shown = showAll ? rows : rows.slice(0, 8);

  return (
    <section className="card-glass rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)] mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-violet-500" /> Topic ladders</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">Answer at least {MIN_ATTEMPTS} questions in a topic to put it on the ladder — Bronze → Silver → Gold → Platinum → Diamond.</p>
      ) : (
        <>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {TIERS.map((tier, i) => (
              <div key={tier.name} className="text-center">
                <div className={`mx-auto w-9 h-9 rounded-xl bg-gradient-to-br ${tier.cls} shadow-md flex items-center justify-center text-white font-extrabold text-sm font-num`}>{counts[i]}</div>
                <p className="mt-1 text-[10px] font-bold text-[var(--text-muted)] truncate">{tier.name}</p>
              </div>
            ))}
          </div>
          <ol className="space-y-2.5">
            {shown.map((r, i) => (
              <li key={`${r.subject}-${r.topic}`} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
                <span className={`px-2 py-0.5 rounded-md bg-gradient-to-r ${r.tier.cls} text-white text-[10px] font-black uppercase tracking-wide`}>{r.tier.name}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{r.topic}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${r.progress}%` }} transition={{ duration: 0.7, delay: i * 0.04 }} className={`h-full bg-gradient-to-r ${r.tier.cls}`} />
                  </div>
                </div>
                <span className="text-[11px] font-num text-[var(--text-secondary)] text-right whitespace-nowrap">{r.acc}%{r.next ? ` · ${r.next.min - r.acc}% to ${r.next.name}` : " · top tier"}</span>
              </li>
            ))}
          </ol>
          {rows.length > 8 && (
            <button onClick={() => setShowAll((v) => !v)} className="mt-3 text-xs font-semibold text-violet-600 dark:text-violet-400 cursor-pointer">{showAll ? "Show fewer" : `Show all ${rows.length} topics`}</button>
          )}
        </>
      )}
    </section>
  );
}
