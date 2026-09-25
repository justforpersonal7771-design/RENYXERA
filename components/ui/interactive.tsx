"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import {
  animate, motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform,
} from "motion/react";
import { Info } from "lucide-react";

/**
 * Shared interactive building blocks for the Dashboard, Analytics and AI Mentor
 * screens. All of them respect prefers-reduced-motion (they render the final state
 * straight away instead of animating).
 */

/** A number that counts up to `value` the first time it scrolls into view, and
 *  animates between old and new values whenever `value` changes afterwards. */
export function CountUp({
  value, decimals = 0, suffix = "", prefix = "", duration = 1.1, className = "",
}: {
  value: number; decimals?: number; suffix?: string; prefix?: string; duration?: number; className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const from = useRef(0);
  const [shown, setShown] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setShown(value);
      from.current = value;
      return;
    }
    const controls = animate(from.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(v),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, inView, reduce, duration]);

  return (
    <span ref={ref} className={`font-num ${className}`}>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/** Circular progress ring (0–100) that sweeps in when it scrolls into view. The
 *  centre is whatever children are passed (usually a CountUp). */
export function RadialGauge({
  value, size = 96, stroke = 8, from = "#06c2fb", to = "#dd42fb", track = "currentColor",
  trackOpacity = 0.12, children, className = "",
}: {
  value: number; size?: number; stroke?: number; from?: string; to?: string; track?: string;
  trackOpacity?: number; children?: ReactNode; className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));

  return (
    <div className={`relative inline-grid place-items-center ${className}`} style={{ width: size, height: size }}>
      <svg ref={ref} width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={from} />
            <stop offset="100%" stopColor={to} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeOpacity={trackOpacity} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={`url(#g${id})`} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: inView || reduce ? c - (pct / 100) * c : c }}
          transition={{ duration: reduce ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/** A surface that tilts gently toward the cursor in 3D. Pointer-only; touch and
 *  reduced-motion users get a plain box. */
export function TiltCard({
  children, className = "", wrapperClassName = "", max = 7, onClick, as = "div", title, ariaLabel,
}: {
  children: ReactNode; className?: string; wrapperClassName?: string; max?: number; onClick?: () => void;
  as?: "div" | "button"; title?: string; ariaLabel?: string;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 220, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 220, damping: 18 });

  const handleMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const Comp = as === "button" ? motion.button : motion.div;
  return (
    <div style={{ perspective: 900 }} className={`h-full ${wrapperClassName}`}>
      <Comp
        type={as === "button" ? "button" : undefined}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
        whileTap={onClick ? { scale: 0.97 } : undefined}
        style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className={`spotlight h-full w-full text-left ${onClick ? "cursor-pointer" : ""} ${className}`}
      >
        {children}
      </Comp>
    </div>
  );
}

/** Small "i" that shows an explanation on hover or keyboard focus. */
export function InfoTip({ children, className = "", align = "center" }: {
  children: ReactNode; className?: string; align?: "center" | "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const pos = align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="More info"
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full opacity-60 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-opacity"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {open && (
        <motion.span
          role="tooltip"
          initial={{ opacity: 0, y: 4, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className={`absolute top-full mt-2 ${pos} z-50 w-60 rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] p-3 text-[11px] font-medium normal-case tracking-normal leading-relaxed text-[var(--text-secondary)] shadow-xl`}
        >
          {children}
        </motion.span>
      )}
    </span>
  );
}

/** Segmented control with a sliding active pill. */
export function Segmented<T extends string>({
  value, onChange, options, className = "", size = "sm",
}: {
  value: T; onChange: (v: T) => void; options: { label: string; value: T }[]; className?: string; size?: "xs" | "sm";
}) {
  const id = useId();
  return (
    <div role="tablist" className={`inline-flex items-center gap-0.5 p-1 rounded-xl bg-[var(--surface-secondary)] border border-[var(--border)] ${className}`}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`relative ${size === "xs" ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]"} rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer ${
              active ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 shadow-sm shadow-indigo-500/30"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
