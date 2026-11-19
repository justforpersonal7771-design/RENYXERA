"use client";

/** Databases → Relational model, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DB_REL } from "@/content/study/CS/db-a";

export default function RelationalModelChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/relational-model", title: `${DB_REL.subject}: ${DB_REL.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DB_REL} />;
}
