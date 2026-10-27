"use client";

/**
 * Pinned card deck (R18, modelled on Swaseekh's feature stack). The whole deck — heading included — pins
 * under the navbar while you scroll through it; each new card slides up over the pile, and the earlier
 * cards step back: a little narrower and higher each, so only their coloured top edges show above the
 * active card. Scrolling past the last card releases the pin with no empty gap.
 * Works inside the app's own scroll container. Phones and reduced motion: a plain list.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";

const BAR = 64;          // the navbar sits above the app's scroll box (which starts at 64px)
const GAP = 8;           // pinned this far below the top of the scroll box
const NAV = BAR + GAP;   // where the deck pins, in viewport coordinates
const LIP = 16;          // how much of each earlier card shows above the next
const SHRINK = 0.035;    // width lost per step back
const MAX_BACK = 5;      // older cards beyond this hide under the pile
const PER_CARD = 0.6;    // scroll distance per card, in viewport heights

function scrollParent(el: HTMLElement | null): HTMLElement | Window {
  for (let p = el?.parentElement; p; p = p.parentElement) {
    const o = getComputedStyle(p).overflowY;
    if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight) return p;
  }
  return window;
}

export function StackCards({ items, header, aside }: { items: ReactNode[]; header?: ReactNode; aside?: ReactNode }) {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0); // 0 .. items.length - 1, fractional while a card slides in
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setWide(mq.matches);
    set(); mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (reduce || !wide) return;
    const sc = scrollParent(wrap.current);
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const travel = el.offsetHeight - (window.innerHeight - BAR - 2 * GAP);
      const done = Math.min(1, Math.max(0, (NAV - el.getBoundingClientRect().top) / Math.max(1, travel)));
      setPos(done * (items.length - 1));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    sc.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { sc.removeEventListener("scroll", on); window.removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [reduce, wide, items.length]);

  if (reduce || !wide) return <div>{header}<div className="space-y-4">{items}</div></div>;

  return (
    <div ref={wrap} className="relative" style={{ height: `calc(${(items.length - 1) * PER_CARD * 100}vh + 100vh - ${BAR + 2 * GAP}px)` }}>
      <div className="sticky flex flex-col justify-start" style={{ top: GAP, height: `calc(100vh - ${BAR + 2 * GAP}px)` }}>
        {aside}
        {header}
        {/* Card area sits right under the heading and never grows past a comfortable card height. */}
        <div className="relative min-h-0 flex-1" style={{ paddingTop: MAX_BACK * LIP, maxHeight: 520 }}>
          <div className="relative h-full">
            {items.map((it, i) => {
              // d > 0: card i is d steps behind the front; d in (-1, 0): it is sliding in from below.
              const d = pos - i;
              const entering = d < 0;
              const back = Math.min(Math.max(d, 0), MAX_BACK + 1);
              const y = entering ? Math.min(-d, 1) * 110 : -back * LIP;
              const scale = 1 - back * SHRINK;
              const hidden = d <= -1 || d > MAX_BACK + 1;
              return (
                <div key={i} aria-hidden={d > 0.5 || d < -0.5} className="absolute inset-0 origin-top will-change-transform"
                  style={{
                    transform: entering ? `translateY(${y}%)` : `translateY(${y}px) scale(${scale})`,
                    zIndex: i + 1, visibility: hidden ? "hidden" : "visible",
                    filter: back > 0 ? `brightness(${1 - Math.min(back, 3) * 0.03})` : undefined,
                  }}>
                  <div className="h-full overflow-hidden rounded-[var(--card-radius)] shadow-[0_-12px_40px_-24px_rgba(22,18,58,.35)] [&>*]:h-full">{it}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
