"use client";

/** Your progress and your mistakes: reading per book, success rate per kind of practice, and the items you keep getting wrong. */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InterviewGate, type IvDoc } from "@/components/interview/interview-gate";

type Att = { item_kind: string; item_id: string; ok: boolean; detail: { err?: string; note?: string }; created_at: string };
const KIND = { lab: "Book labs", sql: "SQL", code: "Free code runs", card: "Flashcards", mock: "Mock interview" } as Record<string, string>;
const HREF = (a: { kind: string; id: string }) => (a.kind === "sql" ? "/interview/sql" : a.kind === "card" ? `/interview-cards?book=${encodeURIComponent(a.id.split(":")[0])}` : a.kind === "mock" ? "/interview/tutor?mode=mock" : "/interview/lab");

function Progress() {
  const [docs, setDocs] = useState<IvDoc[]>([]);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [att, setAtt] = useState<Att[] | null>(null);
  useEffect(() => {
    void fetch("/api/interview/docs", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { docs: IvDoc[]; progress: { doc_id: string; status: string }[] } | null) => { if (d) { setDocs(d.docs.filter((x) => x.kind !== "lab")); setDone(new Set(d.progress.filter((p) => p.status === "done").map((p) => p.doc_id))); } });
    void fetch("/api/interview/progress", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((d: { attempts: Att[] } | null) => setAtt(d?.attempts ?? []));
  }, []);

  const books = useMemo(() => { const m = new Map<string, { t: string; n: number; d: number }>(); for (const x of docs) { const e = m.get(x.book) ?? { t: x.book_title, n: 0, d: 0 }; e.n++; if (done.has(x.id)) e.d++; m.set(x.book, e); } return [...m.entries()].sort((a, b) => b[1].d / b[1].n - a[1].d / a[1].n); }, [docs, done]);
  const kinds = useMemo(() => { const m = new Map<string, { n: number; ok: number }>(); for (const a of att ?? []) { const e = m.get(a.item_kind) ?? { n: 0, ok: 0 }; e.n++; if (a.ok) e.ok++; m.set(a.item_kind, e); } return [...m.entries()]; }, [att]);
  const mistakes = useMemo(() => {
    const m = new Map<string, { kind: string; id: string; fails: number; tries: number; last: string; why: string; solved: boolean }>();
    for (const a of [...(att ?? [])].reverse()) { const k = a.item_kind + ":" + a.item_id; const e = m.get(k) ?? { kind: a.item_kind, id: a.item_id, fails: 0, tries: 0, last: a.created_at, why: "", solved: false }; e.tries++; if (!a.ok) { e.fails++; e.why = a.detail?.err || a.detail?.note || e.why; } e.solved = a.ok; e.last = a.created_at; m.set(k, e); }
    return [...m.values()].filter((e) => e.fails > 0 && !e.id.startsWith("free:")).sort((a, b) => Number(a.solved) - Number(b.solved) || b.fails - a.fails);
  }, [att]);

  return (
    <div className="w-full min-w-0 space-y-4">
      <h1 className="font-display text-2xl font-extrabold">Progress and mistakes</h1>
      <div className="grid min-w-0 gap-4 lg:grid-cols-2 [&>*]:min-w-0">
        <section className="card-pastel space-y-3 p-5" data-tint="sky" aria-label="Reading">
          <h2 className="text-sm font-extrabold">Reading by book</h2>
          {books.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">Nothing loaded yet.</p> : books.map(([b, e]) => (
            <Link key={b} href={`/interview/read?book=${encodeURIComponent(b)}`} className="block">
              <div className="flex justify-between text-sm"><span className="truncate font-semibold">{e.t}</span><span className="font-num text-[var(--text-secondary)]">{e.d}/{e.n}</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]"><div className="h-full rounded-full bg-[#3a6fb8]" style={{ width: `${(e.d / e.n) * 100}%` }} /></div>
            </Link>))}
        </section>
        <section className="card-pastel space-y-3 p-5" data-tint="mint" aria-label="Practice">
          <h2 className="text-sm font-extrabold">Practice success</h2>
          {att === null ? <p className="text-sm">Loading…</p> : kinds.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">Run some code or SQL and it shows up here.</p> : kinds.map(([k, e]) => (
            <div key={k}><div className="flex justify-between text-sm"><span className="font-semibold">{KIND[k] ?? k}</span><span className="font-num text-[var(--text-secondary)]">{e.ok}/{e.n} passed</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]"><div className="h-full rounded-full bg-[#f5b69e]" style={{ width: `${(e.ok / e.n) * 100}%` }} /></div></div>))}
        </section>
      </div>
      <section className="card-pastel p-5" data-tint="peach" aria-label="Mistakes">
        <h2 className="mb-3 text-sm font-extrabold">Mistakes to fix</h2>
        {mistakes.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">No failed tries yet.</p> : (
          <ul className="divide-y divide-[var(--border)]">{mistakes.slice(0, 40).map((m) => (
            <li key={m.kind + m.id} className="flex flex-wrap items-center gap-3 py-2.5">
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${m.solved ? "bg-emerald-500/15 text-emerald-700" : "bg-rose-500/15 text-rose-700"}`}>{m.solved ? "fixed since" : "still failing"}</span>
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{KIND[m.kind] ?? m.kind}: {m.id.replace(/^[^:]+:/, "")}</span>{m.why && <span className="block truncate text-xs text-[var(--text-secondary)]">{m.why}</span>}</span>
              <span className="font-num text-xs text-[var(--text-secondary)]">{m.fails} failed of {m.tries}</span>
              <Link href={HREF(m)} className="pill-soft text-xs">Retry</Link>
            </li>))}</ul>)}
      </section>
    </div>
  );
}
export default function ProgressPage() { return <InterviewGate><Progress /></InterviewGate>; }
