import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type Entitlement = { plan: "free" | "pro"; pro: boolean; validUntil: string | null };

/**
 * Server-side entitlement check (7A) — the source of truth for every gated action. Never
 * trust a client flag. Fails closed to "free" (a DB hiccup never grants Pro).
 */
export async function getEntitlement(userId: string | null): Promise<Entitlement> {
  if (!userId) return { plan: "free", pro: false, validUntil: null };
  try {
    const { data } = await createServiceRoleClient().from("entitlements").select("plan, valid_until").eq("user_id", userId).maybeSingle();
    const validUntil = data?.valid_until ?? null;
    const pro = data?.plan === "pro" && !!validUntil && Date.parse(validUntil) > Date.now();
    return { plan: pro ? "pro" : "free", pro, validUntil };
  } catch {
    return { plan: "free", pro: false, validUntil: null };
  }
}

/** Razorpay credentials for the current mode, or null when checkout isn't configured. */
export function razorpayKeys() {
  const id = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  return id && secret ? { id, secret } : null;
}

// Disposable / throwaway email domains commonly used for card-testing and trial abuse (7C).
const DISPOSABLE = new Set(["mailinator.com", "10minutemail.com", "guerrillamail.com", "tempmail.com", "temp-mail.org", "yopmail.com", "trashmail.com", "sharklasers.com", "getnada.com", "dispostable.com", "maildrop.cc", "throwawaymail.com", "fakeinbox.com", "mintemail.com", "mohmal.com", "emailondeck.com"]);
export const isDisposableEmail = (email: string | null | undefined) => !!email && DISPOSABLE.has(email.split("@")[1]?.toLowerCase() ?? "");

/** Cloudflare Turnstile server-side verification (7C, checkout). */
export async function verifyTurnstile(token: string | undefined, ip: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return process.env.NEXT_PUBLIC_BILLING_MODE !== "live"; // required only for live payments
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) });
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const j = (await r.json()) as { success?: boolean };
    return !!j.success;
  } catch { return false; }
}
