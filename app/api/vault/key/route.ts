import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** Offline packs stay usable this long without the device checking in again. */
const OFFLINE_DAYS = 14;
const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

/**
 * Step 6b: the per-account key that encrypts downloaded packs (AES-GCM, in the browser).
 * Derived here as HMAC-SHA256(server secret, "vault:v1:<userId>") so it is stable for
 * the account — packs survive a key renewal — yet never computable in the browser. The
 * client imports it as a NON-extractable CryptoKey (script can use it, never read it)
 * and must renew it online every OFFLINE_DAYS.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) {
    return NextResponse.json({ error: "Sign in to use downloads." }, { status: 401 });
  }
  if (!checkRateLimit(`vault-key:${userId}`, RATE_LIMIT).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Downloads are unavailable right now." }, { status: 503 });
  }
  const enc = new TextEncoder();
  const hmacKey = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const raw = new Uint8Array(await crypto.subtle.sign("HMAC", hmacKey, enc.encode(`vault:v1:${userId}`)));
  const key = btoa(String.fromCharCode(...raw));

  return NextResponse.json(
    { key, userId, expiresAt: Date.now() + OFFLINE_DAYS * 86_400_000 },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
