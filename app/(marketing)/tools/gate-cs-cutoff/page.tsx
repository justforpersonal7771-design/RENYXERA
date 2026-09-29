import type { Metadata } from "next";
import Link from "next/link";
import { CALIBRATION, CALIBRATION_LABEL, calibratedRankForMarks, rankBandForMarks, gateScore } from "@/lib/calibration";
import { SponsorSlot } from "@/components/ads/sponsor-slot";

export const metadata: Metadata = {
  title: "GATE CS Cutoff 2023–2026 (All Categories) & Marks vs Rank Table | RENYXERA",
  description: "GATE Computer Science qualifying marks for General, OBC-NCL/EWS and SC/ST/PwD from 2023 to 2026, plus a marks-vs-rank table and GATE score for each mark range.",
  alternates: { canonical: "/tools/gate-cs-cutoff" },
  openGraph: { title: "GATE CS Cutoff 2023–2026 & Marks vs Rank", description: "Qualifying marks by category and year, and the rank each mark range gets.", type: "article" },
};

const MARK_POINTS = [90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30];

export default function CutoffPage() {
  const years = [...CALIBRATION].sort((a, b) => b.year - a.year);
  const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
  return (
    <div className="py-10 sm:py-14 max-w-4xl">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Free reference</p>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">GATE CS cutoff &amp; marks vs rank</h1>
      <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">Qualifying marks for every category in recent GATE Computer Science papers, and the All-India Rank range that each band of marks usually gets.</p>

      <section className="mt-8" aria-labelledby="cutoff">
        <h2 id="cutoff" className="text-xl font-extrabold text-[var(--text-primary)] mb-3">Qualifying marks (out of 100)</h2>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
              <th className="px-4 py-3">Year</th><th className="px-4 py-3">General</th><th className="px-4 py-3">OBC-NCL / EWS</th><th className="px-4 py-3">SC / ST / PwD</th><th className="px-4 py-3 hidden sm:table-cell">Organised by</th><th className="px-4 py-3 hidden sm:table-cell">Candidates</th>
            </tr></thead>
            <tbody>
              {years.map((y) => (
                <tr key={y.year} className="border-b border-[var(--border-subtle)] last:border-0">
                  <td className="px-4 py-3 font-bold text-[var(--text-primary)]">{y.year}</td>
                  <td className="px-4 py-3 font-num">{y.qualifying_marks.general}</td>
                  <td className="px-4 py-3 font-num">{y.qualifying_marks.obc_ncl_ews}</td>
                  <td className="px-4 py-3 font-num">{y.qualifying_marks.sc_st_pwd}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-[var(--text-secondary)]">{(y as { organising_institute?: string }).organising_institute ?? "—"}</td>
                  <td className="px-4 py-3 hidden sm:table-cell font-num text-[var(--text-secondary)]">{(y as { appeared?: number | null }).appeared ? fmt((y as { appeared: number }).appeared) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-[var(--text-muted)]">OBC-NCL/EWS and SC/ST/PwD cutoffs follow the official rule: 90% and two-thirds of the General cutoff.</p>
      </section>

      <SponsorSlot context="aptitude" seed={3} />

      <section aria-labelledby="mvr">
        <h2 id="mvr" className="text-xl font-extrabold text-[var(--text-primary)] mb-3">Marks vs rank (GATE CS)</h2>
        <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)]">
              <th className="px-4 py-3">Marks</th><th className="px-4 py-3">Likely rank</th><th className="px-4 py-3">Range</th><th className="px-4 py-3">GATE score</th>
            </tr></thead>
            <tbody>
              {MARK_POINTS.map((m) => {
                const band = rankBandForMarks(m);
                return (
                  <tr key={m} className="border-b border-[var(--border-subtle)] last:border-0">
                    <td className="px-4 py-2.5 font-bold font-num text-[var(--text-primary)]">{m}</td>
                    <td className="px-4 py-2.5 font-num">~{fmt(calibratedRankForMarks(m))}</td>
                    <td className="px-4 py-2.5 font-num text-[var(--text-secondary)]">{fmt(band.best)} – {fmt(band.worst)}</td>
                    <td className="px-4 py-2.5 font-num text-[var(--text-secondary)]">{gateScore(m)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[11px] text-[var(--text-muted)]">Blended from {CALIBRATION_LABEL}. Ranks move a little each year with difficulty and the number of candidates — read them as ranges.</p>
      </section>

      <p className="mt-8 text-sm text-[var(--text-secondary)]">Enter your exact marks in the <Link href="/tools/gate-score-calculator" className="font-semibold text-violet-600 dark:text-violet-400">score &amp; rank predictor</Link>, or practise with <Link href="/pyq" className="font-semibold text-violet-600 dark:text-violet-400">every GATE CS PYQ</Link>.</p>
    </div>
  );
}
