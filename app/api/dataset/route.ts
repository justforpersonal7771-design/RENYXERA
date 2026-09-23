import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { splitDataset, type RawPaper } from "@/lib/repository/dataset-split";

export const runtime = "nodejs";

const DATA_PATH = path.join(process.cwd(), "data", "Aggregated_Output.json");

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
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw) as RawPaper[];

    if (scope === "public") {
      const { publicPapers } = splitDataset(data);
      return NextResponse.json(publicPapers, {
        headers: { "Cache-Control": "no-store" },
      });
    }

    // Re-serialize (no pretty-printing) rather than streaming the file as-is — keeps the
    // wire format minified regardless of how the source file on disk is formatted.
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("Failed to serve dataset:", err);
    return NextResponse.json({ error: "Failed to load dataset" }, { status: 500 });
  }
}
