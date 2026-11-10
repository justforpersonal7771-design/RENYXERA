"use client";

import Link from "next/link";
import { Swords } from "lucide-react";
import { useIncomingChallenges } from "@/lib/battles/pending";
import { useAuthStore } from "@/store/use-auth-store";

const when = (iso: string) => new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", hour: "numeric", minute: "2-digit" }).format(new Date(iso));

/** Shown on the dashboard when friends have challenged me: who, which test, and when (a set time, or "now"). Renders nothing otherwise. */
export function ChallengeBanner() {
  const signedIn = useAuthStore((s) => !!s.user);
  const list = useIncomingChallenges(signedIn);
  if (list.length === 0) return null;
  const first = list[0];
  return (
    <Link href="/battles" className="card-pastel metal flex items-center gap-4 p-4 sm:p-5" data-tint="rose" data-nowm aria-label="Open your challenges">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--tint-ink)]"><Swords className="h-6 w-6" aria-hidden /></span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-lg font-extrabold text-[var(--text-primary)]">{list.length === 1 ? `${first.from} challenged you` : `${list.length} friends challenged you`}</span>
        <span className="block truncate text-sm text-[var(--text-secondary)]">{list.length === 1 ? `${first.title}${first.scheduledAt ? `, set for ${when(first.scheduledAt)}` : ""}` : "Open Battles to play them."}</span>
      </span>
      <span className="btn-main !px-4 !py-2 text-sm">Play</span>
    </Link>
  );
}
