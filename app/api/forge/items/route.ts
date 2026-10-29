import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getEntitlement } from "@/lib/billing/server";
import { FORGE } from "@/lib/billing/plans";
import { getUserBranch } from "@/lib/server/branch";
import { teaserIds } from "@/lib/server/forge-keys";

export const runtime = "nodejs";

/**
 * Forge questions (R11-A3). Public half only — answers stay in forge_answers and unlock after
 * submit like PYQ keys. Plus and Pro only (Free: 403 reason "plan"; Free gets Forge Mocks).
 *   GET /api/forge/items?set=daily        today's Daily Forge for the account's branch
 *   GET /api/forge/items?set=practice&topic=…  released practice items (Pro: also the archive)
 */
export async function GET(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in to use Forge.", reason: "auth" }, { status: 401 });
  if (!checkRateLimit(`forge:${userId}`, { limit: 30, windowMs: 60_000 }).allowed) return NextResponse.json({ error: "Too many requests." }, { status: 429 });

  const ent = await getEntitlement(userId);
  const rules = FORGE[ent.tier];
  const db = createServiceRoleClient();
  const branch = await getUserBranch(db, userId);

  if (!rules.questions) {
    // Free is not blocked: the 10 taster questions in full, plus the other released questions as locked cards (no text, no options).
    const ids = await teaserIds(db, branch, rules.teaser);
    const [{ data: items }, { data: locked }] = await Promise.all([
      ids.length ? db.from("forge_items").select("id, branch, subject, topic, kind, difficulty, question_type, marks, question_text, options, images, release_at").in("id", ids) : Promise.resolve({ data: [] }),
      db.from("forge_items").select("id, subject, topic, kind, difficulty, question_type, marks")
        .eq("branch", branch).eq("status", "approved").eq("mock_only", false).neq("difficulty", "X").lte("release_at", new Date().toISOString())
        .not("id", "in", `(${ids.join(",") || "none"})`).order("release_at", { ascending: false }).limit(9),
    ]);
    return NextResponse.json({ items: items ?? [], locked: locked ?? [], tier: ent.tier, set: "teaser" }, { headers: { "Cache-Control": "private, no-store" } });
  }
  const set = req.nextUrl.searchParams.get("set") === "practice" ? "practice" : "daily";
  const topic = req.nextUrl.searchParams.get("topic");

  let q = db.from("forge_items")
    .select("id, branch, subject, topic, kind, difficulty, question_type, marks, question_text, options, images, release_at")
    .eq("branch", branch).eq("status", "approved").eq("mock_only", false).lte("release_at", new Date().toISOString());
  if (!rules.hardX) q = q.neq("difficulty", "X");
  if (set === "daily") {
    const istMidnight = new Date(Math.floor((Date.now() + 5.5 * 3600_000) / 86_400_000) * 86_400_000 - 5.5 * 3600_000).toISOString();
    q = q.gte("release_at", istMidnight).order("id").limit(rules.dailyLimit ?? 10);
  } else {
    if (topic) q = q.eq("topic", topic);
    if (!rules.archive) {
      // Plus: the last 7 days of released items only (archive is Pro).
      q = q.gte("release_at", new Date(Date.now() - 7 * 86_400_000).toISOString());
    }
    q = q.order("release_at", { ascending: false }).limit(60);
  }
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: "Forge is not available yet." }, { status: 503 });
  return NextResponse.json({ items: data ?? [], tier: ent.tier, set }, { headers: { "Cache-Control": "private, no-store" } });
}
