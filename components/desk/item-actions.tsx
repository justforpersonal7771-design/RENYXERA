"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Check, GraduationCap, MessageCircle, MoreHorizontal, NotebookPen, Repeat } from "lucide-react";
import { NoteEditor } from "@/components/desk/note-editor";
import { addToRevision } from "@/lib/desk/revision";
import { useRevision } from "@/lib/desk/stores";
import { hasStudyChapter, mentorAskHref, studyHrefFor, tutorHref } from "@/lib/desk/links";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { useToastStore } from "@/store/use-toast-store";
import type { Note } from "@/lib/desk/types";

/**
 * One menu on every question, note and card, so the pieces of the app can be reached from each other: Teach me (Tutor), Add note, Add to revision,
 * Open in Study, Ask the Mentor. It is the single place those links are written.
 */
export function ItemActions({ questionId, subject, topic, title, source = "test", align = "right", label }: {
  questionId: string; subject?: string; topic?: string; title?: string; source?: Note["source"]; align?: "left" | "right"; label?: boolean;
}) {
  const [open, setOpen] = useState(false); const [note, setNote] = useState(false);
  const ref = useRef<HTMLDivElement>(null); const router = useRouter();
  const q = QuestionRepository.getQuestionById(questionId);
  const sub = subject ?? q?.subject; const top = topic ?? q?.topic;
  const inRev = useRevision((s) => s.items.some((i) => i.id === `question:${questionId}` && !i.suspended));
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  const text = (title ?? q?.questionTextRaw ?? "").replace(/\s+/g, " ").replace(/\[IMAGE_[^\]]*\]/g, "[figure]").trim();
  const item = "flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]";
  return (
    <div ref={ref} className="relative inline-block" onClick={(e) => e.stopPropagation()}>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} aria-label="More actions for this question" title="Teach me, note, revise…"
        className={`inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] ${label ? "px-3" : "w-9"}`}>
        <MoreHorizontal className="h-4 w-4" />{label && "Do more"}
      </button>
      {open && (
        <div role="menu" aria-label="Actions" className={`absolute top-full z-50 mt-1.5 w-56 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl ${align === "right" ? "right-0" : "left-0"}`}>
          <Link role="menuitem" href={tutorHref(questionId)} className={item} onClick={() => setOpen(false)}><GraduationCap className="h-4 w-4" /> Teach me this</Link>
          <button role="menuitem" type="button" className={item} onClick={() => { setOpen(false); setNote(true); }}><NotebookPen className="h-4 w-4" /> Add a note</button>
          <button role="menuitem" type="button" className={item} onClick={() => { setOpen(false); const made = addToRevision({ kind: "question", refId: questionId, source, title: text.slice(0, 110), subject: sub, topic: top }); useToastStore.getState().show(made ? "Added to your revision queue" : "Already in your revision queue", "success"); }}>
            {inRev ? <Check className="h-4 w-4 text-[var(--tint-mint-ink)]" /> : <Repeat className="h-4 w-4" />}{inRev ? "In revision" : "Add to revision"}
          </button>
          {hasStudyChapter(top, sub) && <Link role="menuitem" href={studyHrefFor(top, sub)} className={item} onClick={() => setOpen(false)}><BookOpen className="h-4 w-4" /> Open the lesson</Link>}
          <button role="menuitem" type="button" className={item} onClick={() => { setOpen(false); router.push(mentorAskHref(`Help me with this GATE question${top ? ` (${top})` : ""}: ${text.slice(0, 400)}`)); }}><MessageCircle className="h-4 w-4" /> Ask the Mentor</button>
        </div>
      )}
      <NoteEditor open={note} onClose={() => setNote(false)} title="Note on this question" initial={{ source, refId: questionId, subject: sub, topic: top, title: top ? `${top}` : "", quote: text.slice(0, 220) }} />
    </div>
  );
}
