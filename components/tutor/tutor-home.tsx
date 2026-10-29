"use client";

/**
 * AI Tutor home: shown when the Tutor is opened without a question. The student picks what to be tutored on:
 * a question they got wrong, one they bookmarked, anything from the bank by search or subject, or the Forge/Spark
 * question they just made. Picking one opens the Tutor workspace for that question (/ai-tutor?qid=...).
 */
import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, BrainCircuit, ChevronRight, ClipboardX, FlaskConical, Lock, Search, Sparkles, SquareFunction, Zap, ListChecks } from "lucide-react";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { useStudyStore } from "@/store/use-study-store";
import { useDataStore } from "@/store/use-data-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { AI_DAILY } from "@/lib/billing/plans";
import { CustomDropdown } from "@/components/ui/custom-dropdown";

const short = (t: string, n = 150) => { const s = (t ?? "").replace(/\s+/g, " ").replace(/\[IMAGE_[^\]]*\]/g, "[figure]").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const DIFF = { Easy: "mint", Moderate: "butter", Medium: "butter", Hard: "rose" } as Record<string, string>;

const WHAT = [
  { icon: BrainCircuit, tint: "lilac", t: "Concept overview", b: "The idea behind the question in two lines, so you know what is being tested." },
  { icon: ListChecks, tint: "mint", t: "Step-by-step solution", b: "Every step with the rule it uses, and where students usually slip." },
  { icon: SquareFunction, tint: "peri", t: "Formulas", b: "The formulas worth remembering, written out clearly." },
  { icon: Zap, tint: "peach", t: "Shortcut tricks", b: "A faster way for the exam, plus harder, simpler or visual versions on request." },
];

export function TutorHome() {
  const router = useRouter();
  const { mistakes, bookmarks } = useStudyStore();
  const { tier, loading } = useEntitlements();
  const { isInitialized, totalQuestions } = useDataStore();
  const locked = !loading && tier === "free";
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const dq = useDeferredValue(q);
  const open = (id: string) => router.push(`/ai-tutor?qid=${encodeURIComponent(id)}`);

  // the bank loads once at app start (and again when Spark adds questions); re-read when it is ready
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const all = useMemo(() => (isInitialized ? QuestionRepository.getAllQuestions() : []), [isInitialized, totalQuestions]);
  const subjects = useMemo(() => [...new Set(all.map((x) => x.subject).filter(Boolean))].sort(), [all]);
  const results = useMemo(() => {
    const term = dq.trim().toLowerCase();
    if (!term && subject === "all") return [];
    return all.filter((x) => (subject === "all" || x.subject === subject)
      && (!term || x.question_id.toLowerCase().includes(term) || x.topic?.toLowerCase().includes(term) || x.questionTextRaw?.toLowerCase().includes(term)))
      .slice(0, 8);
  }, [all, dq, subject]);

  const pending = useMemo(() => mistakes.filter((m) => !m.mastered).sort((a, b) => (b.occurrences ?? 1) - (a.occurrences ?? 1)).slice(0, 5), [mistakes]);
  const marked = useMemo(() => [...bookmarks].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")).slice(0, 5), [bookmarks]);
  const text = (id: string) => short(QuestionRepository.getQuestionById(id)?.questionTextRaw ?? "");

  return (
    <div className="space-y-5 pb-6">
      <section className="card-pastel p-6 sm:p-8" data-tint="sky" aria-label="AI Tutor">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <span className="section-label"><Sparkles className="h-3.5 w-3.5" /> AI Tutor</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] text-[var(--text-primary)] sm:text-4xl">Pick a question and get it taught.</h1>
            <p className="mt-2 max-w-xl text-[var(--text-secondary)]">The Tutor explains one GATE question at a time: the idea, every step, the formulas and a shortcut. Then ask it anything about that question.</p>
          </div>
          <div className="card-inset space-y-2 p-4">
            <p className="text-sm font-semibold text-[var(--text-secondary)]">Your plan</p>
            {locked ? (
              <>
                <p className="font-display text-lg font-extrabold text-[var(--text-primary)]">Tutor explanations come with Plus and Pro</p>
                <p className="text-sm text-[var(--text-secondary)]">Plus gives {AI_DAILY.plus} AI requests a day, Pro {AI_DAILY.pro}. You can look around here for free.</p>
                <Link href="/pro" className="btn-main mt-1"><Lock className="h-4 w-4" /> See plans</Link>
              </>
            ) : (
              <>
                <p className="font-display text-lg font-extrabold text-[var(--text-primary)]">{AI_DAILY[tier]} AI requests a day</p>
                <p className="text-sm text-[var(--text-secondary)]">Each explanation, follow-up question or practice set uses one request.</p>
              </>
            )}
          </div>
        </div>

        {/* Find any question */}
        <div className="mt-6 rounded-3xl bg-[var(--surface)] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex h-12 min-w-[240px] flex-1 items-center gap-2 rounded-2xl border-2 border-[var(--border)] px-4 focus-within:border-[var(--tint-sky-ink)]">
              <Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
              <input id="tutor-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topic or question"
                className="w-full bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" aria-label="Search questions" />
            </label>
            <CustomDropdown value={subject} onChange={setSubject} options={[{ label: "All subjects", value: "all" }, ...subjects.map((s) => ({ label: s, value: s }))]} className="w-64 text-sm" />
          </div>
          {results.length > 0 ? (
            <ul className="mt-3 grid gap-2" aria-label="Matching questions">
              {results.map((r) => (
                <li key={r.question_id}>
                  <button type="button" onClick={() => open(r.question_id)} className="group flex w-full items-center gap-3 rounded-2xl border border-[var(--border)] p-3 text-left transition hover:border-[var(--text-secondary)]">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[var(--text-primary)]">{short(r.questionTextRaw, 130)}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span>{r.subject} · {r.topic}</span>
                        <span className="rounded-full px-2 py-0.5 font-semibold" style={{ background: `var(--tint-${DIFF[String(r.difficulty)] ?? "sky"})`, color: `var(--tint-${DIFF[String(r.difficulty)] ?? "sky"}-ink)` }}>{String(r.difficulty)}</span>
                        <span>{r.marks} {r.marks === 1 ? "mark" : "marks"}</span>
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-[var(--text-secondary)]">{q.trim() || subject !== "all" ? "No question matches. Try another word or subject." : "Type a topic such as “deadlock”, or choose a subject to see its questions."}</p>
          )}
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <Lane tint="rose" icon={ClipboardX} title="Questions you got wrong" empty="No mistakes yet. Take a short test and the questions you miss show up here to be taught."
          emptyHref="/setup" emptyLabel="Take a test" items={pending.map((m) => ({ id: m.questionId, text: text(m.questionId) || `${m.subject}: ${m.topic}`, meta: `${m.subject} · ${m.topic}`, extra: (m.occurrences ?? 1) > 1 ? `missed ${m.occurrences} times` : "missed once" }))} onOpen={open} more="/mistakes" />
        <Lane tint="butter" icon={Bookmark} title="Your bookmarks" empty="Nothing bookmarked yet. Bookmark any question during practice and ask the Tutor about it later."
          emptyHref="/setup" emptyLabel="Start practising" items={marked.map((b) => ({ id: b.questionId, text: text(b.questionId) || `${b.subject}: ${b.topic}`, meta: `${b.subject} · ${b.topic}`, extra: b.tags?.[0] }))} onOpen={open} more="/bookmarks" />
      </div>

      <section aria-label="What the Tutor gives you">
        <h2 className="mb-3 font-display text-xl font-extrabold text-[var(--text-primary)]">What you get for each question</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {WHAT.map((w) => (
            <div key={w.t} className="card-band p-5 pt-6" data-tint={w.tint}>
              <span className="grid h-10 w-10 place-items-center rounded-2xl" style={{ background: `var(--tint-${w.tint})`, color: `var(--tint-${w.tint}-ink)` }}><w.icon className="h-5 w-5" /></span>
              <p className="mt-3 font-bold text-[var(--text-primary)]">{w.t}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{w.b}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><FlaskConical className="h-4 w-4" /> Questions you make with Spark in Exam Setup also appear in search, so you can ask the Tutor about them.</p>
    </div>
  );
}

function Lane({ tint, icon: Icon, title, items, empty, emptyHref, emptyLabel, onOpen, more }: {
  tint: string; icon: typeof Bookmark; title: string; empty: string; emptyHref: string; emptyLabel: string; more: string;
  items: { id: string; text: string; meta: string; extra?: string }[]; onOpen: (id: string) => void;
}) {
  return (
    <section className="card-pastel p-5" data-tint={tint} aria-label={title}>
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-[var(--text-primary)]"><Icon className="h-5 w-5" /> {title}</h2>
        {items.length > 0 && <Link href={more} className="pill-soft">See all</Link>}
      </div>
      {items.length === 0 ? (
        <div className="mt-3 rounded-2xl bg-[var(--surface)] p-4">
          <p className="text-sm text-[var(--text-secondary)]">{empty}</p>
          <Link href={emptyHref} className="btn-main mt-3">{emptyLabel}</Link>
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((i) => (
            <li key={i.id}>
              <button type="button" onClick={() => onOpen(i.id)} className="group flex w-full items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 text-left transition hover:shadow-[0_10px_24px_-16px_rgba(12,34,75,.5)]">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[var(--text-primary)]">{i.text}</span>
                  <span className="block truncate text-xs text-[var(--text-muted)]">{i.meta}{i.extra ? ` · ${i.extra}` : ""}</span>
                </span>
                <span className="pill-ink shrink-0 !px-3 !py-1 text-xs">Teach me</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
