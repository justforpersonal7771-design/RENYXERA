"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion } from "motion/react";
import { BookOpenText, BrainCircuit, LayoutDashboard, Library, PieChart, Settings, Swords } from "lucide-react";
import { TEST_CENTRE, TEST_CENTRE_HREF, isTestCentrePath } from "@/lib/test-centre/brand";
import { isReviewPath, lastReviewHref } from "./review-tabs";
import { SPRING } from "@/lib/motion/tokens";

/**
 * Lunar Glass desktop navigation: a slim floating glass rail on the left holding only the app's pages (seven icons, nothing else).
 * The logo stays top-left and the tools group (search, planner, to-do, focus target, leaderboard, tools, theme, paper, profile) stays
 * top-right, both in the existing top bar, which the Lunar look strips back to those two. The bottom of the screen is deliberately left
 * free: several pages put their own actions there (Test Centre "Start test" bar, profile save bar, results banner, Mentor composer, toasts).
 * It renders in every look but is shown only by the Lunar CSS (`.lunar-dock` in app/looks.css) at desktop width; phones keep the bottom
 * tab bar. Page names appear as a flyout on hover or keyboard focus; one indicator glides between pages.
 */
export function LunarDock() {
  const pathname = usePathname() ?? "";
  const [reviewHref, setReviewHref] = useState("/mistakes");
  useEffect(() => { setReviewHref(lastReviewHref()); }, [pathname]);

  const items = [
    { label: "Home", href: "/", icon: LayoutDashboard, active: pathname === "/" },
    { label: TEST_CENTRE, href: TEST_CENTRE_HREF, icon: Settings, active: isTestCentrePath(pathname) },
    { label: "Study", href: "/study", icon: BookOpenText, active: pathname.startsWith("/study") },
    { label: "AI Mentor", href: "/ai-mentor", icon: BrainCircuit, active: pathname.startsWith("/ai-mentor") },
    { label: "Review", href: reviewHref, icon: Library, active: isReviewPath(pathname) },
    { label: "Analytics", href: "/analytics", icon: PieChart, active: pathname.startsWith("/analytics") },
    { label: "Battles", href: "/battles", icon: Swords, active: pathname.startsWith("/battles") },
  ];

  return (
    <nav aria-label="Pages" className="lunar-dock">
      <LayoutGroup id="lunar-dock">
        <ul>
          {items.map((it) => (
            <li key={it.label}>
              <Link href={it.href} aria-label={it.label} aria-current={it.active ? "page" : undefined} className="lunar-dock__item" data-active={it.active ? "" : undefined}>
                {it.active && <motion.span layoutId="lunar-dock-active" className="lunar-dock__indicator" transition={SPRING.glide} />}
                <it.icon className="lunar-dock__icon h-[19px] w-[19px]" />
                <span className="lunar-dock__tip">{it.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
