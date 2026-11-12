"use client";

/**
 * Opens whichever provider's checkout the server returned (see lib/billing/providers.ts) and confirms the payment with
 * /api/billing/verify. Razorpay: the hosted modal and its signed response. Cashfree: the Cashfree JS SDK modal, then the
 * server asks Cashfree whether the order is paid. The plan itself is only ever granted by the server.
 */
type RazorpayCheckout = { kind: "razorpay"; keyId: string; orderId: string; amount: number; currency: "INR" };
type CashfreeCheckout = { kind: "cashfree"; sessionId: string; orderId: string; env: "sandbox" | "production" };
export type CheckoutInfo = RazorpayCheckout | CashfreeCheckout;
export type OrderResponse = { orderId: string; amount: number; currency: string; keyId?: string | null; checkout?: CheckoutInfo; planName: string; email: string | null };
type Handlers = { onPaid: () => void | Promise<void>; onDismiss: () => void; onFail: (msg: string) => void; color?: string };

const load = (src: string, ready: () => boolean) => new Promise<boolean>((resolve) => {
  if (ready()) return resolve(true);
  const s = document.createElement("script");
  s.src = src; s.onload = () => resolve(true); s.onerror = () => resolve(false);
  document.body.appendChild(s);
});
const verify = (body: Record<string, unknown>) => fetch("/api/billing/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }).catch(() => null);

type RzCtor = new (o: Record<string, unknown>) => { open: () => void; on: (e: string, cb: (r: { error?: { description?: string } }) => void) => void };
type CfFactory = (o: { mode: "sandbox" | "production" }) => { checkout: (o: { paymentSessionId: string; redirectTarget: "_modal" }) => Promise<{ error?: { message?: string }; paymentDetails?: unknown; redirect?: boolean }> };

export async function openCheckout(j: OrderResponse, h: Handlers) {
  const c: CheckoutInfo = j.checkout ?? { kind: "razorpay", keyId: j.keyId ?? "", orderId: j.orderId, amount: j.amount, currency: "INR" };
  if (c.kind === "cashfree") {
    const w = window as unknown as { Cashfree?: CfFactory };
    if (!(await load("https://sdk.cashfree.com/js/v3/cashfree.js", () => !!w.Cashfree)) || !w.Cashfree) throw new Error("Couldn't load the payment window. Check your connection.");
    const res = await w.Cashfree({ mode: c.env }).checkout({ paymentSessionId: c.sessionId, redirectTarget: "_modal" });
    if (res.error) { h.onFail(res.error.message || "Payment failed. Please try again or use another method."); return; }
    if (res.paymentDetails) { await verify({ orderId: c.orderId }); await h.onPaid(); return; }
    h.onDismiss();
    return;
  }
  const w = window as unknown as { Razorpay?: RzCtor };
  if (!(await load("https://checkout.razorpay.com/v1/checkout.js", () => !!w.Razorpay)) || !w.Razorpay) throw new Error("Couldn't load the payment window. Check your connection.");
  const rz = new w.Razorpay({
    key: c.keyId, order_id: c.orderId, amount: c.amount, currency: c.currency, name: "RENYXERA", description: j.planName,
    prefill: { email: j.email ?? undefined }, theme: { color: h.color ?? "#64748b" },
    modal: { ondismiss: h.onDismiss },
    handler: async (resp: { razorpay_order_id?: string; razorpay_payment_id?: string; razorpay_signature?: string }) => {
      await verify({ orderId: resp?.razorpay_order_id, paymentId: resp?.razorpay_payment_id, signature: resp?.razorpay_signature });
      await h.onPaid();
    },
  });
  rz.on("payment.failed", (e) => h.onFail(e?.error?.description || "Payment failed. Please try again or use another method."));
  rz.open();
}
