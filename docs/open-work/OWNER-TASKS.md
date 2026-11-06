# Owner tasks: everything only you can do

[← Docs index](../README.md) · [Open items](OPEN-ITEMS-2026-11-06.md) · [Decisions](OPEN_DECISIONS_FOR_YOU.md) · [Checklist](../../checklist.md)

Updated 6 Nov 2026. Tick a box (`[x]`) when done: in VS Code's Markdown preview, or open [owner-tasks.html](owner-tasks.html) in a browser, where ticking strikes the line off and remembers it. Order inside each group is by priority. Claude keeps this file in sync every turn; tell Claude when you finish something and it is ticked here and in `checklist.md`.

Rules that apply to every task: ₹0 budget, never use claudexit02@gmail.com anywhere, DB changes are run by you.

---

## A. Decisions made (record only, nothing to do)
- [x] Study-materials refund: **no refunds**. Claude updates the refund and terms wording (see C1).
- [x] Share cards: show **only what is in the profile, not editable**. Done in code 6 Nov. Student verification: add later if needed (see D3).
- [x] GST on study materials: **decide when revenue arrives**.
- [x] Content licences for `notes/`: you hold the rights for now; **revisit when the product is paid**.
- [x] Battles async expiry: keep 7 days.
- [x] Admin console (R10): not before the non-negotiable set is done.

## B. Do these first (they unlock revenue)
- [ ] **B1. Post the week 1 content pack with the tagged links.** Open [WEEK-01-CONTENT-PACK.md](../growth/marketing/WEEK-01-CONTENT-PACK.md). Copy each post, keep the link exactly as written (it carries `utm_source`), post on Telegram, Instagram and YouTube/Shorts. After 3 days run `node scripts/growth-metrics.mjs` or open `/admin` then Funnel and tell Claude the numbers.
- [ ] **B2. Turn on two-factor login (2FA) on every account**: GitHub, Cloudflare, Supabase, Google (the Gmail you use), Razorpay, Meta (Instagram), Telegram. For each: sign in, open Security settings, choose "Authenticator app", scan with an authenticator app on your phone, save the recovery codes in a safe place. Tick each below.
  - [ ] GitHub  - [ ] Cloudflare  - [ ] Supabase  - [ ] Google  - [ ] Razorpay  - [ ] Meta  - [ ] Telegram
- [x] **B3. Real refund test.** In Razorpay Dashboard open Payments, pick one of your own 29-rupee test payments, press Refund, then check it shows refunded in `/admin`. Tell Claude the result so the refund flow is closed.
- [x] **B4. Razorpay UPI fee (MDR).** Razorpay Dashboard, Settings, Payment methods: confirm UPI is on and note the fee shown. Tell Claude.
- [ ] **B5. Read the new Forge questions.** Read the 12 X-tier items (b011) and about 10 of the 60 in b010 (`data/forge/CS/batches/`). Mark any wrong answer or unclear wording and send the question ids. Reading guide: [FORGE_AUDIT_2026-11-06.md](../forge/FORGE_AUDIT_2026-11-06.md).

## C. Claude will write, you review or approve
- [x] **C1. Refund wording.** Done 6 Nov: refund page section 2 and terms section 7 now say study materials are not refundable (except double or wrong charge, or never opened). Read `/refunds` once and say OK. (Legal review of the text later when revenue allows.)
- [ ] **C2. Privacy policy update** done 6 Nov (usage events, Forge, study materials, share cards, payments now live). Read `/privacy` section 2 and 8, then tick.
- [ ] **C3. Week 2 content pack.** Claude drafts after you report week 1 numbers.
- [ ] **C4. Study lessons accuracy (S4).** You review CS lessons when Claude produces the Deadlock reference chapter.

## D. Decisions still waiting on you (defaults in [OPEN_DECISIONS_FOR_YOU.md](OPEN_DECISIONS_FOR_YOU.md))
- [x] **D1. Forge F2:** Free does NOT see Forge Mock solutions (decided 6 Nov).
- [x] **D2. Forge F3, F4, F5, F6:** one Daily Forge teaser per branch channel, mock cadence, branch order, keep the name Forge.
- [x] **D3. Student verification** for share cards: now profile-only. Do you also want an ID check? (default: no for now)
- [x] **D4. Study S3, S5, S6, S7:** sources rule, English only, Deadlock sample first, private store for content.
- [x] **D5. Battles:** go-ahead for seasons and badges, and per-question speed scoring.
- [ ] **D6. Feature ideas:** pick numbers from [FEATURES.md](../roadmap/FEATURES.md) (56 ideas), or say "none yet".
- [x] **D7. Names** for the Spark and Blend features.
- [x] **D8. Repo account:** decided: not now, move later (see H7).
- [ ] **D9. Looks and Mentor choices** (R26 section 9, R27 section 4).

## E. Accounts and setup
- [ ] **E1. Instagram setup** following [01-SETUP.md](../growth/instagram/01-SETUP.md): Meta app, token, two secrets in GitHub.
- [ ] **E2. Telegram:** Premium boosts, per-branch folders, BotFather menu and commands, edit the pinned welcome post, refresh the link preview with @WebpageBot (steps in `docs/growth/telegram-premium/`).
- [ ] **E3. Upload the films** to YouTube (also a Short and a Reel), send Claude the YouTube video id.
- [ ] **E4. Google sign-in logo upload** (needs a custom domain, so after revenue).
- [ ] **E5. Microsoft Partner Center:** create an individual account and reserve the app name.
- [x] **E6. Verify migration 0046** (`0046_challenge_first.sql`): in Supabase SQL editor run `select count(*) from information_schema.columns where table_name='battles';` and tell Claude it returns rows.
- [x] **E8. Run migration `supabase/migrations/0053_upgrade_clicks.sql`** in the Supabase SQL editor (open the file, copy all, paste in SQL Editor, press Run, expect "Success"). It lets us see which lock makes people click Upgrade. Tell Claude "done 0053".
- [ ] **E7. Clean the working folder:** delete `New folder/`, decide about `docs/*.zip` and the untracked images, move `logo/` and `video/.bundle2/` out or ignore them.

## F. Real device and account tests (phone first, then desktop, each in light and dark)
- [ ] **E9. Restore drill (quarterly, first before 31 Jan 2027):** follow section 3 of [SECURITY-RUNBOOK.md](../engineering/SECURITY-RUNBOOK.md); note the date in the drill log.
- [ ] **F1.** Phone: a payment, the More sheet drag, the onboarding Telegram step, aptitude images, Civil practice.
- [ ] **F2.** Free, Plus and Pro accounts through the Forge and practice-set gates.
- [ ] **F3.** Battles comparison and rematch screens.
- [ ] **F4.** The new share card (profile details only): tick name, username, ID, avatar, share and download.
- [ ] **F5.** Check `https://gate.renyxera.workers.dev/.well-known/security.txt` opens after the next deploy.

## G. Marketing actions (Claude drafts, you post)
- [ ] **G1.** Growth tasks G-5, C-3, V-1, P-1 in [GROWTH_TASKS.md](../growth/GROWTH_TASKS.md).
- [x] **G2.** `claude-youtube` skill pack reviewed 6 Nov: safe to install (report: [YOUTUBE-SKILL-REVIEW.md](../growth/YOUTUBE-SKILL-REVIEW.md)). Optional install is task G4.
- [ ] **G3b. Upload your first video to the YouTube channel** (YouTube Studio, Create, Upload videos, pick the film from `video/out/`, title and description from the week 1 pack, publish), then send Claude the video link.
- [ ] **G4. (optional) Install the pack:** after reading the review, tell Claude "install youtube skill" and it runs the install; or run `git clone --depth 1 https://github.com/AgriciDaniel/claude-youtube` then copy `skills/claude-youtube` into your `.claude/skills/youtube` folder.
- [ ] **G3.** Telegram deep links and branch commands (after C2 of R14 is built).

## H. Later (waiting on revenue or a trigger)
- [ ] **H1.** Custom domain and business email (see [BUSINESS_EMAIL_STRATEGY.md](../business/BUSINESS_EMAIL_STRATEGY.md)).
- [ ] **H2.** GST registration and invoicing: ask an accountant once revenue grows.
- [ ] **H3.** Licence check for the textbooks in `notes/` before study materials are sold.
- [ ] **H4.** Legal review of refund and terms text.
- [ ] **H5.** Play Store listing (₹2,100) and welcome email series.
- [ ] **H7.** Move the repo to the renyxera account (decided: later).
- [ ] **H6.** March 2027: official marks-to-rank data and PYQ refresh (Claude prepares, you confirm sources).
