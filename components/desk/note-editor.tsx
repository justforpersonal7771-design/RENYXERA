"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { DeskModal } from "@/components/desk/modal";
import { saveNote } from "@/lib/desk/stores";
import { useNotes } from "@/lib/desk/stores";
import { addToRevision } from "@/lib/desk/revision";
import { useRevision } from "@/lib/desk/stores";
import { SOURCE_LABEL, type Note, type NoteColor } from "@/lib/desk/types";
import { useToastStore } from "@/store/use-toast-store";

const COLORS: { id: NoteColor; label: string; css: string }[] = [
  { id: "none", label: "None", css: "var(--surface-secondary)" }, { id: "yellow", label: "Yellow", css: "var(--tint-butter)" }, { id: "green", label: "Green", css: "var(--tint-mint)" },
  { id: "pink", label: "Pink", css: "var(--tint-rose)" }, { id: "blue", label: "Blue", css: "var(--tint-sky)" },
];

/** Write or edit one note. Used by the Notes tab, by the quick action on every question, and by the Tutor's Notes window, so a note is written the same way everywhere. */
export function NoteEditor({ open, onClose, initial, title = "Note" }: { open: boolean; onClose: () => void; initial?: Partial<Note> & { source?: Note["source"] }; title?: string }) {
  const [t, setT] = useState(""); const [body, setBody] = useState(""); const [tags, setTags] = useState(""); const [color, setColor] = useState<NoteColor>("none"); const [revise, setRevise] = useState(false); const [pin, setPin] = useState(false);
  const existing = useNotes((s) => s.items.find((n) => n.id === initial?.id || (initial?.refId && initial.source && initial.source !== "mine" && n.source === initial.source && n.refId === initial.refId && n.kind === (initial.kind ?? "note"))));
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fills the form each time the window opens
  useEffect(() => { if (!open) return; const n = existing ?? initial; setT(n?.title ?? ""); setBody(n?.body ?? ""); setTags((n?.tags ?? []).join(", ")); setColor(n?.color ?? "none"); setRevise(n?.revise ?? false); setPin(n?.pinned ?? false); }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = () => {
    if (!body.trim() && !t.trim()) return;
    const note = saveNote({ ...(existing ? { id: existing.id } : {}), source: existing?.source ?? initial?.source ?? "mine", refId: existing?.refId ?? initial?.refId, kind: existing?.kind ?? initial?.kind, title: t.trim() || (existing?.title ?? initial?.title ?? ""), body, subject: existing?.subject ?? initial?.subject, topic: existing?.topic ?? initial?.topic, quote: existing?.quote ?? initial?.quote, tags: tags.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 8), color, revise, pinned: pin });
    if (revise) addToRevision({ kind: "note", refId: note.id, source: "note", title: note.title || note.body.slice(0, 80), subject: note.subject, topic: note.topic });
    else { const r = useRevision.getState().items.find((i) => i.id === `note:${note.id}`); if (r && !r.suspended) useRevision.getState().upsert({ ...r, suspended: true, updatedAt: new Date().toISOString() }); }
    useToastStore.getState().show("Note saved", "success"); onClose();
  };
  const del = () => { if (existing) { useNotes.getState().remove(existing.id); useRevision.getState().remove(`note:${existing.id}`); useToastStore.getState().show("Note deleted", "success"); onClose(); } };
  const src = existing?.source ?? initial?.source ?? "mine";
  const field = "mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--tint-sky-ink)]";
  return (
    <DeskModal open={open} onClose={onClose} title={existing ? "Edit note" : title}>
      <div className="space-y-4">
        <p className="text-xs text-[var(--text-secondary)]">From <b className="text-[var(--text-primary)]">{SOURCE_LABEL[src]}</b>{(existing?.subject ?? initial?.subject) ? ` · ${existing?.subject ?? initial?.subject}${(existing?.topic ?? initial?.topic) ? ` · ${existing?.topic ?? initial?.topic}` : ""}` : ""}</p>
        {(existing?.quote ?? initial?.quote) && <blockquote className="rounded-xl border-l-4 border-[var(--tint-butter-ink)] bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-secondary)]">{existing?.quote ?? initial?.quote}</blockquote>}
        <label className="block text-sm font-semibold text-[var(--text-secondary)]">Title<input value={t} onChange={(e) => setT(e.target.value)} maxLength={160} placeholder="A few words to find it again" className={field} /></label>
        <label className="block text-sm font-semibold text-[var(--text-secondary)]">Note<textarea value={body} onChange={(e) => setBody(e.target.value)} rows={7} maxLength={8000} placeholder="What do you want to remember? Markdown and LaTeX work." className={`${field} resize-y leading-relaxed`} autoFocus /></label>
        <label className="block text-sm font-semibold text-[var(--text-secondary)]">Tags (comma separated)<input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="formula, trap, revise before mock" className={field} /></label>
        <div className="flex flex-wrap items-center gap-3">
          <div role="radiogroup" aria-label="Colour" className="flex items-center gap-1.5">{COLORS.map((c) => <button key={c.id} type="button" role="radio" aria-checked={color === c.id} aria-label={c.label} onClick={() => setColor(c.id)} className={`h-7 w-7 cursor-pointer rounded-full border-2 ${color === c.id ? "border-[var(--text-primary)]" : "border-[var(--border)]"}`} style={{ background: c.css }} />)}</div>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--text-primary)]"><input type="checkbox" checked={revise} onChange={(e) => setRevise(e.target.checked)} className="h-4 w-4" /> Revise this note</label>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--text-primary)]"><input type="checkbox" checked={pin} onChange={(e) => setPin(e.target.checked)} className="h-4 w-4" /> Pin</label>
        </div>
        <div className="flex items-center justify-between gap-3 pt-1">
          {existing ? <button type="button" onClick={del} className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-rose-700 hover:bg-[var(--surface-secondary)] dark:text-rose-300"><Trash2 className="h-4 w-4" /> Delete</button> : <span />}
          <div className="flex gap-2"><button type="button" onClick={onClose} className="btn-soft !h-10 !px-4 text-sm">Cancel</button><button type="button" onClick={save} disabled={!body.trim() && !t.trim()} className="btn-main !h-10 !px-5 text-sm disabled:opacity-50">Save note</button></div>
        </div>
      </div>
    </DeskModal>
  );
}
