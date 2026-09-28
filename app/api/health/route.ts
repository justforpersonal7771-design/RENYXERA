import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness + database keep-alive. A tiny public read, so the scheduled GitHub Action
 * (keepalive.yml) counts as activity and the free Supabase project is never paused for
 * inactivity. Returns no user data.
 */
export async function GET() {
  const t0 = Date.now();
  try {
    const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false } });
    const { error } = await sb.from("branches").select("code", { head: true, count: "exact" });
    if (error) throw error;
    return NextResponse.json({ ok: true, db: "up", ms: Date.now() - t0 }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ ok: false, db: "down" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
