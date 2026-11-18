"use client";

/**
 * Study New Tab page (docs/study-materials/BOOK-TABS.md): what the "+" opens. Your open tabs, every ready chapter with
 * search, and recently closed tabs to bring back.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, History, Search, X } from "lucide-react";
import { CS_SHELF } from "@/lib/study/catalog";
import { useStudyTabs, type StudyTab } from "@/lib/study/tabs";
import { NEW_TAB, StudyTabs } from "@/components/study/study-tabs";

const NEW: StudyTab = { href: NEW_TAB, title: "New tab", subject: "Pick a chapter" };

const READY: StudyTab[] = CS_SHELF.flatMap((b) => b.chapters.filter((c) => c.href).map((c) => ({ href: c.href!, title: c.title, subject: b.title, tint: b.tint })));
const ALL = CS_SHELF.flatMap((b) => b.chapters.map((c) => ({ ...c, subject: b.title, tint: b.tint })));

function Row({ t, onPick, extra }: { t: StudyTab; onPick: () => void; extra?: string }) {
  return (
    <button type="button" onClick={onPick} className="flex w-full items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 text-left hover:-translate-y-0.5 hover:shadow-md transition-transform">
      <span aria-hidden className="h-3 w-3 shrink-0 rounded-full" style={{ background: `var(--tint-${t.tint ?? "peri"}-ink)` }} />
      <span className="min-w-0 flex-1"><span className="block text-[11px] font-extrabold uppercase tracking-[.12em] text-[var(--text-secondary)]">{t.subject}</span><span className="block truncate font-bold text-[var(--text-primary)]">{t.title}</span></span>
      {extra && <span className="text-xs font-semibold text-[var(--text-secondary)]">{extra}</span>}
    </button>
  );
}

export default function StudyNewTab() {
  const router = useRouter();
  const { tabs, closed, hydrate, open } = useStudyTabs();
  const [q, setQ] = useState("");
  useEffect(() => { hydrate(); }, [hydrate]);
  const go = (t: StudyTab) => { open(t, t.href); router.push(t.href); };
  const term = q.trim().toLowerCase();
  const found = useMemo(() => (term ? ALL.filter((c) => `${c.subject} ${c.title}`.toLowerCase().includes(term)) : []), [term]);
  return (
    <div className="space-y-6 pb-10">
      <div className="flex min-w-0 items-end gap-2">
        <Link href="/study" className="pill-ink mb-1 inline-flex shrink-0 items-center gap-1.5"><ArrowLeft className="h-4 w-4" aria-hidden /> Books</Link>
        <div className="min-w-0 flex-1"><StudyTabs current={NEW} /></div>
      </div>
      <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Open a chapter in this tab</h1>
      <label className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4">
        <Search className="h-5 w-5 text-[var(--text-muted)]" aria-hidden />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search every subject and chapter" aria-label="Search chapters" className="search-bare h-12 flex-1 bg-transparent text-[var(--text-primary)]" />
        {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search"><X className="h-4 w-4" /></button>}
      </label>
      {term ? (
        <section className="card-pastel p-5" data-tint="peri">
          <p className="mb-3 text-sm font-bold text-[var(--tint-ink)]">{found.length} match{found.length === 1 ? "" : "es"}</p>
          <div className="grid gap-2 md:grid-cols-2">
            {found.map((c) => c.href ? <Row key={c.subject + c.id} t={{ href: c.href, title: c.title, subject: c.subject, tint: c.tint }} onPick={() => go({ href: c.href!, title: c.title, subject: c.subject, tint: c.tint })} extra="Ready" />
              : <div key={c.subject + c.id} className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 opacity-60"><span className="min-w-0 flex-1"><span className="block text-[11px] font-extrabold uppercase tracking-[.12em] text-[var(--text-secondary)]">{c.subject}</span><span className="block truncate font-bold text-[var(--text-primary)]">{c.title}</span></span><span className="text-xs font-semibold">Being written</span></div>)}
          </div>
        </section>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          <section className="card-pastel p-5" data-tint="butter">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--tint-ink)]"><BookOpen className="h-4 w-4" aria-hidden /> Open tabs</p>
            {tabs.length ? <div className="space-y-2">{tabs.map((t) => <Row key={t.href} t={t} onPick={() => router.push(t.href)} extra={t.pinned ? "Pinned" : undefined} />)}</div> : <p className="text-sm text-[var(--text-secondary)]">No tabs open yet.</p>}
          </section>
          <section className="card-pastel p-5" data-tint="mint">
            <p className="mb-3 text-sm font-bold text-[var(--tint-ink)]">Ready to read</p>
            {READY.length ? <div className="space-y-2">{READY.map((t) => <Row key={t.href} t={t} onPick={() => go(t)} />)}</div> : <Link href="/study" className="pill-ink">Browse the library</Link>}
          </section>
          <section className="card-pastel p-5" data-tint="rose">
            <p className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--tint-ink)]"><History className="h-4 w-4" aria-hidden /> Recently closed</p>
            {closed.length ? <div className="space-y-2">{closed.map((t) => <Row key={t.href} t={t} onPick={() => go(t)} />)}</div> : <p className="text-sm text-[var(--text-secondary)]">Tabs you close show up here, so you can bring them back.</p>}
          </section>
        </div>
      )}
      <p className="text-sm text-[var(--text-secondary)]">Keyboard: Alt+1 to Alt+8 jump to a tab, Alt+] and Alt+[ move between tabs, Alt+W closes the current tab, Shift+Alt+T reopens the last closed tab.</p>
    </div>
  );
}
