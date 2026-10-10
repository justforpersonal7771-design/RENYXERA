"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { GATE_2026, paperScore, qualifiedPercent, type CategoryKey } from "@/lib/seo/gate2026";

const CATS: [CategoryKey, string][] = [[0, "General"], [1, "OBC-NCL / EWS"], [2, "SC / ST / PwD"]];
const fmt = (n: number) => n.toLocaleString("en-IN");

/** Official GATE 2026 cut-offs for six papers plus a marks → GATE score calculator for any of them. */
export function BranchCutoffs() {
  const [code, setCode] = useState("CS");
  const [cat, setCat] = useState<CategoryKey>(0);
  const [marks, setMarks] = useState(45);
  const p = GATE_2026.find((x) => x.code === code) ?? GATE_2026[0];
  const r = useMemo(() => {
    const m = Math.max(0, Math.min(100, marks));
    return { m, q: p.q[cat], ok: m >= p.q[cat], score: paperScore(p, m, cat) };
  }, [marks, cat, p]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[640px] text-sm">
          <thead><tr className="text-left text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">
            <th className="p-3">Paper</th><th className="p-3">General</th><th className="p-3">OBC-NCL / EWS</th><th className="p-3">SC / ST / PwD</th><th className="p-3">Appeared</th><th className="p-3">Qualified</th>
          </tr></thead>
          <tbody>
            {GATE_2026.map((x) => (
              <tr key={x.code} className="border-t border-[var(--border)]">
                <td className="p-3 font-bold text-[var(--text-primary)]">{x.code} <span className="font-normal text-[var(--text-muted)]">{x.name}</span></td>
                {x.q.map((v, i) => <td key={i} className="p-3 font-num font-bold">{v}</td>)}
                <td className="p-3 font-num">{fmt(x.appeared)}</td>
                <td className="p-3 font-num">{fmt(x.qualified)} <span className="text-[var(--text-muted)]">({qualifiedPercent(x)}%)</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-[var(--text-secondary)]">Paper
            <select value={code} onChange={(e) => setCode(e.target.value)} className="mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm">
              {GATE_2026.map((x) => <option key={x.code} value={x.code}>{x.code} · {x.name}</option>)}
            </select>
          </label>
          <fieldset>
            <legend className="text-sm font-bold text-[var(--text-secondary)]">Category</legend>
            <div className="mt-1 grid grid-cols-3 gap-1 rounded-xl bg-[var(--surface-secondary)] p-1">
              {CATS.map(([v, l]) => <button key={v} type="button" aria-pressed={cat === v} onClick={() => setCat(v)} className={`cursor-pointer rounded-lg py-2 text-[11px] font-bold sm:text-xs ${cat === v ? "bg-[var(--surface)] text-violet-600 shadow-sm dark:text-violet-300" : "text-[var(--text-muted)]"}`}>{l}</button>)}
            </div>
          </fieldset>
          <label className="block text-sm font-bold text-[var(--text-secondary)]">Your marks (out of 100)
            <div className="mt-1 flex items-center gap-3">
              <input type="range" min={0} max={100} step={0.33} value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="flex-1 accent-violet-600" aria-label="Marks slider" />
              <input type="number" min={0} max={100} step={0.01} value={marks} onChange={(e) => setMarks(Number(e.target.value))} className="w-20 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 text-sm font-bold" aria-label="Marks" />
            </div>
          </label>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">GATE score (out of 1000)</p>
          <p className="font-num text-5xl font-extrabold text-[var(--text-primary)]">{r.ok ? r.score : "—"}</p>
          <p className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${r.ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-rose-500/10 text-rose-700 dark:text-rose-300"}`}>
            {r.ok ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {r.ok ? `Qualified · ${Math.round((r.m - r.q) * 100) / 100} above the cut-off of ${r.q}` : `${Math.round((r.q - r.m) * 100) / 100} short of the cut-off of ${r.q}`}
          </p>
          <p className="text-xs text-[var(--text-muted)]">Uses the official 2026 formula for {p.code}: top 0.1% average {p.mt}, qualifying mark {p.q[0]}. Rank is not estimated here because no marks-to-rank table is published for this paper.</p>
        </div>
      </div>
    </div>
  );
}
