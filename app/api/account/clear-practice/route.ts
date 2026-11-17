import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

/**
 * "Clear my practice history" (Profile → Data & storage). Deletes the synced records of what the student has played:
 * finished tests and practice sessions, and the Mistakes Bank. Bookmarks, chats, settings, plan, battles and Arena
 * points are kept (battle scores are server-graded records other players' results depend on).
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  if (!checkRateLimit(`clear-practice:${userId}`, { limit: 3, windowMs: 60 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Please wait a while before clearing again." }, { status: 429 });
  }
  const db = createServiceRoleClient();
  const { error, count } = await db.from("user_records").delete({ count: "exact" }).eq("user_id", userId).in("kind", ["session", "mistake"]);
  if (error) { console.error("clear-practice failed", error); return NextResponse.json({ error: "Couldn't clear your history right now." }, { status: 503 }); }
  return NextResponse.json({ cleared: count ?? 0 }, { headers: { "Cache-Control": "no-store" } });
}
