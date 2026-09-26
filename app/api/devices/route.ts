import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

/**
 * Step 7 (4F): Active Devices. Rows live in public.device_sessions and are written only
 * here (service role) from the verified JWT — so a device's session_id comes from Supabase,
 * never from the client. Signing a device out deletes its auth session (refresh token
 * dies) and flags the row; the device notices on its next heartbeat and signs out.
 */
const DEVICE_ID = z.string().regex(/^[A-Za-z0-9-]{8,64}$/);
const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("heartbeat"), device_id: DEVICE_ID, label: z.string().max(80) }),
  z.object({ action: z.literal("revoke"), id: z.string().uuid() }),
  z.object({ action: z.literal("revoke_others"), device_id: DEVICE_ID }),
]);

async function caller(req: NextRequest) {
  if (isCrossOriginRequest(req)) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return { error: NextResponse.json({ error: "Sign in required." }, { status: 401 }) };
  if (!checkRateLimit(`devices:${userId}`, { limit: 30, windowMs: 60_000 }).allowed) {
    return { error: NextResponse.json({ error: "Too many requests" }, { status: 429 }) };
  }
  const sessionId = typeof claims?.session_id === "string" ? claims.session_id : null;
  return { userId, sessionId };
}

export async function GET(req: NextRequest) {
  const c = await caller(req);
  if ("error" in c) return c.error;
  const { data, error } = await createServiceRoleClient()
    .from("device_sessions")
    .select("id, device_id, session_id, label, created_at, last_seen_at, revoked_at")
    .eq("user_id", c.userId)
    .is("revoked_at", null)
    .order("last_seen_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: "Couldn't load devices." }, { status: 503 });
  return NextResponse.json(
    {
      devices: (data ?? []).map(({ session_id, ...d }) => ({ ...d, current: !!session_id && session_id === c.sessionId })),
    },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}

export async function POST(req: NextRequest) {
  const c = await caller(req);
  if ("error" in c) return c.error;
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const db = createServiceRoleClient();
  const now = new Date().toISOString();

  try {
    if (parsed.data.action === "heartbeat") {
      const { device_id, label } = parsed.data;
      const { data: row } = await db.from("device_sessions").select("id, session_id, revoked_at")
        .eq("user_id", c.userId).eq("device_id", device_id).maybeSingle();
      // Revoked while this same session is still alive → tell the device to sign out.
      if (row?.revoked_at && row.session_id === c.sessionId) {
        return NextResponse.json({ revoked: true });
      }
      const { error } = await db.from("device_sessions").upsert(
        { user_id: c.userId, device_id, session_id: c.sessionId, label: label.trim() || "Unknown device", last_seen_at: now, revoked_at: null },
        { onConflict: "user_id,device_id" }
      );
      if (error) throw error;
      return NextResponse.json({ revoked: false });
    }

    if (parsed.data.action === "revoke") {
      const { data: row } = await db.from("device_sessions").select("id, session_id")
        .eq("id", parsed.data.id).eq("user_id", c.userId).maybeSingle();
      if (!row) return NextResponse.json({ error: "Device not found." }, { status: 404 });
      if (row.session_id) await db.rpc("revoke_auth_session", { p_user: c.userId, p_session: row.session_id });
      await db.from("device_sessions").update({ revoked_at: now }).eq("id", row.id);
      return NextResponse.json({ ok: true, current: row.session_id === c.sessionId });
    }

    // revoke_others: every device of this account except the caller's.
    const keepDevice = parsed.data.device_id;
    const { data: rows } = await db.from("device_sessions").select("id, session_id, device_id")
      .eq("user_id", c.userId).is("revoked_at", null);
    const others = (rows ?? []).filter((r) => r.device_id !== keepDevice && r.session_id !== c.sessionId);
    for (const r of others) {
      if (r.session_id) await db.rpc("revoke_auth_session", { p_user: c.userId, p_session: r.session_id });
    }
    if (others.length) await db.from("device_sessions").update({ revoked_at: now }).in("id", others.map((r) => r.id));
    return NextResponse.json({ ok: true, count: others.length });
  } catch (err) {
    console.error("devices route failed", err);
    return NextResponse.json({ error: "Couldn't update devices right now." }, { status: 503 });
  }
}
