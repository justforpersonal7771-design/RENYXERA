# RENYXERA — Master checklist (the only tracker)

**Last updated:** 6 November 2026 · **Everything in one file: [`docs/MASTER.md`](docs/MASTER.md)** · **Grouped open items (single view): [`docs/open-work/OPEN-ITEMS-2026-11-06.md`](docs/open-work/OPEN-ITEMS-2026-11-06.md)** · **Live:** https://gate.renyxera.workers.dev · **Repo:** `D:\0-UI\r2ma-stable` (push to `main` = deploy)
Every open task below has its key steps, a "done when" check and a reference. Full detail per release: `docs/roadmap/` (index [`docs/roadmap/00-README.md`](docs/roadmap/00-README.md)). Shipped history: [`docs/done/archive/COMPLETED.md`](docs/done/archive/COMPLETED.md). New-session context: [`HANDOFF.md`](HANDOFF.md), [`CLAUDE.md`](CLAUDE.md), [`handover/MASTER_PROMPT.md`](handover/MASTER_PROMPT.md).

**Legend:** `- [x]` done · `- [ ]` open · **(you)** owner action · **(me)** Claude builds · 🔒 blocked by a decision · 🟡 costs money, waits for revenue · ⏸ on hold by decision · 💡 idea awaiting approval.
**Priorities (owner, 22 Oct):** 1 Forge · 2 Study materials · 3 Monetisation · 4 Marketing — plus the new layers: Performance (R15), Security (R16), Microsoft Store app (R17).

---

## 0-new. 31 Oct 2026 turn

- [x] Migration 0044 applied by owner; `check:rpc` + `check:rls` clean; Performance Advisor clean. Security Advisor leftovers are accepted by design (6 public leaderboard functions; signed-in own-data functions). Leaked-password protection needs Supabase Pro (paid) → **accepted/skipped**, sign-in has no passwords.
- [x] Build a test / Setup screen now fits one screen at 1920×912, 1440×900, 1366×768 (Test Centre bar is a floating back button on desktop, slim row on phones; Blueprint panel tightened).
- [ ] Tools hub overflow (38 px): marketing layout min-height reduced; verify after build 21.
- [ ] Still scrolling (audit): Checkpoint (200–730 px), Mocks (620–770), Battles (120–260), then Tutor/Study/Calendar/Mentor/Plans. Next turn.
- [ ] Results screen single-screen + dark soft edges: built, not yet visually verified.
- [x] Commit/push batch (0044 file, check:rpc, manifest + icons, R24 plan, results, dark edges, Test Centre bar) — pushed 31 Oct (55fd871). Tools hub verified 0 px; Test Centre hub shortened again (unverified).
- [x] R25 UX/visual design spec written (`R25-ARENA-UX-DESIGN.md`: hint ladder, pick cards, power cards, reveal choreography, wireframes) and app-wide [`docs/open-work/FEATURE-IDEAS.md`](docs/open-work/FEATURE-IDEAS.md) (living). **ON HOLD by owner (31 Oct): research and documentation only, no building yet.** When released: static design sandbox page for approval, then backend.
- [ ] **R25 Battle Arena** (live rooms, rotating Setter, speed + order scoring): design doc written [`docs/roadmap/R25-BATTLE-ARENA.md`](docs/roadmap/R25-BATTLE-ARENA.md) (living, idea log at the bottom). Build steps A–D next, then Telegram/share, Free taster.

- [x] 1 Nov: skills installed in `~/.claude/skills` (load at next session start): taste-skill, hallmark, interface-design (+ ui-ux-pro-max earlier). **Not found by name, need links from owner:** Stitch Skills, Scroll World, Frontend Slides, Diagram Design, Website Cloner, Archify.
- [x] 1 Nov bugs (build 22, unpushed until verified): Test Centre section bar replaced by a dropdown under the top-bar Test Centre item (all doors + GATE PYQs/Forge/Spark/Blend), phones keep a slim row; `/challenge` opens `/battles`; Test Centre hub re-laid (4 mini stat cards top right, All-India mock card beside Practice); Practice screen reorganised (one big "Revise mistakes" + checkpoint + 3 small); leaderboard no longer dims/blurs the page, crisp HD crowns (gold rank 1, silver rank 2, no blur filter); Daily check-in rewritten (loads what is saved, log with edit/delete, pick date and time); Mentor chat button (animated) in calendar and to-do panels, opens chat without "back to Mentor".
- [ ] **(me) Move "full picture" content out of `/analytics/coach` (1000-line old Mentor screen)** into dashboard / analytics / AI Mentor, then delete the route. Own task, needs a plan of which block goes where.
- [ ] **(me) R26 Looks and Design Studio** (plan rewritten 1 Nov: a Look = the whole design of the app: cards, backgrounds, fonts, corners, density, icons, motion; three tiers Free / Plus / Pro; Design Studio with part-by-part customising, font picker, My looks; Arena style option). Doc: [`docs/roadmap/R26-DESIGN-STUDIO.md`](docs/roadmap/R26-DESIGN-STUDIO.md). Build order: audit hard-coded styles, token engine, Studio shell + 3 Free Looks, fonts, then Plus and Pro Looks. Waiting on owner choices in section 9.

- [x] 1 Nov (late): **India time only (IST)** across the app: [`lib/time/ist.ts`](lib/time/ist.ts), `toLocalDateStr` is IST, every `toLocale*String` defaults to Asia/Kolkata + en-IN ([`lib/time/install-ist.ts`](lib/time/install-ist.ts)); fixed the `/ai-mentor` hydration error found on the deployed app (greeting hour differed UTC server vs browser). Verified with the server running in UTC. CSP `connect-src` now allows `data:` (Turnstile warning). Civil syllabus link no longer 404.
- [x] 1 Nov: **Mentor chat rebuilt like ChatGPT/Gemini**: chat history sidebar (search, pin, rename, delete, grouped Today/Yesterday/7 days/Older in IST), chats saved on device as trees, edit an earlier message (keeps both versions with a "1 / 2" pager), answer again (versions), new-chat, Gemini-style thinking animation, typed-out answers, auto-growing input (Enter sends), phone drawer. Tests: `npm run check:chat` (13 tree checks) + `scripts/zz-e2e-chat.mjs` (21 checks, AI stubbed). Open: cloud sync of chats across devices (needs a table + free-tier check), export chat, share chat link.
- [x] R26 updated: Looks tiers Free 2 / Plus 4 / Pro 10 incl. Minimal, Glass, Pixel Quest, Neon Nights; 5-minute try once per Look.

- [x] 1 Nov (night): Mentor chat v2 built: history collapsible, groups (by date or your own groups), search inside chats, Upgrade button, enlarge-chat (fills the app, not full screen) and enlarge-box buttons, mode and style menus inside the composer, rewritten AI-mistakes note, no scrollbar until needed, flowing-colour logo (no circle behind it), RENYXERA logo in the history header, AI chat button in the top-bar cluster with its own gradient look. Chat sync is automatic (uploads in seconds; other devices refresh every 20 s while a chat is open; no device limit). **Owner: apply [`supabase/migrations/0045_mentor_chat_sync.sql`](supabase/migrations/0045_mentor_chat_sync.sql) for cross-device chat sync** (until then chats stay on the device and nothing else is affected). Test Centre hub re-laid (mission + upcoming mock on top, slim stats, short door tiles, Mocks as a plain door), menu has no descriptions or source chips, Flashcards/Build a test switch correctly.
- [x] Release 28 Fast (performance toolkit): [`docs/roadmap/R28-PERFORMANCE-TOOLKIT.md`](docs/roadmap/R28-PERFORMANCE-TOOLKIT.md); `npm run check:perf`; long cache headers (`public/_headers`), WebP brand art, one version check per load, 10 s timeouts on external calls, Mentor prompt-injection guard. Open: skeletons per screen, search debounce audit, depcheck, Supabase region, virtualised lists, AI streaming. Done since: unused deps removed, topic search deferred, skeleton loading screen, goal-panel chunk deferred on slow links. Open: Supabase region (owner check in dashboard), long-list virtualising, Mentor streaming (needs the reply format changed from JSON). Big chunks named (DiceBear styles on demand, recharts, Sentry; nothing to fix).
- [x] Admin-lite (R30, first slice of Release 10) built and live: `/admin` Overview, Funnel, Links; migration 0052 applied and 1 admin registered (6 Nov). The full admin console (R10) is ON HOLD until the non-negotiable set in [`docs/open-work/OPEN-ITEMS-2026-11-06.md`](docs/open-work/OPEN-ITEMS-2026-11-06.md) is done; spec in [`docs/roadmap/R10-ADMIN-SPEC.md`](docs/roadmap/R10-ADMIN-SPEC.md).
- [x] Week 1 content pack drafted: [`docs/growth/marketing/WEEK-01-CONTENT-PACK.md`](docs/growth/marketing/WEEK-01-CONTENT-PACK.md) (carousel, reel, Telegram post, reply templates; owner reviews and posts).
- [x] Growth step 1 done: funnel events + `funnel_by_source` report (migration 0051 applied; run `node scripts/growth-metrics.mjs`). Step 2 in progress: invite nudge now shows at any score with a challenge message (referral reward 7 days Pro each already exists, migration 0020). Next: read the funnel once traffic exists, then weekly content pack.
- [x] Forge audit done ([`docs/forge/FORGE_AUDIT_2026-11-06.md`](docs/forge/FORGE_AUDIT_2026-11-06.md)): 124 basic, 93 standard, 8 Forge-grade, 20 aptitude; [`supabase/forge-audit-fixes.sql`](supabase/forge-audit-fixes.sql) run by the owner (live labels now M 236, H 82, X 12). Still open: more Forge-grade items and a larger X tier.
- [x] Forge b010 (60 designed) and b011 (20 X-tier challenge) seeded by the owner 6 Nov: CS Forge live = 329 (database shows 330 rows incl. the cloud-run item). Read the enumeration-heavy b011 items (owner). Next: toward 800 (about 471 to go), other branches ON HOLD.
- [x] Forge CS raised to 250 (b009, 50 questions, validated and audited). b007, b008 and b009 seeded by the owner (b009 release 2026-11-03T16:31:46Z). Other branches and verbal/picture Aptitude are on hold by the owner.
- [x] Forge CS set raised to 200 (3 Nov), seeded by the owner; superseded by the 329 line above.
- [x] Forge generator fixed (3 Nov): local plan, author, ingest loop in [`docs/forge/FORGE_GENERATOR_LOCAL.md`](docs/forge/FORGE_GENERATOR_LOCAL.md); used for b007 to b011.
- [x] Forge review (3 Nov): [`docs/done/FORGE_REVIEW_2026-11-03.md`](docs/done/FORGE_REVIEW_2026-11-03.md); its findings (key letters, NAT share, subject names) are fixed; later audit in [`docs/forge/FORGE_AUDIT_2026-11-06.md`](docs/forge/FORGE_AUDIT_2026-11-06.md).
- [ ] Battles as a game: [`docs/roadmap/R29-BATTLES-AS-A-GAME.md`](docs/roadmap/R29-BATTLES-AS-A-GAME.md) (friends and presence, live and async modes, points, leaderboard). Owner decisions in section 9. Build step 1: friends. **Step 1 done and pushed (friends, requests, presence dot, privacy switch; migration 0047 applied; 22 API checks pass; phone and desktop checked). Step 2 done: challenge specific friends (migration 0048, 11 API checks pass), Challenges for you list, side-by-side combined result. Still to do: navbar notification dot, rematch button, 24 h expiry, Step 3 done: Arena Points (win 30, draw 15, loss 8), Elo rating, weekly and all-time leaderboard, friends and everyone (migration 0049, 13 play-through checks pass). Step 4 done: live (concurrent) mode with lobby, ready check and shared server-clock countdown (migration 0050, 13 API checks pass). Navbar badge done. Rematch done (8 API checks pass), owner can Take it now. 24 h expiry decided: keep 7 days (revisit later). Still to do: seasons and badges, per-question speed scoring.**
- [x] Marketing toolkit review: [`docs/growth/marketing/GROWTH-TOOLKIT.md`](docs/growth/marketing/GROWTH-TOOLKIT.md) (10 repos, licences, fit, rules).
- [x] Transcripts of the two videos (AI agent story; performance list) folded into R28.
- [ ] Mentor chat backlog and AI top-ups: [`docs/roadmap/R27-MENTOR-CHAT-FEATURES.md`](docs/roadmap/R27-MENTOR-CHAT-FEATURES.md) (dictation, read aloud, photo and PDF questions, talk mode, weak-topic memory, top-up packs). Owner decisions in section 4.

- [x] 1 Nov (late night): **Mentor logo final = the owner's ribbon-flame-with-spark** (concept 8 of the AI-generated sheet, finalised version). Traced to a vector ([`scripts/trace-mentor-flame.py`](scripts/trace-mentor-flame.py), [`scripts/gen-mentor-flame.mjs`](scripts/gen-mentor-flame.mjs)), recoloured with the exact RENYXERA brand gradient, exported to `public/brand/mentor/` (SVG: light, dark, white, ink, app icon; PNG: 128/512/1024, app icon 64/192/512/1024) and used for the top-bar AI chat button, the chat header, the Upgrade chip and the flowing "thinking" logo ([`components/brand/mentor-mark.tsx`](components/brand/mentor-mark.tsx)). Preview: [`docs/done/design-mentor-logo/mentor-logo-final.png`](docs/done/design-mentor-logo/mentor-logo-final.png). Concept 3 (robot bubble with cap) is parked as a possible friendly avatar; needs the image file.
- [x] Chat v3: Gemini-style composer (one-line pill, tools drop under from line 2, expand icon top-right from line 3, centred box on a new chat with suggestions), hierarchical history (groups are collapsible folders, no toggle), no card around the chat, AI-style panel (constellation watermark), guests: one temporary chat, 2 free messages then sign-in (counter survives refresh), tokens instead of messages for allowance and packs ([`lib/billing/ai-credits.ts`](lib/billing/ai-credits.ts), `npm run check:credits`).
- [x] Owner applied [`supabase/migrations/0045_mentor_chat_sync.sql`](supabase/migrations/0045_mentor_chat_sync.sql) (tables `mentor_chats`, `mentor_chat_sync` exist; verified 6 Nov).

- [x] 1 Nov (night): Mentor chat v4 from the owner's 9 points: logo in its **original colours** (flame body + spark as two transparent layers; [`components/brand/mentor-logo.tsx`](components/brand/mentor-logo.tsx), [`scripts/extract-mentor-logo.py`](scripts/extract-mentor-logo.py)), bare top-bar button (no tile/outline, spark blinks, pops on hover), bigger logo in history and while thinking, **the logo is also the collapse/expand button** (turns into the panel icon on hover), the logo itself as the history watermark, deeper indigo history panel, messages flow behind and around a floating box, **enlarge = whole window incl. top bar** with the same cards, **Stop button** (really cancels the request; Esc too) + "No answer yet / Try again" after a stop or reload, **New chat while an answer is pending now opens a clean new chat** (busy is per chat). Edge-case suite: `scripts/zz-e2e-chat3.mjs` (38 checks incl. delete while busy, Enter twice, 1,500-char limit, reload mid-answer, phone).
- [ ] **Design Studio (R26): starting with the Pro Looks** (owner, 1 Nov). Order: engine + Looks tab, then Glass, Neo-brutal Arcade, Neon Nights, Pixel Quest, Aurora, then the rest.

- [x] 2 Nov: Design Studio `/design-studio` live with 5 Pro Looks (Glass, Neo-brutal Arcade, Neon Nights, Pixel Quest, Aurora; light+dark checked on hub). Remaining Pro: Liquid Glass, HUD Terminal, Blueprint, Editorial, Clay; then Plus (Minimal Mono, Midnight, Ocean Bento, Sunrise Soft) and Free Paper. Open: server-side trial record, cross-device saved Look, per-screen audit of all 5 Looks (exam, results, Study, Plans).

- [x] 2 Nov (night): Design Studio moved into Profile (Design Studio tab) + a quick window under the navbar palette button; Looks now have fonts per Look + a Fonts override section, single-mode Looks (Neon = dark only) hide the light/dark switch, Pixel is square/stepped/flat everywhere, previews are isolated (iframes) so one Look no longer leaks into another's preview, Arcade keeps the default grain; spec for every Look: [`docs/design/LOOKS-SPEC.md`](docs/design/LOOKS-SPEC.md); audit: `scripts/zz-looks-audit.mjs`. Mobile Mentor chat: box at bottom, history as a full-height side panel. "One place instead of five" comparison moved to `/compare` (footer link "How we compare"), off the home screen. Challenge: share button now says "Challenge a friend"; `/battles` has "Start a new challenge" (build any test in the exam engine, take it, then challenge friends).
- [ ] Challenge as a game (next): create a challenge BEFORE playing (no finished test needed), live lobby, per-question speed bonus; see R25 Arena doc.

- [x] 2 Nov: **Challenge first** (code pushed, untested end to end): `/test-centre/build?challenge=1` -> "Start the challenge" creates the battle with its questions BEFORE anyone plays (`POST /api/battles {question_ids,title}`), friends can open the link and play at once, the owner's score is copied from the server-graded attempt when they finish (screens show "challenges you / not finished yet" until then). **Owner: apply [`supabase/migrations/0046_challenge_first.sql`](supabase/migrations/0046_challenge_first.sql)** (makes owner_score nullable). Until then creating a new challenge shows "Couldn't create".
- [ ] Challenge game next: live lobby with presence, per-question speed bonus and order scoring, hints near the end (R25 design docs), then Arena rooms.
- [ ] Looks still to build: Liquid Glass, HUD Terminal, Blueprint, Editorial, Clay, Minimal Mono, Midnight, Ocean Bento, Sunrise Soft, Paper; then exam/results/Plans screen audit per Look; save Look to account.

## 0. Now — next steps in order (26 Oct)

- [x] **(you) URGENT: Supabase rejects every signed-in database call from browsers** ("JWT issued at future", PGRST303, measured for 12+ minutes on 26 Oct). This breaks the referral link ("Creating your link…"), the sponsor break, profile loading/saving and anything else read directly from the browser. Steps: Supabase dashboard → your project → **Project Settings → General → Restart project**; if it persists, **Project Settings → JWT Keys**: check the current signing key, and open a ticket with Supabase support quoting PGRST303. Tell me when done; I re-test. **VERIFIED RESOLVED 30 Oct:** 11 live screens signed in (Pro and Free accounts) show no Supabase 4xx/5xx and no console errors; profile saves (PATCH profiles 204, value persists after reload).
- [x] **Bug batch of 26 Oct fixed, verified, deployed** — see §0a.
- [x] **R19 Battles** built and tested 30 Oct (migration `0043_battles.sql` applied): `/api/battles`, `/challenge/<id>`, live `/battles` board (15 s polling), server-graded scores, Free 3 active, 7-day expiry. Open: Telegram ping to the sender, topic-by-topic comparison, rematch. Ref: [`docs/done/roadmap/R19-BATTLES.md`](docs/done/roadmap/R19-BATTLES.md)
- [ ] **(me) R18 UI refresh** — dashboard first, then analytics, AI Mentor, other screens; contact sheet of layouts for you to pick. Ref: [`docs/roadmap/R18-UI-REFRESH.md`](docs/roadmap/R18-UI-REFRESH.md).
- [ ] **(me) R11 Forge**, then **R20 Solutions** for every question, with **R12 Study materials** possibly in parallel. Refs: `R11-FORGE.md`, `R20-SOLUTIONS.md`, `R12-STUDY-MATERIALS.md`.
- [ ] **(you)** Swaseekh signed-in review: sign in with Google and send screenshots of dashboard, question bank, a textbook page, analytics with institute filter, mock test, pricing (I can't sign in with a Google account). Analysis so far: [`docs/business/competitors/COMPETITORS_2026-10.md`](docs/business/competitors/COMPETITORS_2026-10.md).
- [ ] **(you)** Telegram: edit the pinned welcome post (it still says "with yesterday's answer"; now the answer is a spoiler in the same post). To refresh old link previews in Telegram, send the site link to **@WebpageBot**.
- [x] **R16-A1 dependency patch** done 30 Oct (`npm audit fix` x2: 0 vulnerabilities, prod and dev). R16-A2 security headers done 30 Oct (see below). Still open: **R16-A3 sanitising**.
- [ ] **(you)** Decisions F1, S1, S4 ([`docs/open-work/OPEN_DECISIONS_FOR_YOU.md`](docs/open-work/OPEN_DECISIONS_FOR_YOU.md)).

### 0a. Bug batch 26 Oct (verified on a local production build, phone 390 + desktop 1440, light)
- [x] 3 Link previews used an old built-in image (`app/opengraph-image.tsx` overrode the cards) → removed; every page now uses the approved cards (branch pages their own)
- [x] 4 Timer: a line flows round the timer pill showing time left (green → amber → red) and one soft pulse at 10, 5 and 1 minute left
- [x] 5 "Save & next" / "Mark & next" on the last question asks: Submit test, or Keep going
- [x] 6 Results scoreboard was empty on phones (card had no height) → fixed, both faces checked phone + desktop
- [x] 7 Review Previous/Next hidden on phones (100vh behind the browser bar) → dynamic viewport height on all full-screen pages; verified
- [x] 8 Long equations were cut off → they scroll sideways; swipe-to-navigate ignores equations and tables
- [x] 9 Profile save button missing → **cause is the Supabase outage above** (profile never loads); the page now says so with a Try again button. Re-test after the Supabase fix. Verified 30 Oct on the live site: the "Save changes" button appears once something is edited; the save succeeds and persists.
- [x] 10 Telegram section lists your branch channel, hub, discussion group and the all-in-one folder link (shows when Telegram is enabled; check on the live site)
- [x] 11 "Very high priority" badge no longer wraps (single line, shorter label)
- [x] 12 Locked Pro sections show a short faded preview (max 420 px), not a page-long blur
- [x] 13 Today, study planner and study timer cards now have the same card effect as the rest
- [x] 14 Syllabus: every sub-topic chip shows its share of the unit's marks with a fill bar and details on hover/tap (shared tags marked *) — CS page; other branches next
- [x] 15 Referral link / sponsor break → **same Supabase outage**; re-test after the fix Verified 30 Oct: Profile overview no longer stuck on "Creating your link…" (referral/sponsor flows not exercised end to end).
- [x] 2 Speed: first-load JS cut — exam session 443→241 KB, setup 421→219 KB, AI Mentor 435→233 KB, profile 768→279 KB; the 1.8 MB avatar library no longer loads on every page (styles load one at a time); chart library only when the goal panel opens; decorative fonts not preloaded
- [ ] 1 Live battles → R19 (planned above)
- [x] AI pre-generation: fixed the 1,000-row cap (Civil and older papers were never processed) and LaTeX-backslash JSON failures; status table in [`docs/roadmap/R20-SOLUTIONS.md`](docs/roadmap/R20-SOLUTIONS.md)

## 1. Needs YOU

### Decisions (context + my defaults: [`docs/open-work/OPEN_DECISIONS_FOR_YOU.md`](docs/open-work/OPEN_DECISIONS_FOR_YOU.md))
- [x] 🔒 **F1** Plus Forge limit (31 Oct: 15 a day, Pro unlimited) — was: — default: Daily Forge + filtered practice, no archive, no "X" items; Pro gets all. *Blocks R11-A2 limits.*
- [ ] **F2** Free sees Forge Mock solutions after the mock — default: yes, one week.
- [ ] **F3** One Daily Forge teaser per branch channel — default: yes.
- [ ] **F4** Forge Mock cadence — default: weekly CS, fortnightly others until buffers exist.
- [ ] **F5** Order CS → EC → EE, ME, CE, DA — default: yes.
- [ ] **F6** Keep the name "Forge" — default: yes.
- [x] 🔒 **S1** Study-materials pricing model/price (31 Oct: per-subject packs ₹99-149 + bundles; `13-PRICING-BUNDLES-AND-OFFERS.md`) — was: — default: one-time pass per branch, test ₹499–999. *Blocks R12-A6.*
- [x] **S2** Branch order after CS (31 Oct: CS first, other branches after, General Aptitude last and shared) — was: — default: EC, EE, ME, CE, DA.
- [ ] **S3** Sources rule — default: confirmed (learn from textbooks; coaching notes for layout/coverage only).
- [x] 🔒 **S4** Accuracy reviewer (31 Oct: owner reviews CS) — was: — default: you spot-check CS, paid tutor per subject later. *Blocks R12-A5 sign-off.*
- [ ] **S5** English only at launch — default: yes.
- [ ] **S6** "Deadlock" sample chapter first — default: yes.
- [ ] **S7** Study content in a private repo/bucket — default: yes.
- [ ] Business: study-pass refund policy; GST later (accountant); rights for reference books in `notes/`.
- [ ] Feature catalogue: approve any of the 56 ideas in [`docs/roadmap/FEATURES.md`](docs/roadmap/FEATURES.md) (reply "approve 1, 3, 23…").

### Tasks
- [ ] **Films:** watch v8 on laptop + phone → YouTube (landscape `renyxera-film-v8-4k.mp4`), Short + Instagram Reel (`renyxera-film-v8-vertical-1080.mp4`) → send the YouTube id.
- [ ] **Instagram:** Professional account → Meta app → tester → token → secrets `IG_USER_ID`, `IG_ACCESS_TOKEN` → run `social-check` ([`docs/growth/instagram/01-SETUP.md`](docs/growth/instagram/01-SETUP.md)).
- [ ] **Telegram Premium:** boosts on hub + CS; six per-branch folders (send links); BotFather menu button + commands (`docs/growth/telegram-premium/`).
- [ ] **2FA everywhere** (R16-B1): GitHub, Cloudflare, Supabase, Google, Razorpay, Meta, Telegram — I'll give steps.
- [ ] **GitHub protections** (R16-B3): secret scanning, push protection, Dependabot — I'll give steps.
- [x] **Migrations:** run `0040_forge.sql` when I hand it over (R11-A1).
- [ ] **Accounts test:** Forge/practice-set gate with real Free, Plus, Pro accounts.
- [ ] **Real phone:** payment, More sheet drag, onboarding Telegram step, aptitude images, Civil practice.
- [ ] **Growth:** G-5 tracking sheet, C-3 community posts, V-1 three Shorts, P-1 three partner offers, Q-1 five answers (I draft).
- [ ] **Razorpay:** confirm UPI MDR (Settings → Pricing).
- [ ] **Microsoft Store (R17):** create Partner Center individual account (confirm it's free), reserve "RENYXERA", send Package ID/Publisher ID/Publisher name.
- [ ] 🟡 Custom domain (eu.org pending since 29 Sep, or buy after revenue) → email, AdSense, OAuth branding.
- [ ] Google OAuth logo: upload [`public/brand/oauth-logo.png`](public/brand/oauth-logo.png) in Google Cloud console.
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

### 3A · Release 11 — Forge (P1) · [`docs/roadmap/R11-FORGE.md`](docs/roadmap/R11-FORGE.md)
**Done**
- [x] Design ([`docs/forge/FORGE_DESIGN.md`](docs/forge/FORGE_DESIGN.md)) and access rules ([`docs/forge/FORGE_ENTITLEMENTS_AND_SETUP.md`](docs/forge/FORGE_ENTITLEMENTS_AND_SETUP.md))
- [x] AI practice sets gated by plan (migration 0039)

**A · Foundation**
- [x] **A1 Migration `0040_forge.sql`** written (27 Oct) — **(you) run it in Supabase SQL editor** — `forge_items` (public half, `release_at`, `status`, `mock_only`), `forge_answers` (private, no policies), `forge_item_stats`; RLS hides unreleased/mock items.
  - Done when: security check proves anon/auth can't read answers or unreleased items. Depends on: you run it.
- [x] **A2 Entitlement** (`FORGE` + `canUseForgeQuestions` in plans.ts; Plus default 10/day until F1) — Forge block + `canUseForgeQuestions(tier)` in [`lib/billing/plans.ts`](lib/billing/plans.ts); Plus limit 🔒F1.
- [x] **A3 APIs (grading part)** — `/api/forge/items` (tier/branch/rate-limit), Forge branch in `/api/answers` and `/api/exam/grade`, `/api/forge/report`.
  - Done when: scripted tests for guest/Free/Plus/Pro pass; no answer before submit.
- [x] **A4 UI** — Daily Forge card (blurred + upgrade for Free), setup source switch Past papers / Forge / Mixed, Forge badge, solutions, report button, analytics split.
  - Done when: screenshots desktop/mobile × light/dark approved.
- [ ] **A5 Beta flag** — owner-only until launch.

**B · Authoring pipeline (₹0, Claude sessions)**
- [x] **B1 [`scripts/forge/profile.py`](scripts/forge/profile.py)** (CS: 91 topics weighted) — per-topic weight, type mix, difficulty, 3-year trend.
- [ ] **B2 `scripts/forge/plan.py`** — batch blueprint (topics × archetypes × difficulty).
- [ ] **B3 Batch format** — item schema + `verify` code per item.
- [x] **B4 [`scripts/forge/validate.py`](scripts/forge/validate.py)** — schema, code-recomputed keys, distractor logic, PYQ-overlap check, MathJax render.
- [x] **B5 [`scripts/forge/seed.mjs`](scripts/forge/seed.mjs)** (static forge.json still to do) + answer-free `public/data/<CODE>/forge.json`.
- [x] **B6 First CS batch of 60** — you spot-check 10; 0 wrong keys required.
- [ ] **B7 CS buffer** — 300 practice + 30 days Daily Forge + 3 mocks (~800 items, ~14 batches).

**C · Launch**
- [ ] **C1 Daily Forge CS** — 06:00 IST, streak, board; CI fails if < 14 days queued.
- [ ] **C2 Forge Mocks (all tiers)** — build-mock script, Sunday 10:00 IST (🔒F4 cadence), solutions per F2; resume mock scheduling.
- [ ] **C3 Calibration loop** — flag items by p-value/discrimination after 50 attempts.
- [ ] **C4 Telegram teasers** (F3) and hub mock announcements.
- [ ] **C5 Launch marketing** — post, film cut, Plans section, What's new.
- [ ] **C6 Roll-out** EC → EE, ME, CE, DA (F5).
- [ ] 💡 "X" items for Pro · subject mini-mocks · adaptive Forge sets.

### 3B · Release 12 — Study materials (P2) · [`docs/roadmap/R12-STUDY-MATERIALS.md`](docs/roadmap/R12-STUDY-MATERIALS.md)
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

### 3C · Release 13 — Monetisation III (P3) · [`docs/roadmap/R13-MONETISATION.md`](docs/roadmap/R13-MONETISATION.md)
**Done**
- [x] Plans in [`lib/billing/plans.ts`](lib/billing/plans.ts); Razorpay live (verify, webhook, reconcile, receipts); season pass; prorated upgrade; coupons; upgrade prompts; referrals; ad slot architecture

**Open**
- [ ] **A1 Forge locks as the main upgrade moment** — blurred Daily Forge, "practise like the ones you missed" after Forge Mocks; events per source.
- [x] **A2 Plans page refresh** — comparison table and FAQ done 6 Nov (`components/billing/plans-compare.tsx`); testimonials wait for consented ones; film already on the page.
- [ ] **A3 Season-pass campaign Dec → exam** — banner by date, weekly hub post, Instagram, early-buyer coupon.
- [x] **A4 Smart upgrade sheet** (6 Nov: per-day price strip and per-surface click tracking; a feature preview image is still to do).
- [x] **Battles seasons and badges** (7 Nov: Season tab, lazy badge awards after each season, badges next to names; migration 0054 applied). Still open: speed bonus in settlement (needs the owner's finish time), a Look trial as the season reward.
- [ ] **Mentor recharge packs: make them purchasable** (6 Nov: shown with "Notify me" on the Plans page and upgrade sheet, Rs 19/49/79 for 150K/450K/1.2M tokens; buying needs the `ai_credits` pack ledger migration, a "topup" Razorpay order type, token metering in the AI route, and the Receipt ledger; spec in [`docs/roadmap/R27-MENTOR-CHAT-FEATURES.md`](docs/roadmap/R27-MENTOR-CHAT-FEATURES.md) section 3).
- [ ] **A5 Bundling nudge** after 3 purchases.
- [x] **A6 Post-purchase tour** (6 Nov: 3-step welcome after activation; verify on the next real payment).
- [ ] **B1 Study pass** (R12-A6) · **B2 Affiliates** (books, calculator; disclosure; click tracking) · **B3 Sponsorship media kit** · **B4 College licences** · **B5 Formula-sheet packs** · **B6 🟡 Ads after domain** (consent, non-personalised under 18, ad-free for paid).
- [ ] **C2 Monthly billing report to your Telegram** · **C3 Refund flow test** · **C5 Feature-flag copy tests** · **C4 🟡 GST**.

### 3D · Release 14 — Marketing and growth (P4) · [`docs/roadmap/R14-MARKETING-GROWTH.md`](docs/roadmap/R14-MARKETING-GROWTH.md)
**Done**
- [x] Film v8 (4K landscape, vertical 1080 at 31.6 MB, vertical 4K); click-to-play component
- [x] Telegram hub + six branch channels + topics group + folder link (working; hub bot posted 19 Oct)
- [x] Instagram publisher, calendar, `social-check`; setup docs
- [x] SEO: titles, JSON-LD `sameAs`, branch Telegram links/FAQ, footer links, social cards, sitemap, Search Console
- [x] Growth docs and UTM + `weekly_growth_metrics()`

**Open**
- [ ] **Next-level videos (owner, 7 Nov: "all the videos are boring", the vertical film looks messed up, wants trending, AI-made-style reels, not basic ones)**: audit done 7 Nov and shot list written in [`docs/growth/marketing/VIDEO-REBUILD-SHOTLIST.md`](docs/growth/marketing/VIDEO-REBUILD-SHOTLIST.md), waiting for the owner's OK (task G5); then build film A; audit the vertical film (FilmVertical) and the v8 landscape film; research current trending reel and launch-film styles first (kinetic type, real product screen recordings with cursor moves, fast cuts on beat, big proof numbers, strong 2-second hook); rebuild in Remotion with the installed skills (remotion, motion-reel, animation-studio); test every cut on phone and desktop frames before handing over; reel-top5 number flicker already fixed 7 Nov.
- [ ] **Update the landscape promo film (v8, 4K) to the current product** (7 Nov: owner is uploading the old v8 now so the channel is not empty; later re-cut with Forge, Battles, the AI Mentor, the plans page and recharges; owner re-uploads or replaces the video id).
- [ ] **A1 Frame-check films** (12 frames each) → **A3 publish** (you) → **A4 set YouTube id** → **A5 30 s/15 s/4:5 cuts**.
- [ ] **B2 Instagram 4-week calendar** (5 posts/week) → **B3 carousel generator** (PYQ → 5 branded slides).
- [ ] **C2 Telegram deep links + branch commands** (after BotFather) · **C3 story images** · **C4 per-branch folder links on pages** · **C5 Forge teasers**.
- [ ] **D1 Monthly Search Console CTR fixes** · **D2 programmatic pages for every branch** · **D3 branch predictors (official data)** · **D4 internal linking** · **D6 domain-move plan**.
- [ ] **E Growth tasks** — R-4, L-4, S-4, V-2, V-3, P-2, P-3 (me) + G-5, C-3, V-1, P-1, Q-1 (you); ambassadors after 1,000 users; "Your GATE year" recap.
- [ ] **F Weekly growth report** to your Telegram.
- [ ] 🟡 Welcome email series (needs domain/SMTP).

### 3E · Release 15 — Performance optimisation (no quality loss) · [`docs/roadmap/R15-PERFORMANCE.md`](docs/roadmap/R15-PERFORMANCE.md)
*Audit 22 Oct: 1,280 PNG images (79 MB), recharts in the top bar on every app page, full Prism highlighter in the question renderer, 7 font families preloaded, 824 KB CS bank + 3.5 MB shared pool loaded whole, motion in 81 files without LazyMotion.*
*Budgets: LCP ≤ 2.0 s public / 2.5 s app, INP ≤ 200 ms, CLS ≤ 0.05, ≤ 180 KB first-load JS per app route.*
- [ ] **A1 Lazy-load goal slider panel** (recharts off the shared chunk) — [`components/layout/topbar.tsx`](components/layout/topbar.tsx).
- [x] **A2 PrismLight + registered languages, dynamic `CodeBlock`** — identical rendering on 10 code questions.
- [x] **A3 Fonts** — preload only Manrope, Sora, Bruno Ace SC; decorative fonts only on the dashboard hero.
- [x] **A4 [`next.config.ts`](next.config.ts) hygiene** — drop picsum, `optimizePackageImports`, `removeConsole` (keep error/warn).
- [x] **A5 Bundle CI budget** (6 Nov: `scripts/check-bundle.mjs` in CI after Build; total 2000 KB and 140 KB per chunk, gzip; the visual analyser is optional).
- [ ] **B1 WebP for question images** (lossless/near-lossless, PNG fallback, `<picture>`) — ≥ 50 % smaller, 30-diagram visual check in light/dark.
- [ ] **B2 Image sizes + lazy/priority loading** — CLS 0 on navigation.
- [ ] **B3 WebP brand/poster assets** (OG stays PNG).
- [ ] **C1 Per-paper bank files + index** — first Practice visit < 150 KB of data; offline download still works.
- [ ] **C2 Content-hashed data files + immutable caching**.
- [ ] **C3 Shared pool loaded only when needed**.
- [ ] **D1 LazyMotion (`m.` components)** · **D2 exam session render profile** (INP ≤ 100 ms on option click) · **D3 MathJax per-container typesetting** · **D4 virtualise long lists**.
- [ ] **E1 Edge caching for public pages** · **E2 Supabase Performance Advisor + indexes** · **E3 service-worker strategy**.
- [ ] **F1 Lighthouse CI + extended CWV script (INP, app pages)** · **F2 real-user web vitals to `/api/events`**.

### 3F · Release 16 — Security hardening · [`docs/roadmap/R16-SECURITY.md`](docs/roadmap/R16-SECURITY.md)
*Audit 22 Oct: no HTTP security headers; 9 vulnerable production dependencies (1 critical); `html` AST nodes injected raw; per-isolate rate limits; no security.txt or Dependabot.*
- [x] **A1 Patch dependencies** (critical/high to 0) — 0 vulnerabilities on 30 Oct.
- [x] **A2 Security headers** (30 Oct: HSTS, nosniff, frame deny, referrer, permissions, COOP same-origin-allow-popups; CSP in REPORT-ONLY mode with /api/csp-report; 14 signed-in pages gave 0 violations; Razorpay checkout, Turnstile login and Google sign-in not exercised). Original note: HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors none, COOP same-origin-allow-popups, CSP (report-only → enforce, nonces for inline scripts).
- [x] **A3 Sanitise HTML nodes** (30 Oct: [`lib/security/sanitize-html.ts`](lib/security/sanitize-html.ts) allow-list, no attributes; 17 XSS payloads pass via `npm run check:sanitize`; JSON-LD scripts escape "<" via [`lib/seo/json-ld.ts`](lib/seo/json-ld.ts); MathJax `\href`/`\class`/`\style`/`\cssId` neutralised in [`lib/mathjax-config.ts`](lib/mathjax-config.ts). Note: MathJax 4.1.0 has NO "safe" extension (asking for it breaks all formulas); original text: — bank-only `html` nodes, allow-list sanitiser, AI parser emits no HTML; XSS payload tests.
- [ ] **B1 2FA on all owner accounts** (you) · **B2 key-rotation runbook** (done 6 Nov: [`docs/engineering/SECURITY-RUNBOOK.md`](docs/engineering/SECURITY-RUNBOOK.md)) · **B3 GitHub secret scanning, push protection, Dependabot, branch protection** · **B4 optional TOTP 2FA for paid students**.
- [ ] **C1 Shared rate limits** (Postgres counters or Cloudflare free rule) · **C2 Turnstile on waitlist and issue reports** (done 6 Nov, guests only; the contact page has no form) · **C3 WAF/Bot Fight Mode after domain** · **C4 webhook replay protection** (already done: billing_events stores each event id once).
- [ ] **D1 Supabase Security Advisor clean** (you: Dashboard > Advisors) · [x] **D2 automated RLS probe** done 30 Oct: `npm run check:rls` probes all 43 tables signed-out and as an ordinary account: no leaks, `question_answers` and all private tables denied · **D3 DPDP retention + consent records** · **D4 privacy policy update** (Forge, study materials, shares, channels).
- [ ] **E1 Sentry alerts** · **E2 user-visible security events** · **E3 `/.well-known/security.txt`** · **E4 quarterly restore drill + incident checklist** (written 6 Nov in the runbook; the first drill is yours, task E9).

### 3H · Release 18 — UI refresh (priority) · [`docs/roadmap/R18-UI-REFRESH.md`](docs/roadmap/R18-UI-REFRESH.md)
- [x] U1 (27 Oct): share card (clean share base, branch names, no overlaps), stack deck clipped to tidy lips, navbar gold/silver rings removed, dot-grid texture. Plan: [`docs/roadmap/R18-UI-UPGRADE-PLAN.md`](docs/roadmap/R18-UI-UPGRADE-PLAN.md)
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

### 3I · Release 19 — Battles · [`docs/done/roadmap/R19-BATTLES.md`](docs/done/roadmap/R19-BATTLES.md)
- [x] Migration `0041_battles.sql` + RPCs (server-graded scores only)
- [x] `/challenge/<id>` links, live status card (15 s polling), result screen with winner and topic comparison, rematch
- [x] Telegram pings to the sender; limits (Free 3 active); expiry 7 days

### 3J · Release 20 — Solutions for every question · [`docs/roadmap/R20-SOLUTIONS.md`](docs/roadmap/R20-SOLUTIONS.md)
- [x] AI pre-generation status measured (26 Oct): CS 11 %, DA 26 %, EC 12 %, EE 12 %, ME 10 %, CE 0 %; 360 failed (≈225 Gemini overload, retried; ≈130 JSON, now repaired); 1,000-row cap fixed
- [ ] Solution format + validator (answer must equal official key; control-character scan)
- [ ] `question_solutions` table + review panel + flag-an-error
- [ ] CS → EC → EE → ME → CE → DA; GA once

### 3K · Competitors · [`docs/business/competitors/COMPETITORS_2026-10.md`](docs/business/competitors/COMPETITORS_2026-10.md)
- [x] Swaseekh (public pages) and GATE CS Preparation Hub (Hatchable) analysed on desktop + phone; 16 ideas ranked (C1–C16)
- [ ] Signed-in Swaseekh review (needs your screenshots)

### 3G · Release 17 — Microsoft Store app (Windows) · [`docs/roadmap/R17-MICROSOFT-STORE.md`](docs/roadmap/R17-MICROSOFT-STORE.md)
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
- [ ] **Verify markdown tables** render ([`lib/repository/transformers/table-extractor.ts`](lib/repository/transformers/table-extractor.ts); test `GATE_CS_2025_AN_Q8`) — done when shown as a table in exam, review, PYQ page.

### Release 2 — Premium experience ✅
- [x] Design system, themes, motion, redesigned dashboard/analytics
- [ ] **UI pass leftovers** — review page polish; image/code rendering audit on Mistakes, Bookmarks, Revision (desktop/mobile × light/dark).

### Release 3 — AI ✅
- [x] AI Tutor, AI Mentor (8 coaches), tier quotas, cache, pre-generation, AI practice sets

### Release 4 — Foundation
- [x] 4A Cloudflare + CI/CD + rollback + PWA · 4B Postgres/RLS/seeding · 4C email + Google auth, Turnstile · 4D guest mode · 4E profile/goals/achievements · 4F isolation + devices · 4G API hardening · 4H branch pages · 4I cloud sync · 4J calibration 2023–2026
- [ ] **4J Official marks↔AIR + category curves** — March 2027 refresh from the official report; label vintage.
- [ ] **4J Official schedule page** from the GATE 2027 brochure ([`lib/seo/gate2027.ts`](lib/seo/gate2027.ts)).
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

### Release 9 — Depth and community · [`docs/roadmap/R09-R10-DEPTH-AND-ADMIN.md`](docs/roadmap/R09-R10-DEPTH-AND-ADMIN.md)
- [ ] **9A FSRS spaced repetition + daily adaptive set** — due counts sync across devices; recall measured.
- [ ] **9B Freeze tokens, XP/levels, daily goals, study-time boards**.
- [ ] **9C Moderated community** (only with moderation tools).
- [ ] **9D App stores** → R17 (Windows) · 🟡 Android.
- [ ] **9E AI depth** — weakness study plan, AI mocks, natural-language search, voice revision.
- [ ] **Flashcards** · **Telegram phone verification + weekly report** · 🟡 WhatsApp.

### Release 10 — Admin console · [`docs/roadmap/R09-R10-DEPTH-AND-ADMIN.md`](docs/roadmap/R09-R10-DEPTH-AND-ADMIN.md)
- [ ] **Admin-lite first** (Forge review queue, reports, coupons, mocks). Full spec written: [`docs/roadmap/R10-ADMIN-SPEC.md`](docs/roadmap/R10-ADMIN-SPEC.md) (decided: stays at `/admin`, not a separate app; modules for learners, money, marketing, Telegram/Instagram/YouTube, automations, content ops, health). Owner said do not build yet; R30 `/admin` is the first slice.
- [ ] **10A strict login + 2FA · 10B roles in Postgres · 10C mocks · 10D integrity queue · 10E content editing with versioning · 10F users (DPDP) · 10G dashboards · 10H money · 10I comms · 10J audit · 10K flags/kill switches · 10L AI pre-gen console · 10M AI logs with retention**.

### Platform-wide
- [x] Sentry, Web Analytics, keep-alive, encrypted backups + drill, CWV script, E2E smoke in CI
- [x] Handover pack ([`HANDOFF.md`](HANDOFF.md), [`CLAUDE.md`](CLAUDE.md), `handover/`, `docs/roadmap/`) — 22 Oct
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
- [ ] [`components/exam/exam-timer.tsx`](components/exam/exam-timer.tsx) 3 h fallback when no draft
- [ ] Dead code: `design-system/*` (if present), duplicate `PersonalNotesDrawer`
- [ ] Rename [`data/Aggregated_Output.json`](data/Aggregated_Output.json) → `data/pyq/CS/gate_cs_pyqs.json` (update loaders/scripts)
- [ ] Share card browser test; Playfair "Q" swash review
- [ ] Manifest still says "GATE CSE" (fixed by R17-M1)

---

## 7. Feature catalogue 💡 — 56 proposals with what/why/how/tier/effort in [`docs/roadmap/FEATURES.md`](docs/roadmap/FEATURES.md)
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
- [x] AI Mentor refactor plan written: docs/done/roadmap/R21-AI-MENTOR.md (awaiting owner decisions in section 10)
- [ ] Build AI Mentor M1 (chat shell, Know-me panel, analytics cards moved out)
- [ ] AI Tutor inner workspace panels on the shared pastel look
- [x] Forge items seeding so Forge/Blend use real items; Battles in avatar menu; Ctrl+K palette

## 29 Oct 2026 (mobile pass)
- [x] Exam Setup on phones: Build a test / Forge or Spark questions / Flashcards switcher was hidden below 640px; now shown (tested in every source)
- [x] Floating top bar fits 360-390px (avatar no longer cut off)
- [x] Exam header on phones: Submit no longer pushed off screen (root cause: unlayered .btn-soft display beat Tailwind hidden); aria-labels added
- [x] Neutral buttons no longer fuse with their ink shadow (notched corners on "See my results" / "Confirm Submit"); exam Submit, results Dashboard/Retry now use the shared button style
- [x] Battles in the avatar menu; Ctrl+K palette: pastel selection, links to Mentor, Tutor, Study, Forge, Mocks, Battles, Tools, Calendar, Plans
- [x] Forge items are not seeded: seeding approves live content, so it needs your go-ahead and a release date (see scripts/forge/seed.mjs)
- [ ] Build AI Mentor M1 (research first, tomorrow)

## 29 Oct 2026 (AI Mentor and AI providers)
- [x] AI Mentor rebuilt: home (quick ask, today's plan, next actions, what I know + forget), dedicated chat screen /ai-mentor/chat (plan, review, quiz, guided, weekly), MENTOR_CHAT server type, number check, notes, flags; old analytics cards moved to Analytics > Coach insights
- [x] AI provider layer: OpenRouter free models auto-picked per task with key rotation, Gemini fallback; docs/engineering/AI_PROVIDERS_SETUP.md
- [x] Forge generator (Gemini/OpenRouter/OmniRoute) + nightly workflow to forge-auto
- [x] You: add OPENROUTER_API_KEYS to Cloudflare + GitHub + .env.local (steps in docs/engineering/AI_PROVIDERS_SETUP.md)
- [ ] Mentor not done: cloud-synced memory, Telegram weekly check-in, photo doubts, 50-question evaluation set, live test with a real model reply
- [x] R22 Test Centre (merge Mocks + Exam engine): docs/roadmap/R22-TEST-CENTRE.md, after Mentor

## 29 Oct 2026 (evening)
- [x] Mentor: goals, roadmap by days left, things I noticed, daily check-in, focus timer, AI practice questions (Spark generator) inside the Mentor, full-width chat
- [x] AI Tutor: finds saved AI/snapshot questions (was "No active question loaded"), clear "not on this device" state, panels tinted peach / sky / lilac
- [x] 29 Oct: Forge live for Plus/Pro: migration 0040 applied, 6 pilot items seeded; `/api/exam/grade` and `/api/answers` grade FORGE_ ids from forge_answers (plan, branch, release rules; solution returned with key); hub Daily/Practice/Bookmarks read `/api/forge/items`; `UPCOMING.forge = "live"`
- [ ] Forge in built tests: Exam Setup Forge/Blend shares still PYQ-only (grading is ready; wire the generator + a larger bank); Forge Mocks card is a placeholder; `/api/forge/report` not built
- [x] You: OPENROUTER_API_KEYS in Cloudflare, GitHub, .env.local; GEMINI_API_KEY in GitHub for the nightly Forge job (docs/engineering/AI_PROVIDERS_SETUP.md)
- [ ] Mentor still to do: cloud-synced memory (migration), Telegram weekly check-in, photo doubts, evaluation set, real-model test after keys
- [x] R22 Test Centre (docs/roadmap/R22-TEST-CENTRE.md) after Mentor

- [x] Test Centre phase A1: hub at /test-centre, one navbar item replaces Exam Setup + Mocks, bottom bar updated, old routes unchanged
- [x] Test Centre A2-A6 (routes): /test-centre/{build,mocks,mocks/results,practice,history}; old /setup, /mocks, /mocks/results redirect; section bar with back-to-hub on every screen; one Attempt model (features/test-centre/model.ts)
- [ ] Test Centre later: physically move runner/stores out of app/(dashboard)/exam, merge challenge/checkpoint/fresh-mock routes, add the mock countdown to the hub, one TestConfig
- [x] Test Centre hub redesigned (mission path, mock countdown, big-number tiles, sticker chips, icon watermarks); global shape watermark on every pastel card
- [x] Tools hub rebuilt as a single-screen bento; exam-style option tiles on mistakes/bookmarks/revision/Mentor practice; Test Centre screens take their hub tile colour; page-shell is a column so fill-height pages fit under the Test Centre bar
- [x] Tools hub redesigned after research: verb-led intents (rank / plan / practise) as master-detail, one featured tool + rows, single screen; Test Centre hub could take the same pattern if the owner prefers it
- [x] 29 Oct: OpenRouter key verified (auth 200, Nemotron-3-Ultra answered); model-picker refreshed to the current 17 free text models (old deepseek/qwen/gpt-oss names were no longer free). Free models rate-limit (429): second key and Gemini fallback matter for batches.
- [x] 29 Oct: "tease, don't block" for paid features (owner rule): Forge Free = fixed taster of 10 playable questions (solution locked, rest as locked cards, server-enforced); Study Free = Operating Systems > Deadlock, first 4 topics open, rest locked with study-pass prompt; locked chapters link to plans
- [ ] Apply the same taster to the other gated features (AI practice sets, Battles, Spark, Planner automation, offline downloads); audit each Free-blocked screen
- [x] 29 Oct: Tutor panels recoloured to the blue family; Free AI practice sets taster (3 per account, never reset) coded; fails closed until migration `0042_free_taster.sql` is run (you). Analytics stays a full lock (owner: a view, not a feature to try)
- [x] **(you) run [`supabase/migrations/0042_free_taster.sql`](supabase/migrations/0042_free_taster.sql)** in Supabase SQL editor (click-by-click steps given in chat)
- [ ] Taster for Battles, Spark and planner automation: audit when those go live
- [x] 30 Oct: Forge nightly workflow fixed (both earlier runs hit the 2 h limit and lost their work): generate step now stops at 95 min and the push step always runs
- [ ] Forge in built tests: `gradeNow` in [`lib/repository/answer-keys.ts`](lib/repository/answer-keys.ts) only sends `GATE_` ids to the grader, so FORGE_ ids in a test are never graded; allow FORGE_ ids there when the Exam Setup Forge/Blend source is wired
- [x] 30 Oct: Battles Telegram message to the owner when a friend starts and finishes (linked members; mute with prefs.battles=false); FORGE ids now sent to the grader (server still applies plan/branch/release rules)
- [x] 30 Oct: Battles subject-by-subject comparison (`/api/battles/[id]/compare`), rematch (friend turns their score into a new battle), Free 3-active-battle limit verified
- [ ] Battles: look at the comparison and rematch UI in a browser (API verified only); test the Challenge button on a real result page
- [ ] Forge in built tests: load Forge items into the exam engine (they live in the database, the engine reads the static bank), keep them in the saved session for review, then enable the Forge/Blend shares in Exam Setup
- [x] 30 Oct: Forge bank now 17 CS questions live (6 pilot + 1 reviewed from the cloud run + 10 authored in session, [`scripts/forge/author_b002.py`](scripts/forge/author_b002.py), every answer computed by its own verify code); Free sees 10 + 7 locked; locked keys refused. Finding: the cloud Gemini run made 1 question in 95 min (free tier is the bottleneck) so the bank grows by session authoring, not the nightly job
- [ ] Next Forge batches: author_b003.py (other CS topics: compilers, COA pipeline/cache, DBMS transactions, networks, programming), then EC/EE/ME/CE/DA; static answer-free `forge.json` per branch still to do
- [x] 30 Oct: Forge hub: questions use the full width (side cards moved below), "Show solution" before checking fetches the key first, fenced code blocks render for C questions; bank now 29 CS questions (b003 = 12 more, `author_b003.py`)
- [x] Owner decision: size to reach for CS before starting the other five branches in parallel (design target was ~800 across practice + Daily + mocks)
- [ ] Forge CS bank: 329 of the 800-question target live (6 Nov); finish CS to 800 before any other branch (owner, 30 Oct).
- [x] **Checkpoint** rebuilt 30 Oct: `/checkpoint` no longer a dead end: mixed 10-question checkpoint from the last 5 tests + mistakes (unseen first, easy to hard) and a searchable topic picker for the 8-question single-topic one; started a real 1/10 session (desktop light, mobile dark). Open: look at results/retry flow for a checkpoint, and mobile light / desktop dark views
- [x] 30 Oct package updates verified: full build passes, Battles create/finish/compare (zod routes), grading and security checks pass
- [x] 30 Oct: reviewed `New folder/` (3 MadeToScale Instagram Reels + a 20-page "12 landing page animations" PDF; third-party, reference only, not for committing)
- [ ] Owner to choose from the ideas taken from those references: Reels format for GATE (countdown list, kinetic captions, "comment a keyword" lead magnet), landing-page motion (hero reveal, count-up, process draw, price roll) within our rules (reduced motion, transform/opacity only, play once, real data only)
- [x] `New folder/`: owner will delete it (31 Oct), no .gitignore needed
- [x] 30 Oct: UI UX Pro Max skill (nextlevelbuilder, MIT) reviewed and installed at `.claude/skills/ui-ux-pro-max` (scripts have no network/exec/write; design system stays [`docs/design/DESIGN-SYSTEM.md`](docs/design/DESIGN-SYSTEM.md)); standing rule saved: use fitting skills/plugins each round
- [x] 30 Oct: reference review written: [`docs/business/reference/MADETOSCALE_REFERENCE_REVIEW.md`](docs/business/reference/MADETOSCALE_REFERENCE_REVIEW.md) (tools verdicts, which animations to adopt, reel format)
- [x] **Reel template built (30 Oct):** composition `CountdownReel` in `video/` (1080x1920, 30 fps, 22 s: hook, five numbered topics, outro) from real data via [`video/scripts/make-reel-data.mjs`](video/scripts/make-reel-data.mjs); stills checked, **not rendered** (render when you ask: `cd video && npx remotion render src/index.ts CountdownReel out/reel-top5.mp4`). Open: voice-over/captions audio (Kokoro), Hindi version, export cuts, a second reel (e.g. "3 traps in cache questions")
- [ ] **Landing motion with `motion` (no GSAP):** one shared `CountUp`, hero word reveal, "how it works" line draw, Plans price roll, sign-up/upgrade button states; checked with the ui-ux-pro-max motion rules and the 6-point pre-ship list (reduced motion, transform/opacity only, play once, under 2.5 s, real data only)
- [ ] Optional: try Chatterbox on one Hindi line for Hindi/Hinglish reels (needs your OK; never clone a real voice without consent); OpenWhispr voice typing for you
- [ ] Review the `claude-youtube` skill pack before the YouTube channel launches (third-party: review first)
- [x] 30 Oct: Reel rendered: `video/out/reel-top5.mp4` (22.6 s, 1080x1920, H.264, silent; local only, not committed). Open: voice-over + captions audio, Hindi cut, watch-through review by you
- [x] 30 Oct: shared motion components built with `motion` (no GSAP): [`components/ui/count-up.tsx`](components/ui/count-up.tsx) (used on the Test Centre hub stat tiles) and [`components/ui/price-roll.tsx`](components/ui/price-roll.tsx) (used on the Plans prices); both honour reduced motion and expose the real value to screen readers. Verified 30 Oct: price roll on Plans (desktop light, mid-roll and settled; mobile dark prices correct; reduced motion shows plain text). Open: count-up on the hub with real numbers (test account had zeros) and mobile light/dark visuals
- [x] Hero word reveal built ([`components/ui/word-reveal.tsx`](components/ui/word-reveal.tsx), CSS only, plays once, reduced-motion safe; on the Tools hub headline; verified staggered fade-in and instant under reduced motion). Still to build: "how it works" line draw, sign-up/upgrade button states, use the reveal on the landing headline
- [ ] Forge next batches: more MCQ and MSQ items (b002-b004 are mostly numeric answers), then toward 800
- [x] 30 Oct: Forge hub supports multiple-select (MSQ) questions: checkboxes, "Select all that apply", graded with the MSQ rule
- [ ] **Enforce the CSP** after about a week of real traffic: read `csp_violation` log lines, fix what is legitimate, then switch `Content-Security-Policy-Report-Only` to `Content-Security-Policy`; later replace `'unsafe-inline'` scripts with nonces
- [x] 30 Oct, on the LIVE site with the new headers: Google sign-in hands off to accounts.google.com (after the Terms box); "Get Plus" creates a live Razorpay order and the payment window opens fully (UPI QR, cards, wallets) — nothing paid. Two unpaid test orders (Plus, 249) now exist from account zz-free-tester@example.com. Policy flagged only cdn.razorpay.com/risk-detection (added to the allow-list). Cloudflare's Turnstile frame shows its own policy messages (not ours). NOT yet verified: a completed payment, the verify/webhook activation of the plan, and refunds
- [x] Real payment test done by the owner: 2 live orders of 29 rupees marked paid (6 Nov check). Still open (you): confirm the plan turned on, the receipt, then test the refund flow.
- [x] 30 Oct: Forge plain text (options, steps) no longer waits for MathJax; only text with maths does
- [ ] Note for future MathJax upgrades: re-run `scripts/zz-mjsafe.mjs`-style check (a `\href{javascript:...}` must produce no link and formulas must still render) after changing the config or the MathJax version
- [ ] **(you) Device-limit cooldown on the Pro TEST account** (justforpersonal7774@gmail.com): my automated sessions registered 44 one-shot "devices" in 30 days, so a NEW device signing in with that Pro account now gets "Too many new devices this month" (the limit is 4 new devices per 30 days). Fix: delete those rows (tell me "delete the test device rows", I was not allowed to without your OK) or revoke them in Profile > Devices; they age out by about 27 Nov. Free accounts are never limited, so all my live tests now use zz-free-tester@example.com
- [ ] Profile UX nit: the "Save changes" button only appears after an edit (fine), but the old report "Save button missing" came from the outage; consider a visible "All changes saved" state
- [x] 30 Oct: standing rule for live tests: use the Free test account (no device limit), never the Pro account
- [ ] **Single-screen rule (owner, 30 Oct): measured with `scripts/zz-fit.mjs` at 1920x912 / 1440x900 / 1366x768.** Page overflow in px (0 = fits): Test Centre hub 14-22, Tools hub 38, Build/Practice/History/Challenge/Forge/Downloads/Analytics/Revision/Mistakes/Bookmarks/Profile 0; still scrolling: Mocks 675+, Checkpoint 253+, AI Mentor 666+, AI Tutor 138+, Battles 118+, Study 378+, Calendar 108+, Plans 536+; the exam RESULTS screen (circled in the owner's screenshot) clips its stat tiles under the action bar. Fix order: results screen, Test Centre hub, Tools hub, Checkpoint, Mocks, Battles, then the rest; inherently long pages (Plans, Mentor chat) get an internal scroll area instead of page scroll
- [ ] Owner-side steps listed in chat on 30 Oct (payment test, device rows, Supabase Advisors, 2FA, GitHub protections, decisions F1/S1/S4, reel review)
- [x] 31 Oct: Security Advisor (0 errors, 35 warnings, 26 info) and Performance Advisor (0 errors, 15 warnings, 26 info) opened by the owner. **(you)** open the **Warnings** tab of each, click **Export** (or screenshot the list) and send it so I can fix them; the 26 "info" items are probably the private tables that intentionally have no read policy
- [x] 31 Oct: GitHub protections done by the owner (secret scanning, push protection, Dependabot, ruleset). 2FA on all accounts: owner will do later
- [x] 31 Oct: Pro test account device cooldown: owner chose option C (leave it; ages out around 27 Nov). All live tests use the Free test account
- [x] 31 Oct: refund policy rewritten to the owner's rule (refunds only for glitches and errors, by email with a genuine reason): `/refunds`, `/terms` section 7, Plans confirm box, receipt, contact page; the old "currently free, no payments" and 7-day refund wording removed. Legal review still open
- [ ] **Study materials: build plan after the decisions:** (1) pack and bundle data model + `study_access` per subject, (2) Plans checkout add-on row with server validation, (3) offer moments from `13` section 4 in order (results screen, post-purchase, mistakes), (4) CS lessons built subject by subject with owner review, Aptitude last. Future features list: [`docs/study-materials/14-FUTURE-FEATURES.md`](docs/study-materials/14-FUTURE-FEATURES.md)
- [ ] Answer the owner: how much effort to move the repo to a renyxera@gmail.com GitHub account (options: rename + add email; organization; new personal account), see the reply of 31 Oct; the remote uses the SSH alias `github-personal`
- [x] 31 Oct: **Supabase Advisors fixed with migration `0044_advisor_fixes.sql` (applied by the owner; verified from outside with `npm run check:rpc` and `npm run check:rls`)**: 15 slow-policy warnings (`auth.uid()` now `(select auth.uid())`), 2 mutable search paths, and signed-out/signed-in access to SECURITY DEFINER functions (signed-out visitors now denied `mock_paper`, `mock_my_result` and every private function; any signed-in user denied `account_tier` and the trigger functions). Kept on purpose: the six public-leaderboard functions for visitors, and the self-scoped functions signed-in users call (my_referral_code, claim_referral, change_my_branch, ...). Those remaining "signed-in can execute" warnings are accepted by design (each reads or writes only the caller's own rows). Live site re-checked after: 11 screens clean. Open: owner to click Refresh in both Advisors and send what remains
- [x] 31 Oct: manifest fixed ("GATE CSE" removed): new name/description, maskable icons, 5 screenshots, 5 shortcuts, `orientation: any`, categories, launch handler (R17-M1 mostly done; not done: window-controls-overlay styling, share target, taskbar badge)
- [x] 31 Oct: mobile app plan written: [`docs/roadmap/R24-MOBILE-APP.md`](docs/roadmap/R24-MOBILE-APP.md) (PWA first, Play via TWA when funded, iPhone stays PWA, native wrapper only for photo doubts/widgets). Next: install prompt moments, iPhone Add-to-Home-Screen card, web push, phone single-screen audit
- [ ] Exam results screen single-screen fix (ring and tiles now follow the window height) and dark-mode outline softening: built, being tested
- [x] 7 Nov: **Lunar Glass UI overhaul started on branch `feature/lunar-glass-ui` (not live)**: left floating glass dock on desktop (sliding indicator, name flyouts), floating bottom pill on phone, hard-coded indigo/violet/fuchsia utilities remapped to the palette in `app/looks.css`, primary buttons navy, new logo wired in (mark, favicons, app and install icons, Google sign-in logo file, wordmark gradient), research notes folded into the plan. Plan: `docs/design/UIUX-OVERHAUL-PLAN.md`; logo map: `docs/design/LOGO-PLACEMENT-MAP.md`.
- [ ] UI overhaul next: dashboard re-layout (signed-out double hero), profile, Tools tray and command bar, results, Mentor, exam (compact options), design-system gallery; then phone and dark review, lite-effects measurement, and the owner's sign-off before Lunar becomes the default.
- [ ] Owner: upload the new logo to Google (`public/brand/oauth-logo.png`), Razorpay, Telegram, Instagram, YouTube, GitHub (see `docs/design/LOGO-PLACEMENT-MAP.md` part B); send the lockup (mark plus wordmark) if you want the lockup and share images regenerated.
