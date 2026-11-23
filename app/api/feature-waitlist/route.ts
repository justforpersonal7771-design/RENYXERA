import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getUserBranch } from "@/lib/server/branch";

export const runtime = "nodejs";

const schema = z.object({ feature: z.enum(["forge", "study"]) });

/**
 * "Notify me" for a feature the member's branch does not have yet (migration 0064). Members only: it is stored against the account
 * and the branch it is on, so the owner can see demand per branch and tell people when it opens.
 *   GET  ?feature=forge  → { joined } for this account and branch
 *   POST { feature }     → joins (idempotent)
 */
async function who() {
  const claims = await getVerifiedClaims().catch(() => null);
  return typeof claims?.sub === "string" ? claims.sub : null;
}

export async function GET(req: NextRequest) {
  const userId = await who(); if (!userId) return NextResponse.json({ joined: false, signedIn: false });
  const f = schema.safeParse({ feature: req.nextUrl.searchParams.get("feature") }); if (!f.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const db = createServiceRoleClient(); const branch = await getUserBranch(db, userId);
  const { data } = await db.from("feature_waitlist").select("user_id").eq("user_id", userId).eq("branch_code", branch).eq("feature", f.data.feature).maybeSingle();
  return NextResponse.json({ joined: !!data, branch, signedIn: true }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const userId = await who(); if (!userId) return NextResponse.json({ error: "Sign in to get notified." }, { status: 401 });
  if (!checkRateLimit(`fwl:${userId}`, { limit: 10, windowMs: 10 * 60_000 }).allowed) return NextResponse.json({ error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  const f = schema.safeParse(await req.json().catch(() => null)); if (!f.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const db = createServiceRoleClient(); const branch = await getUserBranch(db, userId);
  const { error } = await db.from("feature_waitlist").insert({ user_id: userId, branch_code: branch, feature: f.data.feature });
  if (error && error.code !== "23505") { console.error("feature waitlist insert failed", error); return NextResponse.json({ error: "Couldn't save that right now. Please try again." }, { status: 503 }); }
  return NextResponse.json({ ok: true, already: error?.code === "23505", branch });
}
