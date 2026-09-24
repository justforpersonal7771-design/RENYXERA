"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Topbar } from "./topbar";
import { LaunchIntro } from "./launch-intro";
import { useDataStore } from "@/store/use-data-store";
import { checkDueReminders } from "@/lib/notifications/reminder-scheduler";
import { AuthModal } from "@/components/auth/auth-modal";

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
    <div className="h-screen w-screen overflow-hidden bg-background ambient-gradient text-text-primary font-sans transition-colors selection:bg-accent/30 font-inter relative">
      <LaunchIntro />
      {/* Topbar is fixed (not sticky-in-flow); the ambient body gradient
          (background-attachment: fixed, unaffected by scroll position) still
          shows through its glass/blur regardless of how the content below is
          structured. */}
      <Topbar />
      {/* <main> itself no longer owns the scroll — it's a full-height,
          non-scrolling passthrough. The actual scrolling element is the inner
          div below, explicitly positioned to start exactly at the topbar's
          own height (top-16 = 64px, matching header.h-16 in topbar.tsx) and
          run to the bottom. That's a structural fix, not a cosmetic one: the
          native scrollbar a browser renders is always sized to match the
          scrolling element's own box — as long as that box spanned the full
          viewport height (the previous h-full + pt-* padding approach), the
          scrollbar necessarily extended up behind the fixed topbar too, no
          matter how the thumb itself was styled. Starting the box below the
          topbar is the only way to keep the scrollbar from ever reaching that
          region. */}
      <main className="relative z-10 w-full h-full overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 top-16 overflow-y-auto custom-scrollbar px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="h-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
      <ToastContainer />
      <AuthModal />
    </div>
  );
}

