"use client";

/**
 * Play: choose a mode (R31B-2, rebuilt as game mode tiles). Only modes the server runs today are playable. Ranked and
 * Quick are shown locked with the reason (decisions D08 and D10 in docs/roadmap/RELEASES-2026-11.md), never as working.
 */
import Link from "next/link";
import { CalendarClock, Coins, History, Lock, Radio, Timer, Trophy } from "lucide-react";

const MODES = [
  { id: "live", icon: Radio, title: "Live duel", line: "Start together on the same questions. Shared countdown, each other's progress on screen.", href: "/test-centre/build?challenge=1", cta: "Pick questions", c1: "#14b8a6", c2: "#0b5e63" },
  { id: "later", icon: CalendarClock, title: "Play later", line: "Send it now or for a set time within 7 days. Your friend plays when free.", href: "/test-centre/build?challenge=1", cta: "Pick questions", c1: "#6366f1", c2: "#2e2a87" },
  { id: "beat", icon: History, title: "Beat my score", line: "Pick a test you already finished and dare friends to beat your marks.", href: "/test-centre/history", cta: "Choose a test", c1: "#f97316", c2: "#8a2a12" },
] as const;

const LOCKED = [
  { id: "ranked", icon: Trophy, title: "Ranked Arena", line: "A random opponent near your rating. Opens when there are enough players to match fairly." },
  { id: "quick", icon: Timer, title: "Quick duel", line: "Five questions, a minute each. Being designed." },
] as const;

export default function PlayPage() {
  return (
    <div className="space-y-7">
      <header className="text-center">
        <h1 className="g-title text-4xl sm:text-5xl">Choose your battle</h1>
        <p className="mx-auto mt-2 max-w-xl g-text-2">Real GATE questions, GATE marking, scores checked by the server.</p>
      </header>

      <ul className="grid gap-5 md:grid-cols-3">
        {MODES.map((m) => (
          <li key={m.id}>
            <Link href={m.href} className="group relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 text-white transition-transform duration-100 active:translate-y-1 motion-reduce:transition-none sm:p-7"
              style={{ background: `radial-gradient(120% 90% at 20% 0%, ${m.c1}, ${m.c2} 75%)`, boxShadow: `inset 0 2px 0 rgba(255,255,255,.25), 0 8px 0 color-mix(in oklab, ${m.c2} 60%, black), 0 24px 40px -18px rgba(0,0,0,.8)` }}>
              <span aria-hidden className="pointer-events-none absolute inset-3 rounded-[22px] border-2 border-dashed border-white/15" />
              <m.icon aria-hidden className="pointer-events-none absolute -bottom-8 -right-8 h-44 w-44 rotate-[-12deg] text-white/10 transition-transform duration-300 group-hover:rotate-[-4deg] motion-reduce:transition-none" />
              <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,.3)]"><m.icon className="h-8 w-8" strokeWidth={2.2} aria-hidden /></span>
              <span className="g-title relative mt-5 text-3xl !text-white">{m.title}</span>
              <span className="relative mt-2 flex-1 text-[15px] font-medium text-white/90">{m.line}</span>
              <span className="relative mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-black/30 px-3 py-1 text-xs font-extrabold"><Coins className="h-3.5 w-3.5 text-[var(--g-amber)]" aria-hidden /> Win: 30 points, 20 coins</span>
              <span className="g-play relative mt-5 !min-h-[52px] self-start !px-6 !text-lg">{m.cta}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="locked-h">
        <h2 id="locked-h" className="g-title mb-3 text-xl">Locked for now</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {LOCKED.map((m) => (
            <li key={m.id} className="relative flex items-center gap-4 overflow-hidden rounded-[22px] border-2 border-dashed border-[var(--g-line-strong)] bg-[rgba(10,12,31,0.5)] p-5">
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--g-surface-3)] text-[var(--g-muted)]">
                <m.icon className="h-7 w-7" aria-hidden />
                <span className="absolute -bottom-1.5 -right-1.5 grid h-6 w-6 place-items-center rounded-full bg-[var(--g-deep)] text-[var(--g-amber)]"><Lock className="h-3.5 w-3.5" aria-label="Locked" /></span>
              </span>
              <span className="min-w-0">
                <span className="block font-display text-lg font-extrabold text-[var(--g-text)]">{m.title}</span>
                <span className="mt-0.5 block text-sm g-text-2">{m.line}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-center text-sm g-muted">Draw pays 15 points and 10 coins; finishing always pays 8 and 5. Picking questions opens the test builder, then the battle shows in Matches.</p>
    </div>
  );
}
