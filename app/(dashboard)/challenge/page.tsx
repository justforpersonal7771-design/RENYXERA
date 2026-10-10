"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Swords } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { useExamStore } from "@/store/use-exam-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { parseChallenge } from "@/lib/growth/challenge";
import { track } from "@/lib/growth/track";
import type { ExamSessionDraft } from "@/types/exam.types";

const GUEST_MAX = 15;

/** /challenge?...: a friend's question set and score. Take the same questions and see if you beat them. */
function ChallengeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const challenge = useMemo(() => parseChallenge(new URLSearchParams(params.toString())), [params]);
  const isInitialized = useDataStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);
  const openAuth = useAuthModalStore((s) => s.open);
  const [busy, setBusy] = useState(false);
  const [missing, setMissing] = useState<number | null>(null);
  useEffect(() => { useDataStore.getState().loadRepository(); }, []);
  useEffect(() => { if (challenge) track("visit", null, "challenge_link"); }, [challenge]);

  const available = useMemo(() => (challenge && isInitialized ? challenge.ids.filter((id) => !!QuestionRepository.getQuestionById(id)) : []), [challenge, isInitialized]);
  useEffect(() => { if (challenge && isInitialized) setMissing(challenge.ids.length - available.length); }, [challenge, isInitialized, available]);

  if (!challenge) return <div className="mx-auto max-w-md py-20 text-center"><p className="font-bold text-[var(--text-primary)]">This challenge link isn&apos;t valid.</p><Link href="/setup" className="mt-3 inline-block text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">Open Exam Setup →</Link></div>;

  const start = async () => {
    if (!user && available.length > GUEST_MAX) { openAuth("signup"); return; }
    setBusy(true);
    try {
      const draft: ExamSessionDraft = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        config: { examType: "CUSTOM_TEST", questionCount: available.length, challenge: { score: challenge.score, max: challenge.max, by: challenge.by } },
        questions: available.map((questionId, i) => ({ questionId, sequence: i + 1 })),
        createdAt: new Date().toISOString(),
      };
      useExamStore.getState().loadDraft(draft.id, draft);
      track("test_started", null, "challenge");
      await useExamRuntimeStore.getState().startSession(draft);
      router.push("/exam/session");
    } catch { setBusy(false); }
  };

  return (
    <div className="mx-auto w-full max-w-xl py-8">
      <section className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-6 sm:p-8 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30"><Swords className="h-7 w-7" aria-hidden /></span>
        <p className="mt-4 text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Beat my score</p>
        <h1 className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">{challenge.by} scored <span className="font-num">{challenge.score}</span> out of <span className="font-num">{challenge.max}</span></h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{challenge.title} · {challenge.ids.length} questions. Take the same questions in the real exam interface and see if you can beat it.</p>
        {isInitialized && missing ? <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">{missing} question{missing === 1 ? "" : "s"} from this set aren&apos;t in your paper&apos;s bank, so you&apos;ll get the {available.length} that are.</p> : null}
        <button type="button" onClick={start} disabled={busy || !isInitialized || available.length < 3} className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-8 text-sm font-bold text-white shadow-lg shadow-violet-500/30 disabled:opacity-60 cursor-pointer">
          {busy || !isInitialized ? <><Loader2 className="h-4 w-4 animate-spin" /> {busy ? "Starting…" : "Loading questions…"}</> : !user && available.length > GUEST_MAX ? "Sign in to take the challenge" : "Take the challenge"}
        </button>
        {!isInitialized ? null : available.length < 3 ? <p className="mt-3 text-xs text-rose-500">These questions aren&apos;t available for your paper. Switch your branch in Profile if this challenge was for another paper.</p> : null}
      </section>
    </div>
  );
}

export default function ChallengePage() {
  return <Suspense fallback={null}><ChallengeInner /></Suspense>;
}
