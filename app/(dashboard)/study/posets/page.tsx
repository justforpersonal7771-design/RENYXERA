"use client";

/** Discrete Mathematics → Posets, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DM_POSET } from "@/content/study/CS/dm-sets";

export default function PosetsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/posets", title: `${DM_POSET.subject}: ${DM_POSET.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DM_POSET} />;
}
