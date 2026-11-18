"use client";

/** Operating System → Processes and threads, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { OS_PROCESSES } from "@/content/study/CS/os-processes";

export default function ProcessesChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/processes", title: `${OS_PROCESSES.subject}: ${OS_PROCESSES.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={OS_PROCESSES} />;
}
