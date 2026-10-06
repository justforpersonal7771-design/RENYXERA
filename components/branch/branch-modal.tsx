"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { create } from "zustand";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, GraduationCap, Loader2, Lock, ShieldAlert, X } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { BANK_SUMMARY, BRANCHES, availableBranches, branchByCode, isBranchCode, type BranchCode, type BranchInfo } from "@/lib/branches";
import { applyAccountBranch, getCurrentBranch, switchGuestBranch } from "@/lib/branch/current";
import { setAccountBranch } from "@/lib/branch/account";

/**
 * The one place a branch is chosen (docs/MULTI_BRANCH_DESIGN.md §3). Opened from the header
 * chip and from Profile → Exam goals.
 *   Guests:   pick a paper → switch at once (no limit).
 *   Accounts: pick a paper → confirm step (from → to, what happens, type the paper code,
 *             tick "final") → change_my_branch. After the one change: read-only "final" view.
 */
const useBranchModal = create<{ open: boolean; set: (v: boolean) => void }>((set) => ({ open: false, set: (open) => set({ open }) }));
export const openBranchModal = () => useBranchModal.getState().set(true);

type Prof = { target_branch?: string; branch_changes_used?: number; branch_previous?: string | null } | null;

export function BranchModalHost() {
  const { open, set } = useBranchModal();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile) as Prof;
  const [to, setTo] = useState<BranchCode | null>(null);
  const [typed, setTyped] = useState("");
  const [final, setFinal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current: BranchCode = user && isBranchCode(profile?.target_branch) ? (profile!.target_branch as BranchCode) : getCurrentBranchSafe();
  const locked = !!user && (profile?.branch_changes_used ?? 0) >= 1;
  const open_ = availableBranches();
  const soon = BRANCHES.filter((b) => !open_.some((o) => o.code === b.code));
  const target = to ? branchByCode(to) : undefined;
  const from = branchByCode(current);
  const ready = !!target && typed.trim().toUpperCase() === target.paper && final && !busy;

  const close = () => {
    if (busy) return;
    set(false);
    setTimeout(() => { setTo(null); setTyped(""); setFinal(false); setError(null); }, 200);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, busy]);
  useEffect(() => { if (to) setTimeout(() => inputRef.current?.focus(), 120); }, [to]);

  const pick = (b: BranchInfo) => {
    if (b.code === current || locked) return;
    if (!user) { switchGuestBranch(b.code); return; }
    setTo(b.code); setTyped(""); setFinal(false); setError(null);
  };

  const confirm = async () => {
    if (!user || !to || !ready) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) return setError("You're offline. Changing your branch needs a connection.");
    setBusy(true);
    setError(null);
    const { createClient } = await import("@/lib/supabase/client");
    const r = await setAccountBranch(createClient(), "final", to);
    if (!r.ok) { setBusy(false); return setError(r.message); }
    applyAccountBranch(user.id, to); // reloads into the new branch
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div key="branch-modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/55 backdrop-blur-md"
          onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
          <motion.div role="dialog" aria-modal="true" aria-labelledby="branch-modal-title"
            initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="nav-cluster w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-[0_40px_100px_-30px_rgba(76,29,149,0.6)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {target ? (
                  <button type="button" onClick={() => !busy && setTo(null)} aria-label="Back to papers" className="w-9 h-9 shrink-0 rounded-xl border border-[var(--border)] grid place-items-center hover:border-violet-400/60 cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
                ) : (
                  <span className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center"><GraduationCap className="w-4.5 h-4.5" /></span>
                )}
                <div className="min-w-0">
                  <h2 id="branch-modal-title" className="text-base sm:text-lg font-extrabold text-[var(--text-primary)]">{target ? "Confirm your branch change" : locked ? "Your GATE paper" : "Choose your GATE paper"}</h2>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {target ? "This can't be undone." : !user ? "Switch any time while you browse." : locked ? "Your branch is final." : "You can change your branch once."}
                  </p>
                </div>
              </div>
              <button type="button" onClick={close} aria-label="Close" className="w-9 h-9 shrink-0 rounded-xl grid place-items-center text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"><X className="w-4.5 h-4.5" /></button>
            </div>

            {!target ? (
              <>
                <ul className="mt-5 space-y-2" role="radiogroup" aria-label="GATE papers">
                  {open_.map((b) => {
                    const isCur = b.code === current;
                    const s = BANK_SUMMARY[b.code];
                    const disabled = !isCur && locked;
                    return (
                      <li key={b.code}>
                        <button type="button" role="radio" aria-checked={isCur} disabled={disabled} onClick={() => pick(b)}
                          className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${isCur ? "border-violet-500 bg-violet-500/10" : disabled ? "border-[var(--border)] opacity-50 cursor-not-allowed" : "border-[var(--border)] hover:border-violet-400/70 hover:bg-violet-500/5 cursor-pointer"}`}>
                          <span className={`w-11 h-11 shrink-0 rounded-xl grid place-items-center text-sm font-black ${isCur ? "bg-violet-600 text-white" : "bg-[var(--surface-secondary)] text-[var(--text-primary)]"}`}>{b.paper}</span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-sm font-bold text-[var(--text-primary)] truncate">{b.short}</span>
                            <span className="block text-[11px] text-[var(--text-muted)]">{s ? `${s.questions} official questions · ${s.years}` : `Paper ${b.paper}`}</span>
                          </span>
                          {isCur ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-400"><Check className="w-3.5 h-3.5" /> Current</span>
                          ) : disabled ? (
                            <Lock className="w-4 h-4 text-[var(--text-muted)]" />
                          ) : (
                            <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                {soon.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)] mb-2">Coming soon</p>
                    <div className="flex flex-wrap gap-2">
                      {soon.map((b) => (
                        <Link key={b.code} href={`/${b.slug}`} onClick={close} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] px-3 py-1.5 text-[11px] font-semibold text-[var(--text-secondary)] hover:border-violet-400/60">
                          <i className="w-1.5 h-1.5 rounded-full bg-amber-500" /> GATE {b.paper}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {user && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl bg-[var(--surface-secondary)] px-3 py-2.5 text-[11px] text-[var(--text-secondary)]">
                    <Lock className="w-3.5 h-3.5 shrink-0 mt-px" />
                    {locked
                      ? <span>You already used your one change{profile?.branch_previous ? ` (from ${branchByCode(profile.branch_previous)?.short ?? profile.branch_previous})` : ""}. Your account stays on <b className="text-[var(--text-primary)]">GATE {from?.paper}</b>.</span>
                      : <span>Your account has <b className="text-[var(--text-primary)]">1 branch change</b> left. Pick a paper to see what changes before you confirm.</span>}
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <BranchTile b={from} label="From" />
                  <ArrowRight className="w-5 h-5 text-violet-500" />
                  <BranchTile b={target} label="To" highlight />
                </div>
                <ul className="mt-4 space-y-2 rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4 text-xs text-[var(--text-secondary)]">
                  <li className="flex gap-2"><ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" /><span>This is your <b className="text-[var(--text-primary)]">only</b> branch change. After it, your account stays on GATE {target.paper} for good.</span></li>
                  <li className="flex gap-2"><Check className="w-4 h-4 shrink-0 text-emerald-500" /><span>Your {from?.short} progress is <b className="text-[var(--text-primary)]">kept, not deleted</b>. It is hidden, and it stays in your data export.</span></li>
                  <li className="flex gap-2"><Check className="w-4 h-4 shrink-0 text-emerald-500" /><span>A Plus or Pro plan moves to GATE {target.paper} with the same expiry date.</span></li>
                  <li className="flex gap-2"><Check className="w-4 h-4 shrink-0 text-emerald-500" /><span>Questions, tests, analytics and leaderboards switch to GATE {target.paper}.</span></li>
                </ul>
                <label className="mt-4 block text-xs font-semibold text-[var(--text-secondary)]">
                  Type <b className="text-[var(--text-primary)]">{target.paper}</b> to confirm
                  <input ref={inputRef} value={typed} onChange={(e) => setTyped(e.target.value)} maxLength={4} autoComplete="off" spellCheck={false}
                    aria-label={`Type ${target.paper} to confirm`}
                    className="mt-1.5 w-full h-11 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-base font-bold uppercase tracking-[0.3em] text-[var(--text-primary)] focus:outline-none focus:border-violet-500" />
                </label>
                <label className="mt-3 flex items-start gap-2 text-xs text-[var(--text-secondary)] cursor-pointer">
                  <input type="checkbox" checked={final} onChange={(e) => setFinal(e.target.checked)} className="mt-0.5 accent-violet-600" />
                  <span>I understand this is final. I won&apos;t be able to change my branch again.</span>
                </label>
                {error && <p role="alert" className="mt-3 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}
                <div className="mt-5 flex gap-2.5">
                  <button type="button" onClick={() => !busy && setTo(null)} className="flex-1 h-11 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] text-sm font-semibold text-[var(--text-primary)] cursor-pointer">Back</button>
                  <button type="button" onClick={confirm} disabled={!ready}
                    className="flex-[1.4] h-11 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 cursor-pointer">
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />} Change to GATE {target.paper}
                  </button>
                </div>
                <p className="mt-2 text-center text-[11px] text-[var(--text-muted)]">
                  {typed.trim().toUpperCase() !== target.paper ? `Type ${target.paper} above.` : !final ? "Tick the box to continue." : "The app reloads in your new branch."}
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function getCurrentBranchSafe(): BranchCode {
  try { return getCurrentBranch(); } catch { return "CSE"; }
}

function BranchTile({ b, label, highlight }: { b?: BranchInfo; label: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl border px-3 py-3 text-center ${highlight ? "border-violet-500 bg-violet-500/10" : "border-[var(--border)] bg-[var(--surface-secondary)]/60"}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[var(--text-muted)]">{label}</p>
      <p className="mt-1 text-xl font-black text-[var(--text-primary)]">{b?.paper}</p>
      <p className="text-[11px] text-[var(--text-secondary)] leading-tight">{b?.short}</p>
    </div>
  );
}
