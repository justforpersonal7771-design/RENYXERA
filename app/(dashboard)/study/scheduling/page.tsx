"use client";

/** Operating System → CPU scheduling, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { OS_SCHEDULING } from "@/content/study/CS/os-scheduling";

export default function SchedulingChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/scheduling", title: `${OS_SCHEDULING.subject}: ${OS_SCHEDULING.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={OS_SCHEDULING} />;
}
