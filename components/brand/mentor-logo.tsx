/* eslint-disable @next/next/no-img-element */
/**
 * The AI Mentor's logo in its original colours (the owner's final art, never recoloured): the flame body and the spark are two
 * transparent images on the same canvas, so the spark can blink or pop on its own while the flame stays still.
 * Files: public/brand/mentor/mentor-ai-body.webp and mentor-ai-star.webp (made by scripts/extract-mentor-logo.py).
 * Size it by height (for example "h-6"): the width follows the artwork's proportions.
 *   mode "still"  nothing moves
 *   mode "blink"  the spark twinkles every few seconds (top bar, empty state)
 *   mode "think"  the flame breathes and the spark twinkles fast (while the Mentor is working)
 * Motion is CSS only (see .mentor-logo in globals.css) and is switched off for "reduce motion".
 */
export function MentorLogo({ className = "h-6", mode = "still" }: { className?: string; mode?: "still" | "blink" | "think" }) {
  return (
    <span aria-hidden className={`mentor-logo relative block shrink-0 aspect-[465/585] ${className}`} data-mode={mode}>
      <img src="/brand/mentor/mentor-ai-body.webp" alt="" draggable={false} decoding="async" className="mentor-logo-body absolute inset-0 h-full w-full select-none object-contain" />
      <img src="/brand/mentor/mentor-ai-star.webp" alt="" draggable={false} decoding="async" className="mentor-logo-star absolute inset-0 h-full w-full select-none object-contain" />
    </span>
  );
}
