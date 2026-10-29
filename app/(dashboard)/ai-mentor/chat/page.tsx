"use client";

/** AI Mentor: the dedicated chat screen. Long conversations, plans, test reviews, quizzes and the weekly review live here. */
import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Flag, Loader2, Send, ThumbsUp, Trash2 } from "lucide-react";
import { Segmented } from "@/components/ui/folder-tabs";
import { CardView, MODES, Mode, Voice, clean, useMentorChat } from "@/components/mentor/use-mentor-chat";
import { useMentorData } from "@/components/mentor/use-mentor-data";

const AUTO: Partial<Record<Mode, string>> = {
  Plan: "Make me a study plan for this week from my data.", Review: "Review my last test.", Weekly: "Give me my weekly review.",
  Quiz: "Quiz me on my weakest topic.", Socratic: "Guide me on my weakest topic. Ask me one question at a time.",
};

function ChatScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const d = useMentorData();
  const c = useMentorChat(d.brief);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [c.msgs, c.busy]);
  // Arriving from the Mentor home with a heavy request: run it once, when the Mentor's data and thread are loaded.
  useEffect(() => {
    const m = params.get("mode") as Mode | null;
    if (fired.current || !m || params.get("auto") !== "1" || !d.ready || !c.loaded || !AUTO[m]) return;
    fired.current = true; c.setMode(m); void c.send(AUTO[m]!, m);
    router.replace("/ai-mentor/chat");
  }, [params, d.ready, c.loaded, c, router]);

  const submit = () => { const t = input; setInput(""); void c.send(t); };
  return (
    <div className="mx-auto flex h-[calc(100dvh-9.5rem)] min-h-[26rem] max-w-3xl flex-col" data-fill-height="always">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Link href="/ai-mentor" className="btn-soft !h-10 !px-3 text-sm"><ArrowLeft className="h-4 w-4" /> Mentor</Link>
        <h1 className="font-display text-xl font-extrabold text-[var(--text-primary)]">Chat with your Mentor</h1>
        <span className="flex-1" />
        <Segmented label="Mentor voice" value={c.voice} onChange={(v: Voice) => c.setVoice(v)} options={[{ id: "Friendly", label: "Friendly" }, { id: "Strict", label: "Strict" }, { id: "Concise", label: "Concise" }]} />
        {c.msgs.length > 0 && <button type="button" onClick={c.clear} className="btn-soft !h-10 !px-3" aria-label="Clear the conversation" title="Clear the conversation"><Trash2 className="h-4 w-4" /></button>}
      </div>
      <div className="mb-3 max-w-full overflow-x-auto"><Segmented label="Mentor mode" value={c.mode} onChange={c.setMode} options={MODES} /></div>

      <section className="card-well flex min-h-0 flex-1 flex-col p-3 sm:p-4" data-tint="lilac" aria-label="Conversation">
        <div ref={listRef} className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1" aria-live="polite">
          {c.msgs.length === 0 && (
            <div className="rounded-2xl bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
              Ask for a plan, a review of your last test, a quiz, or to be guided step by step. I answer from your own data and say where each fact came from.
              <div className="mt-3 flex flex-wrap gap-2">
                {(["Plan", "Review", "Quiz", "Weekly"] as Mode[]).map((m) => <button key={m} type="button" onClick={() => c.send(AUTO[m]!, m)} className="pill-soft cursor-pointer text-xs">{AUTO[m]}</button>)}
              </div>
            </div>
          )}
          {c.msgs.map((m) => (
            <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "bg-[var(--btn)] text-[var(--btn-fg)]" : "bg-[var(--surface)] text-[var(--text-primary)]"}`}>
                <p className="whitespace-pre-wrap leading-relaxed">{clean(m.text)}</p>
                {m.warn && <p className="mt-2 rounded-lg bg-[var(--tint-butter)] px-2 py-1 text-xs text-[var(--tint-butter-ink)]">Check these numbers before relying on them: {m.warn.join(", ")}. They are not in your data.</p>}
                {m.cards?.map((cd, i) => <CardView key={i} c={cd} added={c.added} onAdd={(it, k) => c.addPlanItem(it, `${m.id}-${k}`)} idKey={m.id} go={(h) => router.push(h)} />)}
                {m.followUps && m.followUps.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{m.followUps.map((f) => <button key={f} type="button" onClick={() => c.send(f)} className="pill-soft cursor-pointer text-xs">{f}</button>)}</div>}
                {m.role === "model" && (
                  <div className="mt-2 flex gap-1 text-[var(--text-muted)]">
                    <button type="button" aria-label="Helpful" onClick={() => c.mark(m.id, "liked")} className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)]"><ThumbsUp className={`h-3.5 w-3.5 ${m.liked ? "text-[var(--tint-mint-ink)]" : ""}`} /></button>
                    <button type="button" aria-label="This was wrong" title="This was wrong" onClick={() => c.mark(m.id, "flagged")} className="cursor-pointer rounded p-1 hover:bg-[var(--surface-secondary)]"><Flag className={`h-3.5 w-3.5 ${m.flagged ? "text-[var(--tint-rose-ink)]" : ""}`} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {c.busy && <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" /> Thinking about your data...</div>}
        </div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); submit(); }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} maxLength={1500} placeholder="Ask your Mentor" aria-label="Message your Mentor"
            className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-4 text-[var(--text-primary)] outline-none focus:border-[var(--tint-sky-ink)]" />
          <button type="submit" disabled={c.busy || !input.trim()} className="btn-main !px-4 disabled:opacity-50" aria-label="Send"><Send className="h-4 w-4" /></button>
        </form>
      </section>
    </div>
  );
}

export default function MentorChatPage() {
  return <Suspense fallback={null}><ChatScreen /></Suspense>;
}
