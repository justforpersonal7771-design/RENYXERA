"use client";

/**
 * Wraps an upcoming-feature screen. "preview": sample-data banner + a plan switcher so every tier can be
 * checked. "soon": the screen blurred behind a coming-soon card. "live": children only.
 */
import { useState, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import type { PreviewState } from "@/lib/preview/features";
import type { Tier } from "@/lib/billing/plans";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { Segmented } from "@/components/ui/folder-tabs";

export function PreviewFrame({ state, name, when, children }: {
  state: PreviewState; name: string; when: string; children: (tier: Tier) => ReactNode;
}) {
  const { tier } = useEntitlements();
  const [viewAs, setViewAs] = useState<Tier | null>(null);
  const t = viewAs ?? tier;
  if (state === "live") return <>{children(tier)}</>;
  if (state === "soon") {
    return (
      <div className="relative">
        <div aria-hidden className="pointer-events-none select-none blur-[6px] opacity-60">{children("pro")}</div>
        <div className="absolute inset-0 grid place-items-start justify-center pt-24">
          <div className="card-pastel max-w-md p-7 text-center" data-tint="lilac">
            <Sparkles className="mx-auto h-6 w-6 text-[var(--tint-lilac-ink)]" />
            <h2 className="mt-3 font-display text-2xl font-extrabold text-[var(--text-primary)]">{name} is coming soon</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{when}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-[var(--tint-lilac-ink)]/40 bg-[var(--tint-lilac)]/50 px-4 py-2.5">
        <p className="text-sm font-semibold text-[var(--tint-lilac-ink)]">Sample data: this is a preview of {name}. Numbers are not yours yet.</p>
        <Segmented label="View as plan" value={t} onChange={(v) => setViewAs(v)}
          options={[{ id: "free", label: "Free" }, { id: "plus", label: "Plus" }, { id: "pro", label: "Pro" }]} />
      </div>
      {children(t)}
    </div>
  );
}
