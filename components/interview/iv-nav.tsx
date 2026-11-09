"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, ChevronRight } from "lucide-react";

/** Section menu shown on every Interview page: where you are, every room, and a back button that always works. */
const ROOMS = [
  { href: "/interview", label: "Home", match: (p: string) => p === "/interview" },
  { href: "/interview/read", label: "Library", match: (p: string) => p.startsWith("/interview/read") },
  { href: "/interview-cards", label: "Flashcards", match: (p: string) => p.startsWith("/interview-cards") },
  { href: "/interview/lab", label: "Code lab", match: (p: string) => p.startsWith("/interview/lab") },
  { href: "/interview/sql", label: "SQL", match: (p: string) => p.startsWith("/interview/sql") },
  { href: "/interview/tutor", label: "Tutor", match: (p: string) => p.startsWith("/interview/tutor") },
  { href: "/interview/notes", label: "Notebook", match: (p: string) => p.startsWith("/interview/notes") },
  { href: "/interview/progress", label: "Progress", match: (p: string) => p.startsWith("/interview/progress") },
];

export function IvNav() {
  const path = usePathname() ?? "";
  const router = useRouter();
  const here = ROOMS.find((r) => r.match(path));
  return (
    <nav aria-label="Interview" style={{ top: "var(--sticky-top, 8px)" }} className="iv-sticky sticky z-30 -mx-2 mb-4 flex items-center gap-2 rounded-2xl px-2 py-2 sm:-mx-3 sm:flex-wrap sm:px-3">
      {path !== "/interview" && <button type="button" onClick={() => (window.history.length > 1 ? router.back() : router.push("/interview"))} className="pill-soft !h-9" aria-label="Go back"><ArrowLeft className="h-4 w-4" />Back</button>}
      <Link href="/interview" className="hidden items-center gap-1.5 text-sm font-extrabold text-[var(--text-primary)] sm:inline-flex"><Briefcase className="h-4 w-4" />Interview{here && here.href !== "/interview" && <><ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />{here.label}</>}</Link>
      <ul className="ml-auto flex min-w-0 flex-1 gap-1 overflow-x-auto rounded-full bg-[var(--surface)] p-1 sm:max-w-full sm:flex-none">
        {ROOMS.map((r) => <li key={r.href}><Link href={r.href} aria-current={r.match(path) ? "page" : undefined} className={`block whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold ${r.match(path) ? "bg-[var(--ink)] text-[var(--background)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"}`}>{r.label}</Link></li>)}
      </ul>
    </nav>
  );
}
