// CI security checks (Platform-wide / Module 4B):
//  1. The built client bundle (.next/static) must not contain the service-role key
//     or any JWT whose role is "service_role".
//  2. The public (anon/publishable) key must read ZERO rows from question_answers.
// Run after `next build`. Check 2 is skipped (with a notice) when Supabase env vars
// aren't available, e.g. on forks.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

let failed = 0;
const fail = (m) => { console.error("FAIL  " + m); failed++; };
const pass = (m) => console.log("PASS  " + m);

function* files(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (/\.(js|mjs|json|html|css|map)$/.test(p)) yield p;
  }
}

const svc = process.env.SUPABASE_SERVICE_ROLE_KEY;
let leaked = [];
for (const f of files(".next/static")) {
  const text = readFileSync(f, "utf8");
  if (svc && svc.length > 20 && text.includes(svc)) leaked.push(f);
  for (const jwt of text.match(/eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g) || []) {
    try {
      const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64url").toString());
      if (payload.role === "service_role") leaked.push(f);
    } catch { /* not a JWT */ }
  }
}
leaked.length ? fail(`service-role key found in client bundle: ${[...new Set(leaked)].join(", ")}`) : pass("no service-role key in the client bundle");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (url && anon) {
  const res = await fetch(`${url}/rest/v1/question_answers?select=*&limit=1`, { headers: { apikey: anon, Authorization: `Bearer ${anon}` } });
  const body = await res.json().catch(() => null);
  Array.isArray(body) && body.length === 0
    ? pass("public key reads 0 rows from question_answers")
    : fail(`public key could read question_answers (status ${res.status})`);
} else {
  console.log("SKIP  answer-key read test (Supabase env vars not set)");
}

process.exit(failed ? 1 : 0);
