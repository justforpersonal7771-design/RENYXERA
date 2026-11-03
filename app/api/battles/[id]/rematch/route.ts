import { NextRequest, NextResponse } from "next/server";
import { getEntitlement } from "@/lib/billing/server";
import { battleCtx, isCtx, FREE_ACTIVE_BATTLES, nameOf, UUID_RE } from "@/lib/server/battles";

export const runtime = "nodejs";

/**
 * Rematch (R29): POST makes a new battle with the same questions, owned by the caller, and sends it to the people they just played
 * (when they are friends). The caller must be the owner or someone who submitted in this battle. Returns { id, path }.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const c = await battleCtx(req, { bucket: "rematch", limit: 10, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const me = userId!;
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const { data: b } = await db.from("battles").select("id, owner_id, title, question_ids, mode").eq("id", id).maybeSingle();
  if (!b) return NextResponse.json({ error: "Not found." }, { status: 404 });
  const { data: entries } = await db.from("battle_entries").select("user_id, status").eq("battle_id", id);
  const mine = (entries ?? []).find((e) => e.user_id === me);
  if (b.owner_id !== me && mine?.status !== "submitted") return NextResponse.json({ error: "Finish the battle first, then ask for a rematch." }, { status: 403 });

  if ((await getEntitlement(me)).tier === "free") {
    const { count } = await db.from("battles").select("id", { count: "exact", head: true }).eq("owner_id", me).gt("expires_at", new Date().toISOString());
    if ((count ?? 0) >= FREE_ACTIVE_BATTLES) return NextResponse.json({ error: `Free accounts can have ${FREE_ACTIVE_BATTLES} active challenges at a time. They expire after 7 days. Plus and Pro have no limit.`, reason: "limit" }, { status: 403 });
  }

  const title = `Rematch: ${String(b.title)}`.replace(/[^\p{L}\p{N} .,:'&-]/gu, "").trim().slice(0, 80) || "Rematch";
  const { data: made, error } = await db.from("battles").insert({ owner_id: me, owner_name: await nameOf(db, me), title, question_ids: b.question_ids }).select("id").single();
  if (error || !made) return NextResponse.json({ error: "Couldn't start the rematch right now." }, { status: 503 });

  // Opponents: everyone who finished (if I own the battle) or the owner (if I joined). Only accepted friends get the challenge.
  const opponents = b.owner_id === me ? (entries ?? []).filter((e) => e.status === "submitted" && e.user_id !== me).map((e) => e.user_id as string) : [b.owner_id as string];
  if (opponents.length) {
    const { data: fr } = await db.from("friendships").select("user_a, user_b").eq("status", "accepted").or(`user_a.eq.${me},user_b.eq.${me}`).limit(500);
    const friends = new Set((fr ?? []).map((r) => (r.user_a === me ? r.user_b : r.user_a) as string));
    const rows = opponents.filter((u) => friends.has(u)).slice(0, 30).map((u) => ({ battle_id: made.id, user_id: u, invited_by: me }));
    if (rows.length) await db.from("battle_invites").insert(rows);
  }
  return NextResponse.json({ id: made.id, path: `/challenge/${made.id}` });
}
