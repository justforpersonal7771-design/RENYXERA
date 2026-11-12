import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { BILLING_MODE } from "@/lib/billing/plans";
import { isDisposableEmail } from "@/lib/billing/server";
import { activeProvider } from "@/lib/billing/providers";
import { getUserBranch } from "@/lib/server/branch";
import { TOPUP_EXPIRY_DAYS, TOPUP_PACKS } from "@/lib/billing/ai-topups";

export const runtime = "nodejs";

const schema = z.object({
  packId: z.enum(["small", "medium", "large"]),
  acceptedTerms: z.literal(true), // no-refund acknowledgement, same as plans
});

/** The signed-in member's Mentor token balance (unexpired packs), for the Plans screen and the chat. */
export async function GET() {
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ balance: 0, signedIn: false }, { headers: { "Cache-Control": "no-store" } });
  const { data } = await createServiceRoleClient().rpc("ai_pack_balance", { p_user: userId });
  return NextResponse.json({ balance: typeof data === "number" ? data : 0, signedIn: true }, { headers: { "Cache-Control": "no-store" } });
}

/**
 * Creates a Razorpay order for a Mentor recharge pack (migration 0055). Any signed-in student may buy, Free included: a pack only adds
 * Mentor tokens and never touches the plan. The price comes from the server-side pack list, never from the client. The pack itself is
 * created by apply_paid_order when the payment is verified (webhook or /api/billing/verify), exactly once per order.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (BILLING_MODE === "interest") return NextResponse.json({ error: "Payments aren't open yet." }, { status: 409 });
  const provider = activeProvider();
  if (!provider) return NextResponse.json({ error: "Payments aren't configured yet." }, { status: 503 });
  if (!checkRateLimit(`topup:ip:${getClientKey(req)}`, { limit: 5, windowMs: 10 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in to buy a recharge." }, { status: 401 });
  if (!checkRateLimit(`topup:u:${userId}`, { limit: 5, windowMs: 60 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many checkout attempts. Please try again later." }, { status: 429 });
  }
  const email = typeof claims?.email === "string" ? claims.email : null;
  if (isDisposableEmail(email)) return NextResponse.json({ error: "Please use a permanent email address." }, { status: 403 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please accept the terms to continue." }, { status: 400 });
  const pack = TOPUP_PACKS.find((p) => p.id === parsed.data.packId)!;
  const planId = `topup_${pack.id}`;

  const db = createServiceRoleClient();
  const branch = await getUserBranch(db, userId);
  const made = await provider.createOrder({ amountPaise: pack.pricePaise, receipt: `t_${userId.slice(0, 8)}_${Date.now()}`, notes: { user_id: userId, plan_id: planId, branch }, customer: { id: userId, email }, returnUrl: `${(process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin)}/ai-mentor?paid=1` });
  if ("error" in made) return NextResponse.json({ error: made.error }, { status: 502 });
  const order = { id: made.orderId, amount: pack.pricePaise, currency: "INR" };
  const { error } = await db.from("billing_orders").insert({
    user_id: userId, plan_id: planId, amount_paise: pack.pricePaise, upgrade_credit_paise: 0, period_days: TOPUP_EXPIRY_DAYS,
    razorpay_order_id: order.id, mode: BILLING_MODE, branch_code: branch,
  });
  if (error) {
    console.error("billing_orders insert (topup) failed", error);
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 503 });
  }
  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: made.checkout.kind === "razorpay" ? made.checkout.keyId : null, checkout: made.checkout, planName: `AI Mentor recharge · ${pack.name}`, email });
}
