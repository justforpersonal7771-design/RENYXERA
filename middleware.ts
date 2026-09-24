import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets, Next's own internals, and the OAuth
     * callback route — no point refreshing an auth cookie for a request that's just
     * fetching a JS chunk or an image. This is the standard Supabase-recommended
     * matcher for Next.js App Router, with one addition: /auth/callback is the route
     * that ESTABLISHES the very first session (exchanging a one-time code for one via
     * exchangeCodeForSession), so there is no existing session for this middleware to
     * refresh there — its getClaims() call was pure wasted CPU on exactly the request
     * least able to afford it (Cloudflare's free-tier Workers get a strict 10ms CPU
     * budget per request; a cold isolate doing that redundant JWT verification on top
     * of the route handler's own real work was enough to occasionally blow the budget
     * and throw Error 1102, "Worker exceeded resource limits" — confirmed via live
     * wrangler tail logs, where a subsequent, already-warm retry of the same exchange
     * completed fine).
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|manifest.json|sw.js|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
