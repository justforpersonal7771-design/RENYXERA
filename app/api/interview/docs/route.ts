import { NextRequest, NextResponse } from "next/server";
import { interviewAccess } from "@/lib/server/interview";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";
const NO = { "Cache-Control": "private, no-store" };

/** No id: the list of documents (no bodies) plus this user's progress. With ?id=: one document. 404 for everyone without access. */
export async function GET(req: NextRequest) {
  const { ok, userId } = await interviewAccess();
  if (!ok || !userId) return new NextResponse(null, { status: 404 });
  const db = createServiceRoleClient();
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    const { data } = await db.from("interview_docs").select("id,book,book_title,kind,title,body,meta").eq("id", id).maybeSingle();
    return data ? NextResponse.json(data, { headers: NO }) : new NextResponse(null, { status: 404 });
  }
  const [docs, prog] = await Promise.all([
    db.from("interview_docs").select("id,book,book_title,kind,ord,title,meta").order("book").order("ord").limit(5000),
    db.from("interview_progress").select("doc_id,status").eq("user_id", userId).limit(5000),
  ]);
  return NextResponse.json({ docs: docs.data ?? [], progress: prog.data ?? [] }, { headers: NO });
}
