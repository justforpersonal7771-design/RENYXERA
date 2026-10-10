import { NextResponse } from "next/server";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { razorpayKeys } from "@/lib/billing/server";
import { fetchPaymentMethod, planLabel, receiptNo, type OrderRow } from "@/lib/billing/receipts";

export const runtime = "nodejs";

/** The signed-in member's own payments, newest first, shaped for the Profile → Plan & payments list and receipts. */
export async function GET() {
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const db = createServiceRoleClient();
  const { data, error } = await db.from("billing_orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
  if (error) return NextResponse.json({ error: "Couldn't load your payments." }, { status: 500 });
  const rows = (data ?? []) as OrderRow[];

  // Fill in how each paid order was paid (once), best-effort and capped so this stays fast.
  const keys = razorpayKeys();
  if (keys) {
    for (const o of rows.filter((x) => x.status === "paid" && x.razorpay_payment_id && !x.payment_method).slice(0, 3)) {
      const m = await fetchPaymentMethod(keys, o.razorpay_payment_id!);
      if (!m) continue;
      o.payment_method = m.method; o.payment_detail = m.detail;
      await db.from("billing_orders").update({ payment_method: m.method, payment_detail: m.detail }).eq("id", o.id); // no-op until migration 0034 is run
    }
  }

  const { data: prof } = await db.from("profiles").select("display_name, username").eq("id", userId).maybeSingle();
  return NextResponse.json({
    buyer: { name: prof?.display_name ?? null, username: prof?.username ?? null, email: typeof claims?.email === "string" ? claims.email : null },
    payments: rows.map((o) => {
      const from = o.paid_at ? new Date(o.paid_at) : null;
      return {
        id: o.id, receiptNo: receiptNo(o), plan: planLabel(o.plan_id), planId: o.plan_id, status: o.status, mode: o.mode,
        amountPaise: o.amount_paise, creditPaise: o.upgrade_credit_paise ?? 0, couponCode: o.coupon_code ?? null, discountPaise: o.discount_paise ?? 0, createdAt: o.created_at, paidAt: o.paid_at,
        validFrom: from?.toISOString() ?? null, periodDays: o.period_days,
        validUntil: from ? new Date(from.getTime() + o.period_days * 86400_000).toISOString() : null,
        orderId: o.razorpay_order_id, paymentId: o.razorpay_payment_id, method: o.payment_method ?? null, methodDetail: o.payment_detail ?? null, branch: o.branch_code ?? null,
      };
    }),
  }, { headers: { "Cache-Control": "no-store" } });
}
