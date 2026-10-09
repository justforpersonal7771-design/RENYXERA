import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

function safeEqual(a: string, b: string) {
  if (!a || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/**
 * Official answers for the Telegram "yesterday's answer" line. Called only by the daily-post
 * GitHub Action with the PREGEN_SECRET header (same pattern as /api/ai/pregen), never by students.
 * Body: { ids: ["GATE_CS_2025_FN_Q14", ...] } (max 3).
 */
export async function POST(req: NextRequest) {
  const secret = process.env.PREGEN_SECRET || "";
  if (!secret || !safeEqual(req.headers.get("x-pregen-secret") ?? "", secret)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const ids: string[] = Array.isArray(body?.ids) ? body.ids.filter((x: unknown) => typeof x === "string" && /^[A-Za-z0-9_.:-]{3,80}$/.test(x)).slice(0, 3) : [];
  if (!ids.length) return NextResponse.json({ answers: {} });
  const { data, error } = await createServiceRoleClient().from("question_answers").select("question_id, correct_option_ids, nat_min, nat_max, nat_ranges").in("question_id", ids);
  if (error) return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  const answers: Record<string, { options: string[]; nat: [number, number] | null; ranges: [number, number][] | null }> = {};
  for (const r of data ?? []) {
    answers[r.question_id] = {
      options: r.correct_option_ids ?? [],
      nat: r.nat_min != null && r.nat_max != null ? [Number(r.nat_min), Number(r.nat_max)] : null,
      ranges: Array.isArray(r.nat_ranges) ? r.nat_ranges : null,
    };
  }
  return NextResponse.json({ answers });
}
