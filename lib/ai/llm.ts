import "server-only";
import { getGoogleGenAIClient, GEMINI_LITE_MODEL } from "@/lib/ai/gemini";

/**
 * One entry point for every server-side model call. If OPENROUTER_API_KEY is set, requests go to OpenRouter
 * (OpenAI-compatible; many models, the owner's token balance) and fall back to Gemini when OpenRouter fails or
 * is out of credit. Without the key everything uses Gemini exactly as before.
 *   OPENROUTER_MODEL_FAST   short formulaic tasks (hints, shortcuts)
 *   OPENROUTER_MODEL_SMART  reasoning tasks (explain, mentor chat, practice sets)
 */
export async function generateJson(opts: { geminiModel: string; systemInstruction: string; prompt: string; maxOutputTokens: number; signal?: AbortSignal }): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (key) {
    const model = opts.geminiModel === GEMINI_LITE_MODEL
      ? process.env.OPENROUTER_MODEL_FAST || process.env.OPENROUTER_MODEL_SMART
      : process.env.OPENROUTER_MODEL_SMART;
    if (model) {
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          signal: opts.signal,
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Title": "RENYXERA" },
          body: JSON.stringify({
            model,
            max_tokens: opts.maxOutputTokens,
            response_format: { type: "json_object" },
            messages: [{ role: "system", content: opts.systemInstruction }, { role: "user", content: opts.prompt }],
          }),
        });
        if (res.ok) {
          const j = await res.json();
          const text = j?.choices?.[0]?.message?.content;
          if (typeof text === "string" && text.trim()) return text;
        } else console.warn("[llm] openrouter status", res.status);
      } catch (e) {
        if (opts.signal?.aborted) throw e;
        console.warn("[llm] openrouter failed, using Gemini", String((e as Error)?.message).slice(0, 100));
      }
    }
  }
  const response = await getGoogleGenAIClient().models.generateContent({
    model: opts.geminiModel,
    contents: opts.prompt,
    config: { systemInstruction: opts.systemInstruction, responseMimeType: "application/json", maxOutputTokens: opts.maxOutputTokens },
  });
  return response.text ?? "";
}
