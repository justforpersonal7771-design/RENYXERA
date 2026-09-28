"use client";

import { Maximize, Minimize } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { FS_EVENT, enterFullscreen, exitFullscreen, fullscreenElement, isFullscreen as fsActive, wireFullscreenEvents } from "@/lib/fullscreen";

interface FullscreenToggleProps {
  targetRef?: React.RefObject<HTMLElement | null>;
  targetId?: string;
  className?: string;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Shared full-screen state (native API, or the pinned fallback where there's none, e.g. iPhone). */
export function useFullscreenState() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    wireFullscreenEvents();
    const sync = () => setActive(fsActive());
    sync();
    window.addEventListener(FS_EVENT, sync);
    return () => window.removeEventListener(FS_EVENT, sync);
  }, []);
  return active;
}

/** Full-screen toggle with a smooth transition both ways; works on every browser. */
export function FullscreenToggle({ targetRef, targetId, className }: FullscreenToggleProps) {
  const isFullscreen = useFullscreenState();
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getTarget = useCallback(
    () => targetRef?.current || (targetId ? document.getElementById(targetId) : null),
    [targetRef, targetId],
  );

  useEffect(() => {
    if (!isFullscreen || reduce) return;
    (fullscreenElement() as HTMLElement | null)?.animate(
      [{ opacity: 0.4, transform: "scale(0.98)" }, { opacity: 1, transform: "scale(1)" }],
      { duration: 300, easing: EASE },
    );
  }, [isFullscreen, reduce]);

  const toggleFullscreen = useCallback(async () => {
    if (!fsActive()) {
      await enterFullscreen(getTarget());
      return;
    }
    const fs = fullscreenElement() as HTMLElement | null;
    if (fs && !reduce) {
      try {
        await fs.animate(
          [{ opacity: 1, transform: "scale(1)" }, { opacity: 0.4, transform: "scale(0.98)" }],
          { duration: 160, easing: "ease-in", fill: "forwards" },
        ).finished;
      } catch { /* ignore */ }
    }
    await exitFullscreen();
    fs?.getAnimations().forEach((a) => a.cancel());
  }, [getTarget, reduce]);

  return (
    <button
      onClick={toggleFullscreen}
      className={`group p-2 rounded-lg bg-[var(--surface)] hover:bg-[var(--surface-elevated)] text-[var(--text-primary)] border border-[var(--border)] hover:border-violet-400/60 transition-colors shadow-sm cursor-pointer ${className || ""}`}
      title={isFullscreen ? "Exit full screen" : "Full screen"}
      aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
      aria-pressed={isFullscreen}
    >
      {isFullscreen ? (
        <Minimize className="w-4 h-4 transition-transform duration-300 group-hover:scale-90" />
      ) : (
        <Maximize className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
      )}
    </button>
  );
}
