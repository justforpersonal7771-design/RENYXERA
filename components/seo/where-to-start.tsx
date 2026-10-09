import { ArrowRight } from "lucide-react";

export type StartItem = { name: string; perPaper: number; share: number; href?: string };

/**
 * "Where to start" — fills the overview card with the three or four subjects that carry the most
 * marks in a branch, so every branch's syllabus page gives a study order, not just a chart.
 */
export function WhereToStart({ items, paper }: { items: StartItem[]; paper: string }) {
  const top = items.slice(0, 4);
  if (top.length === 0) return null;
  const covered = top.reduce((n, t) => n + t.share, 0);
  return (
    <div className="mt-5 border-t border-[var(--border)] pt-4">
      <h3 className="text-sm font-extrabold text-[var(--text-primary)]">Where to start</h3>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">These {top.length} subjects carry about {covered.toFixed(0)}% of a GATE {paper} paper. Revise them first.</p>
      <ol className="mt-3 space-y-2">
        {top.map((t, i) => {
          const body = (
            <>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-xs font-black text-violet-600 dark:text-violet-400 font-num">{i + 1}</span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--text-primary)]">{t.name}</span>
              <span className="shrink-0 text-xs font-bold font-num text-[var(--text-muted)]">{t.perPaper.toFixed(1)} marks / paper</span>
              {t.href && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-violet-500" aria-hidden />}
            </>
          );
          return (
            <li key={t.name}>
              {t.href
                ? <a href={t.href} className="flex items-center gap-3 rounded-xl bg-[var(--surface-secondary)]/60 px-3 py-2 transition-colors hover:bg-violet-500/10">{body}</a>
                : <div className="flex items-center gap-3 rounded-xl bg-[var(--surface-secondary)]/60 px-3 py-2">{body}</div>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
