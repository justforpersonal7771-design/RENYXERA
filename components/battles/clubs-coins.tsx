"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Coins, Copy, Crown, Flame, LogOut, Plus, Users } from "lucide-react";
import { useToastStore } from "@/store/use-toast-store";
import { SHOP } from "@/lib/coins/shop";

type CoinState = { balance: number; claimedToday: boolean; streak: number; daily: number; bonus: number };
type Member = { id: string; name: string; role: string; points: number; you: boolean };
type Club = { id: string; name: string; code: string; isOwner: boolean; members: Member[]; total: number; rank: number; clubs: number; max: number };

/** Daily reward: a 7-day track; today's coin pops when claimed, day 7 pays the streak bonus. */
export function DailyReward() {
  const [s, setS] = useState<CoinState | null>(null);
  const [off, setOff] = useState(false);
  const [busy, setBusy] = useState(false);
  const [pop, setPop] = useState<number | null>(null);
  useEffect(() => {
    void fetch("/api/coins", { cache: "no-store" }).then(async (r) => { if (r.ok) setS(await r.json()); else setOff(true); }).catch(() => setOff(true));
  }, []);
  if (off || !s) return null;
  const claim = async () => {
    setBusy(true);
    const r = await fetch("/api/coins", { method: "POST" }).catch(() => null);
    setBusy(false);
    if (!r?.ok) { useToastStore.getState().show("Couldn't claim right now. Try again.", "error"); return; }
    const j = (await r.json()) as CoinState & { added: number; bonusHit?: boolean };
    setS(j); setPop(j.added); window.dispatchEvent(new Event("renyxera:coins"));
    setTimeout(() => setPop(null), 1800);
  };
  const dayInWeek = s.claimedToday ? ((s.streak - 1) % 7) + 1 : (s.streak % 7) + 1;   // 1..7, today's slot
  return (
    <section className="card-pastel relative overflow-hidden p-5" data-tint="butter" aria-label="Daily reward">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface)]"><Coins className="h-6 w-6 text-amber-500" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-extrabold text-[var(--text-primary)]">Daily reward</p>
          <p className="text-sm text-[var(--text-secondary)]"><span className="font-bold tabular-nums text-[var(--text-primary)]">{s.balance}</span> coins · <Flame className="inline h-3.5 w-3.5 text-rose-500" aria-hidden /> {s.streak}-day streak</p>
        </div>
        <button type="button" onClick={() => void claim()} disabled={busy || s.claimedToday} className="btn-main disabled:opacity-60">{s.claimedToday ? "Come back tomorrow" : `Claim ${dayInWeek === 7 ? s.daily + s.bonus : s.daily} coins`}</button>
      </div>
      <ol className="mt-4 grid grid-cols-7 gap-1.5" aria-label="This week">
        {Array.from({ length: 7 }, (_, i) => {
          const d = i + 1, got = d < dayInWeek || (d === dayInWeek && s.claimedToday), today = d === dayInWeek;
          return (
            <li key={d} className={`rounded-xl border-2 py-2 text-center text-xs font-extrabold ${got ? "border-amber-400 bg-amber-400/25" : today ? "border-[var(--text-primary)] bg-[var(--surface)]" : "border-transparent bg-[var(--surface)]/60"} text-[var(--text-primary)]`}>
              <span className="block text-[10px] text-[var(--text-secondary)]">Day {d}</span>{d === 7 ? s.daily + s.bonus : s.daily}
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Battles pay coins too: win 20, draw 10, play 5.</p>
      <AnimatePresence>
        {pop !== null && (
          <motion.span initial={{ opacity: 0, y: 10, scale: 0.6 }} animate={{ opacity: 1, y: -18, scale: 1.15 }} exit={{ opacity: 0, y: -40 }} transition={{ type: "spring", stiffness: 300, damping: 16 }}
            className="pointer-events-none absolute right-8 top-6 rounded-full bg-amber-400 px-3 py-1 font-display text-lg font-extrabold text-[#1b1530] shadow-lg">+{pop}</motion.span>
        )}
      </AnimatePresence>
    </section>
  );
}

/** My club: create or join with a code, then the members ranked by this week's Arena points and the club's rank. */
export function ClubPanel() {
  const [club, setClub] = useState<Club | null | undefined>(undefined);
  const [off, setOff] = useState(false);
  const [name, setName] = useState(""), [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const r = await fetch("/api/clubs", { cache: "no-store" }).catch(() => null);
    if (!r?.ok) { setOff(true); return; }
    setClub(((await r.json()) as { club: Club | null }).club);
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- loads the club once after mount
  useEffect(() => { void load(); }, [load]);
  if (off || club === undefined) return null;
  const act = async (b: Record<string, string>) => {
    setBusy(true);
    const r = await fetch("/api/clubs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).catch(() => null);
    setBusy(false);
    const j = (await r?.json().catch(() => ({}))) as { club?: Club | null; error?: string };
    if (!r?.ok) { useToastStore.getState().show(j.error ?? "Something went wrong.", "error"); return; }
    setClub(j.club ?? null); setName(""); setCode("");
  };

  if (!club) return (
    <section className="card-pastel p-5" data-tint="peri" aria-label="Clubs">
      <p className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--text-primary)]"><Users className="h-5 w-5" aria-hidden /> Clubs</p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Team up with friends. Every battle point you win counts for your club on the weekly board.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <form onSubmit={(e) => { e.preventDefault(); if (name.trim().length >= 3) void act({ action: "create", name }); }} className="rounded-2xl bg-[var(--surface)] p-3">
          <label className="text-xs font-bold text-[var(--text-secondary)]" htmlFor="club-name">Start a club</label>
          <div className="mt-1.5 flex gap-2"><input id="club-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="Club name" className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none" />
            <button type="submit" disabled={busy || name.trim().length < 3} className="btn-main !px-3 disabled:opacity-50"><Plus className="h-4 w-4" />Create</button></div>
        </form>
        <form onSubmit={(e) => { e.preventDefault(); if (code.trim().length === 6) void act({ action: "join", code }); }} className="rounded-2xl bg-[var(--surface)] p-3">
          <label className="text-xs font-bold text-[var(--text-secondary)]" htmlFor="club-code">Join with a code</label>
          <div className="mt-1.5 flex gap-2"><input id="club-code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={6} placeholder="ABC123" className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 font-mono text-sm uppercase tracking-widest text-[var(--text-primary)] outline-none" />
            <button type="submit" disabled={busy || code.trim().length !== 6} className="btn-main !px-3 disabled:opacity-50">Join</button></div>
        </form>
      </div>
    </section>
  );

  return (
    <section className="card-pastel p-5" data-tint="peri" aria-label="Your club">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface)]"><Users className="h-6 w-6" aria-hidden /></span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg font-extrabold text-[var(--text-primary)]">{club.name}</p>
          <p className="text-sm text-[var(--text-secondary)]"><span className="font-bold tabular-nums text-[var(--text-primary)]">{club.total}</span> points this week · rank <span className="font-bold tabular-nums text-[var(--text-primary)]">#{club.rank}</span> of {club.clubs}</p>
        </div>
        <button type="button" onClick={() => { void navigator.clipboard.writeText(club.code).then(() => useToastStore.getState().show(`Code ${club.code} copied. Send it to a friend.`, "success")); }} className="pill-soft"><Copy className="h-4 w-4" /> {club.code}</button>
        <button type="button" onClick={() => { if (confirm("Leave this club?")) void act({ action: "leave" }); }} className="pill-soft" aria-label="Leave club"><LogOut className="h-4 w-4" /></button>
      </div>
      <ol className="mt-4 space-y-1.5">
        {club.members.map((m, i) => (
          <li key={m.id} className={`flex items-center gap-3 rounded-xl px-3 py-2 ${m.you ? "bg-[var(--surface)] ring-2 ring-[var(--tint-peri-ink)]" : "bg-[var(--surface)]/70"}`}>
            <span className="w-6 text-center font-display text-sm font-extrabold tabular-nums text-[var(--text-secondary)]">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--text-primary)]">{m.you ? "You" : m.name}{m.role === "owner" && <Crown className="ml-1.5 inline h-3.5 w-3.5 text-amber-500" aria-label="Owner" />}</span>
            <span className="text-sm font-extrabold tabular-nums text-[var(--text-primary)]">{m.points}</span>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">{club.members.length} of {club.max} members · the board resets every Monday (IST).</p>
    </section>
  );
}

/** Coin shop: Mentor token boosts and avatar frames, bought with coins. Frames can be worn or taken off. */
export function CoinShop() {
  const [coins, setCoins] = useState<number | null>(null);
  const [own, setOwn] = useState<{ owned: string[]; equipped: string | null } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const load = useCallback(async () => {
    const [c, s] = await Promise.all([fetch("/api/coins", { cache: "no-store" }).catch(() => null), fetch("/api/coins/shop", { cache: "no-store" }).catch(() => null)]);
    if (c?.ok) setCoins(((await c.json()) as CoinState).balance);
    if (s?.ok) setOwn(await s.json());
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- loads balance and owned items once after mount
  useEffect(() => { void load(); }, [load]);
  if (coins === null || !own) return null;
  const act = async (b: Record<string, unknown>, id: string) => {
    setBusy(id);
    const r = await fetch("/api/coins/shop", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }).catch(() => null);
    setBusy(null);
    const j = (await r?.json().catch(() => ({}))) as { error?: string; balance?: number; owned?: string[]; equipped?: string | null };
    if (!r?.ok) { useToastStore.getState().show(j.error ?? "Something went wrong.", "error"); return; }
    if (typeof j.balance === "number") setCoins(j.balance);
    if (j.owned) setOwn({ owned: j.owned, equipped: j.equipped ?? null });
    window.dispatchEvent(new Event("renyxera:frame")); window.dispatchEvent(new Event("renyxera:coins"));
    if (b.action === "buy") useToastStore.getState().show(SHOP.find((x) => x.id === id)?.kind === "mentor" ? "Mentor tokens added." : "Frame unlocked and equipped.", "success");
  };
  return (
    <section className="card-pastel p-5" data-tint="mint" aria-label="Coin shop">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--text-primary)]"><Coins className="h-5 w-5 text-amber-500" aria-hidden /> Coin shop</p>
        <span className="rounded-full bg-[var(--surface)] px-3 py-1 text-sm font-extrabold tabular-nums text-[var(--text-primary)]">{coins} coins</span>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {SHOP.map((it) => {
          const has = own.owned.includes(it.id), on = own.equipped === it.id, short = coins < it.cost;
          return (
            <li key={it.id} className="flex flex-col rounded-2xl bg-[var(--surface)] p-4">
              {it.kind === "frame"
                ? <span className="mx-auto grid h-14 w-14 place-items-center rounded-full p-[4px]" style={{ background: it.ring }}><span className="h-full w-full rounded-full bg-[var(--surface-secondary)]" /></span>
                : <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--tint-sky)] text-lg font-black text-[var(--tint-sky-ink)]">{Math.round((it.tokens ?? 0) / 1000)}K</span>}
              <p className="mt-2 text-center font-bold text-[var(--text-primary)]">{it.name}</p>
              <p className="mt-0.5 flex-1 text-center text-xs text-[var(--text-secondary)]">{it.blurb}</p>
              {it.kind === "frame" && has
                ? <button type="button" disabled={busy === it.id} onClick={() => void act({ action: "equip", item: on ? null : it.id }, it.id)} className="pill-soft mt-3 justify-center">{on ? "Take off" : "Wear"}</button>
                : <button type="button" disabled={busy === it.id || short} onClick={() => void act({ action: "buy", item: it.id }, it.id)} className="btn-main mt-3 justify-center disabled:opacity-50"><Coins className="h-4 w-4" /> {it.cost}</button>}
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-[var(--text-secondary)]">Coins can&apos;t be bought or cashed out; you earn them by studying and battling.</p>
    </section>
  );
}
