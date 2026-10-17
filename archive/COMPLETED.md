# RENYXERA — Completed work (archive)

Everything that has shipped and been verified, moved here from `checklist.md` on 17 October 2026 so the live checklist only shows open work.
The untouched original is `archive/checklist-full-2026-10-17.md`. Rows are grouped exactly as in the old checklist (release → module).
Rows marked ✅ that still carry a 🟠/🟡 follow-up are kept in both files; the follow-up lives in `checklist.md`.

---

## ▶️ Execution order (what gets built next, top to bottom)

| # | Step | Modules | Why now |
|---|---|---|---|
| 1 | ✅ **Close the AI abuse route**: per-user daily AI quota in Postgres + server-side prompt cache | 4G | The only route that costs money; live today |
| 2 | ✅ **Bot gate**: Cloudflare Turnstile on sign-up, login and reset | 4G | Stops scripted accounts farming the quota from step 1 |
| 3 | ✅ **Route protection in middleware** + guest caps (practice sample, "local only" warning) | 4C, 4D | Server-side boundary instead of UI-only locks |
| 4 | ✅ **CI security checks**: service-role grep over build output, anon-can't-read-answers test | Platform | Makes steps 1–3 and 4B regressions impossible to ship silently |
| 5 | ✅ **Question bank into Postgres** (975 questions, public/private split, offline sync) | 4B | Prerequisite for everything in Release 5 |
| 6 | ✅ **Answer-key withholding + server-graded attempts** (attempt token, graded/practice modes) | 5A, 5B | Makes scores trustworthy — attempt token live 27 Sep |
| 6b | ✅ **Protected offline Downloads** (26 Sep): /downloads + protected viewer; AES-GCM packs in a per-account vault DB; non-extractable key, 14-day offline renewal; account watermark; copy/print/context-menu/save blocked; blur shield; wiped on sign-out. **Follow-ups:** persistent per-day download cap (needs a table), rasterised "flattened" page rendering for TeX/images, key rotation/revocation with Active Devices (7) | 5A, 6 | Question bank never downloadable as a file |
| 7 | ✅ **Account surface**: Preferences, Account (export my data), Active Devices, sign-out everywhere | 4E, 4F | Completes identity; needed for 7D later |
| 8 | ✅ **Waitlist + branch landing pages** | 4H | Free demand capture; feeds Release 8 ordering |
| 9 | ✅ **Legal pack completion** (Contact, Disclaimer, Refund, Cookie) + monitoring (Sentry, Web Analytics) | 6B, Platform | Required before AdSense/Razorpay — *before Razorpay: add operator legal name + address to /contact* |
| 10 | ✅ **Calibration data** (official marks↔AIR etc.) | 4J | Cited 2023–2026 data live; official rank table + category curves 🟠 March 2027 refresh |
| 11 | ✅ **Integrity signals, bank protection, leaderboards & All-India mocks** | 5C–5E | Done 28 Sep — remaining 5D rows are deliberately deferred (public bank) or *Backlog (paid)*; friends board moves to 9C |
| 12 | ✅ **Release 6:** Content & SEO engine, then ads | 6A–6C | Needs 5A (solutions server-held) |
| — | ✅ **Cloud sync (4I)** — live 28 Sep · R2 + CDN base URL 🟡 paid backlog | 4I, Platform | Depends on Postgres data |

## 🔴 Pending — needs YOUR action specifically

| # | Task | Status |
|---|---|---|
| ~~1~~ | ~~Rotate the Supabase `service_role` key~~ | ✅ **done** — rotated, updated in `.env.local`, Vercel, and pushed as a Cloudflare Worker secret |
| ~~2~~ | ~~Change Cloudflare org type~~ | **Closed, not fixable and not worth it.** Org type is set once at signup and can't be edited on a Free account; it's metadata with no legal or functional weight. Leaving it as "Educational." |
| ~~3~~ | ~~Google OAuth Console — Authorised domain~~ | ✅ **done** — `renyxera.workers.dev` added as Authorised domain 2 |
| 7b | ~~Homepage/privacy content issues~~ | ✅ **root-caused and fixed** — server-rendered homepage now explains the product; privacy policy has the Google-user-data section. |
| ~~8~~ | ~~Run migration 0002 (usernames)~~ | ✅ **done** — verified 26 Sep: the database rejects an uppercase username |
| ~~9~~ | ~~Run migration 0003 (AI quota + cache)~~ | ✅ **done** — verified 26 Sep: quota function and cache live; the public key is blocked from calling the quota function |
| ~~4~~ | ~~Update Supabase Auth → URL Configuration~~ | ✅ **done** |
| ~~5~~ | ~~Decide Vercel's fate~~ | ✅ **decided — leave it as is**, dormant |
| ~~6~~ | ~~Add 3 GitHub repo secrets~~ | ✅ **done and verified end-to-end** |

## PLATFORM-WIDE — rules and controls that span every release

### Images & binary assets (§2.3 — P0 design rule)

| Task | Status |
|---|---|
| Question images served as static files from Cloudflare's CDN (`public/images/`, 6.1 MB), never from GitHub raw URLs | ✅ |
| Image references stored/resolved as **relative paths** (`/images/2026-FN/2.png`), never binaries or absolute third-party URLs | ✅ *(lib/services/image-resolver.ts)* |
| No binary assets in Postgres (`image_paths` / `image_path` columns hold relative paths only) | ✅ *(schema in 0001 enforces text paths; no images stored)* |

### Security, CI & monitoring (§5.3, §5.4)

| Task | Status |
|---|---|
| CI on every push: typecheck, lint, production build | ✅ *(.github/workflows/ci.yml)* |
| Service-role key can't reach client code (`import "server-only"` build-time guard) | ✅ |
| CI grep over the **built output** proving no service-role key is in the client bundle | ✅ *(scripts/check-security.mjs in CI)* |
| CI test proving the anon key reads **zero rows** from `question_answers` | ✅ *(automated in CI via check:security)* |
| Automated Playwright regression suite in CI (desktop + mobile, light + dark) | ✅ *(28 Sep: `scripts/e2e-smoke.mjs` on every push — 11 pages × phone/desktop × light/dark + a guest exam end to end; deploy is blocked if it fails)* |
| Error tracking (Sentry free tier) | ✅ *(lazy-loaded, errors only, PII stripped — step 9)* |
| Product analytics (Cloudflare Web Analytics, cookieless) | ✅ *(step 9)* |
| Supabase idle-pause keep-alive (scheduled ping) | ✅ *(`keepalive.yml` → `/api/health` every 3 days)* |
| Worker CPU budget: prerendered pages + static dataset served without the Worker (fixes Error 1102) | ✅ |
| Database backups: scheduled `pg_dump` (GitHub Actions, free) kept as encrypted artifacts; restore tested | ✅ *(weekly + on demand; first run 28 Sep succeeded; restore steps in the runbook)* |
| Performance pass: no hydration warnings or layout shift, code-split heavy AI/analytics modules, lazy images, long lists virtualised | ✅ *(CWV budget script; public pages are static server components with CSS-only chart motion; all key pages within budget)* |
| Migration + cache-version strategy documented (backward-safe migrations, SW cache versions) | ✅ *(docs/TECHNICAL_REFERENCE §6.1, §5.1)* |

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
| GitHub Actions CI/CD (auto-deploy on push to `main`) | ✅ *(27 Sep: push to main → checks → deploy → live smoke test; every deploy since has gone through it)* |
| Rollback path documented and tested | ✅ *(drill 28 Sep: `wrangler rollback` to the previous build and back, seconds each; runbook in TECHNICAL_REFERENCE)* |

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
| All 975 questions render identically from Postgres as from the JSON | ✅ *(by design: question text is served from the answer-free static bank on the CDN — cheaper and offline; Postgres holds keys + attempts; seed + `check:keys` keep them identical)* |
| Practice mode works fully offline after first sync | ✅ *(IndexedDB first, cloud sync second — tested 28 Sep)* |
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
| Route protection enforced in **middleware** (not page components) | ✅ *(/profile → /login?redirect=)* |
| "Sign out everywhere" on credential change | ✅ *(changing the password signs out every other device)* |
| No delete-account control anywhere in the UI | ✅ |

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
| Subject leaderboards locked for guests | ✅ *(guests see a sign-in lock on subject / college boards)* |
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
| Username profanity list | ✅ *(English + Hindi/Hinglish blocklist in `lib/username.ts`, shared by the form and the server check)* |
| Display name used for greetings across the app | ✅ |
| Stats section (accuracy, attempted, streak, hours, tests, mistakes mastered) | ✅ |
| Achievements section (15 badges from real progress, "New" chip) | ✅ |
| Dynamic Exam Goals Engine: target rank → marks → coverage → recommended focus % + topics, honest feasibility, "Apply" + "My goal" preset | ✅ *(`npm run check:goals` proves AIR 100 vs AIR 5000 recommend different topic sets)* |
| Target year drives countdown and every "GATE <year>" label; rolls forward after each exam | ✅ |
| Target branch: CSE live, others Coming Soon and non-selectable | ✅ |
| Daily hours size the daily question target and the time check | ✅ |
| Daily hours drive reminder cadence and a "you are N hours behind" signal | ✅ *(goal plan: this week's test hours vs daily hours × study days, with a catch-up suggestion)* |
| Closed loop: each graded attempt re-derives the recommended focus band | ✅ *(every submitted attempt updates measured accuracy, which the goal plan reads)* |
| Preferences section (theme, default duration, notifications, reduced motion) | ✅ *(theme, motion System/Reduced/Full, study-reminder switch; default duration n/a — tests use official durations)* |
| Account section (email/phone, linked providers, active devices, export my data) | ✅ *(email + sign-in methods, change password, JSON export, active devices)* |

### 4F · P0 · Per-User Isolation & Device Sessions

| Task | Status |
|---|---|
| Per-user IndexedDB namespace (`IDBManager.setActiveNamespace`) + `resetAllStores()` — verified live | ✅ |
| Wired into real sign-in/sign-out (`AuthListener`) incl. a fixed guest-first-load regression | ✅ |
| Explicit two-account test: account B sees zero data from account A, and all 10 stores reset | ✅ *(`scripts/check-isolation.mjs` — passes 28 Sep)* |
| Device sessions table + Active Devices list | ✅ *(migration 0005; heartbeat on load/5 min/tab focus)* |
| "Sign out this device" / "sign out everywhere" | ✅ *(per device, all others, everywhere — tested across 3 sessions; remote device signs itself out + wipes downloads)* |
| Idle expiry; forced re-auth on credential change | ✅ *(30 days unused → signed out on that device; password change revokes the other devices)* |

### 4G · P0 · API Hardening

| Task | Status |
|---|---|
| `/api/ai/generate` zod validation + server-owned instruction enum | ✅ |
| Rate limiting + origin check (previously missing entirely) | ✅ |
| Supabase JWT required on `/api/ai/generate` (401, no Gemini call, for guests) | ✅ |
| Per-user daily AI quota in Postgres | ✅ *(atomic `consume_ai_call`, 30/day, IST reset; live)* |
| Server-side prompt-hash response cache | ✅ *(`ai_response_cache`; cache hits cost no quota; live)* |
| Turnstile on signup/login/reset | ✅ *(live; Supabase Captcha protection on; verified by you in a real browser 26 Sep. OTP gets it when OTP is built)* |

### 4H · P1 · Multi-Branch Teaser & Waitlist

| Task | Status |
|---|---|
| Branch selector (Profile → Exam Goals) with CSE live, 5 Coming Soon, non-selectable | ✅ |
| "Notify Me" waitlist capture (guests: email; members: user id) | ✅ *(/api/waitlist: validation, honeypot, rate limit, dedupe; migration 0006 removed the open insert policy)* |
| Internal waitlist counts (prioritises Release 8) | ✅ *(GET /api/waitlist; shown on landing pages from 25+)* |
| Branch landing pages for SEO (`/gate-ece`, `/gate-da`, …) | ✅ *(6 static pages, FAQ JSON-LD, sitemap.xml + robots.txt)* |

### 4I · P2 · Cloud Sync

| Task | Status |
|---|---|
| Sync status model (Offline/Pending/Syncing/Synced/Conflict/Failed) + indicator | ✅ *(Profile → Data & storage)* |
| Conflict rules (LWW prefs, union bookmarks, max counters, server wins on scores) | ✅ *(newest edit wins, counters never go down, mastered sticks, finished tests never overwritten, tombstones delete)* |
| Durable sync queue with backoff; "Sync now" | ✅ *(per-account queue survives reloads/offline; exponential backoff; two-browser test passes)* |
| "Export my data (JSON)" | ✅ *(Profile → Data & storage; /api/account/export + local data)* |

### 4J · P0 · Calibration Data Foundation *(makes predictions accurate)*

| Task | Status |
|---|---|
| Qualifying cut-offs, candidates appeared, GATE score formula & normalisation constants | ✅ *(cut-offs 2023–2026 all categories; appeared 2024–2026; Sq/St/Mq per year, Mt 2024; 2023 appeared unknown → null)* |
| Versioned `calibration/<branch>/<year>.json` + `calibration/SOURCES.md` source/licence ledger | ✅ *(data/calibration/cse/2023–2026.json; `npm run check:calibration` in CI)* |

## RELEASE 5 — Exam Integrity

### 5A · P0 · Answer Key Withholding

| Task | Status |
|---|---|
| Public/private split logic | ✅ *(dataset-split.ts retired: answers stripped at build in copy-static-data.mjs; keys only in Postgres)* |
| Answer-free public payload | ✅ *(public/data/questions.json has no answer fields; `/api/dataset` removed)* |
| Live graded exam UI uses the public payload (no answer fields in network, IndexedDB or memory) | ✅ *(keys unlock only after submit via /api/exam/grade, or per question on practice screens via /api/answers)* |
| Visible **Graded** vs **Practice** badge | ✅ *(exam header, desktop widths)* |
| Offline graded attempts queued and shown "Pending evaluation" | ✅ *(amber pending state + auto-retry on reconnect; never counted as wrong)* |
| CI check that no answer field appears in a graded attempt | ✅ *(build fails if an answer field reaches the public bank)* |

### 5B · P0 · Server-Authoritative Evaluation

| Task | Status |
|---|---|
| `/api/exam/grade` server-side grading endpoint | ✅ |
| Attempt token (server start time/duration, tamper-proof timer) | ✅ *(/api/exam/start: server start time, question set, server-computed limit)* |
| Live exam session wired to submit-for-grading instead of self-grading | ✅ *(attempt stored in exam_attempts/exam_responses for signed-in users)* |
| Server validation on submit (open, in time + grace, matching question set, not already submitted) | ✅ *(attempt token: server start + limit + question set; over-time / mismatch / no-token flags; re-submits can't overwrite)* |
| Idempotent submissions; late-submission grace window | ✅ *(idempotent on attempt id; 10 min grace for practice, 2 min for mocks; mock results held until results time)* |
| 100-attempt server-vs-client score regression suite | ✅ *(`npm run check:score` — 100 random attempts incl. NAT edges, multi-answer MCQs; all agree exactly, 28 Sep)* |

### 5C · P1 · Attempt Integrity Signals

| Task | Status |
|---|---|
| Tab-blur / timing-anomaly / concurrent-attempt signals (graded only, shadow-flag first) | ✅ *(tab switches, fullscreen exits, over-time, long pause, rapid answers, question-set mismatch, no start token — flags only)* |
| Disclosure notice before graded attempts | ✅ |
| Flagged attempts excluded from leaderboards, never deleted | ✅ *(only disqualifying flags exclude — migration 0015; informational flags never cost a rank)* |
| Warn on each exit from the exam window; auto-submit + disqualify on the 5th (mocks and practice) | ✅ *(28 Sep)* |

### 5D · P1 · Question Bank Protection

| Task | Status |
|---|---|
| Per-account fetch-volume limits + anomaly alerts | ✅ *(800 answer keys / account / day, counted in Postgres; over the cap → refused till midnight IST and logged `answer_cap_reached` for review)* |
| ToS clause prohibiting scraping/redistribution | ✅ *(Terms §Acceptable use)* |

### 5E · P1 · Leaderboards & All-India Test Series

| Task | Status |
|---|---|
| Scheduled All-India mock tests; server-computed percentile/AIR | ✅ *(Sundays 10:00–13:00 IST, 30-min entry grace, exactly 180 min, results 13:45; same paper per person in a different order — GA first, then Maths + Core mixed; one attempt each)* |
| Leaderboards (All-India/subject/college/friends), opt-in with privacy toggle | ✅ *(All-India Mock, weekly Practice, by subject, my college, Weekly Challenge; display choice anonymous / username / username + ID)* · friends board 🟠 **Later — Release 9C** |
| Streaks, weekly challenges, topic ladders | ✅ *(streaks; Weekly Challenge with its own board; topic ladders Bronze→Diamond on Analytics)* |
| Shareable result cards | ✅ *(28 Sep: mock scorecard + practice results → PNG card via share sheet / download; name follows the leaderboard display choice)* |

## RELEASE 6 — Monetization I: Content Engine & Advertising

### 6A · P1 · Content & Programmatic SEO Engine

| Task | Status |
|---|---|
| Public, server-rendered `/about` landing page | ✅ |
| Per-question pages, subject hubs, topic pages, PYQ year pages, syllabus page | ✅ *(/pyq, 15 papers, 975 questions, 18 subject hubs, /gate-cs-syllabus with real past-paper weightage per section — all prerendered)* |
| Editorial content (strategy, cut-off analysis, study plans) | ✅ *(`/articles/gate-cs-preparation-150-days` data-driven strategy, `/tools/gate-cs-cutoff` cut-off analysis, `/tools/gate-study-plan`; more articles are ongoing content work)* |
| Free tools (rank predictor, score / normalisation calculator, college predictor) | ✅ *(score calculator + rank predictor with live marks-vs-rank curve)* · college predictor 🟠 **Later — Release 8** *(needs official CCMT/COAP round-wise closing scores imported from their PDFs; no guessed cutoffs)* |
| More free tools from the marketing plan: cutoff tracker, marks-vs-rank tables, days-left countdown, study-plan generator | ✅ *(`/tools/gate-cs-cutoff`, `/tools/gate-study-plan` — countdown + weightage-based week-by-week plan with weak/strong sections)* |
| Auto-generated articles from our tags ("Most repeated topics 2015–2026", "How to prepare for GATE CS in 150 days") | ✅ *(`/articles/most-repeated-gate-cs-topics` + `/articles/gate-cs-preparation-150-days`, both computed from the bank and refreshed with it)* |
| Public PYQ page shape: `/pyq/cs/<year>/q<n>-<slug>` with a solution preview and "Practise this in the simulator" | ✅ *(`/pyq/gate-cs-<year>-<shift>/q<n>`; official answer on demand via the rate-limited route — never in the HTML; practise CTA; related questions; breadcrumb structured data)* |
| Technical SEO (sitemap, robots, canonicals, OG cards, structured data, CWV budget) | ✅ *(sitemap, robots, canonicals, OG meta + site-wide OG image `app/opengraph-image.tsx`, breadcrumb/FAQ structured data; CWV budget `npm run check:cwv` — all key pages LCP < 1.3 s, CLS < 0.01 on a phone viewport)* |
| Sitemap submitted; indexing confirmed in Search Console | ✅ *(submitted and indexing requested 28 Sep; re-submit after the eu.org domain switch)* |

### 6B · P1 · Legal Pages & Ad Network Onboarding

| Task | Status |
|---|---|
| Privacy Policy (incl. Google user data section) | ✅ |
| Terms of Service | ✅ |
| About page | ✅ |
| Contact page | ✅ *(/contact)* |
| Disclaimer ("not affiliated with any IIT or the GATE organising institute") | ✅ *(/disclaimer, incl. §7 sponsorship/affiliate disclosure)* |
| Refund & Cancellation Policy | ✅ *(/refunds; final review with payments in Release 7)* |
| Cookie Policy | ✅ *(/cookies)* |
| Privacy Policy names 5C integrity signals and the 4C anonymization path | ✅ *(privacy §§ on integrity signals and the anonymise-on-delete path)* |

### 6C · P1 · Ad Placement Architecture

| Task | Status |
|---|---|
| `<AdSlot>` component (tier-, route- and consent-aware; reserved height; lazy) | ✅ *(29 Sep: `SponsorSlot` — vetted network first (EthicalAds, env-gated), instant adblock detection (bait element + script-load failure + 3 s no-fill check) swaps to a first-party, subject-matched house promo in the same reserved box; CLS 0.000; public pages only; tier-aware with Release 7)* |
| Zero ads in exams, auth and checkout; zero for ad-free tiers | ✅ *(ads can only render on /pyq, /topics and /tools pages; ad-free tiers arrive with Release 7)* |
| Service worker excludes ad scripts from caching | ✅ *(the service worker only handles same-origin requests; ad scripts are cross-origin)* |

### 6D · P1 · Practice Question Bank (beyond PYQs)

| Task | Status |
|---|---|
| "Report an issue" on every question; 24-hour fix target for accepted reports | ✅ *(Flag button on public question pages, results review, mistakes and revision sessions → `/api/report` → `question_reports` (migration 0018); 24-hour triage target)* |

## RELEASE 7 — Monetization II: Pay-Per-Exam & Anti-Misuse

### 7A · P1 · Tier & Entitlement Model

| Task | Status |
|---|---|
| Entitlements stored server-side (`profiles.entitlements`), re-checked on every gated action | ✅ *(`entitlements` table + `is_pro()` (migration 0019); `getEntitlement()` fails closed to free; `/api/billing/me`; `useEntitlements()` is display-only)* |
| Pricing tiers implemented (Free / ₹29 / ₹49 / ₹99 / ₹199) | ✅ *(Free · Plus ₹29/mo ₹249/yr · Pro ₹99/mo ₹799/yr in `lib/billing/plans.ts`; honest strike-throughs; prorated Plus→Pro upgrade (migration 0022); premium sections gated by tier)* |
| Entitlement check inside the grading call | ✅ *(the only paid perk today — the AI daily quota — is re-checked server-side on every `/api/ai/generate` call: 30 free / 150 Pro)* |
| Upgrade path on the results screen; warm upsell at quota limits; bundling nudge after 3 purchases | ✅ *(Plans page, results nudge, account menu, AI-quota message, locked sections with upgrade cards, Plus→Pro upgrade box · bundling nudge 🟠 at go-live)* |

### 7B · P1 · Payments — Razorpay

| Task | Status |
|---|---|
| Razorpay account created, KYC approved, activated | ✅ *(ahead of schedule)* |
| UPI-first checkout wired into the app | ✅ *(Razorpay test mode live 30 Sep; Plus purchase + prorated Pro upgrade verified end-to-end by the owner — order → payment → signed webhook → tier; confirm step with Turnstile)* |
| Webhook handling (signature-verified, idempotent; sole source of truth) | ✅ *(`/api/billing/webhook`: HMAC-SHA256 over raw body, event-id idempotency table, `apply_paid_order()` flips an order once; the only path that grants Pro)* |
| No-refund policy shown at checkout (acknowledgement), on Razorpay, and on the policy page — with the enforceable renewal wording | ✅ *(confirm window: price, credit, no auto-renew, no-refund lines + required agreement; server enforces `acceptedTerms`; /refunds + Terms §7)* |

### 7C · P1 · Subscription & Purchase Abuse Prevention

| Task | Status |
|---|---|
| Velocity limits, card-testing detection, disposable-email blocking | ✅ *(per-IP 5/10 min + per-account 5/hour order limits, disposable-email block, amount always server-side)* |
| Turnstile on checkout | ✅ *(server-side siteverify on order creation; mandatory in live mode — needs `TURNSTILE_SECRET_KEY`)* |

### 7D · P1 · Account-Sharing Prevention

| Task | Status |
|---|---|
| Two-device limit on paid entitlements with a device chooser | ✅ *(paid accounts: 2 active devices; new device gets a chooser to sign one out; paid AI allowance only on registered devices)* |
| Concurrent-session detection; device-change cooldown | ✅ *(max 4 new devices / 30 days for paid accounts, then free-plan-only on new devices)* |

### 7E · P2 · Referral & Growth Loops

| Task | Status |
|---|---|
| Referral credits (both sides) | ✅ *(hardened, migration 0021: 1 day Plus + 15 AI credits / friend 10 credits; 2 active days, no shared device, 3/month, 10 total)* |
| Telegram channel + daily-question bot | ✅ *(channel + bot live 30 Sep; daily 08:00 IST GitHub Action posts the question of the day)* |

## RELEASE 8 — Multi-Branch Expansion & Revenue Diversification

### 8C · P1 · Multi-Branch Data Acquisition

| Task | Status |
|---|---|
| EC 2026 transcribed by Claude, 27 figures eye-checked, 65/65 validated → `data/pyq/EC/gate_ec_pyqs.json` | ✅ *(untagged; in-app render check pending — Q7 table)* |
| EC 2025 transcribed by Claude, 42 figures, 65/65 validated, 130/130 EC render-clean | ✅ *(bank now in the exact CS `Aggregated_Output.json` format; provenance in `gate_ec_pyqs.meta.json`)* |
| EC 2024 transcribed by Claude, 32 figures (explicit crops: the 2024 PDF carries a full-page watermark), 65/65 validated, EC bank 195/195 render-clean | ✅ |
| EC 2023 transcribed by Claude, 39 figures, 65/65 validated | ✅ |
| EC 2022 transcribed by Claude, 33 figures eye-checked, 62/65 auto + 3 reviewed (text-layer glyph artefacts); EC bank 325/325 render-clean | ✅ |
| EC 2021 (scanned PDF) transcribed by Claude as text from the page images, 26 figures cropped, every question eye-checked and approved in review; EC bank 390/390 render-clean (2021–2026 complete) | ✅ |
| EC subject/topic/difficulty tagging (2021–2026), all 390, by Claude from the hand-curated official syllabus (`data/pyq/EC/syllabus.json`, `tags/*.tsv`, validated by `tagcodes.py`); future branches are tagged during transcription | ✅ |

## RELEASE 9 — Product Depth & Controlled Community

| Module | Task | Status |
|---|---|---|
| 9B | Streaks | ✅ |
| 9B | Badges on the profile | ✅ *(15 achievements)* |

---

# Shipped items from the dated batches (7–17 Oct 2026)

## UI fix batch (2026-10-07) — c70d780
- [x] Exam fullscreen arrows hidden until edge hover/tap, swipe left/right navigates
- [x] Palette: top spacing; no By-section toggle for single-section tests
- [x] Focus Target header compact; Pro modal close X; profile + hamburger menus close on outside click
- [x] Results: one full-width flip card (scoreboard / grid + breakdown), fits one screen, 2x2 actions on mobile
- [x] /tools lists every tool; tools dock scrolls the open tool into view
- [x] Branch chip moved next to profile, no arrow, hover effects; dimmer theme-aware scrollbar; stopwatch timer icon
- [x] Migration 0030_phone_lock.sql (done by you)
- [x] Migration 0029_da_live.sql (done by you)
- [x] Share result (link or card): built 10 Oct

### Done (shipped; live unless noted)
**Money**
- [x] Live Razorpay payments (instant verify + signed webhook + hourly reconcile), season pass with exam-year picker priced from the server clock, prorated Plus→Pro, billing history + printable receipts, "I paid — check", payment-received message on Telegram
- [x] Coupons: server-validated codes (percent or flat, once per member, use limit, expiry, plan list), coupon box in the confirm window, discount on the receipt (needs migration 0036)
- [x] Money scripts: `scripts/refund.mjs` (refund + end plan), `scripts/billing-report.mjs` (by month, plan, coupon)
- [x] Plan-ending reminders (app and Telegram); upgrade prompts open the Plans window in place; Cashfree vs Razorpay research (keep Razorpay, revisit 1 Jan 2027)
**Study Planner** (docs/STUDY_PLANNER_FEATURES.md)
- [x] Free planner for every branch, exam date automatic, exact hours per section (Plus/Pro)
- [x] Add to Study Planner: free-time windows per weekday, rest days, single-date changes, templates (Pro), phases, replace old plan, optional Telegram reminders
- [x] My plans: named sets with progress, remove unfinished or whole plan; Change a day; Telegram status; missed blocks asked once a day; Pro re-plan, re-plan around weak topics, what-if
- [x] How your plan is going (this week, so far, whole plan; Pro on-track/at-risk), today's blocks on the dashboard with Start timer, study timer labelled by subject, spaced reviews at 1/3/7/14 days, add upcoming mocks, calendar export (.ics)
**Telegram** (docs/TELEGRAM_INTEGRATION.md)
- [x] Link, channel + group check, mobile verification, commands (/today /timer /alarm /alarms /cancel /digest /verify /ask /status /help /unlink)
- [x] Free: countdown, mock results, 1 timer · Plus: block reminders (Done/+15), digest, 3 alarms, mock-starting, streak reminder, quiet hours, plan-ending · Pro: evening roll-forward, weekly report, 10 alarms/timers, /ask the AI Mentor
- [x] Two-way calendar sync, simple-English plan comparison with ticks, animated plane, join cards hide when joined, privacy policy updated
**Product and content**
- [x] Syllabus for every branch (progress badges with show/hide, Where-to-start), Checkpoint quizzes, GATE updates, syllabus hub, branch-aware most-repeated topics
- [x] Topic browser (/browse, search), time-split tips on Mocks, Beat my score (challenge link, `/challenge`, comparison on results), diagnostic goals saved to the profile (needs migration 0036)
- [x] Calculator with the official GATE keys and layout, live result row; bottom tab bar with More sheet; Today card + missions; diagnostic onboarding; fresh 65-question mock; install prompt; avatar picker in onboarding
- [x] Server-time clock in the UI; fixes: purchase modal, results card, AI Mentor reveal, theme icon, profile menu, mobile topbar

### Done in this batch
- [x] Fullscreen Exit button fixed (edge arrows no longer cover the corner buttons); Share result menu (link or card, L-3); weekly benchmark card; Pro weak-topic Telegram nudge; General Aptitude lessons (/ga-lessons); official GATE 2026 cut-offs and score calculator for CS, EC, EE, ME, CE, DA (/tools/gate-branch-cutoffs)

### Done 14 Oct
- [x] Payment check no longer spins for ever (widget rebuilds, "Try again" after 12 s)
- [x] Clipped card shadows fixed on Practice; Generate blueprint glides to the blueprint card
- [x] Practice: Section then Subject, and Section then Subject then Topic drop-downs
- [x] Phone exam header: no timer icon, Submit fully visible
- [x] More sheet: draggable down, bottom tab bar no longer blurred; profile save bar sits above the tab bar
- [x] Mock reminders for everyone, every plan: 1 day before, 5 PM the evening before, 30 minutes before, results out
- [x] Onboarding finishes with Telegram link, channel and group join, and mobile verification
- [x] Shared aptitude and overlapping maths (Linear Algebra, Calculus, Probability) for every branch, tagged with year and origin paper; official papers and the weekly challenge unchanged
- [x] CS-IT question audit: scripts/validate-question-bank.mjs (structure) and scripts/compare-keys-to-bank.mjs (694 MCQ/MSQ keys in the database equal the source, 0 differences)
- [x] Docs: INFLUENCER_OUTREACH_MESSAGES, PROMO_VIDEO_MASTER_PROMPT, SOCIAL_AUTOMATION_PLAYBOOK, BUSINESS_EMAIL_STRATEGY

### Promo film v3 (15 Oct, 4K)
- [x] Research (premium launch films, edtech hooks, the reference video), new problem statement from official numbers, natural voice (Kokoro), brief updated (V3)
- [x] Frame-accurate 4K simulation of the real app, signed in (demo account with Pro), beat-synced edit with callouts and loupe; Plus/Pro highlighted; New and Coming next beat

### Promo film (15 Oct, v1, superseded)
- [x] One merged brief: docs/PROMO_VIDEO_MASTER_PROMPT.md (the three enhanced prompts folded in; the only promo doc)
- [x] Remotion project video/: animated re-creations of the real screens (not screenshots or raw video), 16:9 master plus 45, 30 and 15 second cuts, voiceover, generated music and effects, captions, CTA
- [x] Stills of every scene and the audio level checked; camera framing and loudness fixed after review

### Needs you
- [x] **Run migration `0037_weekly_benchmark.sql`** (done) (weekly benchmark and weak-topic columns)
- [x] Done by you: Telegram setup, PREGEN_SECRET, migrations 0029 / 0030 / 0033–0036, bot rename, the real Rs 29 payment

### Waiting (your call)
- [x] Subscriptions and gift passes: not needed (decided 10 Oct). Coupons stay built but unused; refund script not needed; Razorpay is the only gateway
- [x] Planner: Print plan button and 25/5 focus rounds on the study timer (done)
- [x] "What you missed" note after a Checkpoint (done). No planner extras left open

### On hold (by you)
- [x] PYQ extraction for CE (17 Oct: 780 questions, live)
