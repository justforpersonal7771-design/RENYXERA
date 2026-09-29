"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Bookmark, ClipboardList, RefreshCw } from "lucide-react";

export const REVIEW_TABS = [
  { href: "/mistakes", label: "Mistakes", icon: ClipboardList },
  { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  { href: "/revision", label: "Revision", icon: RefreshCw },
] as const;

const LAST_KEY = "review:last-tab";
export const isReviewPath = (p: string | null) => !!p && REVIEW_TABS.some((t) => p === t.href || p.startsWith(`${t.href}/`));
/** Where the navbar "Review" item goes: the tab the student used last (mistakes by default). */
export function lastReviewHref() {
  try { const v = localStorage.getItem(LAST_KEY); if (v && REVIEW_TABS.some((t) => t.href === v)) return v; } catch {}
  return "/mistakes";
}

/**
 * One "Review" section: Mistakes, Bookmarks and Revision were three near-identical navbar
 * entries; they now share this tab bar and a single navbar item. The URLs stay the same so
 * every existing link and bookmark still works. Hidden inside a running revision session.
 */
export function ReviewTabs() {
  const path = usePathname();
  const current = REVIEW_TABS.find((t) => path === t.href)?.href;
  useEffect(() => { if (current) try { localStorage.setItem(LAST_KEY, current); } catch {} }, [current]);
  if (!current) return null;
  return (
    <div className="shrink-0 mb-3 flex items-center justify-between gap-3 flex-wrap">
      <h1 className="hidden sm:block text-xl md:text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">Review</h1>
      <nav aria-label="Review" className="relative flex w-full sm:w-auto p-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {REVIEW_TABS.map((t) => {
          const on = t.href === current;
          return (
            <Link key={t.href} href={t.href} aria-current={on ? "page" : undefined}
              className={`relative flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 h-9 rounded-xl text-sm font-bold transition-colors ${on ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
              {on && <motion.span layoutId="review-tab-pill" className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-violet-500/25" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <t.icon className="relative w-4 h-4" />
              <span className="relative">{t.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
