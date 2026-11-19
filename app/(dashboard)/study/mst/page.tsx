"use client";

/** Algorithms → Minimum spanning trees, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { ALGO_MST } from "@/content/study/CS/algo-d";

export default function MstChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/mst", title: `${ALGO_MST.subject}: ${ALGO_MST.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={ALGO_MST} />;
}
