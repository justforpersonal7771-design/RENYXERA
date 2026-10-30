import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";

export const runtime = "nodejs";

/**
 * Sink for Content-Security-Policy violation reports (R16-A2: the policy runs in report-only mode first). Each report is
 * logged as one compact line (blocked host, directive, page path) so the policy can be tightened from real traffic.
 * No query strings, no cookies, no body kept. Rate limited per client; always answers 204.
 */
export async function POST(req: NextRequest) {
  if (!checkRateLimit(`csp:${getClientKey(req)}`, { limit: 20, windowMs: 60_000 }).allowed) return new NextResponse(null, { status: 204 });
  try {
    const text = await req.text();
    if (text.length > 8_000) return new NextResponse(null, { status: 204 });
    const j = JSON.parse(text) as Record<string, unknown>;
    // Two wire formats: legacy { "csp-report": {...} } and Reporting API [ { body: {...} } ].
    const r = ((Array.isArray(j) ? (j[0] as { body?: Record<string, unknown> })?.body : (j as { "csp-report"?: Record<string, unknown> })["csp-report"]) ?? {}) as Record<string, unknown>;
    const host = (u: unknown) => { try { return new URL(String(u)).host || String(u); } catch { return String(u ?? "").slice(0, 40); } };
    const path = (u: unknown) => { try { return new URL(String(u)).pathname; } catch { return ""; } };
    console.warn(JSON.stringify({
      event: "csp_violation",
      directive: String(r["violated-directive"] ?? r.effectiveDirective ?? "").slice(0, 60),
      blocked: host(r["blocked-uri"] ?? r.blockedURL),
      page: path(r["document-uri"] ?? r.documentURL),
    }));
  } catch { /* malformed report: ignore */ }
  return new NextResponse(null, { status: 204 });
}
