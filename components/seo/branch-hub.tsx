"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { BRANCHES, type BranchCode } from "@/lib/branches";
import { getCurrentBranch } from "@/lib/branch/current";

/**
 * Picker page for any branch-aware resource. Arriving from inside the app (the Tools dock) it opens straight on
 * the learner's own branch; a first-time or search visitor sees the list, with their own paper first.
 */
export function BranchHub({ kicker, title, lead, hrefFor }: { kicker: string; title: string; lead: string; hrefFor: (code: BranchCode) => string }) {
  const router = useRouter();
  const mine = getCurrentBranch();
  useEffect(() => {
    const internal = document.referrer && new URL(document.referrer).origin === window.location.origin;
    if (internal) router.replace(hrefFor(mine));
  }, [mine, router, hrefFor]);

  const live = BRANCHES.filter((b) => b.live).sort((a, b) => (a.code === mine ? -1 : b.code === mine ? 1 : 0));
  return (
    <div className="w-full space-y-6">
      <header className="w-full">
        <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">{kicker}</p>
        <h1 className="mt-1.5 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">{title}</h1>
        <p className="mt-2 max-w-4xl text-[var(--text-secondary)] leading-relaxed">{lead}</p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {live.map((b) => (
          <li key={b.code}>
            <Link href={hrefFor(b.code)} className={`group flex h-full items-center justify-between gap-3 rounded-2xl border p-4 transition hover:-translate-y-0.5 ${b.code === mine ? "border-violet-500/50 bg-violet-500/5" : "border-[var(--border)] bg-[var(--surface)]"}`}>
              <span className="min-w-0">
                <span className="block text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">GATE {b.paper}{b.code === mine ? " · your branch" : ""}</span>
                <span className="block font-extrabold text-[var(--text-primary)]">{b.name}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-violet-500 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
