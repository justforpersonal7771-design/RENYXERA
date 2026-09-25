"use client";

import { useEffect } from "react";

/**
 * One document-level pointer listener that gives every `.card-glass` / `.spotlight`
 * surface in the app a glow that follows the cursor (styles in globals.css). Done
 * once here instead of wrapping hundreds of cards in a component: it costs one
 * listener and at most one style write per animation frame. Skipped entirely for
 * touch-only devices and for users who ask for reduced motion.
 */
export function CardSpotlight() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let active: HTMLElement | null = null;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;

    const clear = () => {
      if (active) active.removeAttribute("data-spot");
      active = null;
    };

    const paint = () => {
      raf = 0;
      const hit = document.elementFromPoint(lastX, lastY);
      const card = hit instanceof Element ? (hit.closest(".card-glass, .spotlight") as HTMLElement | null) : null;
      if (card !== active) {
        clear();
        active = card;
      }
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${lastX - r.left}px`);
      card.style.setProperty("--my", `${lastY - r.top}px`);
      card.setAttribute("data-spot", "");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", clear);
    window.addEventListener("blur", clear);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", clear);
      window.removeEventListener("blur", clear);
      if (raf) cancelAnimationFrame(raf);
      clear();
    };
  }, []);

  return null;
}
