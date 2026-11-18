"use client";

/**
 * Isometric Citadel (Battles v3). A floating island: the Town Hall in the middle, one building per subject group around it.
 * Building size, storeys, windows and flag all grow with the real level (lib/game/citadel.ts). Level 0 is a marked plot
 * with scaffolding. Every building is a button that opens its details. Pure SVG, no idle loops (flags move only on hover).
 */
import type { BuildingState } from "@/lib/game/citadel";

const TW = 132, TH = 66, RING = 1.3;
const iso = (gx: number, gy: number) => ({ x: (gx - gy) * (TW / 2), y: (gx + gy) * (TH / 2) });
const ROOF = { terra: ["#c4552f", "#9e4022"], slate: ["#6b7262", "#4f5547"], gold: ["#d9a53a", "#b0832a"], moss: ["#76913d", "#5a7230"] } as const;

function House({ x, y, w, h, roof, storeys, label, level }: { x: number; y: number; w: number; h: number; roof: readonly [string, string]; storeys: number; label?: string; level: number }) {
  const top = y - h, front = y + w / 2, rh = w * 0.85;
  const L = `${x - w},${y} ${x},${front} ${x},${front - h} ${x - w},${top}`;
  const R = `${x},${front} ${x + w},${y} ${x + w},${top} ${x},${front - h}`;
  const apex = { x, y: top - rh + w / 4 };
  const wins = Array.from({ length: storeys }, (_, s) => s);
  return (
    <g>
      <ellipse cx={x} cy={front - 2} rx={w * 1.15} ry={w * 0.5} fill="#000" opacity=".16" />
      <polygon points={L} fill="#e6c89a" stroke="#6e5230" strokeWidth="1.2" />
      <polygon points={R} fill="#c9a26a" stroke="#6e5230" strokeWidth="1.2" />
      {wins.map((s) => {
        const wy = y - 12 - s * 16;
        return (
          <g key={s}>
            <polygon points={`${x - w * 0.62},${wy - 6 + w * 0.19} ${x - w * 0.38},${wy - 6 + w * 0.31} ${x - w * 0.38},${wy + 3 + w * 0.31} ${x - w * 0.62},${wy + 3 + w * 0.19}`} fill="#3d2c1c" />
            <polygon points={`${x + w * 0.38},${wy - 6 + w * 0.31} ${x + w * 0.62},${wy - 6 + w * 0.19} ${x + w * 0.62},${wy + 3 + w * 0.19} ${x + w * 0.38},${wy + 3 + w * 0.31}`} fill="#3d2c1c" opacity=".85" />
          </g>
        );
      })}
      <polygon points={`${apex.x},${apex.y} ${x - w - 3},${top + 1} ${x},${front - h + 3}`} fill={roof[0]} stroke="#4a2f1a" strokeWidth="1.2" />
      <polygon points={`${apex.x},${apex.y} ${x},${front - h + 3} ${x + w + 3},${top + 1}`} fill={roof[1]} stroke="#4a2f1a" strokeWidth="1.2" />
      {/* level flag */}
      <line x1={apex.x} y1={apex.y} x2={apex.x} y2={apex.y - 22} stroke="#4a2f1a" strokeWidth="2" />
      <g className="cz-flag"><path d={`M${apex.x} ${apex.y - 22} h18 l-5 6 l5 6 h-18 z`} fill="#f4ecd8" stroke="#4a2f1a" strokeWidth="1" />
        <text x={apex.x + 8} y={apex.y - 12} textAnchor="middle" fontSize="10" fontWeight="800" fill="#4a2f1a" fontFamily="var(--font-chakra)">{level}</text></g>
      {label && <text x={x} y={front + 16} textAnchor="middle" fontSize="13" fontWeight="700" fill="#3d2c1c" fontFamily="var(--font-chakra)">{label}</text>}
    </g>
  );
}

function Plot({ x, y, label }: { x: number; y: number; label: string }) {
  const w = 36;
  return (
    <g>
      <polygon points={`${x - w},${y} ${x},${y + w / 2} ${x + w},${y} ${x},${y - w / 2}`} fill="#d9bf8a" stroke="#6e5230" strokeDasharray="4 3" strokeWidth="1.4" />
      <g stroke="#7a4a26" strokeWidth="2.2"><line x1={x - 14} y1={y} x2={x - 14} y2={y - 26} /><line x1={x + 14} y1={y} x2={x + 14} y2={y - 26} /><line x1={x - 16} y1={y - 22} x2={x + 16} y2={y - 22} /><line x1={x - 14} y1={y - 8} x2={x + 14} y2={y - 22} /></g>
      <text x={x} y={y + 32} textAnchor="middle" fontSize="13" fontWeight="700" fill="#3d2c1c" fontFamily="var(--font-chakra)">{label}</text>
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g><rect x={x - 2 * s} y={y - 10 * s} width={4 * s} height={10 * s} fill="#6e4a2a" /><circle cx={x} cy={y - 16 * s} r={10 * s} fill="#5f8b34" /><circle cx={x - 4 * s} cy={y - 19 * s} r={5 * s} fill="#79a743" /></g>;
}

export function CitadelScene({ buildings, hallLevel, onPick }: { buildings: BuildingState[]; hallLevel: number; onPick: (id: string) => void }) {
  const isl = 4.6;
  const p = (gx: number, gy: number) => iso(gx, gy);
  const corners = [p(-isl, -isl), p(isl, -isl), p(isl, isl), p(-isl, isl)];
  const depth = 46;
  return (
    <svg viewBox="-640 -350 1280 720" className="h-full w-full min-w-[920px] lg:min-w-0" role="group" aria-label={`Your citadel. Town Hall level ${hallLevel}.`}>
      <defs>
        <radialGradient id="cz-grass" cx="50%" cy="45%" r="60%"><stop offset="0" stopColor="#9cc25a" /><stop offset="1" stopColor="#7aa344" /></radialGradient>
      </defs>
      {/* island sides */}
      <polygon points={`${corners[3].x},${corners[3].y} ${corners[2].x},${corners[2].y} ${corners[2].x},${corners[2].y + depth} ${corners[3].x},${corners[3].y + depth}`} fill="#8a6a3f" />
      <polygon points={`${corners[2].x},${corners[2].y} ${corners[1].x},${corners[1].y} ${corners[1].x},${corners[1].y + depth} ${corners[2].x},${corners[2].y + depth}`} fill="#6e5230" />
      <polygon points={corners.map((c) => `${c.x},${c.y}`).join(" ")} fill="url(#cz-grass)" stroke="#5c7a2e" strokeWidth="2" />
      {/* paths from the hall */}
      {buildings.map((b) => { const q = p(b.gx * RING, b.gy * RING); return <line key={b.id} x1="0" y1="0" x2={q.x} y2={q.y} stroke="#e2c58f" strokeWidth="12" strokeLinecap="round" opacity=".9" />; })}
      {/* trees on the rim */}
      {[[-3.6, -2.4], [-2.6, 3.4], [3.4, -2.8], [3.6, 2.6], [-0.4, -3.7], [0.6, 3.8], [-3.8, 1.8], [2.2, 3.6]].map(([gx, gy], i) => { const q = p(gx, gy); return <Tree key={i} x={q.x} y={q.y} s={i % 2 ? 1.1 : 0.9} />; })}
      {/* buildings, back to front */}
      {[...buildings].sort((a, b) => a.gx + a.gy - (b.gx + b.gy)).map((b) => {
        const q = p(b.gx * RING, b.gy * RING);
        return (
          <g key={b.id} role="button" tabIndex={0} aria-label={`${b.name}, ${b.subject}, level ${b.level}`} className="cz-bld cursor-pointer outline-none"
            onClick={() => onPick(b.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(b.id); } }}>
            {b.level === 0 ? <Plot x={q.x} y={q.y} label={b.name} /> : <House x={q.x} y={q.y} w={28 + b.level * 4} h={30 + b.level * 11} roof={ROOF[b.roof]} storeys={Math.min(3, Math.ceil(b.level / 2))} label={b.name} level={b.level} />}
          </g>
        );
      })}
      {/* town hall */}
      <g aria-hidden>
        <House x={0} y={8} w={58} h={72 + hallLevel * 7} roof={["#b8452a", "#8f3420"]} storeys={3} level={hallLevel} />
        <text x="0" y="72" textAnchor="middle" fontSize="15" fontWeight="800" fill="#3d2c1c" fontFamily="var(--font-russo)">Town Hall</text>
      </g>
    </svg>
  );
}
