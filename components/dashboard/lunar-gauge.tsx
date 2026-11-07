"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Semicircle gauge (0..100) for the Lunar dashboard: four soft bands (low to high), a marker at the value and a tick at the target.
 * Pure SVG, `currentColor`-free so it reads on the lavender ground in light and dark. The marker eases to its value once.
 */
const polar = (cx: number, cy: number, r: number, deg: number): [number, number] => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)];
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(cx, cy, r, a0), [x1, y1] = polar(cx, cy, r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};
const BANDS: [number, number, string][] = [[0, 40, "rgba(245,182,158,.6)"], [40, 60, "rgba(141,185,240,.45)"], [60, 80, "rgba(141,185,240,.8)"], [80, 100, "#3a6fb8"]];

export function LunarGauge({ value, target = 70, size = 380 }: { value: number; target?: number; size?: number }) {
  const reduce = useReducedMotion();
  const v = Math.max(0, Math.min(100, value));
  const cx = size / 2, cy = size / 2 + 6, r = size / 2 - 22, sw = Math.round(size / 17);
  const ang = (x: number) => 180 + x * 1.8;
  const [mx, my] = polar(cx, cy, r, ang(v));
  const [t0x, t0y] = polar(cx, cy, r - sw, ang(target)), [t1x, t1y] = polar(cx, cy, r + sw, ang(target));
  return (
    <svg width="100%" viewBox={`0 0 ${size} ${size / 2 + 40}`} className="mx-auto block h-auto max-w-[420px]" role="img" aria-label={`${v} out of 100, target ${target}`}>
      {BANDS.map(([a, b, c]) => <path key={a} d={arc(cx, cy, r, ang(a) + (a ? 1 : 0), ang(b) - 1)} fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" />)}
      <line x1={t0x} y1={t0y} x2={t1x} y2={t1y} stroke="var(--text-primary)" strokeWidth={3} strokeLinecap="round" />
      <motion.circle cx={mx} cy={my} r={sw * 0.78} fill="#fff" stroke="#1a1c29" strokeWidth={5}
        initial={reduce ? false : { opacity: 0, scale: 0.4 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 260, damping: 18 }}
        style={{ transformOrigin: `${mx}px ${my}px`, transformBox: "view-box" }} />
    </svg>
  );
}
