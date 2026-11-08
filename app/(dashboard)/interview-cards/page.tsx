"use client";

/** Interview flashcards: a separate deck from the GATE flashcards, same screen design and controls. */
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { InterviewFlashcards } from "@/components/interview/interview-flashcards";
import { InterviewGate } from "@/components/interview/interview-gate";

export default function InterviewCardsPage() {
  return (
    <InterviewGate>
    <div className="w-full space-y-4">
      <section className="card-well flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6" data-tint="butter" aria-label="Interview flashcards">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--surface)]"><Briefcase className="h-5 w-5 text-[var(--text-primary)]" aria-hidden /></span>
          <div>
            <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Interview cards</h1>
            <p className="text-sm text-[var(--text-secondary)]">Key terms, interview questions and self-checks from the interview library.</p>
          </div>
        </div>
        <Link href="/interview" className="pill-soft">Interview home</Link>
      </section>
      <InterviewFlashcards />
    </div>
    </InterviewGate>
  );
}
