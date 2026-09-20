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
            className="h-24 w-auto object-contain drop-shadow-[0_8px_28px_rgba(79,70,229,0.4)]"
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.35, ease: "easeOut" }}
            className="flex flex-col items-center gap-3"
          >
            <img
              src={isLight ? "/brand/wordmark-light.png" : "/brand/wordmark-dark.png"}
              alt="RENYXERA"
              className="h-8 w-auto"
            />
            <img
              src={isLight ? "/brand/tagline-light.png" : "/brand/tagline-dark.png"}
              alt="A New ERA of Intelligent Learning"
              className="h-3.5 w-auto opacity-90"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
