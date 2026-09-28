import { NextRequest, NextResponse } from "next/server";
import { gradeRequestSchema } from "@/lib/security/grade-request-schema";
import { checkRateLimit, getClientKey } from "@/lib/security/rate-limiter";
import { isCrossOriginRequest } from "@/lib/security/origin-check";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { isNatCorrect, isOptionsCorrect, marksFor } from "@/lib/grading";
import { mockResultHold } from "@/lib/security/mock-embargo";
import { MOCK_TAB_SWITCH_LIMIT } from "@/lib/exam/integrity-rules";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 60_000;

// A real user submits a handful of tests per session. Sized to cover retries without
// letting a script fish for answers by resubmitting single-question "attempts".
const RATE_LIMIT = { limit: 20, windowMs: 60_000 };

/**
 * Step 6 (5B): server-authoritative grading. The client sends only what it picked or
 * typed; the key and marks are read here from Postgres (question_answers is service-role
 * only). For a signed-in submission with `attempt`, the graded attempt is stored in
 * exam_attempts/exam_responses — idempotently, so a retried submit can't duplicate it.
 * The response also carries the unlocked keys, so the results screen needs one call.
 */
export async function POST(req: NextRequest) {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const { allowed } = checkRateLimit(`exam-grade:${userId ?? getClientKey(req)}`, RATE_LIMIT);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
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
    return NextResponse.json({ error: "Invalid request.", issues: parsed.error.issues.slice(0, 5) }, { status: 400 });
  }

  // One response per question: a duplicated id can't be counted twice.
  const byId = new Map(parsed.data.responses.map((r) => [r.question_id, r]));
  const responses = [...byId.values()];
  const ids = [...byId.keys()];

  try {
    const db = createServiceRoleClient();
    const [{ data: keys, error: kErr }, { data: qs, error: qErr }] = await Promise.all([
      db.from("question_answers").select("question_id, correct_option_ids, nat_min, nat_max, nat_ranges").in("question_id", ids),
      db.from("questions").select("id, question_type, marks").in("id", ids),
    ]);
    if (kErr) throw kErr;
    if (qErr) throw qErr;

    const keyOf = new Map((keys ?? []).map((k) => [k.question_id, k]));
    const qOf = new Map((qs ?? []).map((q) => [q.id, q]));
    const answers: Record<string, { c: string[]; n: [number, number][] | null }> = {};

    let score = 0;
    let maxScore = 0;
    const results = responses.map((r) => {
      const q = qOf.get(r.question_id);
      const k = keyOf.get(r.question_id);
      // Unknown ids (AI-generated / tampered) are ignored: no marks either way.
      if (!q || !k) return { question_id: r.question_id, is_correct: false, marks: 0, awarded: 0, known: false };

      const ranges: [number, number][] =
        Array.isArray(k.nat_ranges) && k.nat_ranges.length
          ? (k.nat_ranges as [number, number][])
          : k.nat_min !== null && k.nat_max !== null ? [[Number(k.nat_min), Number(k.nat_max)]] : [];
      answers[r.question_id] = { c: k.correct_option_ids ?? [], n: ranges.length ? ranges : null };

      const attempted = q.question_type === "NAT" ? typeof r.nat_value === "number" : !!r.selected_option_ids?.length;
      const correct = attempted && (q.question_type === "NAT"
        ? isNatCorrect(r.nat_value, ranges.map(([min, max]) => ({ min, max })))
        : isOptionsCorrect(q.question_type, r.selected_option_ids, k.correct_option_ids ?? []));
      const marks = Number(q.marks) || 0;
      const awarded = marksFor(q.question_type, marks, attempted, correct);
      maxScore += marks;
      score += awarded;
      return { question_id: r.question_id, is_correct: correct, marks, awarded, known: true };
    });
    score = Math.round(score * 100) / 100;

    let stored = false;
    let attemptMockId: string | null = null;
    const attempt = parsed.data.attempt;
    if (userId && attempt) {
      const known = results.filter((r) => r.known);
      if (known.length) {
        const nowIso = new Date().toISOString();
        const { data: row } = await db.from("exam_attempts")
          .select("id, user_id, status, server_started_at, duration_seconds, question_ids, mock_id")
          .eq("id", attempt.id).maybeSingle();
        if (row && row.user_id === userId) attemptMockId = row.mock_id ?? null;

        if (row && row.user_id !== userId) {
          stored = false; // someone else's attempt id — never touch it
        } else if (row && row.status === "submitted") {
          stored = true; // retried submit — already recorded
        } else {
          const flags = integrityFlags({ row, attempt, responses, knownIds: known.map((r) => r.question_id), nowIso });
          let attemptOk = false;
          if (row) {
            const { error } = await db.from("exam_attempts").update({
              submitted_at: nowIso, server_score: score, server_max: maxScore,
              status: "submitted", mode: attempt.mode, integrity_flags: flags,
            }).eq("id", attempt.id).eq("status", "in_progress");
            attemptOk = !error;
            if (error) console.error("updating attempt failed", error);
          } else {
            const { error } = await db.from("exam_attempts").insert({
              id: attempt.id, user_id: userId, branch_code: "CSE",
              config: { title: attempt.title ?? null },
              question_ids: known.map((r) => r.question_id),
              mode: attempt.mode,
              server_started_at: attempt.started_at ?? nowIso,
              duration_seconds: attempt.duration_seconds,
              submitted_at: nowIso, server_score: score, server_max: maxScore,
              status: "submitted", integrity_flags: flags,
            });
            attemptOk = !error || error.code === "23505";
            if (error && error.code !== "23505") console.error("storing attempt failed", error);
          }
          if (attemptOk) {
            const { error: rErr } = await db.from("exam_responses").insert(
              known.map((r) => {
                const src = byId.get(r.question_id)!;
                return {
                  attempt_id: attempt.id,
                  question_id: r.question_id,
                  selected_option_ids: src.selected_option_ids ?? null,
                  nat_value: src.nat_value ?? null,
                  time_spent_seconds: src.time_spent_seconds ?? null,
                  marked_for_review: !!src.marked_for_review,
                };
              })
            );
            if (rErr) console.error("storing responses failed", rErr);
            stored = !rErr;
          }
        }
      }
    }

    // Only an All-India mock attempt is held: graded and stored above, but its score,
    // per-question results and keys are released with everyone's at the results time.
    // Every other test (Exam Setup, practice, revision) is always graded immediately.
    const holdUntil = await mockResultHold(db, attemptMockId);
    if (holdUntil) {
      return NextResponse.json(
        { withheld: true, results_at: holdUntil, stored },
        { headers: { "Cache-Control": "private, no-store" } }
      );
    }

    return NextResponse.json(
      { results, score, max_score: maxScore, answers, stored },
      { headers: { "Cache-Control": "private, no-store" } }
    );
  } catch (err) {
    console.error("Failed to grade exam submission:", err);
    return NextResponse.json({ error: "Failed to grade submission" }, { status: 503 });
  }
}

type Flag = { code: string; value?: number; reason?: string };

/**
 * Step 11 (5C): integrity signals, recorded — never used to reject or re-score (shadow
 * flags first). Flagged attempts are excluded from leaderboards, never deleted.
 */
function integrityFlags(input: {
  row: { server_started_at: string; duration_seconds: number; question_ids: string[]; mock_id?: string | null } | null;
  attempt: { integrity?: { tab_blurs?: number; fullscreen_exits?: number; paused_seconds?: number; disqualified_reason?: string } };
  responses: { question_id: string; time_spent_seconds?: number; selected_option_ids?: string[]; nat_value?: number }[];
  knownIds: string[];
  nowIso: string;
}): Flag[] {
  const flags: Flag[] = [];
  const sig = input.attempt.integrity ?? {};
  if (!input.row) {
    flags.push({ code: "no_start_token" });
  } else {
    const elapsed = (Date.parse(input.nowIso) - Date.parse(input.row.server_started_at)) / 1000;
    // Mocks can't be paused (like the real exam): paused time never excuses over-time there.
    const paused = input.row.mock_id ? 0 : Math.max(0, sig.paused_seconds ?? 0);
    const GRACE = input.row.mock_id ? 120 : 600; // network hiccups, slow submit (tighter for mocks)
    if (elapsed - paused > input.row.duration_seconds + GRACE) flags.push({ code: "over_time", value: Math.round(elapsed - paused - input.row.duration_seconds) });
    if (paused > 7200) flags.push({ code: "long_pause", value: Math.round(paused) });
    const allowed = new Set(input.row.question_ids);
    const outside = input.knownIds.filter((id) => !allowed.has(id)).length;
    if (outside) flags.push({ code: "question_set_mismatch", value: outside });
  }
  // Only for mocks do these decide ranking (lib/exam/integrity-rules.ts); practice just records them.
  if (sig.disqualified_reason) flags.push({ code: "disqualified", value: sig.tab_blurs, reason: sig.disqualified_reason.slice(0, 200) });
  if ((sig.tab_blurs ?? 0) >= MOCK_TAB_SWITCH_LIMIT) flags.push({ code: "tab_switches", value: sig.tab_blurs });
  if ((sig.fullscreen_exits ?? 0) >= 3) flags.push({ code: "fullscreen_exits", value: sig.fullscreen_exits });
  const rapid = input.responses.filter((r) => (r.selected_option_ids?.length || typeof r.nat_value === "number") && typeof r.time_spent_seconds === "number" && r.time_spent_seconds < 5).length;
  if (rapid >= 10) flags.push({ code: "rapid_answers", value: rapid });
  return flags;
}
