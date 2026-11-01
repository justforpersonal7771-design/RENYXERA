"use client";

/** Opens the AI Mentor chat from the calendar and to-do panels. `?from=bar` tells the chat not to show its "back to Mentor" button. */
import Link from "next/link";
import { motion } from "motion/react";
import { MessageCircleHeart, Sparkles } from "lucide-react";

export function MentorChatButton({ onOpen }: { onOpen?: () => void }) {
  return (
    <Link href="/ai-mentor/chat?from=bar" onClick={onOpen} aria-label="Chat with your AI Mentor" title="Chat with your AI Mentor"
      className="group relative grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/25 bg-white/20 text-white transition-colors hover:bg-white/30">
      <motion.span animate={{ rotate: [0, -10, 8, -4, 0] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 3.2 }} className="block">
        <MessageCircleHeart className="h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110" />
      </motion.span>
      <Sparkles aria-hidden className="absolute -right-1 -top-1 h-3 w-3 text-amber-200 motion-safe:animate-pulse" />
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-white/40 opacity-0 motion-safe:group-hover:animate-ping" aria-hidden />
    </Link>
  );
}
