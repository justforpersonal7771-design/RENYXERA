"use client";

import { useId } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ClipboardX, GraduationCap, Search, Sparkles } from "lucide-react";
import { CHATBOT_NAME } from "@/lib/mentor/brand";

/** Where "Mentor" leads: the chat itself, so moving between the two halves always lands in a working screen, never a menu. */
export const MENTOR_CHAT = "/ai-mentor/chat";
export const TUTOR_HOME = "/ai-tutor";

/**
 * One switch between the two halves of the AI Mentor: the chatbot (named in lib/mentor/brand.ts; it chats about you, your plan and your data) and the Tutor (one question taught
 * step by step). It sits at the right end of the header of every screen of either half, just before the window controls, so it is always in the same place.
 * A sliding thumb shows where you are; both labels keep full contrast in light and dark.
 */
export function MentorSwitch({ active, className = "" }: { active: "mentor" | "tutor"; className?: string }) {
  const thumb = useId();
  const items = [
    { id: "mentor" as const, label: CHATBOT_NAME, href: MENTOR_CHAT, icon: Sparkles },
    { id: "tutor" as const, label: "Tutor", href: TUTOR_HOME, icon: GraduationCap },
  ];
  return (
    <nav aria-label={`${CHATBOT_NAME} and Tutor`} className={`relative inline-flex h-10 shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--surface-secondary)] p-1 ${className}`}>
      {items.map((i) => {
        const on = active === i.id;
        return (
          <Link key={i.id} href={i.href} aria-current={on ? "page" : undefined} prefetch={false}
            className={`relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-bold transition-colors ${on ? "text-[var(--background)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
            {on && <motion.span layoutId={thumb} initial={false} transition={{ type: "spring", stiffness: 500, damping: 36 }} className="absolute inset-0 -z-10 rounded-full bg-[var(--text-primary)] shadow-sm" aria-hidden />}
            <i.icon className="h-4 w-4" aria-hidden /><span className="max-[400px]:sr-only">{i.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * The two icon buttons that follow the switch on every Tutor screen, the same size and gap as the Mentor chat's "fill the app" and "new chat" buttons,
 * so the switch sits at the same place on both halves. "Find a question" starts a new Tutor session; "Your mistakes" lists what is worth being taught.
 */
export function TutorHeaderTail({ onFind }: { onFind?: () => void }) {
  const cls = "btn-soft !h-10 !px-3 inline-flex items-center justify-center";
  return (
    <>
      {onFind
        ? <button type="button" onClick={onFind} className={cls} aria-label="Find a question" title="Find a question"><Search className="h-4 w-4" /></button>
        : <Link href={TUTOR_HOME} className={cls} aria-label="Find another question" title="Find another question"><Search className="h-4 w-4" /></Link>}
      <Link href="/mistakes" className={cls} aria-label="Your mistakes" title="Your mistakes"><ClipboardX className="h-4 w-4" /></Link>
    </>
  );
}
