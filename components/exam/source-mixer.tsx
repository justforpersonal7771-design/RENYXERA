"use client";

/**
 * Question source for a test (Exam Setup tabs: GATE PYQs, Forge, Spark (AI), Blend). Blend mixes all three by
 * the shares the student sets, limited by what is actually available (Forge is 0 until it ships; Spark is the
 * AI questions saved on this device). Saved per device. Official year papers are always the real paper.
 */
import { useState } from "react";
import Link from "next/link";
import { Anvil, ScrollText, Sparkles } from "lucide-react";
import { UPCOMING } from "@/lib/preview/features";
import { FORGE } from "@/lib/billing/plans";
import { useEntitlements } from "@/lib/billing/use-entitlements";

export type SourceMix = { mode: "pyq" | "forge" | "mix"; forgePct: number; aiPct: number };
const KEY = "renyxera_source_mix";

export function useSourceMix(force?: string | null): [SourceMix, (m: SourceMix) => void] {
  // Read once on first render (client component; the setup screen renders after mount). A ?source= link wins.
  const [mix, setMix] = useState<SourceMix>(() => {
    let v: Partial<SourceMix> | null = null;
    try { v = typeof window !== "undefined" ? JSON.parse(localStorage.getItem(KEY) ?? "null") : null; } catch { /* private mode */ }
    const base: SourceMix = { mode: "pyq", forgePct: 30, aiPct: 20, ...(v?.mode ? v : {}) };
    return force === "forge" || force === "mix" || force === "pyq" ? { ...base, mode: force } : base;
  });
  const save = (m: SourceMix) => { setMix(m); try { localStorage.setItem(KEY, JSON.stringify(m)); } catch { /* ignore */ } };
  return [mix, save];
}

const COLORS = { pyq: "var(--tint-sky-ink)", forge: "var(--tint-peach-ink)", ai: "var(--tint-butter-ink)" };

export function SourceMixer({ mix, onChange, total = 65, yearPaper, available }: {
  mix: SourceMix; onChange: (m: SourceMix) => void; total?: number; yearPaper?: boolean;
  available: { pyq: number; forge: number; ai: number };
}) {
  const { tier } = useEntitlements();
  const forgeOk = FORGE[tier].questions && UPCOMING.forge === "live";
  const f = mix.forgePct, a = mix.aiPct, p = Math.max(0, 100 - f - a);
  // Planned counts for a test of `total`, capped by what exists; any shortfall is filled with PYQs.
  const wantF = Math.round((total * f) / 100), wantA = Math.round((total * a) / 100);
  const gotF = forgeOk ? Math.min(wantF, available.forge) : 0, gotA = Math.min(wantA, available.ai);
  const gotP = total - gotF - gotA;
  const set = (k: "forgePct" | "aiPct", v: number) => {
    const other = k === "forgePct" ? a : f;
    onChange({ ...mix, [k]: Math.min(v, 90 - other) });
  };
  return (
    <div className="card-well space-y-4" data-tint="mint">
      <div>
        <p className="font-bold text-[var(--text-primary)]">Blend: GATE PYQs, Forge and Spark in one test</p>
        {yearPaper && <p className="mt-1 text-sm text-[var(--text-secondary)]">An official year paper is always the real paper. Pick Subject, Topic, Section or Custom to blend sources.</p>}
      </div>
      <div className="flex h-3 overflow-hidden rounded-full bg-[var(--surface)]" role="img" aria-label={`PYQs ${p}%, Forge ${f}%, Spark ${a}%`}>
        <span style={{ width: `${p}%`, background: COLORS.pyq }} /><span style={{ width: `${f}%`, background: COLORS.forge }} /><span style={{ width: `${a}%`, background: COLORS.ai }} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {([["forgePct", "Forge", Anvil, COLORS.forge, f], ["aiPct", "Spark (AI)", Sparkles, COLORS.ai, a]] as const).map(([k, label, Icon, col, v]) => (
          <label key={k} className="block rounded-2xl bg-[var(--surface)] p-3">
            <span className="flex items-center justify-between text-sm font-semibold text-[var(--text-primary)]"><span className="inline-flex items-center gap-1.5"><Icon className="h-4 w-4" style={{ color: col }} /> {label}</span><span className="font-num">{v}%</span></span>
            <input type="range" min={0} max={80} step={10} value={v} onChange={(e) => set(k, Number(e.target.value))}
              aria-label={`Share of ${label} questions`} className="mix-range mt-2 w-full" style={{ ["--pct" as string]: `calc(11px + (100% - 22px) * ${v / 80})`, ["--fill" as string]: col }} />
          </label>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {([["GATE PYQs", ScrollText, COLORS.pyq, gotP, available.pyq], ["Forge", Anvil, COLORS.forge, gotF, forgeOk ? available.forge : 0], ["Spark (AI)", Sparkles, COLORS.ai, gotA, available.ai]] as const).map(([label, Icon, col, n, have]) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3">
            <Icon className="h-5 w-5 shrink-0" style={{ color: col }} />
            <span className="text-sm"><span className="font-num text-lg font-extrabold text-[var(--text-primary)]">{n}</span> <span className="text-[var(--text-secondary)]">of {total} · {have} available</span><span className="block font-semibold text-[var(--text-primary)]">{label}</span></span>
          </div>
        ))}
      </div>
      <p className="text-sm text-[var(--text-secondary)]">
        {!FORGE[tier].questions ? <>Forge and Spark come with Plus and Pro. <Link href="/pro" className="font-semibold underline underline-offset-2">See plans</Link> </> : null}
        {UPCOMING.forge !== "live" ? "Forge is in preview, so its share is filled with PYQs for now. " : ""}
        {gotA < wantA ? "Not enough Spark questions yet: make more in the Spark tab. " : ""}
        Any shortfall is filled with official PYQs.
      </p>
    </div>
  );
}
