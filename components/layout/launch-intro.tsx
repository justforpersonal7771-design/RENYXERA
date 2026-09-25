"use client";

import { BrandMark, Wordmark } from "@/components/brand/wordmark";

/**
 * First-load splash, once per browser tab.
 *
 * Deliberately has no state and no effects: it's part of the server-rendered HTML and
 * its whole enter → hold → fade-out sequence is CSS (.intro-splash in globals.css). The
 * previous version waited for hydration (`mounted`) before rendering, so a first visit
 * actually went page → splash pops in → splash fades → page: the "in and out" flicker.
 * Now the splash is the first thing painted and only ever fades away once.
 *
 * html[data-intro-seen] (set before paint by the head script in app/layout.tsx when the
 * tab has already seen it) hides it entirely. It's also set here when the fade ends, so
 * remounting this layout later in the same tab (e.g. coming back from /login) doesn't
 * replay it.
 */
export function LaunchIntro() {
  return (
    <div
      aria-hidden="true"
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) document.documentElement.setAttribute("data-intro-seen", "");
      }}
      className="intro-splash fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-[#f7f8ff] dark:bg-[#05060a]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 45% 35% at 50% 42%, rgba(91,33,224,0.16), transparent 70%), radial-gradient(ellipse 30% 25% at 58% 55%, rgba(221,66,251,0.10), transparent 70%)",
        }}
      />
      <div className="intro-mark relative">
        <BrandMark className="h-20 w-20 drop-shadow-[0_10px_30px_rgba(79,70,229,0.45)]" />
      </div>
      <div className="intro-text relative flex flex-col items-center gap-3">
        <Wordmark size="xl" />
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-[var(--text-secondary)]">
          A new era of intelligent learning
        </span>
      </div>
      <div className="intro-bar relative w-36 h-[3px] rounded-full bg-[var(--border)] overflow-hidden" />
    </div>
  );
}
