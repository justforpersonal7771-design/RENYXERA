import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { battleCtx, isCtx, gradedAttempt, nameOf, UUID_RE } from "@/lib/server/battles";
import { notifyBattle, battleText } from "@/lib/telegram/notify";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const MIN_COVER = 0.8; // a friend's attempt must contain at least this share of the battle's questions

/** GET: the battle landing (anyone with the link, even signed out) plus, for an account in it, the entries it may see. */
export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const c = await battleCtx(req, { bucket: "get", limit: 60 });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const { data: b } = await db.from("battles").select("id, owner_id, owner_name, title, question_ids, owner_score, max_score, created_at, expires_at").eq("id", id).maybeSingle();
  if (!b) return NextResponse.json({ error: "This battle doesn't exist." }, { status: 404 });
  const isOwner = userId === b.owner_id;
  const { data: entries } = userId
    ? await db.from("battle_entries").select("user_id, display_name, status, answered, total, score, max_score, submitted_at").eq("battle_id", id)
    : { data: [] };
  const visible = (entries ?? []).filter((e) => isOwner || e.user_id === userId);
  return NextResponse.json({
    battle: { id: b.id, title: b.title, ownerName: b.owner_name, ownerScore: b.owner_score, maxScore: b.max_score, questionIds: b.question_ids, createdAt: b.created_at, expiresAt: b.expires_at, expired: b.expires_at <= new Date().toISOString() },
    isOwner,
    entries: visible.map((e) => ({ userId: e.user_id, name: e.display_name, status: e.status, answered: e.answered, total: e.total, score: e.score, maxScore: e.max_score, submittedAt: e.submitted_at, you: e.user_id === userId })),
  }, { headers: { "Cache-Control": "private, no-store" } });
}

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("open") }),
  z.object({ action: z.literal("start"), total: z.number().int().min(1).max(200) }),
  z.object({ action: z.literal("progress"), answered: z.number().int().min(0).max(200) }),
  z.object({ action: z.literal("finish"), attempt_id: z.string().uuid() }),
]);

/** POST: a signed-in friend moves through opened -> started -> (progress) -> submitted. Status only moves forward. */
export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const c = await battleCtx(req, { bucket: "act", limit: 40, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const body = actionSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const { data: b } = await db.from("battles").select("id, owner_id, title, question_ids, owner_score, max_score, expires_at").eq("id", id).maybeSingle();
  if (!b) return NextResponse.json({ error: "This battle doesn't exist." }, { status: 404 });
  if (b.expires_at <= new Date().toISOString()) return NextResponse.json({ error: "This battle has expired (battles last 7 days).", reason: "expired" }, { status: 410 });
  if (b.owner_id === userId) return NextResponse.json({ error: "This is your own battle. Send the link to a friend.", reason: "own" }, { status: 409 });

  const { data: entry } = await db.from("battle_entries").select("status, started_at, answered").eq("battle_id", id).eq("user_id", userId!).maybeSingle();
  const nowIso = new Date().toISOString();
  const a = body.data;

  if (a.action === "open") {
    if (!entry) await db.from("battle_entries").insert({ battle_id: id, user_id: userId, display_name: await nameOf(db, userId!), status: "opened" });
    else await db.from("battle_entries").update({ last_seen_at: nowIso }).eq("battle_id", id).eq("user_id", userId!);
    return NextResponse.json({ ok: true, status: entry?.status ?? "opened" });
  }

  if (a.action === "start") {
    if (entry?.status === "submitted") return NextResponse.json({ ok: true, status: "submitted" });
    const row = { status: "started", total: a.total, answered: 0, started_at: nowIso, last_seen_at: nowIso };
    if (!entry) await db.from("battle_entries").insert({ battle_id: id, user_id: userId, display_name: await nameOf(db, userId!), ...row });
    else await db.from("battle_entries").update(row).eq("battle_id", id).eq("user_id", userId!);
    if (entry?.status !== "started") void notifyBattle(db, b.owner_id, id, battleText.started(await nameOf(db, userId!), b.title));
    return NextResponse.json({ ok: true, status: "started" });
  }

  if (!entry) return NextResponse.json({ error: "Open the battle first." }, { status: 409 });

  if (a.action === "progress") {
    if (entry.status !== "started") return NextResponse.json({ ok: true, status: entry.status });
    await db.from("battle_entries").update({ answered: Math.max(entry.answered ?? 0, a.answered), last_seen_at: nowIso }).eq("battle_id", id).eq("user_id", userId!);
    return NextResponse.json({ ok: true });
  }

  // finish: the score comes from the server-graded attempt, and the attempt must really be this battle's questions, taken after joining.
  if (entry.status === "submitted") return NextResponse.json({ ok: true, status: "submitted" });
  const attempt = await gradedAttempt(db, userId!, a.attempt_id);
  if (!attempt) return NextResponse.json({ error: "That test isn't saved yet.", reason: "attempt" }, { status: 409 });
  const battleIds = new Set<string>(b.question_ids);
  const ids = attempt.question_ids;
  // Every question must belong to the battle, and the attempt must cover most of it (a friend may lack a few questions from another branch's bank).
  if (!ids.every((q) => battleIds.has(q)) || ids.length < Math.ceil(battleIds.size * MIN_COVER)) {
    return NextResponse.json({ error: "That test doesn't match this battle's questions.", reason: "mismatch" }, { status: 409 });
  }
  if (entry.started_at && attempt.submitted_at && attempt.submitted_at < entry.started_at) {
    return NextResponse.json({ error: "That test was finished before you joined this battle.", reason: "stale" }, { status: 409 });
  }
  await db.from("battle_entries").update({
    status: "submitted", attempt_id: attempt.id, score: attempt.server_score, max_score: attempt.server_max, answered: ids.length, submitted_at: nowIso, last_seen_at: nowIso,
  }).eq("battle_id", id).eq("user_id", userId!);
  const mineP = attempt.server_score / attempt.server_max, theirsP = Number(b.owner_score) / Number(b.max_score);
  void notifyBattle(db, b.owner_id, id, battleText.finished(await nameOf(db, userId!), b.title, attempt.server_score, attempt.server_max, Number(b.owner_score), mineP > theirsP ? "They won." : mineP === theirsP ? "A tie." : "You won."));
  return NextResponse.json({ ok: true, status: "submitted", score: attempt.server_score, maxScore: attempt.server_max, ownerScore: b.owner_score, ownerMax: b.max_score });
}
