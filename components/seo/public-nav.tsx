"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PUBLIC_NAV, TOOLS } from "@/lib/seo/tools";

/** Header links for the public pages; "Tools" is active on every tool and article page. */
export function PublicNav() {
  const path = usePathname() ?? "";
  const active = (href: string) =>
    href === "/tools" ? path === "/tools" || (TOOLS.some((t) => t.href === path) && path !== "/gate-cs-syllabus") : path === href || path.startsWith(`${href}/`) || (href === "/pyq" && path.startsWith("/topics/"));
  return (
    <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
      {PUBLIC_NAV.map((l) => (
        <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}
          className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${active(l.href) ? "bg-violet-500/10 text-violet-700 dark:text-violet-300" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
