"use client";

/** One line at the top of a chapter page that says where the chapter sits against the student's Focus Target (the top-bar goal slider). */
import { useState } from "react";
import { X } from "lucide-react";
import { CS_SHELF } from "@/lib/study/catalog";
import { useLibraryFocus } from "@/lib/study/use-focus";

export function FocusNote({ href }: { href: string }) {
  const focus = useLibraryFocus();
  const [closed, setClosed] = useState(false);
  let found: { b: (typeof CS_SHELF)[number]; c: (typeof CS_SHELF)[number]["chapters"][number] } | null = null;
  for (const b of CS_SHELF) { const c = b.chapters.find((x) => x.href === href); if (c) { found = { b, c }; break; } }
  if (closed || !found || !focus.active || !focus.ready) return null;
  const f = focus.chapter(found.b, found.c);
  const tone = f.foundation ? "var(--text-muted)" : f.inTarget ? "var(--st-accent, var(--text-primary))" : "var(--text-muted)";
  return (
    <div data-testid="focus-note" className="mx-3 mt-2 flex items-start gap-2 rounded-xl border py-2 pl-3 pr-2 text-sm font-semibold text-[var(--text-primary)] sm:mx-0" style={{ borderColor: tone, background: "color-mix(in srgb, var(--surface-secondary) 70%, transparent)" }}>
      <p className="min-w-0 flex-1"><b>Focus Target {focus.target}%.</b>{" "}
      {f.foundation ? "No past-paper question is tagged to this chapter, but later chapters build on it, so it stays in your plan."
        : f.inTarget ? `Inside your target: ${f.qs} past-paper question${f.qs === 1 ? "" : "s"}, ${f.share.toFixed(1)}% of all GATE marks.`
        : `Outside your target: ${f.qs} past-paper question${f.qs === 1 ? "" : "s"}, ${f.share.toFixed(1)}% of all marks. Do your priority chapters first; you can still read this one.`}
      </p>
      <button type="button" onClick={() => setClosed(true)} aria-label="Close the focus target note" className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full hover:bg-black/10 dark:hover:bg-white/10"><X className="h-4 w-4" aria-hidden /></button>
    </div>
  );
}
