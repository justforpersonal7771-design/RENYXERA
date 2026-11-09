"use client";

/** Notebook: every highlight and note you made across all books, grouped by book and lesson, searchable, editable, exportable. */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Copy, NotebookPen, Search, Trash2 } from "lucide-react";
import { useIvLibrary } from "@/components/interview/use-iv-library";
import { HL_COLORS, type HlColor } from "@/components/interview/iv-highlights";

type Note = { id: number; doc_id: string; quote: string; note: string; color: HlColor; created_at: string };
const SWATCH: Record<HlColor, string> = { yellow: "#facc15", green: "#4ade80", pink: "#f472b6", blue: "#60a5fa" };

export default function NotebookPage() {
  const { docs } = useIvLibrary();
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [q, setQ] = useState("");
  const [color, setColor] = useState<HlColor | "all">("all");
  const [copied, setCopied] = useState(false);
  useEffect(() => { void fetch("/api/interview/notes", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { notes: Note[] } | null) => setNotes(d?.notes ?? [])); }, []);

  const title = (id: string) => docs.find((d) => d.id === id);
  const shown = useMemo(() => (notes ?? []).filter((n) => (color === "all" || n.color === color) && (!q.trim() || (n.quote + " " + n.note).toLowerCase().includes(q.toLowerCase()))), [notes, q, color]);
  const groups = useMemo(() => { const m = new Map<string, Note[]>(); for (const n of shown) m.set(n.doc_id, [...(m.get(n.doc_id) ?? []), n]); return [...m.entries()].sort((a, b) => (title(a[0])?.book_title ?? "").localeCompare(title(b[0])?.book_title ?? "")); }, [shown, docs]); // eslint-disable-line react-hooks/exhaustive-deps
  const save = (n: Note, note: string) => { setNotes((x) => (x ?? []).map((y) => (y.id === n.id ? { ...y, note } : y))); void fetch("/api/interview/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: n.id, note }) }); };
  const del = (n: Note) => { setNotes((x) => (x ?? []).filter((y) => y.id !== n.id)); void fetch(`/api/interview/notes?id=${n.id}`, { method: "DELETE" }); };
  const exportMd = async () => {
    const md = groups.map(([id, ns]) => `## ${title(id)?.book_title ?? ""}: ${title(id)?.title ?? id}\n\n` + ns.map((n) => `> ${n.quote}\n${n.note ? `\n${n.note}\n` : ""}`).join("\n")).join("\n");
    try { await navigator.clipboard.writeText(md); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* clipboard blocked */ }
  };

  return (
    <div className="space-y-5">
      <section className="card-pastel flex flex-wrap items-center gap-3 p-5" data-tint="butter" aria-label="Notebook">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--surface)]"><NotebookPen className="h-5 w-5" /></span>
        <div className="mr-auto"><h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Notebook</h1><p className="text-sm text-[var(--text-secondary)]">{notes ? `${notes.length} highlights and notes` : "Loading…"}</p></div>
        <label className="relative"><Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your notes" aria-label="Search your notes" className="h-10 w-56 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm outline-none" /></label>
        <div className="flex gap-1.5" role="group" aria-label="Colour">{(["all", ...HL_COLORS] as const).map((c) => <button key={c} type="button" onClick={() => setColor(c)} aria-pressed={color === c} aria-label={c === "all" ? "All colours" : c} className={`h-8 min-w-8 rounded-full border-2 px-2 text-xs font-bold ${color === c ? "border-[var(--ink)]" : "border-transparent"}`} style={c === "all" ? undefined : { background: SWATCH[c] }}>{c === "all" ? "All" : ""}</button>)}</div>
        <button type="button" onClick={() => void exportMd()} className="pill-soft"><Copy className="h-4 w-4" />{copied ? "Copied" : "Copy as Markdown"}</button>
      </section>
      {notes && groups.length === 0 && <p className="text-[var(--text-secondary)]">{notes.length ? "No notes match." : "Nothing yet. Open a lesson, select some text and choose a colour."}</p>}
      {groups.map(([id, ns]) => (
        <section key={id} className="card-pastel p-5" data-tint="sky" aria-label={title(id)?.title}>
          <Link href={`/interview/read?doc=${encodeURIComponent(id)}`} className="block"><p className="text-xs font-bold text-[var(--text-muted)]">{title(id)?.book_title ?? id.split(":")[0]}</p><h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">{title(id)?.title ?? "Lesson"}</h2></Link>
          <ul className="mt-3 space-y-3">{ns.map((n) => (
            <li key={n.id} className="rounded-2xl bg-[var(--surface)] p-4">
              <p className="text-[15px] leading-relaxed" style={{ borderLeft: `5px solid ${SWATCH[n.color]}`, paddingLeft: 10 }}>{n.quote}</p>
              <textarea defaultValue={n.note} onBlur={(e) => { if (e.target.value !== n.note) save(n, e.target.value); }} rows={2} placeholder="Add a note…" aria-label="Note" className="mt-3 w-full resize-y rounded-xl border border-[var(--border)] bg-transparent px-3 py-2 text-sm outline-none" />
              <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-muted)]"><span>{new Date(n.created_at).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" })}</span><span className="flex gap-3"><Link href={`/interview/read?doc=${encodeURIComponent(id)}`} className="font-bold text-[var(--text-secondary)]">Open lesson</Link><button type="button" onClick={() => del(n)} aria-label="Delete" className="-m-2 grid h-10 w-10 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><Trash2 className="h-4 w-4" /></button></span></div>
            </li>))}</ul>
        </section>
      ))}
    </div>
  );
}
