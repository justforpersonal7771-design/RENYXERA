"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useDataStore } from "@/store/use-data-store";
import { useExamStore } from "@/store/use-exam-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import type { ExamSessionDraft } from "@/types/exam.types";

const COUNT = 8;
const RANK: Record<string, number> = { Easy: 0, Moderate: 1, Medium: 1, Hard: 2 };

/** /checkpoint?topic=… — a short warm-up-to-stretch ladder (easy → hard) on one topic. */
function CheckpointInner() {
  const router = useRouter();
  const topic = useSearchParams().get("topic") ?? "";
  const isInitialized = useDataStore((s) => s.isInitialized);
  const [empty, setEmpty] = useState(false);
  const started = useRef(false);

  useEffect(() => { useDataStore.getState().loadRepository(); }, []);
  useEffect(() => {
    if (!isInitialized || started.current || !topic) return;
    started.current = true;
    const pool = QuestionRepository.getQuestionsByTopic(topic).filter((q) => !(q as { isAiGenerated?: boolean }).isAiGenerated);
    if (pool.length === 0) { setEmpty(true); return; }
    // Spread across the difficulty ladder: shuffle, then take the easiest-first slice of a balanced pick.
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, COUNT).sort((a, b) => (RANK[a.difficulty] ?? 1) - (RANK[b.difficulty] ?? 1));
    const draft: ExamSessionDraft = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      config: { examType: "TOPIC_TEST", subject: picked[0].subject, topics: [topic], questionCount: picked.length },
      questions: picked.map((q, i) => ({ questionId: q.question_id, sequence: i + 1 })),
      createdAt: new Date().toISOString(),
    };
    useExamStore.getState().loadDraft(draft.id, draft);
    void useExamRuntimeStore.getState().startSession(draft).then(() => router.push("/exam/session")).catch(() => setEmpty(true));
  }, [isInitialized, topic, router]);

  if (!topic || empty) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <p className="font-bold text-[var(--text-primary)]">{topic ? `No questions tagged "${topic}" yet.` : "Pick a topic to start a checkpoint."}</p>
        <Link href="/setup" className="mt-3 inline-block text-sm font-bold text-violet-600 dark:text-violet-400 hover:underline">Open Exam Setup →</Link>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-[var(--text-secondary)]" role="status">
      <Loader2 className="h-5 w-5 animate-spin" /> Building your {COUNT}-question checkpoint on {topic}…
    </div>
  );
}

export default function CheckpointPage() {
  return <Suspense fallback={null}><CheckpointInner /></Suspense>;
}
