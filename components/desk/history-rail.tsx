"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Search, Trash2 } from "lucide-react";

/**
 * The left rail of the AI Desk: your past sessions, found and grouped the way you want (by date, subject, topic, year or difficulty) and sorted (recent, oldest, A to Z).
 * It is one component so the Tutor and anything else that keeps a history shows it the same way.
 */
export type RailRow = { id: string; href: string; title: string; sub: string; at: string; subject?: string; topic?: string; year?: string; difficulty?: string };
export type RailGroup = "date" | "subject" | "topic" | "year" | "difficulty";
const GROUPS: { id: RailGroup; label: string }[] = [{ id: "date", label: "Date" }, { id: "subject", label: "Subject" }, { id: "topic", label: "Topic" }, { id: "year", label: "Year" }, { id: "difficulty", label: "Difficulty" }];
const SORTS = [{ id: "recent", label: "Recent" }, { id: "old", label: "Oldest" }, { id: "az", label: "A to Z" }] as const;
const gap = (iso: string, today: string) => Math.round((Date.parse(today) - Date.parse(iso.slice(0, 10))) / 864e5);

export function HistoryRail({ title, rows, today, onDelete, empty, footer }: { title: string; rows: RailRow[] | null; today: string; onDelete?: (id: string) => void; empty: string; footer?: ReactNode }) {
  const [term, setTerm] = useState(""); const [group, setGroup] = useState<RailGroup>("date"); const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("recent");
  const groups = useMemo(() => {
    const t = term.trim().toLowerCase();
    const f = (rows ?? []).filter((r) => !t || `${r.title} ${r.sub} ${r.subject ?? ""} ${r.topic ?? ""}`.toLowerCase().includes(t));
    const by = sort === "az" ? (a: RailRow, b: RailRow) => a.title.localeCompare(b.title) : sort === "old" ? (a: RailRow, b: RailRow) => (a.at < b.at ? -1 : 1) : (a: RailRow, b: RailRow) => (a.at < b.at ? 1 : -1);
    const key = (r: RailRow) => group === "subject" ? r.subject ?? "Other" : group === "topic" ? r.topic ?? "Other" : group === "year" ? r.year ?? "Other" : group === "difficulty" ? r.difficulty ?? "Other" : (() => { const g = gap(r.at, today); return g <= 0 ? "Today" : g <= 7 ? "Previous 7 days" : "Older"; })();
    const m = new Map<string, RailRow[]>(); [...f].sort(by).forEach((r) => { (m.get(key(r)) ?? m.set(key(r), []).get(key(r))!).push(r); });
    const order = group === "date" ? ["Today", "Previous 7 days", "Older"] : null;
    return [...m.entries()].sort((a, b) => (order ? order.indexOf(a[0]) - order.indexOf(b[0]) : group === "year" ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0])));
  }, [rows, term, group, sort, today]);
  const sel = "h-9 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-semibold text-[var(--text-primary)]";
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <p className="px-1 font-display text-lg font-extrabold text-[var(--text-primary)]">{title}</p>
      <label className="flex h-10 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 focus-within:border-[var(--tint-sky-ink)]"><Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden /><input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search sessions" aria-label={`Search ${title}`} className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" /></label>
      <div className="flex gap-2"><label className="min-w-0 flex-1"><span className="sr-only">Group by</span><select value={group} onChange={(e) => setGroup(e.target.value as RailGroup)} className={sel}>{GROUPS.map((g) => <option key={g.id} value={g.id}>Group: {g.label}</option>)}</select></label>
        <label className="min-w-0 flex-1"><span className="sr-only">Sort by</span><select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={sel}>{SORTS.map((s) => <option key={s.id} value={s.id}>Sort: {s.label}</option>)}</select></label></div>
      <div className="custom-scrollbar -mx-1 min-h-0 flex-1 space-y-3 overflow-y-auto px-1">
        {rows === null ? <p className="px-2 text-sm text-[var(--text-secondary)]">Loading…</p> : groups.length === 0 ? <p className="px-2 text-sm text-[var(--text-secondary)]">{term.trim() ? "Nothing matches." : empty}</p> : groups.map(([h, items]) => (
          <section key={h} aria-label={h}>
            <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">{h} <span className="font-num">{items.length}</span></p>
            <ul className="space-y-0.5">{items.map((r) => (
              <li key={r.id} className="group flex items-center rounded-lg hover:bg-[var(--surface-secondary)]">
                <Link href={r.href} className="min-w-0 flex-1 px-2.5 py-2"><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{r.title}</span><span className="block truncate text-xs text-[var(--text-secondary)]">{r.sub}</span></Link>
                {onDelete && <button type="button" aria-label={`Delete ${r.title}`} title="Delete" onClick={() => onDelete(r.id)} className="mr-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--text-muted)] hover:text-rose-600 lg:opacity-0 lg:focus:opacity-100 lg:group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>}
              </li>
            ))}</ul>
          </section>
        ))}
        {footer}
      </div>
    </div>
  );
}
