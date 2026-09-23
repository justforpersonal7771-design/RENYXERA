import { z } from "zod";

/** One submitted answer for one question. Exactly matches what the client can honestly
 *  know about its own attempt — a question id and what the user picked/typed. Never a
 *  score, never a correctness flag; those are computed server-side in the grade route. */
export const gradeRequestSchema = z.object({
  responses: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        selected_option_ids: z.array(z.string().max(10)).max(10).optional(),
        nat_value: z.number().finite().optional(),
      })
    )
    // GATE CSE papers run up to ~65 questions; 200 leaves headroom for longer custom/
    // multi-paper attempts without being an effectively unbounded array.
    .min(1)
    .max(200),
});

export type GradeRequest = z.infer<typeof gradeRequestSchema>;
