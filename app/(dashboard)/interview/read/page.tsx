"use client";

/**
 * Interview library, laid out like the Study section: tracks -> books -> chapters -> lesson.
 * The lesson has the outline on the left, the article in the middle and a tool rail on the right: your progress, highlights and notes
 * (select any text), practice doors (flashcards, code lab, mock interview) and the AI tutor.
 */
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, BookOpenText, Check, Clock, Lightbulb, MessageSquarePlus, NotebookPen, Sparkles, Star, Trash2, X } from "lucide-react";
import { ivPost, type IvDoc } from "@/components/interview/interview-gate";
import { useIvLibrary } from "@/components/interview/use-iv-library";
import { IvMarkdown, extractToc } from "@/components/interview/iv-markdown";
import { IvTutorPanel, type TutorSeed } from "@/components/interview/iv-tutor-panel";
import { HL_COLORS, paintHighlights, findRange, type HlColor } from "@/components/interview/iv-highlights";
import { TRACKS, trackOf, bookIdOf, KIND_GROUP } from "@/lib/interview/tracks";

type Full = IvDoc & { body: string };
type Note = { id: number; doc_id: string; quote: string; note: string; color: HlColor; created_at: string };
type Card = { id: string; type: string; ch: string; front: string; back: string; more: string };
const TINTS = ["lilac", "sky", "mint", "peach", "butter", "rose"] as const;
const norm = (s: string) => s.toLowerCase().replace(/^\d+[_\s-]*/, "").replace(/[^a-z0-9]+/g, "");
const scroller = () => document.getElementById("app-scroll");
const SWATCH: Record<HlColor, string> = { yellow: "#facc15", green: "#4ade80", pink: "#f472b6", blue: "#60a5fa" };

/* ---------- 1. library: every track and its books ---------- */
function Library({ track }: { track?: string }) {
  const { ready, docs, done } = useIvLibrary();
  const byBook = useMemo(() => { const m = new Map<string, IvDoc[]>(); for (const d of docs) m.set(d.book, [...(m.get(d.book) ?? []), d]); return m; }, [docs]);
  if (!ready) return <div className="skeleton-shimmer h-64 rounded-3xl" aria-hidden />;
  const known = new Set(TRACKS.flatMap((t) => t.books));
  const extra = [...byBook.keys()].filter((b) => !known.has(b));
  const all0 = [...TRACKS, ...(extra.length ? [{ id: "more", title: "More", blurb: "", tint: "sky" as const, books: extra }] : [])];
  const groups = track ? all0.filter((g) => g.id === track) : all0;
  const one = track ? groups[0] : undefined;
  if (track && !one) return <p className="text-[var(--text-secondary)]">That track does not exist. <Link href="/interview/read" className="font-bold underline">Back to the library</Link></p>;
  const oneBooks = one ? one.books.filter((b) => byBook.has(b)) : [];
  const oneDocs = oneBooks.flatMap((b) => byBook.get(b)!);
  return (
    <div className="space-y-8">
      {one ? (
        <section className="card-pastel p-6 sm:p-8" data-tint={one.tint} aria-label={one.title}>
          <Link href="/interview/read" className="section-label"><ArrowLeft className="h-3.5 w-3.5" /> All tracks</Link>
          <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] text-[var(--text-primary)] sm:text-4xl">{one.title}</h1>
          <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">{one.blurb}</p>
          <p className="mt-3 text-sm font-bold text-[var(--text-secondary)]">{oneBooks.length} books · {oneDocs.length} lessons · <span className="font-num">{oneDocs.filter((d) => done.has(d.id)).length}</span> read</p>
        </section>
      ) : (
      <section className="card-pastel p-6 sm:p-8" data-tint="butter" aria-label="Library">
        <span className="section-label"><BookOpenText className="h-3.5 w-3.5" /> Library</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] text-[var(--text-primary)] sm:text-4xl">{byBook.size} books, {docs.length} lessons,<br />one path to the interview.</h1>
        <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">Pick a track. Every lesson ends with a check-yourself, and anything you select can be highlighted, noted or sent to the tutor.</p>
      </section>
      )}
      {groups.map((t) => {
        const books = t.books.filter((b) => byBook.has(b));
        if (!books.length) return null;
        const all = books.flatMap((b) => byBook.get(b)!), n = all.filter((d) => done.has(d.id)).length;
        return (
          <section key={t.id} aria-label={t.title}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              {one ? <span /> : <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]"><Link href={`/interview/read?track=${t.id}`} className="hover:underline">{t.title}</Link></h2>}
              <p className="text-sm text-[var(--text-muted)]"><span className="font-num font-bold text-[var(--text-secondary)]">{n}</span> of {all.length} read</p>
            </div>
            {t.blurb && <p className="text-sm text-[var(--text-secondary)]">{t.blurb}</p>}
            <ul className="mt-4 grid gap-3 md:grid-cols-2">
              {books.map((b, i) => {
                const ds = byBook.get(b)!, d = ds.filter((x) => done.has(x.id)).length, mins = ds.reduce((a, x) => a + (x.meta?.minutes ?? 0), 0), pct = Math.round((d / ds.length) * 100);
                return (
                  <li key={b} className="min-w-0">
                    <Link href={`/interview/read?book=${encodeURIComponent(b)}`} className="card-pastel flex items-center gap-4 p-4" data-tint={t.tint}>
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-num text-lg font-extrabold" style={{ background: `var(--tint-${t.tint})`, color: `var(--tint-${t.tint}-ink)` }}>{i + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-[var(--text-primary)]">{ds[0].book_title}</span>
                        <span className="mt-0.5 flex items-center gap-3 text-xs text-[var(--text-muted)]"><span>{ds.filter((x) => x.kind === "chapter").length} chapters</span>{mins > 0 && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{Math.round(mins / 60 * 10) / 10}h</span>}</span>
                        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><span className="block h-full rounded-full bg-[var(--ink)]" style={{ width: `${pct}%` }} /></span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

/* ---------- 2. one book: its chapters ---------- */
function Chapters({ book }: { book: string }) {
  const { ready, docs, done, progress } = useIvLibrary();
  const [star, setStar] = useState(false);
  const ds = useMemo(() => docs.filter((d) => d.book === book).sort((a, b) => (KIND_GROUP[a.kind]?.order ?? 9) - (KIND_GROUP[b.kind]?.order ?? 9) || a.ord - b.ord), [docs, book]);
  if (!ready) return <div className="skeleton-shimmer h-64 rounded-3xl" aria-hidden />;
  if (!ds.length) return <p className="text-[var(--text-secondary)]">That book is not in the library.</p>;
  const t = trackOf(book), chapters = ds.filter((d) => d.kind === "chapter"), back = ds.filter((d) => d.kind !== "chapter");
  const n = ds.filter((d) => done.has(d.id)).length;
  const last = [...progress].filter((p) => p.doc_id.startsWith(book + ":")).sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  const next = ds.find((d) => !done.has(d.id)) ?? ds[0];
  const resume = last && ds.find((d) => d.id === last.doc_id && !done.has(d.id)) || next;
  const rows = (list: IvDoc[], base: number) => list.filter((d) => !star || d.meta?.star || d.kind !== "chapter").map((d, i) => (
    <li key={d.id} className="min-w-0">
      <Link href={`/interview/read?doc=${encodeURIComponent(d.id)}`} className="card-pastel flex items-center gap-4 p-4" data-tint={done.has(d.id) ? "mint" : t.tint}>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl font-num text-base font-extrabold" style={{ background: `var(--tint-${done.has(d.id) ? "mint" : t.tint})`, color: `var(--tint-${done.has(d.id) ? "mint" : t.tint}-ink)` }}>{done.has(d.id) ? <Check className="h-5 w-5" /> : base + i + 1}</span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2"><span className="truncate font-bold text-[var(--text-primary)]">{d.title}</span>{d.meta?.star && <Star className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-label="On the short path" />}</span>
          <span className="mt-0.5 flex items-center gap-3 text-xs text-[var(--text-muted)]">{d.meta?.minutes ? <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{d.meta.minutes} min</span> : null}{d.meta?.likelihood && <span>{d.meta.likelihood} chance in interviews</span>}</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
      </Link>
    </li>
  ));
  return (
    <div className="space-y-6">
      <section className="card-pastel p-6 sm:p-8" data-tint={t.tint} aria-label={ds[0].book_title}>
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Link href="/interview/read" className="section-label"><ArrowLeft className="h-3.5 w-3.5" /> {t.title}</Link>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] text-[var(--text-primary)] sm:text-4xl">{ds[0].book_title}</h1>
            <p className="mt-2 text-[var(--text-secondary)]">{chapters.length} chapters, {back.length} back-matter pages. Short path shows the starred chapters only.</p>
            <label className="mt-3 inline-flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={star} onChange={(e) => setStar(e.target.checked)} />Short path only</label>
          </div>
          <div className="card-inset space-y-3 p-5">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">{n} of {ds.length} read</p>
            <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full bg-[var(--ink)]" style={{ width: `${(n / ds.length) * 100}%` }} /></div>
            <Link href={`/interview/read?doc=${encodeURIComponent(resume.id)}`} className="btn-main inline-flex">{n ? `Continue: ${resume.title.slice(0, 28)}` : "Start reading"}</Link>
            <div className="flex flex-wrap gap-2"><Link href={`/interview-cards?book=${encodeURIComponent(book)}`} className="pill-soft">Flashcards</Link><Link href="/interview/lab" className="pill-soft">Code lab</Link><Link href={`/interview/tutor?track=${t.id}`} className="pill-soft">Mock interview</Link></div>
          </div>
        </div>
      </section>
      <ul className="grid gap-3 md:grid-cols-2">{rows(chapters, 0)}</ul>
      {back.length > 0 && <><h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">Back matter</h2><ul className="grid gap-3 md:grid-cols-2">{rows(back, chapters.length)}</ul></>}
    </div>
  );
}

/* ---------- 3. a lesson: outline | article | tools ---------- */
function Lesson({ id }: { id: string }) {
  const router = useRouter();
  const { docs, done, mark } = useIvLibrary();
  const [doc, setDoc] = useState<Full | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [active, setActive] = useState("");
  const [sel, setSel] = useState<{ x: number; y: number; text: string; touch?: boolean } | null>(null);
  const [draft, setDraft] = useState<{ x: number; y: number; text: string; note: string } | null>(null);
  const [tutor, setTutor] = useState<TutorSeed | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [shown, setShown] = useState<Record<string, boolean>>({});
  const art = useRef<HTMLDivElement>(null);
  const book = bookIdOf(id), t = trackOf(book);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the lesson state when a different lesson opens
    setDoc(null); setNotes([]); setSel(null); setDraft(null);
    void fetch(`/api/interview/docs?id=${encodeURIComponent(id)}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: Full | null) => { if (d) { setDoc(d); void ivPost({ doc: { id, status: "reading" } }); mark(id, "reading"); scroller()?.scrollTo({ top: 0 }); } });
    void fetch(`/api/interview/notes?doc=${encodeURIComponent(id)}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { notes: Note[] } | null) => setNotes(d?.notes ?? []));
  }, [id, mark]);
  useEffect(() => { void fetch(`/api/interview/cards?book=${encodeURIComponent(book)}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : [])).then((d: Card[]) => setCards(d)); }, [book]);

  const toc = useMemo(() => (doc ? extractToc(doc.body) : []), [doc]);
  const siblings = useMemo(() => docs.filter((d) => d.book === book).sort((a, b) => (KIND_GROUP[a.kind]?.order ?? 9) - (KIND_GROUP[b.kind]?.order ?? 9) || a.ord - b.ord), [docs, book]);
  const idx = siblings.findIndex((d) => d.id === id);
  const checks = useMemo(() => (doc ? cards.filter((c) => c.type !== "Term" && (norm(c.ch).includes(norm(doc.title).slice(0, 24)) || norm(doc.title).includes(norm(c.ch).slice(0, 24)))).slice(0, 4) : []), [cards, doc]);
  const termCount = useMemo(() => (doc ? cards.filter((c) => norm(c.ch).includes(norm(doc.title).slice(0, 24))).length : 0), [cards, doc]);

  // paint highlights whenever the chapter or its notes change
  useEffect(() => { if (!doc || !art.current) return; return paintHighlights(art.current, notes); }, [doc, notes]);
  // outline: which heading is on screen
  useEffect(() => {
    if (!doc || !art.current) return;
    const hs = [...art.current.querySelectorAll<HTMLElement>("h2[id], h3[id]")];
    const io = new IntersectionObserver((es) => { const v = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive((v.target as HTMLElement).id); }, { root: scroller(), rootMargin: "-90px 0px -65% 0px" });
    hs.forEach((h) => io.observe(h));
    return () => io.disconnect();
  }, [doc]);
  // text selection -> floating toolbar
  useEffect(() => {
    // Mouse: the toolbar floats above the selection. Touch (long-press, then drag the handles): there is no mouseup, and the phone's own
    // copy menu sits on the selection, so the toolbar waits until the selection stops changing and docks above the bottom bar instead.
    const touch = () => window.matchMedia?.("(pointer: coarse)").matches ?? false;
    const read = () => {
      const s = window.getSelection();
      if (!s || s.isCollapsed || !art.current || !s.anchorNode || !art.current.contains(s.anchorNode)) { setSel(null); return; }
      const text = s.toString().replace(/\s+/g, " ").trim();
      if (text.length < 3) { setSel(null); return; }
      const r = s.getRangeAt(0).getBoundingClientRect();
      const t = touch();
      setSel({ x: t ? window.innerWidth / 2 : Math.min(Math.max(r.left + r.width / 2, 150), window.innerWidth - 150), y: t ? Math.max(window.innerHeight - 250, 120) : Math.max(r.top - 52, 76), text: text.slice(0, 600), touch: t });
    };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onChange = () => {
      if (window.getSelection()?.isCollapsed) { clearTimeout(timer); setSel(null); return; }
      clearTimeout(timer); timer = setTimeout(read, touch() ? 250 : 120);   // wait until the finger or mouse stops moving
    };
    document.addEventListener("selectionchange", onChange);
    document.addEventListener("keyup", read);
    return () => { clearTimeout(timer); document.removeEventListener("selectionchange", onChange); document.removeEventListener("keyup", read); };
  }, []);

  const addNote = useCallback(async (text: string, color: HlColor, note = "") => {
    const r = await fetch("/api/interview/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ doc: id, quote: text, color, note }) });
    const d = (await r.json()) as { note?: Note };
    if (d.note) setNotes((n) => [d.note!, ...n]);
    window.getSelection()?.removeAllRanges(); setSel(null); setDraft(null);
  }, [id]);
  const saveNote = (n: Note, note: string) => { setNotes((x) => x.map((y) => (y.id === n.id ? { ...y, note } : y))); void fetch("/api/interview/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id, note }) }); };
  const delNote = (n: Note) => { setNotes((x) => x.filter((y) => y.id !== n.id)); void fetch(`/api/interview/notes?id=${n.id}`, { method: "DELETE" }); };
  const jump = (n: Note) => { const r = art.current && findRange(art.current, n.quote); if (r) { const top = r.getBoundingClientRect().top + (scroller()?.scrollTop ?? 0) - 120; scroller()?.scrollTo({ top, behavior: "smooth" }); } };
  const ask = (mode: TutorSeed["mode"], text?: string) => { setTutor({ key: `${Date.now()}`, mode, text, title: doc?.title, context: doc?.body.slice(0, 5000) }); setDrawer(true); window.getSelection()?.removeAllRanges(); setSel(null); };
  const runInLab = (lang: string, code: string) => { try { sessionStorage.setItem("iv_lab_seed", JSON.stringify({ lang, code, title: doc?.title })); } catch { /* private mode */ } router.push("/interview/lab"); };
  const finish = (goNext: boolean) => { void ivPost({ doc: { id, status: "done" } }); mark(id, "done"); if (goNext && siblings[idx + 1]) router.push(`/interview/read?doc=${encodeURIComponent(siblings[idx + 1].id)}`); };
  const grade = (c: Card, ok: boolean) => { setShown((s) => ({ ...s, [c.id]: true })); void ivPost({ attempt: { kind: "card", id: c.id, ok, detail: { q: c.front.slice(0, 160), note: doc?.title } } }); };

  if (!doc) return <div className="skeleton-shimmer h-96 rounded-3xl" aria-hidden />;
  const prev = siblings[idx - 1], next = siblings[idx + 1];
  return (
    <div className="grid gap-6 lg:grid-cols-[230px_minmax(0,1fr)] xl:grid-cols-[230px_minmax(0,1fr)_320px]">
      <nav aria-label="In this chapter" className="lg:sticky lg:top-[calc(var(--sticky-top,8px)+64px)] lg:max-h-[calc(100dvh-10rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-2">
        <Link href={`/interview/read?book=${encodeURIComponent(book)}`} className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><ArrowLeft className="h-4 w-4" /> All chapters</Link>
        <label className="mb-3 block"><span className="sr-only">Jump to another chapter</span>
          <select value={id} onChange={(e) => router.push(`/interview/read?doc=${encodeURIComponent(e.target.value)}`)} className="h-10 w-full rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-2 text-sm font-semibold">
            {siblings.map((d) => <option key={d.id} value={d.id}>{done.has(d.id) ? "✓ " : ""}{d.title}</option>)}
          </select></label>
        {toc.length > 0 && <ol className="hidden space-y-0.5 border-l border-[var(--border)] lg:block">
          {toc.map((h) => <li key={h.id}><a href={`#${h.id}`} onClick={(e) => { e.preventDefault(); const el = document.getElementById(h.id); const top = (el?.getBoundingClientRect().top ?? 0) + (scroller()?.scrollTop ?? 0) - 100; scroller()?.scrollTo({ top, behavior: "smooth" }); }}
            className={`-ml-px block border-l-2 py-1.5 text-sm transition-colors ${h.level === 3 ? "pl-6" : "pl-3"} ${active === h.id ? "border-[var(--ink)] font-semibold text-[var(--text-primary)]" : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"}`}>{h.text}</a></li>)}
        </ol>}
      </nav>

      <article className="min-w-0 space-y-8">
        <header>
          <p className="text-sm font-semibold text-[var(--text-muted)]">{t.title} · {doc.book_title}{doc.meta?.minutes ? ` · ${doc.meta.minutes} min` : ""}</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">{doc.title}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">{doc.meta?.star && <span className="pill-soft !h-7"><Star className="h-3 w-3" />Short path</span>}{doc.meta?.likelihood && <span className="pill-soft !h-7">{doc.meta.likelihood} chance in interviews</span>}{done.has(id) && <span className="pill-soft !h-7"><Check className="h-3 w-3" />Read</span>}</div>
        </header>
        <div ref={art}><IvMarkdown body={doc.body} onRun={runInLab} onAsk={(code) => ask("review", code)} /></div>

        {checks.length > 0 && (
          <section className="card-pastel p-5" data-tint="peri" aria-label="Check yourself">
            <p className="flex items-center gap-2 font-bold text-[var(--text-primary)]"><Lightbulb className="h-4 w-4" />Check yourself</p>
            <ul className="mt-3 space-y-4">{checks.map((c) => (
              <li key={c.id}>
                <p className="text-[var(--text-primary)]">{c.front}</p>
                {shown[c.id] ? <div className="mt-2 rounded-xl bg-[var(--surface)] p-3 text-sm"><IvMarkdown body={c.back + (c.more ? `\n\n${c.more}` : "")} /></div>
                  : <div className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={() => grade(c, true)} className="pill-ink">I knew it</button><button type="button" onClick={() => grade(c, false)} className="pill-soft">Show answer</button></div>}
              </li>))}</ul>
          </section>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-5">
          {prev ? <Link href={`/interview/read?doc=${encodeURIComponent(prev.id)}`} className="btn-soft !h-11"><ArrowLeft className="h-4 w-4" />{prev.title.slice(0, 26)}</Link> : <span />}
          <button type="button" onClick={() => finish(false)} className="btn-main !h-11"><Check className="h-4 w-4" />{done.has(id) ? "Read" : "Mark as read"}</button>
          {next ? <button type="button" onClick={() => finish(true)} className="btn-soft !h-11">Done, next: {next.title.slice(0, 22)}<ArrowRight className="h-4 w-4" /></button> : <span />}
        </div>
      </article>

      <aside className="space-y-4 xl:sticky xl:top-[calc(var(--sticky-top,8px)+64px)] xl:max-h-[calc(100dvh-10rem)] xl:self-start xl:overflow-y-auto xl:overscroll-contain xl:pr-1" aria-label="Lesson tools">
        <div className="card-pastel p-5" data-tint="mint">
          <p className="text-sm font-semibold text-[var(--text-secondary)]">This book</p>
          <p className="mt-1 font-display text-2xl font-extrabold text-[var(--text-primary)]">{siblings.filter((d) => done.has(d.id)).length} of {siblings.length} read</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface)]"><div className="h-full rounded-full bg-[var(--tint-mint-ink)]" style={{ width: `${(siblings.filter((d) => done.has(d.id)).length / Math.max(1, siblings.length)) * 100}%` }} /></div>
        </div>
        <div className="card-pastel p-5" data-tint="butter">
          <p className="flex items-center gap-2 font-bold text-[var(--text-primary)]"><NotebookPen className="h-4 w-4" />Highlights and notes <span className="font-num text-xs text-[var(--text-muted)]">{notes.length}</span></p>
          {notes.length === 0 ? <p className="mt-1 text-sm text-[var(--text-secondary)]">Select any text in the lesson to highlight it, add a note or ask the tutor.</p> : (
            <ul className="mt-3 max-h-[320px] space-y-2 overflow-y-auto pr-1">{notes.map((n) => (
              <li key={n.id} className="rounded-xl bg-[var(--surface)] p-3">
                <button type="button" onClick={() => jump(n)} className="block w-full text-left text-sm" style={{ borderLeft: `4px solid ${SWATCH[n.color]}`, paddingLeft: 8 }}>{n.quote.length > 110 ? n.quote.slice(0, 110) + "…" : n.quote}</button>
                <textarea defaultValue={n.note} onBlur={(e) => { if (e.target.value !== n.note) saveNote(n, e.target.value); }} rows={1} placeholder="Add a note…" aria-label="Note" className="mt-2 w-full resize-y rounded-lg border border-[var(--border)] bg-transparent px-2 py-1 text-xs outline-none" />
                <div className="mt-1 flex justify-between"><button type="button" onClick={() => ask("explain", n.quote)} className="text-xs font-bold text-[var(--text-secondary)]">Ask tutor</button><button type="button" onClick={() => delNote(n)} aria-label="Delete highlight" className="-m-2 grid h-10 w-10 place-items-center rounded-full text-xs text-[var(--text-muted)] hover:bg-[var(--surface-secondary)]"><Trash2 className="h-4 w-4" /></button></div>
              </li>))}</ul>)}
          <Link href="/interview/notes" className="pill-soft mt-3 inline-flex">Open notebook</Link>
        </div>
        <div className="card-pastel p-5" data-tint="peri">
          <p className="font-bold text-[var(--text-primary)]">Practise this</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{termCount ? `${termCount} flashcards come from this chapter.` : "Flashcards, labs and a mock interview for this book."}</p>
          <div className="mt-3 flex flex-wrap gap-2"><Link href={`/interview-cards?book=${encodeURIComponent(book)}`} className="pill-ink">Flashcards</Link><Link href="/interview/lab" className="pill-soft">Code lab</Link><Link href={`/interview/tutor?track=${t.id}`} className="pill-soft">Mock interview</Link></div>
        </div>
        <div className="card-pastel p-5" data-tint="sky">
          <p className="flex items-center gap-2 font-bold text-[var(--text-primary)]"><Sparkles className="h-4 w-4" />Interview tutor</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Stuck? Get this chapter explained, a quiz on it, or a spoken-style answer.</p>
          <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => ask("explain", doc.title)} className="pill-ink">Explain this chapter</button><button type="button" onClick={() => ask("quiz", doc.title)} className="pill-soft">Quiz me</button><button type="button" onClick={() => setDrawer(true)} className="pill-soft"><MessageSquarePlus className="h-3.5 w-3.5" />Chat</button></div>
        </div>
      </aside>

      {/* floating pieces live on the page body so a transformed parent can never move them off the screen */}
      {typeof document !== "undefined" && createPortal(<>
      {sel && !draft && (
        <div role="toolbar" aria-label="Selected text" style={sel.touch ? undefined : { left: sel.x, top: sel.y }} onMouseDown={(e) => e.preventDefault()} onTouchStart={(e) => e.stopPropagation()} className={`z-[500] flex items-center gap-1 border border-[var(--border)] bg-white shadow-xl dark:bg-[#1c2040] ${sel.touch ? "fixed inset-x-3 bottom-[calc(84px+env(safe-area-inset-bottom))] justify-center rounded-3xl p-2.5" : "fixed -translate-x-1/2 rounded-full p-1.5"}`}>
          {HL_COLORS.map((c) => <button key={c} type="button" onClick={() => void addNote(sel.text, c)} aria-label={`Highlight ${c}`} className={`${sel.touch ? "h-10 w-10" : "h-7 w-7"} shrink-0 rounded-full border-2 border-white`} style={{ background: SWATCH[c] }} />)}
          <span className="mx-1 h-5 w-px bg-[var(--border)]" />
          <button type="button" onClick={() => setDraft({ x: sel.x, y: sel.y, text: sel.text, note: "" })} className={`rounded-full px-3 text-xs font-bold hover:bg-[var(--surface-secondary)] ${sel.touch ? "py-3" : "py-1.5"}`}>Note</button>
          <button type="button" onClick={() => ask("explain", sel.text)} className={`rounded-full bg-[var(--ink)] px-3 text-xs font-bold text-[var(--background)] ${sel.touch ? "py-3" : "py-1.5"}`}>Ask tutor</button>
        </div>
      )}
      {draft && (
        <div style={{ left: draft.x, top: draft.y }} className="fixed z-[500] w-72 -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-white p-3 shadow-xl dark:bg-[#1c2040]">
          <p className="mb-2 border-l-4 border-yellow-400 pl-2 text-xs text-[var(--text-secondary)]">{draft.text.slice(0, 120)}</p>
          <textarea autoFocus value={draft.note} onChange={(e) => setDraft({ ...draft, note: e.target.value })} rows={3} placeholder="Your note…" aria-label="Your note" className="w-full resize-none rounded-xl border-2 border-[var(--border)] bg-transparent p-2 text-sm outline-none" />
          <div className="mt-2 flex justify-end gap-2"><button type="button" onClick={() => setDraft(null)} className="pill-soft !h-8">Cancel</button><button type="button" onClick={() => void addNote(draft.text, "yellow", draft.note)} className="pill-ink !h-8">Save</button></div>
        </div>
      )}
      {drawer && (
        <div className="fixed inset-0 z-[400]" role="dialog" aria-label="Interview tutor">
          <button type="button" aria-label="Close tutor" onClick={() => setDrawer(false)} className="absolute inset-0 bg-[rgba(26,28,41,.12)]" />
          <aside className="absolute bottom-4 right-4 top-[84px] flex w-[min(440px,calc(100vw-2rem))] flex-col rounded-3xl bg-white p-4 shadow-2xl dark:bg-[#1c2040]">
            <div className="mb-3 flex items-center justify-between"><p className="flex items-center gap-2 font-display text-lg font-extrabold"><Sparkles className="h-4 w-4" />Interview tutor</p><button type="button" onClick={() => setDrawer(false)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><X className="h-4 w-4" /></button></div>
            <IvTutorPanel seed={tutor} className="min-h-0 flex-1" />
          </aside>
        </div>
      )}
      </>, document.body)}
    </div>
  );
}

function Reader() {
  const sp = useSearchParams();
  const doc = sp.get("doc"), book = sp.get("book"), track = sp.get("track");
  return doc ? <Lesson key={doc} id={doc} /> : book ? <Chapters book={book} /> : track ? <Library track={track} /> : <Library />;
}
export default function ReadPage() { return <Suspense fallback={null}><Reader /></Suspense>; }
