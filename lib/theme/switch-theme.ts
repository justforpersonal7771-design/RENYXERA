"use client";
/**
 * Light/dark switch with a circular reveal that grows from the button that was pressed (View Transitions API).
 * Browsers without it, and reduced motion, switch instantly.
 */
export function switchTheme(next: string, apply: (t: string) => void, from?: { x: number; y: number }) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) { apply(next); return; }
  const x = from?.x ?? window.innerWidth - 80, y = from?.y ?? 40;
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  document.documentElement.classList.add("theme-switching");
  const t = doc.startViewTransition(() => { apply(next); });
  t.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: "cubic-bezier(.65,0,.35,1)", pseudoElement: "::view-transition-new(root)" },
    ).finished.finally(() => document.documentElement.classList.remove("theme-switching"));
  }).catch(() => document.documentElement.classList.remove("theme-switching"));
}
