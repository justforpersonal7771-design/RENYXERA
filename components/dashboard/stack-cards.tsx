"use client";

/**
 * Pinned card deck (R18, modelled on Swaseekh's feature stack). The whole deck, heading included, pins
 * under the navbar while you scroll through it; each new card slides up over the pile, and the earlier
 * cards step back: a little narrower and higher each, so only their coloured top edges show above the
 * active card. Scrolling past the last card releases the pin with no empty gap.
 * Works inside the app's own scroll container, on desktop and on phones (a tighter pile that fits above the bottom dock).
 * Reduced motion: a plain list.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

function scrollParent(el: HTMLElement | null): HTMLElement | Window {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight + 1) return p;
  }
  return window;
}

type Cfg = { gap: number; stage: number; lip: number; shrink: number; maxBack: number; perCard: number; bottom: number };
const DESK: Cfg = { gap: 8, stage: 720, lip: 16, shrink: 0.035, maxBack: 5, perCard: 0.6, bottom: 0 };
// Phones: the floating dock covers the bottom ~96px, so the pinned block stops above it; the pile is shallower so the card keeps its room.
const PHONE: Cfg = { gap: 6, stage: 760, lip: 9, shrink: 0.045, maxBack: 3, perCard: 0.7, bottom: 100 };

export function StackCards({ items, header, aside }: { items: ReactNode[]; header?: ReactNode; aside?: ReactNode }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0); // 0 .. items.length - 1, fractional while a card slides in
  const [phone, setPhone] = useState(false);
  const [top, setTop] = useState(72);  // where the scroll box starts in the viewport (below the navbar)
  const cfg = phone ? PHONE : DESK;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setPhone(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const sc = scrollParent(wrap.current);
    const box = () => (sc instanceof HTMLElement ? sc.getBoundingClientRect().top : 0);
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const t = box();
      setTop((p) => (Math.abs(p - t) > 0.5 ? t : p));
      // distance the pinned block travels = wrapper height minus the pinned block's own height
      const pinned = (el.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
      const travel = el.offsetHeight - pinned;
      const done = Math.min(1, Math.max(0, (t + cfg.gap - el.getBoundingClientRect().top) / Math.max(1, travel)));
      setPos(done * (items.length - 1));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    sc.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { sc.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [reduce, cfg, items.length]);

  if (reduce) return <div>{header}<div className="space-y-4">{items}</div></div>;

  return (
    // The pinned block is only as tall as heading + pile + a card (max stage), with room below the card,
    // so the tinted frame hugs the deck instead of stretching to the screen.
    <div ref={wrap} className="relative" style={{ height: `calc(${(items.length - 1) * cfg.perCard * 100}vh + ${cfg.stage}px)` }}>
      <div className="sticky flex flex-col justify-start pb-6" style={{ top: cfg.gap, height: `min(calc(100vh - ${top + 2 * cfg.gap + cfg.bottom}px), ${cfg.stage}px)` }}>
        {aside}
        {header}
        <div className="relative min-h-0 flex-1" style={{ paddingTop: cfg.maxBack * cfg.lip }}>
          <div className="relative h-full">
            {items.map((it, i) => {
              // d > 0: card i is d steps behind the front; d in (-1, 0): it is sliding in from below.
              const d = pos - i;
              const entering = d < 0;
              const back = Math.min(Math.max(d, 0), cfg.maxBack + 1);
              const y = entering ? Math.min(-d, 1) * 110 : -back * cfg.lip;
              const scale = 1 - back * cfg.shrink;
              const hidden = d <= -1 || d > cfg.maxBack + 1;
              return (
                <div key={i} aria-hidden={d > 0.5 || d < -0.5} className="absolute inset-0 origin-top will-change-transform"
                  style={{
                    transform: entering ? `translateY(${y}%)` : `translateY(${y}px) scale(${scale})`,
                    zIndex: i + 1, visibility: hidden ? "hidden" : "visible",
                    filter: back > 0 ? `brightness(${1 - Math.min(back, 3) * 0.03})` : undefined,
                  }}>
                  <div className="h-full overflow-hidden rounded-[var(--card-radius)] bg-[var(--background)] shadow-[0_-12px_40px_-24px_rgba(22,18,58,.35)] [&>*]:h-full">{it}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
