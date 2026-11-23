"use client";

import { useEffect, useState } from "react";
import { Bell, Check, Loader2, Hourglass } from "lucide-react";
import { branchByCode } from "@/lib/branches";
import { getCurrentBranch } from "@/lib/branch/current";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";

/**
 * Shown where a feature exists for other branches but not yet for this account's branch (Forge questions, study books).
 * "Notify me" stores the request against the account and its branch (/api/feature-waitlist, migration 0064).
 */
const COPY = {
  forge: { title: "Forge questions are on the way", body: (b: string) => `Forge is our set of original GATE-level questions. It is open for Computer Science today; ${b} is being written next.` },
  study: { title: "Study books are on the way", body: (b: string) => `Textbook-depth study books are open for Computer Science today; ${b} is being written next.` },
} as const;

export function BranchSoon({ feature, compact = false }: { feature: "forge" | "study"; compact?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const code = getCurrentBranch(); const name = branchByCode(code)?.short ?? code;
  const [state, setState] = useState<"idle" | "saving" | "done" | "error">("idle");
  useEffect(() => {
    if (!user) return; let off = false;
    fetch(`/api/feature-waitlist?feature=${feature}`).then((r) => r.json()).then((j: { joined?: boolean }) => { if (!off && j.joined) setState("done"); }).catch(() => {});
    return () => { off = true; };
  }, [user, feature]);
  const join = async () => {
    if (!user) { useAuthModalStore.getState().open("signup"); return; }
    setState("saving");
    try { const r = await fetch("/api/feature-waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ feature }) }); setState(r.ok ? "done" : "error"); } catch { setState("error"); }
  };
  return (
    <section data-tint="butter" className={`card-pastel flex flex-col items-center text-center ${compact ? "gap-2 p-6" : "gap-3 p-8 sm:p-10"}`} aria-label={COPY[feature].title}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--tint-butter-ink)]"><Hourglass className="h-6 w-6" aria-hidden /></span>
      <p className="font-display text-xl font-extrabold text-[var(--text-primary)] sm:text-2xl">{COPY[feature].title}</p>
      <p className="max-w-md text-sm text-[var(--text-secondary)]">{COPY[feature].body(name)} Tell us you want it and we will let you know the day it opens.</p>
      {state === "done"
        ? <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-700 dark:text-emerald-300"><Check className="h-4 w-4" /> We will notify you</p>
        : <button type="button" onClick={join} disabled={state === "saving"} className="btn-main inline-flex cursor-pointer items-center gap-2">{state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />} Notify me</button>}
      {state === "error" && <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">Couldn&apos;t save that. Please try again.</p>}
    </section>
  );
}
