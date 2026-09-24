import Link from "next/link";

/**
 * Shared by /privacy and /terms — deliberately minimal and plain-typography, not
 * wrapped in the dashboard's glass/gradient chrome. These are reference documents
 * (also linked from the Google OAuth consent screen, and later Razorpay/AdSense),
 * so legibility and a stable, printable layout matter more than visual flourish here.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="border-b border-[var(--border)] px-4 sm:px-8 py-4">
        <Link href="/" className="text-sm font-bold text-[var(--text-primary)]">
          ← RENYXERA
        </Link>
      </header>
      <main className="max-w-2xl mx-auto px-4 sm:px-8 py-10 sm:py-14">{children}</main>
    </div>
  );
}
