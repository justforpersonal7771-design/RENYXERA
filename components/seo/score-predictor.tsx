"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Play } from "lucide-react";
import { CALIBRATION_LABEL, calibratedRankForMarks, gateScore, qualifyingMarks, rankBandForMarks, type Category } from "@/lib/calibration";
import { Gauge, LineChart } from "@/components/seo/charts";

const CATS: [Category, string][] = [["general", "General"], ["obc_ncl_ews", "OBC-NCL / EWS"], ["sc_st_pwd", "SC / ST / PwD"]];
const CURVE_X = Array.from({ length: 27 }, (_, i) => 30 + i * 2.5);
const PRESETS = [30, 45, 60, 75];

/** Free tool (6A): GATE CS marks → GATE score gauge, AIR on the marks-vs-rank curve, qualifying status. */
export function ScorePredictor() {
  const [marks, setMarks] = useState(45);
  const [cat, setCat] = useState<Category>("general");
  const r = useMemo(() => {
    const m = Math.max(0, Math.min(100, marks));
    const q = qualifyingMarks(cat);
    return { m, q, qualified: m >= q, score: gateScore(m), rank: calibratedRankForMarks(m), band: rankBandForMarks(m) };
  }, [marks, cat]);
  const curve = useMemo(() => ({
    mid: CURVE_X.map((x) => ({ x, y: calibratedRankForMarks(x) })),
    best: CURVE_X.map((x) => ({ x, y: rankBandForMarks(x).best })),
    worst: CURVE_X.map((x) => ({ x, y: rankBandForMarks(x).worst })),
  }), []);
  const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Inputs + gauge */}
      <div className="lg:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 space-y-5">
        <label className="block">
          <span className="flex items-baseline justify-between"><span className="text-sm font-bold text-[var(--text-secondary)]">Your marks</span><span className="text-[11px] text-[var(--text-muted)]">out of 100</span></span>
          <div className="mt-2 flex items-center gap-3">
            <input type="range" min={0} max={100} step={0.33} value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="flex-1 accent-violet-600" aria-label="Marks slider" />
            <input type="number" min={0} max={100} step={0.01} value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="w-20 rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] px-2 py-2 text-right font-num font-bold text-[var(--text-primary)]" aria-label="Marks" />
          </div>
          <div className="mt-2 flex gap-1.5">{PRESETS.map((p) => <button key={p} type="button" onClick={() => setMarks(p)} className="px-2.5 py-1 rounded-lg border border-[var(--border)] text-[11px] font-bold text-[var(--text-secondary)] hover:border-violet-500/50 cursor-pointer">{p}</button>)}</div>
        </label>
        <fieldset>
          <legend className="text-sm font-bold text-[var(--text-secondary)]">Category</legend>
          <div className="mt-2 grid grid-cols-3 gap-1 p-1 rounded-xl bg-[var(--surface-secondary)]">
            {CATS.map(([v, l]) => (
              <button key={v} type="button" onClick={() => setCat(v)} aria-pressed={cat === v} className={`py-2 rounded-lg text-[11px] sm:text-xs font-bold cursor-pointer ${cat === v ? "bg-[var(--surface)] shadow text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>{l}</button>
            ))}
          </div>
        </fieldset>
        <div className="pt-2">
          <Gauge value={r.qualified ? r.score : 0} max={1000} label={r.qualified ? fmt(r.score) : "—"} sub={r.qualified ? "GATE score / 1000" : "score issued on qualifying"} />
        </div>
        <p className={`flex items-center justify-center gap-2 text-sm font-semibold rounded-xl px-3 py-2 ${r.qualified ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/10 text-rose-700 dark:text-rose-300"}`}>
          {r.qualified ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {r.qualified ? `Qualified · ${Math.round((r.m - r.q) * 100) / 100} above cut-off ${r.q}` : `${Math.round((r.q - r.m) * 100) / 100} short of cut-off ${r.q}`}
        </p>
      </div>

      {/* Rank on the curve */}
      <div className="lg:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 flex flex-col">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500/15 to-violet-500/5 border border-fuchsia-500/25 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">Likely AIR</p><p className="text-xl sm:text-2xl font-extrabold font-num text-[var(--text-primary)]">~{fmt(r.rank)}</p></div>
          <div className="rounded-2xl bg-[var(--surface-secondary)]/60 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">Best case</p><p className="text-xl sm:text-2xl font-extrabold font-num text-emerald-600 dark:text-emerald-400">{fmt(r.band.best)}</p></div>
          <div className="rounded-2xl bg-[var(--surface-secondary)]/60 p-3"><p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">Worst case</p><p className="text-xl sm:text-2xl font-extrabold font-num text-rose-600 dark:text-rose-400">{fmt(r.band.worst)}</p></div>
        </div>
        <div className="mt-4 flex-1">
          <p className="text-xs font-bold text-[var(--text-secondary)] mb-1">Where you land on the marks-vs-rank curve</p>
          <LineChart log invertY height={260}
            series={[{ name: "Median rank", color: "#8b5cf6", points: curve.mid }, { name: "Best case", color: "#10b981", points: curve.best, dashed: true }, { name: "Worst case", color: "#f43f5e", points: curve.worst, dashed: true }]}
            xTicks={[30, 40, 50, 60, 70, 80, 90, 95]} yTicks={[10, 100, 1000, 10000, 50000]} fmtY={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
            marker={{ x: Math.max(30, Math.min(95, r.m)), y: r.rank, label: `${r.m} → AIR ~${fmt(r.rank)}` }} vLine={{ x: Math.max(30, r.q), label: `cut-off ${r.q}` }} xLabel="Marks" yLabel="AIR (log)" />
          <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-[var(--text-muted)]"><span className="inline-flex items-center gap-1.5"><i className="w-3 h-0.5 bg-violet-500 inline-block" /> median</span><span className="inline-flex items-center gap-1.5"><i className="w-3 h-0.5 bg-emerald-500 inline-block" /> best case</span><span className="inline-flex items-center gap-1.5"><i className="w-3 h-0.5 bg-rose-500 inline-block" /> worst case</span></div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3 sm:items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <p className="text-[11px] text-[var(--text-muted)] max-w-xl">Estimates from {CALIBRATION_LABEL}, blended into a median curve with a range. Real ranks shift a little every year with difficulty and the number of candidates; the GATE score uses the official formula.</p>
        <Link href="/mocks" className="shrink-0 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg shadow-violet-500/25"><Play className="w-4 h-4 fill-current" /> Find your real rank: free All-India Mock</Link>
      </div>
    </div>
  );
}
