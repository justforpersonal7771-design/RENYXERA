"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, History as HistoryIcon, Trash2 } from "lucide-react";
import { MentorLogo } from "@/components/brand/mentor-logo";
import { ConversationMemory } from "@/lib/ai/memory/ConversationMemory";
import { istDateStr } from "@/lib/time/ist";

export type Row = Awaited<ReturnType<typeof ConversationMemory.listConversations>>[number];

/** "GATE_CS_2026_FN_Q5" → "GATE CS 2026 FN · Q5" */
export const nameOf = (id: string) => { const m = /^GATE_([A-Z]+)_(\d{4})_([A-Za-z0-9]+)_Q(\d+)$/.exec(id); return m ? `GATE ${m[1]} ${m[2]} ${m[3]} · Q${m[4]}` : id.startsWith("ai_") ? "Practice question" : id.replace(/_/g, " "); };
export const plain = (s: string) => s.replace(/\\\(|\\\)|\\\[|\\\]|\$\$?/g, "").replace(/\s+/g, " ").trim();

/**
 * The AI Mentor's "Tutor chats" group: every question the student has talked through with the Tutor, newest first, with the last thing said.
 * Opening one goes back into the same conversation (the Tutor restores it and carries on), nothing starts over. Kept on this device.
 */
export function TutorHistory({ limit = 6 }: { limit?: number }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [all, setAll] = useState(false);
  const load = useCallback(() => { ConversationMemory.listConversations().then(setRows).catch(() => setRows([])); }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads this device's saved chats once after mount
  useEffect(() => { load(); }, [load]);
  if (!rows || rows.length === 0) return null;
  const shown = all ? rows : rows.slice(0, limit);
  return (
    <section className="card-well p-4 sm:p-5" data-tint="sky" aria-label="Tutor chats">
      <div className="flex items-center gap-3"><MentorLogo className="h-8" /><div><h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Tutor chats</h2><p className="text-sm text-[var(--text-secondary)]">Questions you went through with the Tutor. Open one to carry on where you stopped.</p></div></div>
      <ul className="mt-3 space-y-2">
        {shown.map((r) => (
          <li key={r.questionId} className="group flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] pr-2 transition-colors hover:bg-[var(--surface-secondary)]">
            <Link href={`/ai-tutor?qid=${encodeURIComponent(r.questionId)}`} className="flex min-w-0 flex-1 items-center gap-3 p-3">
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2"><span className="truncate text-sm font-extrabold text-[var(--text-primary)]">{nameOf(r.questionId)}</span><span className="shrink-0 text-[11px] text-[var(--text-muted)]">{istDateStr(new Date(r.updatedAt))}</span></span>
                <span className="mt-0.5 block truncate text-xs text-[var(--text-secondary)]">{r.lastUser ? `You: ${plain(r.lastUser)}` : plain(r.lastText).slice(0, 140)}</span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
            <button type="button" aria-label={`Delete the chat for ${nameOf(r.questionId)}`} title="Delete this chat" onClick={() => { void ConversationMemory.clearConversation(r.questionId).then(load); }} className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
          </li>
        ))}
      </ul>
      {rows.length > limit && <button type="button" onClick={() => setAll((v) => !v)} className="pill-soft mt-3 cursor-pointer text-xs">{all ? "Show fewer" : `Show all ${rows.length}`}</button>}
    </section>
  );
}

/**
 * The Tutor's History button: a menu of the questions you went through with the Tutor, newest first. Choosing one opens that question
 * with its whole conversation, ready to carry on. Kept on this device. (It is not shown on the Mentor screens.)
 */
export function TutorHistoryMenu({ iconOnly = false }: { iconOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const load = useCallback(() => { ConversationMemory.listConversations().then(setRows).catch(() => setRows([])); }, []);
  useEffect(() => {
    if (!open) return;
    load();
    const away = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open, load]);
  return (
    <div ref={box} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="dialog" aria-expanded={open} aria-label="History of Tutor sessions" title="History" className={`inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-xs font-black tracking-normal transition ${open ? "border-[var(--text-primary)] bg-[var(--surface-secondary)] text-[var(--text-primary)]" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
        <HistoryIcon className="h-4 w-4" aria-hidden /><span className={iconOnly ? "max-2xl:hidden" : ""}>History</span>
      </button>
      {open && (
        <div role="dialog" aria-label="Tutor history" className="absolute right-0 top-full z-[60] mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-2xl">
          <p className="px-2 pb-1.5 pt-1 text-xs font-black text-[var(--text-muted)]">Your Tutor chats</p>
          {rows === null ? <p className="px-2 py-3 text-sm text-[var(--text-secondary)]">Loading…</p>
            : rows.length === 0 ? <p className="px-2 py-3 text-sm text-[var(--text-secondary)]">Nothing yet. Questions you go through with the Tutor will be listed here.</p>
            : <ul className="max-h-[60vh] space-y-1 overflow-y-auto">{rows.map((r) => (
              <li key={r.questionId} className="group flex items-center gap-1 rounded-xl hover:bg-[var(--surface-secondary)]">
                <Link href={`/ai-tutor?qid=${encodeURIComponent(r.questionId)}`} onClick={() => setOpen(false)} className="min-w-0 flex-1 px-2.5 py-2">
                  <span className="flex items-baseline justify-between gap-2"><span className="truncate text-sm font-extrabold text-[var(--text-primary)]">{nameOf(r.questionId)}</span><span className="shrink-0 text-[11px] text-[var(--text-muted)]">{istDateStr(new Date(r.updatedAt))}</span></span>
                  <span className="mt-0.5 block truncate text-xs text-[var(--text-secondary)]">{r.lastUser ? `You: ${plain(r.lastUser)}` : plain(r.lastText).slice(0, 120)}</span>
                </Link>
                <button type="button" aria-label={`Delete the chat for ${nameOf(r.questionId)}`} title="Delete this chat" onClick={() => { void ConversationMemory.clearConversation(r.questionId).then(load); }} className="mr-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
              </li>
            ))}</ul>}
        </div>
      )}
    </div>
  );
}
