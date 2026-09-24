# RENYXERA — Progress Checklist

**Last updated:** 24 September 2026
**Companion to:** `RENYXERA_Master_Plan_Auth_Security_Monetization.md` (full rationale, module-by-module — this file is status only)

Legend: ✅ Done and verified · 🔶 Done but needs your confirmation/action · ⬜ Not started

---

## 🔴 Pending — needs YOUR action specifically

| # | Task | Why it matters |
|---|---|---|
| 1 | **Rotate the Supabase `service_role` key** | It appeared (partially) in a screenshot sent into this chat — treat as compromised. Supabase → Project Settings → API → regenerate → update `.env.local` + Vercel env vars. *(Flagged earlier, not yet confirmed done.)* |
| 2 | **Change Cloudflare org type** Educational → Company/Startup | RENYXERA is commercial, not an educational institution. Org settings, easy fix. |
| 3 | **Update Google OAuth Console branding** — home/Privacy/Terms links and Authorised domain, from `renyxera.vercel.app` → `https://gate.renyxera.workers.dev` (use the real `/privacy` and `/terms` paths now that they exist) | Still points at the domain we're moving off. |
| 4 | **Update Supabase Auth → URL Configuration** — Site URL + Redirect URLs, add `https://gate.renyxera.workers.dev` and `.../auth/callback` | Needed for OAuth/email-confirmation redirects once this is the real production URL. |
| 5 | **Decide Vercel's fate** — disconnect its GitHub auto-deploy (keep as dormant rollback) or delete the project outright | I can't do either myself; just tell me which. |
| ~~6~~ | ~~Add 3 GitHub repo secrets~~ | ✅ **done** — all 3 confirmed present in repo Settings → Secrets. First automated run is being verified now. |

Once those 3 exist, push anything to `main` and check the **Actions** tab on GitHub — you'll see it build and deploy automatically, same as Vercel used to.

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
| GitHub Actions CI/CD (auto-deploy on push to `main`) | 🔶 secrets added, verifying the first automated run now (this commit is the test) |
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
| Google OAuth button, Google Cloud client, consent screen published | ✅ |
| Live-tested: real signup, unconfirmed-login error, Google OAuth redirect — all against production Supabase | ✅ |
| Firebase project + Phone provider enabled | ✅ |
| Mobile OTP wired into the app | ⬜ |
| Firebase Blaze billing (needed past 10 SMS/day) | ⬜ *(not urgent yet)* |
| No-account-deletion UI policy + anonymization backstop | ⬜ |
| Auth pages linked from navigation / route protection | ⬜ *(deliberately deferred to 4D)* |

### 4D · P1 · Guest Walkthrough / Teaser Mode
| Task | Status |
|---|---|
| Contextual feature locks (blurred previews, "sign in to unlock") | ⬜ |
| Guest → account IndexedDB migration on signup | ⬜ |
| Wire route protection into middleware once this exists | ⬜ |

### 4E · P1 · Profile, Avatars & Goals Engine
| Task | Status |
|---|---|
| DiceBear avatar picker component | ✅ |
| Full `/profile` page (identity, goals, stats, account settings) | ⬜ |
| Dynamic Exam Goals Engine (goals drive Focus Target/Goal Slider) | ⬜ |

### 4F · P0 · Per-User Isolation & Device Sessions
| Task | Status |
|---|---|
| `IDBManager.setActiveNamespace()` + `resetAllStores()` — verified live | ✅ |
| Wired into a real sign-in/sign-out flow | ⬜ |
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
