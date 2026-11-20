// Give an account every study pack (for testing, or as a gift). Owner-run: it writes to the database with the service role.
//   node --env-file=.env.local scripts/grant-study.mjs --email=<the account's email>            -> dry run: shows what would happen
//   node --env-file=.env.local scripts/grant-study.mjs --email=<the account's email> --do       -> grants all 12 packs
//   add --until=2027-03-31 to choose the end date (default: 31 March 2027, 23:59 IST)
//   add --packs=os,cn,dbms to grant only some packs
//   add --revoke --do to take the granted packs away again
// Needs NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local. Nothing is charged; the grant is recorded as a
// one-rupee "study_grant" order (the study_access table needs an order to point at), reused on every later run.
import { createClient } from "@supabase/supabase-js";

const ALL = ["os", "toc", "cn", "coa", "algo", "dm", "dbms", "dl", "pds", "cd", "maths", "apt"];
const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1];
const has = (f) => process.argv.includes(`--${f}`);
const email = arg("email")?.trim().toLowerCase();
const until = new Date(`${arg("until") ?? "2027-03-31"}T23:59:00+05:30`);
const packs = (arg("packs")?.split(",").map((p) => p.trim()).filter(Boolean)) ?? ALL;
const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: srk } = process.env;

if (!email) { console.error("Usage: node --env-file=.env.local scripts/grant-study.mjs --email=<email> [--do] [--until=YYYY-MM-DD] [--packs=os,cn] [--revoke]"); process.exit(1); }
if (!url || !srk) { console.error("Missing env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const bad = packs.filter((p) => !ALL.includes(p));
if (bad.length) { console.error(`Unknown pack id(s): ${bad.join(", ")}. Valid: ${ALL.join(", ")}`); process.exit(1); }
if (Number.isNaN(until.getTime())) { console.error("Bad --until date. Use YYYY-MM-DD."); process.exit(1); }

const db = createClient(url, srk, { auth: { persistSession: false } });

let user = null;
for (let page = 1; page <= 20 && !user; page++) {
  const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
  if (error) { console.error("Couldn't list users:", error.message); process.exit(1); }
  user = data.users.find((u) => u.email?.toLowerCase() === email) ?? null;
  if (data.users.length < 1000) break;
}
if (!user) { console.error(`No account with that email.`); process.exit(1); }
console.log(`Account ${user.id} found.`);

const { data: have } = await db.from("study_access").select("pack_id, valid_until").eq("user_id", user.id);
console.log(have?.length ? `Already has: ${have.map((r) => `${r.pack_id} (to ${r.valid_until.slice(0, 10)})`).join(", ")}` : "Has no study packs yet.");

if (has("revoke")) {
  if (!has("do")) { console.log(`\nDry run. Would remove ${packs.join(", ")}. Add --do to do it.`); process.exit(0); }
  const { error } = await db.from("study_access").delete().eq("user_id", user.id).in("pack_id", packs);
  if (error) { console.error("Failed:", error.message); process.exit(1); }
  console.log("Removed."); process.exit(0);
}

console.log(`Would grant: ${packs.join(", ")} until ${until.toISOString()}`);
if (!has("do")) { console.log("\nDry run only. Add --do to grant."); process.exit(0); }

let { data: order } = await db.from("billing_orders").select("id").eq("user_id", user.id).eq("plan_id", "study_grant").limit(1).maybeSingle();
if (!order) {
  const ins = await db.from("billing_orders").insert({ user_id: user.id, plan_id: "study_grant", amount_paise: 100, period_days: 1, status: "paid", mode: "test", paid_at: new Date().toISOString() }).select("id").single();
  if (ins.error) { console.error("Couldn't record the grant order:", ins.error.message); process.exit(1); }
  order = ins.data;
}
const rows = packs.map((pack_id) => ({ user_id: user.id, pack_id, order_id: order.id, valid_until: until.toISOString(), updated_at: new Date().toISOString() }));
const { error } = await db.from("study_access").upsert(rows, { onConflict: "user_id,pack_id" });
if (error) { console.error("Couldn't grant:", error.message); process.exit(1); }
console.log(`Granted ${packs.length} pack(s). Reload /study; the account now reads every written topic.`);
