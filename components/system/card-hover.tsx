"use client";

import { useEffect } from "react";

/**
 * Drives the premium card hover (CSS in app/globals.css, "Premium card hover"). One passive pointermove listener for the whole app finds the
 * .card-pastel under a MOUSE or pen, stores the pointer position on it (--mx / --my) and marks it data-hot; the CSS draws the spotlight, the lit
 * edge and the lift. Touch pointers are ignored on purpose: a finger has no hover, so nothing can get stuck "hot" after a tap.
 * At most one card is hot at a time; leaving the window cools it. Cheap: one style write per animation frame.
 */
export function CardHover() {
  useEffect(() => {
    if (!window.matchMedia?.("(hover: hover) and (pointer: fine)").matches) return;
    let hot: HTMLElement | null = null;
    let frame = 0;
    let last: PointerEvent | null = null;

    const cool = () => { if (hot) { hot.removeAttribute("data-hot"); hot.style.removeProperty("--mx"); hot.style.removeProperty("--my"); hot = null; } };
    const paint = () => {
      frame = 0;
      const e = last; if (!e) return;
      const card = (e.target as Element | null)?.closest?.(".card-pastel") as HTMLElement | null;
      if (card !== hot) { cool(); if (card) { hot = card; card.setAttribute("data-hot", ""); } }
      if (hot) { const r = hot.getBoundingClientRect(); hot.style.setProperty("--mx", `${e.clientX - r.left}px`); hot.style.setProperty("--my", `${e.clientY - r.top}px`); }
    };
    const onMove = (e: PointerEvent) => { if (e.pointerType === "touch") return; last = e; if (!frame) frame = requestAnimationFrame(paint); };
    const onLeave = () => cool();

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => { document.removeEventListener("pointermove", onMove); document.documentElement.removeEventListener("pointerleave", onLeave); window.removeEventListener("blur", onLeave); if (frame) cancelAnimationFrame(frame); cool(); };
  }, []);
  return null;
}
