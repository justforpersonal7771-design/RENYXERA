"use client";

/** Reference chapter (R12 Phase 0): Operating System, Deadlock, rendered from data. One screen on desktop (the back link lives in the outline). */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { OS_DEADLOCK } from "@/content/study/CS/os-deadlock";

export default function DeadlockChapter() {
  // remember for the library hub's "Continue reading"
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/deadlock", title: `${OS_DEADLOCK.subject}: ${OS_DEADLOCK.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={OS_DEADLOCK} />;
}
