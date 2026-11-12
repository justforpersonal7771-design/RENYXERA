# Payment providers for RENYXERA: comparison and recommendation

Written 12 Nov 2026 after the Razorpay account was disabled. Every figure below was checked against the provider's own pricing page on 12 Nov 2026 where that page showed it; where it did not, the source is named and marked **unconfirmed**. Offers change often: re-check the page the day you sign up.

## 1. Short answer

| Rank | Provider | Why |
|---|---|---|
| **1** | **Cashfree** | Only provider with a published, current offer that covers **credit cards too**: **zero platform fee on the first ₹20 lakh of sales** for merchants who sign up between 21 Jul 2026 and 31 Mar 2027. Already built into RENYXERA (switchable provider). |
| 2 | Zaakpay (MobiKwik) | Its page mentions **free up to ₹5 lakh GMV or 3 months, whichever comes first**, but the page looks old and the footnote suggests the benefit may apply only to UPI and MobiKwik wallet. **Ask sales to confirm in writing** before choosing it. |
| 3 | Paytm Payments | **No 0% credit-card offer.** Flat **1.99% + GST on all transactions** (credit cards included). Zero setup and AMC, T+1 settlement. Good fallback, not first. |
| 4 | PhonePe PG | Standard **1.99%**, "Free*" and "Super Savings Offer" with **no published terms**; per-method rates not shown. Ask sales. |

Your rule was: *Zaakpay first if it gives 0% on the first ₹5 lakh; Paytm first if it gives 0% on credit cards.* Paytm does not, and Zaakpay's offer is smaller (₹5 lakh, at most 3 months, possibly UPI/wallet only) than Cashfree's (₹20 lakh, credit cards included, until 31 Mar 2027). So **Cashfree is first and Zaakpay second.** Switching later is one setting (section 6).

## 2. Payment categories: what each provider charges

"Platform fee" is what the gateway keeps; 18% GST is charged on top of it everywhere.

| Category | Cashfree | Zaakpay | Paytm | PhonePe |
|---|---|---|---|---|
| UPI | 0% under offer; otherwise per page | Free in intro offer; standard 1.85% plan | 1.99% (flat, "all transactions") | not published |
| RuPay debit | 0% under offer | not published | 1.99% flat | not published |
| Debit cards | 0% under offer | 1.85% | 1.99% | not published |
| **Credit cards (Visa/Mastercard/RuPay)** | **0% under offer** (but offer is removed if credit cards reach 60% of your sales) | 1.85% (offer may not cover cards) | 1.99% | 1.99% |
| RuPay credit card on UPI | contact support | not published | 1.99% | not published |
| Net banking | 0% under offer | 1.85% | 1.99% | not published |
| Wallets | 0% under offer (Amazon Pay, PhonePe etc. listed) | MobiKwik wallet in offer | 1.99% | not published |
| International cards | 2.95–2.99%, needs extra verification | not published | after verification, rate not shown | "same structure" |
| EMI / pay later | 1.5–2.5%, **excluded from offer** | not published | not shown | not shown |
| Setup / annual fee | ₹0 setup; AMC only for premium support | ₹0 setup and AMC | ₹0 / ₹0 | ₹0 / ₹0 |
| Settlement | T+1 by 8 PM during campaign; instant at 0.30% | not published | T+1; same-day options | not published |

## 3. Each provider in detail

### Cashfree (recommended)
- **Offer:** zero platform fee up to ₹20 lakh cumulative sales, applied automatically after KYC approval; runs to 31 Mar 2027; then 1.95% + GST. GST is still charged on the 1.95% notional fee during the offer (so you pay about 0.35% even "free"; confirm with Cashfree whether GST applies to a zero fee).
- **Restrictions on the offer:** domestic only; excludes AMEX, Diners, corporate cards, all EMI, prepaid cards, pay-later, e-mandates, international; **removed if credit cards reach 60% of sales (checked after ₹1 lakh)**; one offer per PAN or bank account, first activated account only; not for merchants who used Cashfree before 21 Jul 2026, custom pricing, or partner/reseller referrals; can be changed or withdrawn by Cashfree.
- **Reviews:** good on reliability and integration (G2 4.5 from 29 reviews; Capterra positive). Negative: Trustpilot 1.5 from 43 reviews (89% one-star, self-selected), PissedConsumer 1.7 from 11. Repeated themes: slow support, unexpected account freezes or limits during KYC ("partial approval" ₹50k cap), and terms allowing settlement holds (reported up to 180 business days after termination). A review site reports an RBI fine in March 2026 over escrow debits; **unconfirmed** from an RBI primary source.
- **Hidden charges to watch:** GST on fees; instant settlement 0.30%; payouts ₹3–15 per transfer; chargeback handling fees (ask); AMC for premium support.

### Zaakpay (MobiKwik)
- **Offer (unconfirmed, page appears old):** Startup plan 1.85% + taxes; intro: "MDR won't be charged up to GMV of 5L or 3 months, whichever is achieved earlier"; benefit text mentions UPI and MobiKwik wallet.
- **Reviews:** G2 3.8 (17), Techjockey 3.7 (10), Capterra 2.3 (3). Complaints: slow support, account not activated after documents, payments stuck at peak times.
- **Risk:** in Sept 2025 MobiKwik froze about 2,000 merchant accounts after a ₹40 crore unauthorised settlement error (Business Standard, Inc42).
- **Action:** email sales and get the offer's current terms, card coverage and settlement time **in writing**.

### Paytm Payments
- **Pricing:** 1.99% platform fee + 18% GST on **all** transactions; enterprise custom. Zero setup, zero AMC, no hidden upgrade charges. T+1 default, same-day/on-demand available. International cards after verification. No 0% credit-card or startup offer found.
- **Reviews:** Paytm for Business G2 4.5 from 281 reviews (largest sample here). Monthly limits are set per merchant by business type and documents.

### PhonePe PG
- **Pricing:** Standard 1.99% ("Free*", T&C not shown), Enterprise custom; zero setup and AMC; per-method rates and settlement not published; a "Super Savings Offer" with no stated end or cap.
- **Reviews:** too few to judge (G2 4.5 from 5; Capterra 5.0 from 2).

## 4. Rules that apply whichever provider you choose
- **RuPay credit card on UPI:** customers pay nothing; merchants pay a fee above ₹2,000 per payment (about 1.1–2% by category). Start date reported as 1 June 2026 in one Canara Bank notice and 15 Oct 2026 in another.
- **UPI and RuPay debit:** zero fee at the bank level, but gateways may still add their own platform fee.
- **Your plans are under ₹2,000** (₹29–₹799, recharges ₹19–₹79), so RuPay-credit-on-UPI fees above ₹2,000 do not affect most of your sales.
- KYC needs: PAN, bank account in the business or proprietor's name, website with pricing, terms, refund and privacy pages, contact details (all already on the site).

## 5. What will get any account blocked (please read)
- **Paying yourself.** Paying RENYXERA with your own card, or a family member's card, and settling to your own or a family member's bank is treated as card cash-out (self-dealing / transaction laundering). It breaks every provider's terms and card network rules.
- **Doing KYC in your father's name** while you run and pay into the business is **misrepresenting the beneficial owner**. Providers check device, IP, card and bank links between buyer and merchant; when they match, they freeze the account, hold settlements (often 90–180 days) and may report it to the card network or bank. It can also put your father's bank account and credit record at risk. **Do not do this.**
- Test payments: use the provider's **sandbox/test keys**, never real cards on the live account.
- Keep the KYC owner, the bank account and the person who runs the business the same. If your father is the real owner/partner, register the business properly with him as owner and you as authorised person; do not use his KYC as a cover.

## 6. Switchable provider (built)
- Code: `lib/billing/providers.ts` (server) and `lib/billing/checkout-client.ts` (browser). Every billing route (order, recharge, verify, recheck, reconcile, history, webhook) uses it.
- Choose with the environment variable **`BILLING_PROVIDER`** = `cashfree` | `razorpay` (working); `paytm`, `zaakpay`, `phonepe` are declared and show "not connected" until their adapters are written with their test keys.
- **Cashfree keys:** `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`. Sandbox is used while `NEXT_PUBLIC_BILLING_MODE` is `test`, production when it is `live`.
- **Webhook URL** for Cashfree (and Razorpay): `https://<site>/api/billing/webhook`. The route recognises the provider from the signature header.
- Content Security Policy updated to allow Cashfree's checkout.

## Sources
Cashfree charges page (cashfree.com/payment-gateway-charges), Paytm Payments pricing (paytmpayments.com/pricing and /payment-gateway), PhonePe PG pricing (business.phonepe.com/payment-gateway/pricing), Zaakpay pricing (zaakpay.com/pricing, via search snippet; the page did not render), SalaryBox cheapest gateways 2026, Capterra/G2/Techjockey/Trustpilot/PissedConsumer/Paymentreview.com reviews, Business Standard and Inc42 on the MobiKwik freeze (Sept 2025), Canara Bank MDR notices on RuPay credit on UPI, Razorpay blog on UPI platform fees.
