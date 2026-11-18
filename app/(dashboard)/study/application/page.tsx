"use client";

/** Computer Networks → Application, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { CN_APP } from "@/content/study/CS/cn-app";

export default function ApplicationChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/application", title: `${CN_APP.subject}: ${CN_APP.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={CN_APP} />;
}
