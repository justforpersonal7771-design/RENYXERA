"use client";

/** Test Centre / History: every attempt in one list (custom tests and mocks), with a link to results and review. */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { Segmented } from "@/components/ui/folder-tabs";
import { Attempt, KIND_LABEL, TestKind, summarizeSession } from "@/features/test-centre/model";

type Filter = "all" | TestKind;

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<Attempt[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let alive = true;
    void IDBManager.getAllExamSessions().then((recs) => {
      if (!alive) return;
      const list = recs.map((r) => summarizeSession(r.sessionData as never)).filter((a) => a.submitted)
        .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
      setAttempts(list);
    });
    return () => { alive = false; };
  }, []);

  const shown = useMemo(() => (attempts ?? []).filter((a) => filter === "all" || a.kind === filter), [attempts, filter]);

  return (
    <div className="flex w-full flex-col gap-5">
      <section className="card-well p-5 sm:p-6" data-tint="sky" aria-label="History">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-[var(--text-primary)]">History</h1>
            <p className="mt-1 text-[var(--text-secondary)]">Every test you have submitted on this device, newest first.</p>
          </div>
          <Segmented label="Kind" value={filter} onChange={setFilter} options={[{ id: "all", label: "All" }, { id: "custom", label: "Custom tests" }, { id: "mock", label: "Mocks" }]} />
        </div>
      </section>

      <section className="card-pastel p-4 sm:p-5" data-tint="lilac" aria-label="Attempts">
        {attempts === null ? <p className="text-sm text-[var(--text-muted)]">Loading your attempts...</p>
          : shown.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-[var(--text-secondary)]">No submitted tests yet.</p>
              <Link href="/test-centre/build" className="btn-main mt-3">Build a test</Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {shown.map((a) => (
                <li key={a.id}>
                  <Link href={`/exam/results?id=${a.id}`} className="group flex items-center gap-3 rounded-2xl bg-[var(--surface)] p-3">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-[var(--text-primary)]">{KIND_LABEL[a.kind]} · {new Date(a.startedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="block truncate text-xs text-[var(--text-muted)]">{a.answered} of {a.total} answered · {a.minutes} min</span>
                    </span>
                    <span className="shrink-0 text-sm font-extrabold text-[var(--text-primary)]">{a.marks != null ? `${Math.round(a.marks * 100) / 100}${a.maxMarks ? ` / ${a.maxMarks}` : ""}` : "Not scored"}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          )}
      </section>
    </div>
  );
}
