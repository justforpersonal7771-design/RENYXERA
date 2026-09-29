import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

const schema = z.object({
  questionId: z.string().trim().min(3).max(80).regex(/^[A-Za-z0-9_.:-]+$/),
  reason: z.enum(["wrong_answer", "typo", "figure", "solution", "other"]),
  details: z.string().trim().max(1000).optional(),
  source: z.enum(["app", "public", "review"]).default("app"),
  website: z.string().max(500).optional(), // honeypot
});

/**
 * 6D: "Report an issue" on a question. Guests and members alike; service-role insert
 * (the table has no browser policies), rate-limited per IP and per account.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!checkRateLimit(`report:${getClientKey(req)}`, { limit: 10, windowMs: 10 * 60_000 }).allowed) {
    return NextResponse.json({ error: "You've sent a lot of reports — please try again in a few minutes." }, { status: 429 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid report." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });

  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (userId && !checkRateLimit(`report:u:${userId}`, { limit: 30, windowMs: 24 * 60 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Daily report limit reached — thank you for all the help!" }, { status: 429 });
  }

  try {
    const { error } = await createServiceRoleClient().from("question_reports").insert({
      question_id: parsed.data.questionId,
      reason: parsed.data.reason,
      details: parsed.data.details || null,
      user_id: userId,
      source: parsed.data.source,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("report insert failed", err);
    return NextResponse.json({ error: "Couldn't send that right now. Please try again." }, { status: 503 });
  }
}
