"use client";

/** Databases → Relational algebra, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DB_RA } from "@/content/study/CS/db-a";

export default function RelationalAlgebraChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/relational-algebra", title: `${DB_RA.subject}: ${DB_RA.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DB_RA} />;
}
