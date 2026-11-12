import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { providerById, type ProviderId } from "@/lib/billing/providers";
import { notifyPayment } from "@/lib/telegram/notify";

export const runtime = "nodejs";

/**
 * Payment webhook for every provider — the authority that grants plans. The provider is recognised from its signature header
 * (x-razorpay-signature, or Cashfree's x-webhook-signature), so old Razorpay events still land after a switch. Signature-verified
 * over the raw body, idempotent (each event id stored once; apply_paid_order only flips an unpaid order).
 */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  const id: ProviderId | null = req.headers.get("x-razorpay-signature") ? "razorpay" : req.headers.get("x-webhook-signature") ? "cashfree" : null;
  if (!id) return NextResponse.json({ error: "Unknown sender" }, { status: 400 });
  let evt;
  try { evt = await providerById(id).parseWebhook(raw, req.headers); } catch { return NextResponse.json({ error: "Bad payload" }, { status: 400 }); }
  if (!evt) return NextResponse.json({ error: "Bad signature" }, { status: 400 });

  const db = createServiceRoleClient();
  const { error: dup } = await db.from("billing_events").insert({ event_id: `${id}:${evt.eventId}`.slice(0, 80), event: `${id}:${evt.status}`, payload: JSON.parse(raw) });
  if (dup?.code === "23505") return NextResponse.json({ ok: true, duplicate: true });
  if (dup) { console.error("billing_events insert failed", dup); return NextResponse.json({ error: "Retry" }, { status: 500 }); }

  if (evt.status === "paid" && evt.orderId && evt.paymentId) {
    const { data: applied, error } = await db.rpc("apply_paid_order", { p_order: evt.orderId, p_payment: evt.paymentId });
    if (error) { console.error("apply_paid_order failed", error); return NextResponse.json({ error: "Retry" }, { status: 500 }); }
    if (applied === true) { const { data: ord } = await db.from("billing_orders").select("user_id").eq("razorpay_order_id", evt.orderId).maybeSingle(); if (ord?.user_id) await notifyPayment(db, ord.user_id, evt.orderId); }
  } else if (evt.status === "failed" && evt.orderId) {
    await db.from("billing_orders").update({ status: "failed" }).eq("razorpay_order_id", evt.orderId).eq("status", "created");
  }
  return NextResponse.json({ ok: true });
}
