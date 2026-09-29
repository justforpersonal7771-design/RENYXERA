"use client";

import { useId } from "react";

/**
 * Pro crown for the avatar. Drawn crisp on purpose: flat faceted gold (light left faces,
 * deeper right faces), a clean dark outline, one ruby, and a thin light sweep — no blur
 * filters or glows, which is what made the first version look soft at this size.
 */
const GOLD = { f: ["#fcd34d", "#f59e0b", "#fde68a", "#fbbf24", "#d97706", "#f59e0b"], band: ["#fde68a", "#d97706"], line: "#78350f", tip: "#fff7c2", gem: "#e11d48", gemHi: "#fecdd3" };
const SILVER = { f: ["#e5e7eb", "#9ca3af", "#f9fafb", "#d1d5db", "#6b7280", "#9ca3af"], band: ["#f3f4f6", "#6b7280"], line: "#374151", tip: "#ffffff", gem: "#2563eb", gemHi: "#bfdbfe" };

export function ProCrown({ className = "", metal = "gold" }: { className?: string; metal?: "gold" | "silver" }) {
  const id = useId().replace(/:/g, "");
  const c = metal === "silver" ? SILVER : GOLD;
  return (
    <span className={`pro-crown pointer-events-none ${metal === "silver" ? "is-silver" : ""} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 30" className="pro-crown-svg" shapeRendering="geometricPrecision">
        <defs>
          <linearGradient id={`band${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c.band[0]} /><stop offset="1" stopColor={c.band[1]} />
          </linearGradient>
          <linearGradient id={`glint${id}`} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset="0.5" stopColor="#fff" stopOpacity="0.9" /><stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={`clip${id}`}><path d="M5 22 L3 8 L12.5 15 L20 3 L27.5 15 L37 8 L35 22 Z" /></clipPath>
        </defs>
        {/* Facets */}
        <path d="M5 22 L3 8 L12.5 15 Z" fill={c.f[0]} />
        <path d="M5 22 L12.5 15 L20 22 Z" fill={c.f[1]} />
        <path d="M12.5 15 L20 3 L20 22 Z" fill={c.f[2]} />
        <path d="M20 3 L27.5 15 L20 22 Z" fill={c.f[3]} />
        <path d="M20 22 L27.5 15 L35 22 Z" fill={c.f[4]} />
        <path d="M27.5 15 L37 8 L35 22 Z" fill={c.f[5]} />
        <g clipPath={`url(#clip${id})`}>
          <rect className="pro-crown-glint" x="-14" y="0" width="9" height="30" fill={`url(#glint${id})`} />
        </g>
        <path d="M5 22 L3 8 L12.5 15 L20 3 L27.5 15 L37 8 L35 22 Z" fill="none" stroke={c.line} strokeWidth="1.1" strokeLinejoin="round" />
        {/* Band */}
        <rect x="4.5" y="22" width="31" height="4.5" rx="1.4" fill={`url(#band${id})`} stroke={c.line} strokeWidth="1.1" />
        <path d="M7 24.2 H33" stroke={c.tip} strokeWidth="0.7" strokeLinecap="round" opacity="0.8" />
        {/* Tips + ruby */}
        <circle cx="3" cy="8" r="1.9" fill={c.tip} stroke={c.line} strokeWidth="0.9" />
        <circle cx="20" cy="3" r="2.1" fill={c.tip} stroke={c.line} strokeWidth="0.9" />
        <circle cx="37" cy="8" r="1.9" fill={c.tip} stroke={c.line} strokeWidth="0.9" />
        <path d="M20 15.2 L22.2 18.2 L20 21.2 L17.8 18.2 Z" fill={c.gem} stroke={c.line} strokeWidth="0.8" />
        <path d="M20 15.9 L21 17.9 L19.4 17.6 Z" fill={c.gemHi} />
      </svg>
      <i className="pro-spark" />
    </span>
  );
}
