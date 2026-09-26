"use client";

import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { usePreferencesStore } from "@/store/use-preferences-store";

/**
 * Applies the Reduce-motion preference everywhere: motion/react animations via
 * MotionConfig, and CSS animations/transitions via html[data-motion] (see globals.css).
 * "system" follows the OS setting, as before.
 */
export function MotionPrefs({ children }: { children: React.ReactNode }) {
  const motion = usePreferencesStore((s) => s.motion);
  useEffect(() => {
    document.documentElement.dataset.motion = motion;
  }, [motion]);
  return (
    <MotionConfig reducedMotion={motion === "reduce" ? "always" : motion === "full" ? "never" : "user"}>
      {children}
    </MotionConfig>
  );
}
