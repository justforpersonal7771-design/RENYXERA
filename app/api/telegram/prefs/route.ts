import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { accountOf, member, tierOf } from "@/lib/telegram/server";

export const runtime = "nodejs";

const KEYS = ["blocks", "digest", "alarms", "mocks", "billing", "weekly", "roll", "streak"] as const;
const schema = z.object({
  prefs: z.record(z.enum(KEYS), z.boolean()).optional(),
  digestTime: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  quiet: z.object({ from: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/), to: z.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]$/) }).nullable().optional(),
});

/** Turn alert types on or off and choose the digest time. Settings for features your plan doesn't include are ignored. */
export async function POST(req: NextRequest) {
  const m = await member(req, { write: true });
  if (m instanceof NextResponse) return m;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const acct = await accountOf(m.db, m.userId);
  if (!acct) return NextResponse.json({ error: "Link Telegram first." }, { status: 409 });
  const { limits } = await tierOf(m.userId);

  const allowed: Record<string, boolean> = { blocks: limits.blockReminders, digest: limits.digest, alarms: limits.alarms > 0, mocks: limits.mockReminders, billing: true, weekly: limits.weeklyReview, roll: limits.rollPrompt, streak: limits.streakNudge };
  const next: Record<string, unknown> = { ...acct.prefs };
  for (const [k, v] of Object.entries(parsed.data.prefs ?? {})) if (allowed[k]) next[k] = v;
  if (parsed.data.quiet !== undefined && limits.quietHours) next.quiet = parsed.data.quiet;
  const patch: Record<string, unknown> = { prefs: next };
  if (parsed.data.digestTime && limits.digest) patch.digest_time = parsed.data.digestTime;
  const { error } = await m.db.from("telegram_accounts").update(patch).eq("user_id", m.userId);
  if (error) return NextResponse.json({ error: "Couldn't save." }, { status: 500 });
  return NextResponse.json({ prefs: next, digestTime: (patch.digest_time as string) ?? acct.digest_time });
}
