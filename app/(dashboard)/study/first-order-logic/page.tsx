"use client";

/** Discrete Mathematics → FirstOrderLogic, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DM_FOL } from "@/content/study/CS/dm-logic";

export default function FirstOrderLogicChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/first-order-logic", title: `${DM_FOL.subject}: ${DM_FOL.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DM_FOL} />;
}
