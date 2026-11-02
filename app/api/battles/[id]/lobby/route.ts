import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { battleCtx, isCtx, nameOf, UUID_RE, type Db } from "@/lib/server/battles";

export const runtime = "nodejs";

/**
 * Live battle lobby (R29 step 4, migration 0050).
 *   GET                              mode, countdown target (server clock), players and who is ready. Owner and invited or joined friends only.
 *   POST { action: "ready" }         I'm ready; when the owner and one friend are ready the start moment is fixed COUNTDOWN_S ahead
 *   POST { action: "unready" }       take it back (not possible once the countdown has fixed the start)
 *   POST { action: "mode", live }    owner only: switch between live and "play when you like"; not after the start
 * Clients poll GET every 2 s and compute the countdown from `serverNow`, so a wrong phone clock cannot start anyone early.
 */
const COUNTDOWN_S = 6;
const body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("ready") }),
  z.object({ action: z.literal("unready") }),
  z.object({ action: z.literal("mode"), live: z.boolean() }),
]);

type B = { id: string; owner_id: string; owner_name: string; mode: string; live_start_at: string | null; owner_ready_at: string | null; owner_score: number | null; expires_at: string };
const COLS = "id, owner_id, owner_name, mode, live_start_at, owner_ready_at, owner_score, expires_at";

async function access(db: Db, id: string, userId: string) {
  if (!UUID_RE.test(id)) return null;
  const { data: b } = await db.from("battles").select(COLS).eq("id", id).maybeSingle();
  if (!b) return null;
  if (b.owner_id === userId) return b as B;
  const [{ data: inv }, { data: ent }] = await Promise.all([
    db.from("battle_invites").select("user_id").eq("battle_id", id).eq("user_id", userId).maybeSingle(),
    db.from("battle_entries").select("user_id").eq("battle_id", id).eq("user_id", userId).maybeSingle(),
  ]);
  return inv || ent ? (b as B) : null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const c = await battleCtx(req, { bucket: "lobby-read", limit: 120, needUser: true });
  if (!isCtx(c)) return c;
  const { id } = await params;
  const b = await access(c.db, id, c.userId!);
  if (!b) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const { data: ents } = await c.db.from("battle_entries").select("user_id, display_name, ready_at, status").eq("battle_id", id);
  const players = [
    { id: b.owner_id, name: b.owner_name, ready: !!b.owner_ready_at, owner: true, you: b.owner_id === c.userId },
    ...(ents ?? []).map((e) => ({ id: e.user_id as string, name: e.display_name as string, ready: !!e.ready_at, owner: false, you: e.user_id === c.userId })),
  ];
  return NextResponse.json({ mode: b.mode, liveStartAt: b.live_start_at, serverNow: new Date().toISOString(), expired: b.expires_at <= new Date().toISOString(), ownerFinished: b.owner_score !== null, players }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const c = await battleCtx(req, { bucket: "lobby-write", limit: 40, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const me = userId!;
  const { id } = await params;
  const a = body.safeParse(await req.json().catch(() => null));
  if (!a.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const b = await access(db, id, me);
  if (!b) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const now = Date.now(), nowIso = new Date(now).toISOString();
  if (b.expires_at <= nowIso) return NextResponse.json({ error: "This battle has expired.", reason: "expired" }, { status: 410 });
  const started = !!b.live_start_at && Date.parse(b.live_start_at) <= now + 500;
  const isOwner = b.owner_id === me;

  if (a.data.action === "mode") {
    if (!isOwner) return NextResponse.json({ error: "Only the person who made the challenge can change this." }, { status: 403 });
    if (started || b.owner_score !== null) return NextResponse.json({ error: "This battle has already started." }, { status: 409 });
    await db.from("battles").update({ mode: a.data.live ? "live" : "async", live_start_at: null, owner_ready_at: null }).eq("id", id);
    await db.from("battle_entries").update({ ready_at: null }).eq("battle_id", id);
    return NextResponse.json({ ok: true, mode: a.data.live ? "live" : "async" });
  }
  if (b.mode !== "live") return NextResponse.json({ error: "This battle isn't live." }, { status: 409 });

  if (a.data.action === "unready") {
    if (b.live_start_at) return NextResponse.json({ error: "The countdown has started." }, { status: 409 });
    if (isOwner) await db.from("battles").update({ owner_ready_at: null }).eq("id", id);
    else await db.from("battle_entries").update({ ready_at: null }).eq("battle_id", id).eq("user_id", me);
    return NextResponse.json({ ok: true });
  }

  // ready
  if (isOwner) await db.from("battles").update({ owner_ready_at: nowIso }).eq("id", id);
  else {
    const { data: ex } = await db.from("battle_entries").select("user_id").eq("battle_id", id).eq("user_id", me).maybeSingle();
    if (!ex) await db.from("battle_entries").insert({ battle_id: id, user_id: me, display_name: await nameOf(db, me), status: "opened", ready_at: nowIso });
    else await db.from("battle_entries").update({ ready_at: nowIso }).eq("battle_id", id).eq("user_id", me);
  }
  if (!b.live_start_at) {
    const [{ data: bb }, { count }] = await Promise.all([
      db.from("battles").select("owner_ready_at").eq("id", id).maybeSingle(),
      db.from("battle_entries").select("user_id", { count: "exact", head: true }).eq("battle_id", id).not("ready_at", "is", null),
    ]);
    if (bb?.owner_ready_at && (count ?? 0) >= 1) {
      // Set only if nobody else did first, so every player sees the same moment.
      await db.from("battles").update({ live_start_at: new Date(now + COUNTDOWN_S * 1000).toISOString() }).eq("id", id).is("live_start_at", null);
    }
  }
  return NextResponse.json({ ok: true });
}
