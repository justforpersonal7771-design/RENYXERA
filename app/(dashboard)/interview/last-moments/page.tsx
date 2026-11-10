"use client";

/**
 * Last moments: the night-before pack, on one page. Every book's final revision sheet, trap list, code snippets and glossary, filtered by track,
 * readable top to bottom (each book folds open and shut), printable, with the three PDF packs as downloads when they have been uploaded.
 */
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Printer, Timer } from "lucide-react";
import { IvMarkdown } from "@/components/interview/iv-markdown";
import { TRACKS, trackOf } from "@/lib/interview/tracks";

const KINDS = [
  { id: "revision", label: "Revision sheets", blurb: "Each book on one page: what you must be able to say in two minutes.", pack: "last-moments" },
  { id: "traps", label: "Traps", blurb: "The mistakes interviewers wait for, and how to avoid them.", pack: "traps" },
  { id: "snippets", label: "Snippets", blurb: "The key code to recall from memory.", pack: "snippets" },
  { id: "glossary", label: "Glossary", blurb: "Every term in one line.", pack: "" },
] as const;
type Doc = { id: string; book: string; book_title: string; title: string; body: string };

function LastMoments() {
  const sp = useSearchParams();
  const router = useRouter();
  const kind = (KINDS.find((k) => k.id === sp.get("kind")) ?? KINDS[0]);
  const track = TRACKS.find((t) => t.id === sp.get("track"))?.id ?? "all";
  const [docs, setDocs] = useState<Doc[] | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [packs, setPacks] = useState<string[]>([]);
  const set = (k: string, t: string) => router.replace(`/interview/last-moments?kind=${k}&track=${t}`);

  useEffect(() => { void fetch("/api/interview/pack?list=1", { cache: "no-store" }).then((r) => (r.ok ? r.json() : { available: [] })).then((d: { available: string[] }) => setPacks(d.available ?? [])); }, []);
  useEffect(() => {
    let off = false;
    const books = track === "all" ? "" : (TRACKS.find((t) => t.id === track)?.books ?? []).join(",");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the loading state while a new filter loads
    setDocs(null);
    void fetch(`/api/interview/docs?kind=${kind.id}${books ? `&books=${encodeURIComponent(books)}` : ""}`, { cache: "no-store" }).then((r) => (r.ok ? r.json() : { docs: [] }))
      .then((d: { docs: Doc[] }) => { if (off) return; const order = TRACKS.flatMap((t) => t.books); const list = [...d.docs].sort((a, b) => order.indexOf(a.book) - order.indexOf(b.book)); setDocs(list); setOpen(new Set(list.slice(0, 1).map((x) => x.id))); });
    return () => { off = true; };
  }, [kind.id, track]);

  const all = useMemo(() => (docs ?? []).map((d) => d.id), [docs]);
  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allOpen = docs && open.size >= docs.length;

  return (
    <div className="space-y-6">
      <section className="card-pastel p-6 sm:p-8" data-tint="butter" aria-label="Last moments">
        <span className="section-label"><Timer className="h-3.5 w-3.5" /> Last moments</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] text-[var(--text-primary)] sm:text-4xl">The night-before pack.</h1>
        <p className="mt-2 max-w-2xl text-[var(--text-secondary)]">Everything you must not forget, from all 27 books, in one place. Pick what to revise, pick a track, then read top to bottom. Short on time? Start with the revision sheets.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/interview-cards?cram=1" className="btn-main !h-10 text-sm">10-minute cram: due and starred cards</Link>
          <button type="button" onClick={() => window.print()} className="pill-soft"><Printer className="h-4 w-4" />Print this page</button>
          {packs.map((p) => <a key={p} href={`/api/interview/pack?name=${p}`} className="pill-soft"><Download className="h-4 w-4" />{p === "last-moments" ? "Last-moments pack (PDF)" : p === "traps" ? "Traps list (PDF)" : "Snippet book (PDF)"}</a>)}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-[var(--surface)] p-1" role="tablist" aria-label="What to revise">
          {KINDS.map((k) => <button key={k.id} type="button" role="tab" aria-selected={kind.id === k.id} onClick={() => set(k.id, track)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${kind.id === k.id ? "bg-[var(--ink)] text-[var(--background)]" : "text-[var(--text-secondary)]"}`}>{k.label}</button>)}
        </div>
        <p className="text-sm text-[var(--text-secondary)]">{kind.blurb}</p>
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Track">
        {[{ id: "all", title: "All tracks" }, ...TRACKS].map((t) => <button key={t.id} type="button" aria-pressed={track === t.id} onClick={() => set(kind.id, t.id)} className={`rounded-full border px-3.5 py-1 text-[13px] font-bold ${track === t.id ? "border-[var(--ink)] bg-[var(--surface)] text-[var(--text-primary)]" : "border-transparent bg-[var(--surface-secondary)] text-[var(--text-secondary)]"}`}>{t.title}</button>)}
      </div>

      {docs === null ? <div className="skeleton-shimmer h-64 rounded-3xl" aria-hidden /> : docs.length === 0 ? <p className="text-[var(--text-secondary)]">Nothing here for that track.</p> : (
        <>
          <div className="flex items-center justify-between"><p className="text-sm font-bold text-[var(--text-secondary)]">{docs.length} {docs.length === 1 ? "book" : "books"}</p><button type="button" onClick={() => setOpen(allOpen ? new Set() : new Set(all))} className="pill-soft text-sm">{allOpen ? "Fold all" : "Open all"}</button></div>
          <ul className="space-y-3">
            {docs.map((d) => {
              const t = trackOf(d.book), isOpen = open.has(d.id);
              return (
                <li key={d.id}>
                  <section className="card-pastel overflow-hidden" data-tint={t.tint}>
                    <button type="button" onClick={() => toggle(d.id)} aria-expanded={isOpen} className="flex w-full cursor-pointer items-center justify-between gap-3 p-4 text-left sm:p-5">
                      <span className="min-w-0"><span className="block text-xs font-bold text-[var(--text-secondary)]">{t.title}</span><span className="block truncate font-display text-lg font-extrabold text-[var(--text-primary)]">{d.book_title}</span></span>
                      <span className="shrink-0 text-sm font-bold text-[var(--text-secondary)]">{isOpen ? "Fold" : "Open"}</span>
                    </button>
                    {isOpen && <div className="border-t border-[var(--border)] bg-[var(--surface)]/60 p-4 sm:p-6"><IvMarkdown body={d.body} /><Link href={`/interview/read?book=${encodeURIComponent(d.book)}`} className="pill-soft mt-5 inline-flex">Open the whole book</Link></div>}
                  </section>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
export default function LastMomentsPage() { return <Suspense fallback={null}><LastMoments /></Suspense>; }
