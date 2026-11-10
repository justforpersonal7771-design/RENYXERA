import { NextRequest, NextResponse } from "next/server";
import { interviewAccess } from "@/lib/server/interview";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";
const NO = { "Cache-Control": "private, no-store" };
const KINDS = ["chapter", "revision", "glossary", "traps", "snippets"];

/**
 * No parameters: the list of documents (no bodies) plus this user's progress.
 * ?id=ID: one document with its body.
 * ?kind=revision&books=a,b,c: the bodies of every document of that kind in those books (the "Last moments" pages), at most 40.
 * 404 for everyone without access.
 */
export async function GET(req: NextRequest) {
  const { ok, userId } = await interviewAccess();
  if (!ok || !userId) return new NextResponse(null, { status: 404 });
  const db = createServiceRoleClient();
  const sp = req.nextUrl.searchParams;
  const id = sp.get("id");
  if (id) {
    const { data } = await db.from("interview_docs").select("id,book,book_title,kind,title,body,meta").eq("id", id).maybeSingle();
    return data ? NextResponse.json(data, { headers: NO }) : new NextResponse(null, { status: 404 });
  }
  const kind = sp.get("kind");
  if (kind) {
    if (!KINDS.includes(kind)) return NextResponse.json({ error: "Bad kind" }, { status: 400 });
    const books = (sp.get("books") ?? "").split(",").map((b) => b.trim()).filter(Boolean).slice(0, 40);
    let q = db.from("interview_docs").select("id,book,book_title,kind,ord,title,body").eq("kind", kind).order("book").limit(40);
    if (books.length) q = q.in("book", books);
    const { data } = await q;
    return NextResponse.json({ docs: data ?? [] }, { headers: NO });
  }
  // Labs carry their expected output in meta (up to 8 KB each); the list only needs their language, so it is picked out instead of sent whole.
  const [docs0, labs0, prog] = await Promise.all([
    db.from("interview_docs").select("id,book,book_title,kind,ord,title,meta").neq("kind", "lab").order("book").order("ord").limit(5000),
    db.from("interview_docs").select("id,book,book_title,kind,ord,title,lang:meta->>lang").eq("kind", "lab").order("book").order("ord").limit(5000),
    db.from("interview_progress").select("doc_id,status,updated_at").eq("user_id", userId).limit(5000),
  ]);
  const labs = ((labs0.data ?? []) as unknown as { id: string; book: string; book_title: string; kind: string; ord: number; title: string; lang: string | null }[]).map(({ lang, ...r }) => ({ ...r, meta: { lang: lang ?? undefined } }));
  return NextResponse.json({ docs: [...(docs0.data ?? []), ...labs], progress: prog.data ?? [] }, { headers: NO });
}
