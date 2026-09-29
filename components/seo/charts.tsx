import { TrendingDown, TrendingUp, Minus } from "lucide-react";

// Server-rendered chart kit for the public pages (no client JS): the pages stay static and
// fast, and the entrance motion is pure CSS (keyframes in globals.css, disabled under
// prefers-reduced-motion).

export const PALETTE = ["#7c3aed", "#6366f1", "#d946ef", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#14b8a6", "#8b5cf6", "#ec4899", "#3b82f6", "#84cc16"];

/** Recent (last 3 points) average vs the earlier average → rising / steady / falling. */
export function trendOf(values: number[]) {
  if (values.length < 4) return { dir: "flat" as const, pct: 0 };
  const recent = values.slice(-3), before = values.slice(0, -3);
  const a = recent.reduce((n, v) => n + v, 0) / recent.length;
  const b = before.reduce((n, v) => n + v, 0) / before.length || 0.0001;
  const pct = Math.round(((a - b) / b) * 100);
  return { dir: pct > 12 ? ("up" as const) : pct < -12 ? ("down" as const) : ("flat" as const), pct };
}

export function TrendBadge({ values, className = "" }: { values: number[]; className?: string }) {
  const t = trendOf(values);
  const cls = t.dir === "up" ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" : t.dir === "down" ? "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/30" : "bg-slate-500/10 text-[var(--text-secondary)] border-[var(--border)]";
  const Icon = t.dir === "up" ? TrendingUp : t.dir === "down" ? TrendingDown : Minus;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold whitespace-nowrap ${cls} ${className}`} title="Last 3 years vs earlier years">
      <Icon className="w-3 h-3" /> {t.dir === "up" ? "Rising" : t.dir === "down" ? "Cooling" : "Steady"}{t.dir !== "flat" ? ` ${t.pct > 0 ? "+" : ""}${t.pct}%` : ""}
    </span>
  );
}

export function StatTile({ label, value, sub, accent = "violet" }: { label: string; value: string | number; sub?: string; accent?: "violet" | "emerald" | "amber" | "sky" | "rose" }) {
  const ring = { violet: "from-violet-500/15 to-fuchsia-500/5 border-violet-500/25", emerald: "from-emerald-500/15 to-teal-500/5 border-emerald-500/25", amber: "from-amber-500/15 to-orange-500/5 border-amber-500/25", sky: "from-sky-500/15 to-indigo-500/5 border-sky-500/25", rose: "from-rose-500/15 to-pink-500/5 border-rose-500/25" }[accent];
  return (
    <div className={`chart-rise rounded-2xl border bg-gradient-to-br ${ring} p-3.5 sm:p-4 min-w-0`}>
      <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] leading-tight">{label}</p>
      <p className="mt-1 text-xl sm:text-2xl font-extrabold font-num text-[var(--text-primary)] truncate">{value}</p>
      {sub && <p className="text-[11px] text-[var(--text-secondary)] leading-snug">{sub}</p>}
    </div>
  );
}

/** Columns per year with gradient fill, dashed average line, peak highlight and value labels. */
export function TrendColumns({ data, height = 180, unit = "marks" }: { data: { label: string; value: number }[]; height?: number; unit?: string }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const avg = data.reduce((n, d) => n + d.value, 0) / (data.length || 1);
  const peak = data.reduce((m, d) => (d.value > m ? d.value : m), 0);
  return (
    <div className="relative">
      <div className="relative flex items-end gap-1.5 sm:gap-3" style={{ height }}>
        <div className="pointer-events-none absolute inset-x-0 border-t border-dashed border-amber-500/70 z-10" style={{ bottom: `${(avg / max) * 100}%` }}>
          <span className="absolute right-0 -top-5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-[var(--surface)]/80 px-1 rounded">avg {avg.toFixed(1)}</span>
        </div>
        {data.map((d, i) => (
          <div key={d.label} className="group relative flex-1 h-full flex flex-col justify-end items-center min-w-0">
            <span className="mb-1 text-[10px] sm:text-xs font-num font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{d.value}</span>
            <div className={`chart-grow w-full max-w-[44px] rounded-t-lg ${d.value === peak ? "bg-gradient-to-t from-fuchsia-600 to-violet-400 shadow-[0_0_24px_-4px_rgba(217,70,239,0.6)]" : "bg-gradient-to-t from-indigo-600 to-violet-400 opacity-85 group-hover:opacity-100"}`}
              style={{ height: `${Math.max(2, (d.value / max) * 100)}%`, animationDelay: `${i * 45}ms` }} title={`${d.label}: ${d.value} ${unit}`} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 sm:gap-3">
        {data.map((d) => <span key={d.label} className="flex-1 text-center text-[10px] sm:text-xs font-num font-semibold text-[var(--text-muted)] min-w-0 truncate">{d.label.length === 4 ? `'${d.label.slice(2)}` : d.label}</span>)}
      </div>
    </div>
  );
}

/** Donut via conic-gradient with a centre label and a legend. */
export function Donut({ slices, center, sub, size = 168, legend = true }: { slices: { label: string; value: number }[]; center: string; sub?: string; size?: number; legend?: boolean }) {
  const total = slices.reduce((n, s) => n + s.value, 0) || 1;
  let acc = 0;
  const stops = slices.map((s, i) => { const from = (acc / total) * 360; acc += s.value; return `${PALETTE[i % PALETTE.length]} ${from}deg ${(acc / total) * 360}deg`; }).join(", ");
  return (
    <div className={`flex flex-col items-center gap-5 ${legend ? "sm:flex-row" : "sm:justify-center"}`}>
      <div className="chart-spin relative shrink-0 rounded-full" style={{ width: size, height: size, background: `conic-gradient(${stops})` }}>
        <div className="absolute inset-[18%] rounded-full bg-[var(--surface)] grid place-items-center text-center shadow-inner">
          <div><p className="text-2xl font-extrabold font-num text-[var(--text-primary)] leading-none">{center}</p>{sub && <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{sub}</p>}</div>
        </div>
      </div>
      {legend && <ul className="w-full min-w-0 space-y-1.5">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center gap-2 text-sm min-w-0">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
            <span className="flex-1 min-w-0 truncate text-[var(--text-primary)]" title={s.label}>{s.label}</span>
            <span className="font-num font-bold text-[var(--text-secondary)]">{Math.round((s.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>}
    </div>
  );
}

/** Topic × year intensity grid (horizontal scroll on phones). */
export function Heatmap({ rows, cols }: { rows: { label: string; cells: number[] }[]; cols: string[] }) {
  const max = Math.max(1, ...rows.flatMap((r) => r.cells));
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="w-full border-separate" style={{ borderSpacing: 3 }}>
        <thead><tr><th />{cols.map((c) => <th key={c} className="text-[10px] font-num font-semibold text-[var(--text-muted)] px-0.5">&apos;{c.slice(2)}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row" className="text-left pr-2 text-xs font-medium text-[var(--text-primary)] max-w-[11rem] sm:max-w-[18rem] truncate" title={r.label}>{r.label}</th>
              {r.cells.map((v, i) => (
                <td key={i} title={`${r.label} · ${cols[i]}: ${v} marks`}
                  className="h-7 min-w-[26px] rounded-md text-center text-[10px] font-num font-bold"
                  style={{ background: v ? `rgba(124,58,237,${0.14 + 0.86 * (v / max)})` : "var(--surface-secondary)", color: v / max > 0.45 ? "white" : "var(--text-secondary)" }}>
                  {v || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Sparkline({ values, width = 96, height = 28 }: { values: number[]; width?: number; height?: number }) {
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? width / (values.length - 1) : width;
  const pts = values.map((v, i) => `${(i * step).toFixed(1)},${(height - 2 - (v / max) * (height - 4)).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible" aria-hidden>
      <polyline points={`0,${height} ${pts} ${width},${height}`} fill="url(#spark)" stroke="none" opacity={0.25} />
      <polyline points={pts} fill="none" stroke="#8b5cf6" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <defs><linearGradient id="spark" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8b5cf6" /><stop offset="1" stopColor="#8b5cf6" stopOpacity="0" /></linearGradient></defs>
    </svg>
  );
}

/** Horizontal share bar with label and value. */
export function ShareBar({ label, value, max, right, hint }: { label: string; value: number; max: number; right: string; hint?: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="min-w-0 truncate text-[var(--text-primary)]" title={label}>{label}</span>
        <span className="shrink-0 font-num font-bold text-violet-600 dark:text-violet-400">{right}</span>
      </div>
      <div className="mt-1 h-2 rounded-full bg-[var(--surface-secondary)] overflow-hidden"><div className="chart-grow-x h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" style={{ width: `${Math.max(2, (value / (max || 1)) * 100)}%` }} /></div>
      {hint && <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

type Series = { name: string; color: string; points: { x: number; y: number }[]; dashed?: boolean };
/**
 * Multi-series line chart in plain SVG (works in server and client components). Optional
 * log-scale y (ranks), a highlighted marker and a horizontal/vertical reference line.
 */
export function LineChart({ series, xTicks, yTicks, log = false, invertY = false, height = 240, marker, vLine, xLabel, yLabel, fmtY = (v: number) => String(v) }: {
  series: Series[]; xTicks: number[]; yTicks: number[]; log?: boolean; invertY?: boolean; height?: number;
  marker?: { x: number; y: number; label: string }; vLine?: { x: number; label: string }; xLabel?: string; yLabel?: string; fmtY?: (v: number) => string;
}) {
  const W = 640, H = height, L = 48, R = 14, T = 14, B = 34;
  const xs = series.flatMap((s) => s.points.map((p) => p.x)).concat(xTicks);
  const ys = series.flatMap((s) => s.points.map((p) => p.y)).concat(yTicks).filter((v) => !log || v > 0);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const tf = (v: number) => (log ? Math.log10(Math.max(v, 1)) : v);
  const y0 = Math.min(...ys.map(tf)), y1 = Math.max(...ys.map(tf));
  const px = (x: number) => L + ((x - x0) / (x1 - x0 || 1)) * (W - L - R);
  const py = (y: number) => { const f = (tf(y) - y0) / (y1 - y0 || 1); return invertY ? T + f * (H - T - B) : H - B - f * (H - T - B); };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={series.map((s) => s.name).join(", ")}>
      {yTicks.map((t) => <g key={`y${t}`}><line x1={L} x2={W - R} y1={py(t)} y2={py(t)} stroke="currentColor" className="text-[var(--border-subtle)]" strokeDasharray="3 4" /><text x={L - 6} y={py(t) + 3} textAnchor="end" className="fill-[var(--text-muted)]" fontSize="10">{fmtY(t)}</text></g>)}
      {xTicks.map((t) => <text key={`x${t}`} x={px(t)} y={H - B + 16} textAnchor="middle" className="fill-[var(--text-muted)]" fontSize="10">{t}</text>)}
      {xLabel && <text x={(L + W - R) / 2} y={H - 4} textAnchor="middle" className="fill-[var(--text-muted)]" fontSize="10" fontWeight="700">{xLabel}</text>}
      {yLabel && <text x={10} y={T + 4} className="fill-[var(--text-muted)]" fontSize="10" fontWeight="700">{yLabel}</text>}
      {vLine && <g><line x1={px(vLine.x)} x2={px(vLine.x)} y1={T} y2={H - B} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="5 4" /><text x={px(vLine.x) + 4} y={T + 10} fontSize="10" fontWeight="700" fill="#f59e0b">{vLine.label}</text></g>}
      {series.map((s) => {
        const d = s.points.map((p, i) => `${i ? "L" : "M"}${px(p.x).toFixed(1)},${py(p.y).toFixed(1)}`).join(" ");
        return <g key={s.name}>
          <path d={d} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.dashed ? "6 5" : undefined} className="chart-draw" pathLength={1} />
          {s.points.length <= 12 && s.points.map((p) => <circle key={p.x} cx={px(p.x)} cy={py(p.y)} r={3.5} fill={s.color} className="chart-rise" />)}
        </g>;
      })}
      {marker && <g>
        <circle cx={px(marker.x)} cy={py(marker.y)} r={9} fill="#d946ef" opacity={0.2} className="animate-ping origin-center" style={{ transformBox: "fill-box" }} />
        <circle cx={px(marker.x)} cy={py(marker.y)} r={5.5} fill="#d946ef" stroke="white" strokeWidth={2} />
        <text x={Math.min(px(marker.x) + 10, W - R - 4)} y={py(marker.y) - 10} textAnchor={px(marker.x) > W - 140 ? "end" : "start"} fontSize="11" fontWeight="800" fill="#d946ef">{marker.label}</text>
      </g>}
    </svg>
  );
}

/** Semicircle gauge (e.g. GATE score out of 1000). */
export function Gauge({ value, max, label, sub }: { value: number; max: number; label: string; sub?: string }) {
  const f = Math.max(0, Math.min(1, value / max));
  const r = 80, c = Math.PI * r;
  return (
    <div className="relative w-full max-w-[220px] mx-auto">
      <svg viewBox="0 0 200 116" className="w-full h-auto">
        <defs><linearGradient id="gauge" x1="0" x2="1"><stop offset="0" stopColor="#6366f1" /><stop offset=".55" stopColor="#8b5cf6" /><stop offset="1" stopColor="#d946ef" /></linearGradient></defs>
        <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke="var(--surface-secondary)" strokeWidth={16} strokeLinecap="round" />
        <path d="M20,100 A80,80 0 0 1 180,100" fill="none" stroke="url(#gauge)" strokeWidth={16} strokeLinecap="round" strokeDasharray={`${c * f} ${c}`} style={{ transition: "stroke-dasharray .6s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <p className="text-3xl font-extrabold font-num text-[var(--text-primary)] leading-none">{label}</p>
        {sub && <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{sub}</p>}
      </div>
    </div>
  );
}
