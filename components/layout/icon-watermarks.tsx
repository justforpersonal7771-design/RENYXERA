"use client";

import { useEffect } from "react";

/**
 * Icon watermark on every pastel card that has an icon (owner, 29 Nov 2026): the card's own first icon is copied, large and faint, into the bottom
 * right corner, so the card carries its meaning instead of a generic shape. A card that already draws a `.tile-mark` is left alone, and a card with no
 * icon keeps the soft shape from globals.css (the shape rule skips any card that has a `.tile-mark`).
 */
const CARD = ".card-pastel[data-tint]:not([data-wm-icon]), .card-well[data-tint]:not([data-wm-icon])";

function mark(card: Element) {
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
    kick();
    const mo = new MutationObserver(kick); mo.observe(document.body, { childList: true, subtree: true });
    return () => { mo.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return null;
}
