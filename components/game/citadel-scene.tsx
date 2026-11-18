"use client";

/**
 * Isometric Citadel (Citadel Clash, redesign from GAME-DESIGN-MERGED.md section 1). A sandstone island in a jade moat
 * under the IST sky (dawn, day, dusk, night). Buildings grow with the real level: L1 timber hut, L2 sandstone hall,
 * L3 battlements, L4 a chhatri dome, L5 a gold finial and lit windows. Lamps light at dusk, fireflies drift at night,
 * scholars walk the paths. All motion is SVG/CSS and stops when the tab is hidden, in battery saver or reduced motion.
 */
import { useEffect, useRef, useState } from "react";
import type { BuildingState } from "@/lib/game/citadel";
import { istHour } from "@/lib/time/ist";
import { useGameSettings } from "@/lib/game/sound";

const TW = 132, TH = 66, RING = 1.3;
const iso = (gx: number, gy: number) => ({ x: (gx - gy) * (TW / 2), y: (gx + gy) * (TH / 2) });
const ROOF = { terra: ["#c4552f", "#9e4022"], slate: ["#5f6b5a", "#46503f"], gold: ["#d9a53a", "#b0832a"], moss: ["#6e8547", "#566a37"] } as const;
export type Phase = "dawn" | "day" | "dusk" | "night";
export const phaseNow = (): Phase => { const h = istHour(); return h >= 5 && h < 8 ? "dawn" : h >= 8 && h < 17 ? "day" : h >= 17 && h < 20 ? "dusk" : "night"; };
const SKY: Record<Phase, [string, string, string]> = {
  dawn: ["#f6d7b0", "#e9a982", "#b9847a"], day: ["#f3e9d8", "#e8d3b0", "#d9b382"], dusk: ["#e8a849", "#b84a32", "#3d261d"], night: ["#2a1e17", "#1d1613", "#14100d"],
};

function House({ x, y, w, h, roof, level, lit, label }: { x: number; y: number; w: number; h: number; roof: readonly [string, string]; level: number; lit: boolean; label?: string }) {
  const top = y - h, front = y + w / 2, rh = w * 0.8;
  const timber = level === 1;
  const wallL = timber ? "#b98a55" : "#e6c89a", wallR = timber ? "#94693d" : "#c9a26a";
  const L = `${x - w},${y} ${x},${front} ${x},${front - h} ${x - w},${top}`;
  const R = `${x},${front} ${x + w},${y} ${x + w},${top} ${x},${front - h}`;
  const apex = { x, y: top - rh + w / 4 };
  const storeys = Math.min(3, Math.max(1, Math.ceil(level / 2)));
  const win = lit ? "#f2c45a" : "#3d2c1c";
  return (
    <g>
      <ellipse cx={x} cy={front - 2} rx={w * 1.2} ry={w * 0.5} fill="#000" opacity=".18" />
      <polygon points={L} fill={wallL} stroke="#5a3e24" strokeWidth="1.2" />
      <polygon points={R} fill={wallR} stroke="#5a3e24" strokeWidth="1.2" />
      {timber && <g stroke="#6e4a2a" strokeWidth="1.4" opacity=".7"><line x1={x - w * 0.5} y1={y + w * 0.25} x2={x - w * 0.5} y2={top + w * 0.25} /><line x1={x + w * 0.5} y1={y + w * 0.25} x2={x + w * 0.5} y2={top + w * 0.25} /></g>}
      {Array.from({ length: storeys }, (_, s) => {
        const wy = y - 12 - s * 16;
        return (
          <g key={s} className={lit ? "cz-win" : undefined}>
            <polygon points={`${x - w * 0.62},${wy - 6 + w * 0.19} ${x - w * 0.38},${wy - 6 + w * 0.31} ${x - w * 0.38},${wy + 3 + w * 0.31} ${x - w * 0.62},${wy + 3 + w * 0.19}`} fill={win} />
            <polygon points={`${x + w * 0.38},${wy - 6 + w * 0.31} ${x + w * 0.62},${wy - 6 + w * 0.19} ${x + w * 0.62},${wy + 3 + w * 0.19} ${x + w * 0.38},${wy + 3 + w * 0.31}`} fill={win} opacity=".85" />
          </g>
        );
      })}
      {level >= 3 && <g fill={wallL} stroke="#5a3e24" strokeWidth="1">{[-0.8, -0.4, 0.4, 0.8].map((f) => <rect key={f} x={x + f * w - 4} y={top + (f < 0 ? -f : f) * w * 0.5 - 7} width="8" height="8" />)}</g>}
      {level >= 4 ? (
        <g>
          <ellipse cx={x} cy={top + w * 0.1} rx={w * 0.62} ry={w * 0.22} fill={roof[1]} stroke="#4a2f1a" strokeWidth="1.2" />
          <path d={`M${x - w * 0.62},${top + w * 0.1} Q${x - w * 0.6},${top - w * 0.75} ${x},${top - w * 0.85} Q${x + w * 0.6},${top - w * 0.75} ${x + w * 0.62},${top + w * 0.1} Z`} fill={roof[0]} stroke="#4a2f1a" strokeWidth="1.2" />
          {level >= 5 && <><line x1={x} y1={top - w * 0.85} x2={x} y2={top - w * 0.85 - 16} stroke="#b0832a" strokeWidth="3" /><circle cx={x} cy={top - w * 0.85 - 18} r="5" fill="#e8c16f" stroke="#8a5a1a" /></>}
        </g>
      ) : (
        <g>
          <polygon points={`${apex.x},${apex.y} ${x - w - 3},${top + 1} ${x},${front - h + 3}`} fill={roof[0]} stroke="#4a2f1a" strokeWidth="1.2" />
          <polygon points={`${apex.x},${apex.y} ${x},${front - h + 3} ${x + w + 3},${top + 1}`} fill={roof[1]} stroke="#4a2f1a" strokeWidth="1.2" />
        </g>
      )}
      <g transform={`translate(${x + w * 0.9} ${top - 6})`}>
        <line x1="0" y1="0" x2="0" y2="-20" stroke="#4a2f1a" strokeWidth="2" />
        <g className="cz-flag"><path d="M0 -20 h18 l-5 6 l5 6 h-18 z" fill="#f4ecd8" stroke="#4a2f1a" strokeWidth="1" />
          <text x="8" y="-10" textAnchor="middle" fontSize="10" fontWeight="800" fill="#4a2f1a" fontFamily="var(--font-chakra)">{level}</text></g>
      </g>
      {label && <text x={x} y={front + 17} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--cz-label)" fontFamily="var(--font-chakra)" paintOrder="stroke" stroke="var(--cz-label-halo)" strokeWidth="3">{label}</text>}
    </g>
  );
}

function Plot({ x, y, label }: { x: number; y: number; label: string }) {
  const w = 36;
  return (
    <g>
      <polygon points={`${x - w},${y} ${x},${y + w / 2} ${x + w},${y} ${x},${y - w / 2}`} fill="#d9bf8a" stroke="#6e5230" strokeDasharray="4 3" strokeWidth="1.4" />
      <g stroke="#7a4a26" strokeWidth="2.2"><line x1={x - 14} y1={y} x2={x - 14} y2={y - 26} /><line x1={x + 14} y1={y} x2={x + 14} y2={y - 26} /><line x1={x - 16} y1={y - 22} x2={x + 16} y2={y - 22} /><line x1={x - 14} y1={y - 8} x2={x + 14} y2={y - 22} /></g>
      <text x={x} y={y + 32} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--cz-label)" fontFamily="var(--font-chakra)" paintOrder="stroke" stroke="var(--cz-label-halo)" strokeWidth="3">{label}</text>
    </g>
  );
}

const Tree = ({ x, y, s = 1 }: { x: number; y: number; s?: number }) => <g><rect x={x - 2 * s} y={y - 10 * s} width={4 * s} height={10 * s} fill="#6e4a2a" /><circle cx={x} cy={y - 16 * s} r={10 * s} fill="#55703a" /><circle cx={x - 4 * s} cy={y - 19 * s} r={5 * s} fill="#6e8547" /></g>;
const Lamp = ({ x, y, on }: { x: number; y: number; on: boolean }) => <g>{on && <circle cx={x} cy={y - 14} r="12" fill="#f2b84a" opacity=".28" className="cz-glow" />}<rect x={x - 1.5} y={y - 12} width="3" height="12" fill="#5a3e24" /><circle cx={x} cy={y - 14} r="3.2" fill={on ? "#ffd27a" : "#8a6a3f"} /></g>;

export function CitadelScene({ buildings, hallLevel, onPick }: { buildings: BuildingState[]; hallLevel: number; onPick: (id: string) => void }) {
  const [phase, setPhase] = useState<Phase>("day");
  const svg = useRef<SVGSVGElement>(null);
  const low = useGameSettings((s) => s.lowPower || s.reducedMotion);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the IST hour is known only in the browser
    setPhase(phaseNow());
    const t = setInterval(() => setPhase(phaseNow()), 60_000);
    return () => clearInterval(t);
  }, []);
  // walking scholars use SMIL; stop them when hidden or in battery saver
  useEffect(() => {
    const el = svg.current; if (!el) return;
    const sync = () => { if (document.hidden || low) el.pauseAnimations(); else el.unpauseAnimations(); };
    sync(); document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [low]);
  const isl = 4.6, p = iso;
  const corners = [p(-isl, -isl), p(isl, -isl), p(isl, isl), p(-isl, isl)];
  const moat = [p(-isl - 1.4, -isl - 1.4), p(isl + 1.4, -isl - 1.4), p(isl + 1.4, isl + 1.4), p(-isl - 1.4, isl + 1.4)];
  const depth = 50;
  const lit = phase === "dusk" || phase === "night";
  const sky = SKY[phase];
  const built = buildings.filter((b) => b.level > 0);
  return (
    <svg ref={svg} viewBox="-640 -350 1280 720" preserveAspectRatio="xMidYMid slice" className={`cz-scene h-full w-full min-w-[920px] lg:min-w-0 ${low ? "is-still" : ""}`} data-phase={phase} role="group" aria-label={`Your citadel at ${phase}. Town Hall level ${hallLevel}.`}>
      <defs>
        <linearGradient id="cz-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset=".55" stopColor={sky[1]} /><stop offset="1" stopColor={sky[2]} /></linearGradient>
        <linearGradient id="cz-water" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={lit ? "#24423a" : "#4b7a6b"} /><stop offset="1" stopColor={lit ? "#162b25" : "#3d6155"} /></linearGradient>
        <radialGradient id="cz-grass" cx="50%" cy="45%" r="60%"><stop offset="0" stopColor={lit ? "#5c6f3c" : "#8aa45a"} /><stop offset="1" stopColor={lit ? "#475930" : "#6e8547"} /></radialGradient>
      </defs>
      <rect x="-1400" y="-900" width="2800" height="1900" fill="url(#cz-sky)" />
      {phase === "night" && <g fill="#f2e7d5">{[[-520, -300], [-380, -250], [-200, -320], [60, -290], [260, -310], [430, -260], [560, -320], [-80, -240]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 1.2 : 1.8} opacity=".8" />)}</g>}
      {(phase === "day" || phase === "dawn") && <circle cx="470" cy="-250" r="34" fill="#f7d58a" opacity=".85" />}
      {phase === "night" && <circle cx="480" cy="-250" r="22" fill="#efe3c8" opacity=".9" />}
      {/* moat */}
      <polygon points={moat.map((c) => `${c.x},${c.y + 20}`).join(" ")} fill="url(#cz-water)" />
      <g className="cz-ripples" stroke={lit ? "#5d8a7c" : "#9cc9b8"} fill="none" strokeWidth="1.4" opacity=".55">{[[-470, 120], [420, 140], [-60, 330], [300, -60]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="26" ry="9" style={{ animationDelay: `${i * 1.1}s` }} />)}</g>
      {/* island: sandstone cliffs and a terrace */}
      <polygon points={`${corners[3].x},${corners[3].y} ${corners[2].x},${corners[2].y} ${corners[2].x},${corners[2].y + depth} ${corners[3].x},${corners[3].y + depth}`} fill="#c99a6b" />
      <polygon points={`${corners[2].x},${corners[2].y} ${corners[1].x},${corners[1].y} ${corners[1].x},${corners[1].y + depth} ${corners[2].x},${corners[2].y + depth}`} fill="#8b6242" />
      <g stroke="#7b5238" strokeWidth="1" opacity=".5">{[0.3, 0.6].map((f) => <line key={f} x1={corners[3].x + (corners[2].x - corners[3].x) * 0} y1={corners[3].y + depth * f} x2={corners[2].x} y2={corners[2].y + depth * f} />)}</g>
      <polygon points={corners.map((c) => `${c.x},${c.y}`).join(" ")} fill="url(#cz-grass)" stroke="#55703a" strokeWidth="2" />
      {/* paved plaza around the hall */}
      <polygon points={[p(-1.25, -1.25), p(1.25, -1.25), p(1.25, 1.25), p(-1.25, 1.25)].map((c) => `${c.x},${c.y}`).join(" ")} fill="#d9b382" stroke="#a37b4f" strokeWidth="1.5" />
      {/* paths */}
      {buildings.map((b) => { const q = p(b.gx * RING, b.gy * RING); return <line key={b.id} x1="0" y1="0" x2={q.x} y2={q.y} stroke="#e2c58f" strokeWidth="12" strokeLinecap="round" opacity=".95" />; })}
      {[[-3.6, -2.4], [-2.6, 3.4], [3.4, -2.8], [3.6, 2.6], [-0.4, -3.7], [0.6, 3.8], [-3.8, 1.8], [2.2, 3.6]].map(([gx, gy], i) => { const q = p(gx, gy); return <Tree key={i} x={q.x} y={q.y} s={i % 2 ? 1.1 : 0.9} />; })}
      {/* lamps halfway along each path */}
      {buildings.map((b) => { const q = p(b.gx * RING * 0.55, b.gy * RING * 0.55); return <Lamp key={b.id} x={q.x + 12} y={q.y} on={lit} />; })}
      {/* scholars walking from the hall to built buildings */}
      {!low && built.slice(0, 4).map((b, i) => { const q = p(b.gx * RING, b.gy * RING); return (
        <g key={b.id} aria-hidden><circle r="4.5" fill="#3d261d" /><circle r="3" cy="-7" fill="#e6c89a" />
          <animateMotion dur={`${9 + i * 2}s`} repeatCount="indefinite" path={`M0,0 L${q.x * 0.9},${q.y * 0.9} L0,0`} begin={`${i * 1.5}s`} /></g>
      ); })}
      {/* buildings, back to front */}
      {[...buildings].sort((a, b) => a.gx + a.gy - (b.gx + b.gy)).map((b) => {
        const q = p(b.gx * RING, b.gy * RING);
        return (
          <g key={b.id} role="button" tabIndex={0} aria-label={`${b.name}, ${b.subject}, level ${b.level}`} className="cz-bld cursor-pointer outline-none"
            onClick={() => onPick(b.id)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(b.id); } }}>
            {b.level === 0 ? <Plot x={q.x} y={q.y} label={b.name} /> : <House x={q.x} y={q.y} w={28 + b.level * 4} h={30 + b.level * 11} roof={ROOF[b.roof]} level={b.level} lit={lit && b.level >= 2} label={b.name} />}
          </g>
        );
      })}
      {/* town hall */}
      <g aria-hidden>
        <House x={0} y={8} w={58} h={70 + hallLevel * 8} roof={["#b84a32", "#8f3420"]} level={Math.min(5, hallLevel + 1)} lit={lit} />
        <text x="0" y="74" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--cz-label)" fontFamily="var(--font-russo)" paintOrder="stroke" stroke="var(--cz-label-halo)" strokeWidth="3">Town Hall</text>
      </g>
      {/* fireflies at night */}
      {phase === "night" && !low && <g className="cz-flies" fill="#ffd27a">{[[-300, 40], [-120, 160], [180, 120], [320, -20], [40, -120], [-220, -80]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.2" style={{ animationDelay: `${i * 0.7}s` }} />)}</g>}
    </svg>
  );
}
