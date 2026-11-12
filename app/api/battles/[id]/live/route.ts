import { NextRequest, NextResponse } from "next/server";
import { battleCtx, isCtx, UUID_RE } from "@/lib/server/battles";

export const runtime = "nodejs";

/**
 * Live room state for a battle: every player's progress and, once finished, their score. Only the challenger and players in the
 * battle may read it. Polled every few seconds by the in-exam VS strip and the result screen. Scores always come from server grading.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const c = await battleCtx(req, { bucket: "live", limit: 240, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  let { data: b, error } = await db.from("battles").select("id, owner_id, owner_name, owner_score, max_score, question_ids, owner_answered, owner_total").eq("id", id).maybeSingle();
  if (error) ({ data: b } = await db.from("battles").select("id, owner_id, owner_name, owner_score, max_score, question_ids").eq("id", id).maybeSingle()); // before migration 0060
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data: ents } = await db.from("battle_entries").select("user_id, display_name, status, answered, total, score, max_score").eq("battle_id", id);
  const isOwner = b.owner_id === userId;
  if (!isOwner && !(ents ?? []).some((e) => e.user_id === userId)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const total = (b.question_ids as string[]).length;
  const own = b as { owner_answered?: number; owner_total?: number | null };
  const players = [
    { id: b.owner_id as string, name: b.owner_name as string, answered: b.owner_score !== null ? (own.owner_total ?? total) : (own.owner_answered ?? 0), total: own.owner_total ?? total, done: b.owner_score !== null, score: b.owner_score as number | null, max: b.max_score as number | null, you: isOwner, owner: true },
    ...(ents ?? []).filter((e) => e.status !== "abandoned").map((e) => ({ id: e.user_id as string, name: e.display_name as string, answered: e.answered as number, total: (e.total as number) || total, done: e.status === "submitted", score: e.score as number | null, max: e.max_score as number | null, you: e.user_id === userId, owner: false })),
  ];
  return NextResponse.json({ players, serverNow: new Date().toISOString() }, { headers: { "Cache-Control": "private, no-store" } });
}
