"use client";

/** Databases → Concurrency control, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DB_CC } from "@/content/study/CS/db-b";

export default function ConcurrencyControlChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/concurrency-control", title: `${DB_CC.subject}: ${DB_CC.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DB_CC} />;
}
