"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { useExamStore } from "@/store/use-exam-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import type { ExamSessionDraft } from "@/types/exam.types";

// GATE's shape: 10 General Aptitude + 6 Maths + 49 core = 65 questions, in that order.
const SHAPE = { ga: 10, maths: 6, core: 49 } as const;
const kind = (section: string) => (/^GENERAL/i.test(section) ? "ga" : /MATH/i.test(section) ? "maths" : "core");
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

/** /fresh-mock — a new full-length 65-question paper from the official bank every time you open it. */
export default function FreshMockPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const openAuth = useAuthModalStore((s) => s.open);
  const isInitialized = useDataStore((s) => s.isInitialized);
  const [problem, setProblem] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => { useDataStore.getState().loadRepository(); }, []);
  useEffect(() => { if (!loading && !user) openAuth("login"); }, [loading, user, openAuth]);
  useEffect(() => {
    if (!user || !isInitialized || started.current) return;
    started.current = true;
    const pool = QuestionRepository.getAllQuestions().filter((q) => !(q as { isAiGenerated?: boolean }).isAiGenerated);
    const groups = { ga: [] as typeof pool, maths: [] as typeof pool, core: [] as typeof pool };
    for (const q of pool) groups[kind(q.section)].push(q);
    const picked = (Object.keys(SHAPE) as (keyof typeof SHAPE)[]).flatMap((k) => shuffle(groups[k]).slice(0, SHAPE[k]));
    if (picked.length < 20) { setProblem("There aren't enough questions for a full mock in this branch yet."); return; }
    const draft: ExamSessionDraft = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      config: { examType: "CUSTOM_TEST", questionCount: picked.length },
      questions: picked.map((q, i) => ({ questionId: q.question_id, sequence: i + 1 })),
      createdAt: new Date().toISOString(),
    };
    useExamStore.getState().loadDraft(draft.id, draft);
    void useExamRuntimeStore.getState().startSession(draft).then(() => router.push("/exam/session")).catch(() => setProblem("Couldn't start the mock. Try again from Exam Setup."));
  }, [user, isInitialized, router]);

  if (problem) {
    return <div className="mx-auto max-w-md py-20 text-center"><p className="font-bold text-[var(--text-primary)]">{problem}</p><Link href="/setup" className="mt-3 inline-block text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">Open Exam Setup →</Link></div>;
  }
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-[var(--text-secondary)]" role="status">
      <Loader2 className="h-5 w-5 animate-spin" /> {user ? "Building a fresh full-length mock…" : "Sign in to start a full-length mock."}
    </div>
  );
}
