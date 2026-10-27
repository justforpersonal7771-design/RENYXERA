"use client";

/**
 * Question source for a test: past papers only, Forge only, or a mix with a Forge share the student sets.
 * Saved per device. While Forge is in preview (lib/preview/features.ts) the choice is kept but tests are
 * still built from PYQs, and the card says so. Official year papers are always 100% PYQ.
 */
import { useState } from "react";
import Link from "next/link";
import { Anvil, ScrollText } from "lucide-react";
import { UPCOMING } from "@/lib/preview/features";
import { FORGE } from "@/lib/billing/plans";
import { useEntitlements } from "@/lib/billing/use-entitlements";

export type SourceMix = { mode: "pyq" | "forge" | "mix"; forgePct: number };
const KEY = "renyxera_source_mix";

export function useSourceMix(): [SourceMix, (m: SourceMix) => void] {
  // Read once on first render (client component; the setup screen renders after mount).
  const [mix, setMix] = useState<SourceMix>(() => {
    try { const v = typeof window !== "undefined" ? JSON.parse(localStorage.getItem(KEY) ?? "null") : null; if (v?.mode) return v; } catch { /* private mode */ }
    return { mode: "pyq", forgePct: 30 };
  });
  const save = (m: SourceMix) => { setMix(m); try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* ignore */ } };
  return [mix, save];
}

export function SourceMixer({ mix, onChange, total, yearPaper }: { mix: SourceMix; onChange: (m: SourceMix) => void; total?: number; yearPaper?: boolean }) {
  const { tier } = useEntitlements();
  const allowed = FORGE[tier].questions;
  const pct = mix.mode === "pyq" ? 0 : mix.mode === "forge" ? 100 : mix.forgePct;
  const forgeQs = total ? Math.round((total * pct) / 100) : null;
  // The choice itself is made in the Exam Setup source tabs (GATE PYQs / Forge / Mix / AI generated).
  return (
    <div className="card-well space-y-3" data-tint={mix.mode === "forge" ? "peach" : "mint"}>
      <p className="text-sm font-bold text-[var(--text-primary)]">{mix.mode === "forge" ? "Forge questions only" : "Mix of GATE PYQs and Forge"}</p>
      {yearPaper && <p className="text-sm text-[var(--text-secondary)]">An official year paper is always the real paper. Pick Subject, Topic, Section or Custom to use Forge questions.</p>}
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
      <p className="text-sm text-[var(--text-secondary)]">
        {!allowed ? <>Forge questions come with Plus and Pro. <Link href="/pro" className="font-semibold underline underline-offset-2">See plans</Link></>
          : UPCOMING.forge !== "live" ? <>Forge is in preview: your choice is saved, and tests use past papers until the first Forge set is released.</>
          : forgeQs !== null ? <>{forgeQs} of {total} questions will be Forge.</> : null}
      </p>
    </div>
  );
}
