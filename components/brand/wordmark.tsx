/**
 * The RENYXERA wordmark as live text instead of the old raster PNG. The PNG was a
 * low-res, slightly jagged export in a blocky display face that matched nothing else in
 * the app; this is set in Bruno Ace SC (used only for the product name, so it stands
 * apart from the UI type), stays crisp at any size,
 * follows the theme automatically, and keeps the brand ribbon gradient on "ERA".
 * Server-safe (no hooks), so it renders in the very first HTML paint.
 */
export function Wordmark({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizes = {
    sm: "text-lg",
    md: "text-[25px]",
    lg: "text-[28px]",
    xl: "text-5xl sm:text-6xl",
  } as const;
  return (
    <span
      aria-label="RENYXERA"
      className={`font-brand font-normal tracking-[0.04em] leading-none select-none whitespace-nowrap ${sizes[size]} ${className}`}
    >
      <span aria-hidden="true" className="text-[var(--text-primary)]">RENYX</span>
      <span aria-hidden="true" className="wordmark-era bg-gradient-to-r from-[#06c2fb] via-[#5b21e0] to-[#dd42fb] bg-clip-text text-transparent dark:from-[#5edcff] dark:via-[#8b5cf6] dark:to-[#e879f9]">
        ERA
      </span>
    </span>
  );
}

/** The ribbon mark (still an image — it's artwork, not text). Theme-aware via CSS
 *  rather than JS, so there's no light/dark swap flicker after hydration. */
export function BrandMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/mark-light.png" alt="" aria-hidden="true" width={40} height={40} style={{ maxWidth: 80, maxHeight: 80 }} className={`object-contain dark:hidden ${className}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/mark-dark.png" alt="" aria-hidden="true" width={40} height={40} style={{ maxWidth: 80, maxHeight: 80 }} className={`object-contain hidden dark:block ${className}`} />
    </>
  );
}

/** The product name inside running text ("RENYXERA is your study engine…"), set in the
 *  brand face like the logo so it stands out from the sentence around it. `onDark`
 *  keeps "RENYX" white on dark surfaces such as the dashboard hero. */
export function BrandName({ onDark = false, className = "" }: { onDark?: boolean; className?: string }) {
  return (
    <span aria-label="RENYXERA" className={`font-brand font-normal tracking-[0.04em] text-[0.95em] whitespace-nowrap ${className}`}>
      <span aria-hidden="true" className={onDark ? "text-white" : "text-[var(--text-primary)]"}>RENYX</span>
      <span aria-hidden="true" className="bg-gradient-to-r from-[#5edcff] via-[#a78bfa] to-[#f0abfc] bg-clip-text text-transparent">ERA</span>
    </span>
  );
}

/** The logo mark with the navbar's hover effect (.logo-fx: halo, ripple, 3D spin) —
 *  used wherever the logo appears so it behaves the same across the app. Put it inside
 *  a link/button that carries the `logo-fx` class, or pass `standalone` to add it here. */
export function LogoMarkFx({ className = "h-8 w-8", standalone = false }: { className?: string; standalone?: boolean }) {
  return (
    <span className={`${standalone ? "logo-fx " : ""}logo-mark relative inline-flex items-center justify-center shrink-0`}>
      <span className="logo-halo" aria-hidden="true" />
      <span className="logo-ripple" aria-hidden="true" />
      <span className="logo-spin relative drop-shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
        <BrandMark className={className} />
      </span>
    </span>
  );
}
