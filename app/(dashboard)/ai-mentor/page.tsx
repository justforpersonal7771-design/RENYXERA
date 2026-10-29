"use client";

/**
 * AI Mentor home (R21): what the Mentor knows, today's plan, the next best actions, and a quick-ask box for small questions.
 * Long conversations and the heavy requests (plan, test review, quiz, guided steps, weekly review) open the dedicated chat screen.
 * Everything here that can be computed without AI is rule-based and free. Readiness, mastery, patterns and the timeline live in Analytics > Coach insights.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, BrainCircuit, CalendarPlus, Check, Loader2, MessageSquareText, Plus, Send, Sparkles, Target, Trash2, X, Zap } from "lucide-react";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { AI_DAILY } from "@/lib/billing/plans";
import { Segmented } from "@/components/ui/folder-tabs";
import { CardView, Voice, clean, useMentorChat } from "@/components/mentor/use-mentor-chat";
import { MentorNote, useMentorData } from "@/components/mentor/use-mentor-data";

const uid = () => Math.random().toString(36).slice(2, 10);

export default function AIMentorPage() {
  const router = useRouter();
  const d = useMentorData();
  const c = useMentorChat(d.brief);
  const { tier, loading: tierLoading } = useEntitlements();
  const [note, setNote] = useState("");
  const [quick, setQuick] = useState("");

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const noData = d.ready && d.subjects.every((s) => s.attempted === 0);
  const locked = !tierLoading && tier === "free";

  // One decision for today, rule-based: the first thing that applies.
  const focus = useMemo(() => {
    if (!d.ready) return null;
    if (noData) return { line: "I do not have enough of your answers yet. A short test gives me something to work with.", cta: "Find my level", href: "/setup" };
    if (d.readiness?.burnoutRisk === "High") return { line: "Your recent load looks heavy. Take a lighter day: revise a few old mistakes, then rest.", cta: "Light revision", href: "/revision" };
    if (d.open.length > 0) return { line: `You have ${d.open.length} open mistakes. Clearing a few today is the quickest gain.`, cta: "Revise mistakes", href: "/revision" };
    const w = d.weakTopics[0];
    if (w) return { line: `${w.topic} is your weakest topic right now (score ${w.score}).`, cta: "Practise it", href: "/setup" };
    return { line: "Keep your streak going with a short practice set.", cta: "Start practice", href: "/setup" };
  }, [d.ready, d.open.length, d.weakTopics, d.readiness, noData]);

  const actions = useMemo(() => {
    const a: { t: string; s: string; href?: string; chat?: string; icon: typeof Zap }[] = [];
    if (d.open.length) a.push({ t: `Revise ${Math.min(d.open.length, 10)} mistakes`, s: "Spaced repetition on what you missed", href: "/revision", icon: Zap });
    if (d.weakTopics[0]) a.push({ t: `Drill ${d.weakTopics[0].topic}`, s: `Mastery score ${d.weakTopics[0].score}`, href: "/setup", icon: Target });
    if (d.sessions.length === 0) a.push({ t: "Take a first test", s: "So the Mentor knows your level", href: "/setup", icon: Sparkles });
    else a.push({ t: "Take the next mock", s: "A full paper under exam conditions", href: "/mocks", icon: Sparkles });
    if (d.events.filter((e) => e.date >= d.today).length === 0) a.push({ t: "Plan my week", s: "Nothing is on your calendar", chat: "Plan", icon: CalendarPlus });
    a.push({ t: "Read the lesson", s: d.weakTopics[0] ? d.weakTopics[0].topic : "Study materials", href: "/study", icon: BookOpen });
    return a.slice(0, 5);
  }, [d.open.length, d.weakTopics, d.sessions.length, d.events, d.today]);

  const addNote = () => { const t = note.trim(); if (!t) return; void d.saveNotes([...d.notes, { id: uid(), text: t.slice(0, 200), at: new Date().toISOString() }].slice(-20)); setNote(""); };
  const openChat = (mode?: string) => router.push(mode ? `/ai-mentor/chat?mode=${mode}&auto=1` : "/ai-mentor/chat");
  const askQuick = () => { const t = quick; setQuick(""); void c.send(t, "Ask", "Concise"); };
  const last = [...c.msgs].reverse().find((m) => m.role === "model");
  const lastUser = [...c.msgs].reverse().find((m) => m.role === "user");
  const quickChips = noData ? ["How should I start?"] : ["What should I study today?", "Why do I keep missing questions?"];

  return (
    <div className="space-y-5 pb-6">
      <section className="card-pastel p-5 sm:p-7" data-tint="sky" aria-label="Your Mentor">
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <span className="section-label"><BrainCircuit className="h-3.5 w-3.5" /> AI Mentor</span>
            <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.1] text-[var(--text-primary)] sm:text-4xl">{greet}{d.firstName ? `, ${d.firstName}` : ""}.</h1>
            <p className="mt-2 max-w-xl text-[var(--text-secondary)]">{d.daysToExam != null && d.daysToExam >= 0 ? `${d.daysToExam} days to GATE ${d.targetYear ?? ""}. ` : ""}{focus ? focus.line : "Getting to know your progress..."}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {focus && <Link href={focus.href} className="btn-main">{focus.cta} <ArrowRight className="h-4 w-4" /></Link>}
              <Link href="/ai-mentor/chat" className="btn-soft !h-12 !px-5"><MessageSquareText className="h-4 w-4" /> Open chat</Link>
            </div>
          </div>
          <div className="card-inset space-y-3 p-4">
            <Segmented label="Mentor voice" value={c.voice} onChange={(v: Voice) => c.setVoice(v)} options={[{ id: "Friendly", label: "Friendly" }, { id: "Strict", label: "Strict" }, { id: "Concise", label: "Concise" }]} />
            {locked ? (
              <p className="text-sm text-[var(--text-secondary)]">Chat is part of Plus ({AI_DAILY.plus} requests a day) and Pro ({AI_DAILY.pro}). Free accounts get a few starter requests. <Link href="/pro" className="font-bold underline">See plans</Link></p>
            ) : (
              <p className="text-sm text-[var(--text-secondary)]">{AI_DAILY[tier]} chat requests a day on your plan. The plan, actions and notes on this page are free.</p>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          {/* Quick ask: short questions only. */}
          <section className="card-well p-4 sm:p-5" data-tint="lilac" aria-label="Quick ask">
            <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Quick question</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Short answers right here. Plans, test reviews, quizzes and longer chats open the full chat.</p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); askQuick(); }}>
              <input value={quick} onChange={(e) => setQuick(e.target.value)} maxLength={300} placeholder="Ask in a line" aria-label="Ask your Mentor a quick question"
                className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--text-primary)] outline-none focus:border-[var(--tint-sky-ink)]" />
              <button type="submit" disabled={c.busy || !quick.trim()} className="btn-main !px-4 disabled:opacity-50" aria-label="Send"><Send className="h-4 w-4" /></button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2">
              {quickChips.map((q) => <button key={q} type="button" onClick={() => void c.send(q, "Ask", "Concise")} className="pill-soft cursor-pointer text-xs">{q}</button>)}
            </div>
            {(c.busy || last) && (
              <div className="mt-4 space-y-2 rounded-2xl bg-[var(--surface)] p-4 text-sm">
                {lastUser && <p className="text-xs font-semibold text-[var(--text-muted)]">You asked: {clean(lastUser.text).slice(0, 120)}</p>}
                {c.busy ? <p className="flex items-center gap-2 text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" /> Thinking about your data...</p> : last && (
                  <>
                    <p className="whitespace-pre-wrap leading-relaxed text-[var(--text-primary)]">{clean(last.text)}</p>
                    {last.warn && <p className="rounded-lg bg-[var(--tint-butter)] px-2 py-1 text-xs text-[var(--tint-butter-ink)]">Check these numbers before relying on them: {last.warn.join(", ")}. They are not in your data.</p>}
                    {last.cards?.map((cd, i) => <CardView key={i} c={cd} added={c.added} onAdd={(it, k) => c.addPlanItem(it, `${last.id}-${k}`)} idKey={last.id} go={(h) => router.push(h)} />)}
                  </>
                )}
              </div>
            )}
            <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
              <p className="mb-2 text-xs font-bold text-[var(--text-secondary)]">Bigger requests open the full chat</p>
              <div className="flex flex-wrap gap-2">
                {[["Plan", "Plan my week"], ["Review", "Review my last test"], ["Quiz", "Quiz me"], ["Socratic", "Guide me step by step"], ["Weekly", "Weekly review"]].map(([m, l]) => (
                  <button key={m} type="button" onClick={() => openChat(m)} className="pill-ink cursor-pointer !px-3 !py-1.5 text-xs">{l}</button>
                ))}
              </div>
            </div>
          </section>

          <section className="card-pastel p-5" data-tint="peach" aria-label="Today's plan">
            <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Today&apos;s plan</h2>
            {d.suggestions.length === 0 ? <p className="mt-2 text-sm text-[var(--text-secondary)]">{noData ? "Take a test and I will build your plan." : "Nothing new to suggest. Your calendar already covers your weak topics."}</p> : (
              <ul className="mt-2 space-y-2">
                {d.suggestions.slice(0, 3).map((s) => (
                  <li key={s.id} className="flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3">
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[var(--text-primary)]">{s.title}</span><span className="block truncate text-xs text-[var(--text-muted)]">{s.reason}</span></span>
                    <button type="button" disabled={c.added.has(s.id)} onClick={() => c.addPlanItem({ title: s.title, reason: s.reason, subject: s.subject, topic: s.topic, studyType: s.studyType }, s.id)} className="pill-ink shrink-0 cursor-pointer !px-3 !py-1 text-xs disabled:opacity-60">{c.added.has(s.id) ? <Check className="h-3.5 w-3.5" /> : "Add"}</button>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/calendar" className="pill-soft mt-3 inline-flex">Open calendar</Link>
          </section>
        </div>

        <div className="min-w-0 space-y-5">
          <section className="card-pastel p-5" data-tint="mint" aria-label="What I know about you">
            <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">What I know about you</h2>
            <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
              <li>Target: GATE {d.targetYear ?? "not set"}{d.daysToExam != null ? `, ${d.daysToExam} days to go` : ""}</li>
              {d.weakTopics.length > 0 && <li>Weakest: {d.weakTopics.slice(0, 3).map((t) => t.topic).join(", ")}</li>}
              <li>{d.open.length} open mistakes, {d.sessions.length} tests taken</li>
              {d.readiness && !noData && <li>Readiness estimate: about {Math.round(d.readiness.expectedMarks)} of 100 (an estimate)</li>}
            </ul>
            <h3 className="mt-4 text-sm font-bold text-[var(--text-primary)]">Things you told me</h3>
            <ul className="mt-1 space-y-1">
              {d.notes.map((n: MentorNote) => (
                <li key={n.id} className="flex items-start gap-2 rounded-xl bg-[var(--surface)] px-3 py-2 text-sm">
                  <span className="min-w-0 flex-1 break-words">{n.text}</span>
                  <button type="button" aria-label="Forget this" title="Forget this" onClick={() => d.saveNotes(d.notes.filter((x) => x.id !== n.id))} className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--tint-rose-ink)]"><X className="h-4 w-4" /></button>
                </li>
              ))}
              {d.notes.length === 0 && <li className="text-sm text-[var(--text-muted)]">Nothing yet. Add what helps me coach you, like &quot;I study best at night&quot;.</li>}
            </ul>
            <div className="mt-2 flex gap-2">
              <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNote()} maxLength={200} placeholder="Tell me something" aria-label="Tell the Mentor something"
                className="h-10 min-w-0 flex-1 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--tint-mint-ink)]" />
              <button type="button" onClick={addNote} className="btn-soft !h-10 !px-3" aria-label="Add note"><Plus className="h-4 w-4" /></button>
            </div>
            {d.notes.length > 0 && <button type="button" onClick={() => d.saveNotes([])} className="mt-2 inline-flex cursor-pointer items-center gap-1 text-xs text-[var(--text-muted)] hover:text-[var(--tint-rose-ink)]"><Trash2 className="h-3 w-3" /> Forget everything I told you</button>}
          </section>

          <section className="card-pastel p-5" data-tint="rose" aria-label="Next best actions">
            <h2 className="font-display text-lg font-extrabold text-[var(--text-primary)]">Next best actions</h2>
            <ul className="mt-2 space-y-2">
              {actions.map((a) => (
                <li key={a.t}>
                  <button type="button" onClick={() => (a.href ? router.push(a.href) : openChat(a.chat))} className="group flex w-full cursor-pointer items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 text-left">
                    <a.icon className="h-4 w-4 shrink-0 text-[var(--tint-rose-ink)]" />
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[var(--text-primary)]">{a.t}</span><span className="block truncate text-xs text-[var(--text-muted)]">{a.s}</span></span>
                    <ArrowRight className="h-4 w-4 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" />
                  </button>
                </li>
              ))}
            </ul>
            <Link href="/analytics/coach" className="pill-soft mt-3 inline-flex">See the full picture</Link>
          </section>
        </div>
      </div>
    </div>
  );
}
