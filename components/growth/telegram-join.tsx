"use client";

import { ArrowRight, Send } from "lucide-react";
import { track } from "@/lib/growth/track";

export const TELEGRAM_CHANNEL_URL = "https://t.me/renyxera";
export const TELEGRAM_GROUP_URL = "https://t.me/renyxera_chat";

const open = (where: string) => () => track("telegram_join", null, where);

const Badge = () => (
  <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 text-white shadow-md shadow-sky-500/30">
    <Send className="h-5 w-5 -translate-x-px translate-y-px" />
    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--surface)] animate-pulse" aria-hidden />
  </span>
);

const BTN_MAIN = "inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-4 text-xs font-bold text-white shadow-sm shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-600";
const BTN_SIDE = "inline-flex h-9 items-center justify-center rounded-xl border border-sky-500/30 px-4 text-xs font-bold text-sky-700 transition hover:-translate-y-0.5 hover:bg-sky-500/10 dark:text-sky-300";

/** Dashboard card: the daily-question channel and the discussion group. */
export function TelegramJoinCard() {
  return (
    <div className="card-glass rounded-3xl border border-sky-500/20 p-5">
      <div className="flex items-center gap-3">
        <Badge />
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-[var(--text-primary)]">Join RENYXERA on Telegram</p>
          <p className="text-xs text-[var(--text-muted)]">One official PYQ every morning, with yesterday&apos;s answer.</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={TELEGRAM_CHANNEL_URL} onClick={open("dashboard_channel")} target="_blank" rel="noopener noreferrer" className={BTN_MAIN}>Daily question</a>
        <a href={TELEGRAM_GROUP_URL} onClick={open("dashboard_group")} target="_blank" rel="noopener noreferrer" className={BTN_SIDE}>Discussion</a>
      </div>
    </div>
  );
}

/** Small attention card for public pages (no raw links shown), or a one-line pill when `compact`
 *  (used where space is tight, e.g. the results screen). */
export function TelegramJoinLink({ where, className = "", compact = false }: { where: string; className?: string; compact?: boolean }) {
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
      <Badge />
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-sm font-extrabold leading-tight text-[var(--text-primary)]">A GATE question every morning</p>
        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">Official PYQ plus yesterday&apos;s answer, free on Telegram.</p>
      </div>
      <div className="flex shrink-0 gap-2">
        <a href={TELEGRAM_CHANNEL_URL} onClick={open(`${where}_channel`)} target="_blank" rel="noopener noreferrer" className={BTN_MAIN}>Join <ArrowRight className="h-3.5 w-3.5" /></a>
        <a href={TELEGRAM_GROUP_URL} onClick={open(`${where}_group`)} target="_blank" rel="noopener noreferrer" className={BTN_SIDE}>Chat</a>
      </div>
    </div>
  );
}
