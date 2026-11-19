"use client";

/** Databases → SQL, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DB_SQL } from "@/content/study/CS/db-a";

export default function SqlChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/sql", title: `${DB_SQL.subject}: ${DB_SQL.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DB_SQL} />;
}
