"use client";

import { createDeskStore } from "@/lib/desk/store";
import type { Note, Queue, RevItem } from "@/lib/desk/types";

export const useNotes = createDeskStore<Note>("notes");
export const useRevision = createDeskStore<RevItem>("revision");
export const useQueues = createDeskStore<Queue>("queues");

export const newId = (p: string) => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const nowIso = () => new Date().toISOString();

/** Creates or updates a note. One note per (source, refId, kind) for the automatic sources, so saving twice edits instead of duplicating. */
export function saveNote(p: Partial<Note> & { source: Note["source"]; body: string }) {
  const st = useNotes.getState();
  const same = p.id ? st.items.find((n) => n.id === p.id) : p.refId && p.source !== "mine" ? st.items.find((n) => n.source === p.source && n.refId === p.refId && n.kind === (p.kind ?? "note")) : undefined;
  const t = nowIso();
  const note: Note = {
    id: same?.id ?? p.id ?? newId("n"), updatedAt: t, createdAt: same?.createdAt ?? t,
    source: p.source, refId: p.refId ?? same?.refId, kind: p.kind ?? same?.kind ?? "note",
    title: (p.title ?? same?.title ?? "").slice(0, 160), body: p.body.slice(0, 8000), quote: p.quote ?? same?.quote,
    subject: p.subject ?? same?.subject, topic: p.topic ?? same?.topic, tags: p.tags ?? same?.tags ?? [],
    color: p.color ?? same?.color ?? "none", pinned: p.pinned ?? same?.pinned ?? false, revise: p.revise ?? same?.revise ?? false,
  };
  st.upsert(note);
  return note;
}
