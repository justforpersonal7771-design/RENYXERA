# RENYXERA — Master checklist (the only tracker)

**Last updated:** 22 October 2026 · **Live:** https://gate.renyxera.workers.dev · **Repo:** `D:\0-UI\r2ma-stable` (push to `main` = deploy)
Detail of every shipped item: `archive/COMPLETED.md`. Context for a new session: `HANDOFF.md`, `CLAUDE.md`, `handover/MASTER_PROMPT.md`.

**How to read:** `- [x]` done · `- [ ]` open. Tags: **(you)** needs the owner · **(me)** Claude builds · 🔒 blocked by a decision · 🟡 costs money, waits for revenue · ⏸ on hold by decision · 💡 idea, not yet approved.
**Top priorities (owner, 22 Oct):** 1 Forge questions · 2 Study materials · 3 Monetisation · 4 Marketing.

---

## 0. Now — the next things, in order

- [ ] **(you)** Answer the blocking decisions in `docs/OPEN_DECISIONS_FOR_YOU.md`: **F1** Plus Forge limit, **S1** study-materials pricing, **S4** content reviewer (others have defaults).
- [ ] **(me)** Forge foundation without content (works before F1: migration, entitlement function, API, locked UI) → see §3A.
- [ ] **(me)** Forge authoring scripts + first 60 CS items, code-verified → you spot-check 10 of them.
- [ ] **(you)** Watch the v8 films (laptop + phone) → upload landscape to YouTube, vertical as Short + Instagram Reel → send me the YouTube video id.
- [ ] **(me)** Set `NEXT_PUBLIC_PROMO_YT_ID` and deploy the click-to-play film on the welcome + Plans pages.
- [ ] **(you)** Instagram setup `docs/instagram/01-SETUP.md`, then run the `social-check` workflow and tell me the result.
- [ ] **(me)** Study materials Phase 0 (after S1/S4): coverage matrix + reference chapter "Deadlock" → see §3B.
- [ ] **(me)** Verify in a browser: share-as-image card, markdown tables in questions, Forge practice-set gate with Free/Plus/Pro accounts.

---

## 1. Needs YOU

### Decisions (context + my defaults in `docs/OPEN_DECISIONS_FOR_YOU.md`)
- [ ] 🔒 **F1** How limited is Forge for Plus? (default: Daily Forge + filtered practice, no archive, no "X" hard items; Pro gets everything)
- [ ] **F2** Free sees worked solutions of Forge Mock questions after the mock? (default: yes, for one week)
- [ ] **F3** One Daily Forge question a day publicly on each branch channel? (default: yes)
- [ ] **F4** Forge Mock cadence (default: weekly for CS, fortnightly for other branches until buffers exist)
- [ ] **F5** Launch order CS → EC → EE, ME, CE, DA (default: yes)
- [ ] **F6** Keep the name "Forge" (default: yes)
- [ ] 🔒 **S1** Study-materials pricing model and price (default: one-time pass per branch; test ₹499–999)
- [ ] **S2** Branch order after CS (default: EC, EE, ME, CE, DA)
- [ ] **S3** Sources rule confirmed (learn from textbooks; coaching notes for layout/coverage only; never copy)
- [ ] 🔒 **S4** Who reviews accuracy (default: you spot-check CS; a paid tutor per subject later)
- [ ] **S5** English only at launch (default: yes)
- [ ] **S6** Build the "Deadlock" sample chapter first (default: yes)
- [ ] **S7** Study content in a private repo/bucket (default: yes)
- [ ] Business: refund policy for the study-materials pass; GST once revenue grows (talk to an accountant); content rights for the reference books in `notes/`

### Tasks
- [ ] Watch v8 films, upload to YouTube (landscape) + Shorts/Reels (vertical 1080), send the video id
- [ ] Instagram setup (`docs/instagram/01-SETUP.md`): Professional account, Meta app, tester, token, `IG_USER_ID` + `IG_ACCESS_TOKEN` secrets, run `social-check`
- [ ] Telegram Premium steps (`docs/telegram-premium/`): boosts (hub + CS), per-branch folders (send me 6 links), BotFather menu button + commands (tell me "BotFather done")
- [ ] Test Forge practice-set gate with real Free / Plus / Pro accounts
- [ ] Real-phone check: payment, More sheet drag, onboarding Telegram step, shared aptitude images, Civil practice
- [ ] Growth tasks: G-5 tracking sheet, C-3 value posts in top 5 communities, V-1 record 3 Shorts, P-1 first 3 partner offers, Q-1 post 5 Quora/Reddit answers (I draft)
- [ ] Confirm UPI MDR on the Razorpay account (Settings → Pricing)
- [ ] 🟡 Custom domain (eu.org free application pending since 29 Sep, or buy after revenue) → then business email, AdSense, OAuth branding
- [ ] Google OAuth logo upload: `public/brand/oauth-logo.png` in Google Cloud console (cosmetic)
- [ ] Tell me what to do with the working-tree changes of 22 Oct: deleted `docs/og-*.png` option sheets and zip files in `docs/` (commit the deletions? keep the zips out of git?)

---

## 2. Decisions log (made — do not re-open without the owner)

| Date | Decision |
|---|---|
| 17 Sep | ₹0 running budget; anything > ₹100 one-time or any monthly cost waits for revenue (🟡) |
| 25 Sep | No custom domain until the app earns revenue (eu.org free route tried) |
| 26 Sep | Email confirmation switched off (Supabase free mailer limits); re-enable with custom SMTP later |
| 27 Sep | Push to `main` auto-deploys after checks; commit as you go, push once per batch |
| 30 Sep | PYQs are transcribed by Claude from page images, never Gemini; tag during transcription |
| 6 Oct | Generated questions (Forge) after PYQs; CS first, then EC; mocks on hold until Forge exists |
| 9 Oct | Never advertise "no login"; nudge sign-in through value |
| 10 Oct | No subscriptions/auto-renew, no gift passes; coupons built but unused; Razorpay only (revisit Cashfree 1 Jan 2027) |
| Oct | Plans: Free · Plus ₹29/mo ₹249/yr · Pro ₹99/mo ₹799/yr · GATE season pass; no lifetime, no free trial |
| Oct | AI per day: Free 0 · Plus 75 · Pro 150; AI practice sets: Plus 5/day, Pro unlimited, Free none |
| 17 Oct | Study materials = separate paid product outside Plus/Pro; reference PDFs git-ignored, never copied |
| 17 Oct | Not planned: weekly league, PDF notes, study rooms |
| 18 Oct | No more branches for now (CS, EC, EE, ME, CE, DA live) |
| 18 Oct | Forge **questions** for Plus and Pro only; **Free gets Forge Mocks only** |
| 18 Oct | Telegram hub = updates/brand/mocks/offers only, never questions; branch channels `renyxera_gate_<code>` get the daily PYQ with the answer as a spoiler in the same post |
| 18 Oct | Film: 4K outputs only, 3–4 plain transitions, no overlapping text, CTA "Start now", tagline under the wordmark |
| 18 Oct | Social cards: Bricolage ExtraBold title, DM Serif branch name, Sora chips, JetBrains Mono URL, real wordmark + branch logos; custom share card = glass sender bar + Playfair italic tagline |
| 18 Oct | Personal details on shared cards only with explicit consent per field |
| — | One branch per account + one final change; guests switch freely |
| — | Keep Next.js (HMR works); never native date/time pickers |

---

## 3. Priority tracks

### 3A · Forge — original GATE-level questions and mocks (Release 6D, now P1)
Docs: `docs/FORGE_DESIGN.md`, `docs/FORGE_ENTITLEMENTS_AND_SETUP.md`.

**Done**
- [x] Full design (principles, archetypes, authoring pipeline, schema, storage, Daily Forge, mocks, calibration, surfaces, cost, rollout)
- [x] Access rules recorded (questions Plus/Pro, Free mocks only)
- [x] AI-generated practice sets gated by plan (migration 0039, `consume_practice_set`; Plus 5/day, Pro unlimited, Free none)

**Foundation (me, can start now)**
- [ ] Migration `00xx_forge.sql`: `forge_items` (public half, `release_at`, `status`, `mock_only`), `forge_answers` (private, no policies), `forge_item_stats`; mock reuse with embargo
- [ ] `canUseForgeQuestions(tier)` + Forge limits in `lib/billing/plans.ts` (Plus limit after 🔒F1)
- [ ] `/api/forge/items` (tier-checked) and a Forge branch in `/api/answers`
- [ ] UI: Daily Forge card (locked for Free with upgrade), setup source switch Past papers / Forge / Mixed, "Forge" badge, worked solution after submit, "Report an issue"
- [ ] Owner-only beta flag

**Content pipeline (me)**
- [ ] `scripts/forge/profile.py` (PYQ topic/type/difficulty profile per branch from tags)
- [ ] `scripts/forge/plan.py` (batch blueprint: topics × archetypes × difficulty, trend-weighted)
- [ ] Drafting format + `forge_validate.py` (schema, every number recomputed by code, distractor checks, no PYQ overlap)
- [ ] `scripts/forge/seed.mjs` and static `public/data/<CODE>/forge.json` (answer-free)
- [ ] First CS batch of 60, hand-checked; tune the review checklist
- [ ] CS buffer: 300 practice + 30 days of Daily Forge + 3 mocks (~800 items)

**Launch**
- [ ] Daily Forge live for CS (06:00 IST, 10 questions, streak + board)
- [ ] Forge Mocks for all tiers (build-mock script, Sunday 10:00 IST; cadence 🔒F4); resume mock scheduling
- [ ] Calibration loop: auto-flag items by p-value/discrimination after 50 attempts
- [ ] Analytics split PYQ vs Forge; per-archetype accuracy
- [ ] Telegram: one Daily Forge teaser per branch channel with spoiler answer (F3); hub announces mocks
- [ ] Roll out EC, then EE, ME, CE, DA (F5)

**Future**
- [ ] 💡 "X" harder-than-GATE items for Pro (≤15% of a mock)
- [ ] 💡 Subject mini-mocks mid-week (25–30 marks)
- [ ] 💡 Adaptive Forge sets built from each student's weak topics

### 3B · Study materials — separate paid product (Release 6E, now P2)
Docs: `docs/study-materials/00-README.md` … `12-REFERENCE-LIBRARY-AND-DESIGN-RESEARCH.md`.

**Done**
- [x] Vision, syllabus tree, content pipeline, format/rendering, diagrams, learning design, protection, product/pricing options, roadmap, edge cases, QA checklists, chapter template
- [x] Reference library reviewed (88 PDFs; design lessons; a textbook per CS subject); `notes/` git-ignored

**Phase 0 (after 🔒S1, 🔒S4)**
- [ ] Coverage matrix script (syllabus × PYQ weight × reference coverage) for CS
- [ ] Content format + renderer: equations, code, tables, diagrams/flows as data, callouts, check-yourself, linked PYQs
- [ ] Protection prototype: encrypted delivery, per-account watermark, copy/print shows blank, rate limits
- [ ] Reference chapter CS "Deadlock" end to end, reviewed (S4)
- [ ] Entitlement `study_pass_<branch>` + Razorpay checkout + receipts + refund text (S1)
- [ ] Your review of the sample → go/no-go

**Phase 1–3**
- [ ] CS pilot: three subjects
- [ ] Complete CS and launch (topic pages link to lessons; spaced-review flashcards from each lesson)
- [ ] Branch roll-out in S2 order

**Future**
- [ ] 💡 Per-chapter cheat-sheets and flashcards generated from lessons
- [ ] 💡 Interactive algorithm/protocol step-through visualisations
- [ ] 💡 Hindi version (S5)

### 3C · Monetisation (Releases 7 + 8B, now P3)

**Done**
- [x] Tiers and limits in one place (`lib/billing/plans.ts`), entitlements server-side
- [x] Razorpay live: instant verify, signed webhook, hourly reconcile, receipts, billing history, "I paid — check"
- [x] Season pass (exam-year picker, server-clock pricing), prorated Plus→Pro, plan-ending reminders
- [x] Coupons (built, unused), refund + billing-report scripts
- [x] Upgrade moments: Plans page, results nudge, AI-quota message, locked sections, Plus→Pro box
- [x] Referrals with AI-credit rewards; share cards; challenge links
- [x] Ad architecture (`SponsorSlot`, EthicalAds env-gated, house promos, no ads in exams/auth/checkout)

**Open**
- [ ] Forge locks as the main Free → Plus moment (with §3A)
- [ ] Study-materials pass checkout (with §3B)
- [ ] Season-pass campaign Dec–Feb (banner, Telegram hub, Instagram)
- [ ] Plans page refresh: Forge + study materials + comparison table + FAQ + testimonials
- [ ] Bundling nudge after 3 purchases
- [ ] 🟡 GST invoicing with a registered entity
- [ ] 🟡 AdSense / Media.net (needs domain); consent + non-personalised ads for under-18s when ads switch on
- [ ] EthicalAds application once traffic reaches ~50k views/month
- [ ] Affiliate links (books, calculators, gadgets) with disclosure (`NEXT_PUBLIC_AMAZON_TAG` exists)
- [ ] Direct sponsorships (house slots ready); college/B2B licences; digital packs (formula sheets, revision packs)
- [ ] A/B measurement: ad revenue vs paid conversion

### 3D · Marketing and growth (Release 7E + growth docs, now P4)

**Done**
- [x] Promo film v8: `video/out/renyxera-film-v8-4k.mp4`, `-vertical-1080.mp4` (31.6 MB, Instagram-ready), `-vertical-4k.mp4`
- [x] Click-to-play film component (needs the YouTube id)
- [x] Telegram: bot, hub updates (`telegram-hub.yml`), six branch channels with spoiler answers (`telegram-daily.yml`), topics group, folder link `https://t.me/addlist/fY_dvTl36FA3ZTQ1` — set up and working (you, 18 Oct)
- [x] Telegram multi-branch + SEO guide; Telegram Premium guide
- [x] Instagram publisher, scheduler, calendar, `social-check` workflow, setup docs
- [x] SEO: keyword titles, Organization/WebSite JSON-LD with `sameAs`, branch Telegram links + FAQ, footer social links, per-branch social cards (final style), sitemap, Search Console submitted
- [x] Growth docs: master plan, tasks, assets, marketing, content, influencer messages, social playbook
- [x] UTM capture + `weekly_growth_metrics()`

**Open (me)**
- [ ] Frame-check the vertical films before hand-over
- [ ] Telegram deep links `t.me/<bot>?start=cs`, branch commands, Mini App menu (after your BotFather step)
- [ ] Story-image generator for daily questions (1080×1920)
- [ ] Per-branch Telegram folder links on branch pages (after you send them)
- [ ] Share card also on results and question-share rows; streak/topic-mastery cards
- [ ] Instagram content calendar: 4 weeks of posts (PYQ of the day, topic tricks, weightage facts, mock reminders, feature demos)
- [ ] Growth tasks: R-4 time the guest flow, L-4 beat-my-score polish, S-4 titles/meta from Search Console, V-2 weekly "Topic ROI" posts, V-3 countdown calendar to 6 Feb 2027, P-2 10 free directories, P-3 college-club offer page
- [ ] "Your GATE year" recap after the exam (Feb 2027)
- [ ] College ambassador programme (after 1,000 users)
- [ ] 🟡 Welcome email series (needs custom SMTP/domain)

---

## 4. All releases and modules

### Release 1 — Core GATE OS ✅
- [x] Question bank + images + AST/MathJax rendering, IndexedDB, all test types, custom builder, timer, palette, MCQ/MSQ/NAT, bookmarks, notes, mistakes, revision, results, review, analytics, planner/calendar, command palette, fullscreen
- [ ] Verify markdown pipe tables render (table extractor exists: `lib/repository/transformers/table-extractor.ts`; check `GATE_CS_2025_AN_Q8`)

### Release 2 — Premium experience ✅
- [x] Design system, themes, dark-mode images, premium controls, motion, dashboard/analytics redesign
- [ ] UI/UX pass leftovers: review pages polish; Mistakes/Bookmarks/Revision image + code rendering audit

### Release 3 — AI intelligence ✅
- [x] AI Tutor, AI Mentor (8 coaches), hints/shortcuts/explanations, study plans, AI practice sets
- [x] Server-side Gemini, per-tier quota, cache, background pre-generation

### Release 4 — Foundation: infrastructure, data, identity
- [x] 4A Cloudflare Workers, CI/CD, rollback, PWA
- [x] 4B Postgres + RLS, private keys, seeding (all 6 branches)
- [x] 4C Email + Google auth, Turnstile, middleware protection, password change signs out others
- [x] 4D Guest mode with gates, guest → account migration
- [x] 4E Profile, avatars, username, achievements, goals engine, preferences, account section
- [x] 4F Per-user isolation, device sessions, idle expiry
- [x] 4G API hardening (zod, origin, rate limits, JWT, quotas, cache)
- [x] 4H Branch pages, waitlist (all branches now live)
- [x] 4I Cloud sync
- [x] 4J Calibration: cut-offs 2023–2026, normalisation, versioned files + source ledger
- [ ] 4J Official marks↔AIR table + category curves (March 2027 refresh)
- [ ] 4J Official schedule page from the GATE 2027 brochure
- [ ] 4J Readiness predictor / AI Mentor read calibration with data vintage (with 9E)
- [ ] 4J Opt-in anonymised scorecards (March 2027)
- [ ] 4E Target year weights recent PYQs higher (with 9A)
- [ ] 4G Explicit upstream timeouts (Release 10); shared limiter (Release 7C)
- [ ] 4C Support-driven anonymisation (Release 10)
- [ ] Exam + branch selection when a second exam launches; degree filter by exam
- [ ] 🟡 4A Custom domain, DNS, R2 + CDN base URL
- [ ] 🟡 4C Phone OTP (Firebase Blaze) + OTP abuse controls (or free email-OTP alternative)
- [ ] 🟡 Re-enable email confirmation with custom SMTP

### Release 5 — Exam integrity ✅
- [x] 5A Answer-key withholding, Graded vs Practice badge, pending evaluation offline
- [x] 5B Server-authoritative grading, attempt tokens, grace windows, 100-attempt regression
- [x] 5C Integrity signals, disclosure, fair exclusion, exit warnings + auto-submit on the 5th exit
- [x] 5D Answer-fetch caps, ToS anti-scraping, visible watermark on downloads
- [x] 5E All-India mock engine, leaderboards with privacy, streaks, weekly challenge, topic ladders, result cards
- [ ] 5D Invisible per-account watermarking (with 7D)
- [ ] 5D Full-bank offline download as a paid entitlement
- [ ] 5E Friends leaderboard (with 9C)
- [ ] ⏸ New PYQ mock scheduling (resumes as Forge Mocks)

### Release 6 — Monetisation I: content engine and ads
- [x] 6A Public SEO engine: PYQ pages for every branch, hubs, syllabus, tools, articles, GATE updates, technical SEO
- [x] 6B Legal pages (privacy, terms, cookies, refunds, disclaimer, contact)
- [x] 6C Ad slot architecture
- [ ] 6A College predictor (needs official CCMT/COAP closing scores)
- [ ] 6A Branch score/rank predictors (official per-branch data first)
- [ ] 🟡 6B Professional legal review
- [ ] 6D → see **3A Forge**
- [ ] 6E → see **3B Study materials**
- [ ] Recurring every March: new papers, weight recompute, trend refresh, "What changed" page

### Release 7 — Monetisation II: payments and anti-misuse
- [x] 7A Tiers and upgrade paths
- [x] 7B Razorpay live, season pass, coupons, receipts
- [x] 7D Device chooser, old-session sign-out, cooldown lock
- [x] 7E UTM + growth metrics SQL, referrals, result/AIR share cards, consented share-as-image card
- [ ] 7C Purchase-then-scrape flagging + admin review (Release 10)
- [ ] 7D Manual review step (Release 10)
- [ ] 7E Streak/topic-mastery cards, "study with me" link, study-group invites, testimonials for credits
- [ ] 🟡 7B GST invoicing

### Release 8 — Multi-branch and revenue diversification
- [x] 8C PYQs + keys + tags for EC, EE, ME, CE, DA (live); CS verified 2017–2026 (keys, wording, figures)
- [x] 8C Branch scoping and switching (one branch + one final change)
- [x] Shared aptitude/maths across branches
- [ ] 8C Calibration data per branch (4J) when official data is reachable
- [ ] 💡 8C 2017–2020 papers for non-CS branches
- [ ] 8A Image pipeline: WebP/AVIF at ingest, single CDN base URL (🟡 R2 later)
- [ ] 8B Sponsorships, affiliates, digital products, B2B licences (see 3C)
- [ ] ⏸ More branches (decision 18 Oct)
- [ ] Blocked on data: official marks-vs-rank tables for EC/EE/ME/CE/DA

### Release 9 — Product depth and community
- [ ] 9A Spaced repetition (FSRS) over mistakes; daily adaptive set; per-topic mastery feeding goals
- [ ] 9B Streak freeze, XP and levels, daily goals, study-time boards
- [ ] 9C Moderated community (toxicity scoring, reputation, reporting)
- [ ] 9D App listing: Microsoft Store (free, PWABuilder); 🟡 Play Store
- [ ] 9E AI study-plan generation from weakness, AI mocks, natural-language search, voice revision
- [ ] Flashcards for questions
- [ ] Phone verification + weekly reports via the Telegram bot, then 🟡 WhatsApp

### Release 10 — Admin console (after the app is stable)
- [ ] 10A Strict admin login (separate, 2FA, allow-list, audited)
- [ ] 10B Roles and permissions enforced in Postgres
- [ ] 10C Mock management (calendar, papers, timing, publish results)
- [ ] 10D Integrity review queue
- [ ] 10E Question bank + Forge + study-material editing with versioning and second review
- [ ] 10F User management (DPDP export/delete, suspend, sessions, quotas)
- [ ] 10G Dashboards (sign-ups, retention, mock turnout, item stats, AI usage, free-tier usage, errors)
- [ ] 10H Money admin (tiers, coupons, refunds, reconciliation)
- [ ] 10I Communications (banners, emails, reminders)
- [ ] 10J Audit log · 10K settings and kill switches · 10L AI pre-generation console · 10M AI request logs (DPDP retention)

### Platform-wide
- [x] Sentry, Web Analytics, keep-alive, encrypted backups + restore drill, CWV budget, E2E smoke in CI, migration strategy
- [x] Handover pack: `HANDOFF.md`, `CLAUDE.md`, `handover/` (master prompt, setup, memory) — 22 Oct
- [ ] Accessibility pass on every screen (keyboard, focus, contrast; reduced motion and focus rings done)
- [ ] Structured API logs + anomaly alerts; developer diagnostics view (Release 10)
- [ ] 🟡 Hotlink protection for images (R2 or domain)

---

## 5. Paid backlog 🟡 (only after revenue; free alternative noted)

- [ ] Custom domain — free try: eu.org (pending)
- [ ] Branded emails / welcome series — free try: Brevo free SMTP
- [ ] Phone OTP (Firebase Blaze) — free alternative: email one-time code
- [ ] Cloudflare R2 for images — free: Worker static assets or GitHub + jsDelivr
- [ ] Play Store (₹2,100) — free: Microsoft Store via PWABuilder
- [ ] Professional legal review; GST registration and invoicing

---

## 6. Bugs and tech debt

- [ ] Verify markdown tables in question text render as tables
- [ ] `components/exam/exam-timer.tsx`: hard-coded 3 h fallback when no draft
- [ ] Remove dead code (`design-system/*` if still present, duplicate `PersonalNotesDrawer`)
- [ ] Rename `data/Aggregated_Output.json` to `data/pyq/CS/gate_cs_pyqs.json` (allowed; update loaders and scripts)
- [ ] Share card not browser-tested; review the Playfair "Q" swash on the custom card tagline

---

## 7. Feature ideas 💡 (proposed, not approved — reply "approve 3, 16…")

**Learning and practice**
- [ ] 1. Mistake DNA — classify each wrong answer (concept gap, calculation slip, misread, time pressure); mix per subject
- [ ] 2. Syllabus mastery heatmap — every subtopic coloured by mastery with PYQ weight; tap to practise
- [ ] 3. Exam-day rehearsal — official instructions screen, 3-hour run, "what to change" report
- [ ] 4. Time coach — your time per question vs successful students; flags slow 1-mark questions
- [ ] 5. Smart revision playlists — 15/30/60-minute mixes of due mistakes, weak topics, Forge items
- [ ] 6. Formula and concept flashcards with FSRS spacing (from study materials)
- [ ] 7. "Why this option is wrong" for every distractor
- [ ] 8. Moderated doubt threads per question
- [ ] 9. Peer benchmark per question ("students at your target rank: 2:10, 82%")
- [ ] 10. Audio revision of key points for commutes

**Motivation and community**
- [ ] 11. Streak calendar with freeze tokens earned from mocks
- [ ] 12. Study-with-me focus timer shared by link (no chat)
- [ ] 13. Milestone cards (100 questions, first 50+ mock, topic mastered)
- [ ] 14. Weekly Telegram mentor check-in with one-tap re-plan

**Monetisation**
- [ ] 15. Forge Mock detailed report unlock (Free: score/rank; Plus: topic analysis)
- [ ] 16. "Target pack" bundle per rank band (plan + Forge + study materials)
- [ ] 17. College/teacher dashboard (B2B)
- [ ] 18. Scholarship coupons for top Free mock performers
- [ ] 19. Exam-season gift pass (re-open the 10 Oct decision only if you want)

**Marketing and growth**
- [ ] 20. Public weekly Forge Mock leaderboard pages (SEO + share)
- [ ] 21. "Question of the day" embed widget for blogs/college sites (backlinks)
- [ ] 22. Public "Topic ROI" data page (marks per study hour by topic)
- [ ] 23. Referral leaderboard with monthly rewards
- [ ] 24. Instagram carousel generator from PYQ explanations
- [ ] 25. YouTube Shorts generator from Remotion templates (question → 30 s solution)

**UI/UX**
- [ ] 26. First test in under 60 seconds ("Start a 10-question warm-up" on first visit)
- [ ] 27. Global search (questions, topics, tools, pages) with a keyboard shortcut
- [ ] 28. Dashboard personalisation (reorder/hide cards)
- [ ] 29. Mobile exam layout: bottom-sheet palette, bigger tap targets, landscape mode
- [ ] 30. Per-subject offline downloads (paid)
- [ ] 31. Dark-mode tuning for white-background diagrams
- [ ] 32. Skeleton loaders everywhere; optimistic bookmarks/notes
- [ ] 33. Accessibility: screen-reader maths labels, high-contrast theme, dyslexia-friendly font
- [ ] 34. In-app "What's new" changelog
- [ ] 35. One upgrade sheet that previews exactly what the locked feature gives

**Platform and operations**
- [ ] 36. Admin-lite page before Release 10 (mocks, coupons, Forge review queue, reported questions)
- [ ] 37. Feature-flags table for gradual rollouts
- [ ] 38. Free status page (site, AI, payments)
- [ ] 39. Automated weekly growth report to your Telegram (sign-ups by channel, activation, revenue)

---

## 8. Product rules (always)

Never advertise "no login"; show value, then gentle gates. No lifetime offers, no free trials, no never-charged "was" prices. Free tier: no AI calls, no Forge questions (Forge Mocks only). Server time for anything time-based. Unfinished study blocks are asked about once a day, never moved silently. Official sources only; estimates labelled. Personal data on shares only with consent. Anything costing money waits in the paid backlog until revenue.
