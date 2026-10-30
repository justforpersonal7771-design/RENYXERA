"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Flag, Loader2, Search } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import { useExamStore } from "@/store/use-exam-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { useStudyStore } from "@/store/use-study-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import type { ExamSessionDraft } from "@/types/exam.types";

const COUNT = 8;
const MIXED = 10;
const RANK: Record<string, number> = { Easy: 0, Moderate: 1, Medium: 1, Hard: 2 };
const isOfficial = (q: object) => !(q as { isAiGenerated?: boolean }).isAiGenerated;
const byDifficulty = <T extends { difficulty: string }>(a: T, b: T) => (RANK[a.difficulty] ?? 1) - (RANK[b.difficulty] ?? 1);

async function begin(draft: ExamSessionDraft, push: (p: string) => void) {
  useExamStore.getState().loadDraft(draft.id, draft);
  await useExamRuntimeStore.getState().startSession(draft);
  push("/exam/session");
}
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());

/** /checkpoint?topic=… — a short warm-up-to-stretch ladder (easy → hard) on one topic. */
function TopicCheckpoint({ topic }: { topic: string }) {
  const router = useRouter();
  const isInitialized = useDataStore((s) => s.isInitialized);
  const [empty, setEmpty] = useState(false);
  const started = useRef(false);
  useEffect(() => {
    if (!isInitialized || started.current) return;
    started.current = true;
    const pool = QuestionRepository.getQuestionsByTopic(topic).filter(isOfficial);
    if (pool.length === 0) { setEmpty(true); return; }
    // Spread across the difficulty ladder: shuffle, then take the easiest-first slice of a balanced pick.
    const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, COUNT).sort(byDifficulty);
    void begin({
      id: newId(),
      config: { examType: "TOPIC_TEST", subject: picked[0].subject, topics: [topic], questionCount: picked.length },
      questions: picked.map((q, i) => ({ questionId: q.question_id, sequence: i + 1 })),
      createdAt: new Date().toISOString(),
    }, router.push).catch(() => setEmpty(true));
  }, [isInitialized, topic, router]);

  if (empty) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="font-bold text-[var(--text-primary)]">No questions tagged &quot;{topic}&quot; yet.</p>
        <Link href="/checkpoint" className="pill-soft mt-4 inline-flex">Pick another topic</Link>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-[var(--text-secondary)]" role="status">
      <Loader2 className="h-5 w-5 animate-spin" /> Building your {COUNT}-question checkpoint on {topic}…
    </div>
  );
}

/** /checkpoint: a mixed checkpoint from the topics studied lately, or any topic by hand. */
function CheckpointHub() {
  const router = useRouter();
  const isInitialized = useDataStore((s) => s.isInitialized);
  const mistakes = useStudyStore((s) => s.mistakes);
  const [seen, setSeen] = useState<Set<string> | null>(null);
  const [recentTopics, setRecentTopics] = useState<{ topic: string; weight: number }[] | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { void useStudyStore.getState().loadStudyData?.(); }, []);

  // Topics from the last 5 finished tests (what you actually practised) plus your mistakes, which count double.
  useEffect(() => {
    if (!isInitialized) return;
    let alive = true;
    void IDBManager.getAllExamSessions().then((recs) => {
      if (!alive) return;
      const sessions = recs.map((r) => r.sessionData as { status?: string; startedAt?: string; responses?: Record<string, unknown> })
        .filter((s) => s.status === "SUBMITTED").sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt))).slice(0, 5);
      const ids = new Set<string>(), weight = new Map<string, number>();
      for (const s of sessions) for (const id of Object.keys(s.responses ?? {})) {
        ids.add(id);
        const t = QuestionRepository.getQuestionById(id)?.topic;
        if (t) weight.set(t, (weight.get(t) ?? 0) + 1);
      }
      setSeen(ids);
      setRecentTopics([...weight.entries()].map(([topic, weight]) => ({ topic, weight })));
    }).catch(() => { if (alive) { setSeen(new Set()); setRecentTopics([]); } });
    return () => { alive = false; };
  }, [isInitialized]);

  const focus = useMemo(() => {
    if (!recentTopics) return null;
    const w = new Map(recentTopics.map((r) => [r.topic, r.weight]));
    for (const m of mistakes) if (m.topic) w.set(m.topic, (w.get(m.topic) ?? 0) + 2);
    return [...w.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([topic]) => topic);
  }, [recentTopics, mistakes]);

  const topics = useMemo(() => (isInitialized ? QuestionRepository.getUniqueTopics().filter((t) => !!t).sort() : []), [isInitialized]);
  const shown = useMemo(() => topics.filter((t) => t.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 60), [topics, query]);

  const startMixed = async () => {
    if (!focus?.length) return;
    setBusy(true); setError(null);
    try {
      // Questions from the focus topics, ones you have not just seen first, spread evenly across the topics, easiest first.
      const per = focus.map((t) => QuestionRepository.getQuestionsByTopic(t).filter(isOfficial));
      const fresh = per.map((p) => p.filter((q) => !seen?.has(q.question_id)));
      const lists = fresh.reduce((n, p) => n + p.length, 0) >= MIXED ? fresh : per;
      const picked: (typeof per)[number] = [];
      const shuffled = lists.map((p) => [...p].sort(() => Math.random() - 0.5));
      for (let i = 0; picked.length < MIXED && shuffled.some((p) => p.length > i); i++) for (const p of shuffled) if (p[i] && picked.length < MIXED) picked.push(p[i]);
      if (picked.length < 3) { setError("There aren't enough questions on those topics yet. Pick a topic below."); setBusy(false); return; }
      picked.sort(byDifficulty);
      await begin({
        id: newId(),
        config: { examType: "CUSTOM_TEST", title: "Checkpoint", topics: focus, questionCount: picked.length },
        questions: picked.map((q, i) => ({ questionId: q.question_id, sequence: i + 1 })),
        createdAt: new Date().toISOString(),
      }, router.push);
    } catch { setError("Couldn't start the checkpoint. Try again."); setBusy(false); }
  };

  const ready = isInitialized && focus !== null;
  return (
    <div className="flex w-full flex-col gap-5">
      <section className="card-well p-5 sm:p-6" data-tint="peri" aria-label="Checkpoint">
        <span className="section-label"><Flag className="h-3.5 w-3.5" /> Checkpoint</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">What has stuck?</h1>
        <p className="mt-2 max-w-xl text-[var(--text-secondary)]">A short test of {MIXED} questions on what you practised lately, easiest first, mostly ones you haven&apos;t just seen. Or pick any topic below for {COUNT} questions.</p>
        <div className="mt-5">
          {!ready ? (
            <p className="text-sm text-[var(--text-muted)]" role="status"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Looking at your recent practice…</p>
          ) : focus!.length ? (
            <>
              <p className="text-sm font-semibold text-[var(--text-secondary)]">Your checkpoint covers</p>
              <div className="mt-2 flex flex-wrap gap-2">{focus!.map((t) => <span key={t} className="rounded-full bg-[var(--surface)] px-3 py-1.5 text-sm font-semibold text-[var(--text-primary)]">{t}</span>)}</div>
              <button type="button" onClick={startMixed} disabled={busy} className="btn-main mt-4 disabled:opacity-60">{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Building…</> : `Start a ${MIXED}-question checkpoint`}</button>
            </>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">Nothing to review yet: finish a practice test or a mock and your checkpoint will be built from it. Until then, pick a topic below.</p>
          )}
          {error && <p className="mt-3 text-sm font-semibold text-[var(--tint-rose-ink)]" role="alert">{error}</p>}
        </div>
      </section>

      <section className="card-pastel p-5 sm:p-6" data-tint="sky" aria-label="Pick a topic">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">Or pick a topic</h2>
          <label className="relative block w-full sm:w-72">
            <span className="sr-only">Search topics</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search topics" className="h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--text-secondary)]" />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {shown.map((t) => <Link key={t} href={`/checkpoint?topic=${encodeURIComponent(t)}`} className="pill-soft text-sm">{t}</Link>)}
          {isInitialized && shown.length === 0 && <p className="text-sm text-[var(--text-secondary)]">No topic matches &quot;{query}&quot;.</p>}
        </div>
      </section>
    </div>
  );
}

function CheckpointRouter() {
  const topic = useSearchParams().get("topic") ?? "";
  useEffect(() => { useDataStore.getState().loadRepository(); }, []);
  return topic ? <TopicCheckpoint topic={topic} /> : <CheckpointHub />;
}

export default function CheckpointPage() {
  return <Suspense fallback={null}><CheckpointRouter /></Suspense>;
}
