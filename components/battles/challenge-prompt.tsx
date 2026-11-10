"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Swords, X } from "lucide-react";
import { VsScreen } from "@/components/battles/vs-screen";
import { useIncomingChallenges, type Incoming } from "@/lib/battles/pending";
import { useAuthStore } from "@/store/use-auth-store";

const KEY = "renyxera.challengePromptSeen";
const seen = (): string[] => { try { return JSON.parse(sessionStorage.getItem(KEY) ?? "[]") as string[]; } catch { return []; } };
const mark = (id: string) => { try { sessionStorage.setItem(KEY, JSON.stringify([...seen(), id].slice(-30))); } catch { /* private mode */ } };

/** A challenge is "live" while it is fresh: sent as play-now in the last 3 minutes, or its scheduled time arrived in the last 30 minutes. */
export function isLive(c: Incoming, now = Date.now()): boolean {
  if (c.scheduledAt) { const t = Date.parse(c.scheduledAt); return t <= now && now - t < 30 * 60_000; }
  return c.playNow && !!c.at && now - Date.parse(c.at) < 3 * 60_000;
}

/** Challenges that arrived while the student was in a test (do not disturb). They are shown the moment the test ends, however long it took. */
const held = new Set<string>();

/**
 * The live moment: while the student is on the site and a friend challenges them to play now (or a scheduled time arrives), a prompt slides in
 * with Play now or Later. Play now shows the VS screen and countdown, then opens the battle. "Later" leaves it in Battles.
 * Do not disturb: during a test nothing is shown; challenges that arrive meanwhile are held and the prompt appears once the test is over.
 */
export function ChallengePromptHost() {
  const user = useAuthStore((s) => s.user);
  const list = useIncomingChallenges(!!user);
  const path = usePathname() ?? "";
  const router = useRouter();
  const [dismissed, setDismissed] = useState<string[]>(() => seen());
  const [go, setGo] = useState<Incoming | null>(null);

  const quiet = path.startsWith("/exam") || path.startsWith("/challenge/");
  useEffect(() => { if (quiet) for (const c of list) if (isLive(c)) held.add(c.id); }, [quiet, list]);
  const next = useMemo(() => (quiet ? undefined : list.find((c) => (isLive(c) || held.has(c.id)) && !dismissed.includes(c.id))), [list, dismissed, quiet]);
  const later = useCallback((id: string) => { mark(id); setDismissed((d) => [...d, id]); }, []);
  const name = "You";

  return (
    <>
      <AnimatePresence>
        {next && !go && (
          <div key={next.id} className="pointer-events-none fixed inset-x-0 top-[4.75rem] z-[550] flex justify-center px-3">
            <motion.div key={next.id} role="alertdialog" aria-label="Challenge" initial={{ opacity: 0, y: -24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -16 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="pointer-events-auto flex w-full max-w-[34rem] items-center gap-3 rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-2.5 pl-3 shadow-[0_22px_50px_-16px_rgba(40,20,120,.55)]">
              <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#f43f5e,#fb923c)] text-base font-black text-white">
                {next.from.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"}
                <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-[var(--surface)] bg-amber-400 text-[#1b1530]"><Swords className="h-3 w-3" aria-hidden /></span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[15px] font-extrabold leading-tight text-[var(--text-primary)]">{next.from} challenged you</span>
                <span className="block truncate text-xs text-[var(--text-secondary)]">{held.has(next.id) ? "Arrived while you were in a test" : `${next.title} · ${next.questions} questions`}</span>
              </span>
              <button type="button" className="btn-main shrink-0 !px-4 !py-2 text-sm" onClick={() => { later(next.id); setGo(next); }}>Play now</button>
              <button type="button" aria-label="Later" title="Later" onClick={() => later(next.id)} className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]"><X className="h-4 w-4" /></button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {go && <VsScreen me={name} opponent={go.from} title={go.title} onDone={() => { const id = go.id; setGo(null); router.push(`/challenge/${id}`); }} />}
    </>
  );
}
