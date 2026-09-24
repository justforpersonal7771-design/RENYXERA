"use client";

import { useEffect } from "react";

/**
 * Makes the app's hide-until-hover scrollbars (app/globals.css) also reveal
 * themselves during an actual scroll gesture — trackpad, mouse wheel, or a drag on the
 * thumb itself — not just while the pointer happens to be hovering the scrollable area.
 * Without this, scrolling with a mouse wheel from outside the scrollable region (a very
 * common way to scroll) would leave the bar invisible the whole time, no indication
 * where you are in the content.
 *
 * A single document-level listener with `capture: true` catches the `scroll` event on
 * every scrollable element in the app (native `scroll` doesn't bubble, so this has to
 * use the capture phase rather than a normal bubble-phase listener) — one mount here
 * covers every one of the 24+ `.custom-scrollbar` usages and the page-level scroll,
 * rather than needing each of them wired up individually. Mounted once, in the root
 * layout, for the whole app.
 */
export function ScrollbarActivity() {
  useEffect(() => {
    const timers = new WeakMap<EventTarget, ReturnType<typeof setTimeout>>();

    const handleScroll = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      target.setAttribute("data-scrolling", "true");

      const existing = timers.get(target);
      if (existing) clearTimeout(existing);

      const timer = setTimeout(() => {
        target.removeAttribute("data-scrolling");
        timers.delete(target);
      }, 900);

      timers.set(target, timer);
    };

    document.addEventListener("scroll", handleScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", handleScroll, true);
  }, []);

  return null;
}
