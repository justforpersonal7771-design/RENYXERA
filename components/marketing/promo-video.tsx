"use client";

import { useState } from "react";
import { Play } from "lucide-react";

/** The id of the unlisted/public YouTube upload of the launch film. Set NEXT_PUBLIC_PROMO_YT_ID once it is uploaded. */
const YT_ID = process.env.NEXT_PUBLIC_PROMO_YT_ID;

/**
 * Click-to-play launch film. Only a still image is loaded with the page; the YouTube player
 * (and its scripts) is requested after the visitor taps play, so the page stays fast.
 * Renders nothing until NEXT_PUBLIC_PROMO_YT_ID is set.
 */
export function PromoVideo({ className = "" }: { className?: string }) {
  const [playing, setPlaying] = useState(false);
  if (!YT_ID) return null;
  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-3xl border border-violet-500/25 bg-black shadow-xl shadow-violet-500/20 ${className}`}>
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0&modestbranding=1`}
          title="RENYXERA launch film"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label="Play the RENYXERA launch film" className="group absolute inset-0 cursor-pointer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/promo-poster.jpg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-violet-700 shadow-2xl transition group-hover:scale-110 sm:h-20 sm:w-20">
            <Play className="ml-1 h-7 w-7 fill-current sm:h-8 sm:w-8" />
          </span>
          <span className="absolute bottom-3 left-4 text-xs font-bold tracking-wide text-white drop-shadow sm:text-sm">Watch the 108-second film</span>
        </button>
      )}
    </div>
  );
}
