import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** A submitted mock attempt's score/answers are released at the mock's results time. */
export async function mockResultHold(db: SupabaseClient, mockId: string | null | undefined): Promise<string | null> {
  if (!mockId) return null;
  const { data } = await db.from("mock_events").select("results_at").eq("id", mockId).maybeSingle();
  return data && Date.parse(data.results_at) > Date.now() ? (data.results_at as string) : null;
}
