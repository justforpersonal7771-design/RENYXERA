"use client";

import { ChevronRight, GraduationCap, Lock } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { availableBranches, branchByCode, isBranchCode, type BranchCode } from "@/lib/branches";
import { openBranchModal } from "@/components/branch/branch-modal";

/** Profile → Exam goals: the account's branch as one clear button that opens the branch modal
 *  (where the one change happens). docs/MULTI_BRANCH_DESIGN.md §3.3. */
export function ExamBranchPanel() {
  const profile = useAuthStore((s) => s.profile) as { target_branch?: string; branch_changes_used?: number; branch_previous?: string | null } | null;
  const current: BranchCode = isBranchCode(profile?.target_branch) ? (profile!.target_branch as BranchCode) : "CSE";
  const info = branchByCode(current);
  const used = (profile?.branch_changes_used ?? 0) >= 1;
  const canChange = !used && availableBranches().some((b) => b.code !== current);

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] mb-1.5"><GraduationCap className="w-3.5 h-3.5" /> Exam branch</label>
      <button type="button" onClick={openBranchModal} aria-haspopup="dialog"
        className="group w-full flex items-center gap-3 rounded-xl border border-[var(--border-subtle)] px-3 py-2.5 text-left hover:border-violet-400/70 hover:bg-violet-500/5 transition cursor-pointer">
        <span className="w-9 h-9 shrink-0 rounded-lg bg-violet-600 text-white grid place-items-center text-xs font-black">{info?.paper ?? current}</span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm font-bold text-[var(--text-primary)] truncate">{info?.short ?? current}</span>
          <span className="block text-[11px] text-[var(--text-muted)]">GATE paper {info?.paper ?? current}</span>
        </span>
        {used ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--text-muted)]"><Lock className="w-3 h-3" /> Final</span>
        ) : canChange ? (
          <span className="inline-flex items-center gap-0.5 rounded-lg bg-violet-500/10 px-2 py-1 text-[11px] font-bold text-violet-600 dark:text-violet-400">Change <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /></span>
        ) : null}
      </button>
      <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
        {used
          ? `Changed from ${branchByCode(profile?.branch_previous ?? "")?.short ?? profile?.branch_previous ?? "another branch"}. Your branch is final; earlier progress stays in your data export.`
          : <>You can change your branch <strong>once</strong>. After that it is permanent.</>}
      </p>
    </div>
  );
}
