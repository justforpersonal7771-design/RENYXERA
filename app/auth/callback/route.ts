import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Standard Supabase OAuth/email-link callback: exchanges the one-time `code` param for
 * a real session (writing the session cookie via the server client), then redirects on.
 *
 * ⚠️ Not yet live-tested — needs a real Supabase project (with Google OAuth configured
 * in Supabase Dashboard → Authentication → Providers, plus a Google Cloud OAuth client
 * whose authorized redirect URI is this route's full URL) to exercise end-to-end.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/login?error=Missing+auth+code`);
}
