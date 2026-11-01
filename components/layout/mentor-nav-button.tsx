"use client";

/**
 * AI chat button in the top bar's action cluster. Unlike its flat neighbours it is a small gradient tile with the Mentor mark
 * (the ribbon flame with a spark), a slow colour drift, and a small lift of the flame on hover. Opens the Mentor chat from anywhere
 * (`?from=bar` hides the chat's "back to Mentor" button). Motion is transform/opacity only and switched off for reduced motion.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MentorMark } from "@/components/brand/mentor-mark";

export function MentorNavButton() {
  const on = (usePathname() ?? "").startsWith("/ai-mentor/chat");
  return (
    <Link href="/ai-mentor/chat?from=bar" aria-label="Chat with your AI Mentor" aria-current={on ? "page" : undefined} title="Chat with your AI Mentor" className="ai-nav-btn group relative z-10 mx-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-xl text-white">
      <MentorMark className="ai-nav-mark h-[20px] w-[20px]" />
    </Link>
  );
}
