import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { splitDataset, type RawPaper } from "@/lib/repository/dataset-split";
// Bundled at build time rather than read from disk at request time (`fs.readFile`
// against `process.cwd()`). Cloudflare Workers — the Module 4A migration target — run in
// a V8 isolate sandbox with no filesystem at request time, so a runtime `fs` read cannot
// work there under any adapter; a build-time import is the portable form and behaves
// identically on Vercel's Node runtime today. See RENYXERA_Master_Plan §4A.
import rawDataset from "@/data/Aggregated_Output.json";

export const runtime = "nodejs";

const dataset = rawDataset as unknown as RawPaper[];

// The question repository fetches this exactly once per app load (then caches in
// IndexedDB), so a real user session needs at most a handful of requests. This limit is
// sized to comfortably cover that plus retries, while still blocking a scripted loop.
const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

/**
 * ⚠️ KNOWN EXPOSURE (FINDING-3 in the master plan): the default response here — used by
 * the live QuestionRepository / practice flow — includes every option's `is_correct`
 * flag and each question's `nat_answer_range`. That's an accepted, deliberate trade-off
 * for today's honour-system practice mode (see Module 5A's "practice keeps instant
 * feedback" design principle), NOT an oversight being left in place blindly. It becomes
 * unacceptable the moment a graded/ranked/paid mode ships, because this audience reads
 * the Network tab.
 *
 * `?scope=public` (added alongside lib/repository/dataset-split.ts and
 * /api/exam/grade) strips every answer-bearing field and is the real, working
 * replacement payload for that future graded mode. It is not yet wired into the live
 * exam engine — see the scope note in dataset-split.ts for why that cutover is deferred
 * to Release 5 rather than done in this pass.
 */
export async function GET(req: NextRequest) {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const clientKey = getClientKey(req);
  const { allowed } = checkRateLimit(`dataset:${clientKey}`, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const scope = req.nextUrl.searchParams.get("scope");

  try {
    if (scope === "public") {
      const { publicPapers } = splitDataset(dataset);
      return NextResponse.json(publicPapers, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    return NextResponse.json(dataset, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Failed to serve dataset:", err);
    return NextResponse.json({ error: "Failed to load dataset" }, { status: 500 });
  }
}
