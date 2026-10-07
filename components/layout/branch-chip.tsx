"use client";

import { useSyncExternalStore } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { availableBranches, branchByCode } from "@/lib/branches";
import { getCurrentBranch } from "@/lib/branch/current";
import { openBranchModal } from "@/components/branch/branch-modal";

/** Header branch chip (docs/MULTI_BRANCH_DESIGN.md §3, §7): opens the branch modal for guests
 *  and accounts alike. Hidden while only one branch is available. */
const noopSubscribe = () => () => {};

export function BranchChip() {
  const loading = useAuthStore((s) => s.loading);
  const code = useSyncExternalStore(noopSubscribe, getCurrentBranch, () => null);
  if (loading || !code || availableBranches().length < 2) return null;
  const info = branchByCode(code);
  return (
    <button type="button" onClick={openBranchModal} aria-haspopup="dialog" title={`Your GATE paper: ${info?.name ?? code} (click to change)`}
      className="group relative inline-flex items-center h-7 px-2.5 ml-0.5 whitespace-nowrap rounded-lg text-[11px] font-black tracking-wide text-violet-700 dark:text-violet-300 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 ring-1 ring-violet-500/25 transition-all duration-200 hover:ring-violet-500/60 hover:from-indigo-500/20 hover:to-fuchsia-500/20 hover:-translate-y-px hover:shadow-[0_4px_12px_-4px_rgba(124,58,237,0.5)] active:translate-y-0 active:scale-95 cursor-pointer">
      GATE {info?.paper ?? code}
    </button>
  );
}
