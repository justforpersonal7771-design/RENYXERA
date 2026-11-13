"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Crown, Swords } from "lucide-react";

export type LivePlayer = { id: string; name: string; answered: number; total: number; done: boolean; score: number | null; max: number | null; you: boolean; owner: boolean };

/** Polls the live room every `ms` while mounted (and the tab is visible). */
export function useBattleLive(battleId: string | null | undefined, ms = 4000) {
  const [players, setPlayers] = useState<LivePlayer[] | null>(null);
  useEffect(() => {
    if (!battleId) return;
    let alive = true;
    const tick = async () => {
      if (document.visibilityState !== "visible") return;
      const r = await fetch(`/api/battles/${battleId}/live`, { cache: "no-store" }).catch(() => null);
      if (r?.ok && alive) setPlayers(((await r.json()) as { players: LivePlayer[] }).players);
    };
    void tick();
    const t = setInterval(tick, ms);
    return () => { alive = false; clearInterval(t); };
  }, [battleId, ms]);
  return players;
}

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

/**
 * The live VS strip inside the exam screen: you and your opponent(s), how many each has answered, and a flash when someone finishes.
 * Phones: a slim bar under the exam header. Desktop: the top of the right-hand panel. Never over the question or the options. Your own count is live from this device; theirs refreshes every 4 s.
 */
export function BattleLiveStrip({ battleId, myAnswered, myTotal }: { battleId: string; myAnswered: number; myTotal: number }) {
  const players = useBattleLive(battleId);
  const [flash, setFlash] = useState<string | null>(null);
  const seenDone = useRef<Set<string>>(new Set());
  useEffect(() => {
    for (const p of players ?? []) {
      if (p.done && !p.you && !seenDone.current.has(p.id)) {
        seenDone.current.add(p.id);
        setFlash(`${p.name} finished`);
        const t = setTimeout(() => setFlash(null), 4000);
        return () => clearTimeout(t);
      }
    }
  }, [players]);
  const others = (players ?? []).filter((p) => !p.you).slice(0, 2);
  const rows = [{ id: "me", name: "You", answered: myAnswered, total: myTotal, done: false, you: true }, ...others];
  return (
    <div className="pointer-events-none fixed inset-x-2 top-[60px] z-[70] lg:inset-x-auto lg:right-4 lg:top-[72px] lg:w-[19rem]" aria-live="polite">
      <AnimatePresence>
        {flash && (
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="mb-2 w-fit rounded-full bg-amber-400 px-3 py-1 text-xs font-extrabold text-[#1b1530] shadow-lg">{flash}</motion.p>
        )}
      </AnimatePresence>
      <div className="pointer-events-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[0_18px_40px_-18px_rgba(40,20,120,.55)] backdrop-blur">
        <p className="mb-2 flex items-center gap-1.5 text-xs font-extrabold text-[var(--text-secondary)]"><Swords className="h-3.5 w-3.5" aria-hidden /> Live battle</p>
        <ul className="space-y-2">
          {rows.map((p) => {
            const pct = Math.min(100, Math.round((p.answered / Math.max(1, p.total)) * 100));
            return (
              <li key={p.id} className="flex items-center gap-2">
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[10px] font-black text-white ${p.you ? "bg-[var(--brand-violet,#6d28d9)]" : "bg-[linear-gradient(135deg,#f43f5e,#fb923c)]"}`}>{p.you ? "ME" : initials(p.name)}</span>
                <span className="min-w-0 flex-1">
                  <span className="flex justify-between gap-2 text-xs font-bold text-[var(--text-primary)]"><span className="truncate">{p.name}</span><span className="tabular-nums">{p.done ? "Done" : `${p.answered}/${p.total}`}</span></span>
                  <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><motion.span className={`block h-full rounded-full ${p.you ? "bg-[var(--brand-violet,#6d28d9)]" : "bg-rose-500"}`} animate={{ width: `${p.done ? 100 : pct}%` }} transition={{ type: "spring", stiffness: 140, damping: 22 }} /></span>
                </span>
              </li>
            );
          })}
        </ul>
        {players === null && <p className="mt-1 text-[11px] text-[var(--text-muted)]">Connecting…</p>}
      </div>
    </div>
  );
}

/** Result screen: everyone's score side by side, the winner crowned, and who is still playing (it updates live). */
export function BattleResultBoard({ battleId }: { battleId: string }) {
  const players = useBattleLive(battleId, 5000);
  if (!players) return null;
  const done = players.filter((p) => p.done && p.score !== null && p.max);
  const pct = (p: LivePlayer) => (p.score ?? 0) / (p.max || 1);
  const best = done.length > 1 ? Math.max(...done.map(pct)) : null;
  const tie = best !== null && done.filter((p) => pct(p) === best).length > 1;
  return (
    <section className="mt-6" aria-label="Battle result">
      <div className={`grid gap-3 ${players.length > 2 ? "sm:grid-cols-3" : "grid-cols-2"}`}>
        {players.map((p, i) => {
          const win = best !== null && !tie && p.done && pct(p) === best;
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: i * 0.12, type: "spring", stiffness: 260, damping: 22 }}
              className={`relative rounded-2xl border-2 p-4 text-center ${win ? "border-amber-400 bg-[var(--surface)]" : "border-[var(--border)] bg-[var(--surface)]"}`}>
              {win && <Crown className="absolute -top-3 left-1/2 h-6 w-6 -translate-x-1/2 text-amber-400" aria-label="Winner" />}
              <span className={`mx-auto grid h-12 w-12 place-items-center rounded-full text-sm font-black text-white ${p.you ? "bg-[var(--brand-violet,#6d28d9)]" : "bg-[linear-gradient(135deg,#f43f5e,#fb923c)]"}`}>{p.you ? "ME" : initials(p.name)}</span>
              <p className="mt-2 truncate text-sm font-extrabold text-[var(--text-primary)]">{p.you ? "You" : p.name}</p>
              {p.done && p.score !== null ? (
                <p className="font-display text-3xl font-extrabold tabular-nums text-[var(--text-primary)]">{p.score}<span className="text-base text-[var(--text-muted)]"> / {p.max}</span></p>
              ) : (
                <p className="mt-1 text-sm font-semibold text-[var(--text-secondary)]">Still playing · {p.answered}/{p.total}</p>
              )}
              <p className="text-xs font-bold text-[var(--text-secondary)]">{win ? "Winner · +30 Arena points" : tie && p.done && pct(p) === best ? "Tie · +15 Arena points" : p.done && best !== null ? "+8 Arena points" : ""}</p>
            </motion.div>
          );
        })}
      </div>
      {players.some((p) => !p.done) && <p className="mt-3 text-center text-xs text-[var(--text-muted)]">This updates by itself as others finish.</p>}
    </section>
  );
}
