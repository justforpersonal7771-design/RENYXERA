import { NextRequest, NextResponse } from "next/server";
import { getGoogleGenAIClient, AI_ROUTE } from "@/lib/ai/gemini";
import { PromptBuilder } from "@/lib/ai/ai-prompts";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { PREGEN_KINDS, sharedCacheKey } from "@/lib/ai/shared-cache";

export const runtime = "nodejs";

/**
 * Background pre-generation of question-level AI answers (docs/AI_USAGE_STRATEGY.md §3.1).
 * Called by the "AI pre-generation" GitHub Action (and later the admin console) with the
 * PREGEN_SECRET header — never by students. Each call processes up to `batch` items of the
 * fixed sequence (every official question × HINT, SHORTCUT, EXPLAIN), saving each answer
 * under the shared cache key students' requests use. The cursor only moves after an item is
 * saved or recorded as failed; when Gemini's quota is exhausted it pauses until the daily
 * reset and the next call resumes from the same item. Turn it off with
 * ai_pregen_control.enabled = false (or disable the workflow).
 */
const NEUTRAL_STATS = { masteryScore: 0, readinessScore: 0, confidenceScore: 0, studyMomentum: 0, consistencyScore: 0, weakestSubject: "", strongestSubject: "", mostImprovingTopic: "", mostDecliningTopic: "" };

function safeEqual(a: string, b: string) {
  if (!a || a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

/** Gemini's free quota resets at midnight Pacific ≈ 08:00 UTC; pause until the next one. */
function nextQuotaReset() {
  const d = new Date();
  const r = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 8, 5));
  if (r.getTime() <= d.getTime()) r.setUTCDate(r.getUTCDate() + 1);
  return r.toISOString();
}

function isQuotaError(err: unknown) {
  const s = String((err as { status?: number })?.status ?? "") + " " + String((err as Error)?.message ?? err);
  return /429|RESOURCE_EXHAUSTED|quota/i.test(s);
}

export async function POST(req: NextRequest) {
  const secret = process.env.PREGEN_SECRET || "";
  if (!secret || !safeEqual(req.headers.get("x-pregen-secret") ?? "", secret)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const batch = Math.min(10, Math.max(1, Number(body?.batch) || 6));
  const db = createServiceRoleClient();

  const { data: ctl } = await db.from("ai_pregen_control").select("*").eq("id", 1).maybeSingle();
  if (!ctl) return NextResponse.json({ error: "Run migration 0025 first." }, { status: 503 });
  if (!ctl.enabled) return NextResponse.json({ ok: true, state: "disabled" });
  if (ctl.paused_until && Date.parse(ctl.paused_until) > Date.now()) return NextResponse.json({ ok: true, state: "paused", until: ctl.paused_until, cursor: ctl.cursor });

  // The fixed sequence: newest papers first, question order, then HINT → SHORTCUT → EXPLAIN.
  const { data: qs, error: qErr } = await db.from("questions").select("id").like("id", "GATE_%")
    .order("year", { ascending: false }).order("session", { ascending: true }).order("question_no", { ascending: true }).range(0, 9999);
  if (qErr || !qs?.length) return NextResponse.json({ error: "Couldn't load questions." }, { status: 503 });
  const total = qs.length * PREGEN_KINDS.length;

  let cursor: number = ctl.cursor;
  let pass: number = ctl.pass;
  const done: string[] = [];
  let message = "";

  for (let n = 0; n < batch; n++) {
    if (cursor >= total) {
      // Pass complete — start again to retry anything that failed.
      const { count } = await db.from("ai_pregen_items").select("question_id", { count: "exact", head: true }).eq("status", "failed");
      if (!count) { message = `All ${total} items cached.`; break; }
      cursor = 0; pass += 1;
    }
    const qid = qs[Math.floor(cursor / PREGEN_KINDS.length)].id as string;
    const kind = PREGEN_KINDS[cursor % PREGEN_KINDS.length];

    // Already done in an earlier pass → skip quickly.
    const { data: prev } = await db.from("ai_pregen_items").select("status, attempts").eq("question_id", qid).eq("kind", kind).maybeSingle();
    if (prev?.status === "done") { cursor++; continue; }

    const [{ data: q }, { data: opts }, { data: ans }] = await Promise.all([
      db.from("questions").select("*").eq("id", qid).maybeSingle(),
      db.from("question_options").select("option_id, text").eq("question_id", qid).order("option_id"),
      db.from("question_answers").select("correct_option_ids, nat_min, nat_max").eq("question_id", qid).maybeSingle(),
    ]);
    if (!q) { cursor++; continue; }
    const currentQuestion = {
      question_id: q.id, subject: q.subject, topic: q.topic, section: q.section, marks: q.marks, difficulty: q.difficulty,
      question_type: q.question_type, year: q.year, contentAst: q.question_text, question_text: q.question_text,
      options: (opts ?? []).map((o) => ({ option_id: o.option_id, text: o.text, is_correct: (ans?.correct_option_ids ?? []).includes(o.option_id) })),
      nat_answer_range: ans?.nat_min != null ? [ans.nat_min, ans.nat_max] : undefined,
    };
    const context = { currentQuestion, studentStats: NEUTRAL_STATS, weakTopics: [], strongTopics: [], recentMistakes: [], bookmarks: [], activePlannerTasks: [], recentSessions: [], revisionQueue: [] };
    const route = AI_ROUTE[kind];
    const key = await sharedCacheKey(kind, qid);

    try {
      const { systemInstruction, prompt } =
        kind === "HINT" ? PromptBuilder.buildHintPrompt(context as any)
        : kind === "SHORTCUT" ? PromptBuilder.buildShortcutPrompt(context as any)
        : PromptBuilder.buildExplainPrompt(context as any);
      const res = await getGoogleGenAIClient().models.generateContent({
        model: route.model, contents: prompt,
        config: { systemInstruction, responseMimeType: "application/json", maxOutputTokens: route.maxOutputTokens },
      });
      const text = res.text ?? "";
      JSON.parse(text); // must be complete JSON, or it's recorded as failed and retried later
      await db.from("ai_response_cache").upsert({ prompt_hash: key, response: text });
      await db.from("ai_pregen_items").upsert({ question_id: qid, kind, status: "done", model: route.model, cache_key: key, error: null, attempts: (prev?.attempts ?? 0) + 1, updated_at: new Date().toISOString() });
      done.push(`${qid}:${kind}`);
      cursor++;
    } catch (err) {
      if (isQuotaError(err)) {
        const until = nextQuotaReset();
        await db.from("ai_pregen_control").update({ cursor, pass, paused_until: until, last_run_at: new Date().toISOString(), last_message: `Quota exhausted at item ${cursor} (${qid} ${kind}); resuming ${until}`, updated_at: new Date().toISOString() }).eq("id", 1);
        return NextResponse.json({ ok: true, state: "quota", cursor, total, done, until });
      }
      await db.from("ai_pregen_items").upsert({ question_id: qid, kind, status: "failed", model: route.model, cache_key: key, error: String((err as Error)?.message ?? err).slice(0, 500), attempts: (prev?.attempts ?? 0) + 1, updated_at: new Date().toISOString() });
      cursor++;
    }
  }

  await db.from("ai_pregen_control").update({ cursor, pass, paused_until: null, last_run_at: new Date().toISOString(), last_message: message || `Processed up to item ${cursor} of ${total} (pass ${pass}).`, updated_at: new Date().toISOString() }).eq("id", 1);
  return NextResponse.json({ ok: true, state: message ? "complete" : "running", cursor, total, pass, done });
}
