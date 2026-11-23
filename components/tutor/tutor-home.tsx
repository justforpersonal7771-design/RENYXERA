"use client";

/**
 * AI Tutor home: the same working screen as the Mentor chat, for questions. A history of your Tutor chats on the left, a heading and one search box
 * in the middle, and under it the questions worth being taught: the ones you got wrong and the ones you bookmarked. Picking one opens the
 * Tutor workspace for that question (/ai-tutor?qid=...). The Mentor/Tutor switch sits at the right end of the header, where it is on every other screen.
 */
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bookmark, ChevronRight, ClipboardX, GraduationCap, Search, Trash2 } from "lucide-react";
import { MentorSwitch, TutorHeaderTail } from "@/components/mentor/mentor-switch";
import { MenuSelect, MentorComposer } from "@/components/mentor/mentor-composer";
import { TutorHistoryMenu, nameOf, plain, type Row } from "@/components/mentor/tutor-history";
import { ConversationMemory } from "@/lib/ai/memory/ConversationMemory";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { useStudyStore } from "@/store/use-study-store";
import { useDataStore } from "@/store/use-data-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { AI_DAILY } from "@/lib/billing/plans";
import { openUpgrade } from "@/store/use-upgrade-modal-store";
import { istDateStr } from "@/lib/time/ist";

const short = (t: string, n = 150) => { const s = (t ?? "").replace(/\s+/g, " ").replace(/\[IMAGE_[^\]]*\]/g, "[figure]").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const DIFF = { Easy: "mint", Moderate: "butter", Medium: "butter", Hard: "rose" } as Record<string, string>;
const dayGap = (iso: string) => Math.round((Date.parse(istDateStr()) - Date.parse(istDateStr(new Date(iso)))) / 864e5);

/** The Tutor's chat history as a left rail, in the same frame as the Mentor's chat list. */
function TutorSidebar({ onNew }: { onNew: () => void }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [term, setTerm] = useState("");
  const load = useCallback(() => { ConversationMemory.listConversations().then(setRows).catch(() => setRows([])); }, []);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads this device's saved chats once after mount
  useEffect(() => { load(); }, [load]);
  const shown = (rows ?? []).filter((r) => !term.trim() || `${nameOf(r.questionId)} ${r.lastText} ${r.lastUser ?? ""}`.toLowerCase().includes(term.trim().toLowerCase()));
  const groups = [
    { h: "Today", items: shown.filter((r) => dayGap(r.updatedAt) <= 0) },
    { h: "Previous 7 days", items: shown.filter((r) => dayGap(r.updatedAt) > 0 && dayGap(r.updatedAt) <= 7) },
    { h: "Older", items: shown.filter((r) => dayGap(r.updatedAt) > 7) },
  ].filter((g) => g.items.length);
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2 px-1 pt-1"><GraduationCap className="h-5 w-5 text-[var(--text-primary)]" aria-hidden /><p className="font-display text-lg font-extrabold text-[var(--text-primary)]">AI Tutor</p></div>
      <button type="button" onClick={onNew} className="btn-main !h-12 justify-center"><Search className="h-4 w-4" aria-hidden /> Find a question</button>
      <label className="flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 focus-within:border-[var(--tint-sky-ink)]">
        <Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden />
        <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search Tutor chats" aria-label="Search Tutor chats" className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" />
      </label>
      <div className="custom-scrollbar -mx-1 min-h-0 flex-1 space-y-3 overflow-y-auto px-1">
        {rows === null ? <p className="px-2 text-sm text-[var(--text-secondary)]">Loading…</p>
          : groups.length === 0 ? <p className="px-2 text-sm text-[var(--text-secondary)]">{term.trim() ? "No chat matches." : "Questions you go through with the Tutor will be listed here."}</p>
          : groups.map((g) => (
            <section key={g.h} aria-label={g.h}>
              <p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">{g.h}</p>
              <ul className="space-y-0.5">{g.items.map((r) => (
                <li key={r.questionId} className="group flex items-center rounded-xl hover:bg-[var(--surface)]">
                  <Link href={`/ai-tutor?qid=${encodeURIComponent(r.questionId)}`} className="min-w-0 flex-1 px-2.5 py-2">
                    <span className="block truncate text-sm font-bold text-[var(--text-primary)]">{nameOf(r.questionId)}</span>
                    <span className="block truncate text-xs text-[var(--text-secondary)]">{r.lastUser ? `You: ${plain(r.lastUser)}` : plain(r.lastText).slice(0, 90)}</span>
                  </Link>
                  <button type="button" aria-label={`Delete the chat for ${nameOf(r.questionId)}`} title="Delete this chat" onClick={() => { void ConversationMemory.clearConversation(r.questionId).then(load); }} className="mr-1 grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full text-[var(--text-muted)] hover:text-rose-600 lg:opacity-0 lg:focus:opacity-100 lg:group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button>
                </li>
              ))}</ul>
            </section>
          ))}
      </div>
    </div>
  );
}

type Item = { id: string; text: string; meta: string; extra?: string };
function Lane({ icon: Icon, title, items, empty, emptyHref, emptyLabel, onOpen, more }: { icon: typeof Bookmark; title: string; items: Item[]; empty: string; emptyHref: string; emptyLabel: string; onOpen: (id: string) => void; more: string }) {
  return (
    <section aria-label={title} className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3 px-1">
        <h2 className="flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]"><Icon className="h-4 w-4" aria-hidden /> {title}</h2>
        {items.length > 0 && <Link href={more} className="text-xs font-bold text-[var(--text-secondary)] underline-offset-2 hover:text-[var(--text-primary)] hover:underline">See all</Link>}
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl bg-[var(--surface)] px-4 py-3"><p className="text-sm text-[var(--text-secondary)]">{empty}</p><Link href={emptyHref} className="mt-2 inline-block text-sm font-bold text-[var(--text-primary)] underline underline-offset-2">{emptyLabel}</Link></div>
      ) : (
        <ul className="space-y-1.5">{items.map((i) => (
          <li key={i.id}><button type="button" onClick={() => onOpen(i.id)} className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 text-left transition hover:shadow-[0_10px_24px_-16px_rgba(12,34,75,.5)]">
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{i.text}</span><span className="block truncate text-xs text-[var(--text-secondary)]">{i.meta}{i.extra ? ` · ${i.extra}` : ""}</span></span>
            <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button></li>
        ))}</ul>
      )}
    </section>
  );
}

export function TutorHome() {
  const router = useRouter();
  const { mistakes, bookmarks } = useStudyStore();
  const { tier, loading } = useEntitlements();
  const { isInitialized, totalQuestions } = useDataStore();
  const locked = !loading && tier === "free";
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const dq = useDeferredValue(q);
  const boxRef = useRef<HTMLDivElement>(null);
  const open = (id: string) => router.push(`/ai-tutor?qid=${encodeURIComponent(id)}`);
  const focusSearch = () => { const ta = boxRef.current?.querySelector("textarea"); ta?.focus(); ta?.scrollIntoView({ block: "center", behavior: "smooth" }); };

  // the bank loads once at app start (and again when Spark adds questions); re-read when it is ready
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const all = useMemo(() => (isInitialized ? QuestionRepository.getAllQuestions() : []), [isInitialized, totalQuestions]);
  const subjects = useMemo(() => [...new Set(all.map((x) => x.subject).filter(Boolean))].sort(), [all]);
  const results = useMemo(() => {
    const term = dq.trim().toLowerCase();
    if (!term && subject === "all") return [];
    return all.filter((x) => (subject === "all" || x.subject === subject)
      && (!term || x.question_id.toLowerCase().includes(term) || x.topic?.toLowerCase().includes(term) || x.questionTextRaw?.toLowerCase().includes(term))).slice(0, 8);
  }, [all, dq, subject]);
  const pending = useMemo(() => mistakes.filter((m) => !m.mastered).sort((a, b) => (b.occurrences ?? 1) - (a.occurrences ?? 1)).slice(0, 4), [mistakes]);
  const marked = useMemo(() => [...bookmarks].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "")).slice(0, 4), [bookmarks]);
  const text = (id: string) => short(QuestionRepository.getQuestionById(id)?.questionTextRaw ?? "");
  const searching = q.trim() !== "" || subject !== "all";

  return (
    <div className="flex min-h-0 w-full gap-3" data-fill-height="always">
      <aside aria-label="Tutor chats" className="mentor-side hidden w-[284px] shrink-0 overflow-hidden p-3 lg:block"><TutorSidebar onNew={focusSearch} /></aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <div className="lg:hidden"><TutorHistoryMenu /></div>
          <h1 className="min-w-0 flex-1 truncate font-display text-xl font-extrabold text-[var(--text-primary)] max-sm:sr-only">Teach me a question</h1>
          <MentorSwitch active="tutor" />
          <TutorHeaderTail onFind={focusSearch} />
        </div>

        <section className="custom-scrollbar relative min-h-0 flex-1 overflow-y-auto pr-1" aria-label="Find a question">
          <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center gap-5 px-1 py-4">
            <div>
              <h2 className="text-center font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">Which question shall we go through?</h2>
              <p className="mx-auto mt-2 max-w-xl text-center text-[var(--text-secondary)]">The Tutor teaches one GATE question at a time: the idea, every step, the formulas and a shortcut. Then ask it anything about that question.</p>
            </div>

            <div ref={boxRef}>
              <MentorComposer value={q} onChange={setQ} onSubmit={() => { if (results[0]) open(results[0].question_id); }} busy={false} onStop={() => {}}
                placeholder="Search a topic or a question" label="Search questions" maxLength={200}>
                <MenuSelect label="Subject" value={subject} options={[{ id: "all", label: "All subjects" }, ...subjects.map((s) => ({ id: s, label: s }))]} onChange={setSubject} />
              </MentorComposer>
              <p className="mt-2 text-center text-xs text-[var(--text-secondary)]">
                {locked ? <>Tutor explanations come with Plus and Pro. <button type="button" onClick={() => openUpgrade("Plus and Pro plans")} className="cursor-pointer font-bold underline underline-offset-2">See plans</button></>
                  : <>{AI_DAILY[tier]} AI requests a day on your plan. Each explanation, follow-up or practice set uses one.</>}
              </p>
            </div>

            {searching ? (
              results.length > 0 ? (
                <ul className="space-y-1.5" aria-label="Matching questions">{results.map((r) => (
                  <li key={r.question_id}><button type="button" onClick={() => open(r.question_id)} className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-[var(--surface)] px-4 py-3 text-left transition hover:shadow-[0_10px_24px_-16px_rgba(12,34,75,.5)]">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-[var(--text-primary)]">{short(r.questionTextRaw, 130)}</span>
                      <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <span>{r.subject} · {r.topic}</span>
                        <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: `var(--tint-${DIFF[String(r.difficulty)] ?? "sky"})`, color: `var(--tint-${DIFF[String(r.difficulty)] ?? "sky"}-ink)` }}>{String(r.difficulty)}</span>
                        <span>{r.marks} {r.marks === 1 ? "mark" : "marks"}</span>
                      </span>
                    </span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </button></li>
                ))}</ul>
              ) : <p className="rounded-2xl bg-[var(--surface)] px-4 py-3 text-center text-sm text-[var(--text-secondary)]">No question matches. Try another word or subject.</p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                <Lane icon={ClipboardX} title="Questions you got wrong" empty="No mistakes yet. Take a short test and the ones you miss show up here."
                  emptyHref="/setup" emptyLabel="Take a test" more="/mistakes" onOpen={open}
                  items={pending.map((m) => ({ id: m.questionId, text: text(m.questionId) || `${m.subject}: ${m.topic}`, meta: `${m.subject} · ${m.topic}`, extra: (m.occurrences ?? 1) > 1 ? `missed ${m.occurrences} times` : "missed once" }))} />
                <Lane icon={Bookmark} title="Your bookmarks" empty="Nothing bookmarked yet. Bookmark a question while practising and ask the Tutor about it here."
                  emptyHref="/setup" emptyLabel="Start practising" more="/bookmarks" onOpen={open}
                  items={marked.map((b) => ({ id: b.questionId, text: text(b.questionId) || `${b.subject}: ${b.topic}`, meta: `${b.subject} · ${b.topic}`, extra: b.tags?.[0] }))} />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
