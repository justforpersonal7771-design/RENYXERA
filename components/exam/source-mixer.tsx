"use client";

/**
 * Question source for a test: past papers only, Forge only, or a mix with a Forge share the student sets.
 * Saved per device. While Forge is in preview (lib/preview/features.ts) the choice is kept but tests are
 * still built from PYQs, and the card says so. Official year papers are always 100% PYQ.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Anvil, ScrollText } from "lucide-react";
import { Segmented } from "@/components/ui/folder-tabs";
import { UPCOMING } from "@/lib/preview/features";
import { FORGE } from "@/lib/billing/plans";
import { useEntitlements } from "@/lib/billing/use-entitlements";

export type SourceMix = { mode: "pyq" | "forge" | "mix"; forgePct: number };
const KEY = "renyxera_source_mix";

export function useSourceMix(): [SourceMix, (m: SourceMix) => void] {
  const [mix, setMix] = useState<SourceMix>({ mode: "pyq", forgePct: 30 });
  useEffect(() => {
    try { const v = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (v?.mode) setMix(v); } catch { /* private mode */ }
  }, []);
  const save = (m: SourceMix) => { setMix(m); try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* ignore */ } };
  return [mix, save];
}

export function SourceMixer({ mix, onChange, total }: { mix: SourceMix; onChange: (m: SourceMix) => void; total?: number }) {
  const { tier } = useEntitlements();
  const allowed = FORGE[tier].questions;
  const pct = mix.mode === "pyq" ? 0 : mix.mode === "forge" ? 100 : mix.forgePct;
  const forgeQs = total ? Math.round((total * pct) / 100) : null;
  return (
    <div className="card-well space-y-3" data-tint="mint">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-bold text-[var(--text-primary)]">Question source</p>
        <Segmented label="Question source" value={allowed ? mix.mode : "pyq"} onChange={(m) => allowed && onChange({ ...mix, mode: m })}
          options={[{ id: "pyq", label: "Past papers" }, { id: "forge", label: "Forge" }, { id: "mix", label: "Mix" }]} />
      </div>
      {allowed && mix.mode === "mix" && (
        <label className="block">
          <span className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1.5"><Anvil className="h-4 w-4" /> Forge {pct}%</span>
            <span className="inline-flex items-center gap-1.5"><ScrollText className="h-4 w-4" /> PYQs {100 - pct}%</span>
          </span>
          <input type="range" min={10} max={90} step={10} value={mix.forgePct} onChange={(e) => onChange({ ...mix, forgePct: Number(e.target.value) })}
            aria-label="Share of Forge questions" className="mix-range mt-2 w-full" style={{ ["--pct" as string]: `${mix.forgePct}%` }} />
        </label>
      )}
      <p className="text-xs text-[var(--text-muted)]">
        {!allowed ? <>Forge questions come with Plus and Pro. <Link href="/pro" className="font-semibold underline underline-offset-2">See plans</Link></>
          : UPCOMING.forge !== "live" ? <>Forge is in preview: your choice is saved, and tests use past papers until the first Forge set is released.</>
          : forgeQs !== null ? <>{forgeQs} of {total} questions will be Forge.</> : null}
      </p>
    </div>
  );
}
