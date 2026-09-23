import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
// Bundled at build time rather than read from disk at request time — see the comment in
// app/api/dataset/route.ts for why (Cloudflare Workers have no filesystem at runtime).
import manifest from "@/data/image-manifest.json";

export const runtime = "nodejs";

const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

export async function GET(req: NextRequest) {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const clientKey = getClientKey(req);
  const { allowed } = checkRateLimit(`image-manifest:${clientKey}`, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    return NextResponse.json(manifest, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Failed to serve image manifest:", err);
    return NextResponse.json({ error: "Failed to load image manifest" }, { status: 500 });
  }
}
