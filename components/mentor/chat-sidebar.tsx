"use client";

/**
 * The AI Mentor's chat history, redesigned (10 Nov 2026) from how the chat apps people already know group a long list:
 *  - Pinned first, then your Folders, then the rest by last activity: Today, Yesterday, Previous 7 days, Older. Empty groups are not shown.
 *  - One calm panel (no heavy blue slab): a pill "New chat" button, a search field, slim rows, small-caps group labels that stay put while the list scrolls.
 *  - The open chat is marked by a highlight that slides between rows; a row's actions (pin, move to folder, rename, delete) appear on hover or focus
 *    and are always visible on touch screens; folders open and close with a height animation.
 * All behaviour (open, new, pin, rename, move to a folder, delete) is passed in, so the same panel serves the side column and the phone drawer.
 */
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ChevronRight, Cloud, Folder, FolderInput, FolderMinus, MessageSquarePlus, PanelLeftClose, Pencil, Pin, PinOff, Search, Trash2, X } from "lucide-react";
import { MentorLogo } from "@/components/brand/mentor-logo";
import { istDateStr } from "@/lib/time/ist";
import type { ChatMeta } from "@/lib/mentor/chat-tree";

type Section = { key: string; label: string; kind: "pinned" | "folder" | "date"; items: ChatMeta[] };

/** Pinned, then each folder, then the unfiled chats by India-time day. Empty groups never appear. */
export function sectionsOf(list: ChatMeta[]): Section[] {
  const pinned: ChatMeta[] = [], folders: Record<string, ChatMeta[]> = {}, dated: Record<string, ChatMeta[]> = {};
  const today = istDateStr(), yest = istDateStr(new Date(Date.now() - 86400000)), week = istDateStr(new Date(Date.now() - 7 * 86400000));
  for (const c of list) {
    if (c.pinned) { pinned.push(c); continue; }
    if (c.group) { (folders[c.group] ??= []).push(c); continue; }
    const d = istDateStr(new Date(c.updatedAt));
    (dated[d === today ? "Today" : d === yest ? "Yesterday" : d >= week ? "Previous 7 days" : "Older"] ??= []).push(c);
  }
  return [
    ...(pinned.length ? [{ key: "pinned", label: "Pinned", kind: "pinned" as const, items: pinned }] : []),
    ...Object.keys(folders).sort((a, b) => a.localeCompare(b)).map((g) => ({ key: "f:" + g, label: g, kind: "folder" as const, items: folders[g] })),
    ...["Today", "Yesterday", "Previous 7 days", "Older"].filter((k) => dated[k]?.length).map((k) => ({ key: "d:" + k, label: k, kind: "date" as const, items: dated[k] })),
  ];
}

type Props = {
  chats: ChatMeta[]; activeId: string | null; signedIn: boolean; inDrawer: boolean;
  onOpen: (id: string) => void; onNew: () => void; onPin: (id: string) => void; onRename: (id: string, text: string) => void;
  onMove: (id: string, folder: string) => void; onDelete: (m: ChatMeta) => void; onSignIn: () => void; onClose: () => void;
};

const ICON_BTN = "grid h-7 w-7 cursor-pointer place-items-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text-primary)]";

export function ChatSidebar(p: Props) {
  const reduce = useReducedMotion();
  const [query, setQuery] = useState("");
  const [closed, setClosed] = useState<Record<string, boolean>>({});
  const [renaming, setRenaming] = useState<{ id: string; text: string } | null>(null);
  const [moveFor, setMoveFor] = useState<string | null>(null);
  const [newFolder, setNewFolder] = useState("");
  const q = query.trim().toLowerCase();
  const sections = useMemo(() => sectionsOf(p.chats.filter((x) => !q || x.title.toLowerCase().includes(q) || (x.snippet ?? "").includes(q) || (x.group ?? "").toLowerCase().includes(q))), [p.chats, q]);
  const folderNames = useMemo(() => [...new Set(p.chats.map((x) => x.group).filter(Boolean) as string[])].sort((a, b) => a.localeCompare(b)), [p.chats]);
  const firstFolder = sections.findIndex((s) => s.kind === "folder");

  const row = (m: ChatMeta) => {
    const on = m.id === p.activeId;
    return (
      <li key={m.id} className="relative">
        <div className="group relative flex items-center gap-1 rounded-xl pl-2.5 pr-1">
          {on && <motion.span layoutId="mentor-active-row" aria-hidden transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 40 }} className="absolute inset-0 rounded-xl bg-[var(--surface)] shadow-sm ring-1 ring-[color-mix(in_srgb,var(--tint-ink,#6366f1)_30%,transparent)]" />}
          {on && <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[var(--tint-sky-ink)]" />}
          {renaming?.id === m.id ? (
            <input autoFocus value={renaming.text} aria-label="Chat name" maxLength={80} onChange={(e) => setRenaming({ id: m.id, text: e.target.value })}
              onKeyDown={(e) => { if (e.key === "Enter") { p.onRename(m.id, renaming.text); setRenaming(null); } if (e.key === "Escape") setRenaming(null); }}
              onBlur={() => { p.onRename(m.id, renaming.text); setRenaming(null); }}
              className="relative z-10 my-1 h-8 min-w-0 flex-1 rounded-lg border-2 border-[var(--tint-sky-ink)] bg-[var(--surface)] px-2 text-sm outline-none" />
          ) : (
            <button type="button" onClick={() => p.onOpen(m.id)} aria-current={on ? "true" : undefined} title={m.title}
              className={`relative z-10 min-w-0 flex-1 cursor-pointer truncate py-2 text-left text-[13.5px] leading-tight ${on ? "font-extrabold text-[var(--text-primary)]" : "font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]"}`}>{m.title}</button>
          )}
          {renaming?.id !== m.id && (
            <span className="relative z-10 flex shrink-0 items-center opacity-100 transition-opacity duration-150 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:opacity-100">
              <button type="button" onClick={() => p.onPin(m.id)} aria-label={m.pinned ? "Unpin chat" : "Pin chat"} title={m.pinned ? "Unpin" : "Pin"} className={ICON_BTN}>{m.pinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}</button>
              <button type="button" onClick={() => { setMoveFor(moveFor === m.id ? null : m.id); setNewFolder(""); }} aria-label="Move to a folder" title="Move to a folder" aria-expanded={moveFor === m.id} className={ICON_BTN}><FolderInput className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => setRenaming({ id: m.id, text: m.title })} aria-label="Rename chat" title="Rename" className={ICON_BTN}><Pencil className="h-3.5 w-3.5" /></button>
              <button type="button" onClick={() => p.onDelete(m)} aria-label="Delete chat" title="Delete" className={`${ICON_BTN} hover:!text-[var(--tint-rose-ink)]`}><Trash2 className="h-3.5 w-3.5" /></button>
            </span>
          )}
        </div>
        <AnimatePresence initial={false}>
          {moveFor === m.id && (
            <motion.div role="menu" aria-label="Move to a folder" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
              <div className="mx-1 mb-2 mt-1 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-md">
                <p className="border-b border-[var(--border)] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide text-[var(--text-muted)]">Move to</p>
                <ul className="max-h-40 overflow-y-auto py-1">
                  <li><button type="button" role="menuitem" onClick={() => { p.onMove(m.id, ""); setMoveFor(null); }} className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-[var(--surface-secondary)]"><FolderMinus className="h-4 w-4" /><span className="truncate">No folder</span></button></li>
                  {folderNames.map((n) => <li key={n}><button type="button" role="menuitem" onClick={() => { p.onMove(m.id, n); setMoveFor(null); }} className="flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-[var(--surface-secondary)]"><Folder className="h-4 w-4" /><span className="truncate">{n}</span></button></li>)}
                </ul>
                <form className="flex items-center gap-1.5 border-t border-[var(--border)] p-2" onSubmit={(e) => { e.preventDefault(); if (newFolder.trim()) { p.onMove(m.id, newFolder); setMoveFor(null); } }}>
                  <input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} maxLength={40} placeholder="New folder" aria-label="New folder name" className="h-8 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)] px-2 text-sm outline-none focus:border-[var(--tint-sky-ink)]" />
                  <button type="submit" disabled={!newFolder.trim()} className="h-8 shrink-0 cursor-pointer rounded-lg bg-[var(--ink)] px-3 text-sm font-bold text-[var(--background)] disabled:opacity-40">Create</button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center gap-2 px-1">
        <MentorLogo className="h-9" mode="blink" />
        <span className="min-w-0 flex-1 truncate font-display text-base font-extrabold text-[var(--text-primary)]">AI Mentor</span>
        <button type="button" onClick={p.onClose} aria-label={p.inDrawer ? "Close chat history" : "Hide chat history"} title={p.inDrawer ? "Close" : "Hide history"} className={`${ICON_BTN} !h-8 !w-8 group/c`}>{p.inDrawer ? <X className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px] transition-transform duration-200 group-hover/c:-translate-x-0.5" />}</button>
      </div>

      {p.signedIn && (
        <button type="button" onClick={p.onNew} className="group/n relative mb-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[var(--ink)] text-sm font-extrabold text-[var(--background)] shadow-[0_10px_24px_-14px_var(--ink)] transition-transform hover:-translate-y-px active:translate-y-0">
          <span aria-hidden className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,.22),transparent)] transition-transform duration-700 group-hover/n:translate-x-full" />
          <MessageSquarePlus className="relative h-4 w-4" /><span className="relative">New chat</span>
        </button>
      )}

      {!p.signedIn ? (
        <div className="rounded-2xl bg-[var(--surface)] p-4 text-sm text-[var(--text-secondary)]">
          <p className="font-bold text-[var(--text-primary)]">This is a temporary chat</p>
          <p className="mt-1">It is not saved and disappears when you leave. Sign in to keep your chats, search them and use them on your other devices.</p>
          <button type="button" onClick={p.onSignIn} className="btn-main mt-3 !h-10 w-full justify-center !text-sm">Sign in to save</button>
        </div>
      ) : (
        <>
          <label className="relative mb-2 block">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search chats" aria-label="Search chats" className="h-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 pl-9 pr-9 text-sm outline-none transition-shadow focus:border-[var(--tint-sky-ink)] focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--tint-sky-ink)_16%,transparent)]" />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 grid h-6 w-6 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-secondary)]"><X className="h-3.5 w-3.5" /></button>}
          </label>

          <nav aria-label="Chat history" className="custom-scrollbar -mr-1 min-h-0 flex-1 overflow-y-auto pr-1">
            {sections.length === 0 && <p className="px-2 py-3 text-sm text-[var(--text-muted)]">{q ? "No chats match." : "Your chats will appear here."}</p>}
            <LayoutGroup id="mentor-history">
              {sections.map((g, gi) => (
                <section key={g.key} className="mb-1">
                  {g.kind === "folder" ? (
                    <>
                      {gi === firstFolder && <p className="sticky top-0 z-10 bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-2.5 pb-1 pt-2 text-[10.5px] font-extrabold uppercase tracking-[.09em] text-[var(--text-muted)] backdrop-blur">Folders</p>}
                      <button type="button" onClick={() => setClosed((v) => ({ ...v, [g.key]: !v[g.key] }))} aria-expanded={!closed[g.key]} className="group/f flex w-full cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 text-left transition-colors hover:bg-[var(--surface)]/60">
                        <motion.span animate={{ rotate: closed[g.key] ? 0 : 90 }} transition={{ duration: reduce ? 0 : 0.18 }} className="grid h-4 w-4 place-items-center text-[var(--text-muted)]"><ChevronRight className="h-3.5 w-3.5" /></motion.span>
                        <Folder className="h-4 w-4 shrink-0 text-[var(--tint-sky-ink)]" />
                        <span className="min-w-0 flex-1 truncate text-[13.5px] font-extrabold text-[var(--text-primary)]">{g.label}</span>
                        <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 text-[11px] font-bold text-[var(--text-secondary)]">{g.items.length}</span>
                      </button>
                      <AnimatePresence initial={false}>
                        {!closed[g.key] && (
                          <motion.ul initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] }} className="folder-kids relative ml-[1.15rem] overflow-hidden border-l-2 border-[color-mix(in_srgb,var(--tint-sky-ink)_28%,transparent)] pl-2">
                            {g.items.map(row)}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <>
                      <p className="sticky top-0 z-10 flex items-center gap-1.5 bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-2.5 pb-1 pt-2 text-[10.5px] font-extrabold uppercase tracking-[.09em] text-[var(--text-muted)] backdrop-blur">{g.kind === "pinned" && <Pin className="h-3 w-3" />}{g.label}</p>
                      <ul>{g.items.map(row)}</ul>
                    </>
                  )}
                </section>
              ))}
            </LayoutGroup>
          </nav>
          <p className="mt-2 flex items-center justify-center gap-1.5 px-2 text-[11px] font-semibold text-[var(--text-muted)]"><Cloud className="h-3.5 w-3.5" /> Saved to your account</p>
        </>
      )}
    </div>
  );
}
