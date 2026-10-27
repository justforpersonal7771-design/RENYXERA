"use client";
import { useEffect, useState } from "react";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { toLocalDateStr } from "@/lib/utils";
import { useTargetYear } from "@/store/use-auth-store";
import { examDateFor } from "@/lib/goals/exam-year";

const TARGET_EXAM_DATE_KEY = "target_exam_date";

/** Days to the learner's GATE: one source for the hero and this card (null until the client knows). */
export function useDaysToGate(): number | null {
  const targetYear = useTargetYear();
  const [saved, setSaved] = useState<string | null | undefined>(undefined);
  useEffect(() => { IDBManager.getMetadata(TARGET_EXAM_DATE_KEY).then((rec) => setSaved(rec?.value ? String(rec.value) : null)); }, []);
  if (saved === undefined) return null;
  const exam = examDateFor(targetYear, saved);
  return Math.max(0, Math.round((new Date(exam + "T00:00:00").getTime() - new Date(toLocalDateStr() + "T00:00:00").getTime()) / 86_400_000));
}
