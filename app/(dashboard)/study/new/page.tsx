"use client";

/**
 * Study New Tab page: what the "+" opens. Owner, 19 Nov: a long list is a burden as books grow, so it is a three-step picker
 * (section → subject → chapter) with search, plus compact rows for continuing, open tabs and recently closed.
 * Picking only navigates; the chapter page adds its own tab, so the strip does not reshuffle mid-click.
 */
import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Feather, History, Play, Search, X } from "lucide-react";
import { CS_SHELF } from "@/lib/study/catalog";
import { useStudyTabs, type StudyTab } from "@/lib/study/tabs";
import { NEW_TAB, StudyTabs } from "@/components/study/study-tabs";

const NEW: StudyTab = { href: NEW_TAB, title: "New tab", subject: "Pick a chapter" };
const SECTIONS = [{ id: "core", label: "Core CS" }, { id: "maths", label: "Engineering maths" }, { id: "aptitude", label: "General aptitude" }] as const;
const ALL = CS_SHELF.flatMap((b) => b.chapters.map((c) => ({ ...c, subject: b.title, tint: b.tint })));

function Chip({ t, onPick, icon }: { t: StudyTab; onPick: () => void; icon?: ReactNode }) {
  return (
    <button type="button" onClick={onPick} className="flex min-w-0 max-w-full items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] py-1.5 pl-2.5 pr-3.5 text-left text-sm hover:bg-[var(--surface-secondary)]">
      {icon ?? <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `var(--tint-${t.tint ?? "peri"}-ink)` }} />}
      <span className="min-w-0 truncate"><span className="text-[var(--text-secondary)]">{t.subject} · </span><b className="text-[var(--text-primary)]">{t.title}</b></span>
    </button>
  );
}

export default function StudyNewTab() {
  const router = useRouter();
  const { tabs, closed, hydrate } = useStudyTabs();
  const [q, setQ] = useState("");
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("core");
  const books = CS_SHELF.filter((b) => b.band === section);
  const [bookId, setBookId] = useState<string>(CS_SHELF.find((b) => b.band === "core")!.id);
  const book = books.find((b) => b.id === bookId) ?? books[0];
  const lastRaw = useSyncExternalStore(() => () => {}, () => { try { return localStorage.getItem("renyxera.study.last"); } catch { return null; } }, () => null);
  const last = useMemo(() => { try { return lastRaw ? (JSON.parse(lastRaw) as { href: string; title: string }) : null; } catch { return null; } }, [lastRaw]);
  useEffect(() => { hydrate(); }, [hydrate]);
  const go = (href: string) => router.push(href);
  const term = q.trim().toLowerCase();
  const found = useMemo(() => (term ? ALL.filter((c) => `${c.subject} ${c.title}`.toLowerCase().includes(term)) : []), [term]);
  const pill = (on: boolean) => (on ? "pill-ink" : "pill-soft");

  return (
    <div className="space-y-5 pb-10">
      <div className="flex min-w-0 items-end gap-2">
        <Link href="/study" aria-label="Back to all books" className="pill-ink mb-1 inline-flex !h-9 shrink-0 items-center gap-1.5 !px-2.5 sm:!h-10 sm:!px-4"><ArrowLeft className="h-4 w-4" aria-hidden /><span className="hidden sm:inline">Books</span></Link>
        <div className="min-w-0 flex-1"><StudyTabs current={NEW} /></div>
      </div>
      <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Open a chapter in this tab</h1>

      {(last || tabs.length > 0 || closed.length > 0) && (
        <div className="space-y-2">
          {last && <div className="flex flex-wrap items-center gap-2"><span className="w-28 shrink-0 text-xs font-bold text-[var(--text-secondary)]">Continue</span><Chip t={{ href: last.href, title: last.title.split(": ").slice(1).join(": ") || last.title, subject: last.title.split(": ")[0] }} icon={<Play className="h-3.5 w-3.5 shrink-0" aria-hidden />} onPick={() => go(last.href)} /></div>}
          {tabs.length > 0 && <div className="flex flex-wrap items-center gap-2"><span className="inline-flex w-28 shrink-0 items-center gap-1 text-xs font-bold text-[var(--text-secondary)]"><BookOpen className="h-3.5 w-3.5" aria-hidden /> Open tabs</span>{tabs.slice(0, 6).map((t) => <Chip key={t.href} t={t} onPick={() => go(t.href)} />)}</div>}
          {closed.length > 0 && <div className="flex flex-wrap items-center gap-2"><span className="inline-flex w-28 shrink-0 items-center gap-1 text-xs font-bold text-[var(--text-secondary)]"><History className="h-3.5 w-3.5" aria-hidden /> Recently closed</span>{closed.slice(0, 5).map((t) => <Chip key={t.href} t={t} onPick={() => go(t.href)} />)}</div>}
        </div>
      )}

      <label className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4">
        <Search className="h-5 w-5 text-[var(--text-muted)]" aria-hidden />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search every subject and chapter" aria-label="Search chapters" className="search-bare h-12 flex-1 bg-transparent text-[var(--text-primary)]" />
        {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search"><X className="h-4 w-4" /></button>}
      </label>

      {term ? (
        <section className="card-pastel p-5" data-tint="peri">
          <p className="mb-3 text-sm font-bold text-[var(--tint-ink)]">{found.length} match{found.length === 1 ? "" : "es"}</p>
          <div className="grid gap-2 md:grid-cols-2">
            {found.slice(0, 40).map((c) => (
              <button key={c.subject + c.id} type="button" disabled={!c.href} onClick={() => c.href && go(c.href)} className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 text-left enabled:hover:bg-[var(--surface-secondary)] disabled:opacity-60">
                <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `var(--tint-${c.tint ?? "peri"}-ink)` }} />
                <span className="min-w-0 flex-1"><span className="block text-xs font-bold text-[var(--text-secondary)]">{c.subject}</span><span className="block truncate font-bold text-[var(--text-primary)]">{c.title}</span></span>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">{c.href ? c.ready : "Being written"}</span>
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="card-pastel p-5" data-tint={book?.tint ?? "peri"}>
          <p className="mb-2 text-xs font-bold text-[var(--text-secondary)]">1. Section</p>
          <div className="flex flex-wrap gap-2">{SECTIONS.map((s) => <button key={s.id} type="button" aria-pressed={section === s.id} onClick={() => { setSection(s.id); setBookId(CS_SHELF.find((b) => b.band === s.id)!.id); }} className={pill(section === s.id)}>{s.label}</button>)}</div>
          <p className="mb-2 mt-4 text-xs font-bold text-[var(--text-secondary)]">2. Subject</p>
          <div className="flex flex-wrap gap-2">{books.map((b) => { const r = b.chapters.filter((c) => c.href).length; return <button key={b.id} type="button" aria-pressed={book?.id === b.id} onClick={() => setBookId(b.id)} className={pill(book?.id === b.id)}>{b.title}<span className="ml-1.5 rounded-full bg-black/10 px-1.5 text-[10px] font-bold dark:bg-white/15">{b.chapters.length} chapters</span></button>; })}</div>
          {book && <>
            <p className="mb-2 mt-4 text-xs font-bold text-[var(--text-secondary)]">3. Chapter</p>
            <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {book.chapters.map((c, i) => (
                <li key={c.id}>
                  <button type="button" disabled={!c.href} onClick={() => c.href && go(c.href)} className="flex w-full items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 text-left enabled:hover:bg-[var(--surface-secondary)] disabled:opacity-60">
                    <span className="font-num text-sm text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1 font-bold text-[var(--text-primary)]">{c.title}</span>
                    {c.href ? <span className="shrink-0 rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-bold text-white">{c.ready}</span> : <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--text-secondary)]"><Feather className="h-3 w-3" aria-hidden /> Being written</span>}
                  </button>
                </li>
              ))}
            </ol>
          </>}
        </section>
      )}
      <p className="text-sm text-[var(--text-secondary)]">Keyboard: Alt+1 to Alt+8 jump to a tab, Alt+] and Alt+[ move between tabs, Alt+W closes the current tab, Shift+Alt+T reopens the last closed tab.</p>
    </div>
  );
}
