import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEntitlement } from "@/lib/billing/server";
import { battleCtx, isCtx, FREE_ACTIVE_BATTLES, gradedAttempt, nameOf } from "@/lib/server/battles";

export const runtime = "nodejs";

/**
 * Battles (R19). The score is copied from the server-graded attempt, never from the request.
 *   POST { attempt_id }   make (or reuse) the battle for a finished, stored test of this account
 *   GET                   my battles (owned and joined) with their entries
 */
const createSchema = z.object({ attempt_id: z.string().uuid() });

export async function POST(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "create", limit: 10, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const body = createSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const attempt = await gradedAttempt(db, userId!, body.data.attempt_id);
  if (!attempt || attempt.question_ids.length < 3) return NextResponse.json({ error: "Finish and save a test first, then challenge a friend.", reason: "attempt" }, { status: 409 });

  const { data: existing } = await db.from("battles").select("id").eq("owner_attempt_id", attempt.id).maybeSingle();
  if (existing) return NextResponse.json({ id: existing.id, path: `/challenge/${existing.id}`, reused: true });

  const ent = await getEntitlement(userId);
  if (ent.tier === "free") {
    const { count } = await db.from("battles").select("id", { count: "exact", head: true }).eq("owner_id", userId!).gt("expires_at", new Date().toISOString());
    if ((count ?? 0) >= FREE_ACTIVE_BATTLES) {
      return NextResponse.json({ error: `Free accounts can have ${FREE_ACTIVE_BATTLES} active battles at a time. They expire after 7 days. Plus and Pro have no limit.`, reason: "limit", upgrade: true }, { status: 403 });
    }
  }

  const title = String(attempt.config?.title ?? "Practice set").replace(/[^\p{L}\p{N} .,'&-]/gu, "").trim().slice(0, 80) || "Practice set";
  const { data, error } = await db.from("battles").insert({
    owner_id: userId, owner_name: await nameOf(db, userId!), title, question_ids: attempt.question_ids.slice(0, 200),
    owner_attempt_id: attempt.id, owner_score: attempt.server_score, max_score: attempt.server_max,
  }).select("id").single();
  if (error || !data) return NextResponse.json({ error: "Couldn't create the battle right now." }, { status: 503 });
  return NextResponse.json({ id: data.id, path: `/challenge/${data.id}` });
}

export async function GET(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "list", limit: 30, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const nowIso = new Date().toISOString();
  const [{ data: owned }, { data: joined }] = await Promise.all([
    db.from("battles").select("id, title, owner_name, owner_score, max_score, question_ids, created_at, expires_at").eq("owner_id", userId!).order("created_at", { ascending: false }).limit(30),
    db.from("battle_entries").select("battle_id").eq("user_id", userId!).order("last_seen_at", { ascending: false }).limit(30),
  ]);
  const joinedIds = (joined ?? []).map((j) => j.battle_id as string).filter((id) => !(owned ?? []).some((o) => o.id === id));
  const { data: others } = joinedIds.length
    ? await db.from("battles").select("id, title, owner_name, owner_score, max_score, question_ids, created_at, expires_at").in("id", joinedIds)
    : { data: [] as NonNullable<typeof owned> };
  const all = [...(owned ?? []).map((b) => ({ ...b, mine: true })), ...(others ?? []).map((b) => ({ ...b, mine: false }))];
  const ids = all.map((b) => b.id);
  const { data: entries } = ids.length
    ? await db.from("battle_entries").select("battle_id, user_id, display_name, status, answered, total, score, max_score, attempt_id, started_at, submitted_at, last_seen_at").in("battle_id", ids)
    : { data: [] };
  return NextResponse.json({
    now: nowIso,
    battles: all.map((b) => ({
      id: b.id, title: b.title, ownerName: b.owner_name, ownerScore: b.owner_score, maxScore: b.max_score, questions: b.question_ids.length,
      createdAt: b.created_at, expiresAt: b.expires_at, expired: b.expires_at <= nowIso, mine: b.mine,
      // Everyone in a battle sees the entries of the owner's battles; a joiner sees only their own row.
      entries: (entries ?? []).filter((e) => e.battle_id === b.id && (b.mine || e.user_id === userId)).map((e) => ({
        userId: e.user_id, name: e.display_name, status: e.status, answered: e.answered, total: e.total, score: e.score, maxScore: e.max_score,
        submittedAt: e.submitted_at, lastSeenAt: e.last_seen_at, you: e.user_id === userId, attemptId: e.user_id === userId ? e.attempt_id : null,
      })),
    })),
  }, { headers: { "Cache-Control": "private, no-store" } });
}
