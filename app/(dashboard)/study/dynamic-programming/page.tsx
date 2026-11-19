"use client";

/** Algorithms → Dynamic programming, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { ALGO_DP } from "@/content/study/CS/algo-c";

export default function DynamicProgrammingChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/dynamic-programming", title: `${ALGO_DP.subject}: ${ALGO_DP.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={ALGO_DP} />;
}
