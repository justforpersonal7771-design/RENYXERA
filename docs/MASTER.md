# RENYXERA: the master document (product, work done, open work, future)

*One integrated view of everything. Written 6 Nov 2026 from the checklist, roadmap, technical reference, handover and the work of the last weeks. It summarises and links; the detail lives in the linked files. When something changes, update the owner's tracker ([checklist](../checklist.md)) first, then this file.*

[Docs index](README.md) · [Open items, grouped](open-work/OPEN-ITEMS-2026-11-06.md) · [Checklist](../checklist.md) · [Handoff](../HANDOFF.md) · [Rules for Claude](../CLAUDE.md)

---

## 1. What RENYXERA is
- **A GATE exam-preparation web app for Indian engineering students** ("A new ERA of intelligent learning"; old internal name GATE OS). Live at https://gate.renyxera.workers.dev (no custom domain until revenue). Owner: Adil Awais Khan, a non-developer product owner; Claude does the engineering in local sessions.
- **Core loop:** practise official past papers in an exam-identical interface, get graded on the server with GATE rules, review what went wrong, revise from mistakes, track progress to a goal rank, get help from the AI Mentor and Tutor, play a weekly All-India mock, compete with friends in Battles.
- **Papers (branches) live:** CS, EC, EE, ME, CE, DA, about 3,250 official questions (2017 to 2026); the CS bank is fully verified against the official papers. No more branches for now (owner decision, 18 Oct).
- **Exam date:** GATE 2027 starts 6 Feb 2027 (official IIT Madras schedule 6 to 21 Feb); every countdown reads one source.
- **Money model:** Free, Plus (₹29 a month, ₹249 a year), Pro (₹99 a month, ₹799 a year), a season pass, and a separate paid study-materials product (subject packs plus bundles). Razorpay is live; no auto-renew, no lifetime plans, no free trial. Budget is ₹0 until revenue ([zero-budget rule](#12-standing-rules-and-preferences)).
- **Revenue so far:** two live test payments of ₹29, both the owner's. No paying customers yet; the whole business case rests on getting traffic into the funnel (section 6).

## 2. Where to find things

| I want to | Go to |
|---|---|
| See what is open, in priority order | [OPEN-ITEMS-2026-11-06](open-work/OPEN-ITEMS-2026-11-06.md) and the [checklist](../checklist.md) |
| Know which decisions are waiting on the owner | [OPEN_DECISIONS_FOR_YOU](open-work/OPEN_DECISIONS_FOR_YOU.md) |
| Read one release's plan | [roadmap index](roadmap/00-README.md) (R9 to R30) |
| Understand the system | [TECHNICAL_REFERENCE](engineering/TECHNICAL_REFERENCE.md), [ARCHITECTURE_UPDATE](engineering/ARCHITECTURE_UPDATE.md) |
| Work on Forge questions | [forge folder](forge/README.md) |
| Work on marketing and channels | [growth folder](growth/README.md) |
| Start a new session cold | [HANDOFF](../HANDOFF.md), [CLAUDE](../CLAUDE.md), [handover/MASTER_PROMPT](../handover/MASTER_PROMPT.md) |
| See finished work and old reviews | [done folder](done/README.md) |

## 3. The product, area by area (what exists)

**Practise and exam**
- Official PYQ banks with images, maths (MathJax) and code; exam-identical session (timer with flowing line, palette, mark and next, save and next, submit confirm), server-graded results, review, mistakes, bookmarks, notes, revision, Flashcards (spaced repetition), checkpoint, diagnostics, All-India mocks on a schedule, challenge links.
- **Test Centre** (one hub for Build a test, Practice, Mocks, History): sources GATE PYQs, Forge, Spark (AI-generated), Blend (shares of each).
- **Forge**: original GATE-level questions, Plus/Pro (Free sees a fixed taster of 10 plus Forge Mocks). CS has 329 live questions after the 6 Nov audit and fixes (see [Forge audit](forge/FORGE_AUDIT_2026-11-06.md), [generator workflow](forge/FORGE_GENERATOR_LOCAL.md), [design](forge/FORGE_DESIGN.md)).
- **Study materials** (planned paid product): programme in [study-materials](study-materials/00-README.md); Free taster is the Deadlock chapter preview.

**Learn and coach**
- **AI Mentor** (chat like ChatGPT/Gemini: history, groups, search, edit and versions, stop, sync across devices; goals, roadmap by days left, daily check-in, focus timer, Spark questions), **AI Tutor** (explain a question, from mistakes and bookmarks), AI practice sets, tiered AI quota (Free 0, Plus 75, Pro 150 a day; tokens and top-up packs designed).
- **Planner and analytics:** study planner, calendar and to-do panels, goals slider, heatmap, topic table, Mistake DNA and coach insights, readiness calibration from official data.

**Compete and engage**
- **Battles and the Arena** (R19, R29): challenge links, friends with presence, in-app invites, Arena Points and Elo, weekly and all-time leaderboard, live lobby with a shared countdown, rematch. Seasons, badges and per-question speed scoring are open.
- Streaks and achievements, referral link (both sides get 7 days of Pro when the friend finishes a first test), result and challenge share cards, the invite nudge at any score.

**Design and shell**
- Floating navbar island, pastel card system ([design system](design/DESIGN-SYSTEM.md)), light and dark, **Design Studio** with 5 Pro Looks live (the other ten on hold; [Looks spec](design/LOOKS-SPEC.md)), IST everywhere, PWA with manifest and offline basics.

**Public site and growth surfaces**
- Branch landing pages, PYQ pages per paper and question, syllabus pages, topic pages, GATE 2027 changes, cut-off tools, score calculator, study-plan tool, "How we compare", legal pages (refund policy rewritten 31 Oct).
- Tagged-link builder and funnel report, week 1 content pack, Telegram hub plus six branch channels, Instagram publisher (needs owner setup).

**Operations**
- `/admin` admin-lite (Overview, Funnel, Links) for one registered admin; full console (R10) is specified and on hold.

## 4. How it is built
- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4, `motion`, Zustand, IndexedDB (`idb`, local-first); Supabase (Postgres with RLS, auth, hand-applied migrations 0001 to 0052); Gemini and OpenRouter free models (server only); Cloudflare Workers via OpenNext; Razorpay; Sentry; GitHub Actions; Remotion for the film. Details: [technical reference](engineering/TECHNICAL_REFERENCE.md).
- **Three trust zones:** browser (UI, IndexedDB, answer-free static bank) · Worker (`/api/*`, service role, grading, AI, rate limits) · Postgres (accounts, private answer keys, attempts, mocks, billing, Telegram, events, Forge, Battles).
- **Deploy:** push to `main` runs CI (type-check, lint, build, security, grading and data checks) then deploys; rapid pushes cancel earlier runs, so the live build can lag by a few minutes. Rollback with `npx wrangler rollback`.
- **Automations (GitHub Actions):** CI and deploy, database backup, keep-alive, AI pre-generation, Forge nightly, billing reconcile, Telegram daily, hub, dispatch and setup, social publish and check.
- **Forge pipeline (local Claude session):** plan slots, author specs with the kit (answers computed by code), build the batch (ingest checks: TeX, key letter, dedupe, verify code, validator against official papers), owner seeds.
- **Quality gates in code:** check scripts for security, grading, goals, calibration, RLS and RPC access, performance budgets, credits, chat trees.

## 5. Decisions already made (do not reopen without the owner)
₹0 budget; no custom domain until revenue; push to `main` deploys, commit as you go and push per batch; PYQs transcribed by Claude, never Gemini; Forge after PYQs, CS first; never advertise "no login" and nudge sign-in indirectly; no auto-renew, no gift passes, Razorpay only; plans and prices as in section 1; refunds only for glitches and errors by email; Forge questions Plus/Pro only (Plus 15 a day, Pro unlimited); study materials are a separate paid product with owner accuracy review; one branch per account with one final change; keep Next.js; no native date or time pickers; IST only; full-width screens; tease, don't block for paid features; Claude work stays local (no web or API Claude); DB writes, migrations and seeding are owner-run; never use the Claude-account email anywhere; the admin console waits for the non-negotiable set. The full dated list is in the [checklist](../checklist.md) section 2.

## 6. Growth and the funnel (the revenue question)
- **Numbers (30 days to 6 Nov):** about 1,200 visitors, 86 took a test (7%), 1 sign-in recorded since tracking started, 0 real paying customers; nearly all traffic is untagged "direct".
- **What was built to fix it:** event tracking from visit to payment ([migration 0051](../supabase/migrations/0051_funnel_events.sql), `scripts/growth-metrics.mjs`), the `/admin` Funnel and Links tabs, a "Try a quick sample test" button beside sign-in, the invite nudge at any score, the [week 1 content pack](growth/marketing/WEEK-01-CONTENT-PACK.md).
- **Channels:** Telegram hub plus six branch channels posting one PYQ a day ([setup](growth/TELEGRAM_SETUP_AND_PROMOTION.md), [multi-branch and SEO](growth/TELEGRAM_MULTI_BRANCH_AND_SEO.md)), Instagram ([setup](growth/instagram/01-SETUP.md), pending), YouTube (not built; API upload needs Google's audit), film v8 ([growth plan](growth/GROWTH_MASTER_PLAN.md), [automation playbook](growth/SOCIAL_AUTOMATION_PLAYBOOK.md)).
- **Rules:** opt-in only, no scraping of logged-in platforms, reply do not blast, tag every link with `utm_source`, [toolkit review](growth/marketing/GROWTH-TOOLKIT.md).

## 7. What is done (by release)
- **R1 to R5** core app, premium UI, AI, foundation (Cloudflare, CI, Postgres and RLS, auth, guest mode, devices, cloud sync, calibration), exam integrity. [History](done/archive/COMPLETED.md).
- **R6 to R8** SEO engine and legal pages, payments and anti-misuse, six branches. **R13** (live parts) tiers, Razorpay, season pass, prorated upgrade, coupons, receipts, referrals.
- **R11 Forge** foundation: tables, grading, hub, generator, kit, CS 329 questions live. **R15 and R28** performance wins (caching, WebP, deferred chunks, paging). **R16** security: dependencies, headers (CSP report-only), sanitising, RLS probe, GitHub protections.
- **R18** UI refresh in part (pastel system, shell, many screens). **R19, R21** Battles and AI Mentor built ([R19](done/roadmap/R19-BATTLES.md), [R21](done/roadmap/R21-AI-MENTOR.md)). **R22** Test Centre routes merged. **R26** Design Studio with 5 Pro Looks. **R29** Battles as a game, steps 1 to 4. **R30** admin-lite ([record](done/roadmap/R30-ADMIN-CONSOLE.md)).
- **Content:** PYQs for six branches, CS verified; calibration 2023 to 2026; 329 Forge CS questions (b007 to b011 seeded 3 to 6 Nov).

## 8. What is open (summary; the full grouped list is [open-work/OPEN-ITEMS](open-work/OPEN-ITEMS-2026-11-06.md))
**Non-negotiable set (proposal; nothing else, including the admin console, starts first)**
1. N1 get real traffic into the funnel (post with tagged links, read the report weekly) · N2 first-visit conversion · N3 upgrade moments that convert (R13-A1 to A6).
2. N4 payment trust (refund test, UPI fee, billing report, legal review) · N5 privacy and consent (DPDP) · N6 two-factor on every owner account and a key-rotation runbook · N7 remaining platform security (enforce CSP, shared rate limits, Turnstile on forms, webhook replay, security.txt, Sentry alerts, restore drill).
3. N8 Forge to the CS target plus the Forge launch pieces · N9 Study materials Phase 0 · N10 core screens correct and single-screen · N11 accuracy of what we sell (March 2027 refresh).

**Needs the owner:** decisions (F2 to F6, S3, S5 to S7, Battles seasons, Looks, catalogue approvals), accounts and security (2FA, Razorpay fee check, Partner Center, OAuth logo, Instagram, Telegram Premium), marketing posts, real-device tests, reading b010 and b011.

**Everything else by release:** see section 3 of the [open-items list](open-work/OPEN-ITEMS-2026-11-06.md) (Forge, Study, Monetisation, Marketing, Performance, Security, Microsoft Store, UI and Looks, Mentor, Battles, Solutions, R9, R10, older release leftovers), plus bugs and tech debt, parked items and ideas.

## 9. The future: plan by horizon
- **Next 2 weeks (now):** finish the non-negotiable set in this order: tagged posting and funnel reading (N1, N2), upgrade moments (N3), privacy and consent (N5), two-factor and runbook (N6), CSP enforcement and shared limits (N7), results screen and single-screen fixes (N10); keep Forge growing toward 800 CS with real Forge-grade items; weekly content pack 2.
- **Before the exam season (Dec to Jan):** Forge launch pieces (Daily Forge, Forge Mocks, calibration loop, Telegram teasers), Study materials Phase 0 and the pilot subjects, season-pass campaign December to exam, Plans page refresh, AI Mentor streaming and weak-topic memory, Battles seasons and badges, Microsoft Store package.
- **GATE 2027 (6 to 21 Feb):** live pages, countdown campaigns, mock reminders, last-month revision flows, support readiness.
- **After the exam (Mar 2027):** official report and keys refresh (marks to rank, category curves, per-branch data, new papers), recurring March refresh, branch predictors, "Your GATE year" recap.
- **After revenue:** custom domain and branded email, GST, ads, Play Store, legal review, paid Supabase features, then the admin console (R10 spec), other branches' Forge, verbal and picture Aptitude, Arena rooms and the remaining Looks.

## 10. Risks and dependencies
- No customers yet: every plan depends on traffic; a single channel mix is untested.
- Free-tier ceilings (Gemini and OpenRouter quota, GitHub Actions minutes, Supabase size) throttle AI solutions and generation; AI pre-generation produced about 300 items in 8 days.
- Single owner for accounts: no 2FA on some, no key-rotation runbook yet.
- Content accuracy is the product: Forge keys are computed by code, PYQs verified, but study lessons need the owner's review.
- Enumeration-heavy Forge X questions are labelled challenge material; keep them out of timed mocks.
- Deploy lag when pushing often; admin console on hold; the repo account may move (renyxera@gmail.com).

## 11. Operating runbook (short)
- **Run and check:** `npm run dev`; `npx tsc --noEmit -p .`; `npm run lint`; build `npm run build`; checks `npm run check:security|check:grading|check:rls|check:rpc|check:perf`. Funnel report: `node scripts/growth-metrics.mjs`.
- **Migrations:** write `supabase/migrations/NNNN_*.sql`, the owner runs it in the SQL editor, then `npm run schema:build`.
- **Forge batch:** plan (`generate.mjs --plan`, `replan_by_weight.py`), author parts (`author_bNNN_pN.py`), `build_batch.py CS bNNN`, owner seeds with `seed.mjs`; see [generator workflow](forge/FORGE_GENERATOR_LOCAL.md).
- **Telegram and social:** `node scripts/telegram-daily.mjs --dry-run`, `node scripts/social-publish.mjs --check`, workflows listed in section 4.
- **Rollback:** `npx wrangler deployments list` then `npx wrangler rollback <id>`.

## 12. Standing rules and preferences
- **Owner:** plain, short updates; say clearly what was done, verified or not done; click-by-click steps for anything the owner must do, then wait; update the checklist and list next items every turn; test every UI check on desktop and phone in light and dark; research before UI changes; full-width screens; IST only; no artifacts published; Claude work is local only.
- **Product:** never advertise "no login"; tease, do not block; no lifetime offers or fake "was" prices; official sources only, estimates labelled with vintage; consent for personal data on shares; performance and security changes never reduce quality; anything costing money waits for revenue (zero-budget constraint).
- **Engineering:** TypeScript strict, Zod on every API body, secrets server-side only, answer keys never in static data, tiers only in `lib/billing/plans.ts`, hand-applied migrations with RLS, preserve CRLF or LF per file, never write backslash content through shell heredocs (use the file tools), revert `tsconfig.tsbuildinfo` before commits.

## 13. Document map
- **Open work:** [OPEN-ITEMS](open-work/OPEN-ITEMS-2026-11-06.md), [OPEN_DECISIONS](open-work/OPEN_DECISIONS_FOR_YOU.md), [FEATURE-IDEAS](open-work/FEATURE-IDEAS.md).
- **Roadmap:** [index](roadmap/00-README.md), [R10 admin spec](roadmap/R10-ADMIN-SPEC.md), [R11 Forge](roadmap/R11-FORGE.md), [R12 Study](roadmap/R12-STUDY-MATERIALS.md), [R13 Monetisation](roadmap/R13-MONETISATION.md), [R14 Marketing](roadmap/R14-MARKETING-GROWTH.md), [R15 Performance](roadmap/R15-PERFORMANCE.md), [R16 Security](roadmap/R16-SECURITY.md), [R17 Microsoft Store](roadmap/R17-MICROSOFT-STORE.md), [R18 UI](roadmap/R18-UI-REFRESH.md), [R20 Solutions](roadmap/R20-SOLUTIONS.md), [R22 Test Centre](roadmap/R22-TEST-CENTRE.md), [R24 Mobile app](roadmap/R24-MOBILE-APP.md), [R25 Arena](roadmap/R25-BATTLE-ARENA.md), [R26 Design Studio](roadmap/R26-DESIGN-STUDIO.md), [R27 Mentor features](roadmap/R27-MENTOR-CHAT-FEATURES.md), [R28 Performance toolkit](roadmap/R28-PERFORMANCE-TOOLKIT.md), [R29 Battles as a game](roadmap/R29-BATTLES-AS-A-GAME.md), [feature catalogue](roadmap/FEATURES.md).
- **Forge:** [design](forge/FORGE_DESIGN.md), [access rules](forge/FORGE_ENTITLEMENTS_AND_SETUP.md), [generator workflow](forge/FORGE_GENERATOR_LOCAL.md), [audit](forge/FORGE_AUDIT_2026-11-06.md), [PYQ handbook](forge/PYQ_EXTRACTION_HANDBOOK.md).
- **Growth:** [index](growth/README.md), [master plan](growth/GROWTH_MASTER_PLAN.md), [tasks](growth/GROWTH_TASKS.md), [assets](growth/GROWTH_ASSETS.md), [marketing strategy](growth/MARKETING_STRATEGY.md), [content strategy](growth/CONTENT_STRATEGY.md), [Telegram](growth/TELEGRAM_SETUP_AND_PROMOTION.md), [Instagram](growth/instagram/README.md), [Telegram Premium](growth/telegram-premium/README.md), [week 1 pack](growth/marketing/WEEK-01-CONTENT-PACK.md).
- **Engineering and business:** [technical reference](engineering/TECHNICAL_REFERENCE.md), [architecture update](engineering/ARCHITECTURE_UPDATE.md), [AI providers](engineering/AI_PROVIDERS_SETUP.md), [AI usage strategy](engineering/AI_USAGE_STRATEGY.md), [free alternatives](engineering/FREE_ALTERNATIVES_GUIDE.md), [business email](business/BUSINESS_EMAIL_STRATEGY.md), [competitors](business/competitors/COMPETITORS_2026-10.md), [master plan reference](business/reference/RENYXERA_Master_Plan_Auth_Security_Monetization.md).
- **Design:** [design system](design/DESIGN-SYSTEM.md), [Looks spec](design/LOOKS-SPEC.md).
- **Study materials:** [programme index](study-materials/00-README.md).
- **Done and reference:** [done index](done/README.md), [old archive](done/archive/README.md).
