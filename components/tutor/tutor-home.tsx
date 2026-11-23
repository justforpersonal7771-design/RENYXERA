"use client";

/**
 * AI Tutor question desk. The Tutor never starts from a chat box: you choose a question, look at it in the preview, and only then press "Teach me this question".
 * Left: your Tutor sessions (grouped and sorted like the Mentor's history). Middle: the board, with "Pick by" reasons, filters, a topic heat board or a list, and a
 * queue tray to line several questions up. Right: the preview. A flat workbench, deliberately not the rounded chat card of the Mentor.
 */
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MathJaxContext } from "better-react-mathjax";
import { Bookmark, ClipboardX, Filter, GraduationCap, LayoutGrid, List, ListPlus, NotebookPen, Search, Sparkles, Target, X } from "lucide-react";
import { MentorSwitch } from "@/components/mentor/mentor-switch";
import { TutorHistoryMenu } from "@/components/mentor/tutor-history";
import { HistoryRail, type RailRow } from "@/components/desk/history-rail";
import { DeskModal } from "@/components/desk/modal";
import { ItemActions } from "@/components/desk/item-actions";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import { ConversationMemory } from "@/lib/ai/memory/ConversationMemory";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { useStudyStore } from "@/store/use-study-store";
import { useDataStore } from "@/store/use-data-store";
import { useAnalyticsStore } from "@/store/use-analytics-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { AI_DAILY } from "@/lib/billing/plans";
import { openUpgrade } from "@/store/use-upgrade-modal-store";
import { useNotes, useQueues, newId, nowIso } from "@/lib/desk/stores";
import { tutorHref } from "@/lib/desk/links";
import { useSolvedIds } from "@/components/dashboard/bento";
import { istDateStr } from "@/lib/time/ist";
import { nameOf, plain } from "@/components/mentor/tutor-history";
import type { RenderableQuestion } from "@/types/question.types";

const QUEUE_KEY = "renyxera.tutor.queue";
const mathJax = { loader: { load: ["input/tex", "output/chtml"] }, tex: { inlineMath: [["\\(", "\\)"]], displayMath: [["\\[", "\\]"]] } };
const short = (t: string, n = 150) => { const s = (t ?? "").replace(/\s+/g, " ").replace(/\[IMAGE_[^\]]*\]/g, "[figure]").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const norm = (d: string) => (d === "Moderate" ? "Medium" : d);
type Src = "all" | "wrong" | "marked" | "notes" | "weak" | "new" | "taught";
const SOURCES: { id: Src; label: string; icon: typeof Bookmark; tint: string }[] = [
  { id: "all", label: "All questions", icon: LayoutGrid, tint: "peri" }, { id: "wrong", label: "Got wrong", icon: ClipboardX, tint: "rose" }, { id: "marked", label: "Bookmarked", icon: Bookmark, tint: "butter" },
  { id: "notes", label: "From my notes", icon: NotebookPen, tint: "peach" }, { id: "weak", label: "Weak topics", icon: Target, tint: "lilac" }, { id: "new", label: "Not tried yet", icon: Sparkles, tint: "mint" }, { id: "taught", label: "Taught before", icon: GraduationCap, tint: "sky" },
];
const SORTS = [{ id: "missed", label: "Most missed" }, { id: "new", label: "Newest year" }, { id: "hard", label: "Hardest" }, { id: "weak", label: "Weakest topic" }, { id: "no", label: "Question number" }] as const;
const GROUPS = [{ id: "none", label: "No grouping" }, { id: "subject", label: "Subject" }, { id: "topic", label: "Topic" }, { id: "year", label: "Year" }, { id: "difficulty", label: "Difficulty" }, { id: "marks", label: "Marks" }] as const;
const HARD: Record<string, number> = { Easy: 1, Medium: 2, Hard: 3 };

export function TutorHome() {
  const router = useRouter();
  const { mistakes, bookmarks, loadStudyData } = useStudyStore();
  const { isInitialized, totalQuestions } = useDataStore();
  const { dashboardMetrics, loadAnalytics } = useAnalyticsStore();
  const { tier, loading } = useEntitlements(); const locked = !loading && tier === "free";
  const notes = useNotes((s) => s.items); const queues = useQueues((s) => s.items);
  const solved = useSolvedIds(isInitialized);
  const [rows, setRows] = useState<Awaited<ReturnType<typeof ConversationMemory.listConversations>> | null>(null);
  useEffect(() => { void loadStudyData(); void loadAnalytics(); void useNotes.getState().load(); void useQueues.getState().load(); ConversationMemory.listConversations().then(setRows).catch(() => setRows([])); }, [loadStudyData, loadAnalytics]);

  const [src, setSrc] = useState<Src>("all"); const [subject, setSubject] = useState("all"); const [topic, setTopic] = useState("all"); const [diff, setDiff] = useState("all"); const [type, setType] = useState("all"); const [marks, setMarks] = useState("all"); const [year, setYear] = useState("all");
  const [q, setQ] = useState(""); const dq = useDeferredValue(q);
  const [view, setView] = useState<"topics" | "list">("topics"); const [group, setGroup] = useState<(typeof GROUPS)[number]["id"]>("none"); const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("missed");
  const [sel, setSel] = useState<string | null>(null); const [limit, setLimit] = useState(40);
  const [queue, setQueue] = useState<string[]>([]); const [qname, setQname] = useState("");
  const [filters, setFilters] = useState(false); const [peek, setPeek] = useState(false); const [wide, setWide] = useState(true);
  useEffect(() => { const m = window.matchMedia("(min-width: 1280px)"); const f = () => setWide(m.matches); f(); m.addEventListener("change", f); return () => m.removeEventListener("change", f); }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- the bank is re-read when it is ready or Spark adds questions
  const all = useMemo(() => (isInitialized ? QuestionRepository.getAllQuestions() : []), [isInitialized, totalQuestions]);

  const miss = useMemo(() => new Map(mistakes.filter((m) => !m.mastered).map((m) => [m.questionId, m.occurrences ?? 1])), [mistakes]);
  const marked = useMemo(() => new Set(bookmarks.map((b) => b.questionId)), [bookmarks]);
  const noted = useMemo(() => { const s = new Set<string>(); notes.forEach((n) => { if (n.refId && n.source !== "study") s.add(n.refId); }); mistakes.forEach((m) => { if (m.notes?.trim()) s.add(m.questionId); }); bookmarks.forEach((b) => { if (b.notes?.trim()) s.add(b.questionId); }); return s; }, [notes, mistakes, bookmarks]);
  const taught = useMemo(() => new Set((rows ?? []).map((r) => r.questionId)), [rows]);
  const acc = useMemo(() => new Map((dashboardMetrics?.topicPerformance ?? []).map((t) => [t.topic, t.attempted > 0 ? t.correct / t.attempted : null])), [dashboardMetrics]);
  const weakTopics = useMemo(() => new Set([...acc.entries()].filter(([, a]) => a !== null && a < 0.5).map(([t]) => t)), [acc]);

  const reasonCount = useMemo(() => ({ all: all.length, wrong: all.filter((x) => miss.has(x.question_id)).length, marked: all.filter((x) => marked.has(x.question_id)).length, notes: all.filter((x) => noted.has(x.question_id)).length, weak: all.filter((x) => weakTopics.has(x.topic)).length, new: all.filter((x) => !solved.has(x.question_id)).length, taught: all.filter((x) => taught.has(x.question_id)).length }), [all, miss, marked, noted, weakTopics, solved, taught]);
  const bySrc = useMemo(() => all.filter((x) => src === "all" || (src === "wrong" && miss.has(x.question_id)) || (src === "marked" && marked.has(x.question_id)) || (src === "notes" && noted.has(x.question_id)) || (src === "weak" && weakTopics.has(x.topic)) || (src === "new" && !solved.has(x.question_id)) || (src === "taught" && taught.has(x.question_id))), [all, src, miss, marked, noted, weakTopics, solved, taught]);
  const subjects = useMemo(() => [...new Set(bySrc.map((x) => x.subject).filter(Boolean))].sort(), [bySrc]);
  const topics = useMemo(() => [...new Set(bySrc.filter((x) => subject === "all" || x.subject === subject).map((x) => x.topic).filter(Boolean))].sort(), [bySrc, subject]);
  const years = useMemo(() => [...new Set(bySrc.map((x) => x.year).filter(Boolean))].sort().reverse(), [bySrc]);
  const filtered = useMemo(() => {
    const t = dq.trim().toLowerCase();
    return bySrc.filter((x) => (subject === "all" || x.subject === subject) && (topic === "all" || x.topic === topic) && (diff === "all" || norm(String(x.difficulty)) === diff) && (type === "all" || x.question_type === type) && (marks === "all" || String(x.marks) === marks) && (year === "all" || x.year === year)
      && (!t || x.question_id.toLowerCase().includes(t) || x.topic?.toLowerCase().includes(t) || x.subject?.toLowerCase().includes(t) || x.questionTextRaw?.toLowerCase().includes(t)));
  }, [bySrc, dq, subject, topic, diff, type, marks, year]);
  const sorted = useMemo(() => {
    const by: Record<typeof sort, (a: RenderableQuestion, b: RenderableQuestion) => number> = {
      missed: (a, b) => (miss.get(b.question_id) ?? 0) - (miss.get(a.question_id) ?? 0), new: (a, b) => String(b.year).localeCompare(String(a.year)), hard: (a, b) => (HARD[norm(String(b.difficulty))] ?? 0) - (HARD[norm(String(a.difficulty))] ?? 0),
      weak: (a, b) => (acc.get(a.topic) ?? 2) - (acc.get(b.topic) ?? 2), no: (a, b) => a.question_no - b.question_no };
    return [...filtered].sort(by[sort]);
  }, [filtered, sort, miss, acc]);
  const tiles = useMemo(() => {
    const m = new Map<string, { subject: string; topic: string; n: number; wrong: number }>();
    filtered.forEach((x) => { const k = `${x.subject}|${x.topic}`; const e = m.get(k) ?? { subject: x.subject, topic: x.topic, n: 0, wrong: 0 }; e.n += 1; if (miss.has(x.question_id)) e.wrong += 1; m.set(k, e); });
    return [...m.values()].sort((a, b) => (acc.get(a.topic) ?? 2) - (acc.get(b.topic) ?? 2) || b.wrong - a.wrong || b.n - a.n);
  }, [filtered, miss, acc]);
  const grouped = useMemo(() => {
    if (group === "none") return [{ h: "", items: sorted }];
    const m = new Map<string, RenderableQuestion[]>(); sorted.forEach((x) => { const k = group === "subject" ? x.subject : group === "topic" ? x.topic : group === "year" ? String(x.year) : group === "difficulty" ? norm(String(x.difficulty)) : `${x.marks} ${x.marks === 1 ? "mark" : "marks"}`; (m.get(k) ?? m.set(k, []).get(k)!).push(x); });
    return [...m.entries()].sort((a, b) => (group === "year" ? b[0].localeCompare(a[0]) : a[0].localeCompare(b[0]))).map(([h, items]) => ({ h, items }));
  }, [sorted, group]);

  const selQ = sel ? QuestionRepository.getQuestionById(sel) : undefined;
  const open = (id: string) => { try { sessionStorage.removeItem(QUEUE_KEY); } catch { /* ignore */ } router.push(tutorHref(id)); };
  const pick = (id: string) => { setSel(id); if (!wide) setPeek(true); };
  const inQ = (id: string) => queue.includes(id);
  const toggleQ = (id: string) => setQueue((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id].slice(0, 30)));
  const startQueue = (ids: string[]) => { if (!ids.length) return; try { sessionStorage.setItem(QUEUE_KEY, JSON.stringify({ ids, at: 0 })); } catch { /* ignore */ } router.push(tutorHref(ids[0])); };
  const saveQueue = () => { if (!queue.length) return; useQueues.getState().upsert({ id: newId("q"), updatedAt: nowIso(), createdAt: nowIso(), name: qname.trim() || `${queue.length} questions · ${istDateStr()}`, ids: queue }); setQname(""); };
  const reset = () => { setSrc("all"); setSubject("all"); setTopic("all"); setDiff("all"); setType("all"); setMarks("all"); setYear("all"); setQ(""); };
  const active = src !== "all" || subject !== "all" || topic !== "all" || diff !== "all" || type !== "all" || marks !== "all" || year !== "all" || q.trim() !== "";

  const railRows: RailRow[] | null = rows === null ? null : rows.map((r) => { const qq = QuestionRepository.getQuestionById(r.questionId); return { id: r.questionId, href: tutorHref(r.questionId), title: nameOf(r.questionId), sub: r.lastUser ? `You: ${plain(r.lastUser)}` : plain(r.lastText).slice(0, 90), at: r.updatedAt, subject: qq?.subject, topic: qq?.topic, year: qq ? String(qq.year) : undefined, difficulty: qq ? norm(String(qq.difficulty)) : undefined }; });

  const field = "h-9 min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 text-xs font-semibold text-[var(--text-primary)]";
  const chip = (on: boolean) => `inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-xs font-bold transition ${on ? "" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`;
  const chipStyle = (on: boolean, tint: string) => (on ? { background: `var(--tint-${tint})`, color: `var(--tint-${tint}-ink)`, borderColor: `var(--tint-${tint}-ink)` } : { borderLeft: `3px solid var(--tint-${tint}-ink)` });
  const reasons = (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Pick by">
      {SOURCES.map((s) => <button key={s.id} type="button" aria-pressed={src === s.id} onClick={() => { setSrc(s.id); setTopic("all"); }} className={chip(src === s.id)} style={chipStyle(src === s.id, s.tint)}><s.icon className="h-3.5 w-3.5" aria-hidden />{s.label}<span className="font-num opacity-80">{reasonCount[s.id]}</span></button>)}
    </div>
  );
  const filterFields = (
    <div className="flex flex-wrap items-center gap-2">
      <select value={subject} onChange={(e) => { setSubject(e.target.value); setTopic("all"); }} aria-label="Subject" className={field}><option value="all">All subjects</option>{subjects.map((s) => <option key={s} value={s}>{s}</option>)}</select>
      <select value={topic} onChange={(e) => setTopic(e.target.value)} aria-label="Topic" className={`${field} max-w-[14rem]`}><option value="all">All topics</option>{topics.map((s) => <option key={s} value={s}>{s}</option>)}</select>
      <select value={diff} onChange={(e) => setDiff(e.target.value)} aria-label="Difficulty" className={field}><option value="all">Any difficulty</option><option>Easy</option><option>Medium</option><option>Hard</option></select>
      <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Question type" className={field}><option value="all">Any type</option><option>MCQ</option><option>MSQ</option><option>NAT</option></select>
      <select value={marks} onChange={(e) => setMarks(e.target.value)} aria-label="Marks" className={field}><option value="all">Any marks</option><option value="1">1 mark</option><option value="2">2 marks</option></select>
      <select value={year} onChange={(e) => setYear(e.target.value)} aria-label="Year" className={field}><option value="all">Any year</option>{years.map((y) => <option key={y} value={y}>{y}</option>)}</select>
      {active && <button type="button" onClick={reset} className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-lg px-2 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"><X className="h-3.5 w-3.5" /> Clear</button>}
    </div>
  );

  const rowOf = (x: RenderableQuestion) => {
    const on = sel === x.question_id; const m = miss.get(x.question_id); const d = norm(String(x.difficulty)); const tint = d === "Easy" ? "mint" : d === "Hard" ? "rose" : "butter";
    return (
      <li key={x.question_id}><div className={`flex items-center gap-2 border-b border-[var(--border)] px-3 py-2.5 ${on ? "bg-[color-mix(in_srgb,var(--tint-sky)_55%,var(--surface))] shadow-[inset_3px_0_0_var(--tint-sky-ink)]" : "hover:bg-[color-mix(in_srgb,var(--tint-sky)_28%,var(--surface))]"}`}>
        <button type="button" onClick={() => pick(x.question_id)} aria-pressed={on} className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left">
          <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{short(x.questionTextRaw, 120)}</span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--text-secondary)]"><span>{x.subject} · {x.topic}</span><span>{x.year}</span><span>{x.question_type}</span><span>{x.marks}m</span>
              <span className="rounded-full px-2 py-0.5 font-bold" style={{ background: `var(--tint-${tint})`, color: `var(--tint-${tint}-ink)` }}>{d}</span>
              {m ? <span className="font-bold text-rose-700 dark:text-rose-300">missed ×{m}</span> : null}{marked.has(x.question_id) ? <span className="font-bold text-[var(--tint-butter-ink)]">bookmarked</span> : null}{taught.has(x.question_id) ? <span className="font-bold text-[var(--tint-sky-ink)]">taught</span> : null}</span></span>
        </button>
        <button type="button" onClick={() => toggleQ(x.question_id)} aria-pressed={inQ(x.question_id)} aria-label={inQ(x.question_id) ? "Remove from the queue" : "Add to the queue"} title={inQ(x.question_id) ? "In the queue" : "Add to the queue"} className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg border ${inQ(x.question_id) ? "border-[var(--tint-sky-ink)] bg-[var(--tint-sky)] text-[var(--tint-sky-ink)]" : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}><ListPlus className="h-4 w-4" /></button>
      </div></li>
    );
  };

  const preview = selQ ? (
    <div className="flex h-full min-h-0 flex-col">
      <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
        <p className="flex flex-wrap items-center gap-2 text-xs font-bold text-[var(--text-secondary)]"><span className="rounded-full bg-[var(--tint-peri)] px-2.5 py-1 text-[var(--tint-peri-ink)]">{nameOf(selQ.question_id)}</span><span>{selQ.question_type} · {selQ.marks} {selQ.marks === 1 ? "mark" : "marks"} · {norm(String(selQ.difficulty))}</span></p>
        <p className="mt-2 text-sm font-extrabold text-[var(--text-primary)]">{selQ.subject} · {selQ.topic}</p>
        {miss.get(selQ.question_id) ? <p className="mt-1 text-xs font-semibold text-rose-700 dark:text-rose-300">Why suggested: you missed this {miss.get(selQ.question_id)} {miss.get(selQ.question_id) === 1 ? "time" : "times"}.</p> : weakTopics.has(selQ.topic) ? <p className="mt-1 text-xs font-semibold text-[var(--tint-butter-ink)]">Why suggested: {selQ.topic} is one of your weak topics.</p> : null}
        <div className="mt-3 text-sm leading-relaxed text-[var(--text-primary)]"><AstNodeRenderer nodes={selQ.contentAst} /></div>
        <p className="mt-3 text-xs font-bold text-[var(--text-secondary)]">{selQ.question_type === "MCQ" ? "Options · exactly one is correct" : selQ.question_type === "MSQ" ? "Options · one or more are correct" : "Answer type · numerical"}</p>
        {selQ.question_type === "NAT" && <div className="mt-1.5 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-3 text-sm text-[var(--text-secondary)]">This question has no options. The answer is a number{selQ.nat_answer_range ? "" : ""}, and the Tutor works it out step by step.</div>}
        {(selQ.question_type === "MCQ" || selQ.question_type === "MSQ") && <ul className="mt-1.5 space-y-1.5">{selQ.options?.map((o) => <li key={o.option_id} className="flex items-start gap-2 rounded-xl bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]"><b className="w-4 shrink-0">{o.option_id}.</b><span className="min-w-0 overflow-hidden break-words"><AstNodeRenderer nodes={o.contentAst} /></span></li>)}</ul>}
      </div>
      <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3">
        <button type="button" disabled={locked} onClick={() => open(selQ.question_id)} className="btn-main !h-12 w-full justify-center disabled:opacity-50"><GraduationCap className="h-4 w-4" /> {taught.has(selQ.question_id) ? "Continue with the Tutor" : "Teach me this question"}</button>
        {locked && <p className="text-center text-xs text-[var(--text-secondary)]">Tutor explanations come with Plus and Pro. <button type="button" onClick={() => openUpgrade("Plus and Pro plans")} className="cursor-pointer font-bold underline">See plans</button></p>}
        <div className="flex items-center gap-2"><button type="button" onClick={() => toggleQ(selQ.question_id)} className="btn-soft !h-10 flex-1 justify-center text-sm"><ListPlus className="h-4 w-4" /> {inQ(selQ.question_id) ? "In the queue" : "Add to queue"}</button><ItemActions questionId={selQ.question_id} subject={selQ.subject} topic={selQ.topic} source="tutor" align="right" /></div>
      </div>
    </div>
  ) : (
    <div className="grid h-full place-items-center p-4 text-center"><div><GraduationCap className="mx-auto h-8 w-8 text-[var(--text-secondary)]" aria-hidden /><p className="mt-3 font-display text-lg font-extrabold text-[var(--text-primary)]">Pick a question</p><p className="mt-1 text-sm text-[var(--text-secondary)]">It shows here first. The Tutor starts only when you press “Teach me this question”.</p><ul className="mx-auto mt-4 max-w-[16rem] space-y-1 text-left text-xs text-[var(--text-secondary)]">{["The idea behind it", "Every step, with the rule used", "Formulas worth remembering", "A shortcut, plus harder and simpler versions"].map((t) => <li key={t} className="flex gap-2"><span aria-hidden>·</span>{t}</li>)}</ul></div></div>
  );

  return (
    <MathJaxContext config={mathJax}>
      <div className="flex min-h-0 w-full flex-col gap-2" data-fill-height="always">
        <header className="flex flex-wrap items-center gap-2">
          <h1 className="min-w-0 flex-1 truncate font-display text-xl font-extrabold text-[var(--text-primary)] max-sm:sr-only">Choose a question</h1>
          <MentorSwitch active="tutor" />
          <div className="lg:hidden"><TutorHistoryMenu iconOnly /></div>
        </header>

        <div className="flex min-h-0 flex-1 divide-x divide-[var(--border)] overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]">
          <aside aria-label="Tutor sessions" className="hidden w-[17.5rem] shrink-0 bg-[color-mix(in_srgb,var(--tint-sky)_38%,var(--surface))] p-3 lg:block"><HistoryRail title="Tutor sessions" rows={railRows} today={istDateStr()} empty="Questions you go through with the Tutor will be listed here." onDelete={(id) => { void ConversationMemory.clearConversation(id).then(() => ConversationMemory.listConversations().then(setRows)); }}
            footer={queues.length > 0 ? <section aria-label="Saved queues"><p className="px-2 pb-1 text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">Saved queues</p><ul className="space-y-0.5">{queues.map((s) => <li key={s.id} className="group flex items-center rounded-lg hover:bg-[var(--surface-secondary)]"><button type="button" onClick={() => setQueue(s.ids)} className="min-w-0 flex-1 cursor-pointer px-2.5 py-2 text-left"><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{s.name}</span><span className="block text-xs text-[var(--text-secondary)]">{s.ids.length} questions</span></button><button type="button" aria-label={`Delete ${s.name}`} onClick={() => useQueues.getState().remove(s.id)} className="mr-1 grid h-8 w-8 cursor-pointer place-items-center rounded-full text-[var(--text-muted)] hover:text-rose-600"><X className="h-4 w-4" /></button></li>)}</ul></section> : null} /></aside>

          <section aria-label="Question board" className="flex min-w-0 flex-1 flex-col">
            <div className="space-y-2.5 border-b border-[var(--border)] p-3">
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex h-10 min-w-[12rem] flex-1 items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 focus-within:border-[var(--tint-sky-ink)]"><Search className="h-4 w-4 text-[var(--text-muted)]" aria-hidden /><input id="tutor-board-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a topic, a word in the question, or an id" aria-label="Search questions" className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]" /></label>
                <div role="group" aria-label="View" className="inline-flex rounded-lg border border-[var(--border)] p-0.5"><button type="button" aria-pressed={view === "topics"} onClick={() => setView("topics")} className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-bold ${view === "topics" ? "bg-[var(--tint-sky)] text-[var(--tint-sky-ink)]" : "text-[var(--text-secondary)]"}`}><LayoutGrid className="h-3.5 w-3.5" /> Topic board</button><button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-3 text-xs font-bold ${view === "list" ? "bg-[var(--tint-sky)] text-[var(--tint-sky-ink)]" : "text-[var(--text-secondary)]"}`}><List className="h-3.5 w-3.5" /> List</button></div>
                <button type="button" onClick={() => setFilters((v) => !v)} aria-expanded={filters} className="btn-soft !h-10 !px-3 text-sm lg:hidden"><Filter className="h-4 w-4" /> Filters</button>
              </div>
              {reasons}
              <div className={`${filters ? "block" : "hidden"} lg:block`}>{filterFields}</div>
              {view === "list" && <div className="flex flex-wrap items-center gap-2 text-xs"><label className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)]">Group<select value={group} onChange={(e) => setGroup(e.target.value as typeof group)} className={field}>{GROUPS.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}</select></label><label className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)]">Sort<select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={field}>{SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select></label></div>}
              <p className="text-xs text-[var(--text-secondary)]" aria-live="polite">{!isInitialized ? "Loading the question bank…" : `${filtered.length} ${filtered.length === 1 ? "question" : "questions"}${active ? " match" : ""}`}</p>
            </div>

            <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
              {filtered.length === 0 ? <p className="p-6 text-center text-sm text-[var(--text-secondary)]">{isInitialized ? (src === "wrong" && !active ? "No mistakes yet. Take a short test and the questions you miss show up here." : "No question matches. Clear a filter or try another word.") : "Loading…"}</p>
                : view === "topics" ? (
                  <ul className="grid gap-2 p-3 sm:grid-cols-2 2xl:grid-cols-3" aria-label="Topics">
                    {tiles.slice(0, 60).map((t) => { const a = acc.get(t.topic); const tint = a == null ? "sky" : a < 0.5 ? "rose" : a < 0.75 ? "butter" : "mint"; return (
                      <li key={`${t.subject}|${t.topic}`}><button type="button" onClick={() => { setSubject(t.subject); setTopic(t.topic); setView("list"); setSort("missed"); }} className="flex h-full w-full cursor-pointer flex-col rounded-xl border border-[var(--border)] p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md" style={{ borderLeft: `4px solid var(--tint-${tint}-ink)`, background: `color-mix(in srgb, var(--tint-${tint}) 55%, var(--surface))` }}>
                        <span className="line-clamp-2 text-sm font-extrabold text-[var(--text-primary)]">{t.topic}</span><span className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">{t.subject}</span>
                        <span className="mt-2 flex items-center gap-2 text-xs font-bold text-[var(--text-primary)]"><span className="font-num">{t.n} questions</span>{t.wrong ? <span className="text-rose-700 dark:text-rose-300">{t.wrong} missed</span> : null}{a != null ? <span className="ml-auto font-num" style={{ color: `var(--tint-${tint}-ink)` }}>{Math.round(a * 100)}% right</span> : <span className="ml-auto text-[var(--text-secondary)]">not tried</span>}</span>
                      </button></li>); })}
                  </ul>
                ) : (
                  <div>{grouped.map((g) => (
                    <div key={g.h || "all"}>{g.h && <h2 className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--surface-secondary)] px-3 py-1.5 text-xs font-extrabold text-[var(--text-primary)]">{g.h} <span className="font-num font-semibold text-[var(--text-muted)]">{g.items.length}</span></h2>}
                      <ul>{g.items.slice(0, limit).map((x) => rowOf(x))}</ul></div>))}
                    {sorted.length > limit && <div className="p-3 text-center"><button type="button" onClick={() => setLimit((n) => n + 40)} className="btn-soft !h-10 !px-5 text-sm">Show more ({sorted.length - limit} left)</button></div>}</div>
                )}
            </div>

            {queue.length > 0 && (
              <div className="border-t border-[var(--tint-butter-ink)]/30 bg-[color-mix(in_srgb,var(--tint-butter)_55%,var(--surface))] p-3" role="region" aria-label="Queue">
                <div className="flex flex-wrap items-center gap-2"><b className="text-sm text-[var(--text-primary)]">Queue · {queue.length}</b>
                  <span className="flex min-w-0 flex-1 flex-wrap gap-1.5">{queue.slice(0, 6).map((id) => <span key={id} className="inline-flex items-center gap-1 rounded-full border border-[var(--tint-butter-ink)]/40 bg-[var(--surface)] px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)]">{nameOf(id).replace(/^GATE /, "")}<button type="button" aria-label={`Remove ${nameOf(id)}`} onClick={() => toggleQ(id)} className="cursor-pointer text-[var(--text-muted)] hover:text-rose-600"><X className="h-3 w-3" /></button></span>)}{queue.length > 6 && <span className="text-xs text-[var(--text-secondary)]">+{queue.length - 6} more</span>}</span>
                  <input value={qname} onChange={(e) => setQname(e.target.value)} placeholder="Name to save" aria-label="Queue name" className={`${field} w-32`} />
                  <button type="button" onClick={saveQueue} className="btn-soft !h-9 !px-3 text-xs">Save</button><button type="button" onClick={() => setQueue([])} className="btn-soft !h-9 !px-3 text-xs">Clear</button>
                  <button type="button" disabled={locked} onClick={() => startQueue(queue)} className="btn-main !h-9 !px-4 text-sm disabled:opacity-50">Start teaching</button></div>
              </div>
            )}
          </section>

          <aside aria-label="Preview" className="hidden w-[24rem] shrink-0 bg-[color-mix(in_srgb,var(--tint-peri)_30%,var(--surface))] p-4 xl:block">{preview}</aside>
        </div>

        <DeskModal open={peek && !wide} onClose={() => setPeek(false)} title="Question preview">{<div className="h-[70dvh]">{preview}</div>}</DeskModal>
        <p className="sr-only">{locked ? "Tutor explanations come with Plus and Pro." : `${AI_DAILY[tier]} AI requests a day on your plan.`}</p>
      </div>
    </MathJaxContext>
  );
}
