"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "./env";

/**
 * Supabase client for use in Client Components. Auth state is read from cookies (via
 * @supabase/ssr), kept in sync with the server client below by middleware.ts.
 *
 * Only ever uses the publishable/anon key — every table this key can read anything
 * from is gated by Row Level Security (see supabase/migrations/0001_init.sql), not by
 * keeping this key secret. It's safe to ship to the browser by design.
 */
export function createClient() {
  const { url, publishableKey } = getSupabasePublicEnv();
  return createBrowserClient(url, publishableKey);
}
