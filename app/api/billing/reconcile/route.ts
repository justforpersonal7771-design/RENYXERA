import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { razorpayKeys } from "@/lib/billing/server";
import { reconcileOrder } from "@/lib/billing/receipts";

export const runtime = "nodejs";

/**
 * Hourly safety net (GitHub Action, same PREGEN_SECRET header as the other jobs): every order still "created"
 * after 3 minutes and younger than 3 days is checked with Razorpay, and paid ones are applied. Idempotent.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PREGEN_SECRET || "";
  if (!secret || req.headers.get("x-pregen-secret") !== secret) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const keys = razorpayKeys();
  if (!keys) return NextResponse.json({ error: "Payments aren't configured." }, { status: 503 });

  const db = createServiceRoleClient();
  const now = Date.now();
  const { data } = await db.from("billing_orders").select("razorpay_order_id")
    .eq("status", "created").lt("created_at", new Date(now - 3 * 60_000).toISOString()).gt("created_at", new Date(now - 3 * 86400_000).toISOString()).limit(100);
  const out = { checked: 0, applied: 0, unpaid: 0, errors: 0 };
  for (const o of data ?? []) {
    if (!o.razorpay_order_id) continue;
    out.checked++;
    const r = await reconcileOrder(db, keys, o.razorpay_order_id);
    if (r === "paid") out.applied++; else if (r === "unpaid") out.unpaid++; else out.errors++;
  }
  return NextResponse.json(out);
}
