// Weekly learner metrics (docs/GROWTH_TASKS.md G-4). Needs migration 0032 and SUPABASE_SERVICE_ROLE_KEY.
//   node scripts/growth-metrics.mjs [weeks=6]
import { createClient } from "@supabase/supabase-js";
import fs from "fs";

if (fs.existsSync(".env.local")) for (const l of fs.readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
}
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const weeks = Number(process.argv[2] ?? 6);

const { data, error } = await sb.rpc("learner_metrics", { p_weeks: weeks });
if (error) { console.error("learner_metrics failed (has migration 0032 run?):", error.message); process.exit(1); }
console.table(data.map((r) => ({ week: r.week, visitors: r.visitors, WAL: r.wal, tests: r.tests, "D1 %": r.d1_return_pct ?? "-", "D7 %": r.d7_return_pct ?? "-" })));

const since = new Date(Date.now() - 7 * 864e5).toISOString();
const { data: ev } = await sb.from("events").select("event, source, branch").gte("created_at", since).limit(50000);
const by = (k) => Object.entries((ev ?? []).reduce((a, e) => ((a[e[k] ?? "—"] = (a[e[k] ?? "—"] || 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
console.log("\nLast 7 days — events:", Object.fromEntries(by("event")));
console.log("Last 7 days — by first-touch source:", Object.fromEntries(by("source")));
console.log("Last 7 days — by branch:", Object.fromEntries(by("branch")));
