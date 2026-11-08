"use client";

/** Reader for the interview books: pick a book, read a chapter, mark it done. Progress is saved to your account. */
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import { AIResponseParser } from "@/lib/ai/ai-response-parser";
import { InterviewGate, ivPost, type IvDoc } from "@/components/interview/interview-gate";

type Full = IvDoc & { body: string };
const KIND = { chapter: "Chapters", revision: "Revision", traps: "Traps", glossary: "Glossary", snippets: "Snippets" } as Record<string, string>;

function Reader() {
  const router = useRouter();
  const sp = useSearchParams();
  const [docs, setDocs] = useState<IvDoc[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Full | null>(null);
  const [starOnly, setStarOnly] = useState(false);
  const id = sp.get("doc");
  const book = sp.get("book") ?? "";

  useEffect(() => {
    void fetch("/api/interview/docs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { docs: IvDoc[]; progress: { doc_id: string; status: string }[] } | null) => {
      if (!d) return; setDocs(d.docs.filter((x) => x.kind !== "lab")); setDone(new Set(d.progress.filter((p) => p.status === "done").map((p) => p.doc_id)));
    });
  }, []);
  useEffect(() => {
    setOpen(null); if (!id) return;
    void fetch(`/api/interview/docs?id=${encodeURIComponent(id)}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: Full | null) => { if (d) { setOpen(d); void ivPost({ doc: { id, status: "reading" } }); window.scrollTo?.({ top: 0 }); } });
  }, [id]);

  const books = useMemo(() => [...new Map(docs.map((d) => [d.book, d.book_title])).entries()], [docs]);
  const inBook = useMemo(() => docs.filter((d) => d.book === book && (!starOnly || d.meta?.star || d.kind !== "chapter")), [docs, book, starOnly]);
  const idx = inBook.findIndex((d) => d.id === id);
  const nodes = useMemo(() => (open ? AIResponseParser.parse(open.body) : []), [open]);
  const go = (d?: IvDoc) => d && router.push(`/interview/read?book=${encodeURIComponent(d.book)}&doc=${encodeURIComponent(d.id)}`);
  const mark = () => { if (!open) return; setDone((s) => new Set(s).add(open.id)); void ivPost({ doc: { id: open.id, status: "done" } }); };

  return (
    <div className="grid w-full gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="card-pastel max-h-[calc(100vh-190px)] overflow-y-auto p-3" data-tint="sky" aria-label="Books">
        {!book ? (
          <ul className="space-y-1">{books.map(([b, t]) => { const all = docs.filter((d) => d.book === b); const n = all.filter((d) => done.has(d.id)).length; return (
            <li key={b}><button type="button" onClick={() => router.push(`/interview/read?book=${encodeURIComponent(b)}`)} className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-bold hover:bg-[var(--surface)]/70"><span className="min-w-0 truncate">{t}</span><span className="font-num shrink-0 text-xs text-[var(--text-secondary)]">{n}/{all.length}</span></button></li>); })}</ul>
        ) : (
          <>
            <button type="button" onClick={() => router.push("/interview/read")} className="mb-2 flex cursor-pointer items-center gap-1 text-sm font-bold text-[var(--text-secondary)]"><ChevronLeft className="h-4 w-4" />All books</button>
            <p className="px-1 pb-2 text-sm font-extrabold">{books.find((b) => b[0] === book)?.[1]}</p>
            <label className="mb-2 flex items-center gap-2 px-1 text-xs font-semibold"><input type="checkbox" checked={starOnly} onChange={(e) => setStarOnly(e.target.checked)} />Short path only</label>
            <ul className="space-y-0.5">{inBook.map((d) => (
              <li key={d.id}><button type="button" onClick={() => go(d)} aria-current={d.id === id ? "page" : undefined} className={`flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${d.id === id ? "bg-[var(--surface)] font-extrabold shadow-sm" : "hover:bg-[var(--surface)]/60"}`}>
                {done.has(d.id) ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <span className="h-4 w-4 shrink-0" />}<span className="min-w-0 flex-1 truncate">{d.title}</span>{d.meta?.star && <Star className="h-3.5 w-3.5 shrink-0 text-amber-500" />}</button></li>))}</ul>
          </>
        )}
      </aside>
      <article className="card-pastel min-w-0 p-5 sm:p-7" data-tint="lilac">
        {!open ? <p className="text-[var(--text-secondary)]">{book ? "Pick a chapter on the left." : "Pick a book on the left."}</p> : (
          <>
            <p className="text-xs font-bold text-[var(--text-secondary)]">{open.book_title} · {KIND[open.kind] ?? open.kind}{open.meta?.minutes ? ` · ${open.meta.minutes} min` : ""}</p>
            <h1 className="mb-4 font-display text-2xl font-extrabold text-[var(--text-primary)]">{open.title}</h1>
            <div className="mentor-rich leading-relaxed"><AstNodeRenderer nodes={nodes} chat /></div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <button type="button" disabled={idx <= 0} onClick={() => go(inBook[idx - 1])} className="btn-soft !h-10 text-sm disabled:opacity-40"><ChevronLeft className="h-4 w-4" />Previous</button>
              <button type="button" onClick={mark} className="btn-main !h-10 text-sm"><Check className="h-4 w-4" />{done.has(open.id) ? "Marked done" : "Mark as done"}</button>
              <button type="button" disabled={idx < 0 || idx >= inBook.length - 1} onClick={() => { mark(); go(inBook[idx + 1]); }} className="btn-soft !h-10 text-sm disabled:opacity-40">Done, next<ChevronRight className="h-4 w-4" /></button>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
export default function ReadPage() { return <InterviewGate><Suspense fallback={null}><Reader /></Suspense></InterviewGate>; }
