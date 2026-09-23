/**
 * Reads the two client-safe Supabase env vars with a single, defensive fallback.
 *
 * Supabase renamed the classic "anon key" to "publishable key" during 2026; new
 * projects' dashboards show `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`-style naming, while
 * older material (and some existing setups) still says `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
 * Both names refer to the same client-safe key — supporting both here means whichever
 * one you copy from the dashboard just works, instead of this needing an edit later.
 *
 * Both vars are intentionally `NEXT_PUBLIC_*` — this key is designed to be public (it's
 * paired with Row Level Security, not secrecy) and ships to the browser. It is NOT the
 * service_role key — that one is server-only and lives in lib/supabase/server.ts.
 */
export function getSupabasePublicEnv(): { url: string; publishableKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error(
      "Missing Supabase env vars: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY " +
        "(or the legacy NEXT_PUBLIC_SUPABASE_ANON_KEY) — see .env.example."
    );
  }

  return { url, publishableKey };
}
