import { RateLimiter } from "./rate-limiter";
import { TokenEstimator } from "./token-estimator";
import { IDBManager } from "../repository/storage/idb-manager";
import { AIResponse, AITokenUsage } from "@/types/ai.types";

// The set of server-owned prompt templates — must stay in sync with the discriminated
// union in lib/security/ai-request-schema.ts and the switch in app/api/ai/generate/route.ts.
export type AIRequestType = "EXPLAIN" | "HINT" | "SHORTCUT" | "PRACTICE" | "REVISION" | "FOLLOWUP";

export class AIClient {
  /**
   * Deterministic hash helper to generate cache keys. Hashes the request `type` plus its
   * `params` (rather than the old systemInstruction+prompt strings) — same identity
   * property (same inputs -> same hash -> cache hit), but now over the data the client
   * actually sends, since the instruction text itself is built server-side.
   */
  public static generateHash(type: string, params: unknown): string {
    const combined = `${type}||${JSON.stringify(params)}`;
    let hash = 5381;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash * 33) ^ combined.charCodeAt(i);
    }
    return (hash >>> 0).toString(16);
  }

  private static cleanJsonString(raw: string): string {
    let str = raw.trim();
    if (str.startsWith("```")) {
      const lines = str.split("\n");
      if (lines[0].startsWith("```")) lines.shift();
      if (lines[lines.length - 1].startsWith("```")) lines.pop();
      str = lines.join("\n").trim();
    }
    // Fix trailing commas
    str = str.replace(/,\s*([\]}])/g, '$1');
    
    // Character by character escaping of invalid LaTeX backslash escapes in JSON strings
    let result = "";
    let i = 0;
    while (i < str.length) {
      const char = str.charAt(i);
      if (char === '\\') {
        if (i + 1 < str.length) {
          const next = str.charAt(i + 1);
          
          let isControlChar = false;
          if (next === 'n' || next === 't' || next === 'r' || next === 'b' || next === 'f') {
            if (i + 2 < str.length) {
              const third = str.charAt(i + 2);
              if (!/[a-zA-Z]/.test(third)) {
                isControlChar = true;
              }
            } else {
              isControlChar = true;
            }
          } else if (next === '"' || next === '\\' || next === '/') {
            isControlChar = true;
          } else if (next === 'u' && i + 5 < str.length && /^[0-9a-fA-F]{4}$/.test(str.substring(i + 2, i + 6))) {
            isControlChar = true;
          }

          if (isControlChar) {
            result += '\\' + next;
            i += 2;
            if (next === 'u') {
              result += str.substring(i, i + 4);
              i += 4;
            }
            continue;
          }
        }
        // Double escape invalid escapes (like \c in \cdot, \l in \log, \f in \frac)
        result += '\\\\';
        i++;
      } else {
        result += char;
        i++;
      }
    }
    return result;
  }

  /**
   * Dispatches request to Google Gemini under rate limiter guards, incorporating IDB caching.
   *
   * `type` names one of the server-owned prompt templates (see ai-request-schema.ts);
   * `params` is the structured data that template needs. The server builds the actual
   * systemInstruction/prompt strings itself — this client never sends instruction text.
   */
  public static async request<T>(
    requestId: string,
    type: AIRequestType,
    params: Record<string, unknown>,
    options: {
      questionId?: string;
      topic?: string;
      ttlHours?: number;
      bypassCache?: boolean;
    } = {}
  ): Promise<AIResponse<T>> {
    const hash = this.generateHash(type, params);
    const bypassCache = options.bypassCache || false;
    const ttlHours = options.ttlHours || 24; // 24 hours cache duration by default

    // 1. Caching check
    if (!bypassCache) {
      const cachedRecord = await IDBManager.getAIResponse(hash);
      if (cachedRecord) {
        try {
          const parsedData = JSON.parse(cachedRecord.response) as T;
          return {
            success: true,
            data: parsedData,
            cached: true,
          };
        } catch {
          // If parse fails, proceed to live request
        }
      }
    }

    try {
      // 2. Rate Limited Request execution — proxied through the server so the
      // Gemini API key never reaches the browser (see app/api/ai/generate/route.ts).
      const responseText = await RateLimiter.enqueue(requestId, async (signal) => {
        const res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, params }),
          signal,
        });

        if (signal.aborted) {
          throw new Error("Request aborted");
        }

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(body?.error || `AI request failed with status ${res.status}`);
        }

        return body.text as string | undefined;
      });

      if (!responseText) {
        throw new Error("Empty response received from Gemini API");
      }

      // Parse JSON payload
      const cleaned = this.cleanJsonString(responseText);
      const data = JSON.parse(cleaned) as T;

      // Token estimation — approximated from the outgoing params payload since the actual
      // systemInstruction/prompt strings are now built server-side and never seen here.
      const promptTokens = TokenEstimator.estimateTokens(JSON.stringify(params));
      const candidatesTokens = TokenEstimator.estimateTokens(responseText);
      const tokenUsage: AITokenUsage = {
        promptTokens,
        candidatesTokens,
        totalTokens: promptTokens + candidatesTokens
      };

      // 3. Cache response into IndexedDB
      const ttl = Date.now() + (ttlHours * 60 * 60 * 1000);
      await IDBManager.saveAIResponse({
        promptHash: hash,
        response: responseText,
        createdDate: new Date().toISOString(),
        questionId: options.questionId,
        topic: options.topic,
        ttl
      });

      return {
        success: true,
        data,
        cached: false,
        tokenUsage
      };
    } catch (err: any) {
      console.error("AI Request failed:", err);
      let errMsg = err.message || "Failed to contact Gemini API";
      try {
        if (errMsg.trim().startsWith("{")) {
          const parsed = JSON.parse(errMsg);
          if (parsed?.error?.message) {
            errMsg = parsed.error.message;
          }
        }
      } catch {}
      return {
        success: false,
        error: errMsg,
        cached: false
      };
    }
  }
}
