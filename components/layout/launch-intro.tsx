"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";

const SESSION_KEY = "renyxera_intro_seen";

export function LaunchIntro() {
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Once per browser tab, not once per install — a returning visitor mid-session
    // (e.g. after a route change) should never see this again, but a fresh tab should.
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    setVisible(true);
    const holdMs = prefersReducedMotion ? 300 : 1500;
    const timer = setTimeout(() => setVisible(false), holdMs);
    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  if (!mounted) return null;

  const isLight = resolvedTheme === "light";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5"
          style={{ background: isLight ? "#f8f9ff" : "#05060a" }}
        >
          <motion.img
            src={isLight ? "/brand/mark-light.png" : "/brand/mark-dark.png"}
            alt="RENYXERA"
            className="w-20 h-20 rounded-2xl shadow-2xl shadow-indigo-600/30"
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="font-black text-2xl tracking-tight"
              style={{ color: isLight ? "#0f172a" : "#ffffff" }}
            >
              RENYX
              <span className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                ERA
              </span>
            </span>
            <span
              className="text-[11px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: isLight ? "#64748b" : "#94a3b8" }}
            >
              A New <span className="text-indigo-400">Era</span> of Intelligent Learning
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
