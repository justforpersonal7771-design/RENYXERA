"use client";

/** Interview hub: your private preparation space. Books, flashcards, a code lab, SQL practice and your progress and mistakes. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpenText, Briefcase, ChartNoAxesColumn, Code2, Database, Layers } from "lucide-react";
import { InterviewGate, type IvDoc } from "@/components/interview/interview-gate";

type Att = { item_kind: string; ok: boolean };
const TILES = [
  { href: "/interview/read", title: "Books", text: "Read every chapter, revision sheet, glossary and trap list.", icon: BookOpenText, tint: "sky" },
  { href: "/interview-cards", title: "Flashcards", text: "Spaced repetition over terms, questions and self-checks.", icon: Layers, tint: "lilac" },
  { href: "/interview/lab", title: "Code lab", text: "Write and run C#, C++, Python, JS and TS. Load the books' labs.", icon: Code2, tint: "mint" },
  { href: "/interview/sql", title: "SQL practice", text: "Exercises with checking, written for SQL Server habits.", icon: Database, tint: "peach" },
  { href: "/interview/progress", title: "Progress and mistakes", text: "What you finished, what you keep getting wrong.", icon: ChartNoAxesColumn, tint: "butter" },
] as const;

function Hub() {
  const [docs, setDocs] = useState<IvDoc[]>([]);
  const [done, setDone] = useState(0);
  const [att, setAtt] = useState<Att[]>([]);
  useEffect(() => {
    void fetch("/api/interview/docs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { docs: IvDoc[]; progress: { status: string }[] } | null) => { if (d) { setDocs(d.docs); setDone(d.progress.filter((p) => p.status === "done").length); } });
    void fetch("/api/interview/progress", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { attempts: Att[] } | null) => { if (d) setAtt(d.attempts); });
  }, []);
  const readable = docs.filter((d) => d.kind !== "lab");
  const wrong = att.filter((a) => !a.ok).length;
  return (
    <div className="w-full space-y-5">
      <section className="card-well flex flex-wrap items-center justify-between gap-3 p-5 sm:px-6" data-tint="butter" aria-label="Interview">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface)]"><Briefcase className="h-6 w-6" aria-hidden /></span>
          <div><h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Interview preparation</h1><p className="text-sm text-[var(--text-secondary)]">Private to your account.</p></div>
        </div>
        <ul className="flex flex-wrap gap-2 text-sm font-bold">
          <li className="pill-soft">{done} / {readable.length || "…"} read</li>
          <li className="pill-soft">{att.length} tries</li>
          <li className="pill-soft">{wrong} to review</li>
        </ul>
      </section>
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TILES.map((t) => (
          <li key={t.href}>
            <Link href={t.href} className="card-pastel flex h-full min-h-[148px] flex-col gap-2 p-5" data-tint={t.tint}>
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--surface)]"><t.icon className="h-5 w-5" aria-hidden /></span>
              <span className="font-display text-lg font-extrabold text-[var(--text-primary)]">{t.title}</span>
              <span className="text-sm text-[var(--text-secondary)]">{t.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default function InterviewPage() { return <InterviewGate><Hub /></InterviewGate>; }
