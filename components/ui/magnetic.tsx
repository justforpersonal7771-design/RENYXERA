"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { SPRING } from "@/lib/motion/tokens";

/**
 * The "pull" effect (catalogue effect 7) for HERO actions only: the wrapped button leans up to 6 px toward the pointer. It is off for touch,
 * for reduced motion and for exam screens (do not use it there), and it is deliberately NOT applied to every button: moving targets
 * lower click accuracy and hundreds of listeners are wasteful.
 */
export function Magnetic({ children, max = 6, className = "" }: { children: ReactNode; max?: number; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(useMotionValue(0), SPRING.pull);
  const y = useSpring(useMotionValue(0), SPRING.pull);
  if (reduce) return <span className={`inline-block ${className}`}>{children}</span>;
  const onMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    x.set(Math.max(-1, Math.min(1, dx)) * max);
    y.set(Math.max(-1, Math.min(1, dy)) * max);
  };
  const reset = () => { x.set(0); y.set(0); };
  return (
    <motion.span ref={ref} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset} className={`inline-block ${className}`}>{children}</motion.span>
  );
}
