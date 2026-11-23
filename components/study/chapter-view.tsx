"use client";

/** Client side of a chapter page: the server component passes only what this viewer may read (lib/study/serve.ts). */
import { useEffect, useMemo, useState } from "react";
import { ContentGuard } from "@/components/study/content-guard";
import { CHAPTERS } from "@/lib/study/chapters";
import type { Chapter } from "@/lib/study/schema";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { fromWire, type WireChapter } from "@/lib/study/schema";

export function ChapterView({ chapter, href }: { chapter: WireChapter; href: string }) {
  const first = useMemo(() => fromWire(chapter), [chapter]);
  const [full, setFull] = useState<Chapter | null>(null);
  // topics a paid reader may open are not in the page source: fetch them once the page is up
  const waiting = first.topics.some((t) => t.deferred);
  useEffect(() => {
    if (!waiting) return; let alive = true;
    CHAPTERS[href]?.().then((c) => { if (alive) setFull(c); }).catch(() => {});
    return () => { alive = false; };
  }, [waiting, href]);
  const ch = full ?? first;
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href, title: `${ch.subject}: ${ch.title}` })); } catch { /* storage off */ } }, [href, ch.subject, ch.title]);
  return <ContentGuard><LessonRenderer chapter={ch} /></ContentGuard>;
}
