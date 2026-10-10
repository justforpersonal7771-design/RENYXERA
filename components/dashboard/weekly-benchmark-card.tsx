"use client";

import { useEffect, useState } from "react";
import { BarChart3, Share2 } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { useToastStore } from "@/store/use-toast-store";
import { track } from "@/lib/growth/track";
import { branchByCode, type BranchCode } from "@/lib/branches";

type Row = { branch: string; tests: number; avg_pct: number | null; peers: number; peer_avg_pct: number | null; peer_avg_tests: number | null; percentile: number | null };

/** "This week": your tests and average against other learners on your paper. Aggregates only; the percentile shows once 10 learners have tested. */
export function WeeklyBenchmarkCard() {
  const user = useAuthStore((s) => s.user);
  const [row, setRow] = useState<Row | null>(null);
  useEffect(() => {
    if (!user) return;
    let alive = true;
    void import("@/lib/supabase/client").then(async ({ createClient }) => {
      const { data, error } = await createClient().rpc("weekly_benchmark");
      if (!alive || error) return; // migration 0037 not applied yet: show nothing
      const r = (Array.isArray(data) ? data[0] : data) as Row | null;
      if (r) setRow(r);
    }).catch(() => null);
    return () => { alive = false; };
  }, [user]);
  if (!user || !row) return null;

  const paper = branchByCode(row.branch as BranchCode)?.paper ?? row.branch;
  const ahead = row.percentile != null ? `You're ahead of ${row.percentile}% of GATE ${paper} learners who tested this week.` : row.peers < 10 ? "Percentile appears once 10 learners have taken a test this week." : "Take a test to see where you stand.";
  const share = async () => {
    const text = `This week on RENYXERA: ${row.tests} test${row.tests === 1 ? "" : "s"}${row.avg_pct != null ? `, ${row.avg_pct}% average` : ""}${row.percentile != null ? `, ahead of ${row.percentile}% of GATE ${paper} learners` : ""}. Practise with real GATE papers.`;
    const url = "https://gate.renyxera.workers.dev/?utm_source=share&utm_medium=weekly&utm_campaign=my_week";
    track("share_clicked", null, "weekly_benchmark");
    try {
      if (navigator.share) await navigator.share({ title: "My week on RENYXERA", text, url });
      else { await navigator.clipboard.writeText(`${text} ${url}`); useToastStore.getState().show("Copied. Paste it to share your week.", "success"); }
    } catch { /* cancelled */ }
  };
  const stat = (k: string, v: string, s?: string) => <div className="rounded-xl bg-[var(--surface-secondary)]/60 p-3"><dt className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{k}</dt><dd className="mt-0.5 text-lg font-extrabold font-num text-[var(--text-primary)]">{v}</dd>{s && <dd className="text-xs text-[var(--text-muted)]">{s}</dd>}</div>;

  return (
    <section aria-label="This week compared with other learners" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]"><BarChart3 className="h-4 w-4 text-violet-500" aria-hidden /> This week vs other GATE {paper} learners</h2>
        {row.tests > 0 && <button type="button" onClick={share} className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-bold text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"><Share2 className="h-3.5 w-3.5" /> Share my week</button>}
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stat("Your tests", String(row.tests), row.peer_avg_tests != null ? `Others average ${row.peer_avg_tests}` : undefined)}
        {stat("Your average", row.avg_pct != null ? `${row.avg_pct}%` : "—", row.peer_avg_pct != null ? `Others average ${row.peer_avg_pct}%` : undefined)}
        {stat("Learners testing", String(row.peers), "this week, your paper")}
        {stat("Your standing", row.percentile != null ? `Top ${Math.max(1, 100 - row.percentile)}%` : "—", row.percentile != null ? "of those who tested" : "needs 10 learners")}
      </dl>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">{ahead}</p>
    </section>
  );
}
