import "server-only";
import { send } from "@/lib/telegram/bot";
import { accountOf, type Db } from "@/lib/telegram/server";
import { planLabel } from "@/lib/billing/receipts";
import { appLink } from "@/lib/telegram/messages";

/** Tell a linked member their payment arrived, with the date the plan runs to and a link to the receipt. Never throws. */
export async function notifyPayment(db: Db, userId: string, razorpayOrderId: string): Promise<void> {
  try {
    const acct = await accountOf(db, userId);
    if (!acct || acct.blocked || acct.prefs.billing === false) return;
    const { data: o } = await db.from("billing_orders").select("id, plan_id, amount_paise").eq("razorpay_order_id", razorpayOrderId).eq("user_id", userId).maybeSingle();
    if (!o) return;
    const { data: e } = await db.from("entitlements").select("valid_until").eq("user_id", userId).maybeSingle();
    const until = e?.valid_until ? new Date(e.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;
    await send(acct.chat_id, `✅ <b>Payment received</b>\n${planLabel(o.plan_id)} · ₹${(o.amount_paise / 100).toLocaleString("en-IN")}${until ? `\nActive until <b>${until}</b>` : ""}`, [[{ text: "View receipt", url: appLink(`/receipt?id=${o.id}`) }]]);
  } catch { /* a missed Telegram message must never affect a payment */ }
}
