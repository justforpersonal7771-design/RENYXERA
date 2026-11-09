"use client";

/**
 * Your progress and your mistakes on ONE screen (no page scroll on desktop): reading per book on the left, practice success and the
 * mistakes list on the right. The long lists scroll inside their own cards.
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InterviewGate, type IvDoc } from "@/components/interview/interview-gate";
import { TRACKS, trackOf } from "@/lib/interview/tracks";

type Att = { item_kind: string; item_id: string; ok: boolean; detail: { err?: string; note?: string }; created_at: string };
const KIND = { lab: "Book labs", sql: "SQL", code: "Free code runs", card: "Flashcards", mock: "Mock interview" } as Record<string, string>;
const KIND_ORDER = ["card", "mock", "sql", "lab", "code"];
const HREF = (a: { kind: string; id: string }) => (a.kind === "sql" ? "/interview/sql" : a.kind === "card" ? `/interview-cards?book=${encodeURIComponent(a.id.split(":")[0])}` : a.kind === "mock" ? "/interview/tutor?mode=mock" : "/interview/lab");
const GREEN = "#16a34a";

function Progress() {
  const [docs, setDocs] = useState<IvDoc[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [att, setAtt] = useState<Att[] | null>(null);
  useEffect(() => {
    void fetch("/api/interview/docs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { docs: IvDoc[]; progress: { doc_id: string; status: string }[] } | null) => { if (d) { setDocs(d.docs.filter((x) => x.kind !== "lab")); setDone(new Set(d.progress.filter((p) => p.status === "done").map((p) => p.doc_id))); } });
    void fetch("/api/interview/progress", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { attempts: Att[] } | null) => setAtt(d?.attempts ?? []));
  }, []);

  // reading, grouped by track so 27 books stay readable
  const byTrack = useMemo(() => {
    const m = new Map<string, { id: string; title: string; books: Map<string, { t: string; n: number; d: number }> }>();
    for (const x of docs) {
      const tr = trackOf(x.book), g = m.get(tr.id) ?? { id: tr.id, title: tr.title, books: new Map() };
      const e = g.books.get(x.book) ?? { t: x.book_title, n: 0, d: 0 }; e.n++; if (done.has(x.id)) e.d++; g.books.set(x.book, e); m.set(tr.id, g);
    }
    return [...TRACKS.map((t) => m.get(t.id)).filter(Boolean), ...(m.has("more") ? [m.get("more")] : [])] as { id: string; title: string; books: Map<string, { t: string; n: number; d: number }> }[];
  }, [docs, done]);
  const total = docs.length, read = docs.filter((d) => done.has(d.id)).length;

  const kinds = useMemo(() => {
    const m = new Map<string, { n: number; ok: number }>(KIND_ORDER.map((k) => [k, { n: 0, ok: 0 }]));
    for (const a of att ?? []) { const e = m.get(a.item_kind) ?? { n: 0, ok: 0 }; e.n++; if (a.ok) e.ok++; m.set(a.item_kind, e); }
    return [...m.entries()];
  }, [att]);
  const tries = (att ?? []).length, passed = (att ?? []).filter((a) => a.ok).length;
  const mistakes = useMemo(() => {
    const m = new Map<string, { kind: string; id: string; fails: number; tries: number; why: string; solved: boolean }>();
    for (const a of [...(att ?? [])].reverse()) { const k = a.item_kind + ":" + a.item_id; const e = m.get(k) ?? { kind: a.item_kind, id: a.item_id, fails: 0, tries: 0, why: "", solved: false }; e.tries++; if (!a.ok) { e.fails++; e.why = a.detail?.err || a.detail?.note || e.why; } e.solved = a.ok; m.set(k, e); }
    return [...m.values()].filter((e) => e.fails > 0 && !e.id.startsWith("free:")).sort((a, b) => Number(a.solved) - Number(b.solved) || b.fails - a.fails);
  }, [att]);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 lg:h-[calc(100dvh-18.5rem)] lg:min-h-[380px]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="font-display text-2xl font-extrabold text-[var(--text-primary)]">Progress and mistakes</h1>
        <p className="text-sm font-bold text-[var(--text-secondary)]"><span className="font-num">{read}</span> of {total} lessons read · <span className="font-num">{tries}</span> tries · <span className="font-num">{mistakes.filter((m) => !m.solved).length}</span> to fix</p>
      </div>
      <div className="grid min-h-0 min-w-0 flex-1 gap-4 lg:grid-cols-2 [&>*]:min-h-0 [&>*]:min-w-0">
        <section className="card-pastel flex flex-col p-5" data-tint="sky" aria-label="Reading">
          <h2 className="mb-3 shrink-0 text-sm font-extrabold">Reading by book</h2>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain pr-2">
            {byTrack.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">Loading…</p> : byTrack.map((g) => (
              <div key={g.id}>
                <Link href={`/interview/read?track=${g.id}`} className="text-xs font-extrabold text-[var(--text-secondary)] hover:underline">{g.title}</Link>
                <div className="mt-1.5 space-y-2.5">{[...g.books.entries()].map(([b, e]) => (
                  <Link key={b} href={`/interview/read?book=${encodeURIComponent(b)}`} className="block">
                    <div className="flex justify-between gap-3 text-sm"><span className="min-w-0 truncate font-semibold">{e.t}</span><span className="font-num shrink-0 text-[var(--text-secondary)]">{e.d}/{e.n}</span></div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]"><div className="h-full rounded-full bg-[var(--ink)]" style={{ width: `${(e.d / e.n) * 100}%` }} /></div>
                  </Link>))}</div>
              </div>))}
          </div>
        </section>

        <div className="flex min-h-0 min-w-0 flex-col gap-4">
          <section className="card-pastel shrink-0 p-5" data-tint="mint" aria-label="Practice">
            <div className="flex items-baseline justify-between"><h2 className="text-sm font-extrabold">Practice success</h2><span className="font-num text-sm font-bold text-[var(--text-secondary)]">{tries ? `${Math.round((passed / tries) * 100)}% passed` : "no tries yet"}</span></div>
            <div className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">{att === null ? <p className="text-sm">Loading…</p> : kinds.map(([k, e]) => (
              <div key={k}><div className="flex justify-between text-sm"><span className="font-semibold">{KIND[k] ?? k}</span><span className="font-num text-[var(--text-secondary)]">{e.n ? `${e.ok}/${e.n} passed` : "not tried"}</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]"><div className="h-full rounded-full" style={{ width: `${e.n ? (e.ok / e.n) * 100 : 0}%`, background: GREEN }} /></div></div>))}</div>
          </section>

          <section className="card-pastel flex min-h-0 flex-1 flex-col p-5" data-tint="peach" aria-label="Mistakes">
            <h2 className="mb-2 shrink-0 text-sm font-extrabold">Mistakes to fix</h2>
            {mistakes.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">No failed tries yet. Run a lab, a SQL exercise or a mock interview and anything you miss lands here.</p> : (
              <ul className="min-h-0 flex-1 divide-y divide-[var(--border)] overflow-y-auto overscroll-contain pr-2">{mistakes.slice(0, 60).map((m) => (
                <li key={m.kind + m.id} className="flex flex-wrap items-center gap-3 py-2.5">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${m.solved ? "bg-emerald-500/15 text-emerald-700" : "bg-rose-500/15 text-rose-700"}`}>{m.solved ? "fixed since" : "still failing"}</span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{KIND[m.kind] ?? m.kind}: {m.id.replace(/^[^:]+:/, "")}</span>{m.why && <span className="block truncate text-xs text-[var(--text-secondary)]">{m.why}</span>}</span>
                  <span className="font-num text-xs text-[var(--text-secondary)]">{m.fails} failed of {m.tries}</span>
                  <Link href={HREF(m)} className="pill-soft text-xs">Retry</Link>
                </li>))}</ul>)}
          </section>
        </div>
      </div>
    </div>
  );
}
export default function ProgressPage() { return <InterviewGate><Progress /></InterviewGate>; }
