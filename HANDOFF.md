# HANDOFF — RENYXERA (GATE OS)

**Written:** 22 October 2026, for a fresh Claude account/session with no prior context.
**Read with:** `CLAUDE.md` (auto-loaded rules), `checklist.md` (the single live task list), `handover/MASTER_PROMPT.md` (the full brief), `handover/memory/` (standing notes).
No secrets are in this file. Secrets live only in `.env.local` (local, git-ignored), Cloudflare Worker secrets and GitHub Actions secrets.

---

## 1. Project overview

### What it is
**RENYXERA** ("A new ERA of intelligent learning") is a GATE exam-preparation web app for Indian engineering students. Internal/old name: **GATE OS**.
Live: **https://gate.renyxera.workers.dev** (no custom domain yet, by decision).
Repo: `D:\0-UI\r2ma-stable` — GitHub `justforpersonal7771-design/RENYXERA`, branch `main`. Pushing to `main` deploys.
Owner: Adil Awais Khan (non-developer product owner; Claude does all engineering).

### Goal
The best place to prepare for GATE: practise every official past paper in an exam-identical interface, get graded exactly like GATE, see what went wrong, revise it, and track progress to a goal rank — then monetise through Plus/Pro plans, a separate paid study-materials product, original "Forge" GATE-level questions and (later) ads, all on a **₹0 running budget** until revenue exists.

### Core loop
practise real questions → server-graded with official GATE rules → results + review → mistakes/bookmarks/revision → analytics and goal tracking → AI Mentor/Tutor help → weekly All-India mock.

### Branches (GATE papers) live
CS (975 Qs, 2017–2026, fully verified against official papers), EC (390), EE (390), ME (520), CE (780), DA (195). **No more branches for now** (owner decision, 18 Oct 2026). Shared aptitude/maths questions are cross-linked across branches.

### Stack
| Layer | Tech |
|---|---|
| Framework | Next.js 15 (App Router) + React 19, TypeScript 5.9 |
| Styling/motion | Tailwind CSS v4, `motion` (Framer Motion 12), clsx/tailwind-merge/cva |
| State / local data | Zustand stores; IndexedDB via `idb` (local-first, offline) |
| Maths/markdown/charts | better-react-mathjax (MathJax), react-markdown + remark-gfm, react-syntax-highlighter, Recharts |
| Auth + DB | Supabase (Postgres + RLS, email + Google OAuth), `@supabase/ssr` |
| AI | Google Gemini via `@google/genai` (server-side only, quota + cache) |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` + Wrangler; static assets on Cloudflare CDN |
| Security | Cloudflare Turnstile, RLS, origin checks, rate limits, server-authoritative grading |
| Payments | Razorpay (live), fixed-period plans + season pass, coupons, receipts |
| Monitoring | Sentry (browser, errors only), Cloudflare Web Analytics |
| Automation | GitHub Actions (CI/deploy, backups, keep-alive, AI pre-generation, billing reconcile, Telegram, Instagram/social) |
| Video | Remotion 4 project in `video/` (promo film), Kokoro TTS voice |
| Content pipeline | Python (PyMuPDF/`fitz`, Pillow, numpy) scripts in `scripts/pyq/` |

### Architecture (three trust zones)
- **Browser (PWA):** all UI, local engines, IndexedDB (study data, answer-key cache, encrypted Downloads vault), service worker (`public/sw.js`). Question bank is a static, **answer-free** JSON per branch on the CDN.
- **Worker (server):** `/api/*` routes, middleware, SSR/prerendered pages. Only the Worker holds the service-role key and Gemini key; it grades, unlocks answers, rate-limits.
- **Postgres (Supabase):** source of truth for accounts, private answer keys (`question_answers`, no RLS policies), attempts, mocks, leaderboards, billing, Telegram, events. Browser reads only its own rows through RLS.
Full detail: `docs/TECHNICAL_REFERENCE.md` (architecture diagrams, tables, API list, runbook).

### Folder structure
```
app/
  (dashboard)/   signed-in + guest app: / (dashboard), setup, exam/{session,results,review,diagnostics},
                 mocks, fresh-mock, challenge, checkpoint, browse, (review)/{mistakes,bookmarks,revision},
                 analytics, ai-mentor, ai-tutor, calendar, downloads, profile, pro, receipt
  (auth)/        login, signup, reset-password
  (marketing)/   about, [slug] (branch pages /gate-cse… and syllabus pages), pyq, topics, syllabus,
                 gate-cs-syllabus, gate-updates, gate-2027-changes, ga-lessons, articles, tools
  (legal)/       privacy, terms, cookies, refunds, disclaimer, contact
  api/           account, ai, answers, billing, daily, devices, events, exam, health, image-manifest,
                 report, rewards, telegram, time, username, vault, version, waitlist
  r/             referral redirect;  auth/callback;  layout.tsx, sitemap.ts, robots.ts, opengraph-image.tsx
components/      ads, analytics, auth, billing, branch, brand, dashboard, exam, growth, layout, marketing,
                 planner, profile, seo, share, system, ui
lib/             grading.ts, calibration.ts, branches.ts, social.ts, site.ts, billing/plans.ts (tiers/prices/limits),
                 ai/, analytics/, exam/, goals/, learning/, planner/, repository/ (bank loading, AST parser,
                 answer keys, IndexedDB), seo/, security/, server/, supabase/, sync/, telegram/, vault/, devices/ …
store/           Zustand stores (auth, exam, exam-runtime, data, study, analytics, calendar, todo, ui, prefs, toasts…)
types/           shared TS types
data/            Aggregated_Output.json (CS bank source), pyq/<BRANCH>/ (other banks, transcriptions, tags,
                 keys, reports), calibration/<branch>/<year>.json + SOURCES.md, image-manifest.json
public/          static assets, brand/ (logos, wordmark, branch logos), og/ (social cards), images/<year-shift>/,
                 data/ (GENERATED answer-free banks), sw.js, manifest
scripts/         seeding, checks, schedulers, Telegram/social publishers, make-og.py, pyq/ pipeline, fonts/
supabase/        migrations 0001…0039 (+ SCHEMA.sql built from them)
video/           Remotion promo film (src/Film4.tsx, Root.tsx, timeline, voice/music scripts, out/ = renders, not in git)
docs/            strategy and reference docs (index: docs/README.md); study-materials/ (plan; notes/ git-ignored)
archive/         finished work (COMPLETED.md), old checklist, old docs and handovers
handover/        HANDOVER.md, MASTER_PROMPT.md, 01-NEW-PC-SETUP.md, memory/ (Claude notes to restore)
logo/            owner-supplied branch logos (CSIT, EC, EE, ME, CE, DA) used for cards/branch pages
.github/workflows/ ci, ai-pregen, backup, billing-reconcile, keepalive, social-check, social-publish,
                 telegram-daily, telegram-dispatch, telegram-hub, telegram-setup
```

---

## 2. Current state (22 Oct 2026)

### Done and live
- **Platform:** Cloudflare Workers deploy via CI on push to `main` (checks → deploy → smoke test); rollback drill done; weekly encrypted DB backups; keep-alive; Sentry; Web Analytics; PWA + offline; stale-deploy guard; version watch.
- **Identity:** email + Google sign-in (Turnstile), onboarding (diagnostic, avatar, Telegram link), permanent student ID, username rules, profile, preferences, devices (sign out per device/everywhere), export data, guest mode with gates, guest → account migration, per-user IndexedDB isolation, cloud sync.
- **Exam engine:** official-style interface, full papers/section/subject/topic/custom tests, GATE calculator, palette, fullscreen with integrity signals, server-authoritative grading (`/api/exam/start`, `/api/exam/grade`), answer keys only server-side, results flip card, review, share result card, "Beat my score" challenge links, fresh 65-question mock, checkpoint quizzes.
- **Learning:** mistakes bank, bookmarks, revision, analytics (topic ladders, streaks, achievements), goals engine with calibration data (cut-offs, normalisation, marks↔rank estimates labelled), Today card + missions, weekly benchmark, study planner (free + Plus/Pro automation, Telegram reminders, spaced reviews).
- **AI:** AI Mentor + AI Tutor (8 coaches), Gemini quota per tier (Free 0, Plus 75/day, Pro 150/day), response cache, background pre-generation of HINT/SHORTCUT/EXPLAIN (`/api/ai/pregen` + Action), AI-generated GATE-level practice sets gated by plan (Plus 5 sets/day, Pro unlimited, Free none; migration 0039).
- **All-India mocks + leaderboards:** Sunday mock engine, embargo, fair ranking, branch leaderboards, privacy display choice, weekly challenge. *(New mock scheduling is ON HOLD until Forge exists — see decisions.)*
- **Money:** Razorpay live (instant verify, signed webhook, hourly reconcile), Plus ₹29/mo · ₹249/yr, Pro ₹99/mo · ₹799/yr, GATE season pass priced from server clock, prorated Plus→Pro, coupons (built, unused), receipts, billing history, plan-ending reminders, refund/billing scripts. First real payment received.
- **SEO/content:** 6 branch landing pages (keyword titles, FAQ JSON-LD incl. Telegram FAQ, branch logo), public PYQ pages per question (any-branch official-answer reveal fixed 18 Oct), subject/topic hubs, syllabus pages per branch, GATE updates/2027 changes, GA lessons, articles, free tools (score calculator, rank predictor, cut-offs, study plan, branch cut-offs), sitemap/robots/canonicals, Organization + WebSite JSON-LD with `sameAs`, per-branch social cards `public/og/*` (final style approved).
- **Sharing:** share-as-image card with consented personalisation (name, username, student ID, avatar) — `components/growth/share-card.tsx`, in the profile referral card; referrals with AI-credit rewards.
- **Telegram:** bot with commands, linking, reminders; hub channel (updates only: GATE 2027 facts, Monday countdown, Saturday mock reminder) via `telegram-hub.yml`; 6 branch channels `@renyxera_gate_cs/_ece/_ee/_me/_ce/_da` each get their own daily PYQ with the answer as a tap-to-reveal spoiler via `telegram-daily.yml`; discussion group with topics; folder link `https://t.me/addlist/fY_dvTl36FA3ZTQ1`. Owner confirmed setup through step F works.
- **Instagram/social automation:** publisher + scheduler + calendar + `social-check` workflow built (`scripts/social-publish.mjs`, `content/calendar.json`).
- **PYQ data:** all six branches transcribed, tagged, keyed, seeded. CS fully re-verified (keys + wording + figures) against official PDFs 2017–2026.
- **Promo film v8 (Remotion):** `video/out/renyxera-film-v8-4k.mp4` (landscape 4K), `renyxera-film-v8-vertical-1080.mp4` (31.6 MB, Instagram-ready size), `renyxera-film-v8-vertical-4k.mp4`. Four plain transitions, "Start now" CTA, tagline under wordmark, tooltips kept in frame. **Not yet watched end-to-end by Claude or the owner.**
- **Docs:** reorganised (17 Oct): `checklist.md` live list, `archive/COMPLETED.md` for history, `docs/README.md` index; Forge design + entitlements; study-materials plan (00–12); Telegram multi-branch + SEO; Telegram Premium; Instagram setup; open decisions file.

### In progress / half-finished
- **Film hand-over:** renders exist; need a frame check of the vertical cuts and owner review → YouTube upload → owner sends video id → set `NEXT_PUBLIC_PROMO_YT_ID` (click-to-play poster component `components/marketing/promo-video.tsx` already wired into signed-out welcome + Plans).
- **Share card:** built but not browser-tested; only in profile referral card (not yet on results/question share rows).
- **Forge:** designed (`docs/FORGE_DESIGN.md`, `docs/FORGE_ENTITLEMENTS_AND_SETUP.md`); only the AI practice-set gate exists. No Forge tables, scripts, questions or screens yet. Blocked on owner decision F1.
- **Study materials:** plan complete (`docs/study-materials/00…12`), nothing built. Blocked on owner decisions S1 (pricing) and S4 (reviewer).
- **Instagram:** code ready; owner must do `docs/instagram/01-SETUP.md`.
- **Telegram Premium extras:** steps written (`docs/telegram-premium/`); code for bot deep links/Mini App menu and story images not built (needs owner's BotFather step).

### Broken / suspect / to verify
- Markdown pipe tables in question text once rendered as raw text (`GATE_CS_2025_AN_Q8`); a table extractor now exists (`lib/repository/transformers/table-extractor.ts`) — **verify** it renders.
- `components/exam/exam-timer.tsx` falls back to a hard-coded 3 h when no draft exists (low priority).
- Dead code: unused `design-system/*` (if present) and duplicate `PersonalNotesDrawer` (low priority).
- Working tree on 22 Oct: owner deleted the `docs/og-*.png` option sheets (unstaged deletions) and dropped zip files in `docs/` (`instagram.zip`, `study-materials.zip`, `telegram-premium*.zip`) — confirm with owner before committing either.

---

## 3. Decisions & reasoning (with rejected options)

| Area | Decision | Why / rejected |
|---|---|---|
| Budget | Everything on free tiers; any cost > ₹100 one-time goes to the paid backlog until revenue | Owner cannot spend. Rejected: Vercel Pro, R2 (needs card), Firebase Blaze OTP, paid SMTP, Play Store fee, paid domain |
| Hosting | Cloudflare Workers (OpenNext) | Vercel free tier forbids commercial use; Workers free allows it. Static bank on CDN keeps Worker CPU under 10 ms (fixed Error 1102) |
| Data model | Local-first (IndexedDB) + Supabase for trusted/shared data | Offline study; server only where trust is needed. Rejected: full-server bank with pagination (bank is public; only keys are secret) |
| Answer keys | Never in the bundle/static JSON; unlocked per question/attempt via rate-limited `/api/answers` | Exam integrity. Public PYQ pages may reveal one answer of any branch (`public_pyq: true`) |
| Grading | Server-authoritative, attempt tokens, idempotent submit, grace windows | Leaderboards must be trustworthy; regression suite proves client = server |
| Auth | Email + Google; Turnstile; email confirmation switched OFF (26 Sep) | Supabase free mailer rate-limited sign-ups. Re-enable with custom SMTP after revenue. Phone OTP deferred (Blaze cost) |
| Branch scoping | One branch per account + one final change; guests switch freely | Simplicity and fair leaderboards (`docs/MULTI_BRANCH_DESIGN.md`) |
| PYQ extraction | Claude transcribes from page images + text layer; never Gemini | Accuracy (owner stopped Gemini extraction 30 Sep). Tag during transcription |
| More branches | None for now (18 Oct) | Focus on Forge, study materials, monetisation, marketing |
| Plans/prices | Free · Plus ₹29/mo ₹249/yr · Pro ₹99/mo ₹799/yr · season pass; no lifetime, no free trial, no "was" prices that were never charged | Penetration pricing for students; Indian dark-pattern rules |
| Subscriptions | Fixed-period, non-renewing; no auto-renew, no gift passes (decided 10 Oct); coupons built but unused | Simplicity; Razorpay only (Cashfree compared, revisit 1 Jan 2027) |
| AI | Gemini free tier, server-side only, per-tier daily quota, cache, pre-generation; Free tier gets 0 AI calls | Cost control is a monetisation lever ("AI-assisted features sit in paid tiers") |
| Forge (original questions) | Questions only for Plus and Pro; **Free gets Forge Mocks only** (18 Oct). CS first, then EC, then others. Authored by Claude in sessions with code-verified answers; no paid API | Quality + $0; Free mocks are the weekly hook; the Daily Forge/archive is the paid reason |
| Mocks | New mock scheduling on hold until Forge questions exist; mocks should use fresh Forge questions, not PYQs | Owner wants original GATE-level mocks |
| Study materials | Separate paid product (not inside Plus/Pro); original writing; learn from textbooks, coaching notes only for layout/coverage; `docs/study-materials/notes/` git-ignored and never copied | Legal safety, originality, separate revenue line |
| Telegram | Hub = updates/brand/mocks/offers only, never questions; branch channels get daily PYQ with spoiler answer in the same post (no next-day answer post); one topics-enabled discussion group; channel usernames `renyxera_gate_<code>` | Owner rules 18 Oct |
| Social cards | Bricolage Grotesque ExtraBold title, DM Serif branch name, Sora chips, JetBrains Mono URL, real wordmark (Bruno Ace SC, gradient ERA) and owner's branch logos; custom card = glass sender bar + Playfair italic tagline | Chosen by owner from contact sheets |
| Personal data on shares | Name/username/student ID/avatar only when the student ticks each; nothing saved or uploaded | Consent (owner rule) |
| Promo film | 4K only; 3–4 simple modern transitions; no overlapping text; CTA "Start now" (never "Start free"); tagline under the wordmark; story stays on the student before stats | Owner feedback |
| Domain | Stay on `workers.dev` until revenue; eu.org free domain requested (pending) | Budget. Blocks AdSense, OAuth branding, branded email |
| Ads | `SponsorSlot` reserved, EthicalAds env-gated, house promos; AdSense after domain | No ads in exams/auth/checkout |
| Login stance | Never advertise "no login"; show value then gentle gates | Accounts drive retention and revenue |
| Not planned | Weekly league, PDF notes, study rooms | Owner decision; revisit only if asked |
| Dev workflow | Keep Next.js (HMR works) — don't migrate to Vite | Verified Fast Refresh works |

---

## 4. Conventions

- **Language/style:** TypeScript strict, React function components, server components for public pages, client components for app screens. Match the surrounding code's comment density and naming. Comments explain *why*.
- **Imports:** `@/` alias. Zod validates every API body. Server-only modules import `server-only` (service-role client in `lib/supabase/service-role.ts`).
- **API routes:** origin check (`isCrossOriginRequest`), rate limit (`checkRateLimit`), verify JWT (`getVerifiedClaims`), tier/branch checks on the server, JSON errors with clear messages, `Cache-Control: private, no-store` on private data.
- **Tiers and prices:** only in `lib/billing/plans.ts`. Entitlement checks server-side (`getEntitlement`, RPCs like `consume_ai_call`, `consume_practice_set`).
- **DB:** numbered migrations `supabase/migrations/NNNN_name.sql`, backward-safe; owner runs them in the Supabase SQL editor; then `npm run schema:build`. RLS on every table; private tables have no policies.
- **UI:** Tailwind v4 with CSS variables (`var(--text-primary)`, `--surface`, `--border`…); light + dark; screens use only the app shell's padding (`w-full`, no extra `max-w`/`mx-auto`/`p-*` at page roots); motion respects reduced-motion; never native date/time inputs (use `components/ui/date-picker.tsx` / `time-picker.tsx`; eslint enforces); brand name via `components/brand/wordmark.tsx` (`Wordmark`, `BrandName`, `BrandMark`).
- **Time:** server clock for anything time-based (`/api/time`), IST for daily resets; avoid `toISOString().split('T')[0]` for local dates.
- **Content:** official sources only for facts (GATE 2027 facts in `lib/seo/gate2027.ts` with `CHECKED_ON`); predictions show data vintage or an "estimate" label.
- **Files:** repo mixes CRLF and LF — preserve each file's style. Write TeX/regex with the Write/Edit tools, never via Bash heredocs.
- **Commits:** commit as you go with clear messages; push to `main` once per finished batch (push = deploy). End commit messages with the Co-Authored-By line the session specifies.
- **Checklist:** `checklist.md` is the owner's only tracker; update it every turn with real `- [ ]` / `- [x]` checkboxes.

---

## 5. Commands & environment

### Install / run
```
git clone https://github.com/justforpersonal7771-design/RENYXERA.git D:\0-UI\r2ma-stable
cd D:\0-UI\r2ma-stable
npm install
copy .env.example .env.local        # then fill values yourself (never paste secrets in chat)
npm run dev                         # http://localhost:3000
```
Node 24.x, Python 3.12+ (`pip install pymupdf pillow numpy`), GitHub CLI. Git: `core.autocrlf false`. Full new-PC steps: `handover/01-NEW-PC-SETUP.md`.

### Build / test / deploy
| Purpose | Command |
|---|---|
| Static data (answer-free banks) | `node scripts/copy-static-data.mjs` (runs as `prebuild`) |
| Build | `npm run build`; Cloudflare: `npm run build:cf`, preview `npm run preview:cf` |
| Deploy | push to `main` (CI deploys after checks); manual `npm run deploy:cf` |
| Type-check | `npx tsc --noEmit -p .` |
| Lint | `npm run lint` |
| Checks | `npm run check:security`, `check:grading`, `check:goals`, `check:calibration`, `check:mock-order`, `check:score`, `check:keys` (needs `.env.local`), `check:cwv` |
| E2E smoke | `npm run build && npx next start` then `npm run test:e2e` (desktop/mobile × light/dark) |
| Seed questions/keys | `node scripts/seed-questions.mjs` then `npm run check:keys` |
| CS bank text fixes | `python scripts/pyq/patch-cs.py <patches.json>` |
| PYQ pipeline | `scripts/pyq/{fetch,keys,render,regions,crop,validate,tagcodes,build,verify-cs}.py` — rules in `docs/PYQ_EXTRACTION_HANDBOOK.md` |
| Social cards | `python scripts/make-og.py` (fonts in `scripts/fonts/`, logos in `logo/`) |
| Telegram dry run | `node scripts/telegram-daily.mjs --dry-run` (`POST_BRANCH=CS` for a branch); `node scripts/telegram-hub.mjs --dry` |
| Social publish check | `node scripts/social-publish.mjs --check` / `--dry` |
| Upload media for IG | `node scripts/social-upload.mjs <file>` (Supabase public bucket `social`, 50 MB max) |
| Film | `cd video && npx remotion bundle src/index.ts --out-dir .bundle2` then `npx remotion render .bundle2 Film4 out/x.mp4 --codec=h264 --crf=16 --concurrency=4` (vertical: `FilmVertical`, `--scale=2` for 4K) |
| Rollback | `npx wrangler deployments list` → `npx wrangler rollback <id>` |
| Migrations | Supabase SQL editor → run file → `npm run schema:build` |

### Environment variable names (no values)
Local `.env.local` / Worker / CI: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or `_ANON_KEY`), `SUPABASE_SERVICE_ROLE_KEY`, `GEMINI_API_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_CF_BEACON_TOKEN`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BILLING_MODE`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_SELLER_NAME`, `NEXT_PUBLIC_SELLER_ADDRESS`, `PRO_AI_DAILY_LIMIT`, `PREGEN_SECRET`, `REWARD_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, `TELEGRAM_WEBHOOK_SECRET`, `NEXT_PUBLIC_ETHICALADS_PUBLISHER`, `NEXT_PUBLIC_AMAZON_TAG`, `NEXT_PUBLIC_PREVIEW_BRANCHES`, `NEXT_PUBLIC_PROMO_YT_ID` (set after YouTube upload), `NEXT_PUBLIC_BUILD_ID` (CI).
GitHub Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, the `NEXT_PUBLIC_*` build values, `SUPABASE_DB_URL`, `BACKUP_PASSPHRASE`, `PREGEN_SECRET`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHANNEL` (hub), `TELEGRAM_CHANNEL_CS/EC/EE/ME/CE/DA`, `TELEGRAM_DISCUSS`, `TELEGRAM_WEBHOOK_SECRET`, `IG_USER_ID`, `IG_ACCESS_TOKEN` (pending owner setup).

### Setup quirks
- Session working dir may be `D:\Personal\Adil GATE\GATE_OS` (stale copy) — always work in `D:\0-UI\r2ma-stable` with absolute paths.
- Not in git (recreate/copy): `.env.local`, `data/pyq/official_pdfs/`, `data/pyq/_work/`, `docs/study-materials/notes/`, `video/out/`, `video/.bundle*`, `public/data/` (generated).
- Remotion renders take hours at 4K; run in background, one at a time.
- Ffmpeg is available as `npx remotion ffmpeg` (no system ffmpeg).

---

## 6. Open tasks (prioritised)

Highest priority (owner, 22 Oct): **Forge question generation, study materials, monetisation, marketing**, plus new layers **R15 performance**, **R16 security** (audit found no security headers and 1 critical + 5 high dependency vulnerabilities) and **R17 Microsoft Store app**. Full list: `checklist.md`; full detail per release: `docs/roadmap/`.

1. **Owner decisions** in `docs/OPEN_DECISIONS_FOR_YOU.md` — F1 (Plus Forge limit), S1 (study-materials pricing), S4 (reviewer) block work.
2. **Forge build (CS first):** migration (`forge_items`, `forge_answers`, `forge_item_stats`), `canUseForgeQuestions(tier)`, `/api/forge/items`, locked UI for Free, authoring scripts (`scripts/forge/*` profile → plan → draft → code-verify → seed), first 60 hand-checked CS items, 30-day buffer + 3 mocks, owner-only beta, then launch; resume Sunday Forge Mocks; Daily Forge teaser to branch channels.
3. **Study materials Phase 0:** decisions, coverage matrix script, reference chapter "Deadlock", renderer + protection prototype, paid pass entitlement + checkout.
4. **Monetisation:** conversion funnel (Forge locks, mock → upgrade moments, plan comparison), season-pass pushes before exam, study-materials pass, affiliate links, AdSense after domain.
5. **Marketing:** film to YouTube/Instagram, Instagram setup, Telegram growth (boosts, folders, stories), SEO items, growth tasks G-5/C-3/V-1/P-1/Q-1/V-2/V-3/P-2/P-3.
6. **Film hand-over:** frame-check vertical cuts, owner review, YouTube id → `NEXT_PUBLIC_PROMO_YT_ID`.
7. **Verify:** share card in browser, markdown-table rendering, Forge practice-set gate with real Free/Plus/Pro accounts, real-phone checks.
8. **Later releases:** admin console (Release 10), spaced repetition (9A), gamification (9B), community (9C), app store listing (9D), AI depth (9E), revenue lines (8B).

Known bugs/TODOs: hard-coded 3 h timer fallback; dead code cleanup; `Aggregated_Output.json` rename (permitted, not started); explicit upstream timeouts (R10); shared rate limiter (R7C).

---

## 7. Owner preferences (how to work with Adil)

- **Communication:** plain, short status lines; say what was done, what was verified, what was not. Honest "not done/not tested" over vague claims. End every turn with the updated checklist and the next items.
- **Anything the owner must do:** numbered click-by-click steps (exact menus, what to type, how to confirm), then **wait** for confirmation. Never ask for secrets in chat.
- **Autonomy:** when asked to "complete", do the whole batch in one turn; don't stop for trivial confirmations. Commit as you go, push once per batch.
- **Design:** show several options in ONE contact-sheet image and let the owner pick; premium, modern, bold title fonts, serif/cursive branch names; use the real wordmark and logos; never stretch or retype them.
- **Testing:** every UI check on desktop (1440) and mobile (390), each in light and dark.
- **Product stance:** push towards paid plans tastefully; never advertise "no login"; personal data only with consent; official sources only; no guessed numbers.
- **Budget:** ₹0; flag anything that costs money before building it.

---

## 8. Gotchas (what a fresh session gets wrong)

1. **Wrong folder:** the real repo is `D:\0-UI\r2ma-stable`, not `D:\Personal\Adil GATE\GATE_OS`.
2. **Backslashes:** Bash heredocs / inline Python strip backslashes here — a heredoc once broke MathJax delimiters in production. Use the Write/Edit tools for TeX, regex, Windows paths.
3. **CRLF/LF:** scripted replaces silently miss on CRLF files; detect newline style, assert the match.
4. **Answer keys:** never put answers in `public/data`, the bundle, or logs. `copy-static-data.mjs` fails the build if they leak.
5. **Push = deploy.** Don't push half-finished batches.
6. **Migrations** are run by the owner in the SQL editor; code depending on a new migration must wait for their confirmation.
7. **Zero-byte file corruption** has happened (package.json, `.git/HEAD`); if git says "not a repository", check `.git/HEAD` bytes before panicking.
8. **Telegram Premium** is the owner's account perk, not the bot's; bots can't post stories.
9. **Hub channel** must never get questions; branch channels use `TELEGRAM_CHANNEL_<EC|CE…>` secret names (paper codes), even though usernames are `_ece`, `_ce`.
10. **Free tier = no AI calls and no Forge questions.** Free gets Forge Mocks only (when built).
11. **Mocks are on hold** — don't schedule new PYQ mocks.
12. **Study-material reference PDFs** are copyrighted: never commit, never copy text/figures.
13. **Instagram** needs a public HTTPS media URL and ≤ 50 MB for the free Supabase bucket; use the 1080×1920 vertical cut.
14. **Gemini** is server-side only; Free tier gets 401/limit messages, not hidden failures.
15. **Turnstile** blocks headless login — use the admin magic-link cookie method for signed-in Playwright tests (memory `reference_signed_in_e2e`).
16. **Remotion:** rebuild the bundle after editing `video/src`, or renders use stale code.
