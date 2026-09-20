"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Topbar } from "./topbar";
import { LaunchIntro } from "./launch-intro";
import { useDataStore } from "@/store/use-data-store";
import { checkDueReminders } from "@/lib/notifications/reminder-scheduler";

import { useState } from "react";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(
  () => import("../exam/command-palette").then(m => m.CommandPalette),
  { ssr: false }
);

const ToastContainer = dynamic(
  () => import("../ui/toast-container").then(m => m.ToastContainer),
  { ssr: false }
);

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const loadRepository = useDataStore((state) => state.loadRepository);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Parallax: the ambient gradient lives on its own fixed layer behind <main> and drifts
  // at a fraction of scroll speed, instead of being painted onto <main> itself (which would
  // just scroll it at 1:1 with the content, i.e. no parallax at all).
  const { scrollY } = useScroll({ container: mainRef });
  const bgY = useTransform(scrollY, [0, 1600], [0, prefersReducedMotion ? 0 : -220]);

  useEffect(() => {
    loadRepository();
    // Register PWA Service Worker. This effect runs after hydration, by which point the
    // window's "load" event has typically already fired — a window.addEventListener("load",
    // ...) registered here would never receive it, meaning registration silently never ran
    // at all. Register directly instead; navigator.serviceWorker.register() is safe to call
    // any time.
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then((reg) => console.log("SW registered:", reg.scope))
        .catch((err) => console.warn("SW failed:", err));
    }
  }, [loadRepository]);

  // Study-event reminders are fully opt-in (per-event reminderToggle + startTime);
  // poll every 30s rather than scheduling per-event setTimeouts since the tab may be
  // closed/reopened at any point between now and a reminder's scheduled time.
  useEffect(() => {
    checkDueReminders();
    const intervalId = setInterval(checkDueReminders, 30000);
    return () => clearInterval(intervalId);
  }, []);

  // Global key listener for Ctrl+K command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  const isExamSession = pathname?.startsWith("/exam/session") || pathname?.startsWith("/revision/session") || pathname?.startsWith("/exam/results/review");

  if (isExamSession) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-background ambient-gradient text-text-primary font-sans transition-colors selection:bg-accent/30 relative">
        <LaunchIntro />
        <main className="w-full h-full overflow-hidden">
          {children}
        </main>
        <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-text-primary font-sans transition-colors selection:bg-accent/30 font-inter relative">
      {/* Parallax layer: absolutely positioned behind everything, drifts on scroll via bgY. */}
      <motion.div className="absolute inset-0 ambient-gradient pointer-events-none" style={{ y: bgY }} />
      <LaunchIntro />
      {/* Topbar is fixed (not sticky-in-flow), so page content genuinely scrolls
          underneath it — required for its glass/blur effect to actually reveal
          anything, instead of always sitting over a static, empty strip. */}
      <Topbar />
      <main
        ref={mainRef}
        className="relative z-10 w-full h-full overflow-y-auto pt-20 sm:pt-24 md:pt-28 px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8 custom-scrollbar"
      >
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="h-full"
        >
          {children}
        </motion.div>
      </main>
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
      <ToastContainer />
    </div>
  );
}

