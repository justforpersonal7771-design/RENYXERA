import { NextRequest, NextResponse } from "next/server";
import { chapterForViewer } from "@/lib/study/serve";
import { toWire } from "@/lib/study/schema";
import { encodeWire, stampBlocks, stampFor, type Scrambled } from "@/lib/study/wire-guard";
import { isAdminRequest } from "@/lib/server/admin";

/**
 * One chapter for the signed-in viewer, with every topic they cannot open replaced by a title-only stub (lib/study/serve.ts).
 * Hardening against bulk copying: the call must come from our own pages (same-origin fetch with the study header, never a pasted
 * link or a page navigation), each reader has a request budget, and the body is scrambled per response (lib/study/wire-guard.ts).
 */
const WINDOW_MS = 5 * 60_000, LIMIT_USER = 40, LIMIT_ANON = 12;
const hits = new Map<string, number[]>();
function allowed(key: string, limit: number) {
  const now = Date.now(); const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= limit) { hits.set(key, list); return false; }
  list.push(now); hits.set(key, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return true;
}
const NO = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };

export async function GET(req: NextRequest) {
  const site = req.headers.get("sec-fetch-site"), dest = req.headers.get("sec-fetch-dest");
  if (req.headers.get("x-rx-study") !== "1" || (site && site !== "same-origin") || (dest && dest !== "empty")) return NextResponse.json({ error: "Not available." }, { status: 403, headers: NO });
  const href = req.nextUrl.searchParams.get("href") ?? "";
  if (!/^\/study\/[a-z0-9-]+$/.test(href)) return NextResponse.json({ error: "Bad chapter." }, { status: 400, headers: NO });
  const { userId } = await isAdminRequest().catch(() => ({ userId: null as string | null }));
  const ip = req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "unknown";
  if (!allowed(userId ? `u:${userId}` : `ip:${ip}`, userId ? LIMIT_USER : LIMIT_ANON)) return NextResponse.json({ error: "Too many chapter requests. Please wait a few minutes." }, { status: 429, headers: { ...NO, "Retry-After": "300" } });
  const ch = await chapterForViewer(href);
  if (!ch) return NextResponse.json({ error: "No such chapter." }, { status: 404, headers: NO });
  const nonce = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const body: Scrambled = { v: 1, n: nonce, d: encodeWire(JSON.stringify(stampBlocks(toWire(ch), stampFor(userId ?? `ip:${ip}`))), nonce, href) };
  return NextResponse.json(body, { headers: NO });
}
