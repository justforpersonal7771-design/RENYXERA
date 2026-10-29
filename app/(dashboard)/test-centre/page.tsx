"use client";

/** Test Centre hub: one front door for building a test, taking a mock, practising and challenging a friend. */
import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, BarChart3, Layers, RotateCcw, Settings, Swords, Timer } from "lucide-react";
import { useStudyStore } from "@/store/use-study-store";
import { TEST_CENTRE } from "@/lib/test-centre/brand";

export default function TestCentrePage() {
  const { mistakes, loadStudyData } = useStudyStore();
  useEffect(() => { void loadStudyData(); }, [loadStudyData]);
  const open = mistakes.filter((m) => !m.mastered).length;

  const doors = [
    { href: "/setup", tint: "mint", icon: Settings, title: "Build a test", body: "Pick the source (GATE PYQs, Forge, Spark or Blend), the subjects and the length, then start.", cta: "Build" },
    { href: "/mocks", tint: "peri", icon: Timer, title: "Mocks", body: "All-India mocks and full-length papers under exam conditions, with a rank.", cta: "Open mocks" },
    { href: "/revision", tint: "rose", icon: RotateCcw, title: "Practice", body: open ? `${open} mistakes are waiting. Revise them with spaced repetition.` : "Revise your mistakes with spaced repetition and drill weak topics.", cta: "Practise" },
    { href: "/setup?view=flashcards", tint: "butter", icon: Layers, title: "Flashcards", body: "Quick recall cards from every source, due cards first.", cta: "Open cards" },
    { href: "/analytics", tint: "sky", icon: BarChart3, title: "Your results", body: "Every attempt, your accuracy by subject and where marks are leaking.", cta: "See results" },
    { href: "/challenge", tint: "lilac", icon: Swords, title: "Challenge a friend", body: "Send the same questions to a friend and compare scores.", cta: "Challenge" },
  ];

  return (
    <div className="flex w-full flex-col gap-5 lg:min-h-[calc(100dvh-9.5rem)]" data-fill-height="always">
      <section className="card-well shrink-0 p-5 sm:p-6" data-tint="mint" aria-label={TEST_CENTRE}>
        <h1 className="font-display text-3xl font-extrabold text-[var(--text-primary)]">{TEST_CENTRE}</h1>
        <p className="mt-1 text-[var(--text-secondary)]">Everything you take a test with, in one place. Pick a door.</p>
      </section>
      <div className="grid flex-1 grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2 xl:grid-cols-3 xl:auto-rows-fr">
        {doors.map((d) => (
          <Link key={d.title} href={d.href} data-tint={d.tint} className="card-pastel group flex min-w-0 flex-col p-5">
            <d.icon className="h-6 w-6 text-[var(--text-primary)]" aria-hidden />
            <h2 className="mt-3 font-display text-xl font-extrabold text-[var(--text-primary)]">{d.title}</h2>
            <p className="mt-1 flex-1 text-sm text-[var(--text-secondary)]">{d.body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[var(--text-primary)]">{d.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
