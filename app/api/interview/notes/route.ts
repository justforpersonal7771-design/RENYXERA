import { NextRequest, NextResponse } from "next/server";
import { interviewAccess } from "@/lib/server/interview";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";
const NO = { "Cache-Control": "private, no-store" };
const COLORS = ["yellow", "green", "pink", "blue"];

/** ?doc=ID gives that document's highlights and notes; no doc gives the newest 300 across everything. */
export async function GET(req: NextRequest) {
  const { ok, userId } = await interviewAccess();
  if (!ok || !userId) return new NextResponse(null, { status: 404 });
  const doc = req.nextUrl.searchParams.get("doc");
  const db = createServiceRoleClient();
  let q = db.from("interview_notes").select("id,doc_id,quote,note,color,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(300);
  if (doc) q = q.eq("doc_id", doc);
  const { data } = await q;
  return NextResponse.json({ notes: data ?? [] }, { headers: NO });
}

export async function POST(req: NextRequest) {
  const { ok, userId } = await interviewAccess();
  if (!ok || !userId) return new NextResponse(null, { status: 404 });
  const b = (await req.json().catch(() => null)) as { doc?: string; quote?: string; note?: string; color?: string; id?: number } | null;
  const db = createServiceRoleClient();
  if (b?.id && typeof b.note === "string") {
    await db.from("interview_notes").update({ note: b.note.slice(0, 2000) }).eq("id", b.id).eq("user_id", userId);
    return NextResponse.json({ ok: true }, { headers: NO });
  }
  if (!b?.doc || !b.quote?.trim()) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { data, error } = await db.from("interview_notes").insert({ user_id: userId, doc_id: b.doc.slice(0, 200), quote: b.quote.slice(0, 600), note: (b.note ?? "").slice(0, 2000), color: COLORS.includes(String(b.color)) ? b.color : "yellow" }).select("id,doc_id,quote,note,color,created_at").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ note: data }, { headers: NO });
}

export async function DELETE(req: NextRequest) {
  const { ok, userId } = await interviewAccess();
  if (!ok || !userId) return new NextResponse(null, { status: 404 });
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  await createServiceRoleClient().from("interview_notes").delete().eq("id", id).eq("user_id", userId);
  return NextResponse.json({ ok: true }, { headers: NO });
}
