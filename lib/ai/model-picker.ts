/**
 * Picks OpenRouter models per task, by itself. Reads OpenRouter's public model list (cached 6 h), keeps only FREE text
 * models that support JSON output, and ranks them by task: strongest reasoning first for "smart" and "forge",
 * small and quick first for "fast". A model that errors is benched for 30 minutes so the next one is tried first.
 * Env lists (OPENROUTER_MODELS_FAST / _SMART / _FORGE) always override this. No imports, so scripts can use it too.
 *   fast  : hints, shortcuts, short answers
 *   smart : explanations, Mentor chat, practice sets
 *   forge : question generation and blind re-solve (accuracy matters most; speed does not)
 */
export type Task = "fast" | "smart" | "forge";

// Best first. Matched as substrings of the model id with - _ . removed. Edit this list as new models appear.
const PREF: Record<Task, string[]> = {
  forge: ["deepseekr1", "qwen3235b", "qwen3max", "kimik2", "gptoss120b", "deepseekv3", "glm45", "llama3370b", "qwen332b", "gemma327b"],
  smart: ["deepseekv3", "qwen3235b", "kimik2", "gptoss120b", "deepseekr1", "glm45", "llama3370b", "mistrallarge", "qwen332b", "gemma327b"],
  fast: ["gptoss20b", "gemma3", "llama318b", "mistralsmall", "qwen38b", "glm45air", "llama32", "qwen3"],
};
const STATIC: Record<Task, string[]> = {
  forge: ["deepseek/deepseek-r1:free", "qwen/qwen3-235b-a22b:free", "openai/gpt-oss-120b:free"],
  smart: ["deepseek/deepseek-chat-v3-0324:free", "qwen/qwen3-235b-a22b:free", "openai/gpt-oss-120b:free"],
  fast: ["openai/gpt-oss-20b:free", "google/gemma-3-27b-it:free", "meta-llama/llama-3.3-70b-instruct:free"],
};

type OrModel = { id: string; context_length?: number; pricing?: { prompt?: string; completion?: string }; supported_parameters?: string[]; architecture?: { output_modalities?: string[] } };
let cache: { at: number; models: OrModel[] } | null = null;
const benched = new Map<string, number>();
const norm = (s: string) => s.toLowerCase().replace(/[-_.]/g, "");

export function benchModel(id: string) { benched.set(id, Date.now() + 30 * 60_000); }

async function models(): Promise<OrModel[]> {
  if (cache && Date.now() - cache.at < 6 * 3600_000) return cache.models;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models");
    if (res.ok) { cache = { at: Date.now(), models: (await res.json()).data ?? [] }; return cache.models; }
  } catch { /* use the static list */ }
  return cache?.models ?? [];
}

export async function pickModels(task: Task, limit = 4): Promise<string[]> {
  const env = (task === "fast" ? process.env.OPENROUTER_MODELS_FAST : task === "forge" ? process.env.OPENROUTER_MODELS_FORGE : process.env.OPENROUTER_MODELS_SMART) ?? "";
  const forced = env.split(",").map((s) => s.trim()).filter(Boolean);
  if (forced.length) return forced;
  const now = Date.now();
  const free = (await models()).filter((m) =>
    (m.id.endsWith(":free") || (Number(m.pricing?.prompt) === 0 && Number(m.pricing?.completion) === 0)) &&
    (m.architecture?.output_modalities ?? ["text"]).join() === "text" &&
    !/embed|image|vision|audio|guard|moderation/i.test(m.id) &&
    (m.context_length ?? 0) >= 16000 && (benched.get(m.id) ?? 0) < now);
  const rank = (m: OrModel) => {
    const id = norm(m.id); const i = PREF[task].findIndex((p) => id.includes(p));
    const json = m.supported_parameters?.includes("response_format") || m.supported_parameters?.includes("structured_outputs") ? 0 : 1.5;
    return (i < 0 ? 50 : i) + json - Math.min(2, (m.context_length ?? 0) / 100000);
  };
  const picked = free.sort((a, b) => rank(a) - rank(b)).map((m) => m.id).slice(0, limit);
  return picked.length ? picked : STATIC[task].filter((id) => (benched.get(id) ?? 0) < now);
}
