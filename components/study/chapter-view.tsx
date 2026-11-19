"use client";

/** Client side of a chapter page: the server component passes only what this viewer may read (lib/study/serve.ts). */
import { useEffect, useMemo } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { fromWire, type WireChapter } from "@/lib/study/schema";

export function ChapterView({ chapter, href }: { chapter: WireChapter; href: string }) {
  const ch = useMemo(() => fromWire(chapter), [chapter]);
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href, title: `${ch.subject}: ${ch.title}` })); } catch { /* storage off */ } }, [href, ch.subject, ch.title]);
  return <LessonRenderer chapter={ch} />;
}
