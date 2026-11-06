# RENYXERA open items, grouped (6 Nov 2026)

[← Docs index](../README.md) · [Open items](OPEN-ITEMS-2026-11-06.md)

Built by reading all of [`checklist.md`](../../checklist.md) (524 lines, 208 open boxes), the roadmap files and the work of 3 to 6 Nov. Where the old checklist and the database disagreed, the database won (checked 6 Nov: `forge_items` = 330 rows, 236 M + 82 H + 12 X, all approved; mentor chat tables and `admin_users` exist). [`checklist.md`](../../checklist.md) now points here for the grouped view and its stale lines were corrected the same day. Legend: **(you)** owner action, **(me)** Claude builds, 🔒 waits on a decision, 🟡 costs money so waits for revenue, ⏸ on hold by the owner's instruction.

**The owner's standing orders that shape this list:** admin console (R10) is NOT started until the non-negotiable items below are done; Forge for the other five branches and verbal/picture Aptitude are on hold; DB writes, migrations and seeding are run by the owner; everything stays at ₹0.

---

## 1. Non-negotiable set (my proposal: confirm or edit; nothing else starts before these)

Definition used: an item is non-negotiable when without it the business cannot earn, cannot be trusted, or can lose data or money. Priority inside the group follows the owner's 22 Oct order (Forge, Study, Monetisation, Marketing) plus trust and safety.

| ID | Item | Why it is non-negotiable | Owner | Status |
|---|---|---|---|---|
| N1 | **Get real traffic into the funnel**: post the week 1 pack with tagged links (`WEEK-01-CONTENT-PACK.md`), then read `node scripts/growth-metrics.mjs` weekly | 1,200 visitors in 30 days, 86 tests, 0 real paying customers, almost all traffic untagged | you post, me read | open |
| N2 | **First-visit conversion**: watch whether the new "Try a quick sample test" button lifts the 7% test rate; fix the next friction found | The 93% who never start a test is the biggest leak | me | built, measuring |
| N3 | **Upgrade moments that convert** (R13-A1 to A6): Forge locks as the main upgrade moment, plans page refresh (comparison table, FAQ), smart upgrade sheet, post-purchase tour | Direct revenue path | me | open |
| N4 | **Payment trust**: refund flow test (a live payment already verified: 2 paid live orders, both the owner's), UPI MDR confirm, monthly billing report to Telegram, legal review of refund and terms text | Money handling must be proven and legally clean | you + me | partly done |
| N5 | **Privacy and consent** (R16-D3 DPDP retention and consent records, R16-D4 privacy policy update for Forge, study materials, shares, channels) | Legal requirement before more data is collected | me | open |
| N6 | **Account security**: 2FA on GitHub, Cloudflare, Supabase, Google, Razorpay, Meta, Telegram; key-rotation runbook (R16-B1, B2) | One stolen account loses everything | you (steps from me) | open |
| N7 | **Platform security remaining**: enforce the CSP after a week of traffic, shared rate limits, Turnstile on waitlist/report/contact, webhook replay protection, security.txt, Sentry alerts, restore drill (R16-B4, C1, C2, C4, E1 to E4) | Cheap protections for a live paid product | me | open |
| N8 | **Forge to the CS target** (329 of 800 questions live; Forge-grade share is still low) with a read-through of b010 and b011 by the owner, then the Forge launch pieces C1 to C5 (Daily Forge schedule, Forge Mocks, calibration loop, Telegram teasers, launch marketing) | Forge is priority 1 and the main upgrade lever | me + you read | open |
| N9 | **Study materials Phase 0** (R12-A1 to A7: coverage matrix, content schema, renderer, protection, the Deadlock reference chapter, checkout, go/no-go) | Priority 2, a separate paid product; decisions S1, S2, S4 are already made | me, you review accuracy | open |
| N10 | **Core screens correct and single-screen**: results screen visual check, remaining scrolling screens (Checkpoint, Mocks, Battles, Tutor, Study, Calendar, Mentor, Plans), markdown-table render check, exam timer 3 h fallback | A broken exam screen costs a paying student | me | open |
| N11 | **Accuracy of what we sell**: PYQ and key accuracy for the March 2027 refresh plan, official marks-to-rank data refresh (4J), Forge keys verified by code (done) | Wrong answers destroy trust | me | planned |

If you want an item moved out of this table or another moved in, say so; the rest of the document is "everything else, in priority order".

---

## 2. Needs YOU (grouped by kind of action)

### 2.1 Run in Supabase or the repo (nothing pending that I know of)
- Applied and verified: migrations 0044 to 0052, [`supabase/forge-subject-names.sql`](../../supabase/forge-subject-names.sql), [`supabase/forge-audit-fixes.sql`](../../supabase/forge-audit-fixes.sql), seeds b007 to b011 (CS Forge live = 329 + the pilot rows).
- (you, verify) `0046_challenge_first.sql` was never confirmed in writing; Battles work, so it is probably applied.

### 2.2 Decisions (defaults in [`docs/open-work/OPEN_DECISIONS_FOR_YOU.md`](OPEN_DECISIONS_FOR_YOU.md))
- Forge: F2 Free sees Forge Mock solutions after the mock; F3 one Daily Forge teaser per branch channel; F4 Forge Mock cadence; F5 branch order; F6 keep the name Forge.
- Study materials: S3 sources rule, S5 English only, S6 Deadlock sample first, S7 private repo or bucket for content; business: study-pass refund policy, GST later, rights for reference books.
- Battles (R29 section 9): seasons and badges go-ahead, per-question speed scoring. The 24 h expiry is decided (keep 7 days).
- Design (R26 section 9) Looks choices; R25 Battle Arena stays on hold until released; R27 Mentor decisions (section 4); R21.
- Feature catalogue: approve any of the 56 ideas (reply with numbers); ideas from the reference review (reels format, landing motion).
- Which repo account to use (renyxera@gmail.com) and how much effort to move it.
- Names for Spark and Blend.

### 2.3 Accounts and setup
- 2FA everywhere; Razorpay UPI MDR; Google OAuth logo upload; Microsoft Partner Center individual account and name reservation; Supabase region (not editable, accepted); custom domain and SMTP 🟡.
- Instagram setup ([`docs/growth/instagram/01-SETUP.md`](../growth/instagram/01-SETUP.md)), Telegram Premium boosts and folders, BotFather menu and commands, pinned welcome post edit, @WebpageBot refresh.
- Working tree clean-up: untracked images, `logo/`, `video/.bundle2/`, `New folder/` delete, decide about `docs/*.zip`.

### 2.4 Marketing actions (I draft, you post)
- Post the week 1 pack, carousel, reel and Telegram post, using the UTM links; films to YouTube, Short and Reel (send the YouTube id); growth tasks G-5, C-3, V-1, P-1, Q-1; review the `claude-youtube` skill pack before the channel launches.

### 2.5 Real-device and account tests
- Phone: payment, More sheet drag, onboarding Telegram step, aptitude images, Civil practice; Free, Plus and Pro accounts through the Forge and practice-set gates; Battles comparison and rematch UI; Swaseekh signed-in review screenshots; Pro test account device rows (age out about 27 Nov).

### 2.6 Content review
- Read the enumeration-heavy b011 questions and a sample of b010; accuracy review of Study lessons (S4: owner reviews CS).

---

## 3. Product tracks (all open work, by release; priority order from 22 Oct)

### 3.1 R11 Forge (priority 1), see also N8
- Done: design, rules, tables, grading, hub, generator rebuilt, authoring kit, CS 329 live (b007 to b011), audit of all 249 older items, subject and difficulty fixes.
- Open (me): A5 owner-only beta flag; B2 `plan.py` blueprint (the replan scripts now do this) and B3 batch format note; B7 CS buffer to 800 (471 to go, aiming at Forge-grade quality, with a real X tier); C1 Daily Forge 06:00 IST with streak and board, CI fail if fewer than 14 days queued; C2 Forge Mocks (Sunday 10:00 IST, resume mock scheduling); C3 calibration loop after 50 attempts; C4 Telegram teasers; C5 launch marketing; C6 roll-out EC, EE, ME, CE, DA ⏸ on hold; X items for Pro, subject mini-mocks, adaptive Forge sets.
- Open (me): Forge in built tests (the exam engine reads the static bank, so Forge and Blend shares are still PYQ-only; `forge.json` per branch); AI generator quota is the bottleneck (about 300 AI solutions in 8 days).
- On hold: verbal and picture Aptitude (needs a different checking process).

### 3.2 R12 Study materials (priority 2), see also N9
- Open: A1 coverage matrix, A2 JSON schema and validator, A3 lesson renderer, A4 protection (entitled-only API, per-session encryption, watermark, copy/print blank), A5 Deadlock reference chapter, A6 entitlement and checkout (🔒 S1 decided: subject packs ₹99 to 149 plus bundles), A7 go/no-go; B pilot (OS, DBMS, Algorithms), C complete CS, D other branches; build plan (pack and bundle data model, checkout add-on, offer moments, CS lessons subject by subject).

### 3.3 R13 Monetisation III (priority 3), see also N3 and N4
- Open: A1 to A6 (Forge locks, plans page refresh, season-pass campaign December to exam, smart upgrade sheet, bundling nudge, post-purchase tour); B1 study pass, B2 affiliates, B3 sponsorship media kit, B4 college licences, B5 formula-sheet packs, B6 🟡 ads after domain; C2 monthly billing report, C3 refund flow test, C5 feature-flag copy tests, C4 🟡 GST; taster rule for the other gated features (AI practice sets done; Battles, Spark, planner automation, offline downloads still to audit); purchase-then-scrape flagging and manual review (needs admin, so waits); full-bank offline download as a paid entitlement.

### 3.4 R14 Marketing and growth (priority 4), see also N1
- Open: A1 to A5 films (frame-check, publish, YouTube id, 30 s, 15 s and 4:5 cuts); B2 Instagram four-week calendar, B3 carousel generator; C2 Telegram deep links and branch commands, C3 story images, C4 per-branch folder links, C5 Forge teasers; D1 monthly Search Console fixes, D2 programmatic pages for every branch, D3 branch predictors (official data), D4 internal linking, D6 domain-move plan; E growth tasks R-4, L-4, S-4, V-2, V-3, P-2, P-3; F weekly growth report to Telegram; week 2 content pack; 🟡 welcome email series; reels backlog (voice-over, Hindi cut, second reel); Instagram and YouTube automation (YouTube not built; API upload needs Google audit).
- Done recently: funnel tracking and report, tagged-link builder, invite nudge at any score, sample-test button, week 1 pack.

### 3.5 R15 Performance and R28 toolkit
- Done: unused deps, caching headers, WebP, Sentry and recharts deferral, paging for long lists, topic search deferral, skeleton, big chunks named.
- Open: R15 A2 PrismLight, A3 fonts, A4 `next.config` hygiene, A5 bundle CI budget; B1 to B3 image sizes and WebP for question images; C1 per-paper bank files, C2 hashed data files, C3 shared pool on demand; D1 LazyMotion, D2 exam render profile, D3 MathJax per container; E1 edge caching, E2 indexes, E3 service worker; F1 Lighthouse CI, F2 real-user web vitals; R28: Mentor reply streaming (needs the reply format changed from JSON), depcheck, search debounce audit, Supabase region (accepted).

### 3.6 R16 Security, see also N5 to N7
- Done: A1 dependencies, A2 headers (CSP report-only), A3 sanitising, D2 RLS probe, GitHub protections.
- Open: B1 2FA (you), B2 runbook, B4 optional TOTP for paid students; C1 to C4; D1 Security Advisor leftovers accepted by design; D3, D4; E1 to E4; enforce CSP; MathJax upgrade re-check note.

### 3.7 R17 Microsoft Store and R24 mobile app
- Open: M1 leftovers (window-controls-overlay, share target, taskbar badge); M2 desktop polish; M3 store policies; Partner Center (you); PWABuilder package, sideload test, submit; badge on site; 🟡 Android TWA and Play Store (₹2,100); R24: install prompt moments, iPhone Add-to-Home-Screen card, web push, phone single-screen audit.

### 3.8 R18 UI refresh, R22 Test Centre, R26 Design Studio, Mentor
- R18: U2 restyle each `components/ui` file; U3 app shell; U4 remaining dashboard and planner; U5 practice, exam chrome, results, review, analytics; U6 Mentor, Tutor, mocks, calendar, downloads, profile, billing; U7 auth, onboarding, dialogs; U8 public pages and the final WCAG AA audit; 18A to 18E (dashboard bento, analytics, Mentor, other screens, competitor-inspired items).
- Single-screen rule leftovers (N10); Tools hub and results screen verification; move "full picture" content out of `/analytics/coach` then delete the route.
- R22: move runner and stores out of `app/(dashboard)/exam`, merge challenge, checkpoint and fresh-mock routes, mock countdown on the hub, one `TestConfig`.
- R26 Looks: still to build Liquid Glass, HUD Terminal, Blueprint, Editorial, Clay (Pro); Minimal Mono, Midnight, Ocean Bento, Sunrise Soft (Plus); Paper (Free); per-screen audit of every Look (exam, results, Study, Plans); save a Look to the account; server-side trial record. (Owner: the other ten Looks are on hold until told.)
- Mentor (R21, R27): cloud-synced memory, Telegram weekly check-in, photo doubts, 50-question evaluation set, live real-model test, dictation, read aloud, PDF questions, talk mode, weak-topic memory, top-up packs, export and share chats; Mentor streaming.
- Landing motion: "how it works" line draw, sign-up and upgrade button states, word reveal on the landing headline; count-up with real numbers.

### 3.9 R19 / R25 / R29 Battles and the Arena
- Done: friends, presence, invites, points, Elo, leaderboard, live lobby, rematch, navbar badge (migrations 0047 to 0050).
- Open: seasons and badges (needs a migration), per-question speed scoring, hints near the end, Telegram share; R25 Battle Arena rooms and rotating Setter ⏸ on hold; taster for Battles; look at the comparison and rematch UI in a browser.

### 3.10 R20 Solutions for every question
- Open: solution format and validator, `question_solutions` table, review panel and flag-an-error, CS then EC, EE, ME, CE, DA, GA once; AI pre-gen throughput.

### 3.11 R9 Depth and community, R10 Admin console
- R9 open: 9A spaced repetition (FSRS) with a daily adaptive set, 9B freeze tokens, XP, daily goals, 9C moderated community (needs moderation), 9D app stores, 9E AI depth; flashcards leftovers; Telegram phone verification and weekly report.
- R10 ⏸ on hold by the owner until the non-negotiable set is done: full spec in [`docs/roadmap/R10-ADMIN-SPEC.md`](../roadmap/R10-ADMIN-SPEC.md) (stays at `/admin`, not a separate app); R30 admin-lite exists (Overview, Funnel, Links; 1 admin registered).

### 3.12 Release 4 to 8 leftovers
- 4J official marks-to-rank and category curves (March 2027), official schedule page from the GATE 2027 brochure, readiness predictor reads calibration, opt-in anonymised scorecards; 4E recent-year PYQ weighting; 4G upstream timeouts; 4C support-driven anonymisation; exam and branch picker for a second exam; invisible per-account watermark; friends leaderboard (done in Arena); college predictor (official data only); branch score and rank predictors; calibration per branch; 2017 to 2020 papers for non-CS branches; recurring March refresh; streak and mastery cards, study-with-me link, study-group invites, testimonials.

---

## 4. Bugs and tech debt
- Markdown tables render check (`GATE_CS_2025_AN_Q8`); `exam-timer.tsx` 3 h fallback; dead code (`design-system/*` if present, duplicate `PersonalNotesDrawer`); rename [`data/Aggregated_Output.json`](../../data/Aggregated_Output.json) to `data/pyq/CS/gate_cs_pyqs.json`; share-card browser test and Playfair "Q" swash; profile "All changes saved" state; UI pass leftovers (review page polish, image and code rendering audit on Mistakes, Bookmarks, Revision); accessibility pass; structured logs and diagnostics view; Forge subject tags fixed; `tsconfig.tsbuildinfo` and [`next-env.d.ts`](../../next-env.d.ts) churn must be reverted before commits.

## 5. Parked: on hold or waiting for revenue
- ⏸ Admin console (R10), other branches' Forge, verbal and picture Aptitude, R25 Arena rooms, other ten Looks, more branches.
- 🟡 Custom domain and branded email, phone OTP, R2 images, Play Store, GST invoicing, legal review fee, ads after the domain, welcome email series, paid Supabase features (leaked-password protection accepted as skipped).

## 6. Ideas awaiting your approval
- 56 catalogue ideas in [`docs/roadmap/FEATURES.md`](../roadmap/FEATURES.md); [`docs/open-work/FEATURE-IDEAS.md`](FEATURE-IDEAS.md) living list; reference-review ideas (reel format, landing motion); Chatterbox Hindi voice test (needs your OK); concept 3 of the Mentor logo as a friendly avatar; "X" Forge items for Pro; scroll-world or other skills not yet installed (need links).

---

## 7. How the list was reconciled with the checklist (so nothing is lost)
Counted from [`checklist.md`](../../checklist.md): 208 open, 148 done. About 40 of the "open" boxes were already done or superseded (Forge seeds, audit SQL, admin-lite migration, the Forge 66-of-800 note, duplicated Forge lines, the real payment test). Those were closed or rewritten in [`checklist.md`](../../checklist.md) on 6 Nov. Every remaining open box appears once above, grouped by owner action (section 2), non-negotiable set (section 1) or release (section 3).
