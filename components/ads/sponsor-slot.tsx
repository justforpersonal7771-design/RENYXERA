"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { pickPromo, type Promo } from "@/lib/ads/house-promos";

/**
 * Sponsor slot (6C) — two layers, one fixed-size box (no layout shift):
 *   1. A vetted, privacy-first network (EthicalAds) when NEXT_PUBLIC_ETHICALADS_PUBLISHER
 *      is set: one static text ad, no tracking.
 *   2. Otherwise — or if an ad blocker removed/emptied the network's slot within 3 s — a
 *      first-party house promo matched to the subject: our own features, or a standard
 *      textbook via an affiliate link when NEXT_PUBLIC_AMAZON_TAG is set.
 * Only placed on public content pages; never inside the app and never during a test (it
 * is not rendered by any exam screen, so it cannot touch a running timer).
 * Class names avoid "ad"/"ads"/"sponsor" so cosmetic filters don't hide the house layer.
 */
const EA_PUBLISHER = process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER;
const EA_SCRIPT = "https://media.ethicalads.io/media/client/ethicalads.min.js";
let eaLoading: Promise<void> | null = null;

let adblockResult: boolean | null = null;
function adblockDetected(): boolean {
  if (adblockResult !== null) return adblockResult;
  const bait = document.createElement("div");
  bait.className = "adsbox ad-banner ad-placement textads banner-ads";
  bait.setAttribute("aria-hidden", "true");
  bait.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:1px;height:1px;";
  bait.innerHTML = "&nbsp;";
  document.body.appendChild(bait);
  const hidden = !bait.isConnected || bait.offsetHeight === 0 || getComputedStyle(bait).display === "none" || getComputedStyle(bait).visibility === "hidden";
  bait.remove();
  adblockResult = hidden;
  return hidden;
}

function loadEthicalAds(): Promise<void> {
  if (eaLoading) return eaLoading;
  eaLoading = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = EA_SCRIPT; s.async = true;
    s.onload = () => resolve(); s.onerror = () => reject(new Error("blocked"));
    document.head.appendChild(s);
  });
  return eaLoading;
}

const TONE: Record<Promo["tone"], string> = {
  violet: "from-violet-500/12 to-fuchsia-500/6 border-violet-500/25",
  emerald: "from-emerald-500/12 to-teal-500/6 border-emerald-500/25",
  amber: "from-amber-500/12 to-orange-500/6 border-amber-500/25",
  sky: "from-sky-500/12 to-indigo-500/6 border-sky-500/25",
};

export function SponsorSlot({ context = "", seed = 0, className = "" }: { context?: string; seed?: number; className?: string }) {
  const [mode, setMode] = useState<"network" | "house">(EA_PUBLISHER ? "network" : "house");
  const netRef = useRef<HTMLDivElement>(null);
  const promo = pickPromo(context, seed);

  useEffect(() => {
    if (mode !== "network") return;
    let done = false;
    const fallback = () => { if (!done) { done = true; setMode("house"); } };
    // Instant adblock detection: blockers hide/remove a bait element with ad-like class
    // names on load. If it's gone or collapsed on the next frame → house promo now.
    if (adblockDetected()) { fallback(); return; }
    loadEthicalAds().catch(fallback);
    // If nothing real rendered in 3 s (blocked request, hidden element, no fill) → house.
    const t = setTimeout(() => {
      const el = netRef.current;
      const filled = !!el && el.offsetHeight > 20 && !!el.querySelector("a[href]") && getComputedStyle(el).display !== "none";
      if (!filled) fallback(); else done = true;
    }, 3000);
    return () => clearTimeout(t);
  }, [mode]);

  return (
    <section aria-label="Sponsored" className={`my-8 min-h-[132px] ${className}`}>
      {mode === "network" ? (
        <div ref={netRef} className="rx-partner flat" data-ea-publisher={EA_PUBLISHER} data-ea-type="text" data-ea-keywords={context.toLowerCase().replace(/[^a-z0-9|]+/g, "-").slice(0, 120)} />
      ) : (
        <HouseCard promo={promo} />
      )}
    </section>
  );
}

function HouseCard({ promo }: { promo: Promo }) {
  const inner = (
    <span className={`rx-partner-card flex items-center gap-4 rounded-2xl border bg-gradient-to-br ${TONE[promo.tone]} p-4 sm:p-5 min-h-[112px]`}>
      <span className="w-11 h-11 shrink-0 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-violet-600 dark:text-violet-300">
        {promo.kind === "affiliate" ? <BookOpen className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{promo.kind === "affiliate" ? "Recommended book · affiliate link" : "From RENYXERA"}</span>
        <span className="block font-bold text-[var(--text-primary)]">{promo.title}</span>
        <span className="block text-sm text-[var(--text-secondary)] line-clamp-2">{promo.blurb}</span>
      </span>
      <span className="hidden sm:inline-flex shrink-0 items-center gap-1 text-sm font-bold text-violet-700 dark:text-violet-300">{promo.cta} <ArrowRight className="w-4 h-4" /></span>
    </span>
  );
  return promo.kind === "affiliate"
    ? <a href={promo.href} target="_blank" rel="sponsored noopener noreferrer" className="block">{inner}</a>
    : <Link href={promo.href} className="block">{inner}</Link>;
}
