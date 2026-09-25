"use client";

import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface FullscreenToggleProps {
  targetRef?: React.RefObject<HTMLElement | null>;
  targetId?: string;
  className?: string;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * Full-screen toggle with a smooth transition both ways. The browser switches to and
 * from full screen instantly, so the element itself is animated: on the way in it
 * fades/zooms up once it's full screen; on the way out it fades/zooms down first, then
 * leaves full screen and settles back into the page.
 */
export function FullscreenToggle({ targetRef, targetId, className }: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getTarget = useCallback(
    () => targetRef?.current || (targetId ? document.getElementById(targetId) : null),
    [targetRef, targetId],
  );

  useEffect(() => {
    const onChange = () => {
      const fs = document.fullscreenElement as HTMLElement | null;
      setIsFullscreen(!!fs);
      if (reduce) return;
      if (fs) {
        fs.animate(
          [{ opacity: 0.4, transform: "scale(0.97)" }, { opacity: 1, transform: "scale(1)" }],
          { duration: 320, easing: EASE },
        );
      } else {
        getTarget()?.animate(
          [{ opacity: 0.5, transform: "scale(1.015)" }, { opacity: 1, transform: "scale(1)" }],
          { duration: 300, easing: EASE },
        );
      }
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [getTarget, reduce]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      const el = getTarget();
      el?.requestFullscreen?.().catch((err) => console.error(`Error attempting to enable fullscreen: ${err.message}`));
    } else {
      const fs = document.fullscreenElement as HTMLElement;
      if (!reduce) {
        try {
          await fs.animate(
            [{ opacity: 1, transform: "scale(1)" }, { opacity: 0.35, transform: "scale(0.97)" }],
            { duration: 180, easing: "ease-in", fill: "forwards" },
          ).finished;
        } catch { /* ignore */ }
      }
      await document.exitFullscreen?.().catch(() => {});
      fs.getAnimations().forEach((a) => a.cancel());
    }
  }, [getTarget, reduce]);

  return (
    <button
      onClick={toggleFullscreen}
      className={`group p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:border-violet-400/60 transition-colors shadow-sm cursor-pointer ${className || ""}`}
      title={isFullscreen ? "Exit full screen" : "Full screen"}
      aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
    >
      {isFullscreen ? (
        <Minimize className="w-4 h-4 transition-transform duration-300 group-hover:scale-90" />
      ) : (
        <Maximize className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
      )}
    </button>
  );
}
