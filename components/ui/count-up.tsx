"use client";

/**
 * A number that counts up once, when it first scrolls into view. Learned from the "count-up stats" pattern of the MadeToScale
 * guide, built with `motion` (already on the site) instead of GSAP. Rules (docs/reference/MADETOSCALE_REFERENCE_REVIEW.md):
 * only the real value is ever shown, reduced motion shows it at once, screen readers read the final value straight away,
 * and it plays once (never again on re-scroll).
 */
import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

export function CountUp({ value, decimals = 0, duration = 0.9, className }: { value: number; decimals?: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce || value === 0) { setShown(value); return; }
    const controls = animate(0, value, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: setShown });
    return () => controls.stop();
  }, [inView, value, reduce, duration]);
  const fmt = (n: number) => n.toFixed(decimals);
  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      <span className="sr-only">{fmt(value)}</span>
      <span aria-hidden>{inView ? fmt(shown) : fmt(0)}</span>
    </span>
  );
}
