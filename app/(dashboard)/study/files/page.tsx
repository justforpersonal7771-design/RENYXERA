"use client";

/** Operating System → Files, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { OS_FS } from "@/content/study/CS/os-fs";

export default function FilesChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/files", title: `${OS_FS.subject}: ${OS_FS.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={OS_FS} />;
}
