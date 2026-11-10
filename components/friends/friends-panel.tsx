"use client";

/**
 * Friends (R29 step 1): add by username, accept or decline requests, see who is active now. Everything goes through /api/friends.
 * Polls every 30 s while the tab is visible. Presence dots: green = active in the last 2 minutes, amber = within the hour, grey = offline.
 */
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { UserPlus, Check, X, Loader2, Users, Eye, EyeOff, Swords } from "lucide-react";
import { useToastStore } from "@/store/use-toast-store";

type Presence = "active" | "away" | "offline" | "hidden";
type Person = { id: string; name: string; username: string | null; presence: Presence };
type Data = { friends: Person[]; incoming: Person[]; outgoing: Person[]; showPresence: boolean; username: string | null };

const DOT: Record<Presence, { cls: string; label: string }> = {
  active: { cls: "bg-emerald-500", label: "Active now" },
  away: { cls: "bg-amber-400", label: "Seen recently" },
  offline: { cls: "bg-slate-400", label: "Offline" },
  hidden: { cls: "bg-slate-300", label: "Status hidden" },
};
const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

async function call(payload: Record<string, unknown>): Promise<{ ok: boolean; error?: string; state?: string }> {
  try {
    const r = await fetch("/api/friends", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const j = (await r.json().catch(() => ({}))) as { error?: string; state?: string };
    return r.ok ? { ok: true, state: j.state } : { ok: false, error: j.error ?? "Something went wrong. Try again." };
  } catch { return { ok: false, error: "You look offline. Try again in a moment." }; }
}

export function FriendsPanel() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const toast = useToastStore.getState().show;

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/friends");
      if (!r.ok) throw new Error(String(r.status));
      setData((await r.json()) as Data); setError(false);
    } catch { setError(true); }
  }, []);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const t = setInterval(() => { if (document.visibilityState === "visible") void load(); }, 30_000);
    return () => clearInterval(t);
  }, [load]);

  const act = async (key: string, payload: Record<string, unknown>, ok?: string) => {
    setBusy(key);
    const res = await call(payload);
    setBusy(null);
    if (!res.ok) { toast(res.error ?? "Something went wrong.", "error"); return false; }
    if (ok) toast(ok, "success");
    void load();
    return true;
  };
  const add = async () => {
    const u = name.trim().replace(/^@/, "").toLowerCase();
    if (!u) return;
    setBusy("add");
    const res = await call({ action: "request", username: u });
    setBusy(null);
    if (!res.ok) { toast(res.error ?? "Couldn't send the request.", "error"); return; }
    setName(""); void load();
    toast(res.state === "friends" ? "You are now friends." : res.state === "already-sent" ? "Request already sent." : "Friend request sent.", "success");
  };

  const active = data?.friends.filter((f) => f.presence === "active").length ?? 0;
  return (
    <section className="card-well p-5 sm:p-6" data-tint="mint" aria-label="Friends">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 font-display text-xl font-extrabold text-[var(--text-primary)]"><Users className="h-5 w-5" /> Friends{data ? <span className="text-sm font-semibold text-[var(--text-muted)]">{data.friends.length === 1 ? "1 friend" : `${data.friends.length} friends`}{active ? ` · ${active} active now` : ""}</span> : null}</h2>
        {data ? (
          <button type="button" className="btn-soft !px-3 !py-1.5 text-xs" aria-pressed={data.showPresence} onClick={() => void act("presence", { action: "presence", show: !data.showPresence })}>
            {data.showPresence ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />} {data.showPresence ? "Friends can see when I'm online" : "My status is hidden"}
          </button>
        ) : null}
      </div>

      <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); void add(); }}>
        <label className="sr-only" htmlFor="friend-username">Friend&apos;s username</label>
        <input id="friend-username" value={name} onChange={(e) => setName(e.target.value)} placeholder="Friend's username, e.g. riya_cs" maxLength={21} autoComplete="off" autoCapitalize="none" spellCheck={false}
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-primary)]" />
        <button type="submit" disabled={busy === "add" || !name.trim()} className="btn-main !px-4 !py-2 text-sm">{busy === "add" ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Add</button>
      </form>
      {data && !data.username ? <p className="mt-2 text-xs text-[var(--text-muted)]">Pick a username in your profile so friends can find you.</p> : data ? <p className="mt-2 text-xs text-[var(--text-muted)]">Your username: <b>{data.username}</b></p> : null}

      {data === null && !error ? <p className="mt-4 text-sm text-[var(--text-secondary)]" role="status"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Loading friends…</p> : null}
      {error && !data ? <p className="mt-4 text-sm text-[var(--text-secondary)]" role="alert">Couldn&apos;t load friends right now. Try again in a moment.</p> : null}

      {data && data.incoming.length > 0 ? (
        <div className="mt-4 space-y-2" aria-label="Friend requests">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Requests for you</p>
          {data.incoming.map((p) => (
            <Row key={p.id} p={p} dot={false}>
              <button type="button" className="btn-main !px-3 !py-1.5 text-xs" disabled={busy === `a${p.id}`} onClick={() => void act(`a${p.id}`, { action: "accept", userId: p.id }, `You and ${p.name} are friends.`)}><Check className="h-3.5 w-3.5" /> Accept</button>
              <button type="button" className="btn-soft !px-3 !py-1.5 text-xs" disabled={busy === `d${p.id}`} onClick={() => void act(`d${p.id}`, { action: "decline", userId: p.id })}><X className="h-3.5 w-3.5" /> Decline</button>
            </Row>
          ))}
        </div>
      ) : null}

      {data && data.friends.length > 0 ? (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3" aria-label="Your friends">
          {data.friends.map((p) => (
            <li key={p.id}>
              <Row p={p} dot>
                <Link href={`/test-centre/build?challenge=1&to=${p.id}&name=${encodeURIComponent(p.name)}`} className="btn-main !px-3 !py-1.5 text-xs" aria-label={`Challenge ${p.name}`}><Swords className="h-3.5 w-3.5" /> Challenge</Link>
                <button type="button" className="btn-soft !px-3 !py-1.5 text-xs" disabled={busy === `r${p.id}`} onClick={() => { if (window.confirm(`Remove ${p.name} from your friends?`)) void act(`r${p.id}`, { action: "remove", userId: p.id }); }}>Remove</button>
              </Row>
            </li>
          ))}
        </ul>
      ) : data && data.incoming.length === 0 && data.outgoing.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--text-secondary)]">No friends yet. Add a friend&apos;s username above, then challenge them to a battle.</p>
      ) : null}

      {data && data.outgoing.length > 0 ? (
        <div className="mt-4 space-y-2" aria-label="Requests you sent">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Waiting for a reply</p>
          {data.outgoing.map((p) => (
            <Row key={p.id} p={p} dot={false}>
              <button type="button" className="btn-soft !px-3 !py-1.5 text-xs" disabled={busy === `c${p.id}`} onClick={() => void act(`c${p.id}`, { action: "remove", userId: p.id })}>Cancel</button>
            </Row>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function Row({ p, dot, children }: { p: Person; dot: boolean; children: React.ReactNode }) {
  const d = DOT[p.presence];
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2.5">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--tint-peri-bg,#e8e6ff)] text-xs font-extrabold text-[var(--text-primary)]" aria-hidden>
        {initials(p.name)}
        {dot ? <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface)] ${d.cls}`} /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-bold text-[var(--text-primary)]">{p.name}</span>
        <span className="block truncate text-xs text-[var(--text-muted)]">{dot ? d.label : p.username ? `@${p.username}` : ""}</span>
      </span>
      <span className="flex shrink-0 gap-1.5">{children}</span>
    </div>
  );
}
