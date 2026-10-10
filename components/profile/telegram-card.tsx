"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, CheckCircle2, Loader2, Lock, Send, Timer, Unplug } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/store/use-toast-store";
import { TG_MATRIX } from "@/lib/telegram/tiers";
import type { Tier } from "@/lib/billing/plans";
import Link from "next/link";

type Status = {
  configured: boolean; tier: Tier; bot: string | null; channelUrl: string; groupUrl: string; linked: boolean;
  limits: { timers: number; alarms: number; blockReminders: boolean; digest: boolean; mockReminders: boolean; rollPrompt: boolean; weeklyReview: boolean };
  account: null | { username: string | null; firstName: string | null; inChannel: boolean | null; inGroup: boolean | null; prefs: Record<string, boolean>; digestTime: string; blocked: boolean };
  usage: { timers: number; alarms: number };
};

const toast = (m: string, k: "success" | "error" | "info" = "success") => useToastStore.getState().show(m, k);
const post = async (url: string, body?: unknown) => {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Something went wrong.");
  return j;
};

function Joined({ v, label, href }: { v: boolean | null; label: string; href: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-[var(--surface-secondary)]/60 px-3 py-2.5 text-sm">
      {v === true ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" aria-hidden /> : v === false ? <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" aria-hidden /> : <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" aria-hidden />}
      <span className="min-w-0 flex-1"><span className="block font-semibold text-[var(--text-primary)]">{label}</span><span className="block text-xs text-[var(--text-muted)]">{v === true ? "You're in" : v === false ? "Not joined yet" : "Couldn't verify yet — the bot may still be getting access"}</span></span>
      {v !== true && <a href={href} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-bold text-white">Join</a>}
    </li>
  );
}

/** Profile → Telegram: link the account, see channel and group membership, choose alerts, and see what each plan includes. */
export function TelegramCard() {
  const [s, setS] = useState<Status | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const poll = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try { const r = await fetch("/api/telegram/status", { cache: "no-store" }); const j = await r.json(); if (!r.ok) throw new Error(j.error); setS(j); setError(null); return j as Status; }
    catch (e) { setError((e as Error).message || "Couldn't load Telegram settings."); return null; }
  }, []);
  useEffect(() => { void load(); return () => { if (poll.current) clearInterval(poll.current); }; }, [load]);

  const link = async () => {
    setLinking(true);
    try {
      const j = await post("/api/telegram/link");
      if (j.linked) { await load(); return; }
      window.open(j.url, "_blank", "noopener,noreferrer");
      toast("Press Start in Telegram, then come back here.", "info");
      let tries = 0;
      poll.current = setInterval(async () => {
        const st = await load();
        if (st?.linked || ++tries > 60) { if (poll.current) clearInterval(poll.current); setLinking(false); if (st?.linked) toast("Telegram linked ✅"); }
      }, 3000);
    } catch (e) { toast((e as Error).message, "error"); setLinking(false); }
  };

  const act = async (key: string, fn: () => Promise<unknown>, ok?: string) => {
    setBusy(key);
    try { await fn(); if (ok) toast(ok); await load(); } catch (e) { toast((e as Error).message, "error"); } finally { setBusy(null); }
  };

  if (error) return <p className="text-sm text-rose-500">{error}</p>;
  if (!s) return <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>;
  if (!s.configured) return <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--text-secondary)]">Telegram reminders aren&apos;t switched on yet. They&apos;re coming soon.</p>;

  const a = s.account;
  const col = s.tier === "pro" ? "pro" : s.tier === "plus" ? "plus" : "free";
  const pref = (key: string, label: string, allowed: boolean, needs: string) => (
    <label className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${allowed ? "cursor-pointer hover:bg-[var(--surface-secondary)]/60" : "opacity-60"}`}>
      <input type="checkbox" disabled={!allowed || busy === key} checked={allowed && a?.prefs[key] !== false} onChange={(e) => void act(key, () => post("/api/telegram/prefs", { prefs: { [key]: e.target.checked } }))} className="h-4 w-4 accent-violet-600" />
      <span className="min-w-0 flex-1 text-[var(--text-primary)]">{label}</span>
      {!allowed && <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300"><Lock className="h-3 w-3" aria-hidden />{needs}</span>}
    </label>
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 to-transparent p-5">
        <p className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-sky-600 dark:text-sky-400"><Send className="h-3.5 w-3.5" aria-hidden /> Telegram</p>
        {!s.linked ? (
          <>
            <h3 className="mt-1 text-lg font-extrabold text-[var(--text-primary)]">Get reminders, timers and alerts on Telegram</h3>
            <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">Link your account in two taps: press the button, then Start in Telegram. We&apos;ll also check you&apos;ve joined the daily-question channel and the discussion group.</p>
            <button type="button" onClick={link} disabled={linking} className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 disabled:opacity-70 cursor-pointer">
              {linking ? <><Loader2 className="h-4 w-4 animate-spin" /> Waiting for Telegram…</> : <><Send className="h-4 w-4" /> Link Telegram</>}
            </button>
            {linking && <p className="mt-2 text-xs text-[var(--text-muted)]">Didn&apos;t open? Search for @{s.bot} in Telegram and send /start.</p>}
          </>
        ) : (
          <>
            <h3 className="mt-1 flex items-center gap-2 text-lg font-extrabold text-[var(--text-primary)]"><Check className="h-5 w-5 text-emerald-500" aria-hidden /> Linked{a?.username ? ` as @${a.username}` : a?.firstName ? ` as ${a.firstName}` : ""}</h3>
            {a?.blocked && <p className="mt-1 text-sm font-semibold text-rose-500">You blocked the bot in Telegram. Unblock it and press “Send a test message”.</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" disabled={busy === "test"} onClick={() => void act("test", () => post("/api/telegram/test"), "Test message sent")} className="h-9 rounded-lg border border-[var(--border)] px-3 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">Send a test message</button>
              <button type="button" disabled={busy === "check"} onClick={() => void act("check", () => post("/api/telegram/check"), "Membership re-checked")} className="h-9 rounded-lg border border-[var(--border)] px-3 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">Check channel &amp; group again</button>
              <button type="button" disabled={busy === "unlink"} onClick={async () => { if (await confirmDialog({ title: "Unlink Telegram?", message: "Reminders waiting to be sent will be cancelled. You can link again any time.", confirmLabel: "Unlink", cancelLabel: "Keep it", tone: "warning" })) void act("unlink", () => post("/api/telegram/unlink"), "Unlinked"); }} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-500/40 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"><Unplug className="h-3.5 w-3.5" /> Unlink</button>
            </div>
          </>
        )}
      </section>

      {s.linked && a && (
        <>
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">Channel &amp; group</h3>
            <ul className="mt-3 space-y-2"><Joined v={a.inChannel} label="Daily question channel" href={s.channelUrl} /><Joined v={a.inGroup} label="Discussion group" href={s.groupUrl} /></ul>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">What to send me</h3>
            <div className="mt-2 divide-y divide-[var(--border-subtle)]">
              {pref("blocks", "A reminder before each Study Planner block", s.limits.blockReminders, "Plus")}
              {pref("digest", "Morning digest of today's blocks", s.limits.digest, "Plus")}
              {pref("alarms", "My daily alarms", s.limits.alarms > 0, "Plus")}
              {pref("mocks", "Mock starting soon", s.limits.mockReminders, "Plus")}
              {pref("billing", "Plan-ending alerts", true, "")}
              {pref("roll", "Evening “roll unfinished blocks forward?”", s.limits.rollPrompt, "Pro")}
              {pref("weekly", "Weekly review", s.limits.weeklyReview, "Pro")}
            </div>
            {s.limits.digest && (
              <div className="mt-3 flex items-center gap-3 px-3 text-sm"><span className="text-[var(--text-secondary)]">Digest time (IST)</span>
                <TimePicker value={a.digestTime} onChange={(v) => void act("digestTime", () => post("/api/telegram/prefs", { digestTime: v }), "Digest time saved")} step={15} className="w-32" /></div>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="inline-flex items-center gap-2 text-base font-extrabold text-[var(--text-primary)]"><Timer className="h-4 w-4 text-violet-500" aria-hidden /> Quick timer</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">I&apos;ll message you when it ends. In Telegram you can also send <code className="rounded bg-[var(--surface-secondary)] px-1">/timer 25</code>{s.limits.alarms > 0 ? <> or <code className="rounded bg-[var(--surface-secondary)] px-1">/alarm 06:00</code></> : null}. Active: {s.usage.timers}/{s.limits.timers} timers{s.limits.alarms > 0 ? `, ${s.usage.alarms}/${s.limits.alarms} alarms` : ""}.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[25, 45, 60].map((m) => (
                <button key={m} type="button" disabled={busy === `t${m}`} onClick={() => void act(`t${m}`, () => post("/api/telegram/reminders", { kind: "timer", items: [{ remindAt: new Date(Date.now() + m * 60_000).toISOString(), title: `Timer finished: ${m} min` }] }), `Timer set for ${m} minutes`)} className="h-9 rounded-lg border border-[var(--border)] px-4 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">{m} min</button>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h3 className="text-base font-extrabold text-[var(--text-primary)]">What each plan includes</h3>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead><tr className="text-left text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]"><th className="py-2 pr-3">Feature</th>{(["free", "plus", "pro"] as const).map((k) => <th key={k} className={`px-2 py-2 text-center ${col === k ? "text-violet-600 dark:text-violet-400" : ""}`}>{k === "free" ? "Free" : k === "plus" ? "Plus" : "Pro"}{col === k ? " · you" : ""}</th>)}</tr></thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {TG_MATRIX.map((r) => (
                <tr key={r.label}><td className="py-2 pr-3 text-[var(--text-primary)]">{r.label}</td>{(["free", "plus", "pro"] as const).map((k) => <td key={k} className={`px-2 py-2 text-center font-num ${r[k] === "—" ? "text-[var(--text-muted)]" : "font-semibold text-[var(--text-primary)]"} ${col === k ? "bg-violet-500/5" : ""}`}>{r[k]}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        {s.tier !== "pro" && <Link href="/pro" className="mt-4 inline-flex h-9 items-center rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-xs font-bold text-white">{s.tier === "free" ? "Unlock reminders with Plus or Pro" : "Add the evening prompt and weekly review with Pro"}</Link>}
      </section>
    </div>
  );
}
