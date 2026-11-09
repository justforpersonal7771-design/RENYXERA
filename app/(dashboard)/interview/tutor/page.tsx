"use client";

/** Tutor: a mock interviewer (a real question from your bank, your typed answer scored against the book's model answer) and a free chat. */
import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Loader2, RotateCcw, Sparkles, Target } from "lucide-react";
import { IvTutorPanel, type TutorSeed } from "@/components/interview/iv-tutor-panel";
import { IvMarkdown } from "@/components/interview/iv-markdown";
import { useIvLibrary } from "@/components/interview/use-iv-library";
import { TRACKS, bookIdOf } from "@/lib/interview/tracks";

type Q = { id: string; book: string; bookTitle: string; ch: string; question: string };
type Res = { score: number; verdict: string; good: string[]; missing: string[]; better: string };
const norm = (s: string) => s.toLowerCase().replace(/^\d+[_\s-]*/, "").replace(/[^a-z0-9]+/g, "");

function Mock({ initialTrack }: { initialTrack: string }) {
  const { docs } = useIvLibrary();
  const [track, setTrack] = useState(initialTrack);
  const [q, setQ] = useState<Q | null>(null);
  const [answer, setAnswer] = useState("");
  const [res, setRes] = useState<Res | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [log, setLog] = useState<number[]>([]);

  const next = async () => {
    setBusy(true); setRes(null); setAnswer(""); setErr("");
    const books = track === "all" ? undefined : TRACKS.find((t) => t.id === track)?.books.join(",");
    try {
      const r = await fetch("/api/interview/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "mock_next", track: books }) });
      const d = (await r.json()) as { card?: Q; error?: string };
      if (d.card) setQ(d.card); else setErr(d.error ?? "No question came back.");
    } catch { setErr("Could not reach the server."); } finally { setBusy(false); }
  };
  const score = async () => {
    if (!q || !answer.trim()) return;
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/interview/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "mock_score", cardId: q.id, answer }) });
      const d = (await r.json()) as Res & { error?: string };
      if (d.error) setErr(d.error); else { setRes(d); setLog((l) => [...l, d.score]); }
    } catch { setErr("Could not reach the server."); } finally { setBusy(false); }
  };
  const lesson = q && docs.find((d) => d.book === q.book && d.kind === "chapter" && (norm(q.ch).includes(norm(d.title).slice(0, 24)) || norm(d.title).includes(norm(q.ch).slice(0, 24))));
  const avg = log.length ? Math.round((log.reduce((a, b) => a + b, 0) / log.length) * 10) / 10 : null;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-4">
        {!q ? (
          <section className="card-pastel p-6 sm:p-8" data-tint="mint">
            <span className="section-label"><Target className="h-3.5 w-3.5" /> Mock interview</span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-[var(--text-primary)]">Answer like it is the real thing.</h2>
            <p className="mt-2 max-w-xl text-[var(--text-secondary)]">You get a real interview question from your books. Type the answer you would say. The tutor scores it from 0 to 10 against the book&apos;s model answer, tells you what you missed, and adds misses to your fix list.</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <select value={track} onChange={(e) => setTrack(e.target.value)} aria-label="Track" className="h-11 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-3 text-sm font-bold"><option value="all">All tracks</option>{TRACKS.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
              <button type="button" onClick={() => void next()} disabled={busy} className="btn-main">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Ask me a question</button>
            </div>
            {err && <p className="mt-3 text-sm font-bold text-rose-600">{err}</p>}
          </section>
        ) : (
          <>
            <section className="card-pastel p-6" data-tint="mint">
              <p className="text-xs font-bold text-[var(--text-muted)]">{q.bookTitle}</p>
              <h2 className="mt-1 font-display text-2xl font-extrabold leading-snug text-[var(--text-primary)]">{q.question}</h2>
            </section>
            {!res ? (
              <section className="space-y-3">
                <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} rows={7} placeholder="Type your answer the way you would say it…" aria-label="Your answer" className="card-pastel w-full resize-y p-4 text-[15px] leading-relaxed outline-none" data-tint="sky" />
                <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void score()} disabled={busy || !answer.trim()} className="btn-main">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}Score my answer</button><button type="button" onClick={() => void next()} disabled={busy} className="btn-soft">Skip</button></div>
                {err && <p className="text-sm font-bold text-rose-600">{err}</p>}
              </section>
            ) : (
              <section className="space-y-3" aria-live="polite">
                <div className="card-pastel flex items-center gap-5 p-5" data-tint={res.score >= 6 ? "mint" : "rose"}>
                  <span className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-[var(--surface)] font-display text-3xl font-extrabold">{res.score}<span className="text-base text-[var(--text-muted)]">/10</span></span>
                  <p className="font-display text-xl font-extrabold text-[var(--text-primary)]">{res.verdict}</p>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="card-pastel p-5" data-tint="mint"><p className="font-bold">What you got right</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{res.good.length ? res.good.map((g, i) => <li key={i}>{g}</li>) : <li>Nothing yet. Read the model answer below.</li>}</ul></div>
                  <div className="card-pastel p-5" data-tint="rose"><p className="font-bold">What was missing</p><ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{res.missing.length ? res.missing.map((g, i) => <li key={i}>{g}</li>) : <li>Nothing. Well answered.</li>}</ul></div>
                </div>
                <div className="card-pastel p-5" data-tint="butter"><p className="font-bold">A stronger answer</p><div className="mt-2 text-sm"><IvMarkdown body={res.better} /></div></div>
                <div className="flex flex-wrap gap-2"><button type="button" onClick={() => void next()} className="btn-main">Next question<ArrowRight className="h-4 w-4" /></button><button type="button" onClick={() => { setRes(null); setAnswer(""); }} className="btn-soft"><RotateCcw className="h-4 w-4" />Try again</button>{lesson && <Link href={`/interview/read?doc=${encodeURIComponent(lesson.id)}`} className="pill-soft">Read the lesson</Link>}<button type="button" onClick={() => { setQ(null); setRes(null); }} className="pill-soft">Change track</button></div>
              </section>
            )}
          </>
        )}
      </div>
      <aside className="card-pastel h-fit p-5 lg:sticky lg:top-24" data-tint="butter" aria-label="This session">
        <p className="text-sm font-semibold text-[var(--text-secondary)]">This session</p>
        <p className="mt-1 font-display text-3xl font-extrabold">{avg ?? "–"}<span className="text-base text-[var(--text-muted)]"> avg</span></p>
        <p className="text-sm text-[var(--text-secondary)]">{log.length} answered</p>
        <div className="mt-3 flex flex-wrap gap-1.5">{log.map((s, i) => <span key={i} className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${s >= 6 ? "bg-emerald-500/20 text-emerald-700" : "bg-rose-500/20 text-rose-700"}`}>{s}</span>)}</div>
        <Link href="/interview/progress" className="pill-soft mt-4 inline-flex">See all mistakes</Link>
      </aside>
    </div>
  );
}

function Tutor() {
  const sp = useSearchParams();
  const [tab, setTab] = useState<"mock" | "chat">(sp.get("mode") === "mock" || sp.get("track") ? "mock" : "chat");
  const seed = useMemo<TutorSeed>(() => ({ key: "free", mode: "chat" }), []);
  return (
    <div className="space-y-4">
      <div className="flex gap-1 rounded-full bg-[var(--surface)] p-1 w-fit" role="tablist" aria-label="Tutor">
        {([["mock", "Mock interview"], ["chat", "Ask the tutor"]] as const).map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === k ? "bg-[var(--ink)] text-[var(--background)]" : "text-[var(--text-secondary)]"}`}>{l}</button>)}
      </div>
      {tab === "mock" ? <Mock initialTrack={TRACKS.some((t) => t.id === sp.get("track")) ? sp.get("track")! : "all"} />
        : <section className="card-pastel h-[calc(100vh-260px)] min-h-[420px] p-5" data-tint="sky"><IvTutorPanel seed={seed} className="h-full" /></section>}
    </div>
  );
}
export default function TutorPage() { return <Suspense fallback={null}><Tutor /></Suspense>; }
