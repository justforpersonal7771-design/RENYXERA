"use client";
/**
 * AI practice inside the Mentor: pick a topic (your weakest by default), generate an 8-question GATE-style set with the same generator
 * as Spark and the Tutor, answer it here, see the explanation, and save the set so it shows up in Exam Setup (Spark) and the Tutor.
 * Every finished set is logged (on this device) and summarised in the Mentor's brief.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { PracticeGenerator } from "@/lib/ai/practice-generator";
import { savePracticeSet } from "@/lib/ai/save-practice-set";
import { CustomDropdown } from "@/components/ui/custom-dropdown";
import { toLocalDateStr } from "@/lib/utils";
import type { AIPracticeQuestion } from "@/types/ai.types";
import { useMemoryKey } from "@/components/mentor/mentor-extras";

export interface PracticeLog { date: string; topic: string; correct: number; total: number }
export const practiceBriefLine = (log: PracticeLog[]): string | null => {
  const wk = log.filter((l) => l.date >= toLocalDateStr(new Date(Date.now() - 13 * 86400000)));
  if (!wk.length) return null;
  const c = wk.reduce((a, l) => a + l.correct, 0), t = wk.reduce((a, l) => a + l.total, 0);
  return `AI practice sets in the last 14 days: ${wk.length}, ${c} of ${t} correct. Topics: ${[...new Set(wk.map((l) => l.topic))].slice(0, 4).join(", ")}.`;
};

type Ans = { picked: string[]; nat: string; done: boolean; ok: boolean };
const isRight = (q: AIPracticeQuestion, a: Ans) => {
  if (q.questionType === "NAT") { const v = parseFloat(a.nat); return !isNaN(v) && !!q.natAnswerRange && v >= q.natAnswerRange.min && v <= q.natAnswerRange.max; }
  const want = [...(q.correctOptionIds ?? [])].sort().join(); return want.length > 0 && [...a.picked].sort().join() === want;
};

export function AiPracticePanel({ topics, subjects }: { topics: { topic: string; subject: string }[]; subjects: string[] }) {
  const options = useMemo(() => topics.map((t) => ({ label: `${t.topic}`, value: `${t.subject}||${t.topic}` })), [topics]);
  const [sel, setSel] = useState(options[0]?.value ?? "");
  const [set, setSet] = useState<AIPracticeQuestion[] | null>(null);
  const [ans, setAns] = useState<Record<number, Ans>>({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [saved, setSaved] = useState(false);
  const [log, setLog] = useMemoryKey<PracticeLog[]>("mentor_practice", []);
  const [subject, topic] = (sel || options[0]?.value || "").split("||");

  const gen = async () => {
    if (!topic) { setErr("Take a test first so I know which topic to use."); return; }
    setBusy(true); setErr(""); setSet(null); setAns({}); setSaved(false);
    try {
      const s = await PracticeGenerator.generateDiversePracticeSet(topic, subject, true);
      if (!s.length) setErr("I could not make a set right now. Try again in a moment, or check your plan's daily AI limit.");
      else setSet(s);
    } catch (e) { setErr((e as Error).message || "Something went wrong."); } finally { setBusy(false); }
  };
  const pick = (i: number, id: string, multi: boolean) => setAns((a) => {
    const c = a[i] ?? { picked: [], nat: "", done: false, ok: false }; if (c.done) return a;
    return { ...a, [i]: { ...c, picked: multi ? (c.picked.includes(id) ? c.picked.filter((x) => x !== id) : [...c.picked, id]) : [id] } };
  });
  const check = (i: number) => setAns((a) => { const c = a[i]; if (!c || c.done || !set) return a; return { ...a, [i]: { ...c, done: true, ok: isRight(set[i], c) } }; });
  const done = set ? Object.values(ans).filter((a) => a.done).length : 0;
  const correct = Object.values(ans).filter((a) => a.done && a.ok).length;
  const finish = () => { if (!set) return; setLog([...log, { date: toLocalDateStr(), topic, correct, total: done }].slice(-60)); };
  const save = async () => { if (!set) return; await savePracticeSet(set, subject, topic); setSaved(true); };

  return (
    <section className="card-pastel p-5" data-tint="rose" aria-label="AI practice">
      <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--text-primary)]"><Sparkles className="h-5 w-5" /> Practise with AI questions</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">A fresh set on a topic you pick, like Spark in Exam Setup. Plus and Pro have a daily limit on sets.</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {options.length > 0 ? <CustomDropdown value={sel || options[0].value} onChange={setSel} options={options} className="w-full text-sm sm:w-80" /> : <p className="text-sm text-[var(--text-muted)]">Take a test and I will suggest topics. ({subjects.length} subjects known)</p>}
        <button type="button" onClick={gen} disabled={busy || !options.length} className="btn-main !h-11 !text-sm disabled:opacity-50">{busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Making your set</> : "Make 8 questions"}</button>
      </div>
      {err && <p className="mt-3 rounded-xl bg-[var(--tint-butter)] px-3 py-2 text-sm text-[var(--tint-butter-ink)]">{err} <Link href="/pro" className="font-bold underline">See plans</Link></p>}
      {set && (
        <div className="mt-4 space-y-4">
          {set.map((q, i) => {
            const a = ans[i] ?? { picked: [], nat: "", done: false, ok: false }; const multi = q.questionType === "MSQ";
            return (
              <div key={i} className="rounded-2xl bg-[var(--surface)] p-4">
                <p className="text-xs font-bold text-[var(--text-muted)]">Q{i + 1} · {q.difficulty} · {q.questionType}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-[var(--text-primary)]">{q.questionText.replace(/\\\(|\\\)|\\\[|\\\]/g, "")}</p>
                {q.questionType === "NAT" ? (
                  <input value={a.nat} disabled={a.done} onChange={(e) => setAns((x) => ({ ...x, [i]: { ...a, nat: e.target.value } }))} inputMode="decimal" placeholder="Your answer" aria-label={`Answer for question ${i + 1}`} className="mt-2 h-10 w-40 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-3 text-sm" />
                ) : (
                  <ul className="mt-2 space-y-1.5">
                    {(q.options ?? []).map((o) => {
                      const on = a.picked.includes(o.option_id), right = (q.correctOptionIds ?? []).includes(o.option_id);
                      return (
                        <li key={o.option_id}><button type="button" onClick={() => pick(i, o.option_id, multi)} aria-pressed={on}
                          className={`opt-tile flex w-full cursor-pointer items-start gap-2 rounded-xl border-2 px-3 py-2 text-left text-sm ${a.done && right ? "border-[var(--tint-mint-ink)] bg-[var(--tint-mint)]" : a.done && on ? "border-[var(--tint-rose-ink)] bg-[var(--tint-rose)]" : on ? "border-[var(--tint-sky-ink)] bg-[var(--tint-sky)]" : "border-[var(--border)]"}`}>
                          <span className="font-bold">{o.option_id}</span><span className="min-w-0 flex-1">{o.content.replace(/\\\(|\\\)/g, "")}</span>
                          {a.done && right && <Check className="h-4 w-4 text-[var(--tint-mint-ink)]" />}{a.done && on && !right && <X className="h-4 w-4 text-[var(--tint-rose-ink)]" />}
                        </button></li>
                      );
                    })}
                  </ul>
                )}
                {!a.done ? <button type="button" onClick={() => check(i)} disabled={!(a.picked.length || a.nat)} className="btn-soft mt-3 !h-9 !text-sm disabled:opacity-50">Check</button>
                  : <p className="mt-3 rounded-xl bg-[var(--surface-secondary)] p-3 text-sm"><b className={a.ok ? "text-[var(--tint-mint-ink)]" : "text-[var(--tint-rose-ink)]"}>{a.ok ? "Correct. " : "Not quite. "}</b>{q.explanation.replace(/\\\(|\\\)|\\\[|\\\]/g, "")}</p>}
              </div>
            );
          })}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{done} of {set.length} done, {correct} correct</span>
            <button type="button" onClick={finish} disabled={done === 0} className="pill-ink cursor-pointer !px-3 !py-1.5 text-xs disabled:opacity-50">Tell the Mentor how I did</button>
            <button type="button" onClick={save} disabled={saved} className="pill-soft cursor-pointer text-xs">{saved ? "Saved to Spark" : "Save these to Spark"}</button>
          </div>
        </div>
      )}
    </section>
  );
}
