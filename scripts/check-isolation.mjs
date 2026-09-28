// 4F acceptance: two accounts on ONE browser. Account A's data must never be visible to
// account B — every IndexedDB store in B's namespace starts empty and A's stays intact.
//   node --env-file=.env.local scripts/check-isolation.mjs [baseUrl]
// Manual (needs the service-role key to create two throwaway accounts; they're deleted).
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const BASE = process.argv[2] ?? "http://localhost:3000";
const host = new URL(BASE).hostname;
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const admin = createClient(URL_, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
let fails = 0; const ok = (c, m) => { console.log(`${c ? "PASS" : "FAIL"}  ${m}`); if (!c) fails++; };

async function makeUser(tag) {
  const email = `zz-iso-${tag}-${Date.now()}@example.com`;
  const { data } = await admin.auth.admin.createUser({ email, email_confirm: true });
  await admin.from("profiles").update({ username: `zziso${tag}${String(Date.now()).slice(-4)}`, display_name: tag, target_year: 2027, aspirant_status: "final_year", onboarded_at: new Date().toISOString() }).eq("id", data.user.id);
  const { data: link } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const jar = [];
  const ssr = createServerClient(URL_, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, { cookies: { getAll: () => [], setAll: (l) => jar.push(...l) } });
  await ssr.auth.verifyOtp({ token_hash: link.properties.hashed_token, type: "magiclink" });
  return { id: data.user.id, cookies: jar.map(({ name, value }) => ({ name, value, domain: host, path: "/", sameSite: "Lax" })) };
}

const storeCounts = (p, uid) => p.evaluate(async (id) => {
  const db = await new Promise((res, rej) => { const r = indexedDB.open(`GatePrepOS_DB__${id}`); r.onsuccess = () => res(r.result); r.onerror = rej; });
  const out = {};
  for (const name of db.objectStoreNames) {
    out[name] = await new Promise((res) => { const r = db.transaction(name).objectStore(name).count(); r.onsuccess = () => res(r.result); r.onerror = () => res(-1); });
  }
  db.close();
  return out;
}, uid);

const A = await makeUser("a"), B = await makeUser("b");
const b = await chromium.launch();
try {
  const ctx = await b.newContext();
  await ctx.addInitScript(() => { try { sessionStorage.setItem("renyxera_intro_seen", "1"); } catch {} });
  const p = await ctx.newPage();

  // Account A: signs in, gets data in every user-data store.
  await ctx.addCookies(A.cookies);
  await p.goto(BASE + "/", { waitUntil: "load" }); await p.waitForTimeout(6000);
  await p.evaluate(async (id) => {
    const db = await new Promise((res, rej) => { const r = indexedDB.open(`GatePrepOS_DB__${id}`); r.onsuccess = () => res(r.result); r.onerror = rej; });
    const put = (store, v) => new Promise((res) => { try { const t = db.transaction(store, "readwrite"); const s = t.objectStore(store); const k = s.keyPath; const val = { ...v }; if (typeof k === "string" && !(k in val)) val[k] = `iso-${store}`; s.put(val); t.oncomplete = () => res(true); t.onerror = () => res(false); } catch { res(false); } });
    for (const store of ["Bookmarks", "Mistakes", "ExamSessions", "StudyMetrics", "CustomTemplates"]) await put(store, { questionId: "GATE_CS_2024_FN_Q1", id: `iso-${store}`, marker: "account-a" });
    db.close();
  }, A.id);
  const a1 = await storeCounts(p, A.id);
  ok(["Bookmarks", "Mistakes", "ExamSessions"].every((s) => a1[s] > 0), `account A has data (${JSON.stringify(a1)})`);

  // Switch the SAME browser to account B.
  await ctx.clearCookies();
  await ctx.addCookies(B.cookies);
  await p.goto(BASE + "/", { waitUntil: "load" }); await p.waitForTimeout(6000);
  const bCounts = await storeCounts(p, B.id);
  // B's own records may already exist (today's streak / analytics snapshot are created on
  // visit); what must never appear is anything of A's.
  const bDump = await p.evaluate(async (id) => {
    const db = await new Promise((res, rej) => { const r = indexedDB.open(`GatePrepOS_DB__${id}`); r.onsuccess = () => res(r.result); r.onerror = rej; });
    const all = {};
    for (const name of db.objectStoreNames) all[name] = await new Promise((res) => { const r = db.transaction(name).objectStore(name).getAll(); r.onsuccess = () => res(r.result); r.onerror = () => res([]); });
    db.close();
    return JSON.stringify(all);
  }, B.id);
  ok(!bDump.includes("account-a") && !bDump.includes(A.id), `account B's stores contain nothing of A's (${JSON.stringify(bCounts)})`);
  ok(["Bookmarks", "Mistakes", "ExamSessions", "CustomTemplates"].every((st) => bCounts[st] === 0), "B's bookmarks, mistakes, tests and templates are empty");
  for (const path of ["/bookmarks", "/mistakes"]) {
    await p.goto(BASE + path, { waitUntil: "load" }); await p.waitForTimeout(4000);
    ok(!(await p.evaluate(() => document.body.innerText.includes("account-a"))), `B's ${path} shows none of A's records`);
  }
  const a2 = await storeCounts(p, A.id);
  ok(a2.Bookmarks === a1.Bookmarks && a2.ExamSessions === a1.ExamSessions, "A's data is intact after B signed in");
} catch (e) {
  ok(false, `crashed: ${e.message.split("\n")[0]}`);
} finally {
  await b.close();
  await admin.auth.admin.deleteUser(A.id); await admin.auth.admin.deleteUser(B.id);
}
console.log(fails ? `\n${fails} check(s) failed` : "\nAccount isolation holds");
process.exit(fails ? 1 : 0);
