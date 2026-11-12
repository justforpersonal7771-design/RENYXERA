import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { battleCtx, isCtx, type Db } from "@/lib/server/battles";
import { shopItem } from "@/lib/coins/shop";

export const runtime = "nodejs";

/**
 * Coin shop (migration 0062).
 *   GET                                   owned frames and which one is equipped
 *   POST { action: "buy", item }          spend coins atomically (spend_coins); Mentor tokens become a 30-day pack, frames are unlocked once
 *   POST { action: "equip", item | null } wear an owned frame, or none
 */
const NO = { "Cache-Control": "private, no-store" };
const body = z.discriminatedUnion("action", [
  z.object({ action: z.literal("buy"), item: z.string().max(40) }),
  z.object({ action: z.literal("equip"), item: z.string().max(40).nullable() }),
]);

async function owned(db: Db, uid: string) {
  const { data, error } = await db.from("user_unlocks").select("item_id, equipped").eq("user_id", uid);
  if (error) return null;
  return { owned: (data ?? []).map((r) => r.item_id as string), equipped: (data ?? []).find((r) => r.equipped)?.item_id ?? null };
}

export async function GET(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "shop-read", limit: 60, needUser: true });
  if (!isCtx(c)) return c;
  const o = await owned(c.db, c.userId!);
  if (!o) return NextResponse.json({ error: "The shop isn't set up yet." }, { status: 503 });
  return NextResponse.json(o, { headers: NO });
}

export async function POST(req: NextRequest) {
  const c = await battleCtx(req, { bucket: "shop-write", limit: 20, needUser: true });
  if (!isCtx(c)) return c;
  const { db } = c; const uid = c.userId!;
  const a = body.safeParse(await req.json().catch(() => null));
  if (!a.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  if (a.data.action === "equip") {
    const it = a.data.item;
    if (it) {
      const { data } = await db.from("user_unlocks").select("item_id").eq("user_id", uid).eq("item_id", it).maybeSingle();
      if (!data) return NextResponse.json({ error: "Buy this frame first." }, { status: 409 });
    }
    await db.from("user_unlocks").update({ equipped: false }).eq("user_id", uid);
    if (it) await db.from("user_unlocks").update({ equipped: true }).eq("user_id", uid).eq("item_id", it);
    return NextResponse.json({ ...(await owned(db, uid)) }, { headers: NO });
  }

  const item = shopItem(a.data.item);
  if (!item) return NextResponse.json({ error: "That item isn't in the shop." }, { status: 404 });
  if (item.kind === "frame") {
    const { data } = await db.from("user_unlocks").select("item_id").eq("user_id", uid).eq("item_id", item.id).maybeSingle();
    if (data) return NextResponse.json({ error: "You already own this frame." }, { status: 409 });
  }
  const { data: bal, error } = await db.rpc("spend_coins", { p_user: uid, p_item: item.id, p_cost: item.cost, p_ref: `${Date.now()}` });
  if (error) { console.error("spend_coins", error); return NextResponse.json({ error: "Couldn't complete the purchase." }, { status: 500 }); }
  if (bal === -1) return NextResponse.json({ error: `You need ${item.cost} coins for this.` }, { status: 409 });
  if (item.kind === "mentor") {
    const { error: e } = await db.from("ai_credit_packs").insert({ user_id: uid, order_id: null, pack_id: "coins_mentor", tokens_total: item.tokens, tokens_left: item.tokens, expires_at: new Date(Date.now() + (item.days ?? 30) * 86_400_000).toISOString() });
    if (e) console.error("coins mentor pack", e);
  } else {
    await db.from("user_unlocks").update({ equipped: false }).eq("user_id", uid);
    await db.from("user_unlocks").insert({ user_id: uid, item_id: item.id, equipped: true });
  }
  return NextResponse.json({ ok: true, balance: bal, ...(await owned(db, uid)) }, { headers: NO });
}
