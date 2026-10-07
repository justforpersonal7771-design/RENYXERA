import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

const schema = z.object({
  anon: z.string().regex(/^[a-z0-9]{8,40}$/),
  event: z.enum(["visit", "test_started", "test_submitted", "review_opened", "ai_used", "invite_shared", "share_clicked"]),
  branch: z.string().regex(/^[A-Z]{2,4}$/).nullable().optional(),
  source: z.string().trim().max(60).nullable().optional(),
});

/** Anonymous growth events (migration 0032). Always answers 204 so analytics never surfaces errors. */
export async function POST(req: NextRequest) {
  const done = new NextResponse(null, { status: 204 });
  if (isCrossOriginRequest(req)) return done;
  if (!checkRateLimit(`events:${getClientKey(req)}`, { limit: 120, windowMs: 10 * 60_000 }).allowed) return done;
  let parsed;
  try { parsed = schema.safeParse(JSON.parse(await req.text())); } catch { return done; }
  if (!parsed.success) return done;
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const { anon, event, branch, source } = parsed.data;
  try {
    await createServiceRoleClient().from("events").insert({ anon_id: anon, user_id: userId, event, branch: branch ?? null, source: source ?? null });
  } catch { /* table missing until migration 0032 runs — ignore */ }
  return done;
}
