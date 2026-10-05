"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentBranch } from "@/lib/branch/current";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Clock, CalendarDays, Play, Loader2, ShieldCheck, CheckCircle2, BarChart3, Radio, Lock, DoorOpen, DoorClosed, Send, Medal, Target, TrendingUp, Timer, Zap } from "lucide-react";
import { openLeaderboard } from "@/components/layout/leaderboard-panel";
import { challengeQuestionIds, challengeTitle } from "@/lib/exam/weekly-challenge";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { useDataStore } from "@/store/use-data-store";
import { useToastStore } from "@/store/use-toast-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { mockOrder } from "@/lib/exam/mock-order";

interface Mock { id: string; title: string; starts_at: string; ends_at: string; results_at: string; question_count: number; duration_seconds: number; start_grace_minutes?: number }

const entryCloses = (m: Mock) => Date.parse(m.starts_at) + (m.start_grace_minutes ?? 30) * 60_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
interface MyAttempt { id: string; mock_id: string; status: string; server_score: number | null; server_max: number | null; integrity_flags: unknown[] }

function useNow(ms = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}
const fmtCountdown = (ms: number) => {
  if (ms <= 0) return "now";
  const s = Math.floor(ms / 1000), d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m ${sec}s` : `${m}m ${sec}s`;
};
const fmtWhen = (iso: string) => new Date(iso).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export default function MocksPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const openAuth = useAuthModalStore((s) => s.open);
  const repoReady = useDataStore((s) => s.isInitialized);
  const startSession = useExamRuntimeStore((s) => s.startSession);
  const toast = useToastStore((s) => s.show);
  const now = useNow();

  const [mocks, setMocks] = useState<Mock[] | null>(null);
  const [mine, setMine] = useState<MyAttempt[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const [starting, setStarting] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const sb = createClient();
    const { data, error } = await sb.from("mock_events").select("id,title,starts_at,ends_at,results_at,question_count,duration_seconds,start_grace_minutes").eq("branch_code", getCurrentBranch()).order("starts_at", { ascending: false }).limit(24);
    if (error) { setUnavailable(true); setMocks([]); return; }
    setMocks(data as Mock[]);
    if (user) {
      const { data: a } = await sb.from("exam_attempts").select("id,mock_id,status,server_score,server_max,integrity_flags").not("mock_id", "is", null);
      setMine((a as MyAttempt[]) ?? []);
    }
  }, [user]);
  useEffect(() => { void load(); }, [load]);
  // Refresh the moment the next results are released (leaderboard + scores update live).
  useEffect(() => {
    const next = (mocks ?? []).map((m) => Date.parse(m.results_at)).filter((t) => t > Date.now()).sort((a, b) => a - b)[0];
    if (!next || next - Date.now() > 24 * 3600_000) return;
    const t = setTimeout(() => void load(), next - Date.now() + 1500);
    return () => clearTimeout(t);
  }, [mocks, load]);

  const { live, upcoming, past } = useMemo(() => {
    const list = mocks ?? [];
    return {
      live: list.find((m) => Date.parse(m.starts_at) <= now && now < Date.parse(m.ends_at)) ?? null, // entry window or papers still running
      upcoming: list.filter((m) => Date.parse(m.starts_at) > now).sort((a, b) => Date.parse(a.starts_at) - Date.parse(b.starts_at)),
      past: list.filter((m) => Date.parse(m.ends_at) <= now),
    };
  }, [mocks, now]);
  const attemptFor = (id: string) => mine.find((a) => a.mock_id === id);

  const start = async (m: Mock) => {
    if (!user) return openAuth("login", "/mocks");
    if (!repoReady) return toast("Questions are still loading — try again in a moment.", "info");
    setStarting(m.id);
    try {
      // The same attempt id is reused on every retry, so a retry after a lost response is
      // safe (the server treats it as a resume). Backoff with jitter spreads the 10:00 rush.
      // The paper's question ids are secret until the start (server-enforced).
      const { createClient } = await import("@/lib/supabase/client");
      const { data: paper } = await createClient().rpc("mock_paper", { p_mock: m.id });
      const questionIds = (paper as string[] | null) ?? [];
      if (!questionIds.length) { toast("Couldn't load the paper — try again in a moment.", "error"); return; }
      const attemptId = crypto.randomUUID();
      let res: Response | null = null;
      let j: { error?: string; duration_seconds?: number; started_at?: string } = {};
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          res = await fetch("/api/exam/start", {
            method: "POST", headers: { "content-type": "application/json" },
            body: JSON.stringify({ attempt_id: attemptId, question_ids: questionIds, mode: "graded", title: m.title, mock_id: m.id }),
          });
          j = await res.json().catch(() => ({}));
          if (res.ok || (res.status < 500 && res.status !== 429)) break;
        } catch { res = null; }
        await sleep(Math.min(8000, 800 * 2 ** attempt) + Math.random() * 1200);
      }
      if (!res) { toast("You seem to be offline — mocks need a connection to start.", "error"); return; }
      if (!res.ok) { toast(j.error || "The server is busy — please try again in a moment.", "error"); return; }
      const limit = j.duration_seconds ?? m.duration_seconds;
      const deadlineAt = new Date(Date.parse(j.started_at ?? new Date().toISOString()) + limit * 1000).toISOString();
      await startSession({
        id: attemptId,
        config: { examType: "GRAND_MOCK", mockId: m.id, timeLimitSeconds: limit, deadlineAt, title: m.title },
        questions: mockOrder(questionIds, user.id, m.id, (id) => /APTITUDE/i.test(QuestionRepository.getQuestionById(id)?.section ?? ""))
          .map((questionId, i) => ({ questionId, sequence: i + 1 })),
        createdAt: new Date().toISOString(),
      });
      router.push("/exam/session");
    } catch {
      toast("You seem to be offline — mocks need a connection to start.", "error");
    } finally {
      setStarting(null);
    }
  };

  const startChallenge = async () => {
    if (!repoReady) return toast("Questions are still loading — try again in a moment.", "info");
    setStarting("challenge");
    try {
      const ids = challengeQuestionIds(QuestionRepository.getAllQuestions().map((q) => q.question_id));
      await startSession({
        id: crypto.randomUUID(),
        config: { examType: "CUSTOM_TEST", title: challengeTitle() },
        questions: ids.map((questionId, i) => ({ questionId, sequence: i + 1 })),
        createdAt: new Date().toISOString(),
      } as Parameters<typeof startSession>[0]);
      router.push("/exam/session");
    } finally {
      setStarting(null);
    }
  };

  if (mocks === null) return <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>;

  const next = upcoming[0] ?? null;
  const submitted = mine.filter((a) => a.status === "submitted");
  const releasedScores = submitted.filter((a) => { const m = (mocks ?? []).find((x) => x.id === a.mock_id); return m && now >= Date.parse(m.results_at) && a.server_score !== null; }).map((a) => Number(a.server_score));
  const best = releasedScores.length ? Math.max(...releasedScores) : null;
  const avg = releasedScores.length ? Math.round((releasedScores.reduce((x, y) => x + y, 0) / releasedScores.length) * 10) / 10 : null;
  const pendingResults = (mocks ?? []).filter((m) => now < Date.parse(m.results_at) && Date.parse(m.starts_at) <= now).sort((a, b) => Date.parse(a.results_at) - Date.parse(b.results_at))[0];
  const dayRef = live ?? next;

  return (
    <div className="w-full pb-10 space-y-6">
      {/* Hero: live paper, or a ticking countdown to the next one */}
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-700 via-violet-600 to-fuchsia-600 text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.6)]">
        <motion.div aria-hidden="true" className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-cyan-300/25 blur-3xl" animate={{ x: [0, -20, 0], y: [0, 15, 0] }} transition={{ duration: 9, repeat: Infinity }} />
        <motion.div aria-hidden="true" className="absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-amber-300/20 blur-3xl" animate={{ x: [0, 25, 0] }} transition={{ duration: 11, repeat: Infinity }} />
        <div className="relative flex flex-col gap-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <motion.span whileHover={{ rotate: -12, scale: 1.08 }} className="w-12 h-12 shrink-0 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center"><Trophy className="w-6 h-6 text-amber-200" /></motion.span>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">All-India Mock</h1>
                <p className="text-xs sm:text-sm text-white/80">Every Sunday · GATE CS pattern · ranked nationally</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openLeaderboard()}
              className="shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-sm font-bold cursor-pointer backdrop-blur">
              <Medal className="w-4 h-4 text-amber-200" /> <span className="hidden sm:inline">Leaderboard</span>
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2 text-[11px] font-bold">
            {["65 questions", "100 marks", "180 minutes, no pause", "One attempt"].map((c) => <span key={c} className="px-2.5 py-1 rounded-full bg-white/15 border border-white/20">{c}</span>)}
          </div>

          {live ? (() => {
            const a = attemptFor(live.id);
            return (
              <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/25 text-emerald-50 text-[11px] font-black uppercase tracking-wider">
                    <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}><Radio className="w-3.5 h-3.5" /></motion.span> Live now
                  </span>
                  <h2 className="mt-2 text-xl sm:text-2xl font-extrabold">{live.title}</h2>
                  <p className="text-sm text-white/85">{now < entryCloses(live) ? <>Entry closes in <span className="font-num font-bold">{fmtCountdown(entryCloses(live) - now)}</span></> : <>Entry closed · results {fmtWhen(live.results_at)}</>}</p>
                </div>
                {a ? (a.status === "submitted" ? (
                  <span className="inline-flex items-center gap-2 px-4 h-12 rounded-xl bg-white/15 text-sm font-semibold"><CheckCircle2 className="w-4 h-4 text-emerald-300" /> Submitted — results {fmtWhen(live.results_at)}</span>
                ) : (
                  <Link href="/exam/session" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-white text-violet-700 font-extrabold shadow-lg"><Play className="w-5 h-5 fill-current" /> Continue your mock</Link>
                )) : now > entryCloses(live) ? (
                  <span className="inline-flex items-center gap-2 px-4 h-12 rounded-xl bg-white/15 text-sm font-semibold"><Lock className="w-4 h-4" /> Entry closed</span>
                ) : (
                  <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => start(live)} disabled={!!starting}
                    className="relative overflow-hidden inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-white text-violet-700 font-extrabold shadow-lg disabled:opacity-70 cursor-pointer">
                    <motion.span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-200/60 to-transparent" animate={{ x: ["-120%", "120%"] }} transition={{ duration: 2.2, repeat: Infinity }} />
                    <span className="relative inline-flex items-center gap-2">{starting === live.id ? <Loader2 className="w-5 h-5 animate-spin" /> : user ? <Play className="w-5 h-5 fill-current" /> : <Lock className="w-5 h-5" />}{user ? "Start the mock" : "Sign in to take part"}</span>
                  </motion.button>
                )}
              </div>
            );
          })() : next ? (
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-white/70">Next mock</p>
                <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">{next.title}</h2>
                <p className="text-sm text-white/80 inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {fmtWhen(next.starts_at)}</p>
              </div>
              <CountdownTiles ms={Date.parse(next.starts_at) - now} />
            </div>
          ) : (
            <p className="text-sm text-white/85">The next All-India Mock will be announced here soon.</p>
          )}
        </div>
      </motion.header>

      {unavailable && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">All-India Mocks are being set up — check back soon.</div>
      )}

      {/* Your mock stats */}
      {user && (
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {([
            [Target, "Mocks taken", String(submitted.length), "from-indigo-500/15 to-indigo-500/5 text-indigo-600 dark:text-indigo-300"],
            [Trophy, "Best score", best !== null ? `${best}` : "—", "from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-300"],
            [TrendingUp, "Average", avg !== null ? `${avg}` : "—", "from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-300"],
            [Timer, "Next results", pendingResults ? fmtWhen(pendingResults.results_at) : "—", "from-fuchsia-500/15 to-fuchsia-500/5 text-fuchsia-600 dark:text-fuchsia-300"],
          ] as const).map(([Icon, k, v, tint], i) => (
            <motion.div key={k} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} whileHover={{ y: -3 }}
              className={`rounded-2xl p-4 bg-gradient-to-br ${tint} border border-[var(--border)]`}>
              <Icon className="w-5 h-5" />
              <p className="mt-2 text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{k}</p>
              <p className="text-lg sm:text-xl font-extrabold font-num text-[var(--text-primary)] truncate">{v}</p>
            </motion.div>
          ))}
        </section>
      )}

      {/* Weekly Challenge: same 10 questions for everyone this week, own leaderboard */}
      <motion.section id="challenge" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden card-glass rounded-3xl p-5 sm:p-6 border-2 border-amber-500/30">
        <div aria-hidden="true" className="absolute -top-12 -right-10 w-44 h-44 rounded-full bg-amber-400/15 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider"><Zap className="w-3.5 h-3.5" /> Weekly Challenge</span>
            <h2 className="mt-2 text-lg font-extrabold text-[var(--text-primary)]">{challengeTitle()}</h2>
            <p className="text-sm text-[var(--text-secondary)]">10 past-GATE questions, the same for everyone this week (Mon–Sun). Your best score counts{user ? "" : " — sign in to be ranked"}.</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={startChallenge} disabled={!!starting}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-lg shadow-amber-500/30 disabled:opacity-60 cursor-pointer">
              {starting === "challenge" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />} Take the challenge
            </motion.button>
            <button onClick={() => openLeaderboard()} className="inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] cursor-pointer"><Medal className="w-4 h-4 text-amber-500" /> Ranks</button>
          </div>
        </div>
      </motion.section>

      {/* Exam day, like the real GATE */}
      <section className="card-glass rounded-3xl p-5 sm:p-6">
        <h2 className="text-sm font-black uppercase tracking-[0.12em] text-[var(--text-muted)] mb-4">Exam day</h2>
        <DayTimeline mock={dayRef} now={now} />
        <p className="mt-4 flex items-start gap-1.5 text-[11px] text-[var(--text-muted)]"><ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-500 mt-0.5" /> Start any time in the first 30 minutes and still get the full 180 minutes. Tab switches, leaving full screen and timing are recorded; flagged attempts aren&apos;t ranked. Everyone&apos;s results are released together.</p>
      </section>

      {/* Upcoming */}
      {upcoming.length > (live ? 0 : 1) && (
        <section>
          <h2 className="mb-3 text-sm font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">Coming up</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.slice(live ? 0 : 1, (live ? 0 : 1) + 3).map((m, i) => {
              const d = new Date(m.starts_at);
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }}
                  className="card-glass rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-14 h-16 shrink-0 rounded-2xl bg-gradient-to-b from-violet-600 to-indigo-600 text-white flex flex-col items-center justify-center shadow-lg shadow-violet-500/25">
                    <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString(undefined, { month: "short" })}</span>
                    <span className="text-2xl font-extrabold leading-none font-num">{d.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[var(--text-primary)] truncate">{m.title.replace(/ — .*/, "")}</p>
                    <p className="text-xs text-[var(--text-muted)]">{d.toLocaleString(undefined, { weekday: "long", hour: "2-digit", minute: "2-digit" })}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-violet-600 dark:text-violet-300"><Clock className="w-3 h-3" /> in {fmtCountdown(Date.parse(m.starts_at) - now)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">Past mocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {past.map((m, i) => {
              const a = attemptFor(m.id);
              const released = now >= Date.parse(m.results_at);
              const pct = a?.server_score != null && released ? Math.max(0, Math.min(100, (Number(a.server_score) / Number(a.server_max ?? 100)) * 100)) : 0;
              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }} className="card-glass rounded-2xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-[var(--text-primary)] truncate">{m.title}</p>
                      <p className="text-xs text-[var(--text-muted)]">{a?.status === "submitted" ? (released ? `You scored ${a.server_score ?? "—"} / ${a.server_max ?? 100}` : "Submitted — score released with the results") : "You didn't take this one"}</p>
                    </div>
                    {released ? (
                      <Link href={`/mocks/results?id=${m.id}`} className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold shadow-md shadow-violet-500/25">
                        <BarChart3 className="w-4 h-4" /> Results
                      </Link>
                    ) : (
                      <span className="shrink-0 text-xs font-semibold text-[var(--text-muted)]">Results {fmtWhen(m.results_at)}</span>
                    )}
                  </div>
                  {released && a?.status === "submitted" && (
                    <div className="mt-3 h-2 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

/** d / h / m / s tiles; each digit rolls as it changes. */
function CountdownTiles({ ms }: { ms: number }) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const parts: [string, number][] = [["days", Math.floor(s / 86400)], ["hrs", Math.floor((s % 86400) / 3600)], ["min", Math.floor((s % 3600) / 60)], ["sec", s % 60]];
  return (
    <div className="flex gap-2" aria-label="Time until the mock starts">
      {parts.map(([label, v]) => (
        <div key={label} className="w-14 sm:w-16 rounded-2xl bg-white/15 border border-white/25 backdrop-blur px-1 py-2 text-center">
          <div className="relative h-8 overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={v} initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -24, opacity: 0 }} transition={{ duration: 0.3 }}
                className="absolute inset-0 text-2xl font-extrabold font-num">{String(v).padStart(2, "0")}</motion.span>
            </AnimatePresence>
          </div>
          <span className="text-[10px] font-bold uppercase text-white/70">{label}</span>
        </div>
      ))}
    </div>
  );
}

/** The mock day in four steps; on the day, the line fills as time passes. */
function DayTimeline({ mock, now }: { mock: Mock | null; now: number }) {
  const start = mock ? Date.parse(mock.starts_at) : null;
  const steps = [
    { icon: DoorOpen, label: "Paper opens", at: start },
    { icon: DoorClosed, label: "Entry closes", at: mock ? entryCloses(mock) : null },
    { icon: Send, label: "Last submissions", at: mock ? Date.parse(mock.ends_at) : null },
    { icon: Trophy, label: "Results & ranks", at: mock ? Date.parse(mock.results_at) : null },
  ];
  const fallback = ["10:00", "10:30", "13:30", "13:45"];
  const onDay = !!start && now >= start - 12 * 3600_000;
  const done = onDay ? steps.filter((st) => st.at !== null && now >= st.at).length : 0;
  const fill = done > 1 ? ((done - 1) / (steps.length - 1)) * 75 : 0;
  return (
    <div className="relative">
      <div className="absolute left-[12.5%] right-[12.5%] top-5 h-1 rounded-full bg-[var(--surface-secondary)]" />
      <motion.div className="absolute left-[12.5%] top-5 h-1 rounded-full bg-gradient-to-r from-emerald-400 to-violet-500" initial={{ width: 0 }} animate={{ width: `${fill}%` }} transition={{ duration: 1 }} />
      <ol className="relative grid grid-cols-4 gap-2">
        {steps.map((st, i) => {
          const reached = onDay && st.at !== null && now >= st.at;
          const Icon = st.icon;
          return (
            <li key={st.label} className="flex flex-col items-center text-center gap-1.5">
              <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.08 * i, type: "spring", stiffness: 300, damping: 18 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${reached ? "bg-gradient-to-br from-emerald-400 to-violet-500 text-white border-transparent shadow-lg shadow-violet-500/30" : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)]"}`}>
                <Icon className="w-4 h-4" />
              </motion.span>
              <span className="text-xs sm:text-sm font-extrabold font-num text-[var(--text-primary)]">{st.at !== null ? new Date(st.at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) : fallback[i]}</span>
              <span className="text-[10px] sm:text-xs text-[var(--text-muted)] leading-tight">{st.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
