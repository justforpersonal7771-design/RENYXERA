import "server-only";
import { GoogleGenAI } from "@google/genai";

// SERVER-ONLY. Never import this module from a "use client" component —
// the `server-only` import above makes that a build-time error. The Gemini
// API key must never reach the browser; only app/api/ai/generate/route.ts
// (and other server route handlers) may call getGoogleGenAIClient().

let aiInstance: GoogleGenAI | null = null;

export function getGoogleGenAIClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not configured. Set it in .env.local (server-side only, no NEXT_PUBLIC_ prefix)."
      );
    }

    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const GEMINI_MODEL = "gemini-3.5-flash"; // 2.5-flash free tier dropped to 20 requests/day (checked 30 Sep 2026)
export const GEMINI_LITE_MODEL = "gemini-3.5-flash-lite"; // 2.5-flash-lite is closed to new API users (checked 30 Sep 2026)

/**
 * Model routing + output caps (docs/AI_USAGE_STRATEGY.md §3.2, §3.4): short, formulaic
 * requests go to Flash-Lite (~5× cheaper, higher free quota); reasoning-heavy ones stay on
 * Flash. Caps are generous so JSON answers never truncate, but stop runaway outputs.
 */
export const AI_ROUTE: Record<string, { model: string; maxOutputTokens: number }> = {
  HINT: { model: GEMINI_LITE_MODEL, maxOutputTokens: 1024 },
  SHORTCUT: { model: GEMINI_LITE_MODEL, maxOutputTokens: 1536 },
  FOLLOWUP: { model: GEMINI_MODEL, maxOutputTokens: 2048 },
  EXPLAIN: { model: GEMINI_MODEL, maxOutputTokens: 3072 },
  PRACTICE: { model: GEMINI_MODEL, maxOutputTokens: 4096 },
  REVISION: { model: GEMINI_MODEL, maxOutputTokens: 4096 },
};
