# Payments (decision: Razorpay only, Cashfree ignored): Cashfree vs Razorpay, and the complete payments checklist (10 Oct 2026)

Researched on 10 Oct 2026 from Cashfree's own pricing pages and FAQ, Razorpay's blog and terms, and news coverage.
Anything I could not confirm on an official page is marked **(unverified)**. Rates and offers change — re-check before acting.

## 1. Is Cashfree's "0% fee up to ₹20 lakh" really free?

Mostly, but with conditions that matter for us (source: Cashfree pricing FAQ, https://www.cashfree.com/docs/help/account/pricing):

| Condition | What it means for RENYXERA |
|---|---|
| **New merchants only**, signed up on/after **21 Jul 2026**, never transacted on Cashfree before | We qualify only with a *new* Cashfree account |
| **₹20,00,000 cumulative domestic GMV, one-time** (not monthly) | Far above what we will sell before March 2027 |
| **Ends at the earliest of**: cap used, **31 Mar 2027**, or fair-usage disqualification | The free window is ~5 months, not permanent. After that **1.95% + GST** |
| **GST still applies** on the waived fee, "calculated on the standard 1.95%" | Not truly zero: ≈ **0.35%** of each payment |
| Fair usage: after ₹5 lakh and 5+ transactions, if **credit cards are ≥ 60%** of volume the offer can be withdrawn | Unlikely for us (mostly UPI) |
| **Excluded** from the offer: Amex/Diners, corporate cards, EMI, prepaid, Pay Later, **subscriptions (e-mandate)**, international cards | Subscriptions would be charged normally |
| Default settlement **T+1 by 8 pm** "for GST-registered businesses" | If we are not GST-registered, settlement may not be T+1 **(unverified — ask Cashfree)** |
| One offer per PAN / bank account | Fine |

Standard Cashfree rates after the offer: UPI, domestic cards, net banking, wallets **1.95%** + 18% GST; UPI on RuPay credit card 2.15%; international cards 2.99%; no setup fee, no annual fee; instant settlement 0.30%; **subscriptions / UPI Autopay ₹7.5 + ₹7.5 platform fee and ₹7.5 + ₹5 (under ₹1,000) per debit** (https://www.cashfree.com/payment-gateway-charges/).

## 2. Razorpay, for comparison

- Standard domestic: **2% + 18% GST ≈ 2.36%**; settlement **T+2** by default; the fee is **not refunded** when you refund a customer (Razorpay blog on refunds and MDR).
- Razorpay's own new-merchant promotion: **0% platform fee for the first 90 days, up to ₹5 lakh**, for merchants activated on/after 1 Jun 2026; GST and a ₹199 + tax KYC fee are not waived (Razorpay blog and terms; the cut-off date differs between sources). **We were activated recently, so this may already be covering us.**
- Razorpay's dashboard offers Subscriptions, Payment Links, Pages, Invoices, QR codes, Smart Collect (your screenshot).

## 3. Side by side

| | Razorpay | Cashfree |
|---|---|---|
| Fee now (our case) | Possibly 0% platform fee (90 days / ₹5 L) — check your dashboard | 0% platform fee (to 31 Mar 2027 / ₹20 L) |
| Fee after promo | ~2.36% all-in | ~2.30% all-in (1.95% + GST) |
| GST on waived fee | Not waived | Not waived (≈ 0.35%) |
| Settlement | T+2 | T+1 if GST-registered (otherwise ask) |
| Subscriptions / autopay | Available (Subscriptions product) | Available, **not covered by the offer**, per-debit fees |
| Payment links, QR, invoices | Yes | Payment links/forms free with PG; invoices not stated |
| Onboarding | **Done, live, tested end to end** | New KYC (Aadhaar OTP, PAN, bank), live site with policies, 24–48 h |
| Integration work for us | None | **Rewrite**: order creation, checkout SDK, signature and webhook verification, reconcile, receipts, test |
| UPI charge from 15 Oct 2026 | 0.4% on UPI payments above ₹2,000 (NPCI, capped ₹300) — **not** a gateway fee, applies to both | Same |

Our prices are ₹29–₹799, so the 0.4% UPI charge applies only to long season passes above ₹2,000.

## 4. What it is worth

Fee on ₹1,00,000 of sales: Razorpay standard ≈ ₹2,360; Cashfree (offer) ≈ ₹350 (GST on the waived fee); Cashfree after the offer ≈ ₹2,300. So the saving is at most about **₹2,000 per ₹1 lakh sold**, only until March 2027, and Razorpay's own 90-day promotion may already cover the same early revenue. Against that: a new KYC, a full payments rewrite on a live product in exam season, and a second set of QR/webhook/settlement behaviours to learn.

## 5. Recommendation

**Do not replace Razorpay now.** The free window is real but short, GST still applies, the saving on our likely volume is a few thousand rupees at most, and the migration risk is on the money path. Instead:

1. Keep Razorpay as the live gateway; finish the real ₹29 settlement test (due 13 Oct).
2. If you want Cashfree, **open an account in parallel** (free) and ask support in writing: (a) is GST registration required for us, (b) settlement cycle without GST, (c) how the 15 Oct UPI charge is passed on, (d) refund fee treatment.
3. Only then build a small **provider abstraction** (`createOrder`, `verify`, `webhook`, `reconcile`, `paymentMethod`) so either gateway can run behind a feature flag, and trial Cashfree with a ₹29 payment the same way we did Razorpay.
4. Revisit on **1 Jan 2027**, when we know our real volume and Razorpay's promotion has ended.

## 6. Complete payments checklist (what a payments system for this app should include)

### Built
- [x] Server-created orders; amount fixed on the server; never trusted from the browser
- [x] Razorpay Standard Checkout, live mode, branch lock confirmation, Turnstile, velocity limits, disposable-email block
- [x] Signature verification endpoint (instant plan activation) + signed webhook (backup), both idempotent
- [x] Season pass with exam-year picker, priced from the server clock (`lib/billing/plans.ts`)
- [x] Plus → Pro prorated upgrade credit; referral and sponsor credits
- [x] Server time everywhere that matters (entitlements, exam timing, embargo, leaderboards)
- [x] **Billing history + receipts in Profile → Plan & payments** (this change): every attempt, paid ones with plan, dates, validity, method, payment/order IDs, receipt number, printable receipt page
- [x] **"I paid — check" button** and an **hourly reconcile job** that asks Razorpay about unconfirmed orders and applies paid ones (this change)

### Next (recommended order)
- [x] Run migration `0034_payment_receipts.sql` (stores the payment method on the order)
- [ ] Set `NEXT_PUBLIC_SELLER_NAME` / `NEXT_PUBLIC_SELLER_ADDRESS` so receipts show the legal seller; confirm with an accountant whether GST registration or tax invoices are required before sales grow
- [ ] Email receipt after payment (Resend or Brevo free tier; needs a verified sender)
- [x] Admin report from the database: `node --env-file=.env.local scripts/billing-report.mjs` (by month, plan and coupon; compare with Razorpay Settlements)
- [x] Refund tooling: `scripts/refund.mjs pay_XXXX --do --revoke` refunds in Razorpay and ends the plan in one step (dry run by default)
- [ ] Failed-payment follow-up: nudge when an order stays "created" for 24 h
- [x] Coupon / promo codes: server-validated, once per member, optional use limit, expiry and plan list; "Coupon code" box in the confirm window; shown on the receipt (migration 0036). Create codes in the SQL editor, see the comment in `0036_coupons_and_goals.sql`
- [ ] Gift passes (pay for someone else's season pass)
- [ ] Chargeback / dispute runbook (who responds, what evidence: receipt, entitlement log, device log)
- [ ] Keep financial records for the period an accountant advises (receipts and orders are already immutable in `billing_orders`)

### Later
- [ ] **Subscriptions / fixed plans** (auto-renew with UPI Autopay or cards) via Razorpay Subscriptions: create Plans in the dashboard, create a Subscription server-side, handle `subscription.authenticated/activated/charged/halted/cancelled`. Needs: renewal reminders (RBI e-mandate rules require pre-debit notification and extra authentication above the per-debit limit), a visible "cancel auto-renew" button, and changing the checkout copy that today says "does not renew automatically". Recommended only after one-time passes show demand; exam prep is seasonal, so a season pass fits better than monthly auto-renew
- [ ] Second gateway (Cashfree) behind the provider abstraction, if the support answers in section 5 are favourable
- [ ] International cards / non-INR (Razorpay International or Stripe) only if we get paying learners abroad
- [ ] Revenue dashboard in the admin console (Release 10)

## 7. Issues you reported on 10 Oct (Razorpay side)
- QR shows your personal name instead of RENYXERA: the UPI QR / VPA name comes from the account's registered name, not our checkout (`name: "RENYXERA"` is already sent). In Razorpay Dashboard → Account & Settings → Business Details, set the **Business display name / brand name**; if it still shows your name, ask Razorpay support — it is controlled by their merchant record.
- Paying with your own credit card fails: needs the exact error. Check (a) Dashboard → Payment Methods shows Cards enabled, (b) your card's online/domestic transactions are enabled in the bank app, (c) Razorpay can block a card matching the account holder as a risk rule; support can whitelist it.

## Sources
- Cashfree pricing FAQ: https://www.cashfree.com/docs/help/account/pricing
- Cashfree charges: https://www.cashfree.com/payment-gateway-charges/
- Cashfree onboarding FAQs: https://www.cashfree.com/docs/help/onboarding-related/onboarding-faqs
- Razorpay refunds and MDR: https://razorpay.com/blog/refunds-and-mdr-in-payment-gateways/
- Razorpay 90-day 0% offer: https://razorpay.com/blog/razorpay-0-percent-platform-fee-offer-90-days-new-merchants-2026/ and https://razorpay.com/terms/90-day-free-pg-offer/
- Razorpay on UPI MDR: https://razorpay.com/blog/upi-mdr-for-merchants-in-payment-gateway-explained/
- Inc42 on the 15 Oct UPI MDR: https://inc42.com/?p=572596
