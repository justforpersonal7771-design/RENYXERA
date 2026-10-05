"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronDown, Check } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { availableBranches, branchByCode } from "@/lib/branches";
import { getCurrentBranch, switchGuestBranch } from "@/lib/branch/current";

/**
 * Header branch chip (docs/MULTI_BRANCH_DESIGN.md §3, §7).
 * - Guests: a switcher — any branch, any number of times (progress is kept per branch).
 * - Signed-in: a fixed badge linking to Profile → Exam branch (one change, then final).
 * Hidden while only one branch is available.
 */
const noopSubscribe = () => () => {};

export function BranchChip() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const [open, setOpen] = useState(false);
  // Client-only value (the branch never changes without a reload); null during SSR.
  const code = useSyncExternalStore(noopSubscribe, getCurrentBranch, () => null);
  const ref = useRef<HTMLDivElement>(null);
  const branches = availableBranches();

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", esc); };
  }, [open]);

  if (loading || !code || branches.length < 2) return null;
  const info = branchByCode(code);
  const label = info?.paper ?? code;

  if (user) {
    return (
      <Link href="/profile?tab=goals" title={`Your GATE paper: ${info?.name ?? code}`}
        className="hidden sm:inline-flex items-center gap-1 h-8 px-2.5 whitespace-nowrap rounded-lg border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-secondary)] hover:border-violet-400/60">
        GATE {label}
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="listbox" aria-expanded={open}
        title="Switch GATE paper (guest)"
        className="inline-flex items-center gap-1 h-8 px-2.5 whitespace-nowrap rounded-lg border border-[var(--border-subtle)] text-[11px] font-bold text-[var(--text-secondary)] hover:border-violet-400/60 cursor-pointer">
        GATE {label} <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <div role="listbox" aria-label="GATE paper" className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-elevated)] shadow-xl p-1.5 z-50">
          {branches.map((b) => (
            <button key={b.code} type="button" role="option" aria-selected={b.code === code}
              onClick={() => { setOpen(false); if (b.code !== code) switchGuestBranch(b.code); }}
              className="w-full flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-violet-500/10 cursor-pointer">
              <span>
                <span className="block text-xs font-bold text-[var(--text-primary)]">{b.short}</span>
                <span className="block text-[10px] text-[var(--text-muted)]">Paper {b.paper}</span>
              </span>
              {b.code === code && <Check className="w-3.5 h-3.5 text-violet-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
