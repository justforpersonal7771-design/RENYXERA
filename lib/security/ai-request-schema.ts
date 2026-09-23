import { z } from "zod";

/**
 * Validated request contract for /api/ai/generate.
 *
 * The old contract was `{ systemInstruction, prompt }` — two free-form strings the
 * client assembled entirely on its own and the server forwarded verbatim to Gemini.
 * That let any caller replace our system prompt outright (prompt injection / brand
 * safety, not just a cost problem) and had no bound on payload size.
 *
 * The new contract is `{ type, params }`: the client names WHICH of a fixed set of
 * prompt templates it wants (an enum, matching the PromptBuilder methods in
 * lib/ai/ai-prompts.ts) and supplies only structured data. The actual instruction text
 * is built server-side from that fixed template — the client can no longer author or
 * override it. `params` is still client-supplied (there's no backend DB yet to source
 * learner context from — that's Release 4/Supabase), so it's bounded here: capped
 * string lengths and array lengths keep both the attack surface and the token cost
 * small regardless of what a caller sends.
 */

// Mirrors the AIContext.studentStats field the PromptBuilder interpolates directly.
const studentStatsSchema = z.object({
  masteryScore: z.number().finite(),
  readinessScore: z.number().finite(),
  confidenceScore: z.number().finite(),
  studyMomentum: z.number().finite(),
  consistencyScore: z.number().finite(),
  weakestSubject: z.string().max(120),
  strongestSubject: z.string().max(120),
  mostImprovingTopic: z.string().max(120),
  mostDecliningTopic: z.string().max(120),
});

// The nested domain records (mistakes, bookmarks, planner tasks, sessions) come from the
// caller's own IndexedDB and their exact shape is allowed to evolve independently of this
// route. Rather than duplicating (and inevitably drifting from) every domain type here,
// each entry is a loosely-typed record with an overall size ceiling, and the arrays
// themselves are length-capped — that bounds payload size and token cost without this
// schema becoming a second source of truth for unrelated types.
const looseRecord = z.record(z.string(), z.unknown());

const aiContextSchema = z.object({
  currentQuestion: looseRecord.optional(),
  currentResponse: z
    .object({
      selectedOptions: z.array(z.string().max(200)).max(20),
      natValue: z.string().max(100).optional(),
      isCorrect: z.boolean(),
      timeSpentSeconds: z.number().finite().nonnegative(),
    })
    .optional(),
  studentStats: studentStatsSchema,
  weakTopics: z.array(z.string().max(120)).max(50),
  strongTopics: z.array(z.string().max(120)).max(50),
  recentMistakes: z.array(looseRecord).max(50),
  bookmarks: z.array(looseRecord).max(50),
  activePlannerTasks: z.array(looseRecord).max(50),
  recentSessions: z.array(looseRecord).max(50),
  revisionQueue: z.array(z.string().max(200)).max(100),
});

// These two lists must stay in sync with EXPLAIN_MODES / PERSONALITIES in
// app/(dashboard)/ai-tutor/page.tsx — that UI is the canonical source of the values a
// real client ever sends.
const MODES = [
  "Detailed", "Simple", "Exam Oriented", "Mathematical", "Visual",
  "Algorithmic", "Pseudo Code", "Step-by-Step", "Beginner", "Advanced",
] as const;

const PERSONALITIES = [
  "Mentor", "Teacher", "Examiner", "Interviewer", "Motivator",
  "Fast Solver", "Concept Builder", "Revision Coach",
] as const;

// PromptBuilder falls back to a sane default for any mode/personality value it doesn't
// recognize (see the if/else chains in ai-prompts.ts), so an unrecognized value here isn't
// a safety issue — it's just user-facing customization data. Still enumerated (rather than
// left as an open string) because a server-owned enum for these selectors is the point of
// this hardening pass, and it keeps the field self-documenting.
const modeSchema = z.enum(MODES).optional();
const personalitySchema = z.enum(PERSONALITIES).optional();

const explainParamsSchema = z.object({
  context: aiContextSchema,
  mode: modeSchema,
  personality: personalitySchema,
});

const hintParamsSchema = z.object({
  context: aiContextSchema,
});

const shortcutParamsSchema = z.object({
  context: aiContextSchema,
});

const practiceParamsSchema = z.object({
  context: aiContextSchema,
  topic: z.string().min(1).max(120),
  subject: z.string().min(1).max(120),
  // The app's own diverse-practice-set generator (lib/ai/practice-generator.ts) asks for
  // 8 in a single call (one each of Easy/Medium/Hard/NAT/MSQ/Interview/Conceptual/Trick);
  // 10 leaves that headroom without leaving the field effectively unbounded.
  count: z.number().int().min(1).max(10),
  samples: z.array(looseRecord).max(5).optional(),
  currentQuestion: looseRecord.optional(),
});

const revisionParamsSchema = z.object({
  context: aiContextSchema,
  subject: z.string().min(1).max(120),
});

const followUpParamsSchema = z.object({
  context: aiContextSchema,
  // A real chat turn's `text` can include a serialized prior AIExplanation (concept +
  // steps + LaTeX formulas) appended by the UI, not just the raw user message — hence the
  // higher per-message cap than nextMessage. Both caps, plus the array length cap, are
  // backstopped by the route's overall MAX_BODY_BYTES regardless of how a long session
  // accumulates.
  history: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string().max(8000),
      })
    )
    .max(60),
  nextMessage: z.string().min(1).max(4000),
});

/**
 * Server-owned enum of the only prompt templates this route will ever build. A `type`
 * outside this set is rejected before any Gemini call is made.
 */
export const aiRequestSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("EXPLAIN"), params: explainParamsSchema }),
  z.object({ type: z.literal("HINT"), params: hintParamsSchema }),
  z.object({ type: z.literal("SHORTCUT"), params: shortcutParamsSchema }),
  z.object({ type: z.literal("PRACTICE"), params: practiceParamsSchema }),
  z.object({ type: z.literal("REVISION"), params: revisionParamsSchema }),
  z.object({ type: z.literal("FOLLOWUP"), params: followUpParamsSchema }),
]);

export type AIGenerateRequest = z.infer<typeof aiRequestSchema>;
