import Link from "next/link";
import { LogoMarkFx, Wordmark } from "@/components/brand/wordmark";
import { PublicNav } from "@/components/seo/public-nav";

/** Header shared by every public page (marketing, tools, legal). */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/about" aria-label="RENYXERA" className="logo-fx flex items-center gap-2 sm:gap-2.5 min-w-0">
          <LogoMarkFx className="h-8 w-8" />
          <Wordmark size="sm" className="sm:text-lg" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className="hidden sm:block"><PublicNav /></div>
          <Link href="/" className="shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 transition-colors">
            Open the app
          </Link>
        </div>
      </div>
      <div className="sm:hidden px-2 pb-2 -mt-1"><PublicNav /></div>
    </header>
  );
}
