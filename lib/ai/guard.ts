/**
 * Input guard for the AI Mentor (performance/AI toolkit, docs/roadmap/R28-PERFORMANCE-TOOLKIT.md, item "prompt injection").
 * The Mentor prompt is built on the server from a fixed template, but the student's own words are placed inside it, so a message like
 * "ignore all previous instructions and ..." could steer the model. This screens the text for the well-known override phrases before any
 * model call (no model cost, no latency). It is deliberately narrow: ordinary study questions never contain these phrases.
 */
const PATTERNS: RegExp[] = [
  /ignore\s+(all\s+|any\s+|the\s+)?(previous|prior|above|earlier|preceding)\s+(instructions?|prompts?|rules?|messages?)/i,
  /disregard\s+(all\s+|any\s+|the\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?)/i,
  /forget\s+(all\s+|everything\s+)?(your|the)\s+(previous\s+|prior\s+)?(instructions?|rules?|system\s+prompt)/i,
  /(reveal|show|print|repeat|leak)\s+(me\s+)?(your|the)\s+(system|hidden|initial)\s+(prompt|instructions?)/i,
  /you\s+are\s+now\s+(dan|in\s+developer\s+mode|an?\s+unrestricted)/i,
  /\bjailbreak\b|\bdeveloper\s+mode\b.*\benabled?\b/i,
];

/** Collects every string inside a request (any depth) so a hidden field cannot carry the override. */
function strings(v: unknown, out: string[] = [], depth = 0): string[] {
  if (depth > 6) return out;
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => strings(x, out, depth + 1));
  else if (v && typeof v === "object") Object.values(v as Record<string, unknown>).forEach((x) => strings(x, out, depth + 1));
  return out;
}

export function looksLikeInjection(request: unknown): boolean {
  return strings(request).some((s) => s.length < 20_000 && PATTERNS.some((p) => p.test(s)));
}
