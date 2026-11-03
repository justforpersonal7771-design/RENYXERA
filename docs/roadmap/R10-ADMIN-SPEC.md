# Release 10: Admin console, full specification (4 Nov 2026)

Status: **plan only, nothing from this file is built yet** except the admin-lite slice (R30: Overview, Funnel, tagged links at `/admin`). Written after reading the app (53 API routes, 60 pages, 45 tables, 12 GitHub workflows, 100+ scripts), the roadmap and the social/Telegram docs. The owner asked for the most complete picture; every feature names where its data comes from, so nothing is invented.

## 1. Decision: keep it inside the app at `/admin` (not a separate app)

| | Inside the app (`/admin`) | Separate app (own Worker) |
|---|---|---|
| Running cost | none | none in money, but a second Worker, second CI job, second set of secrets |
| Upkeep for one non-developer | one deploy, one repo, shared types | two deploys, two sets of keys, duplicated code for plans, Supabase and billing |
| Security | one more route group; needs a strict gate | smaller attack surface by default |
| Speed to build | fast: reuses entitlements, billing, Telegram, Forge code | slower: all of that has to be shared or copied |

**Chosen: `/admin` inside the app**, with these rules that give most of the safety of a separate app:
1. Code lives only in `app/(admin)/` and `lib/admin/`. Next.js splits code per route, so students never download admin code.
2. Gate on the server for every page and API: signed in, listed in `admin_users`, role allows the action, and a fresh re-sign-in (or two-factor code) for money and plan actions.
3. Everyone else receives a plain 404 (the route does not advertise itself), `noindex`, rate-limited, and every write goes into an append-only audit log.
4. All admin code stays in those two folders, so it can be moved into its own Worker later if the business grows (a clean extraction, not a rewrite). Revisit when there are helpers who are not the owner, or when revenue pays for the extra upkeep.
5. Optional second wall: Cloudflare Access (free for a few people) in front of `/admin`. Check whether it works on the `workers.dev` address before relying on it.

Roles are stored in Postgres (10B): `owner`, `admin`, `content_editor`, `moderator`, `support`, `analyst`. Only `owner` can grant plans, refund, change roles or flip kill switches.

## 2. Modules (everything the admin can see and do)

### A. Dashboard (10G)
- Sign-ups, DAU/WAU, retention D1/D7/D30 (events and `learner_metrics`), tests per day, branch split. *Source: events, auth users, exam_attempts.*
- **Funnel by source** (visitors, tested, signed in, saw plans, clicked pay, paid). *Source: `funnel_by_source`; built in R30.*
- Revenue (live orders only), orders, refunds, MRR/ARR estimate, plan mix, expiring plans in the next 7/30 days, churn. *Source: billing_orders, entitlements.*
- Health strip: deploy version, error count (Sentry), AI quota used today, Supabase and Cloudflare free-tier usage versus limits, last backup, last keep-alive.
- Web vitals (LCP/INP/CLS) once sampled into `/api/events` (R15).

### B. Learners (10F)
- Search by username or email; profile, branch, plan, last seen, devices (`device_sessions`), attempts, streak, points and rating (`points_ledger`, `ratings`), referral tree (`referrals`).
- Actions: **grant, extend or revoke Plus/Pro with a reason and end date** (writes `entitlements`, source "admin", audited), add AI bonus credits (`ai_bonus_credits`), reset branch lock or approve a branch switch (`branch_switches`, `branch_lock_confirmations`), suspend, force sign-out of devices, reset daily limits, DPDP export or delete (existing `account/export`, `account/delete`). No impersonation.
- Support notes per learner, visible only to staff.

### C. Money (10H)
- Orders and payments with Razorpay reconciliation (existing `billing/reconcile`, `recheck`, `scripts/billing-report.mjs`); **refund button** wrapping `scripts/refund.mjs` logic (full or partial, optionally revoke plan).
- **Coupons**: create, pause, limit, see redemptions (`coupons`, `coupon_redemptions`). Interest list for unopened plans (`pro_interest`), waitlists (`branch_waitlist`), sponsor-break claims (`sponsor_claims`).
- Price and plan table view; billing mode indicator (interest/test/live); failed-payment and pending-order queue.

### D. Marketing and growth (R14)
- **Tagged-link builder** (built) and a campaign table: each campaign = source, medium, name, dates, spend (usually 0), results from the funnel.
- **Content calendar** over `content/calendar.json`: week/month view, status flow (idea, drafted, approved, scheduled, posted, failed), edit caption/hashtags/media/link, approve with one click, per-channel status and error. Writes through a safe commit or a database copy (see section 4).
- Weekly content pack generator hook: stores the pack Claude drafts locally (Claude stays local per the owner's rule) and lets the owner review and approve.
- Reply tracker for community answers (thread link, community, date, result), influencer and partner pipeline (`INFLUENCER_OUTREACH_MESSAGES.md`), institute outreach list with weekly cap counter (max 20/week).
- **Referral and share loop stats:** invites shared, joins, rewards given (`referrals`), top referrers, fraud flags (same device).
- A/B experiments: copy and price tests with one clear winner rule (Growth Engineer idea list).

### E. Social channel control (Telegram, Instagram, YouTube)
See section 3 for the per-channel detail. In the console each channel has: connection status, token expiry, today's queue, last 20 posts with result, a "post now" and "pause all" switch, and an error inbox.

### F. Automations (10I, 10K, 10L)
- One page listing every scheduled job with last run, next run, result, and a **Run now** button (GitHub `workflow_dispatch` through a fine-grained token kept as a server secret): `telegram-daily`, `telegram-hub`, `telegram-dispatch`, `social-publish`, `social-check`, `ai-pregen`, `forge-nightly`, `billing-reconcile`, `backup`, `keepalive`.
- Switches (kill switches, 10K): AI Mentor, AI pre-generation, Battles, live battles, friends, new sign-ups, payments, each Telegram feature, maintenance banner. Stored in a settings table and read with short caching.
- Lifecycle messages with on/off and run log, opt-in users only: plan-expiry reminders (7/3/1 day), win-back after N inactive days, mock-day reminders, weekly digest, streak-at-risk. Counts sent, opened (Telegram), unsubscribed.

### G. Content operations (10C, 10D, 10E)
- **Forge**: batches (b007 to b009 and later) with seeded/approved/retired counts, review queue, per-question stats (`forge_item_stats`), reports (`forge_reports`), approve/retire/edit with versioning and second-person review, release staggering (`--release`), subject and topic coverage versus past-paper weight, generator run log.
- **Official questions**: reported-question queue (`question_reports`) with accept/reject and a corrected-key workflow (`patch` records), answer-key audit status.
- **PYQ pipeline**: extraction progress per branch and paper, tag files, validation results.
- **AI pre-generation console** (10L): queue, throughput (about 300 items in 8 days is slow), failures, provider quotas, cache hit rate (`ai_pregen_items`, `ai_pregen_control`, `ai_response_cache`).
- **Mocks** (10C): calendar, publish/withhold results, re-rank, turnout (`mock_events`, `schedule-mocks.mjs`).
- **Study materials** (R12): chapter status, open review comments.
- Integrity queue (10D): purchase-then-scrape flags, answer-fetch usage (`answer_fetch_usage`), vault key requests, device sharing.

### H. Community and Arena
- Battles: active, expired, abuse reports; friends graph size; points ledger audit, leaderboard reset, ban from leaderboard, season setup and badges (when built).
- Moderation (R9): doubt threads and reports, toxicity flags, moderator actions.

### I. AI and platform health (10M)
- AI request logs with retention, per-provider quota, error rates, prompt-injection guard hits (`lib/ai/guard.ts`), Mentor usage per tier.
- Security: CSP reports (`csp-report`), rate-limit hits, failed sign-ins, RLS and RPC access check results (`check-rls`, `check-rpc-access`), secrets rotation reminders, backup restore drill date.
- Cost watch: free-tier meters (Supabase DB size, egress, Cloudflare requests, GitHub Actions minutes, Gemini/OpenRouter quota). Zero-budget alarm when any meter passes 70%.

### J. Settings, roles and audit (10A, 10B, 10J)
- Admin list and roles, sign-in and two-factor status, session length, optional IP allow-list.
- **Audit log** (append-only): who, when, what, before and after, reason; searchable; exportable. Cannot be edited by any role.
- Announcements and banners (10I) targeted by branch and plan, with schedule; maintenance mode; legal text versions.

## 3. Social channels: what exists and what the console needs

| Channel | Exists today | Gaps and limits | Console features |
|---|---|---|---|
| **Telegram** | Hub channel plus 6 branch channels, one PYQ a day with spoiler answer (`telegram-daily.yml`), hub updates (`telegram-hub.yml`), per-user reminders and dispatch every minute through pg_cron (backup 5-minute workflow), webhook, link/prefs/weak-topics routes, tables `telegram_accounts`, `_actions`, `_reminders`, `_sent`, `_link_codes` | No view of delivery failures or subscriber growth in one place | Post now to any channel, edit/cancel a queued post, preview the daily question before it goes out, swap the question, pause a channel, subscriber and join counts, linked-user stats, reminder sends/failures, bot health (`getMe`), webhook status |
| **Instagram** | Publisher exists inside `social-publish.mjs` (Graph API, reels and images, token refresh); **the owner still has to complete `docs/instagram/01-SETUP.md`** | Needs a professional account and a long-lived token (refresh before 60 days); about 100 posts per 24 h cap; media must be at a public URL (`social-upload.mjs`) | Token expiry countdown and refresh button, media upload, caption editor, schedule, publish result with permalink, comment inbox (read) later, insights (reach, plays, saves) pulled daily and stored |
| **YouTube** | **Not built.** Only strategy text in the playbook. `social-publish.mjs` handles Instagram and Telegram only | YouTube Data API needs OAuth and has a daily quota (an upload costs about 1,600 of 10,000 units, so roughly 6 uploads a day). Videos uploaded through an API project that has not passed Google's audit are locked private, so either request the audit (free) or upload by hand and let the console prepare the title, description, tags, thumbnail and chapters | Phase 1: metadata pack builder and a "ready to upload" checklist; Phase 2: API upload and scheduling once the audit passes; analytics (views, watch time, subscribers) pulled daily |

Cross-channel: one calendar, one approval step, one result log, a UTM tag added automatically to every link, "repurpose" button (one approved script becomes a Reel, a Short and a Telegram post), and a best-time chart from stored insights. Rule from the playbook stays: a human approves every post; nothing posts unreviewed.

## 4. Data and storage changes this needs

- **Reuse:** entitlements, billing_orders, coupons, referrals, events, forge tables, telegram tables, ai_pregen tables, device_sessions, points_ledger.
- **New tables (each a hand-applied migration, owner-run):** `admin_roles`/role column on `admin_users`, `admin_audit_log` (append-only via security-definer function), `app_settings` (switches and banners), `admin_notes`, `campaigns`, `social_posts` (the calendar moves from a JSON file to the database so the console can edit it safely and the publisher reads it; the JSON stays as a seed), `social_metrics` (daily pulls), `lifecycle_runs`, `admin_actions_queue` (for jobs that must run in GitHub Actions).
- **Secrets the console needs (server only, set by the owner in Cloudflare):** GitHub fine-grained token (trigger and read workflow runs, nothing else), existing Telegram bot token, Instagram token, YouTube OAuth later, Razorpay keys (already used for refunds). Nothing is ever sent to the browser.
- The student app's public security checks (no service-role key in the bundle) stay in CI and must keep passing.

## 5. Build phases (each ends with something the owner can use)

1. **Foundation (10A, 10B, 10J):** gate with fresh re-sign-in and two-factor, roles, audit log, settings table, move R30 pages into the new layout. *Owner: apply 2 migrations, add yourself as owner.*
2. **Learners and money (10F, 10H):** search, plan grant/extend/revoke, AI credits, orders, refunds, coupons. *Owner: one migration.*
3. **Growth and social (D, E):** campaigns, content calendar in the database, approvals, Telegram controls, Instagram token and posting, funnel per campaign. *Owner: finish Instagram setup, add GitHub token secret.*
4. **Automations and switches (F):** job list with Run now, kill switches, lifecycle messages. 
5. **Content ops (G):** Forge review, reports queue, AI pre-gen console, mocks.
6. **Health and cost watch (I), community (H).**
7. **YouTube:** metadata pack first; API upload only after Google's audit.

Rough size: phases 1 and 2 are the most valuable for revenue (grant plans, see money) and can be one session each; phase 3 is the largest.

## 6. Risks and rules
- Money and plan actions need the owner role plus a fresh sign-in, and always write the audit log with a reason.
- DB migrations and any seeding stay owner-run (standing rule). The console never runs SQL and never holds keys in the browser.
- All times shown in IST (`lib/time/ist.ts`).
- Mobile-friendly and full width, light and dark, like the rest of the app.
- Opt-in messaging only (DPDP Act, TRAI); every lifecycle message has a stop option; no scraping logged-in platforms.
- The student app must not slow down: admin code is lazy and per route, and admin analytics run on indexed queries over `events` (pruned at 400 days).
