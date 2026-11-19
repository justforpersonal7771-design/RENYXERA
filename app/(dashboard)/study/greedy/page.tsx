"use client";

/** Algorithms → Greedy, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { ALGO_GREEDY } from "@/content/study/CS/algo-c";

export default function GreedyChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/greedy", title: `${ALGO_GREEDY.subject}: ${ALGO_GREEDY.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={ALGO_GREEDY} />;
}
