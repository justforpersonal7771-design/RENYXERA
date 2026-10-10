import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { accountOf, member, tierOf } from "@/lib/telegram/server";

export const runtime = "nodejs";

const schema = z.object({
  topics: z.array(z.object({ topic: z.string().trim().min(1).max(120), attempted: z.number().int().min(0).max(100000), correct: z.number().int().min(0).max(100000) })).max(200),
});

/**
 * Pro: the learner's own device sends how they are doing by topic (analytics live on the device). We keep only the five
 * weakest (at least 5 attempts, under 60% correct) so the bot can name them in the weekly nudge. Never shown to others.
 */
export async function POST(req: NextRequest) {
  const m = await member(req, { write: true, limit: 10 });
  if (m instanceof NextResponse) return m;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const acct = await accountOf(m.db, m.userId);
  if (!acct) return NextResponse.json({ ok: true, stored: 0 });
  const { limits } = await tierOf(m.userId);
  if (!limits.weakNudge) return NextResponse.json({ ok: true, stored: 0 });
  const weak = parsed.data.topics
    .filter((t) => t.attempted >= 5 && t.correct <= t.attempted && t.correct / t.attempted < 0.6)
    .map((t) => ({ topic: t.topic, pct: Math.round((t.correct / t.attempted) * 100) }))
    .sort((a, b) => a.pct - b.pct).slice(0, 5);
  await m.db.from("telegram_accounts").update({ weak_topics: weak, weak_updated_at: new Date().toISOString() }).eq("user_id", m.userId);
  return NextResponse.json({ ok: true, stored: weak.length });
}
