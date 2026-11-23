"use client";

import { DeskSelect } from "@/components/desk/desk-select";
import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { PanelLeftClose, Search, SquarePen, Trash2 } from "lucide-react";
import { MentorLogo } from "@/components/brand/mentor-logo";

/**
 * The left rail of the AI Desk, drawn exactly like the Mentor's chat list (same header, same New button, same search, same group labels and rows) so the two halves
 * feel like one place. It lists your past sessions, grouped (date, subject, topic, year, difficulty) and sorted (recent, oldest, A to Z).
 */
export type RailRow = { id: string; href: string; title: string; sub: string; at: string; subject?: string; topic?: string; year?: string; difficulty?: string };
export type RailGroup = "date" | "subject" | "topic" | "year" | "difficulty";
const GROUPS: { id: RailGroup; label: string }[] = [{ id: "date", label: "Date" }, { id: "subject", label: "Subject" }, { id: "topic", label: "Topic" }, { id: "year", label: "Year" }, { id: "difficulty", label: "Difficulty" }];
const SORTS = [{ id: "recent", label: "Recent" }, { id: "old", label: "Oldest" }, { id: "az", label: "A to Z" }] as const;
const gap = (iso: string, today: string) => Math.round((Date.parse(today) - Date.parse(iso.slice(0, 10))) / 864e5);

export function HistoryRail({ title, rows, today, onDelete, onNew, newLabel, empty, footer, note, onCollapse }: { onCollapse?: () => void; title: string; rows: RailRow[] | null; today: string; onDelete?: (id: string) => void; onNew?: () => void; newLabel?: string; empty: string; footer?: ReactNode; note?: string }) {
  const [term, setTerm] = useState(""); const [group, setGroup] = useState<RailGroup>("date"); const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("recent");
  const groups = useMemo(() => {
    const t = term.trim().toLowerCase();
    const f = (rows ?? []).filter((r) => !t || `${r.title} ${r.sub} ${r.subject ?? ""} ${r.topic ?? ""}`.toLowerCase().includes(t));
    const by = sort === "az" ? (a: RailRow, b: RailRow) => a.title.localeCompare(b.title) : sort === "old" ? (a: RailRow, b: RailRow) => (a.at < b.at ? -1 : 1) : (a: RailRow, b: RailRow) => (a.at < b.at ? 1 : -1);
    const key = (r: RailRow) => group === "subject" ? r.subject ?? "Other" : group === "topic" ? r.topic ?? "Other" : group === "year" ? r.year ?? "Other" : group === "difficulty" ? r.difficulty ?? "Other" : (() => { const g = gap(r.at, today); return g <= 0 ? "Today" : g === 1 ? "Yesterday" : g <= 7 ? "Previous 7 days" : "Older"; })();
    const m = new Map<string, RailRow[]>(); [...f].sort(by).forEach((r) => { (m.get(key(r)) ?? m.set(key(r), []).get(key(r))!).push(r); });
    const order = group === "date" ? ["Today", "Yesterday", "Previous 7 days", "Older"] : null;
    return [...m.entries()].sort((a, b) => (order ? order.indexOf(a[0]) - order.indexOf(b[0]) : group === "year" ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0])));
  }, [rows, term, group, sort, today]);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center gap-2 px-1">
        <MentorLogo className="h-9" mode="blink" />
        <span className="min-w-0 flex-1 truncate font-display text-base font-extrabold text-[var(--text-primary)]">{title}</span>
        {onCollapse && <button type="button" onClick={onCollapse} aria-label="Hide history" title="Hide history" className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"><PanelLeftClose className="h-[18px] w-[18px]" /></button>}
      </div>
      {onNew && (
        <button type="button" onClick={onNew} className="group/n relative mb-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--ink)] text-sm font-extrabold text-[var(--background)] shadow-[0_10px_24px_-14px_var(--ink)] transition-transform hover:-translate-y-px active:translate-y-0">
          <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,.22),transparent)] transition-transform duration-700 group-hover/n:translate-x-full" />
          <SquarePen className="relative h-4 w-4" /><span className="relative">{newLabel ?? "New"}</span>
        </button>
      )}
      <label className="relative mb-2 block">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search sessions" aria-label={`Search ${title}`} className="h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none transition-shadow focus:border-[var(--tint-sky-ink)] placeholder:text-[var(--text-muted)]" />
      </label>
      <div className="mb-2 grid grid-cols-2 gap-2">
        <DeskSelect label="Group by" prefix="Group: " value={group} options={GROUPS} onChange={(v) => setGroup(v as RailGroup)} />
        <DeskSelect label="Sort by" prefix="Sort: " value={sort} options={SORTS.map((s) => ({ id: s.id, label: s.label }))} onChange={(v) => setSort(v as typeof sort)} align="right" />
      </div>
      <nav aria-label={`${title} history`} className="custom-scrollbar -mr-1 min-h-0 flex-1 overflow-y-auto pr-1">
        {rows === null ? <p className="px-2 py-3 text-sm text-[var(--text-muted)]">Loading…</p> : groups.length === 0 ? <p className="px-2 py-3 text-sm text-[var(--text-muted)]">{term.trim() ? "Nothing matches." : empty}</p> : groups.map(([h, items]) => (
          <section key={h} aria-label={h} className="mb-1">
            <p className="sticky top-0 z-10 bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-2.5 pb-1 pt-2 text-[10.5px] font-extrabold uppercase tracking-[.09em] text-[var(--text-muted)] backdrop-blur">{h}</p>
            <ul>{items.map((r) => (
              <li key={r.id} className="group flex items-center rounded-xl transition-colors hover:bg-[var(--surface)]/70">
                <Link href={r.href} className="min-w-0 flex-1 px-2.5 py-2"><span className="block truncate text-[13.5px] font-bold text-[var(--text-primary)]">{r.title}</span><span className="block truncate text-xs text-[var(--text-secondary)]">{r.sub}</span></Link>
                {onDelete && <button type="button" aria-label={`Delete ${r.title}`} title="Delete" onClick={() => onDelete(r.id)} className="mr-1 grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-rose-600 lg:opacity-0 lg:focus:opacity-100 lg:group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>}
              </li>
            ))}</ul>
          </section>
        ))}
        {footer}
      </nav>
      {note && <p className="mt-2 flex items-center justify-center gap-1.5 px-2 text-[11px] font-semibold text-[var(--text-muted)]">{note}</p>}
    </div>
  );
}
