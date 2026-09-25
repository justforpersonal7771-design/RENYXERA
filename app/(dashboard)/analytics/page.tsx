"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAnalyticsStore } from "@/store/use-analytics-store";
import { useDataStore } from "@/store/use-data-store";
import { useStudyStore } from "@/store/use-study-store";
import { useDisplayName } from "@/store/use-auth-store";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  AreaChart, Area, Cell, ReferenceLine,
} from "recharts";
import {
  Loader2, TrendingUp, Target, BookOpen, Sparkles, Flame, CheckCircle, Lightbulb, Compass, Award,
  Search, ArrowUpDown, ArrowRight, X, ChevronUp, ChevronDown,
} from "lucide-react";
import { LearningEngine, PersonalizedIntelligence } from "@/lib/learning/LearningEngine";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/ui/reveal";
import { GuestLock } from "@/components/auth/guest-lock";
import { CountUp, RadialGauge, TiltCard, InfoTip, Segmented } from "@/components/ui/interactive";

type SubjectMetric = "accuracy" | "attempts" | "time";
type TopicTab = "weak" | "all" | "strong";
type SortKey = "topic" | "attempted" | "acc";

const rise = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

function ChartEmptyState({ label }: { label: string }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center text-center gap-2">
      <TrendingUp className="w-8 h-8 text-[var(--text-muted)] opacity-40" />
      <p className="text-xs font-bold text-[var(--text-secondary)]">No data yet</p>
      <p className="text-[11px] text-[var(--text-muted)] max-w-[220px]">{label}</p>
    </div>
  );
}

function ChartTooltip({ active, payload, label, unit }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[var(--surface-elevated)] border border-[var(--border)] px-3 py-2.5 rounded-xl shadow-xl">
      <p className="font-bold text-[var(--text-primary)] mb-1 text-xs">{payload[0]?.payload?.full || label}</p>
      {payload.map((p: any, idx: number) => {
        const u = unit ?? (/accuracy/i.test(String(p.name)) ? "%" : "");
        return (
          <p key={idx} className="text-xs font-semibold flex items-center gap-1.5" style={{ color: p.color }}>
            <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            {p.name}: <span className="font-num">{p.value}{u}</span>
          </p>
        );
      })}
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  const { first: firstName } = useDisplayName();
  const { isInitialized } = useDataStore();
  const { dashboardMetrics, loadAnalytics } = useAnalyticsStore();
  const { loadStudyData } = useStudyStore();

  const [mounted, setMounted] = useState(false);
  const [intel, setIntel] = useState<PersonalizedIntelligence | null>(null);
  const [loadingIntel, setLoadingIntel] = useState(true);

  // Interactive state
  const [trendMetric, setTrendMetric] = useState<"accuracy" | "score">("accuracy");
  const [subjectMetric, setSubjectMetric] = useState<SubjectMetric>("accuracy");
  const [subjectFilter, setSubjectFilter] = useState<string | null>(null);
  const [topicTab, setTopicTab] = useState<TopicTab>("weak");
  const [topicQuery, setTopicQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "acc", dir: 1 });
  const [expandedInsight, setExpandedInsight] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    loadAnalytics();
    loadStudyData();
    setLoadingIntel(true);
    LearningEngine.getPersonalizedIntelligence()
      .then((res) => { setIntel(res); setLoadingIntel(false); })
      .catch((e) => { console.error(e); setLoadingIntel(false); });
  }, [loadAnalytics, loadStudyData]);

  const subjectData = useMemo(() => {
    if (!dashboardMetrics) return [];
    const rows = dashboardMetrics.subjectPerformance.map((s) => ({
      full: s.subject,
      name: s.subject.length > 16 ? s.subject.substring(0, 15) + "…" : s.subject,
      attempts: s.attempted,
      accuracy: s.attempted > 0 ? Math.round((s.correct / s.attempted) * 100) : 0,
      time: s.attempted > 0 ? Math.round(s.timeSpentMs / s.attempted / 1000) : 0,
    }));
    return rows.sort((a, b) => b[subjectMetric] - a[subjectMetric]);
  }, [dashboardMetrics, subjectMetric]);

  const topics = useMemo(() => {
    if (!dashboardMetrics) return [];
    return dashboardMetrics.topicPerformance
      .filter((t) => t.attempted >= 1)
      .map((t) => ({ ...t, acc: (t.correct / t.attempted) * 100 }));
  }, [dashboardMetrics]);

  const weakCount = topics.filter((t) => t.acc < 50).length;
  const strongCount = topics.filter((t) => t.acc >= 75).length;

  const visibleTopics = useMemo(() => {
    const q = topicQuery.trim().toLowerCase();
    return topics
      .filter((t) => (topicTab === "weak" ? t.acc < 50 : topicTab === "strong" ? t.acc >= 75 : true))
      .filter((t) => !subjectFilter || t.subject === subjectFilter)
      .filter((t) => !q || t.topic.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q))
      .sort((a, b) => {
        const va = a[sort.key];
        const vb = b[sort.key];
        if (typeof va === "string" && typeof vb === "string") return va.localeCompare(vb) * sort.dir;
        return ((va as number) - (vb as number)) * sort.dir;
      });
  }, [topics, topicTab, subjectFilter, topicQuery, sort]);

  if (!isInitialized || !mounted || !dashboardMetrics) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const diffData = dashboardMetrics.difficultyPerformance.map((d) => ({
    name: String(d.difficulty),
    Attempted: d.attempted,
    Accuracy: d.attempted > 0 ? Math.round((d.correct / d.attempted) * 100) : 0,
  }));

  const trendData = [...dashboardMetrics.recentSessions]
    .filter((s) => s.status === "SUBMITTED")
    .reverse()
    .map((s, idx) => ({
      session: `S${idx + 1}`,
      full: s.config?.name || `Session ${idx + 1}`,
      score: Number((s.score?.totalScore || 0).toFixed(2)),
      accuracy: Math.round(s.accuracy || 0),
    }));

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: key === "topic" ? 1 : -1 }));

  const practice = (topic: string) => router.push(`/setup?topic=${encodeURIComponent(topic)}`);

  const hud = intel
    ? [
        { label: "Mastery Score", value: intel.masteryScore, icon: CheckCircle, tag: "Core CSE", color: "text-indigo-500", from: "#6366f1", to: "#a855f7",
          info: "How well you know the syllabus overall, weighted by how much of each subject you've covered and how accurately." },
        { label: "Readiness Index", value: intel.readinessScore, icon: Award, tag: "Exam ready", color: "text-emerald-500", from: "#10b981", to: "#06b6d4",
          info: "How prepared you look for the real exam right now, combining mastery, accuracy under time, and syllabus coverage." },
        { label: "Confidence", value: intel.confidenceScore, icon: Sparkles, tag: "Accuracy × speed", color: "text-amber-500", from: "#f59e0b", to: "#f43f5e",
          info: "Whether you answer correctly and at GATE pace. High accuracy but slow answers keeps this lower." },
        { label: "Consistency", value: intel.consistencyScore, icon: Flame, tag: "Active days", color: "text-rose-500", from: "#f43f5e", to: "#ec4899",
          info: "The share of recent days you actually studied. Short daily sessions beat occasional long ones." },
      ]
    : [];

  const metricColor = subjectMetric === "accuracy" ? "#6366f1" : subjectMetric === "attempts" ? "#94a3b8" : "#f59e0b";
  const metricName = subjectMetric === "accuracy" ? "Accuracy" : subjectMetric === "attempts" ? "Attempts" : "Avg time / question";
  const metricUnit = subjectMetric === "accuracy" ? "%" : subjectMetric === "time" ? "s" : "";

  return (
    <GuestLock
      feature="Advanced Analytics"
      description="See your mastery score, readiness index, and weak-topic insights — sign in to track them across every attempt."
    >
      <div className="w-full mx-auto p-4 md:p-6 space-y-8">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {firstName ? `${firstName}'s` : "Your"} <span className="font-serif italic font-medium bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 bg-clip-text text-transparent pr-1">analytics</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] font-medium">
            Hover, click and filter anything below. Click a subject bar to narrow the topic explorer to it.
          </p>
        </motion.div>

        {/* 1. HUD gauges */}
        {loadingIntel ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((i) => <div key={i} className="skeleton-shimmer h-[124px] rounded-2xl" />)}
          </div>
        ) : intel && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {hud.map((stat, idx) => (
              <motion.div key={stat.label} {...rise} transition={{ ...rise.transition, delay: idx * 0.06 }}>
                <TiltCard className="card-glass rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <RadialGauge value={stat.value} size={84} stroke={8} from={stat.from} to={stat.to} className="text-[var(--text-primary)] shrink-0">
                    <CountUp value={stat.value} suffix="%" className="text-lg font-bold text-[var(--text-primary)]" />
                  </RadialGauge>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 text-[var(--text-muted)]">
                      <stat.icon className={`w-3.5 h-3.5 shrink-0 ${stat.color}`} />
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] truncate">{stat.label}</span>
                      <InfoTip align="right">{stat.info}</InfoTip>
                    </div>
                    <span className={`mt-1 block text-xs font-semibold ${stat.color}`}>{stat.tag}</span>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        )}

        {/* 2. Insights + adaptive path */}
        {!loadingIntel && intel && (
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 card-glass rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Smart insights
                <span className="ml-auto text-[10px] font-semibold text-[var(--text-muted)]">Click one to highlight it</span>
              </h3>
              <div className="space-y-2.5">
                {intel.insights.map((insight, idx) => {
                  const open = expandedInsight === idx;
                  return (
                    <motion.button
                      type="button"
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.3) }}
                      whileHover={{ x: 4 }}
                      onClick={() => setExpandedInsight(open ? null : idx)}
                      className={`w-full text-left flex gap-3 items-start p-3 rounded-xl border transition-colors cursor-pointer ${
                        open ? "bg-indigo-500/10 border-indigo-500/30" : "bg-[var(--surface-secondary)]/50 border-[var(--border-subtle)] hover:border-indigo-500/20"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 transition-transform ${open ? "bg-violet-500 scale-150" : "bg-indigo-500"}`} />
                      <p className={`text-xs font-medium leading-relaxed ${open ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{insight}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 card-glass rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                Today&apos;s adaptive path
              </h3>
              <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-2">
                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-500">Focus topic</span>
                <span className="block text-sm font-bold text-[var(--text-primary)]">{intel.todaysFocus.topic}</span>
                <p className="text-[11px] text-[var(--text-muted)] font-medium leading-relaxed">{intel.todaysFocus.reason}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => practice(intel.todaysFocus.topic)}
                  className="group mt-1 w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold py-2 cursor-pointer"
                >
                  Practise this topic <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </motion.button>
              </div>
              <div className="p-4 bg-[var(--surface-secondary)] border border-[var(--border-subtle)] rounded-xl">
                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-500 mb-1">Practice target</span>
                <span className="block text-sm font-bold text-[var(--text-primary)] mb-1">
                  {intel.todaysTarget.title} · <span className="font-num">{intel.todaysTarget.count}</span> Qs
                </span>
                <p className="text-[11px] text-[var(--text-muted)] font-medium leading-relaxed">{intel.todaysTarget.reason}</p>
              </div>
            </div>
          </Reveal>
        )}

        {/* 3. Trend + difficulty */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div {...rise} className="card-glass p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-6">
              <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                Trend across recent exams
              </h3>
              <Segmented size="xs" value={trendMetric} onChange={setTrendMetric} options={[{ label: "Accuracy", value: "accuracy" }, { label: "Score", value: "score" }]} />
            </div>
            <div className="h-[280px] w-full">
              {trendData.length === 0 ? (
                <ChartEmptyState label="Complete a mock test to start tracking your trend across exams." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={trendMetric === "accuracy" ? "#6366f1" : "#ec4899"} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={trendMetric === "accuracy" ? "#6366f1" : "#ec4899"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis dataKey="session" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip content={<ChartTooltip unit={trendMetric === "accuracy" ? "%" : ""} />} cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeDasharray: "4 4" }} />
                    <Area
                      key={trendMetric}
                      type="monotone"
                      dataKey={trendMetric}
                      name={trendMetric === "accuracy" ? "Accuracy" : "Score"}
                      stroke={trendMetric === "accuracy" ? "#6366f1" : "#ec4899"}
                      strokeWidth={3}
                      fill="url(#trendFill)"
                      activeDot={{ r: 6, stroke: "var(--surface)", strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>

          <motion.div {...rise} transition={{ ...rise.transition, delay: 0.06 }} className="card-glass p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-500" />
              Difficulty analysis
            </h3>
            <div className="h-[280px] w-full">
              {diffData.length === 0 ? (
                <ChartEmptyState label="Difficulty-wise performance will appear once you attempt questions across difficulty levels." />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={diffData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                    <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <RechartsTooltip cursor={{ fill: "var(--surface-secondary)" }} content={<ChartTooltip />} />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: "16px", fontSize: "11px" }} />
                    <Bar yAxisId="left" dataKey="Attempted" name="Questions solved" fill="#cbd5e1" radius={[6, 6, 0, 0]} maxBarSize={30} />
                    <Bar yAxisId="right" dataKey="Accuracy" name="Accuracy" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>

        {/* 4. Subject explorer — one chart, three metrics, bars act as a filter */}
        <motion.div {...rise} className="card-glass p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              Subject explorer
            </h3>
            <Segmented
              value={subjectMetric}
              onChange={setSubjectMetric}
              options={[
                { label: "Accuracy", value: "accuracy" },
                { label: "Attempts", value: "attempts" },
                { label: "Time / Q", value: "time" },
              ]}
            />
          </div>
          <p className="text-[11px] text-[var(--text-muted)] font-medium mb-5">
            {subjectMetric === "time"
              ? "Average seconds per question. GATE pacing is about 108s for 1-mark and 216s for 2-mark questions (dashed line = 108s)."
              : "Sorted highest first. Click a bar to filter the topic explorer below to that subject."}
          </p>
          <div className="h-[340px] w-full">
            {subjectData.length === 0 ? (
              <ChartEmptyState label="Subject-wise comparisons will appear once you complete a mock test or subject-wise practice." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
                  <XAxis type="number" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} domain={subjectMetric === "accuracy" ? [0, 100] : [0, "auto"]} />
                  <YAxis dataKey="name" type="category" width={120} stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                  <RechartsTooltip cursor={{ fill: "var(--surface-secondary)" }} content={<ChartTooltip unit={metricUnit} />} />
                  {subjectMetric === "time" && <ReferenceLine x={108} stroke="#f43f5e" strokeDasharray="4 4" />}
                  <Bar
                    dataKey={subjectMetric}
                    name={metricName}
                    radius={[0, 6, 6, 0]}
                    maxBarSize={18}
                    cursor="pointer"
                    animationDuration={700}
                    onClick={(d: any) => {
                      const full = d?.full ?? d?.payload?.full;
                      if (full) { setSubjectFilter((cur) => (cur === full ? null : full)); setTopicTab("all"); }
                    }}
                  >
                    {subjectData.map((s) => (
                      <Cell key={s.full} fill={metricColor} fillOpacity={!subjectFilter || subjectFilter === s.full ? 1 : 0.25} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* 5. Topic explorer — tabs, search, sortable columns, one-click practice */}
        <motion.div {...rise} className="card-glass rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[var(--border-subtle)] flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)]">Topic explorer</h3>
              <Segmented
                size="xs"
                value={topicTab}
                onChange={setTopicTab}
                options={[
                  { label: `Weak · ${weakCount}`, value: "weak" },
                  { label: `All · ${topics.length}`, value: "all" },
                  { label: `Strong · ${strongCount}`, value: "strong" },
                ]}
              />
              <AnimatePresence>
                {subjectFilter && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={() => setSubjectFilter(null)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-semibold cursor-pointer hover:bg-indigo-500/20"
                  >
                    {subjectFilter} <X className="w-3 h-3" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
            <div className="relative lg:w-64">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                value={topicQuery}
                onChange={(e) => setTopicQuery(e.target.value)}
                placeholder="Search topics or subjects…"
                className="w-full pl-9 pr-3 py-2 bg-[var(--surface-secondary)] border border-[var(--border)] rounded-lg text-xs font-medium text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-indigo-500/40"
              />
            </div>
          </div>

          <div className="overflow-auto max-h-[440px] custom-scrollbar">
            {visibleTopics.length === 0 ? (
              <div className="p-10 text-center text-xs text-[var(--text-muted)] font-medium">
                {topics.length === 0
                  ? "Solve a few questions and your topics will show up here."
                  : "Nothing matches these filters."}
              </div>
            ) : (
              <table className="w-full text-xs text-left">
                <thead className="text-[10px] font-bold uppercase tracking-wider bg-[var(--surface-secondary)] text-[var(--text-muted)] sticky top-0 z-10">
                  <tr>
                    {([["topic", "Topic"], ["attempted", "Attempts"], ["acc", "Accuracy"]] as [SortKey, string][]).map(([k, l]) => (
                      <th key={k} className={`px-4 py-3 ${k === "topic" ? "" : "text-right"}`}>
                        <button onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 hover:text-[var(--text-primary)] cursor-pointer uppercase">
                          {l}
                          {sort.key === k ? (sort.dir === 1 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-40" />}
                        </button>
                      </th>
                    ))}
                    <th className="px-4 py-3 w-28" />
                  </tr>
                </thead>
                <tbody>
                  {visibleTopics.map((t) => {
                    const tone = t.acc < 50 ? "from-rose-500 to-orange-400" : t.acc >= 75 ? "from-emerald-500 to-teal-400" : "from-amber-400 to-yellow-300";
                    const txt = t.acc < 50 ? "text-rose-600 dark:text-rose-400" : t.acc >= 75 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400";
                    return (
                      <motion.tr
                        key={t.subject + t.topic}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group border-t border-[var(--border-subtle)] hover:bg-[var(--surface-secondary)]/60 transition-colors"
                      >
                        <td className="px-4 py-3 max-w-[340px]">
                          <span className="font-semibold text-[var(--text-primary)] block truncate">{t.topic}</span>
                          <button
                            onClick={() => setSubjectFilter(t.subject)}
                            title={`Filter to ${t.subject}`}
                            className="text-[10px] text-[var(--text-muted)] font-medium block truncate mt-0.5 hover:text-indigo-500 cursor-pointer"
                          >
                            {t.subject}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right font-num font-semibold text-[var(--text-secondary)]">{t.attempted}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <div className="hidden sm:block w-20 h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${t.acc}%` }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                className={`h-full rounded-full bg-gradient-to-r ${tone}`}
                              />
                            </div>
                            <span className={`font-num font-bold w-10 ${txt}`}>{t.acc.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => practice(t.topic)}
                            className="sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-[10px] font-bold transition-opacity cursor-pointer"
                          >
                            Practise <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </GuestLock>
  );
}
