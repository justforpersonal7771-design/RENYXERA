"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import { Check, GripHorizontal, Loader2, Minus, Square, X } from "lucide-react";

let top = 340; // windows raise themselves above each other, and above the "fill the app" frame (z 320)
let opened = 0; // how many are open, so a second window opens a little off the first instead of on top of it

/**
 * The AI Desk's window, the same kind as Study's tools: it floats over the page without dimming or blurring it, so the screen behind stays readable and usable.
 * Drag it by its title, minimise it to just the title bar (what you typed is kept), or close it. Escape closes it while you are working in it. On a phone it docks above the bottom bar.
 * (Kept under the old name: Tutor notes and practice set, the note editor and quick edits all use it.)
 */
export function DeskModal({ open, onClose, title, children, wide = false, status = null, statusLabel, onSeen }: { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean; /** Something is being made in the background ("working") or has just finished ("ready"); shown in the title bar, also when minimised. */ status?: "working" | "ready" | null; statusLabel?: string; /** Called when the window is open and expanded while its status is "ready": the result has been seen. */ onSeen?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useDragControls();
  const reduce = useReducedMotion();
  const [min, setMin] = useState(false);
  const [z, setZ] = useState(top);
  const [slot, setSlot] = useState(0);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a fresh window starts open, in front, and offset from any other
    setMin(false); setZ(++top); setSlot(opened % 4); opened += 1;
    const t = setTimeout(() => { if (!ref.current?.contains(document.activeElement)) ref.current?.focus(); }, 40);
    return () => { clearTimeout(t); opened = Math.max(0, opened - 1); prev?.focus?.(); };
  }, [open]);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- fires when the finished result is on screen
  useEffect(() => { if (open && !min && status === "ready") onSeen?.(); }, [open, min, status]);
  if (typeof document === "undefined") return null;
  const off = slot * 28;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div ref={ref} tabIndex={-1} role="dialog" aria-label={title} drag dragListener={false} dragControls={drag} dragMomentum={false} dragElastic={0.04}
          onPointerDownCapture={() => setZ(++top)} onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }} transition={{ type: "spring", stiffness: 420, damping: 34 }}
          style={{ zIndex: z, ...(typeof window !== "undefined" && window.innerWidth >= 640 ? { right: 24 + off, bottom: 24 + off, left: "auto", transformOrigin: "bottom right" } : {}) }}
          className={`fixed inset-x-2 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] flex max-h-[min(78dvh,720px)] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_30px_70px_-20px_rgba(0,0,0,.45)] outline-none ${wide ? "sm:w-[min(680px,calc(100vw-3rem))]" : "sm:w-[440px]"} ${min ? "sm:w-[300px]" : ""}`}>
          <div onPointerDown={(e) => { if (window.innerWidth >= 640 && !(e.target as HTMLElement).closest("button")) drag.start(e); }} className="flex shrink-0 cursor-grab items-center gap-2 border-b border-[var(--border)] px-4 py-2.5 active:cursor-grabbing sm:touch-none">
            <h2 className="min-w-0 flex-1 truncate font-display text-base font-extrabold text-[var(--text-primary)]">{title}</h2>
            {status === "working" && <span className="gen-working inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold" role="status"><Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />{statusLabel ?? "Working…"}</span>}
            {status === "ready" && <span className="gen-ready inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold" role="status"><Check className="h-3.5 w-3.5" aria-hidden />{statusLabel ?? "Ready"}</span>}
            <GripHorizontal className="hidden h-4 w-4 text-[var(--text-muted)] sm:block" aria-hidden />
            <button type="button" onClick={() => setMin((m) => !m)} aria-label={min ? `Expand ${title}` : `Minimise ${title}`} title={min ? "Expand" : "Minimise"} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]">{min ? <Square className="h-3.5 w-3.5" /> : <Minus className="h-4 w-4" />}</button>
            <button type="button" onClick={onClose} aria-label={`Close ${title}`} title="Close" className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"><X className="h-4 w-4" /></button>
          </div>
          <div hidden={min} className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>, document.body);
}
