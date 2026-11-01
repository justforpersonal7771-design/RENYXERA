"use client";
/** AI Mentor chat state shared by the quick-ask box on the Mentor home and the dedicated chat screen (/ai-mentor/chat). */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { AIClient } from "@/lib/ai/ai-client";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useToastStore } from "@/store/use-toast-store";
import { toLocalDateStr } from "@/lib/utils";
import { MentorCard, MentorReply, PlanItem, parseReply, unverifiedNumbers } from "@/lib/mentor/brief";
import { recordLocalChange, syncNow } from "@/lib/sync/sync-engine";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { Chat, ChatMeta, TreeMsg, activePath, addNode, chatFromFlat, emptyChat, metaOf, removeBranch, siblingInfo, switchSibling } from "@/lib/mentor/chat-tree";

export type Mode = "Ask" | "Socratic" | "Quiz" | "Plan" | "Review" | "Weekly";
export type Voice = "Friendly" | "Strict" | "Concise";
export interface Msg { id: string; role: "user" | "model"; text: string; cards?: MentorCard[]; followUps?: string[]; warn?: string[]; flagged?: boolean; liked?: boolean; sib?: { index: number; count: number } }

export const MODES: { id: Mode; label: string }[] = [{ id: "Ask", label: "Ask" }, { id: "Socratic", label: "Guide me" }, { id: "Quiz", label: "Quiz me" }, { id: "Plan", label: "Plan" }, { id: "Review", label: "Review test" }];
/** Requests that need a long, structured answer: they go to the dedicated chat screen, never the quick-ask box. */
export const HEAVY: Mode[] = ["Plan", "Review", "Weekly", "Quiz", "Socratic"];
export const clean = (t: string) => t.replace(/\\\(|\\\)|\\\[|\\\]/g, "");
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-3);
const HISTORY_TURNS = 6, HISTORY_CHARS = 1200, GUEST_FREE_ANSWERS = 2;
const INDEX_KEY = "mentor_chats", ACTIVE_KEY = "mentor_active_chat", MAX_CHATS = 60;
const chatKey = (id: string) => `mentor_chat_${id}`;
const EVENT_TYPE = (s?: string) => (s === "Revision" ? "Revision" : s === "Mistakes" ? "Mistakes Review" : s === "Mock Test" ? "Mock Test" : "Study");

export function useMentorChat(brief: string) {
  const { addEvent } = useCalendarStore();
  const toast = useToastStore((s) => s.show);
  // Guests chat in a temporary chat that is never saved; signing in saves it (and syncs it).
  const signedIn = !!useAuthStore((st) => st.user);
  const signedInRef = useRef(false);
  signedInRef.current = signedIn;
  // A guest gets two free answers per device (kept in localStorage so a refresh cannot reset it), in one temporary chat; then sign-in.
  const [guestUsed, setGuestUsed] = useState(0);
  const guestUsedRef = useRef(0);
  useEffect(() => { try { const n = Number(localStorage.getItem("mentor_guest_answers") ?? 0) || 0; guestUsedRef.current = n; setGuestUsed(n); } catch { /* private mode */ } }, []);
  const bumpGuest = () => { const n = guestUsedRef.current + 1; guestUsedRef.current = n; setGuestUsed(n); try { localStorage.setItem("mentor_guest_answers", String(n)); } catch { /* private mode */ } };
  const guestLocked = !signedIn && guestUsed >= GUEST_FREE_ANSWERS;
  const blocked = () => { if (!signedInRef.current && guestUsedRef.current >= GUEST_FREE_ANSWERS) { useAuthModalStore.getState().open("signup"); return true; } return false; };
  const persist = useCallback((k: string, v: unknown) => { if (signedInRef.current) void IDBManager.saveAIMemory(k, v); }, []);
  const [index, setIndex] = useState<ChatMeta[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const indexRef = useRef<ChatMeta[]>([]);
  const [mode, setMode] = useState<Mode>("Ask");
  const [voice, setVoice] = useState<Voice>("Friendly");
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  useEffect(() => { busyRef.current = busy; }, [busy]);
  const [loaded, setLoaded] = useState(false);
  const [typingId, setTypingId] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const setActive = useCallback((c: Chat | null) => { chatRef.current = c; setChat(c); }, []);
  const setIdx = useCallback((i: ChatMeta[]) => { indexRef.current = i; setIndex(i); void IDBManager.saveAIMemory(INDEX_KEY, i); }, []);
  const saveChat = useCallback((c: Chat) => {
    if (!signedInRef.current) return; // temporary chat
    void IDBManager.saveAIMemory(chatKey(c.id), c);
    recordLocalChange("mentor_chat", c.id, true); // uploads the chat when signed in (read back from storage at upload time)
    const meta = metaOf(c, indexRef.current.find((m) => m.id === c.id)?.pinned);
    const rest = indexRef.current.filter((m) => m.id !== c.id);
    let next = [meta, ...rest].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    if (next.length > MAX_CHATS) { for (const old of next.slice(MAX_CHATS)) void IDBManager.deleteAIMemory(chatKey(old.id)); next = next.slice(0, MAX_CHATS); }
    setIdx(next);
  }, [setIdx]);

  // Load the chat list and the open chat; the older single thread becomes the first chat.
  useEffect(() => { (async () => {
    if (!signedIn) { setLoaded(true); return; }
    let list: ChatMeta[] = Array.isArray(await IDBManager.getAIMemory(INDEX_KEY)) ? await IDBManager.getAIMemory(INDEX_KEY) : [];
    const old = await IDBManager.getAIMemory("mentor_thread");
    if (!list.length && Array.isArray(old) && old.length) {
      const migrated = chatFromFlat(old, new Date().toISOString());
      await IDBManager.saveAIMemory(chatKey(migrated.id), migrated);
      list = [metaOf(migrated)];
      await IDBManager.saveAIMemory(INDEX_KEY, list);
      await IDBManager.saveAIMemory(ACTIVE_KEY, migrated.id);
    }
    indexRef.current = list; setIndex(list);
    const activeId = (await IDBManager.getAIMemory(ACTIVE_KEY)) as string | undefined;
    const pick = list.find((m) => m.id === activeId) ?? list[0];
    if (pick && !chatRef.current) { const c = (await IDBManager.getAIMemory(chatKey(pick.id))) as Chat | undefined; if (c?.nodes) setActive(c); }
    const p = await IDBManager.getAIMemory("mentor_prefs"); if (p?.voice) setVoice(p.voice);
    setLoaded(true);
  })(); }, [setActive, signedIn]);
  // A guest who signs in keeps the temporary chat: it is saved to their history now.
  useEffect(() => { const c = chatRef.current; if (signedIn && c && Object.keys(c.nodes).length) saveChat(c); }, [signedIn, saveChat]);
  useEffect(() => { if (loaded) persist("mentor_prefs", { voice }); }, [voice, loaded, persist]);
  // Another device changed a chat: refresh the list and the open chat (not while an answer is on its way).
  useEffect(() => {
    const onSynced = async () => {
      if (busyRef.current) return;
      const list = await IDBManager.getAIMemory(INDEX_KEY);
      if (Array.isArray(list)) { indexRef.current = list; setIndex(list); }
      const open = chatRef.current;
      if (open) {
        const fresh = (await IDBManager.getAIMemory(chatKey(open.id))) as Chat | undefined;
        if (!fresh?.nodes) { setActive(null); return; }
        if (fresh.updatedAt > open.updatedAt) setActive(fresh);
      }
    };
    window.addEventListener("renyxera:synced", onSynced);
    // Automatic, no button: while a chat screen is open, check for other devices' changes every 20 seconds and when the window regains focus (the app-wide check is every 5 minutes).
    const poll = () => { if (!document.hidden) void syncNow(); };
    const timer = setInterval(poll, 20_000);
    window.addEventListener("focus", poll);
    return () => { window.removeEventListener("renyxera:synced", onSynced); clearInterval(timer); window.removeEventListener("focus", poll); };
  }, [setActive]);

  /** Apply a change to the open chat (or to a chat that is no longer open, when an answer arrives late) and save it. */
  const commit = useCallback(async (chatId: string, fn: (c: Chat) => Chat) => {
    if (chatRef.current?.id === chatId) { const next = fn(chatRef.current); setActive(next); saveChat(next); return next; }
    const stored = (await IDBManager.getAIMemory(chatKey(chatId))) as Chat | undefined;
    if (stored?.nodes) { const next = fn(stored); saveChat(next); return next; }
    return null;
  }, [saveChat, setActive]);

  /** Ask the Mentor about the user message `userId` (already in the chat) and add the answer as its child. */
  const answer = useCallback(async (chatId: string, userId: string, m: Mode, v: Voice) => {
    const c = chatRef.current?.id === chatId ? chatRef.current : ((await IDBManager.getAIMemory(chatKey(chatId))) as Chat | undefined);
    const u = c?.nodes[userId]; if (!c || !u) return;
    const before: TreeMsg[] = []; for (let id = u.parentId; id && c.nodes[id]; id = c.nodes[id].parentId) before.unshift(c.nodes[id]);
    // Each call re-sends the recent conversation, which is what makes long chats cost more: keep it to the last 6 messages, 1,200 characters each.
    const history = before.slice(-HISTORY_TURNS).map((x) => ({ role: x.role, text: x.text.slice(0, HISTORY_CHARS) }));
    setBusy(true);
    try {
      const res = await AIClient.request<unknown>(`mentor_${Date.now()}`, "MENTOR_CHAT", { mode: m, personality: v, brief, history, nextMessage: u.text }, { bypassCache: true });
      if (!res.success) throw new Error((res as { error?: string }).error || "The Mentor could not answer.");
      const r: MentorReply = parseReply(res.data);
      const warn = unverifiedNumbers(r.reply, brief, u.text, ...history.map((h) => h.text));
      if (!signedInRef.current) bumpGuest();
      const id = uid(); setTypingId(id);
      await commit(chatId, (cur) => addNode(cur, { id, role: "model", text: r.reply || "I did not get a usable answer. Try asking in a different way.", cards: r.cards, followUps: r.followUps, warn: warn.length ? warn : undefined, parentId: userId }, new Date().toISOString()));
    } catch (e) {
      await commit(chatId, (cur) => addNode(cur, { id: uid(), role: "model", text: (e as Error).message || "Something went wrong.", parentId: userId }, new Date().toISOString()));
    } finally { setBusy(false); }
  }, [brief, commit]);

  const newChat = useCallback(() => { if (!signedInRef.current && chatRef.current) { useAuthModalStore.getState().open("signup"); return; } setActive(null); persist(ACTIVE_KEY, ""); setTypingId(null); }, [setActive, persist]);
  const openChat = useCallback(async (id: string) => {
    const c = (await IDBManager.getAIMemory(chatKey(id))) as Chat | undefined;
    if (c?.nodes) { setActive(c); setTypingId(null); persist(ACTIVE_KEY, id); }
  }, [setActive]);

  const send = useCallback(async (text: string, m: Mode = mode, v: Voice = voice) => {
    const msg = text.trim(); if (!msg || busy || blocked()) return;
    let c = chatRef.current;
    if (!c) { c = emptyChat(new Date().toISOString()); setActive(c); persist(ACTIVE_KEY, c.id); }
    const userId = uid();
    const next = addNode(c, { id: userId, role: "user", text: msg, parentId: c.leafId }, new Date().toISOString());
    setActive(next); saveChat(next);
    await answer(next.id, userId, m, v);
  }, [mode, voice, busy, answer, saveChat, setActive]);

  /** Edit an earlier message: the new text becomes a second version of that message and the Mentor answers it again; the old version stays one tap away. */
  const editAndResend = useCallback(async (id: string, text: string) => {
    const c = chatRef.current; const msg = text.trim(); if (!c || !c.nodes[id] || !msg || busy || blocked()) return;
    const userId = uid();
    const next = addNode(c, { id: userId, role: "user", text: msg, parentId: c.nodes[id].parentId }, new Date().toISOString());
    setActive(next); saveChat(next);
    await answer(next.id, userId, mode, voice);
  }, [busy, mode, voice, answer, saveChat, setActive]);

  /** Ask again for the same message: the new answer is another version of the reply. */
  const regenerate = useCallback(async (id: string) => {
    const c = chatRef.current; const n = c?.nodes[id]; if (!c || !n || !n.parentId || busy || blocked()) return;
    const next = { ...c, leafId: n.parentId };
    setActive(next);
    await answer(c.id, n.parentId, mode, voice);
  }, [busy, mode, voice, answer, setActive]);

  const stepVersion = useCallback((id: string, dir: -1 | 1) => {
    const c = chatRef.current; if (!c) return;
    const next = switchSibling(c, id, dir, new Date().toISOString()); setActive(next); setTypingId(null); saveChat(next);
  }, [saveChat, setActive]);

  const renameChat = useCallback(async (id: string, title: string) => {
    const t = title.replace(/\s+/g, " ").trim().slice(0, 80); if (!t) return;
    await commit(id, (c) => ({ ...c, title: t, titled: true }));
  }, [commit]);
  /** File a chat under a group (or take it out of its group with an empty name). */
  const setChatGroup = useCallback(async (id: string, group: string) => {
    const g = group.replace(/\s+/g, " ").trim().slice(0, 40);
    await commit(id, (c) => ({ ...c, group: g || undefined, updatedAt: new Date().toISOString() }));
  }, [commit]);
  const pinChat = useCallback((id: string) => { setIdx(indexRef.current.map((m) => (m.id === id ? { ...m, pinned: !m.pinned } : m))); }, [setIdx]);
  const deleteChat = useCallback(async (id: string) => {
    await IDBManager.deleteAIMemory(chatKey(id));
    recordLocalChange("mentor_chat", id, null); // tells the other devices
    setIdx(indexRef.current.filter((m) => m.id !== id));
    if (chatRef.current?.id === id) { const nextId = indexRef.current[0]?.id; if (nextId) await openChat(nextId); else newChat(); }
  }, [setIdx, openChat, newChat]);
  const deleteMessageBranch = useCallback((id: string) => {
    const c = chatRef.current; if (!c) return;
    const next = removeBranch(c, id, new Date().toISOString()); setActive(next); saveChat(next);
  }, [saveChat, setActive]);

  const addPlanItem = async (it: PlanItem, key: string) => {
    const date = toLocalDateStr(new Date(Date.now() + Math.max(0, Math.min(14, it.daysFromToday ?? 0)) * 86400000));
    await addEvent({ id: crypto.randomUUID(), title: it.title, description: it.reason ?? "", category: EVENT_TYPE(it.studyType), date, color: "#6366f1", priority: "Medium", completed: false,
      subject: it.subject, topic: it.topic, studyType: it.studyType, timeRangeType: "date_only", revisionCycle: "One Time", status: "Pending" } as never);
    setAdded((s) => new Set(s).add(key)); toast(`"${it.title}" added to your calendar`);
  };
  const mark = (id: string, k: "flagged" | "liked") => {
    const c = chatRef.current;
    if (c?.nodes[id]) { const next = { ...c, nodes: { ...c.nodes, [id]: { ...c.nodes[id], [k]: true } } }; setActive(next); saveChat(next); }
    if (k === "flagged") void IDBManager.getAIMemory("mentor_flags").then((f) => IDBManager.saveAIMemory("mentor_flags", [...(Array.isArray(f) ? f : []), { id, at: new Date().toISOString() }].slice(-100)));
  };
  /** Clearing the conversation deletes the open chat from the history. */
  const clear = () => { if (chatRef.current) void deleteChat(chatRef.current.id); };

  const msgs: Msg[] = useMemo(() => (chat ? activePath(chat).map((n) => {
    const s = siblingInfo(chat, n.id);
    return { ...(n as unknown as Msg), sib: s.count > 1 ? { index: s.index, count: s.count } : undefined };
  }) : []), [chat]);

  return { signedIn, guestLocked, msgs, chats: index, activeId: chat?.id ?? null, title: chat?.title ?? "New chat", typingId, mode, setMode, voice, setVoice, busy, loaded, added,
    send, editAndResend, setChatGroup, regenerate, stepVersion, newChat, openChat, renameChat, pinChat, deleteChat, deleteMessageBranch, addPlanItem, mark, clear };
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
