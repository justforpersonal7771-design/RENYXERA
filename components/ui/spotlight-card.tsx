"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Card with a soft light that follows the pointer (catalogue effect 2). Only on devices that can hover: the overlay is hidden on touch,
 * it adds no blur layer (the cost of the original snippet), and it matches the card's own radius through `rounded-[inherit]`.
 * Wrap the existing card element's content, or pass the card classes to `className`.
 */
export function SpotlightCard({ children, className = "", style, tint = "var(--accent)" }: { children: ReactNode; className?: string; style?: CSSProperties; tint?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - r.left}px`);
      el.style.setProperty("--my", `${clientY - r.top}px`);
    });
  };
  return (
    <div ref={ref} onPointerMove={move} style={style} className={`group relative overflow-hidden ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 [@media(hover:hover)]:group-hover:opacity-100"
        style={{ background: `radial-gradient(520px circle at var(--mx, 50%) var(--my, 0%), color-mix(in srgb, ${tint} 16%, transparent), transparent 45%)` }} />
      <div className="relative">{children}</div>
    </div>
  );
}
