import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

/**
 * Step 7 (4E): "Export my data" — everything the server holds about the caller: profile,
 * graded attempts with their responses, and devices. (The browser adds its own local
 * data — history, bookmarks, mistakes, planner — before saving the file.) Never includes
 * answer keys or anything about other users.
 */
export async function GET(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!checkRateLimit(`export:${userId}`, { limit: 5, windowMs: 60_000 }).allowed) {
    return NextResponse.json({ error: "Please wait a minute before exporting again." }, { status: 429 });
  }

  try {
    const db = createServiceRoleClient();
    const [profile, attempts, devices] = await Promise.all([
      db.from("profiles").select("*").eq("id", userId).maybeSingle(),
      db.from("exam_attempts").select("*").eq("user_id", userId).order("server_started_at", { ascending: false }).limit(2000),
      db.from("device_sessions").select("label, created_at, last_seen_at, revoked_at").eq("user_id", userId),
    ]);
    const attemptIds = (attempts.data ?? []).map((a) => a.id);
    const responses = attemptIds.length
      ? await db.from("exam_responses").select("attempt_id, question_id, selected_option_ids, nat_value, time_spent_seconds, marked_for_review, created_at").in("attempt_id", attemptIds.slice(0, 500))
      : { data: [] };

    return NextResponse.json(
      {
        account: { id: userId, email: typeof claims?.email === "string" ? claims.email : null },
        profile: profile.data ?? null,
        attempts: (attempts.data ?? []).map((a) => ({ ...a, responses: (responses.data ?? []).filter((r) => r.attempt_id === a.id) })),
        devices: devices.data ?? [],
      },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (err) {
    console.error("export failed", err);
    return NextResponse.json({ error: "Couldn't export right now." }, { status: 503 });
  }
}
