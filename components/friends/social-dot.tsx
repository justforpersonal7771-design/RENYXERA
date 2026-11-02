"use client";

import { useSocialStore } from "@/store/use-social-store";

/** A small red badge with the number of waiting challenges and friend requests (R29). Renders nothing when there are none. Put it inside a `relative` parent. */
export function SocialDot({ className = "", plain = false }: { className?: string; plain?: boolean }) {
  const n = useSocialStore((s) => s.challenges + s.requests);
  if (n <= 0) return null;
  return plain
    ? <span className={`inline-flex h-2.5 w-2.5 rounded-full bg-rose-500 ${className}`} role="img" aria-label={`${n} waiting in Battles`} />
    : <span className={`inline-flex min-w-[1.1rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-extrabold leading-4 text-white ${className}`} role="img" aria-label={`${n} waiting in Battles`}>{n > 9 ? "9+" : n}</span>;
}
