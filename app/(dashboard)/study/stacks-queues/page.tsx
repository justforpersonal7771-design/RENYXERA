"use client";

/** Programming and Data Structures → Stacks and queues, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { PDS_SQ } from "@/content/study/CS/pds-c";

export default function StacksQueuesChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/stacks-queues", title: `${PDS_SQ.subject}: ${PDS_SQ.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={PDS_SQ} />;
}
