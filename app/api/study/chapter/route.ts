import { NextRequest, NextResponse } from "next/server";
import { chapterForViewer } from "@/lib/study/serve";
import { toWire } from "@/lib/study/schema";

/** One chapter for the signed-in viewer, with every topic they cannot open replaced by a title-only stub (lib/study/serve.ts). */
export async function GET(req: NextRequest) {
  const href = req.nextUrl.searchParams.get("href") ?? "";
  if (!/^\/study\/[a-z0-9-]+$/.test(href)) return NextResponse.json({ error: "Bad chapter." }, { status: 400 });
  const ch = await chapterForViewer(href);
  if (!ch) return NextResponse.json({ error: "No such chapter." }, { status: 404 });
  return NextResponse.json(toWire(ch), { headers: { "Cache-Control": "private, no-store" } });
}
