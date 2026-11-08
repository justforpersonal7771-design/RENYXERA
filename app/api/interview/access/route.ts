import { NextResponse } from "next/server";
import { interviewAccess } from "@/lib/server/interview";

export const runtime = "nodejs";
export async function GET() {
  const { ok } = await interviewAccess();
  return NextResponse.json({ ok }, { headers: { "Cache-Control": "private, no-store" } });
}
