import "server-only";
import { getEntitlement } from "@/lib/billing/server";
import { FORGE } from "@/lib/billing/plans";
import { getUserBranch } from "@/lib/server/branch";

type Db = { from: (t: string) => any };

export const isForgeId = (id: string) => /^FORGE_/.test(id);

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
  if (!FORGE[ent.tier].questions) return { keys: [], meta: [], denied: "plan" };

  const branch = await getUserBranch(db, userId);
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
    keys: (keys ?? []).map((k: any) => ({ question_id: k.item_id, correct_option_ids: k.correct_option_ids ?? [], nat_min: k.nat_min, nat_max: k.nat_max, nat_ranges: k.nat_ranges, solution: k.solution })),
    meta: ok.map((i: any) => ({ id: i.id, question_type: i.question_type, marks: Number(i.marks) || 0 })),
    denied: null,
  };
}
