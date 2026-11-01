"use client";

/**
 * Design Studio: choose a Look (the whole design of the app). Pro Looks come first because they are the premium reason to open this page.
 * A student who does not own a Look can try it for 5 minutes, once per Look, two Looks per paid tier (the rule lives in store/use-look-store.ts).
 * Plan: docs/roadmap/R26-DESIGN-STUDIO.md.
 */
import Link from "next/link";
import { useMemo } from "react";
import { Check, Lock, Sparkles, Timer } from "lucide-react";
import { LookPreview } from "@/components/looks/look-preview";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { LOOKS, TRIALS_PER_TIER, TRIAL_MS, canUseLook, type Look, type LookTier } from "@/lib/looks/looks";
import { useLookStore } from "@/store/use-look-store";
import { useToastStore } from "@/store/use-toast-store";

const TIER_LABEL: Record<LookTier, string> = { pro: "Pro Looks", plus: "Plus Looks", free: "Free Looks" };
const TIER_NOTE: Record<LookTier, string> = {
  pro: "The most distinctive designs. Included in Pro.",
  plus: "Calm, refined designs. Included in Plus and Pro.",
  free: "Always free.",
};
const ORDER: LookTier[] = ["pro", "plus", "free"];

export default function DesignStudioPage() {
  const { tier } = useEntitlements();
  const { look, trial, tried, setLook, startTrial, endTrial } = useLookStore();
  const toast = useToastStore((s) => s.show);
  const groups = useMemo(() => ORDER.map((t) => ({ tier: t, looks: LOOKS.filter((l) => l.tier === t) })), []);
  const triesUsed = (t: LookTier) => tried.filter((id) => LOOKS.find((l) => l.id === id)?.tier === t).length;

  const act = (l: Look) => {
    if (canUseLook(l, tier)) { setLook(l.id); toast(`${l.name} is on`); return; }
    const r = startTrial(l.id);
    if (r.ok) toast(`Trying ${l.name} for ${Math.round(TRIAL_MS / 60000)} minutes`);
    else toast(r.reason === "again" ? `You have already tried ${l.name}` : `You have used both ${l.tier === "pro" ? "Pro" : "Plus"} trials`, "error");
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 pb-8">
      <header className="card-well p-5 sm:p-6" data-tint="peri">
        <h1 className="font-display text-3xl font-extrabold text-[var(--text-primary)]">Design Studio</h1>
        <p className="mt-1 max-w-2xl text-[var(--text-secondary)]">A Look changes the whole app: cards, backgrounds, corners and buttons. Point at one to see it on a real screen, then apply it. Looks you do not have yet can be tried for {Math.round(TRIAL_MS / 60000)} minutes.</p>
        {trial && <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-1 text-sm font-bold"><Timer className="h-4 w-4" /> A trial of {LOOKS.find((l) => l.id === trial.id)?.name} is running <button type="button" onClick={() => endTrial(false)} className="pill-soft ml-1 cursor-pointer !px-2 !py-0.5 text-xs">Stop</button></p>}
      </header>

      {groups.map(({ tier: t, looks }) => (
        <section key={t} aria-label={TIER_LABEL[t]}>
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
            <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">{TIER_LABEL[t]}</h2>
            <p className="text-sm text-[var(--text-secondary)]">{TIER_NOTE[t]}{t !== "free" && !canUseLook({ tier: t } as Look, tier) ? ` Trials left: ${Math.max(0, TRIALS_PER_TIER - triesUsed(t))} of ${TRIALS_PER_TIER}.` : ""}</p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {looks.map((l) => {
              const owned = canUseLook(l, tier), current = look === l.id && !trial, trying = trial?.id === l.id;
              const wasTried = tried.includes(l.id), limit = !owned && l.tier !== "free" && triesUsed(l.tier) >= TRIALS_PER_TIER;
              return (
                <li key={l.id} className="card-pastel flex flex-col gap-3 p-4" data-tint={l.tier === "pro" ? "lilac" : l.tier === "plus" ? "sky" : "mint"} data-look-card={l.id}>
                  <LookPreview id={l.id} className="h-[168px]" />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-lg font-extrabold text-[var(--text-primary)]">{l.name}</h3>
                      {current && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-bold"><Check className="h-3 w-3" /> On now</span>}
                      {trying && <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-bold"><Timer className="h-3 w-3" /> Trying</span>}
                    </div>
                    <p className="text-xs font-bold text-[var(--text-muted)]">{l.family}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{l.blurb}</p>
                    <div className="mt-2 flex gap-1.5" aria-hidden>{l.swatch.map((c) => <span key={c} className="h-4 w-4 rounded-full border border-black/10" style={{ background: c }} />)}</div>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-2">
                    {!l.ready ? (
                      <span className="pill-soft cursor-default opacity-70">Coming soon</span>
                    ) : owned ? (
                      <button type="button" onClick={() => act(l)} disabled={current} aria-label={current ? `${l.name} is on` : `Apply ${l.name}`} className="btn-main !h-10 !text-sm disabled:opacity-60">{current ? <><Check className="h-4 w-4" /> On now</> : "Apply"}</button>
                    ) : (
                      <>
                        <button type="button" onClick={() => act(l)} disabled={wasTried || limit || !!trial} aria-label={`Try ${l.name} for 5 minutes`} className="btn-soft !h-10 !text-sm disabled:opacity-60"><Sparkles className="h-4 w-4" /> {wasTried ? "Tried" : limit ? "No trials left" : "Try 5 minutes"}</button>
                        <Link href="/pro" className="pill-ink inline-flex items-center gap-1 text-xs"><Lock className="h-3 w-3" /> {l.tier === "pro" ? "Get Pro" : "Get Plus"}</Link>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
