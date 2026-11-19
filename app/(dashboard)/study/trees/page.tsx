"use client";

/** Programming and Data Structures → Trees and binary search trees, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { PDS_TREE } from "@/content/study/CS/pds-d";

export default function TreesChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/trees", title: `${PDS_TREE.subject}: ${PDS_TREE.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={PDS_TREE} />;
}
