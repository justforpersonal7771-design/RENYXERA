import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { battleCtx, isCtx, UUID_RE, type Db } from "@/lib/server/battles";

export const runtime = "nodejs";

/**
 * Challenge specific friends (R29 step 2, migration 0048). Owner only; only accepted friends can be invited.
 *   GET   { invited: [userId] }              who this battle was already sent to
 *   POST  { userIds: [uuid] (1 to 10) }      send the challenge; asking twice is harmless
 */
const MAX_PER_CALL = 10;
const MAX_PER_BATTLE = 30;
const body = z.object({ userIds: z.array(z.string().regex(UUID_RE)).min(1).max(MAX_PER_CALL), playNow: z.boolean().optional(), scheduledAt: z.string().datetime().optional() });

async function ownBattle(db: Db, id: string, userId: string) {
  if (!UUID_RE.test(id)) return null;
  const { data } = await db.from("battles").select("id, owner_id, expires_at").eq("id", id).maybeSingle();
  return data && data.owner_id === userId ? (data as { id: string; owner_id: string; expires_at: string }) : null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const c = await battleCtx(req, { bucket: "invite-read", limit: 30, needUser: true });
  if (!isCtx(c)) return c;
  const { id } = await params;
  const battle = await ownBattle(c.db, id, c.userId!);
  if (!battle) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const { data } = await c.db.from("battle_invites").select("user_id").eq("battle_id", id);
  return NextResponse.json({ invited: (data ?? []).map((r) => r.user_id) }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const c = await battleCtx(req, { bucket: "invite", limit: 20, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const me = userId!;
  const { id } = await params;
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Pick one to ten friends." }, { status: 400 });
  const battle = await ownBattle(db, id, me);
  if (!battle) return NextResponse.json({ error: "Not found." }, { status: 404 });
  if (battle.expires_at <= new Date().toISOString()) return NextResponse.json({ error: "This battle has expired." }, { status: 409 });

  const ids = [...new Set(parsed.data.userIds)].filter((u) => u !== me);
  if (ids.length === 0) return NextResponse.json({ error: "Pick a friend." }, { status: 400 });
  const { data: rows } = await db.from("friendships").select("user_a, user_b").eq("status", "accepted").or(`user_a.eq.${me},user_b.eq.${me}`).limit(500);
  const friends = new Set((rows ?? []).map((r) => (r.user_a === me ? r.user_b : r.user_a) as string));
  const allowed = ids.filter((u) => friends.has(u));
  if (allowed.length !== ids.length) return NextResponse.json({ error: "You can only challenge your friends." }, { status: 403 });

  const { count } = await db.from("battle_invites").select("user_id", { count: "exact", head: true }).eq("battle_id", id);
  if ((count ?? 0) + allowed.length > MAX_PER_BATTLE) return NextResponse.json({ error: `One battle can go to ${MAX_PER_BATTLE} friends.` }, { status: 403 });
  // When to play: now (a live prompt if the friend is active) or at a set time within the next 7 days. Needs migration 0058; without it the invite is sent plain.
  const at = parsed.data.scheduledAt ? Date.parse(parsed.data.scheduledAt) : NaN;
  if (parsed.data.scheduledAt && (!(at > Date.now() - 60_000) || at > Date.now() + 7 * 86_400_000)) return NextResponse.json({ error: "Pick a time within the next 7 days." }, { status: 400 });
  const timing = { play_now: !!parsed.data.playNow && !parsed.data.scheduledAt, scheduled_at: parsed.data.scheduledAt ?? null };
  const plain = allowed.map((u) => ({ battle_id: id, user_id: u, invited_by: me }));
  let { error } = await db.from("battle_invites").upsert(allowed.map((u) => ({ battle_id: id, user_id: u, invited_by: me, ...timing })), { onConflict: "battle_id,user_id", ignoreDuplicates: true });
  if (error) ({ error } = await db.from("battle_invites").upsert(plain, { onConflict: "battle_id,user_id", ignoreDuplicates: true }));
  if (error) return NextResponse.json({ error: "Couldn't send the challenge right now." }, { status: 503 });
  return NextResponse.json({ ok: true, sent: allowed.length });
}
