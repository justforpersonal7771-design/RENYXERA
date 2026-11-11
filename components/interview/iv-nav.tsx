"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, BookOpenText, ChartNoAxesColumn, ChevronRight, ClipboardCheck, Dumbbell, House } from "lucide-react";

/**
 * Interview navigation, built to answer three questions on every page: where am I, where can I go, and what is here.
 *  - Five rooms named for what you DO there: Home, Learn, Practise, Test, Review.
 *  - Each room has a small second row of its own pages (Learn: Books, Last moments; Practise: Flashcards, Code lab, SQL; ...).
 *  - A breadcrumb (Interview > Learn > Books) and a Back button that always works.
 * Design notes: docs/design/INTERVIEW-IA.md.
 */
type Sub = { label: string; href: string; match: (p: string, q: URLSearchParams) => boolean };
type Room = { id: string; label: string; href: string; icon: typeof House; match: (p: string) => boolean; subs: Sub[] };

const ROOMS: Room[] = [
  { id: "home", label: "Home", href: "/interview", icon: House, match: (p) => p === "/interview", subs: [] },
  { id: "learn", label: "Learn", href: "/interview/learn", icon: BookOpenText,
    match: (p) => p.startsWith("/interview/learn") || p.startsWith("/interview/read") || p.startsWith("/interview/last-moments"),
    subs: [] },
  { id: "practise", label: "Practise", href: "/interview/practise", icon: Dumbbell,
    match: (p) => p.startsWith("/interview/practise") || p.startsWith("/interview-cards") || p.startsWith("/interview/lab") || p.startsWith("/interview/sql"),
    subs: [
      { label: "Flashcards", href: "/interview-cards", match: (p) => p.startsWith("/interview-cards") },
      { label: "Code lab", href: "/interview/lab", match: (p) => p.startsWith("/interview/lab") },
      { label: "SQL", href: "/interview/sql", match: (p) => p.startsWith("/interview/sql") },
    ] },
  { id: "test", label: "Test", href: "/interview/tutor?mode=mock", icon: ClipboardCheck, match: (p) => p.startsWith("/interview/tutor"),
    subs: [
      { label: "Mock interview", href: "/interview/tutor?mode=mock", match: (p, q) => p.startsWith("/interview/tutor") && q.get("mode") !== "chat" },
      { label: "Ask the tutor", href: "/interview/tutor?mode=chat", match: (p, q) => p.startsWith("/interview/tutor") && q.get("mode") === "chat" },
    ] },
  { id: "review", label: "Review", href: "/interview/progress", icon: ChartNoAxesColumn, match: (p) => p.startsWith("/interview/progress") || p.startsWith("/interview/notes"),
    subs: [
      { label: "Progress and mistakes", href: "/interview/progress", match: (p) => p.startsWith("/interview/progress") },
      { label: "Notebook", href: "/interview/notes", match: (p) => p.startsWith("/interview/notes") },
    ] },
];

function Inner() {
  const path = usePathname() ?? "";
  const q = useSearchParams();
  const router = useRouter();
  const room = ROOMS.find((r) => r.id !== "home" && r.match(path)) ?? ROOMS[0];
  const sub = room.subs.find((s) => s.match(path, q));
  return (
    <nav aria-label="Interview" style={{ top: "var(--sticky-top, -8px)" }} className="iv-sticky md:sticky z-30 -mx-2 mb-4 space-y-2 rounded-2xl px-2 py-2 sm:-mx-3 sm:px-3">
      <div className="flex items-center gap-2">
        {path !== "/interview" && <button type="button" onClick={() => (window.history.length > 1 ? router.back() : router.push("/interview"))} className="pill-soft !h-9 shrink-0" aria-label="Go back"><ArrowLeft className="h-4 w-4" />Back</button>}
        <ol className="hidden min-w-0 items-center gap-1 text-sm font-extrabold text-[var(--text-primary)] sm:flex" aria-label="You are here">
          <li><Link href="/interview" className="hover:underline">Interview</Link></li>
          {room.id !== "home" && <><li aria-hidden><ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" /></li><li><Link href={room.href} className="hover:underline">{room.label}</Link></li></>}
          {sub && <><li aria-hidden><ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" /></li><li className="truncate text-[var(--text-secondary)]">{sub.label}</li></>}
        </ol>
        <ul className="ml-auto flex min-w-0 flex-1 gap-1 overflow-x-auto rounded-full bg-[var(--surface)] p-1 sm:max-w-full sm:flex-none">
          {ROOMS.map((r) => {
            const on = r.id === room.id;
            return (
              <li key={r.id}><Link href={r.href} aria-current={on ? "page" : undefined} className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold ${on ? "bg-[var(--ink)] text-[var(--background)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"}`}><r.icon className="h-4 w-4 shrink-0" aria-hidden /><span className={on ? "" : "hidden md:inline"}>{r.label}</span></Link></li>
            );
          })}
        </ul>
      </div>
      {room.subs.length > 0 && (
        <ul className="flex gap-1.5 overflow-x-auto" aria-label={`${room.label} pages`}>
          {room.subs.map((s) => {
            const on = !!sub && sub.href === s.href;
            return <li key={s.href}><Link href={s.href} aria-current={on ? "page" : undefined} className={`block whitespace-nowrap rounded-full border px-3.5 py-1 text-[13px] font-bold ${on ? "border-[var(--ink)] bg-[var(--surface)] text-[var(--text-primary)]" : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--surface)]/70"}`}>{s.label}</Link></li>;
          })}
        </ul>
      )}
    </nav>
  );
}

export function IvNav() { return <Suspense fallback={null}><Inner /></Suspense>; }
