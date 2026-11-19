"use client";

/** Algorithms → Asymptotics and recurrences, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { ALGO_ASYM } from "@/content/study/CS/algo-a";

export default function AsymptoticsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/asymptotics", title: `${ALGO_ASYM.subject}: ${ALGO_ASYM.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={ALGO_ASYM} />;
}
