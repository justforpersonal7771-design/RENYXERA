// Money report from the database: what was sold, by month and by plan, and how coupons were used.
//   node --env-file=.env.local scripts/billing-report.mjs            (live orders only)
//   node --env-file=.env.local scripts/billing-report.mjs --all      (include test-mode orders)
// To match it against the bank, compare the "paid" totals with Razorpay Dashboard → Settlements; Razorpay's fee
// (about 2% plus GST after any free-fee period) and any refunds explain the difference.
import { createClient } from "@supabase/supabase-js";

const { NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: key } = process.env;
if (!url || !key) { console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }
const db = createClient(url, key);
const all = process.argv.includes("--all");

const { data, error } = await db.from("billing_orders").select("*").order("created_at");
if (error) { console.error(error.message); process.exit(1); }
const rows = (data ?? []).filter((o) => all || o.mode === "live");
const paid = rows.filter((o) => o.status === "paid");
const inr = (p) => `₹${(p / 100).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

console.log(`Orders: ${rows.length} started, ${paid.length} paid, ${rows.filter((o) => o.status === "failed").length} failed, ${rows.filter((o) => o.status === "created").length} not completed${all ? " (test orders included)" : " (live only)"}`);
console.log(`Total paid: ${inr(paid.reduce((n, o) => n + o.amount_paise, 0))}`);
console.log(`Discounts given: ${inr(paid.reduce((n, o) => n + (o.discount_paise ?? 0), 0))}   Upgrade credits: ${inr(paid.reduce((n, o) => n + (o.upgrade_credit_paise ?? 0), 0))}`);

const group = (keyFn) => { const m = new Map(); for (const o of paid) { const k = keyFn(o); const g = m.get(k) ?? { n: 0, paise: 0 }; g.n++; g.paise += o.amount_paise; m.set(k, g); } return [...m.entries()].sort(); };
console.log("\nBy month (paid date):");
for (const [k, g] of group((o) => (o.paid_at ?? o.created_at).slice(0, 7))) console.log(`  ${k}  ${String(g.n).padStart(3)} orders  ${inr(g.paise)}`);
console.log("\nBy plan:");
for (const [k, g] of group((o) => o.plan_id)) console.log(`  ${k.padEnd(20)} ${String(g.n).padStart(3)} orders  ${inr(g.paise)}`);
const coupons = group((o) => o.coupon_code).filter(([k]) => k);
if (coupons.length) { console.log("\nBy coupon:"); for (const [k, g] of coupons) console.log(`  ${k.padEnd(20)} ${String(g.n).padStart(3)} orders  ${inr(g.paise)}`); }
const stuck = rows.filter((o) => o.status === "created" && Date.now() - Date.parse(o.created_at) > 3600_000 && Date.now() - Date.parse(o.created_at) < 3 * 86400_000);
if (stuck.length) console.log(`\n${stuck.length} order(s) started over an hour ago and not confirmed (the hourly job will settle any that were actually paid).`);
