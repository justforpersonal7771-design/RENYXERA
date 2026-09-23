import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on everything except static assets and Next's own internals — no point
     * refreshing an auth cookie for a request that's just fetching a JS chunk or an
     * image. This is the standard Supabase-recommended matcher for Next.js App Router.
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
