import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { ownedPacks } from "@/lib/study/server";

/** Which study packs this account may read: admins read everything (owner review); everyone else reads the packs they bought (migration 0063). */
export async function GET() {
  const { ok, userId } = await isAdminRequest();
  const packs = userId ? await ownedPacks(createServiceRoleClient(), userId).catch(() => [] as string[]) : [];
  return NextResponse.json({ all: ok, packs }, { headers: { "Cache-Control": "private, no-store" } });
}
