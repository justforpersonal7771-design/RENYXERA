"use client";

/**
 * The "buy" card: a deep gradient with a soft glow and a metallic button. Used wherever the app asks for money so it is
 * recognisable: purple for study packs, teal for Plus and Pro. Other cards stay pastel, so this one stands out.
 */
import type { ReactNode } from "react";
import { Lock, Sparkles } from "lucide-react";
import { openUpgrade } from "@/store/use-upgrade-modal-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { TIER_RANK } from "@/lib/billing/plans";

const SKIN = {
  study: { bg: "linear-gradient(150deg,#2a1f6b 0%,#4b2fa8 55%,#7a3fc4 100%)", glow: "bg-amber-300/25", kicker: "text-amber-200", shadow: "rgba(40,20,110,.7)" },
} as const;

/** Gold for study, pearl for plans: a gradient with a bright band that slides across on hover. */
const METAL = {
  gold: { bg: "linear-gradient(135deg,#fff1a8 0%,#f6c744 28%,#c98a1a 55%,#f8dc7c 80%,#b9791a 100%)", fg: "#2a1d00" },
} as const;

export function MetalButton({ metal, children, onClick, className = "" }: { metal: keyof typeof METAL; children: ReactNode; onClick: () => void; className?: string }) {
  const m = METAL[metal];
  return (
    <button type="button" onClick={onClick} className={`group/metal relative inline-flex h-11 items-center justify-center overflow-hidden rounded-xl px-5 font-extrabold shadow-[inset_0_1px_0_rgba(255,255,255,.8),inset_0_-2px_0_rgba(0,0,0,.18),0_10px_22px_-10px_rgba(0,0,0,.6)] transition-transform hover:-translate-y-0.5 ${className}`} style={{ background: m.bg, color: m.fg }}>
      <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/55 blur-[2px] transition-transform duration-700 group-hover/metal:translate-x-[420%]" />
      <span className="relative">{children}</span>
    </button>
  );
}

export function PremiumCard({ skin, eyebrow, title, body, cta, onClick, compact = false, className = "" }: { skin: "study" | "silver" | "gold"; eyebrow: string; title: string; body: string; cta: string; onClick: () => void; compact?: boolean; className?: string }) {
  const layout = compact ? "flex flex-wrap items-center gap-x-5 gap-y-3 px-5 py-4" : "flex flex-col justify-between gap-3 p-5 sm:p-6";
  if (skin !== "study") {
    // Plus = silver, Pro = gold: foil border and strip, neutral body, metallic button (classes in globals.css)
    return (
      <section aria-label={title} className={`plan-card plan-${skin} rounded-[var(--card-radius,24px)] ${layout} ${compact ? "pt-5" : ""} ${className}`}>
        <div className={`relative min-w-0 ${compact ? "flex-1" : ""}`}>
          <p className="plan-kicker flex items-center gap-1.5 text-sm font-extrabold"><Sparkles className="h-4 w-4" aria-hidden /> {eyebrow}</p>
          <p className={`mt-1 font-display font-extrabold leading-tight text-[var(--text-primary)] ${compact ? "text-xl" : "text-3xl"}`}>{title}</p>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)] text-balance">{body}</p>
        </div>
        <button type="button" onClick={onClick} className={`plan-cta plan-${skin} relative inline-flex h-11 shrink-0 items-center justify-center rounded-xl px-5 font-extrabold transition-transform hover:-translate-y-0.5 ${compact ? "" : "w-full"}`}>{cta}</button>
      </section>
    );
  }
  const s = SKIN.study;
  return (
    <section aria-label={title} className={`relative overflow-hidden rounded-[var(--card-radius,24px)] text-white ${layout} ${className}`} style={{ background: s.bg, boxShadow: `0 22px 44px -26px ${s.shadow}` }}>
      <span aria-hidden className={`pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full blur-2xl ${s.glow}`} />
      <div className={`relative min-w-0 ${compact ? "flex-1" : ""}`}>
        <p className={`flex items-center gap-1.5 text-sm font-extrabold ${s.kicker}`}><Lock className="h-4 w-4" aria-hidden /> {eyebrow}</p>
        <p className={`mt-1 font-display font-extrabold leading-tight ${compact ? "text-xl" : "text-3xl"}`}>{title}</p>
        <p className="mt-1.5 text-sm text-white/85 text-balance">{body}</p>
      </div>
      <MetalButton metal="gold" onClick={onClick} className={compact ? "shrink-0" : "relative w-full"}>{cta}</MetalButton>
    </section>
  );
}

/** Plus (silver) and Pro (gold) as a buy card for students who are not on that plan yet: free sees Plus, Plus sees Pro. */
export function PlanUpsellCard({ className = "" }: { className?: string }) {
  const ent = useEntitlements();
  if (ent.loading || TIER_RANK[ent.tier] >= TIER_RANK.pro) return null;
  const free = TIER_RANK[ent.tier] < TIER_RANK.plus;
  return <PremiumCard skin={free ? "silver" : "gold"} compact className={className} eyebrow={free ? "Plus · Silver" : "Pro · Gold"} title={free ? "Practise without limits" : "Go further with Pro"} body={free ? "More Mentor messages, Forge questions and reminders every day." : "Unlimited Forge, the most Mentor messages and every reminder."} cta="See plans" onClick={() => openUpgrade(free ? "Plus plan" : "Pro plan")} />;
}
