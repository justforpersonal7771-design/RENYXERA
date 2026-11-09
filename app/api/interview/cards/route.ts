import { NextRequest, NextResponse } from "next/server";
import { interviewAccess } from "@/lib/server/interview";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";
type Row = { id: string; book: string; book_title: string; type: string; ch: string; star: boolean; front: string; back: string; more: string };

export async function GET(req: NextRequest) {
  const { ok } = await interviewAccess();
  if (!ok) return new NextResponse(null, { status: 404 });
  const db = createServiceRoleClient();
  const rows: Row[] = [];
  for (let from = 0; from < 10000; from += 1000) {
    let q = db.from("interview_cards").select("id,book,book_title,type,ch,star,front,back,more");
    const book = req.nextUrl.searchParams.get("book");
    if (book) q = q.eq("book", book);
    const { data } = await q.range(from, from + 999);
    if (!data?.length) break;
    rows.push(...(data as Row[]));
    if (data.length < 1000) break;
  }
  return NextResponse.json(rows.map((x) => ({ id: x.id, book: x.book, bookTitle: x.book_title, type: x.type, ch: x.ch, star: x.star, front: x.front, back: x.back, more: x.more })), { headers: { "Cache-Control": "private, no-store" } });
}
