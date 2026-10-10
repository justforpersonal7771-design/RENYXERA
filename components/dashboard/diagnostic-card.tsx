"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Loader2, Play, RefreshCw, Target } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useExamStore } from "@/store/use-exam-store";
import { useExamRuntimeStore } from "@/store/use-exam-runtime-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { track } from "@/lib/growth/track";
import type { ExamSessionDraft } from "@/types/exam.types";

const KEY = "renyxera.goals";
const COUNT = 20;
const DAYS = [3, 5, 7];
const NEXT = [
  { icon: Play, title: "Sit the 20-question set", body: "Real GATE questions mixed across subjects — about 30 minutes." },
  { icon: BarChart3, title: "See where you stand", body: "Accuracy and weak topics appear on your dashboard straight away." },
  { icon: RefreshCw, title: "Get a daily plan", body: "Wrong answers turn into a revision queue and daily missions." },
];

/** Round-robin across subjects so 20 questions touch as many subjects as possible. */
function pickDiagnostic(): string[] {
  const pool = QuestionRepository.getAllQuestions().filter((q) => !(q as { isAiGenerated?: boolean }).isAiGenerated);
  const bySubject = new Map<string, string[]>();
  for (const q of pool) {
    const l = bySubject.get(q.subject) ?? [];
    l.push(q.question_id);
    bySubject.set(q.subject, l);
  }
  const lists = [...bySubject.values()].map((l) => l.sort(() => Math.random() - 0.5)).sort(() => Math.random() - 0.5);
  const out: string[] = [];
  for (let i = 0; out.length < COUNT && lists.some((l) => l.length > i); i++) {
    for (const l of lists) if (l[i] && out.length < COUNT) out.push(l[i]);
  }
  return out;
}

/**
 * First-run setup for a learner with no attempts yet: a weekly study goal, an optional target
 * rank, and a 20-question diagnostic that fills the dashboard (weak topics, accuracy) after one sitting.
 * Goals are kept on this device for now (no profile column yet).
 */
export function DiagnosticCard({ solved }: { solved: number }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [days, setDays] = useState(5);
  const [air, setAir] = useState("");
  const [busy, setBusy] = useState(false);

  const profile = useAuthStore((s) => s.profile) as ({ weekly_study_days?: number | null; target_air?: number | null } | null);
  useEffect(() => {
    // Saved on the account (migration 0036) wins over this device's copy.
    if (profile?.weekly_study_days) setDays(profile.weekly_study_days);
    if (profile?.target_air) setAir(String(profile.target_air));
    try {
      const g = JSON.parse(localStorage.getItem(KEY) || "null");
      if (g?.days) setDays(g.days);
      if (g?.air) setAir(String(g.air));
    } catch { /* storage unavailable */ }
  }, []);

  if (!user || solved > 0) return null;

  const start = async () => {
    const ids = pickDiagnostic();
    if (ids.length === 0) return;
    setBusy(true);
    try {
      try { localStorage.setItem(KEY, JSON.stringify({ days, air: air ? Number(air) : null })); } catch { /* ignore */ }
      // Also save to the account so the goals follow the learner to other devices (a no-op until migration 0036 is run).
      if (user) void import("@/lib/supabase/client").then(({ createClient }) => createClient().from("profiles").update({ weekly_study_days: days, target_air: air ? Number(air) : null }).eq("id", user.id)).catch(() => null);
      const draft: ExamSessionDraft = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        config: { examType: "CUSTOM_TEST", questionCount: ids.length },
        questions: ids.map((questionId, i) => ({ questionId, sequence: i + 1 })),
        createdAt: new Date().toISOString(),
      };
      useExamStore.getState().loadDraft(draft.id, draft);
      track("test_started", null, "diagnostic");
      await useExamRuntimeStore.getState().startSession(draft);
      router.push("/exam/session");
    } catch {
      setBusy(false);
    }
  };

  return (
    <section aria-label="Start here" className="grid gap-6 rounded-2xl border border-violet-500/25 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
<div>
      <p className="text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400">Start here · 2 minutes to set up</p>
      <h2 className="mt-1 text-xl font-extrabold text-[var(--text-primary)]">Find your starting point</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-2xl">Set a weekly goal, then take a {COUNT}-question mixed set. Your dashboard fills with your weak topics and accuracy as soon as you finish.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 max-w-2xl">
        <div>
          <p className="text-xs font-bold text-[var(--text-secondary)] mb-1.5">Study days per week</p>
          <div className="flex gap-2" role="radiogroup" aria-label="Study days per week">
            {DAYS.map((d) => (
              <button key={d} type="button" role="radio" aria-checked={days === d} onClick={() => setDays(d)}
                className={`h-10 flex-1 rounded-xl border text-sm font-bold cursor-pointer transition ${days === d ? "border-violet-600 bg-violet-600 text-white" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-violet-500/50"}`}>{d} days</button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className="block text-xs font-bold text-[var(--text-secondary)] mb-1.5">Target rank (AIR), optional</span>
          <span className="flex items-center gap-2 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 focus-within:border-violet-500">
            <Target className="h-4 w-4 text-violet-500" aria-hidden />
            <input inputMode="numeric" value={air} onChange={(e) => setAir(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="e.g. 500"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" />
          </span>
        </label>
      </div>
      <button type="button" onClick={start} disabled={busy}
        className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 text-sm font-bold text-white shadow-md shadow-violet-500/30 disabled:opacity-80 cursor-pointer">
        {busy ? <>Starting… <Loader2 className="h-4 w-4 animate-spin" /></> : <>Start the {COUNT}-question diagnostic <Play className="h-4 w-4 fill-current" /></>}
      </button>
</div>
      <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1" aria-label="What happens next">
        {NEXT.map((s, i) => (
          <li key={s.title} className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400"><s.icon className="h-4 w-4" aria-hidden /></span>
            <span className="min-w-0"><span className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Step {i + 1}</span><span className="block text-sm font-bold text-[var(--text-primary)]">{s.title}</span><span className="block text-xs text-[var(--text-secondary)] leading-relaxed">{s.body}</span></span>
          </li>
        ))}
      </ol>
    </section>
  );
}
