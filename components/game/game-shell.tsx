"use client";

/**
 * Battles game shell (R31A, second pass after the owner's 14 Nov review: "the side menu doesn't feel like a game").
 * No website navigation. A game HUD on top (back to lobby, your avatar and rating badge, coins, exit) and a game dock
 * at the bottom (Lobby, Arena, PLAY raised in the centre, Friends, Shop), on phones and desktops alike.
 * The site navbar, dock, banners and challenge pop-ups are not drawn on /battles (components/layout/client-layout.tsx).
 * "Exit to study" returns to the last study screen this tab visited (sessionStorage), or Home.
 */
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft, Coins, DoorOpen, Home, Play, Plus, ShoppingBag, Trophy, Users } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useArenaMe, usePlayer } from "@/components/game/use-arena";

const DOCK = [
  { href: "/battles", label: "Lobby", icon: Home },
  { href: "/battles/arena", label: "Arena", icon: Trophy },
  { href: "/battles/play", label: "Play", icon: Play },
  { href: "/battles/social", label: "Friends", icon: Users },
  { href: "/battles/shop", label: "Shop", icon: ShoppingBag },
] as const;

const isOn = (path: string, href: string) => (href === "/battles" ? path === "/battles" : path.startsWith(href));

export function useStudyExit() {
  const router = useRouter();
  return () => {
    let to = "/";
    try { to = sessionStorage.getItem("renyxera_study_path") || "/"; } catch { /* storage off */ }
    router.push(to);
  };
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
  return (
    <header className="relative z-30 flex shrink-0 items-center gap-2 px-3 pt-3 sm:gap-3 sm:px-6 sm:pt-4">
      {!inLobby && (
        <Link href="/battles" aria-label="Back to the lobby" className="g-orb !min-w-0" style={{ ["--c" as string]: "#3b3f8f" }}>
          <span className="g-orb-face !h-11 !w-11 !rounded-2xl"><ChevronLeft className="h-6 w-6" aria-hidden /></span>
        </Link>
      )}
      {user ? (
        <Link href="/battles/me" className="g-hud min-w-0 !pr-4" aria-label="Your player card">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full p-[2px]" style={{ background: p.ring ?? "var(--g-signal)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URI avatar */}
            <img src={p.avatar} alt="" width={64} height={64} className="h-full w-full rounded-full bg-[var(--g-surface-2)]" />
          </span>
          <span className="min-w-0 truncate text-sm">{p.name}</span>
          <span className="g-hex grid h-7 min-w-[3.25rem] place-items-center bg-[var(--g-royal)] px-2 text-xs text-white" aria-label={`Rating ${data?.me.rating ?? ""}`}>{data?.me.rating ?? "…"}</span>
        </Link>
      ) : (
        <span className="font-brand text-lg text-[var(--g-text)]">RENYXERA</span>
      )}
      <span className="flex-1" />
      {coins !== null && (
        <Link href="/battles/shop" className="g-hud" aria-label={`${coins} coins, open the shop`}>
          <span className="g-hud-ico bg-[var(--g-amber)] text-[var(--g-on-amber)]"><Coins className="h-4 w-4" aria-hidden /></span>
          {coins.toLocaleString("en-IN")}
          <Plus className="ml-0.5 h-4 w-4 text-[var(--g-mint)]" aria-hidden />
        </Link>
      )}
      {data && (
        <span className="g-hud hidden sm:inline-flex" aria-label={`${data.me.points} Arena points this week`}>
          <span className="g-hud-ico bg-[var(--g-signal)] text-[var(--g-deep)]"><Trophy className="h-4 w-4" aria-hidden /></span>
          {data.me.points} <span className="text-xs font-bold text-[var(--g-muted)]">pts</span>
        </span>
      )}
      <button type="button" onClick={exit} className="g-orb !min-w-0" style={{ ["--c" as string]: "#4a4f78" }} aria-label="Exit to study">
        <span className="g-orb-face !h-11 !w-11 !rounded-2xl"><DoorOpen className="h-5 w-5" aria-hidden /></span>
      </button>
    </header>
  );
}

function Dock() {
  const path = usePathname() ?? "/battles";
  return (
    <nav aria-label="Battles" className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <ul className="pointer-events-auto flex w-full max-w-xl items-end justify-between rounded-[26px] border border-[rgba(169,154,247,0.22)] bg-[rgba(10,12,31,0.88)] px-2 pb-1.5 pt-1 shadow-[0_-10px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md">
        {DOCK.map((n) => {
          const on = isOn(path, n.href);
          if (n.href === "/battles/play") return (
            <li key={n.href} className="flex-1">
              <Link href={n.href} aria-current={on ? "page" : undefined} className="flex min-h-[56px] flex-col items-center justify-end gap-1 pt-2 text-xs font-extrabold text-[var(--g-amber)]">
                <span className="g-play !min-h-0 !h-10 !w-12 !rounded-xl !p-0 !text-base"><Play className="h-5 w-5" fill="currentColor" aria-hidden /></span>
                Play
              </Link>
            </li>
          );
          return (
            <li key={n.href} className="flex-1">
              <Link href={n.href} aria-current={on ? "page" : undefined}
                className={`flex min-h-[56px] flex-col items-center justify-end gap-1 rounded-2xl pt-2 text-xs font-extrabold transition-colors ${on ? "text-[var(--g-text)]" : "text-[var(--g-muted)] hover:text-[var(--g-text)]"}`}>
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${on ? "bg-[var(--g-signal)] text-[var(--g-deep)] shadow-[0_0_18px_rgba(34,211,238,0.45)]" : ""}`}><n.icon className="h-5 w-5" strokeWidth={2.2} aria-hidden /></span>
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function GameShell({ children }: { children: ReactNode }) {
  return (
    <div className="game-world g-ground relative flex h-dvh w-full flex-col overflow-hidden">
      {/* arena light from above, shared by every game screen */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(70%_100%_at_50%_0%,rgba(81,70,200,0.35),transparent_70%)]" />
      <div aria-hidden className="g-veil fixed inset-0 z-[90] grid place-items-center bg-[var(--g-deep)]">
        <span className="font-brand text-3xl text-[var(--g-text)]">RENYXERA</span>
      </div>
      <Hud />
      <main id="game-scroll" className="g-enter no-scrollbar relative z-10 min-h-0 flex-1 overflow-y-auto px-3 pb-32 pt-4 sm:px-6 lg:px-10">
        {children}
      </main>
      <Dock />
    </div>
  );
}
