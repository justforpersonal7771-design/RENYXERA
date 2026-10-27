/** Plan comparison for a feature: one row per capability, Free / Plus / Pro columns ("—" = not included). */
const PLAN_TINT = ["", "sky", "mint", "butter"];

export function PlanCompare({ rows, title = "What each plan gets" }: { rows: [string, string, string, string][]; title?: string }) {
  return (
    <section className="card-band p-5 pt-6 sm:p-6 sm:pt-7" data-tint="lilac" aria-label={title}>
      <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">{title}</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead><tr>{["", "Free", "Plus", "Pro"].map((h, i) => (
            <th key={h || "feature"} scope="col" className={`px-3 py-2 font-bold ${i ? "text-center" : "text-left"}`}>
              {i ? <span className="rounded-full px-3 py-1" style={{ background: `var(--tint-${PLAN_TINT[i]})`, color: `var(--tint-${PLAN_TINT[i]}-ink)` }}>{h}</span> : <span className="sr-only">Feature</span>}
            </th>))}</tr></thead>
          <tbody>{rows.map(([label, ...cells]) => (
            <tr key={label} className="border-t border-[var(--border)]">
              <th scope="row" className="px-3 py-2.5 text-left font-semibold text-[var(--text-primary)]">{label}</th>
              {cells.map((c, i) => <td key={i} className={`px-3 py-2.5 text-center ${c === "—" ? "text-[var(--text-muted)]" : "font-semibold text-[var(--text-primary)]"}`}>{c === "—" ? <span aria-label="Not included">—</span> : c}</td>)}
            </tr>))}</tbody>
        </table>
      </div>
    </section>
  );
}
