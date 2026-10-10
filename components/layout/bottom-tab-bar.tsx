"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Download, LayoutDashboard, Library, Menu, PieChart, Settings, Timer, Wrench, X } from "lucide-react";
import { isReviewPath, lastReviewHref } from "./review-tabs";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useAuthStore } from "@/store/use-auth-store";
import { TOOLS_HOME, isToolPath } from "@/lib/seo/tools";

/**
 * Phone/tablet tab bar (below lg): the four places a student goes most, within thumb reach. "More" slides a sheet up
 * from the bottom with only the pages that aren't already in the bar (Mocks, Analytics, Tools, Downloads).
 */
export function BottomTabBar() {
  const pathname = usePathname() ?? "";
  const { tier } = useEntitlements();
  const signedIn = useAuthStore((s) => !!s.user);
  const [reviewHref, setReviewHref] = useState("/mistakes");
  const [more, setMore] = useState(false);
  useEffect(() => { setReviewHref(lastReviewHref()); }, [pathname]);
  useEffect(() => { setMore(false); }, [pathname]);
  useEffect(() => {
    if (!more) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMore(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [more]);

  const gold = tier === "pro", silver = tier === "plus";
  const on = gold ? "text-amber-600 dark:text-amber-400" : silver ? "text-slate-700 dark:text-slate-200" : "text-violet-600 dark:text-violet-400";
  const tabs = [
    { label: "Home", href: "/", icon: LayoutDashboard, active: pathname === "/" },
    { label: "Practice", href: "/setup", icon: Settings, active: pathname.startsWith("/setup") },
    { label: "Review", href: reviewHref, icon: Library, active: isReviewPath(pathname) },
    { label: "AI Mentor", href: "/ai-mentor", icon: BrainCircuit, active: pathname.startsWith("/ai-mentor") },
  ];
  const rest = [
    { label: "Mocks", href: "/mocks", icon: Timer, active: pathname.startsWith("/mocks") },
    { label: "Analytics", href: "/analytics", icon: PieChart, active: pathname.startsWith("/analytics") },
    { label: "Tools", href: TOOLS_HOME, icon: Wrench, active: isToolPath(pathname) },
    ...(signedIn ? [{ label: "Downloads", href: "/downloads", icon: Download, active: pathname.startsWith("/downloads") }] : []),
  ];
  const moreActive = rest.some((r) => r.active);

  return (
    <>
      <nav aria-label="Main" className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
        <ul className="mx-auto flex max-w-xl items-stretch">
          {tabs.map((t) => (
            <li key={t.label} className="flex-1 min-w-0">
              <Link href={t.href} aria-current={t.active ? "page" : undefined}
                className={`flex h-14 flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors ${t.active ? on : "text-[var(--text-muted)] active:text-[var(--text-primary)]"}`}>
                <t.icon className={`h-5 w-5 transition-transform ${t.active ? "scale-110" : ""}`} />
                <span className="truncate">{t.label}</span>
              </Link>
            </li>
          ))}
          <li className="flex-1 min-w-0">
            <button type="button" aria-haspopup="dialog" aria-expanded={more} onClick={() => setMore((o) => !o)}
              className={`flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-bold cursor-pointer transition-colors ${more || moreActive ? on : "text-[var(--text-muted)] active:text-[var(--text-primary)]"}`}>
              {more ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>

      {more && typeof document !== "undefined" && createPortal(
        <div className="lg:hidden fixed inset-0 z-[45]">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setMore(false)} />
          <div role="dialog" aria-label="More pages" className="absolute inset-x-0 bottom-14 mx-auto max-w-xl rounded-t-3xl border border-b-0 border-[var(--border)] bg-[var(--surface)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.35)] animate-[sheet-up_0.22s_ease-out]">
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-[var(--border)]" aria-hidden />
            <ul className="grid gap-1">
              {rest.map((r) => (
                <li key={r.label}>
                  <Link href={r.href} onClick={() => setMore(false)} aria-current={r.active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${r.active ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white" : "text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"}`}>
                    <r.icon className="h-5 w-5 shrink-0" aria-hidden /> {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
