"use client";

import { useEffect, useState } from "react";
import { Check, Gift } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { track } from "@/lib/growth/track";

/** Growth loop L-2: after a good result (accuracy ≥ 60%), offer the invite link in one line.
 *  Signed-in only (invite codes belong to accounts). Both sides get 7 days of Pro when the
 *  friend finishes a first test (existing referral rules, migration 0020). */
export function InviteNudge({ accuracy, fallback }: { accuracy: number; fallback?: React.ReactNode }) {
  const signedIn = useAuthStore((s) => !!s.user);
  const [code, setCode] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const show = signedIn && accuracy >= 60;

  useEffect(() => {
    if (!show) return;
    let alive = true;
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const { data } = await createClient().rpc("my_referral_code");
        if (alive && typeof data === "string") setCode(data);
      } catch { /* no nudge */ }
    })();
    return () => { alive = false; };
  }, [show]);

  if (!show || !code) return <>{fallback}</>;
  const link = `${window.location.origin}/r/${code}`;
  const share = async () => {
    track("invite_shared");
    const text = `I'm practising real GATE papers on RENYXERA, free. Try a test with my link (we both get 7 days of Pro):`;
    if (navigator.share) { try { await navigator.share({ title: "RENYXERA", text, url: link }); return; } catch { /* fall back to copy */ } }
    try { await navigator.clipboard.writeText(`${text} ${link}`); setDone(true); setTimeout(() => setDone(false), 2000); } catch {}
  };

  return (
    <button type="button" onClick={share}
      className="group mx-auto mt-2 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 bg-violet-500/10 ring-1 ring-violet-500/20 transition hover:ring-violet-500/50 hover:-translate-y-px cursor-pointer">
      {done ? <Check className="w-3.5 h-3.5" /> : <Gift className="w-3.5 h-3.5 transition-transform group-hover:-rotate-12" />}
      {done ? "Invite link copied" : "Nice score! Invite a friend preparing for GATE — you both get 7 days of Pro"}
    </button>
  );
}
