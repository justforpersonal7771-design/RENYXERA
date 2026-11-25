"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { Focus, X } from "lucide-react";
import { useFocusStore } from "@/store/use-focus-store";
import { addFocusSeconds } from "@/lib/study/study-time";

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

/** The button that turns Focus mode on or off. It sits in the lesson header, where the reader's other controls are. */
export function FocusButton({ label }: { label: string }) {
  const on = useFocusStore((s) => s.on), secs = useFocusStore((s) => s.secs);
  const enter = useFocusStore((s) => s.enter), exit = useFocusStore((s) => s.exit);
  return (
    <button type="button" onClick={() => (on ? exit() : enter(label))} aria-pressed={on} aria-label={on ? "Leave focus mode (" + mmss(secs) + " so far)" : "Start focus mode"} data-on={on ? "" : undefined}
      className={"focus-btn group relative inline-flex h-10 cursor-pointer items-center gap-2 overflow-hidden rounded-lg border px-3 text-sm font-bold transition-all duration-300 " + (on ? "focus-btn-on border-transparent text-[var(--surface)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:-translate-y-px hover:border-[var(--st-accent,var(--text-primary))] hover:text-[var(--text-primary)]")}>
      <span className="relative grid h-4 w-4 place-items-center">
        {on && <span aria-hidden className="focus-ping absolute inset-[-3px] rounded-full" />}
        <Focus className={"relative h-4 w-4 transition-transform duration-300 " + (on ? "scale-110" : "group-hover:scale-110")} aria-hidden />
      </span>
      <span>{on ? "In focus" : "Focus"}</span>
      {on && <span className="font-num tabular-nums text-[0.85rem] font-extrabold opacity-95" aria-hidden>{mmss(secs)}</span>}
      {on && <X className="h-3.5 w-3.5 opacity-80" aria-hidden />}
    </button>
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
  const secs = useFocusStore((s) => s.secs), setSecs = useFocusStore((s) => s.setSecs);
  const pending = useRef(0);

  useEffect(() => { if (on && !inStudy) exit(); }, [on, inStudy, exit]);

  useEffect(() => {
    if (!on || !inStudy) return;
    pending.current = 0; const reset = setTimeout(() => setSecs(0), 0);
    const flush = () => { const n = pending.current; pending.current = 0; if (n > 0) addFocusSeconds(n, label); };
    const tick = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      pending.current += 1; setSecs(useFocusStore.getState().secs + 1);
      if (pending.current >= 15) flush();
    }, 1000);
    const away = () => { if (document.visibilityState !== "visible") flush(); };
    document.addEventListener("visibilitychange", away); window.addEventListener("pagehide", flush);
    return () => { clearTimeout(reset); clearInterval(tick); document.removeEventListener("visibilitychange", away); window.removeEventListener("pagehide", flush); flush(); };
  }, [on, inStudy, label, setSecs]);

  if (!on || !inStudy) return null;
  return (
    <div role="status" aria-label="Focus mode is on" className="fixed right-3 top-3 z-40 flex items-center gap-2 lg:hidden rounded-full border border-[var(--border)] bg-[var(--surface)] py-1 pl-3 pr-1 shadow-sm">
      <Focus className="h-3.5 w-3.5 text-[var(--st-accent,var(--text-primary))]" aria-hidden />
      <span className="text-xs font-bold text-[var(--text-secondary)]">Focus</span>
      <span className="font-num text-sm font-extrabold tabular-nums text-[var(--text-primary)]" aria-live="off">{mmss(secs)}</span>
      <button type="button" onClick={exit} aria-label="Leave focus mode" className="grid h-7 w-7 cursor-pointer place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"><X className="h-4 w-4" /></button>
    </div>
  );
}
