"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sparkles, Mail, GraduationCap, Trophy, Clock, LogOut, Loader2 } from "lucide-react";
import { TiltCard } from "@/components/ui/interactive";

/**
 * Profile header card: tilts toward the cursor in 3D with a soft light following it
 * (TiltCard + .spotlight-light), the avatar floats inside a rotating brand-gradient ring
 * with a sheen on hover, and the name carries a gliding shine (.shine-text).
 */
export function ProfileHero({
  name, username, email, tier, avatarUri, targetYear, branchLabel, targetRank, dailyHours, signingOut, onSignOut,
}: {
  name: string; username: string; email: string | null | undefined; tier: string; avatarUri: string;
  targetYear: string; branchLabel: string; targetRank: string; dailyHours: string;
  signingOut: boolean; onSignOut: () => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <TiltCard
        max={4}
        className="spotlight-light relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.6)]"
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-cyan-300/30 blur-3xl"
          animate={reduce ? undefined : { x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/3 w-80 h-80 rounded-full bg-fuchsia-300/25 blur-3xl"
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Avatar: floating, inside a rotating gradient ring, sheen on hover */}
          <motion.div
            className="hero-avatar group/av relative w-24 h-24 shrink-0"
            animate={reduce ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="hero-avatar-ring" aria-hidden="true" />
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white/15 backdrop-blur-md shadow-xl transition-transform duration-300 group-hover/av:scale-[1.04]">
              {/* eslint-disable-next-line @next/next/no-img-element -- data: URI */}
              <img src={avatarUri} alt="Your avatar" className="w-full h-full" width={160} height={160} />
              <span className="avatar-sheen hero-avatar-sheen" aria-hidden="true" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-[3px] border-violet-600 shadow" aria-hidden="true" />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="shine-text text-2xl sm:text-3xl font-extrabold tracking-tight truncate">{name}</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> {tier}
              </span>
            </div>
            {username && <p className="text-sm font-semibold text-white/80">@{username}</p>}
            <p className="flex items-center gap-1.5 text-sm text-white/75 mt-0.5 min-w-0">
              <Mail className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{email}</span>
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { icon: GraduationCap, text: `GATE ${targetYear || "—"} · ${branchLabel}`, show: true },
                { icon: Trophy, text: `Target AIR ${targetRank}`, show: !!targetRank },
                { icon: Clock, text: `${dailyHours || 0}h / day`, show: true },
              ].filter((c) => c.show).map((c, i) => (
                <motion.span
                  key={c.text}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  whileHover={{ y: -2 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 border border-white/15 backdrop-blur text-xs font-bold transition-colors"
                >
                  <c.icon className="w-3.5 h-3.5" /> {c.text}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => { e.stopPropagation(); onSignOut(); }}
            disabled={signingOut}
            className="group/so self-start sm:self-center flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white/15 hover:bg-white/25 border border-white/15 backdrop-blur transition-colors disabled:opacity-50 cursor-pointer"
          >
            {signingOut ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LogOut className="w-3.5 h-3.5 transition-transform group-hover/so:translate-x-0.5" />}
            Sign Out
          </motion.button>
        </div>
      </TiltCard>
    </motion.div>
  );
}
