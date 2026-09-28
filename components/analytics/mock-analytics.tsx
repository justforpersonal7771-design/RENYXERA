"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Trophy, Medal, TrendingUp, Target, ChevronRight, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";

type Mock = { id: string; title: string; results_at: string };
type Row = { mock: Mock; status: string; marks: number | null; air: number | null; candidates: number | null; percentile: number | null; gate_score: number | null };

/** Analytics → All-India Mock history (released mocks the learner took). */
export function MockAnalytics() {
  const user = useAuthStore((s) => s.user);
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    if (!user) { setRows([]); return; }
    let cancelled = false;
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const sb = createClient();
        const { data: att } = await sb.from("exam_attempts").select("mock_id").not("mock_id", "is", null).eq("status", "submitted");
        const ids = [...new Set(((att as { mock_id: string }[]) ?? []).map((a) => a.mock_id))];
        if (!ids.length) { if (!cancelled) setRows([]); return; }
        const { data: mocks } = await sb.from("mock_events").select("id,title,results_at").in("id", ids).lte("results_at", new Date().toISOString()).order("results_at", { ascending: true }).limit(10);
        const out: Row[] = [];
        for (const m of (mocks as Mock[]) ?? []) {
          const { data } = await sb.rpc("mock_my_result", { p_mock: m.id });
          const r = ((data as Omit<Row, "mock">[] | null) ?? [])[0];
          if (r) out.push({ mock: m, ...r });
        }
        if (!cancelled) setRows(out);
      } catch { if (!cancelled) setRows([]); }
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (rows === null) return null;

  const ranked = rows.filter((r) => r.status === "ranked");
  const bestAir = ranked.length ? Math.min(...ranked.map((r) => Number(r.air))) : null;
  const bestPct = ranked.length ? Math.max(...ranked.map((r) => Number(r.percentile))) : null;
  const avg = rows.filter((r) => r.marks !== null).length
    ? Math.round((rows.filter((r) => r.marks !== null).reduce((s, r) => s + Number(r.marks), 0) / rows.filter((r) => r.marks !== null).length) * 10) / 10
    : null;

  return (
    <section className="card-glass rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-sm tracking-tight text-[var(--text-primary)] flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> All-India Mock performance</h3>
        <Link href="/mocks" className="text-xs font-semibold text-violet-600 dark:text-violet-400 inline-flex items-center gap-0.5">Mocks <ChevronRight className="w-3.5 h-3.5" /></Link>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-6 text-center">
          <Medal className="w-8 h-8 mx-auto text-violet-400" />
          <p className="mt-2 text-sm font-semibold text-[var(--text-primary)]">No mock results yet</p>
          <p className="text-xs text-[var(--text-muted)]">Take a Sunday All-India Mock — your rank, percentile and GATE score trend will build up here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {([
              [Target, "Mocks", String(rows.length)],
              [Medal, "Best AIR", bestAir !== null ? `#${bestAir}` : "—"],
              [TrendingUp, "Best percentile", bestPct !== null ? String(bestPct) : "—"],
              [Trophy, "Avg marks", avg !== null ? String(avg) : "—"],
            ] as const).map(([Icon, k, v], i) => (
              <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-xl bg-[var(--surface-secondary)]/60 p-3">
                <Icon className="w-4 h-4 text-violet-500" />
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{k}</p>
                <p className="text-lg font-extrabold font-num text-[var(--text-primary)]">{v}</p>
              </motion.div>
            ))}
          </div>
          <ol className="space-y-2.5">
            {rows.map((r, i) => {
              const pct = Math.max(0, Math.min(100, Number(r.marks ?? 0)));
              return (
                <li key={r.mock.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-1 items-center">
                  <Link href={`/mocks/results?id=${r.mock.id}`} className="text-xs font-semibold text-[var(--text-primary)] truncate hover:text-violet-600">{r.mock.title}</Link>
                  <span className="text-xs font-num text-[var(--text-secondary)] text-right">
                    {r.status === "ranked" ? <>#{r.air} · {r.percentile}%ile · <b className="text-[var(--text-primary)]">{r.marks}</b></> : r.status === "flagged" ? <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400"><ShieldAlert className="w-3 h-3" /> Disqualified</span> : "Not ranked"}
                  </span>
                  <div className="col-span-2 h-2 rounded-full bg-[var(--surface-secondary)] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.06, ease: "easeOut" }}
                      className={`h-full rounded-full ${r.status === "ranked" ? "bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500" : "bg-slate-400/60"}`} />
                  </div>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </section>
  );
}
