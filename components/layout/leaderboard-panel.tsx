"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, LayoutGroup } from "motion/react";
import { Trophy, X, ArrowUp, ArrowDown, Sparkles, Crown, Medal, Loader2, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";

type Row = { rank: number; prev_rank: number | null; display_name: string; score: number; is_me: boolean; total: number; tests?: number; percentile?: number };
type Mock = { id: string; title: string; results_at: string };
type Tab = "practice" | "mock";

const SEEN_KEY = "renyxera_seen_results_at";
const OPEN_EVENT = "renyxera:open-leaderboard";
/** Opens the navbar leaderboard panel from anywhere (e.g. the Mocks page). */
export const openLeaderboard = () => window.dispatchEvent(new Event(OPEN_EVENT));
const readSeen = () => { try { return localStorage.getItem(SEEN_KEY) ?? ""; } catch { return ""; } };
const writeSeen = (v: string) => { try { localStorage.setItem(SEEN_KEY, v); } catch { /* private mode */ } };

/**
 * Navbar Leaderboard: animated trophy that lights up (dot + one-time toast) when new
 * All-India Mock results are published, and a panel with two boards — weekly Practice and
 * Mocks — where rows start in last period's order and then slide to their new places, with
 * ▲/▼ badges for who moved.
 */
export function LeaderboardButton() {
  const user = useAuthStore((s) => s.user);
  const toast = useToastStore((s) => s.show);
  const [open, setOpen] = useState(false);
  const [released, setReleased] = useState<Mock[]>([]);
  const [fresh, setFresh] = useState(false);
  const toasted = useRef(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const loadMocks = useCallback(async () => {
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const { data } = await createClient().from("mock_events").select("id,title,results_at").order("results_at", { ascending: false }).limit(20);
      const now = Date.now();
      const list = ((data as Mock[]) ?? []).filter((m) => Date.parse(m.results_at) <= now);
      setReleased(list);
      const latest = list[0];
      const seen = readSeen();
      if (latest && latest.results_at > seen) {
        setFresh(true);
        // First visit ever: just remember, don't announce old results.
        if (!seen) writeSeen(latest.results_at);
        else if (!toasted.current) { toasted.current = true; toast(`Results are out: ${latest.title} — open the leaderboard to see your rank.`, "success"); }
      }
      // Light up the moment the next results are released while the app is open.
      const next = ((data as Mock[]) ?? []).map((m) => Date.parse(m.results_at)).filter((t) => t > now).sort((a, b) => a - b)[0];
      return next && next - now < 24 * 3600_000 ? next - now : null;
    } catch { return null; }
  }, [toast]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const run = async () => {
      const wait = await loadMocks();
      if (wait !== null) timer = setTimeout(run, wait + 2000);
    };
    void run();
    return () => clearTimeout(timer);
  }, [loadMocks]);

  const openPanel = useCallback(() => {
    setOpen(true);
    if (released[0]) writeSeen(released[0].results_at);
    setFresh(false);
  }, [released]);
  useEffect(() => {
    window.addEventListener(OPEN_EVENT, openPanel);
    return () => window.removeEventListener(OPEN_EVENT, openPanel);
  }, [openPanel]);

  return (
    <>
      <motion.button
        onClick={openPanel}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={`nav-act z-10 relative p-2 rounded-lg transition-colors cursor-pointer overflow-hidden group ${
          open ? "text-white bg-indigo-600 shadow-sm" : fresh ? "text-amber-600 dark:text-amber-400 bg-amber-500/15 ring-1 ring-amber-500/40" : "text-[var(--text-secondary)] hover:text-amber-500"
        }`}
        aria-label={fresh ? "Leaderboard — new results published" : "Leaderboard"}
        title={fresh ? "New results published" : "Leaderboard"}
      >
        <motion.span
          className="block"
          animate={fresh ? { rotate: [0, -14, 12, -8, 6, 0], y: [0, -2, 0] } : { rotate: 0 }}
          transition={fresh ? { duration: 1.1, repeat: Infinity, repeatDelay: 2.2 } : { duration: 0.2 }}
        >
          <Trophy className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12" />
        </motion.span>
        {/* Glint that sweeps across on hover */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent group-hover:left-[150%] transition-all duration-700" />
        {fresh && (
          <span className="absolute -top-0.5 -right-0.5 flex w-2.5 h-2.5">
            <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
            <span className="relative w-2.5 h-2.5 rounded-full bg-rose-500 border border-[var(--surface)]" />
          </span>
        )}
      </motion.button>
      {/* Portalled to <body>: the navbar is its own containing block, which would pin the
          panel to the navbar instead of the screen. */}
      {mounted && createPortal(
        <AnimatePresence>
          {open && <LeaderboardPanel key="lb" mocks={released} signedIn={!!user} onClose={() => setOpen(false)} />}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function Movement({ rank, prev }: { rank: number; prev: number | null }) {
  if (prev === null) return <span className="inline-flex items-center gap-0.5 text-[10px] font-black uppercase text-sky-600 dark:text-sky-400"><Sparkles className="w-3 h-3" />New</span>;
  const d = prev - rank;
  if (d === 0) return <span className="text-[11px] font-bold text-[var(--text-muted)]">–</span>;
  const up = d > 0;
  return (
    <motion.span
      initial={{ opacity: 0, y: up ? 6 : -6, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.9, type: "spring", stiffness: 420, damping: 18 }}
      className={`inline-flex items-center gap-0.5 text-[11px] font-black font-num ${up ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
    >
      {up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}{Math.abs(d)}
    </motion.span>
  );
}

function LeaderboardPanel({ mocks, signedIn, onClose }: { mocks: Mock[]; signedIn: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<Tab>(mocks.length ? "mock" : "practice");
  const [mockId, setMockId] = useState<string | null>(mocks[0]?.id ?? null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setRows(null); setSettled(false);
    (async () => {
      const { createClient } = await import("@/lib/supabase/client");
      const sb = createClient();
      const { data } = tab === "practice"
        ? await sb.rpc("practice_leaderboard", { p_days: 7, p_limit: 50 })
        : mockId ? await sb.rpc("mock_leaderboard_moves", { p_mock: mockId, p_limit: 50 }) : { data: [] };
      if (cancelled) return;
      setRows(((data as Row[]) ?? []).map((r) => ({ ...r, rank: Number(r.rank), prev_rank: r.prev_rank === null ? null : Number(r.prev_rank), total: Number(r.total) })));
      // Show last period's order first, then let everyone slide to where they are now.
      setTimeout(() => { if (!cancelled) setSettled(true); }, 650);
    })();
    return () => { cancelled = true; };
  }, [tab, mockId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const ordered = useMemo(() => {
    if (!rows) return [];
    if (settled) return rows;
    // Before settling: previous order (newcomers after everyone who had a rank).
    return [...rows].sort((a, b) => (a.prev_rank ?? 1e9) - (b.prev_rank ?? 1e9) || a.rank - b.rank);
  }, [rows, settled]);
  const me = rows?.find((r) => r.is_me);
  const mock = mocks.find((m) => m.id === mockId);

  return (
    <div className="fixed inset-0 z-[300] flex items-end sm:items-start sm:justify-end sm:p-4 sm:pt-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <motion.section
        role="dialog" aria-label="Leaderboard"
        initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="relative w-full sm:w-[420px] max-h-[85dvh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl overflow-hidden"
      >
        <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white overflow-hidden">
          <motion.div aria-hidden="true" className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-amber-300/30 blur-2xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity }} />
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <motion.span initial={{ rotate: -20, scale: 0.6 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 12 }} className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-200" />
              </motion.span>
              <div>
                <h2 className="text-lg font-extrabold leading-tight">Leaderboard</h2>
                <p className="text-xs text-white/80">{tab === "practice" ? "Marks scored in practice · last 7 days" : mock ? mock.title : "All-India Mock"}</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close leaderboard" className="p-1.5 rounded-lg hover:bg-white/15 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          <div role="tablist" className="relative mt-4 grid grid-cols-2 gap-1 p-1 rounded-xl bg-white/15">
            {(["mock", "practice"] as Tab[]).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className="relative py-1.5 text-xs font-bold rounded-lg cursor-pointer">
                {tab === t && <motion.span layoutId="lb-tab" className="absolute inset-0 rounded-lg bg-white shadow" transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                <span className={`relative ${tab === t ? "text-violet-700" : "text-white"}`}>{t === "mock" ? "All-India Mock" : "Practice (week)"}</span>
              </button>
            ))}
          </div>
          {me && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="relative mt-3 flex items-center justify-between rounded-xl bg-white/15 px-3 py-2 text-sm">
              <span className="font-semibold">Your rank</span>
              <span className="flex items-center gap-2 font-num font-extrabold">#{me.rank}<Movement rank={me.rank} prev={me.prev_rank} /></span>
            </motion.div>
          )}
        </div>

        {tab === "mock" && mocks.length > 1 && (
          <div className="px-4 pt-3">
            <label className="relative block">
              <span className="sr-only">Choose a mock</span>
              <select value={mockId ?? ""} onChange={(e) => setMockId(e.target.value)} className="w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 pr-8 text-sm font-semibold text-[var(--text-primary)] cursor-pointer">
                {mocks.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 w-4 h-4 text-[var(--text-muted)]" />
            </label>
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-3 py-3">
          {rows === null ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-violet-500" /></div>
          ) : rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-[var(--text-muted)]">
              {tab === "mock" ? (mocks.length ? "No ranked attempts in this mock." : "Mock ranks appear here when the first results are published.") : signedIn ? "No practice scored this week yet — take a test to get on the board." : "Sign in and take a test to join the board."}
            </p>
          ) : (
            <LayoutGroup>
              <ol className="space-y-1.5">
                {ordered.map((r) => (
                  <motion.li
                    layout
                    key={`${r.display_name}-${r.rank}-${r.score}`}
                    transition={{ layout: { type: "spring", stiffness: 260, damping: 30 } }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 border ${r.is_me ? "border-violet-500/50 bg-violet-500/10 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]" : "border-transparent bg-[var(--surface-secondary)]/50"}`}
                  >
                    <span className="w-9 shrink-0 font-num font-extrabold text-[var(--text-primary)] inline-flex items-center gap-1">
                      {settled && r.rank === 1 ? <Crown className="w-4 h-4 text-amber-500" /> : settled && r.rank <= 3 ? <Medal className="w-4 h-4 text-slate-400" /> : null}
                      {r.rank}
                    </span>
                    <span className="flex-1 min-w-0 truncate text-sm text-[var(--text-primary)]">
                      {r.display_name}{r.is_me && <span className="ml-1.5 text-[10px] font-bold text-violet-600 dark:text-violet-300">You</span>}
                    </span>
                    <span className="w-10 text-right">{settled && <Movement rank={r.rank} prev={r.prev_rank} />}</span>
                    <span className="w-12 text-right font-num font-bold text-sm text-[var(--text-primary)]">{r.score}</span>
                  </motion.li>
                ))}
              </ol>
            </LayoutGroup>
          )}
        </div>

        <div className="px-4 py-3 border-t border-[var(--border-subtle)] flex items-center justify-between gap-3 text-[11px] text-[var(--text-muted)]">
          <span>{tab === "mock" ? "On-time, unflagged attempts · equal marks share a rank" : "Your display name is set on any leaderboard page"}</span>
          {tab === "mock" && mockId && <Link href={`/mocks/results?id=${mockId}`} onClick={onClose} className="shrink-0 font-semibold text-violet-600 dark:text-violet-400">Full results</Link>}
        </div>
      </motion.section>
    </div>
  );
}
