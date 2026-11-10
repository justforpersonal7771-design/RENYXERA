"use client";

/** Learn: the two ways to study. Books (every chapter, in tracks) and Last moments (the night-before pack). Says plainly what is where. */
import Link from "next/link";
import { ArrowRight, BookOpenText, Timer } from "lucide-react";
import { useIvLibrary } from "@/components/interview/use-iv-library";
import { TRACKS } from "@/lib/interview/tracks";

export default function LearnPage() {
  const { ready, docs, done, progress } = useIvLibrary();
  const chapters = docs.filter((d) => d.kind === "chapter"), read = chapters.filter((d) => done.has(d.id)).length;
  const books = new Set(docs.map((d) => d.book)).size;
  const last = [...progress].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0];
  const lastDoc = docs.find((d) => d.id === last?.doc_id);
  return (
    <div className="space-y-6">
      <section className="card-pastel p-6 sm:p-8" data-tint="butter" aria-label="Learn">
        <span className="section-label"><BookOpenText className="h-3.5 w-3.5" /> Learn</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] text-[var(--text-primary)] sm:text-5xl">Two ways to study.</h1>
        <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">Read a whole book at your own pace, or go straight to the pack you revise the night before.</p>
        {lastDoc && <Link href={`/interview/read?doc=${encodeURIComponent(lastDoc.id)}`} className="btn-main mt-4 inline-flex">Continue: {lastDoc.title.slice(0, 34)}{lastDoc.title.length > 34 ? "…" : ""}<ArrowRight className="h-4 w-4" /></Link>}
      </section>
      <ul className="grid gap-4 md:grid-cols-2">
        <li>
          <Link href="/interview/read" className="card-pastel flex h-full flex-col gap-3 p-6" data-tint="sky">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface)]"><BookOpenText className="h-6 w-6" aria-hidden /></span>
            <span className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Books</span>
            <span className="text-[var(--text-secondary)]">{ready ? `${books} books and ${chapters.length} chapters` : "27 books"} in {TRACKS.length} tracks: backend and cloud, frontend, algorithms, system design, AI, and English and interviews. Highlight, take notes, ask the tutor.</span>
            <span className="text-sm font-bold text-[var(--text-secondary)]">{read} of {chapters.length || "…"} chapters read</span>
            <span className="mt-auto inline-flex items-center gap-1 font-bold text-[var(--text-primary)]">Open the books <ArrowRight className="h-4 w-4" /></span>
          </Link>
        </li>
        <li>
          <Link href="/interview/last-moments" className="card-pastel flex h-full flex-col gap-3 p-6" data-tint="peach">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface)]"><Timer className="h-6 w-6" aria-hidden /></span>
            <span className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Last moments</span>
            <span className="text-[var(--text-secondary)]">The night-before pack: every book&apos;s final revision sheet, trap list, key code snippets and glossary, on one page. Printable, with PDF downloads.</span>
            <span className="mt-auto inline-flex items-center gap-1 font-bold text-[var(--text-primary)]">Open the pack <ArrowRight className="h-4 w-4" /></span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
