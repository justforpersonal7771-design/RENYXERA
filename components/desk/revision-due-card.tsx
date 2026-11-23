"use client";

import Link from "next/link";
import { Repeat } from "lucide-react";
import { useRevisionDue } from "@/lib/desk/revision";
import { estimateMinutes } from "@/lib/revision/scheduler";

/** The revision queue where the student already is: the dashboard, the Planner's day and the AI Desk hub. Hidden until the queue has something in it. */
export function RevisionStrip({ className = "" }: { className?: string }) {
  const { loaded, due, total } = useRevisionDue();
  if (!loaded || total === 0) return null;
  return (
    <section aria-label="Revision due today" className={`flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 ${className}`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: "var(--tint-rose)", color: "var(--tint-rose-ink)" }}><Repeat className="h-5 w-5" aria-hidden /></span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-extrabold text-[var(--text-primary)]">{due > 0 ? `${due} ${due === 1 ? "item" : "items"} to revise today` : "Revision is up to date"}</p>
        <p className="text-xs text-[var(--text-secondary)]">{due > 0 ? `About ${estimateMinutes(Math.min(due, 40))} minutes, spaced so you remember them for the exam.` : `${total} in your queue. The next ones fall due soon.`}</p>
      </div>
      {due > 0 ? <Link href="/revision/session?n=20" className="btn-main !h-10 !px-4 text-sm">Start</Link> : null}
      <Link href="/revision" className="btn-soft !h-10 !px-4 text-sm">Open</Link>
    </section>
  );
}
