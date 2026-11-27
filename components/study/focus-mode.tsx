"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Focus, Pause, Play, Square } from "lucide-react";
import { useFocusStore } from "@/store/use-focus-store";
import { addFocusSeconds } from "@/lib/study/study-time";

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/**
 * Focus control for the lesson dock (before Notes). Off: one round button. On: a small capsule with the running time, pause / resume and stop.
 * Only the time is shown; the capsule breathes while counting and goes still and amber when paused.
 */
export function FocusDock({ label }: { label: string }) {
  const on = useFocusStore((s) => s.on), secs = useFocusStore((s) => s.secs), paused = useFocusStore((s) => s.paused);
  const enter = useFocusStore((s) => s.enter), exit = useFocusStore((s) => s.exit), togglePause = useFocusStore((s) => s.togglePause);
  const round = "grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full transition-[transform,background-color] duration-150 active:scale-90";
  if (!on) {
    return (
      <button type="button" onClick={() => enter(label)} aria-label="Start focus mode" title="Focus mode: hide the menus and count your study time"
        className="focus-dock-off group grid h-[2.6rem] w-[2.6rem] shrink-0 cursor-pointer place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] shadow-[0_10px_30px_-12px_rgba(0,0,0,.35)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-95">
        <Focus className="h-[1.1rem] w-[1.1rem] transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" aria-hidden />
      </button>
    );
  }
  return (
    <>
    <div role="group" aria-label={"Focus mode, " + mmss(secs) + (paused ? ", paused" : "")} className={"focus-dock-on flex h-[2.6rem] shrink-0 items-center gap-0.5 rounded-full py-1 pl-3 pr-1 text-[var(--surface)] " + (paused ? "is-paused" : "")}>
      <span aria-hidden className={"focus-live mr-1.5 h-2 w-2 shrink-0 rounded-full " + (paused ? "bg-amber-300" : "bg-current")} />
      <span className="font-num min-w-[2.9rem] text-sm font-extrabold tabular-nums" aria-live="off">{mmss(secs)}</span>
      <button type="button" onClick={togglePause} aria-label={paused ? "Resume focus" : "Pause focus"} title={paused ? "Resume" : "Pause"} className={round + " hover:bg-white/20"}>
        {paused ? <Play className="h-4 w-4 fill-current" aria-hidden /> : <Pause className="h-4 w-4 fill-current" aria-hidden />}
      </button>
      <button type="button" onClick={exit} aria-label="Stop focus mode" title="Stop" className={round + " hover:bg-white/20"}><Square className="h-3.5 w-3.5 fill-current" aria-hidden /></button>
    </div>
    <span aria-hidden className="hidden h-0 basis-full max-sm:block" />
    </>
  );
}

/**
 * Mounted once in the app shell. While Focus mode is on (study pages only) it counts the time the page is visible, saves it as study time
 * every 15 seconds and when the reader leaves, and shows a small timer with the way out. Leaving /study switches Focus mode off.
 */
export function FocusSession() {
  const on = useFocusStore((s) => s.on), label = useFocusStore((s) => s.label), exit = useFocusStore((s) => s.exit);
  const pathname = usePathname();
  const inStudy = !!pathname?.startsWith("/study");
  const setSecs = useFocusStore((s) => s.setSecs);
  const pending = useRef(0);

  useEffect(() => { if (on && !inStudy) exit(); }, [on, inStudy, exit]);

  useEffect(() => {
    if (!on || !inStudy) return;
    pending.current = 0; const reset = setTimeout(() => setSecs(0), 0);
    const flush = () => { const n = pending.current; pending.current = 0; if (n > 0) addFocusSeconds(n, label); };
    const tick = setInterval(() => {
      if (document.visibilityState !== "visible" || useFocusStore.getState().paused) return;
      pending.current += 1; setSecs(useFocusStore.getState().secs + 1);
      if (pending.current >= 15) flush();
    }, 1000);
    const away = () => { if (document.visibilityState !== "visible") flush(); };
    document.addEventListener("visibilitychange", away); window.addEventListener("pagehide", flush);
    return () => { clearTimeout(reset); clearInterval(tick); document.removeEventListener("visibilitychange", away); window.removeEventListener("pagehide", flush); flush(); };
  }, [on, inStudy, label, setSecs]);

  return null;
}
