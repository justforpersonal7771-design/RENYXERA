"use client";

import { motion } from "motion/react";
import { ArrowRight, Target, TrendingUp, Trophy, Zap } from "lucide-react";
import { CountUp } from "@/components/ui/interactive";

/**
 * Lunar Analytics header (design 04, "Readiness Orbit"): one three-ring dial answers "am I on track?", four satellite cards orbit it
 * (weakest topics, subject accuracy, latest exam with its trend, today's focus), and the next steps sit under the dial.
 * Everything is real data from the learning engine and the analytics store; nothing is invented. Shown only under the Lunar look.
 */
type Topic = { topic: string; subject: string; acc: number; attempted: number };
type Subject = { full: string; accuracy: number; attempts: number };
type Trend = { full: string; score: number; accuracy: number };
export type OrbitIntel = {
  masteryScore: number; readinessScore: number; consistencyScore: number; confidenceScore: number;
  todaysFocus: { topic: string; reason: string }; todaysTarget: { title: string; count: number; reason: string };
};

const RINGS = [
  { key: "readinessScore", label: "Readiness", r: 132, color: "#3a6fb8" },
  { key: "masteryScore", label: "Mastery", r: 104, color: "#8db9f0" },
  { key: "consistencyScore", label: "Consistency", r: 76, color: "#f5b69e" },
] as const;

function Spark({ points }: { points: number[] }) {
  if (points.length < 2) return null;
  const w = 120, h = 36, max = Math.max(...points, 1), min = Math.min(...points, 0);
  const x = (i: number) => (i / (points.length - 1)) * w, y = (v: number) => h - 3 - ((v - min) / (max - min || 1)) * (h - 6);
  const d = points.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-full" aria-hidden>
      <path d={d} fill="none" stroke="#3a6fb8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(points.length - 1)} cy={y(points[points.length - 1])} r="3.5" fill="#f5b69e" stroke="#fff" strokeWidth="1.5" />
    </svg>
  );
}

function Bar({ label, pct, tone }: { label: string; pct: number; tone: string }) {
  return (
    <li className="min-w-0">
      <div className="flex items-baseline justify-between gap-2 text-[13px]"><span className="truncate font-semibold text-[var(--text-primary)]">{label}</span><span className="font-num shrink-0 text-[var(--text-secondary)]">{Math.round(pct)}%</span></div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]">
        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.max(3, Math.min(100, pct))}%` }} transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.25 }} className="h-full rounded-full" style={{ background: tone }} />
      </div>
    </li>
  );
}

const Sat = ({ title, icon, children, tint }: { title: string; icon: React.ReactNode; children: React.ReactNode; tint: string }) => (
  <section className="card-pastel flex flex-col gap-3 p-5" data-tint={tint} data-nowm>
    <h3 className="flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[color-mix(in_srgb,var(--surface)_70%,transparent)]">{icon}</span>{title}</h3>
    {children}
  </section>
);

export function LunarOrbit({ intel, topics, subjects, trend, onPractise }: { intel: OrbitIntel; topics: Topic[]; subjects: Subject[]; trend: Trend[]; onPractise: (topic: string) => void }) {
  const weak = [...topics].filter((t) => t.attempted >= 2).sort((a, b) => a.acc - b.acc).slice(0, 3);
  const subj = [...subjects].filter((s) => s.attempts > 0).sort((a, b) => a.accuracy - b.accuracy).slice(0, 4);
  const last = trend[trend.length - 1];
  const ready = Math.round(intel.readinessScore);
  const verdict = ready >= 70 ? "You are on track." : ready >= 40 ? "Building well. Keep the pace." : "Early days. Every test moves this.";

  const dial = (
    <div className="relative mx-auto grid w-full max-w-[340px] place-items-center">
      <svg viewBox="0 0 320 320" className="w-full" role="img" aria-label={`Readiness ${ready} percent, mastery ${Math.round(intel.masteryScore)} percent, consistency ${Math.round(intel.consistencyScore)} percent`}>
        <circle cx="160" cy="160" r="152" fill="none" stroke="currentColor" strokeOpacity=".12" strokeDasharray="2 7" strokeLinecap="round" className="text-[var(--text-primary)]" />
        {RINGS.map((rg, i) => {
          const v = Math.max(0, Math.min(100, intel[rg.key])) / 100, C = 2 * Math.PI * rg.r;
          return (
            <g key={rg.key} transform="rotate(-90 160 160)">
              <circle cx="160" cy="160" r={rg.r} fill="none" stroke="currentColor" strokeOpacity=".09" strokeWidth="18" className="text-[var(--text-primary)]" />
              <motion.circle cx="160" cy="160" r={rg.r} fill="none" stroke={rg.color} strokeWidth="18" strokeLinecap="round" strokeDasharray={C}
                initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - v) }} transition={{ duration: 1.1, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }} />
            </g>
          );
        })}
      </svg>
      <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
        <div>
          <CountUp value={ready} suffix="%" className="font-display text-5xl font-extrabold tracking-tight text-[var(--text-primary)]" />
          <p className="mt-0.5 text-xs font-bold text-[var(--text-secondary)]">exam readiness</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="orbit-grid grid items-stretch gap-4 xl:grid-cols-[1fr_minmax(300px,380px)_1fr]">
      <div className="order-2 grid content-start gap-4 xl:order-1">
        <Sat title="Weakest topics" icon={<Target className="h-4 w-4" />} tint="peach">
          {weak.length ? <ul className="space-y-3">{weak.map((t) => <Bar key={t.topic} label={t.topic} pct={t.acc} tone="#f5b69e" />)}</ul> : <p className="text-sm text-[var(--text-secondary)]">Answer a few questions in a topic and it shows up here.</p>}
        </Sat>
        <Sat title="Subject accuracy" icon={<Zap className="h-4 w-4" />} tint="sky">
          {subj.length ? <ul className="space-y-3">{subj.map((s) => <Bar key={s.full} label={s.full} pct={s.accuracy} tone="#8db9f0" />)}</ul> : <p className="text-sm text-[var(--text-secondary)]">Practise a subject to see how you compare across them.</p>}
        </Sat>
      </div>

      <div className="order-1 flex flex-col items-center gap-4 rounded-[28px] bg-[color-mix(in_srgb,var(--surface)_58%,transparent)] p-5 text-center xl:order-2">
        {dial}
        <p className="font-display text-lg font-extrabold text-[var(--text-primary)]">{verdict}</p>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs font-semibold text-[var(--text-secondary)]">
          {RINGS.map((rg) => <li key={rg.key} className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: rg.color }} />{rg.label} <span className="font-num text-[var(--text-primary)]">{Math.round(intel[rg.key])}%</span></li>)}
        </ul>
      </div>

      <div className="order-3 grid content-start gap-4">
        <Sat title="Latest exam" icon={<Trophy className="h-4 w-4" />} tint="lilac">
          {last ? (
            <>
              <div><p className="truncate text-sm font-semibold text-[var(--text-secondary)]">{last.full}</p>
                <p className="mt-0.5 flex items-baseline gap-2"><span className="font-num font-display text-3xl font-extrabold text-[var(--text-primary)]">{last.score}</span><span className="text-sm font-semibold text-[var(--text-secondary)]">marks · {last.accuracy}% accurate</span></p></div>
              <Spark points={trend.map((t) => t.accuracy)} />
            </>
          ) : <p className="text-sm text-[var(--text-secondary)]">Complete a mock test and your trend starts here.</p>}
        </Sat>
        <Sat title="Do this next" icon={<TrendingUp className="h-4 w-4" />} tint="mint">
          <div>
            <p className="text-sm font-extrabold text-[var(--text-primary)]">{intel.todaysFocus.topic}</p>
            <p className="mt-1 text-[13px] leading-snug text-[var(--text-secondary)]">{intel.todaysFocus.reason}</p>
          </div>
          <button type="button" onClick={() => onPractise(intel.todaysFocus.topic)} className="btn-main !h-10 justify-center !text-sm">Practise this topic <ArrowRight className="h-4 w-4" /></button>
          <p className="text-xs text-[var(--text-secondary)]">Then: <span className="font-semibold text-[var(--text-primary)]">{intel.todaysTarget.title}</span>, <span className="font-num">{intel.todaysTarget.count}</span> questions.</p>
        </Sat>
      </div>
    </div>
  );
}
