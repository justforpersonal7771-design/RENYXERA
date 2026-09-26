"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Mail, GraduationCap, Trophy, Clock, LogOut, Loader2, CalendarDays, MapPin, AtSign, IdCard } from "lucide-react";

/**
 * Compact, horizontal profile header: exactly as tall as the avatar, pinned above the
 * profile sections. Gradient glass with drifting glows, the avatar in a rotating brand
 * ring, a gliding shine on the name, staggered goal chips and a profile-completeness ring.
 */
export function ProfileHeader({
  name, username, email, bio, tier, avatarUri, targetYear, branchLabel, targetRank, dailyHours, location,
  daysLeft, completeness, signingOut, onSignOut, studentId,
}: {
  name: string; username: string; email: string | null | undefined; bio?: string; tier: string; avatarUri: string;
  targetYear: string; branchLabel: string; targetRank: string; dailyHours: string; location?: string;
  daysLeft: number | null; completeness: number; signingOut: boolean; onSignOut: () => void; studentId?: string | null;
}) {
  const reduce = useReducedMotion();
  const chips = [
    { icon: CalendarDays, text: daysLeft != null && daysLeft >= 0 ? `GATE ${targetYear} · ${daysLeft} days left` : `GATE ${targetYear}` },
    { icon: GraduationCap, text: branchLabel },
    ...(targetRank ? [{ icon: Trophy, text: `Target AIR ${targetRank}` }] : []),
    { icon: Clock, text: `${dailyHours || 0}h a day` },
    ...(location ? [{ icon: MapPin, text: location }] : []),
  ];
  const R = 22, C = 2 * Math.PI * R;

  return (
    <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_18px_50px_-20px_rgba(79,70,229,0.6)]">
      <motion.div aria-hidden="true" className="pointer-events-none absolute -top-20 right-24 w-56 h-56 rounded-full bg-cyan-300/25 blur-3xl"
        animate={reduce ? undefined : { x: [0, -40, 0], y: [0, 16, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/3 w-64 h-64 rounded-full bg-fuchsia-300/20 blur-3xl"
        animate={reduce ? undefined : { x: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative flex items-center gap-4">
        <div className="hero-avatar group/av relative w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0">
          <span className="hero-avatar-ring" aria-hidden="true" />
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/15 backdrop-blur-md shadow-xl transition-transform duration-300 group-hover/av:scale-[1.05]">
            {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
            <img src={avatarUri} alt="Your avatar" className="w-full h-full" width={96} height={96} />
            <span className="avatar-sheen hero-avatar-sheen" aria-hidden="true" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-[3px] border-violet-600" aria-hidden="true" />
        </div>

        {/* Left: big name, bio, goal chips */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="shine-text text-2xl sm:text-3xl xl:text-[2.1rem] font-extrabold tracking-tight leading-tight truncate">{name}</h1>
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> {tier}
            </span>
          </div>
          {/* On small screens the identity block below is hidden — keep the handle here. */}
          {username && <p className="lg:hidden text-xs font-semibold text-white/80 truncate">@{username}</p>}
          {bio && <p className="hidden md:block mt-0.5 text-[13px] text-white/80 truncate italic">&ldquo;{bio}&rdquo;</p>}
          <div className="hidden sm:flex mt-2.5 gap-1.5 overflow-hidden flex-wrap max-h-[26px]">
            {chips.map((c, i) => (
              <motion.span key={c.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }} whileHover={{ y: -2 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/15 backdrop-blur text-[11px] font-bold whitespace-nowrap transition-colors">
                <c.icon className="w-3.5 h-3.5" /> {c.text}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right: identity block — username, email, student ID */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="hidden lg:flex flex-col gap-1.5 shrink-0 min-w-0 max-w-[300px] rounded-2xl bg-black/10 border border-white/15 backdrop-blur px-3.5 py-2.5">
          {username && (
            <p className="flex items-center gap-2 text-xs min-w-0"><AtSign className="w-3.5 h-3.5 shrink-0 text-white/70" /><span className="font-semibold truncate">{username}</span></p>
          )}
          <p className="flex items-center gap-2 text-xs min-w-0"><Mail className="w-3.5 h-3.5 shrink-0 text-white/70" /><span className="truncate text-white/90">{email}</span></p>
          {studentId && (
            <p className="flex items-center gap-2 text-xs min-w-0" title="Your permanent student ID">
              <IdCard className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span className="font-mono font-semibold tracking-wide truncate select-all">{studentId}</span>
            </p>
          )}
        </motion.div>

        {/* Profile completeness */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0" title="Fill in your details to personalise your plan">
          <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90" aria-hidden="true">
            <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
            <motion.circle cx="28" cy="28" r={R} fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeDasharray={C}
              initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - completeness / 100) }} transition={{ duration: 1, ease: "easeOut" }} />
          </svg>
          <div className="leading-tight">
            <p className="text-lg font-extrabold font-num">{completeness}%</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/75">Profile</p>
          </div>
        </div>

        <motion.button whileTap={{ scale: 0.95 }} onClick={onSignOut} disabled={signingOut} aria-label="Sign out"
          className="group/so shrink-0 inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 border border-white/15 backdrop-blur transition-colors disabled:opacity-50 cursor-pointer">
          {signingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5 transition-transform group-hover/so:translate-x-0.5" />}
          <span className="hidden sm:inline">Sign out</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
