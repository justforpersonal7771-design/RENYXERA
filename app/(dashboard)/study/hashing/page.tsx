"use client";

/** Algorithms → Hashing, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { ALGO_HASH } from "@/content/study/CS/algo-b";

export default function HashingChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/hashing", title: `${ALGO_HASH.subject}: ${ALGO_HASH.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={ALGO_HASH} />;
}
