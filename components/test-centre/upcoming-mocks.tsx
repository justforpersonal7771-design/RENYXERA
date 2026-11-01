"use client";

/** The next All-India mocks for the student's paper: when each starts (India time) and how long until it does. Fills the hub's right card. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarClock, ChevronRight } from "lucide-react";
import { getCurrentBranch } from "@/lib/branch/current";
import { serverNow } from "@/lib/time/server-time";

type Mock = { id: string; title: string; starts_at: string; ends_at: string };

const until = (ms: number) => {
  const m = Math.max(0, Math.floor(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60);
  return d >= 1 ? `in ${d} day${d > 1 ? "s" : ""}` : h >= 1 ? `in ${h} h` : m >= 1 ? `in ${m} min` : "starting now";
};

export function UpcomingMocks() {
  const [mocks, setMocks] = useState<Mock[] | null>(null);
  const [now, setNow] = useState(0);
  useEffect(() => {
    let alive = true;
    setNow(serverNow());
    (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const { data } = await createClient().from("mock_events").select("id,title,starts_at,ends_at").eq("branch_code", getCurrentBranch()).gte("ends_at", new Date(serverNow()).toISOString()).order("starts_at", { ascending: true }).limit(4);
        if (alive) setMocks((data as Mock[]) ?? []);
      } catch { if (alive) setMocks([]); }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className="card-pastel flex min-h-0 flex-1 flex-col px-4 py-3" data-tint="peri" aria-label="Upcoming mocks">
      <h2 className="flex items-center gap-2 font-display text-base font-extrabold text-[var(--text-primary)]"><CalendarClock className="h-4 w-4" aria-hidden /> Upcoming mocks</h2>
      {mocks === null ? (
        <div className="mt-2 space-y-2" aria-hidden>{[0, 1].map((i) => <span key={i} className="block h-10 rounded-xl bg-[var(--surface)]/60 motion-safe:animate-pulse" />)}</div>
      ) : mocks.length === 0 ? (
        <p className="mt-2 text-sm text-[var(--text-secondary)]">No mock is scheduled yet. A free GATE-pattern mock runs on Sundays; it will appear here as soon as it is announced.</p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {mocks.map((m) => (
            <li key={m.id}>
              <Link href="/test-centre/mocks" className="group flex items-center gap-3 rounded-xl bg-[var(--surface)]/70 px-3 py-2 transition-colors hover:bg-[var(--surface)]">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[var(--text-primary)]">{m.title}</span>
                  <span className="block text-xs text-[var(--text-secondary)]">{new Date(m.starts_at).toLocaleString("en-IN", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}{now ? ` · ${until(Date.parse(m.starts_at) - now)}` : ""}</span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
