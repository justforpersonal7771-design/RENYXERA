"use client";

/** Programming and Data Structures → Graphs: representation, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { PDS_GRAPH } from "@/content/study/CS/pds-e";

export default function GraphRepresentationChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/graph-representation", title: `${PDS_GRAPH.subject}: ${PDS_GRAPH.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={PDS_GRAPH} />;
}
