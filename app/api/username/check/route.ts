import { NextRequest, NextResponse } from "next/server";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { normalizeUsername, usernameProblem } from "@/lib/username";

export const runtime = "nodejs";

// Typing triggers a (debounced) check per pause, so allow a generous burst — but not
// enough to enumerate the whole username space.
const RATE_LIMIT = { limit: 40, windowMs: 60_000 };

/**
 * GET /api/username/check?u=name → { available: boolean, reason?: string }
 *
 * profiles RLS only lets a user read their own row, so availability can't be checked
 * from the browser; this route does it with the service-role client. Signed-in only
 * (it's used from the profile page), and the caller's own row never counts as a clash.
 * Comparison is case-insensitive so an older mixed-case "Adil" still blocks "adil".
 */
export async function GET(req: NextRequest) {
  const { allowed } = checkRateLimit(`username-check:${getClientKey(req)}`, RATE_LIMIT);
  if (!allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  let claims;
  try {
    claims = await getVerifiedClaims();
  } catch {
    claims = null;
  }
  if (!claims?.sub) return NextResponse.json({ error: "Sign in first." }, { status: 401 });

  const raw = req.nextUrl.searchParams.get("u") ?? "";
  const name = normalizeUsername(raw);
  const problem = usernameProblem(name);
  if (problem) return NextResponse.json({ available: false, reason: problem });

  try {
    const admin = createServiceRoleClient();
    // ilike for case-insensitivity; "_" is a LIKE wildcard, so escape it.
    const { data, error } = await admin
      .from("profiles")
      .select("id")
      .ilike("username", name.replace(/_/g, "\\_"))
      .neq("id", claims.sub)
      .limit(1);
    if (error) throw error;
    const taken = (data?.length ?? 0) > 0;
    return NextResponse.json(taken ? { available: false, reason: "That username is taken." } : { available: true });
  } catch {
    return NextResponse.json({ error: "Couldn't check right now." }, { status: 503 });
  }
}
