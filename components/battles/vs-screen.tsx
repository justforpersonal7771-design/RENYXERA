"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Swords } from "lucide-react";

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

/**
 * "Match found": two players face each other, then a 3-2-1 countdown, then `onDone`. Used when a friend is challenged to play right now
 * (the challenger after deploying, the friend after pressing Play now). Skippable with Esc or a click on the screen.
 */
export function VsScreen({ me, opponent, title, onDone }: { me: string; opponent: string; title: string; onDone: () => void }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n === 0) { const t = setTimeout(onDone, 450); return () => clearTimeout(t); }
    const t = setTimeout(() => setN((x) => x - 1), 850);
    return () => clearTimeout(t);
  }, [n, onDone]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onDone(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onDone]);

  const side = (name: string, dir: -1 | 1, tone: string) => (
    <motion.div initial={reduce ? false : { x: dir * 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 18 }} className="flex w-28 flex-col items-center gap-3 sm:w-44">
      <span className="grid h-20 w-20 place-items-center rounded-full text-2xl font-black text-white shadow-[0_18px_40px_-12px_rgba(0,0,0,.6)] ring-4 ring-white/20 sm:h-28 sm:w-28 sm:text-4xl" style={{ background: tone }}>{initials(name)}</span>
      <span className="max-w-full truncate text-base font-extrabold text-white sm:text-xl">{name}</span>
    </motion.div>
  );
  return (
    <motion.div role="dialog" aria-modal="true" aria-label="Match found" onClick={onDone} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-[600] grid cursor-pointer place-items-center bg-[radial-gradient(ellipse_at_center,#2b2160_0%,#0d0b24_70%)] px-4">
      <div className="text-center">
        <p className="text-sm font-bold text-white/70">Match found</p>
        <div className="mt-6 flex items-center justify-center gap-4 sm:gap-10">
          {side(me, -1, "linear-gradient(135deg,#6366f1,#8b5cf6)")}
          <motion.span initial={reduce ? false : { scale: 0.2, rotate: -40, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ delay: 0.25, type: "spring", stiffness: 260, damping: 14 }}
            className="grid h-14 w-14 place-items-center rounded-full bg-amber-400 text-[#1b1530] shadow-[0_0_40px_rgba(251,191,36,.6)] sm:h-20 sm:w-20"><Swords className="h-7 w-7 sm:h-9 sm:w-9" aria-hidden /></motion.span>
          {side(opponent, 1, "linear-gradient(135deg,#f43f5e,#fb923c)")}
        </div>
        <p className="mx-auto mt-8 max-w-sm truncate text-sm text-white/70">{title}</p>
        <motion.p key={n} initial={reduce ? false : { scale: 1.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} aria-live="assertive"
          className="mt-3 font-display text-7xl font-black text-white sm:text-8xl">{n === 0 ? "Go!" : n}</motion.p>
        <p className="mt-4 text-xs text-white/50">Tap anywhere to skip</p>
      </div>
    </motion.div>
  );
}
