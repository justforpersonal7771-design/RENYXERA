"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";

export type Opt = { id: string; label: string };

/**
 * The AI Desk's dropdown, used instead of the browser's own select list: the same look in every browser, a chevron with room around it, text that is cut with an ellipsis
 * rather than running into the arrow, and a menu that is at least as wide as the button and can be wider. Keyboard: Enter/Space/ArrowDown opens, arrows move, Enter chooses, Escape closes.
 */
export function DeskSelect({ label, value, options, onChange, prefix = "", className = "", menuClass = "", align = "left" }: {
  label: string; value: string; options: Opt[]; onChange: (v: string) => void; prefix?: string; className?: string; menuClass?: string; align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false); const [at, setAt] = useState(0);
  const ref = useRef<HTMLDivElement>(null); const id = useId();
  const idx = useMemo(() => Math.max(0, options.findIndex((o) => o.id === value)), [options, value]);
  const cur = options[idx]?.label ?? value;
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", away); return () => document.removeEventListener("mousedown", away);
  }, [open]);
  const pick = (o: Opt) => { onChange(o.id); setOpen(false); };
  const key = (e: React.KeyboardEvent) => {
    if (!open) { if (["ArrowDown", "Enter", " "].includes(e.key)) { e.preventDefault(); setAt(idx); setOpen(true); } return; }
    if (e.key === "Escape") { e.preventDefault(); setOpen(false); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setAt((a) => Math.min(options.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAt((a) => Math.max(0, a - 1)); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const o = options[at]; if (o) pick(o); }
    else if (e.key === "Tab") setOpen(false);
  };
  return (
    <div ref={ref} className={`relative min-w-0 ${className}`}>
      <button type="button" onClick={() => { setAt(idx); setOpen((o) => !o); }} onKeyDown={key} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? id : undefined} aria-label={`${label}: ${cur}`} title={`${label}: ${cur}`}
        className="flex h-9 w-full min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] pl-3 pr-2.5 text-left text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--text-secondary)] focus-visible:border-[var(--tint-sky-ink)]">
        <span className="min-w-0 flex-1 truncate">{prefix}{cur}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[var(--text-secondary)] transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul id={id} role="listbox" aria-label={label} initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
            className={`custom-scrollbar absolute top-full z-[60] mt-1 max-h-64 w-max min-w-full max-w-[min(22rem,80vw)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl ${align === "right" ? "right-0" : "left-0"} ${menuClass}`}>
            {options.map((o, i) => (
              <li key={o.id} role="option" aria-selected={o.id === value}>
                <button type="button" onClick={() => pick(o)} onMouseEnter={() => setAt(i)} className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[var(--text-primary)] ${i === at ? "bg-[var(--surface-secondary)]" : ""}`}>
                  <span className="min-w-0 flex-1 truncate">{o.label}</span>{o.id === value && <Check className="h-4 w-4 shrink-0 text-[var(--tint-sky-ink)]" aria-hidden />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
