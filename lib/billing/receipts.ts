import "server-only";
import { planById } from "@/lib/billing/plans";
import type { createServiceRoleClient } from "@/lib/supabase/service-role";

type Db = ReturnType<typeof createServiceRoleClient>;
type Keys = { id: string; secret: string };

export type OrderRow = {
  id: number; plan_id: string; amount_paise: number; upgrade_credit_paise?: number | null; period_days: number;
  razorpay_order_id: string | null; razorpay_payment_id: string | null; status: string; mode: string;
  created_at: string; paid_at: string | null; branch_code?: string | null; payment_method?: string | null; payment_detail?: string | null;
};

/** Human plan name for any plan id, including season passes (which no longer need a live price lookup). */
export function planLabel(planId: string): string {
  const fixed = planById(planId, 0);
  if (fixed) return fixed.name;
  const m = /^(plus|pro)_season_(\d{4})$/.exec(planId);
  if (m) return `${m[1] === "pro" ? "Pro" : "Plus"} · GATE ${m[2]} Pass`;
  return planId;
}

/** Sequential-looking receipt number that is stable for an order: RX-YYYYMM-000123. */
export function receiptNo(o: Pick<OrderRow, "id" | "paid_at" | "created_at">): string {
  const d = new Date(o.paid_at ?? o.created_at);
  return `RX-${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(o.id).padStart(6, "0")}`;
}

const auth = (k: Keys) => ({ Authorization: `Basic ${btoa(`${k.id}:${k.secret}`)}` });

/** What paid: "UPI", "Card ····1234 (visa)", "Netbanking", "Wallet" — no full card numbers or UPI ids are kept. */
export async function fetchPaymentMethod(k: Keys, paymentId: string): Promise<{ method: string; detail: string | null } | null> {
  try {
    const r = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, { headers: auth(k) });
    if (!r.ok) return null;
    const p = (await r.json()) as { method?: string; card?: { last4?: string; network?: string }; bank?: string; wallet?: string };
    const method = p.method === "upi" ? "UPI" : p.method === "card" ? "Card" : p.method === "netbanking" ? "Netbanking" : p.method === "wallet" ? "Wallet" : (p.method ?? "Online");
    const detail = p.card?.last4 ? `····${p.card.last4}${p.card.network ? ` (${p.card.network})` : ""}` : p.bank ?? p.wallet ?? null;
    return { method, detail };
  } catch { return null; }
}

/**
 * Safety net for the payment → plan step: asks Razorpay whether this order was actually paid and, if so,
 * applies it (idempotent). Covers a closed tab, a missed webhook or a failed verify call, so nobody who
 * paid is ever left without their plan. Returns "paid" when the plan was (or already is) granted.
 */
export async function reconcileOrder(db: Db, k: Keys, razorpayOrderId: string): Promise<"paid" | "unpaid" | "error"> {
  try {
    const r = await fetch(`https://api.razorpay.com/v1/orders/${razorpayOrderId}/payments`, { headers: auth(k) });
    if (!r.ok) return "error";
    const j = (await r.json()) as { items?: { id: string; status: string }[] };
    const paid = (j.items ?? []).find((p) => p.status === "captured");
    if (!paid) return "unpaid";
    const { error } = await db.rpc("apply_paid_order", { p_order: razorpayOrderId, p_payment: paid.id });
    return error ? "error" : "paid";
  } catch { return "error"; }
}
