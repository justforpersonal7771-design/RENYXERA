"use client";

/** Programming and Data Structures → Recursion, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { PDS_REC } from "@/content/study/CS/pds-b";

export default function RecursionChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/recursion", title: `${PDS_REC.subject}: ${PDS_REC.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={PDS_REC} />;
}
