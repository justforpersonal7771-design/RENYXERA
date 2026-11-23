"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/use-auth-store";
import { useStudyStore } from "@/store/use-study-store";
import { useNotes, useRevision } from "@/lib/desk/stores";
import { useRevisionSeed } from "@/lib/desk/revision";

/**
 * Mounted once for the whole app (next to the other sync components). It loads the desk collections (notes, revision) for whoever is signed in, loads the review data
 * and feeds the revision queue from mistakes and bookmarks, so the "due today" number is right on every screen that shows it (Review, the Planner, the Mentor) before
 * anyone opens Revision.
 */
export function DeskSync() {
  const uid = useAuthStore((s) => s.user?.id ?? null);
  const loadStudyData = useStudyStore((s) => s.loadStudyData);
  useEffect(() => { void useRevision.getState().load(); void useNotes.getState().load(); void loadStudyData(); }, [uid, loadStudyData]);
  useRevisionSeed(Number((() => { try { return localStorage.getItem("renyxera.rev.perday"); } catch { return null; } })()) || 10);
  return null;
}
