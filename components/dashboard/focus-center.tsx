"use client";

import { motion } from "motion/react";
import { AlertCircle, Target, Sparkles, BookOpen, Clock, Zap, ScrollText, BrainCircuit, ArrowRight } from "lucide-react";
import { TiltCard } from "@/components/ui/interactive";
import { useRouter } from "next/navigation";

import { SubjectAnalytics, TopicAnalytics } from "@/types/analytics.types";
import { useMemo } from "react";

interface FocusCenterProps {
  subjectPerformance: SubjectAnalytics[];
  topicPerformance: TopicAnalytics[];
  mistakesCount: number;
  bookmarksCount: number;
  hasActiveSession: boolean;
  onContinueSession: () => void;
}

export function FocusCenter({
  subjectPerformance,
  topicPerformance,
  mistakesCount,
  bookmarksCount,
  hasActiveSession,
  onContinueSession
}: FocusCenterProps) {
  const router = useRouter();

  // Find weakest subject (worst accuracy with at least 2 attempts)
  const weakestSubject = useMemo(() => {
    const sorted = [...subjectPerformance]
      .filter(s => s.attempted >= 2)
      .map(s => ({
        ...s,
        acc: s.attempted > 0 ? (s.correct / s.attempted) * 100 : 0
      }))
      .sort((a, b) => a.acc - b.acc);
    return sorted[0] || null;
  }, [subjectPerformance]);

  // Find weakest topic (worst accuracy with at least 2 attempts)
  const weakestTopic = useMemo(() => {
    const sorted = [...topicPerformance]
      .filter(t => t.attempted >= 2)
      .map(t => ({
        ...t,
        acc: t.attempted > 0 ? (t.correct / t.attempted) * 100 : 0
      }))
      .sort((a, b) => a.acc - b.acc);
    return sorted[0] || null;
  }, [topicPerformance]);

  const focusCards = [
    ...(hasActiveSession ? [{
      title: "Continue Paused Exam",
      desc: "Finish your active quiz before it expires.",
      actionLabel: "Resume Now",
      icon: Clock,
      tint: "bg-blue-500/10 text-blue-500", btn: "from-blue-500 to-indigo-600 shadow-blue-500/30", glow: "bg-blue-500",
      onClick: onContinueSession
    }] : []),
    ...(weakestTopic ? [{
      title: "Weakest Topic Diagnostic",
      desc: `Your accuracy in "${weakestTopic.topic}" is currently ${weakestTopic.acc.toFixed(0)}%.`,
      actionLabel: "Practice Topic",
      icon: AlertCircle,
      tint: "bg-rose-500/10 text-rose-500", btn: "from-rose-500 to-pink-600 shadow-rose-500/30", glow: "bg-rose-500",
      onClick: () => router.push(`/setup?topic=${encodeURIComponent(weakestTopic.topic)}`)
    }] : []),
    ...(weakestSubject ? [{
      title: "Weakest Subject Revision",
      desc: `Your performance in "${weakestSubject.subject}" needs focus (${weakestSubject.acc.toFixed(0)}% acc).`,
      actionLabel: "Review Subject",
      icon: Target,
      tint: "bg-amber-500/10 text-amber-500", btn: "from-amber-500 to-orange-600 shadow-amber-500/30", glow: "bg-amber-500",
      onClick: () => router.push(`/setup?subject=${encodeURIComponent(weakestSubject.subject)}`)
    }] : []),
    ...(mistakesCount > 0 ? [{
      title: "Review Mistakes Queue",
      desc: `You have ${mistakesCount} unresolved questions in your mistakes log.`,
      actionLabel: "Launch Mistakes",
      icon: BookOpen,
      tint: "bg-indigo-500/10 text-indigo-500", btn: "from-indigo-500 to-violet-600 shadow-indigo-500/30", glow: "bg-indigo-500",
      onClick: () => router.push("/mistakes")
    }] : []),
    {
      title: "Suggested Practice",
      desc: "Start a balanced 10-question quiz to test your overall readiness.",
      actionLabel: "Start Test",
      icon: Zap,
      tint: "bg-violet-500/10 text-violet-500", btn: "from-violet-500 to-fuchsia-600 shadow-violet-500/30", glow: "bg-violet-500",
      onClick: () => router.push("/setup")
    },
    // Evergreen suggestions so the desk is always a full row of three — a new learner
    // with no history otherwise saw one lonely card and a wide empty gap beside it.
    {
      title: "Sit a Full Official Paper",
      desc: "Take a real past GATE CSE paper under exam timing to see where you stand.",
      actionLabel: "Pick a Paper",
      icon: ScrollText,
      tint: "bg-sky-500/10 text-sky-500", btn: "from-sky-500 to-blue-600 shadow-sky-500/30", glow: "bg-sky-500",
      onClick: () => router.push("/setup")
    },
    {
      title: "Plan With Your AI Mentor",
      desc: "Get a readiness estimate and a study plan built from your own progress.",
      actionLabel: "Open Mentor",
      icon: BrainCircuit,
      tint: "bg-emerald-500/10 text-emerald-500", btn: "from-emerald-500 to-teal-600 shadow-emerald-500/30", glow: "bg-emerald-500",
      onClick: () => router.push("/ai-mentor")
    }
  ].slice(0, 3); // Always exactly 3 cards: personalised ones first, evergreen ones fill the rest

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
        <h3 className="font-extrabold text-xs uppercase tracking-widest text-[var(--text-muted)]">Today's Focus Desk</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {focusCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title + i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="h-full"
            >
              <TiltCard max={5} className="card-glass rounded-2xl p-5 flex flex-col justify-between overflow-hidden group">
                <div className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-3xl opacity-[0.12] group-hover:opacity-30 transition-opacity duration-500 pointer-events-none ${card.glow}`} />
                <div className="relative">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${card.tint}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-sm text-[var(--text-primary)] line-clamp-2 leading-snug">{card.title}</h4>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed mb-5">{card.desc}</p>
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={card.onClick}
                  className={`group/btn relative overflow-hidden w-full inline-flex items-center justify-center gap-2 h-10 rounded-xl bg-gradient-to-r ${card.btn} text-white text-xs font-semibold shadow-lg cursor-pointer`}
                >
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:translate-x-[300%] transition-transform duration-700" />
                  <span className="relative">{card.actionLabel}</span>
                  <ArrowRight className="relative w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                </motion.button>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
