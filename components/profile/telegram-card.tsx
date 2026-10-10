"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Info, Loader2, Lock, MessageCircle, Phone, Send, Timer, Unplug, X } from "lucide-react";
import { TimePicker } from "@/components/ui/time-picker";
import { confirmDialog } from "@/components/ui/confirm-dialog";
import { useToastStore } from "@/store/use-toast-store";
import { TG_MATRIX } from "@/lib/telegram/tiers";
import type { Tier } from "@/lib/billing/plans";
import { openUpgrade } from "@/store/use-upgrade-modal-store";
import { TelegramBadge } from "@/components/growth/telegram-join";
import { TELEGRAM_CHANGED } from "@/components/growth/use-telegram-state";

type Status = {
  configured: boolean; tier: Tier; bot: string | null; channelUrl: string; groupUrl: string; linked: boolean;
  limits: { timers: number; alarms: number; blockReminders: boolean; digest: boolean; mockReminders: boolean; rollPrompt: boolean; weeklyReview: boolean };
  account: null | { username: string | null; firstName: string | null; inChannel: boolean | null; inGroup: boolean | null; prefs: Record<string, boolean>; digestTime: string; blocked: boolean };
  usage: { timers: number; alarms: number };
  phone: null | { verified: boolean; masked: string | null };
};

const toast = (m: string, k: "success" | "error" | "info" = "success") => useToastStore.getState().show(m, k);
const changed = () => window.dispatchEvent(new Event(TELEGRAM_CHANGED));
const post = async (url: string, body?: unknown) => {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body ?? {}) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Something went wrong.");
  return j;
};

/** A small "i" that explains a feature in plain words. Click or tap to open and close (works on phones too). */
function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="inline-flex flex-col">
      <button type="button" aria-label="What is this?" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="inline-grid h-5 w-5 place-items-center rounded-full text-[var(--text-muted)] hover:bg-sky-500/10 hover:text-sky-600 cursor-pointer"><Info className="h-3.5 w-3.5" aria-hidden /></button>
      {open && <span className="mt-1 max-w-xs rounded-lg bg-[var(--surface-secondary)] px-3 py-2 text-xs leading-relaxed text-[var(--text-secondary)]">{text}</span>}
    </span>
  );
}

/** Green tick, red cross, or the number itself (timers, alarms). */
function Mark({ v }: { v: string }) {
  if (v === "Yes") return <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" aria-label="Included"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>;
  if (v === "—") return <span className="inline-grid h-6 w-6 place-items-center rounded-full bg-rose-500/12 text-rose-500" aria-label="Not included"><X className="h-3.5 w-3.5" strokeWidth={3} /></span>;
  return <span className="inline-grid h-6 min-w-6 place-items-center rounded-full bg-emerald-500/15 px-1.5 text-xs font-extrabold font-num text-emerald-700 dark:text-emerald-300">{v}</span>;
}

function Membership({ v, label, href }: { v: boolean | null; label: string; href: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-[var(--surface-secondary)]/60 px-3 py-2.5 text-sm">
      <span className={`inline-grid h-6 w-6 shrink-0 place-items-center rounded-full ${v === true ? "bg-emerald-500/15 text-emerald-600" : v === false ? "bg-rose-500/12 text-rose-500" : "bg-amber-500/15 text-amber-600"}`}>{v === true ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : v === false ? <X className="h-3.5 w-3.5" strokeWidth={3} /> : <Info className="h-3.5 w-3.5" />}</span>
      <span className="min-w-0 flex-1"><span className="block font-semibold text-[var(--text-primary)]">{label}</span><span className="block text-xs text-[var(--text-muted)]">{v === true ? "You've joined" : v === false ? "Not joined yet" : "Couldn't check yet. Make sure you've pressed Start in Telegram."}</span></span>
      {v === false && <a href={href} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-bold text-white">Join</a>}
    </li>
  );
}

const STEPS = [
  { t: "Press “Link Telegram”", d: "It opens the RENYXERA bot in Telegram." },
  { t: "Press Start there", d: "That connects the bot to your account. It takes a second." },
  { t: "Done", d: "Pick which messages you want. You can unlink any time." },
];

/** Profile → Telegram: link the account, see channel and group membership, choose alerts, and compare what each plan includes. */
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
      if (j.linked) { await load(); setLinking(false); return; }
      window.open(j.url, "_blank", "noopener,noreferrer");
      toast("Press Start in Telegram, then come back here.", "info");
      let tries = 0;
      poll.current = setInterval(async () => {
        const st = await load();
        if (st?.linked || ++tries > 60) { if (poll.current) clearInterval(poll.current); setLinking(false); if (st?.linked) { toast("Telegram linked ✅"); changed(); } }
      }, 3000);
    } catch (e) { toast((e as Error).message, "error"); setLinking(false); }
  };

  const act = async (key: string, fn: () => Promise<unknown>, ok?: string, notify = false) => {
    setBusy(key);
    try { await fn(); if (ok) toast(ok); await load(); if (notify) changed(); } catch (e) { toast((e as Error).message, "error"); } finally { setBusy(null); }
  };

  if (error) return <p className="text-sm text-rose-500">{error}</p>;
  if (!s) return <p className="flex items-center gap-2 text-sm text-[var(--text-muted)]"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</p>;
  if (!s.configured) return <p className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--text-secondary)]">Telegram reminders aren&apos;t switched on yet. They&apos;re coming soon.</p>;

  const a = s.account;
  const col = s.tier;
  const pref = (key: string, label: string, info: string, allowed: boolean, needs: string) => (
    <div className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm ${allowed ? "hover:bg-[var(--surface-secondary)]/60" : "opacity-70"}`}>
      <input id={`pref-${key}`} type="checkbox" disabled={!allowed || busy === key} checked={allowed && a?.prefs[key] !== false} onChange={(e) => void act(key, () => post("/api/telegram/prefs", { prefs: { [key]: e.target.checked } }))} className="mt-0.5 h-4 w-4 shrink-0 accent-violet-600" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5"><label htmlFor={`pref-${key}`} className={`text-[var(--text-primary)] ${allowed ? "cursor-pointer" : ""}`}>{label}</label><InfoTip text={info} />
          {!allowed && <button type="button" onClick={() => openUpgrade(`${label} is a ${needs} feature`)} className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 cursor-pointer"><Lock className="h-3 w-3" aria-hidden />{needs}</button>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Top: link / status on the left, how it works or channel status on the right, using the full width */}
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-sky-500/25 bg-gradient-to-br from-sky-500/10 to-transparent p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <TelegramBadge size="lg" />
            <div className="min-w-0">
              {!s.linked ? (
                <>
                  <h3 className="text-lg font-extrabold text-[var(--text-primary)]">Get reminders and alerts on Telegram</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">Your study tasks, timers and alarms arrive as messages, so you never have to keep the app open.</p>
                </>
              ) : (
                <>
                  <h3 className="flex flex-wrap items-center gap-2 text-lg font-extrabold text-[var(--text-primary)]"><span className="inline-grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-600"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span> Linked{a?.username ? ` as @${a.username}` : a?.firstName ? ` as ${a.firstName}` : ""}</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">{a?.blocked ? "You blocked the bot in Telegram. Unblock it, then press “Send a test message”." : "Messages will arrive in your chat with the RENYXERA bot."}</p>
                </>
              )}
            </div>
          </div>
          {!s.linked ? (
            <>
              <button type="button" onClick={link} disabled={linking} className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 disabled:opacity-70 cursor-pointer">
                {linking ? <><Loader2 className="h-4 w-4 animate-spin" /> Waiting for Telegram…</> : <><Send className="h-4 w-4" /> Link Telegram</>}
              </button>
              {linking && <p className="mt-2 text-xs text-[var(--text-muted)]">Didn&apos;t open? Search for @{s.bot} in Telegram and send /start.</p>}
            </>
          ) : (
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" disabled={busy === "test"} onClick={() => void act("test", () => post("/api/telegram/test"), "Test message sent")} className="h-9 rounded-lg border border-[var(--border)] px-3 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">Send a test message</button>
              <button type="button" disabled={busy === "check"} onClick={() => void act("check", () => post("/api/telegram/check"), "Checked again", true)} className="h-9 rounded-lg border border-[var(--border)] px-3 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">Check my channel &amp; group</button>
              <button type="button" disabled={busy === "unlink"} onClick={async () => { if (await confirmDialog({ title: "Unlink Telegram?", message: "Reminders waiting to be sent will be cancelled. You can link again any time.", confirmLabel: "Unlink", cancelLabel: "Keep it", tone: "warning" })) void act("unlink", () => post("/api/telegram/unlink"), "Unlinked", true); }} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-500/40 px-3 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 cursor-pointer"><Unplug className="h-3.5 w-3.5" /> Unlink</button>
            </div>
          )}
        </section>

        {!s.linked ? (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">How it works</h3>
            <ol className="mt-3 space-y-3">
              {STEPS.map((st, i) => (
                <li key={st.t} className="flex items-start gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sky-500/15 text-xs font-black text-sky-700 dark:text-sky-300">{i + 1}</span><span><span className="block text-sm font-bold text-[var(--text-primary)]">{st.t}</span><span className="block text-xs text-[var(--text-secondary)]">{st.d}</span></span></li>
              ))}
            </ol>
          </section>
        ) : (
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">Our channel and group</h3>
            <ul className="mt-3 space-y-2"><Membership v={a?.inChannel ?? null} label="Daily question channel" href={s.channelUrl} /><Membership v={a?.inGroup ?? null} label="Student discussion group" href={s.groupUrl} /></ul>
            {a?.inChannel === true && a?.inGroup === true && <p className="mt-3 text-xs text-[var(--text-muted)]">You&apos;re in both, so we won&apos;t ask you to join again.</p>}
          </section>
        )}
      </div>

      {s.linked && s.phone && (
        <section className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${s.phone.verified ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"}`}>{s.phone.verified ? <Check className="h-5 w-5" strokeWidth={3} /> : <Phone className="h-5 w-5" />}</span>
          <div className="min-w-0 flex-1 basis-60">
            <h3 className="flex flex-wrap items-center gap-1.5 text-base font-extrabold text-[var(--text-primary)]">{s.phone.verified ? `Mobile number verified: ${s.phone.masked}` : "Verify your mobile number"}<InfoTip text="Share your number once through Telegram. This proves the number is yours, then it is locked to your account so nobody else can use it. It is never shown to other students." /></h3>
            <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{s.phone.verified ? "It is locked to your account and can't be changed." : "Takes one tap: open the bot, press “Share my number”. Telegram sends only your own number."}</p>
          </div>
          {!s.phone.verified && (
            <button type="button" disabled={busy === "verify"} onClick={async () => { setBusy("verify"); window.open(`https://t.me/${s.bot}?start=verify`, "_blank", "noopener,noreferrer"); toast("Tap “Share my number” in Telegram, then come back.", "info"); let n = 0; const t = setInterval(async () => { const st = await load(); if (st?.phone?.verified || ++n > 40) { clearInterval(t); setBusy(null); if (st?.phone?.verified) toast("Mobile number verified ✅"); } }, 3000); }} className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-sky-500/25 disabled:opacity-70 cursor-pointer">{busy === "verify" ? <><Loader2 className="h-4 w-4 animate-spin" /> Waiting…</> : <><Phone className="h-4 w-4" /> Verify on Telegram</>}</button>
          )}
        </section>
      )}

      {s.linked && a && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <h3 className="text-base font-extrabold text-[var(--text-primary)]">Which messages do you want?</h3>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">Tap the <Info className="inline h-3 w-3 align-[-1px]" aria-hidden /> to see what each one does.</p>
            <div className="mt-2 divide-y divide-[var(--border-subtle)]">
              {pref("blocks", "A nudge before each study task", "Your study plan puts tasks in the calendar. The bot messages you 10 minutes before each one, with buttons: Done, or remind me again in 15 minutes.", s.limits.blockReminders, "Plus")}
              {pref("digest", "Morning list of today's tasks", "At the time you choose below, the bot sends everything planned for today in one message.", s.limits.digest, "Plus")}
              {pref("alarms", "My daily alarms", "Alarms you set with /alarm 06:00. They message you at that time every day.", s.limits.alarms > 0, "Plus")}
              {pref("mocks", "Warning before a mock starts", "About 30 minutes before an All-India mock begins, so you don't miss the entry time.", s.limits.mockReminders, "Plus")}
              {pref("billing", "Warning before my plan ends", "3 days and 1 day before your Plus or Pro ends, so it never runs out by surprise.", true, "")}
              {pref("roll", "Evening check on unfinished tasks", "Each night the bot asks about tasks you didn't finish. Move them to tomorrow, or leave them. It never moves anything without your tap.", s.limits.rollPrompt, "Pro")}
              {pref("weekly", "Weekly report", "On Sunday evening: how many tasks you finished this week, and one tip for next week.", s.limits.weeklyReview, "Pro")}
            </div>
            {s.limits.digest && (
              <div className="mt-3 flex items-center gap-3 px-3 text-sm"><span className="text-[var(--text-secondary)]">Morning list arrives at (India time)</span>
                <TimePicker value={a.digestTime} onChange={(v) => void act("digestTime", () => post("/api/telegram/prefs", { digestTime: v }), "Time saved")} step={15} className="w-32" /></div>
            )}
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
            <h3 className="inline-flex items-center gap-2 text-base font-extrabold text-[var(--text-primary)]"><Timer className="h-4 w-4 text-violet-500" aria-hidden /> Start a timer</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Pick a time. The bot messages you when it ends. You can also message the bot: <code className="rounded bg-[var(--surface-secondary)] px-1">/timer 25</code>{s.limits.alarms > 0 ? <> for a timer, or <code className="rounded bg-[var(--surface-secondary)] px-1">/alarm 06:00</code> for a daily alarm</> : null}.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[25, 45, 60].map((m) => (
                <button key={m} type="button" disabled={busy === `t${m}`} onClick={() => void act(`t${m}`, () => post("/api/telegram/reminders", { kind: "timer", items: [{ remindAt: new Date(Date.now() + m * 60_000).toISOString(), title: `Timer finished: ${m} min` }] }), `Timer set for ${m} minutes`)} className="h-10 rounded-xl border border-[var(--border)] px-5 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] cursor-pointer">{m} min</button>
              ))}
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">Running now: {s.usage.timers} of {s.limits.timers} timer{s.limits.timers === 1 ? "" : "s"}{s.limits.alarms > 0 ? `, ${s.usage.alarms} of ${s.limits.alarms} alarms` : ""}.</p>
            <a href={s.groupUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-sky-600 dark:text-sky-400 hover:underline"><MessageCircle className="h-4 w-4" aria-hidden /> Chat with other students in the group</a>
          </section>
        </div>
      )}

      {/* Plan comparison: a table on wide screens, one small card per feature on phones (no sideways scrolling) */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
        <h3 className="text-base font-extrabold text-[var(--text-primary)]">What each plan gives you</h3>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">Green tick = included · red cross = not included · numbers = how many you can have.</p>

        <div className="mt-4 hidden md:block">
          <div className="grid grid-cols-[minmax(0,1fr)_6rem_6rem_6rem] items-center gap-x-2 border-b border-[var(--border)] pb-2 text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">
            <span>Feature</span>{(["free", "plus", "pro"] as const).map((k) => <span key={k} className={`text-center ${col === k ? "text-violet-600 dark:text-violet-400" : ""}`}>{k === "free" ? "Free" : k === "plus" ? "Plus" : "Pro"}{col === k ? " · you" : ""}</span>)}
          </div>
          <ul className="divide-y divide-[var(--border-subtle)]">
            {TG_MATRIX.map((r) => (
              <li key={r.label} className="grid grid-cols-[minmax(0,1fr)_6rem_6rem_6rem] items-start gap-x-2 py-2.5">
                <span className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--text-primary)]">{r.label}<InfoTip text={r.info} /></span>
                {(["free", "plus", "pro"] as const).map((k) => <span key={k} className={`flex justify-center rounded-lg py-0.5 ${col === k ? "bg-violet-500/5" : ""}`}><Mark v={r[k]} /></span>)}
              </li>
            ))}
          </ul>
        </div>

        <ul className="mt-4 space-y-3 md:hidden">
          {TG_MATRIX.map((r) => (
            <li key={r.label} className="rounded-xl border border-[var(--border-subtle)] p-3">
              <p className="text-sm font-bold text-[var(--text-primary)]">{r.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[var(--text-secondary)]">{r.info}</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["free", "plus", "pro"] as const).map((k) => (
                  <span key={k} className={`flex flex-col items-center gap-1 rounded-lg py-1.5 ${col === k ? "bg-violet-500/10" : "bg-[var(--surface-secondary)]/60"}`}>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)]">{k === "free" ? "Free" : k === "plus" ? "Plus" : "Pro"}</span><Mark v={r[k]} />
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
        {s.tier !== "pro" && <button type="button" onClick={() => openUpgrade("More from Telegram with a paid plan")} className="mt-4 inline-flex h-10 cursor-pointer items-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white">{s.tier === "free" ? "Unlock reminders with Plus or Pro" : "Add the evening check and weekly report with Pro"}</button>}
      </section>
    </div>
  );
}
