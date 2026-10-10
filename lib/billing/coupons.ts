import "server-only";
import type { createServiceRoleClient } from "@/lib/supabase/service-role";

type Db = ReturnType<typeof createServiceRoleClient>;
export type CouponResult = { ok: true; code: string; discountPaise: number; label: string } | { ok: false; reason: string };

const MIN_PAISE = 100;

/**
 * Checks a coupon for this member and plan, and works out the discount from the price they would otherwise pay.
 * Rules: active, not expired, valid for the plan, each member can use a code once (after a paid order), and a code with
 * a use limit counts paid uses plus recent unpaid ones so it cannot be over-issued. Never trusts the browser.
 */
export async function evaluateCoupon(db: Db, userId: string, codeRaw: string, planId: string, basePaise: number): Promise<CouponResult> {
  const code = codeRaw.trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,32}$/.test(code)) return { ok: false, reason: "That code doesn't look right." };
  const { data: c, error } = await db.from("coupons").select("*").eq("code", code).maybeSingle();
  if (error) return { ok: false, reason: "Coupons aren't available right now." };
  if (!c || !c.active) return { ok: false, reason: "That code isn't valid." };
  if (c.expires_at && Date.parse(c.expires_at) < Date.now()) return { ok: false, reason: "That code has expired." };
  if (Array.isArray(c.plans) && c.plans.length && !c.plans.includes(planId)) return { ok: false, reason: "That code doesn't apply to this plan." };

  const { data: reds } = await db.from("coupon_redemptions").select("user_id, razorpay_order_id, created_at").eq("code", code);
  if (reds?.length) {
    const { data: paid } = await db.from("billing_orders").select("razorpay_order_id").in("razorpay_order_id", reds.map((r) => r.razorpay_order_id)).eq("status", "paid");
    const paidIds = new Set((paid ?? []).map((p) => p.razorpay_order_id as string));
    if (reds.some((r) => r.user_id === userId && paidIds.has(r.razorpay_order_id))) return { ok: false, reason: "You've already used this code." };
    if (c.max_uses != null) {
      const recent = Date.now() - 30 * 60_000;
      const used = reds.filter((r) => paidIds.has(r.razorpay_order_id) || Date.parse(r.created_at) > recent).length;
      if (used >= c.max_uses) return { ok: false, reason: "That code has been fully used." };
    }
  }
  const raw = c.percent_off != null ? Math.floor((basePaise * c.percent_off) / 100) : (c.amount_off_paise as number);
  const discountPaise = Math.max(0, Math.min(raw, basePaise - MIN_PAISE));
  if (discountPaise <= 0) return { ok: false, reason: "That code doesn't reduce this price." };
  return { ok: true, code, discountPaise, label: c.percent_off != null ? `${c.percent_off}% off` : `₹${(c.amount_off_paise / 100).toLocaleString("en-IN")} off` };
}
