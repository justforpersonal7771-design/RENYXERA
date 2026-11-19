"use client";

/** Databases → ER model, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DB_ER } from "@/content/study/CS/db-a";

export default function ErModelChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/er-model", title: `${DB_ER.subject}: ${DB_ER.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DB_ER} />;
}
