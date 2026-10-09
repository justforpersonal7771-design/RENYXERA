// npx tsx scripts/billing-verify-test.ts — checks the Razorpay signature helper against Node's crypto.
import { createHmac } from "node:crypto";
import { isValidPaymentSignature, razorpaySignature } from "../lib/billing/verify";

let fails = 0;
const eq = (name: string, ok: boolean) => { if (!ok) fails++; console.log(`${ok ? "PASS" : "FAIL"} ${name}`); };
const secret = "test_secret_value";
const order = "order_Abc123XyZ789", pay = "pay_Def456UvW012";
const want = createHmac("sha256", secret).update(`${order}|${pay}`).digest("hex");

eq("matches Node's HMAC-SHA256(order|payment)", (await razorpaySignature(order, pay, secret)) === want);
eq("accepts the correct signature", await isValidPaymentSignature(order, pay, want, secret));
eq("accepts it in upper case too", await isValidPaymentSignature(order, pay, want.toUpperCase(), secret));
eq("rejects a tampered signature", !(await isValidPaymentSignature(order, pay, want.slice(0, 63) + (want.endsWith("0") ? "1" : "0"), secret)));
eq("rejects a different payment id", !(await isValidPaymentSignature(order, "pay_Other0000000", want, secret)));
eq("rejects a different order id", !(await isValidPaymentSignature("order_Other00000000", pay, want, secret)));
eq("rejects the wrong secret", !(await isValidPaymentSignature(order, pay, want, "another_secret")));
eq("rejects an empty signature", !(await isValidPaymentSignature(order, pay, "", secret)));
console.log(fails ? `${fails} FAILED` : "all passed");
process.exit(fails ? 1 : 0);
