"use client";
/** AI Mentor chat state shared by the quick-ask box on the Mentor home and the dedicated chat screen (/ai-mentor/chat). */
import { useCallback, useEffect, useState } from "react";
import { Check } from "lucide-react";
import { AIClient } from "@/lib/ai/ai-client";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useToastStore } from "@/store/use-toast-store";
import { toLocalDateStr } from "@/lib/utils";
import { MentorCard, MentorReply, PlanItem, parseReply, unverifiedNumbers } from "@/lib/mentor/brief";

export type Mode = "Ask" | "Socratic" | "Quiz" | "Plan" | "Review" | "Weekly";
export type Voice = "Friendly" | "Strict" | "Concise";
export interface Msg { id: string; role: "user" | "model"; text: string; cards?: MentorCard[]; followUps?: string[]; warn?: string[]; flagged?: boolean; liked?: boolean }

export const MODES: { id: Mode; label: string }[] = [{ id: "Ask", label: "Ask" }, { id: "Socratic", label: "Guide me" }, { id: "Quiz", label: "Quiz me" }, { id: "Plan", label: "Plan" }, { id: "Review", label: "Review test" }];
/** Requests that need a long, structured answer: they go to the dedicated chat screen, never the quick-ask box. */
export const HEAVY: Mode[] = ["Plan", "Review", "Weekly", "Quiz", "Socratic"];
export const clean = (t: string) => t.replace(/\\\(|\\\)|\\\[|\\\]/g, "");
const uid = () => Math.random().toString(36).slice(2, 10);
const EVENT_TYPE = (s?: string) => (s === "Revision" ? "Revision" : s === "Mistakes" ? "Mistakes Review" : s === "Mock Test" ? "Mock Test" : "Study");

export function useMentorChat(brief: string) {
  const { addEvent } = useCalendarStore();
  const toast = useToastStore((s) => s.show);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [mode, setMode] = useState<Mode>("Ask");
  const [voice, setVoice] = useState<Voice>("Friendly");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  useEffect(() => { (async () => {
    const t = await IDBManager.getAIMemory("mentor_thread"); if (Array.isArray(t)) setMsgs(t);
    const p = await IDBManager.getAIMemory("mentor_prefs"); if (p?.voice) setVoice(p.voice);
    setLoaded(true);
  })(); }, []);
  useEffect(() => { if (loaded) void IDBManager.saveAIMemory("mentor_thread", msgs.slice(-60)); }, [msgs, loaded]);
  useEffect(() => { if (loaded) void IDBManager.saveAIMemory("mentor_prefs", { voice }); }, [voice, loaded]);

  const send = useCallback(async (text: string, m: Mode = mode, v: Voice = voice) => {
    const msg = text.trim(); if (!msg || busy) return;
    const history = msgs.slice(-10).map((x) => ({ role: x.role, text: x.text.slice(0, 2500) }));
    setMsgs((c) => [...c, { id: uid(), role: "user", text: msg }]); setBusy(true);
    try {
      const res = await AIClient.request<unknown>(`mentor_${Date.now()}`, "MENTOR_CHAT", { mode: m, personality: v, brief, history, nextMessage: msg }, { bypassCache: true });
      if (!res.success) throw new Error((res as { error?: string }).error || "The Mentor could not answer.");
      const r: MentorReply = parseReply(res.data);
      const warn = unverifiedNumbers(r.reply, brief, msg, ...history.map((h) => h.text));
      setMsgs((c) => [...c, { id: uid(), role: "model", text: r.reply || "I did not get a usable answer. Try asking in a different way.", cards: r.cards, followUps: r.followUps, warn: warn.length ? warn : undefined }]);
    } catch (e) {
      setMsgs((c) => [...c, { id: uid(), role: "model", text: (e as Error).message || "Something went wrong." }]);
    } finally { setBusy(false); }
  }, [msgs, mode, voice, busy, brief]);

  const addPlanItem = async (it: PlanItem, key: string) => {
    const date = toLocalDateStr(new Date(Date.now() + Math.max(0, Math.min(14, it.daysFromToday ?? 0)) * 86400000));
    await addEvent({ id: crypto.randomUUID(), title: it.title, description: it.reason ?? "", category: EVENT_TYPE(it.studyType), date, color: "#6366f1", priority: "Medium", completed: false,
      subject: it.subject, topic: it.topic, studyType: it.studyType, timeRangeType: "date_only", revisionCycle: "One Time", status: "Pending" } as never);
    setAdded((s) => new Set(s).add(key)); toast(`"${it.title}" added to your calendar`);
  };
  const mark = (id: string, k: "flagged" | "liked") => {
    setMsgs((c) => c.map((m) => (m.id === id ? { ...m, [k]: true } : m)));
    if (k === "flagged") void IDBManager.getAIMemory("mentor_flags").then((f) => IDBManager.saveAIMemory("mentor_flags", [...(Array.isArray(f) ? f : []), { id, at: new Date().toISOString() }].slice(-100)));
  };
  const clear = () => setMsgs([]);
  return { msgs, mode, setMode, voice, setVoice, busy, loaded, added, send, addPlanItem, mark, clear };
}

export function CardView({ c, added, onAdd, idKey, go }: { c: MentorCard; added: Set<string>; onAdd: (it: PlanItem, key: string) => void; idKey: string; go: (h: string) => void }) {
  if (c.type === "plan") return (
    <div className="mt-3 rounded-xl border border-[var(--border)] p-3">
      <p className="text-xs font-bold text-[var(--text-secondary)]">{c.title || "Suggested plan"}</p>
      <ul className="mt-2 space-y-2">
        {(c.items ?? []).slice(0, 6).map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{clean(String(it.title))}</span><span className="block text-xs text-[var(--text-muted)]">{[it.studyType, it.minutes ? `${it.minutes} min` : null, it.daysFromToday ? `in ${it.daysFromToday} days` : "today"].filter(Boolean).join(" · ")}</span></span>
            <button type="button" disabled={added.has(`${idKey}-${i}`)} onClick={() => onAdd(it, String(i))} className="pill-ink shrink-0 cursor-pointer !px-3 !py-1 text-xs disabled:opacity-60">{added.has(`${idKey}-${i}`) ? <Check className="h-3.5 w-3.5" /> : "Add"}</button>
          </li>
        ))}
      </ul>
    </div>
  );
  const target = c.type === "question" ? `/ai-tutor?qid=${encodeURIComponent(c.questionId)}` : c.type === "lesson" ? "/study" : "/setup";
  const label = c.type === "question" ? "Open in the Tutor" : c.type === "lesson" ? "Open the lesson" : "Practise this";
  const title = c.type === "question" ? "A question from your mistakes" : clean(String(c.title || c.topic || ""));
  return (
    <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--border)] p-3">
      <span className="min-w-0 flex-1 text-sm font-semibold">{title}</span>
      <button type="button" onClick={() => go(target)} className="pill-ink shrink-0 cursor-pointer !px-3 !py-1 text-xs">{label}</button>
    </div>
  );
}
