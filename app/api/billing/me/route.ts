import { NextResponse } from "next/server";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { getEntitlement, plusUpgradeCredit } from "@/lib/billing/server";
import { BILLING_MODE } from "@/lib/billing/plans";

export const runtime = "nodejs";

/** 7A: the caller's current plan, read from the server (never trusted from the client). */
export async function GET() {
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const ent = await getEntitlement(userId);
  const upgradeCreditPaise = userId && ent.tier === "plus" ? await plusUpgradeCredit(userId) : 0;
  return NextResponse.json({ ...ent, upgradeCreditPaise, signedIn: !!userId, mode: BILLING_MODE }, { headers: { "Cache-Control": "no-store" } });
}
