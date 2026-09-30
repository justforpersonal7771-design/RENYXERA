import { NextRequest, NextResponse } from "next/server";
import { getGoogleGenAIClient, GEMINI_MODEL, AI_ROUTE } from "@/lib/ai/gemini";
import { PromptBuilder } from "@/lib/ai/ai-prompts";
import { aiRequestSchema, type AIGenerateRequest } from "@/lib/security/ai-request-schema";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { getEntitlement } from "@/lib/billing/server";
import { AI_DAILY, FREE_AI_DAILY, PRO_AI_DAILY } from "@/lib/billing/plans";

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

// Free-tier AI requests per user per day (IST). Configurable without a code change.
// Free accounts have NO daily allowance (owner decision 30 Sep 2026): a one-time teaser of
// 5 requests (ensure_welcome_ai) plus whatever they earn (sponsor breaks, referrals).
const AI_DAILY_LIMIT = FREE_AI_DAILY;
// Pro accounts (7A, server-side entitlement) get a larger daily allowance.
const PRO_DAILY_LIMIT = Math.max(AI_DAILY_LIMIT, Number(process.env.PRO_AI_DAILY_LIMIT) || PRO_AI_DAILY);

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

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
 * Step 6: the browser's copy of a question may not carry its answer (the public bank has
 * none), so explanations would be built blind. Fill the key in from Postgres for any
 * official question in the request. Fails open — the prompt is simply built without it.
 */
/**
 * AI cost cut 2 (docs/AI_USAGE_STRATEGY.md §3.1/§3.3): hints, shortcuts and standard
 * explanations of an official PYQ depend on the question, not on the student. For those,
 * drop the learner's personal context so every student sends the IDENTICAL prompt — the
 * response cache then answers everyone after the first request for free (cache hits don't
 * touch the daily allowance). An explanation of the student's own answer stays personal.
 */
const NEUTRAL_STATS = { masteryScore: 0, readinessScore: 0, confidenceScore: 0, studyMomentum: 0, consistencyScore: 0, weakestSubject: "", strongestSubject: "", mostImprovingTopic: "", mostDecliningTopic: "" };
function shareAcrossStudents(req: AIGenerateRequest): boolean {
  const params = req.params as Record<string, any>;
  const ctx = params?.context;
  const q = ctx?.currentQuestion;
  if (!q || typeof q.question_id !== "string" || !/^GATE_/.test(q.question_id)) return false;
  const shareable = req.type === "HINT" || req.type === "SHORTCUT" || (req.type === "EXPLAIN" && !ctx.currentResponse);
  if (!shareable) return false;
  params.context = { currentQuestion: q, studentStats: NEUTRAL_STATS, weakTopics: [], strongTopics: [], recentMistakes: [], bookmarks: [], activePlannerTasks: [], recentSessions: [], revisionQueue: [] };
  return true;
}

async function attachServerAnswers(req: AIGenerateRequest) {
  const params = req.params as Record<string, any>;
  const targets = [params?.context?.currentQuestion, params?.currentQuestion].filter(
    (q) => q && typeof q.question_id === "string" && /^GATE_/.test(q.question_id)
  );
  if (!targets.length) return;
  try {
    const { data } = await createServiceRoleClient()
      .from("question_answers")
      .select("question_id, correct_option_ids, nat_min, nat_max, nat_ranges")
      .in("question_id", [...new Set(targets.map((q) => q.question_id))]);
    const byId = new Map((data ?? []).map((k) => [k.question_id, k]));
    for (const q of targets) {
      const k = byId.get(q.question_id);
      if (!k) continue;
      if (Array.isArray(q.options)) {
        q.options = q.options.map((o: any) => ({ ...o, is_correct: (k.correct_option_ids ?? []).includes(o?.option_id) }));
      }
      const ranges: [number, number][] = Array.isArray(k.nat_ranges) && k.nat_ranges.length
        ? k.nat_ranges : k.nat_min !== null && k.nat_max !== null ? [[Number(k.nat_min), Number(k.nat_max)]] : [];
      if (ranges.length) {
        q.nat_answer_range = { min: ranges[0][0], max: ranges[0][1], ranges: ranges.map(([min, max]) => ({ min, max })) };
      }
    }
  } catch (err) {
    console.warn("attachServerAnswers failed; prompt built without the key", err);
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

  // Master plan Module 4D: "Guest AI calls: zero... guests must not be a path around
  // per-user AI quotas." The AI Mentor UI already locks itself for guests (GuestLock),
  // but that's cosmetic on its own — this is the actual enforcement, since the UI lock
  // is trivially bypassed by calling this route directly. getVerifiedClaims()
  // re-validates the session's JWT against Supabase rather than trusting a client-
  // supplied user id, and throws if Supabase isn't configured at all — treated the same
  // as "no session" here, matching every other Supabase call site's fallback behavior.
  let claims;
  try {
    claims = await getVerifiedClaims();
  } catch {
    claims = null;
  }
  if (!claims) {
    return NextResponse.json({ error: "Sign in to use AI Mentor." }, { status: 401 });
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
  let remainingQuota: number | null = null;
  const shared = shareAcrossStudents(parsed.data);
  await attachServerAnswers(parsed.data);
  let systemInstruction: string, prompt: string;
  try {
    ({ systemInstruction, prompt } = buildPrompt(parsed.data));
  } catch (err: any) {
    // PromptBuilder throws when required context (e.g. currentQuestion) is missing for a
    // template that needs it — that's a caller error, not a server error.
    return NextResponse.json({ error: err?.message || "Invalid params for request type." }, { status: 400 });
  }

  // ---- Module 4G: server-side cache, then per-user daily quota (both in Postgres) ----
  const userId = String(claims.sub);
  const route = AI_ROUTE[parsed.data.type] ?? { model: GEMINI_MODEL, maxOutputTokens: 3072 };
  const promptHash = await sha256([route.model, systemInstruction, prompt].join("\n"));
  let db: ReturnType<typeof createServiceRoleClient> | null = null;
  try { db = createServiceRoleClient(); } catch { db = null; }

  if (db) {
    const { data: cached } = await db.from("ai_response_cache").select("response,hits").eq("prompt_hash", promptHash).maybeSingle();
    if (cached?.response) {
      await db.from("ai_response_cache").update({ hits: (cached.hits ?? 0) + 1 }).eq("prompt_hash", promptHash);
      console.log(`[ai/generate] type=${parsed.data.type} user=${userId} status=200 cache=hit shared=${shared}`);
      return NextResponse.json({ text: cached.response, cached: true });
    }

    // 7D: a paid tier's allowance applies only on one of the account's registered devices.
    let tierHere = (await getEntitlement(userId)).tier;
    if (tierHere !== "free") {
      const sid = typeof claims.session_id === "string" ? claims.session_id : null;
      const { data: dev } = sid ? await db.from("device_sessions").select("id").eq("user_id", userId).eq("session_id", sid).is("revoked_at", null).maybeSingle() : { data: null };
      if (!dev) tierHere = "free";
    }
    const dailyLimit = tierHere === "pro" ? PRO_DAILY_LIMIT : tierHere === "plus" ? AI_DAILY.plus : AI_DAILY_LIMIT;
    if (tierHere === "free") await db.rpc("ensure_welcome_ai", { p_user: userId });
    const { data: quota, error: quotaErr } = await db.rpc("consume_ai_call", { p_user: userId, p_limit: dailyLimit });
    if (quotaErr) {
      // Migration 0003 not applied yet (or DB hiccup): don't take AI Mentor down — log loudly.
      console.warn(`[ai/generate] quota check unavailable (${quotaErr.code}); allowing request`);
    } else {
      const row = Array.isArray(quota) ? quota[0] : quota;
      // 7E: out of daily requests → spend a bonus credit (referrals / sponsor breaks) if any.
      const bonus = row && !row.allowed ? (await db.rpc("consume_ai_bonus", { p_user: userId })).data === true : false;
      if (row && !row.allowed && !bonus) {
        return NextResponse.json(
          { error: row.day_limit === 0 ? "You've used your free AI tries. Take a short sponsor break on the Plans page for a few more today, invite a friend, or upgrade to Plus (75 a day) or Pro (150 a day)." : `You've used today's ${row.day_limit} AI requests. They reset at midnight (IST).${row.day_limit < PRO_DAILY_LIMIT ? ` Pro gives ${PRO_DAILY_LIMIT} a day — see the Plans page.` : ""} You can also earn a few extra today with a short sponsor break on the Plans page.`, quotaExceeded: true, upgrade: row.day_limit < PRO_DAILY_LIMIT },
          { status: 429, headers: { "X-AI-Quota-Remaining": "0" } }
        );
      }
      if (row) remainingQuota = Math.max(0, row.day_limit - row.used);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

  try {
    const response = await getGoogleGenAIClient().models.generateContent({
      model: route.model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: route.maxOutputTokens,
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json({ error: "Empty response received from Gemini API" }, { status: 502 });
    }

    console.log(
      `[ai/generate] type=${parsed.data.type} client=${clientKey} status=200 latencyMs=${Date.now() - startedAt}`
    );
    // Must be awaited: supabase-js builders are lazy and never send an un-awaited query.
    if (db) await db.from("ai_response_cache").upsert({ prompt_hash: promptHash, response: text }).then(({ error }) => { if (error) console.warn("[ai/generate] cache write failed", error.code); });
    return NextResponse.json(
      { text },
      remainingQuota !== null ? { headers: { "X-AI-Quota-Remaining": String(remainingQuota) } } : undefined
    );
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
