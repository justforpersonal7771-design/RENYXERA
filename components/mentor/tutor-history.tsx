"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Trash2 } from "lucide-react";
import { MentorLogo } from "@/components/brand/mentor-logo";
import { ConversationMemory } from "@/lib/ai/memory/ConversationMemory";
import { istDateStr } from "@/lib/time/ist";

type Row = Awaited<ReturnType<typeof ConversationMemory.listConversations>>[number];

/** "GATE_CS_2026_FN_Q5" → "GATE CS 2026 FN · Q5" */
const nameOf = (id: string) => { const m = /^GATE_([A-Z]+)_(\d{4})_([A-Za-z0-9]+)_Q(\d+)$/.exec(id); return m ? `GATE ${m[1]} ${m[2]} ${m[3]} · Q${m[4]}` : id.startsWith("ai_") ? "Practice question" : id.replace(/_/g, " "); };
const plain = (s: string) => s.replace(/\\\(|\\\)|\\\[|\\\]|\$\$?/g, "").replace(/\s+/g, " ").trim();

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
