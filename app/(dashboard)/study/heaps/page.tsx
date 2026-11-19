"use client";

/** Programming and Data Structures → Binary heaps, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { PDS_HEAP } from "@/content/study/CS/pds-d";

export default function HeapsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/heaps", title: `${PDS_HEAP.subject}: ${PDS_HEAP.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={PDS_HEAP} />;
}
