"use client";

/** Algorithms → Shortest paths, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { ALGO_SP } from "@/content/study/CS/algo-d";

export default function ShortestPathsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/shortest-paths", title: `${ALGO_SP.subject}: ${ALGO_SP.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={ALGO_SP} />;
}
