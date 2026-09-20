"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "initial" | "whileInView" | "viewport" | "children"> {
  children?: React.ReactNode;
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
}

/**
 * Scroll reveal: fades + lifts a block the first time it scrolls into view.
 *
 * Uses `viewport.amount` (fraction of the element that must be visible) rather than a
 * negative `margin` — the margin form silently fails to hold back elements that are only
 * just past the fold, which made the effect look like it wasn't running at all.
 */
export function Reveal({ children, delay = 0, y = 72, className, ...props }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
