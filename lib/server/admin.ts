import { getVerifiedClaims } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/** True only for a signed-in user listed in public.admin_users. Always decided on the server. */
export async function isAdminRequest(): Promise<{ ok: boolean; userId: string | null }> {
  const claims = await getVerifiedClaims().catch(() => null);
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  if (!userId) return { ok: false, userId: null };
  try {
    const { data } = await createServiceRoleClient().from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
    return { ok: !!data, userId };
  } catch { return { ok: false, userId }; }
}
