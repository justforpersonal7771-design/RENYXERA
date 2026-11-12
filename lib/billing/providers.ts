import "server-only";
import { BILLING_MODE } from "@/lib/billing/plans";

/**
 * Switchable payment provider. Every billing route talks to this interface, never to a gateway directly.
 * Choose the provider with BILLING_PROVIDER = razorpay | cashfree | paytm | zaakpay | phonepe (default razorpay).
 * Implemented: razorpay, cashfree. paytm, zaakpay and phonepe are declared so the switch exists; they return
 * "not configured" until their adapters are written against each provider's live docs and test keys.
 *
 * The provider's order id is stored in billing_orders.razorpay_order_id (column name kept for history; it holds any provider's id).
 */
export type ProviderId = "razorpay" | "cashfree" | "paytm" | "zaakpay" | "phonepe";

export type CreateOrderInput = { amountPaise: number; receipt: string; notes: Record<string, string>; customer: { id: string; email: string | null; phone?: string | null }; returnUrl: string };
/** What the browser needs to open the provider's checkout. */
export type Checkout =
  | { kind: "razorpay"; keyId: string; orderId: string; amount: number; currency: "INR" }
  | { kind: "cashfree"; sessionId: string; orderId: string; env: "sandbox" | "production" };
export type OrderStatus = { status: "paid" | "unpaid" | "error"; paymentId?: string; method?: string; detail?: string | null };
export type WebhookEvent = { eventId: string; orderId: string; paymentId: string | null; status: "paid" | "failed" | "other" } | null;

export interface PaymentProvider {
  id: ProviderId;
  configured(): boolean;
  createOrder(i: CreateOrderInput): Promise<{ orderId: string; checkout: Checkout } | { error: string }>;
  /** Asks the provider directly; the browser is never trusted. */
  orderStatus(orderId: string): Promise<OrderStatus>;
  /** Verifies the signature on a raw webhook body and normalises it. */
  parseWebhook(raw: string, headers: Headers): Promise<WebhookEvent>;
}

const enc = new TextEncoder();
async function hmac(secret: string, msg: string, out: "hex" | "base64") {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(msg)));
  return out === "hex" ? Array.from(sig).map((b) => b.toString(16).padStart(2, "0")).join("") : btoa(String.fromCharCode(...sig));
}
const safeEqual = (a: string, b: string) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };
const T = () => AbortSignal.timeout(10_000);

// ------------------------------------------------------------------ Razorpay
function razorpay(): PaymentProvider {
  const id = process.env.RAZORPAY_KEY_ID ?? "", secret = process.env.RAZORPAY_KEY_SECRET ?? "";
  const ok = () => !!id && !!secret && (BILLING_MODE === "live" ? id.startsWith("rzp_live_") : BILLING_MODE === "test" ? id.startsWith("rzp_test_") : true);
  const auth = { Authorization: `Basic ${btoa(`${id}:${secret}`)}` };
  return {
    id: "razorpay", configured: ok,
    async createOrder(i) {
      const r = await fetch("https://api.razorpay.com/v1/orders", { signal: T(), method: "POST", headers: { "Content-Type": "application/json", ...auth }, body: JSON.stringify({ amount: i.amountPaise, currency: "INR", receipt: i.receipt, notes: i.notes }) });
      if (!r.ok) { console.error("razorpay order failed", r.status, await r.text().catch(() => "")); return { error: "Couldn't start checkout. Please try again." }; }
      const o = (await r.json()) as { id: string; amount: number };
      return { orderId: o.id, checkout: { kind: "razorpay", keyId: id, orderId: o.id, amount: o.amount, currency: "INR" } };
    },
    async orderStatus(orderId) {
      try {
        const r = await fetch(`https://api.razorpay.com/v1/orders/${orderId}/payments`, { headers: auth, signal: T() });
        if (!r.ok) return { status: "error" };
        const j = (await r.json()) as { items?: { id: string; status: string; method?: string; card?: { last4?: string; network?: string }; bank?: string; wallet?: string }[] };
        const p = (j.items ?? []).find((x) => x.status === "captured");
        if (!p) return { status: "unpaid" };
        const method = p.method === "upi" ? "UPI" : p.method === "card" ? "Card" : p.method === "netbanking" ? "Netbanking" : p.method === "wallet" ? "Wallet" : (p.method ?? "Online");
        return { status: "paid", paymentId: p.id, method, detail: p.card?.last4 ? `····${p.card.last4}${p.card.network ? ` (${p.card.network})` : ""}` : p.bank ?? p.wallet ?? null };
      } catch { return { status: "error" }; }
    },
    async parseWebhook(raw, h) {
      const ws = process.env.RAZORPAY_WEBHOOK_SECRET; const sig = h.get("x-razorpay-signature") ?? "";
      if (!ws || !sig || !safeEqual(await hmac(ws, raw, "hex"), sig.toLowerCase())) return null;
      const e = JSON.parse(raw) as { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } }; order?: { entity?: { id?: string } } } };
      const pay = e.payload?.payment?.entity;
      const orderId = pay?.order_id ?? e.payload?.order?.entity?.id ?? "";
      const status = e.event === "payment.captured" || e.event === "order.paid" ? "paid" : e.event === "payment.failed" ? "failed" : "other";
      return { eventId: h.get("x-razorpay-event-id") ?? `${e.event}:${pay?.id ?? orderId}`, orderId, paymentId: pay?.id ?? null, status };
    },
  };
}

// ------------------------------------------------------------------ Cashfree (PG API 2023-08-01)
function cashfree(): PaymentProvider {
  const appId = process.env.CASHFREE_APP_ID ?? "", secret = process.env.CASHFREE_SECRET_KEY ?? "";
  const prod = BILLING_MODE === "live";
  const base = prod ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";
  const H = { "x-client-id": appId, "x-client-secret": secret, "x-api-version": "2023-08-01", "Content-Type": "application/json" };
  return {
    id: "cashfree", configured: () => !!appId && !!secret,
    async createOrder(i) {
      const orderId = `rx_${i.receipt}`.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 45);
      const r = await fetch(`${base}/orders`, { signal: T(), method: "POST", headers: H, body: JSON.stringify({
        order_id: orderId, order_amount: i.amountPaise / 100, order_currency: "INR", order_note: i.notes.plan_id ?? "",
        customer_details: { customer_id: i.customer.id.slice(0, 50), customer_email: i.customer.email ?? undefined, customer_phone: i.customer.phone || "9999999999" },
        order_meta: { return_url: `${i.returnUrl}${i.returnUrl.includes("?") ? "&" : "?"}order_id={order_id}` }, order_tags: i.notes,
      }) });
      if (!r.ok) { console.error("cashfree order failed", r.status, await r.text().catch(() => "")); return { error: "Couldn't start checkout. Please try again." }; }
      const o = (await r.json()) as { order_id: string; payment_session_id: string };
      return { orderId: o.order_id, checkout: { kind: "cashfree", sessionId: o.payment_session_id, orderId: o.order_id, env: prod ? "production" : "sandbox" } };
    },
    async orderStatus(orderId) {
      try {
        const r = await fetch(`${base}/orders/${encodeURIComponent(orderId)}/payments`, { headers: H, signal: T() });
        if (!r.ok) return { status: "error" };
        const list = (await r.json()) as { cf_payment_id: string | number; payment_status: string; payment_group?: string; payment_method?: { card?: { card_number?: string; card_network?: string }; upi?: { upi_id?: string } } }[];
        const p = list.find((x) => x.payment_status === "SUCCESS");
        if (!p) return { status: "unpaid" };
        const g = p.payment_group ?? "";
        const method = /upi/.test(g) ? "UPI" : /card/.test(g) ? "Card" : /net_banking/.test(g) ? "Netbanking" : /wallet/.test(g) ? "Wallet" : "Online";
        const last4 = p.payment_method?.card?.card_number?.slice(-4);
        return { status: "paid", paymentId: String(p.cf_payment_id), method, detail: last4 ? `····${last4}${p.payment_method?.card?.card_network ? ` (${p.payment_method.card.card_network})` : ""}` : null };
      } catch { return { status: "error" }; }
    },
    async parseWebhook(raw, h) {
      const sig = h.get("x-webhook-signature") ?? "", ts = h.get("x-webhook-timestamp") ?? "";
      if (!secret || !sig || !ts || !safeEqual(await hmac(secret, ts + raw, "base64"), sig)) return null;
      const e = JSON.parse(raw) as { type?: string; data?: { order?: { order_id?: string }; payment?: { cf_payment_id?: string | number; payment_status?: string } } };
      const orderId = e.data?.order?.order_id ?? "", pid = e.data?.payment?.cf_payment_id;
      const status = e.type === "PAYMENT_SUCCESS_WEBHOOK" ? "paid" : e.type === "PAYMENT_FAILED_WEBHOOK" ? "failed" : "other";
      return { eventId: `${e.type}:${pid ?? orderId}:${ts}`, orderId, paymentId: pid != null ? String(pid) : null, status };
    },
  };
}

// ------------------------------------------------------------------ declared, not yet implemented
function pending(id: ProviderId): PaymentProvider {
  const no = async () => ({ error: `${id} isn't connected yet.` });
  return { id, configured: () => false, createOrder: no, orderStatus: async () => ({ status: "error" }), parseWebhook: async () => null };
}

export function providerById(id: ProviderId): PaymentProvider {
  switch (id) {
    case "razorpay": return razorpay();
    case "cashfree": return cashfree();
    default: return pending(id);
  }
}
/** The active provider (BILLING_PROVIDER), or null when it has no keys. */
export function activeProvider(): PaymentProvider | null {
  const id = (process.env.BILLING_PROVIDER ?? "razorpay").toLowerCase() as ProviderId;
  const p = providerById(["razorpay", "cashfree", "paytm", "zaakpay", "phonepe"].includes(id) ? id : "razorpay");
  return p.configured() ? p : null;
}
