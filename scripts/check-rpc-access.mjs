// Who can call which database function through the public API? (R16-D1, migration 0044)
// Calls each SECURITY DEFINER function as (1) a signed-out visitor and (2) an ordinary signed-in account, using only the public key
// and that account's own session, with harmless arguments. "Denied" = Postgres answers permission denied (42501) or the function is
// not exposed (PGRST202); anything else means the role was allowed to run it.
//   npm run check:rpc
import { createClient } from "@supabase/supabase-js";
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL, ANON = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const Z = "00000000-0000-0000-0000-000000000000";
// name, harmless args, anonShouldRun, authedShouldRun
const FUNCS = [
  ["board", { p_scope: "all", p_key: null, p_days: 7, p_limit: 1, p_branch: "CSE" }, true, true],
  ["board_branch", { p_branch: "CSE" }, true, true],
  ["practice_leaderboard", { p_days: 7, p_limit: 1, p_branch: "CSE" }, true, true],
  ["mock_leaderboard", { p_mock: Z, p_limit: 1 }, true, true],
  ["mock_leaderboard_moves", { p_mock: Z, p_limit: 1 }, true, true],
  ["tiers_for_labels", { p_labels: [] }, true, true],
  ["mock_paper", { p_mock: Z }, false, true],
  ["mock_my_result", { p_mock: Z }, false, true],
  ["my_referral_code", {}, false, true],
  ["my_referrals", {}, false, true],
  ["my_sponsor_breaks_today", {}, false, true],
  ["my_ai_bonus", {}, false, true],
  ["set_acquisition", { p: {} }, false, true],
  ["claim_referral", { p_code: "zz-probe-none" }, false, true],
  ["account_tier", { p_user: Z }, false, false],
  ["handle_new_user", {}, false, false],
  ["profiles_premium_avatar", {}, false, false],
  ["referral_on_submit", {}, false, false],
];
const denied = (e) => !!e && (e.code === "42501" || e.code === "PGRST202" || /permission denied/i.test(e.message ?? ""));
const anon = createClient(URL_, ANON, { auth: { persistSession: false } });
const admin = createClient(URL_, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data: link } = await admin.auth.admin.generateLink({ type: "magiclink", email: process.env.PROBE_EMAIL ?? "zz-free-tester@example.com" });
const user = createClient(URL_, ANON, { auth: { persistSession: false } });
await user.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "magiclink" });

let bad = 0;
console.log("function".padEnd(26), "signed-out".padEnd(22), "signed-in");
for (const [name, args, anonOk, authOk] of FUNCS) {
  const a = await anon.rpc(name, args);
  const u = await user.rpc(name, args);
  const aRun = !denied(a.error), uRun = !denied(u.error);
  const aBad = aRun !== anonOk, uBad = uRun !== authOk;
  if (aBad || uBad) bad++;
  const cell = (run, want, isBad) => `${run ? "can run" : "denied"}${isBad ? " ✗ (want " + (want ? "run" : "denied") + ")" : " ✓"}`;
  console.log(name.padEnd(26), cell(aRun, anonOk, aBad).padEnd(22), cell(uRun, authOk, uBad));
}
console.log(bad ? `\n${bad} function(s) differ from the intended access` : "\nAll functions match the intended access");
process.exit(bad ? 1 : 0);
