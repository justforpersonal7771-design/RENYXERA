import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/server/admin";

/**
 * Which study packs this account may read. Admins read everything (owner review of the books).
 * Pack purchases are not live yet: when the `study_access` table and pack checkout ship
 * (docs/study-materials/13 §6), the owned pack ids are read from it here.
 */
export async function GET() {
  const { ok } = await isAdminRequest();
  return NextResponse.json({ all: ok, packs: [] as string[] }, { headers: { "Cache-Control": "private, no-store" } });
}
