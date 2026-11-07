"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useTheme } from "next-themes";
import {
  BookOpenText, BrainCircuit, Calendar as CalendarIcon, LayoutDashboard, Library, ListTodo, Moon, PieChart, Search, Settings, Sun, Swords, Target, Wrench,
} from "lucide-react";
import { BrandMark } from "@/components/brand/wordmark";
import { TEST_CENTRE, TEST_CENTRE_HREF, isTestCentrePath } from "@/lib/test-centre/brand";
import { TOOLS_HOME, isToolPath } from "@/lib/seo/tools";
import { isInsidePortalPopover } from "@/lib/utils";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useAuthStore } from "@/store/use-auth-store";
import { useGoalSliderStore, GOAL_SLIDER_DEFAULT_PERCENT } from "@/store/use-goal-slider-store";
import { effectiveLookId, useLookStore } from "@/store/use-look-store";
import { isReviewPath, lastReviewHref } from "./review-tabs";
import { CalendarQuickPanel } from "./calendar-quick-panel";
import { TodoQuickPanel } from "./todo-quick-panel";
import { LeaderboardButton } from "./leaderboard-panel";
import { AccountButton } from "./account-button";
import { BranchChip } from "./branch-chip";

const GoalSliderPanel = dynamic(() => import("./goal-slider-panel").then((m) => m.GoalSliderPanel), { ssr: false });

/**
 * True when the Lunar look is active on a desktop-width screen: there the left glass dock replaces the top bar entirely.
 * False on the server and before the first effect, so the first paint is the normal page and the top bar (hidden by the
 * Lunar CSS at this width) never shows twice.
 */
export function useLunarDock() {
  const lookState = useLookStore();
  const lunar = effectiveLookId(lookState) === "lunar";
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const f = () => setWide(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return lunar && wide;
}

/**
 * Lunar Glass navigation: one floating vertical glass pill on the left, no top bar.
 * Top to bottom: the logo (home) · the pages · quick tools (search, planner, to-do, focus target, leaderboard, tools)
 * · theme, paper and profile. Names appear as a flyout on hover or focus; the active page has one indicator that glides.
 * Pop-ups (planner, to-do, focus target) open beside the dock; they are rendered outside it because the dock's glass
 * effect would otherwise become their positioning frame.
 */
export function SideDock() {
  const pathname = usePathname() ?? "";
  const { setTheme, resolvedTheme } = useTheme();
  const signedIn = useAuthStore((s) => !!s.user);
  const tier = useEntitlements().tier;
  const [reviewHref, setReviewHref] = useState("/mistakes");
  useEffect(() => { setReviewHref(lastReviewHref()); }, [pathname]);

  const [panel, setPanel] = useState<null | "calendar" | "todo">(null);
  const [goalOpen, setGoalOpen] = useState(false);
  const { targetPercent, load: loadGoal } = useGoalSliderStore();
  const goalActive = targetPercent < GOAL_SLIDER_DEFAULT_PERCENT;
  useEffect(() => { loadGoal(); }, [loadGoal]);
  useEffect(() => { setPanel(null); }, [pathname]);

  const popRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!panel) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (isInsidePortalPopover(e.target)) return;
      if (t?.closest("[data-dock-pop], .side-dock")) return;
      setPanel(null);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPanel(null); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [panel]);

  const openPalette = () => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));

  const pages = [
    { label: TEST_CENTRE, href: TEST_CENTRE_HREF, icon: Settings, active: isTestCentrePath(pathname) },
    { label: "Study", href: "/study", icon: BookOpenText, active: pathname.startsWith("/study") },
    { label: "AI Mentor", href: "/ai-mentor", icon: BrainCircuit, active: pathname.startsWith("/ai-mentor") },
    { label: "Review", href: reviewHref, icon: Library, active: isReviewPath(pathname) },
    { label: "Analytics", href: "/analytics", icon: PieChart, active: pathname.startsWith("/analytics") },
    { label: "Battles", href: "/battles", icon: Swords, active: pathname.startsWith("/battles") },
  ];
  const toolsActive = isToolPath(pathname) || pathname === TOOLS_HOME || pathname.startsWith("/downloads");
  const home = pathname === "/";

  return (
    <>
      <nav aria-label="Main" className="side-dock">
        <LayoutGroup id="side-dock">
          <Link href="/" aria-label="RENYXERA — Dashboard" aria-current={home ? "page" : undefined} className="side-dock__logo" data-active={home ? "" : undefined}>
            <BrandMark className="h-9 w-9" />
            <span className="side-dock__tip">Dashboard</span>
          </Link>
          <div className="side-dock__rule" aria-hidden />

          <ul className="side-dock__list">
            {pages.map((it) => (
              <li key={it.label}>
                <DockLink href={it.href} label={it.label} active={it.active}><it.icon className="h-[18px] w-[18px]" /></DockLink>
              </li>
            ))}
          </ul>
          <div className="side-dock__rule" aria-hidden />

          <ul className="side-dock__list">
            <li><DockButton label="Search (Ctrl+K)" onClick={openPalette}><Search className="h-[18px] w-[18px]" /></DockButton></li>
            <li><DockButton label="Study planner" active={panel === "calendar"} onClick={() => setPanel((p) => (p === "calendar" ? null : "calendar"))}><CalendarIcon className="h-[18px] w-[18px]" /></DockButton></li>
            <li><DockButton label="To-do list" active={panel === "todo"} onClick={() => setPanel((p) => (p === "todo" ? null : "todo"))}><ListTodo className="h-[18px] w-[18px]" /></DockButton></li>
            <li>
              <DockButton label={goalActive ? `Focus target: ${targetPercent}% of the syllabus` : "Focus target"} active={goalOpen} onClick={() => setGoalOpen(true)}>
                <Target className="h-[18px] w-[18px]" />
                {goalActive && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f5b69e] ring-2 ring-white/80" />}
              </DockButton>
            </li>
            <li className="side-dock__widget"><LeaderboardButton /><span className="side-dock__tip">Leaderboard</span></li>
            <li><DockLink href={TOOLS_HOME} label="Tools" active={toolsActive}><Wrench className="h-[18px] w-[18px]" /></DockLink></li>
          </ul>

          <div className="side-dock__spacer" aria-hidden />
          <ul className="side-dock__list">
            <li>
              <DockButton label="Theme" onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}>
                <Sun className="hidden h-[18px] w-[18px] dark:block" />
                <Moon className="block h-[18px] w-[18px] dark:hidden" />
              </DockButton>
            </li>
            <li className="side-dock__branch"><BranchChip /></li>
            <li className="side-dock__account" data-tier={signedIn ? tier : undefined}>
              <AccountButton />
              <span className="side-dock__tip">{signedIn ? "Profile" : "Sign in"}</span>
            </li>
          </ul>
        </LayoutGroup>
      </nav>

      <div data-dock-pop ref={popRef} className="side-dock-pop">
        <AnimatePresence>
          {panel === "calendar" && <CalendarQuickPanel key="cal" onClose={() => setPanel(null)} />}
          {panel === "todo" && <TodoQuickPanel key="todo" />}
        </AnimatePresence>
      </div>
      <AnimatePresence>{goalOpen && <GoalSliderPanel onClose={() => setGoalOpen(false)} />}</AnimatePresence>
    </>
  );
}

function DockLink({ href, label, active, children }: { href: string; label: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-label={label} aria-current={active ? "page" : undefined} className="side-dock__item" data-active={active ? "" : undefined}>
      {active && <motion.span layoutId="side-dock-active" className="side-dock__indicator" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
      <span className="relative z-10 grid place-items-center">{children}</span>
      <span className="side-dock__tip">{label}</span>
    </Link>
  );
}

function DockButton({ label, active, onClick, children }: { label: string; active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} aria-pressed={active ? true : undefined} onClick={onClick} className="side-dock__item" data-active={active ? "" : undefined}>
      {active && <span className="side-dock__indicator side-dock__indicator--soft" />}
      <span className="relative z-10 grid place-items-center">{children}</span>
      <span className="side-dock__tip">{label}</span>
    </button>
  );
}
