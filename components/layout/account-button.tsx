"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { LogIn, LayoutGrid, IdCard, Target, SlidersHorizontal, ShieldCheck, Laptop, HardDrive, Download, LogOut, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { generateAvatarDataUri } from "@/lib/avatar/generate-avatar";
import { isAvatarStyleId } from "@/lib/avatar/dicebear-styles";
import { SIGNED_OUT_FLAG } from "@/lib/utils";

const ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid, tint: "from-indigo-500 to-violet-600" },
  { id: "personal", label: "Personal info", icon: IdCard, tint: "from-fuchsia-500 to-pink-600" },
  { id: "goals", label: "Exam goals", icon: Target, tint: "from-cyan-500 to-sky-600" },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal, tint: "from-violet-500 to-purple-600" },
  { id: "security", label: "Account & security", icon: ShieldCheck, tint: "from-emerald-500 to-teal-600" },
  { id: "devices", label: "Devices", icon: Laptop, tint: "from-sky-500 to-blue-600" },
  { id: "data", label: "Data & storage", icon: HardDrive, tint: "from-amber-500 to-orange-600" },
];

/**
 * Topbar account entry. Signed out: "Sign In" (opens the auth modal in place).
 * Signed in: the avatar (brand ring, sheen, synced dot — .avatar-fx) with a quick-access
 * menu on hover/click/focus: mini profile card, every profile section as an icon row
 * (smooth zoom-and-slide on hover, a highlight gliding between rows), Downloads and
 * Sign out. Portaled so the navbar's rounded cluster can't clip it.
 */
export function AccountButton() {
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const loading = useAuthStore((s) => s.loading);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const pathname = usePathname();
  const router = useRouter();

  const btnRef = useRef<HTMLAnchorElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const place = useCallback(() => {
    const r = btnRef.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 10, right: Math.max(8, window.innerWidth - r.right - 4) });
  }, []);
  const show = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    place();
    setOpen(true);
  }, [place]);
  const hideSoon = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => { setOpen(false); setHover(null); }, 180);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const onResize = () => place();
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("resize", onResize); };
  }, [open, place]);
  useEffect(() => setOpen(false), [pathname]);

  if (loading) return <div className="w-8 h-8 rounded-lg bg-[var(--surface-secondary)] animate-pulse" aria-hidden="true" />;

  if (!user) {
    return (
      <button type="button" onClick={() => openAuthModal("login")} aria-label="Sign In"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] transition-colors">
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline lg:hidden 2xl:inline">Sign In</span>
      </button>
    );
  }

  const style = profile && isAvatarStyleId(profile.avatar_style) ? profile.avatar_style : "adventurer";
  const seed = profile?.avatar_seed || user.id;
  const avatarUri = generateAvatarDataUri(style, seed, { size: 64 });
  const name = profile?.display_name?.trim() || user.email?.split("@")[0] || "You";

  const goSection = (id: string) => (e: React.MouseEvent) => {
    setOpen(false);
    // Already on /profile: a hash change switches the section (the page listens for it).
    if (pathname === "/profile") { e.preventDefault(); window.location.hash = id; }
  };
  const signOut = async () => {
    setOpen(false);
    sessionStorage.setItem(SIGNED_OUT_FLAG, "1");
    const { createClient } = await import("@/lib/supabase/client");
    await createClient().auth.signOut().catch(() => {});
  };

  return (
    <>
      <Link ref={btnRef} href="/profile" aria-label={`${name} — profile and quick access`} aria-haspopup="menu" aria-expanded={open}
        onMouseEnter={show} onMouseLeave={hideSoon} onFocus={show} onBlur={hideSoon}
        onClick={(e) => { if (window.matchMedia("(hover: none)").matches && !open) { e.preventDefault(); show(); } }}
        className="avatar-fx group relative flex items-center rounded-xl outline-none shrink-0">
        <span className="relative block w-8 h-8">
          <span className="avatar-ring" aria-hidden="true" />
          <span className="relative block w-8 h-8 rounded-[9px] overflow-hidden border border-[var(--border)] bg-[var(--surface-secondary)] transition-[filter,transform] duration-300 group-hover:saturate-150 group-hover:brightness-110 group-hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
            <img src={avatarUri} alt="Your avatar" className="w-full h-full" width={64} height={64} />
            <span className="avatar-sheen" aria-hidden="true" />
          </span>
          <span className="avatar-dot absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[var(--surface)]" aria-hidden="true" />
        </span>
      </Link>

      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && pos && (
            <motion.div role="menu" aria-label="Profile quick access" onMouseEnter={show} onMouseLeave={hideSoon}
              initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 460, damping: 32 }}
              style={{ position: "fixed", top: pos.top, right: pos.right, transformOrigin: "top right" }}
              className="nav-cluster z-[450] w-72 rounded-2xl p-2 shadow-[0_24px_60px_-18px_rgba(76,29,149,0.45)]">
              {/* Mini profile */}
              <Link href="/profile" onClick={goSection("overview")} className="group relative flex items-center gap-3 rounded-xl p-2.5 mb-1 overflow-hidden">
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 via-violet-600/10 to-fuchsia-600/10 opacity-80" />
                <span className="relative w-11 h-11 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface-secondary)] shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                  {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
                  <img src={avatarUri} alt="" className="w-full h-full" width={64} height={64} />
                </span>
                <span className="relative min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[var(--text-primary)] truncate">{name}</span>
                  <span className="block text-[11px] text-[var(--text-muted)] truncate">{profile?.username ? `@${profile.username}` : user.email}</span>
                  {profile?.student_id && <span className="mt-0.5 inline-block font-mono text-[10px] font-semibold text-violet-600 dark:text-violet-300">{profile.student_id}</span>}
                </span>
              </Link>

              <div className="relative" onMouseLeave={() => setHover(null)}>
                {ITEMS.map((it, i) => (
                  <motion.div key={it.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.02 * i }}>
                    <Link href={`/profile#${it.id}`} role="menuitem" onClick={goSection(it.id)} onMouseEnter={() => setHover(it.id)} onFocus={() => setHover(it.id)}
                      className="group relative flex items-center gap-3 rounded-xl px-2.5 py-2 outline-none">
                      {hover === it.id && <motion.span layoutId="acct-menu-hover" transition={{ type: "spring", stiffness: 500, damping: 36 }} className="absolute inset-0 rounded-xl bg-[var(--surface-secondary)]" />}
                      <motion.span animate={hover === it.id ? { scale: 1.12, x: 3 } : { scale: 1, x: 0 }} transition={{ type: "spring", stiffness: 420, damping: 22 }}
                        className={`relative w-8 h-8 rounded-lg bg-gradient-to-br ${it.tint} text-white flex items-center justify-center shadow-md`}>
                        <it.icon className="w-4 h-4" />
                      </motion.span>
                      <motion.span animate={hover === it.id ? { x: 5 } : { x: 0 }} transition={{ type: "spring", stiffness: 420, damping: 26 }}
                        className="relative flex-1 text-sm font-semibold text-[var(--text-primary)]">{it.label}</motion.span>
                      <ChevronRight className={`relative w-4 h-4 text-[var(--text-muted)] transition-all duration-300 ${hover === it.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-1 pt-1 border-t border-[var(--border-subtle)] grid grid-cols-2 gap-1">
                <button type="button" onClick={() => { setOpen(false); router.push("/downloads"); }}
                  className="group flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-all hover:scale-[1.03] cursor-pointer">
                  <Download className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" /> Downloads
                </button>
                <button type="button" onClick={signOut}
                  className="group flex items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-all hover:scale-[1.03] cursor-pointer">
                  <LogOut className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" /> Sign out
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
