"use client";

/** Operating System → VirtualMemory, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { OS_VM } from "@/content/study/CS/os-vm";

export default function VirtualMemoryChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/virtual-memory", title: `${OS_VM.subject}: ${OS_VM.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={OS_VM} />;
}
