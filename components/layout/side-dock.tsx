"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "motion/react";
import { useTheme } from "next-themes";
import { BookOpenText, BrainCircuit, LayoutDashboard, Library, Moon, PieChart, Settings, Sun, Swords, Wrench } from "lucide-react";
import { TEST_CENTRE, TEST_CENTRE_HREF, isTestCentrePath } from "@/lib/test-centre/brand";
import { TOOLS_HOME, isToolPath } from "@/lib/seo/tools";
import { isReviewPath, lastReviewHref } from "./review-tabs";

/**
 * Lunar Glass desktop navigation: a floating vertical glass pill on the left (lg and up).
 * It renders in every look but is shown only by the Lunar look's CSS (`.side-dock` in app/looks.css),
 * so the classic top-bar navigation stays untouched for everyone else.
 * Names appear as a flyout on hover or keyboard focus; the active item has one indicator that glides between items.
 */
export function SideDock() {
  const pathname = usePathname() ?? "";
  const { setTheme, resolvedTheme } = useTheme();
  const [reviewHref, setReviewHref] = useState("/mistakes");
  useEffect(() => { setReviewHref(lastReviewHref()); }, [pathname]);

  const items = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard, active: pathname === "/" },
    { label: TEST_CENTRE, href: TEST_CENTRE_HREF, icon: Settings, active: isTestCentrePath(pathname) },
    { label: "Study", href: "/study", icon: BookOpenText, active: pathname.startsWith("/study") },
    { label: "AI Mentor", href: "/ai-mentor", icon: BrainCircuit, active: pathname.startsWith("/ai-mentor") },
    { label: "Review", href: reviewHref, icon: Library, active: isReviewPath(pathname) },
    { label: "Analytics", href: "/analytics", icon: PieChart, active: pathname.startsWith("/analytics") },
    { label: "Battles", href: "/battles", icon: Swords, active: pathname.startsWith("/battles") },
  ];
  const toolsActive = isToolPath(pathname) || pathname === TOOLS_HOME || pathname.startsWith("/downloads");

  return (
    <nav aria-label="Main" className="side-dock">
      <LayoutGroup id="side-dock">
        <ul className="side-dock__list">
          {items.map((it) => (
            <li key={it.label}>
              <DockLink href={it.href} label={it.label} active={it.active}><it.icon className="h-[18px] w-[18px]" /></DockLink>
            </li>
          ))}
        </ul>
        <div className="side-dock__rule" aria-hidden />
        <ul className="side-dock__list">
          <li><DockLink href={TOOLS_HOME} label="Tools" active={toolsActive}><Wrench className="h-[18px] w-[18px]" /></DockLink></li>
          <li>
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
              className="side-dock__item"
              suppressHydrationWarning
            >
              <Sun className="hidden h-[18px] w-[18px] dark:block" />
              <Moon className="block h-[18px] w-[18px] dark:hidden" />
              <span className="side-dock__tip">Theme</span>
            </button>
          </li>
        </ul>
      </LayoutGroup>
    </nav>
  );
}

function DockLink({ href, label, active, children }: { href: string; label: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} aria-current={active ? "page" : undefined} className="side-dock__item" data-active={active ? "" : undefined}>
      {active && (
        <motion.span
          layoutId="side-dock-active"
          className="side-dock__indicator"
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
        />
      )}
      <span className="relative z-10 grid place-items-center">{children}</span>
      <span className="side-dock__tip">{label}</span>
    </Link>
  );
}
