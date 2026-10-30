"use client";

/**
 * A price whose digits roll like an odometer when the value changes (the "price roll" pattern of the MadeToScale guide, built with
 * `motion`). Only transform is animated; reduced motion shows the price at once; screen readers get the plain text.
 */
import { motion, useReducedMotion } from "motion/react";

const ROW = 1.1; // row height in em; the digit column moves by digit x ROW

export function PriceRoll({ value, className }: { value: string; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{value}</span>;
  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="inline-flex items-start tabular-nums" style={{ height: `${ROW}em`, lineHeight: `${ROW}em` }}>
        {[...value].map((ch, i) => {
          if (!/\d/.test(ch)) return <span key={i} className="inline-block" style={{ height: `${ROW}em` }}>{ch}</span>;
          const d = Number(ch);
          return (
            <span key={i} className="inline-block overflow-hidden" style={{ height: `${ROW}em` }}>
              <motion.span className="flex flex-col" initial={{ y: 0 }} animate={{ y: `${-d * ROW}em` }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}>
                {Array.from({ length: 10 }, (_, n) => <span key={n} style={{ height: `${ROW}em` }}>{n}</span>)}
              </motion.span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
