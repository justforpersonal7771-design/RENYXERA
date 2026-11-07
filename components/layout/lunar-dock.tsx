"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "motion/react";
import { BookOpenText, BrainCircuit, ClipboardCheck, LayoutDashboard, Library, PieChart, Swords } from "lucide-react";
import { TEST_CENTRE, TEST_CENTRE_HREF, isTestCentrePath } from "@/lib/test-centre/brand";
import { isReviewPath, lastReviewHref } from "./review-tabs";
import { SPRING } from "@/lib/motion/tokens";

/**
 * Lunar Glass desktop navigation: a floating glass dock at the bottom centre holding the app's pages (the design the owner chose, variant 02).
 * Hovering an icon makes it pop up and grow, its neighbours lean in, and the page name unfolds beside it (no tooltip). The active page shows its
 * name and one indicator glides between pages. It steps out of the way when it would sit on something: while scrolling down, while typing, and on
 * the full-screen Mentor chat; bars that live at the bottom of a page (Start test, profile save, results banner, trial chip) are lifted above it
 * with the `lunar-lift` class. Menus that would collide with it (tools and legal pages) move to a rail on the left (see app/looks.css).
 * Renders in every look but is shown only by the Lunar CSS at desktop width; phones keep the bottom tab bar.
 */
export function LunarDock() {
  const pathname = usePathname() ?? "";
  const [reviewHref, setReviewHref] = useState("/mistakes");
  useEffect(() => { setReviewHref(lastReviewHref()); }, [pathname]);

  const [away, setAway] = useState(false);     // scrolling down
  const [typing, setTyping] = useState(false); // a text field has focus
  const last = useRef(0);
  useEffect(() => {
    const onScroll = (e: Event) => {
      const el = e.target;
      if (!(el instanceof HTMLElement) || !el.closest("main")) return;
      const y = el.scrollTop, dy = y - last.current;
      if (Math.abs(dy) < 10) return;
      setAway(dy > 0 && y > 140);
      last.current = y;
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true } as AddEventListenerOptions);
  }, []);
  useEffect(() => { last.current = 0; setAway(false); }, [pathname]);
  useEffect(() => {
    const field = (t: EventTarget | null) => t instanceof HTMLElement && t.matches('textarea, select, [contenteditable="true"], input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="button"]):not([type="submit"])');
    const on = (e: FocusEvent) => setTyping(field(e.target));
    const off = () => setTyping(false);
    document.addEventListener("focusin", on); document.addEventListener("focusout", off);
    return () => { document.removeEventListener("focusin", on); document.removeEventListener("focusout", off); };
  }, []);

  const items = [
    { label: "Home", href: "/", icon: LayoutDashboard, active: pathname === "/" },
    { label: TEST_CENTRE, href: TEST_CENTRE_HREF, icon: ClipboardCheck, active: isTestCentrePath(pathname) },
    { label: "Study", href: "/study", icon: BookOpenText, active: pathname.startsWith("/study") },
    { label: "AI Mentor", href: "/ai-mentor", icon: BrainCircuit, active: pathname.startsWith("/ai-mentor") },
    { label: "Review", href: reviewHref, icon: Library, active: isReviewPath(pathname) },
    { label: "Analytics", href: "/analytics", icon: PieChart, active: pathname.startsWith("/analytics") },
    { label: "Battles", href: "/battles", icon: Swords, active: pathname.startsWith("/battles") },
  ];
  // Owner decision (7 Nov): the page menu lives in the top bar on every screen, so it never collides with bottom bars or the Mentor message box.
  const top = true;
  const hide = false;

  return (
    <nav aria-label="Pages" className="lunar-dock" data-pos={top ? "top" : undefined} data-hidden={hide ? "" : undefined}>
      <LayoutGroup id="lunar-dock">
        <ul>
          {items.map((it) => (
            <li key={it.label}>
              <Link href={it.href} aria-label={it.label} aria-current={it.active ? "page" : undefined} className="lunar-dock__item" data-active={it.active ? "" : undefined}>
                {it.active && <motion.span layoutId="lunar-dock-active" className="lunar-dock__indicator" transition={SPRING.glide} />}
                <it.icon className="lunar-dock__icon h-[19px] w-[19px]" />
                <span className="lunar-dock__label">{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
