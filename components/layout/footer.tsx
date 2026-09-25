import Link from "next/link";

/**
 * Shown only at the bottom of the dashboard home page (app/(dashboard)/page.tsx) and
 * the public /about page — deliberately not on every screen. Plain and low-contrast
 * so it doesn't compete with the content above it.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
      <p>© {year} RENYXERA. All rights reserved.</p>
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <Link href="/about" className="hover:text-[var(--text-secondary)] transition-colors">
          About
        </Link>
        <Link href="/terms" className="hover:text-[var(--text-secondary)] transition-colors">
          Terms of Service
        </Link>
        <Link href="/privacy" className="hover:text-[var(--text-secondary)] transition-colors">
          Privacy Policy
        </Link>
        <a href="mailto:renyxera@gmail.com" className="hover:text-[var(--text-secondary)] transition-colors">
          Contact
        </a>
      </nav>
    </footer>
  );
}
