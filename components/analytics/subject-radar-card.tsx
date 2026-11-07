"use client";

/**
 * "Your subject shape": accuracy by subject as a radar that adapts to the branch (see lib/analytics/radar.ts for the rules).
 * 3 to 8 subjects: a radar with that many axes; more than 8: the most practised keep an axis and the rest merge into "Others";
 * one or two subjects with data: bars; none: an empty state. Subjects with under 5 answers are drawn dashed, never hidden.
 * Real data only: nothing is invented, and nothing renders until the student has attempted a question.
 */
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { buildRadar, labelAnchor, labelRoom, polar, type RadarAxis, type RadarModel } from "@/lib/analytics/radar";
import type { SubjectAnalytics } from "@/types/analytics.types";

const R = 118;        // chart radius in viewBox units
const PAD_Y = 56;     // room above and below for the first / opposite labels (two lines each)

function RadarSvg({ model }: { model: RadarModel }) {
  const reduce = useReducedMotion();
  const { axes, target } = model;
  const n = axes.length;
  const room = labelRoom(axes);
  const W = 2 * (R + room), H = 2 * (R + PAD_Y), cx = W / 2, cy = H / 2;
  const pts = (f: (a: RadarAxis) => number) => axes.map((a, i) => polar(cx, cy, (R * f(a)) / 100, i, n).join(",")).join(" ");
  const summary = axes.map((a) => `${a.label} ${a.hasData ? a.value + "%" : "no data"}`).join(", ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`Accuracy by subject against a ${target}% target. ${summary}.`}>
      {[25, 50, 75, 100].map((l) => (<polygon key={l} points={pts(() => l)} fill="none" stroke="var(--border)" strokeWidth={1.4} />))}
      {axes.map((_, i) => { const [x, y] = polar(cx, cy, R, i, n); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth={1} />; })}
      <polygon points={pts(() => target)} fill="none" stroke="var(--tint-peach-ink, #9a4527)" strokeWidth={2} strokeDasharray="6 6" opacity={0.85} />
      <motion.polygon points={pts((a) => Math.max(a.value, a.hasData ? 3 : 0))}
        fill="color-mix(in srgb, var(--radar-line, #3a6fb8) 24%, transparent)" stroke="var(--radar-line, #3a6fb8)" strokeWidth={3} strokeLinejoin="round"
        style={{ transformOrigin: "50% 50%", transformBox: "view-box" }}
        initial={reduce ? false : { scale: 0.35, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
      {axes.map((a, i) => {
        const [mx, my] = polar(cx, cy, (R * Math.max(a.value, a.hasData ? 3 : 0)) / 100, i, n);
        const [lx, ly] = polar(cx, cy, R + 16, i, n);
        const anchor = labelAnchor(i, n);
        const top = i === 0, bottom = n % 2 === 0 && i === n / 2;
        const dy = top ? -8 : bottom ? 10 : 0;
        return (
          <g key={a.key}>
            <title>{a.merged ? `${a.label}: ${a.merged.join(", ")}` : a.label}</title>
            <circle cx={mx} cy={my} r={a.hasData ? 5.5 : 3.5} fill="var(--background)" stroke="var(--radar-line, #3a6fb8)" strokeWidth={a.hasData ? 3 : 2} strokeDasharray={a.hasData && !a.reliable ? "2 2" : undefined} />
            <text x={lx} y={ly + dy - 2} textAnchor={anchor} fontSize={13.5} fontWeight={600} fill="var(--text-primary)">{a.short}</text>
            <text x={lx} y={ly + dy + 14} textAnchor={anchor} fontSize={12.5} fill="var(--text-muted)">{a.hasData ? `${a.value}%${a.reliable ? "" : "*"}` : "no data"}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Bars({ model }: { model: RadarModel }) {
  const rows = model.axes.filter((a) => a.hasData);
  return (
    <ul className="space-y-3">
      {rows.map((a) => (
        <li key={a.key}>
          <div className="flex justify-between gap-3 text-sm font-semibold text-[var(--text-primary)]"><span className="truncate">{a.label}</span><span className="font-num">{a.value}%</span></div>
          <div className="relative mt-1.5 h-2.5 rounded-full bg-[color-mix(in_srgb,var(--text-primary)_10%,transparent)]">
            <div className="h-full rounded-full bg-[var(--radar-line,#3a6fb8)]" style={{ width: `${a.value}%` }} />
            <span aria-hidden className="absolute -top-1 h-4.5 w-0.5 rounded bg-[var(--tint-peach-ink,#9a4527)]" style={{ left: `${model.target}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function SubjectRadarCard({ subjects }: { subjects: SubjectAnalytics[] }) {
  const model = buildRadar(subjects.map((s) => ({ subject: s.subject, attempted: s.attempted, correct: s.correct })));
  const gaps = model.axes.filter((a) => a.hasData).sort((a, b) => a.value - b.value).slice(0, 4);
  const partial = model.axes.some((a) => a.hasData && !a.reliable);
  return (
    <section aria-label="Your subject shape" className="card-pastel p-5 sm:p-7" data-tint="sky">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">Your subject shape</h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Accuracy by subject. The dashed ring is the {model.target}% target.</p>
        </div>
        <Link href="/analytics" className="pill-soft text-sm">Open Analytics <ArrowRight className="h-4 w-4" /></Link>
      </div>

      {model.mode === "empty" ? (
        <p className="mt-6 text-sm text-[var(--text-secondary)]">Your shape appears after your first test. <Link href="/setup" className="font-semibold underline">Start a quick test</Link>.</p>
      ) : (
        <div className="mt-4 grid items-center gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <div className="min-w-0">{model.mode === "radar" ? <RadarSvg model={model} /> : <Bars model={model} />}</div>
          <div className="min-w-0">
            <p className="text-sm text-[var(--text-muted)]">Average accuracy</p>
            <p className="font-num text-5xl font-light tracking-tight text-[var(--text-primary)]"><AnimatedNumber value={model.average} suffix="%" /></p>
            <p className="mt-4 text-sm font-bold text-[var(--text-primary)]">Furthest from the target</p>
            <ul className="mt-2 divide-y divide-[var(--border)]">
              {gaps.map((a) => (
                <li key={a.key} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0 truncate font-semibold text-[var(--text-primary)]" title={a.label}>{a.label}</span>
                  <span className="shrink-0 font-num text-[var(--text-secondary)]">{a.value}%{a.value < model.target ? <span className="ml-2 rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-semibold">{a.value - model.target}</span> : <span className="ml-2 rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-semibold">on target</span>}</span>
                </li>
              ))}
            </ul>
            {partial ? <p className="mt-3 text-xs text-[var(--text-muted)]">* Fewer than 5 answers so far; the marker is dashed until there are more.</p> : null}
          </div>
        </div>
      )}
      <ul className="sr-only">{model.axes.map((a) => <li key={a.key}>{a.label}: {a.hasData ? `${a.value}% from ${a.attempted} answers` : "no answers yet"}</li>)}</ul>
    </section>
  );
}
