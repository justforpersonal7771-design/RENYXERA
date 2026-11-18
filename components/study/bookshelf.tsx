"use client";

/**
 * Study library as a bookshelf (owner, 18 Nov). Wooden shelves by band (core CS, maths, aptitude); each subject is a
 * cloth-bound book whose thickness follows its chapter count. Tapping a book pulls it out and opens it as a two-page
 * spread: the left page introduces the subject, the right page lists chapters with an honest status (ready / being
 * written). Edge cases: other branches see the CS shelf with a note; books with nothing written yet still open (no dead
 * clicks); keyboard and screen readers get real buttons and a dialog; phones scroll each shelf sideways.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { BookOpen, Feather, X } from "lucide-react";
import { CS_SHELF, type ShelfBook } from "@/lib/study/catalog";
import { getCurrentBranch } from "@/lib/branch/current";
import { branchByCode } from "@/lib/branches";

const BANDS: { id: ShelfBook["band"]; title: string }[] = [
  { id: "core", title: "Core computer science" },
  { id: "maths", title: "Engineering mathematics" },
  { id: "aptitude", title: "General aptitude" },
];

function Spine({ b, onOpen, i }: { b: ShelfBook; onOpen: () => void; i: number }) {
  const ready = b.chapters.some((c) => c.ready);
  const w = 46 + b.chapters.length * 7, h = 172 + ((i * 37) % 4) * 10;
  return (
    <button type="button" onClick={onOpen} aria-label={`${b.title}, ${b.chapters.length} chapters${ready ? ", has a free chapter" : ", being written"}`}
      className="sp-book group relative shrink-0 cursor-pointer rounded-t-[4px] text-left outline-none"
      style={{ width: w, height: h, background: `linear-gradient(90deg, rgba(0,0,0,.28), rgba(255,255,255,.08) 18%, rgba(0,0,0,0) 40%, rgba(0,0,0,.18) 92%), ${b.cloth}`, color: b.ink }}>
      <span aria-hidden className="absolute inset-x-0 top-3 h-[3px] opacity-60" style={{ background: b.ink }} />
      <span aria-hidden className="absolute inset-x-0 bottom-5 h-[3px] opacity-60" style={{ background: b.ink }} />
      <span className="absolute inset-x-0 top-6 bottom-8 flex items-center justify-center [writing-mode:vertical-rl] rotate-180">
        <span className="font-display text-[15px] font-extrabold tracking-wide">{b.short}</span>
      </span>
      {ready && <span aria-hidden className="absolute -top-2 right-2 h-9 w-3 bg-[#d8a548] [clip-path:polygon(0_0,100%_0,100%_100%,50%_80%,0_100%)]" />}
    </button>
  );
}

function OpenBook({ b, onClose }: { b: ShelfBook | null; onClose: () => void }) {
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
        <motion.div className="fixed inset-0 z-[120] grid place-items-center bg-black/45 p-3 sm:p-6" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div role="dialog" aria-modal="true" aria-label={b.title} onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, rotateY: -14 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }} style={{ transformPerspective: 1400 }}
            className="relative grid max-h-[88dvh] w-full max-w-4xl overflow-hidden rounded-[18px] shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] md:grid-cols-2"
          >
            <div className="relative p-6 sm:p-8" style={{ background: b.cloth, color: b.ink }}>
              <BookOpen className="h-7 w-7 opacity-80" aria-hidden />
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">{b.title}</h2>
              <p className="mt-3 max-w-sm text-[15px] leading-relaxed opacity-90">{b.chapters.length} chapters in teaching order. Every lesson: the idea, real figures, worked examples, traps, a lab to try it yourself, and the real GATE questions to finish.</p>
              <Link href="/gate-cs-syllabus" className="mt-6 inline-block text-sm font-bold underline underline-offset-4">See how many marks this subject carries</Link>
              <button type="button" onClick={onClose} aria-label="Close the book" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-black/20 md:hidden"><X className="h-5 w-5" /></button>
            </div>
            <div className="no-scrollbar relative overflow-y-auto bg-[#f7f0e1] p-6 text-[#2a1f14] sm:p-8 dark:bg-[#211b14] dark:text-[#efe5d2]">
              <button type="button" onClick={onClose} aria-label="Close the book" className="absolute right-4 top-4 hidden h-10 w-10 place-items-center rounded-full border border-current/20 md:grid"><X className="h-5 w-5" /></button>
              <p className="text-sm font-bold opacity-70">Contents</p>
              <ol className="mt-3 space-y-1">
                {b.chapters.map((c, i) => (
                  <li key={c.id}>
                    {c.href ? (
                      <Link href={c.href} className="flex items-baseline gap-3 rounded-lg px-2 py-2.5 hover:bg-black/5 dark:hover:bg-white/5">
                        <span className="font-num text-sm opacity-60">{i + 1}</span>
                        <span className="min-w-0 flex-1"><span className="block font-bold">{c.title}</span><span className="block text-sm text-emerald-800 dark:text-emerald-300">{c.ready}</span></span>
                        <span className="text-sm font-bold underline underline-offset-4">Read</span>
                      </Link>
                    ) : (
                      <div className="flex items-baseline gap-3 px-2 py-2.5 opacity-70">
                        <span className="font-num text-sm opacity-60">{i + 1}</span>
                        <span className="min-w-0 flex-1"><span className="block font-semibold">{c.title}</span><span className="flex items-center gap-1 text-sm"><Feather className="h-3.5 w-3.5" aria-hidden /> Being written</span></span>
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Bookshelf() {
  const [open, setOpen] = useState<ShelfBook | null>(null);
  const [paper, setPaper] = useState<string | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- the branch lives on the device; read after mount
  useEffect(() => { setPaper(branchByCode(getCurrentBranch())?.paper ?? null); }, []);
  return (
    <section aria-label="Study shelf" className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-5xl">The GATE CS shelf</h1>
          <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">Pull out a book to open it. Books with a gold ribbon have a chapter you can read now; the rest are being written in teaching order.</p>
        </div>
        {paper && paper !== "CS" && <p className="rounded-xl bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-secondary)]">Your branch is GATE {paper}. Its shelf comes after CS; you can read the CS books meanwhile.</p>}
      </header>
      <div className="sp-case rounded-[22px] p-3 sm:p-5">
        {BANDS.map((band) => (
          <div key={band.id} className="sp-shelf">
            <p className="px-2 pb-2 text-xs font-bold text-[#f3e3c3]/80">{band.title}</p>
            <div className="no-scrollbar flex items-end gap-1.5 overflow-x-auto px-2 pt-3">
              {CS_SHELF.filter((b) => b.band === band.id).map((b, i) => <Spine key={b.id} b={b} i={i} onOpen={() => setOpen(b)} />)}
              <span aria-hidden className="ml-2 h-24 w-8 shrink-0 self-end rounded-sm bg-[#3a2416] opacity-60 [transform:skewX(-8deg)]" />
            </div>
            <div aria-hidden className="sp-plank" />
          </div>
        ))}
      </div>
      <OpenBook b={open} onClose={() => setOpen(null)} />
    </section>
  );
}
