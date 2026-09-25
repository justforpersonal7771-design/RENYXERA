# RENYXERA — Progress Checklist

**Last updated:** 24 September 2026
**Companion to:** `RENYXERA_Master_Plan_Auth_Security_Monetization.md` (full rationale, module-by-module — this file is status only)

Legend: ✅ Done and verified · 🔶 Done but needs your confirmation/action · ⬜ Not started

---

## 🔴 Pending — needs YOUR action specifically

| # | Task | Status |
|---|---|---|
| ~~1~~ | ~~Rotate the Supabase `service_role` key~~ | ✅ **done** — rotated, updated in `.env.local`, Vercel, and pushed as a Cloudflare Worker secret |
| ~~2~~ | ~~Change Cloudflare org type~~ | **Closed, not fixable and not worth it.** Confirmed via Cloudflare directly: org type is set once at signup and cannot be edited on a Self-Serve/Free account — the only way to change it is creating an entirely new account and migrating the Worker, secrets, DNS, and GitHub Actions config over. It's signup-questionnaire metadata with no legal or functional weight (Cloudflare's commercial-use permission doesn't depend on it). Leaving it as "Educational." |
| ~~3~~ | ~~Google OAuth Console — Authorised domain~~ | ✅ **done** — `renyxera.workers.dev` added as Authorised domain 2 |
| 7 | **Google OAuth branding verification — logo only, fixable now** | App is "In production" but branding isn't verified, so the consent screen shows the raw Supabase domain instead of "RENYXERA" (cosmetic only — sign-in itself works, confirmed live via wrangler tail logs). Logo flagged as "doesn't uniquely identify your brand": current `icon-512.png` is a bare abstract mark with no text — needs a square (512×512, solid background) lockup combining the mark + "RENYXERA" wordmark. |
| 7b | ~~Homepage/privacy content issues ("doesn't explain purpose", "behind a login page", "privacy policy insufficient")~~ | ✅ **root-caused and fixed** — the dashboard homepage is a client-only React component; its server-rendered HTML (all any non-JS crawler, including Google's branding checker, ever sees) was just a loading spinner (confirmed live: 241 bytes of visible text total). Added real, substantial purpose-explaining copy to that server-rendered loading state, and an explicit Cookies/local-storage section to the privacy policy. Deployed — should clear on Google's next verification pass. |
| 7c | **Homepage URL ownership — cannot be completed on `workers.dev`, merged into the domain-purchase backlog item below** | Corrected after reading Google's own docs (support.google.com/cloud/answer/13804266): OAuth branding verification specifically requires a **Domain property verified via a DNS TXT record at the root domain** in Search Console — not the URL-prefix/HTML-tag method (which I'd set up first; it's a valid Search Console verification but doesn't satisfy this specific OAuth check). `renyxera.workers.dev`'s DNS zone is controlled by Cloudflare, not you, so a root-domain TXT record isn't something you can add — this is a hard structural limit of the free subdomain, not a config mistake. Needs a real, owned domain. |
| ~~4~~ | ~~Update Supabase Auth → URL Configuration~~ | ✅ **done** |
| ~~5~~ | ~~Decide Vercel's fate~~ | ✅ **decided — leave it as is**, dormant, not disconnecting or deleting |
| ~~6~~ | ~~Add 3 GitHub repo secrets~~ | ✅ **done and verified end-to-end** — first two automated runs failed on a Node version mismatch (wrangler requires Node ≥22, workflow was pinned to 20), fixed in commit `2e4411a`, third run succeeded. Confirmed live: a real Supabase error response came back from the CI-built deploy, proving the secrets correctly reached the build. |

Once those 3 exist, push anything to `main` and check the **Actions** tab on GitHub — you'll see it build and deploy automatically, same as Vercel used to.

---

## 🟡 Backlog — deferred until there's a reason to spend money

| # | Task | Why it's parked |
|---|---|---|
| 1 | **Custom-domain confirmation emails** (RENYXERA sender instead of Supabase's default) | Needs a real domain with DNS access (`renyxera.workers.dev` doesn't qualify — you don't control its DNS) — that's a ~$10-12/year registration, the one thing in this stack that genuinely can't stay $0. Steps are ready (Resend account → verify domain via 3 DNS records → API key → Supabase Dashboard → Auth → SMTP Settings) whenever a domain gets bought. Revisit alongside Module 4A's own "Custom domain" line (also parked for the same reason). |
| 2 | **Full Google OAuth branding verification** ("RENYXERA" name instead of the raw domain on the consent screen) | Same blocker as #1: needs DNS-level domain-property verification in Search Console, which requires owning a domain outright. Buy one domain, point it at both — same DNS access unlocks the branded consent screen and the branded confirmation emails together. |

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
| Old duplicate Worker deleted | ✅ |
| GitHub Actions CI/CD (auto-deploy on push to `main`) | ✅ **done and verified live** — every push to `main` now builds and deploys to Cloudflare automatically, matching Vercel's old behavior |
| Vercel decommissioned | 🔶 *(see 🔴#5)* |
| Custom domain | ⬜ *(declined for now, `workers.dev` is fine — revisit once there's revenue)* |

### 4B · P0 · Data Layer Migration (Postgres + RLS)
| Task | Status |
|---|---|
| Schema + RLS migration written (`supabase/migrations/0001_init.sql`) | ✅ |
| `question_answers` locked from anon/authenticated (structural FINDING-3 fix) | ✅ |
| Supabase project created, migration run in production | ✅ |
| Env vars wired (`.env.local` + Vercel) | ✅ |
| `lib/supabase/*` client/server/middleware scaffolding, verified safe when unconfigured | ✅ |
| `profiles` auto-create trigger confirmed firing on a real signup | ⬜ *(signup call verified live; trigger itself not yet double-checked in Table Editor)* |

### 4C · P1 · Authentication — Three Doors
| Task | Status |
|---|---|
| Login / signup / reset-password pages + `/auth/callback` | ✅ |
| Login/signup/forgot-password as an in-place modal (not a page navigation) | ✅ |
| Google OAuth button, Google Cloud client, consent screen published | ✅ |
| Live-tested: real signup, unconfirmed-login error, Google OAuth redirect, and a full real Google sign-in reaching `/profile` — all against production Supabase | ✅ |
| `/auth/callback` excluded from middleware's session-refresh matcher (was redundant CPU work on Cloudflare's free-tier 10ms budget, root-caused a real "Error 1102" seen live) | ✅ |
| GoogleAuthButton bfcache bug (loading spinner stuck forever if you hit Back from Google's consent screen) | ✅ |
| Firebase project + Phone provider enabled | ✅ |
| Mobile OTP wired into the app | ⬜ |
| Firebase Blaze billing (needed past 10 SMS/day) | ⬜ *(not urgent yet)* |
| No-account-deletion UI policy + anonymization backstop | ⬜ |
| Auth pages linked from navigation / route protection | ⬜ *(deliberately deferred to 4D)* |

### 4D · P1 · Guest Walkthrough / Teaser Mode
| Task | Status |
|---|---|
| Contextual feature locks (blurred previews, "sign in to unlock") | ✅ *(GuestLock on Analytics / AI Mentor; clipped to one screen so the unlock card is always visible)* |
| Guest → account IndexedDB migration on signup | ✅ *(lib/repository/storage/guest-migration.ts, run by AuthListener before the namespace switch; never overwrites existing account records)* |
| Wire route protection into middleware once this exists | ⬜ |

### 4E · P1 · Profile, Avatars & Goals Engine
| Task | Status |
|---|---|
| DiceBear avatar picker component | ✅ |
| Full `/profile` page (identity, avatar, goals, sign-out) — gradient hero, real card layout | ✅ |
| Profile save now updates the shared auth store immediately (previously saved to Supabase but avatar/name changes wouldn't show anywhere — including the topbar — until a hard reload) | ✅ |
| Sign-out UX: redirects to the dashboard with a "Signed out" toast, instead of flashing this page's own "not signed in" prompt for a couple seconds first | ✅ |
| Stats/Achievements sections from the master plan's profile spec | ✅ *(Stats: accuracy, attempted, streak, hours, tests, mastered. 15 achievements derived from local progress in lib/achievements.ts — unlock retroactively, "New" badge for freshly earned ones)* |
| Dynamic Exam Goals Engine (goals drive Focus Target/Goal Slider) | ✅ *(lib/goals/goal-engine.ts: target rank → marks → coverage at your accuracy → recommended focus % + topic set, with honest time/accuracy feasibility. Live "Goal plan" on the profile; "My goal" preset + Apply in the Focus Target panel. Acceptance test: `npm run check:goals` — AIR 100 vs AIR 5000 recommend different topic sets. Uses an approximate rank↔marks curve until 4J lands)* |

### 4F · P0 · Per-User Isolation & Device Sessions
| Task | Status |
|---|---|
| `IDBManager.setActiveNamespace()` + `resetAllStores()` — verified live | ✅ |
| Wired into a real sign-in/sign-out flow (`AuthListener`, catching and fixing a real regression where a guest's first page load was incorrectly treated as a namespace change and reset the data store mid-load) | ✅ |
| Active Devices list / sign-out-everywhere | ⬜ |

### 4G · P0 · API Hardening
| Task | Status |
|---|---|
| `/api/ai/generate` zod validation + server-owned instruction enum | ✅ |
| Rate limiting + origin check applied (previously missing entirely) | ✅ |
| Upstash Redis, user-ID-keyed limiting | ⬜ *(current limiting is IP-keyed; needs auth wired + Upstash account)* |
| Per-user daily AI quota in Postgres | ⬜ |
| Turnstile on signup/login/OTP | ⬜ |

### 4H · P1 · Multi-Branch Teaser & Waitlist
| Task | Status |
|---|---|
| Branch selector UI (CSE live, 5 "Coming Soon") | ⬜ |
| "Notify Me" waitlist capture | ⬜ *(table exists in the schema — `branch_waitlist`)* |
| Branch landing pages for SEO | ⬜ |

### 4I · P2 · Cloud Sync
| Task | Status |
|---|---|
| Sync status model (Offline/Pending/Syncing/Synced/Conflict/Failed) | ⬜ |
| Conflict resolution rules | ⬜ |

---

### 4J · P0 · Calibration Data Foundation *(makes predictions accurate)*
| Task | Status |
|---|---|
| Marks ↔ AIR data (general + categories) for the last 3+ GATE CSE years, from official/cited sources | ⬜ |
| Qualifying cut-offs, candidates appeared, GATE score formula & normalisation constants | ⬜ |
| Official exam schedule per year; official syllabus per branch | ⬜ |
| Versioned `calibration/<branch>/<year>.json` + `calibration/SOURCES.md` source/licence ledger | ⬜ |
| Goals Engine, readiness predictor and AI Mentor read calibration data (show data vintage) | ⬜ |
| Opt-in anonymised scorecard submissions from users to improve the curve | ⬜ |
| Annual recalibration each March after results | ⬜ *(recurring)* |

## RELEASE 5 — Exam Integrity

### 5A · P0 · Answer Key Withholding
| Task | Status |
|---|---|
| `lib/repository/dataset-split.ts` public/private split logic | ✅ |
| `/api/dataset?scope=public` answer-free payload | ✅ |
| Live exam UI cut over to the public payload (still self-grades from full dataset today) | ⬜ |

### 5B · P0 · Server-Authoritative Evaluation
| Task | Status |
|---|---|
| `/api/exam/grade` server-side grading endpoint | ✅ |
| Attempt token (server start time/duration, tamper-proof timer) | ⬜ |
| Live exam session wired to submit-for-grading instead of self-grading | ⬜ |

### 5C · P1 · Attempt Integrity Signals
| Task | Status |
|---|---|
| Tab-blur / timing-anomaly detection | ⬜ |
| Disclosure notice before graded attempts | ⬜ |

### 5D · P1 · Question Bank Protection
| Task | Status |
|---|---|
| Paginated/scoped delivery (no full-bank single request) | ⬜ |
| Per-account fetch-volume limits | ⬜ |
| Watermarking | ⬜ |

### 5E · P1 · Leaderboards & All-India Test Series
| Task | Status |
|---|---|
| Scheduled mock tests, percentile/AIR | ⬜ |
| Leaderboards (All-India/subject/college/friends) | ⬜ |
| Shareable result cards | ⬜ |

---

## RELEASE 6 — Monetization I: Content Engine & Advertising

### 6A · P1 · Content & Programmatic SEO Engine
| Task | Status |
|---|---|
| Per-question pages, subject/topic hubs, PYQ year pages | ⬜ |
| Free tools (rank predictor, score calculator, etc.) | ⬜ |
| Technical SEO (sitemap, structured data, Core Web Vitals) | ⬜ |

### 6B · P1 · Legal Pages & Ad Network Onboarding
| Task | Status |
|---|---|
| Privacy Policy | ✅ |
| Terms of Service | ✅ |
| Refund & Cancellation Policy | ⬜ *(needed before Razorpay goes live for real transactions)* |
| Cookie Policy | ⬜ |
| Professional legal review before real money moves | ⬜ *(current pages are solid drafts, not a lawyer's pass)* |
| AdSense application | ⬜ *(needs 6A content live first)* |

### 6C · P1 · Ad Placement Architecture
| Task | Status |
|---|---|
| `<AdSlot>` component (tier-aware, route-aware, no ads mid-exam/for Pro) | ⬜ |
| Consent management | ⬜ |

---

### 6D · P1 · Practice Question Bank (beyond PYQs)
| Task | Status |
|---|---|
| Authoring pipeline: AI-assisted draft → mandatory expert review → publish | ⬜ |
| Original practice sets for every CSE topic (MCQ/MSQ/NAT, worked solutions) | ⬜ |
| Same taxonomy tags as PYQs + difficulty; clearly labelled "Practice" vs "PYQ" | ⬜ |
| Difficulty recalibrated from real learner response data | ⬜ |
| Annual Trend Refresh each March: add new papers, recompute weights, rebalance the bank, publish "What changed" note | ⬜ *(recurring)* |

### 6E · P1 · Study Materials
| Task | Status |
|---|---|
| One page per topic for every branch → section → subject → topic (notes, formulas, traps, worked examples) | ⬜ |
| Each page linked to its PYQs, practice questions and prerequisite topics | ⬜ |
| Original writing only, AI-draft → expert-review, sources cited | ⬜ |
| Public pages feed SEO (6A); deeper material in the paid tier (7A) | ⬜ |
| Yearly review with the Trend Refresh / syllabus changes | ⬜ *(recurring)* |

## RELEASE 7 — Monetization II: Pay-Per-Exam & Anti-Misuse

### 7A · P1 · Tier & Entitlement Model
| Task | Status |
|---|---|
| Server-side entitlement checks | ⬜ |
| Pricing tiers implemented (₹29/₹49/₹99/₹199) | ⬜ |

### 7B · P1 · Payments — Razorpay
| Task | Status |
|---|---|
| Razorpay account created, KYC approved, activated | ✅ *(ahead of schedule)* |
| Checkout integration wired into the app | ⬜ |
| Webhook handling (source of truth for entitlements) | ⬜ |
| No-refund policy text finalized on checkout | ⬜ |

### 7C · P1 · Subscription & Purchase Abuse Prevention
| Task | Status | 
|---|---|
| Velocity limits, disposable-email blocking | ⬜ |
| Admin review dashboard | ⬜ |

### 7D · P1 · Account-Sharing Prevention
| Task | Status |
|---|---|
| Two-device limit enforcement | ⬜ |
| Concurrent-session detection | ⬜ |

### 7E · P2 · Referral & Growth Loops
| Task | Status |
|---|---|
| Referral credits | ⬜ |
| College ambassador programme | ⬜ |

---

## RELEASE 8 — Multi-Branch Expansion & Revenue Diversification

### 8A · P1 · Vision-Based PDF Extraction Pipeline
| Task | Status |
|---|---|
| Gemini vision ingestion pipeline for ECE/EE/ME/CE/DA papers | ⬜ |
| Human validation gate before a branch goes live | ⬜ |

### 8B · P2 · Revenue Diversification
| Task | Status |
|---|---|
| Direct sponsorships, affiliate, digital products, B2B/college licences | ⬜ |

---

### 8C · P1 · Multi-Branch Data Acquisition
| Task | Status |
|---|---|
| Official papers (all years/sessions) + official final answer keys for DA, ECE, EE, ME, CE | ⬜ |
| Official syllabus → topic taxonomy per branch | ⬜ |
| Calibration data per branch (4J) | ⬜ |
| Rights check recorded in the source ledger before ingestion | ⬜ |
| Extraction (8A) → answer-key match → tagging → human QA sample (≥98% first-pass accuracy) | ⬜ |
| Launch gate: PYQs + keys + taxonomy + starter practice (6D) + topic pages (6E) before a branch leaves "Coming Soon" | ⬜ |

## RELEASE 9 — Product Depth & Controlled Community

| Module | Task | Status |
|---|---|---|
| 9A | Adaptive learning engine (spaced repetition, weak-topic detection) | ⬜ |
| 9B | Gamification (streaks, XP, badges) | ⬜ |
| 9C | Controlled community/forum (moderation-gated) | ⬜ |
| 9D | Mobile presence (Play Store via TWA/Capacitor) | ⬜ |
| 9E | AI depth (study-plan generation, voice revision) | ⬜ |

---

## How to read this file going forward

- When something moves status, update this file in the same commit that finishes the work.
- The 🔴 section at the top is the "go click this right now" list — keep it current above everything else.
- Full rationale and the complete plan live in `RENYXERA_Master_Plan_Auth_Security_Monetization.md`; this file is status only, no explanation.
