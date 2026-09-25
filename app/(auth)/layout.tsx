import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/brand/wordmark";

/**
 * Minimal shell for /login and /signup — deliberately its own route group, separate
 * from (dashboard)/layout.tsx, so it renders without the app topbar/sidebar chrome
 * (there's nothing to navigate to yet if you're not signed in) and so none of this
 * touches the dashboard layout, which is a carefully-tuned shared component.
 */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // Own scroll container for the same reason as (legal)/layout.tsx — html/body are
    // overflow:hidden app-wide, so on a short/mobile screen the form was clipped.
    <div className="h-full overflow-y-auto custom-scrollbar">
    <div className="ambient-gradient min-h-full flex flex-col items-center justify-center px-4 py-10">
      <Link href="/" aria-label="RENYXERA home" className="mb-8 flex items-center gap-3 group">
        <span className="transition-transform group-hover:scale-105 group-hover:rotate-3 drop-shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
          <BrandMark className="h-10 w-10" />
        </span>
        <Wordmark size="lg" />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
    </div>
  );
}
