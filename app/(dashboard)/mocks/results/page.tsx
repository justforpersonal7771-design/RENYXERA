"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Crown, Loader2, Medal, ShieldAlert, Trophy, Users } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";

interface Row { rank: number; display_name: string; score: number; percentile: number; is_me: boolean; total: number }
interface Mock { id: string; title: string; results_at: string; ends_at: string }

const FLAG_LABELS: Record<string, string> = {
  no_start_token: "started without a server check-in",
  over_time: "submitted after the time limit",
  long_pause: "paused for a very long time",
  question_set_mismatch: "answers outside the mock's paper",
  tab_switches: "switched tabs many times",
  fullscreen_exits: "left fullscreen several times",
  rapid_answers: "many answers in under 5 seconds",
};

function Results() {
  const id = useSearchParams()?.get("id") ?? "";
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const toast = useToastStore((s) => s.show);
  const [mock, setMock] = useState<Mock | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [myFlags, setMyFlags] = useState<{ code: string }[] | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "pending" | "missing">("loading");

  const load = useCallback(async () => {
    const { createClient } = await import("@/lib/supabase/client");
    const sb = createClient();
    const { data: m } = await sb.from("mock_events").select("id,title,results_at,ends_at").eq("id", id).maybeSingle();
    if (!m) return setState("missing");
    setMock(m as Mock);
    if (Date.now() < Date.parse(m.results_at)) return setState("pending");
    const { data } = await sb.rpc("mock_leaderboard", { p_mock: id, p_limit: 50 });
    setRows((data as Row[]) ?? []);
    if (user) {
      const { data: a } = await sb.from("exam_attempts").select("integrity_flags,status").eq("mock_id", id).maybeSingle();
      setMyFlags(a ? ((a.integrity_flags as { code: string }[]) ?? []) : null);
    }
    setState("ready");
  }, [id, user]);
  useEffect(() => { if (id) void load(); else setState("missing"); }, [id, load]);

  const setDisplay = async (next: "anonymous" | "username" | "username_student_id") => {
    if (!user || !profile) return;
    const { createClient } = await import("@/lib/supabase/client");
    const { error } = await createClient().from("profiles").update({ leaderboard_display: next }).eq("id", user.id);
    if (error) return toast("Couldn't update that setting.", "error");
    setProfile({ ...profile, leaderboard_display: next });
    toast("Leaderboard display updated", "success");
    void load();
  };

  if (state === "loading") return <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>;
  if (state === "missing") return <p className="text-center py-24 text-sm text-[var(--text-muted)]">This mock doesn&apos;t exist. <Link href="/mocks" className="text-violet-600 font-semibold">See all mocks</Link></p>;

  const me = rows?.find((r) => r.is_me);
  const total = rows?.[0]?.total ?? 0;

  return (
    <div className="w-full max-w-4xl mx-auto pb-10 space-y-5">
      <Link href="/mocks" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><ArrowLeft className="w-4 h-4" /> All mocks</Link>
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">{mock?.title}</h1>
        <p className="text-sm text-[var(--text-secondary)] inline-flex items-center gap-1.5"><Users className="w-4 h-4" /> {state === "ready" ? `${total.toLocaleString("en-IN")} ranked aspirants` : "Results not released yet"}</p>
      </div>

      {state === "pending" && (
        <div className="card-glass rounded-3xl p-8 text-center">
          <Trophy className="w-10 h-10 mx-auto text-violet-500" />
          <p className="mt-3 font-bold text-[var(--text-primary)]">Ranks are released after the window closes</p>
          <p className="text-sm text-[var(--text-secondary)]">{mock && new Date(mock.results_at).toLocaleString(undefined, { weekday: "long", hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      )}

      {state === "ready" && (
        <>
          {me ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl p-6 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-[0_18px_50px_-20px_rgba(79,70,229,0.6)] grid grid-cols-3 gap-4 text-center">
              {[["All-India rank", `#${me.rank.toLocaleString("en-IN")}`], ["Percentile", `${me.percentile}`], ["Score", `${me.score}`]].map(([k, v]) => (
                <div key={k}><p className="text-[10px] font-black uppercase tracking-wider text-white/75">{k}</p><p className="text-2xl sm:text-3xl font-extrabold font-num">{v}</p></div>
              ))}
            </motion.div>
          ) : myFlags && myFlags.length > 0 ? (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200 flex gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p>Your attempt isn&apos;t ranked because it was flagged: {myFlags.map((f) => FLAG_LABELS[f.code] ?? f.code).join(", ")}. Your score still counts in your own analytics.</p>
            </div>
          ) : user ? (
            <p className="text-sm text-[var(--text-muted)]">You didn&apos;t take part in this mock.</p>
          ) : null}

          {user && profile && (
            <div className="card-glass rounded-2xl p-4">
              <p className="text-xs font-bold text-[var(--text-secondary)] mb-2">How you appear on leaderboards</p>
              <div role="radiogroup" className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {([
                  ["anonymous", "Anonymous", `Aspirant ${(profile.student_id ?? "0000").slice(-4)}`],
                  ["username", "Username", `@${profile.username ?? "username"}`],
                  ["username_student_id", "Username + student ID", `@${profile.username ?? "username"} · ${profile.student_id ?? ""}`],
                ] as const).map(([v, label, preview]) => {
                  const on = (profile.leaderboard_display ?? "anonymous") === v;
                  return (
                    <button key={v} role="radio" aria-checked={on} onClick={() => setDisplay(v)}
                      className={`text-left rounded-xl border px-3 py-2 transition-colors cursor-pointer ${on ? "border-violet-500 bg-violet-500/10" : "border-[var(--border)] hover:border-violet-500/40"}`}>
                      <span className="block text-sm font-semibold text-[var(--text-primary)]">{label}</span>
                      <span className="block text-[11px] font-mono text-[var(--text-muted)] truncate">{preview}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-[11px] text-[var(--text-muted)]">Display only — your username and student ID can&apos;t be used to sign in, look you up or change anything.</p>
            </div>
          )}

          <div className="card-glass rounded-3xl overflow-hidden">
            {(rows ?? []).length === 0 ? (
              <p className="p-8 text-center text-sm text-[var(--text-muted)]">No ranked attempts yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead><tr className="text-left text-[10px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
                  <th className="px-4 py-3 w-20">Rank</th><th className="px-4 py-3">Aspirant</th><th className="px-4 py-3 text-right">Score</th><th className="px-4 py-3 text-right hidden sm:table-cell">Percentile</th>
                </tr></thead>
                <tbody>
                  {rows!.map((r, i) => (
                    <motion.tr key={`${r.rank}-${i}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.4) }}
                      className={`border-b border-[var(--border-subtle)] last:border-0 ${r.is_me ? "bg-violet-500/10" : ""}`}>
                      <td className="px-4 py-2.5 font-num font-bold text-[var(--text-primary)]">
                        <span className="inline-flex items-center gap-1.5">{r.rank === 1 ? <Crown className="w-4 h-4 text-amber-500" /> : r.rank <= 3 ? <Medal className="w-4 h-4 text-slate-400" /> : null}{r.rank}</span>
                      </td>
                      <td className="px-4 py-2.5 text-[var(--text-primary)]">{r.display_name}{r.is_me && <span className="ml-2 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/20 text-violet-700 dark:text-violet-300">You</span>}</td>
                      <td className="px-4 py-2.5 text-right font-num font-semibold">{r.score}</td>
                      <td className="px-4 py-2.5 text-right font-num text-[var(--text-secondary)] hidden sm:table-cell">{r.percentile}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Only on-time, unflagged attempts are ranked. Percentile = share of ranked aspirants you scored above.</p>
        </>
      )}
    </div>
  );
}

export default function MockResultsPage() {
  return <Suspense fallback={<div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>}><Results /></Suspense>;
}
