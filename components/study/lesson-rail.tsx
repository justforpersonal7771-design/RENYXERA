"use client";

/**
 * Lesson side rail (owner, 18 Nov): highlights and notes, the real PYQs for the topic, and the AI Mentor, all inside the
 * lesson. The Mentor opens as a compact panel in place (like the planner or to-do panels), gets the lesson as context,
 * and its conversation is filed in the normal Mentor history (useMentorChat), so nothing sends the student away.
 * PYQs are read from the official CS bank (public/data/questions.json) by topic and link to each question's page.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { FileQuestion, Highlighter, Loader2, Send, Sparkles, X } from "lucide-react";
import { useMentorChat, clean } from "@/components/mentor/use-mentor-chat";
import { useMentorData } from "@/components/mentor/use-mentor-data";

type Pyq = { id: string; year: string; no: number; marks: number; type: string; href: string; text: string };

function usePyqs(topic: RegExp) {
  const [list, setList] = useState<Pyq[] | null>(null);
  useEffect(() => {
    let live = true;
    fetch("/data/questions.json").then((r) => r.json()).then((papers: { exam_metadata: { "year-shift": string }; questions: { question_id: string; question_no: number; marks: number; question_type: string; topic?: string; question_text?: string }[] }[]) => {
      if (!live) return;
      const out: Pyq[] = [];
      for (const p of papers) {
        const ys = p.exam_metadata["year-shift"];
        for (const q of p.questions) if (topic.test(q.topic ?? "")) out.push({ id: q.question_id, year: ys.replace("-", " "), no: q.question_no, marks: q.marks, type: q.question_type, href: `/pyq/gate-cs-${ys.toLowerCase()}/q${q.question_no}`, text: (q.question_text ?? "").replace(/\s+/g, " ").slice(0, 110) });
      }
      setList(out.sort((a, b) => b.year.localeCompare(a.year)));
    }).catch(() => { if (live) setList([]); });
    return () => { live = false; };
  }, [topic]);
  return list;
}

function Panel({ icon, title, children, tint }: { icon: ReactNode; title: string; children: ReactNode; tint: string }) {
  return <section className="card-pastel p-4" data-tint={tint}><p className="flex items-center gap-2 text-sm font-bold text-[var(--tint-ink)]">{icon}{title}</p><div className="mt-2">{children}</div></section>;
}

function MentorPanel({ open, onClose, lesson, section }: { open: boolean; onClose: () => void; lesson: string; section: string }) {
  const d = useMentorData();
  const c = useMentorChat(d.brief, { autoOpen: false });
  const [text, setText] = useState("");
  const started = useRef(false);
  const end = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [c.msgs.length, c.typingId]);
  const ask = (q: string) => {
    if (!q.trim() || c.busy) return;
    if (!started.current) { c.newChat(); started.current = true; }
    void c.send(`[Study lesson: ${lesson}. Section: ${section}.] ${q.trim()}`, "Ask");
    setText("");
  };
  const quick = ["Explain this section more simply", "Give me a similar GATE question", "Why does a cycle not always mean deadlock?"];
  return (
    <AnimatePresence>
      {open && (
        <motion.div role="dialog" aria-label="Ask the AI Mentor about this lesson"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }} transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed inset-x-2 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[110] flex max-h-[70dvh] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_30px_70px_-20px_rgba(0,0,0,.5)] sm:inset-x-auto sm:right-5 sm:w-[400px] lg:bottom-5">
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3">
            <Sparkles className="h-4 w-4 text-[var(--text-primary)]" aria-hidden />
            <div className="min-w-0 flex-1"><p className="text-sm font-bold text-[var(--text-primary)]">AI Mentor</p><p className="truncate text-xs text-[var(--text-secondary)]">About: {lesson}</p></div>
            <button type="button" onClick={onClose} aria-label="Close the Mentor" className="grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><X className="h-4 w-4" /></button>
          </div>
          <div className="no-scrollbar min-h-[180px] flex-1 space-y-3 overflow-y-auto p-4">
            {c.msgs.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-[var(--text-secondary)]">Ask anything about this lesson. Answers are the Mentor&apos;s explanation, not part of the checked lesson. The chat is saved in your Mentor history.</p>
                {quick.map((q) => <button key={q} type="button" onClick={() => ask(q)} className="block w-full rounded-xl border border-[var(--border)] px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">{q}</button>)}
              </div>
            )}
            {c.msgs.map((m) => (
              <div key={m.id} className={m.role === "user" ? "ml-8 rounded-2xl rounded-br-md bg-[var(--surface-secondary)] p-3 text-sm text-[var(--text-primary)]" : "mr-4 text-sm leading-relaxed text-[var(--text-primary)]"}>
                <p className="whitespace-pre-wrap">{clean(m.role === "user" ? m.text.replace(/^\[Study lesson:[^\]]*\]\s*/, "") : m.text) || (c.typingId === m.id ? "…" : "")}</p>
              </div>
            ))}
            {c.busy && !c.typingId && <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Loader2 className="h-4 w-4 animate-spin" /> Thinking…</p>}
            {!c.signedIn && <p className="text-sm text-[var(--text-secondary)]">Sign in to ask the Mentor.</p>}
            <div ref={end} />
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="flex items-end gap-2 border-t border-[var(--border)] p-3">
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={1} maxLength={1200} placeholder="Ask about this lesson" aria-label="Your question"
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(text); } }}
              className="field-bare max-h-28 min-h-10 flex-1 resize-none rounded-xl bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]" />
            <button type="submit" disabled={!text.trim() || c.busy} aria-label="Send" className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--ink)] text-[var(--background)] disabled:opacity-40"><Send className="h-4 w-4" /></button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LessonRail({ lesson, topic, pyqTopic, notes }: { lesson: string; topic: string; pyqTopic: RegExp; notes: ReactNode }) {
  const pyqs = usePyqs(pyqTopic);
  const [mentor, setMentor] = useState(false);
  const [all, setAll] = useState(false);
  // the notes list checks browser support for highlights, which the server cannot know: render it after mount
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one flip after mount
  useEffect(() => setMounted(true), []);
  return (
    <>
      <aside aria-label="Study tools" className="space-y-4 xl:sticky xl:top-24 xl:max-h-[calc(100dvh-7rem)] xl:overflow-y-auto xl:pr-1 no-scrollbar">
        {mounted ? notes : <section className="card-pastel p-4" data-tint="butter"><p className="flex items-center gap-2 text-sm font-bold text-[var(--tint-ink)]"><Highlighter className="h-4 w-4" aria-hidden />Highlights and notes</p></section>}
        <Panel icon={<FileQuestion className="h-4 w-4" aria-hidden />} title="Real GATE questions on this" tint="peri">
          {pyqs === null ? <p className="text-sm text-[var(--text-secondary)]">Loading…</p> : pyqs.length === 0 ? <p className="text-sm text-[var(--text-secondary)]">No past questions tagged to this topic yet.</p> : (
            <>
              <p className="text-sm text-[var(--text-primary)]"><b>{pyqs.length}</b> official questions, {pyqs.filter((q) => q.marks === 2).length} of them 2-mark.</p>
              <ul className="mt-2 space-y-1.5">
                {(all ? pyqs : pyqs.slice(0, 4)).map((q) => (
                  <li key={q.id}><Link href={q.href} className="block rounded-xl bg-[var(--surface)] px-3 py-2 hover:bg-[var(--surface-secondary)]">
                    <span className="block text-xs font-bold text-[var(--text-secondary)]">GATE CS {q.year}, Q{q.no}, {q.marks} mark{q.marks > 1 ? "s" : ""}, {q.type}</span>
                    <span className="line-clamp-2 block text-sm text-[var(--text-primary)]">{q.text}</span>
                  </Link></li>
                ))}
              </ul>
              {pyqs.length > 4 && <button type="button" onClick={() => setAll((x) => !x)} className="mt-2 text-sm font-bold underline underline-offset-4">{all ? "Show fewer" : `Show all ${pyqs.length}`}</button>}
            </>
          )}
        </Panel>
        <Panel icon={<Sparkles className="h-4 w-4" aria-hidden />} title="Stuck on a step?" tint="mint">
          <p className="text-sm text-[var(--text-primary)]">Ask the AI Mentor without leaving the lesson. It knows which lesson you are on.</p>
          <button type="button" onClick={() => setMentor(true)} className="pill-ink mt-3">Ask the Mentor</button>
        </Panel>
      </aside>
      <MentorPanel open={mentor} onClose={() => setMentor(false)} lesson={lesson} section={topic} />
    </>
  );
}
