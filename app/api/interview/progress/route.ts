import { NextRequest, NextResponse } from "next/server";
import { interviewAccess } from "@/lib/server/interview";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";
const NO = { "Cache-Control": "private, no-store" };

export async function GET() {
  const { ok, userId } = await interviewAccess();
  if (!ok || !userId) return new NextResponse(null, { status: 404 });
  const db = createServiceRoleClient();
  const [a, p] = await Promise.all([
    db.from("interview_attempts").select("item_kind,item_id,ok,detail,created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(1000),
    db.from("interview_progress").select("doc_id,status,updated_at").eq("user_id", userId).limit(5000),
  ]);
  return NextResponse.json({ attempts: a.data ?? [], progress: p.data ?? [] }, { headers: NO });
}

/** Body: { doc: {id, status} } marks a document reading or done; { attempt: {kind, id, ok, detail?} } records one try (the source of "what mistakes am I making"). */
export async function POST(req: NextRequest) {
  const { ok, userId } = await interviewAccess();
  if (!ok || !userId) return new NextResponse(null, { status: 404 });
  const b = (await req.json().catch(() => null)) as { doc?: { id?: string; status?: string }; attempt?: { kind?: string; id?: string; ok?: boolean; detail?: unknown } } | null;
  const db = createServiceRoleClient();
  if (b?.doc?.id && (b.doc.status === "reading" || b.doc.status === "done")) {
    await db.from("interview_progress").upsert({ user_id: userId, doc_id: String(b.doc.id).slice(0, 200), status: b.doc.status, updated_at: new Date().toISOString() });
  }
  const a = b?.attempt;
  if (a?.id && typeof a.ok === "boolean" && ["lab", "sql", "card", "code"].includes(String(a.kind))) {
    const detail = JSON.parse(JSON.stringify(a.detail ?? {}).slice(0, 4000) || "{}");
    await db.from("interview_attempts").insert({ user_id: userId, item_kind: a.kind, item_id: String(a.id).slice(0, 200), ok: a.ok, detail });
  }
  return NextResponse.json({ ok: true }, { headers: NO });
}
