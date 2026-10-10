import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { razorpayKeys } from "@/lib/billing/server";
import { isValidPaymentSignature } from "@/lib/billing/verify";
import { notifyPayment } from "@/lib/telegram/notify";

export const runtime = "nodejs";

const schema = z.object({
  orderId: z.string().regex(/^order_[A-Za-z0-9]{8,40}$/),
  paymentId: z.string().regex(/^pay_[A-Za-z0-9]{8,40}$/),
  signature: z.string().regex(/^[A-Fa-f0-9]{64}$/),
});

/**
 * Instant activation right after Razorpay Checkout succeeds. The browser sends the three values
 * Razorpay returns; we recompute HMAC-SHA256(order_id|payment_id, KEY_SECRET) and only on an exact
 * match mark the order paid (apply_paid_order is idempotent, so the webhook arriving later is a
 * harmless no-op). A mismatch returns 400 and grants nothing. The order must belong to the
 * signed-in account, and the amount was fixed server-side when the order was created.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!checkRateLimit(`verify:ip:${getClientKey(req)}`, { limit: 20, windowMs: 10 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }
  const keys = razorpayKeys();
  if (!keys) return NextResponse.json({ error: "Payments aren't configured." }, { status: 503 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  const { orderId, paymentId, signature } = parsed.data;

  const db = createServiceRoleClient();
  const { data: order } = await db.from("billing_orders").select("id, status").eq("razorpay_order_id", orderId).eq("user_id", userId).maybeSingle();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (!(await isValidPaymentSignature(orderId, paymentId, signature, keys.secret))) {
    return NextResponse.json({ error: "Payment signature mismatch." }, { status: 400 });
  }
  const { data, error } = await db.rpc("apply_paid_order", { p_order: orderId, p_payment: paymentId });
  if (error) {
    console.error("apply_paid_order (verify) failed", error);
    return NextResponse.json({ error: "Couldn't activate yet — it will appear shortly." }, { status: 500 });
  }
  if (data === true) await notifyPayment(db, userId, orderId);
  return NextResponse.json({ ok: true, activated: data === true });
}
