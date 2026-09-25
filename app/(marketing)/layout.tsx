import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { BrandMark, Wordmark } from "@/components/brand/wordmark";

// Server-rendered shell for public, no-login pages (the /about landing page). No
// client JS is needed to read any of it — the point is that a first-time visitor,
// a search engine, or Google's OAuth brand reviewer sees the full content with or
// without JavaScript, and without the dashboard's sign-in prompts around it.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <header className="sticky top-0 z-20 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/about" aria-label="RENYXERA" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <BrandMark className="h-8 w-8" />
            <Wordmark size="sm" className="sm:text-lg" />
          </Link>
          <Link
            href="/"
            className="shrink-0 whitespace-nowrap px-3 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 transition-colors"
          >
            Open the app
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 sm:px-6">{children}</main>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
        <Footer />
      </div>
    </div>
  );
}
