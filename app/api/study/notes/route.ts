import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Study lesson highlights and notes for the signed-in student (RLS: own rows only). 503 if migration 0059 is not applied yet, so the client falls back to this device. */
const NO = { "Cache-Control": "private, no-store" };
const COLORS = ["yellow", "green", "pink", "blue"];
const missing = (m?: string) => !!m && /study_notes|relation|schema cache/i.test(m);

async function who() {
  const sb = await createClient();
  const { data } = await sb.auth.getUser();
  return { sb, uid: data.user?.id ?? null };
}

export async function GET(req: NextRequest) {
  const { sb, uid } = await who();
  if (!uid) return NextResponse.json({ error: "Sign in" }, { status: 401 });
  const lesson = req.nextUrl.searchParams.get("lesson") ?? "";
  const { data, error } = await sb.from("study_notes").select("id,quote,note,color").eq("user_id", uid).eq("lesson", lesson).order("created_at").limit(300);
  if (error) return NextResponse.json({ error: error.message }, { status: missing(error.message) ? 503 : 500 });
  return NextResponse.json({ notes: data ?? [] }, { headers: NO });
}

export async function POST(req: NextRequest) {
  const { sb, uid } = await who();
  if (!uid) return NextResponse.json({ error: "Sign in" }, { status: 401 });
  const b = (await req.json().catch(() => null)) as { id?: number; lesson?: string; quote?: string; note?: string; color?: string } | null;
  if (b?.id && typeof b.note === "string") {
    const { error } = await sb.from("study_notes").update({ note: b.note.slice(0, 2000) }).eq("id", b.id).eq("user_id", uid);
    return error ? NextResponse.json({ error: error.message }, { status: 500 }) : NextResponse.json({ ok: true }, { headers: NO });
  }
  if (!b?.lesson || !b.quote?.trim()) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { data, error } = await sb.from("study_notes").insert({ user_id: uid, lesson: b.lesson.slice(0, 200), quote: b.quote.slice(0, 600), note: (b.note ?? "").slice(0, 2000), color: COLORS.includes(String(b.color)) ? b.color : "yellow" }).select("id,quote,note,color").single();
  if (error) return NextResponse.json({ error: error.message }, { status: missing(error.message) ? 503 : 500 });
  return NextResponse.json({ note: data }, { headers: NO });
}

export async function DELETE(req: NextRequest) {
  const { sb, uid } = await who();
  if (!uid) return NextResponse.json({ error: "Sign in" }, { status: 401 });
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  await sb.from("study_notes").delete().eq("id", id).eq("user_id", uid);
  return NextResponse.json({ ok: true }, { headers: NO });
}
