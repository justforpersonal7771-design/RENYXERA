"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Gift, Share2 } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

type Stats = { code: string | null; joined: number; credited: number };

/** 7E: "Invite friends" — both sides get 7 days of Pro when the friend finishes a first test. */
export function ReferralCard() {
  const signedIn = useAuthStore((s) => !!s.user);
  const [stats, setStats] = useState<Stats | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!signedIn) return;
    let alive = true;
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const sb = createClient();
        const { data: code } = await sb.rpc("my_referral_code");
        const { data } = await sb.rpc("my_referrals");
        const row = Array.isArray(data) ? data[0] : data;
        if (alive) setStats({ code: (code as string) ?? row?.code ?? null, joined: row?.joined ?? 0, credited: row?.credited ?? 0 });
      } catch { if (alive) setStats({ code: null, joined: 0, credited: 0 }); }
    })();
    return () => { alive = false; };
  }, [signedIn]);

  if (!signedIn) return null;
  const link = stats?.code ? `${window.location.origin}/r/${stats.code}` : "";
  const copy = async () => { try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {} };
  const share = async () => {
    const text = `I'm preparing for GATE CS on RENYXERA — every official paper, real weightage and free All-India mocks. Join with my link and we both get bonus AI requests:`;
    if (navigator.share) { try { await navigator.share({ title: "RENYXERA", text, url: link }); return; } catch {} }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${link}`)}`, "_blank", "noopener");
  };

  return (
    <section className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-[var(--surface)] to-teal-500/5 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white grid place-items-center shadow-md"><Gift className="w-5 h-5" /></span>
          <div>
            <h2 className="text-lg font-extrabold text-[var(--text-primary)]">Invite friends, earn Plus + AI credits</h2>
            <p className="text-sm text-[var(--text-secondary)]">When a friend joins with your link and practises on 2 different days, you get 1 day of Plus + 15 AI requests and they get 10. Up to 3 a month.</p>
          </div>
        </div>
        <div className="shrink-0 flex gap-2"><p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-2 text-center min-w-[92px]"><span className="block text-2xl font-extrabold font-num text-[var(--text-primary)]">{stats?.credited ?? 0}<span className="text-sm text-[var(--text-muted)]">/10</span></span><span className="text-xs font-semibold text-[var(--text-secondary)]">rewarded</span></p><p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 px-4 py-2 text-center min-w-[92px]"><span className="block text-2xl font-extrabold font-num text-[var(--text-primary)]">{stats?.joined ?? 0}</span><span className="text-xs font-semibold text-[var(--text-secondary)]">joined</span></p></div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <code className="flex-1 min-w-0 truncate rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text-primary)]">{link || "Creating your link…"}</code>
        <div className="flex gap-2">
          <button type="button" onClick={copy} disabled={!link} className="h-10 px-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm font-semibold text-[var(--text-primary)] inline-flex items-center gap-1.5 disabled:opacity-60 cursor-pointer">{copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}{copied ? "Copied" : "Copy"}</button>
          <button type="button" onClick={share} disabled={!link} className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-bold inline-flex items-center gap-1.5 shadow-md shadow-emerald-500/25 disabled:opacity-60 cursor-pointer"><Share2 className="w-4 h-4" /> Share</button>
        </div>
      </div>
    </section>
  );
}
