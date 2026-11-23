import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { sharedCacheKey } from "@/lib/ai/shared-cache";
import { getUserBranch, questionsOutsideBranch } from "@/lib/server/branch";

export const runtime = "nodejs";

/**
 * Written solutions for official PYQs ("Show solution"). Read-only: the solutions are written in the background (app/api/ai/pregen)
 * and stored once for everyone, so this never calls a model and never spends anyone's allowance.
 *   GET ?ids=a,b,c  → { have: [ids that have a written solution] }   (up to 80, for showing the button only where it leads somewhere)
 *   GET ?id=a       → { solution: {...} | null }
 * Signed-in members only, for questions of their own branch.
 */
const NO = { "Cache-Control": "private, no-store" };
const ID = /^GATE_[A-Za-z0-9_-]{3,60}$/;

export async function GET(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in to see solutions.", reason: "auth" }, { status: 401, headers: NO });
  if (!checkRateLimit(`solution:${userId}`, { limit: 120, windowMs: 60_000 }).allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429, headers: NO });

  const one = req.nextUrl.searchParams.get("id");
  const many = (req.nextUrl.searchParams.get("ids") ?? "").split(",").map((x) => x.trim()).filter(Boolean).slice(0, 80);
  const ids = one ? [one] : many;
  if (!ids.length || ids.some((i) => !ID.test(i))) return NextResponse.json({ error: "Invalid request." }, { status: 400, headers: NO });

  const db = createServiceRoleClient();
  const branch = await getUserBranch(db, userId);
  if (questionsOutsideBranch(ids, branch).length) return NextResponse.json({ error: "Not available for your branch." }, { status: 403, headers: NO });

  const keys = await Promise.all(ids.map((i) => sharedCacheKey("SOLUTION", i)));
  const byKey = new Map(keys.map((k, n) => [k, ids[n]]));
  const { data, error } = await db.from("ai_response_cache").select("prompt_hash, response").in("prompt_hash", keys);
  if (error) return NextResponse.json({ error: "Couldn't load that right now." }, { status: 503, headers: NO });
  const found = new Map<string, string>((data ?? []).map((r) => [byKey.get(r.prompt_hash as string) as string, r.response as string]));

  if (one) {
    const raw = found.get(one);
    if (!raw) return NextResponse.json({ solution: null }, { headers: NO });
    try { return NextResponse.json({ solution: JSON.parse(raw) }, { headers: NO }); } catch { return NextResponse.json({ solution: null }, { headers: NO }); }
  }
  return NextResponse.json({ have: [...found.keys()] }, { headers: NO });
}
