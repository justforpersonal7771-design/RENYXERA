"use client";

/** Test Centre / Practice: revision, checkpoint, flashcards and topic drills behind one door. */
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, ClipboardList, Flag, Layers, RotateCcw } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";

export default function PracticePage() {
  const { mistakes, loadStudyData } = useStudyStore();
  useEffect(() => { void loadStudyData(); }, [loadStudyData]);
  const open = mistakes.filter((m) => !m.mastered).length;
  const items = [
    { href: "/revision", tint: "rose", icon: RotateCcw, title: "Revise mistakes", body: open ? `${open} questions are waiting. Spaced repetition brings back the ones you are about to forget.` : "Nothing waiting right now. Mistakes you make will show up here." },
    { href: "/test-centre/build?view=flashcards", tint: "butter", icon: Layers, title: "Flashcards", body: "Quick recall cards from every source, due cards first." },
    { href: "/checkpoint", tint: "peri", icon: Flag, title: "Checkpoint", body: "A short mixed test to check what has stuck from your recent study." },
    { href: "/mistakes", tint: "lilac", icon: ClipboardList, title: "Your mistakes", body: "Browse every question you got wrong, by subject and topic." },
  ];
  return (
    <div className="flex w-full flex-col gap-5 lg:min-h-[calc(100dvh-14rem)]">
      <section className="card-well p-5 sm:p-6" data-tint="rose" aria-label="Practice">
        <h1 className="font-display text-3xl font-extrabold text-[var(--text-primary)]">Practice</h1>
        <p className="mt-1 text-[var(--text-secondary)]">Short sessions that fix weak spots. Pick one.</p>
      </section>
      <div className="grid flex-1 grid-cols-[minmax(0,1fr)] gap-5 md:auto-rows-fr md:grid-cols-2">
        {items.map((i) => (
          <Link key={i.title} href={i.href} data-tint={i.tint} className="card-pastel group flex min-w-0 flex-col p-5">
            <i.icon className="h-6 w-6 text-[var(--text-primary)]" aria-hidden />
            <h2 className="mt-3 font-display text-xl font-extrabold text-[var(--text-primary)]">{i.title}</h2>
            <p className="mt-1 flex-1 text-sm text-[var(--text-secondary)]">{i.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[var(--text-primary)]">Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
