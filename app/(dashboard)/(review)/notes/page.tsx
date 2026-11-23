"use client";

import { DeskSelect } from "@/components/desk/desk-select";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Filter, NotebookPen, Pin, PinOff, Plus, Repeat, Search, X } from "lucide-react";
import { NoteEditor } from "@/components/desk/note-editor";
import { DeskModal } from "@/components/desk/modal";
import { useNotes, useRevision } from "@/lib/desk/stores";
import { addToRevision, useDeskLoad } from "@/lib/desk/revision";
import { SOURCE_LABEL, SOURCE_TINT, type Note, type NoteSource } from "@/lib/desk/types";
import { studyHrefFor, tutorHref } from "@/lib/desk/links";
import { useStudyStore } from "@/store/use-study-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { useDataStore } from "@/store/use-data-store";

/** One row of the notebook. `live` notes are stored in the desk collection; the others are read from where they were written (a test review, a bookmark, a Study lesson) and edited there. */
type Row = { key: string; source: NoteSource; title: string; body: string; quote?: string; subject?: string; topic?: string; tags: string[]; pinned: boolean; revise: boolean; at: string; href: string; hrefLabel: string; note?: Note; edit?: (text: string) => Promise<void> | void; refId?: string };
type StudyNote = { id: number; lesson: string; quote: string; note: string; color: string; created_at?: string };

const SORTS = [{ id: "recent", label: "Newest" }, { id: "old", label: "Oldest" }, { id: "subject", label: "Subject" }, { id: "source", label: "Source" }] as const;
const GROUPS = [{ id: "none", label: "No grouping" }, { id: "source", label: "Source" }, { id: "subject", label: "Subject" }, { id: "topic", label: "Topic" }] as const;
const short = (t: string, n = 90) => { const s = (t ?? "").replace(/\s+/g, " ").replace(/\[IMAGE_[^\]]*\]/g, "[figure]").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };

function readLocalStudy(): StudyNote[] {
  const out: StudyNote[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i) ?? ""; if (!k.startsWith("renyxera.study.hl.") || k.startsWith("renyxera.study.hl-order.")) continue;
      const lesson = k.slice("renyxera.study.hl.".length);
      (JSON.parse(localStorage.getItem(k) ?? "[]") as { id?: number; quote?: string; note?: string; color?: string }[]).forEach((x, n) => { if (x.quote || x.note) out.push({ id: x.id ?? -(i * 1000 + n + 1), lesson, quote: x.quote ?? "", note: x.note ?? "", color: x.color ?? "yellow" }); });
    }
  } catch { /* private mode */ }
  return out;
}

export default function NotesPage() {
  useDeskLoad();
  const notes = useNotes((s) => s.items); const loadedNotes = useNotes((s) => s.loaded);
  const { mistakes, bookmarks, loadStudyData, updateMistakeNotes, updateBookmarkNotes } = useStudyStore();
  const { isInitialized } = useDataStore();
  const [study, setStudy] = useState<StudyNote[]>([]);
  const [q, setQ] = useState(""); const [src, setSrc] = useState<NoteSource | "all">("all"); const [subject, setSubject] = useState("all"); const [tag, setTag] = useState("");
  const [onlyRevise, setOnlyRevise] = useState(false); const [onlyPinned, setOnlyPinned] = useState(false);
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("recent"); const [group, setGroup] = useState<(typeof GROUPS)[number]["id"]>("none");
  const [editor, setEditor] = useState<Partial<Note> | null>(null); const [quick, setQuick] = useState<Row | null>(null); const [quickText, setQuickText] = useState("");
  const [filters, setFilters] = useState(false);

  useEffect(() => { void useNotes.getState().load(); void loadStudyData(); }, [loadStudyData]);
  const loadStudy = useCallback(async () => {
    try { const r = await fetch("/api/study/notes", { cache: "no-store" }); if (r.ok) { setStudy(((await r.json()) as { notes: StudyNote[] }).notes ?? []); return; } } catch { /* offline */ }
    setStudy(readLocalStudy());
  }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the Study highlights once after mount
  useEffect(() => { void loadStudy(); }, [loadStudy]);

  const rows: Row[] = useMemo(() => {
    const out: Row[] = [];
    notes.forEach((n) => out.push({ key: `d:${n.id}`, source: n.source, title: n.title, body: n.body, quote: n.quote, subject: n.subject, topic: n.topic, tags: n.tags, pinned: n.pinned, revise: n.revise, at: n.updatedAt, note: n, refId: n.refId,
      href: n.refId && n.source !== "study" && n.source !== "mine" && n.source !== "mentor" ? tutorHref(n.refId) : n.source === "study" ? studyHrefFor(n.refId) : "", hrefLabel: n.refId && n.source !== "study" ? "Teach me" : "Open lesson" }));
    mistakes.forEach((m) => { if (m.notes?.trim()) { const qq = isInitialized ? QuestionRepository.getQuestionById(m.questionId) : undefined; out.push({ key: `m:${m.questionId}`, source: "test", title: short(qq?.questionTextRaw ?? "", 70) || `${m.subject}: ${m.topic}`, body: m.notes, subject: m.subject, topic: m.topic, tags: [], pinned: false, revise: false, at: m.lastReviewed ?? m.firstSeen ?? "", href: tutorHref(m.questionId), hrefLabel: "Teach me", refId: m.questionId, edit: (t) => updateMistakeNotes(m.questionId, t) }); } });
    const tutorRefs = new Set(notes.filter((x) => x.source === "tutor" && x.kind === "note" && x.refId).map((x) => x.refId)); // a Tutor note is also stored as a bookmark note; show it once, as a Tutor note
    bookmarks.forEach((b) => { if (b.notes?.trim() && !tutorRefs.has(b.questionId)) { const qq = isInitialized ? QuestionRepository.getQuestionById(b.questionId) : undefined; out.push({ key: `b:${b.questionId}`, source: "bookmark", title: short(qq?.questionTextRaw ?? "", 70) || `${b.subject}: ${b.topic}`, body: b.notes, subject: b.subject, topic: b.topic, tags: [], pinned: false, revise: false, at: b.createdAt, href: tutorHref(b.questionId), hrefLabel: "Teach me", refId: b.questionId, edit: (t) => updateBookmarkNotes(b.questionId, t) }); } });
    study.forEach((s) => { const name = s.lesson.includes(":") ? s.lesson.split(":").slice(1).join(":").trim() : s.lesson; out.push({ key: `s:${s.id}`, source: "study", title: name, body: s.note, quote: s.quote, subject: s.lesson.split(":")[0]?.trim(), topic: name, tags: [], pinned: false, revise: false, at: s.created_at ?? "", href: studyHrefFor(name, s.lesson), hrefLabel: "Open lesson", edit: async (t) => { await fetch("/api/study/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: s.id, note: t }) }).catch(() => null); void loadStudy(); } }); });
    return out;
  }, [notes, mistakes, bookmarks, study, isInitialized, updateMistakeNotes, updateBookmarkNotes, loadStudy]);

  const counts = useMemo(() => { const c: Record<string, number> = { all: rows.length }; rows.forEach((r) => { c[r.source] = (c[r.source] ?? 0) + 1; }); return c; }, [rows]);
  const subjects = useMemo(() => [...new Set(rows.map((r) => r.subject).filter(Boolean) as string[])].sort(), [rows]);
  const tags = useMemo(() => [...new Set(rows.flatMap((r) => r.tags))].sort().slice(0, 24), [rows]);
  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    const f = rows.filter((r) => (src === "all" || r.source === src) && (subject === "all" || r.subject === subject) && (!tag || r.tags.includes(tag)) && (!onlyRevise || r.revise) && (!onlyPinned || r.pinned)
      && (!term || `${r.title} ${r.body} ${r.quote ?? ""} ${r.topic ?? ""} ${r.tags.join(" ")}`.toLowerCase().includes(term)));
    const by = { recent: (a: Row, b: Row) => (a.at < b.at ? 1 : -1), old: (a: Row, b: Row) => (a.at < b.at ? -1 : 1), subject: (a: Row, b: Row) => (a.subject ?? "").localeCompare(b.subject ?? ""), source: (a: Row, b: Row) => a.source.localeCompare(b.source) }[sort];
    return [...f].sort((a, b) => (a.pinned === b.pinned ? by(a, b) : a.pinned ? -1 : 1));
  }, [rows, q, src, subject, tag, onlyRevise, onlyPinned, sort]);
  const grouped = useMemo(() => {
    if (group === "none") return [{ h: "", items: shown }];
    const m = new Map<string, Row[]>(); shown.forEach((r) => { const k = group === "source" ? SOURCE_LABEL[r.source] : group === "subject" ? r.subject ?? "General" : r.topic ?? "General"; (m.get(k) ?? m.set(k, []).get(k)!).push(r); });
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([h, items]) => ({ h, items }));
  }, [shown, group]);

  const edit = (r: Row) => { if (r.note) setEditor(r.note); else if (r.edit) { setQuick(r); setQuickText(r.body); } };
  const togglePin = (r: Row) => { if (r.note) useNotes.getState().upsert({ ...r.note, pinned: !r.note.pinned, updatedAt: new Date().toISOString() }); };
  const reviseAll = () => { let n = 0; shown.forEach((r) => { if (r.note) { if (addToRevision({ kind: "note", refId: r.note.id, source: "note", title: r.note.title || r.note.body.slice(0, 80), subject: r.note.subject, topic: r.note.topic })) n += 1; useNotes.getState().upsert({ ...r.note, revise: true, updatedAt: new Date().toISOString() }); } else if (r.refId) { if (addToRevision({ kind: "question", refId: r.refId, source: r.source, title: r.title, subject: r.subject, topic: r.topic })) n += 1; } }); void n; };
  const inRev = useRevision((s) => s.items);
  const reviseOne = (r: Row) => { if (r.note) { addToRevision({ kind: "note", refId: r.note.id, source: "note", title: r.note.title || r.note.body.slice(0, 80), subject: r.note.subject, topic: r.note.topic }); useNotes.getState().upsert({ ...r.note, revise: true, updatedAt: new Date().toISOString() }); } else if (r.refId) addToRevision({ kind: "question", refId: r.refId, source: r.source, title: r.title, subject: r.subject, topic: r.topic }); };

  const rail = (
    <div className="space-y-5">
      <div><p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">Source</p>
        <ul className="space-y-0.5">{(["all", "study", "test", "bookmark", "tutor", "mentor", "mine"] as const).map((s) => (
          <li key={s}><button type="button" aria-pressed={src === s} onClick={() => setSrc(s)} className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold ${src === s ? "bg-[var(--tint-sky)] text-[var(--tint-sky-ink)] shadow-[inset_0_0_0_1.5px_var(--tint-sky-ink)]" : "text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"}`}>
            <span className="flex items-center gap-2">{s !== "all" && <span className="h-2.5 w-2.5 rounded-full" style={{ background: `var(--tint-${SOURCE_TINT[s]}-ink)` }} />}{s === "all" ? "Everything" : SOURCE_LABEL[s]}</span><span className="font-num text-xs opacity-80">{counts[s] ?? 0}</span></button></li>))}</ul></div>
      <div><p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">Subject</p>
        <DeskSelect label="Subject" value={subject} options={[{ id: "all", label: "All subjects" }, ...subjects.map((s) => ({ id: s, label: s }))]} onChange={setSubject} /></div>
      {tags.length > 0 && <div><p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">Tags</p><div className="flex flex-wrap gap-1.5">{tags.map((t) => <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(tag === t ? "" : t)} className={tag === t ? "pill-ink" : "pill-soft"}>{t}</button>)}</div></div>}
      <div className="space-y-2"><label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--text-primary)]"><input type="checkbox" checked={onlyRevise} onChange={(e) => setOnlyRevise(e.target.checked)} className="h-4 w-4" /> Marked for revision</label>
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-[var(--text-primary)]"><input type="checkbox" checked={onlyPinned} onChange={(e) => setOnlyPinned(e.target.checked)} className="h-4 w-4" /> Pinned only</label></div>
    </div>
  );

  return (
    <div className="flex min-h-0 w-full gap-4" data-fill-height>
      <aside aria-label="Filter notes" className="custom-scrollbar hidden w-64 shrink-0 overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 lg:block">{rail}</aside>
      <section className="flex min-w-0 flex-1 flex-col" aria-label="Notes">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <label className="flex h-10 min-w-[12rem] flex-1 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 focus-within:border-[var(--tint-sky-ink)]"><Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your notes" aria-label="Search notes" className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" /></label>
          <button type="button" onClick={() => setFilters(true)} className="btn-soft !h-10 !px-3 text-sm lg:hidden" aria-label="Filters"><Filter className="h-4 w-4" /> Filters</button>
          <DeskSelect label="Group by" prefix="Group: " value={group} options={GROUPS.map((g) => ({ id: g.id, label: g.id === "none" ? "none" : g.label }))} onChange={(v) => setGroup(v as typeof group)} className="w-44" />
          <DeskSelect label="Sort by" prefix="Sort: " value={sort} options={SORTS.map((s) => ({ id: s.id, label: s.label }))} onChange={(v) => setSort(v as typeof sort)} className="w-44" align="right" />
          <button type="button" onClick={reviseAll} disabled={!shown.length} className="btn-soft !h-10 !px-3 text-sm disabled:opacity-50" title="Add what is shown to your revision queue"><Repeat className="h-4 w-4" /> Revise these</button>
          <button type="button" onClick={() => setEditor({ source: "mine" })} className="btn-main !h-10 !px-4 text-sm"><Plus className="h-4 w-4" /> New note</button>
        </div>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto pb-6 pr-1">
          {!loadedNotes && rows.length === 0 ? <p className="p-6 text-sm text-[var(--text-secondary)]">Loading your notes…</p>
            : shown.length === 0 ? (
              <div className="mx-auto mt-10 max-w-md rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-8 text-center">
                <NotebookPen className="mx-auto h-8 w-8 text-[var(--text-secondary)]" aria-hidden />
                <p className="mt-3 font-display text-lg font-extrabold text-[var(--text-primary)]">{rows.length ? "No note matches these filters" : "Your notebook is empty"}</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{rows.length ? "Clear a filter to see more." : "Highlights from Study, notes on test questions and bookmarks, and notes from the Tutor all land here. Start with one of your own."}</p>
                {!rows.length && <button type="button" onClick={() => setEditor({ source: "mine" })} className="btn-main mt-4"><Plus className="h-4 w-4" /> Write a note</button>}
              </div>
            ) : grouped.map((g) => (
              <div key={g.h || "all"} className="mb-5">
                {g.h && <h2 className="mb-2 px-1 text-sm font-extrabold text-[var(--text-primary)]">{g.h} <span className="font-num text-xs font-semibold text-[var(--text-muted)]">{g.items.length}</span></h2>}
                <ul className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                  {g.items.map((r) => {
                    const tint = SOURCE_TINT[r.source]; const rev = r.note ? r.note.revise : !!r.refId && inRev.some((i) => i.id === `question:${r.refId}` && !i.suspended);
                    return (
                      <li key={r.key} className="flex min-w-0 flex-col [overflow-wrap:anywhere] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4" style={{ borderTop: `3px solid var(--tint-${tint}-ink)` }}>
                        <div className="flex items-center gap-2"><span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ background: `var(--tint-${tint})`, color: `var(--tint-${tint}-ink)` }}>{SOURCE_LABEL[r.source]}</span>
                          {rev && <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--text-secondary)]"><Repeat className="h-3 w-3" aria-hidden /> Revising</span>}
                          <span className="ml-auto flex items-center gap-0.5">{r.note && <button type="button" onClick={() => togglePin(r)} aria-label={r.pinned ? "Unpin" : "Pin"} title={r.pinned ? "Unpin" : "Pin"} className="grid h-8 w-8 cursor-pointer place-items-center rounded-full text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]">{r.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}</button>}</span></div>
                        {r.title && <h3 className="mt-2 line-clamp-2 text-sm font-extrabold text-[var(--text-primary)]">{r.title}</h3>}
                        {r.quote && <p className="mt-1.5 line-clamp-2 border-l-2 border-[var(--border)] pl-2 text-xs italic text-[var(--text-secondary)]">{r.quote}</p>}
                        {r.body && <p className="mt-1.5 line-clamp-5 whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-primary)]">{r.body}</p>}
                        {(r.subject || r.tags.length > 0) && <p className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-[var(--text-secondary)]">{r.subject && <span>{r.subject}{r.topic && r.topic !== r.title ? ` · ${r.topic}` : ""}</span>}{r.tags.map((t) => <span key={t} className="rounded-full bg-[var(--surface-secondary)] px-2 py-0.5 font-semibold">#{t}</span>)}</p>}
                        <div className="mt-auto flex items-center gap-2 pt-3">
                          {(r.note || r.edit) && <button type="button" onClick={() => edit(r)} className="pill-soft cursor-pointer text-xs">Edit</button>}
                          {!rev && (r.note || r.refId) && r.source !== "study" && <button type="button" onClick={() => reviseOne(r)} className="pill-soft cursor-pointer text-xs">Revise</button>}
                          {r.href && <Link href={r.href} className="pill-soft text-xs">{r.hrefLabel}</Link>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>
      </section>

      <DeskModal open={filters} onClose={() => setFilters(false)} title="Filter notes">{rail}</DeskModal>
      <NoteEditor open={!!editor} onClose={() => setEditor(null)} initial={editor ?? undefined} title="New note" />
      <DeskModal open={!!quick} onClose={() => setQuick(null)} title={quick ? `Edit note · ${SOURCE_LABEL[quick.source]}` : "Edit note"}>
        <textarea value={quickText} onChange={(e) => setQuickText(e.target.value)} rows={8} className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm leading-relaxed text-[var(--text-primary)] outline-none focus:border-[var(--tint-sky-ink)]" aria-label="Note text" />
        <div className="mt-3 flex justify-end gap-2"><button type="button" onClick={() => setQuick(null)} className="btn-soft !h-10 !px-4 text-sm"><X className="h-4 w-4" /> Cancel</button><button type="button" onClick={async () => { await quick?.edit?.(quickText); setQuick(null); }} className="btn-main !h-10 !px-5 text-sm">Save</button></div>
      </DeskModal>
    </div>
  );
}
