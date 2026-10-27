// Turn an AI practice set into renderable questions, save them on this device and register them so the
// exam engine can use them. Shared by the AI Tutor ("Generate Set") and Exam Setup ("Spark").
import type { AIPracticeQuestion } from "@/types/ai.types";
import { AIResponseParser } from "@/lib/ai/ai-response-parser";
import { IDBManager } from "@/lib/repository/storage/idb-manager";
import { QuestionRepository } from "@/lib/repository/question-repository";

export async function savePracticeSet(set: AIPracticeQuestion[], subject: string, topic: string): Promise<number> {
  const stamp = Date.now();
  for (let idx = 0; idx < set.length; idx++) {
    const pq = set[idx];
    const correctIds = new Set(pq.correctOptionIds || []);
    const options = pq.options?.map((o) => ({
      option_id: o.option_id,
      is_correct: correctIds.has(o.option_id),
      optionTextRaw: o.content,
      contentAst: AIResponseParser.parse(o.content),
    })) || [];
    const q = {
      question_no: idx + 1,
      question_id: `ai_${stamp}_${idx}`,
      question_type: pq.questionType || "MCQ",
      marks: pq.questionType === "NAT" ? 2 : 1,
      section: "AI Generated",
      subject, topic,
      difficulty: pq.difficulty === "Medium" ? "Moderate" : (pq.difficulty as string),
      year: "AI", shift: "Gen", year_shift: "AI Generated",
      questionTextRaw: pq.questionText,
      contentAst: AIResponseParser.parse(pq.questionText),
      options,
      nat_answer_range: pq.natAnswerRange,
      isAiGenerated: true,
      has_image: false,
      requires_latex: pq.questionText.includes("\\(") || pq.questionText.includes("\\["),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await IDBManager.saveAIGeneratedQuestion(q as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    QuestionRepository.registerDynamicQuestion(q as any);
  }
  return set.length;
}
