"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Flag, Loader2, X } from "lucide-react";
import { useToastStore } from "@/store/use-toast-store";

const REASONS = [
  ["wrong_answer", "Answer key looks wrong"],
  ["solution", "Solution is unclear or wrong"],
  ["figure", "Figure or table is broken"],
  ["typo", "Typo or formatting problem"],
  ["other", "Something else"],
] as const;

/**
 * 6D: "Report an issue" on any question. Opens a small dialog; the report goes to
 * /api/report (guests and members) and is triaged within 24 hours.
 */
export function ReportIssueButton({ questionId, source = "app", compact = false }: { questionId: string; source?: "app" | "public" | "review"; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [reason, setReason] = useState<(typeof REASONS)[number][0]>("wrong_answer");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => { setDone(false); }, [questionId]);

  const submit = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/report", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ questionId, reason, details: details.trim() || undefined, source }) });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Couldn't send that right now.");
      setDone(true); setOpen(false); setDetails("");
      useToastStore.getState().show("Thanks — we'll check this question within 24 hours.", "success");
    } catch (e) {
      useToastStore.getState().show((e as Error).message, "error");
    } finally { setBusy(false); }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} title="Report an issue with this question" aria-label="Report an issue with this question"
        className={`inline-flex items-center gap-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer ${compact ? "p-1.5" : "px-2.5 py-1.5 text-xs font-semibold"}`}>
        <Flag className={`w-4 h-4 ${done ? "fill-rose-500 text-rose-500" : ""}`} />{!compact && (done ? "Reported" : "Report an issue")}
      </button>
      {mounted && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div className="fixed inset-0 z-[80] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <button aria-label="Close" className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <motion.div role="dialog" aria-modal="true" aria-label="Report an issue" className="relative w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl"
                initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} transition={{ type: "spring", stiffness: 420, damping: 30 }}>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-extrabold text-[var(--text-primary)] flex items-center gap-2"><Flag className="w-4 h-4 text-rose-500" /> Report an issue</h2>
                  <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] cursor-pointer" aria-label="Close"><X className="w-4 h-4" /></button>
                </div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">We review every report and fix accepted ones within 24 hours.</p>
                <fieldset className="mt-4 space-y-1.5">
                  <legend className="sr-only">What&apos;s wrong?</legend>
                  {REASONS.map(([v, l]) => (
                    <label key={v} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2 text-sm cursor-pointer ${reason === v ? "border-violet-500/50 bg-violet-500/10 text-[var(--text-primary)]" : "border-[var(--border)] text-[var(--text-secondary)]"}`}>
                      <input type="radio" name={`reason-${questionId}`} value={v} checked={reason === v} onChange={() => setReason(v)} className="accent-violet-600" />{l}
                    </label>
                  ))}
                </fieldset>
                <textarea value={details} onChange={(e) => setDetails(e.target.value.slice(0, 1000))} rows={3} placeholder="Anything that helps us fix it (optional)"
                  className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-violet-500/60" />
                <div className="mt-4 flex justify-end gap-2">
                  <button type="button" onClick={() => setOpen(false)} className="h-10 px-4 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] cursor-pointer">Cancel</button>
                  <button type="button" onClick={submit} disabled={busy} className="h-10 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold shadow-md shadow-violet-500/25 disabled:opacity-60 inline-flex items-center gap-2 cursor-pointer">
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />} Send report
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>, document.body)}
    </>
  );
}
