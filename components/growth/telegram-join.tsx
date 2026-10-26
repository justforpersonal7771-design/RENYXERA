"use client";

import { ArrowRight, Check, Megaphone, MessageCircle, Send } from "lucide-react";
import { usePaperLabel } from "@/lib/branch/use-paper-label";
import { TELEGRAM_BRANCH, TELEGRAM_CHAT, TELEGRAM_FOLDER, TELEGRAM_HUB } from "@/lib/social";
import { track } from "@/lib/growth/track";
import { hasJoinedChannel, hasJoinedGroup, useTelegramState } from "@/components/growth/use-telegram-state";

export const TELEGRAM_CHANNEL_URL = TELEGRAM_HUB;
export const TELEGRAM_GROUP_URL = TELEGRAM_CHAT;

/** The student's own branch channel (the branch chosen at onboarding). */
export function useBranchChannel() {
  const paper = usePaperLabel();
  return { paper, url: TELEGRAM_BRANCH[paper] ?? TELEGRAM_BRANCH.CS };
}

const open = (where: string) => () => track("telegram_join", null, where);

/** The Telegram paper plane, flying in from the corner and settling into place, then resting before it flies again. */
export const TelegramBadge = ({ size = "md" }: { size?: "md" | "lg" }) => (
  <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-md shadow-sky-500/30 ${size === "lg" ? "h-16 w-16" : "h-11 w-11"}`} aria-hidden>
    <Send className={`tg-fly ${size === "lg" ? "h-8 w-8" : "h-5 w-5"}`} />
  </span>
);

const BTN_MAIN = "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-4 text-xs font-bold text-white shadow-sm shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-600";
const BTN_SIDE = "inline-flex h-9 items-center justify-center rounded-xl border border-sky-500/30 px-4 text-xs font-bold text-sky-700 transition hover:-translate-y-0.5 hover:bg-sky-500/10 dark:text-sky-300";

/** The three RENYXERA rooms, shown the same way everywhere: hub, the student's branch channel, discussion group. */
export function TelegramRooms({ where, joined = {}, showFolder = false }: { where: string; joined?: { hub?: boolean | null; group?: boolean | null }; showFolder?: boolean }) {
  const { paper, url } = useBranchChannel();
  const rooms = [
    { key: "branch", href: url, title: `GATE ${paper} channel`, note: "Your branch · one official question every morning, answer hidden until you tap", icon: <Send className="h-4 w-4" />, done: null as boolean | null },
    { key: "hub", href: TELEGRAM_HUB, title: "RENYXERA hub", note: "GATE 2027 updates, mock reminders and offers", icon: <Megaphone className="h-4 w-4" />, done: joined.hub ?? null },
    { key: "group", href: TELEGRAM_CHAT, title: "Discussion group", note: "Doubts and ranks, with a topic for every branch", icon: <MessageCircle className="h-4 w-4" />, done: joined.group ?? null },
  ];
  return (
    <div>
      <ul className="grid gap-2 sm:grid-cols-3">
        {rooms.map((r) => (
          <li key={r.key} className="min-w-0">
            <a href={r.href} onClick={open(`${where}_${r.key}`)} target="_blank" rel="noopener noreferrer"
              className="group flex h-full flex-col gap-2 rounded-2xl border border-sky-500/20 bg-[var(--surface)]/70 p-3 transition hover:-translate-y-0.5 hover:border-sky-500/50">
              <span className="flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-300">{r.icon}</span>
                {r.done ? <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300"><Check className="h-3 w-3" />Joined</span>
                  : <span className="text-[11px] font-bold text-sky-600 dark:text-sky-300 group-hover:translate-x-0.5 transition-transform">Join →</span>}
              </span>
              <span className="text-sm font-extrabold text-[var(--text-primary)]">{r.title}</span>
              <span className="text-[11px] leading-snug text-[var(--text-muted)]">{r.note}</span>
            </a>
          </li>
        ))}
      </ul>
      {showFolder && <a href={TELEGRAM_FOLDER} onClick={open(`${where}_folder`)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex text-xs font-semibold text-sky-700 hover:underline dark:text-sky-300">Or add all RENYXERA rooms in one tap →</a>}
    </div>
  );
}

/** Dashboard card: the three rooms. Hidden once the student has joined the hub and the group (branch membership can't be checked). */
export function TelegramJoinCard() {
  const t = useTelegramState();
  const needChannel = !hasJoinedChannel(t), needGroup = !hasJoinedGroup(t);
  if (t.linked && !needChannel && !needGroup) return null;
  return (
    <div className="card-glass rounded-3xl border border-sky-500/20 p-5">
      <div className="flex items-center gap-3">
        <TelegramBadge />
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[var(--text-primary)]">{t.linked ? "Finish joining on Telegram" : "Join RENYXERA on Telegram"}</p>
          <p className="text-xs text-[var(--text-muted)]">Three rooms: your branch, the hub and the discussion group.</p>
        </div>
      </div>
      <div className="mt-4"><TelegramRooms where="dashboard" joined={{ hub: !needChannel, group: !needGroup }} /></div>
    </div>
  );
}

/** Small attention card for public pages (one Join button, no raw links), or a one-line pill when `compact`.
 *  Hidden for learners who have already joined the channel. */
export function TelegramJoinLink({ where, className = "", compact = false }: { where: string; className?: string; compact?: boolean }) {
  const t = useTelegramState();
  const { url: branchUrl } = useBranchChannel();
  if (hasJoinedChannel(t)) return null;
  if (compact) {
    return (
      <a href={branchUrl} onClick={open(`${where}_channel`)} target="_blank" rel="noopener noreferrer"
        className={`group mx-auto flex w-fit items-center gap-2 rounded-full bg-sky-500/10 px-3.5 py-1.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-500/25 transition hover:-translate-y-px hover:ring-sky-500/50 dark:text-sky-300 ${className}`}>
        <Send className="h-3.5 w-3.5" />
        Get a free GATE question every morning on Telegram
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </a>
    );
  }
  return (
    <div className={`flex w-full max-w-xl flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-sky-500/25 bg-gradient-to-r from-sky-500/10 via-sky-500/5 to-transparent p-3.5 ${className}`}>
      <TelegramBadge />
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-sm font-extrabold leading-tight text-[var(--text-primary)]">A GATE question every morning</p>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">One real past-paper question every morning for your branch, answer hidden until you tap. Free on Telegram.</p>
      </div>
      <a href={branchUrl} onClick={open(`${where}_channel`)} target="_blank" rel="noopener noreferrer" className={`${BTN_MAIN} shrink-0`}>Join <ArrowRight className="h-3.5 w-3.5" /></a>
    </div>
  );
}

/** "Talk about this with other students": shown where a learner may want to ask or compare (a question, a result). */
export function TelegramDiscussLink({ where, label = "Discuss this in the student group", className = "" }: { where: string; label?: string; className?: string }) {
  return (
    <a href={TELEGRAM_GROUP_URL} onClick={open(`${where}_group`)} target="_blank" rel="noopener noreferrer"
      className={`group inline-flex w-fit items-center gap-2 rounded-full border border-sky-500/30 px-3.5 py-1.5 text-xs font-bold text-sky-700 transition hover:-translate-y-px hover:bg-sky-500/10 dark:text-sky-300 ${className}`}>
      <MessageCircle className="h-3.5 w-3.5" aria-hidden /> {label}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </a>
  );
}
