"use client";

/**
 * Study Library hub (v2, from the four design reports: Gemini x2, ChatGPT x2). "Warm Paper Press": paper canvas, matte
 * buckram cloth books with dark ink, a flat shelf lip (no wood photos). No skinny vertical slivers: wide spines carry the
 * full subject name horizontally in heavy Sora; the book with a ready chapter faces out; a shelf-end plaque fills any
 * remaining width so a shelf never shows empty space. Desktop hover lifts the book and shows a popover with honest
 * chapter status; phones open an inline drawer under the shelf row. A reading desk on top: continue or start here,
 * search across subjects and chapters, and an availability filter.
 */
import { BANK_SUBJECTS, BUNDLES, packOfBook, rupees } from "@/lib/study/packs";
import { PremiumCard } from "@/components/ui/premium-card";
import { openStudyShop } from "@/store/use-study-shop-store";
import { useStudyAccess } from "@/lib/study/use-study-access";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpen, Feather, Plus, Search, X } from "lucide-react";
import { loadBank } from "@/lib/study/bank";
import { CS_SHELF, type ShelfBook } from "@/lib/study/catalog";
import { getCurrentBranch } from "@/lib/branch/current";
import { useLibraryFocus, type Focus } from "@/lib/study/use-focus";
import { branchByCode } from "@/lib/branches";

const SHELVES: { id: string; title: string; note: string; tint: string; stacks: string[][] }[] = [
  { id: "core", title: "Core Computer Science", note: "Nine subjects in teaching order", tint: "rose", stacks: [["os", "dbms", "cn"], ["algo", "pds", "toc"], ["cd", "coa", "dl"]] },
  { id: "maths", title: "Engineering Mathematics", note: "Discrete maths, linear algebra, probability and calculus", tint: "sky", stacks: [["dm", "la"], ["prob", "calc"]] },
  { id: "apt", title: "General Aptitude", note: "15 marks, the same section in every GATE paper", tint: "peri", stacks: [["verbal", "quant"], ["analytical", "spatial"]] },
];
/** Bank subject names per book, for the marks preview. */
const BANK = BANK_SUBJECTS;
const slug = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
type Peek = { papers: number; perPaper: number; qs: number; two: number; top: [string, number][] };

/** Brief marks info for one book from the official CS bank; "See the full breakdown" opens the subject page. */
function MarksPeek({ b }: { b: ShelfBook }) {
  const [open, setOpen] = useState(false);
  const [d, setD] = useState<Peek | null>(null);
  useEffect(() => {
    if (!open || d) return;
    void loadBank().then((papers) => {
      const subs = BANK[b.id] ?? [];
      let marks = 0, qs = 0, two = 0; const top = new Map<string, number>();
      for (const p of papers) for (const q of p.questions) if (subs.includes(q.subject)) { marks += q.marks; qs++; if (q.marks === 2) two++; if (q.topic) top.set(q.topic, (top.get(q.topic) ?? 0) + 1); }
      setD({ papers: papers.length, perPaper: papers.length ? marks / papers.length : 0, qs, two, top: [...top.entries()].sort((x, y) => y[1] - x[1]).slice(0, 3) });
    }).catch(() => setD({ papers: 0, perPaper: 0, qs: 0, two: 0, top: [] }));
  }, [open, d, b.id]);
  return (
    <div className="mt-4">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="text-sm font-bold underline underline-offset-4">How many marks this subject carries</button>
      {open && (
        <div className="mt-2 rounded-2xl bg-[var(--surface)] p-4 text-[var(--text-primary)] shadow-[0_8px_24px_-14px_rgba(0,0,0,.4)]">
          {!d ? <p className="text-sm text-[var(--text-secondary)]">Counting…</p> : d.qs === 0 ? <p className="text-sm text-[var(--text-secondary)]">No questions found in the bank for this subject yet.</p> : (
            <>
              <p className="font-display text-3xl font-extrabold">{d.perPaper.toFixed(1)} <span className="text-base font-bold text-[var(--text-secondary)]">marks per paper, on average</span></p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{d.qs} questions across {d.papers} official GATE CS papers, {d.two} of them 2-mark.</p>
              {d.top.length > 0 && <p className="mt-2 text-sm"><b>Asked most: </b>{d.top.map(([t]) => t).join(", ")}</p>}
              <Link href={`/topics/${slug((BANK[b.id] ?? [b.title])[0])}`} className="mt-3 inline-flex text-sm font-bold underline underline-offset-4">See the full breakdown</Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
const ready = (b: ShelfBook) => b.chapters.filter((c) => c.ready).length;

/** A book lying flat: app pastel cloth with a deep spine edge, the full name horizontal in big heavy capitals.
 *  The featured book (has a ready chapter) is thicker, names its free chapter. Hover slides it out. */
function Slab({ b, i, dim, onOpen, weight = 0, flat = false }: { b: ShelfBook; i: number; dim: boolean; onOpen: () => void; weight?: number; flat?: boolean }) {
  const r = ready(b);
  const free = b.chapters.find((c) => c.ready);
  return (
    <button type="button" onClick={onOpen} data-tint={b.tint ?? "peri"} style={{ ["--d" as string]: `${i * 50}ms`, ["--x" as string]: flat ? "0px" : `${(i % 3) * 8}px`, ["--h" as string]: flat ? "76px" : `${56 + Math.min(b.chapters.length, 6) * 5}px` /* capped: books stay varied without 17-chapter books towering (owner, 19 Nov) */ }}
      aria-label={`${b.title}. ${b.chapters.length} chapters.`}
      className={`sp3-slab ${free ? "is-feature" : ""} ${dim ? "opacity-35" : ""}`}>
      <span className="min-w-0 flex-1">
        <span className={`sp3-title ${b.title.length > 20 ? "is-long" : ""}`}>{b.title}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">{r === 0 && <span className="sp3-stamp !border-transparent !bg-[var(--tint-ink)] !text-[var(--tint)]">Being written</span>}{weight > 0 && <span className="sp3-stamp !bg-[var(--tint-ink)] !text-[var(--tint)]">{weight.toFixed(1)}% of marks</span>}<span className="sp3-stamp">{`${b.chapters.length} chapters`}</span></span>
    </button>
  );
}

type Weight = { share: number; qs: number; inTarget: boolean; foundation?: boolean; tier: "high" | "mid" | "low" | "none" };

/** Chapters in syllabus (teaching) order, each marked by how much GATE weight it carries; hover for the numbers. */
function Contents({ b, focus }: { b: ShelfBook; focus?: Focus }) {
  const weights: Weight[] = useMemo(() => b.chapters.map((c) => { const f = focus?.chapter(b, c); return { share: f?.share ?? 0, qs: f?.qs ?? 0, inTarget: f?.inTarget ?? true, tier: "none" as Weight["tier"], foundation: f?.foundation ?? false }; }), [b, focus]);
  const topics = focus?.topicsOf(b) ?? [];
  const sorted = weights.map((w) => w.share).filter((x) => x > 0).sort((x, y) => y - x);
  const hiCut = sorted[Math.max(0, Math.ceil(sorted.length / 3) - 1)] ?? Infinity, midCut = sorted[Math.max(0, Math.ceil((sorted.length * 2) / 3) - 1)] ?? Infinity;
  weights.forEach((w) => { w.tier = w.share <= 0 ? "none" : w.share >= hiCut ? "high" : w.share >= midCut ? "mid" : "low"; });
  const ink = `var(--tint-${b.tint ?? "peri"}-ink)`;
  return (
    <ol className="space-y-1">
      {b.chapters.map((c, i) => {
        const w = weights[i];
        const mark = w.tier === "high" ? <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold" style={{ background: ink, color: "var(--surface)" }}>High weight</span>
          : w.tier === "mid" ? <span className="rounded-full border px-2 py-0.5 text-[11px] font-bold" style={{ borderColor: ink, color: ink }}>Medium</span> : null;
        const row = (
          <>
            <span className="font-num text-sm text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1">
              <span className={`block ${c.href ? "font-bold text-[var(--text-primary)]" : w.tier === "high" ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>{c.title}</span>
              {w.qs === 0 && topics.length > 0 && <span className="mt-1 block text-[11px] font-semibold text-[var(--text-secondary)]">Foundation: no past-paper question is tagged here</span>}
              {w.qs > 0 && <span className="mt-1 flex flex-wrap items-center gap-2">{mark}<span className="h-1.5 w-20 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"><span className="block h-full rounded-full" style={{ width: `${Math.min(100, w.share * 12)}%`, background: ink }} /></span><span className="text-[11px] font-semibold text-[var(--text-secondary)]">{w.share.toFixed(1)}% of marks · {w.qs} PYQs{focus?.active && !w.inTarget ? " · outside your target" : ""}</span></span>}
            </span>
            <span className="flex shrink-0 flex-col items-end gap-1">
            {c.href ? <span className="flex items-center gap-1.5"><span className="rounded-full bg-emerald-600/12 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">{c.ready}</span></span>
              : <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-muted)]"><Feather className="h-3 w-3" aria-hidden /> Being written</span>}</span>
          </>
        );
        const cls = `group relative flex items-center gap-x-3 rounded-xl px-3 py-2.5 ${w.tier === "high" ? "border-l-4" : "border-l-4 border-transparent"} ${focus?.active && !w.inTarget ? "opacity-45" : ""}`;
        const style = w.tier === "high" ? { borderLeftColor: ink } : undefined;
        return (
          <li key={c.id}>
            {c.href ? <Link href={c.href} className={`${cls} hover:bg-black/5 dark:hover:bg-white/5`} style={style}>{row}</Link>
              : <div tabIndex={0} className={cls} style={style}>{row}</div>}
          </li>
        );
      })}
    </ol>
  );
}


function OpenBook({ b, onClose, focus }: { b: ShelfBook | null; onClose: () => void; focus: Focus }) {
  const reduce = useReducedMotion();
  const access = useStudyAccess();
  const pack = b ? packOfBook(b.id) : null;
  const owns = (id: string) => access.all || access.packs.includes(id);
  useEffect(() => {
    if (!b) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [b, onClose]);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the document exists only after mount
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {b && (
        <motion.div className="fixed inset-0 z-[400] grid place-items-center bg-[rgba(24,21,18,.42)] p-3 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:p-6" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div role="dialog" aria-modal="true" aria-label={b.title} onClick={(e) => e.stopPropagation()} style={{ transformPerspective: 1400 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotateY: -12 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: reduce ? 0.14 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="grid max-h-[88dvh] w-full max-w-4xl overflow-y-auto overscroll-contain rounded-[16px] md:overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)] md:grid-cols-[0.9fr_1.1fr] md:grid-rows-[minmax(0,1fr)]">
            <div className="relative p-6 sm:p-8" style={{ background: `var(--tint-${b.tint ?? "peri"})`, color: `var(--tint-${b.tint ?? "peri"}-ink)`, borderLeft: `14px solid var(--tint-${b.tint ?? "peri"}-ink)` }}>
              <BookOpen className="hidden h-7 w-7 md:block" aria-hidden />
              <h2 className="mt-0 font-display md:mt-4 text-3xl font-extrabold leading-tight tracking-[-0.02em] sm:text-4xl">{b.title}</h2>
              <p className="mt-1 text-sm font-semibold">RENYXERA GATE CS series<span className="md:hidden"> · {b.chapters.length} chapters</span></p>
              <p className="mt-4 hidden text-[15px] leading-relaxed md:block">{b.chapters.length} chapters in teaching order. Every lesson: the idea, real figures, worked examples, traps, a lab to try it yourself, and the real GATE questions to finish.</p>
              {b.chapters.find((c) => c.href) && <Link href={b.chapters.find((c) => c.href)!.href!} className="pill-ink mt-5 inline-flex" style={{ ["--btn" as string]: `var(--tint-${b.tint ?? "peri"}-ink)` }}>Read: {b.chapters.find((c) => c.href)!.title}</Link>}
              {pack && !owns(pack.id) && <button type="button" onClick={() => { onClose(); openStudyShop(`Unlock ${b.title}`); }} className="pill-soft mt-2 inline-flex">Get this book · {rupees(pack.pricePaise)}</button>}
              <MarksPeek key={b.id} b={b} />
              <button type="button" onClick={onClose} aria-label="Close the book" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/10 md:hidden"><X className="h-5 w-5" /></button>
            </div>
            <div className="custom-scrollbar relative min-h-0 p-5 sm:p-7 md:overflow-y-auto md:overscroll-contain" data-tint={b.tint ?? "peri"} style={{ background: `color-mix(in srgb, var(--tint-${b.tint ?? "peri"}) 35%, var(--surface))` }}>
              <button type="button" onClick={onClose} aria-label="Close the book" className="absolute right-4 top-4 hidden h-10 w-10 place-items-center rounded-full border border-[var(--border)] md:grid"><X className="h-5 w-5" /></button>
              <p className="mb-2 text-sm font-bold text-[var(--text-secondary)]">Contents</p>
              <Contents b={b} focus={focus} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function Bookshelf() {
  const [open, setOpen] = useState<ShelfBook | null>(null);
  const [drawer, setDrawer] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [onlyReady, setOnlyReady] = useState(false);
  const [paper, setPaper] = useState<string | null>(null);
  const [last, setLast] = useState<{ href: string; title: string } | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- device-only values, read once after mount
    setPaper(branchByCode(getCurrentBranch())?.paper ?? null);
    try { const v = localStorage.getItem("renyxera.study.last"); if (v) setLast(JSON.parse(v)); } catch { /* storage off */ }
  }, []);
  const term = q.trim().toLowerCase();
  const match = useMemo(() => (b: ShelfBook) => (!term || b.title.replace(/­/g, "").toLowerCase().includes(term) || b.chapters.some((c) => c.title.toLowerCase().includes(term))) && (!onlyReady || ready(b) > 0), [term, onlyReady]);
  const free = CS_SHELF.find((b) => ready(b) > 0);
  const resume = last ?? (free ? { href: free.chapters.find((c) => c.href)!.href!, title: `${free.title}: ${free.chapters.find((c) => c.href)!.title}` } : null);
  const focus = useLibraryFocus();
  const [showAll, setShowAll] = useState(false);
  const weightOf = (bs: ShelfBook[]) => bs.reduce((t, b) => t + focus.topicsOf(b).reduce((x, tp) => x + tp.marksShare, 0), 0);
  const visible = (b: ShelfBook) => showAll || focus.bookIn(b);
  const hidden = CS_SHELF.filter((b) => !visible(b)).length;
  const hits = CS_SHELF.filter((b) => visible(b) && match(b)).length;
  const isPhone = () => typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches;

  return (
    <section aria-label="Study library" lang="en" className="space-y-5">
      {/* reading desk */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1.1fr)_minmax(0,0.75fr)]">
        <div className="card-pastel flex min-w-0 flex-col justify-between p-5 sm:p-6 lg:h-72" data-tint="butter">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl">The GATE CS library</h1>
            <p className="mt-1 text-balance text-[var(--text-secondary)]">Lessons written for the way GATE asks.<br />Pull a book to see what is inside.</p>
          </div>
          {resume && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface)] p-3">
              <BookOpen className="h-5 w-5 text-[var(--text-primary)]" aria-hidden />
              <span className="min-w-0 flex-1"><span className="block text-xs font-bold text-[var(--text-secondary)]">{last ? "Continue reading" : "Start here: free sample topics"}</span><span className="block truncate font-bold text-[var(--text-primary)]">{resume.title}</span></span>
              <Link href={resume.href} className="pill-ink">{last ? "Resume" : "Read now"}</Link>
            </div>
          )}
        </div>
        <div className="card-pastel flex h-72 min-h-0 min-w-0 flex-col gap-3 p-5 sm:p-6" data-tint="peri">
          <label className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
            <Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search subjects and chapters" aria-label="Search subjects and chapters" className="search-bare h-11 flex-1 bg-transparent text-[var(--text-primary)]" />
            {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="grid h-8 w-8 place-items-center"><X className="h-4 w-4" /></button>}
          </label>
          <div className={`flex flex-wrap items-center gap-2 ${term ? "hidden" : ""}`}>
            <button type="button" aria-pressed={!onlyReady} onClick={() => setOnlyReady(false)} className={!onlyReady ? "pill-ink" : "pill-soft"}>All books</button>
            <button type="button" aria-pressed={onlyReady} onClick={() => setOnlyReady(true)} className={onlyReady ? "pill-ink" : "pill-soft"}>Ready to read</button>
            <span className="text-sm text-[var(--text-secondary)]">{hits} of {CS_SHELF.length} books</span>
          </div>
          {term && (
            <ul aria-label="Matching chapters" className="custom-scrollbar min-h-0 flex-1 space-y-1 overflow-y-auto">
              {CS_SHELF.flatMap((b) => b.chapters.filter((c) => b.title.toLowerCase().includes(term) || c.title.toLowerCase().includes(term)).map((c) => ({ b, c }))).slice(0, 12).map(({ b, c }) => (
                <li key={b.id + c.id}>{c.href
                  ? <Link href={c.href} className="flex items-center justify-between gap-2 rounded-xl bg-[var(--surface)] px-3 py-2 text-sm hover:bg-[var(--surface-secondary)]"><span className="min-w-0 truncate"><b>{c.title}</b> <span className="text-[var(--text-secondary)]">· {b.title}</span></span><span className="shrink-0 font-bold">Open</span></Link>
                  : <span className="flex items-center justify-between gap-2 rounded-xl bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-secondary)]"><span className="min-w-0 truncate"><b className="text-[var(--text-primary)]">{c.title}</b> · {b.title}</span><span className="shrink-0">Being written</span></span>}</li>
              ))}
            </ul>
          )}
          {paper && paper !== "CS" && <p className="text-sm text-[var(--text-secondary)]">You are on GATE {paper}. Its shelf comes after CS; you can browse the CS books meanwhile.</p>}
        </div>
        <PremiumCard skin="peri" eyebrow="Study packs" title="Unlock every chapter" cta="Unlock books" className="min-w-0 lg:h-72" onClick={() => openStudyShop("Study packs and bundles")}
          body={`Core CS from ${rupees(BUNDLES.find((b) => b.id === "core")!.pricePaise)}, or the whole library for ${rupees(BUNDLES.find((b) => b.id === "everything")!.pricePaise)}.`} />
      </div>

      {focus.active && (
        <div className="card-pastel flex flex-wrap items-center gap-3 p-4" data-tint="mint">
          <p className="min-w-0 flex-1 text-sm text-[var(--text-primary)]"><b>Focus target {focus.target}%.</b> {hidden ? `${hidden} subject${hidden === 1 ? " is" : "s are"} outside your target and hidden. ` : "Every subject has topics inside your target. "}Inside each book, the most important topics come first.</p>
          {hidden > 0 && <button type="button" onClick={() => setShowAll((x) => !x)} className="pill-soft">{showAll ? "Hide them again" : "Show all subjects"}</button>}
        </div>
      )}
      {/* the shelves */}
      <div className="sp2-case">
        {(() => { const shelves = SHELVES.map((sh) => {
          const books = CS_SHELF.filter((b) => sh.stacks.flat().includes(b.id) && visible(b) && match(b));
          if (!books.length) return null;
          const stacks0 = sh.stacks.map((st) => st.filter((id) => books.some((b) => b.id === id))).filter((st) => st.length);
          // maths and aptitude: one continuous stack of equal-height books so the two shelves line up
          const stacks = sh.id === "core" ? stacks0 : stacks0.length ? [stacks0.flat()] : [];
          const open1 = books.find((b) => b.id === drawer);
          const openIt = (b: ShelfBook) => setOpen(b);
          const byId = (id: string) => CS_SHELF.find((b) => b.id === id)!;
          return (
            <div key={sh.id} className="sp2-shelf flex flex-col">
              <div className="relative mb-6 flex items-center justify-between gap-4 overflow-hidden rounded-2xl px-5 py-4 text-white sm:px-6" style={{ background: "linear-gradient(120deg, #2a2831 0%, #16151b 100%)", boxShadow: "inset 6px 0 0 #d9a42b, inset 0 1px 0 rgba(255,255,255,.1), 0 18px 30px -20px rgba(0,0,0,.65)" }}>
                <span aria-hidden className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full opacity-25 blur-2xl" style={{ background: "#d9a42b" }} />
                <div className="relative min-w-0">
                  <h2 className="font-extrabold leading-tight tracking-[-0.02em] text-[26px] sm:text-[32px]" style={{ fontFamily: "var(--font-tile), var(--font-display)" }}>{sh.title}</h2>
                  <p className="mt-0.5 text-sm font-semibold text-white/70">{sh.note}</p>
                </div>
                {weightOf(books) > 0 && (
                  <div className="relative shrink-0 text-right" aria-label={`${weightOf(books).toFixed(1)} percent of the GATE paper`}>
                    <b className="block text-[28px] font-extrabold leading-none text-[#f3d27a]" style={{ fontFamily: "var(--font-tile), var(--font-display)" }}>{weightOf(books).toFixed(1)}%</b>
                    <span className="mt-1 block text-xs font-bold text-white/65">of the paper</span>
                  </div>
                )}
              </div>
              <div className={`grid flex-1 items-end gap-4 ${sh.id !== "core" ? "" : stacks.length === 3 ? "lg:grid-cols-3" : stacks.length === 2 ? "lg:grid-cols-2" : ""}`}>
                {stacks.map((st, si) => (
                  <div key={si} className="flex flex-col gap-3">
                    <div className="flex flex-col-reverse gap-[4px]">{st.map((id, k) => <Slab key={id} b={byId(id)} i={si * 3 + k} dim={!match(byId(id))} weight={weightOf([byId(id)])} onOpen={() => openIt(byId(id))} />)}</div>
                  </div>
                ))}
              </div>
              <div aria-hidden className="sp2-lip" />
              <AnimatePresence>
                {open1 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden lg:hidden">
                    <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                      <div className="flex items-start justify-between gap-2"><p className="font-display text-lg font-extrabold text-[var(--text-primary)]">{open1.title}</p><button type="button" onClick={() => setDrawer(null)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)]"><X className="h-4 w-4" /></button></div>
                      <Contents b={open1} focus={focus} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        });
        // core books across the whole width; mathematics and aptitude side by side underneath
        return <>{shelves[0]}<div className="mt-8 grid gap-5 lg:grid-cols-2 [&>.sp2-shelf]:!mt-0">{shelves.slice(1)}</div></>; })()}
        {hits === 0 && <p className="rounded-2xl bg-[var(--surface)] p-4 text-center text-[var(--text-secondary)]">No book matches “{q}”. <button type="button" onClick={() => { setQ(""); setOnlyReady(false); }} className="font-bold underline underline-offset-4">Clear the search</button> or <Link href="/topics/operating-systems-os" className="font-bold underline underline-offset-4">search the past-question bank</Link>.</p>}
      </div>
      <OpenBook b={open} onClose={() => setOpen(null)} focus={focus} />
    </section>
  );
}
