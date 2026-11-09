"use client";

/** Interview tutor chat: ask about anything you selected or the chapter you are reading. Replies are Markdown. */
import { useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { IvMarkdown } from "./iv-markdown";

export type TutorSeed = { key: string; mode: "explain" | "simplify" | "quiz" | "answer" | "review" | "chat"; text?: string; context?: string; title?: string };
type Msg = { role: "user" | "tutor"; text: string };
const MODES: { id: TutorSeed["mode"]; label: string }[] = [
  { id: "explain", label: "Explain" }, { id: "simplify", label: "Simplify" }, { id: "quiz", label: "Quiz me" }, { id: "answer", label: "Interview answer" }, { id: "review", label: "Review my code" },
];

export function IvTutorPanel({ seed, className = "" }: { seed: TutorSeed | null; className?: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<TutorSeed["mode"]>("chat");
  const ctx = useRef<TutorSeed | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const sent = useRef("");

  const ask = async (m: TutorSeed["mode"], answer: string, base: TutorSeed | null, history: Msg[]) => {
    setBusy(true);
    try {
      const r = await fetch("/api/interview/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: m, answer, text: base?.text, context: base?.context, title: base?.title, history }) });
      const d = (await r.json()) as { reply?: string; error?: string };
      setMsgs((x) => [...x, { role: "tutor", text: d.reply ?? d.error ?? "No answer came back." }]);
    } catch { setMsgs((x) => [...x, { role: "tutor", text: "Could not reach the tutor. Check your connection." }]); } finally { setBusy(false); }
  };

  useEffect(() => {
    if (!seed || sent.current === seed.key) return;
    sent.current = seed.key; ctx.current = seed; setMode(seed.mode);
    const first = seed.mode === "chat" ? [] : [{ role: "user" as const, text: seed.text ? `${MODES.find((x) => x.id === seed.mode)?.label ?? "Help"}: ${seed.text.slice(0, 220)}${seed.text.length > 220 ? "…" : ""}` : MODES.find((x) => x.id === seed.mode)?.label ?? "Help" }];
    setMsgs(first);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- start the conversation when a new question is handed in
    if (seed.mode !== "chat") void ask(seed.mode, seed.text ?? "Go ahead.", seed, []);
  }, [seed]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, busy]);

  const send = () => {
    const t = input.trim(); if (!t || busy) return;
    const h = [...msgs, { role: "user" as const, text: t }];
    setMsgs(h); setInput("");
    void ask(msgs.length ? "chat" : mode, t, ctx.current, h.slice(0, -1));
  };

  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1" aria-live="polite">
        {msgs.length === 0 && (
          <div className="rounded-2xl bg-[var(--surface-secondary)] p-4 text-sm text-[var(--text-secondary)]">
            <p className="flex items-center gap-2 font-bold text-[var(--text-primary)]"><Sparkles className="h-4 w-4" />Interview tutor</p>
            <p className="mt-1">Select text in a chapter and choose Ask tutor, or type a question here. Pick a mode first if you want to be quizzed or get a spoken-style answer.</p>
          </div>
        )}
        {msgs.map((m, i) => m.role === "user"
          ? <p key={i} className="ml-auto w-fit max-w-[90%] rounded-2xl rounded-br-md bg-[var(--ink)] px-3.5 py-2 text-sm text-[var(--background)]">{m.text}</p>
          : <div key={i} className="max-w-full rounded-2xl rounded-bl-md bg-[var(--surface)] p-3.5 text-sm"><IvMarkdown body={m.text} /></div>)}
        {busy && <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><Loader2 className="h-4 w-4 animate-spin" />Thinking…</p>}
        <div ref={end} />
      </div>
      <div className="mt-3 space-y-2">
        <div className="flex flex-wrap gap-1.5">{MODES.map((m) => <button key={m.id} type="button" onClick={() => setMode(m.id)} aria-pressed={mode === m.id} className={`rounded-full px-3 py-1 text-xs font-bold ${mode === m.id ? "bg-[var(--ink)] text-[var(--background)]" : "bg-[var(--surface-secondary)] text-[var(--text-secondary)]"}`}>{m.label}</button>)}</div>
        <div className="flex gap-2">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} rows={2} placeholder="Ask the tutor…" aria-label="Message the tutor" className="min-h-[48px] flex-1 resize-none rounded-2xl border-2 border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none" />
          <button type="button" onClick={send} disabled={busy || !input.trim()} aria-label="Send" className="btn-main !h-12 !w-12 shrink-0 !p-0"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
