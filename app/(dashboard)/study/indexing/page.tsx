"use client";

/** Databases → Indexing, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DB_INDEX } from "@/content/study/CS/db-b";

export default function IndexingChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/indexing", title: `${DB_INDEX.subject}: ${DB_INDEX.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DB_INDEX} />;
}
