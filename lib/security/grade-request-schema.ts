import { z } from "zod";

/** One submitted answer for one question. Exactly matches what the client can honestly
 *  know about its own attempt — a question id and what the user picked/typed. Never a
 *  score, never a correctness flag; those are computed server-side in the grade route. */
export const gradeRequestSchema = z.object({
  /** Present on a real submission; lets the server store the attempt (idempotent on id). */
  attempt: z
    .object({
      id: z.string().uuid(),
      started_at: z.string().datetime({ offset: true }).optional(),
      duration_seconds: z.number().int().min(0).max(24 * 3600),
      mode: z.enum(["practice", "graded"]).default("practice"),
      title: z.string().max(200).optional(),
    })
    .optional(),
  responses: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        selected_option_ids: z.array(z.string().max(10)).max(10).optional(),
        nat_value: z.number().finite().optional(),
        time_spent_seconds: z.number().int().min(0).max(24 * 3600).optional(),
        marked_for_review: z.boolean().optional(),
      })
    )
    // GATE CSE papers run up to ~65 questions; 200 leaves headroom for longer custom/
    // multi-paper attempts without being an effectively unbounded array.
    .min(1)
    .max(200),
});

export type GradeRequest = z.infer<typeof gradeRequestSchema>;
