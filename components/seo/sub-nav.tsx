"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * Adaptive section menu: a floating dock under the header (tools, legal pages). It slides
 * away while you scroll down and comes back as soon as you scroll up; the highlight pill
 * glides between items on a bouncy spring. Public pages scroll inside their layout's own
 * container, so scroll is caught in the capture phase from any scroller.
 */
export function SubNav({ items, label }: { items: { href: string; label: string; icon: LucideIcon }[]; label: string }) {
  const path = usePathname() ?? "";
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = (e: Event) => {
      const el = e.target as HTMLElement;
      if (!(el instanceof HTMLElement)) return;
      const y = el.scrollTop;
      const dy = y - last.current;
      if (Math.abs(dy) < 6) return;
      setHidden(dy > 0 && y > 120);
      last.current = y;
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true } as AddEventListenerOptions);
  }, []);
  useEffect(() => { setHidden(false); }, [path]);

  const active = items.find((i) => i.href === path)?.href;
  const pill = hover ?? active;

  return (
    <motion.div
      initial={false}
      animate={{ y: hidden ? -90 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="sticky top-[100px] sm:top-[72px] z-[15] flex justify-center pointer-events-none py-2"
    >
      <nav aria-label={label} onMouseLeave={() => setHover(null)}
        className="pointer-events-auto max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl shadow-[0_10px_30px_-12px_rgba(15,23,42,0.35)] p-1">
        <ul className="flex items-center gap-0.5 w-max">
          {items.map((it) => {
            const on = it.href === active;
            return (
              <li key={it.href}>
                <Link href={it.href} aria-current={on ? "page" : undefined}
                  onMouseEnter={() => setHover(it.href)} onFocus={() => setHover(it.href)} onBlur={() => setHover(null)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-colors ${on ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                  {pill === it.href && (
                    <motion.span layoutId={`subnav-pill-${label}`}
                      className={`absolute inset-0 rounded-xl ${on ? "bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 shadow-md shadow-violet-500/30" : "bg-[var(--surface-secondary)]"}`}
                      transition={{ type: "spring", stiffness: 520, damping: 14, mass: 0.7 }} />
                  )}
                  {active === it.href && pill !== it.href && <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600" />}
                  <motion.span className="relative flex items-center gap-1.5" whileHover={{ y: -2, scale: 1.04 }} transition={{ type: "spring", stiffness: 600, damping: 12 }}>
                    <it.icon className="w-4 h-4 shrink-0" />{it.label}
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
