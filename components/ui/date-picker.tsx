"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  /** ISO date string, yyyy-mm-dd. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Renders the trigger as a compact chip instead of a full-width field. */
  compact?: boolean;
  autoOpen?: boolean;
  onClose?: () => void;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function parseISO(s: string): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** Replaces <input type="date">, whose popup is the browser's own native calendar and
 *  can't be themed to match the rest of the app. Portal-rendered so it can't be clipped
 *  by an ancestor's overflow or trapped under a different stacking context. */
export function DatePicker({
  value, onChange, placeholder = "Select date", className = "", compact = false, autoOpen = false, onClose,
}: DatePickerProps) {
  const selected = useMemo(() => parseISO(value), [value]);
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [mounted, setMounted] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(selected || new Date());
  const [rect, setRect] = useState<{ top: number; left: number; openUp: boolean } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => { if (selected) setViewDate(selected); }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => { setIsOpen(false); onClose?.(); };

  const updatePosition = () => {
    const el = buttonRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const PANEL_H = 330;
    const spaceBelow = window.innerHeight - r.bottom;
    const openUp = spaceBelow < PANEL_H && r.top > spaceBelow;
    const left = Math.min(Math.max(8, r.left), Math.max(8, window.innerWidth - 300 - 8));
    setRect({ top: openUp ? r.top : r.bottom, left, openUp });
  };

  useLayoutEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (containerRef.current?.contains(t)) return;
      if (popRef.current?.contains(t)) return;
      close();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Monday-first grid, padded to whole weeks.
  const cells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const lead = (first.getDay() + 6) % 7; // Sun=0 -> Mon-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const out: { date: Date; outside: boolean }[] = [];
    for (let i = 0; i < lead; i++) out.push({ date: new Date(year, month, i - lead + 1), outside: true });
    for (let d = 1; d <= daysInMonth; d++) out.push({ date: new Date(year, month, d), outside: false });
    while (out.length % 7 !== 0) out.push({ date: new Date(year, month, daysInMonth + (out.length % 7)), outside: true });
    return out;
  }, [viewDate]);

  const todayISO = toISO(new Date());

  const label = selected
    ? selected.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
    : placeholder;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (isOpen ? close() : setIsOpen(true))}
        className={
          compact
            ? "flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-indigo-500 transition-colors cursor-pointer"
            : "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[var(--surface-secondary)] border border-[var(--border)] text-[var(--text-primary)] hover:border-indigo-500 transition-colors cursor-pointer"
        }
      >
        <span className={selected ? "" : "text-[var(--text-muted)]"}>{label}</span>
        <CalendarIcon className={compact ? "w-3 h-3 text-[var(--text-muted)]" : "w-4 h-4 text-[var(--text-muted)]"} />
      </button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && rect && (
            <motion.div
              ref={popRef}
              initial={{ opacity: 0, y: rect.openUp ? 6 : -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: rect.openUp ? 6 : -6 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              style={{
                position: "fixed",
                top: rect.openUp ? undefined : rect.top + 8,
                bottom: rect.openUp ? window.innerHeight - rect.top + 8 : undefined,
                left: rect.left,
                width: 288,
              }}
              className="z-[220] bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">
                  {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                </span>
                <button
                  type="button"
                  onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                  className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-0.5 mb-1">
                {WEEKDAYS.map((d) => (
                  <span key={d} className="text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)] text-center py-1">
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {cells.map(({ date, outside }, i) => {
                  const iso = toISO(date);
                  const isSelected = iso === value;
                  const isToday = iso === todayISO;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { onChange(iso); close(); }}
                      className={`h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-sm"
                          : outside
                          ? "text-[var(--text-muted)]/40 hover:bg-[var(--surface-secondary)]"
                          : isToday
                          ? "text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20"
                          : "text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
                      }`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => { setViewDate(new Date()); onChange(todayISO); close(); }}
                  className="text-[10px] font-black uppercase tracking-wider text-indigo-500 hover:underline cursor-pointer"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
