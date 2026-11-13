# Upcoming releases: R31 to R37 (from the ChatGPT audits, organised by priority)

[← Roadmap index](00-README.md) · [Open items](../open-work/OPEN-ITEMS-2026-11-06.md) · [Checklist](../../checklist.md)

*14 Nov 2026. Sources: `chatgpt/RENYXERA-ADVICE.md` (product audit, 22 features, 16 screen plans, visual system, motion, copy, monetisation, growth, risks, decisions D01 to D28, delivery phases), `chatgpt/RENYXERA_Battles_Claude_Handoff.md` (game modes, scoring, tiers, economy, social, shell, 19 screens, art direction, motion, V1 to V3), the Battles Complete Design Specification PDF, and Claude's own audits [`../battles/PHASE0-AUDIT.md`](../battles/PHASE0-AUDIT.md) and [`../battles/SPEC-REVIEW-1-CHATGPT.md`](../battles/SPEC-REVIEW-1-CHATGPT.md). Every suggestion in those files appears below once, in one release, with its source reference, priority and the skills to use.*

## How to read this

- **Releases** run in order. One release is about one to two weeks of work for the owner plus Claude Code. A release ships when its "Done when" checks pass, not on a date.
- **Modules** group the work inside a release. **Priority:** P0 = must ship in this release; P1 = should ship; P2 = only if time is left; P3 = parked until a decision or a dependency.
- **Ref** points at the source: `A1.3` = advice doc section 1.3, `F14` = advice feature #14, `H10.5` = handoff section 10.5, `D07` = decision register entry, `PA` = Phase 0 audit.
- **Skills** are the Claude Code skills to run for that item. Skills on the "every turn" list below are used on every UI turn as well, whether or not the row repeats them.
- **Owner** = something only the owner can do (migration, key, account, approval). Nothing marked Owner is done by Claude.

### Skills used on every turn (owner requirement)

| When | Skills |
|---|---|
| Any UI change | `interface-design` (app screens) or `frontend-design` + `hallmark` (new screens), `taste-skill`, `unslop`, `design-skills:design-critique` on the screenshots, `design:accessibility-review` / `design-skills:accessibility-audit`, `design-skills:ux-writing` for every string |
| Charts, gauges, stat tiles | `dataviz` |
| Motion | `design-skills:interaction-design` (plus the motion tokens in A5.1) |
| Bugs, failing checks | `superpowers:systematic-debugging` |
| Before saying "done" | `superpowers:verification-before-completion` (build, lint, browser on phone + desktop, light + dark) |
| Planning and specs | `product-management:write-spec`, `product-management:roadmap-update`, `superpowers:writing-plans` |
| Growth work | `marketing:campaign-plan`, `marketing:seo-audit`, `marketing:content-creation`, `small-business:social-content-engine`, `product-management:metrics-review` |
| Code review before push | `code-review` (low or medium), `security-review` for billing, auth, RLS, grading |

### Release map

| Release | Theme | Why it is in this place | Status |
|---|---|---|---|
| **R31** | Battles game shell V1 + trust quick wins | Owner's explicit rejection of the current Battles UI (F17, D07); quick wins are under a day each and stop source confusion | **In progress (started 14 Nov)** |
| R32 | Trust infrastructure | Payments, Forge grading, builder truth, privacy: advice "high-trust infrastructure" order (A2.2 end, A9.1) | Not started |
| R33 | First-test funnel and results | Advice puts first-test conversion first (A12 Phase 1, F1, F6, F22) | Not started |
| R34 | Design system: light refresh + Quiet graphite dark | Dark mode rejected repeatedly; advice says prototype on four screens before migrating (A4, A12 Phase 2, D06, D23) | Not started |
| R35 | Battles V2: ranked, quick formats, progression | Needs decisions D08 to D17 and enough players (H4 to H8, H15) | Waiting on decisions |
| R36 | Mentor, revision and Study Materials | A1.6, A1.8, F4, F13, F19, F20; Study Materials needs pack decisions | Not started |
| R37 | Growth, SEO and the March 2027 refresh | A1.12, A1.13, A8, A9.2; content cadence only when it can be kept | Not started |
| Later | After first revenue | Domain, stores, Forge for other branches, Hindi, ESE/PSU (A9.3, D28) | Parked |

---

## R31 · Battles game shell V1 + trust quick wins

**Goal:** clicking Battles enters a full-screen game with its own home, navigation and way out, built on the friends, challenges, live lobby, scoring, Elo, points, coins, clubs and shop that already work. In the same release, ship the quick labels that stop students mistaking where a question or a number comes from.

### Module 31A · Game shell and navigation (P0)
| ID | Item | Ref | Skills |
|---|---|---|---|
| 31A-1 | Full-screen route boundary: Battles screens hide the navbar, dock, banners, footer and challenge pop-ups; Exit to study always visible; back button keeps working | A3.12, H9.1, PA §8.1, F17 | `interface-design`, `frontend-design`, `systematic-debugging` |
| 31A-2 | Game navigation: phone bottom bar (Home, Arena, Social, Profile; Clubs and Shop inside), desktop left rail (Home, Arena, Social, Clubs, Shop, Profile, Exit to study) | H9.2 | `interface-design`, `accessibility-review` |
| 31A-3 | Game tokens in their own scope (`.game-world`), independent of the app's light/dark; art direction from H11 "Circuit Afterhours" by default, "Midnight Circuit" (A3.12e) as the alternative for the owner to compare | H11, A3.12(e), PA §9.2 | `frontend-design`, `hallmark`, `taste-skill`, `unslop` |
| 31A-4 | Launch transition (450 to 600 ms, never blocks the home; reduced motion = fade) | H10.1, H12, A3.12(f) | `interaction-design` |
| 31A-5 | Exit to study confirmation that explains consequences when a match is active | H10.19, A3.12(h) | `ux-writing`, `accessibility-review` |

### Module 31B · Game screens on existing data (P0)
| ID | Item | Ref | Skills |
|---|---|---|---|
| 31B-1 | Game home: player identity strip (avatar, rating, season and days left, coins), Arena summary, play actions, challenge tickets, daily reward | H10.2, A3.12(b)(c) | `interface-design`, `dataviz`, `ux-writing` |
| 31B-2 | Play (mode select): Live friend duel, Async, Scheduled as real; Ranked and Quick shown as "Not open yet", never as working buttons | H10.3, A1.10 fix 2, D07 | `interface-design`, `ux-writing` |
| 31B-3 | Arena: rating, season countdown (IST), weekly and all-time leaderboard, points rules explained | H10.11, H10.13, A1.10 fix 3 | `dataviz`, `interface-design` |
| 31B-4 | Social: friends, presence, requests, invites (reuse FriendsPanel logic) | H10.15, H8.1, H8.2 | `interface-design` |
| 31B-5 | Clubs, Shop/Locker, Profile card, Settings (sound off by default, haptics, reduced motion) | H10.14, H10.16 to H10.18 | `interface-design`, `accessibility-review` |
| 31B-6 | Honest empty states: no friends, no challenges, no club, nothing in the shop owned | A3.12(d), H1.6 | `ux-writing` |

### Module 31C · Match path polish (P1)
| ID | Item | Ref | Skills |
|---|---|---|---|
| 31C-1 | Wire the existing VsScreen into the live lobby start; countdown from the server time (650 ms per number) | H10.5, H10.6, H12, PA §6 | `interaction-design`, `systematic-debugging` |
| 31C-2 | Live strip inside the exam: commit the 13 Nov reposition after a phone + desktop check; opponent progress top on phones, side on desktop | H10.7, A3.12(b) | `verification-before-completion` |
| 31C-3 | Result screen and reward summary that read the server ledger (points, coins, rating change), win / loss / draw variants | H10.9, H10.10, H5.6 | `interface-design`, `dataviz` |
| 31C-4 | Verify live two-player answering end to end with the approved test account | PA §10 | `systematic-debugging`, `verification-before-completion` |

### Module 31D · Trust quick wins (P0 for D-1 to D-4, P1 for the rest)
| ID | Item | Ref | Skills |
|---|---|---|---|
| 31D-1 | Source badges (Official PYQ, Forge original, Spark AI practice, Blend) on builder, exam, results, flashcards | F2, A1.4 fix 2, A1.5 fix 1 | `interface-design`, `ux-writing` |
| 31D-2 | Solution availability label before the panel opens | F3, A1.9 fix 1 | `ux-writing`, `interaction-design` |
| 31D-3 | Per-paper Forge availability ("CS: 329 · EC: not available yet") | F7, A1.4 fix 1 | `ux-writing` |
| 31D-4 | "Saved on this device" on Spark sets and local-only data | F5, A1.5 fix 2 | `interface-design`, `accessibility-audit` |
| 31D-5 | Analytics sample-size and "updated" labels; "early estimate" when the sample is small | F12, A1.7 fix 2, D03 | `dataviz` |
| 31D-6 | "Marking for this question" line in the exam (MCQ negative, MSQ all-or-nothing, NAT range) | A1.1 fix 2 | `ux-writing` |
| 31D-7 | Desktop exam keyboard shortcut help | F9 | `interaction-design`, `accessibility-review` |

**Done when:** Battles opens full screen on a 390 px phone and a 1440 px desktop with no site chrome; every screen has a working way back to study; nothing shows a mode, player or number that the server does not have; build and lint pass; screenshots reviewed with `design-critique` in both sizes; reduced-motion checked.
**Owner:** pick the art direction after seeing both (31A-3); no migration expected in R31.

---

## R32 · Trust infrastructure

| ID | Item | Priority | Ref | Skills |
|---|---|---|---|---|
| 32-1 | Payments: Cashfree account, keys in Worker secrets, sandbox then live test, receipts and webhook checked; checkout hidden with "Payments are being set up" until then | P0 | A1.14 fix 3, A7.5, D20 | `security-review`, `verification-before-completion` |
| 32-2 | "No automatic renewal" beside every price and the checkout button; Free shown first with what stays free | P0 | A1.14 fix 1 and 2, A7.4 | `ux-writing` |
| 32-3 | Forge answers graded by the server inside built tests | P0 | F16, A1.3, D04 | `systematic-debugging`, `write-spec`, `verification-before-completion` |
| 32-4 | Test-builder capability matrix from server availability; impossible combinations disabled with a reason; never swap sources silently | P0 | F14, A1.2 fix 2, A1.3 fix 2 | `write-spec`, `interface-design` |
| 32-5 | Builder split into Scope → Feel → Source with a live summary; advanced controls disclosed progressively | P1 | A1.3 fix 1 and 3, A3.3 | `interaction-design`, `interface-design` |
| 32-6 | Blend presets built from real inventory by paper, topic and scope; in-scope Spark | P1 | F15, A1.2, D05 | `ux-research`, `write-spec` |
| 32-7 | Spark report reasons (wrong answer, ambiguous, wrong topic, bad options) with content hash and model version | P1 | A1.5 fix 3 | `write-spec` |
| 32-8 | Privacy and security: DPDP consent, owner-account 2FA, CSP review, shared rate limits, Sentry alerts | P0 | A9.1 item 6, A10 | `security-review` |
| 32-9 | Battles integrity fixes from the audit: rating update in the same transaction as the ledger; ranked must not reveal the question set before start; owner progress validated | P1 | PA §7 | `security-review`, `systematic-debugging` |

**Owner:** Cashfree signup and keys; any migration for 32-3, 32-7, 32-9 (Claude writes the file, owner applies).

---

## R33 · First-test funnel and results

| ID | Item | Priority | Ref | Skills |
|---|---|---|---|---|
| 33-1 | Instrument landing → paper chosen → test started → completed; funnel cohort report | P0 | A12 Phase 1.1, F22, A1.13 fix 1 | `metrics-review`, `dataviz`, `write-spec` |
| 33-2 | UTM naming convention and channel templates | P1 | F6 | `marketing:campaign-plan` |
| 33-3 | Results next-action strip from real data (review wrong answers, add to revision, weakest topic), "Not enough attempts yet" when thin | P0 | F1, A1.1 fix 3, A3.5 | `interface-design`, `ux-writing` |
| 33-4 | "What are you here to do?" entry: Attempt a paper, Practise a topic, Review mistakes | P1 | A1.1 fix 1, A3.1, D01 | `journey-mapping`, `interface-design` |
| 33-5 | Test Centre: one primary "Build a test", task first then eligible sources; empty, error and loading states | P0 | A1.2 fix 1 and 3, F8, A3.2 | `unslop`, `design-critique` |
| 33-6 | Dashboard leads with one recommended action, its reason and effort | P1 | A1.7 fix 1, A3.1 | `interface-design`, `dataviz` |
| 33-7 | Analytics: one full-width chart per phone section with an insight line and a data table | P1 | A1.7 fix 3, A3.10 | `dataviz`, `accessibility-review` |
| 33-8 | Onboarding in three steps or fewer | P1 | A3.16 | `journey-mapping`, `ux-writing` |
| 33-9 | One-click share from result data (consent-based fields only) | P2 | F11, D18 | `interface-design`, `accessibility-audit` |
| 33-10 | Sample PYQ before an account (only if auth allows it safely) | P3 | D02 | `write-spec` |

---

## R34 · Design system: light refresh + Quiet graphite dark

| ID | Item | Priority | Ref | Skills |
|---|---|---|---|---|
| 34-1 | Prototype "Quiet graphite, lifted surfaces" dark on Dashboard, Exam, Results, Analytics; compare with Edge/Midnight/Tinted; owner picks | P0 | A4.3, F18, D06, D23 | `frontend-design`, `unslop`, `design-elevation`, `taste-skill` |
| 34-2 | Remove the coloured top stripe on every panel; desaturated semantic colours; elevation steps | P0 | A1.11 fix 2, A4.3 rules | `design-elevation` |
| 34-3 | Light "Marked paper, measured progress": type-led layouts, one signature visual per screen, pastel as grouping accent | P1 | A4.1, A4.2, A1.11 fix 1 | `taste-skill`, `hallmark`, `interface-design` |
| 34-4 | Motion tokens and inventory; reduced-motion versions; performance budget | P1 | A5 | `interaction-design` |
| 34-5 | The 20 key interface strings and copy rules | P1 | A6 | `ux-writing`, `marketing:brand-review` |
| 34-6 | Navbar and dock: frequent tools visible, rare tools in labelled More; Interview only for allowed accounts | P1 | A1.11 fix 3, A3.15, D24 | `interface-design`, `design-critique` |
| 34-7 | Screen passes: Exam (A3.4), Results and review (A3.5), Mistakes (A3.6), Flashcards (A3.7), Profile (A3.13), Plans (A3.14) | P1 | A3 | per-screen skills listed in A3 (j) |
| 34-8 | QA gate: contrast for each pair in light and dark, 44 px touch targets, focus, reduced motion | P0 | A4.7, A10 | `accessibility-audit` |

**Owner:** pick the dark direction from screenshots (D06, D23).

---

## R35 · Battles V2: ranked, quick formats, progression (needs decisions)

| ID | Item | Priority | Ref | Decision |
|---|---|---|---|---|
| 35-1 | Ranked Arena queue: fixed server-selected set, widening rating range, honest "No opponent is available right now" | P0 once approved | H4.5, A3.12(g), PA §6 | D08, D09 |
| 35-2 | Quick Duel / Quick Clash 5 × 60 s | P1 | H4.6 | D10 |
| 35-3 | GATE-marks tie-break: marks → correct count → time → draw | P1 | H5.1 to H5.3 | spec item 5 |
| 35-4 | Engineering tiers, promotion/demotion, soft season reset | P1 | H6.1 to H6.3 | D12, D13 |
| 35-5 | XP and levels, badges, missions (3 daily, 4 weekly), free season track | P2 | H6.4 to H6.6, H7.3 | D14 |
| 35-6 | Anti-farming: coin cap per day, repeat-opponent limit | P1 | H7.2, A10 | D15 |
| 35-7 | Daily Challenge and Subject Duel | P2 | H4.7, H4.8 | — |
| 35-8 | Emotes (no free chat), share card | P2 | H8.5, D16, D18 | D16 |
| 35-9 | Supabase Realtime channel per match (presence + broadcast), explicit match state machine, integrity events table, reconnect rules | P2 | H9, spec §11, PA §6 | — |
| 35-10 | Practice bots, labelled and never rated | P3 | D11 | D11 |
| 35-11 | Club War, tournaments, spectating | P3 | H4.9, H4.10, H8.4, D17 | D17 |
| 35-12 | Mentor boosts inside the game shop or only in the app | P3 | H7.6 | spec item 9 |

---

## R36 · Mentor, revision and Study Materials

| ID | Item | Priority | Ref | Skills |
|---|---|---|---|---|
| 36-1 | Mentor task-first actions: explain a question, make a practice set, review mistakes, plan today | P0 | F19, A1.6 fix 1, A3.8 | `journey-mapping`, `ux-strategy`, `interface-design` |
| 36-2 | Remaining Mentor requests shown; reset time only once the backend confirms it; draft kept at the limit | P0 | F4, A1.6 fix 3, D22 | `ux-writing` |
| 36-3 | Separate official answer, verified solution and AI explanation; name the source question | P0 | A1.6 fix 2, A1.9 fix 2 | `ux-writing` |
| 36-4 | Clear outage and rate-limit states | P1 | A1.6 safeguard | `ux-writing` |
| 36-5 | Solutions structured Key idea / Steps / Why another approach fails / Remember | P1 | A1.9 fix 3 | `ux-writing` |
| 36-6 | Mistake-to-revision flow with due dates | P1 | F13, A3.6 | `journey-mapping`, `interaction-design` |
| 36-7 | Mentor chat upgrades: streaming, photo doubts, weak-topic memory | P2 | A1.6 planned, A3.9 | `write-spec` |
| 36-8 | Study Materials Phase 0 reader (Deadlock sample): sticky section title and contents sheet on phones, rail on desktop, labelled highlights and notes | P1 | F20, A1.8, A3.11 | `frontend-design`, `interaction-design`, `accessibility-audit` |
| 36-9 | Study packs priced and sold | P3 | D19 | owner decision |

---

## R37 · Growth, SEO and the March 2027 refresh

| ID | Item | Priority | Ref | Skills |
|---|---|---|---|---|
| 37-1 | Last-reviewed date, paper, year range and verified count on SEO pages | P0 | F10, A1.12 | `marketing:seo-audit`, `ux-writing` |
| 37-2 | Question pages: practice/full-paper route where it exists | P1 | A1.12 fix 2 | `seo-audit` |
| 37-3 | Telegram: question, later answer reveal, short explanation, tagged practice link | P1 | A1.13 fix 2 | `marketing:content-creation` |
| 37-4 | Instagram setup, one real walkthrough, reused as a YouTube Short | P1 | A1.13 fix 3, D25 | `small-business:social-content-engine`, `youtube` |
| 37-5 | Branch-specific weekly content workflow and the 30-day plan | P1 | F21, A8 | `marketing:campaign-plan` |
| 37-6 | Growth experiments from A8.7 | P2 | A8.7 | `metrics-review` |
| 37-7 | March 2027 refresh: answer keys, marks-to-rank, cut-offs, readiness recalibration (keep the old version), "data updated" note with date | P0 in March | A9.2, D27 | `write-spec` |
| 37-8 | Ad video | P3, ON HOLD | D26 | owner approval |

## Later: after first revenue
Custom domain and branded email; app-store packaging; Forge for EC, EE, ME, CE, DA in verified stages; Hindi with terminology review; ESE/PSU/interview expansion (A9.3, D28).

## Deliberately not planned
Public student chat, a social feed, a paid battle pass, a second currency, AI motivational notifications, another chatbot persona, store packaging before revenue (A2.2 "Do not prioritise yet"); buying coins, loot boxes, wagering (H1.6).

## Decisions the owner still owes (grouped by the release they block)
- **R31:** art direction (Circuit Afterhours vs Midnight Circuit).
- **R32:** Cashfree keys (D20); exact entitlements copy (D21).
- **R33:** dashboard next-action authority (D01); sample PYQ before account (D02).
- **R34:** dark palette and style names (D06, D23); navigation tools (D24).
- **R35:** D08 to D17, tie-break, Mentor boosts in the game shop.
- **R36:** quota reset time (D22); Study Materials content and price (D19).
- **R37:** Instagram/YouTube (D25); ad video (D26).

## Handoff format for every task (from A12)
What changed · Why · What remains · Owner actions · Verification (commands, phone + desktop, light + dark screenshots, keyboard) · Risk (migration, route, plan, billing, RLS, grading).
