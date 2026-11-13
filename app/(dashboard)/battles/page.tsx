"use client";

/**
 * Battles lobby (R31B-1, rebuilt 14 Nov after the owner's "doesn't look like a game" review).
 * Research applied (Clash Royale / Brawl Stars breakdowns): an open centre stage, one gold primary action in the lower
 * half, oversized round menu buttons, and popups that keep the lobby visible instead of leaving it.
 *  - Stage: you on a podium facing an open rival slot across the VS emblem (components/game/arena-stage.tsx).
 *  - PLAY: the one gold action, bevelled, pressed down on tap.
 *  - Round buttons: Daily, Clubs, Friends (popups over the lobby); Ranks, Matches (screens).
 *  - Challenge tickets: real invites from /api/battles. Every figure comes from the server.
 */
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Gift, ListChecks, Medal, Play, Swords, UserPlus, Users, UsersRound, X } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { ClubPanel, DailyReward } from "@/components/battles/clubs-coins";
import { FriendsPanel } from "@/components/friends/friends-panel";
import { ArenaStage } from "@/components/game/arena-stage";
import { useArenaMe, usePlayer } from "@/components/game/use-arena";

type Ticket = { id: string; title: string; ownerName: string; questions: number; expiresAt: string };
type ApiBattle = { id: string; title: string; ownerName: string; questions: number; expiresAt: string; expired: boolean; invited?: boolean; entries: { you: boolean; status: string }[] };
type Sheet = "daily" | "clubs" | "friends" | null;

export default function GameLobby() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => !s.loading);
  const openAuth = useAuthModalStore((s) => s.open);
  if (!user && !ready) return <div className="g-stage h-[300px] animate-pulse motion-reduce:animate-none sm:h-[460px]" aria-label="Loading the arena" />;
  if (!user) return (
    <div className="space-y-6">
      <div className="g-stage relative h-[300px] sm:h-[460px]">
        <ArenaStage name="You" avatar="" rating={null} ring={null} season={null} />
      </div>
      <div className="text-center">
        <h1 className="g-title text-3xl sm:text-5xl">Same questions. Who scores more?</h1>
        <p className="mx-auto mt-2 max-w-xl g-text-2">Real GATE questions against your friends, live or later. Scores are checked by the server, so every win is fair.</p>
        <button type="button" onClick={() => openAuth("signup")} className="g-play mt-6">Sign in to play</button>
      </div>
    </div>
  );
  return <Lobby />;
}

function Lobby() {
  const p = usePlayer();
  const { data } = useArenaMe();
  const tickets = useTickets();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [daily, setDaily] = useState<boolean | null>(null);
  useEffect(() => {
    const load = () => void fetch("/api/coins", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j: { claimedToday?: boolean } | null) => j && setDaily(!j.claimedToday)).catch(() => {});
    load();
    window.addEventListener("renyxera:coins", load);
    return () => window.removeEventListener("renyxera:coins", load);
  }, []);
  const season = data?.season ? `Season ${data.season.number}, ${data.season.daysLeft} ${data.season.daysLeft === 1 ? "day" : "days"} left` : null;
  const count = Array.isArray(tickets) ? tickets.length : 0;

  const orbs: { key: string; label: string; icon: typeof Gift; c: string; badge?: string; sheet?: Sheet; href?: string }[] = [
    { key: "daily", label: "Daily", icon: Gift, c: "#f59e0b", badge: daily ? "1" : undefined, sheet: "daily" },
    { key: "friends", label: "Friends", icon: Users, c: "#0ea5e9", sheet: "friends" },
    { key: "clubs", label: "Clubs", icon: UsersRound, c: "#8b5cf6", sheet: "clubs" },
    { key: "ranks", label: "Ranks", icon: Medal, c: "#ef4466", href: "/battles/arena" },
    { key: "matches", label: "Matches", icon: ListChecks, c: "#10b981", href: "/battles/matches" },
  ];

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,340px)] lg:gap-6">
        {/* round menu buttons: a row on phones, a column on desktop */}
        <nav aria-label="Lobby" className="order-2 flex justify-between gap-1 lg:order-1 lg:flex-col lg:justify-start lg:gap-5 lg:pt-4">
          {orbs.map((o) => {
            const face = (
              <>
                <span className="g-orb-face" style={{ ["--c" as string]: o.c }}>
                  <o.icon className="h-7 w-7 drop-shadow" strokeWidth={2.2} aria-hidden />
                  {o.badge && <span className="g-orb-badge" aria-label="Ready to claim">{o.badge}</span>}
                </span>
                {o.label}
              </>
            );
            return o.href
              ? <Link key={o.key} href={o.href} className="g-orb">{face}</Link>
              : <button key={o.key} type="button" onClick={() => setSheet(o.sheet!)} className="g-orb cursor-pointer">{face}</button>;
          })}
        </nav>

        {/* the stage and PLAY */}
        <section aria-label="Arena" className="order-1 lg:order-2">
          <div className="g-stage relative h-[300px] sm:h-[420px] xl:h-[500px]">
            <ArenaStage name={p.name} avatar={p.avatar} rating={data?.me.rating ?? null} ring={p.ring} season={season} />
          </div>
          <div className="-mt-7 flex justify-center">
            <Link href="/battles/play" className="g-play relative z-10"><Play className="h-7 w-7" fill="currentColor" aria-hidden /> PLAY</Link>
          </div>
          {data && (
            <dl className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-2 text-center">
              <Figure label="Points this week" value={String(data.me.points)} />
              <Figure label="Friends rank" value={data.me.rank > 0 ? `#${data.me.rank}` : "–"} />
              <Figure label="Wins" value={`${data.me.wins}/${data.me.battles}`} />
            </dl>
          )}
        </section>

        {/* challenges waiting */}
        <aside aria-labelledby="tickets-h" className="order-3">
          <h2 id="tickets-h" className="g-title mb-3 flex items-center gap-2 text-xl"><Swords className="h-5 w-5 text-[var(--g-rose)]" aria-hidden /> Challenges {count > 0 && <span className="g-orb-badge !static">{count}</span>}</h2>
          <Tickets tickets={tickets} onFriends={() => setSheet("friends")} />
        </aside>
      </div>

      <LobbySheet open={sheet} onClose={() => setSheet(null)} />
    </>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--g-line)] bg-[rgba(10,12,31,0.55)] px-2 py-2.5">
      <dd className="g-num text-2xl font-black text-[var(--g-text)]">{value}</dd>
      <dt className="text-[11px] font-bold text-[var(--g-muted)]">{label}</dt>
    </div>
  );
}

/** Popups over the lobby (research: keep the previous screen visible behind, so the player never feels lost). */
function LobbySheet({ open, onClose }: { open: Sheet; onClose: () => void }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  const title = open === "daily" ? "Daily reward" : open === "clubs" ? "Your club" : "Friends";
  const body: ReactNode = open === "daily" ? <DailyReward /> : open === "clubs" ? <ClubPanel /> : <FriendsPanel />;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(5,6,18,0.7)] p-0 sm:items-center sm:p-6" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { y: 40, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="no-scrollbar max-h-[85dvh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border border-[rgba(169,154,247,0.3)] bg-[var(--g-surface)] p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:rounded-[28px] sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="g-title text-2xl">{title}</p>
              <button type="button" onClick={onClose} aria-label="Close" className="g-orb !min-w-0" style={{ ["--c" as string]: "#ef4466" }}>
                <span className="g-orb-face !h-10 !w-10 !rounded-xl"><X className="h-5 w-5" aria-hidden /></span>
              </button>
            </div>
            {body}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function useTickets(): Ticket[] | null | "error" {
  const [t, setT] = useState<Ticket[] | null | "error">(null);
  useEffect(() => {
    let live = true;
    const load = () => fetch("/api/battles", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((j: { battles: ApiBattle[] }) => {
        if (!live) return;
        setT(j.battles.filter((b) => b.invited && !b.expired && !b.entries.some((e) => e.you && e.status === "submitted"))
          .map((b) => ({ id: b.id, title: b.title, ownerName: b.ownerName, questions: b.questions, expiresAt: b.expiresAt })));
      })
      .catch(() => { if (live) setT((x) => (Array.isArray(x) ? x : "error")); });
    void load();
    const i = setInterval(() => { if (document.visibilityState === "visible") void load(); }, 20_000);
    return () => { live = false; clearInterval(i); };
  }, []);
  return t;
}

const daysLeft = (iso: string) => { const d = Math.ceil((Date.parse(iso) - Date.now()) / 86_400_000); return d <= 1 ? "Ends today" : `${d} days left`; };
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

function Tickets({ tickets, onFriends }: { tickets: Ticket[] | null | "error"; onFriends: () => void }) {
  if (tickets === null) return <div className="h-20 animate-pulse rounded-2xl bg-[var(--g-surface-2)] motion-reduce:animate-none" aria-label="Loading challenges" />;
  if (tickets === "error") return <p className="rounded-2xl border border-[var(--g-line)] bg-[var(--g-surface)] p-4 text-sm g-text-2" role="alert">Couldn&apos;t load your challenges. They will appear when the connection is back.</p>;
  if (tickets.length === 0) return (
    <div className="rounded-2xl border-2 border-dashed border-[rgba(255,184,107,0.35)] p-5 text-center">
      <p className="font-bold text-[var(--g-text)]">No challenges waiting</p>
      <p className="mt-1 text-sm g-text-2">Add friends and they can challenge you here.</p>
      <button type="button" onClick={onFriends} className="g-btn mt-4"><UserPlus className="h-4 w-4" aria-hidden /> Add friends</button>
    </div>
  );
  return (
    <ul className="space-y-3">
      {tickets.map((t) => (
        <li key={t.id} className="g-ticket">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--g-deep)] text-sm font-black text-[var(--g-amber)]">{initials(t.ownerName)}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-black">{t.ownerName}</span>
            <span className="block truncate text-xs font-bold opacity-80">{t.questions} questions, {daysLeft(t.expiresAt)}</span>
          </span>
          <Link href={`/challenge/${t.id}`} className="g-ticket-go">PLAY</Link>
        </li>
      ))}
    </ul>
  );
}
