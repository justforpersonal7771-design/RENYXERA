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
  const [scales, setScales] = useState<number[]>(() => items.map(() => 1));

  useEffect(() => {
    if (reduce) return;
    const sc = scrollParent(wrap.current);
    let raf = 0;
    const update = () => {
      raf = 0;
      const els = refs.current;
      const next = els.map((el, i) => {
        const nxt = els[i + 1];
        if (!el || !nxt) return 1;
        const a = el.getBoundingClientRect(), b = nxt.getBoundingClientRect();
        // 0 when the next card is a card-height away, 1 when it has fully covered this one.
        const p = Math.min(1, Math.max(0, (a.bottom - b.top) / Math.max(1, a.height)));
        return 1 - 0.1 * p;
      });
      setScales((old) => (old.every((v, i) => Math.abs(v - next[i]) < 0.002) ? old : next));
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
          <div className="origin-top transition-[filter] duration-200 will-change-transform"
            style={{ transform: `scale(${scales[i] ?? 1})`, filter: `brightness(${0.85 + 0.15 * ((scales[i] ?? 1) - 0.9) / 0.1})` }}>
            {it}
          </div>
        </div>
      ))}
      {/* room for the last card to finish pinning */}
      <div aria-hidden className="h-[20vh]" />
    </div>
  );
}
