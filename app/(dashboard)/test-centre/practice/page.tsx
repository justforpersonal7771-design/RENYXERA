"use client";

/** Test Centre / Practice: one clear first move (revise what you got wrong), then the other ways to practise. */
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, ClipboardList, Flag, Layers, Play, RotateCcw, Target } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { CountUp } from "@/components/ui/count-up";

const ink = "text-[var(--text-primary)]";
const Arrow = () => <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />;
const tile = "card-pastel group relative flex min-w-0 flex-col overflow-hidden p-5";

export default function PracticePage() {
  const { mistakes, loadStudyData } = useStudyStore();
  useEffect(() => { void loadStudyData(); }, [loadStudyData]);
  const open = mistakes.filter((m) => !m.mastered).length;
  const mastered = mistakes.length - open;

  return (
    <div className="grid w-full grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-12 md:grid-rows-[auto_minmax(0,1fr)_minmax(0,1fr)] lg:min-h-[calc(100dvh-12rem)]">
      <section className="card-well flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6 md:col-span-12" data-tint="rose" aria-label="Practice">
        <div>
          <h1 className={`font-display text-3xl font-extrabold ${ink}`}>Practice</h1>
          <p className="mt-0.5 text-[var(--text-secondary)]">Short sessions that fix weak spots. Start with the big card.</p>
        </div>
        <p className="text-sm font-bold text-[var(--text-secondary)]"><span className={`font-num text-xl font-extrabold ${ink}`}><CountUp value={mastered} /></span> mastered so far</p>
      </section>

      <Link href="/revision" data-tint="rose" className={`${tile} md:col-span-7 md:row-span-2`}>
        <RotateCcw aria-hidden className="pointer-events-none absolute -bottom-6 -right-4 h-44 w-44 -rotate-12 text-[var(--text-primary)] opacity-[0.07] transition-transform duration-300 group-hover:rotate-0 group-hover:scale-110" />
        <span className={`inline-block self-start rotate-2 rounded-full border-2 border-[var(--text-primary)]/70 bg-[var(--surface)] px-2.5 py-0.5 text-xs font-extrabold ${ink}`}>Best next step</span>
        <h2 className={`mt-3 font-display text-4xl font-extrabold ${ink}`}>Revise mistakes</h2>
        <p className="mt-2 max-w-md text-[var(--text-secondary)]">{open ? "Spaced repetition brings back the questions you are about to forget, easiest first." : "Nothing is waiting right now. Questions you get wrong will show up here."}</p>
        <p className={`mt-4 font-display text-6xl font-extrabold leading-none tabular-nums ${ink}`}><CountUp value={open} /></p>
        <p className="mt-1 text-sm font-bold text-[var(--text-secondary)]">questions waiting</p>
        <span className="flex-1" />
        <span className="btn-main mt-4 self-start"><Play className="h-4 w-4" /> {open ? `Revise ${Math.min(open, 10)} now` : "Open revision"}</span>
      </Link>

      <Link href="/checkpoint" data-tint="peri" className={`${tile} md:col-span-5`}>
        <Flag aria-hidden className="pointer-events-none absolute -bottom-4 -right-3 h-28 w-28 -rotate-12 text-[var(--text-primary)] opacity-[0.07] transition-transform duration-300 group-hover:rotate-0" />
        <h2 className={`font-display text-2xl font-extrabold ${ink}`}>Checkpoint</h2>
        <p className="mt-1 flex-1 text-sm text-[var(--text-secondary)]">Ten mixed questions from your recent tests and mistakes. Shows what has stuck.</p>
        <span className={`mt-3 inline-flex items-center gap-1 text-sm font-bold ${ink}`}>Start <Arrow /></span>
      </Link>

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-3 md:col-span-5 md:grid-cols-1 lg:grid-cols-3">
        {[
          { href: "/test-centre/build?view=flashcards", tint: "butter", icon: Layers, title: "Flashcards", body: "Recall cards, due first." },
          { href: "/mistakes", tint: "lilac", icon: ClipboardList, title: "Your mistakes", body: "Browse by subject." },
          { href: "/test-centre/build", tint: "mint", icon: Target, title: "Topic drill", body: "Build a short test on one topic." },
        ].map((i) => (
          <Link key={i.title} href={i.href} data-tint={i.tint} className={tile}>
            <i.icon className={`h-5 w-5 ${ink}`} aria-hidden />
            <h2 className={`mt-2 font-display text-lg font-extrabold ${ink}`}>{i.title}</h2>
            <p className="mt-0.5 flex-1 text-sm text-[var(--text-secondary)]">{i.body}</p>
            <span className={`mt-2 inline-flex items-center gap-1 text-sm font-bold ${ink}`}>Open <Arrow /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
