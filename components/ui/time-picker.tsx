"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Clock } from "lucide-react";

/** Replaces <input type="time"> (the browser's own popup can't be themed). Value is "HH:MM". */
export function TimePicker({ value, onChange, className = "", step = 5 }: { value: string; onChange: (v: string) => void; className?: string; step?: number }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  const [h, m] = (value || "09:00").split(":");

  useEffect(() => {
    if (!open) return;
    const r = btn.current?.getBoundingClientRect();
    if (r) setRect({ top: r.bottom + 6 + 232 > innerHeight ? r.top - 238 : r.bottom + 6, left: Math.min(r.left, innerWidth - 196), width: r.width });
    const away = (e: PointerEvent) => { if (!pop.current?.contains(e.target as Node) && !btn.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    // Bring the selected hour/minute into view.
    requestAnimationFrame(() => pop.current?.querySelectorAll<HTMLElement>("[data-on=true]").forEach((el) => el.scrollIntoView({ block: "center" })));
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const mins = Array.from({ length: Math.ceil(60 / step) }, (_, i) => String(i * step).padStart(2, "0"));
  const col = (items: string[], cur: string, set: (v: string) => void) => (
    <div className="h-52 overflow-y-auto custom-scrollbar pr-0.5 space-y-0.5">
      {items.map((v) => (
        <button key={v} type="button" data-on={v === cur} onClick={() => set(v)}
          className={`w-full h-8 rounded-lg text-xs font-bold font-num transition-colors cursor-pointer ${v === cur ? "bg-indigo-600 text-white shadow-sm" : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"}`}>
          {v}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <button ref={btn} type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open}
        className={`w-full flex items-center justify-between gap-2 p-2.5 bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-num font-semibold rounded-xl outline-none cursor-pointer transition-colors hover:border-violet-400/60 focus-visible:ring-2 focus-visible:ring-violet-500/50 ${className}`}>
        {value || "--:--"} <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
      </button>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && rect && (
            <motion.div ref={pop} role="dialog" aria-label="Choose time"
              initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }} transition={{ duration: 0.15 }}
              style={{ position: "fixed", top: rect.top, left: rect.left, minWidth: Math.max(180, rect.width) }}
              className="z-[400] grid grid-cols-2 gap-1.5 p-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
              {col(hours, h, (v) => onChange(`${v}:${m}`))}
              {col(mins, m, (v) => { onChange(`${h}:${v}`); setOpen(false); })}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
