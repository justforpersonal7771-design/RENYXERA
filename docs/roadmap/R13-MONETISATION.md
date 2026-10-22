# Release 13 — Monetisation III (P3)

*Builds on what is live: Free / Plus ₹29·₹249 / Pro ₹99·₹799, season pass, prorated upgrade, coupons, receipts (`lib/billing/plans.ts`, `components/billing/*`, `app/api/billing/*`). Rules: no lifetime deals, no free trials, no fake "was" prices, ₹0 running cost.*

## R13-A · Conversion (highest impact)

### A1 · Forge locks as the main upgrade moment
Free users see the Daily Forge card blurred with "10 new GATE-level questions today — Plus"; Forge Mock results show "practise questions like the ones you missed" → Plus. Track `upgrade_view`/`upgrade_click` events by source.
Done when: events recorded per source; conversion per source visible in `weekly_growth_metrics()` (extend).

### A2 · Plans page refresh
Comparison table (Free / Plus / Pro rows: PYQs, mocks, Forge, AI per day, analytics depth, planner automation, Telegram, offline, study materials as separate add-on), FAQ (refunds, renewals, season pass), real testimonials (with consent), the promo film.
Done when: page passes the design review; CWV budget met.

### A3 · Season-pass campaign (Dec → exam)
Banner in app, Telegram hub post weekly, Instagram posts; countdown-based copy; coupon for early buyers (coupons already built).
Done when: campaign calendar in `content/calendar.json`; banner switchable by date.

### A4 · Smart upgrade sheet
One sheet that shows exactly what the locked feature gives (preview image/video), price per day ("₹0.97/day"), and one tap to pay.

### A5 · Bundling nudge
After 3 purchases or 2 renewals, suggest the season pass/yearly with honest savings.

### A6 · Post-purchase onboarding
After payment: a 3-step tour of what was unlocked; Telegram Plus/Pro features linked.

## R13-B · New revenue lines

- **B1 · Study-materials pass** (R12-A6).
- **B2 · Affiliate links**: books (one recommended book per subject), scientific calculator, laptop stands; disclosure on page and in `/disclaimer`; `NEXT_PUBLIC_AMAZON_TAG` exists; track clicks.
- **B3 · Sponsorships**: house `SponsorSlot` on public pages; a media kit page (audience, traffic, rates) once traffic exists.
- **B4 · College / B2B licence**: a college buys Pro for a batch; teacher dashboard (feature idea 17); invoice via Razorpay payment link.
- **B5 · Digital packs**: printable formula sheets per subject (generated from study materials), sold one-time.
- **B6 · Ads (after domain)**: AdSense/Media.net with consent management; non-personalised for under-18s; never in exams/auth/checkout; ad-free for Plus/Pro.

## R13-C · Money operations
- **C1** Confirm UPI MDR on Razorpay (owner).
- **C2** Monthly billing report (`scripts/billing-report.mjs`) sent to the owner's Telegram automatically.
- **C3** Refund flow documented; `scripts/refund.mjs` tested in test mode.
- **C4** 🟡 GST registration and invoices once revenue requires it.
- **C5** A/B test framework (feature flags) for price display and copy — never different prices for the same plan at the same time.

## Done when (release)
Upgrade funnel measured end to end; at least two new revenue lines live (study pass + affiliates); season-pass campaign run.
