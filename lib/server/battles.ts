import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export type Db = ReturnType<typeof createServiceRoleClient>;

export const FREE_ACTIVE_BATTLES = 3;
export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type BattleCtx = { userId: string | null; db: Db };

/** Common gate for the battle routes: same-origin, per-user/IP rate limit, verified account (optional for the read-only landing). */
export async function battleCtx(req: NextRequest, opts: { bucket: string; limit: number; windowMs?: number; needUser?: boolean }): Promise<BattleCtx | NextResponse> {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (opts.needUser && !userId) return NextResponse.json({ error: "Sign in to use battles.", reason: "auth" }, { status: 401 });
  const who = userId ?? req.headers.get("x-forwarded-for") ?? "guest";
  if (!checkRateLimit(`battle:${opts.bucket}:${who}`, { limit: opts.limit, windowMs: opts.windowMs ?? 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }
  return { userId, db: createServiceRoleClient() };
}

export const isCtx = (c: BattleCtx | NextResponse): c is BattleCtx => !(c instanceof NextResponse);

/** The name shown to others: display name, else username, else a neutral label. */
export async function nameOf(db: Db, userId: string): Promise<string> {
  const { data } = await db.from("profiles").select("display_name, username").eq("id", userId).maybeSingle();
  const raw = (data?.display_name || data?.username || "A friend") as string;
  return raw.replace(/[^\p{L}\p{N} .,'&_-]/gu, "").trim().slice(0, 40) || "A friend";
}

/** A finished, server-graded attempt of this user: the only source of a battle score. */
export async function gradedAttempt(db: Db, userId: string, attemptId: string) {
  const { data } = await db.from("exam_attempts")
    .select("id, user_id, status, server_score, server_max, question_ids, config, submitted_at")
    .eq("id", attemptId).maybeSingle();
  if (!data || data.user_id !== userId || data.status !== "submitted" || data.server_score === null || !(Number(data.server_max) > 0)) return null;
  return data as { id: string; user_id: string; status: string; server_score: number; server_max: number; question_ids: string[]; config: { title?: string | null } | null; submitted_at: string | null };
}
