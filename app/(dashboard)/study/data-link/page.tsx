"use client";

/** Computer Networks → DataLink, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { CN_DLL } from "@/content/study/CS/cn-dll";

export default function DataLinkChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/data-link", title: `${CN_DLL.subject}: ${CN_DLL.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={CN_DLL} />;
}
