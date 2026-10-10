import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { razorpayKeys } from "@/lib/billing/server";
import { reconcileOrder } from "@/lib/billing/receipts";

export const runtime = "nodejs";

const schema = z.object({ orderId: z.string().regex(/^order_[A-Za-z0-9]{8,40}$/) });

/**
 * "I paid but my plan isn't showing": asks Razorpay directly whether this member's order was paid and, if it was,
 * grants the plan. Only the member's own orders; Razorpay is the judge, never the browser.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!checkRateLimit(`recheck:ip:${getClientKey(req)}`, { limit: 20, windowMs: 10 * 60_000 }).allowed) return NextResponse.json({ error: "Too many attempts." }, { status: 429 });
  const keys = razorpayKeys();
  if (!keys) return NextResponse.json({ error: "Payments aren't configured." }, { status: 503 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const db = createServiceRoleClient();
  const { data: order } = await db.from("billing_orders").select("id").eq("razorpay_order_id", parsed.data.orderId).eq("user_id", userId).maybeSingle();
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  const result = await reconcileOrder(db, keys, parsed.data.orderId);
  if (result === "error") return NextResponse.json({ error: "Couldn't check with the payment provider right now. Try again in a minute." }, { status: 502 });
  return NextResponse.json({ result });
}
