import type { Metadata } from "next";
import { CALIBRATION, CALIBRATION_LABEL, calibratedRankForMarks, rankBandForMarks, gateScore } from "@/lib/calibration";
import { SponsorSlot } from "@/components/ads/sponsor-slot";
import { ToolHeader } from "@/components/seo/tool-shell";
import { LineChart, StatTile, TrendColumns } from "@/components/seo/charts";

export const metadata: Metadata = {
  title: "GATE CS Cutoff 2023–2026 (All Categories) & Marks vs Rank Table | RENYXERA",
  description: "GATE Computer Science qualifying marks for General, OBC-NCL/EWS and SC/ST/PwD from 2023 to 2026 with trend charts, candidates per year, and a marks-vs-rank table with GATE score for each mark range.",
  alternates: { canonical: "/tools/gate-cs-cutoff" },
  openGraph: { title: "GATE CS Cutoff 2023–2026 & Marks vs Rank", description: "Qualifying marks by category and year, and the rank each mark range gets.", type: "article" },
};

const MARK_POINTS = [90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30];
type Y = { year: number; qualifying_marks: { general: number; obc_ncl_ews: number; sc_st_pwd: number }; organising_institute?: string; appeared?: number | null };
const TIERS = [
  { max: 100, label: "IISc / old IITs", cls: "bg-emerald-500" },
  { max: 1000, label: "IITs / top PSUs", cls: "bg-sky-500" },
  { max: 5000, label: "NITs / newer IITs", cls: "bg-violet-500" },
  { max: Infinity, label: "Other institutes", cls: "bg-slate-400" },
];

export default function CutoffPage() {
  const ys = [...(CALIBRATION as unknown as Y[])].sort((a, b) => a.year - b.year);
  const latest = ys[ys.length - 1];
  const fmt = (n: number) => Math.round(n).toLocaleString("en-IN");
  const cats = [
    { key: "general" as const, name: "General", color: "#8b5cf6" },
    { key: "obc_ncl_ews" as const, name: "OBC-NCL / EWS", color: "#0ea5e9" },
    { key: "sc_st_pwd" as const, name: "SC / ST / PwD", color: "#10b981" },
  ];
  const appeared = ys.filter((y) => y.appeared);
  const growth = appeared.length > 1 ? Math.round(((appeared[appeared.length - 1].appeared! - appeared[0].appeared!) / appeared[0].appeared!) * 100) : 0;
  const tierOf = (rank: number) => TIERS.find((t) => rank <= t.max)!;

  return (
    <>
      <ToolHeader kicker="Reference" title="GATE CS cutoffs & marks vs rank" lead="Qualifying marks for every category in recent GATE Computer Science papers, how they are moving, how many candidates sit the paper, and the All-India Rank each band of marks usually gets." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label={`General cut-off ${latest.year}`} value={latest.qualifying_marks.general} sub="out of 100" />
        <StatTile label="OBC-NCL / EWS" value={latest.qualifying_marks.obc_ncl_ews} sub="90% of General" accent="sky" />
        <StatTile label="SC / ST / PwD" value={latest.qualifying_marks.sc_st_pwd} sub="⅔ of General" accent="emerald" />
        <StatTile label={`Candidates ${latest.year}`} value={latest.appeared ? fmt(latest.appeared) : "—"} sub={growth ? `+${growth}% since ${appeared[0].year}` : latest.organising_institute} accent="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <section aria-labelledby="cutoff" className="lg:col-span-3 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 id="cutoff" className="font-extrabold text-[var(--text-primary)]">Qualifying marks by year</h2>
          <p className="text-xs text-[var(--text-muted)] mb-3">Out of 100, per category</p>
          <LineChart height={230} series={cats.map((c) => ({ name: c.name, color: c.color, points: ys.map((y) => ({ x: y.year, y: y.qualifying_marks[c.key] })) }))}
            xTicks={ys.map((y) => y.year)} yTicks={[15, 20, 25, 30, 35]} />
          <div className="mt-2 flex flex-wrap gap-4 text-[11px] text-[var(--text-muted)]">{cats.map((c) => <span key={c.key} className="inline-flex items-center gap-1.5"><i className="w-3 h-0.5 inline-block" style={{ background: c.color }} />{c.name}</span>)}</div>
        </section>
        <section aria-labelledby="cands" className="lg:col-span-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <h2 id="cands" className="font-extrabold text-[var(--text-primary)]">Candidates who appeared</h2>
          <p className="text-xs text-[var(--text-muted)] mb-8">GATE CS, thousands</p>
          <TrendColumns height={170} unit="thousand" data={appeared.map((y) => ({ label: String(y.year), value: Math.round(y.appeared! / 1000) }))} />
        </section>
      </div>

      <section aria-labelledby="table" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
        <h2 id="table" className="sr-only">Cut-offs table</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-subtle)] bg-[var(--surface-secondary)]/40">
              <th className="px-4 py-3">Year</th><th className="px-4 py-3">General</th><th className="px-4 py-3">OBC-NCL / EWS</th><th className="px-4 py-3">SC / ST / PwD</th><th className="px-4 py-3 hidden sm:table-cell">Organised by</th><th className="px-4 py-3 hidden sm:table-cell">Candidates</th>
            </tr></thead>
            <tbody>
              {[...ys].reverse().map((y) => (
                <tr key={y.year} className="border-b border-[var(--border-subtle)] last:border-0">
                  <td className="px-4 py-3 font-bold text-[var(--text-primary)]">{y.year}</td>
                  <td className="px-4 py-3 font-num font-bold text-violet-600 dark:text-violet-400">{y.qualifying_marks.general}</td>
                  <td className="px-4 py-3 font-num">{y.qualifying_marks.obc_ncl_ews}</td>
                  <td className="px-4 py-3 font-num">{y.qualifying_marks.sc_st_pwd}</td>
                  <td className="px-4 py-3 hidden sm:table-cell text-[var(--text-secondary)]">{y.organising_institute ?? "—"}</td>
                  <td className="px-4 py-3 hidden sm:table-cell font-num text-[var(--text-secondary)]">{y.appeared ? fmt(y.appeared) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <SponsorSlot context="aptitude" seed={3} />

      <section aria-labelledby="mvr" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <div><h2 id="mvr" className="font-extrabold text-[var(--text-primary)]">Marks vs rank</h2><p className="text-xs text-[var(--text-muted)]">Bar length = how far up the ranks those marks take you · colour = typical institute tier</p></div>
          <ul className="flex flex-wrap gap-3 text-[11px] text-[var(--text-muted)]">{TIERS.map((t) => <li key={t.label} className="inline-flex items-center gap-1.5"><i className={`w-2.5 h-2.5 rounded-sm inline-block ${t.cls}`} />{t.label}</li>)}</ul>
        </div>
        <ol className="space-y-2">
          {MARK_POINTS.map((m) => {
            const rank = calibratedRankForMarks(m);
            const band = rankBandForMarks(m);
            const t = tierOf(rank);
            const w = Math.max(4, 100 - (Math.log10(Math.max(rank, 1)) / Math.log10(60000)) * 100);
            return (
              <li key={m} className="grid grid-cols-[2.5rem_minmax(0,1fr)_6.5rem] sm:grid-cols-[2.5rem_minmax(0,1fr)_9rem_5rem] items-center gap-3 text-sm">
                <span className="font-num font-extrabold text-[var(--text-primary)]">{m}</span>
                <span className="h-6 rounded-lg bg-[var(--surface-secondary)] overflow-hidden"><span className={`chart-grow-x flex items-center h-full rounded-lg ${t.cls} px-2 text-[10px] font-bold text-white whitespace-nowrap`} style={{ width: `${w}%` }}>AIR ~{fmt(rank)}</span></span>
                <span className="font-num text-right text-[11px] sm:text-xs text-[var(--text-secondary)]">{fmt(band.best)} – {fmt(band.worst)}</span>
                <span className="hidden sm:block font-num text-right text-xs text-[var(--text-muted)]">score {gateScore(m)}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[11px] text-[var(--text-muted)]">Blended from {CALIBRATION_LABEL}. Institute tiers are rough guides, not admission promises. Ranks move each year with difficulty and the number of candidates — read them as ranges.</p>
      </section>
    </>
  );
}
