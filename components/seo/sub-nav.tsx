"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";

type Item = { href: string; label: string; short?: string; icon: LucideIcon; also?: string[] };

/**
 * Adaptive section dock (tools, legal pages): floats at the bottom of the screen, slides
 * away while you scroll down and returns as soon as you scroll up. The highlight pill
 * glides between items on a bouncy spring and each item lifts on hover. The app scrolls
 * inside its own container, so scroll is caught in the capture phase from any scroller.
 */
// Each tool has its own pastel (icon colour, hover, active chip), like the navbar sections.
const SUB_TINTS = ["mint", "sky", "butter", "peri", "peach", "lilac", "rose", "mint", "sky"];

export function SubNav({ items, label, home }: { items: Item[]; label: string; home?: string }) {
  const path = usePathname() ?? "";
  const [hidden, setHidden] = useState(false);
  // The tool page's primary card follows the active tool's colour (read by globals.css).
  useEffect(() => {
    const idx = items.findIndex((it) => it.href === active);
    const shell = document.querySelector(".page-shell");
    if (shell && idx >= 0) shell.setAttribute("data-tool-tint", SUB_TINTS[idx % SUB_TINTS.length]);
    return () => { shell?.removeAttribute("data-tool-tint"); };
  });
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
  const navRef = useRef<HTMLElement>(null);
  // The dock scrolls sideways on phones: bring the open tool into view, not the first one.
  useEffect(() => {
    // Sideways only: scrollIntoView can also scroll the page itself, which jumped users to the bottom.
    const el = navRef.current?.querySelector<HTMLElement>('[aria-current="page"]');
    const box = el?.closest<HTMLElement>(".overflow-x-auto");
    if (el && box) box.scrollLeft = el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2;
  }, [active]);

  return (
    <motion.div
      initial={false}
      animate={{ y: hidden ? 120 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="fixed inset-x-0 bottom-[4.25rem] lg:bottom-5 z-40 flex justify-center px-3 pointer-events-none"
    >
      <nav ref={navRef} aria-label={label} onMouseLeave={() => setHover(null)}
        className={`sub-dock pointer-events-auto max-w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_14px_36px_-18px_rgba(12,34,75,0.35)] p-1.5`}>
        <ul className="flex items-center gap-0.5 w-max">
          <li {...(home ? {} : { "aria-hidden": true })} className="hidden sm:flex items-center gap-1.5 pl-2.5 pr-3 mr-1 border-r border-[var(--border)] text-xs font-black tracking-normal text-[var(--text-muted)]">{home ? <Link href={home} title={`All ${label.toLowerCase()}`} className="hover:text-[var(--text-primary)] hover:underline">{label}</Link> : label}</li>
          {items.map((it, idx) => {
            const on = it.href === active;
            const tint = SUB_TINTS[idx % SUB_TINTS.length];
            return (
              <li key={it.href}>
                <Link href={it.href} aria-current={on ? "page" : undefined} title={it.label} data-tint={tint}
                  onMouseEnter={() => setHover(it.href)} onFocus={() => setHover(it.href)} onBlur={() => setHover(null)}
                  className={`relative flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-colors ${on ? "text-[var(--tint-lilac-ink)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
                  {on && <span className="absolute inset-0 rounded-xl nav-active-pill" />}
                  {pill === it.href && !on && (
                    <motion.span layoutId={`subnav-pill-${label}`} className="absolute inset-0 rounded-xl bg-[var(--surface-secondary)]"
                      transition={{ type: "spring", stiffness: 520, damping: 14, mass: 0.7 }} />
                  )}
                  <motion.span className="relative flex items-center gap-1.5" whileHover={{ y: -3, scale: 1.06 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 600, damping: 11 }}>
                    <it.icon className="w-4 h-4 shrink-0" />
                    <span>{it.short ?? it.label}</span>
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
