"use client";

/** Algorithms → Searching and sorting, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { ALGO_SORT } from "@/content/study/CS/algo-a";

export default function SortingChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/sorting", title: `${ALGO_SORT.subject}: ${ALGO_SORT.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={ALGO_SORT} />;
}
