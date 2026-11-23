"use client";

import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { MentorLogo } from "@/components/brand/mentor-logo";
import { MENTOR_HOME } from "@/lib/mentor/links";

/**
 * One switch between the two halves of the same helper: the Mentor (plans, chat about you) and the Tutor (one question taught step by step).
 * It sits at the top of every screen of either half, so moving between them never means going back to the menu.
 */
export function MentorSwitch({ active, className = "" }: { active: "mentor" | "tutor"; className?: string }) {
  const items = [
    { id: "mentor" as const, label: "Mentor", href: MENTOR_HOME, icon: <MentorLogo className="h-4" /> },
    { id: "tutor" as const, label: "Tutor", href: "/ai-tutor", icon: <GraduationCap className="h-4 w-4" aria-hidden /> },
  ];
  return (
    <nav aria-label="AI Mentor and Tutor" className={`inline-flex shrink-0 rounded-full border border-[var(--border)] bg-[var(--surface-secondary)] p-1 ${className}`}>
      {items.map((i) => (
        <Link key={i.id} href={i.href} aria-current={active === i.id ? "page" : undefined}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-extrabold transition-colors ${active === i.id ? "bg-[var(--text-primary)] text-[var(--background)] shadow-sm" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}>
          {i.icon}{i.label}
        </Link>
      ))}
    </nav>
  );
}
