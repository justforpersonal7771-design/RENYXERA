"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { create } from "zustand";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, HelpCircle, LogOut } from "lucide-react";

type Tone = "danger" | "warning" | "default";
interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: Tone;
  icon?: "leave" | "alert" | "question";
}
interface ConfirmState {
  open: ConfirmOptions | null;
  resolve: ((ok: boolean) => void) | null;
  ask: (o: ConfirmOptions) => Promise<boolean>;
  close: (ok: boolean) => void;
}

const useConfirmStore = create<ConfirmState>((set, get) => ({
  open: null,
  resolve: null,
  ask: (o) =>
    new Promise<boolean>((resolve) => {
      get().resolve?.(false);
      set({ open: o, resolve });
    }),
  close: (ok) => {
    get().resolve?.(ok);
    set({ open: null, resolve: null });
  },
}));

/** Themed replacement for window.confirm(): `if (await confirmDialog({...})) …` */
export function confirmDialog(o: ConfirmOptions): Promise<boolean> {
  return useConfirmStore.getState().ask(o);
}

const TONES: Record<Tone, { badge: string; btn: string }> = {
  danger: { badge: "from-rose-500 to-red-600 shadow-rose-500/40", btn: "from-rose-500 to-red-600 shadow-rose-500/30" },
  warning: { badge: "from-amber-400 to-orange-500 shadow-amber-500/40", btn: "from-indigo-600 via-violet-600 to-fuchsia-600 shadow-violet-500/30" },
  default: { badge: "from-indigo-500 to-violet-600 shadow-violet-500/40", btn: "from-indigo-600 via-violet-600 to-fuchsia-600 shadow-violet-500/30" },
};

/** Mounted once per app shell. Escape cancels, Enter confirms, focus lands on confirm. */
export function ConfirmHost() {
  const { open, close } = useConfirmStore();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => confirmRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(false); }
    };
    document.addEventListener("keydown", onKey);
    return () => { clearTimeout(t); document.removeEventListener("keydown", onKey); };
  }, [open, close]);

  if (typeof document === "undefined") return null;
  const tone = TONES[open?.tone ?? "default"];
  const Icon = open?.icon === "leave" ? LogOut : open?.icon === "question" ? HelpCircle : AlertTriangle;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="confirm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-md"
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(false); }}
        >
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className="nav-cluster w-full max-w-sm rounded-3xl p-6 text-center shadow-[0_40px_100px_-30px_rgba(76,29,149,0.6)]"
          >
            <div className="relative mx-auto mb-4 w-14 h-14">
              <motion.span aria-hidden="true" className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tone.badge} opacity-40`} animate={{ scale: [1, 1.35], opacity: [0.4, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
              <motion.div initial={{ rotate: -12, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 16 }} className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${tone.badge} shadow-lg flex items-center justify-center text-white`}>
                <Icon className="w-6 h-6" />
              </motion.div>
            </div>
            <h2 id="confirm-title" className="text-lg font-bold text-[var(--text-primary)]">{open.title}</h2>
            {open.message && <p className="mt-1.5 text-sm text-[var(--text-secondary)] leading-relaxed">{open.message}</p>}
            <div className="mt-6 flex gap-2.5">
              <button
                onClick={() => close(false)}
                className="flex-1 h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition cursor-pointer"
              >
                {open.cancelLabel ?? "Cancel"}
              </button>
              <motion.button
                ref={confirmRef}
                whileTap={{ scale: 0.97 }}
                onClick={() => close(true)}
                className={`group relative overflow-hidden flex-1 h-11 rounded-xl bg-gradient-to-r ${tone.btn} text-white text-sm font-semibold shadow-lg cursor-pointer`}
              >
                <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
                <span className="relative">{open.confirmLabel ?? "Confirm"}</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
