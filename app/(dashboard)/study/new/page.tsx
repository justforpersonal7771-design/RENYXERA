"use client";

/**
 * Study New Tab page: what the "+" opens. Owner, 19 Nov: one screen, no page scroll. Three columns on desktop, each scrolling
 * on its own: jump back in (search, continue, open tabs, recently closed) · section and subject · chapters. Stacks on phones.
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

function Dot({ tint }: { tint?: string }) { return <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: `var(--tint-${tint ?? "peri"}-ink)` }} />; }
function List({ title, icon, items, go }: { title: string; icon: ReactNode; items: StudyTab[]; go: (h: string) => void }) {
  return (
    <div>
      <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)]">{icon}{title}</p>
      <div className="space-y-1.5">{items.map((t) => (
        <button key={t.href} type="button" onClick={() => go(t.href)} className="flex w-full items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-2 text-left hover:bg-[var(--surface-secondary)]">
          <Dot tint={t.tint} />
          <span className="min-w-0 flex-1"><span className="block text-[11px] font-bold text-[var(--text-secondary)]">{t.subject}</span><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{t.title}</span></span>
        </button>))}</div>
    </div>
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

  return (
    <div className="flex flex-col gap-4 pb-6 lg:h-[calc(100dvh-8.5rem)] lg:pb-0" data-fill-height>
      <div className="flex min-w-0 shrink-0 items-end gap-2">
        <Link href="/study" aria-label="Back to all books" className="pill-ink mb-1 inline-flex !h-9 shrink-0 items-center gap-1.5 !px-2.5 sm:!h-10 sm:!px-4"><ArrowLeft className="h-4 w-4" aria-hidden /><span className="hidden sm:inline">Books</span></Link>
        <div className="min-w-0 flex-1"><StudyTabs current={NEW} /></div>
      </div>
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.25fr)]">
        <section aria-label="Jump back in" className="card-pastel flex min-h-0 flex-col p-4" data-tint="butter">
          <label className="flex shrink-0 items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
            <Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search every chapter" aria-label="Search chapters" className="search-bare h-10 min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)]" />
            {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search"><X className="h-4 w-4" /></button>}
          </label>
          <div className="custom-scrollbar mt-3 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {term ? (
              <div>
                <p className="mb-2 text-xs font-bold text-[var(--text-secondary)]">{found.length} match{found.length === 1 ? "" : "es"}</p>
                <div className="space-y-1.5">{found.slice(0, 40).map((c) => (
                  <button key={c.subject + c.id} type="button" disabled={!c.href} onClick={() => c.href && go(c.href)} className="flex w-full items-center gap-2 rounded-xl bg-[var(--surface)] px-3 py-2 text-left enabled:hover:bg-[var(--surface-secondary)] disabled:opacity-60">
                    <Dot tint={c.tint} />
                    <span className="min-w-0 flex-1"><span className="block text-[11px] font-bold text-[var(--text-secondary)]">{c.subject}</span><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{c.title}</span></span>
                    <span className="shrink-0 text-[11px] font-semibold text-[var(--text-secondary)]">{c.href ? "Open" : "Being written"}</span>
                  </button>))}</div>
              </div>
            ) : <>
              {last && <List title="Continue" icon={<Play className="h-3.5 w-3.5" aria-hidden />} items={[{ href: last.href, title: last.title.split(": ").slice(1).join(": ") || last.title, subject: last.title.split(": ")[0] }]} go={go} />}
              {tabs.length > 0 && <List title="Open tabs" icon={<BookOpen className="h-3.5 w-3.5" aria-hidden />} items={tabs} go={go} />}
              {closed.length > 0 && <List title="Recently closed" icon={<History className="h-3.5 w-3.5" aria-hidden />} items={closed.slice(0, 8)} go={go} />}
              {!last && !tabs.length && !closed.length && <p className="text-sm text-[var(--text-secondary)]">Pick a section, a subject and a chapter.</p>}
            </>}
          </div>
          <p className="mt-2 hidden shrink-0 text-[11px] text-[var(--text-secondary)] lg:block">Alt+1 to Alt+8 jump to a tab · Alt+] and Alt+[ move · Alt+W closes · Shift+Alt+T reopens</p>
        </section>
        <section aria-label="Section and subject" className="card-pastel flex min-h-0 flex-col p-4" data-tint="peri">
          <div className="flex shrink-0 flex-wrap gap-1.5">{SECTIONS.map((s) => <button key={s.id} type="button" aria-pressed={section === s.id} onClick={() => { setSection(s.id); setBookId(CS_SHELF.find((b) => b.band === s.id)!.id); }} className={`${section === s.id ? "pill-ink" : "pill-soft"} !h-9 !px-3 text-sm`}>{s.label}</button>)}</div>
          <ul className="custom-scrollbar mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">{books.map((b) => (
            <li key={b.id}><button type="button" aria-pressed={book?.id === b.id} onClick={() => setBookId(b.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left ${book?.id === b.id ? "bg-[var(--surface)] shadow-sm ring-2 ring-[var(--tint-ink)]" : "bg-[var(--surface)]/60 hover:bg-[var(--surface)]"}`}>
              <span aria-hidden className="h-8 w-1.5 shrink-0 rounded-full" style={{ background: `var(--tint-${b.tint ?? "peri"}-ink)` }} />
              <span className="min-w-0 flex-1 text-sm font-bold text-[var(--text-primary)]">{b.title}</span>
              <span className="shrink-0 text-xs font-semibold text-[var(--text-secondary)]">{b.chapters.length} chapters</span>
            </button></li>))}</ul>
        </section>
        <section aria-label="Chapters" className="card-pastel flex min-h-0 flex-col p-4" data-tint={book?.tint ?? "peri"}>
          <p className="shrink-0 text-xs font-extrabold uppercase tracking-[.14em] text-[var(--tint-ink)]">{book?.title}</p>
          <ol className="custom-scrollbar mt-3 min-h-0 flex-1 space-y-1.5 overflow-y-auto pr-1">{book?.chapters.map((c, i) => (
            <li key={c.id}><button type="button" disabled={!c.href} onClick={() => c.href && go(c.href)} className="flex w-full items-center gap-3 rounded-xl bg-[var(--surface)] px-3 py-2.5 text-left enabled:hover:bg-[var(--surface-secondary)] disabled:opacity-60">
              <span className="font-num text-sm text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 text-sm font-bold text-[var(--text-primary)]">{c.title}</span>
              {c.href ? <span className="shrink-0 rounded-full bg-emerald-700 px-2 py-0.5 text-[11px] font-bold text-white">{c.ready?.replace(/ ready.*/, "")}</span> : <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-[var(--text-secondary)]"><Feather className="h-3 w-3" aria-hidden /> Being written</span>}
            </button></li>))}</ol>
        </section>
      </div>
    </div>
  );
}
