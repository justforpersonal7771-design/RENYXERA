import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getEntitlement } from "@/lib/billing/server";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import type { Tier } from "@/lib/billing/plans";
import { isMember } from "@/lib/telegram/bot";
import { TELEGRAM_CHANNEL, TELEGRAM_GROUP, TG_LIMITS, type TgLimits } from "@/lib/telegram/tiers";

export type Db = ReturnType<typeof createServiceRoleClient>;
export type Account = {
  user_id: string; chat_id: number; tg_username: string | null; tg_first_name: string | null; linked_at: string;
  in_channel: boolean | null; in_group: boolean | null; checked_at: string | null; prefs: Record<string, unknown>; digest_time: string; blocked: boolean;
  last_digest: string | null; last_roll_prompt: string | null; last_weekly: string | null;
};

/** Signed-in member for an API route: same-origin + rate limit for writes. */
export async function member(req: NextRequest, opts: { write?: boolean; limit?: number } = {}): Promise<{ userId: string; db: Db } | NextResponse> {
  if (opts.write && isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!checkRateLimit(`tg:${userId}:${req.nextUrl.pathname}`, { limit: opts.limit ?? 30, windowMs: 10 * 60_000 }).allowed) return NextResponse.json({ error: "Too many requests. Try again in a few minutes." }, { status: 429 });
  return { userId, db: createServiceRoleClient() };
}

export async function accountOf(db: Db, userId: string): Promise<Account | null> {
  const { data } = await db.from("telegram_accounts").select("*").eq("user_id", userId).maybeSingle();
  return (data as Account | null) ?? null;
}

export async function tierOf(userId: string): Promise<{ tier: Tier; limits: TgLimits }> {
  const ent = await getEntitlement(userId);
  return { tier: ent.tier, limits: TG_LIMITS[ent.tier] };
}

/** Re-check channel + group membership for a linked account and store it. */
export async function refreshMembership(db: Db, acct: Pick<Account, "user_id" | "chat_id">) {
  const [inChannel, inGroup] = await Promise.all([isMember(TELEGRAM_CHANNEL, acct.chat_id), isMember(TELEGRAM_GROUP, acct.chat_id)]);
  await db.from("telegram_accounts").update({ in_channel: inChannel, in_group: inGroup, checked_at: new Date().toISOString() }).eq("user_id", acct.user_id);
  return { inChannel, inGroup };
}

export const randomCode = () => {
  const b = new Uint8Array(18);
  crypto.getRandomValues(b);
  return Array.from(b, (x) => x.toString(36).padStart(2, "0")).join("").slice(0, 28);
};
