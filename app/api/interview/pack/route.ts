import { NextRequest, NextResponse } from "next/server";
import { interviewAccess } from "@/lib/server/interview";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";
const BUCKET = "interview-private";
const FILES: Record<string, { path: string; name: string }> = {
  "last-moments": { path: "packs/last-moments-pack.pdf", name: "Last-Moments-Pack-All-Books.pdf" },
  "snippets": { path: "packs/snippet-book-all-books.pdf", name: "Snippet-Book-All-Books.pdf" },
  "traps": { path: "packs/traps-list-all-books.pdf", name: "Traps-List-All-Books.pdf" },
};

/**
 * The three quick packs as PDFs, kept in a PRIVATE storage bucket and handed out only after the same email check as the rest of the section.
 * ?name=last-moments|snippets|traps downloads one; ?list=1 says which of them have been uploaded (scripts/upload-interview-packs.mjs). 404 for everyone else.
 */
export async function GET(req: NextRequest) {
  const { ok } = await interviewAccess();
  if (!ok) return new NextResponse(null, { status: 404 });
  const db = createServiceRoleClient();
  if (req.nextUrl.searchParams.get("list")) {
    const { data } = await db.storage.from(BUCKET).list("packs", { limit: 20 });
    const have = new Set((data ?? []).map((f) => f.name));
    return NextResponse.json({ available: Object.entries(FILES).filter(([, f]) => have.has(f.path.split("/")[1])).map(([k]) => k) }, { headers: { "Cache-Control": "private, no-store" } });
  }
  const f = FILES[req.nextUrl.searchParams.get("name") ?? ""];
  if (!f) return new NextResponse(null, { status: 404 });
  const { data, error } = await db.storage.from(BUCKET).createSignedUrl(f.path, 60, { download: f.name });
  if (error || !data?.signedUrl) return new NextResponse(null, { status: 404 });
  return NextResponse.redirect(data.signedUrl, 302);
}
