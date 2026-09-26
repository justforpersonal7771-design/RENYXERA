"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Mail, GraduationCap, Trophy, Clock, LogOut, Loader2, CalendarDays } from "lucide-react";
import { TiltCard } from "@/components/ui/interactive";

/**
 * Vertical profile card for the profile sidebar: tilts toward the cursor with a soft
 * following light (TiltCard + .spotlight-light), drifting glow blobs, the avatar floating
 * inside a rotating brand-gradient ring with a hover sheen, and a gliding shine on the
 * name (.shine-text). Goal chips stagger in; a countdown shows days to the exam.
 */
export function ProfileHero({
  name, username, email, tier, avatarUri, targetYear, branchLabel, targetRank, dailyHours, signingOut, onSignOut, daysLeft,
}: {
  name: string; username: string; email: string | null | undefined; tier: string; avatarUri: string;
  targetYear: string; branchLabel: string; targetRank: string; dailyHours: string;
  signingOut: boolean; onSignOut: () => void; daysLeft?: number | null;
}) {
  const reduce = useReducedMotion();
  const chips = [
    { icon: GraduationCap, text: branchLabel, show: true },
    { icon: Trophy, text: `Target AIR ${targetRank}`, show: !!targetRank },
    { icon: Clock, text: `${dailyHours || 0}h a day`, show: true },
  ].filter((c) => c.show);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <TiltCard
        max={5}
        className="spotlight-light relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.6)]"
      >
        <motion.div aria-hidden="true" className="pointer-events-none absolute -top-24 -right-20 w-64 h-64 rounded-full bg-cyan-300/30 blur-3xl"
          animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-10 w-72 h-72 rounded-full bg-fuchsia-300/25 blur-3xl"
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -20, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

        <div className="relative flex flex-col items-center text-center">
          <motion.div className="hero-avatar group/av relative w-28 h-28" animate={reduce ? undefined : { y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <span className="hero-avatar-ring" aria-hidden="true" />
            <div className="relative w-28 h-28 rounded-3xl overflow-hidden bg-white/15 backdrop-blur-md shadow-xl transition-transform duration-300 group-hover/av:scale-[1.05]">
              {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
              <img src={avatarUri} alt="Your avatar" className="w-full h-full" width={160} height={160} />
              <span className="avatar-sheen hero-avatar-sheen" aria-hidden="true" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-[3px] border-violet-600 shadow" aria-hidden="true" />
          </motion.div>

          <h1 className="shine-text mt-4 text-2xl font-extrabold tracking-tight leading-tight break-words max-w-full">{name}</h1>
          <div className="mt-1 flex items-center gap-2 flex-wrap justify-center">
            {username && <span className="text-sm font-semibold text-white/85">@{username}</span>}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> {tier}
            </span>
          </div>
          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-white/75 min-w-0 max-w-full">
            <Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{email}</span>
          </p>

          {/* Exam countdown */}
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
            className="mt-5 w-full rounded-2xl bg-white/10 border border-white/15 backdrop-blur px-4 py-3 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-white/85"><CalendarDays className="w-4 h-4" /> GATE {targetYear || "—"}</span>
            {daysLeft != null && daysLeft >= 0 ? (
              <span className="text-right leading-none">
                <span className="block text-2xl font-extrabold font-num">{daysLeft}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">days left</span>
              </span>
            ) : <span className="text-xs text-white/70">Set your target year</span>}
          </motion.div>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {chips.map((c, i) => (
              <motion.span key={c.text} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.07 }} whileHover={{ y: -2 }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/15 backdrop-blur text-[11px] font-bold transition-colors">
                <c.icon className="w-3.5 h-3.5" /> {c.text}
              </motion.span>
            ))}
          </div>

          <motion.button whileTap={{ scale: 0.95 }} onClick={(e) => { e.stopPropagation(); onSignOut(); }} disabled={signingOut}
            className="group/so mt-5 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 border border-white/15 backdrop-blur transition-colors disabled:opacity-50 cursor-pointer">
            {signingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5 transition-transform group-hover/so:translate-x-0.5" />}
            Sign out
          </motion.button>
        </div>
      </TiltCard>
    </motion.div>
  );
}
