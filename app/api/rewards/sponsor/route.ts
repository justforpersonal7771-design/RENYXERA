import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

/** Minimum seconds a sponsor break must stay on screen before it can be claimed. */
const SPONSOR_SECONDS = 20;
const MAX_AGE_MS = 10 * 60_000;

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("start") }),
  z.object({ action: z.literal("claim"), token: z.string().min(20).max(400) }),
]);

const secret = () => process.env.REWARD_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
async function sign(payload: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, (c) => ({ "+": "-", "/": "_", "=": "" })[c]!);
}

/**
 * 7E: sponsor breaks → a few bonus AI requests (diminishing: +5, +3, +2, +1; max 4 a day,
 * expire at midnight IST). "start" issues a signed, time-stamped, single-use token; "claim"
 * pays out only if the token is ours, belongs to this account, is at least SPONSOR_SECONDS
 * old (the break was really on screen that long) and hasn't been used (DB nonce is unique).
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in to earn AI credits." }, { status: 401 });
  if (!secret()) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  if (!checkRateLimit(`sponsor:${userId}`, { limit: 12, windowMs: 60 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  if (parsed.data.action === "start") {
    const nonce = crypto.randomUUID().replace(/-/g, "");
    const payload = `${userId}.${nonce}.${Date.now()}`;
    return NextResponse.json({ token: `${payload}.${await sign(payload)}`, seconds: SPONSOR_SECONDS });
  }

  const parts = parsed.data.token.split(".");
  if (parts.length !== 4) return NextResponse.json({ error: "Invalid token." }, { status: 400 });
  const [uid, nonce, ts, sig] = parts;
  const payload = `${uid}.${nonce}.${ts}`;
  if (uid !== userId || sig !== (await sign(payload))) return NextResponse.json({ error: "Invalid token." }, { status: 400 });
  const age = Date.now() - Number(ts);
  if (!(age >= SPONSOR_SECONDS * 1000 - 500)) return NextResponse.json({ error: "Please watch the whole break." }, { status: 409 });
  if (age > MAX_AGE_MS) return NextResponse.json({ error: "That break expired — start a new one." }, { status: 409 });

  const { data, error } = await createServiceRoleClient().rpc("claim_sponsor_break", { p_user: userId, p_nonce: nonce });
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Already claimed." }, { status: 409 });
    console.error("claim_sponsor_break failed", error);
    return NextResponse.json({ error: "Couldn't add credits right now." }, { status: 503 });
  }
  const credits = Number(data) || 0;
  if (!credits) return NextResponse.json({ error: "You've used today's sponsor breaks. More tomorrow!" }, { status: 409 });
  return NextResponse.json({ ok: true, credits });
}
