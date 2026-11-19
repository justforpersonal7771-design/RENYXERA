"use client";

/** Programming and Data Structures → Arrays, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { PDS_ARR } from "@/content/study/CS/pds-b";

export default function ArraysChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/arrays", title: `${PDS_ARR.subject}: ${PDS_ARR.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={PDS_ARR} />;
}
