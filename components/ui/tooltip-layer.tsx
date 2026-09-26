"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

/**
 * App-wide modern tooltips. Any element with a `title` (or `data-tip`) gets a styled,
 * animated tooltip instead of the browser's plain grey box: on first hover the title is
 * moved to data-tip (so the native one never shows) and rendered here — above the
 * element, or below when there's no room, clamped to the screen. Mounted once.
 */
type Tip = { text: string; x: number; y: number; below: boolean; key: number };

export function TooltipLayer() {
  const [tip, setTip] = useState<Tip | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = useRef<Element | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    const clear = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      current.current = null;
      setTip(null);
    };

    const onOver = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const el = (e.target as Element | null)?.closest?.("[title],[data-tip]");
      if (!el || el === current.current) return;
      // SVG <title> children and elements inside iframes keep native behaviour.
      if (el instanceof SVGElement && el.tagName.toLowerCase() === "title") return;
      const native = el.getAttribute("title");
      if (native !== null) {
        if (native.trim()) el.setAttribute("data-tip", native);
        el.removeAttribute("title");
        if (!el.getAttribute("aria-label") && native.trim() && !(el.textContent || "").trim()) el.setAttribute("aria-label", native);
      }
      const text = el.getAttribute("data-tip");
      if (!text) return;
      current.current = el;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (current.current !== el || !el.isConnected) return;
        const r = el.getBoundingClientRect();
        const below = r.top < 56;
        setTip({ text, x: r.left + r.width / 2, y: below ? r.bottom + 10 : r.top - 10, below, key: ++seq.current });
      }, 320);
    };

    const onOut = (e: PointerEvent) => {
      const to = e.relatedTarget as Node | null;
      if (current.current && to && current.current.contains(to)) return;
      clear();
    };

    document.addEventListener("pointerover", onOver, true);
    document.addEventListener("pointerout", onOut, true);
    document.addEventListener("pointerdown", clear, true);
    document.addEventListener("scroll", clear, true);
    window.addEventListener("blur", clear);
    return () => {
      document.removeEventListener("pointerover", onOver, true);
      document.removeEventListener("pointerout", onOut, true);
      document.removeEventListener("pointerdown", clear, true);
      document.removeEventListener("scroll", clear, true);
      window.removeEventListener("blur", clear);
    };
  }, []);

  if (typeof document === "undefined") return null;
  const maxW = 280;
  const left = tip ? Math.min(Math.max(tip.x, maxW / 2 + 8), window.innerWidth - maxW / 2 - 8) : 0;

  return createPortal(
    <AnimatePresence>
      {tip && (
        <motion.div
          key={tip.key}
          role="tooltip"
          initial={{ opacity: 0, y: tip.below ? -6 : 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.1 } }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          style={{ position: "fixed", left, top: tip.y, maxWidth: maxW, translateX: "-50%", translateY: tip.below ? "0%" : "-100%" }}
          className="pointer-events-none z-[500] w-max rounded-xl px-3 py-2 text-[12px] font-medium leading-snug text-white bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md border border-white/10 shadow-[0_12px_32px_-8px_rgba(15,23,42,0.55)]"
        >
          <span aria-hidden="true" className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-inherit border-white/10"
            style={tip.below ? { top: -5, borderLeftWidth: 1, borderTopWidth: 1 } : { bottom: -5, borderRightWidth: 1, borderBottomWidth: 1 }} />
          <span className="relative">{tip.text}</span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
