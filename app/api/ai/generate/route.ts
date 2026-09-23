import { NextRequest, NextResponse } from "next/server";
import { getGoogleGenAIClient, GEMINI_MODEL } from "@/lib/ai/gemini";
import { PromptBuilder } from "@/lib/ai/ai-prompts";
import { aiRequestSchema, type AIGenerateRequest } from "@/lib/security/ai-request-schema";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";

export const runtime = "nodejs";

// Hard ceiling on the raw request body, checked before JSON.parse even runs. Per-field
// caps in ai-request-schema.ts bound individual fields, but a caller can still pad an
// array field up to its length cap with maximally-sized entries — this is the blunt
// backstop against the resulting worst-case payload (and against a body that's just
// garbage padding with no valid shape at all, which zod would reject anyway but only
// after we've paid to parse it). Sized to comfortably fit a long AI Mentor chat session
// (up to 60 history turns, each carrying a serialized prior explanation) plus the
// learner-context object, while still ruling out pathological payloads.
const MAX_BODY_BYTES = 220_000;

// This is the only route in the app that costs money per call, so it gets its own
// tighter window rather than reusing the dataset/image-manifest limits. A real session
// generates at most a handful of AI calls per question interacted with; this comfortably
// covers that plus retries while still blocking a scripted loop. getClientKey() falls
// back to IP, which is a known weak key (CGNAT collapses many real users together, and a
// determined caller can rotate it) — real per-account limiting needs auth and is tracked
// as Module 4G Phase 2 in the master plan; this is the ₹0, no-dependency floor for today.
const RATE_LIMIT = { limit: 15, windowMs: 60_000 };

// Bail out of a hung Gemini call rather than tying up the function (and the caller's
// retry budget) indefinitely.
const GEMINI_TIMEOUT_MS = 30_000;

function extractErrorMessage(err: any): string {
  let message = err?.message || "Failed to contact Gemini API";
  try {
    if (typeof message === "string" && message.trim().startsWith("{")) {
      const parsed = JSON.parse(message);
      if (parsed?.error?.message) message = parsed.error.message;
    }
  } catch {
    // message wasn't JSON, keep as-is
  }
  return message;
}

/** Builds {systemInstruction, prompt} server-side from the fixed PromptBuilder template
 *  named by `type` — this is the piece that actually closes the hole: the client no
 *  longer sends instruction text, only the `type` key and structured data. */
function buildPrompt(req: AIGenerateRequest): { systemInstruction: string; prompt: string } {
  switch (req.type) {
    case "EXPLAIN":
      return PromptBuilder.buildExplainPrompt(
        req.params.context as any,
        req.params.mode,
        req.params.personality
      );
    case "HINT":
      return PromptBuilder.buildHintPrompt(req.params.context as any);
    case "SHORTCUT":
      return PromptBuilder.buildShortcutPrompt(req.params.context as any);
    case "PRACTICE":
      return PromptBuilder.buildPracticePrompt(
        req.params.context as any,
        req.params.topic,
        req.params.subject,
        req.params.count,
        req.params.samples as any,
        req.params.currentQuestion as any
      );
    case "REVISION":
      return PromptBuilder.buildRevisionPrompt(req.params.context as any, req.params.subject);
    case "FOLLOWUP":
      return PromptBuilder.buildFollowUpPrompt(
        req.params.context as any,
        req.params.history,
        req.params.nextMessage
      );
  }
}

/**
 * Server-only Gemini proxy. The API key never leaves this route handler. Clients
 * (AIClient) send {type, params} — a server-owned template name plus structured data —
 * and get back {text}. See lib/security/ai-request-schema.ts for the full contract and
 * why it replaced the old {systemInstruction, prompt} shape.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const clientKey = getClientKey(req);
  const { allowed } = checkRateLimit(`ai-generate:${clientKey}`, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
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

  const parsed = aiRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", issues: parsed.error.issues.slice(0, 5) },
      { status: 400 }
    );
  }

  const startedAt = Date.now();
  let systemInstruction: string, prompt: string;
  try {
    ({ systemInstruction, prompt } = buildPrompt(parsed.data));
  } catch (err: any) {
    // PromptBuilder throws when required context (e.g. currentQuestion) is missing for a
    // template that needs it — that's a caller error, not a server error.
    return NextResponse.json({ error: err?.message || "Invalid params for request type." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await getGoogleGenAIClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: "Empty response received from Gemini API" }, { status: 502 });
    }

    console.log(
      `[ai/generate] type=${parsed.data.type} client=${clientKey} status=200 latencyMs=${Date.now() - startedAt}`
    );
    return NextResponse.json({ text });
  } catch (err: any) {
    console.error(
      `[ai/generate] type=${parsed.data.type} client=${clientKey} status=error latencyMs=${Date.now() - startedAt}`,
      err
    );
    if (controller.signal.aborted) {
      return NextResponse.json({ error: "AI request timed out." }, { status: 504 });
    }
    return NextResponse.json({ error: extractErrorMessage(err) }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
