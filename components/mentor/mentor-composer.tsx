"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, Maximize2, Minimize2, Send, Square } from "lucide-react";

/** Small menu button used in the composer. Opens upwards, closes on outside click and Escape. Same look as the Mentor's. */
export function MenuSelect<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  const cur = options.find((o) => o.id === value)?.label ?? value;
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} aria-label={`${label}: ${cur}`}
        className="flex h-9 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]">
        {cur} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" aria-label={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.12 }}
            className="absolute bottom-full left-0 z-30 mb-2 min-w-40 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl">
            <p className="px-3 pb-1 pt-1.5 text-xs font-bold text-[var(--text-muted)]">{label}</p>
            {options.map((o) => (
              <button key={o.id} type="button" role="menuitemradio" aria-checked={o.id === value} onClick={() => { onChange(o.id); setOpen(false); }}
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">
                {o.label}{o.id === value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * The Mentor's text box, shared: Gemini-style pill that grows as you type, tools drop under the text from the second line,
 * a bigger-box toggle from the third, Enter sends and Shift+Enter adds a line, Escape stops a running reply.
 * Only the menus (children) differ between the Mentor and the Tutor.
 */
export function MentorComposer({ value, onChange, onSubmit, busy, onStop, placeholder, label, maxLength = 1500, disabled = false, children, submitId }: {
  value: string; onChange: (v: string) => void; onSubmit: () => void; busy: boolean; onStop: () => void;
  placeholder: string; label: string; maxLength?: number; disabled?: boolean; children?: ReactNode; submitId?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);
  const [stacked, setStacked] = useState(false);
  const [lines, setLines] = useState(1);
  const [big, setBig] = useState(false);
  const [narrow, setNarrow] = useState(false);
  useEffect(() => { const m = window.matchMedia("(max-width: 639px)"); const f = () => setNarrow(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  /* eslint-disable react-hooks/set-state-in-effect -- sizes the box from what was typed, as the Mentor's does */
  useEffect(() => {
    const ta = taRef.current; if (!ta) return;
    if (!value) { setStacked(false); setLines(1); setBig(false); ta.style.height = "24px"; ta.style.overflowY = "hidden"; return; } // an empty box is one line whatever the placeholder does (measuring it here looped on phones)
    if (big) { ta.style.height = "38dvh"; ta.style.overflowY = "auto"; return; }
    ta.style.height = "auto";
    const n = Math.max(1, Math.round(ta.scrollHeight / 24));
    setLines(n);
    if (n > 1 || value.includes("\n")) setStacked(true);
    const h = Math.min(ta.scrollHeight, 168);
    ta.style.height = `${h}px`; ta.style.overflowY = ta.scrollHeight > 168 ? "auto" : "hidden";
  }, [value, big, stacked, narrow]);
  /* eslint-enable react-hooks/set-state-in-effect */
  const showExpand = big || lines >= 3;
  const wrap = stacked || big || narrow;
  const submit = () => { if (!value.trim() || busy || disabled) return; onSubmit(); };
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }}
      className={`relative mx-auto flex w-full max-w-3xl flex-wrap items-center border-2 border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_30px_-18px_rgba(67,56,202,.55)] transition-[border-radius,border-color] duration-200 focus-within:border-[var(--tint-sky-ink)] ${wrap ? "rounded-3xl px-4 pb-2 pt-3" : "rounded-full py-1.5 pl-5 pr-1.5"}`}>
      <textarea ref={taRef} value={value} rows={1} disabled={disabled} onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } if (e.key === "Escape" && busy) onStop(); }}
        maxLength={maxLength} placeholder={placeholder} aria-label={label}
        className={`field-bare block min-h-6 resize-none leading-6 text-[var(--text-primary)] ${wrap ? `w-full basis-full ${showExpand ? "pr-8" : ""}` : "min-w-0 flex-1"}`} />
      {showExpand && (
        <button type="button" onClick={() => setBig((v) => !v)} aria-pressed={big} aria-label={big ? "Make the text box smaller" : "Make the text box bigger"} title={big ? "Smaller box" : "Bigger box"}
          className="absolute right-3 top-3 grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]">
          {big ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      )}
      <div className={`flex items-center gap-1 ${wrap ? "mt-1 w-full justify-end" : "shrink-0"}`}>
        {children}
        {busy ? (
          <button type="button" onClick={onStop} className="btn-main !h-9 !w-9 !p-0 justify-center" aria-label="Stop"><Square className="h-3.5 w-3.5 fill-current" /></button>
        ) : (
          <button id={submitId} type="submit" disabled={!value.trim() || disabled} className="btn-main !h-9 !w-9 !p-0 justify-center disabled:opacity-50" aria-label="Send"><Send className="h-4 w-4" /></button>
        )}
      </div>
    </form>
  );
}
