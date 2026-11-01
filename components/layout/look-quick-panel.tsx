"use client";

/** Small window under the navbar's palette button: every Look as a compact row with its colours; one click applies it (or starts a 5-minute trial). */
import Link from "next/link";
import { motion } from "motion/react";
import { Check, Lock, Timer } from "lucide-react";
import { useLookActions } from "@/components/looks/design-studio";
import { LOOKS, TRIALS_PER_TIER, canUseLook } from "@/lib/looks/looks";

export function LookQuickPanel({ onClose }: { onClose: () => void }) {
  const { tier, act, triesUsed, look, trial, tried } = useLookActions();
  const rows = [...LOOKS].sort((a, b) => (a.ready === b.ready ? 0 : a.ready ? -1 : 1));
  return (
    <motion.div initial={{ opacity: 0, y: -10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}
      role="dialog" aria-label="Looks" className="nav-cluster fixed left-4 right-4 top-16 z-50 overflow-hidden rounded-2xl popover-surface sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[340px]">
      <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <div><p className="text-sm font-extrabold text-[var(--text-primary)]">Looks</p><p className="text-[11px] text-[var(--text-muted)]">Tap one to change the whole app</p></div>
        <Link href="/profile?tab=design" onClick={onClose} className="pill-soft text-xs">Open Studio</Link>
      </div>
      <ul className="custom-scrollbar max-h-[58vh] overflow-y-auto bg-[var(--surface)] p-2">
        {rows.map((l) => {
          const owned = canUseLook(l, tier), current = look === l.id && !trial, trying = trial?.id === l.id;
          const blocked = !owned && (tried.includes(l.id) || triesUsed(l.tier) >= TRIALS_PER_TIER || !!trial);
          return (
            <li key={l.id}>
              <button type="button" disabled={!l.ready || current || blocked} onClick={() => act(l)} data-look-row={l.id}
                className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left hover:bg-[var(--surface-secondary)] disabled:cursor-default disabled:opacity-60">
                <span className="flex shrink-0 -space-x-1.5" aria-hidden>{l.swatch.map((c) => <span key={c} className="h-5 w-5 rounded-full border-2 border-[var(--surface)]" style={{ background: c }} />)}</span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{l.name}</span><span className="block truncate text-[11px] text-[var(--text-muted)]">{l.ready ? l.family : "Coming soon"}</span></span>
                {current ? <Check className="h-4 w-4 text-[var(--tint-mint-ink)]" /> : trying ? <Timer className="h-4 w-4 text-[var(--tint-peri-ink)]" /> : l.ready && !owned ? <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text-secondary)]"><Lock className="h-3 w-3" />{tried.includes(l.id) ? "Tried" : "Try"}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
