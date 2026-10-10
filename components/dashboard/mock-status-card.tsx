"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentBranch } from "@/lib/branch/current";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Play, Hourglass, CloudOff, Medal, ShieldAlert, CalendarDays, ChevronRight, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { openLeaderboard } from "@/components/layout/leaderboard-panel";
import { serverNow } from "@/lib/time/server-time";

type Mock = { id: string; title: string; starts_at: string; ends_at: string; results_at: string };
type Attempt = { mock_id: string; status: string; submitted_at: string | null };
type MyResult = { status: string; marks: number | null; max_marks: number | null; air: number | null; candidates: number | null; percentile: number | null; gate_score: number | null; qualified: boolean | null };

type View =
  | { kind: "loading" }
  | { kind: "in_progress"; mock: Mock }
  | { kind: "waiting"; mock: Mock }
  | { kind: "delayed"; mock: Mock }
  | { kind: "result"; mock: Mock; r: MyResult }
  | { kind: "next"; mock: Mock }
  | { kind: "empty" };

const fmt = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  return d ? `${d}d ${h}h ${m}m` : `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

/**
 * All-India Mock status for the dashboard: continue an attempt, a live countdown to the
 * results after submitting, a clear "taking longer than expected" state if results are
 * late (retries on its own), then rank / percentile / GATE score once released.
 */
export function MockStatusCard() {
  const user = useAuthStore((s) => s.user);
  const [view, setView] = useState<View>({ kind: "loading" });
  const [now, setNow] = useState(0); // set on mount so server and first client render match

  const load = useCallback(async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const sb = createClient();
      const { data: mocks } = await sb.from("mock_events").select("id,title,starts_at,ends_at,results_at").eq("branch_code", getCurrentBranch()).order("starts_at", { ascending: false }).limit(12);
      const list = (mocks as Mock[]) ?? [];
      const t = serverNow();
      let mine: Attempt[] = [];
      if (user) {
        const { data } = await sb.from("exam_attempts").select("mock_id,status,submitted_at").not("mock_id", "is", null).order("server_started_at", { ascending: false }).limit(5);
        mine = (data as Attempt[]) ?? [];
      }
      const latest = mine.map((a) => ({ a, m: list.find((m) => m.id === a.mock_id) })).find((x) => x.m);
      if (latest?.m) {
        const { a, m } = latest;
        if (a.status === "in_progress" && t < Date.parse(m.ends_at)) return setView({ kind: "in_progress", mock: m });
        if (t < Date.parse(m.results_at)) return setView({ kind: "waiting", mock: m });
        // Show the latest result for a week; after that fall through to "next mock".
        if (t - Date.parse(m.results_at) < 7 * 86400_000) {
          const { data: r, error } = await sb.rpc("mock_my_result", { p_mock: m.id });
          const row = ((r as MyResult[] | null) ?? [])[0];
          if (error || !row || row.status === "pending") return setView({ kind: "delayed", mock: m });
          return setView({ kind: "result", mock: m, r: row });
        }
      }
      const upcoming = list.filter((m) => Date.parse(m.starts_at) > t || (Date.parse(m.starts_at) <= t && t < Date.parse(m.ends_at))).sort((x, y) => Date.parse(x.starts_at) - Date.parse(y.starts_at))[0];
      setView(upcoming ? { kind: "next", mock: upcoming } : { kind: "empty" });
    } catch {
      setView((v) => (v.kind === "loading" ? { kind: "empty" } : v));
    }
  }, [user]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setNow(serverNow()); const t = setInterval(() => setNow(serverNow()), 1000); return () => clearInterval(t); }, []);
  // Re-check when the results are due, and every 30 s while they're late.
  useEffect(() => {
    if (view.kind === "waiting") {
      const wait = Date.parse(view.mock.results_at) - serverNow();
      if (wait < 24 * 3600_000) { const t = setTimeout(() => void load(), Math.max(0, wait) + 1500); return () => clearTimeout(t); }
    }
    if (view.kind === "delayed") { const t = setInterval(() => void load(), 30_000); return () => clearInterval(t); }
  }, [view, load]);

  const shell = "card-glass rounded-3xl p-5 shadow-sm relative overflow-hidden";
  const title = (
    <h3 className="font-extrabold text-xs uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 mb-3">
      <Trophy className="w-3.5 h-3.5 text-amber-500" /> All-India Mock
    </h3>
  );

  return (
    <div className={shell}>
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative">
        {title}
        <AnimatePresence mode="wait">
          <motion.div key={view.kind} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.25 }}>
            {view.kind === "loading" && <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-violet-500" /></div>}

            {view.kind === "in_progress" && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-[var(--text-primary)]">{view.mock.title}</p>
                <p className="text-xs text-[var(--text-secondary)]">Your paper is in progress — the clock keeps running.</p>
                <Link href="/exam/session" className="inline-flex w-full items-center justify-center gap-2 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold shadow-md shadow-emerald-500/25"><Play className="w-4 h-4 fill-current" /> Continue the mock</Link>
              </div>
            )}

            {view.kind === "waiting" && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">{view.mock.title}</p>
                <p className="text-xs text-[var(--text-secondary)] inline-flex items-center gap-1.5"><Hourglass className="w-3.5 h-3.5 text-violet-500" /> Submitted · results in</p>
                <p className="text-3xl font-extrabold font-num text-[var(--text-primary)]" aria-live="polite">{fmt(Date.parse(view.mock.results_at) - now)}</p>
                <div className="h-1.5 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500" animate={{ width: `${Math.min(100, Math.max(4, 100 - ((Date.parse(view.mock.results_at) - now) / (Date.parse(view.mock.results_at) - Date.parse(view.mock.starts_at))) * 100))}%` }} />
                </div>
                <p className="text-[11px] text-[var(--text-muted)]">Everyone&apos;s results are released together at {new Date(view.mock.results_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}.</p>
              </div>
            )}

            {view.kind === "delayed" && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">{view.mock.title}</p>
                <p className="text-xs text-amber-700 dark:text-amber-300 inline-flex items-start gap-1.5"><CloudOff className="w-4 h-4 shrink-0" /> Results are taking a little longer than expected. They&apos;ll appear here automatically — no need to refresh.</p>
                <p className="text-[11px] text-[var(--text-muted)] inline-flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Checking again every 30 seconds</p>
              </div>
            )}

            {view.kind === "result" && (
              <div className="space-y-3">
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">{view.mock.title}</p>
                {view.r.status === "ranked" ? (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {([["AIR", `#${view.r.air}`], ["Percentile", `${view.r.percentile}`], ["Marks", `${view.r.marks}`]] as const).map(([k, v], i) => (
                      <motion.div key={k} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 * i }} className="rounded-xl bg-[var(--surface-secondary)]/70 py-2">
                        <p className="text-[9px] font-black uppercase tracking-wider text-[var(--text-muted)]">{k}</p>
                        <p className="text-lg font-extrabold font-num text-[var(--text-primary)]">{v}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-rose-700 dark:text-rose-300 inline-flex items-start gap-1.5"><ShieldAlert className="w-4 h-4 shrink-0" /> {view.r.status === "flagged" ? "Disqualified — not ranked." : view.r.status === "late" ? "Submitted after the paper closed — not ranked." : "You didn't take this mock."}{view.r.marks !== null ? ` You scored ${view.r.marks}.` : ""}</p>
                )}
                {view.r.gate_score !== null && <p className="text-xs text-[var(--text-secondary)]">GATE score <span className="font-bold font-num text-[var(--text-primary)]">{view.r.gate_score}</span>{view.r.qualified ? " · qualified" : ""}</p>}
                <div className="flex gap-2">
                  <Link href={`/mocks/results?id=${view.mock.id}`} className="flex-1 inline-flex items-center justify-center gap-1 h-9 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold">Full results <ChevronRight className="w-3.5 h-3.5" /></Link>
                  <button onClick={() => openLeaderboard()} className="inline-flex items-center justify-center gap-1 h-9 px-3 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] cursor-pointer"><Medal className="w-3.5 h-3.5 text-amber-500" /> Ranks</button>
                </div>
              </div>
            )}

            {view.kind === "next" && (
              <div className="space-y-2">
                <p className="text-sm font-bold text-[var(--text-primary)] truncate">{view.mock.title}</p>
                <p className="text-xs text-[var(--text-secondary)] inline-flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> {Date.parse(view.mock.starts_at) <= now ? "Live now" : `Starts in ${fmt(Date.parse(view.mock.starts_at) - now)}`}</p>
                <Link href="/mocks" className="inline-flex w-full items-center justify-center gap-1 h-9 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] hover:border-violet-500/50">Open All-India Mock <ChevronRight className="w-3.5 h-3.5" /></Link>
              </div>
            )}

            {view.kind === "empty" && (
              <div className="space-y-2">
                <p className="text-xs text-[var(--text-secondary)]">A free GATE-pattern mock every Sunday, ranked across India.</p>
                <Link href="/mocks" className="inline-flex w-full items-center justify-center gap-1 h-9 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] hover:border-violet-500/50">See the schedule <ChevronRight className="w-3.5 h-3.5" /></Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
