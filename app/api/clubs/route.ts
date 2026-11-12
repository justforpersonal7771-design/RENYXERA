import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { battleCtx, isCtx, nameOf, type Db } from "@/lib/server/battles";

export const runtime = "nodejs";

/**
 * Clubs: small study squads that compete on Arena points. One club per student.
 *   GET                         my club (name, code, members with this week's points, club total and its rank among clubs) or null
 *   POST { action: "create", name }   start a club (you become its owner); returns a 6-character join code
 *   POST { action: "join", code }     join with a code (max 30 members)
 *   POST { action: "leave" }          leave; if the owner leaves, the longest-standing member becomes owner, an empty club is deleted
 */
const MAX = 30;
const NO = { "Cache-Control": "private, no-store" };
const body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("create"), name: z.string().trim().min(3).max(40) }),
  z.object({ action: z.literal("join"), code: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{6}$/) }),
  z.object({ action: z.literal("leave") }),
]);
const weekStart = () => { const d = new Date(Date.now() + 5.5 * 3600_000); const day = (d.getUTCDay() + 6) % 7; d.setUTCHours(0, 0, 0, 0); return new Date(d.getTime() - day * 86_400_000 - 5.5 * 3600_000).toISOString(); };
const code = () => Array.from({ length: 6 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");

async function weekly(db: Db, ids: string[]) {
  if (!ids.length) return new Map<string, number>();
  const { data } = await db.from("points_ledger").select("user_id, amount").in("user_id", ids).gte("created_at", weekStart());
  const m = new Map<string, number>();
  for (const r of data ?? []) m.set(r.user_id as string, (m.get(r.user_id as string) ?? 0) + (r.amount as number));
  return m;
}

async function myClub(db: Db, uid: string) {
  const { data: mem, error } = await db.from("club_members").select("club_id").eq("user_id", uid).maybeSingle();
  if (error) return { missing: true as const };
  if (!mem) return { club: null };
  const [{ data: club }, { data: members }] = await Promise.all([
    db.from("clubs").select("id, name, code, owner_id").eq("id", mem.club_id).maybeSingle(),
    db.from("club_members").select("user_id, role, joined_at").eq("club_id", mem.club_id).order("joined_at"),
  ]);
  if (!club) return { club: null };
  const ids = (members ?? []).map((m) => m.user_id as string);
  const pts = await weekly(db, ids);
  const list = await Promise.all((members ?? []).map(async (m) => ({ id: m.user_id as string, name: await nameOf(db, m.user_id as string), role: m.role as string, points: pts.get(m.user_id as string) ?? 0, you: m.user_id === uid })));
  list.sort((a, b) => b.points - a.points);
  const total = list.reduce((a, m) => a + m.points, 0);
  // rank among all clubs this week (fine at our size; move to SQL when clubs grow)
  const { data: all } = await db.from("club_members").select("club_id, user_id");
  const allPts = await weekly(db, (all ?? []).map((r) => r.user_id as string));
  const totals = new Map<string, number>();
  for (const r of all ?? []) totals.set(r.club_id as string, (totals.get(r.club_id as string) ?? 0) + (allPts.get(r.user_id as string) ?? 0));
  const rank = [...totals.values()].filter((v) => v > total).length + 1;
  return { club: { id: club.id, name: club.name, code: club.code, isOwner: club.owner_id === uid, members: list, total, rank, clubs: totals.size, max: MAX } };
}

export async function GET(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "club-read", limit: 60, needUser: true });
  if (!isCtx(c)) return c;
  const r = await myClub(c.db, c.userId!);
  if ("missing" in r) return NextResponse.json({ error: "Clubs aren't set up yet." }, { status: 503 });
  return NextResponse.json(r, { headers: NO });
}

export async function POST(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "club-write", limit: 20, needUser: true });
  if (!isCtx(c)) return c;
  const { db } = c; const uid = c.userId!;
  const a = body.safeParse(await req.json().catch(() => null));
  if (!a.success) return NextResponse.json({ error: "Check the name or code." }, { status: 400 });
  const { data: mem } = await db.from("club_members").select("club_id, role").eq("user_id", uid).maybeSingle();

  if (a.data.action === "create") {
    if (mem) return NextResponse.json({ error: "Leave your current club first." }, { status: 409 });
    let made: { id: string } | null = null;
    for (let i = 0; i < 5 && !made; i++) {
      const { data } = await db.from("clubs").insert({ name: a.data.name, code: code(), owner_id: uid }).select("id").single();
      made = data as { id: string } | null;
    }
    if (!made) return NextResponse.json({ error: "Couldn't create the club. Try again." }, { status: 500 });
    await db.from("club_members").insert({ user_id: uid, club_id: made.id, role: "owner" });
  } else if (a.data.action === "join") {
    if (mem) return NextResponse.json({ error: "Leave your current club first." }, { status: 409 });
    const { data: club } = await db.from("clubs").select("id").eq("code", a.data.code).maybeSingle();
    if (!club) return NextResponse.json({ error: "No club has that code." }, { status: 404 });
    const { count } = await db.from("club_members").select("user_id", { count: "exact", head: true }).eq("club_id", club.id);
    if ((count ?? 0) >= MAX) return NextResponse.json({ error: "That club is full." }, { status: 409 });
    await db.from("club_members").insert({ user_id: uid, club_id: club.id, role: "member" });
  } else {
    if (!mem) return NextResponse.json({ ok: true });
    await db.from("club_members").delete().eq("user_id", uid);
    if (mem.role === "owner") {
      const { data: next } = await db.from("club_members").select("user_id").eq("club_id", mem.club_id).order("joined_at").limit(1).maybeSingle();
      if (next) { await db.from("club_members").update({ role: "owner" }).eq("user_id", next.user_id); await db.from("clubs").update({ owner_id: next.user_id }).eq("id", mem.club_id); }
      else await db.from("clubs").delete().eq("id", mem.club_id);
    }
  }
  const r = await myClub(db, uid);
  return NextResponse.json("missing" in r ? { club: null } : r, { headers: NO });
}
