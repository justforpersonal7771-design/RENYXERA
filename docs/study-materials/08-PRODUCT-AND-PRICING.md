# 08 · Product, pricing and introduction

Study Materials is a **separate product**. It is not included in Free, Plus or Pro, and buying Plus or Pro does not unlock it (a purchase discount is allowed; inclusion is not).

## 1. Why it stays outside the plans

- **Different cost and value:** the plans sell AI quota, analytics and planner features (a service). Study materials are a content product with real production cost (review, maintenance, yearly refresh) and a very different value per student.
- **Different buyers:** a student who only wants the question bank and the simulator should not pay for text they will not read; a student who wants the notes may not need AI quota.
- **Clean positioning:** the free product stays generous (full PYQ bank, simulator, analytics basics), the plans improve the practice experience, and the materials teach. Three clearly different reasons to pay.
- **Protects the plans' simplicity:** no feature creep in the pricing page.

## 2. What the student gets

- **Free forever (marketing + trust):** the full syllabus map with weightage; the first topic of every subject in full; every chapter's *recall card* of its first topic; the "what to study first" path. Search engines index these pages.
- **Paid (per branch):** every topic of every subject of the branch (including shared General Aptitude and the maths library parts that branch uses), recall sheets, chapter checks, offline reading in the protected vault, progress and notes, and all updates for the exam cycle (corrections and the March refresh).

## 3. Pricing options (decision needed)

Context: students compare against free web notes, YouTube lectures and coaching notes that cost ₹1,500 to ₹5,000 or more. Our plans are ₹29 to ₹99 a month. The product rules say no lifetime offers and no free trials.

| Option | Shape | For | Against |
|---|---|---|---|
| **A. Branch pass until the exam (recommended)** | One-time payment per branch, valid until 31 March of the exam year (same logic as the existing season pass); includes all updates in the cycle. Suggested **₹399** (launch/founding **₹299** while chapters are still being released) | Simple to understand; matches how students study (one exam cycle); no renewal friction; one Razorpay order | Needs yearly re-purchase for repeaters (offer a renewal discount) |
| B. Per-subject packs | ₹99 to ₹149 per subject | Entry price is low; students buy only weak subjects | Many small transactions; harder to promise "complete"; more support |
| C. Subscription | ₹99/month for all branches | Recurring revenue | Our product rule is non-renewing fixed-period payments; ongoing churn pressure |
| D. Bundles | A + the existing season pass at a combined price (for example ₹399 + Pro season at a discount) | Higher average order | Looks like inclusion if badly worded |

**Recommendation: A, with an optional subject pack (B) for the three largest subjects only after launch data shows demand, and a bundle discount (D) of 20 % when the same account buys a Plus or Pro season pass.** Founding pricing is time-boxed to the first release window and clearly says so; it is never a "lifetime" offer.

Operational pricing notes:
- Price shown in INR, GST-inclusive text consistent with the existing receipt flow; invoices and receipts reuse the printable receipt system.
- Coupons already exist (server-validated, per member); they apply here too (for example a referral discount).
- Changing the price later never changes what existing buyers paid (the order records the price).

## 4. Delivery and entitlement (technical outline)

- New table `study_access (user_id, branch, source, valid_until)` with RLS (read own; written only by the service role), separate from `entitlements` so the plans and the study product never interfere.
- A new `product_id` in the billing order (`study_cs_2027`, `study_ec_2027`, …); the existing Razorpay order → signed webhook → idempotent apply pattern grants the row. The webhook remains the only path that grants access.
- A `getStudyAccess(userId, branch)` server helper, fail-closed, used by the key endpoint (see `07`).
- Branch scoping already exists (one branch per account with a final change); study access is **per branch purchased**, so a student who switches branch keeps the access they paid for and sees the other branch's free preview.
- Refund script (`scripts/refund.mjs`) extends to revoke study access and chapter keys.

## 5. Policies that must be written before launch

- **Refund and cancellation:** digital content, immediate access; the free preview is the "try before you buy"; refunds only for a content failure we cannot fix (account unable to read what was sold), or a duplicate payment. Wording is added to `/refunds` and the Terms, and the buyer must tick the acknowledgement at checkout (same mechanism as the plans).
- **Acceptable use:** personal use, two devices, no redistribution, watermark acknowledgement, scraping prohibited (see `07`).
- **Corrections policy:** errors are fixed within 48 hours with a visible note; major corrections are announced.
- **Updates policy:** what "updates until exam time" means (corrections, syllabus changes, the March refresh; not new subjects that were never announced).
- **Privacy:** the reading log purpose, retention (for example 90 days), and what is used for protection.

## 6. How to introduce it (sequence)

1. **Phase 0 (quiet):** build the pipeline and one reference chapter; no public mention except a "Study Materials: coming" strip with a waitlist (we already have a waitlist component and notification capture).
2. **Soft pilot (invite-only):** CS Operating Systems chapters free to 50 to 100 volunteers (from the Telegram group and the waitlist) in exchange for structured feedback and error reports. Their feedback also seeds testimonials.
3. **Founding release:** CS Section by section, each release announced in the Telegram channel and Instagram (the launch film gets a "Study Materials" cut). Founding price valid until the first complete CS release.
4. **Complete CS release:** founding price ends, normal price applies; free-preview pages get indexed (SEO). Run a "Why our notes are different" article series from the same content (the free previews).
5. **Branch by branch:** each branch launches only when the launch gate passes (coverage 100 %, review complete, protection red-team green, pricing page ready). Waitlist members of that branch are emailed/Telegram-notified first.
6. **Yearly cycle:** March refresh → "What changed" announcement → renewal offers for last year's buyers.

## 7. Where it appears in the product

- A **Study** tab in the bottom bar (and a left-nav entry) opening the branch map; locked chapters show the free preview and a clear "Unlock {branch} materials" card (never a wall on arrival; same rule as everything else).
- **Contextual links:** each PYQ solution links "Learn this topic"; each Checkpoint result links the chapter; the Planner can add a "Read: Chapter X" block (the Planner already supports study blocks).
- **Dashboard:** "Continue reading" card for buyers, "Free preview of the week" for others.
- **Telegram:** a daily recall card (from published recall cards) for buyers; the free channel gets one public-preview recall card a week.
- **Never inside exam mode.**

## 8. Success measures (business)

| Measure | Why |
|---|---|
| Free-preview → paid conversion | Does the preview sell the product? |
| Completion of a purchased chapter | Is it good enough to finish? |
| Support tickets per 100 buyers (content errors versus access problems) | Quality and operations health |
| Leak signals (flags, canary hits) | Is protection working? |
| Renewal rate in the next cycle | Long-term value |
| Revenue per branch against reviewer and tooling cost | Is each branch worth building? (decide the later branches with this data) |

## 9. Cost and the ₹0 rule

Build and runtime stay on free tiers (Workers, Supabase free, GitHub Actions). The one real cost is **expert review** (people time). That is funded from the first study-material revenue; the CS pilot is reviewed by you and volunteers, and review budget for later branches is released only when the previous branch earns enough to cover it. No paid DRM, no paid hosting.
