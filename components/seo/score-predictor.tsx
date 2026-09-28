"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { CheckCircle2, XCircle, Play } from "lucide-react";
import { CALIBRATION_LABEL, calibratedRankForMarks, gateScore, qualifyingMarks, rankBandForMarks, type Category } from "@/lib/calibration";

const CATS: [Category, string][] = [["general", "General"], ["obc_ncl_ews", "OBC-NCL / EWS"], ["sc_st_pwd", "SC / ST / PwD"]];

/** Free tool (6A): GATE CS marks → GATE score, likely AIR range and qualifying status. */
export function ScorePredictor() {
  const [marks, setMarks] = useState(45);
  const [cat, setCat] = useState<Category>("general");
  const r = useMemo(() => {
    const m = Math.max(0, Math.min(100, marks));
    const q = qualifyingMarks(cat);
    const band = rankBandForMarks(m);
    return { m, q, qualified: m >= q, score: gateScore(m), rank: calibratedRankForMarks(m), band };
  }, [marks, cat]);
  const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-8 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <label className="block">
          <span className="text-sm font-bold text-[var(--text-secondary)]">Your marks (out of 100)</span>
          <div className="mt-2 flex items-center gap-3">
            <input type="range" min={0} max={100} step={0.33} value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="flex-1 accent-violet-600" aria-label="Marks slider" />
            <input type="number" min={0} max={100} step={0.01} value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="w-24 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-2 text-right font-num font-bold text-[var(--text-primary)]" aria-label="Marks" />
          </div>
        </label>
        <fieldset>
          <legend className="text-sm font-bold text-[var(--text-secondary)]">Category</legend>
          <div className="mt-2 grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--surface-secondary)]">
            {CATS.map(([v, l]) => (
              <button key={v} type="button" onClick={() => setCat(v)} aria-pressed={cat === v} className={`py-2 rounded-lg text-xs font-bold cursor-pointer ${cat === v ? "bg-[var(--surface)] shadow text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>{l}</button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {([
          ["GATE score", r.qualified ? fmt(r.score) : "—", r.qualified ? "out of 1000" : "issued only when you qualify"],
          ["Likely All-India Rank", `~${fmt(r.rank)}`, `range ${fmt(r.band.best)} – ${fmt(r.band.worst)}`],
          ["Qualifying mark", String(r.q), CATS.find(([v]) => v === cat)![1]],
        ] as const).map(([k, v, sub], i) => (
          <motion.div key={k} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 border border-violet-500/20 p-4">
            <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">{k}</p>
            <p className="mt-1 text-2xl font-extrabold font-num text-[var(--text-primary)]">{v}</p>
            <p className="text-[11px] text-[var(--text-muted)]">{sub}</p>
          </motion.div>
        ))}
      </div>

      <p className={`inline-flex items-center gap-2 text-sm font-semibold ${r.qualified ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
        {r.qualified ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
        {r.qualified ? `Qualified — ${Math.round((r.m - r.q) * 100) / 100} marks above the cut-off` : `${Math.round((r.q - r.m) * 100) / 100} marks short of the qualifying mark`}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-t border-[var(--border-subtle)] pt-5">
        <p className="text-[11px] text-[var(--text-muted)] max-w-xl">Estimates from {CALIBRATION_LABEL}, blended into a median curve with a range. Real ranks shift a little every year with difficulty and the number of candidates; the GATE score uses the official formula.</p>
        <Link href="/mocks" className="shrink-0 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-violet-500/25"><Play className="w-4 h-4 fill-current" /> Find your real rank: free All-India Mock</Link>
      </div>
    </div>
  );
}
