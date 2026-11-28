"use client";

/**
 * Study roadmap (owner request, 29 Nov 2026): a guide to where to start and what to read next.
 * Six ways to order the same chapters, and subjects the reader can leave out. The choices are shared (lib/study/roadmap-prefs.ts) so the panel, the path list and the bookshelf agree.
 * 29 Nov 2026: no modal; the panel is the top of the Study page and its choices filter and rank the shelves below it.
 * Every number comes from the real question bank (the tagged past questions of each chapter) and from this device's reading progress.
 * Nothing is locked: a chapter whose pack is not owned shows as "Sample" or "Pack" and still opens.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Compass, FileQuestion, Layers, LibraryBig, ListOrdered, Scale, Sparkles, Target } from "lucide-react";
import { CS_SHELF, type ShelfBook, type ShelfChapter } from "@/lib/study/catalog";
import { useLibraryFocus } from "@/lib/study/use-focus";
import { useStudyAccess } from "@/lib/study/use-study-access";
import { readSeen } from "@/lib/study/progress";
import { useRoadmapPrefs, type RoadmapMode } from "@/lib/study/roadmap-prefs";

type Mode = RoadmapMode;
export const MODES: { id: Mode; label: string; icon: typeof Scale; blurb: string }[] = [
  { id: "balanced", label: "Balanced", icon: Scale, blurb: "Heavy subjects first, but never before the subject they rest on. The best default." },
  { id: "marks", label: "Marks first", icon: Target, blurb: "Subjects ordered by the share of the paper they carry; inside a subject, the heaviest chapters first." },
  { id: "logical", label: "Logical order", icon: ListOrdered, blurb: "The order a beginner can follow: each subject builds on the one before it." },
  { id: "pyqs", label: "Most past questions", icon: FileQuestion, blurb: "Chapters across all subjects ranked by how many real past questions they have: the best fit for practice-first revision." },
  { id: "continue", label: "Continue reading", icon: BookOpen, blurb: "Chapters you have started come first, then the untouched ones in the balanced order. Finish what you began." },
  { id: "shelf", label: "Shelf order", icon: LibraryBig, blurb: "Exactly as the bookshelf lists them: no ranking, just your library from the top." },
];
/** What builds on what: C before data structures before algorithms; hardware together; systems after programming; theory late; maths and aptitude can run alongside. */
const LEARN = ["pds", "ds", "algo", "dl", "coa", "os", "dbms", "cn", "toc", "cd", "dm", "la", "prob", "calc", "verbal", "quant", "analytical", "spatial"];
const learnRank = (id: string) => { const i = LEARN.indexOf(id); return i < 0 ? LEARN.length : i; };
/** Balanced order works in tiers so a heavy subject never comes before the subject it rests on; inside a tier the heavier subject goes first. */
const TIER: Record<string, number> = { pds: 0, ds: 1, algo: 2, dl: 2, dm: 2, os: 3, coa: 3, dbms: 3, la: 3, prob: 3, cn: 4, toc: 4, cd: 5, calc: 5, verbal: 6, quant: 6, analytical: 6, spatial: 6 };
const tierOf = (id: string) => TIER[id] ?? 7;
const WHY: Record<string, string> = {
  pds: "Everything else is code or built on code: start here.", ds: "Needs C. Algorithms, databases and compilers all use these structures.", algo: "Needs data structures; the most examined thinking skill.",
  dl: "Gates and circuits are the base of computer organisation.", coa: "Needs digital logic; explains how the machine runs programs.", os: "Needs C and some organisation: processes, memory, files.",
  dbms: "Needs sets and logic; large share of marks and very learnable.", cn: "Layered ideas; read after OS for the sockets and transport parts.", toc: "Pure theory; easier once you can read grammars and algorithms.",
  cd: "Uses automata and grammars from TOC.", dm: "Logic, sets and graphs; supports algorithms and TOC.", la: "Short and scoring: matrices and eigenvalues.", prob: "Short and scoring: Bayes and distributions.", calc: "Short: limits, maxima, integrals.",
};

type Row = { key: string; b: ShelfBook; c: ShelfChapter; href: string; topics: number; share: number; qs: number; first: boolean; read: number };
const topicsOf = (c: ShelfChapter) => Number(/(\d+)\s+(?:topics?|chapters?)/.exec(c.ready ?? "")?.[1] ?? 1);
const STAGES = [{ t: "Stage 1 · Score the first half", s: "the chapters that carry the first 50% of the marks on your list" }, { t: "Stage 2 · Build depth", s: "the next 30%" }, { t: "Stage 3 · Finish and revise", s: "the last 20%, then mixed practice" }];

/** The roadmap's numbers: every ready chapter in the chosen order, the next one to read, and the rank of every book. */
export function useRoadmap() {
  const focus = useLibraryFocus();
  const access = useStudyAccess();
  const { mode, off } = useRoadmapPrefs();
  const [seen, setSeen] = useState<Record<string, { ch: string }>>({});
  // eslint-disable-next-line react-hooks/set-state-in-effect -- device-only progress, read once after mount
  useEffect(() => { setSeen(readSeen()); }, []);

  const rows = useMemo<Row[]>(() => {
    const readBy: Record<string, number> = {};
    for (const v of Object.values(seen)) readBy[v.ch] = (readBy[v.ch] ?? 0) + 1;
    const out: Row[] = [];
    for (const b of CS_SHELF) {
      let first = true;
      for (const c of b.chapters) {
        if (!c.href) continue;
        const f = focus.ready ? focus.chapter(b, c) : { qs: 0, share: 0 };
        out.push({ key: `${b.id}:${c.id}`, b, c, href: c.href, topics: topicsOf(c), share: f.share, qs: f.qs, first, read: Math.min(topicsOf(c), readBy[c.href] ?? 0) });
        first = false;
      }
    }
    return out;
  }, [focus, seen]);

  const ordered = useMemo(() => {
    const kept = rows.filter((r) => !off.includes(r.b.id));
    if (mode === "pyqs") return [...kept].sort((x, y) => y.qs - x.qs || y.share - x.share);
    const byBook = new Map<string, Row[]>(); kept.forEach((r) => byBook.set(r.b.id, [...(byBook.get(r.b.id) ?? []), r]));
    const books = [...byBook.keys()];
    const weight = (id: string) => (byBook.get(id) ?? []).reduce((s, r) => s + r.share, 0);
    const byWeight = [...books].sort((x, y) => weight(y) - weight(x));
    const wRank = (id: string) => byWeight.indexOf(id);
    const score = (id: string) => (mode === "marks" ? wRank(id) : mode === "logical" ? learnRank(id) : tierOf(id) * 100 + wRank(id));
    const shelfIds = CS_SHELF.map((b) => b.id);
    const bookOrder = [...books].sort(mode === "shelf" ? (x, y) => shelfIds.indexOf(x) - shelfIds.indexOf(y) : (x, y) => score(x) - score(y) || learnRank(x) - learnRank(y));
    const flat = bookOrder.flatMap((id) => {
      const rs = byBook.get(id) ?? [];
      return mode === "marks" ? [...rs].sort((x, y) => (x.first ? -1 : 0) - (y.first ? -1 : 0) || y.share - x.share) : rs;
    });
    if (mode !== "continue") return flat;
    const started = (r: Row) => r.read > 0 && r.read < r.topics;
    return [...flat.filter(started).sort((x, y) => y.read / y.topics - x.read / x.topics), ...flat.filter((r) => !started(r))];
  }, [rows, mode, off]);

  const total = ordered.reduce((s, r) => s + r.share, 0) || 1;
  const openOf = (r: Row) => (access.all || access.canRead(r.href, 1) ? "open" : access.canRead(r.href, 0) ? "sample" : "pack");
  const done = (r: Row) => r.read >= r.topics;
  const next = ordered.find((r) => !done(r) && openOf(r) !== "pack") ?? ordered.find((r) => !done(r)) ?? null;
  const staged = ordered.map((r, i) => { const before = ordered.slice(0, i).reduce((s, x) => s + x.share, 0) / total; return { r, stage: before < 0.5 ? 0 : before < 0.8 ? 1 : 2 }; });
  const readTotal = ordered.reduce((s, r) => s + r.read, 0), topicTotal = ordered.reduce((s, r) => s + r.topics, 0);
  /** book id to its place (1 = first) in the chosen order. Books with chapters come first in that order; books still being written follow in shelf order, so every shelf book carries a number (only books the learner switched off have none). */
  const rank = useMemo(() => {
    const m = new Map<string, number>();
    ordered.forEach((r) => { if (!m.has(r.b.id)) m.set(r.b.id, m.size + 1); });
    CS_SHELF.forEach((b) => { if (!m.has(b.id) && !off.includes(b.id)) m.set(b.id, m.size + 1); });
    return m;
  }, [ordered, off]);
  return { mode, off, ordered, staged, next, rank, total, readTotal, topicTotal, openOf, done, ready: rows.length > 0 };
}

/** The Study home hero: the one thing to do next, what follows it, and the order in force. Resume wins when the reader has a book open. */
export function RoadmapPanel({ resume }: { resume?: { href: string; title: string; started: boolean } | null }) {
  const rm = useRoadmap();
  const { mode, off, next, ordered, done, readTotal, topicTotal } = rm;
  const m = MODES.find((x) => x.id === mode)!;
  const included = CS_SHELF.length - off.filter((id) => CS_SHELF.some((b) => b.id === id)).length;
  const started = !!resume?.started;
  const tint = next?.b.tint ?? "peri";
  const primary = started && resume
    ? { kicker: "Continue where you stopped", title: resume.title, href: resume.href, cta: "Resume", row: null as Row | null }
    : next ? { kicker: "Start here", title: `${next.b.title}: ${next.c.title}`, href: next.href, cta: next.read > 0 ? "Continue" : "Start", row: next } : null;
  const upcoming = ordered.filter((r) => !done(r) && r.key !== primary?.row?.key).slice(0, started ? 3 : 4);
  const pct = primary?.row ? Math.round((primary.row.read / Math.max(1, primary.row.topics)) * 100) : 0;
  return (
    <div className="card-pastel flex min-w-0 flex-col gap-5 p-5 sm:p-7" data-tint={tint} role="region" aria-label="Study home">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.16em] text-[var(--tint-ink)]"><Compass className="h-4 w-4" aria-hidden /> The GATE CS library</h1>
        <a href="#planner" className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--surface)] px-3 text-xs font-bold text-[var(--text-primary)] transition-transform active:scale-[0.97] hover:bg-[var(--surface-secondary)]"><Layers className="h-3.5 w-3.5" aria-hidden /> {m.label} order · {included} subjects <span className="text-[var(--tint-ink)]">Change</span></a>
      </div>

      {primary && (
        <div>
          <p className="flex items-center gap-1.5 text-sm font-bold text-[var(--text-secondary)]"><Sparkles className="h-4 w-4" aria-hidden /> {primary.kicker}</p>
          <p className="mt-1 max-w-3xl text-balance font-display text-3xl font-extrabold leading-[1.08] tracking-[-0.025em] text-[var(--text-primary)] sm:text-[2.6rem]">{primary.title}</p>
          {primary.row && (
            <>
              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                {primary.row.share > 0 && <span className="rounded-full bg-[var(--surface)] px-3 py-1 font-bold text-[var(--text-primary)]"><span className="font-num">{primary.row.share.toFixed(1)}%</span> of the paper</span>}
                {primary.row.qs > 0 && <span className="rounded-full bg-[var(--surface)] px-3 py-1 font-bold text-[var(--text-primary)]"><span className="font-num">{primary.row.qs}</span> past questions</span>}
                <span className="rounded-full bg-[var(--surface)] px-3 py-1 font-bold text-[var(--text-primary)]"><span className="font-num">{primary.row.read}/{primary.row.topics}</span> topics read</span>
              </p>
              <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">{WHY[primary.row.b.id] ?? "Part of the core syllabus."}</p>
              <div className="mt-3 h-1.5 max-w-md overflow-hidden rounded-full bg-[var(--surface)]"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--tint-ink)" }} /></div>
            </>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link href={primary.href} className="pill-ink inline-flex h-12 items-center justify-center gap-2 px-6 text-base transition-transform active:scale-[0.97]" style={{ ["--btn" as string]: "var(--tint-ink)" }}>{primary.cta} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            <a href="#path" className="text-sm font-bold text-[var(--tint-ink)] underline underline-offset-4">See the whole path</a>
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[.14em] text-[var(--text-secondary)]">Up next on your roadmap</p>
          <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {upcoming.map((r, i) => (
              <li key={r.key}>
                <Link href={r.href} className="flex h-full items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 transition-transform hover:-translate-y-0.5 active:scale-[0.99]">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--surface-secondary)] font-num text-sm font-extrabold text-[var(--tint-ink)]">{i + 1}</span>
                  <span className="min-w-0"><span className="block truncate text-[11px] font-bold uppercase tracking-[.1em] text-[var(--text-secondary)]">{r.b.title}</span><span className="block text-sm font-extrabold leading-snug text-[var(--text-primary)]">{r.c.title}</span></span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
      <p className="text-xs text-[var(--text-secondary)]"><b className="font-num text-[var(--text-primary)]">{ordered.length}</b> chapters ready · <b className="font-num text-[var(--text-primary)]">{readTotal}</b> of {topicTotal} topics read</p>
    </div>
  );
}

/** The chapter-by-chapter path in the chosen order, in three stages. */
export function RoadmapPath() {
  const { staged, openOf, done, ready } = useRoadmap();
  const [all, setAll] = useState(false);
  const shown = all ? staged : staged.slice(0, 7);
  if (!ready || !staged.length) return null;
  return (
    <details id="path" className="group card-pastel scroll-mt-24 p-4 sm:p-5" data-tint="peri">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span className="font-display text-lg font-extrabold text-[var(--text-primary)]">Your path, chapter by chapter <span className="text-sm font-semibold text-[var(--text-secondary)]">· {staged.length} chapters</span></span>
        <span className="text-sm font-bold text-[var(--tint-ink)] group-open:hidden">Show</span><span className="hidden text-sm font-bold text-[var(--tint-ink)] group-open:inline">Hide</span>
      </summary>
      <ol className="mt-3 grid gap-2">
        {shown.map(({ r, stage }, i) => {
          const prevStage = i > 0 ? shown[i - 1].stage : -1; const st = openOf(r); const pct = Math.round((r.read / Math.max(1, r.topics)) * 100);
          return (
            <li key={r.key}>
              {stage !== prevStage && <p className="mb-1.5 mt-3 px-1 text-xs font-extrabold uppercase tracking-[.14em] text-[var(--text-secondary)]">{STAGES[stage].t} <span className="font-semibold normal-case tracking-normal">· {STAGES[stage].s}</span></p>}
              <Link href={r.href} data-tint={r.b.tint ?? "peri"} className="card-pastel group flex items-center gap-3 p-3 [&::after]:hidden transition-transform hover:-translate-y-0.5 sm:gap-4 sm:p-4">
                <span className="grid h-9 w-9 shrink-0 select-none place-items-center rounded-full font-num text-sm font-extrabold" style={{ background: done(r) ? "var(--tint-ink)" : "var(--surface)", color: done(r) ? "var(--surface)" : "var(--tint-ink)" }}>{done(r) ? "✓" : i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold uppercase tracking-[.1em] text-[var(--text-secondary)]">{r.b.title}</span>
                  <span className="block font-display text-base font-extrabold leading-snug text-[var(--text-primary)]">{r.c.title}</span>
                  <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[var(--text-secondary)]">
                    {r.share > 0 ? <span><b className="font-num text-[var(--text-primary)]">{r.share.toFixed(1)}%</b> of marks · {r.qs} PYQs</span> : <span>{r.first ? "Foundation" : "No past question of its own"}</span>}
                    <span>{r.read}/{r.topics} read</span>
                  </span>
                  <span className="mt-1.5 block h-1.5 overflow-hidden rounded-full bg-[var(--surface)]"><span className="block h-full rounded-full" style={{ width: `${pct}%`, background: "var(--tint-ink)" }} /></span>
                </span>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${st === "open" ? "bg-emerald-600/12 text-emerald-800 dark:text-emerald-300" : "border border-[var(--border)] text-[var(--text-secondary)]"}`}>{st === "open" ? (done(r) ? "Done" : "Open") : st === "sample" ? "Sample" : "Pack"}</span>
              </Link>
            </li>
          );
        })}
      </ol>
      {staged.length > 7 && <button type="button" onClick={() => setAll((v) => !v)} className="mx-auto mt-3 flex h-10 cursor-pointer items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">{all ? "Show the first 7 only" : `Show the whole path (${staged.length} chapters)`}</button>}
    </details>
  );
}
