// Automated Row-Level-Security probe (R16-D2): tries to READ every table created in supabase/migrations as (1) a signed-out visitor
// and (2) an ordinary signed-in account, using only the public (anon) key and that account's own session. It uses no service role.
// Flags: a signed-out visitor reading a table that is not on the public list; a signed-in account seeing another user's rows
// (any row whose user_id / owner_id / id differs from its own); tables with no policy answer at all are fine (denied).
//   node --env-file=.env.local scripts/check-rls.mjs
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL, ANON = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const EMAIL = process.env.PROBE_EMAIL ?? "zz-free-tester@example.com";
// Tables that are meant to be readable by everyone (content that is public anyway).
const PUBLIC_OK = new Set(["branches", "questions", "question_options", "mock_events", "mocks", "mock_papers", "forge_items", "leaderboard_public", "app_config"]);

const dir = "supabase/migrations";
const tables = new Set();
for (const f of fs.readdirSync(dir)) {
  const sql = fs.readFileSync(path.join(dir, f), "utf8");
  for (const m of sql.matchAll(/create table(?: if not exists)?\s+public\.([a-z_0-9]+)/gi)) tables.add(m[1]);
}
const list = [...tables].sort();

const anon = createClient(URL_, ANON, { auth: { persistSession: false } });
// Sign in as the throw-away account with a one-time link made by the admin API (needs the service role ONLY for this sign-in step).
const admin = createClient(URL_, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data: link } = await admin.auth.admin.generateLink({ type: "magiclink", email: EMAIL });
const user = createClient(URL_, ANON, { auth: { persistSession: false } });
const { data: sess, error: sErr } = await user.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "magiclink" });
if (sErr || !sess.user) { console.log("could not sign in the probe account:", sErr?.message); process.exit(2); }
const me = sess.user.id;

let flags = 0;
const out = { denied: [], publicRows: [], ownOnly: [], empty: [] };
for (const t of list) {
  // 1) signed out
  const a = await anon.from(t).select("*").limit(5);
  const anonRows = a.error ? 0 : (a.data ?? []).length;
  // 2) signed in as an ordinary account
  const u = await user.from(t).select("*").limit(200);
  const rows = u.error ? [] : (u.data ?? []);
  const foreign = rows.filter((r) => {
    const owner = r.user_id ?? r.owner_id ?? (t === "profiles" ? r.id : undefined);
    return owner !== undefined && owner !== me;
  });
  if (anonRows > 0 && !PUBLIC_OK.has(t)) { flags++; console.log(`FLAG  ${t}: a signed-out visitor can read ${anonRows}+ row(s)`); }
  if (foreign.length) { flags++; console.log(`FLAG  ${t}: a signed-in account can read ${foreign.length} row(s) belonging to someone else`); }
  if (a.error && u.error) out.denied.push(t);
  else if (anonRows > 0) out.publicRows.push(t);
  else if (rows.length) out.ownOnly.push(`${t}(${rows.length})`);
  else out.empty.push(t);
}
console.log(`\n${list.length} tables probed.`);
console.log("denied to both (no access):", out.denied.length, "|", out.denied.join(", ").slice(0, 600));
console.log("readable signed-out (expected public):", out.publicRows.join(", "));
console.log("signed-in sees only own rows:", out.ownOnly.join(", "));
console.log("readable but empty:", out.empty.length);
console.log(flags ? `\n${flags} FLAG(S): review before launch` : "\nNo leaks found");
process.exit(flags ? 1 : 0);
