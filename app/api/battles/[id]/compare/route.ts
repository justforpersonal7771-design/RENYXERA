import { NextRequest, NextResponse } from "next/server";
import { battleCtx, isCtx, UUID_RE } from "@/lib/server/battles";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Where the marks were won (R19): subject by subject, the owner's attempt against one friend's attempt, from the stored
 * server-graded responses. The owner may compare with any friend that submitted (?with=<user id>); a friend compares with the owner.
 */
export async function GET(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  if (!UUID_RE.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const c = await battleCtx(req, { bucket: "compare", limit: 30, needUser: true });
  if (!isCtx(c)) return c;
  const { db, userId } = c;
  const { data: b } = await db.from("battles").select("id, owner_id, owner_name, owner_attempt_id").eq("id", id).maybeSingle();
  if (!b || !b.owner_attempt_id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = b.owner_id === userId;
  const withId = isOwner ? req.nextUrl.searchParams.get("with") : userId;
  if (!withId || !UUID_RE.test(withId)) return NextResponse.json({ error: "Choose a friend to compare with." }, { status: 400 });
  const { data: e } = await db.from("battle_entries").select("display_name, attempt_id, status").eq("battle_id", id).eq("user_id", withId).maybeSingle();
  if (!e || e.status !== "submitted" || !e.attempt_id) return NextResponse.json({ error: "They haven't finished yet." }, { status: 409 });

  const { data: rows } = await db.from("exam_responses").select("attempt_id, question_id, awarded").in("attempt_id", [b.owner_attempt_id, e.attempt_id]);
  const qids = [...new Set((rows ?? []).map((r) => r.question_id as string))];
  const { data: qs } = qids.length ? await db.from("questions").select("id, subject, marks").in("id", qids) : { data: [] };
  const info = new Map((qs ?? []).map((q) => [q.id as string, { subject: (q.subject as string | null) || "Other", marks: Number(q.marks) || 0 }]));

  // Only questions both players answered sheets for count, so a missing question can't tilt a subject.
  const byAttempt = (aid: string) => new Map((rows ?? []).filter((r) => r.attempt_id === aid).map((r) => [r.question_id as string, Number(r.awarded) || 0]));
  const mine = byAttempt(b.owner_attempt_id), theirs = byAttempt(e.attempt_id);
  const subjects = new Map<string, { owner: number; friend: number; max: number }>();
  for (const [q, ownerMarks] of mine) {
    if (!theirs.has(q)) continue;
    const i = info.get(q); if (!i) continue;
    const s = subjects.get(i.subject) ?? { owner: 0, friend: 0, max: 0 };
    s.owner += ownerMarks; s.friend += theirs.get(q)!; s.max += i.marks;
    subjects.set(i.subject, s);
  }
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return NextResponse.json({
    ownerName: b.owner_name, friendName: e.display_name, ownerIsYou: isOwner,
    subjects: [...subjects.entries()].map(([subject, s]) => ({ subject, owner: r2(s.owner), friend: r2(s.friend), max: r2(s.max) })).sort((a, z) => Math.abs(z.owner - z.friend) - Math.abs(a.owner - a.friend)),
  }, { headers: { "Cache-Control": "private, no-store" } });
}
