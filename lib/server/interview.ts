import "server-only";
import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/** True only for a signed-in user whose confirmed email is listed in public.interview_access. Decided on the server every call. */
export async function interviewAccess(): Promise<{ ok: boolean; userId: string | null }> {
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const email = typeof claims?.email === "string" ? claims.email.toLowerCase() : null;
  if (!userId || !email) return { ok: false, userId: null };
  try {
    const db = createServiceRoleClient();
    const { data } = await db.from("interview_access").select("email").eq("email", email).maybeSingle();
    if (!data) return { ok: false, userId };
    const u = await db.auth.admin.getUserById(userId);
    return { ok: !!u.data.user?.email_confirmed_at, userId };
  } catch { return { ok: false, userId }; }
}
