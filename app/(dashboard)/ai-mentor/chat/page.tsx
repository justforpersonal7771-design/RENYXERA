"use client";

/**
 * AI Mentor: the dedicated chat screen, built like the chat apps students already know:
 * a collapsible history (search inside chats, group by date or by your own groups, pin, rename, delete), edit an earlier message
 * and keep both versions (the "1 / 2" pager), ask again for another answer, a flowing-logo thinking state, answers that type out,
 * a composer with mode and style menus, an enlarge-the-box button, and an enlarge-the-whole-chat button (fills the app, not full screen).
 */
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight, Copy, Flag, FolderInput, FolderMinus, History, Maximize2, Minimize2, MessageSquarePlus, Square, PanelLeftClose, PanelLeftOpen, Pencil, Pin, PinOff, RefreshCw, Search, Send, ThumbsUp, Trash2, X } from "lucide-react";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { MentorLogo } from "@/components/brand/mentor-logo";
import { CardView, MODES, Mode, Msg, Voice, clean, useMentorChat } from "@/components/mentor/use-mentor-chat";
import { useMentorData } from "@/components/mentor/use-mentor-data";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { istDateStr } from "@/lib/time/ist";
import type { ChatMeta } from "@/lib/mentor/chat-tree";

const AUTO: Partial<Record<Mode, string>> = {
  Plan: "Make me a study plan for this week from my data.", Review: "Review my last test.", Weekly: "Give me my weekly review.",
  Quiz: "Quiz me on my weakest topic.", Socratic: "Guide me on my weakest topic. Ask me one question at a time.",
};
const STARTERS: { title: string; text: string; mode?: Mode }[] = [
  { title: "Plan my week", text: AUTO.Plan!, mode: "Plan" },
  { title: "Review my last test", text: AUTO.Review!, mode: "Review" },
  { title: "Quiz me", text: AUTO.Quiz!, mode: "Quiz" },
  { title: "My weekly review", text: AUTO.Weekly!, mode: "Weekly" },
];
const VOICES: { id: Voice; label: string }[] = [{ id: "Friendly", label: "Friendly" }, { id: "Strict", label: "Strict" }, { id: "Concise", label: "Concise" }];

const prefersReduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const store = {
  get: (k: string, d: string) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

/** Small menu button used in the composer (mode, style). Opens upwards, closes on outside click and Escape. */
function MenuSelect<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  const cur = options.find((o) => o.id === value)?.label ?? value;
  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="menu" aria-expanded={open} aria-label={`${label}: ${cur}`} className="flex h-9 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]">
        {cur} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" aria-label={label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.12 }}
            className="absolute bottom-full left-0 z-30 mb-2 min-w-40 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1 shadow-xl">
            <p className="px-3 pb-1 pt-1.5 text-xs font-bold text-[var(--text-muted)]">{label}</p>
            {options.map((o) => (
              <button key={o.id} type="button" role="menuitemradio" aria-checked={o.id === value} onClick={() => { onChange(o.id); setOpen(false); }} className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]">
                {o.label}{o.id === value && <Check className="h-4 w-4" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Thinking() {
  const [step, setStep] = useState(0);
  useEffect(() => { const t = setInterval(() => setStep((s) => s + 1), 2200); return () => clearInterval(t); }, []);
  const words = ["Thinking", "Working it out", "Putting the answer together", "Almost there"];
  return (
    <div className="flex items-start gap-3" role="status" aria-live="polite" aria-label="The Mentor is thinking">
      <MentorLogo className="mt-0.5 h-12" mode="think" />
      <div className="min-w-0 flex-1 pt-1">
        <p className="flex items-center gap-3"><span className="shimmer-text text-sm font-bold">{words[Math.min(step, words.length - 1)]}…</span></p>
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

type Section = { label: string; items: ChatMeta[]; folder?: boolean };
/** History as a tree: pinned chats, then each group as a folder holding its chats, then the chats with no group by India-time day. */
function sectionsOf(list: ChatMeta[]): Section[] {
  const pinned: ChatMeta[] = [], groups: Record<string, ChatMeta[]> = {}, dated: Record<string, ChatMeta[]> = {};
  const today = istDateStr(), yest = istDateStr(new Date(Date.now() - 86400000)), week = istDateStr(new Date(Date.now() - 7 * 86400000));
  for (const c of list) {
    if (c.pinned) { pinned.push(c); continue; }
    if (c.group) { (groups[c.group] ??= []).push(c); continue; }
    const d = istDateStr(new Date(c.updatedAt));
    (dated[d === today ? "Today" : d === yest ? "Yesterday" : d >= week ? "Previous 7 days" : "Older"] ??= []).push(c);
  }
  return [
    ...(pinned.length ? [{ label: "Pinned", items: pinned }] : []),
    ...Object.keys(groups).sort((a, b) => a.localeCompare(b)).map((g) => ({ label: g, items: groups[g], folder: true })),
    ...["Today", "Yesterday", "Previous 7 days", "Older"].filter((k) => dated[k]?.length).map((k) => ({ label: k, items: dated[k] })),
  ];
}

/** The logo doubles as the history toggle, like Gemini's: it shows the logo, and on hover or focus it turns into the collapse (or expand) icon. */
function LogoToggle({ open, onClick, label }: { open: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label} className="group/logo relative grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-xl transition-colors hover:bg-[var(--surface)]/70 focus-visible:bg-[var(--surface)]/70">
      <MentorLogo className="h-9 transition-all duration-200 group-hover/logo:scale-75 group-hover/logo:opacity-0 group-focus-visible/logo:scale-75 group-focus-visible/logo:opacity-0" mode="blink" />
      {open ? <PanelLeftClose className="absolute h-5 w-5 scale-75 text-[var(--text-primary)] opacity-0 transition-all duration-200 group-hover/logo:scale-100 group-hover/logo:opacity-100 group-focus-visible/logo:scale-100 group-focus-visible/logo:opacity-100" />
        : <PanelLeftOpen className="absolute h-5 w-5 scale-75 text-[var(--text-primary)] opacity-0 transition-all duration-200 group-hover/logo:scale-100 group-hover/logo:opacity-100 group-focus-visible/logo:scale-100 group-focus-visible/logo:opacity-100" />}
    </button>
  );
}

function ChatScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const d = useMentorData();
  const c = useMentorChat(d.brief);
  const { tier } = useEntitlements();
  const openAuth = useAuthModalStore((st) => st.open);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sideOpen, setSideOpen] = useState(true);      // history panel on desktop
  const [wide, setWide] = useState(false);              // chat fills the whole app area
  const [big, setBig] = useState(false);                // taller composer
  const [stacked, setStacked] = useState(false);       // tools under the text (from the second line)
  const [lines, setLines] = useState(1);
  const [narrow, setNarrow] = useState(false);   // phones: tools always under the text, the box at the bottom, history as a side panel
  useEffect(() => { const mq = window.matchMedia("(max-width: 639px)"); const f = () => setNarrow(mq.matches); f(); mq.addEventListener("change", f); return () => mq.removeEventListener("change", f); }, []);
  const [closed, setClosed] = useState<Record<string, boolean>>({});   // folders the student collapsed
  const [renaming, setRenaming] = useState<{ id: string; text: string } | null>(null);
  const [groupFor, setGroupFor] = useState<string | null>(null);
  const [newGroup, setNewGroup] = useState("");
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [typedDone, setTypedDone] = useState<Set<string>>(new Set());
  const listRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLDivElement>(null);
  const [composerH, setComposerH] = useState(120);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fired = useRef(false);
  const fromBar = params.get("from") === "bar";

  useEffect(() => {
    setMounted(true);
    setSideOpen(store.get("mentor_side", "1") === "1"); setWide(store.get("mentor_wide", "0") === "1");
  }, []);
  const toggleSide = () => { setSideOpen((v) => { store.set("mentor_side", v ? "0" : "1"); return !v; }); };
  const toggleWide = () => { setWide((v) => { store.set("mentor_wide", v ? "0" : "1"); return !v; }); };

  const scrollDown = useCallback(() => { const el = listRef.current; if (el) el.scrollTo({ top: el.scrollHeight, behavior: prefersReduced() ? "auto" : "smooth" }); }, []);
  useEffect(() => { scrollDown(); }, [c.msgs.length, c.busy, c.activeId, scrollDown]);

  // Composer, Gemini style: one line is a pill with the tools beside the text; from the second line the tools drop underneath;
  // from the third line an expand icon appears top-right. The box grows to a limit, then scrolls (scrollbar only when needed).
  useEffect(() => {
    const ta = taRef.current; if (!ta) return;
    if (!input) { setStacked(false); setLines(1); }
    if (big) { ta.style.height = "38dvh"; ta.style.overflowY = "auto"; return; }
    ta.style.height = "auto";
    const n = Math.max(1, Math.round(ta.scrollHeight / 24));
    setLines(n);
    if (n > 1 || input.includes("\n")) setStacked(true);
    const h = Math.min(ta.scrollHeight, 168);
    ta.style.height = `${h}px`; ta.style.overflowY = ta.scrollHeight > 168 ? "auto" : "hidden";
  }, [input, big, wide, stacked]);

  // Arriving from the Mentor home with a heavy request: run it once, in a fresh chat, when the Mentor's data and history are loaded.
  useEffect(() => {
    const m = params.get("mode") as Mode | null;
    if (fired.current || !m || params.get("auto") !== "1" || !d.ready || !c.loaded || !AUTO[m]) return;
    fired.current = true; c.newChat(); c.setMode(m); void c.send(AUTO[m]!, m);
    router.replace(fromBar ? "/ai-mentor/chat?from=bar" : "/ai-mentor/chat");
  }, [params, d.ready, c.loaded, c, router, fromBar]);

  const submit = () => { const t = input; if (!t.trim() || c.busy) return; setInput(""); setBig(false); void c.send(t); };
  const copy = async (id: string, text: string) => { try { await navigator.clipboard.writeText(clean(text)); setCopied(id); setTimeout(() => setCopied((x) => (x === id ? null : x)), 1500); } catch { /* clipboard blocked */ } };
  const askDelete = async (m: ChatMeta) => { if (await confirmDialog({ title: "Delete this chat?", message: `"${m.title}" and all its versions will be removed from your account.`, confirmLabel: "Delete", tone: "danger" })) void c.deleteChat(m.id); };
  const q = query.trim().toLowerCase();
  const sections = useMemo(() => sectionsOf(c.chats.filter((x) => !q || x.title.toLowerCase().includes(q) || (x.snippet ?? "").includes(q) || (x.group ?? "").toLowerCase().includes(q))), [c.chats, q]);
  const groupNames = useMemo(() => [...new Set(c.chats.map((x) => x.group).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b)), [c.chats]);
  const lastId = c.msgs[c.msgs.length - 1]?.id;
  const unanswered = !c.busy && c.msgs.length > 0 && c.msgs[c.msgs.length - 1].role === "user";

  const renderHistory = (inDrawer: boolean) => (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center gap-2">
        <MentorLogo className="h-9" mode="blink" />
        <span className="min-w-0 flex-1 truncate font-display text-base font-extrabold text-[var(--text-primary)]">AI Mentor</span>
        <button type="button" onClick={inDrawer ? () => setDrawer(false) : toggleSide} aria-label={inDrawer ? "Close chat history" : "Hide chat history"} title={inDrawer ? "Close" : "Hide history"} className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface)]/70 hover:text-[var(--text-primary)]"><PanelLeftClose className="h-[18px] w-[18px]" /></button>
      </div>
      {c.signedIn && <button type="button" onClick={() => { c.newChat(); setDrawer(false); }} className="btn-main !h-10 w-full justify-center !text-sm"><MessageSquarePlus className="h-4 w-4" /> New chat</button>}
      {!c.signedIn ? (
        <div className="mt-3 rounded-2xl bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
          <p className="font-bold text-[var(--text-primary)]">This is a temporary chat</p>
          <p className="mt-1">It is not saved and disappears when you leave. Sign in to keep your chats, search them and use them on your other devices.</p>
          <button type="button" onClick={() => openAuth("signup")} className="btn-main mt-3 !h-10 w-full justify-center !text-sm">Sign in to save</button>
        </div>
      ) : (<>
      <label className="relative mt-3 block">
        <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chats" aria-label="Search chats" className="h-10 w-full rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] pl-9 pr-3 text-sm outline-none focus:border-[var(--tint-sky-ink)]" />
      </label>
      <nav aria-label="Chat history" className="custom-scrollbar mt-3 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {sections.length === 0 && <p className="px-2 text-sm text-[var(--text-muted)]">{q ? "No chats match." : "Your chats will appear here."}</p>}
        {sections.map((g) => (
          <div key={g.label}>
            {g.folder ? (
              <button type="button" onClick={() => setClosed((v) => ({ ...v, [g.label]: !v[g.label] }))} aria-expanded={!closed[g.label]} className="flex w-full cursor-pointer items-center gap-2 rounded-xl bg-[var(--surface)]/55 px-2.5 py-2 text-left text-sm font-extrabold text-[var(--text-primary)] hover:bg-[var(--surface)]/80">
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${closed[g.label] ? "" : "rotate-90"}`} />
                                <span className="min-w-0 flex-1 truncate">{g.label}</span><span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-xs font-bold text-[var(--text-secondary)]">{g.items.length}</span>
              </button>
            ) : <p className="px-2.5 pb-1 text-xs font-bold text-[var(--text-secondary)]">{g.label}</p>}
            <ul className={`space-y-0.5 ${g.folder ? "folder-kids ml-5 mt-1 pl-3" : ""} ${g.folder && closed[g.label] ? "hidden" : ""}`}>
              {g.items.map((m) => (
                <li key={m.id} className={`rounded-xl ${m.id === c.activeId ? "bg-[var(--surface)] shadow-sm" : "hover:bg-[var(--surface)]/60"}`}>
                  <div className="group flex items-center gap-1 px-2 py-1.5">
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
                        <button type="button" onClick={() => { setGroupFor(groupFor === m.id ? null : m.id); setNewGroup(""); }} aria-label="Move to a group" title="Move to a group" aria-expanded={groupFor === m.id} className="cursor-pointer rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--surface-secondary)]"><FolderInput className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => setRenaming({ id: m.id, text: m.title })} aria-label="Rename chat" title="Rename" className="cursor-pointer rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--surface-secondary)]"><Pencil className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => void askDelete(m)} aria-label="Delete chat" title="Delete" className="cursor-pointer rounded-md p-1 text-[var(--text-muted)] hover:bg-[var(--surface-secondary)] hover:text-[var(--tint-rose-ink)]"><Trash2 className="h-3.5 w-3.5" /></button>
                      </span>
                    )}
                  </div>
                  {groupFor === m.id && (
                    <div role="menu" aria-label="Move to a group" className="mx-2 mb-2 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
                      <p className="border-b border-[var(--border)] px-3 py-1.5 text-xs font-bold text-[var(--text-secondary)]">Move to</p>
                      <ul className="max-h-40 overflow-y-auto py-1">
                        <li><button type="button" role="menuitem" onClick={() => { void c.setChatGroup(m.id, ""); setGroupFor(null); }} className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"><FolderMinus className="h-4 w-4" /><span className="flex-1">No group</span>{!m.group && <Check className="h-4 w-4" />}</button></li>
                        {groupNames.map((n) => <li key={n}><button type="button" role="menuitem" onClick={() => { void c.setChatGroup(m.id, n); setGroupFor(null); }} className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"><span className="min-w-0 flex-1 truncate">{n}</span>{m.group === n && <Check className="h-4 w-4" />}</button></li>)}
                      </ul>
                      <form className="flex items-center gap-1.5 border-t border-[var(--border)] p-2" onSubmit={(e) => { e.preventDefault(); if (newGroup.trim()) { void c.setChatGroup(m.id, newGroup); setGroupFor(null); } }}>
                        <input value={newGroup} onChange={(e) => setNewGroup(e.target.value)} maxLength={40} placeholder="New group" aria-label="New group name" className="h-8 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-2 text-sm outline-none focus:border-[var(--tint-lilac-ink)]" />
                        <button type="submit" disabled={!newGroup.trim()} className="grid h-8 shrink-0 cursor-pointer place-items-center rounded-lg bg-[var(--tint-lilac-ink)] px-3 text-sm font-bold text-white disabled:opacity-40">Create</button>
                      </form>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      </>)}
    </div>
  );

  const empty = c.msgs.length === 0 && !c.busy;
  // The messages scroll behind the floating box; they need to stop above it, whatever height the box has (one line, stacked, enlarged).
  useEffect(() => {
    const el = composerRef.current; if (!el || empty) return;
    const ro = new ResizeObserver(() => setComposerH(Math.round(el.getBoundingClientRect().height)));
    ro.observe(el); setComposerH(Math.round(el.getBoundingClientRect().height));
    return () => ro.disconnect();
  }, [empty, narrow]);
  const showExpand = big || lines >= 3;
  const composerBlock = (
    <div ref={composerRef} className="mx-auto w-full max-w-3xl">
      {!c.signedIn && !c.guestLocked && (
        <p className="mb-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-2xl bg-[var(--tint-butter)] px-3 py-2 text-center text-xs text-[var(--tint-butter-ink)]">
          Temporary chat: 2 free messages, not saved. <button type="button" onClick={() => openAuth("signup")} className="cursor-pointer font-bold underline">Sign in to save it</button>
        </p>
      )}
      {c.guestLocked && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-2 border-[var(--border)] bg-[var(--surface)] px-5 py-4">
          <p className="min-w-0 flex-1 text-sm text-[var(--text-primary)]"><span className="font-bold">You have used your 2 free messages.</span> Sign in to keep chatting; your chat will be saved.</p>
          <button type="button" onClick={() => openAuth("signup")} className="btn-main !h-10 justify-center !text-sm">Sign in to continue</button>
        </div>
      )}
      <form hidden={c.guestLocked} onSubmit={(e) => { e.preventDefault(); submit(); }}
        className={`relative flex flex-wrap items-center border-2 border-[var(--border)] bg-[var(--surface)] shadow-[0_10px_30px_-18px_rgba(67,56,202,.55)] transition-[border-radius,border-color] duration-200 focus-within:border-[var(--tint-sky-ink)] ${stacked || big || narrow ? "rounded-3xl px-4 pb-2 pt-3" : "rounded-full py-1.5 pl-5 pr-2"}`}>
        <textarea ref={taRef} value={input} rows={1} autoFocus={empty} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } if (e.key === "Escape" && c.busy) c.stop(); }}
          maxLength={1500} placeholder="Ask your Mentor" aria-label="Message your Mentor"
          className={`field-bare block min-h-6 resize-none leading-6 text-[var(--text-primary)] ${stacked || big || narrow ? `w-full basis-full ${showExpand ? "pr-8" : ""}` : "min-w-0 flex-1"}`} />
        {showExpand && (
          <button type="button" onClick={() => setBig((v) => !v)} aria-pressed={big} aria-label={big ? "Make the text box smaller" : "Make the text box bigger"} title={big ? "Smaller box" : "Bigger box"}
            className="absolute right-3 top-3 grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]">
            {big ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        )}
        <div className={`flex items-center gap-1 ${stacked || big || narrow ? "mt-1 w-full justify-end" : "shrink-0"}`}>
          <MenuSelect label="What should I do" value={c.mode} options={MODES} onChange={c.setMode} />
          <MenuSelect label="How should I sound" value={c.voice} options={VOICES} onChange={c.setVoice} />
          {c.busy ? (
            <button type="button" onClick={c.stop} className="btn-main !h-9 !w-9 !p-0 justify-center" aria-label="Stop"><Square className="h-3.5 w-3.5 fill-current" /></button>
          ) : (
            <button type="submit" disabled={!input.trim()} className="btn-main !h-9 !w-9 !p-0 justify-center disabled:opacity-50" aria-label="Send"><Send className="h-4 w-4" /></button>
          )}
        </div>
      </form>
      <p className="mx-auto mt-1.5 w-fit max-w-full rounded-full bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-3 py-0.5 text-center text-[11px] leading-snug text-[var(--text-muted)] backdrop-blur-sm">The Mentor is an AI and can make mistakes, so check important facts, numbers and dates before you rely on them.</p>
    </div>
  );

  // A new chat opens like Gemini's: a greeting, the box in the middle, suggestions under it. After the first message the box docks at the bottom.
  const centred = (
    <div className="mentor-stage mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-1">
      <h2 className="mb-5 text-center font-display text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">What shall we work on?</h2>
      {composerBlock}
      <ul className="mx-auto mt-4 w-full max-w-xl space-y-1">
        {STARTERS.map((st) => (
          <li key={st.title}>
            <button type="button" onClick={() => { if (st.mode) c.setMode(st.mode); void c.send(st.text, st.mode ?? "Ask"); }} className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--surface)]/70">
              <MentorLogo className="h-5" /><span className="font-semibold">{st.title}</span><span className="truncate text-[var(--text-muted)]">{st.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const body = (
    <div className={`flex w-full gap-3 ${wide ? "h-full" : "h-[calc(100dvh-9.5rem)] min-h-[26rem]"}`} data-fill-height="always">
      {sideOpen && <aside aria-label="Chats" className="ai-panel hidden w-64 shrink-0 p-3 lg:block">{renderHistory(false)}</aside>}
      {/* Phone history drawer, portalled to <body>: the page container is transformed, which would trap a fixed drawer under the top bar. */}
      {mounted && createPortal(<AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[300] lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} className="absolute inset-0 bg-black/30" />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: "spring", stiffness: 380, damping: 36 }} aria-label="Chats" style={{ position: "absolute" }} className="ai-panel inset-y-0 left-0 h-full w-[18.5rem] max-w-[86vw] !rounded-l-none !rounded-r-3xl p-3 pt-4 shadow-2xl">
              <div className="h-full">{renderHistory(true)}</div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>, document.body)}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setDrawer(true)} className="btn-soft !h-10 !px-3 text-sm lg:hidden" aria-label="Chat history"><History className="h-4 w-4" /></button>
          {!sideOpen && <span className="hidden lg:block"><LogoToggle open={false} label="Show chat history" onClick={toggleSide} /></span>}
          {!fromBar && <Link href="/ai-mentor" className="btn-soft !h-10 !px-3 text-sm"><ArrowLeft className="h-4 w-4" /> Mentor</Link>}
          <h1 className="min-w-0 flex-1 truncate font-display text-xl font-extrabold text-[var(--text-primary)] max-sm:order-last max-sm:basis-full" title={c.title}>{c.activeId ? c.title : "Chat with your Mentor"}</h1>
          {tier !== "pro" && <Link href="/pro" className="ml-auto inline-flex h-10 items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--tint-sky-ink)_16%,var(--surface))] px-4 text-sm font-bold text-[var(--tint-sky-ink)] transition-transform hover:-translate-y-0.5"><MentorLogo className="h-5" /> Upgrade</Link>}
          <button type="button" onClick={toggleWide} aria-pressed={wide} aria-label={wide ? "Shrink the chat" : "Enlarge the chat to fill the app"} title={wide ? "Shrink the chat" : "Fill the whole app"} className="btn-soft !h-10 !px-3">{wide ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</button>
          {c.signedIn && <button type="button" onClick={c.newChat} className="btn-soft !h-10 !px-3" aria-label="New chat" title="New chat"><MessageSquarePlus className="h-4 w-4" /></button>}
        </div>

        <section className="relative min-h-0 flex-1" aria-label="Conversation">
          {empty && !narrow && <div className="absolute inset-0">{centred}</div>}
          <div ref={listRef} hidden={empty && !narrow} style={{ paddingBottom: composerH + 24 }} className="custom-scrollbar absolute inset-0 space-y-4 overflow-y-auto pr-1" aria-live="polite">
            {empty && narrow && (
              <div className="pt-2">
                <h2 className="mb-3 text-center font-display text-2xl font-extrabold text-[var(--text-primary)]">What shall we work on?</h2>
                <ul className="space-y-1.5">
                  {STARTERS.map((st) => (
                    <li key={st.title}><button type="button" onClick={() => { if (st.mode) c.setMode(st.mode); void c.send(st.text, st.mode ?? "Ask"); }} className="flex w-full cursor-pointer flex-col rounded-2xl bg-[var(--surface)] px-4 py-3 text-left"><span className="text-sm font-bold text-[var(--text-primary)]">{st.title}</span><span className="truncate text-xs text-[var(--text-muted)]">{st.text}</span></button></li>
                  ))}
                </ul>
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
                          className="field-bare w-full resize-none px-2 py-1 text-sm text-[var(--text-primary)]" />
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
                    <MentorLogo className="mt-1 h-8" />
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
            {unanswered && (
              <p className="flex items-center gap-3 text-sm text-[var(--text-secondary)]"><MentorLogo className="h-7" />
                No answer yet. <button type="button" onClick={() => void c.retry()} className="pill-ink cursor-pointer text-xs">Try again</button></p>
            )}
          </div>

          {(!empty || narrow) && <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-1 pb-1"><div className="pointer-events-auto">{composerBlock}</div></div>}
        </section>
      </div>
    </div>
  );

  // Enlarged: the chat covers the top bar and fills the whole window (not the browser's full screen), with the same cards and styling.
  // Portalled so the page's own padding and transform do not constrain it; the shrink button is in the header.
  // One persistent container holds the chat. Enlarging MOVES that container to <body> (above the top bar, which the page's transform would otherwise trap it under)
  // and shrinking moves it back, so React never remounts the chat: no blank flash, no lost typing, no reloaded images.
  const [host, setHost] = useState<HTMLDivElement | null>(null);   // created after mount, so the server and the first client render agree
  useEffect(() => { setHost(document.createElement("div")); }, []);
  const slotRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host) return;
    if (wide) { host.className = "mentor-wide fixed inset-0 z-[320] bg-[var(--background)] p-2 sm:p-3"; document.body.appendChild(host); }
    else { host.className = "contents"; slotRef.current?.appendChild(host); }
    return () => { host.remove(); };
  }, [host, wide]);
  const framed = <div className={wide ? "h-full rounded-[var(--card-radius)] border border-[var(--border)] bg-[color-mix(in_srgb,var(--tint-sky)_55%,var(--surface))] p-3 shadow-sm sm:p-4" : "contents"}>{body}</div>;
  return <><div ref={slotRef} className="contents" />{host ? createPortal(framed, host) : null}</>;
}

export default function MentorChatPage() {
  return <Suspense fallback={null}><ChatScreen /></Suspense>;
}
