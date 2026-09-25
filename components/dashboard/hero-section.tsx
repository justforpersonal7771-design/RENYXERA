"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { Sparkles, Flame, CheckCircle2, TrendingUp, Trophy, Compass, ArrowRight, BrainCircuit } from "lucide-react";
import { CountUp, RadialGauge, TiltCard, InfoTip } from "@/components/ui/interactive";

interface HeroSectionProps {
  streak: number;
  solved: number;
  accuracy: number;
  onNewExam: () => void;
}

const RANKS = [
  { name: "Scholar Novice", min: 0 },
  { name: "Advanced Scholar", min: 51 },
  { name: "Master Scholar", min: 151 },
  { name: "Grandmaster Scholar", min: 301 },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Burning the midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function HeroSection({ streak, solved, accuracy, onNewExam }: HeroSectionProps) {
  const router = useRouter();
  const reduce = useReducedMotion();

  // Rank ladder: current rank, next rank and progress toward it (same thresholds
  // as before: >50 Advanced, >150 Master, >300 Grandmaster).
  const rank = useMemo(() => {
    let i = 0;
    for (let k = 0; k < RANKS.length; k++) if (solved >= RANKS[k].min) i = k;
    const next = RANKS[i + 1];
    const pct = next ? ((solved - RANKS[i].min) / (next.min - RANKS[i].min)) * 100 : 100;
    return { name: RANKS[i].name, next, pct, remaining: next ? next.min - solved : 0 };
  }, [solved]);

  // Readiness: accuracy weight (75%) + questions solved weight (25%, maxes at 100 solved).
  const estimatedReadiness = Math.round(Math.min(solved / 4, 25) + accuracy * 0.75);

  // Cursor-following light across the whole banner.
  const mx = useSpring(useMotionValue(70), { stiffness: 120, damping: 20 });
  const my = useSpring(useMotionValue(20), { stiffness: 120, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(600px circle at ${mx}% ${my}%, rgba(139,92,246,0.28), transparent 55%)`;
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  };

  const tile = "h-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 backdrop-blur-md rounded-2xl p-4 flex flex-col justify-between shadow-lg relative overflow-hidden transition-colors group";

  return (
    <div
      onPointerMove={onMove}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white shadow-xl p-6 md:p-8"
    >
      {/* Ambient drifting orbs + cursor light */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={reduce ? undefined : { scale: [1, 1.2, 1], x: [0, 40, 0], y: [0, -30, 0], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 blur-3xl"
        />
        <motion.div
          animate={reduce ? undefined : { scale: [1.2, 1, 1.2], x: [0, -40, 0], y: [0, 30, 0], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 blur-3xl"
        />
        <motion.div className="absolute inset-0" style={{ background: glow }} />
      </div>

      <div className="relative z-10 flex flex-col xl:flex-row gap-8 justify-between items-stretch">
        {/* Welcome block */}
        <div className="flex flex-col justify-between max-w-2xl">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-semibold border border-white/10 tracking-wide text-indigo-100"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{greeting()} — ready for today&apos;s session?</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]"
            >
              Conquer your{" "}
              <span className="font-serif italic font-medium tracking-normal pr-1 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300">
                GATE 2027
              </span>{" "}
              goals
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-indigo-100/80 font-medium text-sm md:text-base leading-relaxed max-w-xl"
            >
              Your personal study engine. Find your weak spots, practise with real GATE questions, and keep your streak going every day.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-6 xl:mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onNewExam}
              className="group inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/30 cursor-pointer"
            >
              Start practice session
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/ai-mentor")}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 border border-white/15 font-semibold text-sm rounded-xl cursor-pointer transition-colors"
            >
              <BrainCircuit className="w-4 h-4" />
              Ask AI Mentor
            </motion.button>
          </motion.div>
        </div>

        {/* Interactive stat tiles */}
        <div className="flex-1 max-w-xl grid grid-cols-2 md:grid-cols-3 gap-3.5">
          <TiltCard as="button" onClick={() => router.push("/calendar")} title="Open your study calendar" className={tile}>
            <div className="text-[10px] font-bold text-rose-300 uppercase tracking-[0.14em] flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 fill-rose-500 stroke-none" />
              <span>Streak</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <CountUp value={streak} className="text-3xl font-bold text-white" />
              <span className="text-xs text-rose-200 font-semibold">{streak === 1 ? "day" : "days"}</span>
            </div>
          </TiltCard>

          <TiltCard as="button" onClick={() => router.push("/analytics")} title="See your analytics" className={tile}>
            <div className="text-[10px] font-bold text-sky-300 uppercase tracking-[0.14em] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved</span>
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <CountUp value={solved} className="text-3xl font-bold text-white" />
              <span className="text-xs text-sky-200 font-semibold">questions</span>
            </div>
          </TiltCard>

          <TiltCard as="button" onClick={() => router.push("/analytics")} title="See accuracy by subject" wrapperClassName="col-span-2 md:col-span-1" className={tile}>
            <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-[0.14em] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Accuracy</span>
            </div>
            <div className="mt-3">
              <CountUp value={accuracy} suffix="%" className="text-3xl font-bold text-white" />
              <div className="mt-2 h-1 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, accuracy)}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300"
                />
              </div>
            </div>
          </TiltCard>

          <TiltCard as="button" onClick={() => router.push("/analytics")} title="Your rank ladder" wrapperClassName="col-span-2" className={tile}>
            <div className="text-[10px] font-bold text-amber-300 uppercase tracking-[0.14em] flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>Mastery rank</span>
            </div>
            <div className="mt-2.5">
              <div className="font-display font-bold text-lg text-amber-50 truncate">{rank.name}</div>
              <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rank.pct}%` }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                />
              </div>
              <div className="mt-1.5 text-[11px] font-medium text-amber-100/70">
                {rank.next ? <>{rank.remaining} more to <span className="text-amber-100 font-semibold">{rank.next.name}</span></> : "Top rank reached"}
              </div>
            </div>
          </TiltCard>

          <TiltCard as="button" onClick={() => router.push("/ai-mentor")} title="Open your readiness report in AI Mentor" className={`${tile} items-center`}>
            <div className="w-full text-[10px] font-bold text-violet-300 uppercase tracking-[0.14em] flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>Readiness</span>
              <span className="ml-auto" onClick={(e) => e.stopPropagation()}>
                <InfoTip align="right">
                  An estimate from your accuracy (75% of the score) and how many questions you have solved (25%, full marks at 100 solved). It rises as you practise.
                </InfoTip>
              </span>
            </div>
            <RadialGauge value={estimatedReadiness} size={74} stroke={7} from="#a78bfa" to="#f472b6" track="#fff" trackOpacity={0.12} className="mt-2">
              <CountUp value={estimatedReadiness} suffix="%" className="text-lg font-bold text-white" />
            </RadialGauge>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
