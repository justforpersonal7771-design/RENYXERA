import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

/** Admin Overview + Funnel data. 404 for everyone who is not an admin, so the route does not advertise itself. */
export async function GET(req: NextRequest) {
  const { ok } = await isAdminRequest();
  if (!ok) return new NextResponse(null, { status: 404 });
  const days = Math.min(365, Math.max(1, Number(req.nextUrl.searchParams.get("days") ?? 30) || 30));
  const db = createServiceRoleClient();
  const [overview, funnel] = await Promise.all([db.rpc("admin_overview", { p_days: days }), db.rpc("funnel_by_source", { p_days: days })]);
  return NextResponse.json({ days, overview: overview.data ?? null, funnel: funnel.data ?? [], errors: [overview.error?.message, funnel.error?.message].filter(Boolean) }, { headers: { "Cache-Control": "private, no-store" } });
}
