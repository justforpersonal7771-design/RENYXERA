import "server-only";
import { getGoogleGenAIClient, GEMINI_LITE_MODEL } from "@/lib/ai/gemini";
import { pickModels, benchModel } from "@/lib/ai/model-picker";

/**
 * One entry point for every server-side model call.
 *
 * With OPENROUTER_API_KEYS set (comma separated: one key per account) requests go to OpenRouter, trying each model in
 * the list with each key in turn, and moving on when a key/model is rate limited, out of free quota, or erroring.
 * If every OpenRouter attempt fails, Gemini answers, so the app never goes down because a free model did.
 *   OPENROUTER_API_KEYS          key1,key2
 *   Models are chosen automatically per task by lib/ai/model-picker.ts (free text models with JSON support, ranked).
 *   OPENROUTER_MODELS_FAST / _SMART / _FORGE optionally force a list.
 * Without a key everything uses Gemini exactly as before.
 */
const list = (v?: string) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
let rot = 0; // spreads load across keys

/** Free models do not all honour JSON mode; take the outermost {...} of whatever came back. */
function extractJson(text: string): string | null {
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  const cut = text.slice(a, b + 1);
  try { JSON.parse(cut); return cut; } catch { return null; }
}

async function viaOpenRouter(fast: boolean, o: { systemInstruction: string; prompt: string; maxOutputTokens: number; signal?: AbortSignal }): Promise<string | null> {
  const keys = list(process.env.OPENROUTER_API_KEYS || process.env.OPENROUTER_API_KEY);
  if (!keys.length) return null;
  const models = await pickModels(fast ? "fast" : "smart");
  if (!models.length) return null;
  const deadline = Date.now() + 22_000; // leave room for the Gemini fallback inside the route timeout
  for (const model of models) {
    for (let k = 0; k < keys.length; k++) {
      if (Date.now() > deadline) return null;
      const key = keys[(rot + k) % keys.length];
      try {
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          signal: o.signal,
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "X-Title": "RENYXERA" },
          body: JSON.stringify({
            model,
            max_tokens: o.maxOutputTokens,
            response_format: { type: "json_object" },
            messages: [{ role: "system", content: o.systemInstruction }, { role: "user", content: o.prompt }],
          }),
        });
        if (!res.ok) { if (res.status === 429 || res.status === 402) rot++; else if (res.status === 404 || res.status === 400) { benchModel(model); break; } continue; } // next key, then next model
        const j = await res.json();
        const json = extractJson(String(j?.choices?.[0]?.message?.content ?? ""));
        if (json) return json;
      } catch (e) {
        if (o.signal?.aborted) throw e;
      }
    }
  }
  return null;
}

export async function generateJson(opts: { geminiModel: string; systemInstruction: string; prompt: string; maxOutputTokens: number; signal?: AbortSignal }): Promise<string> {
  const viaOr = await viaOpenRouter(opts.geminiModel === GEMINI_LITE_MODEL, opts);
  if (viaOr) return viaOr;
  const response = await getGoogleGenAIClient().models.generateContent({
    model: opts.geminiModel,
    contents: opts.prompt,
    config: { systemInstruction: opts.systemInstruction, responseMimeType: "application/json", maxOutputTokens: opts.maxOutputTokens },
  });
  return response.text ?? "";
}
