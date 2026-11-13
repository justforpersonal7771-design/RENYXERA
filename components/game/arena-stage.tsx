"use client";

/**
 * The arena stage (signature of the Battles lobby). A lit circuit floor in perspective, you on the left podium,
 * an open rival slot on the right, the VS emblem between them, and light running along the circuit traces.
 * Pure SVG + CSS animation (no canvas, no 3D library) so it stays at 60 fps on a mid-range phone; reduced motion
 * stops every loop (game.css). The rival slot is honest: it says "Choose a rival", never a fake player.
 */
import { useId } from "react";

export function ArenaStage({ name, avatar, rating, ring, season }: { name: string; avatar: string; rating: number | null; ring: string | null; season: string | null }) {
  const id = useId().replace(/:/g, "");
  const W = 1000, H = 560, VX = 500, VY = 250, FLOOR = 300;
  // perspective floor: horizontal lines closer together towards the horizon, rays from the vanishing point
  const rows = Array.from({ length: 9 }, (_, i) => FLOOR + Math.pow((i + 1) / 9, 1.8) * (H - FLOOR));
  const rays = Array.from({ length: 17 }, (_, i) => -900 + i * (2800 / 16));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Arena: ${name}${rating ? `, rating ${rating}` : ""}, waiting for a rival`}>
      <defs>
        <radialGradient id={`spot${id}`} cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#6d63ff" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#2b2a78" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0a0c1f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`floor${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1d2160" />
          <stop offset="100%" stopColor="#0a0c1f" />
        </linearGradient>
        <linearGradient id={`podC${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2c3a8a" /><stop offset="100%" stopColor="#141844" />
        </linearGradient>
        <linearGradient id={`podR${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a2a6e" /><stop offset="100%" stopColor="#1b1238" />
        </linearGradient>
        <filter id={`glow${id}`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" /></filter>
        <clipPath id={`me${id}`}><circle cx="330" cy="300" r="78" /></clipPath>
      </defs>

      {/* sky and spotlight */}
      <rect width={W} height={H} fill="#0d0f2a" />
      <rect width={W} height={H} fill={`url(#spot${id})`} className="g-sweep" />

      {/* floor */}
      <rect y={FLOOR} width={W} height={H - FLOOR} fill={`url(#floor${id})`} />
      <g stroke="#7c74ff" strokeOpacity="0.22" strokeWidth="1.2">
        {rows.map((y) => <line key={y} x1="0" x2={W} y1={y} y2={y} />)}
        {rays.map((x) => <line key={x} x1={VX} y1={VY} x2={x} y2={H} />)}
      </g>
      <line x1="0" x2={W} y1={FLOOR} y2={FLOOR} stroke="#a99af7" strokeOpacity="0.5" strokeWidth="1.5" />

      {/* circuit traces running into each podium, with light pulses */}
      <g fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path id={`tL${id}`} d="M0 470 H120 L230 420 H330" stroke="#22d3ee" strokeOpacity="0.25" />
        <path d="M0 470 H120 L230 420 H330" stroke="#22d3ee" className="g-pulse" />
        <path d="M0 530 H180 L290 480 H330" stroke="#22d3ee" strokeOpacity="0.25" />
        <path d="M0 530 H180 L290 480 H330" stroke="#22d3ee" className="g-pulse d2" />
        <path d="M1000 470 H880 L770 420 H670" stroke="#ff6b8b" strokeOpacity="0.25" />
        <path d="M1000 470 H880 L770 420 H670" stroke="#ff6b8b" className="g-pulse d3" />
        <path d="M1000 530 H820 L710 480 H670" stroke="#ff6b8b" strokeOpacity="0.25" />
        <path d="M1000 530 H820 L710 480 H670" stroke="#ff6b8b" className="g-pulse" />
        <path d="M250 520 H670" stroke="#a99af7" strokeOpacity="0.2" />
        <path d="M250 520 H670" stroke="#ffb86b" className="g-pulse d2" />
      </g>

      {/* podiums */}
      <g>
        <ellipse cx="330" cy="425" rx="140" ry="34" fill="#22d3ee" opacity="0.35" filter={`url(#glow${id})`} />
        <path d="M190 410 a140 32 0 0 0 280 0 v24 a140 32 0 0 1 -280 0z" fill={`url(#podC${id})`} />
        <ellipse cx="330" cy="410" rx="140" ry="32" fill="#20286b" stroke="#22d3ee" strokeWidth="3" />
        <ellipse cx="670" cy="425" rx="140" ry="34" fill="#ff6b8b" opacity="0.3" filter={`url(#glow${id})`} />
        <path d="M530 410 a140 32 0 0 0 280 0 v24 a140 32 0 0 1 -280 0z" fill={`url(#podR${id})`} />
        <ellipse cx="670" cy="410" rx="140" ry="32" fill="#2c1a4f" stroke="#ff6b8b" strokeWidth="3" />
      </g>

      {/* you */}
      <g className="g-float">
        <circle cx="330" cy="300" r="92" fill="#22d3ee" opacity="0.35" filter={`url(#glow${id})`} />
        <circle cx="330" cy="300" r="86" fill={ring ? "#ffb86b" : "#22d3ee"} />
        <circle cx="330" cy="300" r="80" fill="#1a1e3a" />
        <image href={avatar} x="252" y="222" width="156" height="156" clipPath={`url(#me${id})`} />
      </g>

      {/* rival slot */}
      <g className="g-float alt">
        <circle cx="670" cy="300" r="80" fill="#1b1238" stroke="#ff6b8b" strokeWidth="4" strokeDasharray="14 10" />
        <text x="670" y="328" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="84" fill="#ff6b8b" opacity="0.85">?</text>
      </g>

      {/* VS emblem */}
      <g className="g-vs">
        <polygon points="500,190 562,226 562,298 500,334 438,298 438,226" fill="#ffb86b" opacity="0.5" filter={`url(#glow${id})`} />
        <polygon points="500,196 556,229 556,295 500,328 444,295 444,229" fill="#1a1440" stroke="#ffb86b" strokeWidth="4" />
        <text x="500" y="282" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="900" fontSize="60" fill="#ffd59e" fontStyle="italic">VS</text>
      </g>

      {/* name plates */}
      <g fontFamily="var(--font-display)" textAnchor="middle">
        <text x="330" y="462" fontWeight="800" fontSize="30" fill="#e9edf9">{name.length > 14 ? name.slice(0, 13) + "…" : name}</text>
        <text x="330" y="494" fontWeight="700" fontSize="22" fill="#22d3ee">{rating ? `Rating ${rating}` : " "}</text>
        <text x="670" y="462" fontWeight="800" fontSize="28" fill="#e9edf9">Choose a rival</text>
        <text x="670" y="494" fontWeight="700" fontSize="22" fill="#ff8aa3">Live or later</text>
      </g>

      {season && (
        <g>
          <rect x="370" y="34" width="260" height="44" rx="22" fill="#0a0c1f" fillOpacity="0.75" stroke="#a99af7" strokeOpacity="0.4" />
          <text x="500" y="63" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="800" fontSize="20" fill="#e9edf9">{season}</text>
        </g>
      )}
    </svg>
  );
}
