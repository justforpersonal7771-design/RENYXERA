"use client";

/** Programming and Data Structures → Programming in C, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { PDS_C } from "@/content/study/CS/pds-a";

export default function CProgrammingChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/c-programming", title: `${PDS_C.subject}: ${PDS_C.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={PDS_C} />;
}
