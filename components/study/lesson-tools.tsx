"use client";

/**
 * Lesson tools (owner, 18 Nov, second pass): no side cards. Three floating buttons at the bottom right open their tool
 * on top of the lesson, so the reading column keeps the whole width:
 *   Notes   the highlights and notes list (lesson-highlights.tsx)
 *   PYQs    the real GATE questions on this topic as a short list; one opens in a modal and can be answered there
 *   Mentor  a chat window that can be dragged, minimised and switched to an earlier chat; filed in Mentor history
 * Everything renders into document.body so the page's own layers cannot clip it.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import { Check, FileQuestion, Highlighter, History, Loader2, Minus, Plus, Send, X } from "lucide-react";
import { useMentorChat } from "@/components/mentor/use-mentor-chat";
import { useMentorData } from "@/components/mentor/use-mentor-data";
import { MentorRich } from "@/components/mentor/mentor-rich";
import { MentorLogo } from "@/components/brand/mentor-logo";
import { AstNodeRenderer } from "@/components/exam/ast-node-renderer";
import { NatInput } from "@/components/exam/nat-input";
import { useDataStore } from "@/store/use-data-store";
import { QuestionRepository } from "@/lib/repository/question-repository";
import { ensureAnswers } from "@/lib/repository/answer-keys";
import { isResponseCorrect } from "@/lib/grading";
import type { RenderableQuestion } from "@/types/question.types";

type Tool = "notes" | "pyqs" | null;
type Anchor = { right: number; bottom: number } | null;
/** Where a panel opens: right above the button that opened it, right edges aligned (phones keep the full-width sheet). */
const anchorOf = (el: HTMLElement): Anchor => {
  if (window.innerWidth < 640) return null;
  const r = el.getBoundingClientRect();
  return { right: Math.max(8, Math.round(window.innerWidth - r.right)), bottom: Math.round(window.innerHeight - r.top + 10) };
};

function Portal({ children }: { children: ReactNode }) {
  const [ok, setOk] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- document exists only after mount
  useEffect(() => setOk(true), []);
  return ok ? createPortal(children, document.body) : null;
}

const paperName = (ys: string) => ys.replace(/-/g, " ").replace(/\b(fn|an)\b/gi, (m) => m.toUpperCase());

/** Official questions on this topic from the loaded bank (answers stay on the server until checked). */
function useTopicPyqs(topic: RegExp) {
  const ready = useDataStore((s) => s.isInitialized);
  const init = useDataStore((s) => s.initializeData);
  useEffect(() => { if (!ready) void init(); }, [ready, init]);
  return useMemo(() => {
    if (!ready) return null;
    return QuestionRepository.getAllQuestions()
      .filter((q) => q.question_id.startsWith("GATE_") && topic.test(q.topic ?? ""))
      .sort((a, b) => b.year_shift.localeCompare(a.year_shift) || a.question_no - b.question_no);
  }, [ready, topic]);
}

/* ---------------------------------------------------------------- PYQ modal: answer it in place */
function PyqModal({ q, onClose }: { q: RenderableQuestion | null; onClose: () => void }) {
  const [sel, setSel] = useState<string[]>([]);
  const [nat, setNat] = useState("");
  const [state, setState] = useState<"idle" | "checking" | "right" | "wrong" | "offline">("idle");
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!q) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };
    window.addEventListener("keydown", k, true);
    return () => window.removeEventListener("keydown", k, true);
  }, [q, onClose]);
  const check = async () => {
    if (!q) return;
    setState("checking");
    const ok = await ensureAnswers([q.question_id], { timeoutMs: 6000 }).catch(() => false);
    if (!ok) { setState("offline"); return; }
    setState(isResponseCorrect(q, sel, nat) ? "right" : "wrong");
  };
  const shown = state === "right" || state === "wrong";
  const pick = (id: string) => { if (shown || !q) return; setSel((s) => (q.question_type === "MSQ" ? (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]) : [id])); };
  return (
    <AnimatePresence onExitComplete={() => { setSel([]); setNat(""); setState("idle"); }}>
      {q && (
        <motion.div className="fixed inset-0 z-[400] flex items-end justify-center bg-black/45 sm:items-center sm:p-6" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
          <motion.div role="dialog" aria-modal="true" aria-label={`GATE CS ${paperName(q.year_shift)}, question ${q.question_no}`} onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { y: 30, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={reduce ? { opacity: 0 } : { y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 34 }}
            className="no-scrollbar flex max-h-[90dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_30px_80px_-20px_rgba(0,0,0,.5)] sm:rounded-3xl">
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-3">
              <FileQuestion className="h-5 w-5 text-[var(--text-primary)]" aria-hidden />
              <p className="min-w-0 flex-1 text-sm font-bold text-[var(--text-primary)]">GATE CS {paperName(q.year_shift)}, Q{q.question_no} <span className="font-semibold text-[var(--text-secondary)]">· {q.marks} mark{q.marks > 1 ? "s" : ""} · {q.question_type}</span></p>
              <button type="button" onClick={onClose} aria-label="Close question" className="grid h-9 w-9 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><X className="h-4 w-4" /></button>
            </div>
            <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto p-5">
              <AstNodeRenderer nodes={q.contentAst} className="text-[16px] leading-relaxed text-[var(--text-primary)]" />
              {q.question_type === "NAT" ? <NatInput value={nat} onChange={setNat} /> : (
                <ul className="grid gap-2">
                  {q.options.map((o, i) => {
                    const on = sel.includes(o.option_id);
                    const tone = shown ? (o.is_correct ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" : on ? "border-rose-600 bg-rose-50 dark:bg-rose-950/40" : "border-[var(--border)]") : on ? "border-[var(--text-primary)] bg-[var(--surface-secondary)]" : "border-[var(--border)] hover:bg-[var(--surface-secondary)]";
                    return (
                      <li key={o.option_id}><button type="button" onClick={() => pick(o.option_id)} aria-pressed={on} className={`flex w-full items-start gap-3 rounded-2xl border-2 p-3 text-left ${tone}`}>
                        <span className={`grid h-7 w-7 shrink-0 place-items-center ${q.question_type === "MSQ" ? "rounded-md" : "rounded-full"} border-2 border-current text-xs font-bold`}>{on ? <Check className="h-4 w-4" /> : String.fromCharCode(65 + i)}</span>
                        <span className="min-w-0 flex-1 text-[var(--text-primary)]"><AstNodeRenderer nodes={o.contentAst} /></span>
                      </button></li>
                    );
                  })}
                </ul>
              )}
              {state === "right" && <p role="status" className="rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white">Right.</p>}
              {state === "wrong" && <p role="status" className="rounded-2xl bg-rose-600 px-4 py-3 font-bold text-white">Not quite.{q.question_type === "NAT" && q.nat_answer_range ? ` Accepted: ${q.nat_answer_range.min}${q.nat_answer_range.max !== q.nat_answer_range.min ? ` to ${q.nat_answer_range.max}` : ""}.` : " The right option is marked green."}</p>}
              {state === "offline" && <p role="status" className="rounded-2xl bg-[var(--surface-secondary)] px-4 py-3 text-sm text-[var(--text-primary)]">Couldn&apos;t check right now. Try again when you are online.</p>}
            </div>
            <div className="flex gap-2 border-t border-[var(--border)] p-3">
              {shown ? <button type="button" onClick={() => { setSel([]); setNat(""); setState("idle"); }} className="pill-soft">Try again</button> : null}
              <span className="flex-1" />
              {!shown && <button type="button" onClick={() => void check()} disabled={state === "checking" || (q.question_type === "NAT" ? !nat.trim() : !sel.length)} className="pill-ink disabled:opacity-40">{state === "checking" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check answer"}</button>}
              {shown && <button type="button" onClick={onClose} className="pill-ink">Back to the lesson</button>}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------------------------------------------------------------- Mentor window */
type NoteItem = { quote: string; note: string };
/** The student's own highlights and notes, short enough to travel with each question. */
const notesContext = (items: NoteItem[]) => {
  if (!items.length) return "";
  const lines = items.slice(-8).map((h) => `"${h.quote.replace(/\s+/g, " ").slice(0, 160)}"${h.note.trim() ? ` (my note: ${h.note.trim().slice(0, 160)})` : ""}`);
  return ` My highlights: ${lines.join("; ")}.`;
};

function MentorWindow({ open, onClose, lesson, section, notes, anchor }: { open: boolean; onClose: () => void; lesson: string; section: string; notes: NoteItem[]; anchor: Anchor }) {
  const d = useMentorData();
  const c = useMentorChat(d.brief, { autoOpen: false });
  const [text, setText] = useState("");
  const [min, setMin] = useState(false);
  const [hist, setHist] = useState(false);
  const started = useRef(false);
  const end = useRef<HTMLDivElement>(null);
  const bounds = useRef<HTMLDivElement>(null);
  const drag = useDragControls();
  const reduce = useReducedMotion();
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [c.msgs.length, c.typingId, min, hist]);
  const ask = (q: string) => {
    if (!q.trim() || c.busy) return;
    if (!started.current) { c.newChat(); started.current = true; }
    void c.send(`[Study lesson: ${lesson}. Section: ${section}.${notesContext(notes)}] ${q.trim()}`, "Ask");
    setText(""); setHist(false);
  };
  const quick = [...(notes.length ? ["Explain my highlights", "Quiz me on my notes"] : []), "Explain this section more simply", "Give me a similar GATE question"];
  return (
    <>
      <div ref={bounds} aria-hidden className="pointer-events-none fixed inset-2 z-[0]" />
      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-label="AI Mentor" drag dragListener={false} dragControls={drag} dragMomentum={false} dragConstraints={bounds} dragElastic={0.04}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }} transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={anchor ? { right: anchor.right, bottom: anchor.bottom, left: "auto", transformOrigin: "bottom right" } : undefined}
            className={`fixed inset-x-2 bottom-[calc(9.5rem+env(safe-area-inset-bottom))] z-[300] flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_30px_70px_-20px_rgba(0,0,0,.5)] sm:w-[420px] ${min ? "" : "h-[min(620px,calc(100dvh-10rem))]"}`}>
            <div onPointerDown={(e) => { if (window.innerWidth >= 640 && !(e.target as HTMLElement).closest("button")) drag.start(e); }}
              className="flex cursor-grab items-center gap-2 border-b border-[var(--border)] px-3 py-2.5 active:cursor-grabbing sm:touch-none">
              <MentorLogo className="h-8" mode={c.busy ? "think" : "still"} />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-[var(--text-primary)]">{hist ? "Your Mentor chats" : c.msgs.length ? c.title : "AI Mentor"}</p><p className="truncate text-xs text-[var(--text-secondary)]">About: {lesson}</p></div>
              <button type="button" onClick={() => { setHist((h) => !h); setMin(false); }} aria-pressed={hist} aria-label="Chat history" title="Chat history" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><History className="h-4 w-4" /></button>
              <button type="button" onClick={() => { c.newChat(); started.current = true; setHist(false); setMin(false); }} aria-label="New chat" title="New chat" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><Plus className="h-4 w-4" /></button>
              <button type="button" onClick={() => setMin((m) => !m)} aria-label={min ? "Expand" : "Minimise"} title={min ? "Expand" : "Minimise"} className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><Minus className="h-4 w-4" /></button>
              <button type="button" onClick={onClose} aria-label="Close the Mentor" title="Close" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><X className="h-4 w-4" /></button>
            </div>
            {!min && (hist ? (
              <ul className="no-scrollbar flex-1 space-y-1 overflow-y-auto p-2">
                {c.chats.length === 0 && <li className="p-3 text-sm text-[var(--text-secondary)]">No earlier chats yet.</li>}
                {c.chats.map((ch) => (
                  <li key={ch.id}><button type="button" onClick={() => { void c.openChat(ch.id); started.current = true; setHist(false); }}
                    className={`block w-full rounded-xl px-3 py-2 text-left hover:bg-[var(--surface-secondary)] ${ch.id === c.activeId ? "bg-[var(--surface-secondary)]" : ""}`}>
                    <span className="block truncate text-sm font-semibold text-[var(--text-primary)]">{ch.title || "Untitled chat"}</span>
                    <span className="block text-xs text-[var(--text-secondary)]">{new Date(ch.updatedAt).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" })}</span>
                  </button></li>
                ))}
              </ul>
            ) : (
              <>
                <div className="no-scrollbar flex-1 space-y-3 overflow-y-auto p-4">
                  {c.msgs.length === 0 && (
                    <div className="space-y-2">
                      <p className="text-sm text-[var(--text-secondary)]">Ask anything about this lesson. {notes.length ? `The Mentor can see your ${notes.length} highlight${notes.length === 1 ? "" : "s"} and notes. ` : "Highlight text in the lesson and the Mentor can use it. "}The chat is saved in your Mentor history.</p>
                      {quick.map((q) => <button key={q} type="button" onClick={() => ask(q)} className="block w-full rounded-xl border border-[var(--border)] px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">{q}</button>)}
                    </div>
                  )}
                  {c.msgs.map((m) => m.role === "user"
                    ? <div key={m.id} className="ml-10 rounded-2xl rounded-br-md bg-[var(--surface-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]">{m.text.replace(/^\[Study lesson:[^\]]*\]\s*/, "")}</div>
                    : <div key={m.id} className="mr-2 text-sm text-[var(--text-primary)]">{m.text ? <MentorRich text={m.text} /> : c.typingId === m.id ? "…" : ""}</div>)}
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
              </>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ---------------------------------------------------------------- the floating dock */
export function LessonTools({ lesson, section, pyqTopic, notes, noteCount, noteItems = [] }: { lesson: string; section: string; pyqTopic: RegExp; notes: ReactNode; noteCount: number; noteItems?: NoteItem[] }) {
  const pyqs = useTopicPyqs(pyqTopic);
  const [tool, setTool] = useState<Tool>(null);
  const [mentor, setMentor] = useState(false);
  const [at, setAt] = useState<Anchor>(null);
  const [mAt, setMAt] = useState<Anchor>(null);
  const [q, setQ] = useState<RenderableQuestion | null>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!tool) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setTool(null); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [tool]);
  const twoMark = pyqs?.filter((x) => x.marks === 2).length ?? 0;
  const btn = "flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] shadow-[0_10px_30px_-12px_rgba(0,0,0,.35)] transition-transform hover:-translate-y-0.5 active:translate-y-0";
  return (
    <Portal>
      <AnimatePresence>
        {tool && (
          <motion.div role="dialog" aria-label={tool === "notes" ? "Highlights and notes" : "Real GATE questions on this topic"}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10 }} transition={{ type: "spring", stiffness: 420, damping: 34 }}
            style={at ? { right: at.right, bottom: at.bottom, left: "auto", transformOrigin: "bottom right" } : undefined}
            className="no-scrollbar fixed inset-x-2 bottom-[calc(9.5rem+env(safe-area-inset-bottom))] z-[290] max-h-[60dvh] overflow-y-auto rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-[0_30px_70px_-20px_rgba(0,0,0,.45)] sm:w-[400px]">
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">{tool === "notes" ? <><Highlighter className="h-4 w-4" aria-hidden /> Highlights and notes</> : <><FileQuestion className="h-4 w-4" aria-hidden /> Real GATE questions</>}</p>
              <button type="button" onClick={() => setTool(null)} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full hover:bg-[var(--surface-secondary)]"><X className="h-4 w-4" /></button>
            </div>
            {tool === "notes" ? notes : pyqs === null ? <p className="p-2 text-sm text-[var(--text-secondary)]">Loading…</p> : pyqs.length === 0 ? <p className="p-2 text-sm text-[var(--text-secondary)]">No past questions tagged to this topic yet.</p> : (
              <>
                <p className="px-1 text-sm text-[var(--text-secondary)]"><b className="text-[var(--text-primary)]">{pyqs.length}</b> official questions, {twoMark} of them 2-mark. Tap one to try it here.</p>
                <ul className="mt-2 space-y-1">
                  {pyqs.map((x) => (
                    <li key={x.question_id}><button type="button" onClick={() => setQ(x)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--surface-secondary)]">
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg text-xs font-extrabold ${x.marks === 2 ? "bg-[var(--tint-rose)] text-[var(--tint-rose-ink)]" : "bg-[var(--tint-sky)] text-[var(--tint-sky-ink)]"}`}>{x.marks}M</span>
                      <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-[var(--text-primary)]">GATE CS {paperName(x.year_shift)}</span><span className="block text-xs text-[var(--text-secondary)]">Question {x.question_no} · {x.question_type}</span></span>
                    </button></li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-3 z-[280] flex flex-col items-end gap-2 sm:right-6 lg:bottom-6">
        <div className="flex gap-2">
          <button type="button" onClick={(e) => { setAt(anchorOf(e.currentTarget)); setMentor(false); setTool((t) => (t === "notes" ? null : "notes")); }} aria-pressed={tool === "notes"} className={`${btn} hl-btn`}><Highlighter className="h-4 w-4" aria-hidden /> <span className="hl-ink">Notes</span>{noteCount > 0 && <span className="rounded-full bg-white/70 px-1.5 text-xs text-[#3a2a00]">{noteCount}</span>}</button>
          <button type="button" onClick={(e) => { setAt(anchorOf(e.currentTarget)); setMentor(false); setTool((t) => (t === "pyqs" ? null : "pyqs")); }} aria-pressed={tool === "pyqs"} className={`${btn} !border-transparent !bg-[var(--tint-peri)] !text-[var(--tint-peri-ink)]`}><FileQuestion className="h-4 w-4" aria-hidden /> PYQs{pyqs && pyqs.length > 0 && <span className="rounded-full bg-white/60 px-1.5 text-xs dark:bg-black/25">{pyqs.length}</span>}</button>
          <button type="button" onClick={(e) => { setMAt(anchorOf(e.currentTarget)); setMentor((m) => !m); setTool(null); }} aria-pressed={mentor} className={`${btn} !py-1.5 !pl-2`}><MentorLogo className="h-7" mode="blink" /> Ask Mentor</button>
        </div>
      </div>
      <MentorWindow open={mentor} onClose={() => setMentor(false)} lesson={lesson} section={section} notes={noteItems} anchor={mAt} />
      <PyqModal q={q} onClose={() => setQ(null)} />
    </Portal>
  );
}
