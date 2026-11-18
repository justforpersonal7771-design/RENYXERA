"use client";

/**
 * Battles home: the Citadel (v3, 18 Nov). Every student's base is built from their real practice: the Town Hall in the
 * middle, one building per subject group around it, each levelled only by questions attempted and accuracy
 * (lib/game/citadel.ts, analytics subjectPerformance). Tap a building to see its level, what the next level needs,
 * and to train or attack that subject. Inbox, daily reward and friends open as popups over the citadel.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Gift, Inbox, Swords, UserPlus, Users, UsersRound, X } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { useAnalyticsStore } from "@/store/use-analytics-store";
import { ClubPanel, DailyReward } from "@/components/battles/clubs-coins";
import { FriendsPanel } from "@/components/friends/friends-panel";
import { CitadelScene } from "@/components/game/citadel-scene";
import { useArenaMe } from "@/components/game/use-arena";
import { BUILDINGS, MAX_LEVEL, buildingState, leagueOf, townHallLevel, type BuildingState } from "@/lib/game/citadel";

type Ticket = { id: string; title: string; ownerName: string; questions: number; expiresAt: string };
type ApiBattle = { id: string; title: string; ownerName: string; questions: number; expiresAt: string; expired: boolean; invited?: boolean; entries: { you: boolean; status: string }[] };
type Sheet = "daily" | "clubs" | "friends" | "challenges" | null;

export default function GameHome() {
  const user = useAuthStore((s) => s.user);
  const ready = useAuthStore((s) => !s.loading);
  const openAuth = useAuthModalStore((s) => s.open);
  if (!user && !ready) return <div className="h-[56vh] animate-pulse rounded-3xl bg-[var(--g-surface)] motion-reduce:animate-none" aria-label="Loading your citadel" />;
  if (!user) return (
    <div className="space-y-6 text-center">
      <div className="mx-auto h-[46vh] max-w-3xl"><CitadelScene buildings={BUILDINGS.map((b) => buildingState(b, []))} hallLevel={1} onPick={() => openAuth("signup")} /></div>
      <h1 className="g-title text-3xl sm:text-5xl">Build your GATE citadel</h1>
      <p className="mx-auto max-w-xl g-text-2">Every subject is a building. It grows only when you get better at it. Attack your friends&apos; buildings, defend yours, climb the leagues with your clan.</p>
      <button type="button" onClick={() => openAuth("signup")} className="g-play">Sign in to start building</button>
    </div>
  );
  return <Citadel />;
}

function Citadel() {
  const { dashboardMetrics, loadAnalytics } = useAnalyticsStore();
  useEffect(() => { void loadAnalytics(); }, [loadAnalytics]);
  const perf = useMemo(() => (dashboardMetrics?.subjectPerformance ?? []).map((s) => ({ subject: s.subject, attempted: s.attempted, correct: s.correct })), [dashboardMetrics]);
  const states = useMemo(() => BUILDINGS.map((b) => buildingState(b, perf)), [perf]);
  const hall = townHallLevel(states);
  const levelSum = states.reduce((t, b) => t + b.level, 0);
  const toNextHall = Math.max(0, hall * states.length - levelSum);
  const { data } = useArenaMe();
  const league = data ? leagueOf(data.me.rating) : null;
  const tickets = useTickets();
  const [sheet, setSheet] = useState<Sheet>(null);
  const [pick, setPick] = useState<BuildingState | null>(null);
  const [daily, setDaily] = useState<boolean | null>(null);
  useEffect(() => {
    const load = () => void fetch("/api/coins", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j: { claimedToday?: boolean } | null) => j && setDaily(!j.claimedToday)).catch(() => {});
    load();
    window.addEventListener("renyxera:coins", load);
    return () => window.removeEventListener("renyxera:coins", load);
  }, []);
  const count = Array.isArray(tickets) ? tickets.length : 0;

  const orbs: { key: string; label: string; icon: typeof Gift; c: string; badge?: string; sheet?: Sheet; href?: string }[] = [
    { key: "attack", label: "Attack", icon: Swords, c: "#c4412d", href: "/battles/play" },
    { key: "inbox", label: "Inbox", icon: Inbox, c: "#7a2230", badge: count > 0 ? String(count) : undefined, sheet: "challenges" },
    { key: "daily", label: "Daily", icon: Gift, c: "#e2ad25", badge: daily ? "1" : undefined, sheet: "daily" },
    { key: "clan", label: "Clan", icon: UsersRound, c: "#d9772b", href: "/battles/clubs" },
    { key: "friends", label: "Friends", icon: Users, c: "#5a7230", sheet: "friends" },
  ];

  return (
    <>
      <section aria-label="Your citadel" className="relative -mx-3 sm:-mx-6 lg:-mx-10">
        <div ref={(el) => { if (el && !el.dataset.c) { el.dataset.c = "1"; el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2; } }} className="no-scrollbar h-[54vh] min-h-[340px] overflow-x-auto overscroll-x-contain lg:h-[64vh] lg:overflow-visible"><CitadelScene buildings={states} hallLevel={hall} onPick={(id) => setPick(states.find((b) => b.id === id) ?? null)} /></div>
        <div className="pointer-events-none absolute left-3 top-1 flex flex-wrap gap-2 sm:left-6 lg:left-10">
          <span className="g-hud !pl-3">Town Hall <b className="text-[var(--g-brass-hi)]">{hall}</b></span>
          {league && <span className="g-hud !pl-3">{league.name} league</span>}
        </div>
      </section>

      <div className="mx-auto mt-2 grid max-w-5xl gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="rounded-2xl bg-[linear-gradient(180deg,var(--g-wood),var(--g-wood-dark))] p-4 shadow-[inset_0_1px_0_rgba(255,220,170,0.3)]">
          <p className="g-title text-lg">{toNextHall === 0 ? `Town Hall ${hall + 1} is ready` : `Town Hall ${hall + 1}: raise your buildings ${toNextHall} more level${toNextHall === 1 ? "" : "s"} in total`}</p>
          <p className="mt-1 text-sm g-text-2">Tap a building to see what its next level needs. Levels come only from questions you solve.</p>
        </div>
        <nav aria-label="Citadel" className="grid grid-cols-5 gap-1 [&_.g-orb]:min-w-0 max-sm:[&_.g-orb-face]:h-12 max-sm:[&_.g-orb-face]:w-12 max-sm:[&_.g-orb]:text-[11px] lg:flex lg:gap-4">
          {orbs.map((o) => {
            const face = (<><span className="g-orb-face" style={{ ["--c" as string]: o.c }}><o.icon className="h-7 w-7 drop-shadow" strokeWidth={2.2} aria-hidden />{o.badge && <span className="g-orb-badge">{o.badge}</span>}</span>{o.label}</>);
            return o.href ? <Link key={o.key} href={o.href} className="g-orb">{face}</Link> : <button key={o.key} type="button" onClick={() => setSheet(o.sheet!)} className="g-orb cursor-pointer">{face}</button>;
          })}
        </nav>
      </div>

      <BuildingSheet b={pick} onClose={() => setPick(null)} />
      <LobbySheet open={sheet} onClose={() => setSheet(null)} challenges={<Tickets tickets={tickets} onFriends={() => setSheet("friends")} />} />
    </>
  );
}

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div>
      <div className="flex justify-between text-sm"><span className="g-text-2">{label}</span><b className="g-num">{value} / {max}</b></div>
      <div className="mt-1 h-3 overflow-hidden rounded-full bg-[var(--g-felt-deep)]"><div className="h-full rounded-full bg-[var(--g-brass)]" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function BuildingSheet({ b, onClose }: { b: BuildingState | null; onClose: () => void }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence>
      {b && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(10,6,2,0.6)] sm:items-center sm:p-6" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <motion.div role="dialog" aria-modal="true" aria-label={b.name} onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }} transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="w-full max-w-lg rounded-t-[26px] border-4 border-[var(--g-wood)] bg-[var(--g-surface)] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:rounded-[26px]">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="g-title text-2xl">{b.name}</p>
                <p className="g-text-2">{b.subject}{b.subjects.length > 1 ? ` (${b.subjects.join(", ")})` : ""}</p>
              </div>
              <span className="g-hud !pl-3 shrink-0">Level <b className="text-[var(--g-brass-hi)]">{b.level}</b>/{MAX_LEVEL}</span>
              <button type="button" onClick={onClose} aria-label="Close" className="g-orb !min-w-0" style={{ ["--c" as string]: "#c4412d" }}><span className="g-orb-face !h-10 !w-10"><X className="h-5 w-5" aria-hidden /></span></button>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--g-felt-deep)] p-3"><dt className="text-xs g-muted">Questions solved</dt><dd className="g-num text-2xl font-black">{b.attempted}</dd></div>
              <div className="rounded-xl bg-[var(--g-felt-deep)] p-3"><dt className="text-xs g-muted">Accuracy</dt><dd className="g-num text-2xl font-black">{b.attempted ? `${b.accuracy}%` : "–"}</dd></div>
            </dl>
            {b.next ? (
              <div className="mt-4 space-y-3">
                <p className="font-bold">To reach level {b.level + 1}</p>
                <Bar value={Math.min(b.attempted, b.next.attempted)} max={b.next.attempted} label="Questions attempted" />
                {b.next.accuracy > 0 && <Bar value={Math.min(b.accuracy, b.next.accuracy)} max={b.next.accuracy} label="Accuracy %" />}
              </div>
            ) : <p className="mt-4 font-bold text-[var(--g-brass-hi)]">Fully built. Keep it sharp.</p>}
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <Link href={`/battles/play?subject=${encodeURIComponent(b.subjects[0])}`} className="g-play !min-h-[52px] !text-lg">Train</Link>
              <Link href="/battles/play" className="g-btn-quiet justify-center">Attack a friend&apos;s {b.name}</Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--g-line)] bg-[linear-gradient(180deg,var(--g-wood),var(--g-wood-dark))] px-2 py-2.5">
      <dd className="g-num text-2xl font-black text-[var(--g-text)]">{value}</dd>
      <dt className="text-[11px] font-bold text-[var(--g-muted)]">{label}</dt>
    </div>
  );
}

/** Popups over the lobby (research: keep the previous screen visible behind, so the player never feels lost). */
function LobbySheet({ open, onClose, challenges }: { open: Sheet; onClose: () => void; challenges: ReactNode }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  const title = open === "daily" ? "Daily reward" : open === "clubs" ? "Your club" : open === "challenges" ? "Challenges for you" : "Friends";
  const body: ReactNode = open === "daily" ? <DailyReward /> : open === "clubs" ? <ClubPanel /> : open === "challenges" ? challenges : <FriendsPanel />;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center bg-[rgba(10,6,2,0.65)] p-0 sm:items-center sm:p-6" onClick={onClose}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
          <motion.div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { y: 40, scale: 0.96, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="no-scrollbar max-h-[85dvh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border-4 border-[var(--g-wood)] bg-[var(--g-felt-dark)] p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)] sm:rounded-[28px] sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <p className="g-title text-2xl">{title}</p>
              <button type="button" onClick={onClose} aria-label="Close" className="g-orb !min-w-0" style={{ ["--c" as string]: "#c4412d" }}>
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
    <div className="rounded-2xl border-2 border-dashed border-[rgba(246,242,232,0.35)] p-5 text-center">
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
