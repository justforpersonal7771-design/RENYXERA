"use client";

/**
 * Live battle lobby (R29 step 4): everyone presses Ready; when the owner and one friend are ready the server fixes the start a few seconds
 * ahead and every screen counts down to it, then calls onStart() once. The countdown uses the server's clock (serverNow), not the phone's.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Check, Radio, Zap } from "lucide-react";
import { useToastStore } from "@/store/use-toast-store";

type Player = { id: string; name: string; ready: boolean; owner: boolean; you: boolean };
type Lobby = { mode: "async" | "live"; liveStartAt: string | null; serverNow: string; expired: boolean; ownerFinished: boolean; players: Player[] };

async function post(id: string, payload: Record<string, unknown>): Promise<string | null> {
  try {
    const r = await fetch(`/api/battles/${id}/lobby`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (r.ok) return null;
    return ((await r.json().catch(() => ({}))) as { error?: string }).error ?? "Something went wrong.";
  } catch { return "You look offline. Try again in a moment."; }
}

/** Owner-only button that turns a "play when you like" challenge into a live one. */
export function MakeLiveButton({ battleId }: { battleId: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button type="button" disabled={busy} className="btn-soft mt-3 inline-flex" onClick={async () => {
      setBusy(true);
      const err = await post(battleId, { action: "mode", live: true });
      if (err) { useToastStore.getState().show(err, "error"); setBusy(false); } else window.location.reload();
    }}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Radio className="h-4 w-4" />} Play live together instead
    </button>
  );
}

export function LiveLobby({ battleId, isOwner, canPlay, onStart }: { battleId: string; isOwner: boolean; canPlay: boolean; onStart: () => void }) {
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [offset, setOffset] = useState(0); // server clock minus phone clock
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const fired = useRef(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/battles/${battleId}/lobby`);
      if (!r.ok) return;
      const j = (await r.json()) as Lobby;
      setOffset(Date.parse(j.serverNow) - Date.now()); setLobby(j);
    } catch { /* keep the last state; the next poll tries again */ }
  }, [battleId]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    const t = setInterval(() => { if (document.visibilityState === "visible") void load(); }, 2000);
    return () => clearInterval(t);
  }, [load]);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t); }, []);

  const target = lobby?.liveStartAt ? Date.parse(lobby.liveStartAt) : null;
  const left = target === null ? null : Math.ceil((target - (now + offset)) / 1000);
  useEffect(() => {
    if (left !== null && left <= 0 && canPlay && !fired.current) { fired.current = true; onStart(); }
  }, [left, canPlay, onStart]);

  const act = async (payload: Record<string, unknown>, then?: () => void) => {
    setBusy(true);
    const err = await post(battleId, payload);
    if (err) useToastStore.getState().show(err, "error"); else then?.();
    await load(); setBusy(false);
  };

  if (!lobby) return <p className="mt-4 text-sm text-[var(--text-secondary)]" role="status"><Loader2 className="mr-2 inline h-4 w-4 animate-spin" />Opening the lobby…</p>;
  const me = lobby.players.find((p) => p.you);
  const others = lobby.players.filter((p) => !p.you);
  const waitingOn = lobby.players.filter((p) => !p.ready).map((p) => (p.you ? "you" : p.name));
  return (
    <div className="mt-5 text-left" aria-label="Live lobby">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]"><Radio className="h-3.5 w-3.5" /> Live lobby</p>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {lobby.players.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2.5">
            <span className={`h-3 w-3 shrink-0 rounded-full ${p.ready ? "bg-emerald-500" : "bg-slate-300"}`} aria-hidden />
            <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--text-primary)]">{p.you ? "You" : p.name}{p.owner ? " (host)" : ""}</span>
            <span className="text-xs text-[var(--text-muted)]">{p.ready ? "Ready" : "Not ready"}</span>
          </li>
        ))}
      </ul>

      {left !== null ? (
        <p className="mt-4 text-center font-display text-4xl font-extrabold text-[var(--text-primary)]" role="status" aria-live="polite">
          {left > 0 ? <>Starting in <span className="font-num">{left}</span></> : "Go!"}
        </p>
      ) : (
        <>
          <button type="button" disabled={busy || !canPlay} className="btn-main mt-4 disabled:opacity-50" onClick={() => void act({ action: me?.ready ? "unready" : "ready" })}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : me?.ready ? <Check className="h-4 w-4" /> : <Zap className="h-4 w-4" />} {me?.ready ? "Ready (tap to undo)" : "I'm ready"}
          </button>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {others.length === 0 ? "Waiting for a friend to join. Send them the challenge." : waitingOn.length ? `Waiting for ${waitingOn.join(", ")}. The countdown starts when the host and one friend are ready.` : "Starting…"}
          </p>
          {isOwner ? <button type="button" disabled={busy} className="btn-soft mt-3 inline-flex !text-xs" onClick={() => void act({ action: "mode", live: false }, () => window.location.reload())}>Don&apos;t wait: let friends play whenever they like</button> : null}
        </>
      )}
    </div>
  );
}
