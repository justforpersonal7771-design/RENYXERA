"use client";

import { useId } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SquarePen } from "lucide-react";
import { TutorHistoryMenu } from "@/components/mentor/tutor-history";
import { CHATBOT_NAME } from "@/lib/mentor/brand";

/** Where "Mentor" leads: the chat itself, so moving between the two halves always lands in a working screen, never a menu. */
export const MENTOR_CHAT = "/ai-mentor/chat";
export const TUTOR_HOME = "/ai-tutor";

/**
 * One switch between the two halves of the AI Mentor: the chatbot (named in lib/mentor/brand.ts; it chats about you, your plan and your data) and the Tutor (one question taught
 * step by step). It sits at the right end of the header of every screen of either half, just before the window controls, so it is always in the same place.
 * Names only, no icons: the two halves share one identity. A sliding thumb shows where you are; both labels keep full contrast in light and dark.
 */
export function MentorSwitch({ active, className = "" }: { active: "mentor" | "tutor"; className?: string }) {
  const thumb = useId();
  const items = [
    { id: "mentor" as const, label: CHATBOT_NAME, href: MENTOR_CHAT },
    { id: "tutor" as const, label: "Tutor", href: TUTOR_HOME },
  ];
  return (
    <nav aria-label={`${CHATBOT_NAME} and Tutor`} className={`relative inline-flex h-10 shrink-0 items-center rounded-full border border-[var(--border)] bg-[var(--surface-secondary)] p-1 ${className}`}>
      {items.map((i) => {
        const on = active === i.id;
        return (
          <Link key={i.id} href={i.href} aria-current={on ? "page" : undefined} prefetch
            className={`relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-bold transition-colors ${on ? "text-[var(--tint-sky-ink)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
            {on && <motion.span layoutId={thumb} initial={false} transition={{ type: "spring", stiffness: 500, damping: 36 }} className="absolute inset-0 -z-10 rounded-full bg-[var(--tint-sky)] shadow-[0_1px_2px_rgba(0,0,0,.12),inset_0_0_0_1.5px_var(--tint-sky-ink)]" aria-hidden />}
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * What follows the switch on the Tutor's working screen: a way back to the question picker (a new question) and, last, the history of Tutor sessions. Icons only
 * on narrower screens, so the whole header stays on one line.
 */
export function TutorHeaderTail() {
  return (
    <>
      <Link href={TUTOR_HOME} className="btn-soft !h-10 !px-3 inline-flex items-center justify-center gap-1.5 text-sm" aria-label="New question: open the question picker" title="New question">
        <SquarePen className="h-4 w-4" aria-hidden /><span className="max-2xl:hidden">New question</span>
      </Link>
      <TutorHistoryMenu iconOnly />
    </>
  );
}
