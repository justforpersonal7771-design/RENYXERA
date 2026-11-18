"use client";

/** Discrete Mathematics → Recurrences, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DM_RECUR } from "@/content/study/CS/dm-count";

export default function RecurrencesChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/recurrences", title: `${DM_RECUR.subject}: ${DM_RECUR.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DM_RECUR} />;
}
