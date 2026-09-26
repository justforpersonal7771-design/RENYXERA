# RENYXERA — Progress Checklist

**Last updated:** 26 September 2026 (full cross-check against the master plan, module by module)
**Companion to:** `RENYXERA_Master_Plan_Auth_Security_Monetization.md` (full rationale, module-by-module — this file is status only)

Legend: ✅ Done and verified · 🟨 Partly done · 🔶 Done but needs your confirmation/action · ⬜ Not started

Every deliverable and acceptance criterion in the master plan has a row below. The 26 Sep audit added the rows that were missing (asset/image architecture, CI security checks, monitoring, legal pack, and several per-module items); statuses were verified against the code, not assumed.

---

## ▶️ Execution order (what gets built next, top to bottom)

Ordered by the plan's rule — security & integrity first, then retention, then money — and by dependency (nothing starts before what it needs). Each step ships as one batch.

| # | Step | Modules | Why now |
|---|---|---|---|
| 1 | **Close the AI abuse route**: per-user daily AI quota in Postgres + server-side prompt cache | 4G | The only route that costs money; live today |
| 2 | **Bot gate**: Cloudflare Turnstile on sign-up, login and reset | 4G | Stops scripted accounts farming the quota from step 1 |
| 3 | **Route protection in middleware** + guest caps (practice sample, "local only" warning) | 4C, 4D | Server-side boundary instead of UI-only locks |
| 4 | **CI security checks**: service-role grep over build output, anon-can't-read-answers test | Platform | Makes steps 1–3 and 4B regressions impossible to ship silently |
| 5 | **Question bank into Postgres** (975 questions, public/private split, offline sync) | 4B | Prerequisite for everything in Release 5 |
| 6 | **Answer-key withholding + server-graded attempts** (attempt token, graded/practice modes) | 5A, 5B | Makes scores trustworthy |
| 6b | ✅ **Protected offline Downloads** (26 Sep): /downloads + protected viewer; AES-GCM packs in a per-account vault DB; non-extractable key, 14-day offline renewal; account watermark; copy/print/context-menu/save blocked; blur shield; wiped on sign-out. **Follow-ups:** persistent per-day download cap (needs a table), rasterised "flattened" page rendering for TeX/images, key rotation/revocation with Active Devices (7) | 5A, 6 | Question bank never downloadable as a file |
| 7 | **Account surface**: Preferences, Account (export my data), Active Devices, sign-out everywhere | 4E, 4F | Completes identity; needed for 7D later |
| 8 | **Waitlist + branch landing pages** | 4H | Free demand capture; feeds Release 8 ordering |
| 9 | **Legal pack completion** (Contact, Disclaimer, Refund, Cookie) + monitoring (Sentry, Web Analytics) | 6B, Platform | Required before AdSense/Razorpay |
| 10 | **Calibration data** (official marks↔AIR etc.) | 4J | Makes predictions accurate — data gathering, not just code |
| 11 | Integrity signals, bank protection, leaderboards & All-India mocks | 5C–5E | Only credible after step 6 |
| 12 | Content & SEO engine, then ads | 6A–6C | Needs 5A (solutions server-held) |
| 13 | Payments & entitlements, then anti-abuse/anti-sharing | 7A–7D | Needs 5B + 6B |
| 14 | Practice bank, study materials, multi-branch data & pipeline | 6D, 6E, 8A–8C | Largest content effort; trough season (Mar–May) |
| 15 | Growth loops, revenue lines, depth, community, mobile | 7E, 8B, 9A–9E | After revenue exists |
| — | Cloud sync (4I) slots in after step 5; R2 + CDN base URL after step 5 | 4I, Platform | Depends on Postgres data |

---

## 🔴 Pending — needs YOUR action specifically

| # | Task | Status |
|---|---|---|
| ~~1~~ | ~~Rotate the Supabase `service_role` key~~ | ✅ **done** — rotated, updated in `.env.local`, Vercel, and pushed as a Cloudflare Worker secret |
| ~~2~~ | ~~Change Cloudflare org type~~ | **Closed, not fixable and not worth it.** Org type is set once at signup and can't be edited on a Free account; it's metadata with no legal or functional weight. Leaving it as "Educational." |
| ~~3~~ | ~~Google OAuth Console — Authorised domain~~ | ✅ **done** — `renyxera.workers.dev` added as Authorised domain 2 |
| 7 | **Google OAuth branding verification — logo only, fixable now** | Branding isn't verified, so the consent screen shows the raw Supabase domain instead of "RENYXERA" (cosmetic only — sign-in works). A square 512×512 lockup (mark + wordmark) exists at `public/brand/oauth-logo.png`; upload it in the Google console. |
| 7b | ~~Homepage/privacy content issues~~ | ✅ **root-caused and fixed** — server-rendered homepage now explains the product; privacy policy has the Google-user-data section. |
| 7c | **Homepage URL ownership — cannot be completed on `workers.dev`** | OAuth branding needs a DNS-verified Domain property; `workers.dev`'s DNS isn't yours. Merged into the domain backlog item below. |
| ~~8~~ | ~~Run migration 0002 (usernames)~~ | ✅ **done** — verified 26 Sep: the database rejects an uppercase username |
| ~~9~~ | ~~Run migration 0003 (AI quota + cache)~~ | ✅ **done** — verified 26 Sep: quota function and cache live; the public key is blocked from calling the quota function |
| ~~4~~ | ~~Update Supabase Auth → URL Configuration~~ | ✅ **done** |
| ~~5~~ | ~~Decide Vercel's fate~~ | ✅ **decided — leave it as is**, dormant |
| ~~6~~ | ~~Add 3 GitHub repo secrets~~ | ✅ **done and verified end-to-end** |

---

## 🟡 Backlog — deferred until there's a reason to spend money

| # | Task | Why it's parked |
|---|---|---|
| 1 | **Custom-domain confirmation emails** (RENYXERA sender) | Needs an owned domain with DNS access (~$10-12/yr). Steps are ready (Resend → verify domain → API key → Supabase SMTP). |
| 2 | **Full Google OAuth branding verification** | Same blocker: needs DNS-level domain verification. One domain unlocks both. |
| 3 | **Firebase Blaze billing** (Mobile OTP past 10 SMS/day) | Only needed once OTP is promoted to real users (4C). |
| 5 | **Turn "Confirm email" back ON** (Supabase → Authentication → Sign In / Providers → Email) | Switched off 26 Sep 2026 because Supabase's free built-in email sender only allows a few emails per hour, which blocked sign-ups ("email rate limit exceeded"). Re-enable once there's revenue for a domain + custom SMTP (#1), so unverified addresses can't be used. No code change needed — the sign-up screen already falls back to "check your inbox" when confirmation is required. |
| 4 | **Google Play developer account** (~₹2,100 one-time) | Optional; only for a Play Store listing (9D). The PWA already installs from the browser. |

---

## PLATFORM-WIDE — rules and controls that span every release

### Images & binary assets (§2.3 — P0 design rule)
| Task | Status |
|---|---|
| Question images served as static files from Cloudflare's CDN (`public/images/`, 6.1 MB), never from GitHub raw URLs | ✅ |
| Image references stored/resolved as **relative paths** (`/images/2026-FN/2.png`), never binaries or absolute third-party URLs | ✅ *(lib/services/image-resolver.ts)* |
| Single configurable CDN base URL (one env var) used to resolve every image path at render time | ⬜ *(paths are currently root-relative; no base-URL variable yet)* |
| Cloudflare R2 bucket provisioned and bound for the bulk / multi-branch diagram corpus | ⬜ |
| No binary assets in Postgres (`image_paths` / `image_path` columns hold relative paths only) | ✅ *(schema in 0001 enforces text paths; no images stored)* |
| WebP/AVIF compression at ingest for new diagrams | ⬜ *(needed with 8A)* |
| Hotlink protection on images (CDN/R2) | ⬜ *(5D)* |

### Security, CI & monitoring (§5.3, §5.4)
| Task | Status |
|---|---|
| CI on every push: typecheck, lint, production build | ✅ *(.github/workflows/ci.yml)* |
| Service-role key can't reach client code (`import "server-only"` build-time guard) | ✅ |
| CI grep over the **built output** proving no service-role key is in the client bundle | ✅ *(scripts/check-security.mjs in CI)* |
| CI test proving the anon key reads **zero rows** from `question_answers` | ✅ *(automated in CI via check:security)* |
| Automated Playwright regression suite in CI (desktop + mobile, light + dark) | ⬜ *(run manually on every change today; not in CI)* |
| Error tracking (Sentry free tier) | ⬜ |
| Product analytics (Cloudflare Web Analytics, cookieless) | ⬜ |
| Structured API logs + anomaly alerts | 🟨 *(route-level logging exists; no alerting)* |
| Supabase idle-pause keep-alive (scheduled ping) | ⬜ *(only matters pre-launch)* |
| Worker CPU budget: prerendered pages + static dataset served without the Worker (fixes Error 1102) | ✅ |

---

## RELEASE 4 — Foundation: Infrastructure, Data & Identity

### 4A · P0 · Cloudflare Migration
| Task | Status |
|---|---|
| Verify Vercel ToS forbids commercial use; Cloudflare permits it | ✅ |
| Convert `fs.readFile` → build-time JSON imports (Workers has no runtime filesystem) | ✅ |
| Install/configure `@opennextjs/cloudflare` + Wrangler; prove `build:cf` works | ✅ |
| Cloudflare account created, `wrangler login`, first deploy | ✅ |
| Diagnosed & fixed a corrupted-build deploy failure | ✅ |
| Renamed Worker → `gate` (final URL: **https://gate.renyxera.workers.dev**) | ✅ |
| `GEMINI_API_KEY` + `SUPABASE_SERVICE_ROLE_KEY` secrets set on the Worker | ✅ |
| Full live verification (pages, dataset, grading, AI/Gemini, Supabase auth) on Cloudflare | ✅ |
| Service worker + PWA install working on Cloudflare | ✅ |
| Old duplicate Worker deleted | ✅ |
| GitHub Actions CI/CD (auto-deploy on push to `main`) | 🟨 *(set up and verified earlier; recent deploys have been made locally with `npm run deploy:cf` because pushes weren't landing — check the Actions tab)* |
| R2 bucket provisioned; CDN base URL as a single env var | ⬜ *(see Platform-wide → Images)* |
| DNS, Web Analytics and Turnstile in the same Cloudflare account | ⬜ |
| Rollback path documented and tested | ⬜ |
| Vercel decommissioned | 🔶 *(kept dormant by decision — 🔴#5)* |
| Custom domain | ⬜ *(declined for now — revisit once there's revenue)* |

### 4B · P0 · Data Layer Migration (Postgres + RLS)
| Task | Status |
|---|---|
| Schema + RLS migration written (`supabase/migrations/0001_init.sql`) | ✅ |
| `question_answers` locked from anon/authenticated (structural FINDING-3 fix) | ✅ |
| `branches` seeded with all six codes (CSE live, five coming soon) | ✅ |
| Supabase project created, migration run in production | ✅ |
| Env vars wired (`.env.local` + Worker secrets + CI secrets) | ✅ |
| `lib/supabase/*` client/server/middleware scaffolding, verified safe when unconfigured | ✅ |
| **975 questions seeded into Postgres** with the public/private split | ✅ *(scripts/seed-questions.mjs, 26 Sep: 975 q · 2776 options · 975 answers; anon sees 0 answers. all NAT "A OR B" ranges in nat_ranges; `npm run check:keys` validates every key)* |
| All 975 questions render identically from Postgres as from the JSON | 🟨 *(by design the question text is served from the answer-free static bank on the CDN — cheaper and offline-friendly; Postgres serves answers + attempts)* |
| Practice mode works fully offline after first sync | 🟨 *(works offline today from IndexedDB; not yet from a Postgres sync)* |
| `profiles` auto-create trigger confirmed firing on a real signup | ✅ *(verified 26 Sep against production: 3 auth users, 3 profile rows)* |

### 4C · P1 · Authentication — Three Doors
| Task | Status |
|---|---|
| Login / signup / reset-password pages + `/auth/callback` | ✅ |
| Login/signup/forgot-password as an in-place modal | ✅ |
| Google OAuth button, Google Cloud client, consent screen published | ✅ |
| Live-tested real signup, unconfirmed-login error, Google OAuth, full Google sign-in | ✅ |
| `/auth/callback` excluded from middleware session refresh (Error 1102 root cause) | ✅ |
| GoogleAuthButton bfcache bug fixed | ✅ |
| Auth UI in the app's own glass/gradient design (no vendor widget) | ✅ |
| Session persistence across reloads; silent token refresh | ✅ |
| Firebase project + Phone provider enabled | ✅ |
| Mobile OTP wired into the app (Firebase ↔ Supabase third-party JWT bridge) | ⬜ |
| OTP abuse controls: per-phone/IP/device limits, Turnstile, resend cooldown, daily cap | ⬜ |
| All three auth paths converge on one `profiles` row | 🟨 *(Google + email do; OTP not built)* |
| Route protection enforced in **middleware** (not page components) | ✅ *(/profile → /login?redirect=)* |
| "Sign out everywhere" on credential change | ⬜ |
| No delete-account control anywhere in the UI | ✅ |
| Anonymization backstop (support-request erasure → `status='anonymized'`, PII nulled, attempts kept) documented in the Privacy Policy and working | ⬜ |
| Firebase Blaze billing (past 10 SMS/day) | ⬜ *(backlog #3)* |

### 4D · P1 · Guest Walkthrough / Teaser Mode
| Task | Status |
|---|---|
| Guest can explore every screen without an account | ✅ |
| Contextual feature locks (blurred previews, "sign in to unlock") | ✅ *(GuestLock on Analytics / AI Mentor, clipped to one screen)* |
| Full official mock papers locked for guests with a contextual sign-in prompt | ✅ |
| Guest AI calls: zero (server returns 401 without a session) | ✅ |
| Guest → account IndexedDB migration on signup | ✅ *(lib/repository/storage/guest-migration.ts; never overwrites account records)* |
| Capped practice sample for guests (full bank for signed-in users) | ✅ *(guests capped at 15 questions)* |
| Bookmarks/mistakes marked "local only" for guests with a warning | ✅ *(GuestLocalNotice)* |
| Subject leaderboards locked for guests | ⬜ *(leaderboards themselves are 5E)* |
| Wire route protection into middleware | ✅ |

### 4E · P1 · Profile, Avatars & Goals Engine
| Task | Status |
|---|---|
| DiceBear avatar picker (8 styles, shuffle) storing only a seed + style | ✅ |
| Avatar renders offline and in both themes | ✅ |
| Full `/profile` page: identity, avatar, goals, sign-out, premium header | ✅ |
| Profile save updates the shared auth store immediately | ✅ |
| Sign-out UX: redirect to dashboard with a "Signed out" toast | ✅ |
| Username: lowercase, validated, live availability check (server-side), reserved names blocked | ✅ |
| Username uniqueness enforced by a **database constraint** (case-insensitive) | ✅ *(migration 0002 live)* |
| Username profanity list | ⬜ |
| Display name used for greetings across the app | ✅ |
| Stats section (accuracy, attempted, streak, hours, tests, mistakes mastered) | ✅ |
| Achievements section (15 badges from real progress, "New" chip) | ✅ |
| Dynamic Exam Goals Engine: target rank → marks → coverage → recommended focus % + topics, honest feasibility, "Apply" + "My goal" preset | ✅ *(`npm run check:goals` proves AIR 100 vs AIR 5000 recommend different topic sets)* |
| Target year drives countdown and every "GATE <year>" label; rolls forward after each exam | ✅ |
| Target branch: CSE live, others Coming Soon and non-selectable | ✅ |
| Daily hours size the daily question target and the time check | ✅ |
| Daily hours drive reminder cadence and a "you are N hours behind" signal | ⬜ |
| Target year weights recent-year PYQs higher as the exam nears | ⬜ |
| Closed loop: each graded attempt re-derives the recommended focus band | 🟨 *(re-derives from measured accuracy; graded attempts are 5B)* |
| Preferences section (theme, default duration, notifications, reduced motion) | ⬜ |
| Account section (email/phone, linked providers, active devices, export my data) | ⬜ |

### 4F · P0 · Per-User Isolation & Device Sessions
| Task | Status |
|---|---|
| Per-user IndexedDB namespace (`IDBManager.setActiveNamespace`) + `resetAllStores()` — verified live | ✅ |
| Wired into real sign-in/sign-out (`AuthListener`) incl. a fixed guest-first-load regression | ✅ |
| Explicit two-account test: account B sees zero data from account A, and all 10 stores reset | ⬜ *(behaviour implemented; the documented store-by-store test isn't written)* |
| Device sessions table + Active Devices list | ⬜ |
| "Sign out this device" / "sign out everywhere" | ⬜ |
| Idle expiry; forced re-auth on credential change | ⬜ |

### 4G · P0 · API Hardening
| Task | Status |
|---|---|
| `/api/ai/generate` zod validation + server-owned instruction enum | ✅ |
| Rate limiting + origin check (previously missing entirely) | ✅ |
| Supabase JWT required on `/api/ai/generate` (401, no Gemini call, for guests) | ✅ |
| Response size caps and request timeouts | 🟨 *(body-size caps done; timeouts not explicit)* |
| Upstash Redis, user-ID-keyed limiting | ⬜ *(current limiting is IP-keyed)* |
| Per-user daily AI quota in Postgres | ✅ *(atomic `consume_ai_call`, 30/day, IST reset; live)* |
| Server-side prompt-hash response cache | ✅ *(`ai_response_cache`; cache hits cost no quota; live)* |
| Turnstile on signup/login/reset | ✅ *(live; Supabase Captcha protection on; verified by you in a real browser 26 Sep. OTP gets it when OTP is built)* |

### 4H · P1 · Multi-Branch Teaser & Waitlist
| Task | Status |
|---|---|
| Branch selector (Profile → Exam Goals) with CSE live, 5 Coming Soon, non-selectable | ✅ |
| Branch selector in onboarding | ⬜ |
| "Notify Me" waitlist capture (guests: email; members: user id) | ⬜ *(table exists — `branch_waitlist`)* |
| Internal waitlist counts (prioritises Release 8) | ⬜ |
| Branch landing pages for SEO (`/gate-ece`, `/gate-da`, …) | ⬜ |
| Launch email to the waitlist when a branch goes live | ⬜ |

### 4I · P2 · Cloud Sync
| Task | Status |
|---|---|
| Sync status model (Offline/Pending/Syncing/Synced/Conflict/Failed) + indicator | ⬜ |
| Conflict rules (LWW prefs, union bookmarks, max counters, server wins on scores) | ⬜ |
| Durable sync queue with backoff; "Sync now" | ⬜ |
| "Export my data (JSON)" | ⬜ |

### 4J · P0 · Calibration Data Foundation *(makes predictions accurate)*
| Task | Status |
|---|---|
| Marks ↔ AIR data (general + categories) for the last 3+ GATE CSE years, from official/cited sources | ⬜ |
| Qualifying cut-offs, candidates appeared, GATE score formula & normalisation constants | ⬜ |
| Official exam schedule per year; official syllabus per branch | ⬜ |
| Versioned `calibration/<branch>/<year>.json` + `calibration/SOURCES.md` source/licence ledger | ⬜ |
| Goals Engine, readiness predictor and AI Mentor read calibration data (show data vintage) | ⬜ *(estimates are labelled as estimates meanwhile)* |
| Opt-in anonymised scorecard submissions from users to improve the curve | ⬜ |
| Annual recalibration each March after results | ⬜ *(recurring)* |

---

## RELEASE 5 — Exam Integrity

### 5A · P0 · Answer Key Withholding
| Task | Status |
|---|---|
| Public/private split logic | ✅ *(dataset-split.ts retired: answers stripped at build in copy-static-data.mjs; keys only in Postgres)* |
| Answer-free public payload | ✅ *(public/data/questions.json has no answer fields; `/api/dataset` removed)* |
| Live graded exam UI uses the public payload (no answer fields in network, IndexedDB or memory) | ✅ *(keys unlock only after submit via /api/exam/grade, or per question on practice screens via /api/answers)* |
| Visible **Graded** vs **Practice** badge | ⬜ |
| Offline graded attempts queued and shown "Pending evaluation" | ✅ *(amber pending state + auto-retry on reconnect; never counted as wrong)* |
| CI check that no answer field appears in a graded attempt | ✅ *(build fails if an answer field reaches the public bank)* |

### 5B · P0 · Server-Authoritative Evaluation
| Task | Status |
|---|---|
| `/api/exam/grade` server-side grading endpoint | ✅ |
| Attempt token (server start time/duration, tamper-proof timer) | ⬜ |
| Live exam session wired to submit-for-grading instead of self-grading | ✅ *(attempt stored in exam_attempts/exam_responses for signed-in users)* |
| Server validation on submit (open, in time + grace, matching question set, not already submitted) | 🟨 *(duplicates collapsed, unknown ids ignored, re-submits can't overwrite; time/question-set checks need the attempt token)* |
| Idempotent submissions; late-submission grace window | 🟨 *(idempotent on attempt id ✅; grace window needs the attempt token)* |
| 100-attempt server-vs-client score regression suite | ⬜ |

### 5C · P1 · Attempt Integrity Signals
| Task | Status |
|---|---|
| Tab-blur / timing-anomaly / concurrent-attempt signals (graded only, shadow-flag first) | ⬜ |
| Disclosure notice before graded attempts | ⬜ |
| Flagged attempts excluded from leaderboards, never deleted | ⬜ |

### 5D · P1 · Question Bank Protection
| Task | Status |
|---|---|
| Paginated/scoped delivery (no full-bank single request) | ⬜ |
| Per-account fetch-volume limits + anomaly alerts | ⬜ |
| Full-bank offline download as a paid entitlement | ⬜ |
| Hotlink protection on images | ⬜ |
| Invisible per-account watermarking | ⬜ |
| ToS clause prohibiting scraping/redistribution | ⬜ |

### 5E · P1 · Leaderboards & All-India Test Series
| Task | Status |
|---|---|
| Scheduled All-India mock tests; server-computed percentile/AIR | ⬜ |
| Leaderboards (All-India/subject/college/friends), opt-in with privacy toggle | ⬜ |
| Streaks, weekly challenges, topic ladders | 🟨 *(streaks exist; challenges/ladders not built)* |
| Shareable result cards | ⬜ |

---

## RELEASE 6 — Monetization I: Content Engine & Advertising

### 6A · P1 · Content & Programmatic SEO Engine
| Task | Status |
|---|---|
| Public, server-rendered `/about` landing page | ✅ |
| Per-question pages, subject hubs, topic pages, PYQ year pages, syllabus page | ⬜ |
| Editorial content (strategy, cut-off analysis, study plans) | ⬜ |
| Free tools (rank predictor, score / normalisation calculator, college predictor) | ⬜ |
| Technical SEO (sitemap, robots, canonicals, OG cards, structured data, CWV budget) | ⬜ |
| Sitemap submitted; indexing confirmed in Search Console | ⬜ |

### 6B · P1 · Legal Pages & Ad Network Onboarding
| Task | Status |
|---|---|
| Privacy Policy (incl. Google user data section) | ✅ |
| Terms of Service | ✅ |
| About page | ✅ |
| Contact page | ⬜ |
| Disclaimer ("not affiliated with any IIT or the GATE organising institute") | ⬜ |
| Refund & Cancellation Policy | ⬜ *(needed before Razorpay goes live)* |
| Cookie Policy | ⬜ |
| Privacy Policy names 5C integrity signals and the 4C anonymization path | ⬜ |
| Professional legal review before real money moves | ⬜ |
| AdSense application (after 6A); Ezoic/Media.net fallbacks | ⬜ |
| Direct sponsorships track | ⬜ |

### 6C · P1 · Ad Placement Architecture
| Task | Status |
|---|---|
| `<AdSlot>` component (tier-, route- and consent-aware; reserved height; lazy) | ⬜ |
| Zero ads in exams, auth and checkout; zero for ad-free tiers | ⬜ |
| Service worker excludes ad scripts from caching | ⬜ |
| Consent management; non-personalised ads for under-18s | ⬜ |
| A/B measurement of ad revenue vs paid conversion | ⬜ |

### 6D · P1 · Practice Question Bank (beyond PYQs)
| Task | Status |
|---|---|
| Authoring pipeline: AI-assisted draft → mandatory expert review → publish | ⬜ |
| Original practice sets for every CSE topic (MCQ/MSQ/NAT, worked solutions) | ⬜ |
| Same taxonomy tags as PYQs + difficulty; clearly labelled "Practice" vs "PYQ" | ⬜ |
| Difficulty recalibrated from real learner response data | ⬜ |
| Annual Trend Refresh each March: add new papers, recompute weights, rebalance, publish "What changed" | ⬜ *(recurring)* |

### 6E · P1 · Study Materials
| Task | Status |
|---|---|
| One page per topic for every branch → section → subject → topic | ⬜ |
| Each page linked to its PYQs, practice questions and prerequisite topics | ⬜ |
| Original writing only, AI-draft → expert-review, sources cited | ⬜ |
| Public pages feed SEO (6A); deeper material in the paid tier (7A) | ⬜ |
| Yearly review with the Trend Refresh / syllabus changes | ⬜ *(recurring)* |

---

## RELEASE 7 — Monetization II: Pay-Per-Exam & Anti-Misuse

### 7A · P1 · Tier & Entitlement Model
| Task | Status |
|---|---|
| Entitlements stored server-side (`profiles.entitlements`), re-checked on every gated action | ⬜ |
| Pricing tiers implemented (Free / ₹29 / ₹49 / ₹99 / ₹199) | ⬜ |
| Entitlement check inside the grading call | ⬜ |
| Upgrade path on the results screen; warm upsell at quota limits; bundling nudge after 3 purchases | ⬜ |

### 7B · P1 · Payments — Razorpay
| Task | Status |
|---|---|
| Razorpay account created, KYC approved, activated | ✅ *(ahead of schedule)* |
| Confirm the actually-applied UPI MDR on the account | ⬜ |
| UPI-first checkout wired into the app | ⬜ |
| Webhook handling (signature-verified, idempotent; sole source of truth) | ⬜ |
| Razorpay Subscriptions for the ₹99 add-on; invoicing/GST; dunning | ⬜ |
| No-refund policy shown at checkout (acknowledgement), on Razorpay, and on the policy page — with the enforceable renewal wording | ⬜ |

### 7C · P1 · Subscription & Purchase Abuse Prevention
| Task | Status |
|---|---|
| Velocity limits, card-testing detection, disposable-email blocking | ⬜ |
| Turnstile on checkout | ⬜ |
| Purchase-then-scrape flagging | ⬜ |
| Admin review dashboard | ⬜ |

### 7D · P1 · Account-Sharing Prevention
| Task | Status |
|---|---|
| Two-device limit on paid entitlements with a device chooser | ⬜ |
| Concurrent-session detection; device-change cooldown | ⬜ |
| Escalation ladder (warn → re-auth → temp lock → manual review) | ⬜ |

### 7E · P2 · Referral & Growth Loops
| Task | Status |
|---|---|
| Referral credits (both sides) | ⬜ |
| Shareable achievement / result / AIR cards | ⬜ |
| College ambassador programme | ⬜ |
| Study-group invitations; testimonials for credits | ⬜ |

---

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
| Official papers (all years/sessions) + official final answer keys for DA, ECE, EE, ME, CE | ⬜ |
| Official syllabus → topic taxonomy per branch | ⬜ |
| Calibration data per branch (4J) | ⬜ |
| Rights check recorded in the source ledger before ingestion | ⬜ |
| Extraction (8A) → answer-key match → tagging → human QA sample (≥98% first-pass accuracy) | ⬜ |
| Launch gate: PYQs + keys + taxonomy + starter practice (6D) + topic pages (6E) before a branch leaves "Coming Soon" | ⬜ |

---

## RELEASE 9 — Product Depth & Controlled Community

| Module | Task | Status |
|---|---|---|
| 9A | Spaced repetition (SM-2/FSRS) over the mistakes store; daily adaptive set; per-topic mastery feeding 4E-2 | 🟨 *(weak-topic detection and a mastery model exist; SRS scheduling not built)* |
| 9B | Streaks | ✅ |
| 9B | Badges on the profile | ✅ *(15 achievements)* |
| 9B | Streak freeze days, XP & levels, daily goals, weekly challenges, study-time leaderboards | ⬜ |
| 9C | Moderated community (automated toxicity scoring, reputation gating, reporting) — opens only with moderation in place | ⬜ |
| 9D | Play Store listing via TWA/Capacitor (optional ₹2,100 — backlog #4) | ⬜ |
| 9E | AI study-plan generation, AI mocks from weakness profile, natural-language search, voice revision | 🟨 *(AI Mentor study-plan suggestions exist; the rest not built)* |

---

## How to read this file going forward

- When something moves status, update this file in the same commit that finishes the work.
- The 🔴 section at the top is the "go click this right now" list — keep it current above everything else.
- Full rationale and the complete plan live in `RENYXERA_Master_Plan_Auth_Security_Monetization.md`; this file is status only, no explanation.
- Every new module or deliverable added to the master plan gets a row here in the same commit.
