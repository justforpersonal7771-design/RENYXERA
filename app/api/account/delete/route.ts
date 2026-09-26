import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

/**
 * Profile → Account & security → Delete my account. The caller must type their own
 * account email as confirmation. Deleting the auth user cascades to profiles, attempts,
 * responses, devices and AI quota rows; waitlist rows keep only an anonymous branch count.
 */
const bodySchema = z.object({ confirmEmail: z.string().trim().toLowerCase().email() });

export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const email = typeof claims?.email === "string" ? claims.email.toLowerCase() : null;
  if (!userId || !email) return NextResponse.json({ error: "Sign in again to delete your account." }, { status: 401 });
  if (!checkRateLimit(`delete-account:${userId}`, { limit: 3, windowMs: 10 * 60_000 }).allowed) {
    return NextResponse.json({ error: "Too many attempts. Please wait a few minutes." }, { status: 429 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success || parsed.data.confirmEmail !== email) {
    return NextResponse.json({ error: "That doesn't match your account email." }, { status: 400 });
  }

  try {
    const db = createServiceRoleClient();
    // Waitlist rows reference auth.users with ON DELETE SET NULL; drop their email too.
    await db.from("branch_waitlist").delete().eq("user_id", userId);
    const { error } = await db.auth.admin.deleteUser(userId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("account delete failed", err);
    return NextResponse.json({ error: "Couldn't delete your account right now. Please try again or contact us." }, { status: 503 });
  }
}
