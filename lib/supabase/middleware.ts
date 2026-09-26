import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase auth session on every request and keeps the refreshed cookie in
 * sync between the incoming request (so Server Components see it this render) and the
 * outgoing response (so the browser gets it too). This is the standard Supabase/Next.js
 * App Router pattern — Server Components can't write cookies themselves, so without this
 * running in middleware, sessions silently stop refreshing and users get signed out.
 *
 * Deliberately does NOT redirect or gate any route yet. Auth doesn't exist in the app
 * yet (no login UI, no sign-up flow — that's Module 4C), and there's no guest-mode
 * fallback UI yet either (Module 4D). Adding a redirect-if-unauthenticated check here
 * before either of those exists would lock every current visitor out of an app that
 * today has no login page to send them to — a severe live regression, not a security
 * improvement. Route protection is added here once 4C/4D ship; the master plan (§4C)
 * already specifies it belongs in middleware, not page components, for exactly this
 * file to be extended into.
 *
 * Bootstrap guard: this runs on every request site-wide the instant it's deployed, and
 * the Supabase project doesn't exist yet as of this commit (no env vars set in
 * Vercel/Cloudflare). Without this check, every single page load would throw and the
 * live site would go down the moment this merges — so this no-ops (passes the request
 * through untouched) until NEXT_PUBLIC_SUPABASE_URL is actually configured. Once you add
 * that env var, this activates automatically — nothing else to flip.
 */
const PROTECTED_PREFIXES = ["/profile", "/downloads"];

export async function updateSession(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // Re-validates the token's signature (rather than trusting the cookie) so a refresh
  // actually happens when needed. Deliberately not used here to gate access — see the
  // file-level comment — just to trigger the refresh side effect.
  const { data } = await supabase.auth.getClaims();

  // Module 4C/4D route protection, enforced here (server side) rather than in page code.
  // Most screens are deliberately open to guests (teaser mode, with contextual locks);
  // only pages that are meaningless without an account redirect to sign-in.
  const path = request.nextUrl.pathname;
  if (!data?.claims && PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"))) {
    const to = request.nextUrl.clone();
    to.pathname = "/login";
    to.search = `?redirect=${encodeURIComponent(path + request.nextUrl.search)}`;
    const redirect = NextResponse.redirect(to);
    for (const c of supabaseResponse.cookies.getAll()) redirect.cookies.set(c);
    return redirect;
  }

  return supabaseResponse;
}
