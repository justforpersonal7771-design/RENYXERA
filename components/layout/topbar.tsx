import { motion, AnimatePresence } from "motion/react";

// ... keep icons and other imports
import { Moon, Sun, LayoutDashboard, Settings, BookOpen, PieChart, ClipboardList, Bookmark, RefreshCw, Menu, X, ShieldAlert, BrainCircuit, Calendar as CalendarIcon, ListTodo, Target } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarQuickPanel } from "./calendar-quick-panel";
import { TodoQuickPanel } from "./todo-quick-panel";
import { GoalSliderPanel } from "./goal-slider-panel";
import { useToastStore } from "@/store/use-toast-store";
import { useGoalSliderStore, GOAL_SLIDER_DEFAULT_PERCENT } from "@/store/use-goal-slider-store";

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
    <header className="h-16 fixed top-0 left-0 right-0 bg-[var(--background)]/72 backdrop-blur-2xl backdrop-saturate-150 z-40 transition-colors">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      <div className="w-full h-full px-4 sm:px-6 md:px-8 flex items-center justify-between">

        {/* Logo and Desktop Nav */}
        <div className="flex items-center gap-8 h-full">
          <Link href="/" className="shrink-0 flex items-center gap-2.5 group">
             <img
                src={mounted && resolvedTheme === "light" ? "/brand/mark-light.png" : "/brand/mark-dark.png"}
                alt="RENYXERA"
                className="h-8 w-auto object-contain transition-transform group-hover:scale-105 group-hover:rotate-3 drop-shadow-[0_4px_14px_rgba(79,70,229,0.35)]"
             />
             <img
                src={mounted && resolvedTheme === "light" ? "/brand/wordmark-light.png" : "/brand/wordmark-dark.png"}
                alt="RENYXERA"
                className="hidden sm:block h-5 w-auto dark:[filter:invert(1)_hue-rotate(180deg)]"
             />
          </Link>

          <nav className="hidden lg:flex items-center h-full gap-1 relative">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg font-bold text-sm transition-colors z-10 ${
                    isActive
                      ? "text-white"
                      : "text-[var(--text-primary)]/75 hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="topbar-active-pill"
                      className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg -z-10 shadow-md shadow-indigo-600/25"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          <div className="flex items-center gap-0.5 bg-[var(--surface)]/80 border border-[var(--border)] backdrop-blur-md rounded-xl p-1 shadow-sm">
             <div className="relative" ref={calendarRef}>
                <button
                   onClick={() => setIsCalendarOpen(prev => !prev)}
                   className={`p-2 rounded-lg transition-colors cursor-pointer ${
                     isCalendarOpen
                       ? "text-white bg-indigo-600 shadow-sm"
                       : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
                   }`}
                   aria-label="Study Planner Quick Access"
                   title="Study Planner"
                >
                   <CalendarIcon className="w-4 h-4" />
                </button>
                <AnimatePresence>
                   {isCalendarOpen && (
                      <CalendarQuickPanel onClose={() => setIsCalendarOpen(false)} />
                   )}
                </AnimatePresence>
             </div>

             <div className="relative" ref={todoRef}>
                <button
                   onClick={() => setIsTodoOpen(prev => !prev)}
                   className={`p-2 rounded-lg transition-colors cursor-pointer ${
                     isTodoOpen
                       ? "text-white bg-indigo-600 shadow-sm"
                       : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
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

             <button
                onClick={() => setIsGoalSliderOpen(true)}
                className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
                  isGoalSliderOpen
                    ? "text-white bg-indigo-600 shadow-sm"
                    : isFocusTargetActive
                      ? "text-amber-600 dark:text-amber-400 bg-amber-500/15 ring-1 ring-amber-500/40 hover:bg-amber-500/25"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]"
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

             <div className="w-px h-5 bg-[var(--border)] mx-0.5" />

             <button
                onClick={handleDeveloperReset}
                disabled={isResetting}
                className="p-2 text-[var(--danger)] hover:bg-[var(--danger)]/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Developer Reset"
                title="Perform Hard Reset"
             >
                <ShieldAlert className={`w-4 h-4 ${isResetting ? "animate-spin" : ""}`} />
             </button>

             <button
                onClick={toggleTheme}
                className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-lg transition-colors cursor-pointer"
                aria-label="Toggle Theme"
                suppressHydrationWarning
             >
                {mounted && resolvedTheme === "dark" ? (
                   <Sun className="w-4 h-4" />
                ) : (
                   <Moon className="w-4 h-4" />
                )}
             </button>

             <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-lg transition-colors cursor-pointer"
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
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-[var(--surface-secondary)] text-[var(--text-primary)] border border-[var(--border-subtle)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
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
