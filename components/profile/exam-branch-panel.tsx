"use client";

import { useState } from "react";
import { GraduationCap, Lock, Loader2, AlertTriangle } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { availableBranches, branchByCode, isBranchCode, type BranchCode } from "@/lib/branches";
import { applyAccountBranch } from "@/lib/branch/current";
import { setAccountBranch } from "@/lib/branch/account";

/**
 * Profile → Exam branch (docs/MULTI_BRANCH_DESIGN.md §3.3). Shows the account's branch and
 * how many changes are left (one, ever). The final change needs the new paper code typed
 * and an explicit "this is final" tick; the server (change_my_branch) enforces everything.
 */
export function ExamBranchPanel() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile) as (ReturnType<typeof useAuthStore.getState>["profile"] & { branch_changes_used?: number; branch_previous?: string | null; branch_changed_at?: string | null }) | null;
  const current = isBranchCode(profile?.target_branch) ? profile!.target_branch as BranchCode : "CSE";
  const info = branchByCode(current);
  const used = (profile?.branch_changes_used ?? 0) >= 1;
  const others = availableBranches().filter((b) => b.code !== current);

  const [open, setOpen] = useState(false);
  const [to, setTo] = useState<BranchCode | null>(null);
  const [typed, setTyped] = useState("");
  const [final, setFinal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const target = to ? branchByCode(to) : undefined;
  const ready = !!target && typed.trim().toUpperCase() === target.paper && final && !busy;

  const submit = async () => {
    if (!user || !to || !ready) return;
    if (typeof navigator !== "undefined" && navigator.onLine === false) return setError("You're offline. Changing branch needs a connection.");
    setBusy(true);
    setError(null);
    const { createClient } = await import("@/lib/supabase/client");
    const r = await setAccountBranch(createClient(), "final", to);
    setBusy(false);
    if (!r.ok) return setError(r.message);
    applyAccountBranch(user.id, to); // reloads into the new branch
  };

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5"><GraduationCap className="w-3.5 h-3.5" /> Exam branch</label>
      <div className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border-subtle)] px-3 py-2.5">
        <span className="min-w-0">
          <span className="block text-sm font-bold text-[var(--text-primary)] truncate">{info?.short ?? current}</span>
          <span className="block text-[11px] text-[var(--text-muted)]">GATE paper {info?.paper ?? current}</span>
        </span>
        {used ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-muted)]"><Lock className="w-3 h-3" /> Final</span>
        ) : others.length ? (
          <button type="button" onClick={() => setOpen((v) => !v)} className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer">Change (1 left)</button>
        ) : (
          <span className="text-[11px] text-[var(--text-muted)]">1 change left</span>
        )}
      </div>
      {used && profile?.branch_previous && (
        <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">Changed from {branchByCode(profile.branch_previous)?.short ?? profile.branch_previous}. Your earlier progress is kept (in your data export).</p>
      )}
      {!used && !open && (
        <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">You can change your branch <strong>once</strong>. After that it is permanent.</p>
      )}

      {open && !used && (
        <div className="mt-3 rounded-xl border border-amber-500/40 bg-amber-500/5 p-3 space-y-3">
          <p className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)]">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>This is your <strong>only</strong> branch change and it <strong>cannot be undone</strong>. Your {info?.short} progress is kept but hidden (it stays in your data export). A Plus/Pro plan moves to the new branch with the same expiry.</span>
          </p>
          <div role="radiogroup" aria-label="New branch" className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {others.map((b) => (
              <button key={b.code} type="button" role="radio" aria-checked={to === b.code} onClick={() => { setTo(b.code); setTyped(""); }}
                className={`text-left rounded-xl border px-3 py-2 cursor-pointer ${to === b.code ? "border-violet-500 bg-violet-500/10" : "border-[var(--border-subtle)] hover:border-violet-400/60"}`}>
                <span className="block text-sm font-bold text-[var(--text-primary)]">{b.short}</span>
                <span className="block text-[11px] text-[var(--text-muted)]">Paper {b.paper}</span>
              </button>
            ))}
          </div>
          {target && (
            <>
              <label className="block text-[11px] text-[var(--text-secondary)]">
                Type <strong>{target.paper}</strong> to confirm
                <input value={typed} onChange={(e) => setTyped(e.target.value)} maxLength={4} autoComplete="off" spellCheck={false}
                  className="mt-1 w-full h-9 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 text-sm font-semibold uppercase tracking-widest" />
              </label>
              <label className="flex items-start gap-2 text-[11px] text-[var(--text-secondary)] cursor-pointer">
                <input type="checkbox" checked={final} onChange={(e) => setFinal(e.target.checked)} className="mt-0.5 accent-violet-600" />
                <span>I understand this is final. I will not be able to change my branch again.</span>
              </label>
            </>
          )}
          {error && <p role="alert" className="text-[11px] font-semibold text-rose-500">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={() => { setOpen(false); setTo(null); setTyped(""); setFinal(false); setError(null); }} className="h-9 px-3 rounded-lg border border-[var(--border-subtle)] text-xs font-semibold cursor-pointer">Cancel</button>
            <button type="button" onClick={submit} disabled={!ready} className="h-9 px-3 rounded-lg bg-amber-600 text-white text-xs font-semibold disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer">
              {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Change branch permanently
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
