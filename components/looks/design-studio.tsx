"use client";

/**
 * The Design Studio body, used inside Profile (full size). Layout, in the way current appearance pickers are built: a strip that shows what is on now,
 * filter chips (All / Pro / Plus / Free), then a full-width grid of live previews where one tap applies a Look (or starts a 5-minute trial).
 * The trial rule lives in store/use-look-store.ts. Plan: docs/roadmap/R26-DESIGN-STUDIO.md.
 */
import Link from "next/link";
import { useState } from "react";
import { Check, Lock, Sparkles, Timer } from "lucide-react";
import { LookPreview } from "@/components/looks/look-preview";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { LOOKS, fontSetFor, TRIALS_PER_TIER, TRIAL_MS, canUseLook, lookById, type Look } from "@/lib/looks/looks";
import { useLookStore } from "@/store/use-look-store";
import { useToastStore } from "@/store/use-toast-store";

type Filter = "all" | "pro" | "plus" | "free";
const FILTERS: { id: Filter; label: string }[] = [{ id: "all", label: "All Looks" }, { id: "pro", label: "Pro" }, { id: "plus", label: "Plus" }, { id: "free", label: "Free" }];

/** Apply or try a Look: owned Looks switch at once, others start a trial. Shared with the navbar quick panel. */
export function useLookActions() {
  const { tier } = useEntitlements();
  const store = useLookStore();
  const toast = useToastStore((s) => s.show);
  const act = (l: Look) => {
    if (!l.ready) return;
    if (canUseLook(l, tier)) { store.setLook(l.id); toast(`${l.name} is on`); return; }
    const r = store.startTrial(l.id);
    if (r.ok) toast(`Trying ${l.name} for ${Math.round(TRIAL_MS / 60000)} minutes`);
    else toast(r.reason === "again" ? `You have already tried ${l.name}` : `You have used both ${l.tier === "pro" ? "Pro" : "Plus"} trials`, "error");
  };
  const triesUsed = (t: Look["tier"]) => store.tried.filter((id) => lookById(id).tier === t).length;
  return { tier, act, triesUsed, ...store };
}

export function DesignStudio() {
  const { tier, act, triesUsed, look, trial, tried, endTrial, fonts, setFont } = useLookActions();
  const [filter, setFilter] = useState<Filter>("all");
  const shown = LOOKS.filter((l) => filter === "all" || l.tier === filter).sort((a, b) => (a.ready === b.ready ? 0 : a.ready ? -1 : 1));
  const onNow = lookById(trial?.id ?? look);

  return (
    <div className="w-full space-y-4">
      <div className="flex w-full flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface-secondary)] p-3">
        <div className="w-full shrink-0 sm:w-44"><LookPreview id={onNow.id} className="h-[110px]" /></div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-[var(--text-muted)]">{trial ? "Trying now" : "On now"}</p>
          <p className="font-display text-lg font-extrabold text-[var(--text-primary)]">{onNow.name}</p>
          <p className="text-sm text-[var(--text-secondary)]">{onNow.blurb}</p>
        </div>
        {trial && <button type="button" onClick={() => endTrial(false)} className="btn-soft !h-10 !text-sm"><Timer className="h-4 w-4" /> Stop the trial</button>}
        {!trial && onNow.id !== "classic" && <button type="button" onClick={() => act(LOOKS[0])} className="btn-soft !h-10 !text-sm">Back to Classic</button>}
      </div>

      <div role="tablist" aria-label="Filter Looks" className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button key={f.id} role="tab" aria-selected={filter === f.id} type="button" onClick={() => setFilter(f.id)} className={`cursor-pointer rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${filter === f.id ? "bg-[var(--btn)] text-[var(--btn-fg)]" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>{f.label}</button>
        ))}
        <span className="ml-auto text-xs text-[var(--text-muted)]">Trials: 5 minutes, once per Look. Left: Pro {Math.max(0, TRIALS_PER_TIER - triesUsed("pro"))} of {TRIALS_PER_TIER}, Plus {Math.max(0, TRIALS_PER_TIER - triesUsed("plus"))} of {TRIALS_PER_TIER}.</span>
      </div>

      <section aria-label="Fonts" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <div className="flex flex-wrap items-baseline gap-x-3"><h3 className="font-display text-base font-extrabold text-[var(--text-primary)]">Fonts for {onNow.name}</h3><p className="text-sm text-[var(--text-secondary)]">Chosen to suit this design. It uses {onNow.fonts.display} for headings and {onNow.fonts.body} for text; pick your own below. Your choice stays when you change Look.</p></div>
        <div className="mt-3 grid w-full gap-4 lg:grid-cols-3">
          {([["display", "Headings", fontSetFor(onNow.id).headings], ["numbers", "Numbers", fontSetFor(onNow.id).numbers], ["body", "Text", fontSetFor(onNow.id).text]] as const).map(([which, label, list]) => (
            <div key={which}>
              <p className="mb-1.5 text-xs font-bold text-[var(--text-muted)]">{label}</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setFont(which, undefined)} aria-pressed={!fonts?.[which]} className={`cursor-pointer rounded-xl border px-3 py-1.5 text-sm font-bold ${!fonts?.[which] ? "border-[var(--text-primary)] bg-[var(--btn)] text-[var(--btn-fg)]" : "border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-primary)]"}`}>Match the Look</button>
                {list.map((f) => (
                  <button key={f.id} type="button" onClick={() => setFont(which, f.var)} aria-pressed={fonts?.[which] === f.var} style={{ fontFamily: `var(${f.var})` }} className={`cursor-pointer rounded-xl border px-3 py-1.5 text-base ${fonts?.[which] === f.var ? "border-[var(--text-primary)] bg-[var(--btn)] text-[var(--btn-fg)]" : "border-[var(--border)] bg-[var(--surface-secondary)] text-[var(--text-primary)]"}`}>{which === "numbers" ? `${f.name} 0123` : f.name}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[var(--text-primary)]"><span className="font-display text-xl font-extrabold">Practise every GATE paper</span> <span className="ml-2 text-sm">The quick brown fox solves questions.</span> <span className="font-num ml-2 text-lg font-bold">1,024 · 65 marks · 17%</span></p>
      </section>

      <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {shown.map((l) => {
          const owned = canUseLook(l, tier), current = look === l.id && !trial, trying = trial?.id === l.id;
          const wasTried = tried.includes(l.id), limit = !owned && l.tier !== "free" && triesUsed(l.tier) >= TRIALS_PER_TIER;
          return (
            <li key={l.id} data-look-card={l.id} className="group flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 transition-shadow hover:shadow-lg">
              <button type="button" onClick={() => act(l)} disabled={!l.ready || current || (!owned && (wasTried || limit || !!trial))} aria-label={owned ? `Apply ${l.name}` : `Try ${l.name} for 5 minutes`} className="block w-full cursor-pointer text-left disabled:cursor-default">
                <LookPreview id={l.id} className="h-[150px]" />
              </button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-base font-extrabold text-[var(--text-primary)]">{l.name}</h3>
                  <span className="rounded-full bg-[var(--surface-secondary)] px-2 py-0.5 text-[11px] font-bold text-[var(--text-secondary)]">{l.tier === "pro" ? "Pro" : l.tier === "plus" ? "Plus" : "Free"}</span>
                  {current && <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--tint-mint-ink)]"><Check className="h-3 w-3" /> On now</span>}
                  {trying && <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--tint-peri-ink)]"><Timer className="h-3 w-3" /> Trying</span>}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{l.family} · {l.blurb}</p>
                <p className="text-[11px] text-[var(--text-muted)]">{l.modes === "dark" ? "Dark only" : l.modes === "light" ? "Light only" : "Light and dark"} · {l.fonts.display}</p>
              </div>
              <div className="mt-auto flex flex-wrap items-center gap-2">
                {!l.ready ? <span className="text-xs font-bold text-[var(--text-muted)]">Coming soon</span>
                  : owned ? <button type="button" onClick={() => act(l)} disabled={current} className="btn-main !h-9 !px-4 !text-sm disabled:opacity-60">{current ? "On now" : "Apply"}</button>
                  : (<>
                    <button type="button" onClick={() => act(l)} disabled={wasTried || limit || !!trial} className="btn-soft !h-9 !px-3 !text-sm disabled:opacity-60"><Sparkles className="h-4 w-4" /> {wasTried ? "Tried" : limit ? "No trials left" : "Try 5 min"}</button>
                    <Link href="/pro" className="pill-ink inline-flex items-center gap-1 text-xs"><Lock className="h-3 w-3" /> {l.tier === "pro" ? "Get Pro" : "Get Plus"}</Link>
                  </>)}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
