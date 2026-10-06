"use client";

import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
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
    <button type="button" onClick={openBranchModal} aria-haspopup="dialog" title={`Your GATE paper: ${info?.name ?? code}`}
      className="inline-flex items-center gap-1 h-8 px-2.5 whitespace-nowrap rounded-lg border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-secondary)] hover:border-violet-400/60 hover:text-[var(--text-primary)] cursor-pointer">
      GATE {info?.paper ?? code} <ChevronDown className="w-3 h-3" />
    </button>
  );
}
