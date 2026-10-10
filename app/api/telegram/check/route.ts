import { NextRequest, NextResponse } from "next/server";
import { accountOf, member, refreshMembership } from "@/lib/telegram/server";

export const runtime = "nodejs";

/** "Check again": re-reads whether the linked Telegram account is in the channel and the group. */
export async function POST(req: NextRequest) {
  const m = await member(req, { write: true, limit: 20 });
  if (m instanceof NextResponse) return m;
  const acct = await accountOf(m.db, m.userId);
  if (!acct) return NextResponse.json({ error: "Link Telegram first." }, { status: 409 });
  return NextResponse.json(await refreshMembership(m.db, acct));
}
