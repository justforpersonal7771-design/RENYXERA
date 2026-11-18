"use client";

/** Discrete Mathematics → Counting, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DM_COUNT } from "@/content/study/CS/dm-count";

export default function CountingChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/counting", title: `${DM_COUNT.subject}: ${DM_COUNT.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DM_COUNT} />;
}
