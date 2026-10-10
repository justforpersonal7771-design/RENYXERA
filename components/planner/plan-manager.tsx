"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Check, Loader2, Send, Trash2 } from "lucide-react";
import { useCalendarStore } from "@/store/use-calendar-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";
import { useToastStore } from "@/store/use-toast-store";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { DayOverridesEditor } from "@/components/planner/availability-editor";
import { buildSchedule, type Availability } from "@/lib/planner/generate";
import { PLAN_EVENT_PREFIX, forgetPlanSet, loadPlanOptions, loadPlanSets, planStampOf, rememberPlanSet, savePlanOptions, scheduleTelegramBlocks, toCalendarEvents } from "@/lib/planner/apply";
import { serverDate } from "@/lib/time/server-time";
import { toLocalDateStr } from "@/lib/utils";
import { openUpgrade } from "@/store/use-upgrade-modal-store";

/** Telegram state at a glance: Active / Linked but paused / Not linked. */
export function TelegramStatusChip() {
  const [s, setS] = useState<null | { linked: boolean; blocked: boolean; tier: string; reminders: boolean }>(null);
  useEffect(() => {
    void fetch("/api/telegram/status", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)).then((j) => j && setS({ linked: !!j.linked, blocked: !!j.account?.blocked, tier: j.tier, reminders: !!j.limits?.blockReminders })).catch(() => null);
  }, []);
  if (!s) return null;
  const active = s.linked && !s.blocked;
  return (
    <Link href="/profile#telegram" className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition hover:-translate-y-px ${active ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)]"}`}>
      <Send className="h-3.5 w-3.5" aria-hidden />
      {active ? <>Telegram active{s.reminders ? " · reminders on" : " · reminders need Plus"}</> : s.linked ? "Telegram paused: bot blocked" : "Telegram not linked · link it"}
      <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} aria-hidden />
    </Link>
  );
}

const addDay = (d: string, n: number) => { const t = new Date(`${d}T00:00:00Z`); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); };

/**
 * "My plans": every plan added from the study-plan tool is a set you can see, check progress on, and remove, plus a
 * way to change any single day (today, tomorrow, a date) when your availability is different. Plus and Pro.
 */
export function PlanManager() {
  const ent = useEntitlements();
  const { events, loaded, loadEvents, deleteEvent, addEvents } = useCalendarStore();
  const [busy, setBusy] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Availability["overrides"]>({});
  const [hasOptions, setHasOptions] = useState(false);
  const [sets, setSets] = useState<ReturnType<typeof loadPlanSets>>({});
  useEffect(() => { void loadEvents(); const o = loadPlanOptions(); setHasOptions(!!o); setOverrides(o?.availability.overrides ?? {}); setSets(loadPlanSets()); }, [loadEvents]);

  const today = toLocalDateStr(serverDate());
  const groups = useMemo(() => {
    const by = new Map<string, typeof events>();
    for (const e of events) { const k = e.id.startsWith(PLAN_EVENT_PREFIX) ? planStampOf(e.id) : null; if (k) by.set(k, [...(by.get(k) ?? []), e]); }
    return [...by.entries()].map(([stamp, evs]) => {
      const dates = evs.map((e) => e.date).sort();
      const created = new Date(parseInt(stamp, 36));
      return { stamp, evs, total: evs.length, done: evs.filter((e) => e.completed).length, from: dates[0], to: dates[dates.length - 1], name: sets[stamp]?.name ?? `Plan from ${Number.isNaN(created.getTime()) ? dates[0] : toLocalDateStr(created)}` };
    }).sort((a, b) => b.stamp.localeCompare(a.stamp));
  }, [events, sets]);

  const toast = (m: string, k: "success" | "error" = "success") => useToastStore.getState().show(m, k);
  const remove = async (stamp: string, onlyUnfinished: boolean) => {
    const g = groups.find((x) => x.stamp === stamp)!;
    const targets = g.evs.filter((e) => !onlyUnfinished || !e.completed);
    if (!(await confirmDialog({ title: onlyUnfinished ? "Remove the unfinished blocks?" : "Remove this whole plan?", message: onlyUnfinished ? `${targets.length} block${targets.length === 1 ? "" : "s"} not yet done will be removed, along with their Telegram reminders. Finished ones stay as your record.` : `All ${targets.length} blocks, including finished ones, will be removed, along with their Telegram reminders.`, confirmLabel: "Remove", cancelLabel: "Keep", tone: "warning" }))) return;
    setBusy(stamp);
    try {
      for (const e of targets) await deleteEvent(e.id);
      if (!onlyUnfinished || targets.length === g.total) { forgetPlanSet(stamp); setSets(loadPlanSets()); }
      toast(`${targets.length} block${targets.length === 1 ? "" : "s"} removed`);
    } finally { setBusy(null); }
  };

  const applyDays = async () => {
    const o = loadPlanOptions();
    if (!o) return;
    setBusy("days");
    try {
      const next = { ...o, start: today, availability: { ...o.availability, overrides } };
      const fresh = buildSchedule(next);
      if (fresh.events.length === 0) { toast("There is no free time left before the exam with those times.", "error"); return; }
      for (const e of events) if (e.id.startsWith(PLAN_EVENT_PREFIX) && !e.completed) await deleteEvent(e.id);
      const stamp = Date.now().toString(36);
      const made = toCalendarEvents(fresh.events, stamp);
      await addEvents(made);
      savePlanOptions(next);
      rememberPlanSet(stamp, { name: `Re-planned on ${today}`, createdAt: new Date().toISOString(), branchLabel: sets[groups[0]?.stamp]?.branchLabel ?? "", examDate: o.examDate });
      setSets(loadPlanSets());
      void scheduleTelegramBlocks(made);
      toast(`Your plan now follows your changed days: ${made.length} blocks from today`);
    } finally { setBusy(null); }
  };

  if (!ent.paid) {
    return (
      <section className="rounded-3xl border border-violet-500/30 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 p-5 sm:p-6">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-violet-600 dark:text-violet-400"><CalendarClock className="h-3.5 w-3.5" aria-hidden /> My plans · Plus &amp; Pro</p>
        <h2 className="mt-1 font-extrabold text-[var(--text-primary)]">Let the planner fill your calendar and keep it up to date</h2>
        <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">Tell us when you&apos;re free (as many times a day as you like), and we place every study block for you. Change any day later, and remove a whole plan in one tap.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/tools/gate-study-plan" className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm font-bold text-[var(--text-primary)]">Make a free plan</Link>
          <button type="button" onClick={() => openUpgrade("Automatic scheduling is a Plus and Pro feature")} className="inline-flex h-10 cursor-pointer items-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-bold text-white">See Plus &amp; Pro</button>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-extrabold text-[var(--text-primary)]">My plans</h2>
          <Link href="/tools/gate-study-plan" className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline">New plan →</Link>
        </div>
        {!loaded ? <p className="mt-3 flex items-center gap-2 text-sm text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>
          : groups.length === 0 ? <p className="mt-3 text-sm text-[var(--text-secondary)]">No automatic plan yet. Make one in the study-plan tool and it will appear here, ready to manage.</p> : (
          <ul className="mt-3 space-y-3">
            {groups.map((g) => {
              const pct = Math.round((g.done / g.total) * 100);
              return (
                <li key={g.stamp} className="rounded-2xl border border-[var(--border-subtle)] p-3.5">
                  <p className="text-sm font-extrabold text-[var(--text-primary)]">{g.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{g.from} to {g.to} · {g.total} blocks · {g.done} done ({pct}%)</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-secondary)]"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style={{ width: `${pct}%` }} /></div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={busy === g.stamp || g.done === g.total} onClick={() => remove(g.stamp, true)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] disabled:opacity-50 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /> Remove unfinished</button>
                    <button type="button" disabled={busy === g.stamp} onClick={() => remove(g.stamp, false)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-500/40 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /> Remove whole plan</button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h2 className="font-extrabold text-[var(--text-primary)]">Change a day</h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Free only in the evening today? Away tomorrow? Tell us, and the rest of your plan is re-fitted around it.</p>
        {!hasOptions ? <p className="mt-3 text-sm text-[var(--text-secondary)]">Make a plan first, then you can change days here.</p> : (
          <>
            <div className="mt-3 flex flex-wrap gap-2">
              {[["Today", today], ["Tomorrow", addDay(today, 1)]].map(([label, d]) => (
                <button key={label} type="button" onClick={() => setOverrides((o) => (d in o ? o : { ...o, [d]: [{ start: "18:00", end: "20:00" }] }))} className="h-8 rounded-full border border-[var(--border)] px-3 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">Set {label.toLowerCase()}</button>
              ))}
            </div>
            <div className="mt-3"><DayOverridesEditor value={overrides} onChange={setOverrides} min={today} /></div>
            <button type="button" onClick={applyDays} disabled={busy === "days"} className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white disabled:opacity-60 cursor-pointer">{busy === "days" ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : <><Check className="h-4 w-4" /> Update my plan</>}</button>
            <p className="mt-2 text-xs text-[var(--text-muted)]">This replaces the blocks you haven&apos;t done yet. Finished blocks stay.</p>
          </>
        )}
      </section>
    </div>
  );
}
