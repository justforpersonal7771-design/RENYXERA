import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

/** GATE pacing: 180 minutes for 100 marks → 108 seconds per mark. */
const SECONDS_PER_MARK = 108;

const bodySchema = z.object({
  attempt_id: z.string().uuid(),
  question_ids: z.array(z.string().min(1).max(120)).min(1).max(200),
  mode: z.enum(["practice", "graded"]).default("practice"),
  title: z.string().max(200).optional(),
});

/**
 * Step 11 (5B attempt token): records a signed-in attempt when it STARTS — server start
 * time, the exact question set and a server-computed time limit — so submission can be
 * checked against it (question set, time). Idempotent: re-starting/resuming the same
 * attempt id keeps the original start. Offline starts simply have no token; their
 * submission is stored with a "no_start_token" flag instead.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  if (!checkRateLimit(`exam-start:${userId}`, { limit: 20, windowMs: 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const ids = [...new Set(parsed.data.question_ids)];
  try {
    const db = createServiceRoleClient();
    const { data: existing } = await db.from("exam_attempts").select("id, user_id, server_started_at, duration_seconds, status").eq("id", parsed.data.attempt_id).maybeSingle();
    if (existing) {
      if (existing.user_id !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      return NextResponse.json({ started_at: existing.server_started_at, duration_seconds: existing.duration_seconds, status: existing.status });
    }
    // Time limit from the official questions' marks (AI-generated ids aren't in the bank).
    const { data: qs } = await db.from("questions").select("id, marks").in("id", ids.filter((i) => /^GATE_/.test(i)));
    const markOf = new Map((qs ?? []).map((q) => [q.id, Number(q.marks) || 1]));
    const duration = ids.reduce((sum, id) => sum + (markOf.get(id) ?? 1) * SECONDS_PER_MARK, 0);
    const now = new Date().toISOString();
    const { error } = await db.from("exam_attempts").insert({
      id: parsed.data.attempt_id,
      user_id: userId,
      branch_code: "CSE",
      config: { title: parsed.data.title ?? null },
      question_ids: ids,
      mode: parsed.data.mode,
      server_started_at: now,
      duration_seconds: duration,
      status: "in_progress",
    });
    if (error && error.code !== "23505") throw error;
    return NextResponse.json({ started_at: now, duration_seconds: duration, status: "in_progress" });
  } catch (err) {
    console.error("exam start failed", err);
    return NextResponse.json({ error: "Couldn't register the attempt." }, { status: 503 });
  }
}
