"use client";

/**
 * AI chat button in the top bar's action cluster: just the Mentor logo, no tile or outline, so it sits with its neighbours.
 * The spark blinks every few seconds and pops when you point at it. Opens the Mentor chat from anywhere
 * (`?from=bar` hides the chat's "back to Mentor" button).
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MentorLogo } from "@/components/brand/mentor-logo";

export function MentorNavButton() {
  const on = (usePathname() ?? "").startsWith("/ai-mentor/chat"); // no pill or ring for the active state: the logo stays bare
  return (
    <Link href="/ai-mentor/chat?from=bar" aria-label="Chat with your AI Mentor" aria-current={on ? "page" : undefined} title="Chat with your AI Mentor"
      className={`ai-nav-btn nav-act group relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-lg`}>
      <MentorLogo className="h-[30px]" mode="blink" />
    </Link>
  );
}
