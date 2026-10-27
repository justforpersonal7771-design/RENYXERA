"use client";

import { LeaderboardButton } from "@/components/layout/leaderboard-panel";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { Moon, Sun, LayoutDashboard, Settings, PieChart, Menu, X, BrainCircuit, Calendar as CalendarIcon, ListTodo, Target, Search, Download, Timer, Library, Wrench, Anvil, BookOpenText } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarQuickPanel } from "./calendar-quick-panel";
import { TodoQuickPanel } from "./todo-quick-panel";
import dynamic from "next/dynamic";
// Loaded only when opened: it pulls in the chart library, which no other top-bar control needs.
const GoalSliderPanel = dynamic(() => import("./goal-slider-panel").then((m) => m.GoalSliderPanel), { ssr: false });
import { useToastStore } from "@/store/use-toast-store";
import { useGoalSliderStore, GOAL_SLIDER_DEFAULT_PERCENT } from "@/store/use-goal-slider-store";
import { isInsidePortalPopover } from "@/lib/utils";
import { AccountButton } from "./account-button";
import { BrandMark, Wordmark } from "@/components/brand/wordmark";
import { useAuthStore } from "@/store/use-auth-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { isReviewPath, lastReviewHref } from "./review-tabs";
import { TOOLS_HOME, isToolPath } from "@/lib/seo/tools";
import { BranchChip } from "./branch-chip";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Exam Setup", href: "/setup", icon: Settings },
  { label: "Mocks", href: "/mocks", icon: Timer },
  { label: "Forge", href: "/forge", icon: Anvil },
  { label: "Study", href: "/study", icon: BookOpenText },
  { label: "AI Mentor", href: "/ai-mentor", icon: BrainCircuit },
  // Mistakes, Bookmarks and Revision are one section with tabs (components/layout/review-tabs).
  { label: "Review", href: "/mistakes", icon: Library },
  { label: "Analytics", href: "/analytics", icon: PieChart },
  { label: "Tools", href: TOOLS_HOME, icon: Wrench },
];

export function Topbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const signedIn = useAuthStore((st) => !!st.user);
  const tier = useEntitlements().tier;
  const isPro = signedIn && tier === "pro";
  const isPlus = signedIn && tier === "plus";
  const [hovered, setHovered] = useState<string | null>(null);
  // "Review" reopens the tab used last; read after mount so SSR and hydration agree.
  const [reviewHref, setReviewHref] = useState("/mistakes");
  useEffect(() => { setReviewHref(lastReviewHref()); }, [pathname]);
  const [scrolled, setScrolled] = useState(false);
  // Scroll progress of the page's own scroller (<main>'s inner div — html/body never
  // scroll in this app), shown as a thin brand-gradient line under the bar.
  const progressRaw = useMotionValue(0);
  const progress = useSpring(progressRaw, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = (e: Event) => {
      const el = e.target as HTMLElement;
      if (!(el instanceof HTMLElement) || !el.closest("main")) return;
      setScrolled(el.scrollTop > 8);
      const max = el.scrollHeight - el.clientHeight;
      progressRaw.set(max > 0 ? el.scrollTop / max : 0);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    return () => document.removeEventListener("scroll", onScroll, { capture: true } as any);
  }, [progressRaw]);

  // New page → starts at the top.
  useEffect(() => {
    setScrolled(false);
    progressRaw.set(0);
  }, [pathname, progressRaw]);

  // Gliding hover highlight inside the action cluster.
  const clusterRef = useRef<HTMLDivElement>(null);
  const [actPill, setActPill] = useState<{ x: number; w: number } | null>(null);
  const onClusterOver = (e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest(".nav-act") as HTMLElement | null;
    const box = clusterRef.current;
    if (!btn || !box) return;
    const b = btn.getBoundingClientRect();
    const c = box.getBoundingClientRect();
    setActPill({ x: b.left - c.left, w: b.width });
  };

  const openPalette = () =>
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true }));

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const todoRef = useRef<HTMLDivElement>(null);
  const [isGoalSliderOpen, setIsGoalSliderOpen] = useState(false);
  const { targetPercent, load: loadGoalSlider } = useGoalSliderStore();
  const isFocusTargetActive = targetPercent < GOAL_SLIDER_DEFAULT_PERCENT;

  useEffect(() => {
    loadGoalSlider();
  }, [loadGoalSlider]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isCalendarOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (isInsidePortalPopover(event.target)) return;
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCalendarOpen]);

  // Mobile menu: tapping anywhere outside it (or its toggle) closes it.
  useEffect(() => {
    const toggle = () => setMobileMenuOpen((o) => !o);
    window.addEventListener("renyxera:open-more-menu", toggle);
    return () => window.removeEventListener("renyxera:open-more-menu", toggle);
  }, []);
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t?.closest("[data-mobile-menu], [data-mobile-menu-toggle]")) return;
      setMobileMenuOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!isTodoOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (isInsidePortalPopover(event.target)) return;
      if (todoRef.current && !todoRef.current.contains(event.target as Node)) {
        setIsTodoOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isTodoOpen]);

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };



  return (
    <>
    {/* Stays genuinely translucent (you can see content move underneath) but at a tint
        strong enough to hold text contrast. The bar is fixed over a scrolling page, so
        the backdrop behind the labels keeps changing — a near-black hero one moment, a
        white card the next — while the label colour is fixed per theme. At 45% the
        labels visibly dissolved into dark content passing under. Heavier blur turns that
        content into a smooth wash rather than hard shapes, and the extra tint keeps the
        labels readable at every scroll position. */}
    <header
      data-scrolled={scrolled ? "" : undefined}
      // R18: a floating island (8px from the top, 56px tall, so content still starts at 64px).
      className={`topbar-island h-14 fixed top-2 left-2 right-2 sm:left-4 sm:right-4 z-40 rounded-[20px] transition-shadow duration-300 ${
        scrolled ? "shadow-[0_14px_36px_-18px_rgba(12,34,75,0.35)]" : "shadow-[0_4px_16px_-10px_rgba(12,34,75,0.18)]"
      }`}
    >
      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="hidden"
      />
      <div className="w-full h-full px-2.5 sm:px-4 md:px-5 flex items-center justify-between gap-1.5 sm:gap-4">

        {/* Logo */}
        {/* Logo hover (.logo-fx): the mark spins once in 3D inside a glowing halo with an
            expanding ripple, and a light sweeps across the wordmark while its "ERA"
            gradient starts flowing. */}
        <Link href="/" aria-label="RENYXERA — Dashboard" className="logo-fx shrink-0 flex items-center gap-2.5">
          <span className="logo-mark relative flex items-center justify-center">
            <span className="logo-halo" aria-hidden="true" />
            <span className="logo-ripple" aria-hidden="true" />
            <span className="logo-spin relative drop-shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
              <BrandMark className="h-8 w-8" />
            </span>
          </span>
          <span className="logo-word relative hidden sm:inline-block overflow-hidden">
            <Wordmark />
            <span className="logo-sweep" aria-hidden="true" />
          </span>
          {(isPro || isPlus) && <span className={`pro-badge ${isPlus ? "is-silver" : ""}`}>{isPro ? "PRO" : "PLUS"}</span>}
        </Link>

        {/* Desktop nav — a floating glass dock with a hover highlight that glides
            between items and a gradient pill on the active page. */}
        <div className="hidden lg:flex flex-1 justify-center min-w-0">
          <nav
            onMouseLeave={() => setHovered(null)}
            className="main-dock flex items-center gap-0.5"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = item.label === "Review" ? isReviewPath(pathname) : item.label === "Tools" ? isToolPath(pathname) : pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.label === "Review" ? reviewHref : item.href}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => setHovered(item.href)}
                  onFocus={() => setHovered(item.href)}
                  className={`group relative flex items-center gap-2 px-2.5 xl:px-3 2xl:px-3.5 py-2 rounded-xl font-semibold text-[13px] whitespace-nowrap transition-colors z-10 ${
                    isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {hovered === item.href && !isActive && (
                    <motion.span
                      layoutId="topbar-hover-pill"
                      className="absolute inset-0 rounded-xl bg-[var(--surface-secondary)] -z-10"
                      transition={{ type: "spring", stiffness: 500, damping: 38 }}
                    />
                  )}
                  {isActive && (
                    <motion.span
                      layoutId="topbar-active-pill"
                      className="absolute inset-0 rounded-xl -z-10 nav-active-pill"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-4 h-4 shrink-0 xl:hidden 2xl:block transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Action cluster: brand comet circling the border (.nav-cluster), a highlight
              that glides to whichever icon is hovered, and icons that re-draw their
              strokes on hover (.nav-act). */}
          <div
            ref={clusterRef}
            onMouseOver={onClusterOver}
            onMouseLeave={() => setActPill(null)}
            className="relative flex items-center gap-0.5 rounded-xl p-1"
          >
             <AnimatePresence>
                {actPill && (
                   <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, x: actPill.x, width: actPill.w }}
                      animate={{ opacity: 1, x: actPill.x, width: actPill.w }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 520, damping: 38 }}
                      className="absolute top-1 bottom-1 left-0 rounded-lg bg-[var(--surface-secondary)] pointer-events-none"
                   />
                )}
             </AnimatePresence>
             <button
                onClick={openPalette}
                className="nav-act relative z-10 hidden md:flex items-center gap-2 p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                aria-label="Search and commands (Ctrl+K)"
                title="Search & commands (Ctrl+K)"
             >
                <Search className="w-4 h-4" />
             </button>
             <div className="relative" ref={calendarRef}>
                <button
                   onClick={() => setIsCalendarOpen(prev => !prev)}
                   className={`nav-act relative z-10 p-2 rounded-lg transition-colors cursor-pointer ${
                     isCalendarOpen
                       ? "nav-active-pill text-[var(--text-primary)]"
                       : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                   }`}
                   aria-label="Study Planner Quick Access"
                   title="Study Planner"
                >
                   <CalendarIcon className="w-4 h-4" />
                </button>
                {/* Already renders as a fixed, full-width bottom-anchored sheet below
                    sm: (calendar-quick-panel.tsx), so this stays visible at every
                    width rather than moving into the mobile menu. */}
                <AnimatePresence>
                   {isCalendarOpen && (
                      <CalendarQuickPanel onClose={() => setIsCalendarOpen(false)} />
                   )}
                </AnimatePresence>
             </div>

             <div className="relative" ref={todoRef}>
                <button
                   onClick={() => setIsTodoOpen(prev => !prev)}
                   className={`nav-act relative z-10 p-2 rounded-lg transition-colors cursor-pointer ${
                     isTodoOpen
                       ? "nav-active-pill text-[var(--text-primary)]"
                       : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                   }`}
                   aria-label="To-Do List Quick Access"
                   title="To-Do List"
                >
                   <ListTodo className="w-4 h-4" />
                </button>
                <AnimatePresence>
                   {isTodoOpen && <TodoQuickPanel />}
                </AnimatePresence>
             </div>

             {/* Focus Target and Dev Reset move into the mobile menu below sm:/lg: —
                 with Calendar + Todo already taking two slots, keeping all five
                 (plus theme toggle, account, hamburger) in one row left every icon
                 nearly untappable on a phone, and Sign In specifically label-less
                 (its text is hidden below sm: — see AccountButton). GoalSliderPanel
                 itself renders as a centered fixed modal outside this row (not
                 anchored to this button), so triggering it from the mobile menu
                 instead needs no extra plumbing. */}
             <button
                onClick={() => setIsGoalSliderOpen(true)}
                className={`nav-act z-10 flex relative p-2 rounded-lg transition-colors cursor-pointer ${
                  isGoalSliderOpen
                    ? "nav-active-pill text-[var(--text-primary)]"
                    : isFocusTargetActive
                      ? "text-amber-600 dark:text-amber-400 bg-amber-500/15 ring-1 ring-amber-500/40 hover:bg-amber-500/25"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
                aria-label="Focus Target"
                title={isFocusTargetActive ? `Focus Target active — ${targetPercent}% syllabus` : "Focus Target"}
             >
                <Target className="w-4 h-4" />
                {/* "A goal is configured" is a persistent state, so it gets its own amber
                    treatment (tinted fill + ring + dot) rather than reusing the indigo fill
                    that means "this panel is currently open" on the Calendar/To-Do buttons.
                    The dot alone was too easy to miss. */}
                {isFocusTargetActive && (
                   <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 border border-[var(--surface)]" />
                )}
             </button>

             <LeaderboardButton />
             {signedIn && (
               <Link
                  href="/downloads"
                  className={`nav-act z-10 hidden sm:flex relative p-2 rounded-lg transition-colors ${
                    pathname?.startsWith("/downloads") ? "nav-active-pill text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                  aria-label="Downloads"
                  title="Downloads — study offline"
               >
                  <Download className="w-4 h-4" />
               </Link>
             )}

             <div className="relative z-10 hidden sm:block w-px h-5 bg-[var(--border)] mx-0.5" />
             <button
                onClick={toggleTheme}
                className="nav-act relative z-10 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer overflow-hidden"
                aria-label="Toggle Theme"
                suppressHydrationWarning
             >
                {/* Pure-CSS swap keyed off the <html> dark class: the right icon is correct from the
                    first paint, so navigating between layouts never replays a sun/moon animation. */}
                <Sun className="hidden dark:block w-4 h-4" />
                <Moon className="block dark:hidden w-4 h-4" />
             </button>

             <div className="relative z-10 flex items-center"><BranchChip /></div>

             <div className="relative z-10 w-px h-5 bg-[var(--border)] mx-0.5" />

             <div className="relative z-10 flex items-center"><AccountButton /></div>

          </div>
        </div>
      </div>

    </header>

    <AnimatePresence>
      {isGoalSliderOpen && <GoalSliderPanel onClose={() => setIsGoalSliderOpen(false)} />}
    </AnimatePresence>
    </>
  );
}
