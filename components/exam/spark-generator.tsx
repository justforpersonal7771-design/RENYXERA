"use client";

/**
 * Spark: make a fresh set of AI questions from Exam Setup itself. Pick subject and topic and how many sets;
 * each set is 8 questions (graded Easy -> Hard, with MCQ, MSQ and NAT) and uses one AI request from the daily
 * plan limit, which the server enforces. Free: locked (practice sets come with Plus and Pro, as in the AI Tutor).
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, Lock, Sparkles } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { AI_DAILY } from "@/lib/billing/plans";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { PracticeGenerator } from "@/lib/ai/practice-generator";
import { savePracticeSet } from "@/lib/ai/save-practice-set";
import { useToastStore } from "@/store/use-toast-store";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { Segmented } from "@/components/ui/folder-tabs";

const PER_SET = 8;

export function SparkGenerator({ onMade }: { onMade?: (n: number) => void }) {
  const { tier, loading } = useEntitlements();
  const map = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const q of QuestionRepository.getAllQuestions()) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((q as any).isAiGenerated || !q.subject || !q.topic) continue;
      if (!m.has(q.subject)) m.set(q.subject, new Set());
      m.get(q.subject)!.add(q.topic);
    }
    return m;
  }, []);
  const subjects = [...map.keys()].sort();
  const [subject, setSubject] = useState(subjects[0] ?? "");
  const topics = [...(map.get(subject) ?? [])].sort();
  const [topic, setTopic] = useState("");
  const [sets, setSets] = useState<"1" | "2" | "3">("1");
  const [busy, setBusy] = useState(false);
  const daily = AI_DAILY[tier];
  const locked = !loading && tier === "free";
  const t = topic && topics.includes(topic) ? topic : topics[0] ?? "";

  const make = async () => {
    if (!subject || !t) return;
    setBusy(true);
    let made = 0;
    try {
      for (let i = 0; i < Number(sets); i++) {
        const set = await PracticeGenerator.generateDiversePracticeSet(t, subject, true);
        if (!set.length) break;
        made += await savePracticeSet(set, subject, t);
      }
      useToastStore.getState().show(made ? `Made ${made} new questions on ${t}.` : "No questions came back. Try again in a moment.", made ? "success" : "info");
      if (made) onMade?.(made);
    } catch {
      useToastStore.getState().show("Couldn't make the set. Your daily AI limit may be used up; try again tomorrow.", "info");
    } finally { setBusy(false); }
  };

  return (
    <section className="card-pastel p-5 sm:p-6" data-tint="butter" aria-label="Make questions with Spark">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-[var(--text-primary)]"><Sparkles className="h-5 w-5" /> Make a fresh set</h2>
          <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">New questions written by AI on the topic you pick, in GATE style. Each set has {PER_SET} questions, from easy to hard, with MCQ, MSQ and NAT.</p>
        </div>
        <span className="rounded-full bg-[var(--surface)] px-3 py-1.5 text-sm font-semibold text-[var(--text-primary)]">{locked ? "Plus and Pro" : `${daily} AI requests a day on your plan`}</span>
      </div>
      {locked ? (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-[var(--surface)] p-4">
          <Lock className="h-5 w-5 text-[var(--tint-butter-ink)]" />
          <p className="flex-1 text-sm text-[var(--text-secondary)]">Making AI question sets comes with Plus ({AI_DAILY.plus} AI requests a day) and Pro ({AI_DAILY.pro} a day).</p>
          <Link href="/pro" className="btn-main">See plans</Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="block"><span className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]">Subject</span>
            <CustomDropdown value={subject} onChange={(v) => { setSubject(v); setTopic(""); }} options={subjects.map((s) => ({ label: s, value: s }))} className="w-full text-sm" /></label>
          <label className="block"><span className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]">Topic</span>
            <CustomDropdown value={t} onChange={setTopic} options={topics.map((x) => ({ label: x, value: x }))} className="w-full text-sm" /></label>
          <div><span className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]">How many</span>
            <Segmented label="Number of sets" value={sets} onChange={setSets} options={[{ id: "1", label: `${PER_SET} Qs` }, { id: "2", label: `${PER_SET * 2} Qs` }, { id: "3", label: `${PER_SET * 3} Qs` }]} /></div>
          <div className="md:col-span-3 flex flex-wrap items-center gap-3">
            <button type="button" onClick={make} disabled={busy || !t} className="btn-main disabled:opacity-60">
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Making questions…</> : <><Sparkles className="h-4 w-4" /> Make {Number(sets) * PER_SET} questions</>}
            </button>
            <span className="text-sm text-[var(--text-secondary)]">Uses {sets} of your {daily} AI requests today. Questions are saved on this device and appear below, ready for a test.</span>
          </div>
        </div>
      )}
    </section>
  );
}
