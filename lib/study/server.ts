import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { seasonEndMs, upcomingSeasonYear } from "@/lib/billing/plans";

/** Packs this account may read now (unexpired study_access rows). */
export async function ownedPacks(db: SupabaseClient, userId: string): Promise<string[]> {
  const { data } = await db.from("study_access").select("pack_id").eq("user_id", userId).gt("valid_until", new Date().toISOString());
  return (data ?? []).map((r: { pack_id: string }) => r.pack_id);
}

/** Study access lasts to the end of the buyer's GATE season (31 March IST of their target year, or the upcoming one). */
export async function studyValidUntil(db: SupabaseClient, userId: string, nowMs = Date.now()): Promise<string> {
  const { data } = await db.from("profiles").select("target_year").eq("id", userId).maybeSingle();
  const target = typeof data?.target_year === "number" ? data.target_year : 0;
  const year = Math.max(upcomingSeasonYear(nowMs), target);
  return new Date(seasonEndMs(year)).toISOString();
}

/**
 * Step-up credit (doc 13 §3): what the buyer paid in the last 30 days for single packs that a bundle contains counts toward the bundle.
 * Only paid single-pack orders count, each once.
 */
export async function stepUpCredit(db: SupabaseClient, userId: string, bundlePacks: string[]): Promise<number> {
  const since = new Date(Date.now() - 30 * 86400_000).toISOString();
  const { data } = await db.from("billing_orders").select("plan_id, amount_paise").eq("user_id", userId).eq("status", "paid").like("plan_id", "study\\_pack\\_%").gte("paid_at", since);
  return (data ?? []).reduce((s: number, o: { plan_id: string; amount_paise: number }) => (bundlePacks.includes(o.plan_id.slice("study_pack_".length)) ? s + o.amount_paise : s), 0);
}
