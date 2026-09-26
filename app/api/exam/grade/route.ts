import { NextRequest, NextResponse } from "next/server";
import { buildAnswerKey, gradeResponse, type RawPaper } from "@/lib/repository/dataset-split";
import { gradeRequestSchema } from "@/lib/security/grade-request-schema";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
// Bundled at build time rather than read from disk at request time — see the comment in
// app/api/dataset/route.ts for why (Cloudflare Workers have no filesystem at runtime).
import rawDataset from "@/data/Aggregated_Output.json";

import { marksFor } from "@/lib/grading";
export const runtime = "nodejs";

const dataset = rawDataset as unknown as RawPaper[];
const MAX_BODY_BYTES = 60_000;

// A real user submits at most a handful of graded attempts per session (an attempt is
// typically one submission, occasionally re-checked). Sized to comfortably cover retries
// without allowing a script to brute-force answers by resubmitting single-question
// "attempts" repeatedly to fish for the correct option.
const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

// Built once per cold start from the bundled dataset rather than per request.
let cachedMarksById: Map<string, number> | null = null;
let cachedAnswerKey: ReturnType<typeof buildAnswerKey> | null = null;

function loadGradingData() {
  if (cachedAnswerKey && cachedMarksById) {
    return { answerKey: cachedAnswerKey, marksById: cachedMarksById };
  }
  const answerKey = buildAnswerKey(dataset);
  const marksById = new Map<string, number>();
  for (const paper of dataset) {
    for (const q of paper.questions) {
      marksById.set(q.question_id, q.marks);
    }
  }
  cachedAnswerKey = answerKey;
  cachedMarksById = marksById;
  return { answerKey, marksById };
}

/**
 * Server-authoritative grading for a submitted set of responses. The client sends only
 * what it can honestly know about its own attempt (question_id + selection/value) —
 * never a score or a correctness flag. See lib/repository/dataset-split.ts for the scope
 * note on how this fits into the current (not-yet-cut-over) exam flow.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const clientKey = getClientKey(req);
  const { allowed } = checkRateLimit(`exam-grade:${clientKey}`, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const contentLength = req.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large." }, { status: 413 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "Failed to read request body." }, { status: 400 });
  }
  if (rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request body too large." }, { status: 413 });
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = gradeRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", issues: parsed.error.issues.slice(0, 5) },
      { status: 400 }
    );
  }

  try {
    const { answerKey, marksById } = loadGradingData();

    let score = 0;
    let maxScore = 0;
    const results = parsed.data.responses.map((response) => {
      const isCorrect = gradeResponse(answerKey, response);
      const marks = marksById.get(response.question_id) ?? 0;
      maxScore += marks;
      const qType = answerKey.get(response.question_id)?.question_type ?? "NAT";
      const attempted = !!response.selected_option_ids?.length || typeof response.nat_value === "number";
      score += marksFor(qType, marks, attempted, isCorrect);
      return { question_id: response.question_id, is_correct: isCorrect, marks };
    });

    return NextResponse.json(
      { results, score, max_score: maxScore },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("Failed to grade exam submission:", err);
    return NextResponse.json({ error: "Failed to grade submission" }, { status: 500 });
  }
}
