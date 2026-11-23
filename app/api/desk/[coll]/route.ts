import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * AI Desk documents for the signed-in student (RLS: own rows only): notes, revision schedule state, saved Tutor queues.
 * 401 when signed out and 503 when migration 0066 is not applied yet; the client then keeps everything on this device.
 */
const COLLS = ["notes", "revision", "queues"];
const NO = { "Cache-Control": "private, no-store" };
const missing = (m?: string) => !!m && /desk_items|relation|schema cache/i.test(m);

async function who(coll: string) {
  if (!COLLS.includes(coll)) return { err: NextResponse.json({ error: "Unknown collection" }, { status: 404 }) } as const;
  const sb = await createClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) return { err: NextResponse.json({ error: "Sign in" }, { status: 401 }) } as const;
  return { sb, uid: data.user.id } as const;
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ coll: string }> }) {
  const { coll } = await ctx.params; const w = await who(coll); if ("err" in w) return w.err;
  const { data, error } = await w.sb.from("desk_items").select("id,data,updated_at").eq("user_id", w.uid).eq("coll", coll).order("updated_at", { ascending: false }).limit(3000);
  if (error) return NextResponse.json({ error: error.message }, { status: missing(error.message) ? 503 : 500 });
  return NextResponse.json({ items: data ?? [] }, { headers: NO });
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ coll: string }> }) {
  const { coll } = await ctx.params; const w = await who(coll); if ("err" in w) return w.err;
  const b = (await req.json().catch(() => null)) as { items?: { id: string; data: unknown; updated_at?: string }[] } | null;
  const items = (b?.items ?? []).filter((i) => i && typeof i.id === "string" && i.id.length <= 120 && i.data && typeof i.data === "object").slice(0, 200);
  if (!items.length) return NextResponse.json({ ok: true }, { headers: NO });
  if (JSON.stringify(items).length > 600_000) return NextResponse.json({ error: "Too large" }, { status: 413 });
  const rows = items.map((i) => ({ user_id: w.uid, coll, id: i.id, data: i.data, updated_at: i.updated_at ?? new Date().toISOString() }));
  const { error } = await w.sb.from("desk_items").upsert(rows, { onConflict: "user_id,coll,id" });
  if (error) return NextResponse.json({ error: error.message }, { status: missing(error.message) ? 503 : 500 });
  return NextResponse.json({ ok: true }, { headers: NO });
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ coll: string }> }) {
  const { coll } = await ctx.params; const w = await who(coll); if ("err" in w) return w.err;
  const ids = (req.nextUrl.searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 200);
  if (!ids.length) return NextResponse.json({ ok: true }, { headers: NO });
  const { error } = await w.sb.from("desk_items").delete().eq("user_id", w.uid).eq("coll", coll).in("id", ids);
  if (error) return NextResponse.json({ error: error.message }, { status: missing(error.message) ? 503 : 500 });
  return NextResponse.json({ ok: true }, { headers: NO });
}
