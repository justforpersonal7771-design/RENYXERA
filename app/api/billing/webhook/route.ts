import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { notifyPayment } from "@/lib/telegram/notify";

export const runtime = "nodejs";

async function hmacHex(secret: string, body: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/**
 * 7B: Razorpay webhook — the ONLY thing that grants Pro. Signature-verified over the raw
 * body with RAZORPAY_WEBHOOK_SECRET, and idempotent: each event id is stored once, and
 * apply_paid_order() only flips an order that isn't already paid.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 503 });
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  if (!sig || !safeEqual(await hmacHex(secret, raw), sig)) return NextResponse.json({ error: "Bad signature" }, { status: 400 });

  let evt: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } }; order?: { entity?: { id?: string } } } };
  try { evt = JSON.parse(raw); } catch { return NextResponse.json({ error: "Bad payload" }, { status: 400 }); }
  const eventId = req.headers.get("x-razorpay-event-id") ?? "";
  const db = createServiceRoleClient();

  if (eventId) {
    const { error } = await db.from("billing_events").insert({ event_id: eventId.slice(0, 80), event: evt.event ?? "unknown", payload: evt });
    if (error?.code === "23505") return NextResponse.json({ ok: true, duplicate: true });
    if (error) { console.error("billing_events insert failed", error); return NextResponse.json({ error: "Retry" }, { status: 500 }); }
  }

  if (evt.event === "payment.captured" || evt.event === "order.paid") {
    const payment = evt.payload?.payment?.entity;
    const orderId = payment?.order_id ?? evt.payload?.order?.entity?.id;
    if (orderId && payment?.id) {
      const { data: applied, error } = await db.rpc("apply_paid_order", { p_order: orderId, p_payment: payment.id });
      if (error) { console.error("apply_paid_order failed", error); return NextResponse.json({ error: "Retry" }, { status: 500 }); }
      if (applied === true) { const { data: ord } = await db.from("billing_orders").select("user_id").eq("razorpay_order_id", orderId).maybeSingle(); if (ord?.user_id) await notifyPayment(db, ord.user_id, orderId); }
    }
  } else if (evt.event === "payment.failed") {
    const orderId = evt.payload?.payment?.entity?.order_id;
    if (orderId) await db.from("billing_orders").update({ status: "failed" }).eq("razorpay_order_id", orderId).eq("status", "created");
  }
  return NextResponse.json({ ok: true });
}
