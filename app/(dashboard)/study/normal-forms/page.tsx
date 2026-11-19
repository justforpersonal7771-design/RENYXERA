"use client";

/** Databases → Normal forms, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DB_NORM } from "@/content/study/CS/db-b";

export default function NormalFormsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/normal-forms", title: `${DB_NORM.subject}: ${DB_NORM.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DB_NORM} />;
}
