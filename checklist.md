# RENYXERA — Master checklist (the only tracker)

**Last updated:** 26 October 2026 · **Live:** https://gate.renyxera.workers.dev · **Repo:** `D:\0-UI\r2ma-stable` (push to `main` = deploy)
Every open task below has its key steps, a "done when" check and a reference. Full detail per release: `docs/roadmap/` (index `docs/roadmap/00-README.md`). Shipped history: `archive/COMPLETED.md`. New-session context: `HANDOFF.md`, `CLAUDE.md`, `handover/MASTER_PROMPT.md`.

**Legend:** `- [x]` done · `- [ ]` open · **(you)** owner action · **(me)** Claude builds · 🔒 blocked by a decision · 🟡 costs money, waits for revenue · ⏸ on hold by decision · 💡 idea awaiting approval.
**Priorities (owner, 22 Oct):** 1 Forge · 2 Study materials · 3 Monetisation · 4 Marketing — plus the new layers: Performance (R15), Security (R16), Microsoft Store app (R17).

---

## 0. Now — next steps in order (26 Oct)

- [ ] **(you) URGENT: Supabase rejects every signed-in database call from browsers** ("JWT issued at future", PGRST303, measured for 12+ minutes on 26 Oct). This breaks the referral link ("Creating your link…"), the sponsor break, profile loading/saving and anything else read directly from the browser. Steps: Supabase dashboard → your project → **Project Settings → General → Restart project**; if it persists, **Project Settings → JWT Keys**: check the current signing key, and open a ticket with Supabase support quoting PGRST303. Tell me when done; I re-test.
- [x] **Bug batch of 26 Oct fixed, verified, deployed** — see §0a.
- [ ] **(me) R19 Battles** — live "Beat my score" (opened/started/progress/submitted/winner, Telegram ping). Needs migration `0041_battles.sql` (you run it). Ref: `docs/roadmap/R19-BATTLES.md`. Waits for the Supabase fix to test.
- [ ] **(me) R18 UI refresh** — dashboard first, then analytics, AI Mentor, other screens; contact sheet of layouts for you to pick. Ref: `docs/roadmap/R18-UI-REFRESH.md`.
- [ ] **(me) R11 Forge**, then **R20 Solutions** for every question, with **R12 Study materials** possibly in parallel. Refs: `R11-FORGE.md`, `R20-SOLUTIONS.md`, `R12-STUDY-MATERIALS.md`.
- [ ] **(you)** Swaseekh signed-in review: sign in with Google and send screenshots of dashboard, question bank, a textbook page, analytics with institute filter, mock test, pricing (I can't sign in with a Google account). Analysis so far: `docs/competitors/COMPETITORS_2026-10.md`.
- [ ] **(you)** Telegram: edit the pinned welcome post (it still says "with yesterday's answer"; now the answer is a spoiler in the same post). To refresh old link previews in Telegram, send the site link to **@WebpageBot**.
- [ ] **(me) R16-A1 dependency patch** (1 critical + 5 high) and **R16-A2/A3 headers + sanitising**.
- [ ] **(you)** Decisions F1, S1, S4 (`docs/OPEN_DECISIONS_FOR_YOU.md`).

### 0a. Bug batch 26 Oct (verified on a local production build, phone 390 + desktop 1440, light)
- [x] 3 Link previews used an old built-in image (`app/opengraph-image.tsx` overrode the cards) → removed; every page now uses the approved cards (branch pages their own)
- [x] 4 Timer: a line flows round the timer pill showing time left (green → amber → red) and one soft pulse at 10, 5 and 1 minute left
- [x] 5 "Save & next" / "Mark & next" on the last question asks: Submit test, or Keep going
- [x] 6 Results scoreboard was empty on phones (card had no height) → fixed, both faces checked phone + desktop
- [x] 7 Review Previous/Next hidden on phones (100vh behind the browser bar) → dynamic viewport height on all full-screen pages; verified
- [x] 8 Long equations were cut off → they scroll sideways; swipe-to-navigate ignores equations and tables
- [ ] 9 Profile save button missing → **cause is the Supabase outage above** (profile never loads); the page now says so with a Try again button. Re-test after the Supabase fix.
- [x] 10 Telegram section lists your branch channel, hub, discussion group and the all-in-one folder link (shows when Telegram is enabled; check on the live site)
- [x] 11 "Very high priority" badge no longer wraps (single line, shorter label)
- [x] 12 Locked Pro sections show a short faded preview (max 420 px), not a page-long blur
- [x] 13 Today, study planner and study timer cards now have the same card effect as the rest
- [x] 14 Syllabus: every sub-topic chip shows its share of the unit's marks with a fill bar and details on hover/tap (shared tags marked *) — CS page; other branches next
- [ ] 15 Referral link / sponsor break → **same Supabase outage**; re-test after the fix
- [x] 2 Speed: first-load JS cut — exam session 443→241 KB, setup 421→219 KB, AI Mentor 435→233 KB, profile 768→279 KB; the 1.8 MB avatar library no longer loads on every page (styles load one at a time); chart library only when the goal panel opens; decorative fonts not preloaded
- [ ] 1 Live battles → R19 (planned above)
- [x] AI pre-generation: fixed the 1,000-row cap (Civil and older papers were never processed) and LaTeX-backslash JSON failures; status table in `docs/roadmap/R20-SOLUTIONS.md`

## 1. Needs YOU

### Decisions (context + my defaults: `docs/OPEN_DECISIONS_FOR_YOU.md`)
- [ ] 🔒 **F1** Plus Forge limit — default: Daily Forge + filtered practice, no archive, no "X" items; Pro gets all. *Blocks R11-A2 limits.*
- [ ] **F2** Free sees Forge Mock solutions after the mock — default: yes, one week.
- [ ] **F3** One Daily Forge teaser per branch channel — default: yes.
- [ ] **F4** Forge Mock cadence — default: weekly CS, fortnightly others until buffers exist.
- [ ] **F5** Order CS → EC → EE, ME, CE, DA — default: yes.
- [ ] **F6** Keep the name "Forge" — default: yes.
- [ ] 🔒 **S1** Study-materials pricing model/price — default: one-time pass per branch, test ₹499–999. *Blocks R12-A6.*
- [ ] **S2** Branch order after CS — default: EC, EE, ME, CE, DA.
- [ ] **S3** Sources rule — default: confirmed (learn from textbooks; coaching notes for layout/coverage only).
- [ ] 🔒 **S4** Accuracy reviewer — default: you spot-check CS, paid tutor per subject later. *Blocks R12-A5 sign-off.*
- [ ] **S5** English only at launch — default: yes.
- [ ] **S6** "Deadlock" sample chapter first — default: yes.
- [ ] **S7** Study content in a private repo/bucket — default: yes.
- [ ] Business: study-pass refund policy; GST later (accountant); rights for reference books in `notes/`.
- [ ] Feature catalogue: approve any of the 56 ideas in `docs/roadmap/FEATURES.md` (reply "approve 1, 3, 23…").

### Tasks
- [ ] **Films:** watch v8 on laptop + phone → YouTube (landscape `renyxera-film-v8-4k.mp4`), Short + Instagram Reel (`renyxera-film-v8-vertical-1080.mp4`) → send the YouTube id.
- [ ] **Instagram:** Professional account → Meta app → tester → token → secrets `IG_USER_ID`, `IG_ACCESS_TOKEN` → run `social-check` (`docs/instagram/01-SETUP.md`).
- [ ] **Telegram Premium:** boosts on hub + CS; six per-branch folders (send links); BotFather menu button + commands (`docs/telegram-premium/`).
- [ ] **2FA everywhere** (R16-B1): GitHub, Cloudflare, Supabase, Google, Razorpay, Meta, Telegram — I'll give steps.
- [ ] **GitHub protections** (R16-B3): secret scanning, push protection, Dependabot — I'll give steps.
- [ ] **Migrations:** run `0040_forge.sql` when I hand it over (R11-A1).
- [ ] **Accounts test:** Forge/practice-set gate with real Free, Plus, Pro accounts.
- [ ] **Real phone:** payment, More sheet drag, onboarding Telegram step, aptitude images, Civil practice.
- [ ] **Growth:** G-5 tracking sheet, C-3 community posts, V-1 three Shorts, P-1 three partner offers, Q-1 five answers (I draft).
- [ ] **Razorpay:** confirm UPI MDR (Settings → Pricing).
- [ ] **Microsoft Store (R17):** create Partner Center individual account (confirm it's free), reserve "RENYXERA", send Package ID/Publisher ID/Publisher name.
- [ ] 🟡 Custom domain (eu.org pending since 29 Sep, or buy after revenue) → email, AdSense, OAuth branding.
- [ ] Google OAuth logo: upload `public/brand/oauth-logo.png` in Google Cloud console.
- [ ] Working tree: confirm committing the deletion of `docs/og-*.png` and keeping the `docs/*.zip` files out of git.

---

## 2. Decisions log (made — not re-opened without you)

| Date | Decision |
|---|---|
| 17 Sep | ₹0 budget; > ₹100 one-time or any monthly cost waits for revenue (🟡) |
| 25 Sep | No custom domain until revenue (eu.org free route tried) |
| 26 Sep | Email confirmation off (free mailer limits); back on with custom SMTP later |
| 27 Sep | Push to `main` deploys after checks; commit as you go, push per batch |
| 30 Sep | PYQs transcribed by Claude from page images, never Gemini; tag during transcription |
| 6 Oct | Forge after PYQs; CS first then EC; mocks on hold until Forge |
| 9 Oct | Never advertise "no login" |
| 10 Oct | No auto-renew subscriptions, no gift passes; coupons built unused; Razorpay only (Cashfree revisit 1 Jan 2027) |
| Oct | Plans: Free · Plus ₹29/mo ₹249/yr · Pro ₹99/mo ₹799/yr · season pass; no lifetime, no free trial |
| Oct | AI/day: Free 0 · Plus 75 · Pro 150; AI practice sets: Plus 5/day, Pro unlimited, Free none |
| 17 Oct | Study materials = separate paid product; reference PDFs git-ignored, never copied |
| 17 Oct | Not planned: weekly league, PDF notes, study rooms |
| 18 Oct | No more branches for now |
| 18 Oct | Forge questions Plus/Pro only; Free gets Forge Mocks only |
| 18 Oct | Telegram hub never posts questions; branch channels `renyxera_gate_<code>` post daily PYQ with spoiler answer |
| 18 Oct | Film: 4K only, 3–4 plain transitions, no overlaps, "Start now", tagline under wordmark |
| 18 Oct | Card style: Bricolage title, DM Serif branch, Sora chips, JetBrains Mono URL; custom card glass bar + Playfair tagline |
| 18 Oct | Personal details on shares only with per-field consent |
| 22 Oct | New releases added: R15 Performance, R16 Security, R17 Microsoft Store app |
| — | One branch per account + one final change; keep Next.js; never native date/time pickers |

---

## 3. Priority tracks (detail in `docs/roadmap/`)

### 3A · Release 11 — Forge (P1) · `docs/roadmap/R11-FORGE.md`
**Done**
- [x] Design (`docs/FORGE_DESIGN.md`) and access rules (`docs/FORGE_ENTITLEMENTS_AND_SETUP.md`)
- [x] AI practice sets gated by plan (migration 0039)

**A · Foundation**
- [x] **A1 Migration `0040_forge.sql`** written (27 Oct) — **(you) run it in Supabase SQL editor** — `forge_items` (public half, `release_at`, `status`, `mock_only`), `forge_answers` (private, no policies), `forge_item_stats`; RLS hides unreleased/mock items.
  - Done when: security check proves anon/auth can't read answers or unreleased items. Depends on: you run it.
- [x] **A2 Entitlement** (`FORGE` + `canUseForgeQuestions` in plans.ts; Plus default 10/day until F1) — Forge block + `canUseForgeQuestions(tier)` in `lib/billing/plans.ts`; Plus limit 🔒F1.
- [x] **A3 APIs (grading part)** — `/api/forge/items` (tier/branch/rate-limit), Forge branch in `/api/answers` and `/api/exam/grade`, `/api/forge/report`.
  - Done when: scripted tests for guest/Free/Plus/Pro pass; no answer before submit.
- [ ] **A4 UI** — Daily Forge card (blurred + upgrade for Free), setup source switch Past papers / Forge / Mixed, Forge badge, solutions, report button, analytics split.
  - Done when: screenshots desktop/mobile × light/dark approved.
- [ ] **A5 Beta flag** — owner-only until launch.

**B · Authoring pipeline (₹0, Claude sessions)**
- [x] **B1 `scripts/forge/profile.py`** (CS: 91 topics weighted) — per-topic weight, type mix, difficulty, 3-year trend.
- [ ] **B2 `scripts/forge/plan.py`** — batch blueprint (topics × archetypes × difficulty).
- [ ] **B3 Batch format** — item schema + `verify` code per item.
- [x] **B4 `scripts/forge/validate.py`** — schema, code-recomputed keys, distractor logic, PYQ-overlap check, MathJax render.
- [x] **B5 `scripts/forge/seed.mjs`** (static forge.json still to do) + answer-free `public/data/<CODE>/forge.json`.
- [ ] **B6 First CS batch of 60** — you spot-check 10; 0 wrong keys required.
- [ ] **B7 CS buffer** — 300 practice + 30 days Daily Forge + 3 mocks (~800 items, ~14 batches).

**C · Launch**
- [ ] **C1 Daily Forge CS** — 06:00 IST, streak, board; CI fails if < 14 days queued.
- [ ] **C2 Forge Mocks (all tiers)** — build-mock script, Sunday 10:00 IST (🔒F4 cadence), solutions per F2; resume mock scheduling.
- [ ] **C3 Calibration loop** — flag items by p-value/discrimination after 50 attempts.
- [ ] **C4 Telegram teasers** (F3) and hub mock announcements.
- [ ] **C5 Launch marketing** — post, film cut, Plans section, What's new.
- [ ] **C6 Roll-out** EC → EE, ME, CE, DA (F5).
- [ ] 💡 "X" items for Pro · subject mini-mocks · adaptive Forge sets.

### 3B · Release 12 — Study materials (P2) · `docs/roadmap/R12-STUDY-MATERIALS.md`
**Done**
- [x] Full programme plan (`docs/study-materials/00…12`), reference library review, `notes/` git-ignored

**A · Phase 0**
- [ ] **A1 Coverage matrix (CS)** — syllabus × PYQ weight × reference chapters → flags thin, high-weight topics.
- [ ] **A2 Content format** — JSON block schema (`lib/study/schema.ts`) + validator.
- [ ] **A3 Renderer** — `components/study/lesson-renderer.tsx` (MathJax, code, tables, SVG diagrams, check-yourself).
- [ ] **A4 Protection** — entitled-only API, encrypted per session, per-account watermark, copy/print blank, daily limits.
  - Done when: copy/print/view-source show nothing usable; reading unaffected.
- [ ] **A5 Reference chapter "Deadlock"** — full lesson skeleton; numbers recomputed by script; overlap check; 🔒S4 sign-off.
- [ ] **A6 Entitlement + checkout** — `study_pass_<branch>`, Razorpay, receipt, refund text (🔒S1).
- [ ] **A7 Go/no-go review** with you on phone + laptop.

**B–D · Later phases**
- [ ] **B Pilot** — three CS subjects (suggest OS, DBMS, Algorithms) with cheat-sheets, flashcards, topic links.
- [ ] **C Complete CS + launch** — free first lesson per subject, Plans/topic-page placement, campaign.
- [ ] **D Other branches** (S2 order) + yearly March review.

### 3C · Release 13 — Monetisation III (P3) · `docs/roadmap/R13-MONETISATION.md`
**Done**
- [x] Plans in `lib/billing/plans.ts`; Razorpay live (verify, webhook, reconcile, receipts); season pass; prorated upgrade; coupons; upgrade prompts; referrals; ad slot architecture

**Open**
- [ ] **A1 Forge locks as the main upgrade moment** — blurred Daily Forge, "practise like the ones you missed" after Forge Mocks; events per source.
- [ ] **A2 Plans page refresh** — comparison table, FAQ, testimonials (consent), film.
- [ ] **A3 Season-pass campaign Dec → exam** — banner by date, weekly hub post, Instagram, early-buyer coupon.
- [ ] **A4 Smart upgrade sheet** — preview of the locked feature + price per day + one tap.
- [ ] **A5 Bundling nudge** after 3 purchases.
- [ ] **A6 Post-purchase tour** of unlocked features.
- [ ] **B1 Study pass** (R12-A6) · **B2 Affiliates** (books, calculator; disclosure; click tracking) · **B3 Sponsorship media kit** · **B4 College licences** · **B5 Formula-sheet packs** · **B6 🟡 Ads after domain** (consent, non-personalised under 18, ad-free for paid).
- [ ] **C2 Monthly billing report to your Telegram** · **C3 Refund flow test** · **C5 Feature-flag copy tests** · **C4 🟡 GST**.

### 3D · Release 14 — Marketing and growth (P4) · `docs/roadmap/R14-MARKETING-GROWTH.md`
**Done**
- [x] Film v8 (4K landscape, vertical 1080 at 31.6 MB, vertical 4K); click-to-play component
- [x] Telegram hub + six branch channels + topics group + folder link (working; hub bot posted 19 Oct)
- [x] Instagram publisher, calendar, `social-check`; setup docs
- [x] SEO: titles, JSON-LD `sameAs`, branch Telegram links/FAQ, footer links, social cards, sitemap, Search Console
- [x] Growth docs and UTM + `weekly_growth_metrics()`

**Open**
- [ ] **A1 Frame-check films** (12 frames each) → **A3 publish** (you) → **A4 set YouTube id** → **A5 30 s/15 s/4:5 cuts**.
- [ ] **B2 Instagram 4-week calendar** (5 posts/week) → **B3 carousel generator** (PYQ → 5 branded slides).
- [ ] **C2 Telegram deep links + branch commands** (after BotFather) · **C3 story images** · **C4 per-branch folder links on pages** · **C5 Forge teasers**.
- [ ] **D1 Monthly Search Console CTR fixes** · **D2 programmatic pages for every branch** · **D3 branch predictors (official data)** · **D4 internal linking** · **D6 domain-move plan**.
- [ ] **E Growth tasks** — R-4, L-4, S-4, V-2, V-3, P-2, P-3 (me) + G-5, C-3, V-1, P-1, Q-1 (you); ambassadors after 1,000 users; "Your GATE year" recap.
- [ ] **F Weekly growth report** to your Telegram.
- [ ] 🟡 Welcome email series (needs domain/SMTP).

### 3E · Release 15 — Performance optimisation (no quality loss) · `docs/roadmap/R15-PERFORMANCE.md`
*Audit 22 Oct: 1,280 PNG images (79 MB), recharts in the top bar on every app page, full Prism highlighter in the question renderer, 7 font families preloaded, 824 KB CS bank + 3.5 MB shared pool loaded whole, motion in 81 files without LazyMotion.*
*Budgets: LCP ≤ 2.0 s public / 2.5 s app, INP ≤ 200 ms, CLS ≤ 0.05, ≤ 180 KB first-load JS per app route.*
- [ ] **A1 Lazy-load goal slider panel** (recharts off the shared chunk) — `components/layout/topbar.tsx`.
- [ ] **A2 PrismLight + registered languages, dynamic `CodeBlock`** — identical rendering on 10 code questions.
- [ ] **A3 Fonts** — preload only Manrope, Sora, Bruno Ace SC; decorative fonts only on the dashboard hero.
- [ ] **A4 `next.config.ts` hygiene** — drop picsum, `optimizePackageImports`, `removeConsole` (keep error/warn).
- [ ] **A5 Bundle analyser + CI budget** (`scripts/check-bundle.mjs`).
- [ ] **B1 WebP for question images** (lossless/near-lossless, PNG fallback, `<picture>`) — ≥ 50 % smaller, 30-diagram visual check in light/dark.
- [ ] **B2 Image sizes + lazy/priority loading** — CLS 0 on navigation.
- [ ] **B3 WebP brand/poster assets** (OG stays PNG).
- [ ] **C1 Per-paper bank files + index** — first Practice visit < 150 KB of data; offline download still works.
- [ ] **C2 Content-hashed data files + immutable caching**.
- [ ] **C3 Shared pool loaded only when needed**.
- [ ] **D1 LazyMotion (`m.` components)** · **D2 exam session render profile** (INP ≤ 100 ms on option click) · **D3 MathJax per-container typesetting** · **D4 virtualise long lists**.
- [ ] **E1 Edge caching for public pages** · **E2 Supabase Performance Advisor + indexes** · **E3 service-worker strategy**.
- [ ] **F1 Lighthouse CI + extended CWV script (INP, app pages)** · **F2 real-user web vitals to `/api/events`**.

### 3F · Release 16 — Security hardening · `docs/roadmap/R16-SECURITY.md`
*Audit 22 Oct: no HTTP security headers; 9 vulnerable production dependencies (1 critical); `html` AST nodes injected raw; per-isolate rate limits; no security.txt or Dependabot.*
- [ ] **A1 Patch dependencies** (critical/high to 0) — see §0.
- [ ] **A2 Security headers** — HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors none, COOP same-origin-allow-popups, CSP (report-only → enforce, nonces for inline scripts).
- [ ] **A3 Sanitise HTML nodes** — bank-only `html` nodes, allow-list sanitiser, AI parser emits no HTML; XSS payload tests.
- [ ] **B1 2FA on all owner accounts** (you) · **B2 key-rotation runbook** · **B3 GitHub secret scanning, push protection, Dependabot, branch protection** · **B4 optional TOTP 2FA for paid students**.
- [ ] **C1 Shared rate limits** (Postgres counters or Cloudflare free rule) · **C2 Turnstile on waitlist/report/contact** · **C3 WAF/Bot Fight Mode after domain** · **C4 webhook replay protection**.
- [ ] **D1 Supabase Security Advisor clean** · **D2 automated RLS probe of every private table** · **D3 DPDP retention + consent records** · **D4 privacy policy update** (Forge, study materials, shares, channels).
- [ ] **E1 Sentry alerts** · **E2 user-visible security events** · **E3 `/.well-known/security.txt`** · **E4 quarterly restore drill + incident checklist**.

### 3H · Release 18 — UI refresh (priority) · `docs/roadmap/R18-UI-REFRESH.md`
- [x] U1 (27 Oct): share card (clean share base, branch names, no overlaps), stack deck clipped to tidy lips, navbar gold/silver rings removed, dot-grid texture. Plan: `docs/roadmap/R18-UI-UPGRADE-PLAN.md`
- [ ] U2 shared UI kit — partly done 27 Oct: FolderTabs, Segmented, btn-main, grad-brand built; 291 labels in 84 files moved to sentence case; old purple gradient replaced in 34 places. Left: restyle each components/ui file
- [ ] U3 app shell: topbar, bottom tabs, to-do panel, calendar panel, goal slider, leaderboard, account menu, Ctrl+K
- [ ] U4 dashboard + planner — partly done: first-run hero (no empty rings, one start ask), to-do + calendar panel headers. Left: remaining dashboard/planner components
- [ ] U5 practice/exam chrome, results, review, analytics
- [ ] U6 AI mentor/tutor, mocks, calendar page, downloads, profile, billing
- [ ] U7 auth, onboarding, growth + system dialogs
- [ ] U8 public pages + final WCAG AA audit
- [x] 27 Oct: theme from the logo (blue/cyan/magenta replaces purple app-wide via Tailwind scales), solid cards (no dots through), all dashboard cards pastel, Swaseekh-style pinned deck in a framed panel, Lenis smooth scroll + mobile swipe rows + lesson reading bar, metallic tilt on hero cards only (.metal)
- [x] Preview screens with sample data: /forge (Daily, Practice, Mocks, Archive; Free/Plus/Pro switch), /study (library + Deadlock lesson reader), /battles (live battle). Switch to "Coming soon" in lib/preview/features.ts after owner testing
- [x] GATE 2027 date fixed to 6 Feb (official IIT Madras schedule 6-21 Feb); all countdowns share lib/goals/use-days-to-gate.ts
- [ ] Owner: test /forge, /study, /battles and the new dashboard; say "make them coming soon" when done
- [x] 27 Oct: design system researched + written (docs/design/DESIGN-SYSTEM.md); WCAG fixes (muted text + peach/butter ink on pastel); paper-grain texture; solid controls; legacy glass cards = pastel; card family (band/well/stat) on Analytics + AI Mentor; pastel active chips in 9 tab components; exam screen pastel; Forge answers green/red + NAT box; question-source mixer (PYQ/Forge/Mix %) in Exam Setup; share-result image in social-card style
- [x] Audit script scripts/zz-audit.mjs: 20 routes x 3 modes, axe contrast + off-theme + overflow + deck geometry: all clean
- [x] 27 Oct owner review (13 points) + collapsible exam palette: done and audited (20 routes x 1440 light/dark, 390 mobile, 1536, 1920)
- [x] 27 Oct: Exam Setup sources GATE PYQs / Forge / Spark / Blend on one base screen; Forge questions + Spark questions views; Spark generator; Blend (PYQ+Forge+Spark shares); Flashcards (spaced repetition) for all sources; Tools bento with Downloads; card-coloured buttons; navbar labels
- [ ] Owner: test Exam Setup (all four sources, three views), Flashcards, Tools; decide final names for Spark/Blend
- [ ] Forge in the exam engine for real: mixer is saved but tests stay PYQ-only until Forge items are seeded and graded server-side
- [x] 27 Oct: navbar = floating island, text links with logo-gradient underline on the active page, loose icons; one popover surface for all dropdowns, pickers, dialogs and panels (20 files); ink tooltips
- [x] Bug: days to GATE now from one source (lib/goals/use-days-to-gate.ts)
- [ ] 18A Dashboard (bento: next action, today strip with daily target, progress trio, where marks leak, revision due, mocks, heatmap, battles, one upgrade moment) — contact sheet first
- [ ] 18B Analytics (KPIs, mastery heatmap + institute filter, topic table, time coach, Mistake DNA)
- [ ] 18C AI Mentor (conversation-first, coach chips, data-driven prompts, message actions, quota meter)
- [ ] 18D Other screens (setup, results, review, profile, mocks, planner, lists, syllabus, public pages)
- [ ] 18E Competitor-inspired: institute filter (C1), daily target (C5), 70+ blueprint (C9), progress report (C10), guided tour (C11), focus mode (C13), topic checklist (C14)

### 3I · Release 19 — Battles · `docs/roadmap/R19-BATTLES.md`
- [ ] Migration `0041_battles.sql` + RPCs (server-graded scores only)
- [ ] `/challenge/<id>` links, live status card (15 s polling), result screen with winner and topic comparison, rematch
- [ ] Telegram pings to the sender; limits (Free 3 active); expiry 7 days

### 3J · Release 20 — Solutions for every question · `docs/roadmap/R20-SOLUTIONS.md`
- [x] AI pre-generation status measured (26 Oct): CS 11 %, DA 26 %, EC 12 %, EE 12 %, ME 10 %, CE 0 %; 360 failed (≈225 Gemini overload, retried; ≈130 JSON, now repaired); 1,000-row cap fixed
- [ ] Solution format + validator (answer must equal official key; control-character scan)
- [ ] `question_solutions` table + review panel + flag-an-error
- [ ] CS → EC → EE → ME → CE → DA; GA once

### 3K · Competitors · `docs/competitors/COMPETITORS_2026-10.md`
- [x] Swaseekh (public pages) and GATE CS Preparation Hub (Hatchable) analysed on desktop + phone; 16 ideas ranked (C1–C16)
- [ ] Signed-in Swaseekh review (needs your screenshots)

### 3G · Release 17 — Microsoft Store app (Windows) · `docs/roadmap/R17-MICROSOFT-STORE.md`
- [ ] **M1 Manifest upgrade** — id, name/description for all branches, categories, separate any/maskable icons, screenshots (wide + narrow), shortcuts (Practice, Mocks, AI Mentor, Planner, Mistakes), `display_override` window-controls-overlay, `launch_handler`, optional `share_target`.
  - Done when: PWABuilder report all required green.
- [ ] **M2 Desktop polish** — title-bar overlay layout, offline banner, exam keyboard shortcuts sheet, taskbar badge (due revisions), opt-in notifications.
- [ ] **M3 Store policies** — privacy/support URLs, IARC age rating answers.
- [ ] **(you) Partner Center account + name reservation + identity values** (confirm the individual account is free).
- [ ] **Package with PWABuilder (MSIX) → sideload test** (OAuth, Turnstile, payments, MathJax, offline) **→ submit → certification**.
- [ ] **"Get it from Microsoft" badge** on site + announcement.
- [ ] Note: a future custom domain changes the start URL → new package version.
- [ ] 🟡 Android TWA / Play Store later.

---

## 4. All releases and modules

### Release 1 — Core ✅
- [x] Bank, images, AST/MathJax, IndexedDB, all test types, timer, palette, bookmarks, notes, mistakes, revision, results, review, analytics, planner, command palette, fullscreen
- [ ] **Verify markdown tables** render (`lib/repository/transformers/table-extractor.ts`; test `GATE_CS_2025_AN_Q8`) — done when shown as a table in exam, review, PYQ page.

### Release 2 — Premium experience ✅
- [x] Design system, themes, motion, redesigned dashboard/analytics
- [ ] **UI pass leftovers** — review page polish; image/code rendering audit on Mistakes, Bookmarks, Revision (desktop/mobile × light/dark).

### Release 3 — AI ✅
- [x] AI Tutor, AI Mentor (8 coaches), tier quotas, cache, pre-generation, AI practice sets

### Release 4 — Foundation
- [x] 4A Cloudflare + CI/CD + rollback + PWA · 4B Postgres/RLS/seeding · 4C email + Google auth, Turnstile · 4D guest mode · 4E profile/goals/achievements · 4F isolation + devices · 4G API hardening · 4H branch pages · 4I cloud sync · 4J calibration 2023–2026
- [ ] **4J Official marks↔AIR + category curves** — March 2027 refresh from the official report; label vintage.
- [ ] **4J Official schedule page** from the GATE 2027 brochure (`lib/seo/gate2027.ts`).
- [ ] **4J Readiness predictor reads calibration** (with 9E).
- [ ] **4J Opt-in anonymised scorecards** (March 2027).
- [ ] **4E Recent-year PYQ weighting as the exam nears** (with 9A).
- [ ] **4G Upstream timeouts** (R10) · **shared limiter** (R16-C1).
- [ ] **4C Support-driven anonymisation** (R10).
- [ ] **Exam + branch picker for a second exam**; degree filter by exam.
- [ ] 🟡 Custom domain/DNS/R2 · 🟡 Phone OTP (or free email OTP) · 🟡 email confirmation with SMTP.

### Release 5 — Exam integrity ✅
- [x] Key withholding, server grading, integrity signals, fetch caps, mock engine, leaderboards, result cards
- [ ] **Invisible per-account watermark** (with R12-A4 protection work).
- [ ] **Full-bank offline download as a paid entitlement** (with R15-C1 per-paper files).
- [ ] **Friends leaderboard** (9C).
- [ ] ⏸ New PYQ mocks — resume as Forge Mocks (R11-C2).

### Release 6 — Monetisation I
- [x] SEO engine for every branch, legal pages, ad slot architecture
- [ ] **College predictor** — only with official CCMT/COAP closing data.
- [ ] **Branch score/rank predictors** — official per-branch data first (R14-D3).
- [ ] 🟡 Legal review.
- [ ] **6D → R11 Forge** · **6E → R12 Study materials**.
- [ ] **Recurring March refresh** — new papers, keys, tags, weights, "What changed" (idea 56 automates it).

### Release 7 — Monetisation II
- [x] Tiers, Razorpay, season pass, coupons, device chooser, UTM, referrals, share cards
- [ ] **Purchase-then-scrape flagging + admin review** (R10) · **manual review step** (R10).
- [ ] **Streak/topic-mastery cards, study-with-me link, study-group invites, testimonials** (FEATURES 18, 19, 21).
- [ ] 🟡 GST invoicing.

### Release 8 — Multi-branch and revenue
- [x] Six branches live; CS verified; branch scoping; shared aptitude/maths
- [ ] **Calibration per branch** when official data is reachable.
- [ ] **WebP image pipeline** → R15-B1.
- [ ] **Revenue lines** → R13-B.
- [ ] 💡 2017–2020 papers for non-CS branches · ⏸ more branches.

### Release 9 — Depth and community · `docs/roadmap/R09-R10-DEPTH-AND-ADMIN.md`
- [ ] **9A FSRS spaced repetition + daily adaptive set** — due counts sync across devices; recall measured.
- [ ] **9B Freeze tokens, XP/levels, daily goals, study-time boards**.
- [ ] **9C Moderated community** (only with moderation tools).
- [ ] **9D App stores** → R17 (Windows) · 🟡 Android.
- [ ] **9E AI depth** — weakness study plan, AI mocks, natural-language search, voice revision.
- [ ] **Flashcards** · **Telegram phone verification + weekly report** · 🟡 WhatsApp.

### Release 10 — Admin console · `docs/roadmap/R09-R10-DEPTH-AND-ADMIN.md`
- [ ] **Admin-lite first** (Forge review queue, reports, coupons, mocks).
- [ ] **10A strict login + 2FA · 10B roles in Postgres · 10C mocks · 10D integrity queue · 10E content editing with versioning · 10F users (DPDP) · 10G dashboards · 10H money · 10I comms · 10J audit · 10K flags/kill switches · 10L AI pre-gen console · 10M AI logs with retention**.

### Platform-wide
- [x] Sentry, Web Analytics, keep-alive, encrypted backups + drill, CWV script, E2E smoke in CI
- [x] Handover pack (`HANDOFF.md`, `CLAUDE.md`, `handover/`, `docs/roadmap/`) — 22 Oct
- [ ] **Accessibility pass** — keyboard, focus, contrast, maths labels (FEATURES 45).
- [ ] **Structured logs + alerts, diagnostics view** (R10, R16-E1).

---

## 5. Paid backlog 🟡 (after revenue; free alternative)
- [ ] Custom domain — eu.org (pending)
- [ ] Branded emails — Brevo free SMTP
- [ ] Phone OTP — email one-time code
- [ ] R2 images — Worker assets / GitHub + jsDelivr
- [ ] Play Store ₹2,100 — Microsoft Store first (R17)
- [ ] Legal review; GST

---

## 6. Bugs and tech debt
- [ ] Markdown tables verification (Release 1)
- [ ] `components/exam/exam-timer.tsx` 3 h fallback when no draft
- [ ] Dead code: `design-system/*` (if present), duplicate `PersonalNotesDrawer`
- [ ] Rename `data/Aggregated_Output.json` → `data/pyq/CS/gate_cs_pyqs.json` (update loaders/scripts)
- [ ] Share card browser test; Playfair "Q" swash review
- [ ] Manifest still says "GATE CSE" (fixed by R17-M1)

---

## 7. Feature catalogue 💡 — 56 proposals with what/why/how/tier/effort in `docs/roadmap/FEATURES.md`
- **Learning (1–16):** Mistake DNA · mastery heatmap · exam-day rehearsal · time coach · revision playlists · FSRS flashcards · why-wrong for every option · similar-question finder · attempt comparison · error notebook · calculator speed trainer · normalisation simulator · peer benchmark · audio revision · doubt from a photo · explain levels.
- **Motivation (17–22):** freeze tokens · study-with-me link · milestone cards · Telegram mentor check-in · private study groups · parent/mentor progress link.
- **Monetisation (23–28):** Forge Mock report unlock · Target pack · college dashboard · scholarship coupons · exam-season gift pass · PSU/M.Tech interview add-on.
- **Growth (29–37):** public Forge leaderboards · QOTD embed widget · Topic ROI page · referral leaderboard · Instagram carousels · Shorts generator · exam-season live pages · GATE calendar alerts · PSU via GATE tracker.
- **UI/UX (38–50):** first test in 60 s · Ctrl+K search · dashboard personalisation · mobile exam v2 · offline subject packs · dark-mode diagrams · skeletons/optimistic UI · accessibility · What's new · upgrade sheet · Hindi UI labels · shortcuts sheet · goal wizard v2.
- **Platform (51–56):** admin-lite · feature flags · status page · weekly growth report · content quality dashboard · automated March refresh.

---

## 8. Product rules (always)
Never advertise "no login"; show value, then gentle gates. No lifetime offers, free trials or never-charged "was" prices. Free: no AI calls, no Forge questions (Forge Mocks only). Server time for anything time-based. Unfinished study blocks asked about once a day, never moved silently. Official sources only; estimates labelled. Personal data on shares only with consent. Performance and security changes never reduce quality or features. Anything costing money waits for revenue.

## 29 Oct 2026 (UI pass, late)
- [x] Scrollbars hidden again, no arrows (root cause: scrollbar-width/color in the per-card rule makes Chrome ignore ::-webkit-scrollbar)
- [x] Folder final shape, palette current-question marker, exam header icon buttons, results screen, rank chart labels
- [x] AI Tutor home (search, mistakes, bookmarks, plan banner)
- [x] AI Mentor refactor plan written: docs/roadmap/R21-AI-MENTOR.md (awaiting owner decisions in section 10)
- [ ] Build AI Mentor M1 (chat shell, Know-me panel, analytics cards moved out)
- [ ] AI Tutor inner workspace panels on the shared pastel look
- [ ] Forge items seeding so Forge/Blend use real items; Battles in avatar menu; Ctrl+K palette

## 29 Oct 2026 (mobile pass)
- [x] Exam Setup on phones: Build a test / Forge or Spark questions / Flashcards switcher was hidden below 640px; now shown (tested in every source)
- [x] Floating top bar fits 360-390px (avatar no longer cut off)
- [x] Exam header on phones: Submit no longer pushed off screen (root cause: unlayered .btn-soft display beat Tailwind hidden); aria-labels added
- [x] Neutral buttons no longer fuse with their ink shadow (notched corners on "See my results" / "Confirm Submit"); exam Submit, results Dashboard/Retry now use the shared button style
- [x] Battles in the avatar menu; Ctrl+K palette: pastel selection, links to Mentor, Tutor, Study, Forge, Mocks, Battles, Tools, Calendar, Plans
- [ ] Forge items are not seeded: seeding approves live content, so it needs your go-ahead and a release date (see scripts/forge/seed.mjs)
- [ ] Build AI Mentor M1 (research first, tomorrow)

## 29 Oct 2026 (AI Mentor and AI providers)
- [x] AI Mentor rebuilt: home (quick ask, today's plan, next actions, what I know + forget), dedicated chat screen /ai-mentor/chat (plan, review, quiz, guided, weekly), MENTOR_CHAT server type, number check, notes, flags; old analytics cards moved to Analytics > Coach insights
- [x] AI provider layer: OpenRouter free models auto-picked per task with key rotation, Gemini fallback; docs/AI_PROVIDERS_SETUP.md
- [x] Forge generator (Gemini/OpenRouter/OmniRoute) + nightly workflow to forge-auto
- [ ] You: add OPENROUTER_API_KEYS to Cloudflare + GitHub + .env.local (steps in docs/AI_PROVIDERS_SETUP.md)
- [ ] Mentor not done: cloud-synced memory, Telegram weekly check-in, photo doubts, 50-question evaluation set, live test with a real model reply
- [ ] R22 Test Centre (merge Mocks + Exam engine): docs/roadmap/R22-TEST-CENTRE.md, after Mentor

## 29 Oct 2026 (evening)
- [x] Mentor: goals, roadmap by days left, things I noticed, daily check-in, focus timer, AI practice questions (Spark generator) inside the Mentor, full-width chat
- [x] AI Tutor: finds saved AI/snapshot questions (was "No active question loaded"), clear "not on this device" state, panels tinted peach / sky / lilac
- [x] 29 Oct: Forge live for Plus/Pro: migration 0040 applied, 6 pilot items seeded; `/api/exam/grade` and `/api/answers` grade FORGE_ ids from forge_answers (plan, branch, release rules; solution returned with key); hub Daily/Practice/Bookmarks read `/api/forge/items`; `UPCOMING.forge = "live"`
- [ ] Forge in built tests: Exam Setup Forge/Blend shares still PYQ-only (grading is ready; wire the generator + a larger bank); Forge Mocks card is a placeholder; `/api/forge/report` not built
- [ ] You: OPENROUTER_API_KEYS in Cloudflare, GitHub, .env.local; GEMINI_API_KEY in GitHub for the nightly Forge job (docs/AI_PROVIDERS_SETUP.md)
- [ ] Mentor still to do: cloud-synced memory (migration), Telegram weekly check-in, photo doubts, evaluation set, real-model test after keys
- [ ] R22 Test Centre (docs/roadmap/R22-TEST-CENTRE.md) after Mentor

- [x] Test Centre phase A1: hub at /test-centre, one navbar item replaces Exam Setup + Mocks, bottom bar updated, old routes unchanged
- [x] Test Centre A2-A6 (routes): /test-centre/{build,mocks,mocks/results,practice,history}; old /setup, /mocks, /mocks/results redirect; section bar with back-to-hub on every screen; one Attempt model (features/test-centre/model.ts)
- [ ] Test Centre later: physically move runner/stores out of app/(dashboard)/exam, merge challenge/checkpoint/fresh-mock routes, add the mock countdown to the hub, one TestConfig
- [x] Test Centre hub redesigned (mission path, mock countdown, big-number tiles, sticker chips, icon watermarks); global shape watermark on every pastel card
- [x] Tools hub rebuilt as a single-screen bento; exam-style option tiles on mistakes/bookmarks/revision/Mentor practice; Test Centre screens take their hub tile colour; page-shell is a column so fill-height pages fit under the Test Centre bar
- [x] Tools hub redesigned after research: verb-led intents (rank / plan / practise) as master-detail, one featured tool + rows, single screen; Test Centre hub could take the same pattern if the owner prefers it
- [x] 29 Oct: OpenRouter key verified (auth 200, Nemotron-3-Ultra answered); model-picker refreshed to the current 17 free text models (old deepseek/qwen/gpt-oss names were no longer free). Free models rate-limit (429): second key and Gemini fallback matter for batches.