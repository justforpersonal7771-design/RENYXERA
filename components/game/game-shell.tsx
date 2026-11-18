"use client";

/**
 * Battles game shell (R31A, second pass after the owner's 14 Nov review: "the side menu doesn't feel like a game").
 * No website navigation. A game HUD on top (back to lobby, your avatar and rating badge, coins, exit) and a game dock
 * at the bottom (Lobby, Arena, PLAY raised in the centre, Friends, Shop), on phones and desktops alike.
 * The site navbar, dock, banners and challenge pop-ups are not drawn on /battles (components/layout/client-layout.tsx).
 * "Exit to study" returns to the last study screen this tab visited (sessionStorage), or Home.
 * 18 Nov (GAME-DESIGN-MERGED.md): one menu (Citadel, Friends, Attack, Clan, Leagues); sound toggle and Settings in the
 * HUD; leaving closes the doors (480 ms) before the app takes over.
 */
import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Castle, ChevronLeft, Coins, DoorOpen, Plus, Settings, Swords, Trophy, Users, UsersRound, Volume2, VolumeX } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useArenaMe, usePlayer } from "@/components/game/use-arena";
import { GameSettingsPanel } from "@/components/game/settings-panel";
import { initGameAudio, music, sfx, useGameSettings } from "@/lib/game/sound";

const DOCK = [
  { href: "/battles", label: "Citadel", icon: Castle },
  { href: "/battles/social", label: "Friends", icon: Users },
  { href: "/battles/play", label: "Attack", icon: Swords },
  { href: "/battles/clubs", label: "Clan", icon: UsersRound },
  { href: "/battles/arena", label: "Leagues", icon: Trophy },
] as const;

const isOn = (path: string, href: string) => (href === "/battles" ? path === "/battles" : path.startsWith(href));

/** Leave the game: the doors close first (the shell listens for this event), then the study app takes over. */
export function useStudyExit() {
  return () => window.dispatchEvent(new Event("renyxera:game-exit"));
}

function ExitDoors() {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const go = () => {
      if (closing) return;
      setClosing(true);
      sfx("door-close");
      music.stop();
      let to = "/";
      try { to = sessionStorage.getItem("renyxera_study_path") || "/"; } catch { /* storage off */ }
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches || useGameSettings.getState().reducedMotion;
      setTimeout(() => router.push(to), reduce ? 220 : 620);
    };
    window.addEventListener("renyxera:game-exit", go);
    return () => window.removeEventListener("renyxera:game-exit", go);
  }, [closing, router]);
  if (!closing) return null;
  return createPortal(<><div aria-hidden className="g-gate g-gate-close"><div className="g-gate-door" /><div className="g-gate-door" /></div><div className="g-gate-close-mark" role="status"><span>Back to study</span></div></>, document.getElementById("game-root") ?? document.body);
}

/** Sound on or off in one tap (browsers need a tap before any sound, so this is also what starts the audio). */
function SoundToggle() {
  const on = useGameSettings((s) => s.sound);
  const set = useGameSettings((s) => s.set);
  return (
    <button type="button" onClick={() => { set({ sound: !on }); if (!on) setTimeout(() => sfx("focus"), 30); }} className="g-orb !min-w-0 shrink-0" style={{ ["--c" as string]: "#6b3f22" }} aria-pressed={on} aria-label={on ? "Sound on. Turn it off" : "Sound off. Turn it on"}>
      <span className="g-orb-face !h-11 !w-11 !rounded-2xl">{on ? <Volume2 className="h-5 w-5" aria-hidden /> : <VolumeX className="h-5 w-5 opacity-80" aria-hidden />}</span>
    </button>
  );
}

/** Coins in the HUD: refreshed on every screen change and whenever a panel says coins moved. */
function useCoins(): number | null {
  const user = useAuthStore((s) => s.user);
  const path = usePathname();
  const [coins, setCoins] = useState<number | null>(null);
  useEffect(() => {
    if (!user) return;
    let live = true;
    const load = () => void fetch("/api/coins", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j: { balance?: number } | null) => { if (live && j && typeof j.balance === "number") setCoins(j.balance); }).catch(() => {});
    load();
    window.addEventListener("renyxera:coins", load);
    return () => { live = false; window.removeEventListener("renyxera:coins", load); };
  }, [user, path]);
  return user ? coins : null;
}

function Hud() {
  const path = usePathname() ?? "/battles";
  const user = useAuthStore((s) => s.user);
  const exit = useStudyExit();
  const coins = useCoins();
  const p = usePlayer();
  const { data } = useArenaMe();
  const inLobby = path === "/battles";
  const [settings, setSettings] = useState(false);
  return (
    <header className="relative z-30 flex shrink-0 items-center gap-1.5 px-3 pt-3 sm:gap-3 sm:px-6 sm:pt-4">
      {!inLobby && (
        <Link href="/battles" aria-label="Back to the lobby" className="g-orb !min-w-0 shrink-0" style={{ ["--c" as string]: "#6b3f22" }}>
          <span className="g-orb-face !h-11 !w-11 !rounded-2xl"><ChevronLeft className="h-6 w-6" aria-hidden /></span>
        </Link>
      )}
      {user ? (
        <Link href="/battles/me" className="g-hud min-w-0 !pr-4" aria-label="Your player card">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full p-[2px]" style={{ background: p.ring ?? "var(--g-signal)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URI avatar */}
            <img src={p.avatar} alt="" width={64} height={64} className="h-full w-full rounded-full bg-[var(--g-surface-2)]" />
          </span>
          <span className="hidden min-w-0 truncate text-sm sm:inline">{p.name}</span>
          <span className="g-hex grid h-7 min-w-[3.25rem] place-items-center bg-[var(--g-felt-deep)] px-2 font-[family-name:var(--font-chakra)] text-sm text-[var(--g-brass-hi)]" aria-label={`Rating ${data?.me.rating ?? ""}`}>{data?.me.rating ?? "…"}</span>
        </Link>
      ) : (
        <span className="font-brand text-lg text-[var(--g-text)]">RENYXERA</span>
      )}
      <span className="flex-1" />
      {coins !== null && (
        <Link href="/battles/shop" className="g-hud shrink-0" aria-label={`${coins} coins, open the shop`}>
          <span className="g-hud-ico bg-[var(--g-amber)] text-[var(--g-on-amber)]"><Coins className="h-4 w-4" aria-hidden /></span>
          {coins.toLocaleString("en-IN")}
          <Plus className="ml-0.5 h-4 w-4 text-[var(--g-mint)]" aria-hidden />
        </Link>
      )}
      {data && (
        <span className="g-hud hidden sm:inline-flex" aria-label={`${data.me.points} Arena points this week`}>
          <span className="g-hud-ico bg-[var(--g-chalk)] text-[var(--g-ink)]"><Trophy className="h-4 w-4" aria-hidden /></span>
          {data.me.points} <span className="text-xs font-bold text-[var(--g-muted)]">pts</span>
        </span>
      )}
      <SoundToggle />
      <button type="button" onClick={() => { sfx("tap"); setSettings(true); }} className="g-orb !min-w-0 shrink-0" style={{ ["--c" as string]: "#6b3f22" }} aria-label="Game settings">
        <span className="g-orb-face !h-11 !w-11 !rounded-2xl"><Settings className="h-5 w-5" aria-hidden /></span>
      </button>
      <button type="button" onClick={exit} className="g-orb !min-w-0 shrink-0" style={{ ["--c" as string]: "#6b3f22" }} aria-label="Exit to study">
        <span className="g-orb-face !h-11 !w-11 !rounded-2xl"><DoorOpen className="h-5 w-5" aria-hidden /></span>
      </button>
      <GamePortal><GameSettingsPanel open={settings} onClose={() => setSettings(false)} /></GamePortal>
    </header>
  );
}

function Dock() {
  const path = usePathname() ?? "/battles";
  return (
    <nav aria-label="Battles" className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <ul className="pointer-events-auto flex w-full max-w-xl items-end justify-between rounded-[22px] bg-[linear-gradient(180deg,var(--g-wood-hi),var(--g-wood)_40%,var(--g-wood-dark))] px-2 pb-1.5 pt-1 shadow-[inset_0_1px_0_rgba(255,220,170,0.35),0_-6px_24px_-8px_rgba(0,0,0,0.7)]">
        {DOCK.map((n) => {
          const on = isOn(path, n.href);
          if (n.href === "/battles/play") return (
            <li key={n.href} className="flex-1">
              <Link href={n.href} aria-current={on ? "page" : undefined} className="flex min-h-[56px] flex-col items-center justify-end gap-1 pt-2 text-xs font-extrabold text-[var(--g-amber)]">
                <span className="g-play !min-h-0 !h-10 !w-12 !rounded-xl !p-0 !text-base"><Swords className="h-5 w-5" aria-hidden /></span>
                Attack
              </Link>
            </li>
          );
          return (
            <li key={n.href} className="flex-1">
              <Link href={n.href} aria-current={on ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-end gap-1 rounded-2xl pt-2 text-xs font-extrabold transition-colors ${on ? "text-[var(--g-chalk)]" : "text-[#e8cfae] hover:text-[var(--g-chalk)]"}`}>
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${on ? "bg-[var(--g-chalk)] text-[var(--g-ink)] shadow-[0_2px_0_rgba(0,0,0,0.35)]" : ""}`}><n.icon className="h-5 w-5" strokeWidth={2.2} aria-hidden /></span>
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Sound settings come from this device; the home drone plays only while sound and music are on. */
function useGameAudio() {
  const sound = useGameSettings((s) => s.sound);
  const vol = useGameSettings((s) => s.music);
  const low = useGameSettings((s) => s.lowPower);
  useEffect(() => { initGameAudio(); }, []);
  useEffect(() => {
    if (sound && vol > 0 && !low) music.start(); else music.stop();
    const vis = () => { if (document.hidden) music.stop(); else if (useGameSettings.getState().sound && !useGameSettings.getState().lowPower) music.start(); };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [sound, vol, low]);
  useEffect(() => () => music.stop(), []);
}

/** Overlays (rounds, sheets, settings) render at the game root, above the HUD and dock, inside the game's colours. */
export function GamePortal({ children }: { children: ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the root exists only after mount
  useEffect(() => setEl(document.getElementById("game-root")), []);
  return el ? createPortal(children, el) : null;
}

export function GameShell({ children }: { children: ReactNode }) {
  useGameAudio();
  const reduced = useGameSettings((s) => s.reducedMotion);
  return (
    <div id="game-root" className={`game-world g-ground relative flex h-dvh w-full flex-col overflow-hidden ${reduced ? "g-reduced" : ""}`}>
      {/* arena light from above, shared by every game screen */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(60%_90%_at_50%_0%,rgba(255,200,130,0.14),transparent_70%)]" />
      <div aria-hidden className="g-gate"><div className="g-gate-door" /><div className="g-gate-door" /></div>
      <div aria-hidden className="g-gate-mark"><span>RENYXERA</span></div>
      <Hud />
      <main id="game-scroll" className="g-enter no-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-3 pb-32 pt-4 sm:px-6 lg:px-10">
        {children}
      </main>
      <Dock />
      <ExitDoors />
    </div>
  );
}
