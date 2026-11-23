"use client";

import { useEffect, useMemo } from "react";
import { istDateStr } from "@/lib/time/ist";
import { useRevision } from "@/lib/desk/stores";
import { useStudyStore } from "@/store/use-study-store";
import { useDataStore } from "@/store/use-data-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { loadPlanOptions } from "@/lib/planner/apply";
import { isDue, stagger } from "@/lib/revision/scheduler";
import type { RevItem } from "@/lib/desk/types";

export const todayIst = () => istDateStr();
/** The exam day from the student's plan, or null. */
export function examDay(): string | null { try { const d = loadPlanOptions()?.examDate; return d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null; } catch { return null; } }

const fresh = (p: Pick<RevItem, "kind" | "refId" | "source" | "title" | "subject" | "topic">, due: string): RevItem => ({
  id: `${p.kind}:${p.refId}`, updatedAt: new Date().toISOString(), ...p, due, interval: 0, ease: 2.5, reps: 0, lapses: 0, added: todayIst(),
});

/** Puts one question or note into the revision queue (due today). Returns false if it was already there. */
export function addToRevision(p: Pick<RevItem, "kind" | "refId" | "source" | "title" | "subject" | "topic">): boolean {
  const st = useRevision.getState(); const id = `${p.kind}:${p.refId}`;
  const had = st.items.find((i) => i.id === id);
  if (had) { if (had.suspended) st.upsert({ ...had, suspended: false, updatedAt: new Date().toISOString() }); return false; }
  st.upsert(fresh(p, todayIst())); return true;
}
export const inRevision = (kind: RevItem["kind"], refId: string) => useRevision.getState().items.some((i) => i.id === `${kind}:${refId}` && !i.suspended);

const short = (t: string) => { const s = (t ?? "").replace(/\s+/g, " ").replace(/\[IMAGE_[^\]]*\]/g, "[figure]").trim(); return s.length > 110 ? s.slice(0, 109) + "…" : s; };

/**
 * Keeps the revision queue fed from what the student already has: unmastered mistakes and bookmarked questions become revision items, introduced `perDay` a day
 * so a long mistakes list does not bury the first day. Runs once the review data and the question bank are ready; an item is created only once, so a rating is never reset.
 */
export function useRevisionSeed(perDay = 10) {
  const { mistakes, bookmarks } = useStudyStore();
  const loaded = useRevision((s) => s.loaded); const ready = useDataStore((s) => s.isInitialized);
  useEffect(() => {
    if (!loaded || !ready) return;
    const have = new Set(useRevision.getState().items.map((i) => i.id));
    const today = todayIst(); const add: RevItem[] = [];
    let n = useRevision.getState().items.filter((i) => i.due >= today && i.reps === 0).length;
    const take = (qid: string, source: string, subject?: string, topic?: string) => {
      const id = `question:${qid}`; if (have.has(id)) return; have.add(id);
      const q = QuestionRepository.getQuestionById(qid);
      add.push(fresh({ kind: "question", refId: qid, source, title: short(q?.questionTextRaw ?? "") || `${subject ?? ""} ${topic ?? ""}`.trim() || qid, subject: q?.subject ?? subject, topic: q?.topic ?? topic }, stagger(n++, perDay, today)));
    };
    [...mistakes].filter((m) => !m.mastered).sort((a, b) => (b.occurrences ?? 1) - (a.occurrences ?? 1)).forEach((m) => take(m.questionId, "mistake", m.subject, m.topic));
    bookmarks.forEach((b) => take(b.questionId, "bookmark", b.subject, b.topic));
    if (add.length) useRevision.getState().upsertMany(add);
  }, [loaded, ready, mistakes, bookmarks, perDay]);
}

/** Counts for badges and chips anywhere in the app: how many items are due today, and how many are in the queue. */
export function useRevisionDue() {
  const items = useRevision((s) => s.items); const loaded = useRevision((s) => s.loaded);
  return useMemo(() => { const t = todayIst(); const live = items.filter((i) => !i.suspended); return { loaded, due: live.filter((i) => isDue(i, t)).length, total: live.length }; }, [items, loaded]);
}

/** Loads every desk collection once; call from the screens that read them. */
export function useDeskLoad() {
  useEffect(() => { void useRevision.getState().load(); }, []);
}

/** Days on which at least one item was revised, newest last; the streak and the heatmap read it. Kept on this device. */
const DAYS_KEY = "renyxera.rev.days";
export const readReviewDays = (): string[] => { try { return JSON.parse(localStorage.getItem(DAYS_KEY) || "[]") as string[]; } catch { return []; } };
export function noteReviewDay() { try { const d = todayIst(); const all = readReviewDays(); if (!all.includes(d)) localStorage.setItem(DAYS_KEY, JSON.stringify([...all, d].slice(-400))); } catch { /* storage blocked */ } }
export function streakOf(days: string[], today: string): number {
  const set = new Set(days); let n = 0; let d = set.has(today) ? today : new Date(Date.parse(today + "T00:00:00Z") - 86_400_000).toISOString().slice(0, 10);
  while (set.has(d)) { n += 1; d = new Date(Date.parse(d + "T00:00:00Z") - 86_400_000).toISOString().slice(0, 10); }
  return n;
}
