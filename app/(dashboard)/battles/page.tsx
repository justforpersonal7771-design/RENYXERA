"use client";

/**
 * Battles (R19): send a finished test to friends and watch them play it live. Scores are copied by the server from the
 * graded attempts (migration 0043); this screen polls every 15 s while it is open.
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Swords, Hourglass, Trophy, Link2, Loader2 } from "lucide-react";
import { PlanCompare } from "@/components/preview/plan-compare";
import { useAuthStore } from "@/store/use-auth-store";
import { useAuthModalStore } from "@/store/use-auth-modal-store";
import { useToastStore } from "@/store/use-toast-store";
import { useEntitlements } from "@/lib/billing/use-entitlements";

type Entry = { userId: string; name: string; status: "opened" | "started" | "submitted" | "abandoned"; answered: number; total: number; score: number | null; maxScore: number | null; submittedAt: string | null; lastSeenAt: string; you: boolean };
type Battle = { id: string; title: string; ownerName: string; ownerScore: number; maxScore: number; questions: number; createdAt: string; expiresAt: string; expired: boolean; mine: boolean; entries: Entry[] };

const STATUS: Record<Entry["status"], { label: string; tint: string }> = {
  opened: { label: "Opened the link", tint: "sky" }, started: { label: "Playing now", tint: "butter" }, submitted: { label: "Submitted", tint: "mint" }, abandoned: { label: "Left", tint: "rose" },
};
const pct = (s: number | null, m: number | null) => (s !== null && m ? s / m : null);
const left = (iso: string) => { const d = Math.ceil((Date.parse(iso) - Date.now()) / 86_400_000); return d <= 0 ? "Expired" : d === 1 ? "1 day left" : `${d} days left`; };
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

export default function BattlesPage() {
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => !s.loading);
  const openAuth = useAuthModalStore((s) => s.open);
  const { tier } = useEntitlements();
  const [battles, setBattles] = useState<Battle[] | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/battles");
      if (!r.ok) throw new Error(String(r.status));
      setBattles(((await r.json()) as { battles: Battle[] }).battles); setError(false);
    } catch { setError(true); }
  }, []);
  useEffect(() => {
    if (!user) return;
    void load();
    const t = setInterval(() => { if (document.visibilityState === "visible") void load(); }, 15_000);
    return () => clearInterval(t);
  }, [user, load]);

  const copy = async (id: string) => {
    try { await navigator.clipboard.writeText(`${window.location.origin}/challenge/${id}`); useToastStore.getState().show("Battle link copied. Paste it to your friend.", "success"); }
    catch { useToastStore.getState().show("Couldn't copy the link. Open the battle and copy it from the address bar.", "error"); }
  };
  const active = (battles ?? []).filter((b) => b.mine && !b.expired).length;

  return (
    <div className="space-y-6 pb-8">
      <section className="card-pastel p-6 sm:p-8" data-tint="rose" aria-label="Battles">
        <span className="section-label"><Swords className="h-3.5 w-3.5" /> Battles</span>
        <h1 className="mt-3 font-display text-3xl font-extrabold leading-[1.08] text-[var(--text-primary)] sm:text-5xl">Same questions.<br />Who scores more?</h1>
        <p className="mt-3 max-w-xl text-[var(--text-secondary)]">Finish any test, tap <b>Challenge a friend</b> on the result, and see when they open it, how far they are and who won. Scores come from the server, never the browser.</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href="/test-centre/history" className="btn-main"><Swords className="h-4 w-4" /> Pick a finished test</Link>
          <span className="text-sm text-[var(--text-muted)]">{tier === "free" ? `${Math.min(active, 3)} of 3 active battles on Free` : "Unlimited battles"}</span>
        </div>
      </section>

      {!authReady ? null : !user ? (
        <section className="card-well p-6 text-center" data-tint="butter">
          <p className="font-bold text-[var(--text-primary)]">Sign in to see your battles</p>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">Battles are tied to your account so the winner is fair.</p>
          <button type="button" onClick={() => openAuth("signup")} className="btn-main mt-4">Sign in</button>
        </section>
      ) : battles === null && !error ? (
        <p className="card-inset p-6 text-center text-sm text-[var(--text-secondary)]" role="status"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Loading your battles…</p>
      ) : error && battles === null ? (
        <p className="card-inset p-6 text-center text-sm text-[var(--text-secondary)]" role="alert">Couldn&apos;t load battles right now. Try again in a moment.</p>
      ) : battles!.length === 0 ? (
        <section className="card-well p-8 text-center" data-tint="peri">
          <Trophy className="mx-auto h-6 w-6 text-[var(--tint-peri-ink)]" />
          <p className="mt-2 font-display text-xl font-extrabold text-[var(--text-primary)]">No battles yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-[var(--text-secondary)]">Finish a test, then use <b>Challenge a friend</b> on its result. Your first battle will show up here with live progress.</p>
        </section>
      ) : (
        <div className="space-y-4">{battles!.map((b) => <BattleCard key={b.id} b={b} onCopy={() => copy(b.id)} />)}</div>
      )}

      <PlanCompare title="Battles by plan" rows={[
        ["Challenge friends with any finished test", "✓", "✓", "✓"],
        ["Active battles at a time", "3", "Unlimited", "Unlimited"],
        ["Live progress and who won", "✓", "✓", "✓"],
        ["Battle links last", "7 days", "7 days", "7 days"],
      ]} />
    </div>
  );
}

function BattleCard({ b, onCopy }: { b: Battle; onCopy: () => void }) {
  const mine = b.entries.find((e) => e.you);
  // Rows: the owner's own score first, then each friend.
  const rows: { key: string; name: string; you: boolean; status: Entry["status"]; answered: number; total: number; score: number | null; maxScore: number | null }[] = [
    { key: "owner", name: b.mine ? "You" : b.ownerName, you: b.mine, status: "submitted", answered: b.questions, total: b.questions, score: b.ownerScore, maxScore: b.maxScore },
    ...b.entries.map((e) => ({ key: e.userId, name: e.you ? "You" : e.name, you: e.you, status: e.status, answered: e.answered, total: e.total || b.questions, score: e.score, maxScore: e.maxScore })),
  ];
  const ownerPct = pct(b.ownerScore, b.maxScore)!;
  const verdict = (e: Entry) => {
    const p = pct(e.score, e.maxScore);
    if (p === null) return null;
    return p > ownerPct ? (b.mine ? `${e.name} beat you` : `You beat ${b.ownerName}`) : p === ownerPct ? "Tied" : (b.mine ? "You won" : `${b.ownerName} won`);
  };
  return (
    <section className="card-metal metal p-5 sm:p-6" aria-label={b.title}>
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-xl font-extrabold text-[var(--text-primary)]">{b.title}</h2>
        <span className="rounded-full bg-[var(--surface-secondary)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">{b.mine ? "Yours" : `From ${b.ownerName}`}</span>
        <span className="text-sm text-[var(--text-muted)]">{b.questions} questions · {b.maxScore} marks</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)]"><Hourglass className="h-4 w-4" /> {left(b.expiresAt)}</span>
      </div>
      <ul className="mt-4 space-y-3">
        {rows.map((p) => {
          const s = STATUS[p.status];
          const e = b.entries.find((x) => x.userId === p.key);
          const v = e ? verdict(e) : null;
          return (
            <li key={p.key} className="flex items-center gap-4 rounded-2xl bg-[var(--surface-secondary)] p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-sm font-bold text-[var(--background)]">{initials(p.name)}</span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2"><span className="font-bold text-[var(--text-primary)]">{p.name}</span>
                  {p.key !== "owner" && (
                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: `var(--tint-${s.tint})`, color: `var(--tint-${s.tint}-ink)` }}>
                      {p.status === "started" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current motion-reduce:animate-none" />}{s.label}</span>
                  )}
                  {v && <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--text-primary)]"><Trophy className="h-3.5 w-3.5 text-amber-500" />{v}</span>}</span>
                {p.key !== "owner" && (
                  <span className="mt-2 block h-2 overflow-hidden rounded-full bg-[var(--surface)]" role="progressbar" aria-label={`${p.name} answered`} aria-valuenow={p.answered} aria-valuemin={0} aria-valuemax={p.total}>
                    <span className="block h-full rounded-full bg-[var(--ink)] transition-[width] duration-700" style={{ width: `${Math.min(100, (p.answered / Math.max(1, p.total)) * 100)}%` }} /></span>
                )}
              </span>
              <span className="text-right"><span className="block font-num text-xl font-extrabold text-[var(--text-primary)]">{p.score ?? "–"}</span><span className="text-xs text-[var(--text-muted)]">{p.key === "owner" || p.status === "submitted" ? `of ${p.maxScore}` : `${p.answered}/${p.total}`}</span></span>
            </li>
          );
        })}
        {b.mine && b.entries.length === 0 && <li className="rounded-2xl bg-[var(--surface-secondary)] p-4 text-sm text-[var(--text-secondary)]">Nobody has opened the link yet. Send it to a friend.</li>}
      </ul>
      <div className="mt-4 flex flex-wrap gap-2">
        {b.mine && !b.expired && <button type="button" onClick={onCopy} className="pill-soft"><Link2 className="h-4 w-4" /> Copy the link</button>}
        {!b.mine && !b.expired && mine?.status !== "submitted" && <Link href={`/challenge/${b.id}`} className="pill-ink">Take the battle</Link>}
      </div>
    </section>
  );
}
