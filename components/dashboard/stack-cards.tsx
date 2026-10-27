"use client";

/**
 * Sticky stacking cards (R18 B1). Each card pins near the top of the scroll area; as the next card
 * slides over it, the earlier one shrinks and dims a little, so finished cards peek out above like a
 * deck. Works inside the app's own scroll container (not the window). Reduced motion: a plain list.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

function scrollParent(el: HTMLElement | null): HTMLElement | Window {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight) return p;
  }
  return window;
}

export function StackCards({ items, top = 76, step = 14 }: { items: ReactNode[]; top?: number; step?: number }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  // p per card: 0 = fully visible, 1 = fully covered by the next card.
  const [prog, setProg] = useState<number[]>(() => items.map(() => 0));
  const [heights, setHeights] = useState<number[]>(() => items.map(() => 0));

  useEffect(() => {
    if (reduce) return;
    const sc = scrollParent(wrap.current);
    let raf = 0;
    const update = () => {
      raf = 0;
      const els = refs.current;
      const next = els.map((el, i) => {
        const nxt = els[i + 1];
        if (!el || !nxt) return 0;
        const a = el.getBoundingClientRect(), b = nxt.getBoundingClientRect();
        return Math.min(1, Math.max(0, (a.bottom - b.top) / Math.max(1, a.height)));
      });
      setProg((old) => (old.every((v, i) => Math.abs(v - next[i]) < 0.003) ? old : next));
      setHeights(els.map((el) => el?.offsetHeight ?? 0));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    sc.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { sc.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [reduce, items.length]);

  if (reduce) return <div className="space-y-4">{items}</div>;
  return (
    <div ref={wrap} className="relative">
      {items.map((it, i) => (
        <div key={i} ref={(el) => { refs.current[i] = el; }} className="sticky pb-6" style={{ top: top + i * step, zIndex: i + 1 }}>
          {(() => {
            const p = prog[i] ?? 0;
            // Covered cards shrink, and are clipped to a thin top edge so only a tidy lip peeks out
            // above the next card (no half-hidden content showing below it).
            const keep = Math.max(step + 10, (heights[i] || 0) * (1 - p));
            return (
              <div className="origin-top will-change-transform"
                style={{ transform: `scale(${1 - 0.06 * p})`, clipPath: p > 0 ? `inset(0 0 calc(100% - ${keep}px) 0 round var(--card-radius))` : undefined }}>
                <div style={{ filter: p > 0 ? `brightness(${1 - 0.08 * p}) saturate(${1 - 0.3 * p})` : undefined }}>{it}</div>
              </div>
            );
          })()}
        </div>
      ))}
      {/* room for the last card to finish pinning */}
      <div aria-hidden className="h-[20vh]" />
    </div>
  );
}
