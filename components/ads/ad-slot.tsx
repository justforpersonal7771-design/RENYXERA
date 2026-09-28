"use client";

import { useEffect, useRef } from "react";

/**
 * Ad slot (6C). Renders nothing until NEXT_PUBLIC_ADSENSE_CLIENT (e.g. "ca-pub-123…") is
 * set — so the site stays ad-free until an ad account is approved, and switching ads on is
 * one environment variable plus a redeploy. Used ONLY on public content pages (PYQs,
 * papers, topic hubs); never inside the app, and never during a test.
 */
const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
let scriptAdded = false;

export function AdSlot({ slot, className = "" }: { slot?: string; className?: string }) {
  const ref = useRef<HTMLModElement>(null);
  useEffect(() => {
    if (!CLIENT || !ref.current) return;
    if (!scriptAdded) {
      scriptAdded = true;
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
      s.crossOrigin = "anonymous";
      document.head.appendChild(s);
    }
    try { ((window as unknown as { adsbygoogle: unknown[] }).adsbygoogle ||= []).push({}); } catch { /* blocked by an ad blocker */ }
  }, []);
  if (!CLIENT) return null;
  return (
    <aside aria-label="Advertisement" className={`my-8 min-h-[100px] ${className}`}>
      <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Advertisement</p>
      <ins ref={ref} className="adsbygoogle block" style={{ display: "block" }} data-ad-client={CLIENT} data-ad-slot={slot ?? process.env.NEXT_PUBLIC_ADSENSE_SLOT} data-ad-format="auto" data-full-width-responsive="true" />
    </aside>
  );
}
