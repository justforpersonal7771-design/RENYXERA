import { Clock } from "lucide-react";

const SPLIT = [
  { label: "General Aptitude", min: 20, tone: "from-sky-500 to-cyan-500", note: "10 questions, 15 marks. Quick wins, so bank them first." },
  { label: "Maths", min: 30, tone: "from-indigo-500 to-violet-500", note: "About 6 questions. Skip any that need long working and return later." },
  { label: "Core subject", min: 100, tone: "from-violet-600 to-fuchsia-600", note: "Most of the marks. About 2 minutes for a 1-mark and 3 for a 2-mark question." },
  { label: "Final review", min: 30, tone: "from-amber-400 to-orange-500", note: "Re-check marked questions, NATs and sign mistakes." },
];

/** A simple way to split the 180 minutes of a full paper. Shown on the Mocks page; it is advice, not a rule. */
export function TimeSplitTips() {
  const total = SPLIT.reduce((n, s) => n + s.min, 0);
  return (
    <section aria-label="How to split 180 minutes" className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
      <h2 className="inline-flex items-center gap-2 font-extrabold text-[var(--text-primary)]"><Clock className="h-4 w-4 text-violet-500" aria-hidden /> How to split your 180 minutes</h2>
      <div className="mt-3 flex h-8 w-full overflow-hidden rounded-xl text-[11px] font-bold text-white" aria-hidden>
        {SPLIT.map((s) => <span key={s.label} className={`flex items-center justify-center bg-gradient-to-r ${s.tone} min-w-0 truncate px-1`} style={{ width: `${(s.min / total) * 100}%` }}>{s.min}m</span>)}
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {SPLIT.map((s) => <li key={s.label} className="rounded-xl bg-[var(--surface-secondary)]/60 px-3 py-2"><p className="text-sm font-extrabold text-[var(--text-primary)]">{s.label} · {s.min} min</p><p className="text-xs text-[var(--text-secondary)]">{s.note}</p></li>)}
      </ul>
      <p className="mt-3 text-xs text-[var(--text-muted)]">Do a first pass for the questions you are sure of, mark the doubtful ones, and use the review time on those. Wrong answers in a 1-mark MCQ cost ⅓ mark and in a 2-mark MCQ ⅔ mark, so don&apos;t guess blindly.</p>
    </section>
  );
}
