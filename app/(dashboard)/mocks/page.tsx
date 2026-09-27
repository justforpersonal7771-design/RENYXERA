"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Trophy, Clock, CalendarDays, Play, Loader2, ShieldCheck, CheckCircle2, BarChart3, Radio, Lock } from "lucide-react";
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
interface BoardRow { rank: number; display_name: string; score: number; percentile: number; is_me: boolean; total: number }
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
  const [board, setBoard] = useState<{ mock: Mock; rows: BoardRow[] } | null>(null);

  const load = useCallback(async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const sb = createClient();
    const { data, error } = await sb.from("mock_events").select("id,title,starts_at,ends_at,results_at,question_count,duration_seconds,start_grace_minutes").order("starts_at", { ascending: false }).limit(24);
    if (error) { setUnavailable(true); setMocks([]); return; }
    setMocks(data as Mock[]);
    // Leaderboard: always shows the latest released mock (updates when the next results go out).
    const nowIso = new Date().toISOString();
    const latest = (data as Mock[]).filter((m) => m.results_at <= nowIso).sort((a, b) => b.results_at.localeCompare(a.results_at))[0];
    if (latest) {
      const { data: rows } = await sb.rpc("mock_leaderboard", { p_mock: latest.id, p_limit: 10 });
      setBoard({ mock: latest, rows: (rows as BoardRow[]) ?? [] });
    } else setBoard(null);
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

  if (mocks === null) return <div className="flex items-center justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>;

  return (
    <div className="w-full max-w-5xl mx-auto pb-10 space-y-6">
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_24px_60px_-20px_rgba(79,70,229,0.6)]">
        <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-cyan-300/25 blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <span className="w-12 h-12 shrink-0 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center"><Trophy className="w-6 h-6" /></span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">All-India Mock</h1>
            <p className="mt-1 text-sm text-white/85 max-w-2xl">Every Sunday, 10 AM – 1 PM IST: a fresh 65-question GATE CS paper in the official pattern, exactly 180 minutes. One attempt each; ranks and percentiles are released at 1:45 PM.</p>
          </div>
        </div>
      </motion.header>

      {unavailable && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">All-India Mocks are being set up — check back soon.</div>
      )}

      {/* Live now */}
      {live && (() => {
        const a = attemptFor(live.id);
        return (
          <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-3xl p-6 border-2 border-emerald-500/40">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1 min-w-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider">
                  <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}><Radio className="w-3.5 h-3.5" /></motion.span> Live now
                </span>
                <h2 className="mt-2 text-xl font-extrabold text-[var(--text-primary)]">{live.title}</h2>
                <p className="text-sm text-[var(--text-secondary)]">{live.question_count} questions · exactly {Math.round(live.duration_seconds / 60)} minutes · {now < entryCloses(live)
                  ? <>entry closes in <span className="font-num font-bold text-[var(--text-primary)]">{fmtCountdown(entryCloses(live) - now)}</span></>
                  : <>entry closed · results {fmtWhen(live.results_at)}</>}</p>
                <p className="mt-2 flex items-start gap-1.5 text-[11px] text-[var(--text-muted)]"><ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-500 mt-0.5" /> Like the real exam: 180 minutes that can&apos;t be paused. You can start until 30 minutes after the start time (in case of network or server trouble) and still get the full 180 minutes. Tab switches, leaving fullscreen and timing are recorded; flagged attempts aren&apos;t ranked.</p>
              </div>
              {a ? (
                a.status === "submitted" ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-secondary)] text-sm font-semibold text-[var(--text-secondary)]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Submitted — results at {fmtWhen(live.results_at)}
                  </span>
                ) : (
                  <Link href="/exam/session" className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-violet-500/30">
                    <Play className="w-5 h-5 fill-current" /> Continue your mock
                  </Link>
                )
              ) : now > entryCloses(live) ? (
                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--surface-secondary)] text-sm font-semibold text-[var(--text-muted)]"><Lock className="w-4 h-4" /> Entry closed</span>
              ) : (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => start(live)} disabled={!!starting}
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/30 disabled:opacity-60 cursor-pointer">
                  {starting === live.id ? <Loader2 className="w-5 h-5 animate-spin" /> : user ? <Play className="w-5 h-5 fill-current" /> : <Lock className="w-5 h-5" />}
                  {user ? "Start the mock" : "Sign in to take part"}
                </motion.button>
              )}
            </div>
          </motion.section>
        );
      })()}

      {/* Leaderboard — always visible; shows the latest released mock */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glass rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-[var(--text-primary)] inline-flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Leaderboard</h2>
            <p className="text-xs text-[var(--text-muted)] truncate">{board ? `${board.mock.title} · ${(board.rows[0]?.total ?? 0).toLocaleString("en-IN")} ranked` : "Ranks appear here when the first results are released"}</p>
          </div>
          {board && (
            <Link href={`/mocks/results?id=${board.mock.id}`} className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)] hover:border-violet-500/50 transition-colors">
              <BarChart3 className="w-4 h-4" /> Full list
            </Link>
          )}
        </div>
        {board && board.rows.length > 0 ? (
          <ol className="divide-y divide-[var(--border-subtle)]">
            {board.rows.map((r, i) => (
              <li key={`${r.rank}-${i}`} className={`flex items-center gap-3 py-2 px-2 rounded-lg ${r.is_me ? "bg-violet-500/10" : ""}`}>
                <span className="w-10 font-num font-bold text-[var(--text-primary)]">#{r.rank}</span>
                <span className="flex-1 min-w-0 truncate text-sm text-[var(--text-primary)]">{r.display_name}{r.is_me && <span className="ml-2 text-[10px] font-bold text-violet-600 dark:text-violet-300">You</span>}</span>
                <span className="font-num font-semibold text-sm">{r.score}</span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-[var(--text-muted)] py-3">{board ? "No ranked attempts in the latest mock." : upcoming[0] || live ? `Next results: ${fmtWhen((live ?? upcoming[0]).results_at)}` : "No mocks yet."}</p>
        )}
      </motion.section>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">Coming up</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcoming.slice(0, 4).map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="card-glass rounded-2xl p-4">
                <p className="font-bold text-[var(--text-primary)]">{m.title}</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)] inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {fmtWhen(m.starts_at)}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-bold"><Clock className="w-3.5 h-3.5" /> Starts in <span className="font-num">{fmtCountdown(Date.parse(m.starts_at) - now)}</span></p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Past */}
      {past.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-black uppercase tracking-[0.12em] text-[var(--text-muted)]">Past mocks</h2>
          <div className="card-glass rounded-2xl divide-y divide-[var(--border-subtle)]">
            {past.map((m) => {
              const a = attemptFor(m.id);
              const released = now >= Date.parse(m.results_at);
              return (
                <div key={m.id} className="flex items-center gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text-primary)] truncate">{m.title}</p>
                    <p className="text-xs text-[var(--text-muted)]">{a?.status === "submitted" ? (released ? `You scored ${a.server_score ?? "—"} / ${a.server_max ?? 100}` : "Submitted — score released with the results") : "You didn't take this one"}</p>
                  </div>
                  {released ? (
                    <Link href={`/mocks/results?id=${m.id}`} className="shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-primary)] hover:border-violet-500/50 transition-colors">
                      <BarChart3 className="w-4 h-4" /> Leaderboard
                    </Link>
                  ) : (
                    <span className="shrink-0 text-xs text-[var(--text-muted)]">Results {fmtWhen(m.results_at)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {!unavailable && !live && upcoming.length === 0 && past.length === 0 && (
        <p className="text-center text-sm text-[var(--text-muted)] py-10">The first All-India Mock will be announced here soon.</p>
      )}
    </div>
  );
}
