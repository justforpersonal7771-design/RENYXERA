"use client";

/**
 * Study roadmap (owner request, 29 Nov 2026): a guide to where to start and what to read next.
 * Three ways to order the same chapters: highest marks first, logical order (what builds on what), or balanced (the recommended mix).
 * Every number comes from the real question bank (the tagged past questions of each chapter) and from this device's reading progress.
 * Nothing is locked: a chapter whose pack is not owned shows as "Sample" or "Pack" and still opens.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { ArrowRight, BookOpen, X, Compass, FileQuestion, Layers, LibraryBig, ListOrdered, Scale, Sparkles, Target } from "lucide-react";
import { CS_SHELF, type ShelfBook, type ShelfChapter } from "@/lib/study/catalog";
import { useLibraryFocus } from "@/lib/study/use-focus";
import { useStudyAccess } from "@/lib/study/use-study-access";
import { readSeen } from "@/lib/study/progress";

type Mode = "balanced" | "marks" | "logical" | "pyqs" | "continue" | "shelf";
const MODE_IDS: Mode[] = ["balanced", "marks", "logical", "pyqs", "continue", "shelf"];
const MODES: { id: Mode; label: string; icon: typeof Scale; blurb: string }[] = [
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

export function StudyRoadmap() {
  const focus = useLibraryFocus();
  const access = useStudyAccess();
  const [mode, setMode] = useState<Mode>("balanced");
  const [all, setAll] = useState(false);
  const [off, setOff] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open]);
  const [seen, setSeen] = useState<Record<string, { ch: string }>>({});
  // eslint-disable-next-line react-hooks/set-state-in-effect -- device-only choices, read once after mount
  useEffect(() => { setSeen(readSeen()); try { const m = localStorage.getItem("renyxera.study.roadmap.mode"); if (MODE_IDS.includes(m as Mode)) setMode(m as Mode); const o = JSON.parse(localStorage.getItem("renyxera.study.roadmap.off") ?? "[]"); if (Array.isArray(o)) setOff(o.filter((x) => typeof x === "string")); } catch { /* storage off */ } }, []);
  const pick = (m: Mode) => { setMode(m); try { localStorage.setItem("renyxera.study.roadmap.mode", m); } catch { /* storage off */ } };

  const toggle = (id: string) => setOff((cur) => { const n = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]; try { localStorage.setItem("renyxera.study.roadmap.off", JSON.stringify(n)); } catch { /* storage off */ } return n; });

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
  const STAGES = [{ t: "Stage 1 · Score the first half", s: "the chapters that carry the first 50% of the marks on your list" }, { t: "Stage 2 · Build depth", s: "the next 30%" }, { t: "Stage 3 · Finish and revise", s: "the last 20%, then mixed practice" }];
  const readTotal = ordered.reduce((s, r) => s + r.read, 0), topicTotal = ordered.reduce((s, r) => s + r.topics, 0);
  const shown = all ? staged : staged.slice(0, 7);
  if (!rows.length) return null;
  const m = MODES.find((x) => x.id === mode)!;

  const body = (
    <section aria-label="Study roadmap" className="space-y-4">
      <div className="card-pastel p-4 sm:p-6" data-tint="peri">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[.14em] text-[var(--tint-ink)]"><Compass className="h-4 w-4" aria-hidden /> Your study roadmap</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl">Where to start, and what next</h2>
            <p className="mt-1 max-w-3xl text-sm text-[var(--text-secondary)]">{m.blurb} Chapters are ordered from the real question bank and your reading on this device.</p>
          </div>
          <div role="radiogroup" aria-label="Roadmap order" className="flex flex-wrap gap-1.5 rounded-2xl bg-[var(--surface)] p-1">
            {MODES.map((x) => (
              <button key={x.id} type="button" role="radio" aria-checked={mode === x.id} onClick={() => pick(x.id)} className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-xl px-3 text-sm font-bold transition-colors ${mode === x.id ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]"}`}><x.icon className="h-4 w-4" aria-hidden /> {x.label}</button>
            ))}
          </div>
        </div>

        <details className="group mt-3">
          <summary className="inline-flex h-9 cursor-pointer list-none items-center gap-2 rounded-full bg-[var(--surface)] px-3 text-sm font-bold text-[var(--text-primary)] [&::-webkit-details-marker]:hidden">
            <Layers className="h-4 w-4" aria-hidden /> Subjects included: {CS_SHELF.length - off.filter((id) => CS_SHELF.some((b) => b.id === id)).length} of {CS_SHELF.length}
            <span className="text-xs font-semibold text-[var(--text-secondary)] group-open:hidden">Change</span><span className="hidden text-xs font-semibold text-[var(--text-secondary)] group-open:inline">Hide</span>
          </summary>
          <div className="mt-2 flex flex-wrap items-center gap-1.5" role="group" aria-label="Subjects to include">
            {CS_SHELF.map((b) => { const on = !off.includes(b.id); return <button key={b.id} type="button" aria-pressed={on} onClick={() => toggle(b.id)} className={`inline-flex h-8 cursor-pointer items-center rounded-full px-3 text-xs font-bold transition-colors ${on ? "bg-[var(--tint-ink)] text-[var(--surface)]" : "bg-[var(--surface)] text-[var(--text-secondary)] line-through hover:bg-[var(--surface-secondary)]"}`}>{b.title}</button>; })}
          </div>
        </details>

        {next && (
          <div className="mt-4 grid gap-3 rounded-2xl bg-[var(--surface)] p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[.14em] text-[var(--text-secondary)]"><Sparkles className="h-3.5 w-3.5" aria-hidden /> Next up</p>
              <p className="mt-0.5 font-display text-xl font-extrabold text-[var(--text-primary)]">{next.b.title}: {next.c.title}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {next.share > 0 ? <><b className="font-num text-[var(--text-primary)]">{next.share.toFixed(1)}%</b> of the paper · <b className="font-num text-[var(--text-primary)]">{next.qs}</b> past questions · </> : "Foundation chapter, no question of its own, but the rest rests on it · "}
                {WHY[next.b.id] ?? "Part of the core syllabus."}
                {next.read > 0 && <> You have read {next.read} of {next.topics}.</>}
              </p>
            </div>
            <Link href={next.href} className="pill-ink inline-flex items-center justify-center gap-2" style={{ ["--btn" as string]: "var(--tint-ink)" }}>{next.read > 0 ? "Continue" : "Start"} <ArrowRight className="h-4 w-4" aria-hidden /></Link>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-[var(--text-secondary)]">
          <span className="flex items-center gap-1.5"><Layers className="h-4 w-4" aria-hidden /> {ordered.length} chapters ready · <b className="font-num text-[var(--text-primary)]">{readTotal}</b> of {topicTotal} topics read</span>
          <span>First 5 chapters cover <b className="font-num text-[var(--text-primary)]">{Math.round((ordered.slice(0, 5).reduce((s, r) => s + r.share, 0) / total) * 100)}%</b> of the marks on this list</span>
        </div>
      </div>

      <ol className="grid gap-2">
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
      {staged.length > 7 && <button type="button" onClick={() => setAll((v) => !v)} className="mx-auto flex h-10 cursor-pointer items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">{all ? "Show the first 7 only" : `Show the whole roadmap (${staged.length} chapters)`}</button>}
    </section>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" className="card-pastel flex w-full cursor-pointer items-center gap-3 p-3 text-left sm:gap-4 sm:p-4" data-tint="peri">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--surface)] text-[var(--tint-ink)]"><Compass className="h-5 w-5" aria-hidden /></span>
        <span className="min-w-0 flex-1">
          <span className="block text-xs font-extrabold uppercase tracking-[.14em] text-[var(--tint-ink)]">Your study roadmap</span>
          <span className="block truncate font-display text-base font-extrabold text-[var(--text-primary)] sm:text-lg">{next ? `Next up: ${next.b.title}, ${next.c.title}` : "Where to start, and what next"}</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[var(--tint-ink)]">Open <ArrowRight className="h-4 w-4" aria-hidden /></span>
      </button>
      {open && createPortal(
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Study roadmap">
          <button type="button" aria-label="Close roadmap" onClick={() => setOpen(false)} className="absolute inset-0 cursor-default bg-black/55" />
          <div className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-[var(--background)] shadow-2xl sm:max-w-5xl sm:rounded-3xl">
            <div className="flex shrink-0 justify-end px-3 pt-3"><button type="button" onClick={() => setOpen(false)} aria-label="Close" className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-[var(--surface)] text-[var(--text-primary)]"><X className="h-5 w-5" aria-hidden /></button></div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-6 sm:px-6">{body}</div>
          </div>
        </div>, document.body)}
    </>
  );
}