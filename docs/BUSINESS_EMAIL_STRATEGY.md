# RENYXERA business email strategy: every address, every email, every rule

Read top to bottom once, then use it as a reference. Prices and free-tier limits change, so check each provider's page on the day you sign up. Where a number matters I say "check".

## 0. The situation today

- No custom domain yet (deferred until revenue; the first real payment has now arrived, so this can start). Until you own a domain you cannot have `name@renyxera.com` style addresses.
- Zero-budget rule: everything below has a free route. The only unavoidable cost is the domain itself (roughly ₹700 to ₹1,200 a year for a `.com` or `.in`; check a registrar such as Cloudflare Registrar, which sells at cost).
- Payments are Razorpay only. Receipts exist in the app. Telegram is the main reminder channel. Email is for things that must reach people who are not in Telegram, and for anything legal or financial.

## 1. Three phases

| Phase | When | What you have | Cost |
|---|---|---|---|
| 0 | Now | One dedicated Gmail for the business (for example `renyxera.official@gmail.com`) with a clear display name, a signature, labels and saved replies. Supabase sends auth emails | ₹0 |
| 1 | The day you buy the domain | Real addresses (`support@`, `hello@`, and so on) forwarded to Gmail, sending from them via Gmail "Send mail as", transactional email through a provider with a free tier, SPF, DKIM and DMARC set up | domain only |
| 2 | When you have a team or more than ~100 emails a week | A hosted mailbox per person (Google Workspace or Zoho) and a shared inbox or help desk | paid, only when revenue covers it |

Do not skip Phase 0 details. A clean Gmail with templates handles the first few hundred users.

## 2. The addresses (create these in Phase 1)

Everything forwards to one inbox at first. Use labels and filters to separate them.

| Address | Purpose | Who reads it | Reply target |
|---|---|---|---|
| `hello@` | General questions, press, "I want to know more", feedback | You | 2 working days |
| `support@` | Student help: login, practice, planner, Telegram | You | 24 hours |
| `billing@` | Payments, receipts, duplicate or failed charges, coupons | You | 24 hours, 4 hours for a charged-but-not-activated case |
| `grievance@` | The grievance officer contact (required for Indian platforms under the IT Rules; name the officer on the Contact page) | You | Acknowledge in 24 hours, resolve in 15 days |
| `privacy@` | Data access, correction, deletion requests (DPDP Act 2023) | You | Acknowledge in 3 days, complete within 30 days |
| `legal@` | Notices, takedowns, copyright claims | You | 3 working days |
| `security@` | Vulnerability reports. Publish it at `/.well-known/security.txt` | You | 2 working days |
| `partners@` | Influencers, coaching institutes, colleges, sponsors, ads | You | 2 working days |
| `careers@` | Interns, volunteers, content contributors | You | Weekly batch |
| `noreply@` | Automated mail only (sign-in links, receipts). Use a real reply-to (`support@`) so people can still answer | Nobody | Reply-to goes to support |
| `postmaster@` and `abuse@` | Required standard mailbox names. Forward both to you | You | When something arrives |

Rule: never use a personal address in a footer, a receipt or a legal page.

## 3. One-time setup (Phase 1, in this order)

1. **Buy the domain** at a registrar that has no markup and free privacy (Cloudflare Registrar or similar).
2. **Inbound mail, free:** Cloudflare Email Routing (needs the domain on Cloudflare DNS) forwards every address to your Gmail. No mailbox is hosted; it only forwards.
3. **Send as your address, free:** in Gmail add "Send mail as" `support@your-domain` using the SMTP details of your transactional provider (below), so replies come from the business address.
4. **Transactional provider (automated mail), free tiers:** Resend (free tier about 3,000 emails a month and 100 a day; check) or Brevo (free tier about 300 a day; check). Pick one. Verify the domain there; it gives you DNS records.
5. **DNS records, all three are required for Gmail and Yahoo delivery:**
   - SPF: one TXT record listing your senders (only one SPF record per domain).
   - DKIM: the keys your provider gives you.
   - DMARC: start with `v=DMARC1; p=none; rua=mailto:dmarc@your-domain` for two weeks, read the reports, then move to `p=quarantine`, and later `p=reject`.
6. **Supabase auth emails:** the built-in sender is for testing only and is rate limited very low. In Supabase Auth settings add your provider's SMTP, set the sender to `noreply@your-domain`, and edit the templates (section 5). This also fixes the "email didn't arrive" support tickets.
7. **Test deliverability:** send to a Gmail, an Outlook and a Yahoo address, plus a free mail-tester check. Fix anything under 9 out of 10.
8. **Publish:** the Contact page (all addresses with response times), the grievance officer's name, `security.txt`, and the unsubscribe page.

## 4. Rules that keep you legal and out of spam

- **Consent:** only email people who signed up or paid. Never buy or scrape lists. Marketing email needs a clear opt-in; transactional email (receipts, security, plan expiry) does not, but keep it to its purpose.
- **Unsubscribe:** every marketing email has a one-click unsubscribe link and the standard `List-Unsubscribe` header. Honour it within 24 hours. Store opted-out addresses in a suppression table and check it before every send.
- **Identity:** every email shows the sender name, product name and a postal or registered address in the footer. Add the address you use on your legal pages.
- **Honest content:** no fake urgency, no rank or selection promises, no hidden prices. State amounts in rupees with "taxes included" when true.
- **DPDP Act 2023 basics:** say what you collect and why, let people see, correct and delete their data (`privacy@`), keep email content free of sensitive details, and never put a payment ID or a full phone number in a subject line.
- **Bounces and complaints:** remove hard bounces immediately. If complaints pass 0.1 percent, stop campaigns and clean the list. Gmail and Yahoo penalise anything above that.
- **Volume:** warm up a new domain. Week 1 at most 50 a day, week 2 at most 150, then grow. Transactional and marketing mail should use different sender addresses (`noreply@` vs `news@`).
- **Never** send passwords, full card details or OTPs in plain text. Auth links expire.

## 5. Transactional emails (automatic, no opt-in needed)

Send these from `noreply@` with reply-to `support@`. Keep each one short, plain, one clear button.

| # | Email | Trigger | Key content |
|---|---|---|---|
| T1 | Confirm your email | Sign-up | One button, expiry time, "if this wasn't you, ignore" |
| T2 | Magic link / sign-in link | Sign-in request | One button, 15 minute expiry, device hint |
| T3 | Reset password | Request | One button, expiry, security tip |
| T4 | Welcome | After confirm | Three first steps: pick branch, take a diagnostic, link Telegram |
| T5 | Payment receipt | Payment verified | Plan, amount, date, receipt number, link to the in-app receipt, seller name and address, "taxes included" |
| T6 | Plan active | Activation | What unlocked, when it ends, no auto-renewal |
| T7 | Payment failed or pending | Razorpay failure or delay | Reassure, what to do, "if money left your account it is fixed automatically" |
| T8 | Plan ending soon | 3 days and 1 day before | Date it ends, what stays free, a link to renew (not pushy) |
| T9 | Plan ended | Day after | What you keep, how to come back |
| T10 | Refund or duplicate-charge fix | Manual or script | Amount, reference, when it reaches the bank (5 to 7 working days) |
| T11 | Account deletion | Request and completion | What is removed, final confirmation |
| T12 | Data export ready | Request | Download link with expiry |
| T13 | Security alert | New device or password change | What happened, how to lock the account |

Copy for the five that matter most:

**T1 Confirm your email**
> Subject: Confirm your email for RENYXERA
> Hi {first_name}, tap the button to confirm your email and start practising. The link works for 24 hours. If you did not sign up, you can ignore this message.
> [Confirm my email]

**T5 Payment receipt**
> Subject: Your RENYXERA receipt {receipt_no}
> Thanks, {first_name}. We received ₹{amount} for {plan_name} on {date}. Your plan is active until {end_date}. It does not renew automatically.
> Receipt {receipt_no} · Seller: {seller_name}, {seller_address} · Taxes included.
> [View receipt] · Questions? Reply to this email.

**T7 Payment pending**
> Subject: We are checking your payment
> Hi {first_name}, your payment of ₹{amount} is taking longer than usual to confirm. You do not need to pay again. If the money left your account, your plan activates automatically within a few minutes, and if it does not, we fix it manually and you hear from us within 24 hours.

**T8 Plan ending soon**
> Subject: Your {plan_name} ends in {days} day(s)
> Hi {first_name}, your plan ends on {end_date}. You keep your progress and all free tools. If you want to continue, you can renew in one tap. No auto-renewal, so nothing is charged unless you choose.
> [Renew {plan_name}]

**T10 Refund**
> Subject: Your refund of ₹{amount} is on its way
> Hi {first_name}, we have sent ₹{amount} back to your original payment method. Reference {ref}. Banks usually take 5 to 7 working days. Reply if it has not arrived by {date}.

## 6. Lifecycle emails (opt-in, from `news@` or `hello@`)

Keep the sequence short. Stop it the moment someone buys or unsubscribes.

**Onboarding series (7 days)**
- Day 0: welcome (T4).
- Day 1: "Your first 20 questions" with a link to a section test.
- Day 3: "Build your study plan" with the planner link.
- Day 5: "Never miss a mock": link Telegram.
- Day 7: "How you did this week" with a stats summary and the weakest topic.

**Habit emails**
- Weekly digest (Sunday): questions solved, accuracy, streak, one weak topic, next mock date.
- Mock reminders: the Telegram bot already sends them; email only if the student has no Telegram linked.
- Inactivity (7 days quiet): "Pick up where you left off" with the last topic.
- Exam countdown (100, 60, 30, 7 days): a short revision focus for that stage.

**Win-back (30 days quiet, once)**
> Subject: Still preparing for GATE {year}?
> Hi {first_name}, your progress is saved. Here is a 10-question set on {last_topic} to get back in. Not preparing this year? Tell us in one click and we will stop emailing.

**Upgrade emails (maximum two a month, only to free users who have used the app)**
- After the third completed test: "See which topics cost you marks" with Plus benefits in simple English.
- Before a big mock: "Unlock the planner and reminders for ₹29".
- Never email paid users upgrade pitches for the plan they already have.

**Announcements** (one to two a month): new branch, new feature, new official paper. Lead with what changed for the student, not with the company.

## 7. Business and partnership emails (from `partners@` or your own name)

Use `docs/INFLUENCER_OUTREACH_MESSAGES.md` for Instagram. Email versions below.

**Coaching institute or college (B2B)**
> Subject: Free GATE practice access for your students
> Hi {name}, I am Adil, the builder of RENYXERA, a GATE practice platform with official past papers, topic analytics, mocks and a study planner. I would like to give your {students/batch} free access for one month and hear what is missing. If it helps, I can send a short demo and set up accounts in bulk. Would a 15 minute call this week work?

**Creator (email version)**
> Subject: Free Pro for your GATE audience
> Hi {name}, I watch your {topic} videos. I run RENYXERA (free GATE past papers, planner, score calculator). I would like to give you a free Pro account and a code for your followers. No obligation. May I send the details?

**Sponsor or advertiser inquiry (inbound reply)**
> Thanks for your interest. We run clearly labelled sponsor slots for study tools. Our audience is GATE aspirants in {branches}. I can share traffic numbers and a rate card. What is your product and budget range?

**Press or blogger**
> Subject: GATE prep tool built by a student, with official 2026 data
> Hi {name}, we published GATE 2026 qualifying marks and a score calculator for six papers using only official IIT Guwahati data. Happy to share a quote, screenshots or a walkthrough.

**Follow-up (once, after 4 days)** and **thank-you after a collab** are one line each: be polite, never chase a third time.

## 8. Support playbook (macros to save in Gmail)

Set up these as Gmail templates. Always greet by name, answer in the first two lines, then give steps.

| Macro | When |
|---|---|
| Can't sign in | Link expired or wrong email. Steps to resend, check spam, try a different browser |
| Payment done, plan not active | Ask for the Razorpay payment ID and the email used. Check the dashboard and reconcile. Promise an answer within 4 hours |
| Duplicate or failed charge | Verify in Razorpay, run the refund script, send T10 |
| Wrong answer or question issue | Thank them, ask for the question id (shown in the app), log it, fix in the next data update, tell them when it is fixed |
| Telegram not linking | Steps: open the bot, press Start, wait, retry; check the group join step |
| Delete my account | Verify via the account email, confirm in writing, delete within the legal window, send T11 |
| Feature request | Thank them, say it is logged, never promise a date |
| Refund request (not a charge error) | Policy is no refunds on completed purchases except a failed or duplicate charge; explain kindly and offer to help them get value |
| Angry message | Acknowledge the feeling in one line, fix the problem, do not argue, do not copy-paste legal text |

Response targets: 24 hours for support and billing, 4 hours for charged-but-not-active. Keep a simple sheet: date, address, topic, status, time to first reply. Review it weekly.

## 9. Measuring email

| Metric | Healthy | Action if worse |
|---|---|---|
| Delivery rate | above 98 percent | Check SPF, DKIM, DMARC and bounces |
| Open rate (marketing) | 30 to 45 percent (Apple Mail inflates this) | Test subject lines; do not rely on opens alone |
| Click rate | 3 to 8 percent | Fewer links, one clear button |
| Unsubscribe | under 0.5 percent per send | Fewer emails, better targeting |
| Spam complaints | under 0.1 percent | Stop, clean the list, check consent |
| First reply time | under 24 hours | Add macros |
| Receipt-related tickets | falling | Improve T5 and T7 |

## 10. How to build it into this repo (tell me when you want me to do it)

1. `lib/email/` with a `sendEmail({to, template, data})` wrapper around Resend or Brevo, plus plain-text and HTML versions of every template.
2. A `email_suppressions` table (migration) and an `/unsubscribe` route with one-click support and the `List-Unsubscribe` header.
3. Hook T5, T6, T7, T8 and T10 to the existing billing flow (verify route, webhook, hourly reconcile, refund script).
4. Supabase Auth SMTP configured and templates T1 to T3 replaced with the branded versions.
5. A GitHub Action for the weekly digest and inactivity emails (respecting opt-outs).
6. Contact page with all addresses, response times and the grievance officer, plus `security.txt`.

## 11. Checklist

- [ ] Phase 0: dedicated Gmail, signature, labels, the macros from section 8.
- [ ] Buy the domain.
- [ ] Cloudflare Email Routing for every address in section 2.
- [ ] Provider account (Resend or Brevo), domain verified, SPF, DKIM, DMARC set to `p=none`.
- [ ] Supabase SMTP and branded auth templates (T1 to T3).
- [ ] Contact page, grievance officer name, privacy contact, `security.txt`.
- [ ] Receipts, plan-ending and payment-pending emails (T5 to T10).
- [ ] Unsubscribe route and suppression list before the first marketing email.
- [ ] Warm up the domain slowly; move DMARC to `quarantine` after two clean weeks.
- [ ] First onboarding series live; review metrics after two weeks.
