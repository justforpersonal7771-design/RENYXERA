"use client";

/** Practise: the three ways to practise, with what each is for. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Code2, Database, Dumbbell, Layers } from "lucide-react";

const SR_KEY = "renyxera_interview_sr";
const due = () => { try { const sr = JSON.parse(localStorage.getItem(SR_KEY) ?? "{}") as Record<string, { due: number }>; const now = Date.now(); return Object.values(sr).filter((x) => x.due <= now).length; } catch { return 0; } };

const DOORS = [
  { href: "/interview-cards", icon: Layers, tint: "lilac", title: "Flashcards", text: "Key terms, interview questions and self-checks, repeated just before you would forget them.", cta: "Open the cards" },
  { href: "/interview/lab", icon: Code2, tint: "mint", title: "Code lab", text: "Write and run C#, C++, Python, JavaScript and TypeScript. Load the books' own labs and check your output.", cta: "Open the lab" },
  { href: "/interview/sql", icon: Database, tint: "peach", title: "SQL practice", text: "Ten exercises on joins, NULLs, grouping, windows and CTEs, each checked, with the SQL Server way shown.", cta: "Start the exercises" },
] as const;

export default function PractisePage() {
  const [n, setN] = useState(0);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the due-card count from this device after mount
  useEffect(() => { setN(due()); }, []);
  return (
    <div className="space-y-6">
      <section className="card-pastel p-6 sm:p-8" data-tint="mint" aria-label="Practise">
        <span className="section-label"><Dumbbell className="h-3.5 w-3.5" /> Practise</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] text-[var(--text-primary)] sm:text-5xl">Learn it by doing it.</h1>
        <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">Everything you get wrong is saved to Review so you can fix it later.</p>
        {n > 0 && <Link href="/interview-cards" className="btn-main mt-4 inline-flex">{n} flashcards are due<ArrowRight className="h-4 w-4" /></Link>}
      </section>
      <ul className="grid gap-4 md:grid-cols-3">
        {DOORS.map((d) => (
          <li key={d.href}>
            <Link href={d.href} className="card-pastel flex h-full min-h-[200px] flex-col gap-3 p-6" data-tint={d.tint}>
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface)]"><d.icon className="h-6 w-6" aria-hidden /></span>
              <span className="font-display text-xl font-extrabold text-[var(--text-primary)]">{d.title}</span>
              <span className="text-sm text-[var(--text-secondary)]">{d.text}</span>
              <span className="mt-auto inline-flex items-center gap-1 text-sm font-bold text-[var(--text-primary)]">{d.cta}<ArrowRight className="h-4 w-4" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
