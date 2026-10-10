import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { planById } from "@/lib/billing/plans";
import { getEntitlement, plusUpgradeCredit } from "@/lib/billing/server";
import { evaluateCoupon } from "@/lib/billing/coupons";

export const runtime = "nodejs";

const schema = z.object({ planId: z.string().regex(/^(plus|pro)_(monthly|yearly|season_\d{4})$/), code: z.string().trim().min(3).max(32) });

/** "Apply" on the coupon box: tells the member what the code takes off, using the same rules the order uses. */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!checkRateLimit(`coupon:${userId}`, { limit: 15, windowMs: 10 * 60_000 }).allowed) return NextResponse.json({ error: "Too many tries. Please wait a few minutes." }, { status: 429 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a coupon code." }, { status: 400 });
  const plan = planById(parsed.data.planId, Date.now());
  if (!plan || plan.pricePaise == null) return NextResponse.json({ error: "Unknown plan." }, { status: 400 });
  const current = await getEntitlement(userId);
  const credit = current.tier === "plus" && plan.tier === "pro" ? await plusUpgradeCredit(userId) : 0;
  const base = Math.max(100, plan.pricePaise - credit);
  const r = await evaluateCoupon(createServiceRoleClient(), userId, parsed.data.code, plan.id, base);
  if (!r.ok) return NextResponse.json({ valid: false, reason: r.reason });
  return NextResponse.json({ valid: true, code: r.code, label: r.label, discountPaise: r.discountPaise, finalPaise: Math.max(100, base - r.discountPaise) });
}
