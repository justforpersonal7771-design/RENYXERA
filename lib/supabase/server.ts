import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicEnv } from "./env";

/**
 * Supabase client for Server Components, Route Handlers, and Server Actions. Reads/
 * writes the auth cookie via Next.js's `cookies()` API.
 *
 * `cookies()` is async in Next.js 15's App Router (a change from 14), so this factory
 * is async too — always `await createClient()`, not `createClient()`.
 *
 * Still uses the public/publishable key, not service_role — reads and writes here are
 * subject to RLS as the calling user, exactly like the browser client. For privileged
 * access that must bypass RLS (e.g. the exam grading path, which has to read
 * question_answers), use lib/supabase/service-role.ts instead, never this file.
 */
export async function createClient() {
  const { url, publishableKey } = getSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `setAll` is called from Server Components in some code paths (e.g. during a
          // page render triggered by middleware refreshing the session) where Next.js
          // forbids writing cookies. That's fine here — as long as middleware.ts is
          // refreshing the session on every request, the browser still gets the
          // refreshed cookie via the middleware's own response. This call failing in a
          // Server Component is expected, not a bug — see the Supabase Next.js SSR docs.
        }
      },
    },
  });
}

/**
 * Verifies the current request's session by re-checking the JWT's signature against
 * Supabase's servers, rather than trusting whatever the session cookie claims.
 *
 * Use this (not the raw session object, and not `getUser()` alone) for every
 * authorization decision — "is this user allowed to see/do X" — per Supabase's current
 * guidance: `getSession()`/the cookie's embedded user is unverified data the client
 * could have tampered with; only `getClaims()` (or `getUser()`, which calls the same
 * verification under the hood) actually re-validates the token on each call.
 */
export async function getVerifiedClaims() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;
  return data.claims;
}
