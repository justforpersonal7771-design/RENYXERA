"use client";

/** Computer Networks → Ip, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { CN_IP } from "@/content/study/CS/cn-ip";

export default function IpChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/ip", title: `${CN_IP.subject}: ${CN_IP.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={CN_IP} />;
}
