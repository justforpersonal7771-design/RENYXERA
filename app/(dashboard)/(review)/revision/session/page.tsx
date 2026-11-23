"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MathJaxContext } from "better-react-mathjax";
import { ArrowLeft, Check, GraduationCap, Loader2, X } from "lucide-react";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import { PyqSolution } from "@/components/exam/pyq-solution";
import { ReportIssueButton } from "@/components/ui/report-issue-button";
import { ItemActions } from "@/components/desk/item-actions";
import { useEnsureAnswer } from "@/components/exam/answers-pending-banner";
import { useNotes, useRevision } from "@/lib/desk/stores";
import { examDay, noteReviewDay, todayIst, useDeskLoad, useRevisionSeed } from "@/lib/desk/revision";
import { RATING_LABEL, buildQueue, dayLabel, estimateMinutes, previewDays, rate, type Rating } from "@/lib/revision/scheduler";
import { tutorHref } from "@/lib/desk/links";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { useDataStore } from "@/store/use-data-store";
import { useStudyStore } from "@/store/use-study-store";
import { useToastStore } from "@/store/use-toast-store";
import { formatNatAnswer, isNatCorrect, natRangesOf } from "@/lib/grading";
import type { RevItem } from "@/lib/desk/types";

const mathJax = { loader: { load: ["input/tex", "output/chtml"] }, tex: { inlineMath: [["\\(", "\\)"]], displayMath: [["\\[", "\\]"]] } };
const TINT: Record<Rating, string> = { 1: "rose", 2: "peach", 3: "mint", 4: "sky" };

function Session() {
  const router = useRouter(); const sp = useSearchParams();
  const n = Math.min(60, Math.max(1, Number(sp.get("n")) || 20)); const focus = sp.get("focus"); const interleave = sp.get("interleave") !== "0";
  useDeskLoad(); useRevisionSeed(10);
  const { loadStudyData, markMistakeMastered } = useStudyStore();
  useEffect(() => { void loadStudyData(); void useNotes.getState().load(); }, [loadStudyData]);
  const loaded = useRevision((s) => s.loaded); const ready = useDataStore((s) => s.isInitialized);
  const [queue, setQueue] = useState<RevItem[] | null>(null); const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"recall" | "reveal">("recall");
  const [sel, setSel] = useState<string[]>([]); const [nat, setNat] = useState(""); const [blurt, setBlurt] = useState(""); const [correct, setCorrect] = useState<boolean | null>(null);
  const [tally, setTally] = useState<{ item: RevItem; rating: Rating; next: number }[]>([]); const startedAt = useRef(Date.now()); const built = useRef(false);
  const today = todayIst(); const exam = examDay();

  // The queue is built once, after the revision items, the review data and the question bank are all ready (and the seed has run).
  useEffect(() => {
    if (built.current || !loaded || !ready) return;
    const t = setTimeout(() => { if (built.current) return; built.current = true; setQueue(buildQueue(useRevision.getState().items, today, { limit: n, focus, interleave })); startedAt.current = Date.now(); }, 400);
    return () => clearTimeout(t);
  }, [loaded, ready, n, focus, interleave, today]);

  const item = queue?.[idx];
  const q = item?.kind === "question" ? QuestionRepository.getQuestionById(item.refId) : undefined;
  const note = item?.kind === "note" ? useNotes.getState().items.find((x) => x.id === item.refId) : undefined;
  useEnsureAnswer(q?.question_id);
  const reset = useCallback(() => { setPhase("recall"); setSel([]); setNat(""); setBlurt(""); setCorrect(null); }, []);
  // an item whose question or note no longer exists is skipped
  useEffect(() => { if (queue && item && ((item.kind === "question" && !q) || (item.kind === "note" && !note)) && ready) { const t = setTimeout(() => { setIdx((i) => i + 1); reset(); }, 0); return () => clearTimeout(t); } }, [queue, item, q, note, ready, reset]);

  const check = () => {
    if (!q) return;
    const ok = q.question_type === "NAT" ? isNatCorrect(nat, natRangesOf(q.nat_answer_range)) : (() => { const right = (q.options ?? []).filter((o) => o.is_correct).map((o) => o.option_id).sort().join(","); return right.length > 0 && right === [...sel].sort().join(","); })();
    setCorrect(ok); setPhase("reveal");
  };
  const reveal = () => { setCorrect(null); setPhase("reveal"); };
  const finish = useCallback((rating: Rating) => {
    if (!item) return;
    const r = rate(item, rating, today, exam);
    useRevision.getState().upsert({ ...item, ...r, lastRating: rating, lastAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    noteReviewDay();
    if (item.source === "mistake" && rating >= 3 && r.reps >= 3) { void markMistakeMastered(item.refId); useToastStore.getState().show("Mastered: it has left your mistakes list", "success"); }
    setTally((t) => [...t, { item, rating, next: r.interval }]); setIdx((i) => i + 1); reset();
  }, [item, today, exam, markMistakeMastered, reset]);

  useEffect(() => {
    if (phase !== "reveal") return;
    const on = (e: KeyboardEvent) => { if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) return; const k = Number(e.key); if (k >= 1 && k <= 4) finish(k as Rating); };
    window.addEventListener("keydown", on); return () => window.removeEventListener("keydown", on);
  }, [phase, finish]);

  if (!queue) return <div className="grid min-h-[50vh] place-items-center"><div className="text-center text-[var(--text-secondary)]"><Loader2 className="mx-auto h-7 w-7 animate-spin" aria-hidden /><p className="mt-3 text-sm font-semibold">Building today’s queue…</p></div></div>;
  if (queue.length === 0) return <div className="mx-auto mt-10 max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center"><p className="font-display text-xl font-extrabold text-[var(--text-primary)]">Nothing is due</p><p className="mt-1 text-sm text-[var(--text-secondary)]">You are caught up. Come back when new items fall due.</p><Link href="/revision" className="btn-main mt-4">Back to Revision</Link></div>;

  // ---------------------------------------------------------------- summary
  if (idx >= queue.length) {
    const c = ([1, 2, 3, 4] as Rating[]).map((r) => tally.filter((x) => x.rating === r).length);
    const recalled = tally.length ? Math.round(((c[2] + c[3]) / tally.length) * 100) : 0;
    const missed = tally.filter((x) => x.rating === 1);
    const mins = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000));
    const topics = [...new Set(missed.map((x) => x.item.topic).filter(Boolean) as string[])].slice(0, 4);
    const firstMissed = missed.find((x) => x.item.kind === "question");
    return (
      <div className="w-full space-y-4 pb-8">
        <section className="card-pastel p-6 sm:p-8" data-tint="mint" aria-label="Session finished">
          <p className="text-sm font-bold text-[var(--text-secondary)]">Session finished</p>
          <h1 className="mt-1 font-display text-4xl font-extrabold text-[var(--text-primary)]">{recalled}% recalled</h1>
          <p className="mt-2 text-[var(--text-secondary)]">{tally.length} items in {mins} {mins === 1 ? "minute" : "minutes"}. The ones you missed come back tomorrow; the rest are spaced further out.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{([1, 2, 3, 4] as Rating[]).map((r, i) => <div key={r} className="rounded-2xl bg-[var(--surface)] p-3 text-center"><b className="block font-num text-2xl" style={{ color: `var(--tint-${TINT[r]}-ink)` }}>{c[i]}</b><span className="text-xs font-semibold text-[var(--text-secondary)]">{RATING_LABEL[r]}</span></div>)}</div>
        </section>
        {missed.length > 0 && (
          <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5" aria-label="What to do about the misses">
            <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Worth a closer look</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{topics.length ? `You missed items in ${topics.join(", ")}.` : "You missed a few items."} Repeating them is not enough; read the explanation.</p>
            <div className="mt-3 flex flex-wrap gap-2">{firstMissed && <Link href={tutorHref(firstMissed.item.refId)} className="btn-main !h-10 !px-4 text-sm"><GraduationCap className="h-4 w-4" /> Teach me the first one</Link>}<Link href="/notes" className="btn-soft !h-10 !px-4 text-sm">Open my notes</Link></div>
          </section>
        )}
        <div className="flex flex-wrap gap-2"><Link href="/revision" className="btn-main !h-11 !px-5">Back to Revision</Link><button type="button" onClick={() => router.refresh()} className="sr-only">Refresh</button></div>
      </div>
    );
  }

  // ---------------------------------------------------------------- one item
  const hasKey = q ? (q.question_type === "NAT" ? !!q.nat_answer_range : (q.options ?? []).some((o) => o.is_correct)) : true;
  const pv = item ? previewDays(item, today, exam) : [1, 1, 1, 1];
  const pct = Math.round((idx / queue.length) * 100);
  const toggle = (id: string) => setSel((s) => (q?.question_type === "MSQ" ? (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]) : [id]));
  const card = "rounded-3xl border border-[var(--border)] bg-[var(--surface)]";
  return (
    <MathJaxContext config={mathJax}>
      <div className="w-full space-y-3 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/revision" className="btn-soft !h-10 !px-3 text-sm" aria-label="Leave the session"><ArrowLeft className="h-4 w-4" /> Revision</Link>
          <div className="min-w-[8rem] flex-1"><div className="h-2 overflow-hidden rounded-full bg-[var(--surface-secondary)]" role="progressbar" aria-valuenow={idx} aria-valuemin={0} aria-valuemax={queue.length} aria-label="Session progress"><div className="h-full rounded-full bg-[var(--tint-rose-ink)] transition-[width] duration-300" style={{ width: `${pct}%` }} /></div></div>
          <span className="font-num text-sm font-bold text-[var(--text-primary)]">{idx + 1} / {queue.length}</span>
          <span className="hidden text-xs text-[var(--text-secondary)] sm:inline">about {estimateMinutes(queue.length - idx)} min left</span>
          {q && <><ReportIssueButton questionId={q.question_id} compact /><ItemActions questionId={q.question_id} subject={q.subject} topic={q.topic} source="test" /></>}
        </div>

        <section className={`${card} p-5 sm:p-7`} aria-label="Item">
          <p className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
            <span className="rounded-full bg-[var(--surface-secondary)] px-2.5 py-1">{item?.kind === "note" ? "Note" : q?.question_type ?? "Question"}</span>
            {(item?.subject ?? q?.subject) && <span>{item?.subject ?? q?.subject}{(item?.topic ?? q?.topic) ? ` · ${item?.topic ?? q?.topic}` : ""}</span>}
            {item && item.reps > 0 && <span className="ml-auto">seen {item.reps}× · {item.lapses ? `missed ${item.lapses}×` : "never missed"}</span>}
          </p>

          {q && (
            <>
              <div className="mt-4 text-lg font-medium leading-relaxed text-[var(--text-primary)]"><AstNodeRenderer nodes={q.contentAst} /></div>
              {(q.question_type === "MCQ" || q.question_type === "MSQ") && (
                <div className={`mt-5 grid gap-3 ${q.options?.some((o) => o.contentAst.some((x) => x.type === "image")) ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"}`}>
                  {q.options?.map((o) => {
                    const mine = sel.includes(o.option_id); const rev = phase === "reveal"; let cls = "border-[var(--border)] bg-[var(--surface)]";
                    if (!rev && mine) cls = "border-[var(--tint-sky-ink)] bg-[var(--tint-sky)]";
                    if (rev && o.is_correct) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20";
                    else if (rev && mine) cls = "border-rose-500 bg-rose-50 dark:bg-rose-900/20";
                    return (
                      <button key={o.option_id} type="button" disabled={rev} aria-pressed={mine} onClick={() => toggle(o.option_id)} className={`flex w-full cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 text-left transition ${cls} disabled:cursor-default`}>
                        <span className="w-5 shrink-0 font-black text-[var(--text-primary)]">{o.option_id}.</span><span className="min-w-0 max-w-full overflow-hidden break-words text-[var(--text-primary)]"><AstNodeRenderer nodes={o.contentAst} /></span>
                        {rev && o.is_correct && <Check className="ml-auto h-5 w-5 shrink-0 text-emerald-600" aria-label="Correct" />}{rev && !o.is_correct && mine && <X className="ml-auto h-5 w-5 shrink-0 text-rose-600" aria-label="Your choice, wrong" />}
                      </button>
                    );
                  })}
                </div>
              )}
              {q.question_type === "NAT" && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <label className="text-sm font-semibold text-[var(--text-secondary)]">Your answer<input value={nat} disabled={phase === "reveal"} onChange={(e) => setNat(e.target.value)} inputMode="decimal" className="ml-3 h-11 w-44 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 font-num text-[var(--text-primary)]" /></label>
                  {phase === "reveal" && <span className="rounded-xl bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-secondary)]">Correct: <b className="font-num text-emerald-700 dark:text-emerald-300">{formatNatAnswer(q.nat_answer_range)}</b></span>}
                </div>
              )}
            </>
          )}

          {note && (
            <div className="mt-4">
              <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">{note.title || "Recall this note"}</h2>
              {note.quote && <p className="mt-1 border-l-2 border-[var(--border)] pl-3 text-sm italic text-[var(--text-secondary)]">{note.quote}</p>}
              {phase === "recall" ? <label className="mt-3 block text-sm font-semibold text-[var(--text-secondary)]">Write what you remember (optional)<textarea value={blurt} onChange={(e) => setBlurt(e.target.value)} rows={4} className="mt-1 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--tint-sky-ink)]" /></label>
                : <><p className="mt-3 whitespace-pre-wrap rounded-2xl bg-[var(--tint-mint)] p-4 text-sm leading-relaxed text-[var(--tint-mint-ink)]">{note.body}</p>{blurt.trim() && <p className="mt-2 text-xs text-[var(--text-secondary)]">You wrote: {blurt}</p>}</>}
            </div>
          )}

          {phase === "recall" ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {q && q.question_type !== "NAT" && <button type="button" onClick={check} disabled={sel.length === 0 || !hasKey} className="btn-main !h-11 !px-6 disabled:opacity-50">Check my answer</button>}
              {q && q.question_type === "NAT" && <button type="button" onClick={check} disabled={!nat.trim() || !hasKey} className="btn-main !h-11 !px-6 disabled:opacity-50">Check my answer</button>}
              <button type="button" onClick={reveal} className={q ? "btn-soft !h-11 !px-5" : "btn-main !h-11 !px-6"}>{q ? "I don’t know: show the answer" : "Show the note"}</button>
              {q && !hasKey && <span className="self-center text-xs text-[var(--text-secondary)]">The answer key is still loading.</span>}
            </div>
          ) : (
            <div className="mt-6">
              {correct !== null && <p className={`mb-3 text-sm font-bold ${correct ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>{correct ? "Correct. Rate how easy it felt." : "Not this time. Be honest with the rating; it schedules the next review."}</p>}
              <div role="group" aria-label="How did it go" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {([1, 2, 3, 4] as Rating[]).map((r, i) => (
                  <button key={r} type="button" onClick={() => finish(r)} className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 px-3 py-3 font-bold transition hover:-translate-y-0.5 ${(correct === false && r === 1) || (correct === true && r === 3) ? "ring-2 ring-[var(--text-primary)]" : ""}`} style={{ background: `var(--tint-${TINT[r]})`, color: `var(--tint-${TINT[r]}-ink)`, borderColor: `var(--tint-${TINT[r]}-ink)` }}>
                    <span>{RATING_LABEL[r]}</span><span className="text-xs font-semibold opacity-90">{dayLabel(pv[i])} · key {r}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
        {phase === "reveal" && q && <section className={`${card} p-3 sm:p-4`} aria-label="Solution"><PyqSolution questionId={q.question_id} /></section>}
      </div>
    </MathJaxContext>
  );
}

export default function RevisionSessionPage() {
  return <Suspense fallback={<div className="grid min-h-[50vh] place-items-center"><Loader2 className="h-7 w-7 animate-spin text-[var(--text-secondary)]" /></div>}><Session /></Suspense>;
}
