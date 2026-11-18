"use client";

/** Computer Networks → Layering, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { CN_LAYERS } from "@/content/study/CS/cn-layers";

export default function LayeringChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/layering", title: `${CN_LAYERS.subject}: ${CN_LAYERS.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={CN_LAYERS} />;
}
