import Link from "next/link";

/**
 * Rendered once, at the bottom of the main scroll area (client-layout.tsx), after
 * {children} — every dashboard page picks it up automatically rather than each page
 * needing its own. Deliberately plain/low-contrast so it doesn't compete with actual
 * page content above it; it's reference material, not a feature.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
      <p>© {year} RENYXERA. All rights reserved.</p>
      <nav className="flex items-center gap-5">
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
