// Cache key for question-level AI answers (hints, shortcuts, standard explanations of an
// official PYQ). Shared by the student-facing route and the background pre-generator, so an
// answer generated overnight is served to every student later. Mode/personality are part of
// the key; undefined means the default the student gets without choosing one.
export async function sharedCacheKey(type: string, questionId: string, mode?: string, personality?: string) {
  const raw = `shared:v1:${type}:${questionId}:${mode || "-"}:${personality || "-"}`;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const PREGEN_KINDS = ["HINT", "SHORTCUT", "EXPLAIN"] as const;
