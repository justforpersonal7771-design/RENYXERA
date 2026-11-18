"use client";

/** Discrete Mathematics → SetsRelations, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DM_SETS } from "@/content/study/CS/dm-sets";

export default function SetsRelationsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/sets-relations", title: `${DM_SETS.subject}: ${DM_SETS.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DM_SETS} />;
}
