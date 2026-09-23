import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { buildAnswerKey, gradeResponse, type RawPaper } from "@/lib/repository/dataset-split";
import { gradeRequestSchema } from "@/lib/security/grade-request-schema";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";

export const runtime = "nodejs";

const DATA_PATH = path.join(process.cwd(), "data", "Aggregated_Output.json");
const MAX_BODY_BYTES = 60_000;

// A real user submits at most a handful of graded attempts per session (an attempt is
// typically one submission, occasionally re-checked). Sized to comfortably cover retries
// without allowing a script to brute-force answers by resubmitting single-question
// "attempts" repeatedly to fish for the correct option.
const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

// Marks-by-question lookup is built once per cold start alongside the answer key, from
// the same source file — avoids a second read/parse of the dataset per request.
let cachedMarksById: Map<string, number> | null = null;
let cachedAnswerKey: ReturnType<typeof buildAnswerKey> | null = null;

async function loadGradingData() {
  if (cachedAnswerKey && cachedMarksById) {
    return { answerKey: cachedAnswerKey, marksById: cachedMarksById };
  }
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const papers = JSON.parse(raw) as RawPaper[];
  const answerKey = buildAnswerKey(papers);
  const marksById = new Map<string, number>();
  for (const paper of papers) {
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
    const { answerKey, marksById } = await loadGradingData();

    let score = 0;
    let maxScore = 0;
    const results = parsed.data.responses.map((response) => {
      const isCorrect = gradeResponse(answerKey, response);
      const marks = marksById.get(response.question_id) ?? 0;
      maxScore += marks;
      if (isCorrect) score += marks;
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
