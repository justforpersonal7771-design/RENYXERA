"use client";

/** Databases → Transactions, rendered from data. */
import { useEffect } from "react";
import { LessonRenderer } from "@/components/study/lesson-renderer";
import { DB_TXN } from "@/content/study/CS/db-b";

export default function TransactionsChapter() {
  useEffect(() => { try { localStorage.setItem("renyxera.study.last", JSON.stringify({ href: "/study/transactions", title: `${DB_TXN.subject}: ${DB_TXN.title}` })); } catch { /* storage off */ } }, []);
  return <LessonRenderer chapter={DB_TXN} />;
}
