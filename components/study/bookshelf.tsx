"use client";

/**
 * Study Library hub (v2, from the four design reports: Gemini x2, ChatGPT x2). "Warm Paper Press": paper canvas, matte
 * buckram cloth books with dark ink, a flat shelf lip (no wood photos). No skinny vertical slivers: wide spines carry the
 * full subject name horizontally in heavy Sora; the book with a ready chapter faces out; a shelf-end plaque fills any
 * remaining width so a shelf never shows empty space. Desktop hover lifts the book and shows a popover with honest
 * chapter status; phones open an inline drawer under the shelf row. A reading desk on top: continue or start here,
 * search across subjects and chapters, and an availability filter.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpen, Feather, Search, X } from "lucide-react";
import { CS_SHELF, type ShelfBook } from "@/lib/study/catalog";
import { getCurrentBranch } from "@/lib/branch/current";
import { GOAL_SLIDER_DEFAULT_PERCENT, useGoalSliderStore } from "@/store/use-goal-slider-store";
import { computeGoalSliderResult, computeTopicFrequencies, type TopicFrequency } from "@/lib/analytics/goal-slider-engine";
import type { RenderableQuestion } from "@/types/question.types";
import { branchByCode } from "@/lib/branches";

const SHELVES: { id: string; title: string; note: string; tint: string; stacks: string[][] }[] = [
  { id: "core", title: "Core computer science", note: "Nine subjects in teaching order", tint: "rose", stacks: [["os", "dbms", "cn"], ["algo", "pds", "toc"], ["cd", "coa", "dl"]] },
  { id: "maths", title: "Engineering mathematics", note: "Discrete maths, linear algebra, probability and calculus", tint: "sky", stacks: [["dm", "la"], ["prob", "calc"]] },
  { id: "apt", title: "General aptitude", note: "15 marks, the same section in every GATE paper", tint: "peri", stacks: [["verbal", "quant"], ["analytical", "spatial"]] },
];
/** Bank subject names per book, for the marks preview. */
const BANK: Record<string, string[]> = {
  os: ["Operating Systems (OS)"], dbms: ["Database Management Systems (DBMS)"], cn: ["Computer Networks (CN)"], algo: ["Algorithms"],
  pds: ["Programming in C", "Data Structures"], toc: ["Theory of Computation (TOC)"], cd: ["Compiler Design"], coa: ["Computer Organization and Architecture (COA)"],
  dl: ["Digital Logic"], dm: ["Discrete Mathematics"], la: ["Linear Algebra"], prob: ["Probability & Statistics"], calc: ["Calculus"],
  verbal: ["Verbal Aptitude"], quant: ["Quantitative Aptitude"], analytical: ["Analytical Aptitude"], spatial: ["Spatial Aptitude"],
};
const slug = (t: string) => t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
type Peek = { papers: number; perPaper: number; qs: number; two: number; top: [string, number][] };
let bankCache: Promise<{ exam_metadata: { "year-shift": string }; questions: { subject: string; topic?: string; marks: number }[] }[]> | null = null;

/** Brief marks info for one book from the official CS bank; "See the full breakdown" opens the subject page. */
function MarksPeek({ b }: { b: ShelfBook }) {
  const [open, setOpen] = useState(false);
  const [d, setD] = useState<Peek | null>(null);
  useEffect(() => {
    if (!open || d) return;
    bankCache ??= fetch("/data/questions.json").then((r) => r.json());
    void bankCache.then((papers) => {
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
 *  The featured book (has a ready chapter) is thicker, carries the gold ribbon and names its free chapter. Hover slides it out. */
function Slab({ b, i, dim, onOpen }: { b: ShelfBook; i: number; dim: boolean; onOpen: () => void }) {
  const r = ready(b);
  const free = b.chapters.find((c) => c.ready);
  return (
    <button type="button" onClick={onOpen} data-tint={b.tint ?? "peri"} style={{ ["--d" as string]: `${i * 50}ms`, ["--x" as string]: `${(i % 3) * 8}px`, ["--h" as string]: `${44 + b.chapters.length * 8}px` }}
      aria-label={`${b.title}. ${b.chapters.length} chapters, ${r ? `${r} ready to read` : "being written"}.`}
      className={`sp3-slab ${free ? "is-feature" : ""} ${dim ? "opacity-35" : ""}`}>
      {free && <span aria-hidden className="sp2-ribbon !right-24" />}
      <span className="min-w-0 flex-1">
        <span className={`sp3-title ${b.title.length > 20 ? "is-long" : ""}`}>{b.title}</span>
        {free && <span className="mt-0.5 block text-sm font-bold text-[var(--tint-ink)]">Free chapter: {free.title}</span>}
      </span>
      <span className="sp3-stamp">{r ? `${r}/${b.chapters.length} ready` : `${b.chapters.length} chapters`}</span>
    </button>
  );
}

function Contents({ b }: { b: ShelfBook }) {
  return (
    <ol className="space-y-1">
      {b.chapters.map((c, i) => (
        <li key={c.id}>
          {c.href ? (
            <Link href={c.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
              <span className="font-num text-sm text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 font-bold text-[var(--text-primary)]">{c.title}</span>
              <span className="rounded-full bg-emerald-600/12 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">{c.ready}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2.5">
              <span className="font-num text-sm text-[var(--text-muted)]">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 flex-1 text-[var(--text-secondary)]">{c.title}</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-muted)]"><Feather className="h-3 w-3" aria-hidden /> Being written</span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

/**
 * Topic weight from the official CS bank, and the student's Focus Target (the top-bar goal slider). With a target below
 * 100%, only subjects and topics inside it are shown (owner, 18 Nov).
 */
function useLibraryFocus() {
  const target = useGoalSliderStore((x) => x.targetPercent);
  const loadGoal = useGoalSliderStore((x) => x.load);
  const [qs, setQs] = useState<RenderableQuestion[] | null>(null);
  useEffect(() => { void loadGoal(); }, [loadGoal]);
  useEffect(() => {
    bankCache ??= fetch("/data/questions.json").then((r) => r.json());
    void bankCache.then((papers) => setQs(papers.flatMap((p) => p.questions) as unknown as RenderableQuestion[])).catch(() => setQs([]));
  }, []);
  return useMemo(() => {
    const active = target < GOAL_SLIDER_DEFAULT_PERCENT && !!qs?.length;
    const freq: TopicFrequency[] = qs ? computeTopicFrequencies(qs) : [];
    const inTarget = active ? new Set(computeGoalSliderResult(qs!, target).includedTopics.map((t) => `${t.subject}::${t.topic}`)) : null;
    const topicIn = (t: TopicFrequency) => !inTarget || inTarget.has(`${t.subject}::${t.topic}`);
    const bookIn = (b: ShelfBook) => !inTarget || freq.some((t) => (BANK[b.id] ?? []).includes(t.subject) && topicIn(t));
    const topicsOf = (b: ShelfBook) => freq.filter((t) => (BANK[b.id] ?? []).includes(t.subject));
    return { active, target, topicIn, bookIn, topicsOf };
  }, [qs, target]);
}
type Focus = ReturnType<typeof useLibraryFocus>;

/** The subject's topics ranked by marks share; filter to the Focus Target or show all. */
function ImportantTopics({ b, focus }: { b: ShelfBook; focus: Focus }) {
  const [only, setOnly] = useState(focus.active);
  const [all, setAll] = useState(false);
  const list = focus.topicsOf(b).filter((t) => !only || focus.topicIn(t));
  if (!focus.topicsOf(b).length) return null;
  const shown = all ? list : list.slice(0, 6);
  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-bold text-[var(--text-secondary)]">Most important topics</p>
        <span className="flex-1" />
        {focus.active && <>
          <button type="button" aria-pressed={only} onClick={() => setOnly(true)} className={`rounded-full px-2.5 py-1 text-xs font-bold ${only ? "bg-[var(--ink)] text-[var(--background)]" : "text-[var(--text-secondary)]"}`}>In my target</button>
          <button type="button" aria-pressed={!only} onClick={() => setOnly(false)} className={`rounded-full px-2.5 py-1 text-xs font-bold ${!only ? "bg-[var(--ink)] text-[var(--background)]" : "text-[var(--text-secondary)]"}`}>All</button>
        </>}
      </div>
      {list.length === 0 ? <p className="mt-2 text-sm text-[var(--text-secondary)]">None of this subject&apos;s topics are inside your focus target.</p> : (
        <ol className="mt-2 space-y-1.5">
          {shown.map((t, i) => (
            <li key={t.topic} className="flex items-center gap-3 rounded-xl bg-[var(--surface)] px-3 py-2">
              <span className="w-5 text-center font-num text-xs font-bold text-[var(--text-secondary)]">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--text-primary)]">{t.topic}</span>
              <span className="text-xs text-[var(--text-secondary)]">{t.questionCount} Qs</span>
              <span className="h-1.5 w-16 overflow-hidden rounded-full bg-black/10"><span className="block h-full rounded-full" style={{ width: `${Math.min(100, t.marksShare * 25)}%`, background: `var(--tint-${b.tint ?? "peri"}-ink)` }} /></span>
              <span className="w-12 text-right font-num text-xs font-bold text-[var(--text-primary)]">{t.marksShare.toFixed(1)}%</span>
            </li>
          ))}
        </ol>
      )}
      {list.length > 6 && <button type="button" onClick={() => setAll((x) => !x)} className="mt-2 text-sm font-bold underline underline-offset-4">{all ? "Show fewer" : `Show all ${list.length}`}</button>}
      <p className="mt-1 text-xs text-[var(--text-secondary)]">Share of all marks in the official GATE CS papers in our bank.</p>
    </div>
  );
}

function OpenBook({ b, onClose, focus }: { b: ShelfBook | null; onClose: () => void; focus: Focus }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!b) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [b, onClose]);
  return (
    <AnimatePresence>
      {b && (
        <motion.div className="fixed inset-0 z-[120] grid place-items-center bg-[rgba(24,21,18,.42)] p-3 sm:p-6" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div role="dialog" aria-modal="true" aria-label={b.title} onClick={(e) => e.stopPropagation()} style={{ transformPerspective: 1400 }}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotateY: -12 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            transition={{ duration: reduce ? 0.14 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="grid max-h-[88dvh] w-full max-w-4xl overflow-hidden rounded-[16px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)] md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative p-6 sm:p-8" style={{ background: `var(--tint-${b.tint ?? "peri"})`, color: `var(--tint-${b.tint ?? "peri"}-ink)`, borderLeft: `14px solid var(--tint-${b.tint ?? "peri"}-ink)` }}>
              <BookOpen className="h-7 w-7" aria-hidden />
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-[-0.02em] sm:text-4xl">{b.title}</h2>
              <p className="mt-1 text-sm font-semibold">RENYXERA GATE CS series</p>
              <p className="mt-4 text-[15px] leading-relaxed">{b.chapters.length} chapters in teaching order, {ready(b) ? `${ready(b)} ready to read now` : "all being written"}. Every lesson: the idea, real figures, worked examples, traps, a lab to try it yourself, and the real GATE questions to finish.</p>
              {b.chapters.find((c) => c.href) && <Link href={b.chapters.find((c) => c.href)!.href!} className="mt-5 inline-flex rounded-full px-5 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_rgba(0,0,0,.25)] transition-transform hover:-translate-y-0.5" style={{ background: `var(--tint-${b.tint ?? "peri"}-ink)` }}>Read: {b.chapters.find((c) => c.href)!.title}</Link>}
              <MarksPeek key={b.id} b={b} />
              <button type="button" onClick={onClose} aria-label="Close the book" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/10 md:hidden"><X className="h-5 w-5" /></button>
            </div>
            <div className="no-scrollbar relative overflow-y-auto p-5 sm:p-7" style={{ background: `color-mix(in srgb, var(--tint-${b.tint ?? "peri"}) 35%, var(--surface))` }}>
              <button type="button" onClick={onClose} aria-label="Close the book" className="absolute right-4 top-4 hidden h-10 w-10 place-items-center rounded-full border border-[var(--border)] md:grid"><X className="h-5 w-5" /></button>
              <ImportantTopics key={b.id} b={b} focus={focus} />
              <p className="mb-2 text-sm font-bold text-[var(--text-secondary)]">Contents</p>
              <Contents b={b} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const visible = (b: ShelfBook) => showAll || focus.bookIn(b);
  const hidden = CS_SHELF.filter((b) => !visible(b)).length;
  const hits = CS_SHELF.filter((b) => visible(b) && match(b)).length;
  const isPhone = () => typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches;

  return (
    <section aria-label="Study library" lang="en" className="space-y-5">
      {/* reading desk */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="card-pastel flex flex-col justify-between p-5 sm:p-6" data-tint="butter">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-[-0.02em] text-[var(--text-primary)] sm:text-4xl">The GATE CS library</h1>
            <p className="mt-1 text-[var(--text-secondary)]">Lessons written for the way GATE asks. Pull a book to see what is inside.</p>
          </div>
          {resume && (
            <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface)] p-3">
              <BookOpen className="h-5 w-5 text-[var(--text-primary)]" aria-hidden />
              <span className="min-w-0 flex-1"><span className="block text-xs font-bold text-[var(--text-secondary)]">{last ? "Continue reading" : "Start here, free"}</span><span className="block truncate font-bold text-[var(--text-primary)]">{resume.title}</span></span>
              <Link href={resume.href} className="pill-ink">{last ? "Resume" : "Read now"}</Link>
            </div>
          )}
        </div>
        <div className="card-pastel flex flex-col justify-between gap-3 p-5 sm:p-6" data-tint="peri">
          <label className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
            <Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search subjects and chapters" aria-label="Search subjects and chapters" className="search-bare h-11 flex-1 bg-transparent text-[var(--text-primary)]" />
            {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="grid h-8 w-8 place-items-center"><X className="h-4 w-4" /></button>}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" aria-pressed={!onlyReady} onClick={() => setOnlyReady(false)} className={!onlyReady ? "pill-ink" : "pill-soft"}>All books</button>
            <button type="button" aria-pressed={onlyReady} onClick={() => setOnlyReady(true)} className={onlyReady ? "pill-ink" : "pill-soft"}>Ready to read</button>
            <span className="text-sm text-[var(--text-secondary)]">{hits} of {CS_SHELF.length} books</span>
          </div>
          {paper && paper !== "CS" && <p className="text-sm text-[var(--text-secondary)]">You are on GATE {paper}. Its shelf comes after CS; the CS books are open to you meanwhile.</p>}
        </div>
      </div>

      {focus.active && (
        <div className="card-pastel flex flex-wrap items-center gap-3 p-4" data-tint="mint">
          <p className="min-w-0 flex-1 text-sm text-[var(--text-primary)]"><b>Focus target {focus.target}%.</b> {hidden ? `${hidden} subject${hidden === 1 ? " is" : "s are"} outside your target and hidden. ` : "Every subject has topics inside your target. "}Inside each book, the most important topics come first.</p>
          {hidden > 0 && <button type="button" onClick={() => setShowAll((x) => !x)} className="pill-soft">{showAll ? "Hide them again" : "Show all subjects"}</button>}
        </div>
      )}
      {/* the shelves */}
      <div className="sp2-case">
        {SHELVES.map((sh) => {
          const books = CS_SHELF.filter((b) => sh.stacks.flat().includes(b.id) && visible(b));
          if (!books.length) return null;
          const stacks = sh.stacks.map((st) => st.filter((id) => books.some((b) => b.id === id))).filter((st) => st.length);
          const open1 = books.find((b) => b.id === drawer);
          const openIt = (b: ShelfBook) => { if (isPhone()) setDrawer((d) => (d === b.id ? null : b.id)); else setOpen(b); };
          const byId = (id: string) => CS_SHELF.find((b) => b.id === id)!;
          return (
            <div key={sh.id} className="sp2-shelf">
              <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-dashed border-[var(--border)] pb-2">
                <span className="h-3 w-3 self-center rounded-full" style={{ background: `var(--tint-${sh.tint}-ink)` }} aria-hidden />
                <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">{sh.title}</h2>
                <span className="text-sm text-[var(--text-secondary)]">{sh.note} · {books.length} books · {books.reduce((t, b) => t + ready(b), 0)} of {books.reduce((t, b) => t + b.chapters.length, 0)} chapters ready</span>
              </div>
              <div className={`grid items-end gap-4 ${stacks.length === 3 ? "lg:grid-cols-3" : stacks.length === 2 ? "lg:grid-cols-2" : ""}`}>
                {stacks.map((st, si) => (
                  <div key={si} className="flex flex-col gap-3">
                    <div className="flex flex-col-reverse gap-[4px]">{st.map((id, k) => <Slab key={id} b={byId(id)} i={si * 3 + k} dim={!match(byId(id))} onOpen={() => openIt(byId(id))} />)}</div>
                  </div>
                ))}
              </div>
              <div aria-hidden className="sp2-lip" />
              <AnimatePresence>
                {open1 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden lg:hidden">
                    <div className="mt-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                      <div className="flex items-start justify-between gap-2"><p className="font-display text-lg font-extrabold text-[var(--text-primary)]">{open1.title}</p><button type="button" onClick={() => setDrawer(null)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)]"><X className="h-4 w-4" /></button></div>
                      <Contents b={open1} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {hits === 0 && <p className="rounded-2xl bg-[var(--surface)] p-4 text-center text-[var(--text-secondary)]">No book matches “{q}”. <button type="button" onClick={() => { setQ(""); setOnlyReady(false); }} className="font-bold underline underline-offset-4">Clear the search</button> or <Link href="/topics/operating-systems-os" className="font-bold underline underline-offset-4">search the past-question bank</Link>.</p>}
      </div>
      <OpenBook b={open} onClose={() => setOpen(null)} focus={focus} />
    </section>
  );
}
