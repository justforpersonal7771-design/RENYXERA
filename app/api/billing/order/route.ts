import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { BILLING_MODE, PLANS, planById } from "@/lib/billing/plans";
import { getEntitlement, isDisposableEmail, plusUpgradeCredit, razorpayKeys, verifyTurnstile } from "@/lib/billing/server";

export const runtime = "nodejs";

const schema = z.object({
  planId: z.enum(PLANS.map((p) => p.id) as [string, ...string[]]),
  acceptedTerms: z.literal(true), // no-refund acknowledgement (7B)
  turnstileToken: z.string().max(4096).optional(),
});

/**
 * 7B: creates a Razorpay order for a signed-in member. Only when billing is in test/live
 * mode, the plan has a price, and Razorpay keys are set. The amount always comes from the
 * server-side plan config — never from the client. 7C abuse checks: origin, IP and account
 * velocity limits, disposable-email block, Turnstile (required in live mode).
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (BILLING_MODE === "interest") return NextResponse.json({ error: "Payments aren't open yet." }, { status: 409 });
  const keys = razorpayKeys();
  if (!keys) return NextResponse.json({ error: "Payments aren't configured yet." }, { status: 503 });
  if (!checkRateLimit(`order:ip:${getClientKey(req)}`, { limit: 5, windowMs: 10 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }

  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in to upgrade." }, { status: 401 });
  if (!checkRateLimit(`order:u:${userId}`, { limit: 5, windowMs: 60 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many checkout attempts. Please try again later." }, { status: 429 });
  }
  const email = typeof claims?.email === "string" ? claims.email : null;
  if (isDisposableEmail(email)) return NextResponse.json({ error: "Please use a permanent email address to upgrade." }, { status: 403 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please accept the terms to continue." }, { status: 400 });
  if (!(await verifyTurnstile(parsed.data.turnstileToken, req.headers.get("cf-connecting-ip")))) {
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 403 });
  }

  const plan = planById(parsed.data.planId);
  if (!plan || plan.pricePaise == null) return NextResponse.json({ error: "This plan isn't on sale yet." }, { status: 409 });
  // Pro members can't buy Plus (it would do nothing); Plus → Pro is prorated.
  const current = await getEntitlement(userId);
  if (current.tier === "pro" && plan.tier === "plus") return NextResponse.json({ error: "You're already on Pro." }, { status: 409 });
  const credit = current.tier === "plus" && plan.tier === "pro" ? await plusUpgradeCredit(userId) : 0;
  const amount = Math.max(100, plan.pricePaise - credit);

  const r = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${btoa(`${keys.id}:${keys.secret}`)}` },
    body: JSON.stringify({ amount, currency: "INR", receipt: `u_${userId.slice(0, 8)}_${Date.now()}`, notes: { user_id: userId, plan_id: plan.id } }),
  });
  if (!r.ok) {
    console.error("razorpay order failed", r.status, await r.text().catch(() => ""));
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 502 });
  }
  const order = (await r.json()) as { id: string; amount: number; currency: string };

  const { error } = await createServiceRoleClient().from("billing_orders").insert({
    user_id: userId, plan_id: plan.id, amount_paise: amount, upgrade_credit_paise: credit, period_days: plan.periodDays,
    razorpay_order_id: order.id, mode: BILLING_MODE,
  });
  if (error) {
    console.error("billing_orders insert failed", error);
    return NextResponse.json({ error: "Couldn't start checkout. Please try again." }, { status: 503 });
  }
  return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: keys.id, planName: plan.name, email });
}
