import { useId } from "react";
import { FLAME_H, FLAME_PATH, FLAME_W } from "@/components/brand/mentor-flame-path";

/**
 * The AI Mentor's mark: the ribbon flame with a spark, drawn by the owner and traced to a vector (scripts/trace-mentor-flame.py,
 * scripts/gen-mentor-flame.mjs). One filled shape, so it works as currentColor, in the RENYXERA brand gradient (tone="brand"),
 * and as the mask for the flowing "thinking" logo (.spark-flow in globals.css reads the same outline).
 * The brand colours come from --brand-a/b/c (light and dark sets) so they match the wordmark.
 */
export function MentorMark({ className = "h-5 w-5", tone = "current" }: { className?: string; tone?: "current" | "brand" }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={`0 0 ${FLAME_W} ${FLAME_H}`} aria-hidden className={className} shapeRendering="geometricPrecision" preserveAspectRatio="xMidYMid meet">
      {tone === "brand" && (
        <defs>
          <linearGradient id={`mm${id}`} x1="0" y1="0" x2={FLAME_W} y2={FLAME_H} gradientUnits="userSpaceOnUse">
            <stop offset="0" style={{ stopColor: "var(--brand-a)" }} /><stop offset="0.55" style={{ stopColor: "var(--brand-b)" }} /><stop offset="1" style={{ stopColor: "var(--brand-c)" }} />
          </linearGradient>
        </defs>
      )}
      <path fill={tone === "brand" ? `url(#mm${id})` : "currentColor"} fillRule="evenodd" d={FLAME_PATH} />
    </svg>
  );
}
