"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, LayoutDashboard, Library, Menu, Settings } from "lucide-react";
import { isReviewPath, lastReviewHref } from "./review-tabs";
import { useEntitlements } from "@/lib/billing/use-entitlements";

/** The topbar's hamburger listens for this, so "More" opens the same menu. */
export const OPEN_MORE_EVENT = "renyxera:open-more-menu";

/**
 * Phone/tablet tab bar (below lg, where the topbar collapses to a hamburger): the five places
 * a student goes most, within thumb reach. "More" opens the existing menu (Mocks, Analytics, Tools).
 */
export function BottomTabBar() {
  const pathname = usePathname() ?? "";
  const { tier } = useEntitlements();
  const [reviewHref, setReviewHref] = useState("/mistakes");
  useEffect(() => { setReviewHref(lastReviewHref()); }, [pathname]);

  const gold = tier === "pro", silver = tier === "plus";
  const on = gold ? "text-amber-600 dark:text-amber-400" : silver ? "text-slate-700 dark:text-slate-200" : "text-violet-600 dark:text-violet-400";
  const tabs = [
    { label: "Home", href: "/", icon: LayoutDashboard, active: pathname === "/" },
    { label: "Practice", href: "/setup", icon: Settings, active: pathname.startsWith("/setup") },
    { label: "Review", href: reviewHref, icon: Library, active: isReviewPath(pathname) },
    { label: "AI Mentor", href: "/ai-mentor", icon: BrainCircuit, active: pathname.startsWith("/ai-mentor") },
  ];
  return (
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
          <button type="button" data-mobile-menu-toggle onClick={() => window.dispatchEvent(new Event(OPEN_MORE_EVENT))}
            className="flex h-14 w-full flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-[var(--text-muted)] active:text-[var(--text-primary)] cursor-pointer">
            <Menu className="h-5 w-5" />
            <span>More</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
