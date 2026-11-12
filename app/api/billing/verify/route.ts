import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { activeProvider } from "@/lib/billing/providers";
import { isValidPaymentSignature } from "@/lib/billing/verify";
import { reconcileOrder } from "@/lib/billing/receipts";
import { notifyPayment } from "@/lib/telegram/notify";

export const runtime = "nodejs";

const schema = z.object({
  orderId: z.string().regex(/^[A-Za-z0-9_-]{6,60}$/),
  paymentId: z.string().regex(/^pay_[A-Za-z0-9]{8,40}$/).optional(),
  signature: z.string().regex(/^[A-Fa-f0-9]{64}$/).optional(),
});

/**
 * Instant activation right after checkout. Razorpay: the browser sends order id, payment id and signature; we recompute
 * HMAC-SHA256(order_id|payment_id, KEY_SECRET) and only an exact match marks the order paid. Other providers (Cashfree…):
 * the browser sends only the order id and the server asks the provider whether it was paid. Either way the browser is never
 * trusted, apply_paid_order is idempotent (a later webhook is a no-op), and the order must belong to the signed-in account.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!checkRateLimit(`verify:ip:${getClientKey(req)}`, { limit: 20, windowMs: 10 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  }
  const provider = activeProvider();
  if (!provider) return NextResponse.json({ error: "Payments aren't configured." }, { status: 503 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
  const { orderId, paymentId, signature } = parsed.data;

  const db = createServiceRoleClient();
  const { data: order } = await db.from("billing_orders").select("id, status").eq("razorpay_order_id", orderId).eq("user_id", userId).maybeSingle();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  if (provider.id === "razorpay" && paymentId && signature) {
    if (!(await isValidPaymentSignature(orderId, paymentId, signature, process.env.RAZORPAY_KEY_SECRET ?? ""))) {
      return NextResponse.json({ error: "Payment signature mismatch." }, { status: 400 });
    }
    const { data, error } = await db.rpc("apply_paid_order", { p_order: orderId, p_payment: paymentId });
    if (error) { console.error("apply_paid_order (verify) failed", error); return NextResponse.json({ error: "Couldn't activate yet — it will appear shortly." }, { status: 500 }); }
    if (data === true) await notifyPayment(db, userId, orderId);
    return NextResponse.json({ ok: true, activated: data === true });
  }
  const was = order.status;
  const r = await reconcileOrder(db, provider, orderId);
  if (r === "error") return NextResponse.json({ error: "Couldn't confirm yet — it will appear shortly." }, { status: 502 });
  if (r === "paid" && was !== "paid") await notifyPayment(db, userId, orderId);
  return NextResponse.json({ ok: true, activated: r === "paid" });
}
