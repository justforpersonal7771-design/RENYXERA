"use client";

/** Algorithms → Graph traversals, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { ALGO_GRAPH } from "@/content/study/CS/algo-d";

export default function GraphTraversalsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/graph-traversals", title: `${ALGO_GRAPH.subject}: ${ALGO_GRAPH.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={ALGO_GRAPH} />;
}
