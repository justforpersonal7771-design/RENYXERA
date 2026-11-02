import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { battleCtx, isCtx, UUID_RE } from "@/lib/server/battles";

export const runtime = "nodejs";

/**
 * Friends and presence (R29 step 1, migration 0047). All writes go through here (service role); the browser only reads its own rows.
 *   GET                                     friends (with presence), requests sent to me, requests I sent
 *   POST { action: "request", username }    send a request (or accept, if they already asked me)
 *   POST { action: "accept"|"decline"|"remove"|"block", userId }
 *   POST { action: "ping" }                 "I'm here": updates last_seen_at (the client sends it at most once a minute)
 *   POST { action: "presence", show }       show or hide my online status from friends
 */
const MAX_REQUESTS_PER_DAY = 20;
const MAX_FRIENDS = 200;
const body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("request"), username: z.string().trim().toLowerCase().regex(/^[a-z][a-z0-9_]{2,19}$/) }),
  z.object({ action: z.enum(["accept", "decline", "remove", "block"]), userId: z.string().regex(UUID_RE) }),
  z.object({ action: z.literal("ping") }),
  z.object({ action: z.literal("presence"), show: z.boolean() }),
]);

const pair = (me: string, other: string) => (me < other ? { user_a: me, user_b: other } : { user_a: other, user_b: me });
export type Presence = "active" | "away" | "offline" | "hidden";
const ORDER: Presence[] = ["active", "away", "offline", "hidden"];
function presenceOf(lastSeen: string | null, show: boolean): Presence {
  if (!show) return "hidden";
  if (!lastSeen) return "offline";
  const mins = (Date.now() - Date.parse(lastSeen)) / 60_000;
  return mins <= 2 ? "active" : mins <= 60 ? "away" : "offline";
}

export async function GET(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "friends-read", limit: 60, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const me = userId!;
  const { data: rows } = await db.from("friendships").select("user_a, user_b, status, requested_by").or(`user_a.eq.${me},user_b.eq.${me}`).limit(500);
  const mine = (rows ?? []).filter((r) => r.status !== "blocked" || r.requested_by === me);
  const ids = mine.map((r) => (r.user_a === me ? r.user_b : r.user_a));
  const { data: profs } = ids.length ? await db.from("profiles").select("id, username, display_name, last_seen_at, show_presence").in("id", ids) : { data: [] as { id: string; username: string | null; display_name: string | null; last_seen_at: string | null; show_presence: boolean }[] };
  const byId = new Map((profs ?? []).map((p) => [p.id, p]));
  const shape = (r: (typeof mine)[number]) => {
    const id = r.user_a === me ? r.user_b : r.user_a; const p = byId.get(id);
    const name = (p?.display_name || p?.username || "A friend") as string;
    return { id, name, username: p?.username ?? null, presence: r.status === "accepted" && p ? presenceOf(p.last_seen_at, p.show_presence) : ("hidden" as Presence) };
  };
  const friends = mine.filter((r) => r.status === "accepted").map(shape).sort((x, y) => ORDER.indexOf(x.presence) - ORDER.indexOf(y.presence) || x.name.localeCompare(y.name));
  const incoming = mine.filter((r) => r.status === "pending" && r.requested_by !== me).map(shape);
  const outgoing = mine.filter((r) => r.status === "pending" && r.requested_by === me).map(shape);
  const { data: self } = await db.from("profiles").select("show_presence, username").eq("id", me).maybeSingle();
  return NextResponse.json({ friends, incoming, outgoing, showPresence: self?.show_presence ?? true, username: self?.username ?? null });
}

export async function POST(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "friends-write", limit: 30, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const me = userId!;
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const b = parsed.data;

  if (b.action === "ping") {
    await db.from("profiles").update({ last_seen_at: new Date().toISOString() }).eq("id", me);
    return NextResponse.json({ ok: true });
  }
  if (b.action === "presence") {
    await db.from("profiles").update({ show_presence: b.show }).eq("id", me);
    return NextResponse.json({ ok: true });
  }
  if (b.action === "request") {
    const { data: me0 } = await db.from("profiles").select("username").eq("id", me).maybeSingle();
    if (!me0?.username) return NextResponse.json({ error: "Pick a username in your profile first, so friends can find you." }, { status: 409 });
    const { data: target } = await db.from("profiles").select("id, username").eq("username", b.username).maybeSingle();
    if (target?.id === me) return NextResponse.json({ error: "That is your own username." }, { status: 400 });
    if (!target) return NextResponse.json({ error: "No student with that username." }, { status: 404 });
    const key = pair(me, target.id);
    const { data: ex } = await db.from("friendships").select("status, requested_by").match(key).maybeSingle();
    if (ex?.status === "accepted") return NextResponse.json({ ok: true, state: "friends" });
    if (ex?.status === "blocked") return NextResponse.json({ error: "Couldn't send that request." }, { status: 403 });
    if (ex?.status === "pending") {
      if (ex.requested_by === me) return NextResponse.json({ ok: true, state: "already-sent" });
      await db.from("friendships").update({ status: "accepted", updated_at: new Date().toISOString() }).match(key);
      return NextResponse.json({ ok: true, state: "friends" });
    }
    const since = new Date(Date.now() - 86_400_000).toISOString();
    const { count: today } = await db.from("friendships").select("user_a", { count: "exact", head: true }).eq("requested_by", me).gt("created_at", since);
    if ((today ?? 0) >= MAX_REQUESTS_PER_DAY) return NextResponse.json({ error: `You can send ${MAX_REQUESTS_PER_DAY} friend requests a day. Try again tomorrow.` }, { status: 429 });
    const { count: total } = await db.from("friendships").select("user_a", { count: "exact", head: true }).or(`user_a.eq.${me},user_b.eq.${me}`).eq("status", "accepted");
    if ((total ?? 0) >= MAX_FRIENDS) return NextResponse.json({ error: `The friends list is full (${MAX_FRIENDS}).` }, { status: 403 });
    const { error } = await db.from("friendships").insert({ ...key, requested_by: me });
    if (error) return NextResponse.json({ error: "Couldn't send the request right now." }, { status: 503 });
    return NextResponse.json({ ok: true, state: "sent" });
  }

  // accept / decline / remove / block, all about one other student
  if (b.userId === me) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const key = pair(me, b.userId);
  const { data: ex } = await db.from("friendships").select("status, requested_by").match(key).maybeSingle();
  if (!ex) return NextResponse.json({ error: "Nothing to change." }, { status: 404 });
  if (ex.status === "blocked" && ex.requested_by !== me) return NextResponse.json({ error: "Nothing to change." }, { status: 404 }); // only the blocker can undo a block
  if (b.action === "accept") {
    if (ex.status !== "pending" || ex.requested_by === me) return NextResponse.json({ error: "No request to accept." }, { status: 409 });
    await db.from("friendships").update({ status: "accepted", updated_at: new Date().toISOString() }).match(key);
  } else if (b.action === "block") {
    await db.from("friendships").update({ status: "blocked", requested_by: me, updated_at: new Date().toISOString() }).match(key);
  } else { // decline, remove (also cancels my own pending request and lifts my own block)
    await db.from("friendships").delete().match(key);
  }
  return NextResponse.json({ ok: true });
}
