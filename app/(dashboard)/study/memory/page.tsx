"use client";

/** Operating System → Memory, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { OS_MEMORY } from "@/content/study/CS/os-memory";

export default function MemoryChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/memory", title: `${OS_MEMORY.subject}: ${OS_MEMORY.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={OS_MEMORY} />;
}
