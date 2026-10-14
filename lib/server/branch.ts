import "server-only";
import { branchOfQuestionId, DEFAULT_BRANCH, isBranchCode, type BranchCode } from "@/lib/branches";
import sharedIds from "@/data/shared-question-ids.json";

/** General Aptitude and overlapping maths questions every branch may practise (built by scripts/copy-static-data.mjs). */
const SHARED = new Set<string>(sharedIds as string[]);

/**
 * Server-side branch rules (docs/MULTI_BRANCH_DESIGN.md §6). A request's branch is ALWAYS
 * the account's profiles.target_branch, never anything the client sends.
 */

type Db = { from: (t: string) => any };

export async function getUserBranch(db: Db, userId: string): Promise<BranchCode> {
  const { data } = await db.from("profiles").select("target_branch").eq("id", userId).maybeSingle();
  const code = data?.target_branch;
  return isBranchCode(code) ? code : DEFAULT_BRANCH;
}

/** Official question ids (GATE_<PAPER>_…) must belong to `branch`. Ids that are not official
 *  (AI-generated practice questions) carry no paper and are allowed. Returns the offending ids. */
export function questionsOutsideBranch(ids: string[], branch: BranchCode): string[] {
  return ids.filter((id) => /^GATE_/.test(id) && !SHARED.has(id) && branchOfQuestionId(id) !== branch);
}

export const branchMismatch = () =>
  Response.json({ error: "These questions belong to a different GATE branch.", code: "branch_mismatch" }, { status: 403 });
