"use client";

/** Dashboard strip for the upcoming features (Forge, Study materials, Battles); hides any that are live. */
import Link from "next/link";
import { Anvil, BookOpenText, Swords, ArrowUpRight } from "lucide-react";
import { UPCOMING } from "@/lib/preview/features";

const ITEMS = [
  { key: "forge", href: "/forge", icon: Anvil, tint: "peach", title: "Forge", body: "New GATE-level questions every day, with a Daily Forge streak and Forge Mocks." },
  { key: "study", href: "/study", icon: BookOpenText, tint: "mint", title: "Study materials", body: "Lessons per topic: the idea, a worked example, traps and the PYQs to try next." },
  { key: "battles", href: "/battles", icon: Swords, tint: "rose", title: "Battles", body: "Send a set to friends and watch them play it live." },
] as const;

export function ComingUp() {
  const items = ITEMS.filter((i) => UPCOMING[i.key] !== "live");
  if (!items.length) return null;
  return (
    <section aria-label="Coming to RENYXERA">
      <h2 className="mb-3 font-display text-xl font-extrabold text-[var(--text-primary)]">Coming to RENYXERA</h2>
      <div className="snap-row md:grid md:grid-cols-3 md:gap-4">
        {items.map((i) => (
          <Link key={i.key} href={i.href} className="card-pastel group flex flex-col p-5 transition-transform hover:-translate-y-0.5" data-tint={i.tint}>
            <span className="flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--tint-ink)]"><i.icon className="h-5 w-5" /></span>
              <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)]">{UPCOMING[i.key] === "preview" ? "Preview" : "Soon"}</span>
            </span>
            <span className="mt-4 flex items-center gap-1 font-display text-lg font-extrabold text-[var(--text-primary)]">{i.title}<ArrowUpRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" /></span>
            <span className="mt-1 text-sm text-[var(--text-secondary)]">{i.body}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
