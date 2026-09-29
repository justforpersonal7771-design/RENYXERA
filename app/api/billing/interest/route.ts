import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { PLANS } from "@/lib/billing/plans";

export const runtime = "nodejs";

const schema = z.object({
  planId: z.enum(PLANS.map((p) => p.id) as [string, ...string[]]),
  source: z.string().trim().max(40).regex(/^[a-z_]+$/).default("pro_page"),
});

/** 7A fake door: "Upgrade to Pro" before payments are switched on — records interest only. */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!checkRateLimit(`interest:${getClientKey(req)}`, { limit: 10, windowMs: 10 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  try {
    const { error } = await createServiceRoleClient().from("pro_interest").insert({ user_id: userId, plan_id: parsed.data.planId, source: parsed.data.source });
    if (error && error.code !== "23505") throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("pro_interest insert failed", err);
    return NextResponse.json({ error: "Couldn't save that right now." }, { status: 503 });
  }
}
