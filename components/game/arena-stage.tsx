"use client";

/**
 * The Duel Table (signature of the Battles lobby). A GATE battle is a timed duel, and the object of a timed duel is a
 * chess clock: it stands on a baize games table, your face on the left (your Arena rating in its window), your rival's
 * face on the right, still blank until you pick one. A cue and a chalk cube lie on the table (the owner's 8 Ball Pool reference).
 * Pure SVG; no idle loops (unslop pass): nothing moves unless it means something.
 * Honest by design: the rival face says "Pick a rival", never a fake player.
 */
import { useId } from "react";

export function ArenaStage({ name, avatar, rating, ring, season }: { name: string; avatar: string; rating: number | null; ring: string | null; season: string | null }) {
  const id = useId().replace(/:/g, "");
  const short = name.length > 14 ? name.slice(0, 13) + "…" : name;
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Duel table: ${name}${rating ? `, rating ${rating}` : ""}, no rival picked yet`}>
      <defs>
        <linearGradient id={`wood${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8c5732" /><stop offset=".45" stopColor="#6b3f22" /><stop offset="1" stopColor="#3b200f" />
        </linearGradient>
        <linearGradient id={`woodTop${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7a4727" /><stop offset=".5" stopColor="#95603a" /><stop offset="1" stopColor="#7a4727" />
        </linearGradient>
        <linearGradient id={`brass${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8f6421" /><stop offset=".35" stopColor="#f3d58c" /><stop offset=".6" stopColor="#d9ab4f" /><stop offset="1" stopColor="#8f6421" />
        </linearGradient>
        <linearGradient id={`plate${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6efdd" /><stop offset="1" stopColor="#ddd0b2" />
        </linearGradient>
        <linearGradient id={`lcd${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2a1f" /><stop offset="1" stopColor="#0f1711" />
        </linearGradient>
        <linearGradient id={`cue${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2b170b" /><stop offset=".55" stopColor="#6b3f22" /><stop offset=".8" stopColor="#c99a62" /><stop offset="1" stopColor="#efdcb6" />
        </linearGradient>
        <radialGradient id={`lamp${id}`} cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#fff7dc" stopOpacity=".18" /><stop offset="1" stopColor="#fff7dc" stopOpacity="0" />
        </radialGradient>
        <filter id={`soft${id}`} x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="10" /></filter>
        <clipPath id={`av${id}`}><circle cx="300" cy="487" r="26" /></clipPath>
      </defs>

      {/* lamp pool on the baize */}
      <rect width="1000" height="560" fill={`url(#lamp${id})`} />

      {/* cue lying across the table, with chalk cube */}
      <g transform="rotate(-9 500 520)">
        <rect x="40" y="515" width="560" height="12" rx="6" fill="#000" opacity=".25" filter={`url(#soft${id})`} />
        <rect x="40" y="505" width="560" height="11" rx="5.5" fill={`url(#cue${id})`} />
        <rect x="586" y="505" width="14" height="11" rx="3" fill="#f6f2e8" />
      </g>
      <g transform="translate(820 470) rotate(12)">
        <rect x="4" y="10" width="40" height="34" rx="4" fill="#000" opacity=".25" filter={`url(#soft${id})`} />
        <rect width="40" height="34" rx="4" fill="#ece6d6" />
        <rect x="6" y="6" width="28" height="22" rx="3" fill="#d9d1bd" />
      </g>

      {/* clock shadow */}
      <ellipse cx="500" cy="438" rx="300" ry="26" fill="#000" opacity=".4" filter={`url(#soft${id})`} />

      {/* plungers: yours is down (you are ready), the rival's is up (waiting) */}
      <g>
        <rect x="355" y="142" width="40" height="30" rx="6" fill={`url(#brass${id})`} />
        <rect x="347" y="134" width="56" height="12" rx="6" fill={`url(#brass${id})`} />
        <rect x="605" y="104" width="40" height="68" rx="6" fill={`url(#brass${id})`} />
        <rect x="597" y="96" width="56" height="12" rx="6" fill={`url(#brass${id})`} />
      </g>

      {/* clock body */}
      <path d="M232 178 Q232 166 244 166 H756 Q768 166 768 178 L790 420 Q792 436 776 436 H224 Q208 436 210 420 Z" fill={`url(#wood${id})`} />
      <path d="M244 166 H756 Q768 166 768 178 L770 196 H230 L232 178 Q232 166 244 166 Z" fill={`url(#woodTop${id})`} />
      <rect x="230" y="196" width="540" height="3" fill="#2b170b" opacity=".5" />

      {/* left face: you */}
      <g>
        <rect x="262" y="214" width="226" height="196" rx="16" fill={`url(#brass${id})`} />
        <rect x="270" y="222" width="210" height="180" rx="12" fill={`url(#plate${id})`} />
        <text x="375" y="252" textAnchor="middle" fontFamily="var(--font-chakra)" fontWeight="700" fontSize="20" fill="#5a4630">You</text>
        <rect x="290" y="266" width="170" height="86" rx="8" fill={`url(#lcd${id})`} />
        <text x="375" y="331" textAnchor="middle" fontFamily="var(--font-chakra)" fontWeight="700" fontSize="58" fill="#f6f2e8" letterSpacing="2">{rating ?? "----"}</text>
        <text x="375" y="384" textAnchor="middle" fontFamily="var(--font-chakra)" fontWeight="500" fontSize="17" fill="#5a4630">Arena rating</text>
      </g>

      {/* right face: the rival */}
      <g>
        <rect x="512" y="214" width="226" height="196" rx="16" fill={`url(#brass${id})`} />
        <rect x="520" y="222" width="210" height="180" rx="12" fill={`url(#plate${id})`} />
        <text x="625" y="252" textAnchor="middle" fontFamily="var(--font-chakra)" fontWeight="700" fontSize="20" fill="#5a4630">Rival</text>
        <rect x="540" y="266" width="170" height="86" rx="8" fill={`url(#lcd${id})`} />
        <text x="625" y="331" textAnchor="middle" fontFamily="var(--font-chakra)" fontWeight="700" fontSize="58" fill="#c4412d" letterSpacing="2">--:--</text>
        <text x="625" y="384" textAnchor="middle" fontFamily="var(--font-chakra)" fontWeight="500" fontSize="17" fill="#5a4630">Pick a rival</text>
        {/* the flag that falls when time runs out */}
        <path d="M690 228 l0 26 l18 -8 z" fill="#c4412d" />
      </g>

      {/* name plates on the baize */}
      <g>
        <circle cx="300" cy="487" r="29" fill={ring ? "#d9ab4f" : "#f6f2e8"} />
        <circle cx="300" cy="487" r="26" fill="#0b3a2a" />
        {avatar && <image href={avatar} x="274" y="461" width="52" height="52" clipPath={`url(#av${id})`} />}
        <text x="340" y="496" fontFamily="var(--font-russo)" fontSize="26" fill="#f6f2e8">{short}</text>
      </g>

      {season && (
        <g>
          <rect x="390" y="30" width="220" height="40" rx="8" fill={`url(#brass${id})`} />
          <rect x="394" y="34" width="212" height="32" rx="6" fill="none" stroke="#8f6421" strokeWidth="1.5" />
          <text x="500" y="57" textAnchor="middle" fontFamily="var(--font-chakra)" fontWeight="700" fontSize="18" fill="#241a10">{season}</text>
        </g>
      )}
    </svg>
  );
}
