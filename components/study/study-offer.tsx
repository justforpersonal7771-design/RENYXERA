"use client";

/**
 * Study pack offer moments (docs/study-materials/13 §4). One quiet, dismissible card, built from the student's own data.
 * Rules kept here: never on an exam screen (callers place it only after a test), not before 2 separate days of use
 * (3 for the dashboard), never for packs already owned, dismissed moments stay away for 14 days, true prices only.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpenText, X } from "lucide-react";
import { bestBundleFor, packOfSubject, packTotal, rupees, type Pack } from "@/lib/study/packs";
import { useStudyAccess } from "@/lib/study/use-study-access";
import { istDateStr } from "@/lib/time/ist";

export type OfferMoment = "results" | "mistakes" | "dashboard" | "purchase";
const DAYS_KEY = "renyxera.visitDays";
const dismissKey = (m: OfferMoment) => `renyxera.offer.${m}`;

function usageDays(): number {
  try { const today = istDateStr(new Date()); const d: string[] = JSON.parse(localStorage.getItem(DAYS_KEY) ?? "[]"); if (!d.includes(today)) { d.push(today); localStorage.setItem(DAYS_KEY, JSON.stringify(d.slice(-60))); } return d.length; } catch { return 0; }
}
function dismissed(m: OfferMoment) { try { const t = Number(localStorage.getItem(dismissKey(m)) ?? 0); return Date.now() - t < 14 * 86400_000; } catch { return false; } }

/** subjects: weakest first, with an optional score (accuracy %) to show. */
export function StudyOffer({ moment, subjects, className = "" }: { moment: OfferMoment; subjects: { name: string; pct?: number }[]; className?: string }) {
  const access = useStudyAccess();
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const days = usageDays();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- device-only usage gate, read once after mount
    setReady(days >= (moment === "dashboard" ? 3 : 2) && !dismissed(moment));
  }, [moment]);
  if (!ready || gone || access.loading || access.all) return null;

  const seen = new Set<string>(); const picks: { pack: Pack; name: string; pct?: number }[] = [];
  for (const s of subjects) { const p = packOfSubject(s.name); if (p && !seen.has(p.id) && !access.packs.includes(p.id)) { seen.add(p.id); picks.push({ pack: p, name: s.name.replace(/\s*\(.*\)$/, ""), pct: s.pct }); } }
  const top = picks.slice(0, 2);
  if (moment !== "purchase" && !top.length) return null;
  const bundle = top.length ? bestBundleFor(top.map((t) => t.pack.id)) : null;
  const close = () => { try { localStorage.setItem(dismissKey(moment), String(Date.now())); } catch { /* storage off */ } setGone(true); };

  const lead = moment === "purchase" ? "Your plan makes practice faster. Learn the topics you miss with a study pack."
    : moment === "mistakes" ? `You keep missing questions in ${top[0].name}. Learn the topic properly:`
    : moment === "dashboard" ? `Your weakest subject right now is ${top[0].name}.`
    : `Your weakest subjects in this test: ${top.map((t) => (t.pct != null ? `${t.name} (${Math.round(t.pct)}%)` : t.name)).join(", ")}.`;
  const offer = moment === "purchase" ? "Pick your weakest subject's pack, or Complete CS for every subject."
    : top.length === 1 ? `The ${top[0].pack.name} pack is ${rupees(top[0].pack.pricePaise)}${bundle ? `, or ${bundle.name} for ${rupees(bundle.pricePaise)}` : ""}.`
    : `Both packs together are ${rupees(packTotal(top.map((t) => t.pack.id)))}${bundle ? `, or ${bundle.name} for ${rupees(bundle.pricePaise)}` : ""}.`;

  return (
    <aside aria-label="Study pack suggestion" className={`card-pastel relative flex flex-wrap items-center gap-3 p-4 pr-12 ${className}`} data-tint="peach">
      <BookOpenText className="h-5 w-5 shrink-0 text-[var(--tint-peach-ink)]" aria-hidden />
      <p className="min-w-0 flex-1 text-sm text-[var(--text-primary)]"><b>{lead}</b> {offer} Study packs are separate from Plus and Pro.</p>
      <Link href="/study#packs" className="pill-ink shrink-0">See study packs</Link>
      <button type="button" onClick={close} aria-label="Dismiss suggestion" className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface)]"><X className="h-4 w-4" /></button>
    </aside>
  );
}
