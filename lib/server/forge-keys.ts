import "server-only";
import { getEntitlement } from "@/lib/billing/server";
import { FORGE } from "@/lib/billing/plans";
import { getUserBranch } from "@/lib/server/branch";

type Db = { from: (t: string) => any };

export const isForgeId = (id: string) => /^FORGE_/.test(id);

/** The Free taster: the first `count` released, non-X items of the account's branch, in id order. A fixed set, so the free sample never grows with the bank. */
export async function teaserIds(db: Db, branch: string, count: number): Promise<string[]> {
  if (count <= 0) return [];
  const { data } = await db.from("forge_items").select("id")
    .eq("branch", branch).eq("status", "approved").eq("mock_only", false).neq("difficulty", "X").lte("release_at", new Date().toISOString()).order("id").limit(500);
  const ids: string[] = (data ?? []).map((r: { id: string }) => r.id);
  if (!ids.length) return [];
  return ids.slice(0, count);
}

export type ForgeKey = { question_id: string; correct_option_ids: string[]; nat_min: number | null; nat_max: number | null; nat_ranges: unknown; solution?: unknown };
export type ForgeMeta = { id: string; question_type: "MCQ" | "MSQ" | "NAT"; marks: number };

/**
 * Keys for Forge items (R11-A3). Same trust rules as the PYQ keys, plus: the account's plan must include Forge
 * questions, the item must belong to the account's branch, and it must be released and approved (a key is never
 * served before its question can be seen). Anything that fails a rule is simply absent, so the caller treats it as unknown.
 */
export async function loadForgeKeys(db: Db, userId: string | null, ids: string[]): Promise<{ keys: ForgeKey[]; meta: ForgeMeta[]; denied: "plan" | "auth" | null }> {
  const forgeIds = ids.filter(isForgeId);
  if (!forgeIds.length) return { keys: [], meta: [], denied: null };
  if (!userId) return { keys: [], meta: [], denied: "auth" };
  const ent = await getEntitlement(userId);
  const branch = await getUserBranch(db, userId);
  const free = !FORGE[ent.tier].questions;
  // Free: only the taster questions can be graded or unlocked, and its worked solution stays with Plus and Pro.
  const allowed = free ? new Set(await teaserIds(db, branch, FORGE[ent.tier].teaser)) : null;
  if (allowed) forgeIds.splice(0, forgeIds.length, ...forgeIds.filter((id) => allowed.has(id)));
  if (!forgeIds.length) return { keys: [], meta: [], denied: free ? "plan" : null };
  const { data: items, error } = await db.from("forge_items")
    .select("id, question_type, marks, difficulty")
    .in("id", forgeIds).eq("branch", branch).eq("status", "approved").eq("mock_only", false).lte("release_at", new Date().toISOString());
  if (error) throw error;
  const ok = (items ?? []).filter((i: { difficulty: string }) => FORGE[ent.tier].hardX || i.difficulty !== "X");
  if (!ok.length) return { keys: [], meta: [], denied: null };

  const { data: keys, error: kErr } = await db.from("forge_answers")
    .select("item_id, correct_option_ids, nat_min, nat_max, nat_ranges, solution").in("item_id", ok.map((i: { id: string }) => i.id));
  if (kErr) throw kErr;
  return {
    keys: (keys ?? []).map((k: any) => ({ question_id: k.item_id, correct_option_ids: k.correct_option_ids ?? [], nat_min: k.nat_min, nat_max: k.nat_max, nat_ranges: k.nat_ranges, solution: free ? undefined : k.solution })),
    meta: ok.map((i: any) => ({ id: i.id, question_type: i.question_type, marks: Number(i.marks) || 0 })),
    denied: null,
  };
}
