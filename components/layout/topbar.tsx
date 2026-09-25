"use client";

import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { Moon, Sun, LayoutDashboard, Settings, BookOpen, PieChart, ClipboardList, Bookmark, RefreshCw, Menu, X, ShieldAlert, BrainCircuit, Calendar as CalendarIcon, ListTodo, Target, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarQuickPanel } from "./calendar-quick-panel";
import { TodoQuickPanel } from "./todo-quick-panel";
import { GoalSliderPanel } from "./goal-slider-panel";
import { useToastStore } from "@/store/use-toast-store";
import { useGoalSliderStore, GOAL_SLIDER_DEFAULT_PERCENT } from "@/store/use-goal-slider-store";
import { isInsidePortalPopover } from "@/lib/utils";
import { AccountButton } from "./account-button";
import { BrandMark, Wordmark } from "@/components/brand/wordmark";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Exam Setup", href: "/setup", icon: Settings },
  { label: "AI Mentor", href: "/ai-mentor", icon: BrainCircuit },
  { label: "Mistakes", href: "/mistakes", icon: ClipboardList },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Revision", href: "/revision", icon: RefreshCw },
  { label: "Analytics", href: "/analytics", icon: PieChart },
];

export function Topbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
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

  const handleDeveloperReset = async () => {
    if (!confirm("Are you sure you want to hard reset the app? This will clear all data, caches, and unregister service workers.")) return;
    
    setIsResetting(true);
    try {
      indexedDB.deleteDatabase("GatePrepOS_DB");
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const r of regs) await r.unregister();
      }
      window.location.reload();
    } catch (e) {
      console.error("Reset failed", e);
      setIsResetting(false);
      useToastStore.getState().show("Reset failed: " + e, "error");
    }
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
      className={`h-16 fixed top-0 left-0 right-0 backdrop-blur-2xl backdrop-saturate-150 z-40 transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? "bg-[var(--background)]/72 shadow-[0_10px_30px_-14px_rgba(15,23,42,0.28)]"
          : "bg-[var(--background)]/55"
      }`}
    >
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-[#06c2fb] via-[#5b21e0] to-[#dd42fb]"
      />
      <div className="w-full h-full px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">

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
        </Link>

        {/* Desktop nav — a floating glass dock with a hover highlight that glides
            between items and a gradient pill on the active page. */}
        <div className="hidden lg:flex flex-1 justify-center min-w-0">
          <nav
            onMouseLeave={() => setHovered(null)}
            className="flex items-center gap-0.5 p-1 rounded-2xl bg-[var(--surface)]/45 border border-[var(--border)]/80 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.18)] backdrop-blur-md"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => setHovered(item.href)}
                  onFocus={() => setHovered(item.href)}
                  className={`group relative flex items-center gap-2 px-2.5 xl:px-3 2xl:px-3.5 py-2 rounded-xl font-semibold text-[13px] whitespace-nowrap transition-colors z-10 ${
                    isActive ? "text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
                      className="absolute inset-0 rounded-xl -z-10 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 shadow-[0_6px_18px_-4px_rgba(124,58,237,0.55)]"
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
            className="nav-cluster relative flex items-center gap-0.5 rounded-xl p-1 shadow-sm"
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
                       ? "text-white bg-indigo-600 shadow-sm"
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
                       ? "text-white bg-indigo-600 shadow-sm"
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
                className={`nav-act z-10 hidden sm:flex relative p-2 rounded-lg transition-colors cursor-pointer ${
                  isGoalSliderOpen
                    ? "text-white bg-indigo-600 shadow-sm"
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

             <div className="relative z-10 hidden sm:block w-px h-5 bg-[var(--border)] mx-0.5" />

             {/* Dev Reset is a one-tap "wipe everything" action — desktop-only (lg:,
                 matching the main nav's own collapse point), and deliberately not
                 duplicated into the mobile menu at all (unlike Focus Target above) —
                 a touchscreen makes a mis-tap easier, not harder, and there's less
                 reason to need it on a phone in the first place. */}
             <button
                onClick={handleDeveloperReset}
                disabled={isResetting}
                className="nav-act relative z-10 hidden lg:flex p-2 text-[var(--danger)] rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Developer Reset"
                title="Perform Hard Reset"
             >
                <ShieldAlert className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
             </button>

             <button
                onClick={toggleTheme}
                className="nav-act relative z-10 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer overflow-hidden"
                aria-label="Toggle Theme"
                suppressHydrationWarning
             >
                {/* Sun and moon swap with a spin-and-drop rather than an instant cut. */}
                <AnimatePresence mode="wait" initial={false}>
                   <motion.span
                      key={mounted && resolvedTheme === "dark" ? "sun" : "moon"}
                      initial={{ rotate: -90, y: -10, opacity: 0 }}
                      animate={{ rotate: 0, y: 0, opacity: 1 }}
                      exit={{ rotate: 90, y: 10, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="block"
                   >
                      {mounted && resolvedTheme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                   </motion.span>
                </AnimatePresence>
             </button>

             <div className="relative z-10 w-px h-5 bg-[var(--border)] mx-0.5" />

             <div className="relative z-10 flex items-center"><AccountButton /></div>

             <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="nav-act relative z-10 lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
             >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu — compact anchored panel, matching the Calendar/To-Do quick panels
          instead of a full-width banner across the whole screen. */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
             initial={{ opacity: 0, y: -8, scale: 0.98 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: -8, scale: 0.98 }}
             transition={{ duration: 0.15 }}
             className="lg:hidden fixed left-4 right-4 top-16 mt-2 w-auto max-w-[280px] ml-auto bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <nav className="flex flex-col p-2 w-full">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
              {/* Focus Target's own trigger button is hidden below sm: (see the Right
                  Actions row above) — mirrored here so it stays reachable on a phone. */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsGoalSliderOpen(true);
                }}
                className={`sm:hidden flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  isFocusTargetActive
                    ? "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Target className="w-4 h-4 shrink-0" />
                Focus Target
                {isFocusTargetActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                )}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>

    <AnimatePresence>
      {isGoalSliderOpen && <GoalSliderPanel onClose={() => setIsGoalSliderOpen(false)} />}
    </AnimatePresence>
    </>
  );
}
