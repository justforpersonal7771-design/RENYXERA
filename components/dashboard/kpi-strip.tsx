"use client";

/**
 * Six headline numbers, one card each, directly under the hero (the second thing the eye reads): value, label, and how it moved this week where that
 * can be known. Cards are pastel, tappable where they lead somewhere, and 2 across on phones, 3 on tablets, 6 on wide screens (never reordered).
 */
import Link from "next/link";
import { useMemo } from "react";
import { Clock, Flame, Gauge, ListChecks, RotateCcw, Target } from "lucide-react";
import { CountUp } from "@/components/ui/interactive";
import { accPct, weekTotals } from "@/lib/dashboard/week-delta";
import type { AnalyticsSnapshot } from "@/types/analytics.types";

type Tone = "up" | "down" | "flat";
type Kpi = { key: string; label: string; value: number; unit?: string; decimals?: number; sub: string; tone?: Tone; tint: string; icon: typeof Gauge; href?: string };

export function KpiStrip(p: {
  readiness: number; accuracy: number; solved: number; streak: number; bestStreak: number; studyMs: number; pendingMistakes: number; masteredMistakes: number;
  snapshots: AnalyticsSnapshot[]; loading: boolean;
}) {
  const { thisWeek, lastWeek } = useMemo(() => weekTotals(p.snapshots), [p.snapshots]);
  const accNow = accPct(thisWeek), accBefore = accPct(lastWeek);
  const accDelta = accNow !== null && accBefore !== null ? accNow - accBefore : null;
  const hoursWeek = Math.round((thisWeek.timeMs / 3_600_000) * 10) / 10;
  const kpis: Kpi[] = [
    { key: "readiness", label: "Readiness", value: p.readiness, unit: "%", sub: p.readiness >= 70 ? "Above your goal of 70" : `${70 - p.readiness} to reach 70`, tone: p.readiness >= 70 ? "up" : "flat", tint: "lilac", icon: Gauge },
    { key: "accuracy", label: "Accuracy", value: Math.round(p.accuracy), unit: "%", sub: accDelta === null ? "Overall, all attempts" : accDelta === 0 ? "Same as last week" : `${accDelta > 0 ? "+" : ""}${accDelta} pts vs last week`, tone: accDelta === null || accDelta === 0 ? "flat" : accDelta > 0 ? "up" : "down", tint: "mint", icon: Target },
    { key: "solved", label: "Questions solved", value: p.solved, sub: thisWeek.attempted ? `+${thisWeek.attempted} this week` : "None this week yet", tone: thisWeek.attempted ? "up" : "flat", tint: "sky", icon: ListChecks },
    { key: "streak", label: "Streak", value: p.streak, unit: p.streak === 1 ? " day" : " days", sub: p.bestStreak > p.streak ? `Best: ${p.bestStreak} days` : p.streak > 0 ? "Your best so far" : "Practise today to start", tone: p.streak > 0 ? "up" : "flat", tint: "peach", icon: Flame },
    { key: "time", label: "Study time", value: Math.round((p.studyMs / 3_600_000) * 10) / 10, unit: " h", decimals: 1, sub: hoursWeek > 0 ? `+${hoursWeek} h this week` : "None logged this week", tone: hoursWeek > 0 ? "up" : "flat", tint: "butter", icon: Clock },
    { key: "mistakes", label: "Mistakes to fix", value: p.pendingMistakes, sub: p.masteredMistakes ? `${p.masteredMistakes} mastered` : "Fix them in Revision", tone: p.pendingMistakes > 0 ? "down" : "up", tint: "rose", icon: RotateCcw, href: "/revision" },
  ];
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6" aria-label="Your numbers">
      {kpis.map((k) => {
        const body = (
          <>
            <span className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-[var(--text-secondary)]">{k.label}</span>
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-[var(--surface)] text-[var(--tint-ink)]"><k.icon className="h-4 w-4" aria-hidden /></span>
            </span>
            <span className="mt-2 block font-display text-3xl font-extrabold leading-none text-[var(--text-primary)]">{p.loading ? "–" : <CountUp value={k.value} decimals={k.decimals ?? 0} />}<span className="text-lg font-bold text-[var(--text-secondary)]">{k.unit}</span></span>
            <span className={`mt-2 block text-xs font-semibold ${k.tone === "up" ? "text-[var(--tint-mint-ink)]" : k.tone === "down" ? "text-[var(--tint-rose-ink)]" : "text-[var(--text-muted)]"}`}>{k.sub}</span>
          </>
        );
        return (
          <li key={k.key} className="min-w-0">
            {k.href ? <Link href={k.href} className="card-pastel metal block h-full p-4" data-tint={k.tint} data-nowm>{body}</Link> : <div className="card-pastel metal h-full p-4" data-tint={k.tint} data-nowm>{body}</div>}
          </li>
        );
      })}
    </ul>
  );
}
