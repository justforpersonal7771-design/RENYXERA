"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Flame, GraduationCap, Layers, Play, Zap } from "lucide-react";
import { ItemActions } from "@/components/desk/item-actions";
import { useRevision } from "@/lib/desk/stores";
import { examDay, readReviewDays, streakOf, todayIst, useDeskLoad, useRevisionSeed } from "@/lib/desk/revision";
import { daysBetween, estimateMinutes, forecast, isDue, isLeech, strengthBySubject } from "@/lib/revision/scheduler";
import { studyHrefFor, tutorHref } from "@/lib/desk/links";
import { useStudyStore } from "@/store/use-study-store";

const PER_DAY_KEY = "renyxera.rev.perday";
const SRC_LABEL: Record<string, string> = { mistake: "Mistakes", bookmark: "Bookmarks", test: "Tests", tutor: "Tutor", note: "Notes", revision: "Revision" };

/** Revision, as an actual revision loop: what is due today, how long it takes, how strong each subject is, what is coming, and the items that keep failing. */
export default function RevisionPage() {
  const router = useRouter();
  useDeskLoad();
  const { loadStudyData } = useStudyStore();
  useEffect(() => { void loadStudyData(); }, [loadStudyData]);
  const [perDay, setPerDay] = useState(10); const [focus, setFocus] = useState("all"); const [interleave, setInterleave] = useState(true); const [light, setLight] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads the saved daily limit once
  useEffect(() => { try { const v = Number(localStorage.getItem(PER_DAY_KEY)); if (v >= 3 && v <= 40) setPerDay(v); } catch { /* default */ } }, []);
  useRevisionSeed(perDay);
  const items = useRevision((s) => s.items); const loaded = useRevision((s) => s.loaded);
  const today = todayIst(); const exam = examDay();
  const live = useMemo(() => items.filter((i) => !i.suspended), [items]);
  const due = useMemo(() => live.filter((i) => isDue(i, today)), [live, today]);
  const subjects = useMemo(() => [...new Set(live.map((i) => i.subject).filter(Boolean) as string[])].sort(), [live]);
  const dueFocus = focus === "all" ? due : due.filter((i) => i.subject === focus);
  const cap = light ? 10 : 40;
  const sessionN = Math.min(cap, dueFocus.length);
  const fc = useMemo(() => forecast(live, today, 14), [live, today]);
  const strength = useMemo(() => strengthBySubject(live, today), [live, today]);
  const leeches = useMemo(() => live.filter(isLeech).sort((a, b) => b.lapses - a.lapses).slice(0, 6), [live]);
  const bySource = useMemo(() => { const m = new Map<string, number>(); due.forEach((i) => { m.set(i.source, (m.get(i.source) ?? 0) + 1); }); return [...m.entries()].sort((a, b) => b[1] - a[1]); }, [due]);
  const [days, setDays] = useState<string[]>([]);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- reads this device's revision days once
  useEffect(() => { setDays(readReviewDays()); }, []);
  const streak = streakOf(days, today); const doneToday = days.includes(today);
  const maxFc = Math.max(1, ...fc);
  const examLeft = exam ? daysBetween(today, exam) : null;
  const start = (n?: number, subj?: string) => { const f = subj ?? (focus !== "all" ? focus : ""); router.push(`/revision/session?n=${n ?? cap}&interleave=${interleave ? 1 : 0}${f ? `&focus=${encodeURIComponent(f)}` : ""}`); };
  const heat = useMemo(() => { const set = new Set(days); return Array.from({ length: 56 }, (_, i) => { const d = new Date(Date.parse(today + "T00:00:00Z") - (55 - i) * 86_400_000).toISOString().slice(0, 10); return { d, on: set.has(d) }; }); }, [days, today]);

  const card = "rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5";
  const empty = loaded && live.length === 0;

  return (
    <div className="w-full space-y-4 pb-8">
      <section className="card-pastel p-5 sm:p-7" data-tint="rose" aria-label="Today's revision">
        <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold text-[var(--text-secondary)]">{doneToday && due.length === 0 ? "You have revised today" : "Revision for today"}</p>
            <h1 className="mt-1 font-display text-4xl font-extrabold leading-none text-[var(--text-primary)] sm:text-5xl">{due.length} <span className="text-2xl font-bold text-[var(--text-secondary)] sm:text-3xl">{due.length === 1 ? "item due" : "items due"}</span></h1>
            <p className="mt-2 text-[var(--text-secondary)]">{due.length > 0 ? `About ${estimateMinutes(sessionN)} minutes. Every item asks you to recall first; then you rate how it went and the next review is scheduled.` : empty ? "Nothing to revise yet. Mistakes, bookmarks, notes you mark to revise and questions the Tutor taught arrive here on their own." : "All caught up. The next items fall due soon; the forecast below shows when."}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => start()} disabled={dueFocus.length === 0} className="btn-main !h-12 !px-6 disabled:opacity-50"><Play className="h-4 w-4" /> Start revision</button>
              <button type="button" onClick={() => start(10)} disabled={dueFocus.length === 0} className="btn-soft !h-12 !px-5"><Zap className="h-4 w-4" /> Quick 10</button>
              {subjects.length > 0 && <select value={focus} onChange={(e) => setFocus(e.target.value)} aria-label="Focus on a subject" className="h-12 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text-primary)]"><option value="all">All subjects, mixed</option>{subjects.map((s) => <option key={s} value={s}>{s}</option>)}</select>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-[var(--surface)] p-3"><Flame className="mx-auto h-5 w-5 text-[var(--tint-peach-ink)]" aria-hidden /><b className="mt-1 block font-num text-2xl text-[var(--text-primary)]">{streak}</b><span className="text-xs text-[var(--text-secondary)]">day streak</span></div>
            <div className="rounded-2xl bg-[var(--surface)] p-3"><Layers className="mx-auto h-5 w-5 text-[var(--tint-sky-ink)]" aria-hidden /><b className="mt-1 block font-num text-2xl text-[var(--text-primary)]">{live.length}</b><span className="text-xs text-[var(--text-secondary)]">in your queue</span></div>
            <div className="rounded-2xl bg-[var(--surface)] p-3"><GraduationCap className="mx-auto h-5 w-5 text-[var(--tint-mint-ink)]" aria-hidden /><b className="mt-1 block font-num text-2xl text-[var(--text-primary)]">{examLeft != null && examLeft > 0 ? examLeft : "-"}</b><span className="text-xs text-[var(--text-secondary)]">{examLeft != null && examLeft > 0 ? "days to exam" : "exam date not set"}</span></div>
          </div>
        </div>
        {examLeft != null && examLeft > 0 && <p className="mt-4 rounded-2xl bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-secondary)]">The scheduler fits your reviews before the exam: no gap is longer than half the days you have left, so each item comes back at least twice more.</p>}
      </section>

      {empty ? (
        <section className={card} aria-label="How items get here">
          <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">What goes into revision</h2>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[{ t: "Mistakes", b: "Questions you got wrong in tests and practice.", h: "/mistakes" }, { t: "Bookmarks", b: "Questions you saved to come back to.", h: "/bookmarks" }, { t: "Notes", b: "Any note you mark “Revise this note”.", h: "/notes" }, { t: "The Tutor", b: "Add a question you were taught from its menu.", h: "/ai-tutor" }].map((x) => <li key={x.t}><Link href={x.h} className="block h-full rounded-2xl bg-[var(--surface-secondary)] p-4 hover:shadow-md"><b className="text-[var(--text-primary)]">{x.t}</b><span className="mt-1 block text-sm text-[var(--text-secondary)]">{x.b}</span></Link></li>)}
          </ul>
        </section>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <section className={card} aria-label="Forecast">
            <div className="flex items-baseline justify-between"><h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Next 14 days</h2><span className="text-xs text-[var(--text-secondary)]">items falling due</span></div>
            <div className="mt-4 flex h-32 items-end gap-1.5" role="img" aria-label={`Items due each day for the next 14 days: ${fc.join(", ")}`}>
              {fc.map((n, i) => <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"><span className="font-num text-[10px] text-[var(--text-secondary)]">{n || ""}</span><div className="w-full rounded-t-md" style={{ height: `${Math.max(n ? 6 : 2, (n / maxFc) * 70)}%`, background: i === 0 ? "var(--tint-rose-ink)" : "var(--tint-sky-ink)", opacity: n ? 1 : 0.25 }} /><span className="text-[10px] text-[var(--text-muted)]">{i === 0 ? "now" : new Date(Date.parse(today + "T00:00:00Z") + i * 86_400_000).getUTCDate()}</span></div>)}
            </div>
            {bySource.length > 0 && <p className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--text-secondary)]">{bySource.map(([k, n]) => <span key={k} className="rounded-full bg-[var(--surface-secondary)] px-2.5 py-1 font-semibold">{SRC_LABEL[k] ?? k} {n}</span>)}</p>}
          </section>

          <section className={card} aria-label="Memory strength">
            <div className="flex items-baseline justify-between"><h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Memory strength</h2><span className="text-xs text-[var(--text-secondary)]">by subject</span></div>
            {strength.length === 0 ? <p className="mt-3 text-sm text-[var(--text-secondary)]">Strength appears after your first session.</p> : (
              <ul className="mt-3 space-y-2.5">{strength.slice(0, 7).map((s) => (
                <li key={s.subject} className="flex items-center gap-3"><span className="w-36 shrink-0 truncate text-sm font-semibold text-[var(--text-primary)]" title={s.subject}>{s.subject}</span>
                  <span className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><span className="block h-full rounded-full" style={{ width: `${Math.max(4, s.strength)}%`, background: s.strength < 40 ? "var(--tint-rose-ink)" : s.strength < 70 ? "var(--tint-butter-ink)" : "var(--tint-mint-ink)" }} /></span>
                  <span className="w-10 text-right font-num text-xs text-[var(--text-secondary)]">{s.strength}%</span>
                  <button type="button" onClick={() => start(15, s.subject)} className="pill-soft cursor-pointer text-xs">Review</button></li>
              ))}</ul>
            )}
          </section>

          {leeches.length > 0 && (
            <section className={`${card} lg:col-span-2`} aria-label="Items that keep failing">
              <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Needs teaching, not repeating</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">You have missed these four times or more. Reading the explanation helps more than another attempt.</p>
              <ul className="mt-3 grid gap-2 md:grid-cols-2">{leeches.map((l) => (
                <li key={l.id} className="flex items-center gap-3 rounded-2xl bg-[var(--surface-secondary)] px-4 py-3"><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{l.title}</span><span className="block truncate text-xs text-[var(--text-secondary)]">{l.subject}{l.topic ? ` · ${l.topic}` : ""} · missed {l.lapses}×</span></span>
                  {l.kind === "question" ? <Link href={tutorHref(l.refId)} className="pill-ink text-xs"><GraduationCap className="mr-1 inline h-3.5 w-3.5" />Teach me</Link> : <Link href={studyHrefFor(l.topic, l.subject)} className="pill-ink text-xs"><BookOpen className="mr-1 inline h-3.5 w-3.5" />Lesson</Link>}
                  {l.kind === "question" && <ItemActions questionId={l.refId} subject={l.subject} topic={l.topic} title={l.title} source="test" />}</li>
              ))}</ul>
            </section>
          )}

          <section className={`${card} lg:col-span-2`} aria-label="Settings and history">
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div><h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Your last eight weeks</h2>
                <div className="mt-3 grid grid-flow-col gap-1" style={{ gridTemplateRows: "repeat(7, auto)", justifyContent: "start" }} role="img" aria-label={`${days.length} days revised in total`}>{heat.map((h) => <span key={h.d} title={h.d} className="h-3 w-3 rounded-[3px] sm:h-3.5 sm:w-3.5" style={{ background: h.on ? "var(--tint-mint-ink)" : "var(--surface-secondary)" }} />)}</div></div>
              <div className="space-y-3 text-sm">
                <label className="flex items-center justify-between gap-3 font-semibold text-[var(--text-primary)]">New items a day <input type="number" min={3} max={40} value={perDay} onChange={(e) => { const v = Math.min(40, Math.max(3, Number(e.target.value) || 10)); setPerDay(v); try { localStorage.setItem(PER_DAY_KEY, String(v)); } catch { /* ignore */ } }} className="h-9 w-20 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2 font-num" /></label>
                <label className="flex cursor-pointer items-center gap-2 font-semibold text-[var(--text-primary)]"><input type="checkbox" checked={interleave} onChange={(e) => setInterleave(e.target.checked)} className="h-4 w-4" /> Mix subjects (better for memory)</label>
                <label className="flex cursor-pointer items-center gap-2 font-semibold text-[var(--text-primary)]"><input type="checkbox" checked={light} onChange={(e) => setLight(e.target.checked)} className="h-4 w-4" /> Light day: at most 10 items</label>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
