"use client";

/** Discrete Mathematics → Logic, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DM_LOGIC } from "@/content/study/CS/dm-logic";

export default function LogicChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/logic", title: `${DM_LOGIC.subject}: ${DM_LOGIC.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DM_LOGIC} />;
}
