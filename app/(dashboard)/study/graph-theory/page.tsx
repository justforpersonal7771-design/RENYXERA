"use client";

/** Discrete Mathematics → GraphTheory, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DM_GRAPH } from "@/content/study/CS/dm-graph";

export default function GraphTheoryChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/graph-theory", title: `${DM_GRAPH.subject}: ${DM_GRAPH.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DM_GRAPH} />;
}
