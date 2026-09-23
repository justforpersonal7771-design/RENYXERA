import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Privileged Supabase client using the service_role key — bypasses Row Level Security
 * entirely. This is the ONLY client in the codebase that can read public.question_answers
 * (see supabase/migrations/0001_init.sql — that table has no RLS policy for anon or
 * authenticated at all, by design).
 *
 * The `import "server-only"` line is not a comment, it's an active guard: that package
 * makes the Next.js build FAIL if this module is ever imported from a Client Component
 * or any code that could end up in the browser bundle. This is the CI-grep the master
 * plan (§4A) describes, except enforced at build time rather than as a post-hoc check —
 * stronger, because there's no separate script to remember to run or that could go stale.
 *
 * SUPABASE_SERVICE_ROLE_KEY must be set as a server-only env var (Vercel/Cloudflare
 * dashboard, or .env.local for local dev) and must NEVER be prefixed with NEXT_PUBLIC_.
 *
 * Use this only where privilege is actually required and the access is itself gated by
 * an application-level check (e.g. the exam grading route validates the caller's
 * session token before using this client to read the answer key for THEIR attempt) —
 * this client has no RLS to fall back on if that check is missing.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY " +
        "(server-only — see .env.example). Never expose SUPABASE_SERVICE_ROLE_KEY as a NEXT_PUBLIC_* var."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
