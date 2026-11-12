"use client";

/**
 * Battles lobby, game-style (reference: 8 Ball Pool's main menu). One arena stage instead of a stack of cards:
 *  - a top HUD with your avatar, rating badge, coins and Arena points;
 *  - a left rail of round game buttons (Daily, Shop, Clubs, Friends, Ranks) that open panels as a slide-over;
 *  - the centre: game modes as glossy "tables" you swipe through, with one big PLAY button;
 *  - the right: challenges waiting for you as tickets.
 * The stage keeps its own night-arena look in light and dark mode, like a game screen.
 */
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CalendarClock, ChevronLeft, ChevronRight, Coins, Gift, History, Medal, ShoppingBag, Star, Swords, Users, UserPlus, X, Zap } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { generateAvatarDataUri } from "@/lib/avatar/generate-avatar";
import { isAvatarStyleId } from "@/lib/avatar/dicebear-styles";
import { shopItem } from "@/lib/coins/shop";
import { ClubPanel, CoinShop, DailyReward } from "@/components/battles/clubs-coins";
import { FriendsPanel } from "@/components/friends/friends-panel";
import { ArenaLeaderboard } from "@/components/friends/arena-leaderboard";

type Me = { rank: number; points: number; battles: number; wins: number; rating: number };
export type Invite = { id: string; title: string; ownerName: string; questions: number };
type Panel = "daily" | "shop" | "clubs" | "friends" | "ranks" | null;

const MODES = [
  { id: "live", title: "1 v 1 Live", line: "Challenge a friend now. Same questions, same countdown, live progress.", href: "/test-centre/build?challenge=1", cta: "PLAY", from: "#22c55e", to: "#0f766e", icon: Zap, reward: "Win +30 points · 20 coins" },
  { id: "later", title: "Play later", line: "Set a time. Your friend gets the challenge and plays when they're back.", href: "/test-centre/build?challenge=1", cta: "SCHEDULE", from: "#6366f1", to: "#4338ca", icon: CalendarClock, reward: "Win +30 points · 20 coins" },
  { id: "rematch", title: "Beat my score", line: "Pick a test you already finished and dare friends to beat it.", href: "/test-centre/history", cta: "CHOOSE TEST", from: "#f97316", to: "#be123c", icon: History, reward: "Every finish pays coins" },
] as const;

const tier = (r: number) => (r >= 1600 ? { name: "Diamond", c: "#67e8f9" } : r >= 1400 ? { name: "Gold", c: "#fbbf24" } : r >= 1200 ? { name: "Silver", c: "#cbd5e1" } : { name: "Bronze", c: "#d97706" });

export function BattleLobby({ invites }: { invites: Invite[] }) {
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const [me, setMe] = useState<Me | null>(null);
  const [coins, setCoins] = useState<{ balance: number; claimedToday: boolean } | null>(null);
  const [frame, setFrame] = useState<string | null>(null);
  const [mode, setMode] = useState(0);
  const [panel, setPanel] = useState<Panel>(null);

  useEffect(() => {
    let live = true;
    void fetch("/api/arena/leaderboard?scope=friends&period=all").then((r) => (r.ok ? r.json() : null)).then((j: { me?: Me } | null) => { if (live && j?.me) setMe(j.me); }).catch(() => {});
    const loadCoins = () => void fetch("/api/coins", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j) => { if (live && j) setCoins(j); }).catch(() => {});
    const loadFrame = () => void fetch("/api/coins/shop", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j: { equipped?: string | null } | null) => { if (live) setFrame(j?.equipped ? shopItem(j.equipped)?.ring ?? null : null); }).catch(() => {});
    loadCoins(); loadFrame();
    const on = () => { loadCoins(); loadFrame(); };
    window.addEventListener("renyxera:frame", on);
    return () => { live = false; window.removeEventListener("renyxera:frame", on); };
  }, []);
  // refresh coins when a panel closes (a claim or purchase may have changed them)
  useEffect(() => { if (panel === null) void fetch("/api/coins", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j) => j && setCoins(j)).catch(() => {}); }, [panel]);

  const style = profile && isAvatarStyleId(profile.avatar_style) ? profile.avatar_style : "adventurer";
  const avatar = generateAvatarDataUri(style, profile?.avatar_seed || user?.id || "x", { size: 96 });
  const name = profile?.display_name?.trim() || user?.email?.split("@")[0] || "You";
  const rating = me?.rating ?? 1000, t = tier(rating);
  const m = MODES[mode];

  const rail: { id: Exclude<Panel, null>; label: string; icon: typeof Gift; dot?: boolean; c: string }[] = [
    { id: "daily", label: "Daily", icon: Gift, dot: coins ? !coins.claimedToday : false, c: "#f59e0b" },
    { id: "shop", label: "Shop", icon: ShoppingBag, c: "#22c55e" },
    { id: "clubs", label: "Clubs", icon: Users, c: "#8b5cf6" },
    { id: "friends", label: "Friends", icon: UserPlus, c: "#0ea5e9" },
    { id: "ranks", label: "Ranks", icon: Medal, c: "#f43f5e" },
  ];

  return (
    <section aria-label="Battles lobby" className="arena-stage relative overflow-hidden rounded-[32px] p-4 text-white sm:p-6">
      {/* ---- HUD ---- */}
      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 items-center gap-3 rounded-full bg-black/35 py-1.5 pl-1.5 pr-4 ring-1 ring-white/10 backdrop-blur">
          <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full p-[3px]" style={{ background: frame ?? "linear-gradient(135deg,#ffffff55,#ffffff11)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
            <img src={avatar} alt="" className="h-full w-full rounded-full bg-[#1b1f3a]" width={96} height={96} />
          </span>
          <span className="min-w-0">
            <span className="block truncate font-display text-base font-extrabold leading-tight">{name}</span>
            <span className="flex items-center gap-1 text-xs font-bold" style={{ color: t.c }}><Star className="h-3.5 w-3.5 fill-current" aria-hidden /> {t.name} · {rating}</span>
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Hud icon={<Coins className="h-4 w-4 text-amber-300" />} value={coins ? coins.balance.toLocaleString("en-IN") : "–"} label="coins" onClick={() => setPanel("shop")} />
          <Hud icon={<Zap className="h-4 w-4 text-emerald-300" />} value={me ? String(me.points) : "–"} label="points" onClick={() => setPanel("ranks")} />
          <Hud icon={<Swords className="h-4 w-4 text-rose-300" />} value={me ? `${me.wins}/${me.battles}` : "–"} label="wins" />
        </div>
      </div>

      <div className="relative z-10 mt-5 grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_300px]">
        {/* ---- rail ---- */}
        <nav aria-label="Lobby" className="grid grid-cols-5 gap-2 lg:flex lg:flex-col lg:gap-3">
          {rail.map((r) => (
            <button key={r.id} type="button" onClick={() => setPanel(r.id)} className="arena-rail-btn group flex shrink-0 flex-col items-center gap-1 cursor-pointer rounded-2xl" aria-label={r.label}>
              <span className="relative grid h-12 w-12 place-items-center rounded-2xl sm:h-14 sm:w-14 shadow-[0_6px_0_rgba(0,0,0,.35),inset_0_2px_0_rgba(255,255,255,.35)] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0.5"
                style={{ background: `linear-gradient(180deg, ${r.c}, color-mix(in oklab, ${r.c} 60%, black))` }}>
                <r.icon className="h-6 w-6 drop-shadow" aria-hidden />
                {r.dot && <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#101433] bg-rose-500" />}
              </span>
              <span className="text-[11px] font-extrabold tracking-wide text-white/85">{r.label}</span>
            </button>
          ))}
        </nav>

        {/* ---- modes ---- */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={m.id} drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.25} onDragEnd={(_, i) => { if (i.offset.x < -70) setMode((x) => (x + 1) % MODES.length); else if (i.offset.x > 70) setMode((x) => (x + MODES.length - 1) % MODES.length); }} initial={{ opacity: 0, x: 40, scale: 0.97 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -40, scale: 0.97 }} transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative overflow-hidden rounded-[28px] p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,.7)] ring-1 ring-white/15 sm:p-8"
              style={{ background: `radial-gradient(120% 90% at 30% 0%, ${m.from}, ${m.to} 70%)` }}>
              <div aria-hidden className="absolute inset-3 rounded-[22px] border-2 border-dashed border-white/15" />
              <m.icon aria-hidden className="absolute -right-6 -bottom-6 h-48 w-48 rotate-[-12deg] text-white/10" />
              <p className="relative text-xs font-bold text-white/80">Mode {mode + 1} of {MODES.length} · swipe for more</p>
              <h2 className="relative mt-2 font-display text-4xl font-extrabold leading-none drop-shadow sm:text-5xl">{m.title}</h2>
              <p className="relative mt-3 max-w-md text-[15px] font-medium text-white/90">{m.line}</p>
              <p className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-black/25 px-3 py-1 text-xs font-extrabold"><Coins className="h-3.5 w-3.5 text-amber-300" /> {m.reward}</p>
              <div className="relative mt-6 flex items-center gap-3">
                <Link href={m.href} className="play-btn inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-display text-2xl font-black tracking-wide text-[#1b1530]">{m.cta}</Link>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-3 flex items-center justify-center gap-3">
            <button type="button" aria-label="Previous mode" onClick={() => setMode((x) => (x + MODES.length - 1) % MODES.length)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20"><ChevronLeft className="h-5 w-5" /></button>
            {MODES.map((x, i) => <button key={x.id} type="button" aria-label={x.title} onClick={() => setMode(i)} className={`h-2.5 rounded-full transition-all ${i === mode ? "w-8 bg-white" : "w-2.5 bg-white/35"}`} />)}
            <button type="button" aria-label="Next mode" onClick={() => setMode((x) => (x + 1) % MODES.length)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-white/20"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>

        {/* ---- invites ---- */}
        <aside aria-label="Challenges for you" className="self-start rounded-[24px] bg-black/30 p-4 ring-1 ring-white/10 backdrop-blur">
          <p className="flex items-center gap-2 font-display text-lg font-extrabold"><Swords className="h-5 w-5 text-rose-300" /> Challenges for you</p>
          {invites.length === 0 ? (
            <div className="mt-3"><p className="text-sm text-white/70">No one has challenged you yet. Add friends, then send the first challenge.</p><button type="button" onClick={() => setPanel("friends")} className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-sm font-bold ring-1 ring-white/15 hover:bg-white/20"><UserPlus className="h-4 w-4" /> Add friends</button></div>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {invites.slice(0, 5).map((v) => (
                <li key={v.id} className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-3 text-[#1b1530] shadow-[0_4px_0_rgba(0,0,0,.3)]">
                  <span aria-hidden className="absolute inset-y-0 left-12 border-l-2 border-dashed border-[#1b1530]/25" />
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1b1530] text-xs font-black text-amber-300">{v.ownerName.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase()}</span>
                  <span className="min-w-0 flex-1 pl-2"><span className="block truncate text-sm font-extrabold">{v.ownerName}</span><span className="block truncate text-xs font-semibold opacity-80">{v.title} · {v.questions} Qs</span></span>
                  <Link href={`/challenge/${v.id}`} className="rounded-xl bg-[#1b1530] px-3 py-1.5 text-xs font-black text-white">PLAY</Link>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {/* ---- panels ---- */}
      <AnimatePresence>
        {panel && (
          <motion.div className="fixed inset-0 z-[480] flex justify-end bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPanel(null)}>
            <motion.div role="dialog" aria-label={rail.find((r) => r.id === panel)?.label} onClick={(e) => e.stopPropagation()}
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="no-scrollbar h-full w-full max-w-xl overflow-y-auto bg-[var(--background)] p-4 text-[var(--text-primary)] sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-display text-2xl font-extrabold">{rail.find((r) => r.id === panel)?.label}</p>
                <button type="button" onClick={() => setPanel(null)} aria-label="Close" className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface-secondary)]"><X className="h-5 w-5" /></button>
              </div>
              <PanelBody panel={panel} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function PanelBody({ panel }: { panel: Exclude<Panel, null> }): ReactNode {
  if (panel === "daily") return <DailyReward />;
  if (panel === "shop") return <CoinShop />;
  if (panel === "clubs") return <ClubPanel />;
  if (panel === "friends") return <FriendsPanel />;
  return <ArenaLeaderboard />;
}

function Hud({ icon, value, label, onClick }: { icon: ReactNode; value: string; label: string; onClick?: () => void }) {
  const C = onClick ? "button" : "span";
  return (
    <C type={onClick ? "button" : undefined} onClick={onClick} aria-label={`${value} ${label}`}
      className={`inline-flex items-center gap-1.5 rounded-full bg-black/35 px-3 py-2 text-sm font-extrabold tabular-nums ring-1 ring-white/10 backdrop-blur ${onClick ? "cursor-pointer hover:bg-black/50" : ""}`}>
      {icon}{value}
    </C>
  );
}
