import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { branchMismatch, getUserBranch, questionsOutsideBranch } from "@/lib/server/branch";
import { DEFAULT_BRANCH, isBranchCode } from "@/lib/branches";
import { BRANCH_COOKIE } from "@/lib/branch/current";

export const runtime = "nodejs";

/**
 * Step 6 (5A): unlocks answer keys. The public question bank has none; the client asks
 * here for a submitted test's questions, or for one question when a practice screen
 * checks an answer. Answers are read with the service role from question_answers (no
 * RLS policy for anon/authenticated). Batches are capped and rate-limited per user (or
 * per IP for guests) so the key can't be pulled in bulk by a script.
 */
const bodySchema = z.object({
  question_ids: z.array(z.string().regex(/^[A-Za-z0-9_-]{1,120}$/)).min(1).max(100),
});

const DAILY_ANSWER_CAP = 800;

const LIMITS = {
  user: { limit: 40, windowMs: 60_000 },
  guest: { limit: 12, windowMs: 60_000 },
};

export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const who = userId ? `u:${userId}` : `ip:${getClientKey(req)}`;
  const { allowed } = checkRateLimit(`answers:${who}`, userId ? LIMITS.user : LIMITS.guest);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  // Guests get smaller batches: enough to review their own capped tests.
  const ids = [...new Set(parsed.data.question_ids)].slice(0, userId ? 100 : 40);

  try {
    const db = createServiceRoleClient();
    // Multi-branch (§6): accounts get keys for their own branch only; guests for the branch
    // they are browsing (cookie, any branch open to guests).
    const guestBranch = req.cookies.get(BRANCH_COOKIE)?.value;
    const branch = userId ? await getUserBranch(db, userId) : (isBranchCode(guestBranch) ? guestBranch : DEFAULT_BRANCH);
    if (questionsOutsideBranch(ids, branch).length) return branchMismatch();
    // Per-account daily cap (5D): far above real use (a paper is 65; keys already seen are
    // cached on the device), low enough that scripting the whole key set is slow and
    // visible. Over the cap: refused until tomorrow (IST) and logged for review.
    if (userId) {
      const { data: used, error: capErr } = await db.rpc("consume_answer_fetch", { p_user: userId, p_ids: ids.length, p_cap: DAILY_ANSWER_CAP });
      if (!capErr && used === -1) {
        console.warn(JSON.stringify({ event: "answer_cap_reached", user: userId, requested: ids.length, cap: DAILY_ANSWER_CAP }));
        return NextResponse.json({ error: "Daily answer limit reached — it resets at midnight." }, { status: 429 });
      }
    }
    const { data, error } = await db
      .from("question_answers")
      .select("question_id, correct_option_ids, nat_min, nat_max, nat_ranges")
      .in("question_id", ids);
    if (error) throw error;

    const answers: Record<string, { c: string[]; n: [number, number][] | null }> = {};
    for (const row of data ?? []) {
      let n: [number, number][] | null = null;
      if (Array.isArray(row.nat_ranges) && row.nat_ranges.length) {
        n = row.nat_ranges.filter((r: unknown) => Array.isArray(r) && r.length === 2) as [number, number][];
      } else if (row.nat_min !== null && row.nat_max !== null) {
        n = [[Number(row.nat_min), Number(row.nat_max)]];
      }
      answers[row.question_id] = { c: row.correct_option_ids ?? [], n };
    }
    return NextResponse.json({ answers }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (err) {
    console.error("answers route failed", err);
    return NextResponse.json({ error: "Couldn't load answers right now." }, { status: 503 });
  }
}
