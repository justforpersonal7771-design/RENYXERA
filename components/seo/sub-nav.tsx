"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";

type Item = { href: string; label: string; short?: string; icon: LucideIcon; also?: string[] };

/**
 * Adaptive section dock (tools, legal pages): floats at the bottom of the screen, slides
 * away while you scroll down and returns as soon as you scroll up. The highlight pill
 * glides between items on a bouncy spring and each item lifts on hover. The app scrolls
 * inside its own container, so scroll is caught in the capture phase from any scroller.
 */
export function SubNav({ items, label }: { items: Item[]; label: string }) {
  const path = usePathname() ?? "";
  const [hidden, setHidden] = useState(false);
  const { tier } = useEntitlements();
  const [hover, setHover] = useState<string | null>(null);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = (e: Event) => {
      const el = e.target as HTMLElement;
      if (!(el instanceof HTMLElement) || !el.closest("main")) return;
      const y = el.scrollTop;
      const dy = y - last.current;
      if (Math.abs(dy) < 6) return;
      setHidden(dy > 0 && y > 80);
      last.current = y;
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true } as AddEventListenerOptions);
  }, []);
  useEffect(() => { setHidden(false); last.current = 0; }, [path]);

  const active = items.find((i) => path === i.href || (i.also ?? []).some((a) => path.startsWith(a)))?.href;
  const pill = hover ?? active;

  return (
    <motion.div
      initial={false}
      animate={{ y: hidden ? 120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="fixed inset-x-0 bottom-3 sm:bottom-5 z-40 flex justify-center px-3 pointer-events-none"
    >
      <nav aria-label={label} onMouseLeave={() => setHover(null)}
        className={`sub-dock pointer-events-auto max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border-2 bg-[var(--surface)]/95 backdrop-blur-xl p-1.5 ${tier === "pro" ? "border-amber-400/70" : tier === "plus" ? "border-slate-400/70" : "border-violet-500/35"}`}>
        <ul className="flex items-center gap-0.5 w-max">
          <li aria-hidden="true" className="hidden sm:flex items-center gap-1.5 pl-2.5 pr-3 mr-1 border-r border-[var(--border)] text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</li>
          {items.map((it) => {
            const on = it.href === active;
            return (
              <li key={it.href}>
                <Link href={it.href} aria-current={on ? "page" : undefined} title={it.label}
                  onMouseEnter={() => setHover(it.href)} onFocus={() => setHover(it.href)} onBlur={() => setHover(null)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-colors ${on ? (tier === "pro" ? "text-amber-950" : tier === "plus" ? "text-slate-900" : "text-white") : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                  {on && <span className={`absolute inset-0 rounded-xl shadow-md ${tier === "pro" ? "bg-gradient-to-b from-amber-200 via-amber-300 to-amber-500 shadow-amber-500/30" : tier === "plus" ? "bg-gradient-to-b from-slate-100 via-slate-200 to-slate-400 shadow-slate-500/30" : "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 shadow-violet-500/30"}`} />}
                  {pill === it.href && !on && (
                    <motion.span layoutId={`subnav-pill-${label}`} className="absolute inset-0 rounded-xl bg-[var(--surface-secondary)]"
                      transition={{ type: "spring", stiffness: 520, damping: 14, mass: 0.7 }} />
                  )}
                  <motion.span className="relative flex items-center gap-1.5" whileHover={{ y: -3, scale: 1.06 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 600, damping: 11 }}>
                    <it.icon className="w-4 h-4 shrink-0" />
                    <span className="sm:hidden">{it.short ?? it.label}</span>
                    <span className="hidden sm:inline">{it.label}</span>
                  </motion.span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.div>
  );
}
