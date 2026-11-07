"use client";

/**
 * Pinned card deck (R18, modelled on Swaseekh's feature stack). Two engines, same props:
 *
 *  - Classic (every look except Lunar): the original. The whole deck, heading included, pins under the navbar while you scroll; each new card
 *    slides up over the pile and the earlier cards step back. Phones and reduced motion: a plain list.
 *
 *  - Lunar: rebuilt for speed and exactness (docs/design/MOTION-INTERACTION-CATALOGUE.md, "The existing deck"). The browser pins the cards
 *    with native `position: sticky`, so they move in lockstep with the scroll with no JavaScript in the way; only the scale and the soft dim of
 *    the cards behind are driven from the scroll position, through motion values (no React re-render per scroll event) and `transform` /
 *    `opacity` only. A short run between cards keeps the whole deck about a third shorter, a dot rail shows where you are and jumps on click.
 *    Phones and reduced motion keep the plain list.
 */
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useIsLunar } from "@/lib/looks/use-lunar";

const BAR = 72;          // the navbar sits above the app's scroll box (which starts at 72px)
const GAP = 8;           // pinned this far below the top of the scroll box
const NAV = BAR + GAP;   // where the deck pins, in viewport coordinates
const STAGE = 720;       // pinned block height cap: heading + pile lips + a ~520px card + bottom room
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

export function StackCards(props: { items: ReactNode[]; header?: ReactNode; aside?: ReactNode }) {
  const lunar = useIsLunar();
  return lunar ? <LunarStack {...props} /> : <ClassicStack {...props} />;
}

/* ───────────────────────── Lunar engine ───────────────────────── */

const L_GAP = 12;      // first card pins this far below the top of the scroll box
const L_LIP = 14;      // each later card pins this much lower, so earlier cards show a lip
const L_RUN = 64;      // scroll run between one card's bottom and the next card's top (short = fast)
const L_SHRINK = 0.032;
const L_MAX_BACK = 4;

function LunarStack({ items, header }: { items: ReactNode[]; header?: ReactNode }) {
  const reduce = useReducedMotion();
  const probe = useRef<HTMLDivElement>(null);
  const [sc, setSc] = useState<HTMLElement | null>(null);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setWide(mq.matches);
    set(); mq.addEventListener("change", set);
    const p = scrollParent(probe.current);
    setSc(p instanceof HTMLElement ? p : null);
    return () => mq.removeEventListener("change", set);
  }, []);
  if (reduce || !wide || !sc) return <div ref={probe}>{header}<div className="space-y-4">{items}</div></div>;
  return <StickyDeck items={items} header={header} sc={sc} />;
}

function StickyDeck({ items, header, sc }: { items: ReactNode[]; header?: ReactNode; sc: HTMLElement }) {
  const n = items.length;
  const stack = useRef<HTMLDivElement>(null);
  const scRef = useRef<HTMLElement | null>(sc);
  const { scrollY } = useScroll({ container: scRef });
  const geo = useRef({ start: 0, step: 1 });       // where the deck begins in scroll px, and scroll px per card
  const [cardH, setCardH] = useState(440);

  useLayoutEffect(() => {
    const measure = () => {
      const el = stack.current;
      if (!el) return;
      // a card must fit in the scroll box together with the lips of the cards behind it
      const h = Math.round(Math.max(360, Math.min(470, sc.clientHeight - L_GAP - (n - 1) * L_LIP - 40)));
      const top = el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop;
      geo.current = { start: top - L_GAP, step: h + L_RUN - L_LIP };
      setCardH((prev) => (prev === h ? prev : h));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sc); if (stack.current) ro.observe(stack.current);
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, [sc, n]);

  // q = index of the card that is fully pinned right now (fractional while the next one slides in)
  const q = useTransform(scrollY, (y) => (y - geo.current.start) / geo.current.step);

  return (
    <div>
      {header}
      <div ref={stack} className="relative" style={{ paddingBottom: 8 }}>
        {items.map((it, i) => (
          <DeckCard key={i} i={i} q={q} cardH={cardH} last={i === n - 1}>{it}</DeckCard>
        ))}
        <Rail n={n} q={q} onJump={(i) => sc.scrollTo({ top: Math.max(0, geo.current.start + i * geo.current.step + 2), behavior: "smooth" })} />
      </div>
    </div>
  );
}

function DeckCard({ i, q, cardH, last, children }: { i: number; q: MotionValue<number>; cardH: number; last: boolean; children: ReactNode }) {
  const back = useTransform(q, (v) => Math.min(Math.max(v - i, 0), L_MAX_BACK + 1));
  const scale = useTransform(back, (b) => 1 - b * L_SHRINK);
  const dim = useTransform(back, (b) => Math.min(b, 3) * 0.05);
  return (
    <motion.div
      className="sticky origin-top will-change-transform"
      style={{ top: L_GAP + i * L_LIP, height: cardH, marginBottom: last ? 0 : L_RUN, scale, zIndex: i + 1, contain: "layout paint" }}
    >
      <div className="relative h-full overflow-hidden rounded-[var(--card-radius)] bg-[var(--background)] shadow-[0_-14px_40px_-26px_rgba(22,18,58,.4)] [&>*]:h-full">
        {children}
        <motion.div aria-hidden className="pointer-events-none absolute inset-0 bg-[#1a1c29] dark:bg-black" style={{ opacity: dim }} />
      </div>
    </motion.div>
  );
}

function Rail({ n, q, onJump }: { n: number; q: MotionValue<number>; onJump: (i: number) => void }) {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-5 xl:block">
      <div className="pointer-events-auto sticky top-1/3 flex flex-col items-center gap-2 pt-24">
        {Array.from({ length: n }, (_, i) => <RailDot key={i} i={i} n={n} q={q} onJump={onJump} />)}
      </div>
    </div>
  );
}

function RailDot({ i, n, q, onJump }: { i: number; n: number; q: MotionValue<number>; onJump: (i: number) => void }) {
  const near = useTransform(q, (v) => 1 - Math.min(Math.abs(v - i), 1));
  const height = useTransform(near, (x) => 9 + x * 17);
  const opacity = useTransform(near, (x) => 0.28 + x * 0.72);
  return (
    <button type="button" aria-label={`Go to card ${i + 1} of ${n}`} onClick={() => onJump(i)} className="grid h-7 w-5 cursor-pointer place-items-center">
      <motion.span className="block w-[9px] rounded-full bg-[var(--text-primary)]" style={{ height, opacity }} />
    </button>
  );
}

/* ───────────────────────── Classic engine (unchanged) ───────────────────────── */

function ClassicStack({ items, header, aside }: { items: ReactNode[]; header?: ReactNode; aside?: ReactNode }) {
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
      // distance the pinned block travels = wrapper height minus the pinned block's own height
      const pinned = (el.firstElementChild as HTMLElement | null)?.offsetHeight ?? 0;
      const travel = el.offsetHeight - pinned;
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
    // The pinned block is only as tall as heading + pile + a card (max STAGE), with room below the card,
    // so the tinted frame hugs the deck instead of stretching to the screen.
    <div ref={wrap} className="relative" style={{ height: `calc(${(items.length - 1) * PER_CARD * 100}vh + ${STAGE}px)` }}>
      <div className="sticky flex flex-col justify-start pb-6" style={{ top: GAP, height: `min(calc(100vh - ${BAR + 2 * GAP}px), ${STAGE}px)` }}>
        {aside}
        {header}
        <div className="relative min-h-0 flex-1" style={{ paddingTop: MAX_BACK * LIP }}>
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
