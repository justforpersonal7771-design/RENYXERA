"use client";

/** Discrete Mathematics → Groups, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DM_GROUPS } from "@/content/study/CS/dm-sets";

export default function GroupsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/groups", title: `${DM_GROUPS.subject}: ${DM_GROUPS.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DM_GROUPS} />;
}
