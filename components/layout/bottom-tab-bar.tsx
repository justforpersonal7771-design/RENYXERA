"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit, Download, LayoutDashboard, Library, ListTree, Menu, PieChart, Settings, Timer, Wrench, X, Anvil, BookOpenText, Swords } from "lucide-react";
import { isReviewPath, lastReviewHref } from "./review-tabs";
import { useAuthStore } from "@/store/use-auth-store";
import { TOOLS_HOME, isToolPath } from "@/lib/seo/tools";

/**
 * Phone/tablet tab bar (below lg): the four places a student goes most, within thumb reach. "More" slides a sheet up
 * from the bottom with only the pages that aren't already in the bar (Mocks, Analytics, Tools, Downloads).
 */
export function BottomTabBar() {
  const pathname = usePathname() ?? "";
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

  const on = "text-violet-600 dark:text-violet-400";
  const tabs = [
    { label: "Home", href: "/", icon: LayoutDashboard, active: pathname === "/" },
    { label: "Practice", href: "/setup", icon: Settings, active: pathname.startsWith("/setup") },
    { label: "Review", href: reviewHref, icon: Library, active: isReviewPath(pathname) },
    { label: "AI Mentor", href: "/ai-mentor", icon: BrainCircuit, active: pathname.startsWith("/ai-mentor") },
  ];
  const rest = [
    { label: "Mocks", href: "/mocks", icon: Timer, active: pathname.startsWith("/mocks") },
    { label: "Forge", href: "/forge", icon: Anvil, active: pathname.startsWith("/forge") },
    { label: "Study materials", href: "/study", icon: BookOpenText, active: pathname.startsWith("/study") },
    { label: "Battles", href: "/battles", icon: Swords, active: pathname.startsWith("/battles") },
    { label: "Analytics", href: "/analytics", icon: PieChart, active: pathname.startsWith("/analytics") },
    { label: "Browse topics", href: "/browse", icon: ListTree, active: pathname.startsWith("/browse") },
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
        <div className="lg:hidden fixed inset-x-0 top-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-[45] overflow-hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setMore(false)} />
          <motion.div role="dialog" aria-label="More pages" drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }} onDragEnd={(_, i) => { if (i.offset.y > 70 || i.velocity.y > 500) setMore(false); }} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 34 }} className="absolute inset-x-0 bottom-0 touch-none mx-auto max-w-xl rounded-t-3xl border border-b-0 border-[var(--border)] bg-[var(--surface)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.35)] animate-[sheet-up_0.22s_ease-out]">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[var(--text-muted)]/40" aria-hidden />
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
          </motion.div>
        </div>,
        document.body,
      )}
    </>
  );
}
