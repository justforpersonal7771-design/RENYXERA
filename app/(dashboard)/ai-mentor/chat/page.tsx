"use client";

/**
 * AI Mentor: the dedicated chat screen, built like the chat apps students already know:
 * a history of chats (rename, pin, delete), edit an earlier message and keep both versions (the "1 / 2" pager),
 * ask again for another answer, a thinking animation, and answers that type out.
 */
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Copy, Flag, History, MessageSquarePlus, Pencil, Pin, PinOff, RefreshCw, Search, Send, Sparkles, ThumbsUp, Trash2, X } from "lucide-react";
import { Segmented } from "@/components/ui/folder-tabs";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { CardView, MODES, Mode, Msg, Voice, clean, useMentorChat } from "@/components/mentor/use-mentor-chat";
import { useMentorData } from "@/components/mentor/use-mentor-data";
import { istDateStr } from "@/lib/time/ist";
import type { ChatMeta } from "@/lib/mentor/chat-tree";

const AUTO: Partial<Record<Mode, string>> = {
  Plan: "Make me a study plan for this week from my data.", Review: "Review my last test.", Weekly: "Give me my weekly review.",
  Quiz: "Quiz me on my weakest topic.", Socratic: "Guide me on my weakest topic. Ask me one question at a time.",
};
const STARTERS: { icon: typeof Sparkles; title: string; text: string; mode?: Mode }[] = [
  { icon: Sparkles, title: "Plan my week", text: AUTO.Plan!, mode: "Plan" },
  { icon: RefreshCw, title: "Review my last test", text: AUTO.Review!, mode: "Review" },
  { icon: Pencil, title: "Quiz me", text: AUTO.Quiz!, mode: "Quiz" },
  { icon: History, title: "My weekly review", text: AUTO.Weekly!, mode: "Weekly" },
];

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Gemini-style thinking: a turning sparkle, a shimmering line that changes wording, and soft placeholder lines. */
function Thinking() {
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep((s) => s + 1), 2200); return () => clearInterval(t); }, []);
  const words = ["Thinking", "Working it out", "Putting the answer together", "Almost there"];
  return (
    <div className="flex items-start gap-3" role="status" aria-live="polite" aria-label="The Mentor is thinking">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full">
        <span aria-hidden className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--tint-sky-ink),var(--tint-peri-ink),var(--tint-rose-ink),var(--tint-sky-ink))] opacity-70 motion-safe:animate-[spin_2.4s_linear_infinite]" />
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-[var(--surface)]"><Sparkles className="h-4 w-4 text-[var(--tint-peri-ink)] motion-safe:animate-pulse" /></span>
      </span>
      <div className="min-w-0 flex-1 pt-1.5">
        <p className="shimmer-text text-sm font-bold">{words[Math.min(step, words.length - 1)]}…</p>
        <div className="mt-2 space-y-2" aria-hidden>
          {[92, 78, 55].map((w, i) => <span key={w} className="block h-2.5 rounded-full bg-[var(--surface-secondary)] motion-safe:animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 160}ms` }} />)}
        </div>
      </div>
    </div>
  );
}

/** Types the answer out, like the chat apps do. Tap the text to show it all at once. */
function Typewriter({ text, active, onDone }: { text: string; active: boolean; onDone: () => void }) {
  const [n, setN] = useState(active && !prefersReduced() ? 0 : text.length);
  const doneRef = useRef(false);
  useEffect(() => {
    if (!active || prefersReduced()) { setN(text.length); return; }
    setN(0); doneRef.current = false;
    const step = Math.max(2, Math.ceil(text.length / 160));
    const t = setInterval(() => setN((c) => { const next = Math.min(text.length, c + step); if (next >= text.length) clearInterval(t); return next; }), 18);
    return () => clearInterval(t);
  }, [text, active]);
  useEffect(() => { if (active && n >= text.length && !doneRef.current) { doneRef.current = true; onDone(); } }, [n, text.length, active, onDone]);
  return <p className="whitespace-pre-wrap leading-relaxed" onClick={() => setN(text.length)}>{text.slice(0, n)}{active && n < text.length && <span aria-hidden className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 rounded-sm bg-[var(--tint-peri-ink)] motion-safe:animate-pulse" />}</p>;
}

function Pager({ m, onStep }: { m: Msg; onStep: (id: string, d: -1 | 1) => void }) {
  if (!m.sib) return null;
  const { index, count } = m.sib;
  return (
    <span className="inline-flex items-center text-xs font-bold text-[var(--text-muted)]" aria-label={`Version ${index + 1} of ${count}`}>
      <button type="button" disabled={index === 0} onClick={() => onStep(m.id, -1)} aria-label="Previous version" className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)] disabled:opacity-30"><ChevronLeft className="h-3.5 w-3.5" /></button>
      <span className="font-num tabular-nums">{index + 1} / {count}</span>
      <button type="button" disabled={index === count - 1} onClick={() => onStep(m.id, 1)} aria-label="Next version" className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)] disabled:opacity-30"><ChevronRight className="h-3.5 w-3.5" /></button>
    </span>
  );
}

/** "Today", "Yesterday", "Previous 7 days", "Older", with days counted in India time. */
function groupChats(list: ChatMeta[]): { label: string; items: ChatMeta[] }[] {
  const today = istDateStr(), yest = istDateStr(new Date(Date.now() - 86400000)), week = istDateStr(new Date(Date.now() - 7 * 86400000));
  const g: Record<string, ChatMeta[]> = { Pinned: [], Today: [], Yesterday: [], "Previous 7 days": [], Older: [] };
  for (const c of list) {
    const d = istDateStr(new Date(c.updatedAt));
    (c.pinned ? g.Pinned : d === today ? g.Today : d === yest ? g.Yesterday : d >= week ? g["Previous 7 days"] : g.Older).push(c);
  }
  return Object.entries(g).filter(([, v]) => v.length).map(([label, items]) => ({ label, items }));
}

function ChatScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const d = useMentorData();
  const c = useMentorChat(d.brief);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [renaming, setRenaming] = useState<{ id: string; text: string } | null>(null);
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [typedDone, setTypedDone] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const fired = useRef(false);
  const fromBar = params.get("from") === "bar";

  const scrollDown = useCallback(() => { const el = listRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: prefersReduced() ? "auto" : "smooth" }); }, []);
  useEffect(() => { scrollDown(); }, [c.msgs.length, c.busy, c.activeId, scrollDown]);

  // Arriving from the Mentor home with a heavy request: run it once, in a fresh chat, when the Mentor's data and history are loaded.
  useEffect(() => {
    const m = params.get("mode") as Mode | null;
    if (fired.current || !m || params.get("auto") !== "1" || !d.ready || !c.loaded || !AUTO[m]) return;
    fired.current = true; c.newChat(); c.setMode(m); void c.send(AUTO[m]!, m);
    router.replace(fromBar ? "/ai-mentor/chat?from=bar" : "/ai-mentor/chat");
  }, [params, d.ready, c.loaded, c, router, fromBar]);

  const submit = () => { const t = input; if (!t.trim() || c.busy) return; setInput(""); void c.send(t); };
  const copy = async (id: string, text: string) => { try { await navigator.clipboard.writeText(clean(text)); setCopied(id); setTimeout(() => setCopied((x) => (x === id ? null : x)), 1500); } catch { /* clipboard blocked */ } };
  const askDelete = async (m: ChatMeta) => { if (await confirmDialog({ title: "Delete this chat?", message: `"${m.title}" and all its versions will be removed from this device.`, confirmLabel: "Delete", tone: "danger" })) void c.deleteChat(m.id); };
  const groups = useMemo(() => groupChats(c.chats.filter((x) => !query.trim() || x.title.toLowerCase().includes(query.trim().toLowerCase()))), [c.chats, query]);
  const lastId = c.msgs[c.msgs.length - 1]?.id;

  const history = (
    <div className="flex h-full min-h-0 flex-col">
      <button type="button" onClick={() => { c.newChat(); setDrawer(false); }} className="btn-main !h-10 w-full justify-center !text-sm"><MessageSquarePlus className="h-4 w-4" /> New chat</button>
      <label className="relative mt-3 block">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chats" aria-label="Search chats" className="h-10 w-full rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm outline-none focus:border-[var(--tint-sky-ink)]" />
      </label>
      <nav aria-label="Chat history" className="custom-scrollbar mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {groups.length === 0 && <p className="px-2 text-sm text-[var(--text-muted)]">{query ? "No chats match." : "Your chats will appear here."}</p>}
        {groups.map((g) => (
          <div key={g.label}>
            <p className="px-2 pb-1 text-xs font-bold text-[var(--text-muted)]">{g.label}</p>
            <ul className="space-y-0.5">
              {g.items.map((m) => (
                <li key={m.id} className={`group flex items-center gap-1 rounded-xl px-2 py-1.5 ${m.id === c.activeId ? "bg-[var(--surface)] shadow-sm" : "hover:bg-[var(--surface)]/60"}`}>
                  {renaming?.id === m.id ? (
                    <input autoFocus value={renaming.text} aria-label="Chat name" maxLength={80} onChange={(e) => setRenaming({ id: m.id, text: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") { void c.renameChat(m.id, renaming.text); setRenaming(null); } if (e.key === "Escape") setRenaming(null); }}
                      onBlur={() => { void c.renameChat(m.id, renaming.text); setRenaming(null); }}
                      className="h-8 min-w-0 flex-1 rounded-lg border-2 border-[var(--tint-sky-ink)] bg-[var(--surface)] px-2 text-sm outline-none" />
                  ) : (
                    <button type="button" onClick={() => { void c.openChat(m.id); setDrawer(false); }} aria-current={m.id === c.activeId ? "true" : undefined} className="min-w-0 flex-1 cursor-pointer truncate text-left text-sm text-[var(--text-primary)]" title={m.title}>{m.title}</button>
                  )}
                  {renaming?.id !== m.id && (
                    <span className="flex shrink-0 items-center opacity-100 lg:opacity-0 lg:transition-opacity lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
                      <button type="button" onClick={() => c.pinChat(m.id)} aria-label={m.pinned ? "Unpin chat" : "Pin chat"} title={m.pinned ? "Unpin" : "Pin"} className="cursor-pointer rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--surface-secondary)]">{m.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}</button>
                      <button type="button" onClick={() => setRenaming({ id: m.id, text: m.title })} aria-label="Rename chat" title="Rename" className="cursor-pointer rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--surface-secondary)]"><Pencil className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => void askDelete(m)} aria-label="Delete chat" title="Delete" className="cursor-pointer rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--tint-rose-ink)]"><Trash2 className="h-3.5 w-3.5" /></button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <p className="mt-2 text-[11px] leading-snug text-[var(--text-muted)]">Chats are saved on this device.</p>
    </div>
  );

  return (
    <div className="flex h-[calc(100dvh-9.5rem)] min-h-[26rem] w-full gap-3" data-fill-height="always">
      <aside aria-label="Chats" className="card-well hidden w-64 shrink-0 p-3 lg:block" data-tint="sky">{history}</aside>
      {/* Portalled to <body>: the page container is transformed, which would trap a fixed drawer under the top bar. */}
      {mounted && createPortal(<AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[300] lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="absolute inset-0 bg-black/30" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", stiffness: 380, damping: 36 }} aria-label="Chats" className="card-well absolute inset-y-0 left-0 w-[17rem] max-w-[85vw] rounded-l-none p-3" data-tint="sky">
              <button type="button" onClick={() => setDrawer(false)} aria-label="Close history" className="absolute right-2 top-2 cursor-pointer rounded-lg p-1.5 hover:bg-[var(--surface)]"><X className="h-4 w-4" /></button>
              <div className="h-full pt-8">{history}</div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>, document.body)}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setDrawer(true)} className="btn-soft !h-10 !px-3 text-sm lg:hidden" aria-label="Chat history"><History className="h-4 w-4" /></button>
          {!fromBar && <Link href="/ai-mentor" className="btn-soft !h-10 !px-3 text-sm"><ArrowLeft className="h-4 w-4" /> Mentor</Link>}
          <h1 className="min-w-0 flex-1 truncate font-display text-xl font-extrabold text-[var(--text-primary)] max-sm:order-last max-sm:basis-full" title={c.title}>{c.activeId ? c.title : "Chat with your Mentor"}</h1>
          <Segmented label="Mentor voice" value={c.voice} onChange={(v: Voice) => c.setVoice(v)} options={[{ id: "Friendly", label: "Friendly" }, { id: "Strict", label: "Strict" }, { id: "Concise", label: "Concise" }]} />
          <button type="button" onClick={c.newChat} className="btn-soft !h-10 !px-3" aria-label="New chat" title="New chat"><MessageSquarePlus className="h-4 w-4" /></button>
        </div>
        <div className="mb-2 max-w-full overflow-x-auto"><Segmented label="Mentor mode" value={c.mode} onChange={c.setMode} options={MODES} /></div>

        <section className="card-well flex min-h-0 flex-1 flex-col p-3 sm:p-4" data-tint="lilac" aria-label="Conversation">
          <div ref={listRef} className="custom-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto pr-1" aria-live="polite">
            {c.msgs.length === 0 && !c.busy && (
              <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--surface)]"><Sparkles className="h-6 w-6 text-[var(--tint-peri-ink)]" /></span>
                <h2 className="mt-3 font-display text-2xl font-extrabold text-[var(--text-primary)]">What shall we work on?</h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">Ask anything about your preparation, or start with one of these.</p>
                <div className="mt-5 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                  {STARTERS.map((s) => (
                    <button key={s.title} type="button" onClick={() => { if (s.mode) c.setMode(s.mode); void c.send(s.text, s.mode ?? "Ask"); }}
                      className="group flex cursor-pointer items-center gap-3 rounded-2xl bg-[var(--surface)] p-3 text-left transition-transform hover:-translate-y-0.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[var(--surface-secondary)]"><s.icon className="h-4 w-4 text-[var(--text-primary)]" /></span>
                      <span className="min-w-0"><span className="block text-sm font-bold text-[var(--text-primary)]">{s.title}</span><span className="block truncate text-xs text-[var(--text-muted)]">{s.text}</span></span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {c.msgs.map((m) => (
              <div key={m.id} className={`group/msg flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "user" ? (
                  <div className="flex max-w-[88%] flex-col items-end gap-1 lg:max-w-[72%]">
                    {editing?.id === m.id ? (
                      <div className="w-full min-w-[16rem] rounded-2xl border-2 border-[var(--tint-sky-ink)] bg-[var(--surface)] p-2">
                        <textarea autoFocus rows={3} value={editing.text} onChange={(e) => setEditing({ id: m.id, text: e.target.value })} maxLength={1500} aria-label="Edit your message"
                          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (editing.text.trim()) { void c.editAndResend(m.id, editing.text); setEditing(null); } } if (e.key === "Escape") setEditing(null); }}
                          className="w-full resize-none bg-transparent px-2 py-1 text-sm text-[var(--text-primary)] outline-none" />
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => setEditing(null)} className="pill-soft cursor-pointer text-xs">Cancel</button>
                          <button type="button" disabled={!editing.text.trim() || c.busy} onClick={() => { void c.editAndResend(m.id, editing.text); setEditing(null); }} className="pill-ink cursor-pointer text-xs disabled:opacity-50">Send</button>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-[var(--btn)] px-4 py-3 text-sm text-[var(--btn-fg)]"><p className="whitespace-pre-wrap leading-relaxed">{clean(m.text)}</p></div>
                    )}
                    {editing?.id !== m.id && (
                      <div className="flex items-center gap-0.5 text-[var(--text-muted)]">
                        <Pager m={m} onStep={c.stepVersion} />
                        <span className="flex items-center gap-0.5 lg:opacity-0 lg:transition-opacity lg:group-focus-within/msg:opacity-100 lg:group-hover/msg:opacity-100">
                        <button type="button" onClick={() => setEditing({ id: m.id, text: m.text })} disabled={c.busy} aria-label="Edit message" title="Edit" className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)] disabled:opacity-40"><Pencil className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => void copy(m.id, m.text)} aria-label="Copy message" title="Copy" className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)]">{copied === m.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex max-w-[92%] items-start gap-3 lg:max-w-[78%]">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--surface)]"><Sparkles className="h-4 w-4 text-[var(--tint-peri-ink)]" /></span>
                    <div className="min-w-0 flex-1 text-sm text-[var(--text-primary)]">
                      <div className="rounded-2xl bg-[var(--surface)] px-4 py-3">
                        <Typewriter text={clean(m.text)} active={c.typingId === m.id && !typedDone.has(m.id)} onDone={() => setTypedDone((s) => new Set(s).add(m.id))} />
                        {(c.typingId !== m.id || typedDone.has(m.id)) && (
                          <>
                            {m.warn && <p className="mt-2 rounded-lg bg-[var(--tint-butter)] px-2 py-1 text-xs text-[var(--tint-butter-ink)]">Check these numbers before relying on them: {m.warn.join(", ")}. They are not in your data.</p>}
                            {(m.cards as import("@/lib/mentor/brief").MentorCard[] | undefined)?.map((cd, i) => <CardView key={i} c={cd} added={c.added} onAdd={(it, k) => c.addPlanItem(it, `${m.id}-${k}`)} idKey={m.id} go={(h) => router.push(h)} />)}
                            {m.followUps && m.followUps.length > 0 && m.id === lastId && <div className="mt-2 flex flex-wrap gap-2">{m.followUps.map((f) => <button key={f} type="button" onClick={() => c.send(f)} className="pill-soft cursor-pointer text-xs">{f}</button>)}</div>}
                          </>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-0.5 text-[var(--text-muted)]">
                        <Pager m={m} onStep={c.stepVersion} />
                        <button type="button" onClick={() => void copy(m.id, m.text)} aria-label="Copy answer" title="Copy" className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)]">{copied === m.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button>
                        <button type="button" onClick={() => void c.regenerate(m.id)} disabled={c.busy} aria-label="Answer again" title="Answer again" className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)] disabled:opacity-40"><RefreshCw className="h-3.5 w-3.5" /></button>
                        <button type="button" aria-label="Helpful" title="Helpful" onClick={() => c.mark(m.id, "liked")} className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)]"><ThumbsUp className={`h-3.5 w-3.5 ${m.liked ? "text-[var(--tint-mint-ink)]" : ""}`} /></button>
                        <button type="button" aria-label="This was wrong" title="This was wrong" onClick={() => c.mark(m.id, "flagged")} className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)]"><Flag className={`h-3.5 w-3.5 ${m.flagged ? "text-[var(--tint-rose-ink)]" : ""}`} /></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {c.busy && <Thinking />}
          </div>

          <form className="mx-auto mt-3 flex w-full max-w-3xl items-end gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
            <textarea value={input} rows={1} onChange={(e) => { setInput(e.target.value); e.currentTarget.style.height = "auto"; e.currentTarget.style.height = `${Math.min(e.currentTarget.scrollHeight, 140)}px`; }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }} maxLength={1500} placeholder="Ask your Mentor" aria-label="Message your Mentor"
              className="h-12 max-h-[140px] min-w-0 flex-1 resize-none rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)] outline-none focus:border-[var(--tint-sky-ink)]" />
            <button type="submit" disabled={c.busy || !input.trim()} className="btn-main !h-12 !px-4 disabled:opacity-50" aria-label="Send"><Send className="h-4 w-4" /></button>
          </form>
          <p className="mx-auto mt-1 w-full max-w-3xl text-center text-[11px] text-[var(--text-muted)]">Enter to send, Shift+Enter for a new line. The Mentor can make mistakes: check important numbers.</p>
        </section>
      </div>
    </div>
  );
}

export default function MentorChatPage() {
  return <Suspense fallback={null}><ChatScreen /></Suspense>;
}
