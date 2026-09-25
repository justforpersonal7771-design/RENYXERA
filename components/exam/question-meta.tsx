"use client";

import { useEffect, type RefObject } from "react";

interface Meta {
  question_type: string;
  marks: number;
  difficulty?: string | number;
  section?: string;
  subject?: string;
  topic?: string;
}

/** Type · marks · difficulty, then section › subject › topic — one line, truncating. */
export function QuestionMetaChips({ q, compact = false, showSection = true }: { q: Meta; compact?: boolean; showSection?: boolean }) {
  const chip = "bg-[var(--surface-secondary)] text-[var(--text-secondary)] border border-[var(--border)] px-2 py-1 rounded-md truncate";
  return (
    <div className={`flex items-center gap-1.5 min-w-0 text-[10px] font-bold uppercase tracking-wider ${compact ? "" : "flex-wrap"}`}>
      <div className="flex items-center rounded-md border border-[var(--border)] overflow-hidden shrink-0 divide-x divide-[var(--border)]">
        <span className="bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-2 py-1">{q.question_type}</span>
        <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-1 font-num normal-case">
          +{q.marks}/{q.question_type === "MCQ" ? `-${(q.marks / 3).toFixed(2)}` : "0"}
        </span>
        {q.difficulty !== undefined && q.difficulty !== "" && (
          <span className="bg-amber-500/10 text-amber-700 dark:text-amber-300 px-2 py-1">{q.difficulty}</span>
        )}
      </div>
      {showSection && q.section && <span className={`${chip} shrink-0 max-w-[140px] hidden 2xl:inline-block`} title={q.section}>{q.section}</span>}
      {q.subject && <span className={`${chip} shrink-0 max-w-[160px]`} title={q.subject}>{q.subject}</span>}
      {q.topic && <span className={`${chip} min-w-0 max-w-[260px]`} title={q.topic}>{q.topic}</span>}
    </div>
  );
}

/**
 * Keeps the current question's cell in view inside a scrolling question grid: whenever
 * `index` changes (Next/Previous/jump), the grid scrolls — smoothly, by the minimum
 * amount — so the highlighted cell is visible, instead of staying below the fold.
 */
export function useKeepCurrentCellVisible(containerRef: RefObject<HTMLElement | null>, index: number) {
  useEffect(() => {
    const box = containerRef.current;
    if (!box) return;
    const id = requestAnimationFrame(() => {
      const cell = box.querySelector<HTMLElement>('[aria-current="step"]');
      if (!cell) return;
      const b = box.getBoundingClientRect();
      const c = cell.getBoundingClientRect();
      const pad = 8;
      if (c.top < b.top + pad) box.scrollBy({ top: c.top - b.top - pad, behavior: "smooth" });
      else if (c.bottom > b.bottom - pad) box.scrollBy({ top: c.bottom - b.bottom + pad, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [containerRef, index]);
}
