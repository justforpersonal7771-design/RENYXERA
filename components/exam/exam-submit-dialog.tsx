"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { Send, CheckCircle2, Flag, CircleDashed, XCircle, AlertTriangle } from "lucide-react";
import { RadialGauge, CountUp } from "@/components/ui/interactive";

interface ExamSubmitDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  stats: {
    total: number;
    answered: number;
    notAnswered: number;
    marked: number;
    markedAndAnswered: number;
    notVisited: number;
  };
}

/** Confirm-submit sheet: a completion ring, animated tiles for each answer state, and a
 *  plain warning when questions are still unanswered or marked for review. */
export function ExamSubmitDialog({ isOpen, onConfirm, onCancel, stats }: ExamSubmitDialogProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onCancel]);

  if (!isOpen || !mounted) return null;

  const answered = stats.answered + stats.markedAndAnswered;
  const pct = stats.total ? Math.round((answered / stats.total) * 100) : 0;
  const unanswered = stats.notAnswered + stats.notVisited + stats.marked;

  const tiles = [
    { label: "Answered", value: stats.answered, icon: CheckCircle2, cls: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Marked + answered", value: stats.markedAndAnswered, icon: Flag, cls: "text-violet-600 dark:text-violet-300 bg-violet-500/10 border-violet-500/20" },
    { label: "Marked only", value: stats.marked, icon: Flag, cls: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20" },
    { label: "Not answered", value: stats.notAnswered, icon: XCircle, cls: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20" },
    { label: "Not visited", value: stats.notVisited, icon: CircleDashed, cls: "text-[var(--text-secondary)] bg-[var(--surface-secondary)] border-[var(--border)]" },
  ];

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/55 backdrop-blur-md"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Submit test"
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="nav-cluster w-full max-w-md overflow-hidden rounded-3xl shadow-[0_40px_100px_-30px_rgba(76,29,149,0.6)]"
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-6 text-white">
          <motion.div aria-hidden="true" className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-cyan-300/25 blur-3xl" animate={{ x: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} />
          <div className="relative flex items-center gap-4">
            <RadialGauge value={pct} size={72} stroke={7} from="#a7f3d0" to="#fde68a" track="#fff" trackOpacity={0.2}>
              <CountUp value={pct} suffix="%" duration={0.8} className="text-base font-bold text-white" />
            </RadialGauge>
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-tight">Submit your test?</h2>
              <p className="text-sm text-white/80 mt-0.5">
                <span className="font-num font-semibold text-white">{answered}</span> of {stats.total} answered. You can&apos;t change answers after this.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--surface)] p-5 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            {tiles.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.05 }}
                className={`flex items-center gap-3 rounded-2xl border p-3 ${t.cls} ${i === 0 ? "col-span-2" : ""}`}
              >
                <t.icon className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold flex-1">{t.label}</span>
                <CountUp value={t.value} duration={0.6} className="text-lg font-bold" />
              </motion.div>
            ))}
          </div>

          {unanswered > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex gap-2 rounded-xl bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300"
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <span className="font-num font-semibold">{unanswered}</span> question{unanswered === 1 ? " is" : "s are"} still unanswered or only marked for review. Unanswered questions score zero.
              </span>
            </motion.p>
          )}

          <div className="flex gap-2.5 pt-1">
            <button
              onClick={onCancel}
              className="flex-1 h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm font-semibold text-[var(--text-primary)] hover:border-[var(--border-strong)] transition cursor-pointer"
            >
              Keep going
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onConfirm}
              className="group relative overflow-hidden flex-1 h-11 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/30 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:translate-x-[300%] transition-transform duration-700" />
              <Send className="relative w-4 h-4" />
              <span className="relative">Confirm Submit</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}
