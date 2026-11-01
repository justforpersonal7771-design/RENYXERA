"use client";

/** Dropdown under the top bar's Test Centre item: every door and every question source, so no section bar is needed on the screens. */
import Link from "next/link";
import { BarChart3, Layers, Settings, Swords, Timer, Trophy, RotateCcw } from "lucide-react";
import { TEST_CENTRE_HREF } from "@/lib/test-centre/brand";

const DOORS = [
  { href: "/test-centre/build", label: "Build a test", hint: "Pick questions, length, rules", icon: Settings },
  { href: "/test-centre/build?view=flashcards", label: "Flashcards", hint: "Recall cards, due first", icon: Layers },
  { href: "/test-centre/practice", label: "Practice", hint: "Mistakes, checkpoint, revision", icon: RotateCcw },
  { href: "/test-centre/mocks", label: "Mocks", hint: "All-India mocks and results", icon: Trophy },
  { href: "/battles", label: "Challenge", hint: "Beat a friend", icon: Swords },
  { href: "/test-centre/history", label: "History", hint: "Results and review", icon: BarChart3 },
];
const SOURCES = [
  { href: "/test-centre/build?source=pyq", label: "GATE PYQs" },
  { href: "/test-centre/build?source=forge", label: "Forge" },
  { href: "/test-centre/build?source=spark", label: "Spark" },
  { href: "/test-centre/build?source=mix", label: "Blend" },
];

export function TestCentreMenu() {
  return (
    <div role="menu" aria-label="Test Centre" className="absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 pt-3 opacity-0 pointer-events-none transition-opacity duration-150 group-hover/tc:pointer-events-auto group-hover/tc:opacity-100 group-focus-within/tc:pointer-events-auto group-focus-within/tc:opacity-100">
      <div className="card-well rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl" data-tint="mint">
        <Link href={TEST_CENTRE_HREF} role="menuitem" className="mb-2 flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-extrabold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"><Timer className="h-4 w-4" /> Test Centre home</Link>
        <ul className="grid grid-cols-2 gap-1.5">
          {DOORS.map((d) => (
            <li key={d.href}>
              <Link href={d.href} role="menuitem" className="flex h-full items-start gap-2 rounded-2xl px-3 py-2 hover:bg-[var(--surface-secondary)]">
                <d.icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-primary)]" aria-hidden />
                <span className="min-w-0"><span className="block text-sm font-bold text-[var(--text-primary)]">{d.label}</span><span className="block text-xs leading-snug text-[var(--text-muted)]">{d.hint}</span></span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mb-1.5 mt-3 px-1 text-xs font-bold text-[var(--text-muted)]">Build from</p>
        <div className="flex flex-wrap gap-1.5">
          {SOURCES.map((s) => <Link key={s.label} href={s.href} role="menuitem" className="pill-soft text-xs">{s.label}</Link>)}
        </div>
      </div>
    </div>
  );
}
