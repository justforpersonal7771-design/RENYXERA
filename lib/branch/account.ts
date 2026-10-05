import type { BranchCode } from "@/lib/branches";

/**
 * The only two ways a signed-in account's branch changes (migration 0026):
 *   "initial": set_initial_branch — the onboarding pick (once).
 *   "final":   change_my_branch   — the one later change; after it the branch is locked.
 * target_branch is not client-writable, so there is no other path.
 */
type Rpc = { rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: { code?: string; message: string } | null }>; from: (t: string) => any };

const MESSAGES: Record<string, string> = {
  locked: "Your branch is already final — the one change has been used.",
  same_branch: "That is already your branch.",
  branch_not_open: "That branch isn't open yet.",
  mock_in_progress: "Finish your live All-India mock first, then change branch.",
  already_confirmed: "Your branch is already set. You can change it once from Profile → Exam branch.",
};

const missingFunction = (e: { code?: string; message: string }) =>
  e.code === "PGRST202" || e.code === "42883" || /could not find the function/i.test(e.message);

export async function setAccountBranch(
  supabase: Rpc, kind: "initial" | "final", code: BranchCode, userId?: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const fn = kind === "initial" ? "set_initial_branch" : "change_my_branch";
  const args = kind === "initial" ? { p_code: code } : { p_to: code };
  const { data, error } = await supabase.rpc(fn, args);
  if (error) {
    // Before migration 0026 is applied: the onboarding pick still works the old way.
    if (missingFunction(error) && kind === "initial") {
      if (code === "CSE") return { ok: true };
      if (userId) {
        const { error: e2 } = await supabase.from("profiles").update({ target_branch: code }).eq("id", userId);
        if (!e2) return { ok: true };
      }
      return { ok: false, message: "Couldn't set your branch. Please try again." };
    }
    if (missingFunction(error)) return { ok: false, message: "Changing branch isn't available yet. Please try again later." };
    return { ok: false, message: "Couldn't change your branch. Please try again." };
  }
  if (data === "ok" || (kind === "initial" && data === "already_confirmed")) return { ok: true };
  return { ok: false, message: MESSAGES[String(data)] ?? "Couldn't change your branch. Please try again." };
}
