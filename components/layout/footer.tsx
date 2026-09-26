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
        {[
          ["/about", "About"],
          ["/gate-cse", "GATE branches"],
          ["/terms", "Terms"],
          ["/privacy", "Privacy"],
          ["/cookies", "Cookies"],
          ["/refunds", "Refunds"],
          ["/disclaimer", "Disclaimer"],
          ["/contact", "Contact"],
        ].map(([href, label]) => (
          <Link key={href} href={href} className="hover:text-[var(--text-secondary)] transition-colors">
            {label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
