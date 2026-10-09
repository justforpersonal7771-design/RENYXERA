// Razorpay Checkout signature: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET), hex.
// Razorpay's own checkout returns it after a successful payment; only someone holding the key
// secret (Razorpay and this server) can produce it, so a match proves the payment is real.
export async function razorpaySignature(orderId: string, paymentId: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${orderId}|${paymentId}`));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Constant-time comparison so a wrong signature leaks nothing about the right one. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

export async function isValidPaymentSignature(orderId: string, paymentId: string, signature: string, secret: string) {
  return !!signature && safeEqual(await razorpaySignature(orderId, paymentId, secret), signature.toLowerCase());
}
