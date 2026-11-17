"use client";

/** Reference chapter review page (R12 Phase 0): Operating System → Deadlock, rendered from data. */
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { OS_DEADLOCK } from "@/content/study/CS/os-deadlock";

export default function DeadlockChapter() {
  return (
    <div className="space-y-6 pb-10">
      <Link href="/study" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)]"><ArrowLeft className="h-4 w-4" /> Study materials</Link>
      <LessonRenderer chapter={OS_DEADLOCK} />
    </div>
  );
}
