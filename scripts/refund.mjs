// Refund a Razorpay payment and (optionally) take the plan away in one step.
//   node --env-file=.env.local scripts/refund.mjs pay_XXXXXXXX            -> shows the payment and what would happen (dry run)
//   node --env-file=.env.local scripts/refund.mjs pay_XXXXXXXX --do       -> refunds the full amount
//   node --env-file=.env.local scripts/refund.mjs pay_XXXXXXXX --do --revoke   -> also ends the plan right now
//   add --amount=2900 (paise) for a partial refund
// Needs RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
// Razorpay keeps its own fee on a refunded payment; the refund itself is free.
import { createClient } from "@supabase/supabase-js";

const [paymentId, ...flags] = process.argv.slice(2);
const has = (f) => flags.includes(f);
const amountArg = flags.find((f) => f.startsWith("--amount="))?.split("=")[1];
if (!paymentId?.startsWith("pay_")) { console.error("Usage: node --env-file=.env.local scripts/refund.mjs pay_XXXX [--do] [--revoke] [--amount=paise]"); process.exit(1); }
const { RAZORPAY_KEY_ID: id, RAZORPAY_KEY_SECRET: secret, NEXT_PUBLIC_SUPABASE_URL: url, SUPABASE_SERVICE_ROLE_KEY: srk } = process.env;
if (!id || !secret || !url || !srk) { console.error("Missing env: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"); process.exit(1); }

const auth = { Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`, "Content-Type": "application/json" };
const db = createClient(url, srk);

const pr = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, { headers: auth });
const pay = await pr.json();
if (!pr.ok) { console.error("Razorpay says:", pay.error?.description ?? pr.status); process.exit(1); }
console.log(`Payment ${pay.id}: ${pay.status}, ₹${pay.amount / 100} via ${pay.method}, refunded so far ₹${(pay.amount_refunded ?? 0) / 100}`);

const { data: order } = await db.from("billing_orders").select("id, user_id, plan_id, status").eq("razorpay_payment_id", paymentId).maybeSingle();
console.log(order ? `Order #${order.id}: plan ${order.plan_id}, user ${order.user_id}` : "No matching order in the database (a payment made outside the app?).");
if (!has("--do")) { console.log("\nDry run only. Add --do to refund" + (order ? ", and --revoke to end the plan as well." : ".")); process.exit(0); }

const body = amountArg ? { amount: Number(amountArg) } : {};
const rr = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, { method: "POST", headers: auth, body: JSON.stringify(body) });
const refund = await rr.json();
if (!rr.ok) { console.error("Refund failed:", refund.error?.description ?? rr.status); process.exit(1); }
console.log(`Refund ${refund.id} created: ₹${refund.amount / 100} (${refund.status}). It reaches the customer in about 5 to 7 working days.`);

if (has("--revoke") && order) {
  const { error } = await db.from("entitlements").update({ valid_until: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("user_id", order.user_id).eq("source", "razorpay");
  console.log(error ? `Couldn't end the plan: ${error.message}` : "The plan was ended now.");
}
