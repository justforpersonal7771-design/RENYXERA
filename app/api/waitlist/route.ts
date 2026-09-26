import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { BRANCHES } from "@/lib/branches";

export const runtime = "nodejs";

const CODES = BRANCHES.filter((b) => !b.live).map((b) => b.code) as [string, ...string[]];
const joinSchema = z.object({
  branch: z.enum(CODES),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  website: z.string().max(500).optional(), // honeypot: real people never fill this
});

/**
 * Step 8 (4H): "Notify me" for branches that aren't live yet. Signed-in members join by
 * account; guests by email. Service-role insert (the table has no public insert policy),
 * deduplicated by unique indexes, rate-limited per IP.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!checkRateLimit(`waitlist:${getClientKey(req)}`, { limit: 6, windowMs: 10 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = joinSchema.safeParse(body);
  if (!parsed.success) {
    const emailIssue = parsed.error.issues.some((i) => i.path[0] === "email");
    return NextResponse.json({ error: emailIssue ? "That doesn't look like an email address." : "Invalid request." }, { status: 400 });
  }
  if (parsed.data.website) return NextResponse.json({ ok: true }); // bot: pretend success

  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const email = parsed.data.email ?? (typeof claims?.email === "string" ? claims.email.toLowerCase() : undefined);
  if (!userId && !email) return NextResponse.json({ error: "Enter your email address." }, { status: 400 });

  try {
    const { error } = await createServiceRoleClient().from("branch_waitlist").insert({
      branch_code: parsed.data.branch,
      user_id: userId,
      email: email ?? null,
    });
    if (error) {
      if (error.code === "23505") return NextResponse.json({ ok: true, already: true });
      throw error;
    }
    return NextResponse.json({ ok: true, already: false });
  } catch (err) {
    console.error("waitlist insert failed", err);
    return NextResponse.json({ error: "Couldn't save that right now. Please try again." }, { status: 503 });
  }
}

/** Public counts per branch (social proof on the landing pages; internal prioritisation). */
export async function GET() {
  try {
    const db = createServiceRoleClient();
    const counts: Record<string, number> = {};
    await Promise.all(
      BRANCHES.filter((b) => !b.live).map(async (b) => {
        const { count } = await db.from("branch_waitlist").select("id", { count: "exact", head: true }).eq("branch_code", b.code);
        counts[b.code] = count ?? 0;
      })
    );
    return NextResponse.json({ counts }, { headers: { "Cache-Control": "public, max-age=300, s-maxage=600" } });
  } catch {
    return NextResponse.json({ counts: {} }, { status: 503 });
  }
}
