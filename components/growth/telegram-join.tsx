"use client";

import { ArrowRight, MessageCircle, Send } from "lucide-react";
import { track } from "@/lib/growth/track";
import { hasJoinedChannel, hasJoinedGroup, useTelegramState } from "@/components/growth/use-telegram-state";

export const TELEGRAM_CHANNEL_URL = "https://t.me/renyxera";
export const TELEGRAM_GROUP_URL = "https://t.me/renyxera_chat";

const open = (where: string) => () => track("telegram_join", null, where);

/** The Telegram paper plane, flying in from the corner and settling into place, then resting before it flies again. */
export const TelegramBadge = ({ size = "md" }: { size?: "md" | "lg" }) => (
  <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-md shadow-sky-500/30 ${size === "lg" ? "h-16 w-16" : "h-11 w-11"}`} aria-hidden>
    <Send className={`tg-fly ${size === "lg" ? "h-8 w-8" : "h-5 w-5"}`} />
  </span>
);

const BTN_MAIN = "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-4 text-xs font-bold text-white shadow-sm shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-600";
const BTN_SIDE = "inline-flex h-9 items-center justify-center rounded-xl border border-sky-500/30 px-4 text-xs font-bold text-sky-700 transition hover:-translate-y-0.5 hover:bg-sky-500/10 dark:text-sky-300";

/** Dashboard card: the daily-question channel and the discussion group. Hidden once you have joined both. */
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
          <p className="text-xs text-[var(--text-muted)]">One real GATE question every morning, with yesterday&apos;s answer.</p>
        </div>
      </div>
      <div className={`mt-4 grid gap-2 ${needChannel && needGroup ? "grid-cols-2" : "grid-cols-1"}`}>
        {needChannel && <a href={TELEGRAM_CHANNEL_URL} onClick={open("dashboard_channel")} target="_blank" rel="noopener noreferrer" className={BTN_MAIN}>Daily question</a>}
        {needGroup && <a href={TELEGRAM_GROUP_URL} onClick={open("dashboard_group")} target="_blank" rel="noopener noreferrer" className={needChannel ? BTN_SIDE : BTN_MAIN}>Discussion</a>}
      </div>
    </div>
  );
}

/** Small attention card for public pages (one Join button, no raw links), or a one-line pill when `compact`.
 *  Hidden for learners who have already joined the channel. */
export function TelegramJoinLink({ where, className = "", compact = false }: { where: string; className?: string; compact?: boolean }) {
  const t = useTelegramState();
  if (hasJoinedChannel(t)) return null;
  if (compact) {
    return (
      <a href={TELEGRAM_CHANNEL_URL} onClick={open(`${where}_channel`)} target="_blank" rel="noopener noreferrer"
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
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">One real past-paper question plus yesterday&apos;s answer, free on Telegram.</p>
      </div>
      <a href={TELEGRAM_CHANNEL_URL} onClick={open(`${where}_channel`)} target="_blank" rel="noopener noreferrer" className={`${BTN_MAIN} shrink-0`}>Join <ArrowRight className="h-3.5 w-3.5" /></a>
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
