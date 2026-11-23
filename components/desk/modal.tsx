"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

/**
 * The one modal the AI Desk uses (Tutor notes and practice set, the note editor, quick actions): a centred sheet on desktop, a bottom sheet on phones.
 * Escape and a click outside close it; focus goes in on open and back to what opened it on close.
 */
export function DeskModal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    document.addEventListener("keydown", esc);
    const t = setTimeout(() => ref.current?.focus(), 30);
    return () => { document.removeEventListener("keydown", esc); clearTimeout(t); prev?.focus?.(); };
  }, [open, onClose]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[400] flex items-end justify-center sm:items-center sm:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
          <motion.div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }} transition={{ type: "spring", stiffness: 420, damping: 36 }}
            className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl outline-none sm:rounded-3xl ${wide ? "sm:max-w-3xl" : "sm:max-w-xl"}`}>
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-5 py-3.5">
              <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"><X className="h-5 w-5" /></button>
            </div>
            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>, document.body);
}
