"use client";

/** Computer Networks → Transport, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { CN_TCP } from "@/content/study/CS/cn-tcp";

export default function TransportChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/transport", title: `${CN_TCP.subject}: ${CN_TCP.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={CN_TCP} />;
}
