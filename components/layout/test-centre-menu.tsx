"use client";

/** Dropdown under the top bar's Test Centre item: every door, so no section bar is needed on the screens. */
import Link from "next/link";
import { BarChart3, Layers, Settings, Swords, Timer, Trophy, RotateCcw } from "lucide-react";
import { TEST_CENTRE_HREF } from "@/lib/test-centre/brand";
import { SocialDot } from "@/components/friends/social-dot";

const DOORS = [
  { href: "/test-centre/build", label: "Build a test", icon: Settings },
  { href: "/test-centre/build?view=flashcards", label: "Flashcards", icon: Layers },
  { href: "/test-centre/practice", label: "Practice", icon: RotateCcw },
  { href: "/test-centre/mocks", label: "Mocks", icon: Trophy },
  { href: "/battles", label: "Challenge", icon: Swords },
  { href: "/test-centre/history", label: "History", icon: BarChart3 },
];
export function TestCentreMenu() {
  return (
    <div role="menu" aria-label="Test Centre" className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3 opacity-0 pointer-events-none transition-opacity duration-150 group-hover/tc:pointer-events-auto group-hover/tc:opacity-100 group-focus-within/tc:pointer-events-auto group-focus-within/tc:opacity-100">
      <div className="card-well rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl" data-tint="mint">
        <Link href={TEST_CENTRE_HREF} role="menuitem" className="mb-2 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-extrabold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"><Timer className="h-4 w-4" /> Test Centre home</Link>
        <ul className="grid grid-cols-2 gap-1.5">
          {DOORS.map((d) => (
            <li key={d.href}>
              <Link href={d.href} role="menuitem" className="flex h-full items-center gap-2 rounded-2xl px-3 py-2.5 hover:bg-[var(--surface-secondary)]">
                <d.icon className="h-4 w-4 shrink-0 text-[var(--text-primary)]" aria-hidden />
                <span className="min-w-0 whitespace-nowrap text-sm font-bold text-[var(--text-primary)]">{d.label}</span>{d.href === "/battles" ? <SocialDot /> : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
