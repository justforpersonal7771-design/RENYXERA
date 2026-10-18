# RENYXERA — Open items (the only live checklist)

**Last updated:** 17 October 2026.
Everything finished lives in `archive/COMPLETED.md` (the untouched old checklist is `archive/checklist-full-2026-10-17.md`).
Reference and strategy docs are listed in `docs/README.md`. When something ships, tick it here and move the row to `archive/COMPLETED.md` in the same commit.

Legend: 🟠 later (named release) · 🟡 paid backlog (after income) · 🟨 partly done · 🔶 needs your confirmation · ⬜ not started · ⏸ deliberately deferred

---

## 1. Needs YOU

- [ ] **Upload the launch film to YouTube**: landscape `video/out/renyxera-film-v6-landscape-1080p.mp4` (when the render finishes) as a normal video, and `video/out/renyxera-film-v6-vertical.mp4` as a Short. Send me the YouTube video id; I set `NEXT_PUBLIC_PROMO_YT_ID` and the click-to-play film appears on the signed-out welcome and the Plans page.
- [ ] **Watch both film versions once** (laptop + phone) and send notes.
- [ ] **Instagram automation setup** (Professional account, Facebook Page, Meta developer app, long-lived token, GitHub secrets `IG_USER_ID` / `IG_ACCESS_TOKEN`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL`). The publisher, scheduler and `content/calendar.json` are built; I give click-by-click steps and wait for each confirmation. See `docs/SOCIAL_AUTOMATION_PLAYBOOK.md`.
- [ ] **Check Forge (GATE-level practice) with real accounts**: Free sees the upgrade prompt, Plus can make 5 sets a day, Pro has no set limit (migration 0039 is done).
- [ ] **Growth tasks** (yours): G-5 tracking sheet, C-3 value posts in the top 5 communities, V-1 record 3 Shorts, P-1 first partner offers (`docs/GROWTH_TASKS.md`).
- [ ] **Custom domain** (eu.org free route or a paid one) then business email (`docs/BUSINESS_EMAIL_STRATEGY.md`); first real payment has already arrived.
- [ ] **Google OAuth logo**: upload `public/brand/oauth-logo.png` in the Google console (cosmetic; full branding verification waits for the domain).
- [ ] **Check on a real signed-in phone**: payment, More sheet drag, onboarding Telegram step, shared aptitude questions with images, Civil Engineering practice.

## 2. Open work for me (in order)

- [ ] **Film v7 (re-cut after your feedback)**: 4 plain transitions (slide, push-up, wipe, drop-in), CTA now "Upgrade to Pro →", story line before the stats ("You're not the only one…"), new full-width vertical cut with a slow pan. Renders queued: vertical, 1080p landscape, then 4K (`video/out/renyxera-film-v7-*.mp4`). I check frames and hand over.
- [ ] **CS bank verification, last items**: wording of every CS paper 2017-2026 now checked against the official papers and fixed. 2017 Set 1 and 2018 keys re-verified against your uploaded PDFs (all 130 match). Still open: the 2018 figure check.
- [ ] **Study Materials programme** (separate paid product, not part of Plus/Pro): plan is in `docs/study-materials/`. Starts with Phase 0 (decisions and sample chapter) once you approve the plan. Reference notes and textbooks reviewed: `docs/study-materials/12-REFERENCE-LIBRARY-AND-DESIGN-RESEARCH.md` (the `notes/` folder is git-ignored).
- [ ] **Instagram walk-through** (see §1).
- [ ] **Film extras (optional)**: AI Mentor and Telegram takes; 30 s and 15 s cuts; 4:5 version; the clickable `/tour` demo.
- [ ] **Forge questions to Telegram**: when Forge questions are generated, post them to the matching branch channels (and groups). Not built yet.
- [ ] Flashcards for questions (later).
- [ ] Future: phone verification + reports via the Telegram bot first, then WhatsApp.
- [ ] PYQ extraction for the branches not yet started (only if you want more branches; CS, EC, EE, ME, CE, DA are done) and generated GATE-level question banks per branch after that.
- [ ] Not planned (decided): weekly league, PDF notes, study rooms. Revisit only if asked.
- [ ] Blocked on data: official marks-vs-rank tables for EC/EE/ME/CE/DA do not exist yet (official-only rule; revisit when the official report PDF is reachable).

---

## 3. Open rows by release (generated from the old checklist; done rows removed)


## ▶️ Execution order (what gets built next, top to bottom)

| # | Step | Modules | Why now |
|---|---|---|---|
| 13 | 🟠 **Later — Release 7:** Payments & entitlements, then anti-abuse/anti-sharing | 7A–7D | Needs 5B + 6B |
| 14 | 🟠 **Later — Releases 6D/6E + 8:** Practice bank, study materials, multi-branch data & pipeline | 6D, 6E, 8A–8C | Largest content effort; trough season (Mar–May) |
| 15 | 🟠 **Later — Releases 7E, 8B, 9:** Growth loops, revenue lines, depth, community, mobile | 7E, 8B, 9A–9E | After revenue exists |
| — | ✅ **Cloud sync (4I)** — live 28 Sep · R2 + CDN base URL 🟡 paid backlog | 4I, Platform | Depends on Postgres data |

## 🔴 Pending — needs YOUR action specifically

| # | Task | Status |
|---|---|---|
| 7 | **Google OAuth branding verification — logo only, fixable now** | Branding isn't verified, so the consent screen shows the raw Supabase domain instead of "RENYXERA" (cosmetic only — sign-in works). A square 512×512 lockup (mark + wordmark) exists at `public/brand/oauth-logo.png`; upload it in the Google console. |
| 7c | **Homepage URL ownership — cannot be completed on `workers.dev`** | OAuth branding needs a DNS-verified Domain property; `workers.dev`'s DNS isn't yours. Merged into the domain backlog item below. |

## 🟡 Backlog — deferred until there's a reason to spend money

| Parked item | Free alternative | Status |
|---|---|---|
| Custom domain (ads, OAuth branding, email) | **eu.org** free domain (real domain on the Public Suffix List; one volunteer approves, can take weeks) | Your call — apply at nic.eu.org |
| Branded confirmation / waitlist emails | **Brevo free SMTP** (300 emails/day, no card) plugged into Supabase custom SMTP; single verified sender address works without a domain, but may land in spam more often | Ready to set up with you |
| Phone OTP (Firebase Blaze) | **Email one-time code** (Supabase email OTP — free) instead of SMS | 🟠 can replace OTP whenever wanted |
| Cloudflare R2 for diagrams | Keep images as Worker static assets (free, 25 MB/file) or **GitHub + jsDelivr** CDN (free, no card) | 🟠 with 8A |
| Hotlink protection | Worker-first routing for `/images/*` (`run_worker_first`) checking the Referer — free | 🟠 with 8A |
| Play Store (₹2,100) | **Microsoft Store is free** for individual developers; publish the PWA with PWABuilder; Android users install the PWA from the browser | 🟠 Release 9D |

| # | Task | Why it's parked |
|---|---|---|
| 1 | **Custom-domain confirmation emails** (RENYXERA sender) | Needs an owned domain with DNS access (~$10-12/yr). Steps are ready (Resend → verify domain → API key → Supabase SMTP). |
| 2 | **Full Google OAuth branding verification** | Same blocker: needs DNS-level domain verification. One domain unlocks both. |
| 3 | **Firebase Blaze billing** (Mobile OTP past 10 SMS/day) | Only needed once OTP is promoted to real users (4C). |
| 5 | **Turn "Confirm email" back ON** (Supabase → Authentication → Sign In / Providers → Email) | Switched off 26 Sep 2026 because Supabase's free built-in email sender only allows a few emails per hour, which blocked sign-ups ("email rate limit exceeded"). Re-enable once there's revenue for a domain + custom SMTP (#1), so unverified addresses can't be used. No code change needed — the sign-up screen already falls back to "check your inbox" when confirmation is required. |
| 6 | **Cascading degree filter by exam** | When a second exam launches, the profile Degree picker should list only degrees eligible for the chosen exam. The data is already tagged (`lib/degrees.ts` → `exams`). |
| 7 | **Exam + branch selection in onboarding and profile** | Once multiple exams and branches are live, let users choose the exam (GATE, …) and the branch they're appearing for (dropdowns; student-ID branch code follows it). Until then everyone defaults to GATE CS & IT. Pairs with #6. |
| 8 | **Primary display ads: Google AdSense** (highest fill of relevant, education-category ads; ~₹20–80 per 1,000 Indian page views) — or Media.net / Ezoic as alternatives | All need an owned domain (ads.txt at the domain root). The `SponsorSlot` already reserves the space and handles adblock fallback, so switching on is one setting once approved. Free-domain route to try first: **eu.org** (free, but approval can take weeks). |
| 9 | **EthicalAds** (privacy-first, one text ad, ~$2.50 CPM) | Free to join but asks for ~50k page views/month on developer-focused sites — apply once traffic grows; already wired (`NEXT_PUBLIC_ETHICALADS_PUBLISHER`). |
| 4 | **Google Play developer account** (~₹2,100 one-time) | Optional; only for a Play Store listing (9D). The PWA already installs from the browser. |

## PLATFORM-WIDE — rules and controls that span every release

### Images & binary assets (§2.3 — P0 design rule)

| Task | Status |
|---|---|
| Single configurable CDN base URL (one env var) used to resolve every image path at render time | 🟠 **Later — Release 8A** *(lands with the image pipeline for new branches)* |
| Cloudflare R2 bucket provisioned and bound for the bulk / multi-branch diagram corpus | 🟡 **Backlog (paid)** — after income *(R2 needs a payment card on file even on the free tier)* |
| WebP/AVIF compression at ingest for new diagrams | 🟠 **Later — Release 8A** |
| Hotlink protection on images (CDN/R2) | 🟡 **Backlog (paid)** — after income *(needs R2 or an own domain)* |

### Security, CI & monitoring (§5.3, §5.4)

| Task | Status |
|---|---|
| Structured API logs + anomaly alerts | 🟠 **Later — Release 10 Admin Console** *(JSON event logs exist (e.g. `answer_cap_reached`); alerting surfaces in the admin console)* |
| Developer diagnostics view (errors, failed AI calls, IndexedDB/dataset failures) without user PII | 🟠 **Later — Release 10 Admin Console** |
| Accessibility pass: keyboard navigation, visible focus, contrast, reduced motion on every screen | 🟠 **Later — Release 6 (with the public pages)** *(reduced-motion + focus rings already ✅)* |

## RELEASE 4 — Foundation: Infrastructure, Data & Identity

### 4A · P0 · Cloudflare Migration

| Task | Status |
|---|---|
| R2 bucket provisioned; CDN base URL as a single env var | 🟡 **Backlog (paid)** — after income *(R2 card on file; the base-URL variable itself is free and can land with 8A)* |
| DNS, Web Analytics and Turnstile in the same Cloudflare account | 🟡 **Backlog (paid)** — after income *(Web Analytics + Turnstile ✅; DNS needs the custom domain)* |
| Vercel decommissioned | 🔶 *(kept dormant by decision — 🔴#5)* |
| Custom domain | 🟡 **Backlog (paid)** — after income |

### 4C · P1 · Authentication — Three Doors

| Task | Status |
|---|---|
| Mobile OTP wired into the app (Firebase ↔ Supabase third-party JWT bridge) | 🟡 **Backlog (paid)** — after income *(real use needs Firebase Blaze past 10 SMS/day)* |
| OTP abuse controls: per-phone/IP/device limits, Turnstile, resend cooldown, daily cap | 🟡 **Backlog (paid)** — after income *(ships with OTP)* |
| All three auth paths converge on one `profiles` row | 🟡 **Backlog (paid)** — after income *(Google + email ✅; the OTP path waits on Firebase Blaze)* |
| Anonymization backstop (support-request erasure → `status='anonymized'`, PII nulled, attempts kept) documented in the Privacy Policy and working | 🟠 **Later — Release 10 Admin Console** *(self-serve deletion ✅ today; support-driven anonymisation is an admin action)* |
| Firebase Blaze billing (past 10 SMS/day) | 🟡 **Backlog (paid)** — after income |

### 4E · P1 · Profile, Avatars & Goals Engine

| Task | Status |
|---|---|
| Target year weights recent-year PYQs higher as the exam nears | 🟠 **Later — Release 9A** *(part of the adaptive daily set)* |

### 4G · P0 · API Hardening

| Task | Status |
|---|---|
| Response size caps and request timeouts | 🟠 **Later — Release 10** *(body caps ✅; explicit upstream timeouts with the diagnostics work)* |
| Upstash Redis, user-ID-keyed limiting | 🟠 **Later — Release 7C** *(critical limits are already user-keyed in Postgres (AI quota, answer cap, one-attempt-per-mock); a shared limiter comes with anti-abuse)* |

### 4H · P1 · Multi-Branch Teaser & Waitlist

| Task | Status |
|---|---|
| Branch selector in onboarding | 🟠 **Later — Release 8** *(only CS & IT is live; backlog #7)* |
| Launch email to the waitlist when a branch goes live | 🟡 **Backlog (paid)** — after income *(needs custom-domain email)* |

### 4J · P0 · Calibration Data Foundation *(makes predictions accurate)*

| Task | Status |
|---|---|
| Marks ↔ AIR data (general + categories) for the last 3+ GATE CSE years, from official/cited sources | 🟠 **Later — March 2027 refresh** *(2023–2025 cited tables live; official rank table + category curves when GATE 2027 results publish)* |
| Official exam schedule per year; official syllabus per branch | 🟨 *(CS syllabus page ✅; official schedule page pending the GATE 2027 brochure; other branches with Release 8)* |
| Goals Engine, readiness predictor and AI Mentor read calibration data (show data vintage) | 🟠 **Later — Release 9E** *(Goals Engine ✅; AI Mentor/readiness wiring with the AI depth work)* |
| Opt-in anonymised scorecard submissions from users to improve the curve | 🟠 **Later — March 2027 refresh** *(needs results season)* |
| Annual recalibration each March after results | 🟠 **Later — recurring — every March** |

## RELEASE 5 — Exam Integrity

### 5D · P1 · Question Bank Protection

| Task | Status |
|---|---|
| Paginated/scoped delivery (no full-bank single request) | ⏸ *Deliberately deferred: the bank is public past GATE papers and must work offline as one file; the protected part — answer keys — is server-only, rate-limited and never in the bundle.* |
| Full-bank offline download as a paid entitlement | 🟠 **Later — Release 7A** *(entitlements)* |
| Hotlink protection on images | 🟡 **Backlog (paid)** — after income *(needs R2 or an own domain)* |
| Invisible per-account watermarking | 🟠 **Later — Release 7D** *(visible watermark on Downloads ✅; invisible marking with anti-sharing)* |

### 5E · P1 · Leaderboards & All-India Test Series

| Task | Status |
|---|---|
| Leaderboards (All-India/subject/college/friends), opt-in with privacy toggle | ✅ *(All-India Mock, weekly Practice, by subject, my college, Weekly Challenge; display choice anonymous / username / username + ID)* · friends board 🟠 **Later — Release 9C** |

## RELEASE 6 — Monetization I: Content Engine & Advertising

### 6A · P1 · Content & Programmatic SEO Engine

| Task | Status |
|---|---|
| Free tools (rank predictor, score / normalisation calculator, college predictor) | ✅ *(score calculator + rank predictor with live marks-vs-rank curve)* · college predictor 🟠 **Later — Release 8** *(needs official CCMT/COAP round-wise closing scores imported from their PDFs; no guessed cutoffs)* |

### 6B · P1 · Legal Pages & Ad Network Onboarding

| Task | Status |
|---|---|
| Professional legal review before real money moves | 🟡 **Backlog (paid)** — before Razorpay goes live |
| AdSense application (after 6A); Ezoic/Media.net fallbacks | 🟡 **Backlog** — needs the custom domain (eu.org requested 29 Sep, pending approval); EthicalAds/house promos live meanwhile |
| Direct sponsorships track | 🟠 **Later — after traffic** *(house promo slots already reserved in `SponsorSlot`)* |

### 6C · P1 · Ad Placement Architecture

| Task | Status |
|---|---|
| Consent management; non-personalised ads for under-18s | 🟠 **Later — when ads switch on** *(needs the approved ad account)* |
| A/B measurement of ad revenue vs paid conversion | 🟠 **Later — Release 7** *(needs payments)* |

### 6D · P1 · Practice Question Bank (beyond PYQs)

| Task | Status |
|---|---|
| Authoring pipeline: AI-assisted draft → mandatory expert review → publish | 🟠 **Later — Release 9 (content track)** *(needs a subject-expert reviewer)* |
| Original practice sets for every CSE topic (MCQ/MSQ/NAT, worked solutions) | 🟠 **Later — Release 9 (content track)** |
| Same taxonomy tags as PYQs + difficulty; clearly labelled "Practice" vs "PYQ" | 🟠 **Later — Release 9 (content track)** *(taxonomy ready: `lib/seo/syllabus.ts` units map to the bank tags)* |
| Difficulty recalibrated from real learner response data | 🟠 **Later — Release 9** *(needs response volume)* |
| Annual Trend Refresh each March: add new papers, recompute weights, rebalance, publish "What changed" | 🟠 **Recurring — every March** *(weightage pages recompute automatically from the bank)* |
| Yearly March refresh: new PYQs, ~10% new practice in trending topics, retire weak questions, recalibrate | 🟠 **Recurring — every March** |

### 6E · P1 · Study Materials

| Task | Status |
|---|---|
| One page per topic for every branch → section → subject → topic | 🟠 **Later — Release 8/9** *(CS subject + unit pages live via /topics and the syllabus; other branches with 8C)* |
| Each page linked to its PYQs, practice questions and prerequisite topics | 🟠 **Later — Release 9** *(PYQ links ✅; practice + prerequisites follow the practice bank)* |
| Original writing only, AI-draft → expert-review, sources cited | 🟠 **Later — Release 9 (content track)** |
| Public pages feed SEO (6A); deeper material in the paid tier (7A) | 🟠 **Later — Release 7/9** |
| Yearly review with the Trend Refresh / syllabus changes | 🟠 **Recurring — every March** |

## RELEASE 7 — Monetization II: Pay-Per-Exam & Anti-Misuse

### 7A · P1 · Tier & Entitlement Model

| Task | Status |
|---|---|
| Upgrade path on the results screen; warm upsell at quota limits; bundling nudge after 3 purchases | ✅ *(Plans page, results nudge, account menu, AI-quota message, locked sections with upgrade cards, Plus→Pro upgrade box · bundling nudge 🟠 at go-live)* |

### 7B · P1 · Payments — Razorpay

| Task | Status |
|---|---|
| Confirm the actually-applied UPI MDR on the account | 🟠 **Later — at payments go-live** *(check Razorpay dashboard → Settings → Pricing)* |
| Razorpay Subscriptions for the ₹99 add-on; invoicing/GST; dunning | 🟠 **Later — after go-live** *(plans are fixed-period, non-renewing for now; GST invoicing with a registered entity)* |

### 7C · P1 · Subscription & Purchase Abuse Prevention

| Task | Status |
|---|---|
| Purchase-then-scrape flagging | 🟠 **Later — Release 10 admin console** *(answer-fetch caps already limit scraping)* |
| Admin review dashboard | 🟠 **Later — Release 10 admin console** |

### 7D · P1 · Account-Sharing Prevention

| Task | Status |
|---|---|
| Escalation ladder (warn → re-auth → temp lock → manual review) | 🟨 *(warn (chooser) → sign-out of the old session → cooldown lock ✅; manual review 🟠 Release 10 admin console)* |

### 7E · P2 · Referral & Growth Loops

| Task | Status |
|---|---|
| Shareable achievement / result / AIR cards | 🟨 *(result + AIR cards ✅; streak/topic-mastery cards 🟠 Release 9)* |
| "Your GATE year" recap (Wrapped-style, shareable) after the exam | 🟠 **Later — after GATE 2027 (Feb 2027)** |
| "Study with me" focus-room link | 🟠 **Later — Release 9 (community)** |
| UTM capture + weekly metrics dashboard (acquisition by channel, D7/D30 retention, first-test-within-24h activation) | 🟨 *(first-touch UTM/referrer saved to the profile; `weekly_growth_metrics()` SQL (sign-ups by channel, 24 h activation, D7/D30) ✅; visual dashboard 🟠 Release 10 admin console)* |
| Welcome email series | 🟡 **Backlog** — needs custom SMTP (Brevo steps in FREE_ALTERNATIVES_GUIDE) |
| College ambassador programme | 🟠 **Later — after 1,000 users** *(referral links are the mechanism)* |
| Study-group invitations; testimonials for credits | 🟠 **Later — Release 9 (community)** |

## RELEASE 8 — Multi-Branch Expansion & Revenue Diversification

### 8A · P1 · Vision-Based PDF Extraction Pipeline

| Task | Status |
|---|---|
| Resumable, rate-limit-aware Gemini vision pipeline (ingest → extract → classify) | ⬜ |
| Diagram cropping → WebP/AVIF → R2 under deterministic relative paths | ⬜ |
| Answer-key extraction into `question_answers` (separate stage) | ⬜ |
| Validation dashboard (accept/edit/reject) + per-batch quality metrics | ⬜ |
| Human validation gate (≥95% accuracy) before a branch goes live | ⬜ |

### 8B · P2 · Revenue Diversification

| Task | Status |
|---|---|
| Direct sponsorships | ⬜ |
| Affiliate (books, courses, gadgets) | ⬜ |
| Digital products (formula sheets, notes, revision packs) | ⬜ |
| B2B / college licences | ⬜ |
| Sponsored content; job board; mentorship marketplace | ⬜ |

### 8C · P1 · Multi-Branch Data Acquisition

| Task | Status |
|---|---|
| Official papers (all years/sessions) + official final answer keys for DA, ECE, EE, ME, CE | 🟡 *(EC 2021–2026 done (390, tagged). EE 2021–2026 done (390, tagged, live in app). DA 2024–2026 done (195, tagged, live in app). ME 2021–2026 done (520 incl. both shifts of 2021/2022, tagged, live in app; migration 0031). CE 2021–2026 done (780, all 12 shifts, tagged, live in app; DB seeded, migration 0038). Rules: `docs/PYQ_EXTRACTION_HANDBOOK.md`)* |
| Official syllabus → topic taxonomy per branch | ⬜ |
| Calibration data per branch (4J) | ⬜ |
| Rights check recorded in the source ledger before ingestion | ⬜ |
| Extraction (8A) → answer-key match → tagging → human QA sample (≥98% first-pass accuracy) | ⬜ |
| Launch gate: PYQs + keys + taxonomy + starter practice (6D) + topic pages (6E) before a branch leaves "Coming Soon" | ⬜ |
| Branch scoping (after EC 2021–2026 is extracted and tagged): a user sees and can open only their own branch's content; other branches stay hidden | 🟨 *(designed: `docs/MULTI_BRANCH_DESIGN.md` — v2: one branch per account + one final change, guests switch freely; **built** (commit 969f3b1) — waiting for migration 0026, then push)* |
| Branch switching: the user can switch branch at any time and switch back; all progress, attempts, analytics and settings are kept per branch, and switching resumes where they left off with zero data loss | 🟨 *(designed: `docs/MULTI_BRANCH_DESIGN.md` — v2: one branch per account + one final change, guests switch freely; **built** (commit 969f3b1) — waiting for migration 0026, then push)* |

## RELEASE 9 — Product Depth & Controlled Community

| Module | Task | Status |
|---|---|---|
| 9A | Spaced repetition (SM-2/FSRS) over the mistakes store; daily adaptive set; per-topic mastery feeding 4E-2 | 🟨 *(weak-topic detection and a mastery model exist; SRS scheduling not built)* |
| 9B | Streak freeze days, XP & levels, daily goals, weekly challenges, study-time leaderboards | ⬜ |
| 9C | Moderated community (automated toxicity scoring, reputation gating, reporting) — opens only with moderation in place | ⬜ |
| 9D | Play Store listing via TWA/Capacitor (optional ₹2,100 — backlog #4) | ⬜ |
| 9E | AI study-plan generation, AI mocks from weakness profile, natural-language search, voice revision | 🟨 *(AI Mentor study-plan suggestions exist; the rest not built)* |

## RELEASE 10 — Admin Console *(deferred: start only after Releases 5–9 are done and the app is stable)*

| Module | Task | Status |
|---|---|---|
| 10A | **Strict admin login** — separate `/admin` sign-in; admins exist only in a server-side `admin_users` table seeded by SQL (no self sign-up, no way for any user to add themselves); mandatory 2FA (TOTP); IP/device allow-list option; short sessions; every admin action audited | ⬜ |
| 10B | **Roles & explicit privileges** — owner / admin / moderator / content editor / support / analyst; fine-grained permissions (e.g. `mocks.schedule`, `questions.edit`, `users.suspend`, `payments.refund`); only the owner grants or revokes; all checks enforced in Postgres (RLS + security-definer functions), not just the UI | ⬜ |
| 10C | **Mock & test-series management** — schedule/edit/cancel mocks from a calendar; build papers from the blueprint or by hand; preview the paper; change entry grace/results time; extend time for everyone on server trouble; publish/withhold results; re-rank | ⬜ |
| 10D | **Integrity review** — queue of flagged attempts with the signals; approve (rank) or keep excluded; notes; ban repeat offenders | ⬜ |
| 10E | **Question bank & content** — edit questions/options/answer keys with versioning and a second-person review; mark "marks to all"; upload images; manage practice questions (6D) and study materials (6E) | ⬜ |
| 10F | **User management** — search users; view profile, attempts, devices; suspend/unsuspend; sign out sessions; reset AI quota; export/delete on request (DPDP); impersonation-free support view | ⬜ |
| 10G | **Dashboards & insights** — signups/DAU/retention; mock turnout, score distribution, question difficulty and discrimination from real attempts; AI usage and cost vs quota; free-tier usage (Workers requests, DB size); errors (Sentry); waitlist by branch | ⬜ |
| 10H | **Monetization admin** — tiers, entitlements, coupons, refunds, payment reconciliation (after Release 7) | ⬜ |
| 10I | **Communications** — announcements/banners, email campaigns to waitlists, mock reminders | ⬜ |
| 10J | **Audit log & safety** — append-only log of every admin action (who, what, before/after); alerts on sensitive actions; data-access reports | ⬜ |
| 10K | **Settings & feature flags** — rate limits, AI daily limit, maintenance mode, kill switches | ⬜ |
| 10L | **AI pre-generation console** — start/stop the background run (`ai_pregen_control.enabled`), see cursor/pass/paused-until and last message; per-question status for HINT/SHORTCUT/EXPLAIN with date & time, model, attempts, errors (`ai_pregen_items`); what is cached vs pending; retry failed; view/regenerate a cached answer | ⬜ *(backend live 30 Sep: migration 0025 + `/api/ai/pregen` + 30-min Action)*|
| 10M | **AI responses & chats per user** — every AI request/response and AI Mentor chat per student (type, question, tokens, cached or live, time); search by user; flag bad answers; usage vs allowance | ⬜ *(needs an ai_request_log table — design with DPDP retention limits)* |

---

## Product rules (unchanged)

Never advertise "no login", guide visitors to sign in; no lifetime offer and no free trial; AI-assisted features sit in Pro; unfinished study blocks are asked about once a day, never moved silently; server time, not the device clock, for anything time-based; anything that costs money (beyond ₹100 one-time, never monthly) waits in the paid backlog until the app earns income.
