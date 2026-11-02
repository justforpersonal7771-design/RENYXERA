"use client";

/**
 * "Challenge friends" picker for a battle the signed-in student owns (R29 step 2): tick friends, send, and they see it under
 * "Challenges for you" on their Battles screen. Friends already sent this battle are shown as "Sent".
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Send, Loader2, Check } from "lucide-react";
import { useToastStore } from "@/store/use-toast-store";

type Friend = { id: string; name: string; username: string | null; presence: "active" | "away" | "offline" | "hidden" };
const DOT = { active: "bg-emerald-500", away: "bg-amber-400", offline: "bg-slate-400", hidden: "bg-slate-300" } as const;
const LABEL = { active: "Active now", away: "Seen recently", offline: "Offline", hidden: "" } as const;

export function InviteFriends({ battleId }: { battleId: string }) {
  const [friends, setFriends] = useState<Friend[] | null>(null);
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [pick, setPick] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const [f, i] = await Promise.all([fetch("/api/friends"), fetch(`/api/battles/${battleId}/invite`)]);
      if (f.ok) setFriends(((await f.json()) as { friends: Friend[] }).friends);
      if (i.ok) setSent(new Set(((await i.json()) as { invited: string[] }).invited));
    } catch { setFriends([]); }
  }, [battleId]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const send = async () => {
    if (pick.size === 0 || busy) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/battles/${battleId}/invite`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userIds: [...pick] }) });
      const j = (await r.json().catch(() => ({}))) as { error?: string; sent?: number };
      if (!r.ok) throw new Error(j.error ?? "Couldn't send the challenge.");
      useToastStore.getState().show(`Challenge sent to ${j.sent ?? pick.size} friend${(j.sent ?? pick.size) === 1 ? "" : "s"}.`, "success");
      setPick(new Set()); void load();
    } catch (e) { useToastStore.getState().show(e instanceof Error ? e.message : "Couldn't send the challenge.", "error"); }
    setBusy(false);
  };

  if (friends === null) return <p className="mt-4 text-sm text-[var(--text-secondary)]" role="status"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Loading friends…</p>;
  if (friends.length === 0) return <p className="mt-4 text-sm text-[var(--text-secondary)]">Add friends on the <Link href="/battles" className="font-bold underline">Battles</Link> screen to challenge them here, or send them the link.</p>;
  return (
    <div className="mt-5 text-left">
      <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Challenge friends</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {friends.map((f) => {
          const done = sent.has(f.id); const on = pick.has(f.id);
          return (
            <li key={f.id}>
              <button type="button" disabled={done} aria-pressed={on}
                onClick={() => setPick((p) => { const n = new Set(p); if (n.has(f.id)) n.delete(f.id); else n.add(f.id); return n; })}
                className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left ${on ? "border-[var(--text-primary)] bg-[var(--surface)]" : "border-[var(--border)] bg-[var(--surface)]"} disabled:opacity-60`}>
                <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--surface-2,#eef)] text-xs font-extrabold text-[var(--text-primary)]" aria-hidden>
                  {f.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?"}
                  <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface)] ${DOT[f.presence]}`} />
                </span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[var(--text-primary)]">{f.name}</span><span className="block text-xs text-[var(--text-muted)]">{LABEL[f.presence] || (f.username ? `@${f.username}` : "")}</span></span>
                {done ? <span className="text-xs font-bold text-[var(--text-muted)]">Sent</span> : on ? <Check className="h-4 w-4" aria-hidden /> : null}
              </button>
            </li>
          );
        })}
      </ul>
      <button type="button" onClick={() => void send()} disabled={pick.size === 0 || busy} className="btn-main mt-3 disabled:opacity-50">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send challenge{pick.size > 0 ? ` (${pick.size})` : ""}
      </button>
    </div>
  );
}
