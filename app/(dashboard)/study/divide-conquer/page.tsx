"use client";

/** Algorithms → Divide and conquer, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { ALGO_DC } from "@/content/study/CS/algo-b";

export default function DivideConquerChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/divide-conquer", title: `${ALGO_DC.subject}: ${ALGO_DC.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={ALGO_DC} />;
}
