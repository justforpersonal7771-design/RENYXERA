"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SPRING } from "@/lib/motion/tokens";

/**
 * A number whose digits roll when the value CHANGES after first paint (catalogue effect 9 / 13). On mount, on a static value and under
 * reduced motion it is plain text, so a number sitting on a dashboard never "counts up" by itself and nothing flickers.
 * Tabular figures keep the width steady; the screen-reader label is always the final number.
 */
export function AnimatedNumber({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const reduce = useReducedMotion();
  const first = useRef(true);
  const prev = useRef(value);
  const [changed, setChanged] = useState(false);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (prev.current !== value) { prev.current = value; setChanged(true); }
  }, [value]);

  const text = String(Math.max(0, Math.round(value)));
  const label = `${text}${suffix}`;
  if (reduce || !changed) return <span className={`inline-block tabular-nums ${className}`}>{label}</span>;
  return (
    <span className={`inline-flex h-[1.15em] items-center overflow-hidden leading-none tabular-nums ${className}`} aria-label={label} role="text">
      <span aria-hidden className="inline-flex">
        <AnimatePresence mode="popLayout" initial={false}>
          {text.split("").map((d, i) => (
            <motion.span key={`${text.length - i}-${d}`} className="inline-block"
              initial={{ y: "100%", opacity: 0 }} animate={{ y: "0%", opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={SPRING.snap}>{d}</motion.span>
          ))}
        </AnimatePresence>
        {suffix ? <span className="inline-block">{suffix}</span> : null}
      </span>
    </span>
  );
}
