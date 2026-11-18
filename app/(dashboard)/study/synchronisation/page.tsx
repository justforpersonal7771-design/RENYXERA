"use client";

/** Operating System → Synchronisation, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { OS_SYNC } from "@/content/study/CS/os-sync";

export default function SyncChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/synchronisation", title: `${OS_SYNC.subject}: ${OS_SYNC.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={OS_SYNC} />;
}
