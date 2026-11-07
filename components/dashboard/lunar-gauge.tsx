"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Semicircle readiness gauge (0..100) for the Lunar dashboard. It says two things only: where you are and where you are going.
 * One solid arc fills from 0 to your value (blue); the stretch from your value to the goal is a soft peach lane; the goal sits at the end of that
 * lane as a labelled flag outside the ring. No bands, no overlapping colours. Pure SVG; the fill sweeps in once.
 */
const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

export function LunarGauge({ value, target = 70, size = 380 }: { value: number; target?: number; size?: number }) {
  const reduce = useReducedMotion();
  const v = Math.max(0, Math.min(100, value)), tg = Math.max(0, Math.min(100, target));
  const cx = size / 2, cy = size / 2 + 6, r = size / 2 - 34, sw = Math.round(size / 15);
  const ang = (x: number) => 180 + x * 1.8;
  const [mx, my] = polar(cx, cy, r, ang(v));
  const [fx, fy] = polar(cx, cy, r + sw / 2 + 4, ang(tg)), [lx, ly] = polar(cx, cy, r + sw / 2 + 22, ang(tg));
  const [ex0, ey0] = polar(cx, cy, r, 180), [ex1, ey1] = polar(cx, cy, r, 360);
  const gap = tg > v;
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size / 2 + 44}`} className="mx-auto block h-auto max-w-[420px]" role="img" aria-label={`You are at ${Math.round(v)} out of 100. Goal ${tg}.`}>
      <path d={arc(cx, cy, r, 180, 360)} fill="none" stroke="rgba(26,28,41,.1)" strokeWidth={sw} strokeLinecap="round" className="lg-track" />
      {gap && <path d={arc(cx, cy, r, ang(v), ang(tg))} fill="none" stroke="#f5b69e" strokeWidth={sw} strokeLinecap="butt" opacity={0.85} />}
      {v > 0 && (
        <motion.path d={arc(cx, cy, r, 180, Math.max(180.5, ang(v)))} fill="none" stroke="#3a6fb8" strokeWidth={sw} strokeLinecap="round" className="lg-fill"
          initial={reduce ? false : { pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
      )}
      <motion.circle cx={mx} cy={my} r={sw * 0.42} fill="#fff" stroke="#1a1c29" strokeWidth={3.5}
        initial={reduce ? false : { opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.6 }}
        style={{ transformOrigin: `${mx}px ${my}px`, transformBox: "view-box" }} />
      {/* goal flag */}
      <line x1={polar(cx, cy, r - sw / 2 - 2, ang(tg))[0]} y1={polar(cx, cy, r - sw / 2 - 2, ang(tg))[1]} x2={fx} y2={fy} stroke="#1a1c29" strokeWidth={3} strokeLinecap="round" className="lg-goal" />
      <g transform={`translate(${lx} ${ly})`}>
        <rect x={-30} y={-12} width={60} height={24} rx={12} fill="#1a1c29" className="lg-flag" />
        <text x={0} y={5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#fff" className="lg-flag-text">Goal {tg}</text>
      </g>
      <text x={ex0} y={ey0 + sw / 2 + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--text-secondary)">0</text>
      <text x={ex1} y={ey1 + sw / 2 + 16} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--text-secondary)">100</text>
    </svg>
  );
}
