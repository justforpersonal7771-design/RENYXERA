"use client";

import { useEffect } from "react";

const REVEAL_ATTR = "data-scrollbar-reveal";
const HIDE_DELAY_MS = 900;

/**
 * Drives the app's hide-until-active scrollbars (app/globals.css) entirely from JS,
 * setting a single `data-scrollbar-reveal` attribute rather than relying on CSS
 * `:hover` on the WebKit scrollbar pseudo-elements. That combination proved unreliable
 * in the field (confirmed live: scrollbars kept showing fully visible at rest despite
 * `opacity: 0` + `:hover` rules that passed automated headless-browser testing) — moving
 * the whole show/hide decision into one JS listener, checked directly against real
 * pointer/scroll activity, removes that ambiguity rather than debugging it further.
 *
 * Reveals on either signal, on whichever scrollable element it happens on:
 *  - an actual scroll gesture (wheel, trackpad, thumb drag)
 *  - the pointer moving over the scrollable area (not just sitting still over it)
 * and hides again ~900ms after the last of either. A single pair of document-level,
 * capture-phase listeners covers every `.custom-scrollbar` usage in the app (`scroll`
 * doesn't bubble, so capture is required to catch it on the actual scrolling element;
 * `mousemove` is delegated the same way for one shared implementation) — nothing to
 * wire up per component. Mounted once in the root layout.
 */
export function ScrollbarActivity() {
  useEffect(() => {
    const timers = new WeakMap<Element, ReturnType<typeof setTimeout>>();

    const reveal = (target: Element) => {
      target.setAttribute(REVEAL_ATTR, "true");
      const existing = timers.get(target);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(() => {
        target.removeAttribute(REVEAL_ATTR);
        timers.delete(target);
      }, HIDE_DELAY_MS);
      timers.set(target, timer);
    };

    const handleScroll = (event: Event) => {
      if (event.target instanceof Element) reveal(event.target);
    };

    // mousemove doesn't need capture to find the scrollable element itself — it fires
    // directly on whatever's under the cursor — but a scrollable container's own
    // children (cards, buttons inside it) are what's actually under the pointer most of
    // the time, so walk up to the nearest `.custom-scrollbar` ancestor.
    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const scrollable = target.closest(".custom-scrollbar");
      if (scrollable) reveal(scrollable);
    };

    document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return null;
}
