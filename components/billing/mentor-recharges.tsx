"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { TOPUP_EXPIRY_DAYS, TOPUP_PACKS, costInSmallPacksPaise } from "@/lib/billing/ai-topups";
import { formatPrice } from "@/lib/billing/plans";
import { formatTokens } from "@/lib/billing/ai-credits";
import { track } from "@/lib/growth/track";

/** "AI Mentor recharges" on the upgrade screen: small one-off packs for students who run out of daily Mentor messages. Not on sale yet: "Notify me". */
export function MentorRecharges({ compact = false }: { compact?: boolean }) {
  const [noted, setNoted] = useState<string[]>([]);
  const notify = (id: string) => { track("upgrade_clicked", null, `mentor_pack_${id}`); setNoted((n) => (n.includes(id) ? n : [...n, id])); };
  return (
    <section aria-labelledby="recharge-h" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="recharge-h" className="inline-flex items-center gap-2 text-lg font-extrabold text-[var(--text-primary)]"><Zap className="h-4 w-4 text-amber-500" aria-hidden /> AI Mentor recharges</h2>
        <span className="rounded-full bg-[var(--tint-butter)] px-2.5 py-0.5 text-[11px] font-black text-[var(--tint-butter-ink)]">Coming soon</span>
      </div>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Ran out of Mentor messages for today? A recharge adds more, used after your daily allowance. It lasts {TOPUP_EXPIRY_DAYS} days and works on any plan, Free included. A recharge never unlocks Pro features.</p>
      <div className={`mt-4 grid gap-3 ${compact ? "grid-cols-1" : "sm:grid-cols-3"}`}>
        {TOPUP_PACKS.map((p) => {
          const small = costInSmallPacksPaise(p);
          const done = noted.includes(p.id);
          return (
            <div key={p.id} className={`relative flex flex-col rounded-2xl border p-4 ${p.tag ? "border-amber-400/60 bg-amber-500/5" : "border-[var(--border)]"}`}>
              {p.tag && <span className="absolute -top-2.5 left-4 rounded-full bg-[var(--tint-butter)] px-2 py-0.5 text-[10px] font-black text-[var(--tint-butter-ink)]">{p.tag}</span>}
              <p className="text-sm font-black text-[var(--text-muted)]">{p.name}</p>
              <p className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{formatPrice(p.pricePaise)}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{formatTokens(p.tokens)} tokens</p>
              <p className="text-xs text-[var(--text-secondary)]">about {p.questions} short questions</p>
              {small > p.pricePaise && <p className="mt-1 text-[11px] text-[var(--text-muted)]">The same in Small packs: {formatPrice(small)}</p>}
              <span className="min-h-3 flex-1" aria-hidden />
              <button type="button" onClick={() => notify(p.id)} disabled={done} className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] disabled:opacity-70 cursor-pointer">
                {done ? <><Check className="h-4 w-4 text-emerald-500" /> We&apos;ll tell you</> : "Notify me"}
              </button>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[11px] text-[var(--text-muted)]">A short question uses about 1.5K tokens. Long plans and long chats use more. No payment is taken yet.</p>
    </section>
  );
}
