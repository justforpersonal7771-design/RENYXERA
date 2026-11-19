"use client";

/** Programming and Data Structures → Linked lists, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { PDS_LL } from "@/content/study/CS/pds-c";

export default function LinkedListsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/linked-lists", title: `${PDS_LL.subject}: ${PDS_LL.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={PDS_LL} />;
}
