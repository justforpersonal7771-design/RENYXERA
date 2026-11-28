"use client";

import { useEffect } from "react";

/**
 * Icon watermark on every pastel card that has an icon (owner, 29 Nov 2026): the card's own first icon is copied, large and faint, into the bottom
 * right corner, so the card carries its meaning instead of a generic shape. A card that already draws a `.tile-mark` is left alone, and a card with no
 * icon keeps the soft shape from globals.css (the shape rule skips any card that has a `.tile-mark`).
 */
const CARD = ".card-pastel[data-tint]:not([data-wm-icon]), .card-well[data-tint]:not([data-wm-icon])";

/** React puts a `__reactFiber$...` key on every node it has hydrated. Adding a child to a card that React has not hydrated yet breaks hydration (error 418), so wait. */
const hydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber"));

function mark(card: Element) {
  if (!hydrated(card)) return;
  card.setAttribute("data-wm-icon", "1");
  if (card.querySelector(".tile-mark")) return;
  const src = card.querySelector<SVGElement>("svg.lucide, svg[class*='lucide-']");
  if (!src) return;
  const w = src.cloneNode(true) as SVGElement;
  w.setAttribute("aria-hidden", "true"); w.removeAttribute("class"); w.setAttribute("class", "tile-mark");
  w.setAttribute("width", "80"); w.setAttribute("height", "80"); w.setAttribute("stroke-width", "1.5");
  Object.assign(w.style, { position: "absolute", right: "14px", bottom: "10px", width: "5rem", height: "5rem", zIndex: "-1", pointerEvents: "none", opacity: ".08", color: "var(--wm, currentColor)", transform: "rotate(-12deg)", transition: "transform .3s" });
  card.appendChild(w);
}

export function IconWatermarks() {
  useEffect(() => {
    let raf = 0;
    const run = () => { raf = 0; document.querySelectorAll(CARD).forEach(mark); };
    const kick = () => { if (!raf) raf = requestAnimationFrame(run); };
    const start = window.setTimeout(kick, 1200);
    const mo = new MutationObserver(kick); mo.observe(document.body, { childList: true, subtree: true });
    // cards inside a section that hydrates late are picked up by this slow retry
    const retry = window.setInterval(kick, 1500);
    const stop = window.setTimeout(() => window.clearInterval(retry), 20000);
    return () => { mo.disconnect(); window.clearTimeout(start); window.clearTimeout(stop); window.clearInterval(retry); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return null;
}
