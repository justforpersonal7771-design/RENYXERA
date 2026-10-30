"use client";

import { useEffect, useMemo, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Swords, Hourglass, LayoutGrid } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { useExamStore } from "@/store/use-exam-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { track } from "@/lib/growth/track";
import type { ExamSessionDraft } from "@/types/exam.types";

type Battle = { id: string; title: string; ownerName: string; ownerScore: number; maxScore: number; questionIds: string[]; expiresAt: string; expired: boolean };
type Loaded = { battle: Battle; isOwner: boolean; entries: { you: boolean; status: string; score: number | null; maxScore: number | null }[] };

const MIN_COVER = 0.8; // must match the server: a friend needs most of the battle's questions in their bank

/** /challenge/<battle id>: a live battle. Sign in, take the same questions, and the sender watches you play. */
export default function BattlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const isInitialized = useDataStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => !s.loading);
  const openAuth = useAuthModalStore((s) => s.open);
  const [data, setData] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => { useDataStore.getState().loadRepository(); }, []);

  useEffect(() => {
    if (!authReady) return;
    let off = false;
    fetch(`/api/battles/${id}`).then(async (r) => {
      const j = await r.json().catch(() => ({}));
      if (off) return;
      if (!r.ok) setError(r.status === 404 ? "This battle link isn't valid." : "Couldn't load this battle. Try again in a moment.");
      else { setData(j as Loaded); track("visit", null, "battle_link"); }
    }).catch(() => { if (!off) setError("Couldn't load this battle. Check your connection."); });
    return () => { off = true; };
  }, [id, authReady, user?.id]);

  // Opening the link while signed in tells the sender "opened".
  useEffect(() => {
    if (user && data && !data.isOwner && !data.battle.expired) void fetch(`/api/battles/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "open" }) }).catch(() => {});
  }, [user, data, id]);

  const available = useMemo(() => (data && isInitialized ? data.battle.questionIds.filter((q) => !!QuestionRepository.getQuestionById(q)) : []), [data, isInitialized]);
  const enough = !!data && available.length >= Math.max(3, Math.ceil(data.battle.questionIds.length * MIN_COVER));
  const done = data?.entries.find((e) => e.you && e.status === "submitted");

  if (error) return <div className="mx-auto max-w-md py-20 text-center"><p className="font-bold text-[var(--text-primary)]">{error}</p><Link href="/test-centre" className="pill-soft mt-4 inline-flex"><LayoutGrid className="h-4 w-4" /> Test Centre</Link></div>;
  if (!data) return <div className="grid place-items-center py-24" role="status"><Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" /></div>;
  const b = data.battle;

  const start = async () => {
    if (!user) { openAuth("signup"); return; }
    setBusy(true);
    try {
      const r = await fetch(`/api/battles/${id}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "start", total: available.length }) });
      if (!r.ok) { const j = await r.json().catch(() => ({})); setError((j as { error?: string }).error ?? "Couldn't start this battle."); setBusy(false); return; }
      const draft: ExamSessionDraft = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        config: { examType: "CUSTOM_TEST", title: b.title, questionCount: available.length, challenge: { score: b.ownerScore, max: b.maxScore, by: b.ownerName }, battle: { id } },
        questions: available.map((questionId, i) => ({ questionId, sequence: i + 1 })),
        createdAt: new Date().toISOString(),
      };
      useExamStore.getState().loadDraft(draft.id, draft);
      track("test_started", null, "battle");
      await useExamRuntimeStore.getState().startSession(draft);
      router.push("/exam/session");
    } catch { setBusy(false); }
  };

  return (
    <div className="mx-auto w-full max-w-xl py-8">
      <section className="card-pastel p-6 text-center sm:p-8" data-tint="lilac" aria-label="Battle">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--surface)] text-[var(--tint-lilac-ink)]"><Swords className="h-7 w-7" aria-hidden /></span>
        <p className="mt-4 text-xs font-extrabold uppercase tracking-wide text-[var(--tint-lilac-ink)]">Battle</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-[var(--text-primary)]">{b.ownerName} scored <span className="font-num">{b.ownerScore}</span> out of <span className="font-num">{b.maxScore}</span></h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{b.title} · {b.questionIds.length} questions. Take the same questions in the real exam screen. {b.ownerName} sees when you open it, how far you are and who wins.</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)]"><Hourglass className="h-3.5 w-3.5" /> {b.expired ? "Expired" : `Open until ${new Date(b.expiresAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`}</p>

        {data.isOwner ? (
          <div className="mt-6"><p className="text-sm text-[var(--text-secondary)]">This is your battle. Send the link to a friend and watch them play.</p><Link href="/battles" className="btn-main mt-4 inline-flex">See live status</Link></div>
        ) : b.expired ? (
          <p className="mt-6 text-sm font-semibold text-[var(--tint-rose-ink)]">This battle has expired. Ask {b.ownerName} for a new one.</p>
        ) : done ? (
          <div className="mt-6">
            <p className="font-display text-xl font-extrabold text-[var(--text-primary)]">You scored <span className="font-num">{done.score}</span> / <span className="font-num">{done.maxScore}</span></p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{Number(done.score) > b.ownerScore ? `You beat ${b.ownerName}.` : Number(done.score) === b.ownerScore ? `You matched ${b.ownerName}.` : `${b.ownerName} is ahead. Try a rematch.`}</p>
            <Link href="/battles" className="btn-main mt-4 inline-flex">See the battle</Link>
          </div>
        ) : (
          <>
            {isInitialized && !enough ? <p className="mt-3 text-xs text-[var(--tint-butter-ink)]">Only {available.length} of these {b.questionIds.length} questions are in your paper&apos;s bank, so this battle can&apos;t be fair for you. Switch your branch in Profile if it was set for another paper.</p> : null}
            <button type="button" onClick={start} disabled={busy || !isInitialized || !enough} className="btn-main mt-6 disabled:opacity-50">
              {busy || !isInitialized ? <><Loader2 className="h-4 w-4 animate-spin" /> {busy ? "Starting…" : "Loading questions…"}</> : !user ? "Sign in to take the battle" : "Take the battle"}
            </button>
            {!user && <p className="mt-3 text-xs text-[var(--text-muted)]">A free account lets {b.ownerName} see your progress and the winner.</p>}
          </>
        )}
      </section>
    </div>
  );
}
