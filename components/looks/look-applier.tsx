"use client";

/**
 * Puts the chosen Look on <html> (data-look), ends trials when their 5 minutes are up, sends a student back to Classic if their plan no longer
 * includes the Look they had, and shows the small "Trying <Look>" chip while a trial runs. The first paint is handled by the script in app/layout.tsx.
 */
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { LOOKS, canUseLook, lookById } from "@/lib/looks/looks";
import { effectiveLookId, useLookStore } from "@/store/use-look-store";

export function LookApplier() {
  const { tier, loading } = useEntitlements();
  const { look, trial, hydrated, load, setLook, endTrial, fonts } = useLookStore();
  const { setTheme, resolvedTheme } = useTheme();
  const before = useRef<string | null>(null);   // the student's own light/dark choice, restored when a dark-only Look ends
  const path = usePathname() ?? "";
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!trial) return; const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, [trial]);

  // Preview link: any page with ?look=<id> (for example ?look=glass, or ?look=classic to go back) switches to that Look and remembers it.
  useEffect(() => {
    if (!hydrated) return;
    try {
      const q = new URLSearchParams(window.location.search).get("look");
      if (q && LOOKS.some((l) => l.id === q) && q !== look) setLook(q);
    } catch { /* no search string */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on first hydration
  }, [hydrated]);

  // trial over
  useEffect(() => { if (trial && trial.endsAt <= now) endTrial(false); }, [trial, now, endTrial]);
  // plan check (waits until the plan is known, so a slow load never kicks anyone back to Classic)
  useEffect(() => { if (hydrated && !loading && !trial && !canUseLook(lookById(look), tier)) setLook("classic"); }, [hydrated, loading, trial, look, tier, setLook]);

  const id = lookById(effectiveLookId({ look, trial, tried: [] }, now)).id;
  useEffect(() => {
    const root = document.documentElement;
    if (!hydrated) return;
    if (id === "classic") root.removeAttribute("data-look"); else root.setAttribute("data-look", id);
  }, [id, hydrated]);

  // Exams run on a still page: ambient animations (the Aurora drift, glows) are frozen there so timing and taps stay crisp.
  useEffect(() => { const r = document.documentElement; if (path.startsWith("/exam")) r.setAttribute("data-in-exam", ""); else r.removeAttribute("data-in-exam"); }, [path]);
  // Fonts: the Look brings its own (CSS in looks*.css); an override from the Fonts section wins.
  useEffect(() => {
    if (!hydrated) return;
    const r = document.documentElement.style;
    if (fonts?.display) r.setProperty("--font-display", `var(${fonts.display})`); else r.removeProperty("--font-display");
    if (fonts?.body) r.setProperty("--font-sans", `var(${fonts.body})`); else r.removeProperty("--font-sans");
    if (fonts?.numbers) r.setProperty("--font-num", `var(${fonts.numbers})`); else r.removeProperty("--font-num");
  }, [fonts, hydrated, id]);
  // A Look designed only for dark switches the app to dark while it is on, and gives the student's choice back afterwards.
  const mode = lookById(id).modes;
  useEffect(() => {
    if (!hydrated) return;
    if (mode === "dark") { if (before.current === null) before.current = resolvedTheme ?? "light"; if (resolvedTheme !== "dark") setTheme("dark"); }
    else if (mode === "light") { if (before.current === null) before.current = resolvedTheme ?? "light"; if (resolvedTheme !== "light") setTheme("light"); }
    else if (before.current !== null) { setTheme(before.current); before.current = null; }
  }, [mode, hydrated, resolvedTheme, setTheme]);

  // During an exam nothing may float over the screen: the trial keeps running and the chip returns afterwards.
  if (!trial || trial.endsAt <= now || path.startsWith("/exam")) return null;
  const left = Math.max(0, Math.ceil((trial.endsAt - now) / 1000)), mm = Math.floor(left / 60), ss = String(left % 60).padStart(2, "0");
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-[78px] left-3 z-[330] lg:bottom-4">
      <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1 pl-2.5 pr-1 text-xs text-[var(--text-primary)] shadow-lg">
        <Sparkles className="h-3.5 w-3.5 text-[var(--tint-peri-ink)]" aria-hidden />
        <span className="max-w-[7.5rem] truncate font-bold" title={`Trying ${lookById(trial.id).name}`}>{lookById(trial.id).name}</span>
        <span className="font-num tabular-nums text-[var(--text-secondary)]">{mm}:{ss}</span>
        <button type="button" onClick={() => endTrial(false)} aria-label="Stop the trial and switch back" title="Switch back" className="grid h-6 w-6 cursor-pointer place-items-center rounded-full hover:bg-[var(--surface-secondary)]">&times;</button>
      </div>
    </div>
  );
}
