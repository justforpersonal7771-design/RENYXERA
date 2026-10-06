"use client";

import { useEffect, useRef, useState } from "react";
import { useFullscreenState } from "@/components/ui/fullscreen-toggle";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FullscreenNavigationProps {
  onPrev?: () => void;
  onNext?: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
}

/**
 * Fullscreen question navigation. The arrows stay invisible so they never cover the question
 * or options; touching/hovering a screen edge fades them in (still translucent). Swiping
 * left/right anywhere on the question moves to the next/previous question.
 */
export function FullscreenNavigation({
  onPrev,
  onNext,
  isPrevDisabled = false,
  isNextDisabled = false,
}: FullscreenNavigationProps) {
  const isFullscreen = useFullscreenState();
  const [peek, setPeek] = useState(false);
  const peekTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cb = useRef({ onPrev, onNext, isPrevDisabled, isNextDisabled });
  useEffect(() => { cb.current = { onPrev, onNext, isPrevDisabled, isNextDisabled }; });

  const showBriefly = () => {
    setPeek(true);
    if (peekTimer.current) clearTimeout(peekTimer.current);
    peekTimer.current = setTimeout(() => setPeek(false), 1800);
  };

  useEffect(() => {
    if (!isFullscreen) return;
    let sx = 0, sy = 0, t0 = 0, ok = false;
    const skip = (el: EventTarget | null) =>
      el instanceof Element && !!el.closest("pre, code, input, textarea, [data-no-swipe], .overflow-x-auto, [role=dialog]");
    const start = (e: TouchEvent) => {
      if (e.touches.length !== 1 || skip(e.target)) { ok = false; return; }
      ok = true; sx = e.touches[0].clientX; sy = e.touches[0].clientY; t0 = Date.now();
    };
    const end = (e: TouchEvent) => {
      if (!ok) return;
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.8 || Date.now() - t0 > 700) return;
      const c = cb.current;
      if (dx < 0 && c.onNext && !c.isNextDisabled) c.onNext();
      if (dx > 0 && c.onPrev && !c.isPrevDisabled) c.onPrev();
    };
    document.addEventListener("touchstart", start, { passive: true });
    document.addEventListener("touchend", end, { passive: true });
    return () => { document.removeEventListener("touchstart", start); document.removeEventListener("touchend", end); };
  }, [isFullscreen]);

  useEffect(() => () => { if (peekTimer.current) clearTimeout(peekTimer.current); }, []);

  if (!isFullscreen) return null;

  const btn = (side: "l" | "r") =>
    `absolute top-1/2 -translate-y-1/2 ${side === "l" ? "left-1" : "right-1"} w-9 h-9 rounded-full flex items-center justify-center text-white/90 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 cursor-pointer focus:outline-none focus-visible:opacity-70 hover:opacity-70 ${peek ? "opacity-50" : "opacity-0"}`;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      {!isPrevDisabled && onPrev && (
        <div className="pointer-events-auto absolute inset-y-0 left-0 w-10" onMouseEnter={showBriefly} onTouchStart={showBriefly}>
          <button type="button" onClick={onPrev} className={btn("l")} title="Previous question" aria-label="Previous question">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
      {!isNextDisabled && onNext && (
        <div className="pointer-events-auto absolute inset-y-0 right-0 w-10" onMouseEnter={showBriefly} onTouchStart={showBriefly}>
          <button type="button" onClick={onNext} className={btn("r")} title="Next question" aria-label="Next question">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
